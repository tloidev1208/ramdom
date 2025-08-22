"use client";
import { useState, useEffect } from "react";
import { heroes } from "@/app/LegendRamdom/heroes";
import PlayerInput from "@/components/players/PlayerInput";
import PlayerList from "@/components/players/PlayerList";
import TeamActions from "@/components/teams/TeamActions";
import TeamDisplay from "@/components/teams/TeamDisplay";

import { Lane } from "@/types";

const LANES: Lane[] = [
  { key: "RỪNG", color: "text-green-600", bg: "bg-green-100", icon: "🌲" },
  { key: "TOP", color: "text-blue-600", bg: "bg-blue-100", icon: "🗡️" },
  { key: "MID", color: "text-purple-600", bg: "bg-purple-100", icon: "🔥" },
  { key: "AD", color: "text-yellow-600", bg: "bg-yellow-100", icon: "🏹" },
  { key: "SP", color: "text-pink-600", bg: "bg-pink-100", icon: "🛡️" },
];

// mapping lane -> nhóm hero trong heroes.ts
const laneMap: Record<string, string[]> = {
  RỪNG: ["🗡️Đấu sĩ", "⚔️Sát thủ"],
  TOP: ["🗡️Đấu sĩ", "⚔️Sát thủ"],
  MID: ["🔥Pháp sư"],
  AD: ["🏹Xạ thủ"],
  SP: ["🛡️Trợ thủ"],
};


const shuffleArray = <T,>(array: T[]): T[] => {
  let newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function MainPage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [team1WithLane, setTeam1WithLane] = useState<
    { name: string; lane: Lane }[]
  >([]);
  const [team2WithLane, setTeam2WithLane] = useState<
    { name: string; lane: Lane }[]
  >([]);
  const [results, setResults] = useState<Record<string, Record<string, string[]>>>({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [dateTime, setDateTime] = useState("");

  const addPlayer = (name: string) => {
    if (!players.includes(name)) setPlayers([...players, name]);
  };

  const removePlayer = (name: string) => {
    setPlayers(players.filter((p) => p !== name));
  };
  
  useEffect(() => {
  if (team1WithLane.length > 0 || team2WithLane.length > 0) {
    randomHeroes(); // tự chạy random hero khi vừa random lane
  }
}, [team1WithLane, team2WithLane]);


  const setDefaultPlayers = () =>
    setPlayers([
      "Lợi (Masaru)",
      "Huy (Écccpẹcpẹcpẹc)",
      "Minh (iamminh)",
      "Thắng (Gia Cát Lượng)",
      "Gia Bảo (ThằngNàoZậy)",
      "Hoàng Bảo (HoànqBảooo)",
      "Hưng (~THD~Bucky)",
      "Kiệt (PhởBEEF)",
      "Nam (Vinamilk)",
      "Trường (ⒷⓁⓊⒺⓈ)",
    ]);

  const spinAndAssign = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const shuffled = shuffleArray(players);
      setTeam1(shuffled.filter((_, i) => i % 2 === 0));
      setTeam2(shuffled.filter((_, i) => i % 2 === 1));
      setTeam1WithLane([]);
      setTeam2WithLane([]);
      setIsSpinning(false);
    }, 2000);
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

const randomHeroes = () => {
  const newResults: Record<string, Record<string, string[]>> = {};

  // lấy heroes theo laneMap
  const allPlayersWithLane = [...team1WithLane, ...team2WithLane];

  allPlayersWithLane.forEach(({ name, lane }) => {
    const roles = laneMap[lane.key] ?? []; // ví dụ RỪNG -> ["🗡️Đấu sĩ", "⚔️Sát thủ"]

    // gộp heroes từ nhiều role lại
    const list = roles.flatMap((r) => heroes[r] || []);

    // random 5 con
    const shuffled = shuffleArray(list).slice(0, 5);

    if (!newResults[name]) newResults[name] = {};
    newResults[name][lane.key] = shuffled; // lưu hero theo lane
  });

  setResults(newResults);
};


  useEffect(() => {
    const now = new Date();
    setDateTime(
      now.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) + " " + now.toLocaleTimeString("vi-VN")
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700 text-center">
          🎮 Random Tool
        </h1>

        <PlayerInput onAdd={addPlayer} onDefault={setDefaultPlayers} />
        <PlayerList players={players} onRemove={removePlayer} />

        <TeamActions
          onSpin={spinAndAssign}
          onLane={assignLanes}
          onHero={randomHeroes}
          isSpinning={isSpinning}
          canAssign={!!(team1.length || team2.length)}
        />

        {(team1.length > 0 || team2.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <TeamDisplay
              team={team1WithLane.length ? team1WithLane : team1}
              results={results}
              title="Team 1"
              color="text-green-700"
              dateTime={dateTime}
            />
            <TeamDisplay
              team={team2WithLane.length ? team2WithLane : team2}
              results={results}
              title="Team 2"
              color="text-purple-700"
            />
          </div>
        )}
      </div>
    </div>
  );
}
