import { beforeEach, describe, expect, it } from "vitest";
import { saveResumeAnnotations } from "./resumeAnnotations";
import {
  createResumeProject,
  deleteResumeProject,
  nextResumeProjectName,
  saveResumeDraft,
} from "./resumeProjects";
import {
  readResume,
  readResumeAnnotations,
  readResumeBundle,
  readResumeProjects,
} from "./selectors";
import { store } from "./store";

describe("nextResumeProjectName", () => {
  it("uses the base name when it is free", () => {
    expect(nextResumeProjectName([])).toBe("My Resume");
    expect(nextResumeProjectName(["Other"])).toBe("My Resume");
  });

  it("appends the first free suffix", () => {
    expect(nextResumeProjectName(["My Resume"])).toBe("My Resume (1)");
    expect(nextResumeProjectName(["My Resume", "My Resume (1)"])).toBe("My Resume (2)");
    expect(nextResumeProjectName(["My Resume", "My Resume (1)", "My Resume (2)"])).toBe(
      "My Resume (3)",
    );
  });

  it("fills gaps in the suffix sequence", () => {
    expect(nextResumeProjectName(["My Resume", "My Resume (2)"])).toBe("My Resume (1)");
  });
});

describe("createResumeProject", () => {
  beforeEach(() => {
    store.delTables();
  });

  it("writes a project row and a linked resume row", () => {
    const project = createResumeProject({
      name: "  My resume  ",
      fullName: "Ada Lovelace",
      careerName: "Engineer",
    });

    expect(project.name).toBe("My resume");
    expect(project.version).toBe("v1");

    const projects = readResumeProjects(store);
    expect(projects).toHaveLength(1);
    expect(projects[0]).toEqual(project);

    const resume = readResume(store, project.id);
    expect(resume?.id).toBe(project.id);
    expect(resume?.fullName).toBe("Ada Lovelace");
    expect(resume?.careerName).toBe("Engineer");
    expect(resume?.aboutMe).toBe("");
  });

  it("deletes the project, resume, and annotations", () => {
    const project = createResumeProject({ name: "My resume" });
    saveResumeAnnotations(project.id, {
      "experience[0]": "Main role",
    });

    deleteResumeProject(project.id);

    expect(readResumeProjects(store)).toEqual([]);
    expect(readResume(store, project.id)).toBeUndefined();
    expect(readResumeAnnotations(store, project.id)).toEqual({});
  });

  it("saves resume and annotation drafts", () => {
    const project = createResumeProject({ name: "Draft" });
    const resume = readResume(store, project.id);
    if (!resume) throw new Error("Expected resume");

    saveResumeDraft({ ...resume, fullName: "Grace Hopper" });
    saveResumeAnnotations(project.id, {
      aboutMe: "I prefer a concise summary.",
    });

    expect(readResume(store, project.id)?.fullName).toBe("Grace Hopper");
    expect(readResumeAnnotations(store, project.id)).toEqual({
      aboutMe: "I prefer a concise summary.",
    });
  });

  it("does not recreate a deleted project on a delayed draft save", () => {
    const project = createResumeProject({ name: "Deleted" });
    const resume = readResume(store, project.id);
    if (!resume) throw new Error("Expected resume");

    deleteResumeProject(project.id);
    saveResumeDraft({ ...resume, fullName: "Late save" });
    saveResumeAnnotations(project.id, { aboutMe: "Late note" });

    expect(readResumeProjects(store)).toEqual([]);
    expect(readResume(store, project.id)).toBeUndefined();
    expect(readResumeAnnotations(store, project.id)).toEqual({});
  });

  it("joins the project and resume by id", () => {
    const project = createResumeProject({ name: "Bundle", fullName: "Ada" });

    const bundle = readResumeBundle(store, project.id);

    expect(bundle?.project).toEqual(project);
    expect(bundle?.resume?.fullName).toBe("Ada");
    expect(readResumeBundle(store, "missing")).toBeUndefined();
  });
});