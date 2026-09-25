import React from "react";

interface ArticleContentProps {
  content: string;
  tableOfContents?: { id: string; title: string }[];
}

function renderFormattedText(text: string): React.ReactNode[] {
  // Matches **bold** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ArticleContent({ content, tableOfContents }: ArticleContentProps) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;
  let elementIndex = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Markdown Table Detection
    if (line.startsWith("|") && line.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());

        // Line 1 is usually the separator |---|---|
        const dataRows = tableLines.slice(2).map((rowLine) =>
          rowLine
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim())
        );

        elements.push(
          <div key={`table-${elementIndex++}`} className="my-6 overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/60 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  {headerCells.map((header, idx) => (
                    <th key={idx} className="px-4 py-3">
                      {renderFormattedText(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dataRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-muted/30">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-foreground/90">
                        {renderFormattedText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Level 3 Heading (###)
    if (line.startsWith("### ")) {
      const headingText = line.replace(/^###\s+/, "");
      // Try to find matching TOC entry or slugify heading
      const tocMatch = tableOfContents?.find(
        (t) =>
          t.title.toLowerCase().includes(headingText.toLowerCase()) ||
          headingText.toLowerCase().includes(t.title.toLowerCase())
      );
      const headingId = tocMatch ? tocMatch.id : slugify(headingText);

      elements.push(
        <h3
          key={`h3-${elementIndex++}`}
          id={headingId}
          className="scroll-mt-24 pt-8 text-xl font-bold tracking-tight text-foreground md:text-2xl"
        >
          {headingText}
        </h3>
      );
      i++;
      continue;
    }

    // Level 4 Heading (####)
    if (line.startsWith("#### ")) {
      const headingText = line.replace(/^####\s+/, "");
      elements.push(
        <h4
          key={`h4-${elementIndex++}`}
          className="scroll-mt-24 pt-4 text-base font-bold text-foreground md:text-lg"
        >
          {headingText}
        </h4>
      );
      i++;
      continue;
    }

    // Blockquote (> )
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${elementIndex++}`}
          className="my-4 border-l-4 border-primary/70 bg-muted/40 py-2.5 pl-4 pr-3 text-sm italic text-foreground/90 rounded-r-md"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx} className={qIdx > 0 ? "mt-2" : ""}>
              {renderFormattedText(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Unordered List (- )
    if (line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        listItems.push(lines[i].trim().replace(/^- /, ""));
        i++;
      }
      elements.push(
        <ul
          key={`ul-${elementIndex++}`}
          className="my-3 space-y-1.5 pl-6 text-[15px] leading-relaxed text-foreground/90 list-disc marker:text-primary"
        >
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>{renderFormattedText(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List (1. )
    if (/^\d+\.\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      elements.push(
        <ol
          key={`ol-${elementIndex++}`}
          className="my-3 space-y-2 pl-6 text-[15px] leading-relaxed text-foreground/90 list-decimal marker:font-bold marker:text-primary"
        >
          {listItems.map((item, itemIdx) => (
            <li key={itemIdx}>{renderFormattedText(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular Paragraph
    elements.push(
      <p
        key={`p-${elementIndex++}`}
        className="my-3.5 text-[15px] leading-relaxed text-foreground/90"
      >
        {renderFormattedText(line)}
      </p>
    );
    i++;
  }

  return <div className="article-body prose prose-slate max-w-none">{elements}</div>;
}
