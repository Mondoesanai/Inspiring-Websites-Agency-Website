'use client';

import React, { useRef, useId, useEffect, CSSProperties } from 'react';
import { animate, useMotionValue, AnimationPlaybackControls } from 'framer-motion';

// ── Type definitions ──────────────────────────────────────────────────────────

interface ResponsiveImage {
  src: string;
  alt?: string;
  srcSet?: string;
}

interface AnimationConfig {
  preview?: boolean;
  scale: number;
  speed: number;
}

interface NoiseConfig {
  opacity: number;
  scale: number;
}

interface ShadowOverlayProps {
  type?: 'preset' | 'custom';
  presetIndex?: number;
  customImage?: ResponsiveImage;
  sizing?: 'fill' | 'stretch';
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  style?: CSSProperties;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
): number {
  if (fromLow === fromHigh) return toLow;
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

const useInstanceId = (): string => {
  const id = useId();
  return `shadowoverlay-${id.replace(/:/g, '')}`;
};

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * EtheralShadow
 *
 * Renders an animated, colour-tinted shadow silhouette with optional
 * turbulence-based displacement and a grain noise overlay.
 *
 * Props:
 *   color     – any CSS colour string, e.g. "rgba(143, 209, 79, 0.8)"
 *   animation – { scale: 0–100, speed: 0–100 }  (omit to disable)
 *   noise     – { opacity: 0–1, scale: 0–2 }     (omit to disable)
 *   sizing    – "fill" (default) | "stretch"
 *   className – additional Tailwind classes on the root element
 *   style     – inline style override on the root element
 */
export function Component({
  sizing = 'fill',
  color = 'rgba(128, 128, 128, 1)',
  animation,
  noise,
  style,
  className,
}: ShadowOverlayProps) {
  const id = useInstanceId();
  const animationEnabled = !!(animation && animation.scale > 0);

  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const hueRotateMotionValue = useMotionValue(180);
  const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null);

  const displacementScale = animation
    ? mapRange(animation.scale, 1, 100, 20, 100)
    : 0;
  const animationDuration = animation
    ? mapRange(animation.speed, 1, 100, 1000, 50)
    : 1;

  // Hue-rotate animation loop
  useEffect(() => {
    if (!feColorMatrixRef.current || !animationEnabled) return;

    hueRotateAnimation.current?.stop();
    hueRotateMotionValue.set(0);

    hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
      duration: animationDuration / 25,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
      ease: 'linear',
      delay: 0,
      onUpdate: (value: number) => {
        feColorMatrixRef.current?.setAttribute('values', String(value));
      },
    });

    return () => {
      hueRotateAnimation.current?.stop();
    };
  }, [animationEnabled, animationDuration, hueRotateMotionValue]);

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {/* Shadow + displacement layer */}
      <div
        style={{
          position: 'absolute',
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${id}) blur(4px)` : 'none',
        }}
      >
        {/* SVG turbulence filter — only mounted when animation is active */}
        {animationEnabled && (
          <svg style={{ position: 'absolute' }}>
            <defs>
              <filter
                id={id}
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${mapRange(animation!.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation!.scale, 0, 100, 0.004, 0.002)}`}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix
                  ref={feColorMatrixRef}
                  in="undulation"
                  type="hueRotate"
                  values="180"
                />
                <feColorMatrix
                  in="dist"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="circulation"
                  scale={displacementScale}
                  result="dist"
                />
                <feDisplacementMap
                  in="dist"
                  in2="undulation"
                  scale={displacementScale}
                  result="output"
                />
              </filter>
            </defs>
          </svg>
        )}

        {/* Colour-tinted shadow silhouette — mask supplied by Framer CDN */}
        <div
          style={{
            backgroundColor: color,
            maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            maskSize: sizing === 'stretch' ? '100% 100%' : 'cover',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Centred heading */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <h1 className="md:text-7xl text-6xl lg:text-8xl font-bold text-center text-foreground relative z-20">
          Etheral Shadows
        </h1>
      </div>

      {/* Grain noise overlay */}
      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: 'repeat',
            opacity: noise.opacity / 2,
          }}
        />
      )}
    </div>
  );
}
