export default function CeramicBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full -z-10"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="ceramic-pattern"
          x="0"
          y="0"
          width="400"
          height="400"
          patternUnits="userSpaceOnUse"
        >
          {/* Vase 1 */}
          <path
            d="M 80 50 Q 75 60, 75 80 L 75 120 Q 75 135, 85 140 L 95 140 Q 105 135, 105 120 L 105 80 Q 105 60, 100 50 L 100 40 L 80 40 Z"
            fill="none"
            stroke="#c19572"
            strokeWidth="1"
            opacity="0.05"
          />
          
          {/* Bowl 1 */}
          <path
            d="M 250 100 Q 250 120, 270 125 Q 290 120, 290 100 L 285 100 Q 285 115, 270 118 Q 255 115, 255 100 Z"
            fill="none"
            stroke="#c19572"
            strokeWidth="1"
            opacity="0.06"
          />
          
          {/* Vase 2 */}
          <path
            d="M 150 200 L 150 190 Q 145 185, 145 175 L 145 160 Q 145 150, 150 145 Q 155 150, 155 160 L 155 175 Q 155 185, 150 190 L 150 200 Q 145 205, 140 205 L 140 210 L 160 210 L 160 205 Q 155 205, 150 200 Z"
            fill="none"
            stroke="#c19572"
            strokeWidth="1"
            opacity="0.04"
          />
          
          {/* Cup */}
          <path
            d="M 320 250 L 320 280 Q 320 290, 330 292 Q 340 290, 340 280 L 340 250 L 335 250 L 335 280 Q 335 285, 330 286 Q 325 285, 325 280 L 325 250 Z M 341 265 Q 345 265, 345 270 Q 345 275, 341 275"
            fill="none"
            stroke="#c19572"
            strokeWidth="1"
            opacity="0.05"
          />
          
          {/* Small bowl */}
          <path
            d="M 200 320 Q 200 335, 215 340 Q 230 335, 230 320 L 228 320 Q 228 332, 215 336 Q 202 332, 202 320 Z"
            fill="none"
            stroke="#c19572"
            strokeWidth="1"
            opacity="0.06"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ceramic-pattern)" />
    </svg>
  );
}
