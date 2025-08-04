import { Terminal } from '@/components/cli/Terminal';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 md:p-4" data-test="ahmad_portfolio">
      <Terminal />
    </main>
  );
}
