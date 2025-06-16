import React, { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onExit: () => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onExit }) => {
  const GRID_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 10, y: 10 }];
  const INITIAL_FOOD = { x: 15, y: 15 };

  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  };

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
    setDirection({ x: 1, y: 0 }); // Start moving right
  };

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
        return;
      }

      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying, onExit]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        let cellClass = 'w-3 h-3 border border-gray-700';
        
        // Check if this cell contains snake
        if (snake.some(segment => segment.x === x && segment.y === y)) {
          cellClass += ' bg-green-400';
        }
        // Check if this cell contains food
        else if (food.x === x && food.y === y) {
          cellClass += ' bg-red-400';
        }
        // Empty cell
        else {
          cellClass += ' bg-black';
        }

        grid.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      <div className="text-green-400 font-mono text-center">
        <div className="text-3xl mb-4 text-yellow-400">🐍 SNAKE GAME</div>
        
        <div className="mb-4">
          <div className="text-lg">Score: <span className="text-yellow-400">{score}</span></div>
        </div>

        {!isPlaying && !gameOver && (
          <div className="mb-4">
            <button
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded mr-4"
            >
              Start Game
            </button>
            <button
              onClick={onExit}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded"
            >
              Exit
            </button>
          </div>
        )}

        {gameOver && (
          <div className="mb-4">
            <div className="text-red-400 text-xl mb-2">Game Over!</div>
            <div className="text-lg mb-4">Final Score: {score}</div>
            <button
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded mr-4"
            >
              Play Again
            </button>
            <button
              onClick={onExit}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded"
            >
              Exit
            </button>
          </div>
        )}

        {isPlaying && (
          <div className="mb-4">
            <div className="text-sm mb-2">Use arrow keys to control the snake • Press ESC to exit</div>
            <button
              onClick={onExit}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded text-sm"
            >
              Exit Game
            </button>
          </div>
        )}

        <div className="inline-block border-2 border-green-400 p-2 mb-4">
          <div 
            className="grid gap-0"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              display: 'grid'
            }}
          >
            {renderGrid()}
          </div>
        </div>

        <div className="text-xs text-gray-400">
          🟢 Snake • 🔴 Food • Use arrow keys to move
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;