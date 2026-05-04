import { StateBadge } from "./StateBadge";
import type { SectionState } from "@/lib/brandbook-sections";

type PageHeaderProps = {
  /** Caminho de breadcrumbs no eyebrow. Ex: "Sistema visual · Cores" */
  breadcrumb: string;
  /** Estado [F] / [M] / [F+M] da rota. Renderizado ao lado do eyebrow. */
  state: SectionState;
  /** H1 da página. */
  title: string;
  /** Lead opcional curto. Sempre logo abaixo do H1. */
  lead?: string;
  /** Microbanner inline indicando "quando este conteúdo muda". 1 frase. */
  changesWhen?: string;
};

const CHANGES_LABELS: Record<SectionState, string> = {
  F: "Canônico do framework — não muda no /onboard.",
  M: "Decisão de marca — sobrescrita pelo /onboard-brandbook.",
  "F+M": "Estrutura canônica + conteúdo da marca — /onboard-brandbook hidrata.",
};

export function PageHeader({
  breadcrumb,
  state,
  title,
  lead,
  changesWhen,
}: PageHeaderProps) {
  return (
    <header style={{ marginBottom: "var(--space-12)" }}>
      <p className="eyebrow mb-3">
        Brandbook · {breadcrumb} <StateBadge state={state} />
      </p>
      <h1 className="mb-6">{title}</h1>
      {lead && (
        <p
          className="prose"
          style={{ maxWidth: "100%", marginBottom: "var(--space-6)" }}
        >
          {lead}
        </p>
      )}
      <p
        style={{
          margin: 0,
          fontSize: "var(--text-sm)",
          color: "var(--color-muted)",
          fontStyle: "italic",
          paddingInlineStart: "var(--space-3)",
          borderInlineStart: "2px solid var(--color-border)",
        }}
      >
        {changesWhen ?? CHANGES_LABELS[state]}
      </p>
    </header>
  );
}
