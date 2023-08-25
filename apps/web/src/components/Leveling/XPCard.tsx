import React, { useEffect } from "react";

function XPCard({
  data,
}: {
  data: {
    background: string;
    progressBarColor: string;
    textColor: string;
    username: string;
    avatar: string;
    status: string;
    overlay: string;
  };
}) {
  const status = {
    online: "#43b581",
    idle: "#faa61a",
    dnd: "#f04747",
    offline: "#747f8d",
  };
  const isValidColor = (value: string) =>
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
  const isValidURL = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch (error) {
      return false;
    }
  };
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="467px"
      height="141px"
      viewBox="0 0 467 141"
    >
      <defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css?family=Poppins');

            @font-face {
                font-family: 'DejaVu';
                src: local('DejaVu'),
                url('https://cdn.jsdelivr.net/npm/dejavu-sans@1.0.0/fonts/dejavu-sans-webfont.ttf');
            }
          `}
        </style>
      </defs>
      {/* Background picture */}
      {isValidURL(data.background) && (
        <pattern
          id="image"
          x="0"
          y="0"
          patternUnits="userSpaceOnUse"
          width="100%"
          height="100%"
        >
          <image xlinkHref={data.background} x="0" y="0" width="100%" />
        </pattern>
      )}
      <rect
        width="100%"
        height="100%"
        rx="3"
        ry="3"
        style={
          isValidColor(data.background)
            ? { fill: data.background }
            : isValidURL(data.background)
            ? { fill: "url(#image)" } // Remplit le rectangle avec l'image
            : {}
        }
      />

      {/* Rounded rectangle in the center */}
      <rect
        y="18"
        x="12"
        rx="3"
        ry="3"
        width="443"
        height="105"
        style={{ fill: data.overlay, opacity: 0.75 }}
      />
      {/* Avatar */}
      <circle r="42" cx="61" cy="71" style={{ fill: "black" }} />
      <circle r="42.5" cx="61" cy="71" style={{ fill: status[data.status] }} />
      {/* Ajustez le rayon ici */}
      <clipPath id="clipCircle">
        <circle r="39.5" cx="61" cy="71" />
      </clipPath>
      <image
        x="21"
        y="31"
        width="80"
        height="80"
        clipPath="url(#clipCircle)"
        xlinkHref={data.avatar}
      />
      {/* Rank and level */}
      <text
        x="321"
        y="50"
        fontFamily="Poppins"
        fontSize="20"
        textAnchor="end"
        stroke={data.textColor}
        strokeWidth="1"
        fill={data.textColor}
      >
        <tspan>LEVEL </tspan>
        <tspan>1</tspan>
      </text>
      <text
        x="441"
        y="50"
        fontFamily="Poppins"
        fontSize="20"
        textAnchor="end"
        stroke={data.textColor}
        strokeWidth="1"
        fill={data.textColor}
      >
        <tspan>RANK </tspan>
        <tspan>1</tspan>
      </text>
      {/* Username + tag */}
      <text x="113" y="83" fontFamily="DejaVu" fontSize="14" fill="white">
        gsopow
      </text>
      {/* Exp points */}
      <text
        x="441"
        y="83"
        fontFamily="Poppins"
        fontSize="15"
        fill={data.textColor}
        textAnchor="end"
      >
        <tspan>50</tspan> <tspan fill={data.progressBarColor}>/ 100</tspan>
      </text>
      {/* Progress bar */}
      <rect
        x="108"
        y="91"
        rx="12"
        ry="12"
        width="338"
        height="20"
        style={{ fill: "black" }}
      />
      <rect
        x="109"
        y="92"
        rx="9"
        ry="9"
        width="336"
        height="18"
        style={{ fill: "#484B4E" }}
      />
      <rect
        x="109"
        y="92"
        rx="9"
        ry="9"
        width="168"
        height="18"
        style={{ fill: data.progressBarColor }}
      />
    </svg>
  );
}

export default XPCard;
