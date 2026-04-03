import React from 'react';
import './Chart.css';

const SimpleChart = ({ 
  data = [], 
  type = 'bar',
  height = 200,
  colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f472b6']
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  if (type === 'bar') {
    return (
      <div className="chart-container" style={{ height }}>
        <div className="chart-bars">
          {data.map((item, index) => (
            <div key={index} className="chart-bar-wrapper">
              <div 
                className="chart-bar"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  background: colors[index % colors.length]
                }}
                title={`${item.label}: ${item.value}`}
              >
                <span className="bar-value">{item.value}</span>
              </div>
              <span className="bar-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'line') {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container" style={{ height }}>
        <svg className="line-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon 
            points={`0,100 ${points} 100,100`} 
            fill="url(#chartGradient)" 
          />
          <polyline 
            points={points} 
            fill="none" 
            stroke="#6366f1" 
            strokeWidth="2" 
            vectorEffect="non-scaling-stroke"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 100;
            return (
              <circle 
                key={index}
                cx={x} 
                cy={y} 
                r="2" 
                fill="#6366f1"
              />
            );
          })}
        </svg>
        <div className="chart-labels">
          {data.map((item, index) => (
            <span key={index} className="chart-label">{item.label}</span>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'donut') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="chart-container donut-chart" style={{ height }}>
        <div className="donut-wrapper">
          <svg viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;
              
              const startRad = (startAngle - 90) * (Math.PI / 180);
              const endRad = (startAngle + angle - 90) * (Math.PI / 180);
              
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              const largeArc = angle > 180 ? 1 : 0;
              
              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                />
              );
            })}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          <div className="donut-center">
            <span className="donut-total">{total}</span>
            <span className="donut-label">الإجمالي</span>
          </div>
        </div>
        <div className="donut-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <span 
                className="legend-color" 
                style={{ background: colors[index % colors.length] }}
              />
              <span className="legend-label">{item.label}</span>
              <span className="legend-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SimpleChart;
