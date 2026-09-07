type NetworkBackgroundProps = {
  theme?: string;
};

export function NetworkBackground({ theme }: NetworkBackgroundProps) {
  const isLight = theme === "light";
  return (
    <div
      aria-hidden="true"
      className={`
        pointer-events-none absolute inset-0 overflow-hidden
        [mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%)]
        ${isLight ? "network-background-light" : ""}
      `}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* =========================================================
            CONNECTIONS
        ========================================================= */}

        <g className="text-connectivity" stroke="currentColor" strokeWidth="1">
          {/* Left network */}
          <path d="M-40 150 L100 115 L220 175 L340 105 L455 155" opacity="0.12" />

          <path d="M100 115 L135 275 L260 315 L340 105" opacity="0.09" />

          <path d="M135 275 L65 405 L205 455 L260 315" opacity="0.1" />

          <path d="M260 315 L385 385 L455 155" opacity="0.08" />

          <path d="M205 455 L360 510 L385 385" opacity="0.07" />

          {/* Center-left connections */}
          <path d="M340 105 L500 70 L595 145" opacity="0.07" />

          <path d="M455 155 L520 250 L595 145" opacity="0.1" />

          <path d="M385 385 L520 250 L650 325" opacity="0.09" />

          {/* Right network */}
          <path d="M595 145 L735 90 L865 145 L1010 85 L1240 125" opacity="0.11" />

          <path d="M735 90 L700 245 L810 300 L865 145" opacity="0.09" />

          <path d="M865 145 L950 230 L1010 85" opacity="0.08" />

          <path d="M950 230 L1080 315 L1240 255" opacity="0.1" />

          <path d="M810 300 L900 410 L1080 315" opacity="0.09" />

          <path d="M900 410 L1035 470 L1150 405" opacity="0.07" />

          {/* Lower connections */}
          <path d="M650 325 L760 410 L900 410" opacity="0.1" />

          <path d="M760 410 L720 535 L850 565" opacity="0.07" />

          <path d="M1035 470 L1110 550 L1240 510" opacity="0.08" />

          {/* Long backbone */}
          <path
            d="M-20 510 L205 455 L360 510 L520 450 L650 325 L810 300 L900 410 L1035 470 L1220 430"
            opacity="0.06"
          />
        </g>

        {/* =========================================================
            SECONDARY CONNECTIONS
        ========================================================= */}

        <g
          className="text-connectivity"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="3 8"
          opacity="0.08"
        >
          <path d="M65 405 L20 330 L100 115" />

          <path d="M360 510 L430 555 L520 450" />

          <path d="M500 70 L545 20 L595 145" />

          <path d="M700 245 L650 325 L520 250" />

          <path d="M1010 85 L1080 20 L1160 70" />

          <path d="M1080 315 L1160 350 L1150 405" />

          <path d="M850 565 L900 410 L1035 470" />
        </g>

        {/* =========================================================
            NODES
        ========================================================= */}

        <g className="text-connectivity" fill="currentColor">
          {/* Main nodes */}
          <circle cx="100" cy="115" r="3" opacity="0.3" />
          <circle cx="260" cy="315" r="3.5" opacity="0.35" />
          <circle cx="340" cy="105" r="3" opacity="0.3" />
          <circle cx="455" cy="155" r="3.5" opacity="0.35" />
          <circle cx="595" cy="145" r="4" opacity="0.4" />
          <circle cx="650" cy="325" r="3.5" opacity="0.35" />
          <circle cx="735" cy="90" r="3" opacity="0.3" />
          <circle cx="810" cy="300" r="4" opacity="0.4" />
          <circle cx="865" cy="145" r="3.5" opacity="0.35" />
          <circle cx="950" cy="230" r="3" opacity="0.3" />
          <circle cx="1035" cy="470" r="3.5" opacity="0.35" />
          <circle cx="1080" cy="315" r="3.5" opacity="0.35" />

          {/* Secondary nodes */}
          <circle cx="65" cy="405" r="2" opacity="0.2" />
          <circle cx="135" cy="275" r="2" opacity="0.2" />
          <circle cx="205" cy="455" r="2" opacity="0.2" />
          <circle cx="385" cy="385" r="2" opacity="0.2" />
          <circle cx="500" cy="70" r="2" opacity="0.2" />
          <circle cx="520" cy="250" r="2" opacity="0.2" />
          <circle cx="700" cy="245" r="2" opacity="0.2" />
          <circle cx="760" cy="410" r="2" opacity="0.2" />
          <circle cx="900" cy="410" r="2" opacity="0.2" />
          <circle cx="1010" cy="85" r="2" opacity="0.2" />
          <circle cx="1150" cy="405" r="2" opacity="0.2" />
        </g>

        {/* =========================================================
            NODE PULSES
        ========================================================= */}

        <g className="text-connectivity" fill="currentColor">
          <circle cx="595" cy="145" r="3" opacity="0.5">
            <animate attributeName="r" values="3;7;3" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" />
          </circle>

          <circle cx="810" cy="300" r="3" opacity="0.45">
            <animate
              attributeName="r"
              values="3;7;3"
              dur="5s"
              begin="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.45;0;0.45"
              dur="5s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="260" cy="315" r="3" opacity="0.4">
            <animate
              attributeName="r"
              values="3;7;3"
              dur="5s"
              begin="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0;0.4"
              dur="5s"
              begin="3s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* =========================================================
            DATA PACKETS
        ========================================================= */}

        <g className="text-connectivity" fill="currentColor">
          {/* Packet 1 */}
          <circle r="2.5">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              path="M-40 150 L100 115 L220 175 L340 105 L455 155"
            />
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0"
              keyTimes="0;0.1;0.85;1"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Packet 2 */}
          <circle r="2.5">
            <animateMotion
              dur="9s"
              begin="2s"
              repeatCount="indefinite"
              path="M595 145 L735 90 L865 145 L1010 85 L1240 125"
            />
            <animate
              attributeName="opacity"
              values="0;0.8;0.8;0"
              keyTimes="0;0.1;0.85;1"
              dur="9s"
              begin="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Packet 3 */}
          <circle r="2.5">
            <animateMotion
              dur="7s"
              begin="4s"
              repeatCount="indefinite"
              path="M65 405 L205 455 L360 510 L520 450 L650 325"
            />
            <animate
              attributeName="opacity"
              values="0;0.75;0.75;0"
              keyTimes="0;0.1;0.85;1"
              dur="7s"
              begin="4s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Packet 4 */}
          <circle r="2">
            <animateMotion
              dur="10s"
              begin="1s"
              repeatCount="indefinite"
              path="M1080 315 L900 410 L760 410 L650 325"
            />
            <animate
              attributeName="opacity"
              values="0;0.7;0.7;0"
              keyTimes="0;0.1;0.85;1"
              dur="10s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      {/* =========================================================
          EDGE FADE
      ========================================================= */}

      {/* <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,background_0%,transparent_12%,transparent_88%,background_100%)]
        "
      />

      <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_bottom,background_0%,transparent_15%,transparent_85%,background_100%)]
        "
      /> */}
    </div>
  );
}
