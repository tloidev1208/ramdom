"use client";
import { useState, useEffect } from "react";
import PlayerInput from "@/components/players/PlayerInput";
import PlayerList from "@/components/players/PlayerList";
import TeamActions from "@/components/teams/TeamActions";

// Lane type
type Lane = {
  key: string;
  color: string;
  bg: string;
  icon: string;
};

// TeamDisplay gom vào chung
interface TeamDisplayProps {
  team: (string | { name: string; lane: Lane })[];
  results: Record<string, Record<string, { name: string; img: string }[]>>;
  title: string;
  color: string;
  dateTime?: string;
}

function TeamDisplay({
  team,
  results,
  title,
  color,
  dateTime,
}: TeamDisplayProps) {
  const [selectedGame, setSelectedGame] = useState(1);

  return (
    <div className="bg-gray-900/80 rounded-xl shadow p-4">
      {dateTime && (
        <p className="text-xl text-white mb-4">🕔Random lúc: {dateTime}</p>
      )}
      <select
        value={selectedGame}
        onChange={(e) => setSelectedGame(Number(e.target.value))}
        className=" rounded-xl px-4 py-2 text-lg font-semibold text-white bg-gradient-to-r from-[#E7B97E] to-transparent shadow-md hover:shadow-lg transition duration-300"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            Game {num}
          </option>
        ))}
      </select>
      <h2 className={`text-2xl font-bold mb-4 text-center ${color}`}>
        {title}
      </h2>

      <ul className="space-y-3">
        {team.map((member, idx) => {
          const name = typeof member === "string" ? member : member.name;
          const lane = typeof member === "string" ? undefined : member.lane;
          const heroList = results[name];

          return (
            <li
              key={name}
              className="flex text-white text-lg flex-col sm:flex-row sm:items-center gap-2 bg-black/30 rounded-lg shadow px-4 py-2"
            >
              <span className="font-bold">{idx + 1}.</span>
              <span className="w-[150px]">{name}</span>

              {lane && (
                <div className="flex items-center gap-1 w-20">
                  <img src={lane.icon} alt={lane.key} className="" />
                  <span>{lane.key}</span>
                </div>
              )}

              {heroList &&
                Object.entries(heroList).map(([role, heroes]) => (
                  <div key={role} className="flex flex-wrap gap-2">
                    {heroes.map((h: { name: string; img: string }, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-2 text-white px-2 rounded text-sm w-35"
                      >
                        <img
                          src={h.img}
                          alt={h.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <span className="text-sm">{h.name}</span>
                      </div>
                    ))}
                  </div>
                ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ================= MAINPAGE =================

const LANES: Lane[] = [
  {
    key: "RỪNG",
    color: "text-green-600",
    bg: "bg-green-100",
    icon: "/images/rung.png",
  },
  {
    key: "TOP",
    color: "text-blue-600",
    bg: "bg-blue-100",
    icon: "/images/dau-si.png",
  },
  {
    key: "MID",
    color: "text-purple-600",
    bg: "bg-purple-100",
    icon: "/images/phap-su.png",
  },
  {
    key: "AD",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    icon: "/images/xa-thu.png",
  },
  {
    key: "SP",
    color: "text-pink-600",
    bg: "bg-pink-100",
    icon: "/images/do-don.png",
  },
];

const laneMapApi: Record<string, number[]> = {
  RỪNG: [28, 32],
  TOP: [28, 32],
  MID: [29],
  AD: [33],
  SP: [30, 31],
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
  const [results, setResults] = useState<
    Record<string, Record<string, { name: string; img: string }[]>>
  >({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [dateTime, setDateTime] = useState("");

  const [heroes, setHeroes] = useState<
    { name: string; types: number[]; img: string }[]
  >([]);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await fetch("/api/heroes");
        const data = await res.json();

        const formatted = data.map((h: any) => {
          let types: number[] = [];
          if (typeof h.type === "string") {
            types = h.type
              .replace(/[\[\]\s]/g, "")
              .split(",")
              .filter(Boolean)
              .map(Number);
          }
          return { ...h, types };
        });

        setHeroes(formatted);
      } catch (err) {
        console.error("Lỗi fetch heroes:", err);
        setHeroes([]);
      }
    };

    fetchHeroes();
  }, []);

  const addPlayer = (name: string) => {
    if (!players.includes(name)) setPlayers([...players, name]);
  };

  const removePlayer = (name: string) => {
    setPlayers(players.filter((p) => p !== name));
  };

  useEffect(() => {
    if (team1WithLane.length > 0 || team2WithLane.length > 0) {
      randomHeroes();
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
      "Phong",
    ]);

  const resetDateTime = () => {
    const now = new Date();
    setDateTime(
      now.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) +
        " " +
        now.toLocaleTimeString("vi-VN")
    );
  };

  const spinAndAssign = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const shuffled = shuffleArray(players);
      setTeam1(shuffled.filter((_, i) => i % 2 === 0));
      setTeam2(shuffled.filter((_, i) => i % 2 === 1));
      setTeam1WithLane([]);
      setTeam2WithLane([]);
      setIsSpinning(false);
      resetDateTime(); // reset lại thời gian
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
    resetDateTime(); // reset lại thời gian
  };

  const randomHeroes = () => {
    if (heroes.length === 0) return;

    const newResults: Record<
      string,
      Record<string, { name: string; img: string }[]>
    > = {};
    const allPlayersWithLane = [...team1WithLane, ...team2WithLane];

    const playersByLane: Record<string, { name: string; lane: Lane }[]> = {};
    allPlayersWithLane.forEach((player) => {
      if (!playersByLane[player.lane.key]) playersByLane[player.lane.key] = [];
      playersByLane[player.lane.key].push(player);
    });

    Object.entries(playersByLane).forEach(([laneKey, players]) => {
      const types = laneMapApi[laneKey] ?? [];
      const pool = heroes.filter((h) => h.types.some((t) => types.includes(t)));

      const shuffledPool = shuffleArray(pool);

      players.forEach((player, idx) => {
        const start = idx * 5;
        const assigned = shuffledPool
          .slice(start, start + 5)
          .map((h) => ({ name: h.name, img: h.img }));

        if (!newResults[player.name]) newResults[player.name] = {};
        newResults[player.name][laneKey] = assigned;
      });
    });

    setResults(newResults);
    resetDateTime(); // reset lại thời gian
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center px-4 py-6"
      style={{ backgroundImage: "url('/images/bg-academy.jpg')" }}
    >
      <div className="w-full max-w-6xl mx-auto bg-black/30 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-[#E2C499] text-center">
          🎮 RANDOM TOOL
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6 ">
            <TeamDisplay
              team={team1WithLane.length ? team1WithLane : team1}
              results={results}
              title="Team 1"
              color="text-[#DBAF78]"
              dateTime={dateTime}
            />
            <TeamDisplay
              team={team2WithLane.length ? team2WithLane : team2}
              results={results}
              title="Team 2"
              color="text-[#DBAF78]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
