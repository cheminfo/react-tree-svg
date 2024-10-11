import { MultilineText } from './MultilineText';

export function Text(props: {
  x: number;
  y: number;
  label: string;
  horizontalPosition: 'left' | 'center' | 'right';
  verticalPosition: 'top' | 'center' | 'bottom';
}) {
  const { x, y, label, verticalPosition, horizontalPosition } = props;
  const transform = `translate(${x},${y})`;

  let textAnchor;
  switch (horizontalPosition) {
    case 'left':
      textAnchor = 'start';
      break;
    case 'center':
      textAnchor = 'middle';
      break;
    case 'right':
      textAnchor = 'end';
      break;
    default:
      textAnchor = 'middle';
  }

  return (
    <>
      <text
        textAnchor={textAnchor}
        transform={transform}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.5em"
        fill="none"
        fontSize="14"
      >
        <MultilineText label={label} verticalPosition={verticalPosition} />
      </text>
      <text
        textAnchor={textAnchor}
        transform={transform}
        stroke="none"
        fontSize="14"
        fill="black"
      >
        <MultilineText label={label} verticalPosition={verticalPosition} />
      </text>
    </>
  );
}
