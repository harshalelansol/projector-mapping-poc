"use client";

import React from "react";
import {
  Paper,
  Typography,
  Slider,
  Box,
  Switch,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { ShapeConfig, AnimationType } from "@/lib/types/Shape";

interface PropertyPanelProps {
  selectedShapes: ShapeConfig[];
  primaryShape: ShapeConfig | null;
  onChange: (key: keyof ShapeConfig, value: any) => void;
  onDelete: () => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedShapes,
  primaryShape,
  onChange,
  onDelete,
}) => {
  if (!primaryShape) return null;
  const isMulti = selectedShapes.length > 1;

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        right: 16,
        top: 80,
        width: 256,
        p: 2,
        borderRadius: 3,
        bgcolor: "rgba(23, 23, 23, 0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "white",
        zIndex: 100,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: "grey.200" }}
      >
        {isMulti ? `${selectedShapes.length} Items Selected` : "Properties"}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Text Properties - Only if single text shape selected */}
        {!isMulti && primaryShape.type === "text" && (
          <Box>
            <Typography variant="caption" sx={{ color: "grey.400" }}>
              Text Content
            </Typography>
            <input
              type="text"
              value={primaryShape.text || ""}
              onChange={(e) => onChange("text", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "rgba(0,0,0,0.3)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            />
            <Typography variant="caption" sx={{ color: "grey.400" }}>
              Font Family
            </Typography>
            <FormControl fullWidth size="small" sx={{ mt: 0.5, mb: 1 }}>
              <Select
                value={primaryShape.fontFamily || "Arial"}
                onChange={(e) => onChange("fontFamily", e.target.value)}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.4)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.6)",
                  },
                  ".MuiSvgIcon-root": {
                    color: "white",
                  },
                  bgcolor: "rgba(0,0,0,0.3)",
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "rgba(23, 23, 23, 0.95)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      "& .MuiMenuItem-root": {
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                        },
                        "&.Mui-selected": {
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 0.25)",
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="Verdana">Verdana</MenuItem>
                <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                <MenuItem value="Courier New">Courier New</MenuItem>
                <MenuItem value="Georgia">Georgia</MenuItem>
                <MenuItem value="Impact">Impact</MenuItem>
                <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="caption" sx={{ color: "grey.400" }}>
              Font Size
            </Typography>
            <Slider
              value={primaryShape.fontSize || 20}
              min={10}
              max={200}
              onChange={(_, val) => onChange("fontSize", val as number)}
              size="small"
              sx={{ color: "white" }}
            />
          </Box>
        )}

        {/* Fill */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="caption" sx={{ color: "grey.400" }}>
              Fill
            </Typography>
            <Switch
              checked={primaryShape.fillEnabled ?? true}
              onChange={(e) => onChange("fillEnabled", e.target.checked)}
              size="small"
              color="secondary"
            />
          </Box>
          {(primaryShape.fillEnabled ?? true) && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              <Box
                component="input"
                type="color"
                value={primaryShape.fill}
                onChange={(e: any) => onChange("fill", e.target.value)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  border: "none",
                  cursor: "pointer",
                  bgcolor: "transparent",
                  padding: 0,
                }}
              />
              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                {primaryShape.fill}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Stroke / Outline */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="caption" sx={{ color: "grey.400" }}>
              Outline
            </Typography>
            <Switch
              checked={primaryShape.strokeEnabled ?? false}
              onChange={(e) => onChange("strokeEnabled", e.target.checked)}
              size="small"
              color="secondary"
            />
          </Box>
          {(primaryShape.strokeEnabled ?? false) && (
            <Box sx={{ mt: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  component="input"
                  type="color"
                  value={primaryShape.stroke}
                  onChange={(e: any) => onChange("stroke", e.target.value)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    border: "none",
                    cursor: "pointer",
                    bgcolor: "transparent",
                    padding: 0,
                  }}
                />
                <Slider
                  value={primaryShape.strokeWidth}
                  min={1}
                  max={20}
                  onChange={(_, val) => onChange("strokeWidth", val as number)}
                  size="small"
                  sx={{ color: "white", ml: 1, flex: 1 }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Opacity */}
        <Box>
          <Typography variant="caption" sx={{ color: "grey.400" }}>
            Opacity
          </Typography>
          <Slider
            value={primaryShape.opacity}
            min={0}
            max={1}
            step={0.1}
            onChange={(_, val) => onChange("opacity", val as number)}
            size="small"
            sx={{ color: "white" }}
          />
        </Box>

        {/* Animation */}
        <Box>
          <Typography variant="caption" sx={{ color: "grey.400" }}>
            Animation
          </Typography>
          <Typography variant="caption" sx={{ color: "grey.400" }}>
            Animation
          </Typography>
          <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
            <Select
              value={primaryShape.animation || "none"}
              onChange={(e) =>
                onChange("animation", e.target.value as AnimationType)
              }
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.4)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.6)",
                },
                ".MuiSvgIcon-root": {
                  color: "white",
                },
                bgcolor: "rgba(0,0,0,0.3)",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "rgba(23, 23, 23, 0.95)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    "& .MuiMenuItem-root": {
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.25)",
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="blink">Blink</MenuItem>
              <MenuItem value="sparkle">Sparkle</MenuItem>
              <MenuItem value="move">Move</MenuItem>
              <MenuItem value="border-move">Border Move</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Delete Button */}
        <Box
          sx={{ mt: 2, pt: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <button
            onClick={onDelete}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "rgba(255, 68, 68, 0.2)",
              color: "#ff4444",
              border: "1px solid rgba(255, 68, 68, 0.3)",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255, 68, 68, 0.3)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255, 68, 68, 0.2)")
            }
          >
            Delete {isMulti ? "Selected Items" : "Shape"}
          </button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PropertyPanel;
