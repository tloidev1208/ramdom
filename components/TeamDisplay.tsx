"use client";
import React from "react";

interface Lane {
  key: string;
  color: string;
  bg: string;
  icon: string;
}

interface Member {
  name: string;
  lane: Lane;
}

interface Props {
  team1: (string | Member)[];
  team2: (string | Member)[];
  spinTime: string;
}

export default function TeamDisplay({ team1, team2, spinTime }: Props) {
  const renderMember = (member: string | Member) => {
    if (typeof member === "string") return <>{member}</>;

    return (
      <div>
        <span className="font-bold">{member.name}</span>
        <span className={`block text-sm mt-1 ${member.lane.color}`}>
          {member.lane.icon} {member.lane.key}
        </span>
      </div>
    );
  };

  return (
    <>
      {spinTime && (team1.length > 0 || team2.length > 0) && (
        <div className="mt-6 text-center text-gray-500 text-sm font-medium">
          <span>🕒 Quay lúc: {spinTime}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 w-full text-gray-800">
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <h2 className="text-xl font-bold mb-3 text-[#DBAF78] text-center">
            🏆 Team 1
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {team1.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg shadow text-center border ${typeof m !== "string" ? m.lane.bg : "bg-white border-blue-200"}`}
              >
                {renderMember(m)}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-pink-50 rounded-xl p-4 shadow">
          <h2 className="text-xl font-bold mb-3 text-[#DBAF78] text-center">
            🥇 Team 2
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {team2.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg shadow text-center border ${typeof m !== "string" ? m.lane.bg : "bg-white border-pink-200"}`}
              >
                {renderMember(m)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
