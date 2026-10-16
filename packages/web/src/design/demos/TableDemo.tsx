import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui";
import { DemoBlock, DemoPage } from "../DemoPage";

const applications = [
  { role: "Senior Frontend Engineer", company: "Acme", status: "Interview", match: 92 },
  { role: "Staff Engineer", company: "Globex", status: "Applied", match: 81 },
  { role: "Design Systems Lead", company: "Initech", status: "Offer", match: 88 },
  { role: "Full Stack Engineer", company: "Umbrella", status: "Rejected", match: 64 },
];

export function TableDemo() {
  return (
    <DemoPage
      title="Table"
      description="Semantic table primitives with a dense, bordered default. Wrap-free: Table renders its own horizontal scroll container."
    >
      <DemoBlock title="Data table">
        <Table>
          <TableCaption>Tracking {applications.length} applications</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Match</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((row) => (
              <TableRow key={row.role} data-state={row.status === "Offer" ? "selected" : undefined}>
                <TableCell className="font-medium">{row.role}</TableCell>
                <TableCell className="text-muted-foreground">{row.company}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell className="text-right tabular-nums">{row.match}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Average</TableCell>
              <TableCell className="text-right tabular-nums">
                {Math.round(
                  applications.reduce((sum, row) => sum + row.match, 0) / applications.length,
                )}
                %
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </DemoBlock>

      <DemoBlock title="Compact" note="alignment + hover">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>File</TableHead>
              <TableHead className="text-right">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { id: "001", file: "resume.pdf", size: "184 KB" },
              { id: "002", file: "cover-letter.pdf", size: "96 KB" },
              { id: "003", file: "portfolio.pdf", size: "2.4 MB" },
            ].map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{row.id}</TableCell>
                <TableCell>{row.file}</TableCell>
                <TableCell className="text-right tabular-nums">{row.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DemoBlock>
    </DemoPage>
  );
}