import { Plugin } from '@vizality/entities';
import { getModule } from '@vizality/webpack';
import { DiscordApi, DiscordModules, Patcher, Utilities } from './discord';
import { patch, unpatch } from '@vizality/patcher';
import defaultSounds from './data/defaultSounds';

function mapDefaultSounds() {
   return Object.entries(defaultSounds).reduce((final, [id, src]) => {
      final[id] = {song: DiscordModules.SoundResolver(src), volume: 40, dnd: true};
      return final;
   }, {});
}

export default class CustomNotifications extends Plugin {
   unpatches = [];
   audio = void 0;

   start() {
      this.injectStyles('./sass/index.scss');
      this.unpatches.push(
         this.patchNotifications(), 
         this.patchDispatcher()
      );
   }

   parseType(name) {
      return name.split('_').map(e => e[0].toUpperCase() + e.slice(1)).join(' ');
   }

   fireSound(type) {
      const sound = this.settings.get('sounds', mapDefaultSounds())[type];
      if (!sound || sound.song === 'none' || (sound.dnd && DiscordApi.currentStatus === 'dnd')) return;
      if (!this.audio) this.audio = new Audio();
      else this.audio.pause();

      this.audio.src = sound.song;
      this.audio.volume = sound.volume / 100;
      this.audio.play();
   }

   patchNotifications() {
      const SoundModule = getModule('playSound');

      return Patcher.instead(SoundModule, 'playSound', (_this, [type, volume], originalFunction) => {
         if (type == 'message1') return;
         const parsed = this.parseType(type); 
         if (!this.settings.get('sounds', mapDefaultSounds())[parsed]) return originalFunction(type, volume);
         this.fireSound(parsed);
      });

   }

   patchDispatcher() {
      patch('custom-notifications-dispatcher', DiscordModules.Dispatcher, 'dispatch', args => {
         const [obj] = args;
         if (obj?.type !== 'MESSAGE_CREATE' || !obj.message) return args;
         const {message, channelId} = obj;
         if (message.author.id === DiscordApi.currentUser.id) return args;
         if (DiscordModules.MutedStore.isMuted(message.guild_id)) return args;
         if (!message.guild_id && (DiscordApi.currentChannelId !== channelId || DiscordApi.currentChannelId === channelId && !document.hasFocus())) return (this.fireSound('Direct Message'), args);
         if (Utilities.isRawMention(message.content)) return this.fireSound('Mention1');
         if (message.content.indexOf('@here') > -1 && message.mention_everyone && !DiscordModules.GuildSettingsStore.isSuppressEveryoneEnabled(message.guild_id, channelId)) return (this.fireSound('Here Mentioned'), args);
         if (message.content.indexOf('@everyone') > -1 && message.mention_everyone && DiscordModules.GuildSettingsStore.isSuppressEveryoneEnabled(message.guild_id, channelId)) return (this.fireSound('Everyone Mentioned'), args);
         if (message.mentions.some(e => e.id === DiscordApi.currentUser.id) && (DiscordApi.currentChannelId !== channelId || DiscordApi.currentChannelId === channelId && !document.hasFocus())) return (this.fireSound('Mentioned3'), args);
         if ((document.hasFocus() || DiscordApi.currentChannelId != channelId)) return (this.fireSound('Message1'), args);

         return args;
      });

      return () => unpatch('custom-notifications-dispatcher');
   }


   stop() {
   for (const unpatch of this.unpatches) unpatch();
   }
}