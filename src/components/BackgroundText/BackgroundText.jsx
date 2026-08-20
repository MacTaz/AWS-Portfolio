import { useState, useEffect, useRef } from 'react';
import './BackgroundText.css';

const ROMAN = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100,  'C'], [90,  'XC'], [50,  'L'], [40,  'XL'],
  [10,   'X'], [9,   'IX'], [5,   'V'], [4,   'IV'], [1, 'I'],
];

function toRoman(n) {
  if (n === 0) return 'O';
  let result = '';
  for (const [val, sym] of ROMAN) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

function BackgroundText() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  const [hovered, setHovered] = useState(false);
  const wrapperRef = useRef(null);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime({ h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Global mouse tracker — highlight when cursor is anywhere on the page
  useEffect(() => {
    const onMove = (e) => {
      setHovered(
        e.clientX >= 0 &&
        e.clientX <= window.innerWidth &&
        e.clientY >= 0 &&
        e.clientY <= window.innerHeight
      );
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const clockStr = `${toRoman(time.h)} · ${toRoman(time.m)} · ${toRoman(time.s)}`;

  return (
    <div
      ref={wrapperRef}
      className={`bg-text-wrapper${hovered ? ' bg-text-hovered' : ''}`}
      aria-hidden="true"
    >
      <span className="bg-text-line">{`luv(sic)`}</span>
      <span className="bg-text-line bg-text-clock">{clockStr}</span>
    </div>
  );
}

export default BackgroundText;

