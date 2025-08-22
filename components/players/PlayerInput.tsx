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
    <div className="text-white flex flex-col sm:flex-row gap-2 mb-6 justify-center text-center items-center">
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Nhập tên người chơi"
        className="border p-2 rounded w-64 text-white"
      />
      <button
        onClick={handleAdd}
         className="w-40 h-12 flex items-center justify-start px-4 
             text-[#edbe80] text-xl font-bold 
             transition-all duration-300 
             bg-[url('/images/download.png')] bg-no-repeat bg-[length:100%_100%] bg-[position:0_0]">
        Thêm mới
      </button>
      <div className="text-white">hoặc</div>
      <button
        onClick={onDefault}
        className="w-70 h-12 flex items-center justify-start px-4 
             text-[#edbe80] text-xl font-bold 
             transition-all duration-300 
             bg-[url('/images/download.png')] bg-no-repeat bg-[length:100%_100%] bg-[position:0_0]">
        Danh sách mặc định
      </button>
    </div>
  );
}
