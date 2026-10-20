# react-tree-svg

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

## Introduction

Draw a tree from left to right as one SVG: a box per node, drawn by a node
renderer you choose, and a connector from each parent to each of its children.

Use it as a React component inside your app (`TreeSvg`), as an SVG string
(`render`), or take only the positions and draw the tree yourself
(`layoutTree`).

## Installation

`$ npm i react-tree-svg`

## Usage

A tree is an array of root nodes; each node keeps its children in a
`children` array. Every other field is yours.

### In a React app

```tsx
import { TreeSvg, taxonomyRenderer } from 'react-tree-svg';

const tree = [
  {
    name: 'Bacteria',
    rank: 'superkingdom',
    nbTaxonomies: 3,
    children: [
      { name: 'Streptomyces', rank: 'genus', nbTaxonomies: 2 },
      { name: 'Bacillus', rank: 'genus', nbTaxonomies: 1 },
    ],
  },
];

export function Taxonomy() {
  return (
    <TreeSvg
      tree={tree}
      nodeRenderer={taxonomyRenderer}
      positionOptions={{ spacingHorizontal: 100 }}
    />
  );
}
```

The node drawings are part of your React tree: their handlers, state and focus
behave as anywhere else. The layout is computed again only when `tree`,
`nodeRenderer`, `nodeRendererOptions`, the spacing, `shouldSkipBranch` or
`getKey` change, so keep them stable (`useMemo`, `useCallback`) when the tree is
large.

### As an SVG string

`render(tree, options)` takes the same options as `TreeSvg` and returns the
markup. It renders synchronously into a detached element, so it needs a DOM
(a browser, or jsdom) and cannot run while React is rendering: inside an app,
use `TreeSvg`.

```js
import { Molecule } from 'openchemlib';
import { moleculeRenderer, render } from 'react-tree-svg';

const svg = render(reactionTree, {
  nodeRenderer: moleculeRenderer,
  nodeRendererOptions: {
    getMolecules: (node) =>
      node.molecules.map((molecule) => Molecule.fromIDCode(molecule.idCode)),
    getTopLabel: (node) => node.label,
  },
  arrowRendererOptions: { getLabel: (node) => node.reaction?.label },
  positionOptions: { spacingHorizontal: 150 },
});
```

### An interactive tree: expand and collapse

A collapsed node is a node whose children are skipped. The toggle sits astride
the box's right edge, where the connectors start: connectors are drawn beneath
the boxes, and `overflow` keeps the toggle inside the drawing.

```tsx
import { useState } from 'react';
import type { NodeRenderer } from 'react-tree-svg';
import { TreeSvg } from 'react-tree-svg';

interface Taxon {
  id: string;
  name: string;
  children?: Taxon[];
}

interface TaxonOptions {
  collapsed: ReadonlySet<string>;
  onToggle: (id: string) => void;
}

const renderTaxon: NodeRenderer<Taxon, TaxonOptions> = (taxon, options) => {
  const hasChildren = Boolean(taxon.children?.length);
  const isOpen = !options.collapsed.has(taxon.id);
  return {
    width: 150,
    height: 28,
    overflow: hasChildren ? { right: 10 } : undefined,
    element: (
      <g>
        <rect width={150} height={28} rx={6} fill="white" stroke="#c3cad3" />
        <text x={10} y={14} dominantBaseline="central" fontSize={13}>
          {taxon.name}
        </text>
        {hasChildren && (
          <g
            transform="translate(150 14)"
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            onClick={() => options.onToggle(taxon.id)}
          >
            <circle r={9} fill="white" stroke="#5b6875" />
            <text textAnchor="middle" dominantBaseline="central">
              {isOpen ? '−' : '+'}
            </text>
          </g>
        )}
      </g>
    ),
  };
};

export function TaxonTree({ tree }: { tree: Taxon[] }) {
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());

  function onToggle(id: string) {
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  return (
    <TreeSvg
      tree={tree}
      nodeRenderer={renderTaxon}
      nodeRendererOptions={{ collapsed, onToggle }}
      getKey={(taxon) => taxon.id}
      shouldSkipBranch={(taxon, [parent]) => collapsed.has(parent.id)}
      arrowRendererOptions={{
        arrowHead: false,
        shape: 'elbow',
        className: 'branch',
      }}
    />
  );
}
```

```css
/* The default look is written as attributes, so a class overrides it. */
.branch {
  stroke: #c3cad3;
  stroke-width: 1.5px;
}
```

