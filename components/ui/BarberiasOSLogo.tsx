type IsotipoProps = {
  size?: number;
  className?: string;
};

export function BarberiasOSIsotipo({ size = 40, className = "" }: IsotipoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BarberíaOS"
      role="img"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="50" fill="#0A0A0A" />
      {/* Thin gold ring */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.45" />
      {/* Bold "B" letterform */}
      <text
        x="50"
        y="67"
        textAnchor="middle"
        fill="white"
        fontSize="56"
        fontWeight="900"
        fontFamily="'Arial Black', 'Arial Bold', Arial, Helvetica, sans-serif"
      >
        B
      </text>
      {/* Diagonal gold accent stroke — inside the circle boundary */}
      <line
        x1="20"
        y1="80"
        x2="80"
        y2="20"
        stroke="#D4AF37"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
