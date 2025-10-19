"use client";
import React, { useEffect, useState, useRef } from "react";

type Skin = { id: string; name: string; img: string | null };
type SkillImg = { id: string; title: string; img: string | null };
type ApiResult = {
  hero: string;
  main: Skin | null;
  skins: Skin[];
  skills?: SkillImg[];
  source?: string;
};
type Mode = "skin" | "skill";
type HeroBasic = { name: string; img?: string };

export default function GuessGamePage() {
  const [mode, setMode] = useState<Mode>("skin");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [correctHero, setCorrectHero] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [randomPos, setRandomPos] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allHeroes, setAllHeroes] = useState<HeroBasic[]>([]);
  const [suggestions, setSuggestions] = useState<HeroBasic[]>([]);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/heroes");
        if (res.ok) {
          const data = await res.json();
          setAllHeroes(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("fetch heroes list error", e);
      }
    })();
  }, []);

  const startGame = async () => {
    setLoading(true);
    setShowAnswer(false);
    setAnswer("");
    setSuggestions([]);
    setHighlighted(-1);
    setImageUrl(null);

    try {
      const randomRes = await fetch("/api/heroes/random");
      if (!randomRes.ok) throw new Error("Không lấy được tướng random");
      const randomHero = await randomRes.json();
      const heroName = randomHero?.name;
      if (!heroName) throw new Error("Random hero không hợp lệ");

      const res = await fetch(`/api/heroes/${encodeURIComponent(heroName)}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `API error ${res.status}`);
      }
      const data = (await res.json()) as ApiResult;

      if (mode === "skin") {
        const skinList = data.skins || [];
        const chosen =
          skinList.length > 0
            ? skinList[Math.floor(Math.random() * skinList.length)]
            : data.main;
        if (chosen?.img) {
          setImageUrl(chosen.img);
          setCorrectHero(data.hero);
          setRandomPos({
            x: Math.floor(Math.random() * 220),
            y: Math.floor(Math.random() * 220),
          });
        } else {
          setImageUrl(null);
        }
      } else {
        const skills = data.skills || [];
        if (skills.length > 0) {
          const chosen = skills[Math.floor(Math.random() * skills.length)];
          if (chosen.img) {
            setImageUrl(chosen.img);
            setCorrectHero(data.hero);
            setRandomPos({ x: 0, y: 0 });
          } else {
            setImageUrl(null);
          }
        } else {
          setImageUrl(null);
        }
      }
    } catch (err: any) {
      console.error("startGame error", err);
      alert("Không lấy được dữ liệu hình ảnh: " + (err?.message || err));
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const checkAnswer = () => {
    if (!correctHero) return;
    if (answer.trim().toLowerCase() === correctHero.toLowerCase()) {
      setShowAnswer(true);
      setScore((s) => s + 1);
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 3000);
    } else {
      alert("❌ Sai rồi! Thử lại hoặc bấm Bỏ qua.");
    }
  };

  const handleInputChange = (val: string) => {
    setAnswer(val);
    setHighlighted(-1);
    if (val.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = allHeroes.filter((h) =>
      h.name.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 6));
  };

  // keyboard handler for input: arrow navigation + enter to pick suggestion
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setHighlighted((h) => {
        const next = h + 1;
        return next >= suggestions.length ? suggestions.length - 1 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setHighlighted((h) => {
        const next = h - 1;
        return next < 0 ? 0 : next;
      });
    } else if (e.key === "Enter") {
      if (highlighted >= 0 && suggestions[highlighted]) {
        const sel = suggestions[highlighted].name;
        setAnswer(sel);
        setSuggestions([]);
        setHighlighted(-1);
        // keep focus on input
        setTimeout(() => inputRef.current?.focus(), 0);
      } else {
        checkAnswer();
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlighted(-1);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('/images/bg-academy.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* congrats banner + simple confetti */}
      {showCongrats && (
        <>
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
            <span className="text-2xl">🎉</span>
            <div className="font-semibold">Chúc mừng — chính xác!</div>
          </div>

          <div className="pointer-events-none fixed inset-0 z-40">
            {Array.from({ length: 12 }).map((_, i) => {
              const left = Math.round(Math.random() * 100) + "%";
              const delay = `${i * 80}ms`;
              const size = `${12 + Math.round(Math.random() * 18)}px`;
              const emoji = ["🎊", "🎉", "✨", "🥳"][i % 4];
              return (
                <span
                  key={i}
                  style={{
                    left,
                    top: `${10 + Math.random() * 40}%`,
                    fontSize: size,
                    animationDelay: delay,
                  }}
                  className="absolute animate-[confetti_900ms_ease-out_forwards]"
                >
                  {emoji}
                </span>
              );
            })}
          </div>

          <style>{`
            @keyframes confetti {
              0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(160vh) rotate(360deg); opacity: 0; }
            }
          `}</style>
        </>
      )}

      <div className="w-full max-w-4xl backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold drop-shadow">
              🎮 Đoán tên tướng
            </h1>
            <p className="text-sm text-white/80 mt-1">
              Chọn chế độ, nhìn ảnh và đoán tên
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white/80">🏆 {score}</div>
            <div className="flex bg-white/10 rounded-full p-1">
              <button
                onClick={() => setMode("skin")}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                  mode === "skin"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "hover:bg-white/5"
                }`}
              >
                Đoán Skin
              </button>
              <button
                onClick={() => setMode("skill")}
                className={`ml-1 px-3 py-1 rounded-full text-sm font-semibold transition ${
                  mode === "skill"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "hover:bg-white/5"
                }`}
              >
                Đoán Kỹ năng
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image card */}
          <div className="md:col-span-2 bg-white/5 rounded-lg p-4 flex flex-col items-center relative overflow-hidden">
            <div className="w-full mb-4 flex justify-between items-start">
              <div>
                <div className="text-sm text-white/80">Chế độ</div>
                <div className="text-lg font-semibold">
                  {mode === "skin" ? "Skin" : "Kỹ năng"}
                </div>
              </div>
              <div>
                <button
                  onClick={startGame}
                  className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-md text-white font-semibold shadow"
                >
                  {loading ? "Đang tải..." : "Bắt đầu mới"}
                </button>
              </div>
            </div>

            <div className="relative w-full h-[360px] rounded-lg bg-gray-900/40 flex items-center justify-center overflow-hidden shadow-inner">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="hidden"
                  className="absolute transition-transform duration-700"
                  style={
                    mode === "skin"
                      ? {
                          objectFit: "cover",
                          width: "600px",
                          height: "600px",
                          transform: `translate(-${randomPos.x}px, -${randomPos.y}px) scale(1.0)`,
                        }
                      : {
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          transform: "none",
                        }
                  }
                />
              ) : (
                <div className="text-gray-300">Không có ảnh</div>
              )}

              {/* dark mask when not revealed */}
              {!showAnswer && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 pointer-events-none" />
              )}

              {/* reveal / info */}
              {showAnswer && (
                <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-2 rounded text-sm">
                  <span className="font-semibold">{correctHero}</span>
                </div>
              )}
            </div>

            <div className="w-full mt-4 flex items-center justify-between">
              <div className="text-sm text-white/80">
                {showAnswer
                  ? `Đã tiết lộ: ${correctHero}`
                  : "Nhập tên tướng để đoán"}
              </div>
              <div className="text-sm text-white/60">Nguồn: API nội bộ</div>
            </div>
          </div>

          {/* Controls & skins panel */}
          <div className="bg-white/5 rounded-lg p-4 flex flex-col gap-4">
            <div>
              <label className="text-xs text-white/80">Nhập tên tướng</label>
              <div className="relative mt-2">
                <input
                  ref={inputRef}
                  value={answer}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ví dụ: biron"
                  className="w-full px-3 py-2 rounded-md bg-white/6 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 bg-white/95 text-black rounded-b-md shadow max-h-44 overflow-auto mt-1 z-20">
                    {suggestions.map((s, i) => (
                      <div
                        key={i}
                        onMouseEnter={() => setHighlighted(i)}
                        onMouseLeave={() => setHighlighted(-1)}
                        onClick={() => {
                          setAnswer(s.name);
                          setSuggestions([]);
                          setHighlighted(-1);
                          setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                        className={`px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2 ${
                          i === highlighted ? "bg-indigo-100" : ""
                        }`}
                      >
                        {s.img ? (
                          <>
                            <img
                              src={s.img}
                              alt={s.name}
                              className="w-8 h-8 rounded"
                            />
                            <span>{s.name}</span>
                          </>
                        ) : (
                          <div>{s.name}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={checkAnswer}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md font-semibold"
                disabled={loading}
              >
                Đoán
              </button>
              <button
                onClick={() => {
                  setShowAnswer(true);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md font-semibold"
              >
                Tiết lộ
              </button>
            </div>

            <div className="mt-2">
              <div className="text-xs text-white/80 mb-2">
                Các skin / kỹ năng (chạm để xem)
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3 text-sm text-white/70">
                  Các thumbnail sẽ xuất hiện khi có dữ liệu
                </div>
              </div>
            </div>

            <div className="mt-auto text-center text-sm text-white/60">
              <div>
                Điểm của bạn: <span className="font-semibold">{score}</span>
              </div>
              <div className="text-xs mt-2">
                Gợi ý: dùng autocomplete để chọn tên chính xác
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-white/70">
          Bản quyền nội dung thuộc trang nguồn. Sử dụng API nội bộ để lấy dữ liệu.
        </div>
      </div>
    </div>
  );
}
