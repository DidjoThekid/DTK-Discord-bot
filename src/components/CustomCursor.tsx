"use client";

import { useEffect, useRef } from "react";

const HOVER_SELECTOR = 'button, a, [role="button"], .btn, input[type="submit"]';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const hoverTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = dotRef.current;
    if (!el) return;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    document.body.style.cursor = "none";

    function handleMove(e: MouseEvent) {
      mouse.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", handleMove);

    function handleOver(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(HOVER_SELECTOR);
      hoverTarget.current = target;
    }
    function handleOut(e: MouseEvent) {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !related.closest(HOVER_SELECTOR)) {
        hoverTarget.current = null;
      }
    }
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    let frameId: number;

    function animate() {
      const target = hoverTarget.current;

      if (target && document.contains(target)) {
        const rect = target.getBoundingClientRect();
        const style = getComputedStyle(target);

        pos.current.x += (rect.left - pos.current.x) * 0.35;
        pos.current.y += (rect.top - pos.current.y) * 0.35;

        el!.style.width = `${rect.width}px`;
        el!.style.height = `${rect.height}px`;
        el!.style.borderRadius = style.borderRadius || "9999px";
        el!.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
        el!.style.background = "rgba(88, 101, 242, 0.18)";
        el!.style.border = "2px solid rgba(88, 101, 242, 0.65)";
      } else {
        pos.current.x += (mouse.current.x - 10 - pos.current.x) * 0.2;
        pos.current.y += (mouse.current.y - 10 - pos.current.y) * 0.2;

        el!.style.width = "20px";
        el!.style.height = "20px";
        el!.style.borderRadius = "9999px";
        el!.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
        el!.style.background = "rgba(88, 101, 242, 0.35)";
        el!.style.border = "none";
      }

      frameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        transition: "width 0.2s ease, height 0.2s ease, border-radius 0.2s ease, background 0.2s ease",
        willChange: "transform, width, height",
      }}
    />
  );
}
