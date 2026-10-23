import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { generateId, uuidFromString } from "@resume-optimzer-app/common";
import { Config } from "@/shared/Config";
import { LocalFileStorage } from "./LocalFileStorage";

const TEST_DIR = path.resolve(".storage-test");

describe("LocalFileStorage", () => {
  let storage: LocalFileStorage;

  beforeEach(() => {
    storage = new LocalFileStorage(new Config({ fsStoragePath: TEST_DIR }));
  });

  afterAll(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  test("put stores a file and creates directory structure", async () => {
    const key = uuidFromString("adfe5039-8d6e-4ceb-90a2-96232cd042fe");
    const content = Buffer.from("test content");

    await storage.put(key, content);

    const expectedPath = path.join(TEST_DIR, "ad", "fe", key);
    const exists = await fs
      .access(expectedPath)
      .then(() => true)
      .catch(() => false);

    expect(exists).toBe(true);
  });

  test("get retrieves stored file content", async () => {
    const key = uuidFromString("cdd2dd37-a708-45df-b720-aeb4d2118a2d");
    const content = Buffer.from("hello world");

    await storage.put(key, content);
    const retrieved = await storage.get(key);

    expect(retrieved?.toString()).toBe("hello world");
  });

  test("get returns null for non-existent file", async () => {
    const key = generateId();
    const result = await storage.get(key);
    expect(result).toBe(null);
  });

  test("exists returns true for existing file", async () => {
    const key = uuidFromString("8674ca1c-2196-45b8-9816-fabab4d20728");
    const content = Buffer.from("exists test");

    await storage.put(key, content);
    const result = await storage.exists(key);

    expect(result).toBe(true);
  });

  test("exists returns false for non-existent file", async () => {
    const key = uuidFromString("0ad3017c-2c57-4df6-9431-8e93a7bbaebf");
    const result = await storage.exists(key);
    expect(result).toBe(false);
  });

  test("delete removes existing file", async () => {
    const key = uuidFromString("0ad3017c-2c57-4df6-9431-8e93a7bbaebf");
    const content = Buffer.from("to be deleted");

    await storage.put(key, content);
    expect(await storage.exists(key)).toBe(true);

    await storage.delete(key);
    expect(await storage.exists(key)).toBe(false);
  });

  test("delete succeeds silently for non-existent file", async () => {
    const key = uuidFromString("568121c7-d98c-4e89-b85b-e223505e11cd");
    await expect(storage.delete(key)).resolves.toBeUndefined();
  });

  test("handles binary content correctly", async () => {
    const key = uuidFromString("0daa6ea7-0a81-404e-b4d7-b5c393376bf4");
    const content = Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe, 0xfd]);
    await storage.put(key, content);
    const retrieved = await storage.get(key);
    expect(retrieved).toEqual(content);
  });

  test("shards UUIDs correctly into directory structure", async () => {
    const key = uuidFromString("17c0eaeb-f3b4-4854-b9c1-68bf8ee62d10");
    const content = Buffer.from("sharding test");

    await storage.put(key, content);

    const expectedPath = path.join(TEST_DIR, "17", "c0", key);
    const fileContent = await fs.readFile(expectedPath);

    expect(fileContent.toString()).toBe("sharding test");
  });

  test("handles multiple files in different shards", async () => {
    const keys = [generateId(), generateId(), generateId()];
    for (const [i, key] of keys.entries()) {
      await storage.put(key, Buffer.from(`content ${i}`));
    }
    for (const [i, key] of keys.entries()) {
      const content = await storage.get(key);
      expect(content?.toString()).toBe(`content ${i}`);
    }
  });
});