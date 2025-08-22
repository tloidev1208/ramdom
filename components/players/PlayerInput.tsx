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
        className="w-[278rem] h-[61rem] flex items-center justify-center 
             text-[#edbe80] text-[20.75rem] font-bold 
             transition-all duration-300 
             bg-[url('./../img/btn-more.png')] bg-no-repeat bg-[length:100%_100%] bg-[position:0_0]">
        Thêm mớ
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
