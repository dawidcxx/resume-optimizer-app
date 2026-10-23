import type { ResumeComponentProps } from "@resume-optimzer-app/common";
import { useResumeTheme } from "./theme";

export type DataTableProps = ResumeComponentProps<"DataTable">;

function parseCells(value: string): string[] {
  return value.split("|").map((cell) => cell.trim());
}

function parseRows(value: string): string[][] {
  return value
    .split(/;\s*|\n+/)
    .map((row) => row.trim())
    .filter((row) => row.length > 0)
    .map(parseCells);
}

export function DataTable({ headers, rows, caption, accent }: DataTableProps) {
  const theme = useResumeTheme();
  const color = accent ?? theme.accent;
  const headerCells = headers.trim() ? parseCells(headers) : [];
  const bodyRows = parseRows(rows);
  const columnCount = Math.max(headerCells.length, ...bodyRows.map((row) => row.length));

  if (columnCount === 0) return null;

  return (
    <figure className="grid min-w-0 gap-1">
      {caption ? (
        <figcaption
          className="text-[10px] font-medium [overflow-wrap:anywhere]"
          style={{ color: theme.muted }}
        >
          {caption}
        </figcaption>
      ) : null}
      <div className="max-w-full overflow-x-auto print:overflow-visible">
        <table className="w-full table-fixed border-collapse text-[10px] print:[&_thead]:table-header-group print:[&_tr]:break-inside-avoid">
          {headerCells.length > 0 ? (
            <thead>
              <tr>
                {Array.from({ length: columnCount }, (_, index) => (
                  <th
                    key={index}
                    className="border-b px-1.5 py-1 text-left font-semibold [overflow-wrap:anywhere]"
                    style={{ borderColor: color }}
                  >
                    {headerCells[index] ?? ""}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columnCount }, (_, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border-b px-1.5 py-1 align-top [overflow-wrap:anywhere]"
                    style={{
                      borderColor: `color-mix(in srgb, ${theme.muted} 25%, transparent)`,
                    }}
                  >
                    {row[cellIndex] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}