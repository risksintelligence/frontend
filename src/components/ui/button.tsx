import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const getButtonClasses = (variant: string = "default", size: string = "default") => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded font-mono text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-[#39FF14] text-black hover:bg-[#39FF14]/90 border border-[#39FF14]",
    outline: "border border-[#00D4AA] bg-transparent text-[#00D4AA] hover:bg-[#00D4AA] hover:text-black",
    secondary: "bg-[#00D4AA]/20 text-[#00D4AA] hover:bg-[#00D4AA]/30 border border-[#00D4AA]/30",
    ghost: "hover:bg-[#00D4AA]/10 hover:text-[#00D4AA] text-[#00D4AA]/80",
    link: "text-[#39FF14] underline-offset-4 hover:underline",
    destructive: "bg-red-500/20 text-red-400 border border-red-500 hover:bg-red-500 hover:text-white",
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded px-3",
    lg: "h-11 rounded px-8",
    icon: "h-10 w-10",
  };
  
  return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${sizeClasses[size as keyof typeof sizeClasses]}`;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const buttonClasses = `${getButtonClasses(variant, size)} ${className || ""}`;

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: buttonClasses,
        ...props,
      });
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
