const REFERRAL_SCENE = 'referral_scene';
const BASE_SCENE = 'base_scene';
const PLAY_SCENE = 'play_scene';
const INFO_LINKS_SCENE = 'info_links_scene';
const CONNECT_WALLET_SCENE = 'connect_wallet_scene';
const FAQ_SCENE = 'faq_scene';
const CREATE_GUILD_SCENE = 'create_guild_scene';

export interface Invite {
  data?: { id: string; by?: number };
  error?: string;
}

export {
  REFERRAL_SCENE,
  BASE_SCENE,
  PLAY_SCENE,
  INFO_LINKS_SCENE,
  FAQ_SCENE,
  CONNECT_WALLET_SCENE,
  CREATE_GUILD_SCENE,
};
