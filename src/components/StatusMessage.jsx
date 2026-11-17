import { STATUS } from '@/constants/search';

import { Alert, Empty, Loader } from '@/ui';

/** Состояние шага: загрузка, ошибка, ещё не начат или пустой результат. */
export default function StatusMessage({
  status,
  error,
  loadingText,
  idleText,
  emptyText,
  isEmpty,
}) {
  switch (status) {
    case STATUS.LOADING:
      return <Loader>{loadingText}</Loader>;
    case STATUS.ERROR:
      return <Alert>{error}</Alert>;
    case STATUS.IDLE:
      return <Empty>{idleText}</Empty>;
    default:
      return isEmpty ? <Empty>{emptyText}</Empty> : null;
  }
}
