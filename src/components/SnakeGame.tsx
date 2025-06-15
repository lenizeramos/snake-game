"use client";
import React, { useEffect, useState } from "react";

type DirectionProps = "up" | "down" | "left" | "right";
interface coordinatesProps {
  x: number;
  y: number;
}

const gridSize = 20;
const initialSnake: coordinatesProps[] = [{ x: 10, y: 10 }];
const initialDirection: DirectionProps = "right";
const initialFood: coordinatesProps = { x: -1, y: -1 };

export const SnakeGame = () => {
  const [snake, setSnake] = useState<coordinatesProps[]>(initialSnake);
  const [direction, setDirection] = useState<DirectionProps>(initialDirection);
  const [food, setFood] = useState<coordinatesProps>(initialFood);

  const createBoard = () => {
    const board: number[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(0)
    );
    for (const { x, y } of snake) {
      board[x][y] = 55;
    }
    if (food.x >= 0 && food.y >= 0) {
      board[food.x][food.y] = 99;
    }
    return board;
  };

  const moveSnake = React.useCallback(() => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case "up":
          head.x = (head.x - 1 + gridSize) % gridSize;
          break;
        case "down":
          head.x = (head.x + 1) % gridSize;
          break;
        case "left":
          head.y = (head.y - 1 + gridSize) % gridSize;
          break;
        case "right":
          head.y = (head.y + 1) % gridSize;
          break;
      }

      newSnake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        generateFood();
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
  }, [snake, direction, food]);

  const generateFood = () => {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    setFood({ x, y });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp" && direction !== "down") {
      setDirection("up");
      return;
    }
    if (event.key === "ArrowDown" && direction !== "up") {
      setDirection("down");
      return;
    }
    if (event.key === "ArrowLeft" && direction !== "right") {
      setDirection("left");
      return;
    }
    if (event.key === "ArrowRight" && direction !== "left") {
      setDirection("right");
      return;
    }
  };

  const boardGame = createBoard();

  useEffect(() => {
    generateFood();
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, 60);
    return () => clearInterval(interval);
  }, [snake, direction, moveSnake]);

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
          className={`${
            cell === 55 ? "bg-green-500" : ""
          } h-10 border border-gray-400 flex items-center justify-center ${
            cell === 99 ? "bg-red-500" : ""
          }`}
        ></div>
      ))}
    </div>
  );
};
