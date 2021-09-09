import { BrowsingMenuProps, StyledBrowsingMenu, BrowsingQuery } from './browsingMenuTypes';
import SearchBar from './SearchBar/SearchBar';
import { useState, useEffect } from 'react';
import Button from '../../UtilsComponents/Button/Button';

const BrowsingMenu = <T extends any>({
	onChange,
	fetchOnSubmit,
	apiRequest,
}: BrowsingMenuProps<T>) => {
	const [query, setQuery] = useState<BrowsingQuery>({});
	const [oldQuery, setOldQuery] = useState<BrowsingQuery>();

	const getResults = async () => {
		if (JSON.stringify(oldQuery) === JSON.stringify(query)) return;
		const levels = await apiRequest(query);
		setOldQuery(query);
		onChange({
			results: levels,
			nbResults: levels.length,
		});
	};

	useEffect(() => {
		getResults();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<StyledBrowsingMenu>
			<div>
				<SearchBar
					value={query.txt || ''}
					setValue={txt => setQuery({ ...query, txt })}
					onSubmit={() => fetchOnSubmit && getResults()}
				/>
			</div>
			<div>
				<Button variant="primary" onClick={getResults}>
					Search
				</Button>
			</div>
		</StyledBrowsingMenu>
	);
};

export default BrowsingMenu;