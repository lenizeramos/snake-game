"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";

type Direction = "up" | "down" | "left" | "right";
interface Coordinates {
  row: number;
  column: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Coordinates[] = [
  { row: 0, column: 2 },
  { row: 0, column: 1 },
  { row: 0, column: 0 },
];

const INITIAL_DIRECTION: Direction = "right";
const INITIAL_FOOD: Coordinates = { row: -1, column: -1 };

export const SnakeGame = () => {
  const [snake, setSnake] = useState<Coordinates[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Coordinates>(INITIAL_FOOD);
  const [canChangeDirection, setCanChangeDirection] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const generateFood = useCallback(() => {
    let newFood: Coordinates;
    do {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const column = Math.floor(Math.random() * GRID_SIZE);
      newFood = { row, column };
    } while (
      snake.some(
        (snakePart) =>
          snakePart.row === newFood.row && snakePart.column === newFood.column
      )
    );
    console.log("New food generated at:", newFood);
    setFood(newFood);
  }, [snake]);

  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case "up":
        head.row = (head.row - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case "down":
        head.row = (head.row + 1) % GRID_SIZE;
        break;
      case "left":
        head.column = (head.column - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case "right":
        head.column = (head.column + 1) % GRID_SIZE;
        break;
    }

    newSnake.unshift(head);
    if (head.row === food.row && head.column === food.column) {
      generateFood();
      setScore((prevScore) => prevScore + 1);
    } else {
      newSnake.pop();
    }

    if (
      newSnake.some(
        (snakePart) =>
          snakePart.row === head.row &&
          snakePart.column === head.column &&
          snakePart !== head
      )
    ) {
      setGameOver(true);
      return;
    }

    if (newSnake.length === GRID_SIZE * GRID_SIZE) {
      setHasWon(true);
      return;
    }

    setSnake(newSnake);
  }, [snake, direction, food, generateFood]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!canChangeDirection) return;

      if (event.key === "ArrowUp" && direction !== "down") {
        setDirection("up");
        setCanChangeDirection(false);
      } else if (event.key === "ArrowDown" && direction !== "up") {
        setDirection("down");
        setCanChangeDirection(false);
      } else if (event.key === "ArrowLeft" && direction !== "right") {
        setDirection("left");
        setCanChangeDirection(false);
      } else if (event.key === "ArrowRight" && direction !== "left") {
        setDirection("right");
        setCanChangeDirection(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, canChangeDirection]);

  useEffect(() => {
    generateFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isGameStarted || gameOver || hasWon) return;

    const interval = setInterval(() => {
      moveSnake();
      setCanChangeDirection(true);
    }, 120);
    return () => clearInterval(interval);
  }, [moveSnake, gameOver, hasWon, isGameStarted]);

  const boardGame = useMemo(() => {
    const board: number[][] = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(0)
    );
    for (const { row, column } of snake) {
      board[row][column] = 55;
    }
    if (food.row >= 0 && food.column >= 0) {
      board[food.row][food.column] = 99;
    }
    return board;
  }, [snake, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    generateFood();
    setDirection(INITIAL_DIRECTION);
    setCanChangeDirection(true);
    setGameOver(false);
    setScore(0);
    setHasWon(false);
    setIsGameStarted(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 text-white space-y-2">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-lime-400 to-green-500 text-transparent bg-clip-text drop-shadow-md">
          Snake Game
        </h1>
        <div className="bg-yellow-400 text-black font-semibold px-3 py-1 rounded shadow inline-block">
          Score: {score}
        </div>
      </div>

      <div className="relative grid grid-cols-20 gap-[2px] bg-gray-800 p-2 rounded-xl shadow-inner border-4 border-green-700 mt-14">
        {!isGameStarted && !gameOver && !hasWon && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-center p-6 z-10">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-80">
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                Ready to Play?
              </h2>
              <button
                onClick={() => setIsGameStarted(true)}
                className="w-full bg-gradient-to-r from-green-500 to-lime-600 hover:from-green-600 hover:to-lime-700 text-white font-semibold py-2 px-4 rounded transition duration-200 ease-in-out"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
        {boardGame.flat().map((cell, index) => (
          <div
            key={index}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-sm ${
              cell === 55
                ? "bg-green-400 border border-green-700"
                : cell === 99
                ? "bg-red-500 border border-red-700"
                : "bg-gray-100 border border-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="mt-4 text-gray-300">
        <p>🎮 Use Arrow Keys to Move</p>
        <p>🐍 Do not collide with your own body</p>
      </div>

      {(gameOver || hasWon) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-80">
            <h2
              className={`text-4xl font-bold mb-4 ${
                gameOver ? "text-red-600" : "text-green-600"
              }`}
            >
              {gameOver ? "Game Over!" : "You Win!"}
            </h2>
            <p className="text-gray-700 mb-6">
              {gameOver
                ? "You collided with yourself."
                : "You filled the entire board!"}
            </p>
            <button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded transition duration-200 ease-in-out"
            >
              {gameOver ? "Start Again" : "Play Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
