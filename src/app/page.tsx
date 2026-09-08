import { Terminal } from "@/components/cli/Terminal";
import DotField from "@/components/DotField";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="absolute inset-0 -z-10">
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
      </div>
      <Terminal />
    </main>
  );
}