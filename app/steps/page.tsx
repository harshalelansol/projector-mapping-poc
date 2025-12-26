"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { storage, ProjectStep } from "@/lib/utils/storage";

import { openProjectorWindow } from "@/lib/utils/window";

export default function StepsPage() {
  const router = useRouter();
  const [steps, setSteps] = useState<ProjectStep[]>([]);
  const [open, setOpen] = useState(false);
  const [newStepName, setNewStepName] = useState("");

  useEffect(() => {
    // Load steps on mount
    setSteps(storage.getSteps());
  }, []);

  const handleAddStep = async () => {
    if (!newStepName.trim()) return;
    const step = storage.addStep(newStepName);
    setOpen(false);
    setNewStepName("");
    
    // Open projector window
    await openProjectorWindow("/projector/view");

    // Redirect to editor
    router.push(`/projector?stepId=${step.id}`);
  };

  const handleDeleteStep = (id: string) => {
    if (confirm("Are you sure you want to delete this step?")) {
      storage.deleteStep(id);
      setSteps(storage.getSteps());
    }
  };

  const handleEditStep = async (id: string) => {
    // Open projector window
    await openProjectorWindow("/projector/view");
    
    router.push(`/projector?stepId=${id}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#1e1e1e",
        color: "white",
        p: 4,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, alignItems: "center" }}>
          <Typography variant="h4" fontWeight="bold">
            Projector Steps
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Add Step
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ bgcolor: "#2d2d2d", borderRadius: "12px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#aaa" }}>Step Name</TableCell>
                <TableCell sx={{ color: "#aaa" }}>Last Modified</TableCell>
                <TableCell sx={{ color: "#aaa", textAlign: "right" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {steps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: "center", py: 8, color: "white" }}>
                    <Typography variant="h6" color="textSecondary">
                      No steps found. Add one to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                steps.map((step) => (
                  <TableRow key={step.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row" sx={{ color: "white", fontWeight: "bold" }}>
                      {step.name}
                    </TableCell>
                    <TableCell sx={{ color: "#ccc" }}>
                      {new Date(step.lastModified).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditStep(step.id)} sx={{ color: "#4caf50", mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteStep(step.id)} sx={{ color: "#f44336" }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Step Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: "#333", color: "white" } }}>
          <DialogTitle>Add New Step</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Step Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newStepName}
              onChange={(e) => setNewStepName(e.target.value)}
              sx={{
                input: { color: "white" },
                label: { color: "#aaa" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#777" },
                  "&.Mui-focused fieldset": { borderColor: "#2196f3" },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} sx={{ color: "#aaa" }}>
              Cancel
            </Button>
            <Button onClick={handleAddStep} variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
