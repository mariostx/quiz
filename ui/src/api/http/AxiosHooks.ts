import { showErrorToast, ToastMessage } from 'components/Toast/Toast';
import axios from 'axios';
import Url from 'api/http/Url';
import { useEffect, useRef, useState } from 'react';

export interface AxiosResponse<D> {
    data: D | null;
    loading: boolean;
    error: Error | null;
    reloadData: () => void;
    url: Url | null;
}

// export const showToastFromAxiosHooks = (): void => {
//     showErrorToast('Showing toast from function');
// };

export const useFetch =
    <D>(url: Url | null): AxiosResponse<D> => {
        const [urlString, setUrlString] = useState<string | null>();
        const [data, setData] = useState(null);
        const [error, setError] = useState(null);
        const [loading, setLoading] = useState(false);
        const isMounted = useRef(true);
        const ongoingRequest = axios.CancelToken.source();

        const fetchData = async (): Promise<void> => {
            if (url === null) {
                return;
            }
            setLoading(true);
            return axios
                .get(url.toString(),
                    {
                        cancelToken: ongoingRequest.token,
                    })
                .then((res) => {
                    if (res?.status >= 200 && res?.status <= 300) {
                        if (isMounted.current) {
                            setData(res.data);
                            setError(null);
                        }
                    }
                })
                .catch(error => {
                    if (isMounted.current) {
                        setError(error);
                        showErrorToast(ToastMessage.unsuccessful.get);
                    }
                })
                .finally(() => {
                    if (isMounted.current) setLoading(false);
                });
        };

        useEffect(() => {
            if (urlString) {
                isMounted.current = true;
                fetchData();
                return (): void => {
                    isMounted.current = false;
                    ongoingRequest.cancel();
                };
            }

        }, [urlString]);

        useEffect(() => {
            if (url) {
                if (url.toString() !== urlString) {
                    setUrlString(url.toString());
                }
            }
        }, [url]);

        const reloadData = (): void => {
            fetchData();
        };

        return { data, loading, error, reloadData, url };
    };
