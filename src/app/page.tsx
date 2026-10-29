import { Desktop } from "@/components/os/Desktop";
import { Background } from "@/components/Background";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 pb-24 sm:p-8 sm:pb-24 md:p-12 md:pb-24 lg:p-24">
      <div className="absolute inset-0 -z-10">
        <Background />
      </div>
      <Desktop />
    </main>
  );
}
