import { STATUS } from '@/constants/search';

/** Статус хука RTK Query в статусы экрана. Пока запрос не начат — шаг ещё пустой. */
export function getQueryStatus(query, active) {
  if (!active) {
    return STATUS.IDLE;
  }

  if ((query.isLoading || query.isFetching) && query.currentData === undefined) {
    return STATUS.LOADING;
  }

  if (query.isUninitialized) {
    return STATUS.IDLE;
  }

  if (query.isError && query.error?.name !== 'AbortError') {
    return STATUS.ERROR;
  }

  if (query.isError) {
    return STATUS.IDLE;
  }

  return STATUS.SUCCESS;
}

/** @param {{ message?: string, name?: string } | undefined} error */
export function getQueryError(error, fallback) {
  if (!error || error.name === 'AbortError') {
    return fallback;
  }

  return error.message || fallback;
}
