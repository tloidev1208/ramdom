"use client";
import React, { useEffect, useState } from "react";

interface DuckRandomProps {
  team1: string[];
  team2: string[];
}

type Duck = {
  name: string;
  pos: number; // vị trí %
  randTop?: number; // vị trí dọc random mỗi frame
};

const DOCKS = ["🌲RỪNG", "🗡️TOP", "🔥 MID", "🏹AD", "🛡️SP"];

export default function DuckRandom({ team1, team2 }: DuckRandomProps) {
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [timeLeft, setTimeLeft] = useState(5); // 5 giây đua
  const [results, setResults] = useState<{ dock: string; ducks: string[] }[]>([]);
  const [raceKey, setRaceKey] = useState(0); // Thêm state để reset đua

  useEffect(() => {
    const allMembers = [...team1, ...team2];
    const assigned: Duck[] = allMembers.map((name) => ({
      name,
      pos: 0,
      randTop: 20 + Math.random() * 60,
    }));

    setDucks(assigned);
    setTimeLeft(5);
    setResults([]);

    let start: number | null = null;
    let frame: number;
    const duration = 5000; // 5 giây đua

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);

      setDucks((prev) =>
        prev.map((d) => ({
          ...d,
          pos: progress * 100, // vị trí ngang tiến đều từ 0 đến 100%
          randTop: d.randTop! + (Math.random() - 0.5) * 2, // vị trí dọc dao động nhẹ
        }))
      );

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        const dockAssignments: { [dock: string]: string[] } = {};
        DOCKS.forEach((d) => (dockAssignments[d] = []));

        const shuffled = [...assigned].sort(() => Math.random() - 0.5);

        shuffled.forEach((duck) => {
          let chosen: string | null = null;
          while (!chosen) {
            const dock = DOCKS[Math.floor(Math.random() * DOCKS.length)];
            if (dockAssignments[dock].length < 2) {
              dockAssignments[dock].push(duck.name);
              chosen = dock;
            }
          }
        });

        setResults(
          DOCKS.map((dock) => ({ dock, ducks: dockAssignments[dock] }))
        );
      }
    };
    frame = requestAnimationFrame(step);

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) clearInterval(timer);
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(frame);
    };
  }, [team1, team2, raceKey]); // Thêm raceKey vào dependency

  const handleRaceAgain = () => {
    setRaceKey((k) => k + 1);
  };

  return (
    <div className="mt-8 w-full text-gray-800">
      <h2 className="text-xl font-bold text-center mb-4">
        🦆 Đua vịt tranh lane {timeLeft > 0 && `(${timeLeft}s)`}
      </h2>

      {/* Track đua */}
      <div className="relative w-full h-50 border rounded-lg bg-blue-100 overflow-hidden">
        {ducks.map((duck, idx) => (
          <span
            key={duck.name}
            className="absolute transition-transform duration-200"
            style={{
              left: `${duck.pos}%`,
              top: `${duck.randTop}%`,
              transform: "translateY(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            🦆 {duck.name}
          </span>
        ))}

        {/* Đích + Bến */}
        <div className="absolute right-0 top-0 h-full flex flex-col justify-between bg-green-200 px-2 py-1 w-20">
          {DOCKS.map((dock) => (
            <div
              key={dock}
              className="flex-1 flex items-center justify-center text-xs font-bold border-b last:border-none"
            >
              {dock}
            </div>
          ))}
        </div>
      </div>

      {/* Kết quả */}
      {results.length > 0 && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <h3 className="text-lg font-bold mb-2">🏆 Kết quả đua vịt</h3>
          <ul className="list-disc list-inside">
            {results.map((r, i) => (
              <li key={i}>
                {r.dock}:{" "}
                {r.ducks.length > 0 ? r.ducks.join(", ") : "Không ai chọn"}
              </li>
            ))}
          </ul>
          <button
            onClick={handleRaceAgain}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
          >
            Đua lại
          </button>
        </div>
      )}
    </div>
  );
}
