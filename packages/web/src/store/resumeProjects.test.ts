import { beforeEach, describe, expect, it } from "vitest";
import { createResumeProject, deleteResumeProject } from "./resumeProjects";
import { readResume, readResumeProjects } from "./selectors";
import { store } from "./store";

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
  });

  it("deletes both the project row and its resume row", () => {
    const project = createResumeProject({ name: "My resume" });

    deleteResumeProject(project.id);

    expect(readResumeProjects(store)).toEqual([]);
    expect(readResume(store, project.id)).toBeUndefined();
  });
});
