export type SectionState = "F" | "M" | "F+M";

export type BrandbookSection = {
  href: string;
  label: string;
  summary: string;
  state: SectionState;
  printable: boolean;
};

export type BrandbookGroup = {
  label: string;
  items: BrandbookSection[];
};

export const BRANDBOOK_GROUPS: BrandbookGroup[] = [
  {
    label: "Identidade",
    items: [
      {
        href: "/brandbook",
        label: "Overview",
        summary: "Sumário, estado por seção, exportar PDF.",
        state: "F+M",
        printable: true,
      },
      {
        href: "/brandbook/posicionamento",
        label: "Posicionamento",
        summary: "Síntese do brain — POVs, personas, mood.",
        state: "M",
        printable: true,
      },
      {
        href: "/brandbook/marca",
        label: "Marca / Logo",
        summary: "Wordmark e logo do usuário (se houver).",
        state: "F+M",
        printable: true,
      },
      {
        href: "/brandbook/aplicacoes",
        label: "Aplicações",
        summary: "Header, footer, OG image, favicon, avatar.",
        state: "F+M",
        printable: true,
      },
    ],
  },
  {
    label: "Sistema visual",
    items: [
      {
        href: "/brandbook/cores",
        label: "Cores",
        summary: "6 papéis funcionais, contraste WCAG, estados.",
        state: "M",
        printable: true,
      },
      {
        href: "/brandbook/tipografia",
        label: "Tipografia",
        summary: "Perfect fourth, hierarquia, UI dense.",
        state: "F+M",
        printable: true,
      },
      {
        href: "/brandbook/grid",
        label: "Grid",
        summary: "12-col, subgrid, container queries, spacing 4-base.",
        state: "F",
        printable: true,
      },
      {
        href: "/brandbook/motion",
        label: "Motion",
        summary: "Durações canônicas, easing, prefers-reduced-motion.",
        state: "F",
        printable: true,
      },
      {
        href: "/brandbook/imagens",
        label: "Imagens",
        summary: "Estilo, formato, proporções, peso, alt.",
        state: "F+M",
        printable: true,
      },
    ],
  },
  {
    label: "Componentes",
    items: [
      {
        href: "/brandbook/botoes",
        label: "Botões e ações",
        summary: "Estados completos: default, hover, active, disabled, loading.",
        state: "F+M",
        printable: true,
      },
      {
        href: "/brandbook/formularios",
        label: "Formulários",
        summary: "Input, select, checkbox, radio + label/help/error.",
        state: "F+M",
        printable: true,
      },
      {
        href: "/brandbook/editorial",
        label: "Editorial",
        summary: "Eyebrow, blockquote, callout, code, table, badge.",
        state: "F+M",
        printable: true,
      },
      {
        href: "/brandbook/navegacao",
        label: "Navegação",
        summary: "Header, footer, breadcrumb, skip-link.",
        state: "F+M",
        printable: true,
      },
      {
        href: "/brandbook/templates",
        label: "Templates",
        summary: "Hero, post, serviço, contato.",
        state: "F+M",
        printable: true,
      },
    ],
  },
  {
    label: "Voz e conteúdo",
    items: [
      {
        href: "/brandbook/voz",
        label: "Voz aplicada",
        summary: "Do/don't, antivícios IA, capitalização BR.",
        state: "F+M",
        printable: true,
      },
      {
        href: "/brandbook/mensagens",
        label: "Mensagens",
        summary: "CTA, errors, empty, loading, alt padrão.",
        state: "F+M",
        printable: true,
      },
    ],
  },
  {
    label: "Operação",
    items: [
      {
        href: "/brandbook/acessibilidade",
        label: "Acessibilidade",
        summary: "Checklist + contrastes computados ao vivo.",
        state: "F",
        printable: true,
      },
    ],
  },
];

export const ALL_SECTIONS: BrandbookSection[] = BRANDBOOK_GROUPS.flatMap(
  (g) => g.items
);

export function findSection(href: string): BrandbookSection | undefined {
  return ALL_SECTIONS.find((s) => s.href === href);
}

export function findGroup(href: string): BrandbookGroup | undefined {
  return BRANDBOOK_GROUPS.find((g) => g.items.some((s) => s.href === href));
}
