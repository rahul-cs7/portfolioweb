"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; size: number; hue: number };

export default function Cosmos() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let pointerY = 0;
    let stars: Star[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: Math.min(180, Math.floor(width / 6)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1 + 0.25,
        size: Math.random() * 1.4 + 0.2,
        hue: Math.random() > 0.68 ? 185 : 225,
      }));
    };
    const move = (event: PointerEvent) => {
      pointerX = (event.clientX / width - 0.5) * 18;
      pointerY = (event.clientY / height - 0.5) * 14;
    };
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(width * 0.72 + pointerX, height * 0.43 + pointerY, 10, width * 0.72, height * 0.43, width * 0.34);
      glow.addColorStop(0, "rgba(122, 91, 255, .16)");
      glow.addColorStop(.42, "rgba(39, 197, 255, .06)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      stars.forEach((star, index) => {
        const drift = reduced ? 0 : time * 0.000012 * star.z;
        const x = (star.x + Math.sin(drift * 11 + index) * 6 + pointerX * star.z + width) % width;
        const y = (star.y + (reduced ? 0 : time * 0.004 * star.z) + pointerY * star.z) % height;
        const pulse = reduced ? 1 : .72 + Math.sin(time * .0014 + index) * .28;
        context.beginPath();
        context.arc(x, y, star.size * pulse, 0, Math.PI * 2);
        context.fillStyle = `hsla(${star.hue}, 90%, 82%, ${.25 + star.z * .5})`;
        context.fill();
      });
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    draw(0);
    if (reduced) draw(200);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={canvasRef} className="cosmos" aria-hidden="true" />;
}
