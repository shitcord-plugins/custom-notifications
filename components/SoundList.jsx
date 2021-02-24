import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';
import React from 'react';
import defaultSounds from '../data/defaultSounds';
import SoundItem from './SoundItem';
import { DiscordModules } from '../discord';

const {scrollerBase} = getModule('scrollerBase', 'thin');

function mapDefaultSounds() {
   return Object.entries(defaultSounds).reduce((final, [id, src]) => {
      final[id] = {song: {label: id, value: DiscordModules.SoundResolver(src)}, volume: 40, dnd: true};
      return final;
   }, {});
}

export default function SoundList({settings}) {
   return <div className={joinClassNames('cn-soundList', scrollerBase)}>
      {Object.keys(settings.get('sounds', mapDefaultSounds())).reduce((final, item) => {
         final.push(<SoundItem name={item} id={item} settings={settings}/>)
         return final;
      }, [])}   
   </div>;
}