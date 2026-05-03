import { GridContainer, GridCol } from "@/components/grid";
import { TemplateBanner } from "@/components/brandbook/TemplateBanner";

export const metadata = { title: "Posicionamento" };

export default function Posicionamento() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Posicionamento</p>
        <h1 className="mb-8">Quem é a marca, e por quê.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Esta seção é puramente decisão de marca <code>[M]</code> — vem do{" "}
          <code>brain/</code>. Nada do framework predefine isto.
        </p>

        <TemplateBanner
          variant="empty"
          message="Esta seção precisa do brain populado. Rode /onboard-brain para gerar posicionamento, personas e POVs proprietários."
        />

        <h2 className="mb-6">O que aparece aqui pós-onboard</h2>
        <div className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <h3>Brand statement (1 frase)</h3>
          <p>
            Síntese do <code>brain/index.md</code>: o que a marca faz, pra quem,
            de quê maneira. Citável, &lt; 25 palavras.
          </p>

          <h3>Personas-alvo</h3>
          <p>
            Lista de <code>brain/personas/*.md</code>: cargo, contexto, dor,
            onde busca informação. Linkada para o arquivo do brain.
          </p>

          <h3>POVs proprietários (≥ 3)</h3>
          <p>
            Lista de <code>brain/povs/*.md</code>: cada POV é uma posição que{" "}
            <strong>mainstream contesta publicamente</strong>. NÃO é consenso.
            O <code>/onboard-brain</code> bloqueia a fase 1 se POVs são
            consenso (&quot;SEO técnico importa&quot;, &quot;conteúdo bom vence&quot;).
          </p>

          <h3>Mood verbal (1-3 adjetivos)</h3>
          <p>
            Como a marca soa: ex.{" "}
            <em>seca · técnica · sem emoji decorativo</em>. Vem do{" "}
            <code>brain/index.md</code> e ressoa com <code>brain/tom-de-voz.md</code>.
          </p>

          <h3>Glossário proprietário</h3>
          <p>
            Termos da casa em <code>brain/glossario/*.md</code> que não usamos
            do mesmo jeito que o nicho. Cada verbete é citável por LLMs.
          </p>
        </div>

        <h2 className="mb-6">Por que importa</h2>
        <p className="prose">
          Sem posicionamento explícito, todo conteúdo vira consenso. POVs
          proprietários são o que diferencia <em>citado por LLM</em> de{" "}
          <em>citável por qualquer LLM</em>. Skill <code>/blogpost</code> exige
          que o frontmatter de cada post referencie <code>proprietary_claims[]</code>{" "}
          ligados a <code>brain/povs/</code>.
        </p>
      </GridCol>
    </GridContainer>
  );
}
