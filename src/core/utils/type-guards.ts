import { ResultStatus } from "../types/result.code";
import type { Result, SuccessResult } from "../types/result.type";

export function isSuccessResult<T>(
  result: Result<T | null>,
): result is SuccessResult<T> {
  return result.status === ResultStatus.Success;
}
