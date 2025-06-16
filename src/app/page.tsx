import { SnakeGame } from "@/components/SnakeGame";

export default function Home() {
  return (
    <div>
      <main className="m-auto p-4 flex flex-col items-center justify-center h-screen bg-gray-100">
        <SnakeGame />
      </main>
    </div>
  );
}
