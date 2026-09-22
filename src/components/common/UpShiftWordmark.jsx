import React from 'react';

/**
 * Reusable UpShift brand wordmark with strict structural coloring:
 * "Up"    -> Black (#111111) in light mode / White (#FFFFFF) in dark mode
 * "Shift" -> UpShift Red (#E31B23)
 *
 * @param {'dark' | 'light'} theme - Color scheme ('dark' renders Up as white, 'light' renders Up as black/dark).
 * @param {string} className - Optional container className.
 * @param {object} style - Optional container inline styles.
 * @param {string} upColor - Optional explicit override for Up text color.
 * @param {string} shiftColor - Optional explicit override for Shift text color (default #E31B23).
 */
export default function UpShiftWordmark({
  theme = 'light',
  className = '',
  style = {},
  upColor,
  shiftColor = '#E31B23'
}) {
  const isDark = theme === 'dark';
  const resolvedUpColor = upColor || (isDark ? '#FFFFFF' : '#111111');

  return (
    <span
      className={`upshift-wordmark upshift-wordmark--${theme} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        letterSpacing: '-0.02em',
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        ...style
      }}
    >
      <span
        className="upshift-wordmark__up"
        style={{ color: resolvedUpColor, fontWeight: 'inherit', transition: 'color 200ms ease' }}
      >
        Up
      </span>
      <span
        className="upshift-wordmark__shift"
        style={{ color: shiftColor, fontWeight: 'inherit' }}
      >
        Shift
      </span>
    </span>
  );
}
