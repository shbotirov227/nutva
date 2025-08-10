import React from "react";

export function Separator({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={`my-4 h-px w-full bg-border dark:bg-neutral-700 ${className}`.trim()}
      {...props}
    />
  );
}

export default Separator;
