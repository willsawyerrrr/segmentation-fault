/**
 * This is a wrapper for interactions with the RESTful API for Segmentation Fault.
 * It is used to abstract HTTP requests to and responses from the API.
 */

export * from "./auth";
export * from "./comments";
export * from "./posts";
export * from "./schemas";
export * from "./users";

const BASE_URL = import.meta.env.VITE_API_URL as string;

const UNAUTHENTICATED_ROUTES = [
    "forgot-password",
    "login",
    "reset-password",
    "sign-up",
    "verify-email",
];

/**
 * Performs a HTTP request to the given endpoint. If the response results in a 401
 * (unauthorized) status code, the user is redirected to the login page.
 *
 * @param {string} method the HTTP method to use
 * @param {string} endpoint the URL to send the request to
 * @param {Record<string, string>} [headers = {}] options to pass to the request
 * @param {XMLHttpRequestBodyInit} [body = undefined] options to pass to the request
 * @param {boolean} [setJSONContentType = true] whether to set the `Content-Type` header to `application/json`
 *
 * @returns {[number, string]} the HTTP response status code and body from the server
 */
export async function request<TExpectedReturn>(
    method: string,
    endpoint: string,
    body?: XMLHttpRequestBodyInit,
    headers: Record<string, string> = {},
    setJSONContentType: boolean = true
): Promise<[number, TExpectedReturn]> {
    // promise wrapper for XMLHttpRequest to enable async/await syntax
    return new Promise((resolve, reject) => {
        if (sessionStorage.getItem("token")) {
            headers["Authorization"] = `Bearer ${sessionStorage.getItem("token")}`;
        }

        if (setJSONContentType) {
            headers["Content-Type"] = "application/json";
        }

        const request = new XMLHttpRequest();
        request.open(method, `${BASE_URL}${endpoint}`);

        for (const [key, value] of Object.entries(headers)) {
            request.setRequestHeader(key, value);
        }

        request.send(body);

        request.onload = function () {
            const status = request.status;

            if (status === 401 && UNAUTHENTICATED_ROUTES.includes(location.pathname)) {
                location.href = "/login";
                return;
            }

            if (status >= 200 && status < 300) {
                resolve([request.status, JSON.parse(request.responseText)]);
            } else {
                reject(request.status);
            }
        };
    });
}

/** Performs a HTTP DELETE request to the given endpoint. */
export const httpDelete = async <TExpectedReturn>(
    endpoint: string,
    body?: XMLHttpRequestBodyInit,
    headers: Record<string, string> = {},
    setJSONContentType: boolean = true
): Promise<[number, TExpectedReturn]> =>
    await request<TExpectedReturn>("DELETE", endpoint, body, headers, setJSONContentType);

/** Performs a HTTP GET request to the given endpoint. */
export const get = async <TExpectedReturn>(
    endpoint: string,
    body?: XMLHttpRequestBodyInit,
    headers: Record<string, string> = {},
    setJSONContentType: boolean = true
): Promise<[number, TExpectedReturn]> =>
    await request<TExpectedReturn>("GET", endpoint, body, headers, setJSONContentType);

/** Performs a HTTP POST request to the given endpoint. */
export const post = async <TExpectedReturn>(
    endpoint: string,
    body?: XMLHttpRequestBodyInit,
    headers: Record<string, string> = {},
    setJSONContentType: boolean = true
): Promise<[number, TExpectedReturn]> =>
    await request<TExpectedReturn>("POST", endpoint, body, headers, setJSONContentType);

/** Performs a HTTP PUT request to the given endpoint. */
export const put = async <TExpectedReturn>(
    endpoint: string,
    body?: XMLHttpRequestBodyInit,
    headers: Record<string, string> = {},
    setJSONContentType: boolean = true
): Promise<[number, TExpectedReturn]> =>
    await request<TExpectedReturn>("PUT", endpoint, body, headers, setJSONContentType);
