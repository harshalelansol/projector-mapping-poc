'use client';

import React from 'react';
import { Paper, Typography, Slider, Box, Switch } from '@mui/material';
import { ShapeConfig, AnimationType } from '@/lib/types/Shape';

interface PropertyPanelProps {
  selectedShape: ShapeConfig | null;
  onChange: (key: keyof ShapeConfig, value: any) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedShape, onChange }) => {
  if (!selectedShape) return null;

  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'absolute',
        right: 16,
        top: 80,
        width: 256,
        p: 2,
        borderRadius: 3,
        bgcolor: 'rgba(23, 23, 23, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        zIndex: 100,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'grey.200' }}>Properties</Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Fill */ }
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>Fill</Typography>
                <Switch 
                    checked={selectedShape.fillEnabled ?? true} 
                    onChange={(e) => onChange('fillEnabled', e.target.checked)} 
                    size="small" 
                    color="secondary"
                />
            </Box>
            {(selectedShape.fillEnabled ?? true) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Box 
                        component="input"
                        type="color" 
                        value={selectedShape.fill} 
                        onChange={(e: any) => onChange('fill', e.target.value)}
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            border: 'none',
                            cursor: 'pointer',
                            bgcolor: 'transparent',
                            padding: 0,
                        }}
                    />
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{selectedShape.fill}</Typography>
                </Box>
            )}
        </Box>

        {/* Stroke / Outline */}
        <Box>
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: 'grey.400' }}>Outline</Typography>
                <Switch 
                    checked={selectedShape.strokeEnabled ?? false} 
                    onChange={(e) => onChange('strokeEnabled', e.target.checked)} 
                    size="small" 
                    color="secondary"
                />
            </Box>
             {(selectedShape.strokeEnabled ?? false) && (
                 <Box sx={{ mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box 
                            component="input"
                            type="color" 
                            value={selectedShape.stroke} 
                            onChange={(e: any) => onChange('stroke', e.target.value)}
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                border: 'none',
                                cursor: 'pointer',
                                bgcolor: 'transparent',
                                padding: 0,
                            }}
                        />
                        <Slider 
                            value={selectedShape.strokeWidth} 
                            min={1} 
                            max={20} 
                            onChange={(_, val) => onChange('strokeWidth', val as number)}
                            size="small"
                            sx={{ color: 'white', ml: 1, flex: 1 }}
                        />
                    </Box>
                 </Box>
             )}
        </Box>

        {/* Opacity */}

        {/* Opacity */}
        <Box>
            <Typography variant="caption" sx={{ color: 'grey.400' }}>Opacity</Typography>
            <Slider 
                value={selectedShape.opacity} 
                min={0} 
                max={1} 
                step={0.1}
                onChange={(_, val) => onChange('opacity', val as number)}
                size="small"
                sx={{ color: 'white' }}
            />
        </Box>

        {/* Animation */}
        <Box>
            <Typography variant="caption" sx={{ color: 'grey.400' }}>Animation</Typography>
             <select
                value={selectedShape.animation || 'none'}
                onChange={(e) => onChange('animation', e.target.value as AnimationType)}
                style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                }}
            >
                <option value="none">None</option>
                <option value="blink">Blink</option>
                <option value="sparkle">Sparkle</option>
                <option value="move">Move</option>
                <option value="border-move">Border Move</option>
            </select>
        </Box>
      </Box>
    </Paper>
  );
};

export default PropertyPanel;
