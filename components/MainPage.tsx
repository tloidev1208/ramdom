"use client";
import { useState, useEffect } from "react";
import { heroes } from "@/app/LegendRamdom/heroes";
import TeamDisplay from "../components/TeamDisplay";
import DuckRandom from "../components/Duckramdom";

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
  // Chung
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<string>("");
  const [location, setLocation] = useState<string>("Đang lấy vị trí...");

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
  const [selectedGame, setSelectedGame] = useState<number>(1);

  // Hero mode
  const [results, setResults] = useState<
    Record<string, Record<string, string>>
  >({});

  const [mode, setMode] = useState<"main" | "duck">("main");

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
    const newResults: Record<string, Record<string, string>> = {};

    Object.entries(heroes).forEach(([role, list]) => {
      // Trộn danh sách hero của role đó
      const shuffled = shuffleArray(list);

      players.forEach((player, index) => {
        if (!newResults[player]) newResults[player] = {};

        // Gán hero theo thứ tự -> không bị trùng
        newResults[player][role] = shuffled[index % shuffled.length];
      });
    });

    setResults(newResults);
  };
  useEffect(() => {
    const now = new Date();

    // Format theo locale VN
    const formatted =
      now.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) +
      " " +
      now.toLocaleTimeString("vi-VN");

    setDateTime(formatted);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Gọi API OpenStreetMap để lấy tên địa điểm
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();

            if (data?.address) {
              const { suburb, city, town, village, state, country } =
                data.address;

              // Ghép thông tin địa điểm
              const locationName =
                suburb ||
                city ||
                town ||
                village ||
                state ||
                country ||
                "Không xác định";

              setLocation(`${locationName}`);
            } else {
              setLocation(`Vĩ độ: ${latitude}, Kinh độ: ${longitude}`);
            }
          } catch (error) {
            setLocation("Không lấy được địa điểm thực tế");
          }
        },
        (error) => {
          setLocation("Không lấy được vị trí: " + error.message);
        }
      );
    } else {
      setLocation("Trình duyệt không hỗ trợ Geolocation");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700 text-center">
          🎮 Random Tool
        </h1>

        {mode === "main" && (
          <>
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
                  ])
                }
                className="bg-blue-500 text-white px-4 py-2 rounded shadow"
              >
                Danh sách mặc định
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

            {/* TEAM & HERO RANDOM ON SAME PAGE */}
            <div className="text-center">
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={spinAndAssign}
                  disabled={isSpinning}
                  className={`px-4 py-2 rounded shadow ${
                    isSpinning
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {isSpinning ? "Đang xử lý..." : "Chia Team"}
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
                  onClick={randomHeroes}
                  disabled={!team1.length && !team2.length}
                  className={`className="bg-green-600 px-6 py-2 rounded shadow ${
                    team1.length || team2.length
                      ? "bg-orange-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  Random Tướng cho tất cả
                </button>
                {/* <button
                  onClick={() => setMode("duck")}
                  disabled={!team1.length && !team2.length}
                  className={`px-4 py-2 rounded shadow ${
                    team1.length || team2.length
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  🦆 Đua Vịt
                </button>*/}
              </div>

              {(team1.length > 0 || team2.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
                  {/* Team 1 */}
                  <div className="bg-gray-50 rounded-xl shadow p-4">
                    <p className="text-sm text-gray-800">
                      🕔Random lúc: {dateTime}, {location}
                    </p>
                    <div className="flex items-center justify-between px-4 mb-4">
  {/* Select bên trái */}
  <select
    value={selectedGame}
    onChange={(e) => setSelectedGame(Number(e.target.value))}
    className="border border-gray-300 rounded-xl px-4 py-2 text-lg font-semibold 
               bg-gradient-to-r from-indigo-100 to-purple-100 
               shadow-md hover:shadow-lg transition duration-300"
  >
    {[1, 2, 3, 4, 5].map((num) => (
      <option key={num} value={num}>
        Game {num}
      </option>
    ))}
  </select>

  {/* Title nằm giữa */}
  <h2 className="text-2xl font-bold text-green-700 text-center flex-1">
    Team 1
  </h2>

  {/* Chừa 1 div trống bên phải để cân đối */}
  <div className="w-[120px]" />
</div>

                    <ul className="space-y-3">
                      {(team1WithLane.length ? team1WithLane : team1).map(
                        (member, idx) => {
                          const name =
                            typeof member === "string" ? member : member.name;
                          const lane =
                            typeof member === "string"
                              ? undefined
                              : member.lane;
                          const heroList = results[name];
                          return (
                            <li
                              key={name}
                              className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white rounded-lg shadow px-4 py-2"
                            >
                              <span className="font-bold">{idx + 1}.</span>
                              <span className="w-28">{name}</span>
                              {lane && (
                                <span
                                  className={`ml-2 px-2 py-1 rounded w-20 ${lane.bg} ${lane.color} text-xs`}
                                >
                                  {lane.icon} {lane.key}
                                </span>
                              )}
                              {heroList && (
                                <div className="flex flex-wrap gap-2 ml-2">
                                  {Object.entries(heroList).map(
                                    ([role, hero]) => (
                                      <span
                                        key={role}
                                        className="bg-blue-100 text-blue-700 w-[150px] px-2 py-1 rounded text-xs"
                                      >
                                        <b>{role}:</b> {hero}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                  {/* Team 2 */}
                  <div className="bg-gray-50 rounded-xl shadow p-4">
                    <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">
                      Team 2
                    </h2>
                    <ul className="space-y-3">
                      {(team2WithLane.length ? team2WithLane : team2).map(
                        (member, idx) => {
                          const name =
                            typeof member === "string" ? member : member.name;
                          const lane =
                            typeof member === "string"
                              ? undefined
                              : member.lane;
                          const heroList = results[name];
                          return (
                            <li
                              key={name}
                              className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white rounded-lg shadow px-4 py-2"
                            >
                              <span className="font-bold">{idx + 1}.</span>
                              <span className="w-25">{name}</span>
                              {lane && (
                                <span
                                  className={`ml-2 px-2 py-1 rounded w-20 ${lane.bg} ${lane.color} text-xs`}
                                >
                                  {lane.icon} {lane.key}
                                </span>
                              )}
                              {heroList && (
                                <div className="flex flex-wrap gap-2 ml-2">
                                  {Object.entries(heroList).map(
                                    ([role, hero]) => (
                                      <span
                                        key={role}
                                        className="bg-blue-100 text-blue-700 w-[150px] px-2 py-1 rounded text-xs"
                                      >
                                        <b>{role}:</b> {hero}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* HERO RANDOM RESULT */}
              {/* {Object.keys(results).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
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
              )} */}
            </div>
          </>
        )}

        {/* Duck Race Mode */}
        {mode === "duck" && (
          <div>
            <button
              onClick={() => setMode("main")}
              className="mb-4 px-4 py-2 rounded shadow bg-gray-200 hover:bg-gray-300"
            >
              ← Quay lại
            </button>
            <DuckRandom team1={team1} team2={team2} lanes={LANES} />
          </div>
        )}
      </div>
    </div>
  );
}
