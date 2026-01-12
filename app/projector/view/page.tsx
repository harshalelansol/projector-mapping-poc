"use client";

import React, { useState, useEffect } from "react";
import CanvasWrapper from "@/components/canvas/CanvasWrapper";
import ProjectionOverlay from "@/components/ui/ProjectionOverlay";
import { getPerspectiveTransform } from "@/lib/utils/projection";
import { ShapeConfig } from "@/lib/types/Shape";
import { Box, Typography } from "@mui/material";

import { useSearchParams } from "next/navigation";

export default function ProjectorViewPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isGridOnly = mode === "grid";

  const [shapes, setShapes] = useState<ShapeConfig[]>([]);
  const [gridSize, setGridSize] = useState<number>(50);
  const [projectionMode, setProjectionMode] = useState<boolean>(false);
  const [corners, setCorners] = useState<{ id: string; x: number; y: number }[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Initial size
    setWindowSize({ width: globalThis.innerWidth, height: globalThis.innerHeight });

    const handleResize = () => {
        setWindowSize({ width: globalThis.innerWidth, height: globalThis.innerHeight });
    };
    
    globalThis.addEventListener('resize', handleResize);

    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // BroadcastChannel Listener
    const channel = new BroadcastChannel("projector-data");
    
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === "SYNC_STATE") {
         // Payload should contain shapes, corners, gridSize, projectionMode
         if (payload.shapes && !isGridOnly) setShapes(payload.shapes); // Only sync shapes if not grid only
         if (payload.corners) setCorners(payload.corners);
         if (payload.gridSize) setGridSize(payload.gridSize);
         if (payload.projectionMode !== undefined) setProjectionMode(payload.projectionMode);
      } else if (type === "CLOSE") {
          window.close();
      }
    };

    // Request initial state logic could go here if we wanted robust sync on load,
    // but for now relying on sender to update or user to interact.
    // Better: Send a "HI" message.
    channel.postMessage({ type: "VIEWER_READY" });

    // Attempt auto-fullscreen (likely to fail without user gesture, but worth a try)
    // document.documentElement.requestFullscreen().catch(() => {});

    return () => {
      channel.close();
      globalThis.removeEventListener('resize', handleResize);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
      } else {
          document.exitFullscreen();
      }
  };

  // Compute Transform (same as main page)
  const transformStyle =
    corners.length === 4 && windowSize.width > 0
      ? getPerspectiveTransform(windowSize.width, windowSize.height, corners)
      : "none";

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "black",
        cursor: isFullscreen ? "none" : "default" // Hide cursor in fullscreen
      }}
      onClick={!isFullscreen ? toggleFullscreen : undefined}
    >
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
            shapes={isGridOnly ? [] : shapes} // Force empty shapes in grid mode
            selectedIds={[]} // No selection in view mode
            onSelect={() => {}} // No op
            onChange={() => {}} // No op
            width={windowSize.width}
            height={windowSize.height}
            gridEnabled={isGridOnly ? true : !projectionMode} 
            gridSize={gridSize}
            readOnly={true}
          />
        )}
      </Box>

      {/* Projection Overlay (Passive Border) - Hide in Grid Only mode */}
       {!isGridOnly && windowSize.width > 0 && corners.length === 4 && (
        <ProjectionOverlay
          corners={corners}
          setCorners={() => {}} // Read-only
          width={windowSize.width}
          height={windowSize.height}
          readOnly={true} // Always read-only in this view
        />
      )}


      {/* Fullscreen Prompt */}
      {!isFullscreen && (
          <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.8)',
                zIndex: 9999,
                color: 'white',
                flexDirection: 'column',
                gap: 2
            }}
          >
              <Box sx={{ p: 4, border: '1px solid white', borderRadius: 2, cursor: 'pointer', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">Click to Start Projection</Typography>
                  <Typography variant="body1" sx={{ mt: 1, color: '#aaa' }}>(Enters Fullscreen)</Typography>
              </Box>
          </Box>
      )}
    </Box>
  );
}
