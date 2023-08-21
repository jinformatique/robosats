import { type Robot, type LimitList, type PublicOrder } from '.';

export interface Contact {
  nostr?: string | undefined;
  pgp?: string | undefined;
  fingerprint?: string | undefined;
  email?: string | undefined;
  telegram?: string | undefined;
  reddit?: string | undefined;
  matrix?: string | undefined;
  twitter?: string | undefined;
  website?: string | undefined;
}

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export interface Badges {
  isFounder?: boolean | undefined;
  donatesToDevFund: number;
  hasGoodOpSec?: boolean | undefined;
  robotsLove?: boolean | undefined;
  hasLargeLimits?: boolean | undefined;
}

export interface Info {
  num_public_buy_orders: number;
  num_public_sell_orders: number;
  book_liquidity: number;
  active_robots_today: number;
  last_day_nonkyc_btc_premium: number;
  last_day_volume: number;
  lifetime_volume: number;
  lnd_version?: string;
  cln_version?: string;
  robosats_running_commit_hash: string;
  alternative_site: string;
  alternative_name: string;
  node_alias: string;
  node_id: string;
  version: Version;
  maker_fee: number;
  taker_fee: number;
  bond_size: number;
  current_swap_fee_rate: number;
  network: 'mainnet' | 'testnet' | undefined;
  openUpdateClient: boolean;
  loading: boolean;
}

export type Origin = 'onion' | 'i2p' | 'clearnet';

export interface Origins {
  clearnet: Origin | undefined;
  onion: Origin | undefined;
  i2p: Origin | undefined;
}

export class Coordinator {
  constructor(value: Coordinator) {
    this.longAlias = value.longAlias;
    this.shortAlias = value.shortAlias;
    this.description = value.description;
    this.motto = value.motto;
    this.color = value.color;
    this.policies = value.policies;
    this.contact = value.contact;
    this.badges = value.badges;
    this.mainnet = value.mainnet;
    this.testnet = value.testnet;
    this.mainnetNodesPubkeys = value.mainnetNodesPubkeys;
    this.testnetNodesPubkeys = value.testnetNodesPubkeys;
  }

  // These properties are loaded from federation.json
  public longAlias: string;
  public shortAlias: string;
  public enabled?: boolean = true;
  public description: string;
  public motto: string;
  public color: string;
  public policies: Record<string, string> = {};
  public contact: Contact | undefined;
  public badges: Badges;
  public mainnet: Origins;
  public testnet: Origins;
  public mainnetNodesPubkeys: string[] | undefined;
  public testnetNodesPubkeys: string[] | undefined;

  // These properties are fetched from coordinator API
  public book: PublicOrder[] = [];
  public loadingBook: boolean = true;
  public info?: Info | undefined = undefined;
  public loadingInfo: boolean = true;
  public limits?: LimitList | never[] = [];
  public loadingLimits: boolean = true;
  public robot?: Robot | undefined = undefined;
  public loadingRobot: boolean = true;
}

export interface getEndpointProps {
  coordinator: Coordinator;
  network: 'mainnet' | 'testnet';
  origin: Origin;
  selfHosted: boolean;
  hostUrl: string;
}
export const getEndpoint = ({
  coordinator,
  network,
  origin,
  selfHosted,
  hostUrl,
}: getEndpointProps): { url: string; basePath: string } => {
  if (selfHosted && coordinator.shortAlias !== 'local') {
    return { url: hostUrl, basePath: `/${network}/${coordinator.shortAlias}` };
  } else {
    return { url: String(coordinator[network][origin]), basePath: '' };
  }
};

export type Federation = Record<string, Coordinator>;

export default Coordinator;
