import React from 'react';
import { Icon, Tooltip } from '@vizality/components';
import { getModuleByDisplayName } from '@vizality/webpack';

let audio = new Audio();

const RemoveButton = getModuleByDisplayName('RemoveButton');

function SongItem({name, volume, src, onRemove}) {
   return <div className="songItem">
      <div className="songName">{name}</div>
      <div className="iconContainer">
         <Icon name="Speaker" onClick={() => {
            audio.pause();
            audio.src = src;
            audio.volume = volume / 100;
            audio.play();
         }} />
      </div>
      <RemoveButton className="songRemove" onClick={onRemove} />
   </div>;
}

function convertAudio(buffer) {
   return 'data:audio/mpeg;base64,' + btoa(new Uint8Array(buffer).reduce((binary, byte) => binary += String.fromCharCode(byte), ''));
}

export default function SongList({settings}) {
   return <div className="songControls">
      <Tooltip text="Add new song" className="addSongTooltip" position="right"><Icon name="Plus" onClick={() => {
         DiscordNative.fileManager.openFiles({
            properties: ['openFile'],
            filters: ['.mp3']
         }).then(files => {
            let filesConverted = [];
            for (const file of files) {
               filesConverted.push({
                  label: file.filename,
                  value: convertAudio(file.data)
               });
               settings.set('options', settings.get('options', []).concat(...filesConverted));
            }
         });
      }} /></Tooltip>
      <div className="songList">
         {settings.get('options', []).map((song, i, _this) => <SongItem name={song.label} volume={40} src={song.value} onRemove={() => {
            _this.splice(i, 1);
            settings.set('options', _this);
         }} />)}
      </div>
   </div>;
}