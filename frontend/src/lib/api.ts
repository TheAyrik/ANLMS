const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

type ApiRequestOptions = {
  method?: string;
  body?: BodyInit | Record<string, unknown> | null;
  headers?: HeadersInit;
  onUnauthorized?: () => void;
};

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, headers, onUnauthorized }: ApiRequestOptions = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API base URL is not configured');
  }

  const init: RequestInit = {
    method,
    credentials: 'include',
    headers,
  };

  if (body instanceof FormData) {
    init.body = body;
  } else if (body !== undefined && body !== null) {
    init.body = JSON.stringify(body);
    init.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (response.status === 401 && onUnauthorized) {
    onUnauthorized();
  }

  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message =
      (data as { detail?: string })?.detail ||
      response.statusText ||
      'Request failed';
    throw new ApiError(message, response.status, data ?? undefined);
  }

  return data as T;
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch (_) {
    return value;
  }
}
