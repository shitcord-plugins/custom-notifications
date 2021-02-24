import React, { useState } from 'react';
import SoundList from './SoundList';
import { Category } from '@vizality/components/settings';
import SongList from './SongList';

export default ({getSetting, updateSetting}) => {
	const settings = {get(id, val) {return getSetting(id, val)}, set(id, val) {return updateSetting(id, val)}};
	const [soundsOpened, setSoundsOpened] = useState(false);
	const [songsOpened, setSongsOpened] = useState(false);

	return <>
		<Category
			note={null}
			name="Sounds"
			opened={soundsOpened}
			onChange={() => setSoundsOpened(!soundsOpened)}
		>
			<SoundList settings={settings}/>
		</Category>
		<Category
			note={null}
			opened={songsOpened}
			name="Songs"
			onChange={() => setSongsOpened(!songsOpened)}
		>
			<SongList settings={settings} />
		</Category>
	</>;
};