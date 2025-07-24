import React, { useEffect, useRef, useState } from "react";
import cursorImg from "./images/cursor.png";
import "./CustomCursor.css";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Check if cursor is near window boundaries (within 5px of edges)
      const margin = 5;
      const isNearEdge =
        e.clientX <= margin ||
        e.clientX >= window.innerWidth - margin ||
        e.clientY <= margin ||
        e.clientY >= window.innerHeight - margin;

      setIsHidden(isNearEdge);
    };

    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);

    const update = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
      }
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  return (
    <img
      ref={cursorRef}
      src={cursorImg}
      className={`custom-cursor ${isPressed ? "pressed" : ""} ${
        isHidden ? "hidden" : ""
      }`}
      alt="custom cursor"
    />
  );
};

export default CustomCursor;
