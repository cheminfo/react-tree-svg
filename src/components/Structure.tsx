import { SVGMolecule } from './SVGMolecule.tsx';

// https://stackoverflow.com/questions/49058890/how-to-get-a-react-components-size-height-width-before-render

/**
 * Draw a molecule depiction with its text label underneath.
 * @param props - Molecule props (`smiles` and `label`).
 * @param props.smiles - SMILES of the molecule.
 * @param props.label - Text drawn under the molecule.
 * @returns Group containing the molecule SVG and the label text.
 */
export function MoleculeLabel(props: { smiles?: string; label?: string }) {
  return (
    <g>
      <SVGMolecule {...props} />
      <text y="20px">{props.label}</text>
    </g>
  );
}
