"use client";

import React, { useRef, useEffect } from "react";
import { Stage, Layer, Transformer, Line, Circle } from "react-konva";
import { ShapeConfig } from "@/lib/types/Shape";
import GridLayer from "./GridLayer";
import AnimatedShape from "./AnimatedShape";
import Konva from "konva";

interface CanvasStageProps {
  shapes: ShapeConfig[];
  selectedIds: string[];
  onSelect: (id: string | null, isMultiSelect: boolean) => void;
  onChange: (newShapes: ShapeConfig[]) => void;
  gridSize: number;
  gridEnabled: boolean;
  width: number;
  height: number;
  onStageClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  drawingShape?: ShapeConfig | null;
  readOnly?: boolean;
}

const CanvasStage: React.FC<CanvasStageProps> = ({
  shapes,
  selectedIds,
  onSelect,
  onChange,
  gridSize,
  gridEnabled,
  width,
  height,
  onStageClick,
  drawingShape,
  readOnly = false,
}) => {
  const stageRef = useRef<Konva.Stage>(null);

  const checkDeselect = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    // If we have a specific stage click handler (for drawing), call it
    if (onStageClick) {
      onStageClick(e as Konva.KonvaEventObject<MouseEvent>);
    }

    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onSelect(null, false);
    }
  };

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={readOnly ? undefined : checkDeselect}
      onTouchStart={readOnly ? undefined : checkDeselect}
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
            onSelect={(e) => {
              if (readOnly) return;
              // Use the event passed from AnimatedShape
              const isMulti = e.evt.ctrlKey || e.evt.metaKey;
              onSelect(shape.id, isMulti);
            }}
            onChange={(newAttrs) => {
               if (readOnly) return;
              const newShapes = shapes.slice();
              newShapes[i] = { ...shape, ...newAttrs };
              onChange(newShapes);
            }}
            draggable={!readOnly}
          />
        ))}

        {/* Temporary Drawing Shape */}
        {!readOnly && drawingShape && (
          <>
            <Line
              points={drawingShape.points || []}
              stroke={drawingShape.stroke}
              strokeWidth={2}
              closed={false}
              dash={[10, 5]}
            />
            {/* Render vertices */}
            {(drawingShape.points || [])
              .reduce<number[][]>((acc, _, i, arr) => {
                if (i % 2 === 0) acc.push([arr[i], arr[i + 1]]);
                return acc;
              }, [])
              .map((point, i) => (
                <Circle
                  key={`vertex-${i}-${point[0]}-${point[1]}`}
                  x={point[0]}
                  y={point[1]}
                  radius={4}
                  fill="yellow"
                  stroke="black"
                  strokeWidth={1}
                />
              ))}
          </>
        )}

        {!readOnly && selectedIds.length > 0 && (
          <TransformerWrapper selectedIds={selectedIds} />
        )}
      </Layer>
    </Stage>
  );
};

// Separate component for Transformer
const TransformerWrapper = ({ selectedIds }: { selectedIds: string[] }) => {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!trRef.current) return;

    const stage = trRef.current.getStage();
    if (!stage) return;

    const selectedNodes: Konva.Node[] = [];
    selectedIds.forEach((id) => {
      // We need to verify AnimatedShape forwards the ref properly.
      // Konva's Transformer needs actual Node objects.
      // AnimatedShape renders shapes (Rect, Circle, Text, Image) which have refs.
      // But we didn't explicitly set IDs on the nodes in AnimatedShape!
      // We need to ensure AnimatedShape passes `id={shape.id}` to the rendered Konva node.
      // Checking AnimatedShape code: `const props: any = { id: shape.id ... }`
      // So yes, `stage.findOne('#' + id)` should work.
      const node = stage.findOne("#" + id);
      if (node) {
        selectedNodes.push(node);
      }
    });

    trRef.current.nodes(selectedNodes);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedIds]);

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
      anchorSize={12}
      padding={5}
      rotateAnchorOffset={30}
    />
  );
};

export default CanvasStage;
