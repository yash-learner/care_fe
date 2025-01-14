type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null | undefined>;

export type QueryParams = Record<string, QueryParamValue>;

export interface ApiRoute<TData, TBody = unknown> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  TBody?: TBody;
  path: string;
  TRes: TData;
  noAuth?: boolean;
}

/**
 * @deprecated in favor of useQuery/useMutation/callApi
 */
export interface RequestResult<TData> {
  res: Response | undefined;
  data: TData | undefined;
  error: undefined | Record<string, unknown>;
}

/**
 * @deprecated in favor of ApiCallOptions used by useQuery/useMutation/callApi
 */
export interface RequestOptions<TData = unknown, TBody = unknown> {
  query?: QueryParams;
  body?: TBody;
  pathParams?: Record<string, string>;
  onResponse?: (res: RequestResult<TData>) => void;
  silent?: boolean;
}

type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}{${infer Param}}${infer Rest}`
    ? Param | ExtractRouteParams<Rest>
    : never;

type PathParams<T extends string> = {
  [K in ExtractRouteParams<T>]: string;
};

export interface ApiCallOptions<Route extends ApiRoute<unknown, unknown>> {
  pathParams?: PathParams<Route["path"]>;
  queryParams?: QueryParams;
  body?: Route["TBody"];
  silent?: boolean;
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export type StructuredError = Record<string, string | string[]>;

type HTTPErrorCause = StructuredError | Record<string, unknown> | undefined;

export class HTTPError extends Error {
  status: number;
  silent: boolean;
  cause?: HTTPErrorCause;

  constructor({
    message,
    status,
    silent,
    cause,
  }: {
    message: string;
    status: number;
    silent: boolean;
    cause?: Record<string, unknown>;
  }) {
    super(message, { cause });
    this.status = status;
    this.silent = silent;
    this.cause = cause;
  }
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: HTTPError;
  }
}

export interface PaginatedResponse<TItem> {
  count: number;
  next: string | null;
  previous: string | null;
  results: TItem[];
}
