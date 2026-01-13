'use client';

import React, { useState, useEffect } from 'react';
import CanvasWrapper from '@/components/canvas/CanvasWrapper';
import { ShapeConfig } from '@/lib/types/Shape';
import { Box } from '@mui/material';
import { getPerspectiveTransform } from '@/lib/utils/projection';

export default function LivePage() {
  const [shapes, setShapes] = useState<ShapeConfig[]>([]);
  const [corners, setCorners] = useState<{x:number, y:number}[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Load initial state and listen for updates
  useEffect(() => {
    // Initial load
    const savedShapes = localStorage.getItem('projector_shapes');
    const savedCorners = localStorage.getItem('projector_corners');
    
    if (savedShapes) {
      try {
        setShapes(JSON.parse(savedShapes));
      } catch (e) {
        console.error("Failed to parse shapes", e);
      }
    }
    
    if (savedCorners) {
        try {
            setCorners(JSON.parse(savedCorners));
        } catch(e) { console.error("Failed to parse corners", e); }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'projector_shapes' && e.newValue) {
        setShapes(JSON.parse(e.newValue));
      }
      if (e.key === 'projector_corners' && e.newValue) {
         setCorners(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setWindowSize({ width: w, height: h });
    if (corners.length === 0) {
       setCorners([
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: h },
        { x: 0, y: h }
       ]);
    }
    
    const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [corners.length]);

  // Transform only if valid corners
  const transformStyle = (corners.length === 4 && windowSize.width > 0) 
    ? getPerspectiveTransform(windowSize.width, windowSize.height, corners) 
    : 'none';

  return (
    <Box sx={{ 
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', 
        bgcolor: 'black',
        cursor: 'none' // Hide cursor for projection
    }}>
      <Box sx={{
          width: '100%',
          height: '100%',
          transform: transformStyle,
          transformOrigin: '0 0',
          transition: 'transform 0.1s linear', 
          zIndex: 0,
          position: 'absolute',
          top: 0,
          left: 0,
      }}>
         {windowSize.width > 0 && (
          <CanvasWrapper 
            shapes={shapes}
            selectedIds={[]}
            onSelect={() => {}}
            onChange={() => {}}
            width={windowSize.width}
            height={windowSize.height}
            gridEnabled={true} // grid in live view
            gridSize={50}
            drawingShape={null}
            readOnly={true} // Add readOnly prop support to CanvasWrapper if needed or just imply it by empty handlers
          />
         )}
      </Box>
    </Box>
  );
}
