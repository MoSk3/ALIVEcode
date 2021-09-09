import { LevelBrowseProps, StyledLevelBrowse } from './levelBrowseTypes';
import { useState } from 'react';
import { Level } from '../../../Models/Level/level.entity';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import LevelCard from '../../../Components/LevelComponents/LevelCard/LevelCard';
import BrowsingMenu from '../../../Components/MainComponents/BrowsingMenu/BrowsingMenu';
import { BrowsingResults } from '../../../Components/MainComponents/BrowsingMenu/browsingMenuTypes';
import api from '../../../Models/api';

const LevelBrowse = (props: LevelBrowseProps) => {
	const [browsingResult, setBrowsingResult] =
		useState<BrowsingResults<Level>>();
	const levels = browsingResult?.results;

	return (
		<StyledLevelBrowse>
			<BrowsingMenu<Level>
				fetchOnSubmit
				apiRequest={api.db.levels.query}
				onChange={res => setBrowsingResult(res)}
			/>
			<div className="levels">
				{!levels ? (
					<LoadingScreen relative />
				) : (
					<>
						{levels.map((l, idx) => (
							<LevelCard level={l} key={idx} />
						))}
					</>
				)}
			</div>
		</StyledLevelBrowse>
	);
};

export default LevelBrowse;