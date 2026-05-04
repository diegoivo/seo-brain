
# SEO de Imagens

Aplica o checklist atualizado de imagens. Roda em arquivos `.md` ou nos componentes do `/web`.

## Quando rodar

- Ao adicionar imagens em um post.
- Antes de publicar página com mídia rica.
- Em auditoria periódica de mídia.

## Checklist

### 1. Formato correto por tipo
- **Logos e vetores → SVG.** 99% dos sites erram nisso. SVG é vetorial, infinitamente escalável e leve.
- **Fotografias → JPEG ou WebP.** WebP é preferível (menor peso, mesma qualidade).
- **Ilustrações → SVG (preferencial) ou PNG.** Se PNG, crie arquivos largos para que o redimensionamento não perca qualidade.

### 2. Peso ≤100kb por imagem
- Comprima com Squoosh (https://squoosh.app).
- Acima de 100kb sinaliza otimização ausente, exceto casos justificados (hero images de alta qualidade).

### 3. Lazy loading
- Aplicar `loading="lazy"` em todas as imagens abaixo da dobra.
- Imagens above-the-fold (hero) ficam **sem** lazy (fast LCP).

### 4. Nomenclatura de arquivo
- `nomes-de-arquivo-simples-e-uteis.jpeg`
- Hífens, lowercase, descritivo, sem caracteres especiais.
- Inclui keyword quando natural.

### 5. ALT descritivo (o mais importante)
- ALT é fator de ranqueamento principal para imagens.
- **Não coloque apenas a keyword.** Isso é stuffing e prejudica.
- Descreva: o que aparece, o fundo, o sentimento que transmite, contexto.
- Exemplo ruim: `alt="seo google"`
- Exemplo bom: `alt="Gráfico de linha mostrando crescimento de tráfego orgânico de 0 a 100 mil visitas em 12 meses, com curva acentuada nos últimos 3 meses"`

### 6. Dimensões explícitas
- `width` e `height` no HTML/JSX (evita CLS).
- Em Next.js `<Image>`, sempre passar `width` e `height`.

## Output

Relatório em formato de tabela:

| Imagem | Formato | Peso | Lazy | ALT | Status |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ✅/❌ |

Aplica correções automáticas onde possível (alt vazio em imagem decorativa → `alt=""`; falta de lazy → adiciona). Pede confirmação para mudanças que afetam UX (substituir formato, recompressão).
