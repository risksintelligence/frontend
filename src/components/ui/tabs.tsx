"use client";

import * as React from "react";
import clsx from "clsx";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ defaultValue, value, onValueChange, className, children, ...props }: TabsProps) {
  const [current, setCurrent] = React.useState<string>(value ?? defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrent(value);
    }
  }, [value]);

  const setValue = (v: string) => {
    if (value === undefined) {
      setCurrent(v);
    }
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div className={className} {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center rounded-md bg-terminal-surface border border-terminal-border p-1 text-terminal-text",
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    const active = ctx?.value === value;
    return (
      <button
        type="button"
        ref={ref}
        onClick={() => ctx?.setValue(value)}
        className={clsx(
          "inline-flex min-w-[80px] items-center justify-center rounded px-3 py-1 text-sm font-medium transition-colors",
          active
            ? "bg-terminal-accent text-black"
            : "text-terminal-muted hover:text-terminal-text",
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    if (!ctx || ctx.value !== value) return null;
    return (
      <div ref={ref} className={clsx("mt-3", className)} {...props}>
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";
