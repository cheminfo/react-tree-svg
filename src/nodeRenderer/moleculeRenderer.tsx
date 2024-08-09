import { ReactElement } from 'react';

import { Rectangle } from '../components/Rectangle';
import { SVG } from '../components/SVG';

export function moleculeRenderer(
  node,
  nodeRendererOptions,
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

function getTopLabel(node, options: any = {}) {
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

/**
 * This code is designed to also allow reactions for which we have many molecules
 * @param node
 * @param options
 * @returns
 */
function getMolecules(
  node,
  options: any = {},
): { width: number; height: number; element: any } {
  const { maxWidth = 200, maxHeight = 150, getMolecules } = options;
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
  const svgs = molecules.map((molecule) =>
    molecule.toSVG(maxWidth, maxHeight, undefined, {
      autoCrop: true,
      autoCropMargin: 10,
      suppressChiralText: true,
    }),
  );

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
    const size = getSVGSize(svg);
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

function getSVGSize(svg: string): { width: number; height: number } {
  const match = svg.match(
    /.*width="(?<width>\d+)px".*height="(?<height>\d+)px".*/,
  );
  if (!match) {
    throw new Error('Size not found');
  }
  const size = match.groups;
  if (!size?.width) {
    throw new Error('size.width is not defined');
  }
  if (!size?.height) {
    throw new Error('size.height is not defined');
  }
  return { width: Number(size.width), height: Number(size.height) };
}
