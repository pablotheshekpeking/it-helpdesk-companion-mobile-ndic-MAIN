import { useEffect, useRef, useState } from "react";
import { clampLimit } from "../../lib/pagination";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  type PageSizeOption,
} from "../../types/pagination.types";

export interface UsePaginationStateOptions {
  syncToUrl?: boolean;
  resetKey?: string;
  defaultLimit?: PageSizeOption;
}

export function usePaginationState({
  resetKey = "",
  defaultLimit = DEFAULT_PAGE_SIZE,
}: UsePaginationStateOptions = {}) {
  const [page, setPageState] = useState(1);
  const [limit, setLimitState] = useState<PageSizeOption>(defaultLimit);
  const prevResetKey = useRef(resetKey);

  useEffect(() => {
    if (prevResetKey.current !== resetKey) {
      prevResetKey.current = resetKey;
      setPageState(1);
    }
  }, [resetKey]);

  const setPage = (next: number) => setPageState(Math.max(1, next));
  const setLimit = (next: PageSizeOption) => {
    const safe = (PAGE_SIZE_OPTIONS as readonly number[]).includes(clampLimit(next))
      ? (clampLimit(next) as PageSizeOption)
      : defaultLimit;
    setLimitState(safe);
    setPageState(1);
  };

  return { page, limit, setPage, setLimit };
}
