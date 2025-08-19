"use client";
import React from "react";

export default function SpinAnimation({ displayName }: { displayName: string }) {
  return (
    <div className="mt-8 p-6 text-3xl font-extrabold border-4 border-yellow-400 w-fit rounded-xl bg-yellow-100 shadow-lg animate-bounce">
      {displayName}
    </div>
  );
}
