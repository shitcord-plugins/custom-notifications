import React, { useState } from 'react';
import { Flex, Text } from '@vizality/components';
import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import SoundList from './SoundList';
import { Category } from '@vizality/components/settings';
import SongList from './SongList';
const _Checkbox = getModuleByDisplayName('Checkbox');
const classes = getModule('divider', 'themed');

function VerticalDivider() {
	return <div className={classes.divider} />;
}

function Checkbox({value, onChange, label}) {
	const [checked, setChecked] = React.useState(value);

	return <Flex direction={Flex.Direction.HORIZONTAL} style={{alignItems: "center"}}>
		<Text>{label}</Text>
		<Margin left={5} />
		<_Checkbox value={checked} onChange={() => {setChecked(!checked); onChange(!checked);}} shape={_Checkbox.Shapes.ROUND} />
	</Flex>
} 

function Divider() {
	return <>
		<_Divider />
		<Margin all={20} />
	</>;
}


function SoundItem({volume, sound}) {
   const [{}, setState] = useState();

   return <Flex direction={Flex.Direction.HORIZONTAL}>
      <Text>Message 1</Text>
   </Flex>;
}

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