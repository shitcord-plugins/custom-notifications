import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import React, { useState } from 'react';
import { Flex, Icon, Text, Tooltip } from '@vizality/components';
import defaultSounds from '../data/defaultSounds';
import { DiscordModules } from '../discord';
import Margin from './Margin';

const { FormSection } = getModule('FormTitle');
const Dropdown = getModuleByDisplayName('Select');
const Slider = getModuleByDisplayName('Slider');
const _Checkbox = getModuleByDisplayName('Checkbox');

const defaultOptions = [{label: '---', value: '---'}];

function mapDefaultSounds() {
   return Object.entries(defaultSounds).reduce((final, [id, src]) => {
      final[id] = {song: DiscordModules.SoundResolver(src), volume: 40, dnd: true};
      return final;
   }, {});
}

const speakers = [
   'SpeakerMuted',
   'SpeakerQuiet',
   'Speaker'
]

const audio = new Audio();

function Checkbox({value, onChange, label, className}) {
	const [checked, setChecked] = useState(value);

	return <Flex className={className} direction={Flex.Direction.HORIZONTAL} style={{alignItems: 'center'}}>
		<Text className="label">{label}</Text>
		<Margin left={5} />
		<_Checkbox type={_Checkbox.Types.INVERTED} value={checked} onChange={() => {setChecked(!checked); onChange(!checked);}} shape={_Checkbox.Shapes.ROUND} />
	</Flex>
}

export default function SoundItem({name, settings, id}) {
   const sounds = settings.get('sounds', Object.assign(mapDefaultSounds(), {[id]: {volume: 40, song: '---', dnd: true}}));
   const [song, setSong] = useState(sounds[id].song);
   const [volume, setVolume] = useState(sounds[id].volume);
   const [dnd, setDnd] = useState(sounds[id].dnd);

   const playSound = () => {
      if (song === 'none') return;
      audio.pause();
      audio.src = song;
      audio.volume = volume / 100;
      audio.play();
   };

   const updateSound = options => {
      settings.set('sounds', Object.assign(sounds, {[id]: Object.assign({}, sounds[id], options)}));
   };

   return <Flex direction={Flex.Direction.HORIZONTAL} className="cn-soundItem">
      <div className="contents">
         <div className="soundHeader">
            <Text size={Text.Sizes.SIZE_16} className="soundName">{name}</Text>
            <Tooltip className="iconContainer" text="Preview">
               <Icon className={song == 'none' ? 'disabled' : ''} name={speakers[Math.floor(volume) >= 50 ? 2 : Math.floor(volume) === 0 ? 0 : 1]} onClick={playSound} />
            </Tooltip>
         </div>
         <FormSection
            title="Volume:"
            className="soundVolume"
         >
            <Slider  
               handleSize={16}
               initialValue={volume}
               minValue={0}
               maxValue={100}
               onValueChange={value => {
                  setVolume(value);
                  updateSound({volume: value});
               }}
            />
         </FormSection>
      </div>
      <div className="rightContainer">
         <Dropdown  
            options={settings.get('options', defaultOptions).concat({label: 'None', value: 'none'}, {label: 'Default', value: 'default'})}
            value={song}
            className="soundSelect"
            placeholder="Select Sound"
            onChange={value => {
               if (value === 'default') value = defaultSounds[id];
               setSong(value);
               updateSound({song: value});
            }}
         />
         <Checkbox className="soundDnd" label="Supress in DND" value={dnd} onChange={value => {
            setDnd(value);
            updateSound({dnd: value});
         }} />
      </div>
   </Flex>;
}