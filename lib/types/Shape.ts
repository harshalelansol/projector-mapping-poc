export type ShapeType =
  | "rect"
  | "circle"
  | "polygon"
  | "freedraw"
  | "image"
  | "text";

export type AnimationType =
  | "none"
  | "blink"
  | "sparkle"
  | "move"
  | "border-move";

export interface ShapeConfig {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  sides?: number; // For regular polygons
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  animation?: AnimationType;
  // For 'move' animation
  path?: { x: number; y: number }[];
  // Media support
  image?: HTMLImageElement | HTMLVideoElement;
  src?: string;
  mediaType?: "image" | "video";
  // Text support
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  // Style flags
  fillEnabled?: boolean;
  strokeEnabled?: boolean;
}

export interface CanvasState {
  shapes: ShapeConfig[];
  selectedId: string | null;
  gridEnabled: boolean;
  gridSize: number; // in pixels, representing 10cm
}
