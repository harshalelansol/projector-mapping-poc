"use client";

import React, { useRef, useEffect } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import { ShapeConfig } from "@/lib/types/Shape";
import GridLayer from "./GridLayer";
import AnimatedShape from "./AnimatedShape";
import Konva from "konva";

interface CanvasStageProps {
  shapes: ShapeConfig[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (newShapes: ShapeConfig[]) => void;
  gridSize: number;
  gridEnabled: boolean;
  width: number;
  height: number;
}

const CanvasStage: React.FC<CanvasStageProps> = ({
  shapes,
  selectedId,
  onSelect,
  onChange,
  gridSize,
  gridEnabled,
  width,
  height,
}) => {
  const stageRef = useRef<Konva.Stage>(null);

  const checkDeselect = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onSelect(null);
    }
  };

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      ref={stageRef}
      style={{ background: "black" }}
    >
      <GridLayer
        width={width}
        height={height}
        gridSize={gridSize}
        visible={gridEnabled}
      />
      <Layer>
        {shapes.map((shape, i) => (
          <AnimatedShape
            key={shape.id}
            shape={shape}
            onSelect={() => onSelect(shape.id)}
            onChange={(newAttrs) => {
              const newShapes = shapes.slice();
              newShapes[i] = { ...shape, ...newAttrs };
              onChange(newShapes);
            }}
          />
        ))}

        {selectedId && <TransformerWrapper selectedId={selectedId} />}
      </Layer>
    </Stage>
  );
};

// Separate component for Transformer
const TransformerWrapper = ({ selectedId }: { selectedId: string }) => {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!trRef.current) return;

    const stage = trRef.current.getStage();
    if (!stage) return;

    // Try to find by id first (if we attached id to node)
    // In AnimatedShape we passed props.id = shape.id
    // Konva searches by #id
    const node = stage.findOne("#" + selectedId);
    if (node) {
      trRef.current.nodes([node]);
      trRef.current.getLayer()?.batchDraw();
    } else {
      trRef.current.nodes([]);
    }
  }, [selectedId]);

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
      anchorSize={12} // Increased from default 10
      padding={5} // Easier to grab
      rotateAnchorOffset={30} // Move rotation handle further out
    />
  );
};

export default CanvasStage;
