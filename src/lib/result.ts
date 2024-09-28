import { Err, Ok, Result } from "ts-results-es";
import { z, ZodAny, ZodTypeAny } from "zod";

// prettier-ignore
export async function resultify<O extends any, E extends Error = Error>(promise: Promise<O>){
    return promise.then(Ok<O>).catch(Err<E>)
}

export class CompleteError extends Error {
  code: ErrorEnum;
  constructor(message: string, code: ErrorEnum) {
    super(message);
    this.code = code;
  }
}

export class NotFoundError extends Error {}

// prettier-ignore
export function resultifyJson<T>(result: ActionResult<T>): Result<T, CompleteError>{
  if(result.ok)return Ok<T>(result.data)
    return Err<CompleteError>(new CompleteError(result.error.message, result.error.code))
}

export enum ErrorEnum {
  Unknown = -1,
  AlreadyExists,
  NotFound,
  NoPermission,
}

export type ActionError = {
  message: string;
  code: ErrorEnum;
};

export type ActionResult<T> =
  | {
      ok: false;
      error: ActionError;
    }
  | {
      ok: true;
      data: T;
    };
