import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {
    classId: searchParams.get('classId') || '',
    sectionId: searchParams.get('sectionId') || '',
    subjectId: searchParams.get('subjectId') || '',
    search: searchParams.get('search') || '',
    date: searchParams.get('date') || '',
    page: searchParams.get('page') || '1',
  };

  const setParams = useCallback(
    (updates) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (value) next.set(key, value);
            else next.delete(key);
          });
          // reset pagination whenever a non-page param changes
          if (!('page' in updates)) next.delete('page');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return [params, setParams];
};

export default useFilterParams;
