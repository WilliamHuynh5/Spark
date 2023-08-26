import React from 'react';
import './style.css';

export default function Wave() {
  return (
    <React.Fragment>
      <svg
        viewBox="0 0 120 20"
        style={{
          zIndex: -1,
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
        }}
      >
        <defs>
          <mask id="xxx">
            <circle cx="7" cy="12" r="40" />
          </mask>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                        1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 13 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
          <path
            id="wave"
            d="M 0,10 C 30,10 30,15 60,15 90,15 90,10 120,10 150,10 150,15 180,15 210,15 210,10 240,10 v 28 h -240 z"
          />
        </defs>
        <use id="wave3" className="wave" xlinkHref="#wave" x="0" y="-2"></use>
        <use id="wave2" className="wave" xlinkHref="#wave" x="0" y="0"></use>
      </svg>
    </React.Fragment>
  );
}
