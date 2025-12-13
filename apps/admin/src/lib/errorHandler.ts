import { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getRTKErrorMessage(error: unknown): string {
  // BaseQuery or backend error
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    (error as any).data
  ) {
    const backend = (error as any).data as { message?: string };
    return backend.message ?? "Unknown error";
  }

  // SerializedError or JS error
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as any).message === "string"
  ) {
    return (error as any).message;
  }

  return "Something went wrong";
}

