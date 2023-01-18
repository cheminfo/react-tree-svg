import { Molecule } from "openchemlib/core";

export function SVGMolecule(props) {
  let molecule;
  if (props.smiles) {
    molecule = Molecule.fromSmiles(props.smiles);
  }
  if (!molecule) return null;

  return (
    <g
      dangerouslySetInnerHTML={{
        __html: molecule.toSVG(300, 200, undefined, {
          autoCrop: true,
          autoCropMargin: 10,
        }),
      }}
    />
  );
}
