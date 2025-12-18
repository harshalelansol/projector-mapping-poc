"use client";

import React from "react";
import { Paper, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import MouseIcon from "@mui/icons-material/Mouse";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DetailsIcon from "@mui/icons-material/Details";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CreateIcon from "@mui/icons-material/Create";

interface ToolbarProps {
  activeTool: string;
  onSelectTool: (tool: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onSelectTool }) => {
  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormat: string | null
  ) => {
    if (newFormat) {
      onSelectTool(newFormat);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        left: 16,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        p: 1,
        borderRadius: 3,
        bgcolor: "rgba(23, 23, 23, 0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <ToggleButtonGroup
        orientation="vertical"
        value={activeTool}
        exclusive
        onChange={handleFormat}
        aria-label="toolbar"
        sx={{
          "& .MuiToggleButton-root": {
            color: "rgba(255, 255, 255, 0.5)",
            "&.Mui-selected": {
              color: "#fff",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
            border: "none",
            marginY: 0.5,
            borderRadius: "8px !important",
          },
        }}
      >
        <Tooltip title="Select (V)" placement="right">
          <ToggleButton value="select" aria-label="select">
            <MouseIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Free Draw (Pen)" placement="right">
          <ToggleButton value="freedraw" aria-label="freedraw">
            <CreateIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Add Text" placement="right">
          <ToggleButton value="text" aria-label="text">
            <TextFieldsIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="Rectangle (R)" placement="right">
          <ToggleButton value="rect" aria-label="rectangle">
            <CropSquareIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Circle (C)" placement="right">
          <ToggleButton value="circle" aria-label="circle">
            <RadioButtonUncheckedIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Polygon (P)" placement="right">
          <ToggleButton value="polygon" aria-label="polygon">
            <DetailsIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Upload Image" placement="right">
          <ToggleButton value="image" aria-label="image">
            <AddPhotoAlternateIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Upload Video" placement="right">
          <ToggleButton value="video" aria-label="video">
            <VideoFileIcon />
          </ToggleButton>
        </Tooltip>

      </ToggleButtonGroup>
    </Paper>
  );
};

export default Toolbar;
