import {
  RESUME_COMPONENT_SPEC,
  type ResumeComponentName,
  type ResumeComponentSpec,
} from "@resume-optimzer-app/common";
import { parser, RuleType, type MarkdownToJSX } from "markdown-to-jsx";
import { safeParse } from "valibot";

type ASTNode = MarkdownToJSX.ASTNode;

export function validateResumeMarkup(markup: string): string | null {
  if (markup.trim().length === 0) {
    console.error("[Resume validation] The render markup is empty.");
    return "The render markup is empty.";
  }

  let nodes: ASTNode[];
  try {
    nodes = parser(markup);
  } catch (error) {
    console.error("[Resume validation] The render markup could not be read.", error);
    return "The render markup could not be read.";
  }

  return validateNodes(nodes)[0] ?? null;
}

function validateNodes(nodes: ASTNode[]): string[] {
  const errors: string[] = [];

  for (const node of nodes) {
    if (node.type === RuleType.htmlBlock || node.type === RuleType.htmlSelfClosing) {
      const spec = RESUME_COMPONENT_SPEC[node.tag as ResumeComponentName] as
        | ResumeComponentSpec
        | undefined;

      if (!spec) {
        const message = `Unsupported component <${node.tag}>.`;
        errors.push(message);
        console.error(`[Resume validation] ${message}`);
        continue;
      }

      const result = safeParse(spec.props, node.attrs ?? {});
      if (!result.success) {
        const message = `Invalid props for <${node.tag}>.`;
        errors.push(message);
        const details = result.issues.map((issue) => {
          const path = issue.path
            ?.map((segment) => String(segment.key))
            .filter(Boolean)
            .join(".");
          return path ? `${path}: ${issue.message}` : issue.message;
        });
        console.error(`[Resume validation] ${message}`, details);
      }

      if (
        !spec.children &&
        node.type === RuleType.htmlBlock &&
        node.children &&
        node.children.length > 0
      ) {
        const message = `<${node.tag}> does not accept children.`;
        errors.push(message);
        console.error(`[Resume validation] ${message}`);
      }
    }

    errors.push(...validateChildren(node));
  }

  return errors;
}

function validateChildren(node: ASTNode): string[] {
  if ("children" in node && Array.isArray(node.children)) {
    return validateNodes(node.children);
  }

  if ("items" in node && Array.isArray(node.items)) {
    return node.items.flatMap((item) => validateNodes(item));
  }

  if (node.type === RuleType.table) {
    return [...node.header, ...node.cells.flat()].flatMap((cell) => validateNodes(cell));
  }

  return [];
}