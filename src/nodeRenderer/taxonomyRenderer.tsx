import type { CSSProperties, ReactElement } from 'react';

import { Rectangle } from '../components/Rectangle.tsx';
import type { RenderedNode } from '../types/tree.ts';

/** A node of a taxonomy tree, as {@link taxonomyRenderer} draws it. */
export interface TaxonomyNode {
  /** Name of the taxon, drawn in the box; empty for an unnamed rank. */
  name: string;
  /** Rank of the taxon, drawn over the box's left edge; empty for none. */
  rank: string;
  /**
   * Number drawn over the box's right edge.
   * @default undefined — nothing is drawn
   */
  nbTaxonomies?: number;
  /**
   * Written on the name as its `data-url` attribute.
   * @default undefined
   */
  url?: string;
  /**
   * Style of the box, over its default (a black stroke, a white fill).
   * @default undefined
   */
  style?: CSSProperties;
}

/**
 * Measures a text as the drawing sets it.
 * @param text - The text.
 * @param font - Its CSS font shorthand, e.g. `16px Arial, Helvetica, sans-serif`,
 * which is also what a canvas context's `font` takes.
 * @returns The size of the text, in pixels.
 */
export type MeasureText = (
  text: string,
  font: string,
) => { width: number; height: number };

/** What {@link taxonomyRenderer} is told besides the node. */
export interface TaxonomyRendererOptions {
  /**
   * Measures the taxon names. Give one that does not touch the document — a
   * canvas context's `measureText`, or a width per character on a server.
   * @default measures in a hidden element appended to `document.body`
   */
  measureText?: MeasureText;
  /**
   * Id of the group the node is drawn in, read by the drawing.
   * @default undefined — no id
   */
  getID?: (node: TaxonomyNode) => string | undefined;
}

const FONT_FAMILY = 'Arial, Helvetica, sans-serif';
const MIN_SIZE = { width: 120, height: 20 };
const PADDING = 8;
/** How far the rank and the count, drawn over the box, reach above it. */
const LABEL_OVERFLOW = 20;

/**
 * Node renderer for taxonomy trees: draw the taxon name in a box, its rank
 * over the box's left edge and its number of taxonomies over its right edge,
 * and report the box's measured size.
 * @param node - The taxonomy node to render.
 * @param options - How the names are measured.
 * @returns The node's rendered `element` with its `width`, `height` and the
 * room its labels take above the box.
 */
export function taxonomyRenderer(
  node: TaxonomyNode,
  options: TaxonomyRendererOptions = {},
): RenderedNode & { element: ReactElement } {
  const { measureText = measureTextInDocument } = options;
  const taxonomy = getTaxonomy(node, measureText);
  const label = getLabel(node);

  const width = Math.max(taxonomy.width, label.width);
  const height = Math.max(taxonomy.height, label.height);
  const hasCount = node.nbTaxonomies !== undefined;

  return {
    width,
    height,
    overflow: label.element || hasCount ? { top: LABEL_OVERFLOW } : undefined,
    element: (
      <g>
        <Rectangle
          width={width}
          height={height}
          style={{
            stroke: 'black',
            fill: 'white',
            ...node.style,
          }}
        />
        {label.element}
        {taxonomy.element}
        <text
          x={width}
          y={-5}
          textAnchor="end"
          stroke="none"
          fontSize="14"
          fill="#00008B" // dark blue
          fontStyle="bold"
          fontFamily={FONT_FAMILY}
        >
          {node.nbTaxonomies}
        </text>
      </g>
    ),
  };
}

function getLabel(node: TaxonomyNode) {
  if (node.rank === '') {
    return { width: 0, height: 0, element: null };
  }
  return {
    width: MIN_SIZE.width,
    height: MIN_SIZE.height,
    element: (
      <text
        x={PADDING / 2}
        y={-6}
        textAnchor="start"
        stroke="none"
        fontSize="14"
        fill="grey"
        fontStyle="italic"
        fontFamily={FONT_FAMILY}
      >
        {node.rank}
      </text>
    ),
  };
}

function getTaxonomy(node: TaxonomyNode, measureText: MeasureText) {
  const fontSize = 16;
  if (node.name === '') {
    return { width: 0, height: 0, element: null };
  }

  const measured = measureText(node.name, `${fontSize}px ${FONT_FAMILY}`);
  const textWidth = measured.width + PADDING;
  let width = textWidth;
  let height = measured.height;
  let positionX = PADDING / 2;
  if (height <= MIN_SIZE.height) {
    height = MIN_SIZE.height;
  }
  if (width <= MIN_SIZE.width) {
    width = MIN_SIZE.width;
    positionX = (width - textWidth + PADDING) / 2;
  }

  return {
    width,
    height,
    element: (
      <g height={height} width={width} dominantBaseline="central">
        <text
          x={positionX}
          y={height / 2}
          stroke="none"
          fontSize={fontSize}
          fill="black"
          {...(node.url ? { 'data-url': node.url } : {})}
          fontFamily={FONT_FAMILY}
        >
          {node.name}
        </text>
      </g>
    ),
  };
}

function measureTextInDocument(
  text: string,
  font: string,
): { width: number; height: number } {
  const element = document.createElement('span');
  element.style.font = font;
  element.style.visibility = 'hidden';
  element.style.position = 'absolute';
  element.style.top = '-9999px';
  element.style.left = '-9999px';
  element.textContent = text;
  document.body.append(element);
  const { width, height } = element.getBoundingClientRect();
  element.remove();
  return { width, height };
}
