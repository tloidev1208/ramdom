"use client";
import React, { useState } from "react";
import NameInput from "../components/NameInput";
import NameList from "../components/NameList";
import SpinAnimation from "../components/SpinAnimation";
import TeamDisplay from "../components/TeamDisplay";

// 🔹 Định nghĩa type cho Lane
type Lane = {
  key: string;
  color: string;
  bg: string;
  icon: string;
};

// 🔹 Danh sách lane
const LANES: Lane[] = [
  { key: "RỪNG", color: "text-green-600", bg: "bg-green-100", icon: "🌲" },
  { key: "TOP", color: "text-blue-600", bg: "bg-blue-100", icon: "🗡️" },
  { key: "MID", color: "text-purple-600", bg: "bg-purple-100", icon: "🔥" },
  { key: "AD", color: "text-yellow-600", bg: "bg-yellow-100", icon: "🏹" },
  { key: "SP", color: "text-pink-600", bg: "bg-pink-100", icon: "🛡️" },
];

// 🔹 Hàm shuffle dùng generic
const shuffleArray = <T,>(array: T[]): T[] => {
  let newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function App() {
  const [name, setName] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [spinTime, setSpinTime] = useState("");

  // 🔹 state cho team có lane
  const [team1WithLane, setTeam1WithLane] = useState<{ name: string; lane: Lane }[]>([]);
  const [team2WithLane, setTeam2WithLane] = useState<{ name: string; lane: Lane }[]>([]);

  const addName = () => {
    if (name.trim() !== "") {
      setNames((prev) => [...prev, name.trim()]);
      setName("");
    }
  };

  const spinAndAssign = () => {
    if (names.length < 2 || isSpinning) return;

    setIsSpinning(true);
    setTeam1([]);
    setTeam2([]);
    setSpinTime("");
    setTeam1WithLane([]);
    setTeam2WithLane([]);

    let counter = 0;
    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setDisplayName(randomName);
      counter++;

      if (counter > 20) {
        clearInterval(interval);

        const now = new Date();
        setSpinTime(now.toLocaleDateString("vi-VN") + " " + now.toLocaleTimeString("vi-VN"));

        const shuffled = shuffleArray(names);
        const t1: string[] = [];
        const t2: string[] = [];

        shuffled.forEach((n, i) => {
          if (i % 2 === 0) t1.push(n);
          else t2.push(n);
        });

        setTeam1(t1);
        setTeam2(t2);
        setIsSpinning(false);
      }
    }, 100);
  };

  // 🎯 Hàm random lane
  const assignLanes = () => {
    if (team1.length === 5 && team2.length === 5) {
      const shuffledLanes1 = shuffleArray(LANES);
      const shuffledLanes2 = shuffleArray(LANES);

      setTeam1WithLane(team1.map((n, i) => ({ name: n, lane: shuffledLanes1[i] })));
      setTeam2WithLane(team2.map((n, i) => ({ name: n, lane: shuffledLanes2[i] })));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-6">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700 text-center drop-shadow">
          🎯 Random Teams Liên Quân
        </h1>

        {/* Input */}
        <NameInput name={name} setName={setName} addName={addName} />

        {/* Nút thao tác */}
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={spinAndAssign}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-600"
          >
            Quay & Chia Team
          </button>
          <button
            onClick={() =>
              setNames([
                "Lợi",
                "Huy",
                "Minh",
                "Thắng",
                "Bảo",
                "Bảo H",
                "Hưng",
                "Kiệt",
                "Nam",
                "Trường",
              ])
            }
            className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-purple-600"
          >
            Nhập danh sách mặc định
          </button>
          {/* 🎯 Nút Random Lane */}
          <button
            onClick={assignLanes}
            disabled={team1.length !== 5 || team2.length !== 5}
            className={`px-4 py-2 rounded-lg font-semibold shadow ${
              team1.length === 5 && team2.length === 5
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Random Lane
          </button>
        </div>

        {/* Danh sách chờ */}
        <NameList names={names} setNames={setNames} />

        {/* Animation */}
        {displayName && isSpinning && <SpinAnimation displayName={displayName} />}

        {/* Kết quả */}
        {!isSpinning && (team1.length > 0 || team2.length > 0) && (
          <div className="w-full mt-6">
            <TeamDisplay
              team1={team1WithLane.length ? team1WithLane : team1}
              team2={team2WithLane.length ? team2WithLane : team2}
              spinTime={spinTime}
            />
          </div>
        )}
      </div>
    </div>
  );
}
