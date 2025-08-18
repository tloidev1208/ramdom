'use client';
import React, { useState } from "react";

export default function App() {
  const [name, setName] = useState<string>("");
  const [names, setNames] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [spinTime, setSpinTime] = useState<string>("");

  const addName = (): void => {
    if (name.trim() !== "") {
      setNames((prev) => [...prev, name.trim()]);
      setName("");
    }
  };

  const shuffleArray = (array: string[]): string[] => {
    let newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const spinAndAssign = (): void => {
    if (names.length < 2 || isSpinning) return;

    setIsSpinning(true);
    setTeam1([]);
    setTeam2([]);
    setSpinTime(""); // reset trước khi quay

    let counter = 0;
    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setDisplayName(randomName);
      counter++;

      if (counter > 20) {
        clearInterval(interval);

        // Lưu thời gian quay
        const now = new Date();
        const formatted =
          now.toLocaleDateString("vi-VN") +
          " " +
          now.toLocaleTimeString("vi-VN");
        setSpinTime(formatted);

        const shuffled: string[] = shuffleArray(names);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-6">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700 text-center drop-shadow">
          🎯 Random Teams Liên Quân
        </h1>

        {/* Nhập tên */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2 w-full justify-center">
          <input
            type="text"
            placeholder="Nhập tên..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addName()}
            className="border-2 border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 transition w-full sm:w-1/2 text-gray-800"
          />
          <div className="flex gap-2">
            <button
              onClick={addName}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition w-full sm:w-auto"
            >
              Thêm
            </button>
            <button
              onClick={spinAndAssign}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition w-full sm:w-auto"
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
              className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-purple-600 transition w-full sm:w-auto"
            >
              Nhập danh sách mặc định
            </button>
          </div>
        </div>

        {/* Danh sách chờ */}
        <div className="mt-2 w-full">
          <h3 className="font-semibold mb-2 text-gray-700">📋 Danh sách chờ:</h3>
          {names.length > 0 ? (
            <div className="overflow-x-auto max-h-80">
              <table className="min-w-full bg-white border rounded-lg shadow text-gray-800">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">STT</th>
                    <th className="px-4 py-2 border-b text-left">Tên</th>
                    <th className="px-4 py-2 border-b text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {names.map((n, i) => (
                    <tr key={n + i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b font-bold">{i + 1}</td>
                      <td className="px-4 py-2 border-b">{n}</td>
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => {
                            setNames(names.filter((_, idx) => idx !== i));
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs justify-center"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="italic text-gray-400">Không có ai</p>
          )}
        </div>

        {/* Animation tên */}
        {displayName && isSpinning && (
          <div className="mt-8 p-6 text-3xl font-extrabold border-4 border-yellow-400 w-fit rounded-xl bg-yellow-100 shadow-lg animate-bounce">
            {displayName}
          </div>
        )}

        {/* Ngày giờ quay */}
        {!isSpinning && spinTime && (team1.length > 0 || team2.length > 0) && (
          <div className="mt-6 text-center text-gray-500 text-sm font-medium">
            <span>🕒 Quay lúc: {spinTime}</span>
          </div>
        )}

        {/* Hai team */}
        {!isSpinning && (team1.length > 0 || team2.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 w-full text-gray-800">
            <div className="bg-blue-50 rounded-xl p-4 shadow max-h-100 overflow-y-auto">
              <h2 className="text-xl font-bold mb-3 text-blue-700 text-center">
                🏆 Team 1
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {team1.map((n, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-lg shadow text-center font-bold border border-blue-200"
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-pink-50 rounded-xl p-4 shadow max-h-100 overflow-y-auto">
              <h2 className="text-xl font-bold mb-3 text-pink-700 text-center">
                🥇 Team 2
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {team2.map((n, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-lg shadow text-center font-bold border border-pink-200"
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
