const rows = 20;
const cols = 20;

export const SnakeGame = () => {
  const createBoard = () => {
    const board: number[][] = Array.from({ length: rows }, () =>
      Array(cols).fill(0)
    );
    return board;
  };

  const boardGame = createBoard();
  return (
    <div className={`grid grid-cols-20 bg-green-800 h-200 w-200`}>
      {boardGame.flat().map((cell, index) => (
        <div key={index} className="h-10 border border-gray-400 flex items-center justify-center">
          {cell}
        </div>
      ))}
    </div>
  );
};
