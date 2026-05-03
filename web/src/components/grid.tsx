import type { CSSProperties, ReactNode } from "react";

type GridContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "main" | "header" | "footer";
  /**
   * Quando true, o container vira subgrid — herda colunas/linhas do grid pai.
   * Use quando este container é filho de outro GridContainer.
   */
  subgrid?: boolean;
  style?: CSSProperties;
};

export function GridContainer({
  children,
  className = "",
  as: Component = "div",
  subgrid = false,
  style,
}: GridContainerProps) {
  const base = subgrid ? "grid-subgrid" : "grid-12";
  return (
    <Component className={`${base} ${className}`.trim()} style={style}>
      {children}
    </Component>
  );
}

type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type GridColProps = {
  children: ReactNode;
  className?: string;
  /** Colunas no breakpoint base (mobile, escala 1-4). */
  span?: Span;
  /** Colunas no breakpoint md (tablet, escala 1-8). */
  spanMd?: Span;
  /** Colunas no breakpoint lg (desktop, escala 1-12). */
  spanLg?: Span;
  /** Coluna inicial (1-indexed). Default: auto. */
  start?: Span;
  startMd?: Span;
  startLg?: Span;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer";
};

export function GridCol({
  children,
  className = "",
  span,
  spanMd,
  spanLg,
  start,
  startMd,
  startLg,
  as: Component = "div",
}: GridColProps) {
  const style = {
    ...(span && { "--col-span": String(span) }),
    ...(spanMd && { "--col-span-md": String(spanMd) }),
    ...(spanLg && { "--col-span-lg": String(spanLg) }),
    ...(start && { "--col-start": String(start) }),
    ...(startMd && { "--col-start-md": String(startMd) }),
    ...(startLg && { "--col-start-lg": String(startLg) }),
  } as CSSProperties;

  return (
    <Component className={`grid-col ${className}`.trim()} style={style}>
      {children}
    </Component>
  );
}
