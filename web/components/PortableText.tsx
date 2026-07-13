import type { PortableTextBlock } from "@portabletext/types";

type PortableTextProps = {
  value: PortableTextBlock[];
};

function renderSpan(
  child: PortableTextBlock["children"][number],
  key: string,
  markDefs: Array<{ _key: string; href?: string }> | undefined,
) {
  if (!(typeof child === "object" && child && "text" in child)) {
    return null;
  }

  let content: React.ReactNode = String(child.text ?? "");

  if (Array.isArray(child.marks)) {
    child.marks.forEach((mark) => {
      if (mark === "strong") {
        content = <strong>{content}</strong>;
        return;
      }

      if (mark === "em") {
        content = <em>{content}</em>;
        return;
      }

      const linkDefinition = markDefs?.find((definition) => definition._key === mark && definition.href);

      if (linkDefinition?.href) {
        content = (
          <a className="underline underline-offset-4" href={linkDefinition.href} rel="noreferrer" target="_blank">
            {content}
          </a>
        );
      }
    });
  }

  return <span key={key}>{content}</span>;
}

export default function PortableText({ value }: PortableTextProps) {
  return (
    <div className="space-y-5 text-base leading-8 text-inherit/80">
      {value.map((block) => {
        if (block._type !== "block") {
          return null;
        }

        const children = Array.isArray(block.children)
          ? block.children.map((child, index) => renderSpan(child, `${block._key}-${index}`, block.markDefs as Array<{ _key: string; href?: string }> | undefined))
          : null;
        const key = block._key;

        if (block.listItem === "bullet") {
          return (
            <ul key={key} className="list-disc space-y-2 pl-6">
              <li>{children}</li>
            </ul>
          );
        }

        if (block.style === "h2") {
          return (
            <h2 key={key} className="font-display text-4xl uppercase leading-none text-inherit">
              {children}
            </h2>
          );
        }

        if (block.style === "h3") {
          return (
            <h3 key={key} className="font-display text-3xl uppercase leading-none text-inherit">
              {children}
            </h3>
          );
        }

        return <p key={key}>{children}</p>;
      })}
    </div>
  );
}
