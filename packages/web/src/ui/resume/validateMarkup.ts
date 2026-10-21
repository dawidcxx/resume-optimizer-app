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
    return "The render markup is empty.";
  }

  let nodes: ASTNode[];
  try {
    nodes = parser(markup);
  } catch {
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
        errors.push(`Unsupported component <${node.tag}>.`);
        continue;
      }

      const result = safeParse(spec.props, node.attrs ?? {});
      if (!result.success) {
        errors.push(`Invalid props for <${node.tag}>.`);
      }

      if (
        !spec.children &&
        node.type === RuleType.htmlBlock &&
        node.children &&
        node.children.length > 0
      ) {
        errors.push(`<${node.tag}> does not accept children.`);
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
