import { Rectangle } from '../components/Rectangle';
import { SVG } from '../components/SVG';

export function moleculeRenderer(
  datum,
  options,
): {
  width: number;
  height: number;
  component: any;
} {
  const { masses = [], precision = 5 } = options;
  if (isInRange(masses, datum.mz, precision)) {
    datum.style = {
      fillOpacity: 0.2,
      fill: 'red',
    };
  }

  const molecule = getMolecule(datum, options);
  const label = getLabel(datum);

  const width = Math.max(molecule.width, label.width);
  const height = Math.max(molecule.height, label.height);

  const em = getEMLabel(datum, { width, height });

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
        {label.content}
        {em.content}
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
    width: 200,
    height: 20,
    content: (
      <text
        x={20}
        y={-6}
        textAnchor="middle"
        stroke="none"
        fontSize="14"
        fill="black"
      >
        {datum.label}
      </text>
    ),
  };
}
function getEMLabel(datum, options) {
  const { width, height } = options;
  if (!datum.mz) {
    return {
      width: 0,
      height: 0,
      content: null,
    };
  }
  return {
    width,
    height,
    content: (
      <text y={-6} textAnchor="start" stroke="none" fontSize="14" fill="black">
        {`${datum.mz} m/z`}
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

  if (!molecule) {
    return {
      width: 0,
      height: 0,
      content: undefined,
    };
  }
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

function isInRange(masses: number[], mass: number, precision: number): boolean {
  if (!mass || !masses) {
    return false;
  }
  let massAccuracy = (precision * mass) / 1e6;

  for (const value of masses) {
    if (Math.abs(value - mass) <= massAccuracy) {
      return true;
    }
  }
  return false;
}
