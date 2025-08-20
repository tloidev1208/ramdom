"use client";
import { useState } from "react";
import { heroes } from "@/app/LegendRamdom/heroes";
import TeamDisplay from "../components/TeamDisplay";
import DuckRandom from "../components/Duckramdom";
import SpinAnimation from "../components/SpinAnimation";

type Lane = {
  key: string;
  color: string;
  bg: string;
  icon: string;
};

const LANES: Lane[] = [
  { key: "RỪNG", color: "text-green-600", bg: "bg-green-100", icon: "🌲" },
  { key: "TOP", color: "text-blue-600", bg: "bg-blue-100", icon: "🗡️" },
  { key: "MID", color: "text-purple-600", bg: "bg-purple-100", icon: "🔥" },
  { key: "AD", color: "text-yellow-600", bg: "bg-yellow-100", icon: "🏹" },
  { key: "SP", color: "text-pink-600", bg: "bg-pink-100", icon: "🛡️" },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  let newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function MainPage() {
  const [mode, setMode] = useState<"team" | "hero">("team");

  // Chung
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);

  // Team mode
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [team1WithLane, setTeam1WithLane] = useState<
    { name: string; lane: Lane }[]
  >([]);
  const [team2WithLane, setTeam2WithLane] = useState<
    { name: string; lane: Lane }[]
  >([]);
  const [showDuckRace, setShowDuckRace] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayName, setDisplayName] = useState("");

  // Hero mode
  const [results, setResults] = useState<
    Record<string, Record<string, string>>
  >({});

  const addPlayer = () => {
    if (playerName.trim() && !players.includes(playerName)) {
      setPlayers([...players, playerName.trim()]);
      setPlayerName("");
    }
  };

  const removePlayer = (name: string) => {
    setPlayers(players.filter((p) => p !== name));
    setResults((prev) => {
      const newRes = { ...prev };
      delete newRes[name];
      return newRes;
    });
  };

  // Team mode functions
  const spinAndAssign = () => {
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      setDisplayName(players[Math.floor(Math.random() * players.length)]);
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        const shuffled = shuffleArray(players);
        const t1: string[] = [];
        const t2: string[] = [];

        shuffled.forEach((n, i) => {
          if (i % 2 === 0) t1.push(n);
          else t2.push(n);
        });

        setTeam1(t1);
        setTeam2(t2);
        setTeam1WithLane([]);
        setTeam2WithLane([]);
        setShowDuckRace(false);
        setIsSpinning(false);
      }
    }, 100);
  };

  const assignLanes = () => {
    if (team1.length > 0) {
      const shuffledLanes1 = shuffleArray(LANES);
      setTeam1WithLane(
        team1.map((n, i) => ({
          name: n,
          lane: shuffledLanes1[i % LANES.length],
        }))
      );
    }
    if (team2.length > 0) {
      const shuffledLanes2 = shuffleArray(LANES);
      setTeam2WithLane(
        team2.map((n, i) => ({
          name: n,
          lane: shuffledLanes2[i % LANES.length],
        }))
      );
    }
  };

  // Hero mode functions
  const randomHeroes = () => {
    const getRandomOne = (arr: string[]) =>
      arr[Math.floor(Math.random() * arr.length)];
    const newResults: Record<string, Record<string, string>> = {};
    players.forEach((player) => {
      newResults[player] = {};
      Object.entries(heroes).forEach(([role, list]) => {
        newResults[player][role] = getRandomOne(list);
      });
    });
    setResults(newResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700 text-center">
          🎮 Random Tool
        </h1>

        {/* Switch mode */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setMode("team")}
            className={`px-4 py-2 rounded font-semibold ${
              mode === "team" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Random Team
          </button>
          <button
            onClick={() => setMode("hero")}
            className={`px-4 py-2 rounded font-semibold ${
              mode === "hero" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Random Tướng
          </button>
        </div>

        {/* Input player */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 justify-center text-center items-center">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            placeholder="Nhập tên người chơi"
            className="border p-2 rounded w-64"
          />
          <button
            onClick={addPlayer}
            className="bg-purple-500 text-white px-4 py-2 rounded shadow w-[220px]"
          >
            Thêm mới
          </button>
          <div className="">hoặc</div>
          <button
            onClick={() =>
              setPlayers([
                "Lợi",
                "Huy",
                "Minh",
                "Thắng",
                "Bảo",
                "Bảo H",
                "Hưng",
                "Kiệt",
                "Hùng",
                "Trường",
              ])
            }
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            Nhập danh sách mặc định
          </button>
        </div>

        {/* Player list */}
        {players.length > 0 && (
          <ul className="mb-6 flex flex-wrap gap-4 justify-center max-h-30 overflow-y-auto">
            {players.map((p, i) => (
              <li
                key={p}
                className="flex items-center gap-3 bg-gray-50 shadow px-4 py-2 mb-1 rounded-full"
              >
                <span className="font-bold mr-2">{i + 1}.</span>
                <span>{p}</span>
                <button
                  onClick={() => removePlayer(p)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* MODE: TEAM */}
        {mode === "team" && (
          <div className="text-center">
            <div className="flex justify-center gap-3 mb-4">
              <button
                onClick={spinAndAssign}
                className="bg-green-500 text-white px-4 py-2 rounded shadow"
              >
                Chia Team
              </button>
              <button
                onClick={assignLanes}
                disabled={!team1.length && !team2.length}
                className={`px-4 py-2 rounded shadow ${
                  team1.length || team2.length
                    ? "bg-orange-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Random Lane
              </button>
              <button
                onClick={() => setShowDuckRace(true)}
                disabled={!team1.length && !team2.length}
                className={`px-4 py-2 rounded shadow ${
                  team1.length || team2.length
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                🦆 Đua Vịt
              </button>
            </div>

            {(team1.length > 0 || team2.length > 0) && (
              <>
                {isSpinning && <SpinAnimation displayName={displayName} />}
                <TeamDisplay
                  team1={team1WithLane.length ? team1WithLane : team1}
                  team2={team2WithLane.length ? team2WithLane : team2}
                  spinTime={""}
                />
                {showDuckRace && (
                  <DuckRandom team1={team1} team2={team2} lanes={LANES} />
                )}
              </>
            )}
          </div>
        )}

        {/* MODE: HERO */}
        {mode === "hero" && (
          <div>
            <div className="text-center mb-6">
              <button
                onClick={randomHeroes}
                className="bg-green-600 text-white px-6 py-2 rounded shadow"
              >
                Random Tướng cho tất cả
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {Object.entries(results).map(([player, roles]) => (
                <div
  key={player}
  className="group relative bg-white shadow-lg rounded-2xl p-6 
             transform transition-all duration-300 
             hover:-translate-y-2 hover:shadow-2xl hover:ring-4 hover:ring-blue-400"
>
  <img
    src="/images/cow.png"
    alt="highlight"
    className="absolute -top-14 left-1/2 transform -translate-x-1/2 
               w-16 h-16 opacity-0 transition-all duration-300 
               pointer-events-none
               group-hover:opacity-100 group-hover:-translate-y-2"
  />
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    {player}
                  </h2>
                  <div className="flex flex-col gap-2">
                    {Object.entries(roles).map(([role, hero]) => (
                      <div key={role} className="flex justify-between">
                        <span className="font-bold">{role}</span>
                        <span className="text-blue-600">{hero}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
