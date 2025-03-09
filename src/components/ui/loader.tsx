import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary";
  text?: string;
  showText?: boolean;
}

export const Loader = ({
  size = "md",
  variant = "primary",
  text = "Loading...",
  showText = true,
  className,
  ...props
}: LoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const variantClasses = {
    default: "border-gray-300 border-t-gray-600",
    primary: "border-purple-200 border-t-purple-600",
    secondary: "border-blue-200 border-t-blue-600",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)} {...props}>
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {showText && (
        <p className={cn(
          "mt-2 text-gray-600",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base"
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export const LoaderOverlay = ({
  children,
  isLoading,
  text,
  variant = "primary",
}: {
  children: React.ReactNode;
  isLoading: boolean;
  text?: string;
  variant?: "default" | "primary" | "secondary";
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <Loader variant={variant} size="lg" text={text} />
      </div>
    </div>
  );
};

export const LoaderFull = ({
  text = "Loading data...",
  variant = "primary",
}: {
  text?: string;
  variant?: "default" | "primary" | "secondary";
}) => {
  return (
    <div className="min-h-[250px] w-full flex items-center justify-center">
      <Loader variant={variant} size="lg" text={text} />
    </div>
  );
};

export const SkeletonLoader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-md h-4 mb-2" />
      ))}
      <div className="bg-gray-200 rounded-md h-4 w-2/3" />
    </div>
  );
};
