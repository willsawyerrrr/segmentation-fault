export * from "./auth";
export * from "./comments";
export * from "./other";
export * from "./posts";
export * from "./users";

export function internaliseDate(date: string | null | undefined): Date | undefined {
    return date === null || date === undefined ? undefined : new Date(date);
}
