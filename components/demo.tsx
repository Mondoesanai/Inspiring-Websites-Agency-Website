import { LiquidButton, MetalButton } from "@/components/ui/liquid-glass-button"

export default function DemoOne() {
  return (
    <div className="flex flex-col items-center justify-center gap-12 p-16 min-h-screen bg-gray-100 dark:bg-zinc-900">

      {/* LiquidButton demo */}
      <div className="relative h-[200px] w-[800px]">
        <LiquidButton className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          Liquid Glass
        </LiquidButton>
      </div>

      {/* MetalButton variants */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <MetalButton variant="default">Default</MetalButton>
        <MetalButton variant="primary">Primary</MetalButton>
        <MetalButton variant="success">Success</MetalButton>
        <MetalButton variant="error">Error</MetalButton>
        <MetalButton variant="gold">Gold</MetalButton>
        <MetalButton variant="bronze">Bronze</MetalButton>
      </div>

    </div>
  )
}
