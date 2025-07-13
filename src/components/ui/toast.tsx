"use client";


import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg",
        type === "error" && "bg-red-100 text-red-800 border border-red-200",
        type === "success" && "bg-green-100 text-green-800 border border-green-200",
        type === "info" && "bg-blue-100 text-blue-800 border border-blue-200"
      )}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
