"use client";

import React from "react";
import { Box } from "@mui/material";
import { GRID_COLOR } from "@/lib/theme";

interface Point {
  id: string;
  x: number;
  y: number;
}

interface ProjectionOverlayProps {
  corners: Point[];
  setCorners: (corners: Point[]) => void;
  width: number;
  height: number;
  readOnly?: boolean;
}

const ProjectionOverlay: React.FC<ProjectionOverlayProps> = ({
  corners,
  setCorners,
  width,
  height,
  readOnly = false,
}) => {
  const handleDrag = (
    index: number,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    if (readOnly) return;
    e.preventDefault();
    const startX =
      "touches" in e ? e.touches[0].clientX : e.clientX;
    const startY =
      "touches" in e ? e.touches[0].clientY : e.clientY;

    // Initial position
    const startPoint = corners[index];

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX =
        "touches" in moveEvent
          ? moveEvent.touches[0].clientX
          : moveEvent.clientX;
      const clientY =
        "touches" in moveEvent
          ? moveEvent.touches[0].clientY
          : moveEvent.clientY;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      const newCorners = [...corners];
      newCorners[index] = {
        ...startPoint, // Preserve ID
        x: startPoint.x + deltaX,
        y: startPoint.y + deltaY,
      };
      setCorners(newCorners);
    };

    const upHandler = () => {
      globalThis.removeEventListener("mousemove", moveHandler);
      globalThis.removeEventListener("touchmove", moveHandler);
      globalThis.removeEventListener("mouseup", upHandler);
      globalThis.removeEventListener("touchend", upHandler);
    };

    globalThis.addEventListener("mousemove", moveHandler);
    globalThis.addEventListener("touchmove", moveHandler);
    globalThis.addEventListener("mouseup", upHandler);
    globalThis.addEventListener("touchend", upHandler);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {/* Draw simple lines between corners for visual guide? */}
      {/* SVG for outline */}
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        <path
          d={`M ${corners[0].x} ${corners[0].y} L ${corners[1].x} ${corners[1].y} L ${corners[2].x} ${corners[2].y} L ${corners[3].x} ${corners[3].y} Z`}
          fill="none"
          stroke={readOnly ? GRID_COLOR : "cyan"}
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>
      {!readOnly && corners.map((corner, i) => (
        <Box
          key={corner.id}
          onMouseDown={(e) => handleDrag(i, e)}
          onTouchStart={(e) => handleDrag(i, e)}
          sx={{
            position: "absolute",
            left: corner.x,
            top: corner.y,
            width: 20,
            height: 20,
            transform: "translate(-50%, -50%)",
            bgcolor: "cyan",
            borderRadius: "12px",
            cursor: "move",
            pointerEvents: "auto",
            border: "2px solid white",
            boxShadow: "0 0 10px cyan",
          }}
        />
      ))}
    </Box>
  );
};

export default ProjectionOverlay;
