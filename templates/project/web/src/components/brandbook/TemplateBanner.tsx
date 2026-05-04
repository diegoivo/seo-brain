type Variant = "template" | "empty";

type TemplateBannerProps = {
  /** "template" — defaults canônicos visíveis. "empty" — sem conteúdo até /onboard rodar. */
  variant?: Variant;
  /** Override do texto principal. */
  message?: string;
};

const DEFAULTS: Record<Variant, string> = {
  template:
    "Brain ainda em estado template. Esta seção mostra defaults canônicos do framework. Rode /onboard para personalizar.",
  empty:
    "Esta seção precisa de informação que vem do brain. Rode /onboard para popular.",
};

export function TemplateBanner({
  variant = "template",
  message,
}: TemplateBannerProps) {
  return (
    <div
      role="note"
      className={`brandbook-banner brandbook-banner-${variant} no-print`}
    >
      <p className="eyebrow">Estado: {variant === "template" ? "template" : "vazio"}</p>
      <p>{message ?? DEFAULTS[variant]}</p>
    </div>
  );
}
