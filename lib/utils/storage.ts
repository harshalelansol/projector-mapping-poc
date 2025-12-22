import { ShapeConfig } from "../types/Shape";

export interface ProjectData {
  version: string;
  timestamp: string;
  canvas: {
    width: number;
    height: number;
    gridSize: number;
  };
  calibration: {
    corners: { id: string; x: number; y: number }[];
    projectionMode: boolean;
  };
  shapes: ShapeConfig[];
}

export interface ProjectStep {
  id: string;
  name: string;
  data: ProjectData | null;
  lastModified: string;
}

const STORAGE_KEY = "projector_mapping_steps";

export const storage = {
  getSteps: (): ProjectStep[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getStep: (id: string): ProjectStep | undefined => {
    const steps = storage.getSteps();
    return steps.find((s) => s.id === id);
  },

  addStep: (name: string): ProjectStep => {
    const steps = storage.getSteps();
    const newStep: ProjectStep = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      data: null, // Empty initially
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...steps, newStep]));
    return newStep;
  },

  updateStep: (id: string, data: ProjectData) => {
    const steps = storage.getSteps();
    const index = steps.findIndex((s) => s.id === id);
    if (index !== -1) {
      steps[index] = {
        ...steps[index],
        data,
        lastModified: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
    }
  },

  deleteStep: (id: string) => {
    const steps = storage.getSteps();
    const filtered = steps.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};
