"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";

type DirectionProps = "up" | "down" | "left" | "right";
interface Coordinates {
  row: number;
  column: number;
}

const gridSize = 20;
const initialSnake: Coordinates[] = [
  { row: 10, column: 10 },
  { row: 10, column: 9 },
  { row: 10, column: 8 },
];
const initialDirection: DirectionProps = "right";
const initialFood: Coordinates = { row: -1, column: -1 };

export const SnakeGame = () => {
  const [snake, setSnake] = useState<Coordinates[]>(initialSnake);
  const [direction, setDirection] = useState<DirectionProps>(initialDirection);
  const [food, setFood] = useState<Coordinates>(initialFood);
  const [canChangeDirection, setCanChangeDirection] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback(() => {
    let newFood: Coordinates;
    do {
      const row = Math.floor(Math.random() * gridSize);
      const column = Math.floor(Math.random() * gridSize);
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
        head.row = (head.row - 1 + gridSize) % gridSize;
        break;
      case "down":
        head.row = (head.row + 1) % gridSize;
        break;
      case "left":
        head.column = (head.column - 1 + gridSize) % gridSize;
        break;
      case "right":
        head.column = (head.column + 1) % gridSize;
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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      moveSnake();
      setCanChangeDirection(true);
    }, 120);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const boardGame = useMemo(() => {
    const board: number[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(0)
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
    setSnake(initialSnake);
    generateFood();
    setDirection(initialDirection);
    setCanChangeDirection(true);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className={`grid grid-cols-20 bg-green-800 h-200 w-200`}>
      <div className="absolute top-0 left-0 p-4 text-white">
        <h1 className="text-2xl font-bold">Snake Game</h1>
        <p className="text-lg text-black">Score: {score}</p>
      </div>
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl w-80 text-center">
          <h2 className="text-red-600 text-4xl font-extrabold mb-4">
            Game Over!
          </h2>
          <p className="text-gray-700 mb-6">You collided with yourself.</p>
          <button
            onClick={resetGame}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200 ease-in-out"
          >
            Start Again
          </button>
        </div>
      )}
      {boardGame.flat().map((cell, index) => (
        <div
          key={index}
          className={`h-10 flex items-center justify-center ${
            cell === 55 ? "bg-green-500 border border-black" : cell === 99 ? "bg-red-500" : "border border-gray-400"
          }`}
        ></div>
      ))}
    </div>
  );
};
