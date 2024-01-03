import React, { useEffect, useRef, useState } from "react";
import "./DrawCanva.scss";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Coordinate = { x: number; y: number };

type Props = {
  setOpenModal: (openModal: boolean) => void;
  appendToInput: (data: string) => void;
};

function DrawCanva({ setOpenModal, appendToInput }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<Coordinate[][]>([]);
  const [currentLine, setCurrentLine] = useState<Coordinate[]>([]);
  const [predictions, setPredictions] = useState<string[]>([]);
  const isInitialMount = useRef(true);

  const OFFSET = 5; // Adjust this value for your desired offset
  let lastCapturedPoint: Coordinate | null = null;

  const shouldCapture = (point: Coordinate) => {
    if (!lastCapturedPoint) return true;
    const dx = point.x - lastCapturedPoint.x;
    const dy = point.y - lastCapturedPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance >= OFFSET;
  };

  const startDrawing = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    ctx.beginPath(); // Start a new path

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.moveTo(x, y); // Move the starting point
    setCurrentLine([{ x, y }]);
    lastCapturedPoint = { x, y };
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (shouldCapture({ x, y })) {
      setCurrentLine((prev) => [...prev, { x, y }]);
      lastCapturedPoint = { x, y };
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = async () => {
    if (currentLine.length > 0) {
      setLines((prev) => [...prev, currentLine]);
      setCurrentLine([]);
    }
    setIsDrawing(false);
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Start a new path to ensure old drawings don't reappear
    ctx.beginPath();

    // Reset the state
    setLines([]);
    setCurrentLine([]);
    setPredictions([]);
  };

  const redraw = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Clear the canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    for (const line of lines) {
      if (line.length === 0) continue;

      const start = line[0];
      ctx.moveTo(start.x, start.y);

      for (const point of line) {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    }
  };

  const sendToServer = async () => {
    console.log("Sending to server:", lines);
    await axios
      .post(
        "https://vantanhly.io.vn/predict-hiragana",
        {
          lines: lines,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // console.log(response.data.predicted_classes);
        setPredictions(response.data.predicted_classes);
      });
  };

  const removeLastLine = () => {
    if (lines.length > 0) {
      const newLines = lines.slice(0, -1); // Remove the last element
      setLines(newLines);
    }
    if (lines.length === 1) {
      resetCanvas();
    }
  };

  const handlePredictionClick = (prediction: string) => () => {
    appendToInput(prediction);
    resetCanvas();
  };

  // This will also need to redraw the canvas to reflect the change
  useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (lines.length > 0) {
      sendToServer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  useEffect(() => {
    // console.log('Predictions:', predictions);
  }, [predictions]);

  return (
    <div className="">
      <div className="relative">
        <div className="absolute right-0 top-0 p-1">
          <button onClick={() => setOpenModal(false)}>
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <canvas
          className="bg-gray-100 cursor-crosshair border-none rounded-lg"
          ref={canvasRef}
          width={300}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
        ></canvas>
        <div className="absolute justify-end bottom-0 right-0 flex gap-0.5 pointer-events-none p-2">
          <button
            type="button"
            className="pointer-events-auto px-3 py-2 text-xs font-medium text-center text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 active:ring-4 active:outline-none active:ring-emerald-300"
            onClick={resetCanvas}
          >
            Clear
          </button>
          <button
            type="button"
            className="pointer-events-auto px-3 py-2 text-xs font-medium text-center text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 active:ring-4 active:outline-none active:ring-emerald-300"
            onClick={removeLastLine}
          >
            Undo
          </button>
        </div>
      </div>
      <div className="flex gap-1.5 justify-center mt-3">
        {predictions.map((prediction, index) => (
          <div
            key={index}
            className="cursor-pointer px-3 py-2 text-s font-medium text-center text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 focus:ring-4 focus:outline-none focus:ring-emerald-300"
            onClick={handlePredictionClick(prediction)}
          >
            {prediction}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DrawCanva;
