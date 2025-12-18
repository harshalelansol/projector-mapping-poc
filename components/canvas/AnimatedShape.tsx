"use client";

import React, { useRef, useEffect } from "react";
import { Rect, Circle, Text, RegularPolygon, Line, Image as KonvaImage } from "react-konva";
import { ShapeConfig } from "@/lib/types/Shape";
import Konva from "konva";

interface AnimatedShapeProps {
  shape: ShapeConfig;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onChange: (newAttrs: Partial<ShapeConfig>) => void;
}

const AnimatedShape: React.FC<AnimatedShapeProps> = ({
  shape,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef<Konva.Shape>(null);

  // Common props
  const props: any = {
    id: shape.id,
    x: shape.x,
    y: shape.y,
    fill: shape.fillEnabled ?? true ? shape.fill : undefined,
    stroke: shape.strokeEnabled ?? false ? shape.stroke : undefined,
    strokeWidth: shape.strokeEnabled ?? false ? shape.strokeWidth || 0 : 0,
    rotation: shape.rotation,
    scaleX: shape.scaleX,
    scaleY: shape.scaleY,
    draggable: true,
    // Avoid passing opacity if blinking, let Tween control it.
    opacity:
      shape.animation === "blink" || shape.animation === "sparkle"
        ? undefined
        : shape.opacity,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      onChange({
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      onChange({
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      });
    },
  };

  useEffect(() => {
    const node = shapeRef.current;
    if (!node) return;

    // Stop existing animations
    // node.getStage()?.find('Tween').forEach(t => t.destroy());
    // Tweens are attached to node usually?
    // Konva.Tween doesn't inherently attach to node for lookup.
    // Ideally we track the active tween in a ref.

    // Cleanup previous tweens/animations on effect re-run (which happens on animation change)
    // But local variables 'anim'/'tween' are lost if we don't return cleanup function.
    // The cleanup function below handles it using closure variables 'anim'/'tween'.

    let anim: Konva.Animation | null = null;
    let tween: Konva.Tween | null = null;

    if (shape.animation === "blink") {
      tween = new Konva.Tween({
        node: node,
        duration: 0.5,
        opacity: 0.2,
        yoyo: true,
        easing: Konva.Easings.EaseInOut,
      });
      tween.play();
    } else if (shape.animation === "sparkle") {
      anim = new Konva.Animation((frame) => {
        if (!frame) return;
        // Random opacity flicker
        if (frame.time % 200 < 50) {
          node.opacity(Math.random() * 0.5 + 0.5);
        }
      }, node.getLayer());
      anim.start();
    } else if (shape.animation === "border-move") {
      // Use shape's stroke color or fallback to white if undefined
      node.stroke(shape.stroke || "white");
      // Ensure stroke width is visible for animation
      node.strokeWidth(shape.strokeWidth || 4);
      node.dash([15, 10]);

      anim = new Konva.Animation((frame) => {
        if (!frame) return;
        const offset = (frame.time * 0.05) % 25;
        node.dashOffset(-offset);
      }, node.getLayer());
      anim.start();
    } else if (shape.animation === "move") {
      const centerX = shape.x;
      const centerY = shape.y;
      const radius = 20;

      anim = new Konva.Animation((frame) => {
        if (!frame) return;
        const angle = frame.time * 0.002;
        node.x(centerX + Math.cos(angle) * radius);
        node.y(centerY + Math.sin(angle) * radius);
      }, node.getLayer());
      anim.start();
    } else {
      // For 'none', ensure static properties are applied
      node.opacity(shape.opacity);
      node.dash([]);
      node.dashOffset(0);
      node.stroke(shape.strokeEnabled ? shape.stroke : undefined);
      node.strokeWidth(shape.strokeEnabled ? shape.strokeWidth || 0 : 0);
    }

    return () => {
      if (tween) tween.destroy();
      if (anim) anim.stop();
      if (node) {
        // Restore static properties cleanly
        node.opacity(
          shape.animation === "blink" ? shape.opacity : node.opacity()
        );
        node.dash([]);
        node.dashOffset(0);
        // Reset stroke properties to state values
        node.stroke(shape.strokeEnabled ? shape.stroke : undefined);
        node.strokeWidth(shape.strokeEnabled ? shape.strokeWidth || 0 : 0);
      }
    };
  }, [shape.animation, shape.opacity, shape.strokeWidth]);

  // Dedicated effect for Video playback to ensure smooth rendering
  useEffect(() => {
      if (shape.mediaType === 'video' && shapeRef.current) {
          const node = shapeRef.current;
          const layer = node.getLayer();
          if (!layer) return;

          // Konva.Animation on a layer will automatically redraw it each frame
          const anim = new Konva.Animation(() => {
              // No logic needed here, just the existence of the animation triggers redraws
          }, layer);
          
          anim.start();
          
          return () => {
              anim.stop();
          };
      }
  }, [shape.mediaType, shape.image]);

  if (shape.type === "rect") {
    return (
      <Rect
        {...props}
        width={shape.width}
        height={shape.height}
        ref={shapeRef as any}
      />
    );
  }
  if (shape.type === "circle") {
    return <Circle {...props} radius={shape.radius} ref={shapeRef as any} />;
  }
  if (shape.type === "image" && shape.image) {
    return (
      <KonvaImage
        {...props}
        width={shape.width}
        height={shape.height}
        image={shape.image}
        ref={shapeRef as any}
      />
    );
  }
  if (shape.type === "text") {
    return (
      <Text
        {...props}
        text={shape.text || "Double click to edit"}
        fontSize={shape.fontSize || 20}
        fontFamily={shape.fontFamily || "Arial"}
        fill={shape.fillEnabled ?? true ? shape.fill : undefined}
        ref={shapeRef as any}
      />
    );
  }
  if (shape.type === "polygon") {
    return (
      <RegularPolygon
        {...props}
        sides={shape.sides || 6}
        radius={shape.radius || 50}
        ref={shapeRef as any}
      />
    );
  }
  if (shape.type === "freedraw") {
      return (
          <Line
            {...props}
            points={shape.points || []}
            closed={true} // Close the loop for final shape
            ref={shapeRef as any}
          />
      );
  }
  return null;
};

export default AnimatedShape;
