import type { SectionState } from "@/lib/brandbook-sections";

const LABELS: Record<SectionState, string> = {
  F: "Canônico do framework",
  M: "Decisão de marca",
  "F+M": "Framework + marca",
};

export function StateBadge({ state }: { state: SectionState }) {
  return (
    <span
      className="brandbook-state-badge"
      title={LABELS[state]}
      aria-label={LABELS[state]}
    >
      [{state}]
    </span>
  );
}
