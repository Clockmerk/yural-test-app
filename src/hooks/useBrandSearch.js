import { createContext, createElement, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DEBOUNCE_MS, MIN_ARTICLE_LENGTH } from '@/constants/api';

import { clearSelectedBrand, setApiKey } from '@/store/searchSlice';
import { selectApiKey } from '@/store/selectors';

const BrandQueryContext = createContext(null);

/**
 * Артикул живёт локально. В запрос он попадает после паузы.
 * Смена запроса сбрасывает выбранный бренд: предложения к нему больше не относятся.
 */
function useBrandQueryState() {
  const dispatch = useDispatch();
  const apiKey = useSelector(selectApiKey);

  const requestRef = useRef(null);

  const [article, setArticle] = useState('');
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const number = article.trim();
    const key = apiKey.trim();
    const timerId = setTimeout(() => {
      const next = number.length >= MIN_ARTICLE_LENGTH && key ? { key, number } : null;
      const prev = requestRef.current;

      if (prev?.key === next?.key && prev?.number === next?.number) {
        return;
      }

      requestRef.current = next;
      dispatch(clearSelectedBrand());
      setRequest(next);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timerId);
  }, [article, apiKey, dispatch]);

  const updateApiKey = (value) => {
    dispatch(setApiKey(value));
  };

  return {
    article,
    setArticle,
    apiKey,
    setApiKey: updateApiKey,
    request,
  };
}

export function BrandQueryProvider({ children }) {
  const value = useBrandQueryState();

  return createElement(BrandQueryContext.Provider, { value }, children);
}

export function useBrandSearch() {
  const value = useContext(BrandQueryContext);

  if (!value) {
    throw new Error('useBrandSearch используется внутри BrandQueryProvider');
  }

  return value;
}
