import React from "react";

// Lightweight dependency-free SVG line chart to avoid requiring 'recharts'
const data = [
  { name: "Jan", value: 200 },
  { name: "Feb", value: 400 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 350 },
  { name: "May", value: 500 },
  { name: "Jun", value: 250 },
  { name: "Jul", value: 300 },
  { name: "Aug", value: 200 },
  { name: "Sep", value: 400 },
  { name: "Oct", value: 100 },
];

const width = 600;
const height = 240;
const padding = 32;

function buildPoints(dataArray) {
  const max = Math.max(...dataArray.map((d) => d.value));
  const stepX = (width - padding * 2) / Math.max(dataArray.length - 1, 1);
  return dataArray
    .map((d, i) => {
      const x = padding + i * stepX;
      const y = padding + (1 - d.value / max) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

const TotalLeadsChart = () => {
  const points = buildPoints(data);

  return (
    <div className="total-leads-chart" style={{ width: "100%", overflow: "hidden" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: 250, display: "block" }}
        role="img"
        aria-label="Total leads over time"
      >
        {/* X axis line */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#ddd"
          strokeWidth={1}
        />

        {/* Y axis line */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#ddd"
          strokeWidth={1}
        />

        {/* Grid and labels (simple) */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
          const y = padding + t * (height - padding * 2);
          const label = Math.round((1 - t) * Math.max(...data.map((d) => d.value)));
          return (
            <g key={idx}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#f3f3f3"
                strokeWidth={1}
              />
              <text x={6} y={y + 4} fontSize={10} fill="#666">
                {label}
              </text>
            </g>
          );
        })}

        {/* Polyline for data */}
        <polyline
          fill="none"
          stroke="#009879"
          strokeWidth={3}
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {data.map((d, i) => {
          const max = Math.max(...data.map((dd) => dd.value));
          const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);
          const x = padding + i * stepX;
          const y = padding + (1 - d.value / max) * (height - padding * 2);
          return (
            <circle key={d.name} cx={x} cy={y} r={3.5} fill="#fff" stroke="#009879" strokeWidth={2} />
          );
        })}

        {/* X axis labels */}
        {data.map((d, i) => {
          const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);
          const x = padding + i * stepX;
          return (
            <text key={d.name} x={x} y={height - 8} fontSize={10} fill="#333" textAnchor="middle">
              {d.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default TotalLeadsChart;
