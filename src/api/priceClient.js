import { ANALOGUES_ON, API_URL } from '@/constants/api';
import { TEXT } from '@/constants/ui';

import { asList } from '@/utils/list';
import { asText } from '@/utils/value';

/** Ошибка, которую уже сформулировали для пользователя: catch пропускает её как есть. */
class ApiError extends Error {}

function readApiError(data) {
  const error = data?.error;

  if (Array.isArray(error)) {
    return asList(error)
      .map((item) => asText(item))
      .filter(Boolean)
      .join(', ');
  }

  return asText(error);
}

/**
 * Единственное место разбора сети, HTTP, битого JSON и error из тела API.
 * AbortError пробрасывается как есть.
 * @param {string} url
 * @param {AbortSignal} [signal]
 */
async function request(url, signal) {
  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new ApiError(`${TEXT.httpError} ${response.status}.`);
    }

    const data = await response.json();
    const apiError = readApiError(data);

    if (apiError) {
      throw new ApiError(apiError);
    }

    return data;
  } catch (error) {
    if (error?.name === 'AbortError' || error instanceof ApiError) {
      throw error;
    }

    if (error instanceof SyntaxError) {
      throw new Error(TEXT.badJson);
    }

    if (error instanceof TypeError) {
      throw new Error(TEXT.networkError);
    }

    throw error;
  }
}

/**
 * GET проценки Favorit Parts.
 * @param {{
 *   key: string,
 *   number: string,
 *   brand?: string,
 *   withAnalogues?: boolean,
 *   signal?: AbortSignal,
 * }} query
 * @returns {Promise<unknown[]>}
 */
export async function fetchGoods({ key, number, brand, withAnalogues, signal }) {
  const params = new URLSearchParams({ key, number });

  if (brand) {
    params.set('brand', brand);
  }

  if (withAnalogues) {
    params.set('analogues', ANALOGUES_ON);
  }

  const data = await request(`${API_URL}?${params.toString()}`, signal);

  return asList(data?.goods);
}
