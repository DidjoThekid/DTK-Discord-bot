"use client";

import { useEffect, useRef } from "react";

// Traînée lumineuse qui suit le curseur, dessinée sur un canvas plein écran
// posé au-dessus du contenu (pointer-events: none pour ne rien bloquer).
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function handleResize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    type Point = { x: number; y: number; age: number };
    const points: Point[] = [];
    const maxAge = 22;

    function handleMove(e: MouseEvent) {
      points.push({ x: e.clientX, y: e.clientY, age: 0 });
    }
    window.addEventListener("mousemove", handleMove);

    let frameId: number;

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.age++;
        if (p.age > maxAge) {
          points.splice(i, 1);
          continue;
        }

        const t = 1 - p.age / maxAge;
        const radius = 10 * t;

        const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, `rgba(88, 101, 242, ${0.5 * t})`);
        gradient.addColorStop(1, "rgba(88, 101, 242, 0)");

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      frameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
