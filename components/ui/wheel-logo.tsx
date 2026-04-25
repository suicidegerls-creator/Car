interface WheelLogoProps {
  size?: number
  className?: string
}

export function WheelLogo({ size = 40, className = "" }: WheelLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer rim */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
      />
      
      {/* Inner rim detail */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      
      {/* Center hub */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill="currentColor"
      />
      
      {/* Center hole */}
      <circle
        cx="50"
        cy="50"
        r="5"
        fill="var(--background, white)"
      />
      
      {/* Spokes - 5 спиц */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <path
          key={i}
          d={`M 50 50 L ${50 + 34 * Math.cos((angle - 90) * Math.PI / 180)} ${50 + 34 * Math.sin((angle - 90) * Math.PI / 180)}`}
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          style={{
            transformOrigin: '50px 50px',
          }}
        />
      ))}
      
      {/* Spoke end circles (bolt holes effect) */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <circle
          key={`bolt-${i}`}
          cx={50 + 28 * Math.cos((angle - 90) * Math.PI / 180)}
          cy={50 + 28 * Math.sin((angle - 90) * Math.PI / 180)}
          r="4"
          fill="var(--background, white)"
        />
      ))}
    </svg>
  )
}
