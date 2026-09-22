import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: 'blue' | 'teal' | 'purple' | 'amber';
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 140,
  strokeWidth = 10,
  label = 'Skill Match',
  sublabel,
  colorScheme = 'blue',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (safePercent / 100) * circumference;

  const colorClasses = {
    blue: {
      stroke: 'stroke-blue-600',
      track: 'stroke-blue-100',
      text: 'text-blue-700',
      bg: 'bg-blue-50',
    },
    teal: {
      stroke: 'stroke-teal-600',
      track: 'stroke-teal-100',
      text: 'text-teal-700',
      bg: 'bg-teal-50',
    },
    purple: {
      stroke: 'stroke-purple-600',
      track: 'stroke-purple-100',
      text: 'text-purple-700',
      bg: 'bg-purple-50',
    },
    amber: {
      stroke: 'stroke-amber-600',
      track: 'stroke-amber-100',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
    },
  }[colorScheme];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90 transition-all duration-700 ease-out"
          width={size}
          height={size}
        >
          {/* Background Track */}
          <circle
            className={colorClasses.track}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress Indicator */}
          <circle
            className={`${colorClasses.stroke} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${colorClasses.text}`}>
            {safePercent}%
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        </div>
      </div>
      {sublabel && (
        <p className="text-xs text-slate-500 mt-2 font-medium text-center">
          {sublabel}
        </p>
      )}
    </div>
  );
};
