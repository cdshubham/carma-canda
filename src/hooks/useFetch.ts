import { useState, useEffect } from "react";
import axios, { AxiosResponse, CancelTokenSource } from "axios";

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (body?: any) => void;
}

interface FetchOptions {
  method?: "GET" | "POST";
  body?: any;
}

function useFetch<T>(url: string, options?: FetchOptions): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (body?: any) => {
    setLoading(true);
    setData(null);
    setError(null);

    const source: CancelTokenSource = axios.CancelToken.source();
    const config = {
      cancelToken: source.token,
      method: options?.method || "GET",
      data: body || options?.body,
    };

    return axios
      .request<T>({ url, ...config })
      .then((res: AxiosResponse<T>) => {
        setLoading(false);
        setData(res.data);
        return res.data;
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setLoading(false);
        setError("An error occurred. Awkward..");
      });
  };

  useEffect(() => {
    if (options?.method === "GET") fetchData();
  }, [url]);

  return { data, loading, error, fetchData };
}

export default useFetch;
