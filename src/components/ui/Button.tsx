import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover focus:ring-brand/30 disabled:bg-brand/50",
  secondary:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
  ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-200",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
