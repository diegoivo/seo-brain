/**
 * Site configuration — preenchido pela skill `onboarding` ou manualmente.
 *
 * Os valores abaixo são placeholders genéricos. Rode `/onboarding` para
 * substituí-los pelos dados da sua marca, ou edite manualmente.
 */
export const siteConfig = {
  name: "Sua Marca",
  description:
    "Substitua esta descrição pelo posicionamento da sua marca em até 155 caracteres.",
  url: "https://example.com",
  author: {
    name: "Autor Principal",
    url: "https://example.com",
  },
  ogImage: "/og-default.png",
  social: {
    linkedin: "",
    github: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
