import { Component } from "@/components/ui/etheral-shadow";

/**
 * DemoOne — full-screen ethereal shadow with max animation and noise.
 * Drop this into any page: <DemoOne />
 */
const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Component
        color="rgba(128, 128, 128, 1)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
      />
    </div>
  );
};

/**
 * DemoTwo — green-tinted variant at lower intensity.
 * Good for use as a section background accent.
 */
const DemoTwo = () => {
  return (
    <div className="relative w-full h-[500px]">
      <Component
        color="rgba(143, 209, 79, 0.6)"
        animation={{ scale: 40, speed: 50 }}
        noise={{ opacity: 0.4, scale: 1 }}
        sizing="fill"
      />
    </div>
  );
};

/**
 * DemoThree — static (no animation), stretched mask, purple tint.
 */
const DemoThree = () => {
  return (
    <div className="relative w-full h-[400px]">
      <Component
        color="rgba(139, 92, 246, 0.8)"
        sizing="stretch"
        noise={{ opacity: 0.6, scale: 0.8 }}
      />
    </div>
  );
};

export { DemoOne, DemoTwo, DemoThree };
