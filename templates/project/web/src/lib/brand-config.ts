// Configuração da marca deste projeto.
// Pré-onboard: defaults do SEO Brain.
// Pós-onboard: /onboard-brandbook sobrescreve este arquivo com o nome real
// do projeto, posicionamento, e quem somos.

export type BrandConfig = {
  /** Nome da marca renderizado em wordmark, header, footer, OG. */
  wordmark: string;
  /** Domínio canônico (definitivo). Vazio = usa NEXT_PUBLIC_BASE_URL. */
  domain: string;
  /** Posicionamento em 1 frase, ≤ 25 palavras. Aparece em overview, footer, OG. */
  positioning: string;
  /** Mood verbal — 1-3 adjetivos. */
  mood: string;
  /** Estado: template (defaults canônicos) ou initialized (decisões da marca aplicadas). */
  state: "template" | "initialized";
};

export const BRAND: BrandConfig = {
  wordmark: "seo-brain",
  domain: "",
  positioning:
    "Framework experimental de SEO Agêntico — clone, preencha o Brain, gere site Lighthouse 95+.",
  mood: "experimental, opinativo, anti-AI-slop",
  state: "template",
};
