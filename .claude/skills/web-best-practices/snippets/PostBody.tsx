// PostBody — renderiza o corpo do artigo aplicando .prose do globals.css.
// Garante que headings, parágrafos, blockquotes, code, listas, imagens herdem
// o design do brandbook (resolve heading sem estilo no blog do log sessão 3).
//
// Aceita HTML pré-renderizado (de markdown processado) OU JSX children.

export type PostBodyProps = {
  html?: string;            // HTML processado de markdown
  children?: React.ReactNode;
};

export function PostBody({ html, children }: PostBodyProps) {
  if (html) {
    return (
      <article className="prose mx-auto" dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
  return <article className="prose mx-auto">{children}</article>;
}

// Cover image do post — sempre obrigatória (thumb default em listagem + topo do post)
import Image from "next/image";

export function PostCover({ src, alt, width = 1600, height = 900 }: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className="w-full mb-8 overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        sizes="(min-width: 1024px) 1024px, 100vw"
        className="object-cover w-full h-full"
      />
    </div>
  );
}
