import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({ 
  children, 
  onClick, 
  variant = "default", 
  size = "md", 
  className = "",
  type = "button"
}: ButtonProps) {
  const base = "rounded focus:outline-none transition-colors";
  const variantClass = variant === "ghost"
    ? "bg-transparent text-gray-700 hover:bg-gray-100"
    : "bg-blue-500 text-white hover:bg-blue-600";
  const sizeClass = size === "sm"
    ? "px-1 py-0.5 text-xs"
    : size === "lg"
    ? "px-4 py-2 text-lg"
    : "px-2 py-1 text-sm";
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={cn(base, variantClass, sizeClass, className)}
    >
      {children}
    </button>
  );
}
