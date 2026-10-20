import type { Molecule } from 'openchemlib';
import type { CSSProperties, ReactElement } from 'react';

import { Rectangle } from '../components/Rectangle.tsx';
import { SVG } from '../components/SVG.tsx';
import type { RenderedNode } from '../types/tree.ts';

import { addStyleToSVG, joinSVGs } from './moleculeSvg.ts';

/** What {@link moleculeRenderer} is told besides the node. */
export interface MoleculeRendererOptions<TNode> {
  /**
   * The molecules drawn in a node's box, side by side with a plus sign
   * between them; an empty entry is left out.
   */
  getMolecules: (
    node: TNode,
  ) => ReadonlyArray<Molecule | null | undefined> | null | undefined;
  /**
   * Text drawn over the box.
   * @default the node's `label`
   */
  getTopLabel?: (node: TNode) => string | undefined;
  /**
   * Style of the box, over its default (a black stroke, a white fill) and the
   * node's `style`.
   * @default undefined
   */
  getBoxStyle?: (node: TNode) => Record<string, string | number> | undefined;
  /**
   * Style of a rectangle painted behind one molecule.
   * @default undefined
   */
  getMoleculeStyle?: (
    molecule: Molecule,
    node: TNode,
    index: number,
  ) => Record<string, string | number> | undefined;
  /**
   * Maximum width of a molecule.
   * @default 200
   */
  maxWidth?: number;
  /**
   * Maximum height of a molecule.
   * @default 150
   */
  maxHeight?: number;
  /**
   * Id of the group the node is drawn in, read by the drawing.
   * @default undefined — no id
   */
  getID?: (node: TNode) => string | undefined;
}

/** The fields of a node {@link moleculeRenderer} reads itself. */
interface MoleculeNodeFields {
  label?: string;
  style?: CSSProperties;
}

/** How far the top label, drawn over the box, reaches above it. */
const LABEL_OVERFLOW = 20;

/** What {@link moleculeRenderer} returns for a node. */
type RenderedMolecule = RenderedNode & { element: ReactElement };

/**
 * The type of {@link moleculeRenderer}: typed callbacks when the node type is
 * named, callbacks receiving `any` when the renderer is passed as is.
 */
export interface MoleculeRenderer {
  <TNode>(
    node: TNode,
    options: MoleculeRendererOptions<TNode>,
  ): RenderedMolecule;
  (node: any, options: MoleculeRendererOptions<any>): RenderedMolecule;
}

/**
 * Node renderer for reaction/molecule trees: draw a node's molecule(s) and its
 * top label inside a bordered box, and report the box's measured size, with
 * the room its label takes above the box. Name the node type,
 * `moleculeRenderer<MyNode>`, to have the callbacks of its options typed;
 * without it they receive `any`.
 */
export const moleculeRenderer: MoleculeRenderer = renderMolecules;

function renderMolecules<TNode>(
  node: TNode,
  options: MoleculeRendererOptions<TNode>,
): RenderedMolecule {
  const molecules = getMolecules(node, options);
  const topLabel = getTopLabel(node, options);
  const { style } = node as MoleculeNodeFields;

  const width = Math.max(molecules.width, topLabel.width);
  const height = Math.max(molecules.height, topLabel.height);

  return {
    width,
    height,
    overflow: topLabel.element ? { top: LABEL_OVERFLOW } : undefined,
    element: (
      <g>
        <Rectangle
          width={width}
          height={height}
          style={{
            stroke: 'black',
            fill: 'white',
            ...style,
            ...options.getBoxStyle?.(node),
          }}
        />
        {molecules.element}
        {topLabel.element}
      </g>
    ),
  };
}

function getTopLabel<TNode>(
  node: TNode,
  options: MoleculeRendererOptions<TNode>,
) {
  const label =
    options.getTopLabel?.(node) || (node as MoleculeNodeFields).label;
  if (!label) {
    return { width: 0, height: 0, element: null };
  }
  return {
    width: 200,
    height: 20,
    element: (
      <text
        x={0}
        y={-6}
        textAnchor="start"
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
 * Lay out every molecule of a node side by side, scaling each to fit the size
 * limits; supports reaction nodes that carry several molecules.
 * @param node - The tree node whose molecules are drawn.
 * @param options - Molecule extraction callbacks and per-molecule size limits.
 * @returns The combined drawing with its overall `width` and `height`.
 */
function getMolecules<TNode>(
  node: TNode,
  options: MoleculeRendererOptions<TNode>,
): { width: number; height: number; element: ReactElement | undefined } {
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
    return { width: 0, height: 0, element: undefined };
  }
  const svgs: string[] = [];
  for (const molecule of molecules) {
    if (!molecule) continue;
    const svg = molecule.toSVG(maxWidth, maxHeight, undefined, {
      autoCrop: true,
      autoCropMargin: 10,
      suppressChiralText: true,
    });
    svgs.push(
      getMoleculeStyle
        ? addStyleToSVG(svg, getMoleculeStyle(molecule, node, svgs.length))
        : svg,
    );
  }

  const { svg, width, height } = joinSVGs(svgs);

  return { width, height, element: <SVG svg={svg} /> };
}
