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
  }, []);

  useEffect(() => {
    if (gameOver || hasWon) return;

    const interval = setInterval(() => {
      moveSnake();
      setCanChangeDirection(true);
    }, 120);
    return () => clearInterval(interval);
  }, [moveSnake, gameOver, hasWon]);

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
      {hasWon && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl w-80 text-center">
          <h2 className="text-green-600 text-4xl font-extrabold mb-4">
            You Win!
          </h2>
          <p className="text-gray-700 mb-6">You have filled the entire board!</p>
          <button
            onClick={resetGame}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200 ease-in-out"
          >
            Play Again
          </button>
        </div>
      )}
      {boardGame.flat().map((cell, index) => (
        <div
          key={index}
          className={`h-10 flex items-center justify-center ${
            cell === 55
              ? "bg-green-500 border border-black"
              : cell === 99
              ? "bg-red-500"
              : "border border-gray-400"
          }`}
        ></div>
      ))}
    </div>
  );
};