`getKey` gives each node a stable React key: when a branch opens, the other
nodes keep their elements, and the focused toggle keeps the focus. Without it,
nodes are keyed by their position, as in earlier versions. `demo/Expandable.tsx`
is this example, runnable with `npm run dev`.

### Node renderers

A node renderer is a plain function `(node, options, context)` returning:

| Field      | Meaning                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| `width`    | Width of the node's box; boxes and connectors are placed from it.                                                           |
| `height`   | Height of the node's box.                                                                                                   |
| `element`  | The drawing, its origin at the box's top-left corner.                                                                       |
| `overflow` | Optional `{ top, right, bottom, left }`: how far the drawing reaches outside its box. The drawing's bounds grow to hold it. |

`options` is `nodeRendererOptions` (`{}` when omitted) and `context` is
`{ parent, depth }`. The renderer must not call hooks; the element it returns
may be a component that does.

Two renderers are included:

- `taxonomyRenderer` draws `name` in a box, `rank` and `nbTaxonomies` over it.
  It measures the names in a hidden element of the document; give
  `nodeRendererOptions.measureText(text, font)` to measure them otherwise, for
  instance with a canvas context or a width per character on a server.
- `moleculeRenderer` draws the OpenChemLib molecules `getMolecules(node)`
  returns, with `getTopLabel`, `getBoxStyle`, `getMoleculeStyle`, `maxWidth`
  and `maxHeight`. Its callbacks receive `any`; write
  `nodeRenderer: moleculeRenderer<MyNode>` to have them typed.

### Options

`TreeSvg` props and `render` options:

| Option                 | Default           | Meaning                                                                                                     |
| ---------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| `nodeRenderer`         | —                 | Draws each node, see above.                                                                                 |
| `nodeRendererOptions`  | `{}`              | Passed to the renderer.                                                                                     |
| `positionOptions`      | see below         | `x` (0), `y` (22), `spacingHorizontal` (140), `spacingVertical` (30).                                       |
| `shouldSkipBranch`     | —                 | `(node, parents)` returning true leaves the node and its descendants out; `parents` starts with its parent. |
| `getKey`               | depth-first index | A key unique among the drawn nodes.                                                                         |
| `arrowRendererOptions` | `{}`              | How connectors are drawn, see below.                                                                        |
| `idPrefix`             | from `useId`      | Prefix of the ids in the drawing. Give one per tree when several trees rendered on a server share a page.   |
| `svgProps`             | `{}`              | Props of the `<svg>`: `className`, `width`, `ref`, handlers… A `viewBox` here replaces the computed one.    |

`arrowRendererOptions`:

| Option                                   | Default    | Meaning                                                                                   |
| ---------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| `getLabel(child)`                        | —          | Text drawn along the connector into a child.                                              |
| `horizontalPosition`, `verticalPosition` | `'center'` | Where the label sits.                                                                     |
| `getID(parent, child)`                   | —          | Id of a connector's group.                                                                |
| `arrowHead`                              | `true`     | Whether connectors end with an arrowhead.                                                 |
| `shape`                                  | `'curve'`  | `'curve'`, `'straight'` or `'elbow'`.                                                     |
| `className`                              | —          | Class of every connector's path, or `(child, parent) => className` to pick per connector. |
| `style`                                  | —          | Inline style of the paths, or `(child, parent) => style`.                                 |

Every tree gets its own arrowhead marker, so several trees can share a page.
The head is black whatever the stroke; a rule such as
`.my-tree marker polygon { fill: grey; }` recolours it.

### Laying out without drawing

`layoutTree(tree, options)` takes the layout options (`nodeRenderer`,
`nodeRendererOptions`, `positionOptions`, `shouldSkipBranch`, `getKey`) and
returns:

- `nodes`: every node, depth first, with `node` (your object, never copied),
  `key`, `depth`, `parent`, `children`, `x`, `y`, `width`, `height`, `overflow`
  and `element`;
- `connectors`: every parent-to-child link, with `parent`, `child`, `from` and
  `to`;
- `bounds`: the `{ x, y, width, height }` the drawing shows, overflow included.

Use it to know the size of a drawing before showing it, or to draw the tree
your own way, for instance with transitions.

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/react-tree-svg.svg
[npm-url]: https://www.npmjs.com/package/react-tree-svg
[ci-image]: https://github.com/cheminfo/react-tree-svg/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/react-tree-svg/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/react-tree-svg.svg
[codecov-url]: https://codecov.io/gh/cheminfo/react-tree-svg
[download-image]: https://img.shields.io/npm/dm/react-tree-svg.svg
[download-url]: https://www.npmjs.com/package/react-tree-svg
