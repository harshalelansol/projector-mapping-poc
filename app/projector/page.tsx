"use client";

import React, { useState, useEffect, useRef } from "react";
import CanvasWrapper from "@/components/canvas/CanvasWrapper";
import Toolbar from "@/components/ui/Toolbar";
import PropertyPanel from "@/components/ui/PropertyPanel";
import CalibrationPanel from "@/components/ui/CalibrationPanel";
import ProjectionOverlay from "@/components/ui/ProjectionOverlay";
import { getPerspectiveTransform } from "@/lib/utils/projection";
import { ShapeConfig } from "@/lib/types/Shape";
import { Box } from "@mui/material";
import useHistory from "@/hooks/useHistory";

// Polyfill for uuid
const generateId = () => {
  return Math.random().toString(36).slice(2, 9);
};

export default function ProjectorPage() {
  // Use History Hook for Shapes
  const {
    state: shapes,
    setState: setShapes,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<ShapeConfig[]>([]);

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<string>("select");
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Free Draw State
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentPoints, setCurrentPoints] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [gridSize, setGridSize] = useState<number>(50);
  const [projectionMode, setProjectionMode] = useState<boolean>(false);
  const [corners, setCorners] = useState<{ x: number; y: number }[]>([]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return;
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        redo();
      }

      // Finish Drawing (Enter)
      if (e.key === "Enter" && isDrawing) {
        finishDrawing();
      }
      // Cancel Drawing (Esc)
      if (e.key === "Escape" && isDrawing) {
        setIsDrawing(false);
        setCurrentPoints([]);
        setActiveTool("select");
      }

      // Delete

      // Delete
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.length > 0
      ) {
        setShapes(shapes.filter((s) => !selectedIds.includes(s.id)));
        setSelectedIds([]);
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, shapes, undo, redo, setShapes]);

  useEffect(() => {
    const w = globalThis.innerWidth;
    const h = globalThis.innerHeight;
    setWindowSize({ width: w, height: h });
    setCorners([
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: 0, y: h },
    ]);

    // ... resize logic
    const handleResize = () => {
      setWindowSize({ width: globalThis.innerWidth, height: globalThis.innerHeight });
    };
    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, []);

  const handleAddShape = (type: "rect" | "circle" | "text" | "polygon") => {
    const center = { x: windowSize.width / 2, y: windowSize.height / 2 };
    let newShape: ShapeConfig;

    if (type === "text") {
      newShape = {
        id: generateId(),
        type: "text",
        x: center.x - 50,
        y: center.y - 15,
        text: "Visual Logic",
        fontSize: 32,
        fontFamily: "Arial",
        fill: "#ffffff",
        stroke: "#ffffff",
        strokeWidth: 0,
        fillEnabled: true,
        strokeEnabled: false,
        opacity: 1,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        animation: "none",
      };
    } else if (type === "polygon") {
      newShape = {
        id: generateId(),
        type: "polygon",
        x: center.x - 50,
        y: center.y - 50,
        radius: 50,
        sides: 6,
        fill: "#ffffff",
        stroke: "#ffffff",
        strokeWidth: 2,
        fillEnabled: true,
        strokeEnabled: false,
        opacity: 1,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        animation: "none",
      };
    } else {
      newShape = {
        id: generateId(),
        type,
        x: center.x - 50,
        y: center.y - 50,
        width: 100,
        height: 100,
        radius: 50,
        fill: "#ffffff",
        stroke: "#ffffff",
        strokeWidth: 2,
        fillEnabled: true,
        strokeEnabled: false,
        opacity: 1,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        animation: "none",
      };
    }
    // Use setShapes from hook which pushes to history
    setShapes([...shapes, newShape]);
    setSelectedIds([newShape.id]);
    setActiveTool("select");
  };

  const finishDrawing = () => {
    if (currentPoints.length < 6) {
      // Need at least 3 points (6 coords)
      // Not enough points
      setIsDrawing(false);
      setCurrentPoints([]);
      setActiveTool("select");
      return;
    }

    const newShape: ShapeConfig = {
      id: generateId(),
      type: "freedraw",
      x: 0,
      y: 0, // Points are absolute for now
      points: currentPoints,
      fill: "#ffffff",
      stroke: "#ffffff",
      strokeWidth: 2,
      fillEnabled: false, // Default to outline only
      strokeEnabled: true,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      animation: "none",
    };
    setShapes([...shapes, newShape]);
    setSelectedIds([newShape.id]);
    setIsDrawing(false);
    setCurrentPoints([]);
    setActiveTool("select");
  };

  const handleStageClick = (e: any) => {
    if (!isDrawing || activeTool !== "freedraw") return;

    // Get pointer position relative to stage
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (point) {
      // Check if close to start point (to close the loop)
      if (currentPoints.length >= 6) {
        // At least 3 points already
        const startX = currentPoints[0];
        const startY = currentPoints[1];
        const dist = Math.sqrt(
          Math.pow(point.x - startX, 2) + Math.pow(point.y - startY, 2)
        );

        if (dist < 15) {
          finishDrawing();
          return;
        }
      }

      setCurrentPoints([...currentPoints, point.x, point.y]);
    }
  };

  const handleToolSelect = (tool: string) => {
    // If we were drawing and switched tool, cancel drawing
    if (isDrawing && tool !== "freedraw") {
      setIsDrawing(false);
      setCurrentPoints([]);
    }

    setActiveTool(tool);
    if (tool === "rect") {
      handleAddShape("rect");
    } else if (tool === "circle") {
      handleAddShape("circle");
    } else if (tool === "polygon") {
      handleAddShape("polygon");
    } else if (tool === "text") {
      handleAddShape("text");
    } else if (tool === "image") {
      fileInputRef.current?.click();
    } else if (tool === "video") {
      videoInputRef.current?.click();
    } else if (tool === "freedraw") {
      setIsDrawing(true);
      setCurrentPoints([]);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: "image" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    let mediaElement: HTMLImageElement | HTMLVideoElement | undefined;

    if (mediaType === "image") {
      const img = new Image();
      img.src = url;
      mediaElement = img;
    } else {
      const vid = document.createElement("video");
      vid.src = url;
      vid.muted = true;
      vid.loop = true;
      vid.play();
      // Ensure video plays inline
      vid.setAttribute("playsinline", "true");
      mediaElement = vid;
    }

    const center = { x: windowSize.width / 2, y: windowSize.height / 2 };
    const newShape: ShapeConfig = {
      id: generateId(),
      type: "image",
      x: center.x - 100,
      y: center.y - 100,
      width: 200,
      height: 200,
      fill: "#ffffff",
      stroke: "#ffffff",
      strokeWidth: 0,
      fillEnabled: true,
      strokeEnabled: false,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      image: mediaElement,
      mediaType: mediaType,
    };

    setShapes([...shapes, newShape]);
    setSelectedIds([newShape.id]);
    setActiveTool("select");

    // Reset input
    e.target.value = "";
  };

  const handleShapeChange = (key: keyof ShapeConfig, value: any) => {
    if (selectedIds.length === 0) return;
    // Apply change to all selected shapes
    setShapes(
      shapes.map((s) =>
        selectedIds.includes(s.id) ? { ...s, [key]: value } : s
      )
    );
  };

  const handleDeleteSelected = () => {
    setShapes(shapes.filter((s) => !selectedIds.includes(s.id)));
    setSelectedIds([]);
  };

  const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id));
  const primarySelectedShape = selectedShapes.at(-1) || null;

  // Handle selection with modifiers
  const handleSelect = (id: string | null, isMultiSelect: boolean) => {
    if (id === null) {
      // Deselect all
      setSelectedIds([]);
    } else if (isMultiSelect) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((sid) => sid !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      setSelectedIds([id]);
    }
  };

  // Compute Transform
  const transformStyle =
    corners.length === 4 && windowSize.width > 0
      ? getPerspectiveTransform(windowSize.width, windowSize.height, corners)
      : "none";

  // Handle Grid Size Change with Scaling
  const handleGridChange = (newSize: number) => {
    if (newSize === gridSize) return;

    const scale = newSize / gridSize;

    const newShapes = shapes.map((shape) => ({
      ...shape,
      x: shape.x * scale,
      y: shape.y * scale,
      width: shape.width ? shape.width * scale : undefined,
      height: shape.height ? shape.height * scale : undefined,
      radius: shape.radius ? shape.radius * scale : undefined,
      fontSize: shape.fontSize ? shape.fontSize * scale : undefined,
      points: shape.points ? shape.points.map((p) => p * scale) : undefined,
    }));

    setShapes(newShapes);
    setGridSize(newSize);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "black",
      }}
    >
      {/* Hidden Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={(e) => handleFileChange(e, "image")}
      />
      <input
        type="file"
        ref={videoInputRef}
        style={{ display: "none" }}
        accept="video/*"
        onChange={(e) => handleFileChange(e, "video")}
      />

      {/* Canvas Container */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          transform: transformStyle,
          transformOrigin: "0 0",
          transition: "transform 0.1s linear",
          zIndex: 0,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {windowSize.width > 0 && (
          <CanvasWrapper
            shapes={shapes}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onChange={setShapes}
            width={windowSize.width}
            height={windowSize.height}
            gridEnabled={true}
            gridSize={gridSize}
            onStageClick={handleStageClick}
            drawingShape={
              isDrawing
                ? ({
                    id: "temp",
                    type: "freedraw",
                    x: 0,
                    y: 0,
                    points: currentPoints,
                    fill: "transparent",
                    stroke: "yellow", // Highlight internal drawing line
                    strokeWidth: 2,
                    opacity: 0.8,
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1,
                  } as ShapeConfig)
                : null
            }
          />
        )}
      </Box>

      {/* UI Elements */}
      {!projectionMode && (
        <Toolbar
          activeTool={activeTool}
          onSelectTool={handleToolSelect}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      )}
      {!projectionMode && (
        <PropertyPanel
          selectedShapes={selectedShapes}
          primaryShape={primarySelectedShape}
          onChange={handleShapeChange}
          onDelete={handleDeleteSelected}
        />
      )}

      <CalibrationPanel
        gridSize={gridSize}
        setGridSize={handleGridChange}
        projectionMode={projectionMode}
        setProjectionMode={setProjectionMode}
      />

      {windowSize.width > 0 && corners.length === 4 && projectionMode && (
        <ProjectionOverlay
          corners={corners}
          setCorners={setCorners}
          width={windowSize.width}
          height={windowSize.height}
        />
      )}
    </Box>
  );
}
