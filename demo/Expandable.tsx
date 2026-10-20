import { useState } from 'react';

import { TreeSvg } from '../src/components/TreeSvg.tsx';
import type { NodeRenderer } from '../src/types/tree.ts';

interface Taxon {
  id: string;
  name: string;
  children?: Taxon[];
}

interface TaxonOptions {
  collapsed: ReadonlySet<string>;
  onToggle: (id: string) => void;
}

const taxa: Taxon[] = [
  {
    id: 'cellular',
    name: 'Cellular organisms',
    children: [
      {
        id: 'bacteria',
        name: 'Bacteria',
        children: [
          {
            id: 'actinomycetota',
            name: 'Actinomycetota',
            children: [{ id: 'streptomyces', name: 'Streptomyces' }],
          },
          { id: 'bacillota', name: 'Bacillota' },
        ],
      },
      {
        id: 'eukaryota',
        name: 'Eukaryota',
        children: [
          {
            id: 'fungi',
            name: 'Fungi',
            children: [
              { id: 'aspergillus', name: 'Aspergillus' },
              { id: 'penicillium', name: 'Penicillium' },
            ],
          },
          {
            id: 'viridiplantae',
            name: 'Viridiplantae',
            children: [{ id: 'rosaceae', name: 'Rosaceae' }],
          },
        ],
      },
    ],
  },
];

const WIDTH = 150;
const HEIGHT = 28;
const RADIUS = 9;

// The toggle sits astride the box's right edge, where the connectors start:
// they are drawn beneath the boxes, and `overflow` keeps it inside the drawing.
const renderTaxon: NodeRenderer<Taxon, TaxonOptions> = (taxon, options) => {
  const { collapsed, onToggle } = options;
  const hasChildren = taxon.children !== undefined && taxon.children.length > 0;
  const isCollapsed = collapsed.has(taxon.id);
  return {
    width: WIDTH,
    height: HEIGHT,
    overflow: hasChildren ? { right: RADIUS + 1 } : undefined,
    element: (
      <g>
        <rect
          width={WIDTH}
          height={HEIGHT}
          rx={6}
          fill="white"
          stroke="#c3cad3"
        />
        <text x={10} y={HEIGHT / 2} dominantBaseline="central" fontSize={13}>
          {taxon.name}
        </text>
        {hasChildren && (
          <g
            transform={`translate(${WIDTH} ${HEIGHT / 2})`}
            role="button"
            tabIndex={0}
            aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${taxon.name}`}
            aria-expanded={!isCollapsed}
            style={{ cursor: 'pointer' }}
            onClick={() => onToggle(taxon.id)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              onToggle(taxon.id);
            }}
          >
            <circle r={RADIUS} fill="white" stroke="#5b6875" />
            <path
              d={isCollapsed ? 'M -4 0 H 4 M 0 -4 V 4' : 'M -4 0 H 4'}
              stroke="#5b6875"
              strokeWidth={1.5}
            />
          </g>
        )}
      </g>
    ),
  };
};

/**
 * Demo page: a tree whose branches open and close, kept in React state.
 * @returns The demo view.
 */
export default function Expandable() {
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  function onToggle(id: string) {
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  return (
    <TreeSvg
      tree={taxa}
      nodeRenderer={renderTaxon}
      nodeRendererOptions={{ collapsed, onToggle }}
      getKey={(taxon) => taxon.id}
      shouldSkipBranch={(taxon, [parent]) => collapsed.has(parent.id)}
      positionOptions={{ spacingHorizontal: 40, spacingVertical: 12 }}
      arrowRendererOptions={{
        arrowHead: false,
        shape: 'elbow',
        style: { stroke: '#c3cad3', strokeWidth: 1.5 },
      }}
      svgProps={{ width: 640 }}
    />
  );
}
