import { useMemo } from "react";

export function useSort(items, sortKey) {
  return useMemo(() => {
    if (!sortKey) {
      return items;
    }

    const sorted = [...items].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];

      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });

    return sorted;
  }, [items, sortKey]);
}
