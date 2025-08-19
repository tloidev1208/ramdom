"use client";
import React, { useEffect, useState } from "react";

type Lane = {
  key: string;
  icon: string;
};

const LANES: Lane[] = [
  { key: "TOP", icon: "🗡️" },
  { key: "MID", icon: "🔥" },
  { key: "AD", icon: "🏹" },
  { key: "SP", icon: "🛡️" },
  { key: "RỪNG", icon: "🌲" },
];

interface Props {
  team1: string[];
  team2: string[];
  onFinish: (result: { lane: string; winner: string }[]) => void;
}

export default function DuckRandom({ team1, team2, onFinish }: Props) {
  const [progress, setProgress] = useState<number[][]>(
    Array(5)
      .fill(0)
      .map(() => [0, 0])
  );
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isFinished) {
      interval = setInterval(() => {
        setProgress((prev) =>
          prev.map(([p1, p2]) => [
            Math.min(p1 + Math.random() * 8, 100),
            Math.min(p2 + Math.random() * 8, 100),
          ])
        );
      }, 300);
    }

    // Sau 10 giây kết thúc
    const timeout = setTimeout(() => {
      setIsFinished(true);
      clearInterval(interval);

      const result = progress.map(([p1, p2], i) => {
        const winner = p1 >= p2 ? team1[i] : team2[i];
        return { lane: LANES[i].key, winner };
      });
      onFinish(result);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isFinished, progress, team1, team2, onFinish]);

  return (
    <div className="w-full bg-blue-50 rounded-xl p-4 mt-6 shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">🦆 Đua vịt tranh lane!</h2>
      {LANES.map((lane, i) => (
        <div key={lane.key} className="mb-4">
          <p className="font-semibold mb-1">
            {lane.icon} {lane.key}
          </p>
          <div className="relative w-full h-12 bg-blue-200 rounded-lg overflow-hidden">
            {/* Vịt team 1 */}
            <div
              className="absolute top-1 left-0 transition-all"
              style={{ transform: `translateX(${progress[i][0]}%)` }}
            >
              🦆 {team1[i] || "?"}
            </div>

            {/* Vịt team 2 */}
            <div
              className="absolute bottom-1 left-0 transition-all"
              style={{ transform: `translateX(${progress[i][1]}%)` }}
            >
              🦆 {team2[i] || "?"}
            </div>
          </div>
        </div>
      ))}
      {!isFinished && (
        <p className="text-center mt-4 text-gray-600 animate-pulse">⏳ Trận đua đang diễn ra...</p>
      )}
      {isFinished && (
        <p className="text-center mt-4 text-green-600 font-bold">✅ Đua vịt kết thúc!</p>
      )}
    </div>
  );
}
