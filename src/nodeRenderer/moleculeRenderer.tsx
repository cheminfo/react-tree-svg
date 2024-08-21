import { ReactElement } from 'react';

import { Rectangle } from '../components/Rectangle';
import { SVG } from '../components/SVG';

interface OtherOptions {
  getBoxStyle: (node: any) => Record<string, string | number>;
}

type NodeRendererOptions = GetTopLabelOptions &
  GetMoleculesOptions &
  OtherOptions;

export function moleculeRenderer(
  node,
  nodeRendererOptions: NodeRendererOptions,
): {
  width: number;
  height: number;
  element: ReactElement;
} {
  const molecules = getMolecules(node, nodeRendererOptions);
  const topLabel = getTopLabel(node, nodeRendererOptions);

  const width = Math.max(molecules.width, topLabel.width);
  const height = Math.max(molecules.height, topLabel.height);

  return {
    width,
    height,
    element: (
      <g>
        <Rectangle
          width={width}
          height={height}
          style={{
            ...{ stroke: 'black', fill: 'white' },
            ...(node.style || {}),
            ...(nodeRendererOptions.getBoxStyle?.(node) || {}),
          }}
        />
        {molecules.element}
        {topLabel.element}
      </g>
    ),
  };
}

interface GetTopLabelOptions {
  getTopLabel?: (node: any) => string;
  label?: string;
}

function getTopLabel(node, options: GetTopLabelOptions = {}) {
  const label = options.getTopLabel?.(node) || node.label;
  if (!label) {
    return {
      width: 0,
      height: 0,
      element: null,
    };
  }
  return {
    width: 200,
    height: 20,
    element: (
      <text
        x={0}
        y={-6}
        textAnchor="left"
        stroke="none"
        fontSize="14"
        fill="black"
      >
        {label}
      </text>
    ),
  };
}

interface GetMoleculesOptions {
  /**
   * Maximum width of the molecule
   * @default 200
   */
  maxWidth?: number;
  /**
   * Maximum height of the molecule
   * @default 150
   */
  maxHeight?: number;
  getMolecules: (node: any) => any[];
  getMoleculeStyle: (
    molecule: any,
    node: any,
    index: number,
  ) => Record<string, string | number> | undefined;
}

/**
 * This code is designed to also allow reactions for which we have many molecules
 * @param node
 * @param options
 * @returns
 */
function getMolecules(
  node,
  options: GetMoleculesOptions,
): { width: number; height: number; element: any } {
  const {
    maxWidth = 200,
    maxHeight = 150,
    getMolecules,
    getMoleculeStyle,
  } = options;
  if (!getMolecules) {
    throw new Error('getMolecules is not defined');
  }
  const molecules = getMolecules(node);

  if (!molecules) {
    return {
      width: 0,
      height: 0,
      element: undefined,
    };
  }
  const svgs = molecules
    .filter((molecule) => molecule)
    .map((molecule, index) => {
      const svg = molecule.toSVG(maxWidth, maxHeight, undefined, {
        autoCrop: true,
        autoCropMargin: 10,
        suppressChiralText: true,
      });
      if (getMoleculeStyle) {
        return addStyleToSVG(svg, getMoleculeStyle(molecule, node, index));
      }
      return svg;
    });

  const { svg, width, height } = joinSVGs(svgs);

  return {
    width,
    height,
    element: <SVG svg={svg} />,
  };
}

interface GetPlusOptions {
  size?: number;
  padding?: number;
  strokeWidth?: number;
}

function getPlus(options: GetPlusOptions = {}) {
  const { size = 11, padding = 5, strokeWidth = 2 } = options;
  const x1 = padding + size / 2;
  const y1 = padding;
  const x2 = padding + size / 2;
  const y2 = padding + size;
  return {
    svg:
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgb(0,0,0)" stroke-width="${strokeWidth}"></line>` +
      `<line x1="${y1}" y1="${x1}" x2="${y2}" y2="${x2}" stroke="rgb(0,0,0)" stroke-width="${strokeWidth}"></line>`,
    width: size + padding * 2,
    height: size + padding * 2,
  };
}

function joinSVGs(svgs: string[]) {
  const results: any = [];
  let maxHeight = 0;
  for (const svg of svgs) {
    const size = getSVGViewBox(svg);
    if (results.length) {
      results.push(getPlus());
    }
    results.push({ svg, width: size.width, height: size.height });
    maxHeight = Math.max(maxHeight, size.height);
  }

  let currentWidth = 0;
  for (const result of results) {
    const shiftX = currentWidth;
    const shiftY = (maxHeight - result.height) / 2;
    result.shiftedSVG = `<g transform="translate(${shiftX},${shiftY})">${result.svg}</g>`;
    currentWidth += result.width;
  }

  return {
    width: currentWidth,
    height: maxHeight,
    svg: results.map((result) => result.shiftedSVG).join('\n'),
  };
}

function getSVGViewBox(svg: string): {
  minX: number;
  minY: number;
  width: number;
  height: number;
} {
  const match = svg.match(
    /.*viewBox="(?<minX>-?\d+) (?<minY>-?\d+) (?<width>\d+) (?<height>\d+)".*/,
  );
  if (!match?.groups) {
    throw new Error('ViewBox not found');
  }
  // convert to numbers and return the object
  return {
    minX: Number(match.groups.minX),
    minY: Number(match.groups.minY),
    width: Number(match.groups.width),
    height: Number(match.groups.height),
  } as { minX: number; minY: number; width: number; height: number };
}

function styleObjectToString(style: Record<string, string | number>): string {
  const styleArray: string[] = [];
  for (const property in style) {
    if (Object.hasOwn(style, property)) {
      const kebabCaseProperty = property
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();
      styleArray.push(`${kebabCaseProperty}: ${style[property]}`);
    }
  }
  return styleArray.join('; ');
}

function addStyleToSVG(svg: string, style?: Record<string, string | number>) {
  if (!style) return svg;
  const size = getSVGViewBox(svg);
  const match = svg.match(/<svg.*>/);
  if (!match) {
    throw new Error('SVG tag not found');
  }
  const svgTag = match[0];
  const styleString = styleObjectToString(style);
  const styleRectange = `<rect x="${size.minX}" y="${size.minY}" width="${size.width}" height="${size.height}" style="${styleString}"></rect>`;
  return svg.replace(svgTag, `${svgTag}${styleRectange}`);
}
