import type { ReactElement } from 'react';
import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, test } from 'vitest';

import type { NodeRenderer } from '../index.ts';
import { TreeSvg } from '../index.ts';

import type { SimpleNode } from './fixtures.tsx';
import { boxRenderer, getSimpleTree } from './fixtures.tsx';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function mount() {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  return {
    container,
    render: (element: ReactElement) => act(() => root.render(element)),
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

const focusable: NodeRenderer<SimpleNode, unknown> = (node) => ({
  width: 60,
  height: 20,
  element: <rect width={60} height={20} data-name={node.name} tabIndex={0} />,
});

function insertBefore(getKey?: (node: SimpleNode) => string) {
  const { container, render, unmount } = mount();
  const draw = (tree: SimpleNode[]) =>
    render(<TreeSvg tree={tree} nodeRenderer={focusable} getKey={getKey} />);
  draw([{ name: 'a', children: [{ name: 'c' }] }]);
  const element = container.querySelector<SVGElement>('[data-name="c"]');
  element?.focus();
  draw([{ name: 'a', children: [{ name: 'b' }, { name: 'c' }] }]);
  const result = {
    kept: container.querySelector('[data-name="c"]') === element,
    focused: (document.activeElement as SVGElement | null)?.dataset.name,
  };
  unmount();
  return result;
}

test('with getKey, a node keeps its elements and its focus when a sibling is inserted before it', () => {
  expect(insertBefore((node) => node.name)).toStrictEqual({
    kept: true,
    focused: 'c',
  });
});

test('without getKey, nodes are keyed by position, as before: the focus stays on the element, which now draws another node', () => {
  expect(insertBefore()).toStrictEqual({ kept: false, focused: 'b' });
});

interface Taxon {
  id: string;
  children?: Taxon[];
}

const taxa: Taxon[] = [
  {
    id: 'root',
    children: [{ id: 'left', children: [{ id: 'leaf' }] }, { id: 'right' }],
  },
];

const renderTaxon: NodeRenderer<Taxon, { onToggle: (id: string) => void }> = (
  taxon,
  { onToggle },
) => ({
  width: 50,
  height: 20,
  element: (
    <rect
      data-id={taxon.id}
      width={50}
      height={20}
      onClick={() => onToggle(taxon.id)}
    />
  ),
});

function Expandable() {
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
      nodeRendererOptions={{ onToggle }}
      getKey={(taxon) => taxon.id}
      shouldSkipBranch={(taxon, [parent]) => collapsed.has(parent.id)}
    />
  );
}

test('a branch opens and closes from a React handler in a node drawing', () => {
  const { container, render, unmount } = mount();
  const boxes = () =>
    Array.from(container.querySelectorAll<SVGElement>('[data-id]'));
  const drawn = () => boxes().map((element) => element.dataset.id);
  const click = (id: string) =>
    act(() => {
      boxes()
        .find((element) => element.dataset.id === id)
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  render(<Expandable />);

  expect(drawn()).toStrictEqual(['root', 'left', 'leaf', 'right']);

  click('left');

  expect(drawn()).toStrictEqual(['root', 'left', 'right']);
  expect(container.querySelectorAll('path')).toHaveLength(2);

  click('left');

  expect(drawn()).toStrictEqual(['root', 'left', 'leaf', 'right']);
  expect(container.querySelectorAll('path')).toHaveLength(3);

  unmount();
});

test('the layout is computed again only when the tree, the renderer or the spacing change', () => {
  let calls = 0;
  const counting: NodeRenderer<SimpleNode, unknown> = (
    node,
    options,
    context,
  ) => {
    calls++;
    return boxRenderer(node, options, context);
  };
  const tree = getSimpleTree();
  const { container, render, unmount } = mount();
  render(
    <TreeSvg
      tree={tree}
      nodeRenderer={counting}
      positionOptions={{ spacingHorizontal: 50 }}
    />,
  );

  expect(calls).toBe(7);

  render(
    <TreeSvg
      tree={tree}
      nodeRenderer={counting}
      positionOptions={{ spacingHorizontal: 50 }}
      arrowRendererOptions={{ arrowHead: false }}
    />,
  );

  expect(calls).toBe(7);
  expect(container.querySelector('marker')).toBeNull();

  render(
    <TreeSvg
      tree={tree}
      nodeRenderer={counting}
      positionOptions={{ spacingHorizontal: 60 }}
    />,
  );

  expect(calls).toBe(14);

  render(
    <TreeSvg
      tree={getSimpleTree()}
      nodeRenderer={counting}
      positionOptions={{ spacingHorizontal: 60 }}
    />,
  );

  expect(calls).toBe(21);

  unmount();
});
