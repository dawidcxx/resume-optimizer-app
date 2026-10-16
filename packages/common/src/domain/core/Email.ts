import { email, parse as vParse, pipe, string, transform } from "valibot";

export type Email = string & { __type: "Email" };

export const Email = pipe(
  string(),
  email(),
  transform((it) => it as Email),
);

export function emailFromString(email: string): Email {
  return vParse(Email, email);
}