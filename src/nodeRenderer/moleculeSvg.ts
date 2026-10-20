interface SVGPart {
  svg: string;
  width: number;
  height: number;
}

/**
 * Join molecule SVGs side by side, a plus sign between two of them, each one
 * centred vertically on the tallest.
 * @param svgs - The SVG documents to join, in order.
 * @returns The joined markup with its overall `width` and `height`.
 */
export function joinSVGs(svgs: string[]): SVGPart {
  const parts: SVGPart[] = [];
  let maxHeight = 0;
  for (const svg of svgs) {
    const size = getSVGViewBox(svg);
    if (parts.length > 0) {
      parts.push(getPlus());
    }
    parts.push({ svg, width: size.width, height: size.height });
    maxHeight = Math.max(maxHeight, size.height);
  }

  let currentWidth = 0;
  const shifted: string[] = [];
  for (const part of parts) {
    const shiftX = currentWidth;
    const shiftY = (maxHeight - part.height) / 2;
    shifted.push(
      `<g transform="translate(${shiftX},${shiftY})">${part.svg}</g>`,
    );
    currentWidth += part.width;
  }

  return { width: currentWidth, height: maxHeight, svg: shifted.join('\n') };
}

/**
 * Paint a styled rectangle behind the whole drawing of an SVG document.
 * @param svg - The SVG document.
 * @param style - Style of the rectangle; nothing is added without one.
 * @returns The SVG document with the rectangle first inside its root.
 */
export function addStyleToSVG(
  svg: string,
  style?: Record<string, string | number>,
): string {
  if (!style) return svg;
  const size = getSVGViewBox(svg);
  const match = svg.match(/<svg.*>/);
  if (!match) {
    throw new Error('SVG tag not found');
  }
  const svgTag = match[0];
  const styleString = styleObjectToString(style);
  const styleRectangle = `<rect x="${size.minX}" y="${size.minY}" width="${size.width}" height="${size.height}" style="${styleString}"></rect>`;
  return svg.replace(svgTag, `${svgTag}${styleRectangle}`);
}

interface GetPlusOptions {
  size?: number;
  padding?: number;
  strokeWidth?: number;
}

function getPlus(options: GetPlusOptions = {}): SVGPart {
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
  return {
    minX: Number(match.groups.minX),
    minY: Number(match.groups.minY),
    width: Number(match.groups.width),
    height: Number(match.groups.height),
  };
}

function styleObjectToString(style: Record<string, string | number>): string {
  const styleArray: string[] = [];
  for (const property in style) {
    if (Object.hasOwn(style, property)) {
      const kebabCaseProperty = property
        .replaceAll(/[A-Z]/g, (letter) => `-${letter}`)
        .toLowerCase();
      styleArray.push(`${kebabCaseProperty}: ${style[property]}`);
    }
  }
  return styleArray.join('; ');
}
