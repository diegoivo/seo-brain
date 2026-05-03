import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Mensagens" };

const CTA = [
  { ctx: "Lead — formulário de contato",   primary: "Solicitar contato",       secondary: "Ver casos" },
  { ctx: "Lead — newsletter",               primary: "Receber por e-mail",      secondary: "Ler arquivo" },
  { ctx: "Trial — onboarding",              primary: "Começar agora",           secondary: "Ver como funciona" },
  { ctx: "Conversão — checkout",            primary: "Concluir pedido",         secondary: "Continuar comprando" },
  { ctx: "Conteúdo — fim de post",          primary: "Receber próximos posts",  secondary: "Compartilhar" },
];

const ERRORS = [
  { ctx: "Form — campo obrigatório", msg: "Este campo é obrigatório.", note: "Curto, presente, sem culpar o usuário." },
  { ctx: "Form — e-mail inválido", msg: "Formato inválido. Exemplo: voce@exemplo.com", note: "Mostra exemplo, não só apontar erro." },
  { ctx: "Form — falha de envio", msg: "Não conseguimos enviar agora. Tente de novo em alguns minutos.", note: "Sem culpar usuário. Tom calmo." },
  { ctx: "404", msg: "Página não encontrada. O endereço que você acessou não existe — ou foi removido.", note: "Direto, oferece caminho de volta." },
  { ctx: "500", msg: "Algo deu errado. Tentamos carregar essa página e encontramos um problema.", note: "Sem stack trace nem 'Sorry'. Ação: tentar novamente." },
  { ctx: "Offline", msg: "Você parece estar offline. Reconecte e atualize.", note: "Não bloqueia interação — só avisa." },
];

const EMPTY = [
  { ctx: "Lista vazia", msg: "Nada por aqui ainda. Cadastre o primeiro item.", action: "Cadastrar" },
  { ctx: "Busca sem resultado", msg: "Nenhum resultado para “SEO técnico”. Tente termos relacionados.", action: "Limpar busca" },
  { ctx: "Filtro vazio", msg: "Os filtros aplicados não retornaram resultados.", action: "Remover filtros" },
];

export default function Mensagens() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Mensagens</p>
        <h1 className="mb-8">CTA, erros, empty, loading.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Boilerplate canônico que padroniza microcopy entre páginas. Ajuste
          pós-onboard se a voz da marca pedir variação — mas a estrutura
          fica.
        </p>

        <h2 className="mb-6">CTA por contexto</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "var(--space-12)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Contexto</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Primário</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Secundário</th>
            </tr>
          </thead>
          <tbody>
            {CTA.map((c) => (
              <tr key={c.ctx} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>{c.ctx}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", fontWeight: 500 }}>{c.primary}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>{c.secondary}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mb-6">Mensagens de erro</h2>
        <div style={{ display: "grid", gap: "var(--space-4)", marginBottom: "var(--space-12)" }}>
          {ERRORS.map((e) => (
            <div
              key={e.ctx}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
                padding: "var(--space-4) var(--space-6)",
              }}
            >
              <p className="eyebrow">{e.ctx}</p>
              <p style={{ margin: "var(--space-2) 0", fontWeight: 500 }}>{e.msg}</p>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                <em>{e.note}</em>
              </p>
            </div>
          ))}
        </div>

        <h2 className="mb-6">Empty states</h2>
        <div style={{ display: "grid", gap: "var(--space-4)", marginBottom: "var(--space-12)" }}>
          {EMPTY.map((e) => (
            <div
              key={e.ctx}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
                padding: "var(--space-6)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "var(--space-4)",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p className="eyebrow">{e.ctx}</p>
                <p style={{ margin: "var(--space-2) 0 0" }}>{e.msg}</p>
              </div>
              <button type="button" className="btn-ghost">
                {e.action}
              </button>
            </div>
          ))}
        </div>

        <h2 className="mb-6">Loading e success</h2>
        <ul className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <li><strong>Loading rápido (&lt; 300ms)</strong>: skeleton estático, sem spinner.</li>
          <li><strong>Loading médio (300ms - 2s)</strong>: spinner + texto neutro &quot;Carregando…&quot;</li>
          <li><strong>Loading longo (&gt; 2s)</strong>: progresso explícito quando possível, ou microcopy específico (&quot;Buscando 142 resultados…&quot;).</li>
          <li><strong>Success</strong>: confirmação curta, ação next clara. Ex: &quot;Recebemos. Respondemos em 1 dia útil.&quot;</li>
          <li><strong>Sem &quot;Sucesso!&quot; com exclamação</strong>. Anti-AI-slop. A confirmação já é o sucesso.</li>
        </ul>

        <h2 className="mb-6">Alt text padrão</h2>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Veja regras em <a href="/brandbook/imagens">Imagens</a>. Resumo:
        </p>
        <ul className="prose">
          <li>Imagem decorativa: <code>alt=&quot;&quot;</code> (string vazia).</li>
          <li>Imagem com texto: alt contém o texto da imagem.</li>
          <li>Imagem semântica (gráfico, diagrama): alt descreve o que a imagem ensina, não &quot;gráfico de barras&quot;.</li>
          <li>Foto: descreve o que importa visualmente, não tagueia (&quot;mulher, óculos&quot;).</li>
        </ul>
      </GridCol>
    </GridContainer>
  );
}
