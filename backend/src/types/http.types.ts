import { type Request, type Response } from "express";

export type TypedRequestBody<T> = Request<{}, {}, T>;

export type TypedRequestParams<T> = Request<T>;

export type TypedRequestQuery<T> = Request<{}, {}, {}, T>;

export type TypedResponse<T> = Response<T>;
