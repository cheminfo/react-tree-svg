import { Rectangle } from '../components/Rectangle';
import { SVG } from '../components/SVG';

export function textRenderer(
  datum,
  options,
): {
  width: number;
  height: number;
  component: any;
} {
  const molecule = getMolecule(datum, options);
  const label = getLabel(datum);

  const width = Math.max(molecule.width, label.width);
  const height = Math.max(molecule.height, label.height);

  return {
    width,
    height,
    component: (
      <g>
        <Rectangle
          width={width}
          height={height}
          style={{
            ...{ stroke: 'black', fill: 'white' },
            ...(datum.style || {}),
          }}
        />
        {molecule.content}
      </g>
    ),
  };
}

function getLabel(datum) {
  if (!datum.label) {
    return {
      width: 0,
      height: 0,
      content: null,
    };
  }
  return {
    width: 100,
    height: 20,
    content: (
      <text stroke="none" fontSize="14" fill="black">
        datum.label
      </text>
    ),
  };
}

function getMolecule(
  datum,
  options: any = {},
): { width: number; height: number; content: any } {
  const { maxWidth = 200, maxHeight = 150, OCL } = options;
  let molecule;
  if (datum.idCode) {
    molecule = OCL.Molecule.fromIDCode(datum.idCode);
  }
  if (datum.smiles) {
    molecule = OCL.Molecule.fromSmiles(datum.smiles);
  }

  if (!molecule)
    return {
      width: 0,
      height: 0,
      content: undefined,
    };
  const svg = molecule.toSVG(maxWidth, maxHeight, undefined, {
    autoCrop: true,
    autoCropMargin: 10,
    suppressChiralText: true,
  });
  const size = getMoleculeSize(svg);
  return {
    width: size.width,
    height: size.height,
    content: <SVG svg={svg} />,
  };
}

function getMoleculeSize(svg: string): { width: number; height: number } {
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
