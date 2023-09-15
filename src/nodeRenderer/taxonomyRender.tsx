import { ReactElement } from 'react';

import { Rectangle } from '../components/Rectangle';

export function taxonomyRender(
  node,
  nodeRendererOptions = {},
): {
  width: number;
  height: number;
  element: ReactElement;
} {
  if (Object.keys(nodeRendererOptions).length !== 0) {
    throw new Error('This should never happen');
  }
  const minSize = { width: 120, height: 20 };
  const taxonomy = getTaxonomy(node, minSize);
  const label = getLabel(node, minSize);

  const width = Math.max(taxonomy.width, label.width);
  const height = Math.max(taxonomy.height, label.height);
  const nbTaxonomies = getNbTaxonomies(node, width, minSize);

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
          }}
        />
        {label.element}
        {taxonomy.element}
        {nbTaxonomies.element}
      </g>
    ),
  };
}
function getNbTaxonomies(node, width, minSize) {
  return {
    width: minSize.width,
    height: minSize.height,
    element: (
      <text
        x={width}
        y={-5}
        textAnchor="end"
        stroke="none"
        fontSize="14"
        fill="#00008B" // dark blue
        fontStyle={'bold'}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {node.nbTaxonomies}
      </text>
    ),
  };
}

function getLabel(
  node,
  minSize,
  options: { spacingHorizontal?: number; fontSize?: number } = {},
) {
  const { spacingHorizontal } = {
    spacingHorizontal: 8,

    ...options,
  };
  if (node.rank === '') {
    return {
      width: 0,
      height: 0,
      element: null,
    };
  }
  return {
    width: minSize.width,
    height: minSize.height,
    element: (
      <text
        x={spacingHorizontal / 2}
        y={-6}
        textAnchor="start"
        stroke="none"
        fontSize="14"
        fill="grey"
        fontStyle={'italic'}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {node.rank}
      </text>
    ),
  };
}

function getTaxonomy(
  node,
  minSize,
  options: { spacingHorizontal?: number; fontSize?: number } = {},
) {
  const { font, fontSize, spacingHorizontal } = {
    font: 'Arial, Helvetica, sans-serif',
    fontSize: 16,
    spacingHorizontal: 8,
    ...options,
  };
  if (node.name === '') {
    return {
      width: 0,
      height: 0,
      element: null,
    };
  }

  let { width, height } = getStringSize(node.name, {
    font,
    fontSize,
    spacingHorizontal,
  });
  const textWith = width;
  let positionX = spacingHorizontal / 2;
  if (height <= minSize.height) {
    height = minSize.height;
  }
  if (width <= minSize.width) {
    width = minSize.width;
    positionX = (width - textWith + spacingHorizontal) / 2;
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
          fontFamily={font}
        >
          {node.name}
        </text>
      </g>
    ),
  };
}

function getStringSize(
  text: string,
  options: { font?: string; fontSize?: number; spacingHorizontal?: number },
): { width: number; height: number } {
  const {
    font = 'Arial, Helvetica, sans-serif',
    fontSize = 16,
    spacingHorizontal = 8,
  } = options;
  const tempElement = document.createElement('span');
  tempElement.style.font = `${fontSize}px ${font}`;
  tempElement.style.visibility = 'hidden';
  tempElement.style.position = 'absolute';
  tempElement.style.top = '-9999px';
  tempElement.style.left = '-9999px';
  tempElement.textContent = text;

  document.body.appendChild(tempElement);

  const { height, width } = tempElement.getBoundingClientRect();

  document.body.removeChild(tempElement);

  return { width: width + spacingHorizontal, height };
}
