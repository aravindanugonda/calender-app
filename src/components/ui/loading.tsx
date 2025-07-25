"use client";

export function Loading() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400"></div>
      <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400" style={{ animationDelay: "0.2s" }}></div>
      <div className="w-4 h-4 rounded-full animate-pulse bg-blue-400" style={{ animationDelay: "0.4s" }}></div>
    </div>
  );
}
