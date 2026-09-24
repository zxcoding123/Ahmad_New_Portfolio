import { Terminal } from "@/components/cli/Terminal";
import { Background } from "@/components/Background";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="absolute inset-0 -z-10">
        <Background />
      </div>
      <Terminal />
    </main>
  );
}
