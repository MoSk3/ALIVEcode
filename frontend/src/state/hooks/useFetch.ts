import { useState, useEffect } from 'react';

const useFetch = <T>(
	query: () => Promise<T>,
): [data: T | undefined, loading: boolean] => {
	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			setData(await query());
			setLoading(false);
		};
		fetch();
	}, [query]);

	return [data, loading];
};

export default useFetch;