// components/ui/dropdown-menu.tsx
"use client";
import * as React from "react";

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};
const MenuCtx = React.createContext<Ctx | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // close on outside click / Esc
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (contentRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <MenuCtx.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      <div className="relative inline-block">{children}</div>
    </MenuCtx.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild = false }: { children: React.ReactNode; asChild?: boolean }) {
  const ctx = React.useContext(MenuCtx)!;
  if (asChild && React.isValidElement(children)) {
    type ChildProps = { onClick?: (e: React.MouseEvent<HTMLElement>) => void } & Record<string, unknown>;
    const child = children as React.ReactElement<ChildProps>;
    const origOnClick = child.props.onClick;
    return React.cloneElement(child, {
      ref: ctx.triggerRef,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        origOnClick?.(e);
        ctx.setOpen(!ctx.open);
      },
      'aria-haspopup': 'menu',
      'aria-expanded': ctx.open,
    });
  }
  return (
    <button
      ref={ctx.triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      className="inline-flex"
      aria-haspopup="menu"
      aria-expanded={ctx.open}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  className = "",
  children,
  align = "end",
}: {
  className?: string;
  children: React.ReactNode;
  align?: "start" | "end";
}) {
  const ctx = React.useContext(MenuCtx)!;
  if (!ctx.open) return null;
  return (
    <div
      ref={ctx.contentRef}
      role="menu"
      className={
        `absolute z-50 mt-2 min-w-[10rem] rounded-md border bg-white shadow-md p-1 ` +
        (align === "end" ? "right-0" : "left-0") +
        (className ? ` ${className}` : "")
      }
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  onClick,
  children,
  asChild = false,
  className = "",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}) {
  const ctx = React.useContext(MenuCtx)!;
  if (asChild && React.isValidElement(children)) {
    type ChildProps = { onClick?: (e: React.MouseEvent<HTMLElement>) => void; className?: string } & Record<string, unknown>;
    const child = children as React.ReactElement<ChildProps>;
    const origOnClick = child.props.onClick;
    const mergedClass = [child.props.className, "w-full rounded-sm px-3 py-2 text-left text-base hover:bg-muted", className]
      .filter(Boolean)
      .join(" ");
    return React.cloneElement(child, {
      role: "menuitem",
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        origOnClick?.(e);
        onClick?.();
        ctx.setOpen(false);
      },
      className: mergedClass,
    });
  }

  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onClick?.();
        ctx.setOpen(false);
      }}
      className={`w-full rounded-sm px-3 py-2 text-left text-base hover:bg-muted ${className}`}
    >
      {children}
    </button>
  );
}
