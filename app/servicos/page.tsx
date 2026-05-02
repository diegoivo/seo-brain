import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Como o agentic-seo-kit ajuda você a construir presença orgânica via SEO Agêntico.",
};

const services = [
  {
    n: "01",
    title: "Diagnóstico de SEO Agêntico",
    body: "Auditoria do quanto a sua marca aparece em respostas de LLMs e AI Overviews. Saímos com um plano priorizado de ajustes técnicos, conteúdo e linkagem.",
  },
  {
    n: "02",
    title: "Estratégia de conteúdo opinionada",
    body: "Definimos POV proprietário da marca, princípios editoriais e o calendário com prioridade por intenção (informacional, comercial, transacional).",
  },
  {
    n: "03",
    title: "Implementação técnica",
    body: "Sites Next.js SSG com PageSpeed 100, JSON-LD completo, sitemap e robots configurados. Sem inflar com JS de terceiros.",
  },
];

export default function ServicosPage() {
  return (
    <section className="container-page py-section">
      <h1 className="hero-title font-display font-bold max-w-[20ch]">Serviços</h1>
      <p className="mt-6 max-w-editorial text-lg text-muted-foreground">
        Substitua estes blocos pelos serviços da sua marca. Edite{" "}
        <code>app/servicos/page.tsx</code>.
      </p>

      <ol className="mt-section space-y-12 list-none p-0">
        {services.map((s) => (
          <li key={s.n} className="grid md:grid-cols-[6rem_1fr] gap-4 md:gap-10">
            <span className="font-mono text-sm text-muted-foreground pt-2">
              {s.n}.
            </span>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-semibold">
                {s.title}
              </h2>
              <p className="mt-3 max-w-editorial text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
