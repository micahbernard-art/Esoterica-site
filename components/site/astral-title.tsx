import type { CSSProperties } from "react";
import "@/app/astral-arrival.css";

type AstralTitleProps = {
  id: string;
  children: string;
  emphasis?: string;
};

type AstralGlyphStyle = CSSProperties & {
  "--glyph-index": number;
  "--glyph-orbit": string;
};

const trimWord = (word: string) =>
  word.normalize("NFC").replace(/^[¿¡(]+|[),.!?;:]+$/g, "").toLocaleLowerCase("es");

/**
 * Keeps one real, readable heading while its decorative twin gathers like a
 * constellation. Cormorant remains the voice; every coordinate is CSS-only.
 */
export function AstralTitle({ id, children, emphasis }: AstralTitleProps) {
  let glyphIndex = 0;
  const words = children.split(/(\s+)/);
  const emphasizedWord = emphasis?.normalize("NFC").toLocaleLowerCase("es");

  const visualTitle = words.map((word, wordIndex) => {
    if (/^\s+$/.test(word)) {
      return " ";
    }

    const glyphs = Array.from(word).map((glyph) => {
      const index = glyphIndex++;
      const style: AstralGlyphStyle = {
        "--glyph-index": index,
        "--glyph-orbit": `${index % 2 === 0 ? -1 : 1}`,
      };

      return (
        <span className="astral-title__glyph" style={style} key={`${glyph}-${index}`}>
          {glyph}
        </span>
      );
    });

    const className =
      emphasizedWord && trimWord(word) === emphasizedWord
        ? "astral-title__word astral-title__word--oracle"
        : "astral-title__word";

    const content = (
      <span className={className} key={`${word}-${wordIndex}`}>
        {glyphs}
      </span>
    );

    return className.includes("--oracle") ? (
      <em className="astral-title__oracle" key={`${word}-${wordIndex}`}>
        {content}
      </em>
    ) : (
      content
    );
  });

  return (
    <h1 id={id} className="astral-title" data-astral-arrival="constellation">
      <span className="sr-only">{children}</span>
      <span className="astral-title__visual" aria-hidden="true">
        {visualTitle}
      </span>
    </h1>
  );
}
