"use client";
import React from "react";

interface Props {
  names: string[];
  setNames: (names: string[]) => void;
}

export default function NameList({ names, setNames }: Props) {
  return (
    <div className="mt-2 w-full">
      <h3 className="font-semibold mb-2 text-gray-700">📋 Danh sách chờ:</h3>
      {names.length > 0 ? (
        <div className="overflow-x-auto max-h-40">
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
                      onClick={() => setNames(names.filter((_, idx) => idx !== i))}
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
  );
}
