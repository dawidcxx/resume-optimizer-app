import { createFetchClient, todosContract } from "@resume-optimzer-app/common";

export const todosApi = createFetchClient(todosContract, { baseUrl: "/api" });