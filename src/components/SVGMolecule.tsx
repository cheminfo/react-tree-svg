import { Molecule } from 'openchemlib';

/**
 * Depict a molecule from its SMILES using OpenChemLib's SVG output.
 * @param props - Molecule props; `smiles` is the structure to draw.
 * @returns The molecule drawing, or null when no valid structure is given.
 */
export function SVGMolecule(props) {
  let molecule;
  if (props.smiles) {
    molecule = Molecule.fromSmiles(props.smiles);
  }
  if (!molecule) return null;

  return (
    <g
      dangerouslySetInnerHTML={{
        __html: molecule.toSVG(200, 150, undefined, {
          autoCrop: true,
          autoCropMargin: 10,
        }),
      }}
    />
  );
}
