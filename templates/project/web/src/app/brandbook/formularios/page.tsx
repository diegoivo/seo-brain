import { GridContainer, GridCol } from "@/components/grid";
import { PageHeader } from "@/components/brandbook/PageHeader";

export const metadata = { title: "Formulários" };

const fieldStyle = {
  width: "100%",
  padding: "var(--space-3) var(--space-4)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.25rem",
  fontFamily: "inherit",
  fontSize: "var(--text-base)",
  background: "var(--color-bg)",
  color: "var(--color-fg)",
};

const labelStyle = {
  display: "block",
  fontSize: "var(--text-sm)",
  fontWeight: 500,
  marginBottom: "var(--space-2)",
};

const helpStyle = {
  margin: "var(--space-2) 0 0",
  fontSize: "var(--text-sm)",
  color: "var(--color-muted)",
};

export default function Formularios() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <PageHeader
          breadcrumb="Componentes · Formulários"
          state="F+M"
          title="Formulários."
          lead="Anatomia: label + input + help text (ou error text quando inválido). Vertical, espaçamento canônico, target ≥ 44px em mobile."
        />

        <form
          action="#"
          style={{
            display: "grid",
            gap: "var(--space-6)",
            padding: "var(--space-8) var(--space-6)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            maxWidth: "520px",
            marginBottom: "var(--space-16)",
          }}
        >
          <div>
            <label htmlFor="bb-nome" style={labelStyle}>Nome</label>
            <input id="bb-nome" type="text" placeholder="Maria Silva" style={fieldStyle} />
            <p style={helpStyle}>Como você quer ser identificada.</p>
          </div>

          <div>
            <label htmlFor="bb-email" style={labelStyle}>E-mail *</label>
            <input id="bb-email" type="email" required defaultValue="email-invalido" style={{ ...fieldStyle, borderColor: "var(--color-fg)" }} aria-invalid="true" aria-describedby="bb-email-error" />
            <p id="bb-email-error" style={{ ...helpStyle, color: "var(--color-fg)", fontWeight: 500 }}>
              Formato inválido. Exemplo: voce@exemplo.com
            </p>
          </div>

          <div>
            <label htmlFor="bb-papel" style={labelStyle}>Papel</label>
            <select id="bb-papel" style={fieldStyle}>
              <option>Marketing</option>
              <option>Engenharia</option>
              <option>Outro</option>
            </select>
          </div>

          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ ...labelStyle, marginBottom: "var(--space-3)" }}>Como prefere contato?</legend>
            <div style={{ display: "grid", gap: "var(--space-2)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "var(--text-base)" }}>
                <input type="radio" name="contato" defaultChecked /> E-mail
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "var(--text-base)" }}>
                <input type="radio" name="contato" /> WhatsApp
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "var(--text-base)" }}>
                <input type="radio" name="contato" /> Não tenho preferência
              </label>
            </div>
          </fieldset>

          <label style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", fontSize: "var(--text-base)" }}>
            <input type="checkbox" style={{ marginTop: "0.25em" }} />
            <span>Concordo com os <a href="#">termos de uso</a> e a <a href="#">política de privacidade</a>.</span>
          </label>

          <div>
            <label htmlFor="bb-mensagem" style={labelStyle}>Mensagem</label>
            <textarea
              id="bb-mensagem"
              rows={4}
              placeholder="Conte sobre o seu projeto…"
              style={{ ...fieldStyle, fontFamily: "inherit", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <button type="submit" className="btn-accent">Enviar</button>
            <button type="button" className="btn-ghost">Cancelar</button>
          </div>
        </form>

        <h2 className="mb-6">Regras</h2>
        <ul className="prose">
          <li><strong>Label sempre</strong>. Nunca use <code>placeholder</code> como label — viola a11y.</li>
          <li><strong>Asterisco em campos obrigatórios</strong> e <code>required</code> no input.</li>
          <li><strong>Help text é descritivo</strong>, não promocional. &quot;Como você quer ser identificada&quot;, não &quot;Coloque seu nome legal aqui&quot;.</li>
          <li><strong>Erro vai abaixo do input</strong> com <code>aria-describedby</code> e <code>aria-invalid=&quot;true&quot;</code>. Cor sólida (não vermelho neon).</li>
          <li><strong>Hierarquia de ações</strong>: primário à esquerda (Enviar), secundário à direita ou abaixo (Cancelar). Nunca 2 primários.</li>
          <li><strong>Target size ≥ 44px</strong> para checkboxes/radios em mobile (regra WCAG 2.5.5).</li>
          <li><strong>Spacing entre campos</strong>: <code>--space-6</code> (24px). Em forms densos, <code>--space-4</code>.</li>
        </ul>
      </GridCol>
    </GridContainer>
  );
}
