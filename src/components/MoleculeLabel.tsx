import { SVGMolecule } from './SVGMolecule';

// https://stackoverflow.com/questions/49058890/how-to-get-a-react-components-size-height-width-before-render

export function MoleculeLabel(props) {
  return (
    <g>
      <SVGMolecule {...props} />
      <text y="20px">{props.label}</text>
    </g>
  );
}
