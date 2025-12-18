"use client";

import React from "react";
import {
  Paper,
  Typography,
  Slider,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";

interface CalibrationPanelProps {
  gridSize: number;
  setGridSize: (size: number) => void;
  projectionMode: boolean;
  setProjectionMode: (enabled: boolean) => void;
}

const CalibrationPanel: React.FC<CalibrationPanelProps> = ({
  gridSize,
  setGridSize,
  projectionMode,
  setProjectionMode,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        left: "50%",
        bottom: 24,
        transform: "translateX(-50%)",
        width: 400,
        p: 2,
        borderRadius: 3,
        bgcolor: "rgba(23, 23, 23, 0.9)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "white",
        zIndex: 20,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          Calibration & Projection
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={projectionMode}
              onChange={(e) => setProjectionMode(e.target.checked)}
              color="secondary"
            />
          }
          label={<Typography variant="caption">Projection Mode</Typography>}
          sx={{ mr: 0 }}
        />
      </Box>

      <Box>
        <Typography variant="caption" sx={{ color: "grey.400" }}>
          Grid Scale (Pixels per 10cm)
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Slider
            value={gridSize}
            min={20}
            max={200}
            onChange={(_, val) => setGridSize(val as number)}
            size="small"
            sx={{ color: "white" }}
          />
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", minWidth: 30 }}
          >
            {Math.round(gridSize)}px
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default CalibrationPanel;
