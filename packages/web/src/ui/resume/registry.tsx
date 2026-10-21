import {
  RESUME_COMPONENT_SPEC,
  type ResumeComponentName,
  type ResumeComponentProps,
} from "@resume-optimzer-app/common";
import type { MarkdownToJSX } from "markdown-to-jsx";
import type { ComponentType, ReactNode } from "react";
import { parse } from "valibot";
import { BulletList } from "./BulletList";
import { Callout } from "./Callout";
import { Column } from "./Column";
import { Columns } from "./Columns";
import { DataTable } from "./DataTable";
import { Divider } from "./Divider";
import { Entry } from "./Entry";
import { Fact } from "./Fact";
import { Header } from "./Header";
import { ProgressBar } from "./ProgressBar";
import { Resume } from "./Resume";
import { ResumeText } from "./ResumeText";
import { Section } from "./Section";
import { Spacer } from "./Spacer";
import { Stars } from "./Stars";
import { Stat } from "./Stat";
import { Stats } from "./Stats";
import { Tag } from "./Tag";
import { TagList } from "./TagList";
import { Timeline } from "./Timeline";
import { TimelineItem } from "./TimelineItem";

type ChildProps<K extends ResumeComponentName> =
  (typeof RESUME_COMPONENT_SPEC)[K]["children"] extends true
    ? { children?: ReactNode }
    : { children?: never };

export type ResumeComponentRuntimeProps<K extends ResumeComponentName> =
  ResumeComponentProps<K> & ChildProps<K>;

export const RESUME_COMPONENT_IMPLEMENTATIONS: {
  [K in ResumeComponentName]: ComponentType<ResumeComponentRuntimeProps<K>>;
} = {
  Resume,
  Header,
  Section,
  Columns,
  Column,
  Entry,
  Fact,
  Text: ResumeText,
  BulletList,
  TagList,
  Tag,
  Divider,
  Callout,
  Stars,
  ProgressBar,
  Stats,
  Stat,
  DataTable,
  Timeline,
  TimelineItem,
  Spacer,
};

type OverrideProps = {
  children?: ReactNode;
} & Record<string, unknown>;

function createOverride<K extends ResumeComponentName>(name: K) {
  const Component = RESUME_COMPONENT_IMPLEMENTATIONS[name] as ComponentType<
    Record<string, unknown>
  >;

  return function ResumeComponentOverride({ children, ...props }: OverrideProps) {
    delete props.className;
    const parsed = parse(RESUME_COMPONENT_SPEC[name].props, props) as ResumeComponentProps<K>;
    return <Component {...parsed} children={children} />;
  };
}

export const resumeComponentOverrides = Object.fromEntries(
  (Object.keys(RESUME_COMPONENT_SPEC) as ResumeComponentName[]).map((name) => [
    name,
    createOverride(name),
  ]),
) as MarkdownToJSX.Overrides;
