import { SnakeGame } from "@/components/SnakeGame";

export default function Home() {
  return (
    <div>
      <main className="m-auto p-4 flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-black">Snake Game!</h1>
        <SnakeGame />
      </main>
    </div>
  );
}
