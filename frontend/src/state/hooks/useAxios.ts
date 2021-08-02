import { useState, useEffect } from 'react';
import axios from 'axios';

const useAxios = (url: string, method?: 'get' | 'post' | 'put' | 'delete' | 'patch', body?: any) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      let res: any;

      switch(method) {
        case 'post':
          res = (await axios.post(url, body)).data;
          break;
        case 'put':
          res = (await axios.put(url, body)).data;
          break;
        case 'delete':
          res = (await axios.delete(url, body)).data;
          break;
        case 'patch':
          res = (await axios.patch(url, body)).data;
          break;
        default:
          res = (await axios.get(url, body)).data;
          break;
      }
      setData(res)
      setLoading(false);
    }
    fetch();

  }, [url, method, body])

  return { data, loading };
}

export default useAxios;