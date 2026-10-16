import { formatISO } from "date-fns";
import * as v from "valibot";
import { isNil } from "../../utils";

// plain date aka ISO Date
export type PlainDate = string & { __type: "PlainDate" };
export const PlainDate = v.pipe(v.string(), v.isoDate(), v.transform(plainDateFromString));

export function plainDateFromString(input: string): PlainDate {
  return input as PlainDate;
}

export function plainDateFromJsDate(input: Date): PlainDate {
  return formatISO(input, { representation: "date" }) as PlainDate;
}

export function plainDateNow() {
  return formatISO(new Date(), { representation: "date" }) as PlainDate;
}

export function formatPlainDate(plainDate: PlainDate | null) {
  if (isNil(plainDate)) return "-";
  const [year, month, day] = plainDate.split("-");
  return `${day}/${month}/${year}`;
}

export function plainDateSortAsc(date1: PlainDate, date2: PlainDate) {
  return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
}

export function plainDateSortDesc(date1: PlainDate, date2: PlainDate) {
  return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
}