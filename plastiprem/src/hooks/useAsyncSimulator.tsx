import { useState, useCallback } from 'react';

type AsyncSimulatorState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  execute: (...args: any[]) => Promise<void>;
};

export function useAsyncSimulator<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  autoExecute = false
): AsyncSimulatorState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(...args);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  // Si `autoExecute` es true, ejecuta automáticamente al montar el hook
  useState(() => {
    if (autoExecute) {
      execute();
    }
  });

  return { data, error, loading, execute };
}
