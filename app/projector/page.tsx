'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import CanvasWrapper from '@/components/canvas/CanvasWrapper';
import Toolbar from '@/components/ui/Toolbar';
import PropertyPanel from '@/components/ui/PropertyPanel';
import CalibrationPanel from '@/components/ui/CalibrationPanel';
import ProjectionOverlay from '@/components/ui/ProjectionOverlay';
import { getPerspectiveTransform } from '@/lib/utils/projection';
import { ShapeConfig } from '@/lib/types/Shape';
import { Box } from '@mui/material';
import useHistory from '@/hooks/useHistory';

// Polyfill for uuid
const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

export default function ProjectorPage() {
  // Use History Hook for Shapes
  const { 
    state: shapes, 
    setState: setShapes, 
    undo, 
    redo 
  } = useHistory<ShapeConfig[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [gridSize, setGridSize] = useState<number>(50); 
  const [projectionMode, setProjectionMode] = useState<boolean>(false);
  const [corners, setCorners] = useState<{x:number, y:number}[]>([]);

  // Keyboard Shortcuts
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          // Undo/Redo
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
              e.preventDefault();
              undo();
          }
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
              e.preventDefault();
              redo();
          }

          // Delete
          if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
              setShapes(shapes.filter(s => s.id !== selectedId));
              setSelectedId(null);
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, shapes, undo, redo, setShapes]);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setWindowSize({ width: w, height: h });
    setCorners([
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: h },
        { x: 0, y: h }
    ]);
    
    // ... resize logic
    const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddShape = (type: 'rect' | 'circle') => {
    const center = { x: windowSize.width / 2, y: windowSize.height / 2 };
    const newShape: ShapeConfig = {
        id: generateId(),
        type,
        x: center.x - 50,
        y: center.y - 50,
        width: 100,
        height: 100,
        radius: 50,
        fill: '#ffffff',
        stroke: '#ffffff',
        strokeWidth: 2,
        fillEnabled: true,
        strokeEnabled: false,
        opacity: 1,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        animation: 'none',
    };
    // Use setShapes from hook which pushes to history
    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
    setActiveTool('select');
  };

  const handleToolSelect = (tool: string) => {
      setActiveTool(tool);
      if (tool === 'rect') {
          handleAddShape('rect');
      } else if (tool === 'circle') {
          handleAddShape('circle');
      } else if (tool === 'image') {
          fileInputRef.current?.click();
      } else if (tool === 'video') {
         videoInputRef.current?.click();
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'video') => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      let mediaElement: HTMLImageElement | HTMLVideoElement | undefined; 

      if (mediaType === 'image') {
          const img = new Image();
          img.src = url;
          mediaElement = img;
      } else {
          const vid = document.createElement('video');
          vid.src = url;
          vid.muted = true;
          vid.loop = true;
          vid.play();
          // Ensure video plays inline
          vid.setAttribute('playsinline', 'true'); 
          mediaElement = vid;
      }
      
      const center = { x: windowSize.width / 2, y: windowSize.height / 2 };
      const newShape: ShapeConfig = {
        id: generateId(),
        type: 'image', 
        x: center.x - 100,
        y: center.y - 100,
        width: 200,
        height: 200, 
        fill: '#ffffff',
        stroke: '#ffffff',
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
      setSelectedId(newShape.id);
      setActiveTool('select');
      
      // Reset input
      e.target.value = '';
  };

  const handleShapeChange = (key: keyof ShapeConfig, value: any) => {
      if (!selectedId) return;
      setShapes(shapes.map(s => s.id === selectedId ? { ...s, [key]: value } : s));
  };
  
  const selectedShape = shapes.find(s => s.id === selectedId) || null;

  // Compute Transform
  const transformStyle = (corners.length === 4 && windowSize.width > 0) 
    ? getPerspectiveTransform(windowSize.width, windowSize.height, corners) 
    : 'none';

  return (
    <Box sx={{ 
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', 
        bgcolor: 'black' 
    }}>
       {/* Hidden Inputs */}
       <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'image')}
       />
       <input 
          type="file" 
          ref={videoInputRef} 
          style={{ display: 'none' }} 
          accept="video/*"
          onChange={(e) => handleFileChange(e, 'video')}
       />

      {/* Canvas Container */}
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
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={setShapes}
            width={windowSize.width}
            height={windowSize.height}
            gridEnabled={true}
            gridSize={gridSize}
          />
         )}
      </Box>

      {/* UI Elements */}
      {!projectionMode && <Toolbar activeTool={activeTool} onSelectTool={handleToolSelect} />}
      {!projectionMode && <PropertyPanel selectedShape={selectedShape} onChange={handleShapeChange} />}
      
      <CalibrationPanel 
        gridSize={gridSize} 
        setGridSize={setGridSize} 
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
