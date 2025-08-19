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
        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition w-full sm:w-auto"
      >
        Thêm
      </button>
    </div>
  );
}
