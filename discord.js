import { getModule } from '@vizality/webpack';

const Props = {
   SelectedGuildStore: ['getGuildId'],
   SelectedChannelStore: ['getChannelId', 'getVoiceChannelId'],
   UserStore: ['getUser', 'getCurrentUser'],
   ChannelStore: ['getChannel', 'getDMUserIds'],
   FriendsStore: ['isBlocked'],
   GuildSettingsStore: ['isSuppressEveryoneEnabled'],
   MutedStore: ['isMuted'],
   Dispatcher: ['dispatch', 'subscribe'],
   UserSettingsStore: ['status', 'customStatus'],
   GuildStore: ['getGuild'],
   SoundResolver: m => m && typeof m.keys === 'function' && typeof m.resolve == 'function' && m.keys().find(e => e.endsWith('.mp3'))
};

const Modules = {};
for (const key in Props) Modules[key] = getModule(...(Array.isArray(Props[key]) ? Props[key] : [Props[key]]));

export const DiscordApi = {
   get currentGuildId() {return Modules.SelectedGuildStore.getGuildId();},
   get currentGuild() {return Modules.GuildStore.getGuild(this.currentGuildId);},
   get currentUser() {return Modules.UserStore.getCurrentUser();},
   get currentChannelId() {return Modules.SelectedChannelStore.getChannelId();},
   get currentChannel() {return Modules.ChannelStore.getChannel(this.currentChannelId);},
   get currentStatus() {return Modules.UserSettingsStore.status;}
};

export const Utilities = {
   isRawMention(content) {return content.indexOf(`<@!${DiscordApi.currentUser.id}>`) > -1;},
   getNestedProp(object, path = '') {
      return path.split('.').reduce((object, value) => object && obj[value], object);
   } 
};

export const Patcher = {
   instead(module, functionName, callback) {
      const originalFunction = module[functionName];
      const unpatch = () => module[functionName] = originalFunction;

      module[functionName] = function () {
         return callback(this, arguments, originalFunction.bind(this));
      }

      Object.assign(module[functionName], originalFunction);
      module[functionName].toString = () => originalFunction.toString();
   
      return unpatch;
   }
};

export const DiscordModules = Modules;
export const ModuleProps = Props;