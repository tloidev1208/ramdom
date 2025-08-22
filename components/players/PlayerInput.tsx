"use client";
import { useState } from "react";

interface PlayerInputProps {
  onAdd: (name: string) => void;
  onDefault: () => void;
}

export default function PlayerInput({ onAdd, onDefault }: PlayerInputProps) {
  const [playerName, setPlayerName] = useState("");

  const handleAdd = () => {
    if (playerName.trim()) {
      onAdd(playerName.trim());
      setPlayerName("");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6 justify-center text-center items-center">
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Nhập tên người chơi"
        className="border p-2 rounded w-64"
      />
      <button
        onClick={handleAdd}
        className="bg-purple-500 text-white px-4 py-2 rounded shadow w-[220px]"
      >
        Thêm mới
      </button>
      <div className="">hoặc</div>
      <button
        onClick={onDefault}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow"
      >
        Danh sách mặc định
      </button>
    </div>
  );
}
