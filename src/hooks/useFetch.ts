// // import { useState, useEffect } from "react";
// // import axios, { AxiosResponse, CancelTokenSource } from "axios";

// // interface FetchResult<T> {
// //   data: T | null;
// //   loading: boolean;
// //   error: string | null;
// //   fetchData: (body?: any) => void;
// // }

// // interface FetchOptions {
// //   method?: "GET" | "POST";
// //   body?: any;
// // }

// // function useFetch<T>(url: string, options?: FetchOptions): FetchResult<T> {
// //   const [data, setData] = useState<T | null>(null);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string | null>(null);

// //   const fetchData = async (body?: any) => {
// //     setLoading(true);
// //     setData(null);
// //     setError(null);

// //     const source: CancelTokenSource = axios.CancelToken.source();
// //     const config = {
// //       cancelToken: source.token,
// //       method: options?.method || "GET",
// //       data: body || options?.body,
// //     };

// //     return axios
// //       .request<T>({ url, ...config })
// //       .then((res: AxiosResponse<T>) => {
// //         setLoading(false);
// //         setData(res.data);
// //         return res.data;
// //       })
// //       .catch((err) => {
// //         if (axios.isCancel(err)) return;
// //         setLoading(false);
// //         setError("An error occurred. Awkward..");
// //       });
// //   };

// //   useEffect(() => {
// //     if (options?.method === "GET") fetchData();
// //   }, [url]);

// //   return { data, loading, error, fetchData };
// // }

// // export default useFetch;

// import { useState, useEffect } from "react";
// import axios, { AxiosResponse, CancelTokenSource } from "axios";

// interface FetchResult<T> {
//   data: T | null;
//   loading: boolean;
//   error: string | null;
//   fetchData: (body?: any) => Promise<T | undefined>;
// }

// interface FetchOptions {
//   method?: "GET" | "POST";
//   body?: any;
// }

// export function useFetch<T>(
//   url: string,
//   options?: FetchOptions
// ): FetchResult<T> {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = async (body?: any): Promise<T | undefined> => {
//     setLoading(true);
//     setData(null);
//     setError(null);

//     const source: CancelTokenSource = axios.CancelToken.source();
//     const config = {
//       cancelToken: source.token,
//       method: options?.method || "GET",
//       data: body || options?.body,
//     };

//     try {
//       const res: AxiosResponse<T> = await axios.request<T>({ url, ...config });
//       setLoading(false);
//       setData(res.data);
//       return res.data;
//     } catch (err) {
//       if (axios.isCancel(err)) return;
//       setLoading(false);
//       setError("An error occurred. Awkward..");
//       console.error("Fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     let source: CancelTokenSource | null = null;

//     if (options?.method === "GET") {
//       source = axios.CancelToken.source();
//       const config = {
//         cancelToken: source.token,
//         method: "GET",
//         data: options?.body,
//       };

//       axios
//         .request<T>({ url, ...config })
//         .then((res: AxiosResponse<T>) => {
//           setLoading(false);
//           setData(res.data);
//         })
//         .catch((err) => {
//           if (axios.isCancel(err)) return;
//           setLoading(false);
//           setError("An error occurred. Awkward..");
//           console.error("Fetch error:", err);
//         });

//       setLoading(true);
//     }

//     return () => {
//       if (source) {
//         source.cancel("Component unmounted");
//       }
//     };
//   }, [url]);

//   return { data, loading, error, fetchData };
// }

// export default useFetch;

import { useState, useEffect } from "react";
import axios, { AxiosResponse, CancelTokenSource } from "axios";

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (body?: Record<string, unknown>) => Promise<T | undefined>;
}

interface FetchOptions {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
}

export function useFetch<T>(
  url: string,
  options?: FetchOptions
): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    body?: Record<string, unknown>
  ): Promise<T | undefined> => {
    setLoading(true);
    setData(null);
    setError(null);

    const source: CancelTokenSource = axios.CancelToken.source();
    const config = {
      cancelToken: source.token,
      method: options?.method || "GET",
      data:
        (body as Record<string, unknown>) ||
        (options?.body as Record<string, unknown>),
    };

    try {
      const res: AxiosResponse<T> = await axios.request<T>({ url, ...config });
      setLoading(false);
      setData(res.data);
      return res.data;
    } catch (err) {
      if (axios.isCancel(err)) return;
      setLoading(false);
      setError("An error occurred. Awkward..");
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    let source: CancelTokenSource | null = null;

    if (options?.method === "GET") {
      source = axios.CancelToken.source();
      const config = {
        cancelToken: source.token,
        method: "GET",
        data: options?.body as Record<string, unknown>,
      };

      axios
        .request<T>({ url, ...config })
        .then((res: AxiosResponse<T>) => {
          setLoading(false);
          setData(res.data);
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;
          setLoading(false);
          setError("An error occurred. Awkward..");
          console.error("Fetch error:", err);
        });

      setLoading(true);
    }

    return () => {
      if (source) {
        source.cancel("Component unmounted");
      }
    };
  }, [url]);

  return { data, loading, error, fetchData };
}

export default useFetch;
