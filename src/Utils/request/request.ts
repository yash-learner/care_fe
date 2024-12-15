import careConfig from "@careConfig";

import handleResponse from "@/Utils/request/handleResponse";
import { RequestOptions, RequestResult, Route } from "@/Utils/request/types";
import { makeHeaders, makeUrl } from "@/Utils/request/utils";

type Options<TData, TBody> = RequestOptions<TData, TBody> & {
  signal?: AbortSignal;
};

export default async function request<TData, TBody>(
  { path, method, noAuth }: Route<TData, TBody>,
  {
    query,
    body,
    pathParams,
    onResponse,
    silent,
    signal,
  }: Options<TData, TBody> = {},
): Promise<RequestResult<TData>> {
  const url = `${careConfig.apiUrl}${makeUrl(path, query, pathParams)}`;

  const options: RequestInit = { method, signal };

  if (body) {
    options.body = JSON.stringify(body);
  }

  let result: RequestResult<TData> = {
    res: undefined,
    data: undefined,
    error: undefined,
  };

  options.headers = makeHeaders(noAuth ?? false);

  try {
    const res = await fetch(url, options);

    const data = await getResponseBody<TData>(res);

    result = {
      res,
      data: res.ok ? data : undefined,
      error: res.ok ? undefined : (data as Record<string, unknown>),
    };

    onResponse?.(result);
    handleResponse(result, silent);

    return result;
  } catch (error: any) {
    result = { error, res: undefined, data: undefined };
    if (error.name === "AbortError") {
      return result;
    }
  }

  console.error(`Request failed `, result.error);
  return result;
}

export async function getResponseBody<TData>(res: Response): Promise<TData> {
  if (!(res.headers.get("content-length") !== "0")) {
    return null as TData;
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const isImage = res.headers.get("content-type")?.includes("image");

  if (isImage) {
    return (await res.blob()) as TData;
  }

  if (!isJson) {
    return (await res.text()) as TData;
  }

  try {
    return await res.json();
  } catch {
    return (await res.text()) as TData;
  }
}
