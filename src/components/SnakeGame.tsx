"use client";
import React, { useState } from "react";

type DirectionProps = "up" | "down" | "left" | "right";

const rows = 20;
const cols = 20;
const initialSnake = [[10, 10]];
const initialDirection: DirectionProps = "right";

export const SnakeGame = () => {
  const [snake, setSnake] = useState<number[][]>(initialSnake);
  const [direction, setDirection] = useState<DirectionProps>(initialDirection);

  const createBoard = () => {
    const board: number[][] = Array.from({ length: rows }, () =>
      Array(cols).fill(0)
    );
    for (const [x, y] of snake) {
      board[x][y] = 55;
    }
    return board;
  };

  const boardGame = createBoard();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp" && direction !== "down") {
      setDirection("up");
      console.log("up");
      return;
    }
    if (event.key === "ArrowDown" && direction !== "up") {
      setDirection("down");
      console.log("down");
      return;
    }
    if (event.key === "ArrowLeft" && direction !== "right") {
      setDirection("left");
      console.log("left");
      return;
    }
    if (event.key === "ArrowRight" && direction !== "left") {
      setDirection("right");
      console.log("right");
      return;
    }
  };
  return (
    <div
      onKeyDown={handleKeyPress}
      tabIndex={0}
      autoFocus
      className={`grid grid-cols-20 bg-green-800 h-200 w-200`}
    >
      {boardGame.flat().map((cell, index) => (
        <div
          key={index}
          className="h-10 border border-gray-400 flex items-center justify-center"
        >
          {cell}
        </div>
      ))}
    </div>
  );
};
