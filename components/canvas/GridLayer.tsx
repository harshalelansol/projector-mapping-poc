"use client";

import React from "react";
import { Layer, Line } from "react-konva";

interface GridLayerProps {
  width: number;
  height: number;
  gridSize: number; // pixels per 10cm
  visible: boolean;
}

const GridLayer: React.FC<GridLayerProps> = ({
  width,
  height,
  gridSize,
  visible,
}) => {
  if (!visible) return null;

  const lines = [];

  // Vertical lines
  for (let i = 0; i < width / gridSize; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * gridSize, 0, i * gridSize, height]}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={1}
      />
    );
  }

  // Horizontal lines
  for (let j = 0; j < height / gridSize; j++) {
    lines.push(
      <Line
        key={`h-${j}`}
        points={[0, j * gridSize, width, j * gridSize]}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={1}
      />
    );
  }

  return <Layer listening={false}>{lines}</Layer>;
};

export default GridLayer;
