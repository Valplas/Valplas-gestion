import axios from 'axios';
import { useState, useEffect } from 'react';

function useFetch<T>(url: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<T>(url);
      setData(response.data);
      setError(null); // limpiamos errores anteriores si fue exitoso
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...dependencies]); // incluye url y cualquier dependencia adicional

  return { data, loading, error };
}

export default useFetch;
