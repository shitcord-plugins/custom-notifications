import { Tooltip } from '@vizality/components';
import React, { useEffect, useState } from 'react';
import { DiscordModules } from '../discord';
import { Category } from '@vizality/components/settings';

function useStateFromStores(stores, func) {
   const [state, setState] = useState(func());

   function handler() {
      setState(func());  
   }
   useEffect(() => {
      stores.forEach(store => store.addChangeListener(handler));
      return () => stores.forEach(store => store.removeChangeListener(handler));
   });

   return state;
}

function GuildItems({onGuildSelect}) {
   const Guilds = useStateFromStores([DiscordModules.GuildStore], () => Object.values(DiscordModules.GuildStore.getGuilds())).concat({name: "ALL", getIconURL: () => null});

   return <div className="cn-guildItems">
      {Guilds.map(guild => 
         <Tooltip text={guild.name}>
            <img src={guild.getIconURL() || 'vz-asset://image/logo.png'} alt={guild.name} onClick={() => onGuildSelect(guild)} /> 
         </Tooltip>)
      }
   </div>;
}

export default function GuildList() {
   const [opened, setOpen] = useState(true);
   const [guild, setGuild] = useState(null);

   return <Category
      name="Notifications"
      opened={opened}
      description={null}
      onChange={() => setOpen(!opened)}
   >
      <GuildItems onGuildSelect={guild => setGuild(guild)} />
   </Category>
}