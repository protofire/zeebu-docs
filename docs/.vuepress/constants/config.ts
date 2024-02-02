import { Network } from '@balancer-labs/sdk';

type Config = {
  SUBGRAPH_URL: string;
  LAUNCHPAD_CONTRACT: string;
  LENS_REWARD_CONTRACT: string;
  BALANCER_SUBGRAPH_URL: string;
};

export const CONFIG = new Map<number, Config>([
  [
    Network.ARBITRUM,
    {
      SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/maxkmyt/launchpad_arb',
      LAUNCHPAD_CONTRACT: '0x665a23707e9cfce7bf07c52d375f5274cedd6eb4',
      LENS_REWARD_CONTRACT: '0xb422e74045f19d94ec62236efdcae4b13bac386b',
      BALANCER_SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2',
    },
  ],
  [
    1101, // polygon zkEVM
    {
      SUBGRAPH_URL:
        'https://subgraph.satsuma-prod.com/23d030b3f9c5/maksims-team--1931238/launchpad_polygon_zk/api',
      LAUNCHPAD_CONTRACT: '0x665a23707e9cfce7bf07c52d375f5274cedd6eb4',
      LENS_REWARD_CONTRACT: '0xb422e74045f19d94ec62236efdcae4b13bac386b',
      BALANCER_SUBGRAPH_URL:
        'https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest',
    },
  ],
  [
    Network.POLYGON,
    {
      SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/maxkmyt/launchpad_polygon',
      LAUNCHPAD_CONTRACT: '0x41b5b45f849a39cf7ac4aceae6c78a72e3852133',
      LENS_REWARD_CONTRACT: '0xe922ae35d0cd042db5bade95e50a5cb0f14fa1d9',
      BALANCER_SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-prune-v2',
    },
  ],
  [
    Network.OPTIMISM,
    {
      SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/maxkmyt/launchpad_optimism',
      LAUNCHPAD_CONTRACT: '0xc0974a19ccb5b6e07a8fa7cd8616aa76c4cd76e7',
      LENS_REWARD_CONTRACT: '0xe922ae35d0cd042db5bade95e50a5cb0f14fa1d9',
      BALANCER_SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/beethovenxfi/beethovenx-optimism',
    },
  ],
  [
    Network.MAINNET,
    {
      SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/maxkmyt/launchpad_main',
      LAUNCHPAD_CONTRACT: '0x41b5b45f849a39CF7ac4aceAe6C78A72e3852133',
      LENS_REWARD_CONTRACT: '0xe922aE35d0cd042dB5bADe95e50A5cB0F14fa1d9',
      BALANCER_SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
    },
  ],
  [
    43114, // avalanche
    {
      SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/maxkmyt/launchpad_avax',
      LAUNCHPAD_CONTRACT: '0x41b5b45f849a39cf7ac4aceae6c78a72e3852133',
      LENS_REWARD_CONTRACT: '0xe922ae35d0cd042db5bade95e50a5cb0f14fa1d9',
      BALANCER_SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-avalanche-v2',
    },
  ],
  [
    8453, // base
    {
      SUBGRAPH_URL:
        'https://subgraph.satsuma-prod.com/23d030b3f9c5/maksims-team--1931238/launchpad_base/api',
      LAUNCHPAD_CONTRACT: '0x41b5b45f849a39cf7ac4aceae6c78a72e3852133',
      LENS_REWARD_CONTRACT: '0xe922ae35d0cd042db5bade95e50a5cb0f14fa1d9',
      BALANCER_SUBGRAPH_URL:
        'https://api.studio.thegraph.com/query/24660/balancer-base-v2/version/latest',
    },
  ],
  [
    100, // gnosis
    {
      SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/maxkmyt/launchpad_gnosis',
      LAUNCHPAD_CONTRACT: '0x41b5b45f849a39cf7ac4aceae6c78a72e3852133',
      LENS_REWARD_CONTRACT: '0xe922ae35d0cd042db5bade95e50a5cb0f14fa1d9',
      BALANCER_SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gnosis-chain-v2',
    },
  ],
  [
    11155111, // sepolia
    {
      SUBGRAPH_URL:
        'https://api.thegraph.com/subgraphs/name/maxkmyt/launchpad_sepolia',
      LAUNCHPAD_CONTRACT: '0x7af720678f7aa15542acdcf6d613c7a94e0cf703',
      LENS_REWARD_CONTRACT: '0xa5ef725d0becf0262450bb255f4341d5da40e489',
      BALANCER_SUBGRAPH_URL:
        'https://api.studio.thegraph.com/query/24660/balancer-sepolia-v2/version/latest',
    },
  ],
]);
