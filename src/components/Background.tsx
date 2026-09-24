"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import DotField from "@/components/DotField";

// WebGPU only exists in the browser, so skip SSR entirely
const ShapeWaves = dynamic(() => import("@/components/ShapeWaves"), { ssr: false });

// Hex values matching --background in globals.css (ShapeWaves only parses hex)
const PALETTES = {
  dark: { backgroundColor: "#0a0a0a", color: "#3d3d3d", hoverColor: "#ffffff", glow: 0.35 },
  light: { backgroundColor: "#ffffff", color: "#d4d4d4", hoverColor: "#171717", glow: 0 },
};

export function Background() {
  const { resolvedTheme } = useTheme();
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && "gpu" in navigator);
  }, []);

  if (supported === null || !resolvedTheme) return null;

  if (!supported) {
    return (
      <DotField
        dotRadius={1.5}
        dotSpacing={14}
        bulgeStrength={67}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
        gradientFrom="rgba(120,120,120,0.25)"
        gradientTo="rgba(120,120,120,0.06)"
        glowColor="rgba(160,160,160,0.5)"
      />
    );
  }

  const palette = resolvedTheme === "dark" ? PALETTES.dark : PALETTES.light;

  return (
    <ShapeWaves
      {...palette}
      shapes="mixed"
      cellSize={12}
      dotSize={0.6}
      speed={1}
      scale={1}
      contrast={1}
      brightness={0.4}
      fade={0.25}
      interactive
      splashRadius={40}
      splashStrength={0.4}
      intro
      introDuration={1.6}
      onError={(error: Error) => {
        console.warn("ShapeWaves failed, falling back to DotField:", error);
        setSupported(false);
      }}
    />
  );
}
