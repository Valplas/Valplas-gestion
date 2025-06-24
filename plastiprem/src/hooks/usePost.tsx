import { useState } from 'react';
import axios, { AxiosResponse, AxiosError, Method } from 'axios';

interface UsePostResult<T> {
    data: T | null;
    loading: boolean;
    error: AxiosError | null;
    postData: (postData: any,method?: Method) => Promise<void>;
}

function usePost<T>(url: string): UsePostResult<T> {

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | null>(null);


    const postData = async (postData: T, method: Method = 'POST'): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response: AxiosResponse<T> = await axios({
                url,
                method,
                data: method !== 'DELETE' ? postData : undefined,}
            );
            setData(response.data);
        } catch (err) {
            setError(err as AxiosError);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, postData };
};

export default usePost;
