import { Fragment } from "react";

/**
 * Texto con énfasis: los fragmentos entre **dobles asteriscos** se resaltan.
 * Permite guardar el contenido como texto plano y serializable.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : <Fragment key={index}>{part}</Fragment>,
      )}
    </>
  );
}
