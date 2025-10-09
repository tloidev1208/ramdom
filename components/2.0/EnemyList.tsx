import React from "react";

export default function EnemyList({ enemyPicks }: { enemyPicks: (null | string)[] }) {
  return (
    <aside className="w-56 flex-shrink-0">
      <h3 className="text-lg font-semibold mb-3">Đội đối phương</h3>
      <div className="space-y-3">
        {enemyPicks.map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-white/3 p-2 rounded-lg">
            <div className="w-12 h-12 rounded-md bg-gray-700 flex items-center justify-center text-gray-300">?</div>
            <div className="flex-1">
              <div className="text-sm text-gray-200">Chưa chọn</div>
              <div className="text-xs text-gray-400">Slot {idx + 1}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Ghi chú: click để chọn tướng, dùng nút ở trái để yêu cầu hỗ trợ.
      </div>
    </aside>
  );
}
