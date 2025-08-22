"use client";
import React from "react";

interface Props {
  name: string;
  setName: (value: string) => void;
  addName: () => void;
}

export default function NameInput({ name, setName, addName }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
      <input
        type="text"
        placeholder="Nhập tên..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addName()}
        className="border-2 border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 transition w-full sm:w-1/2 text-gray-800"
      />
      <button
        onClick={addName}
        className="w-[278rem] h-[61rem] flex items-center justify-center 
             text-[#edbe80] text-[20.75rem] font-bold 
             transition-all duration-300 
             bg-[url('./../img/btn-more.png')] bg-no-repeat bg-[length:100%_100%] bg-[position:0_0]">
        Thêm mới
      </button>
    </div>
  );
}
