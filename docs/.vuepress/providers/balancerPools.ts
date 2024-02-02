import { InjectionKey, provide, ref, watch, computed } from 'vue';
import { safeInject } from './inject';
import { useNetwork } from './network';
import { BalancerSubgraph, PoolType } from '../utils/BalancerSubgraph';
import { CONFIG } from '../constants/config';

export const balancerPoolsProvider = () => {
  const { network } = useNetwork();

  const subgraphUrl = ref('');

  watch(network, value => {
    console.log(value);
    pools.value = [];
    subgraphUrl.value = CONFIG.get(value.id)?.BALANCER_SUBGRAPH_URL || '';
  });

  const graph = computed(() => new BalancerSubgraph(subgraphUrl.value));

  const pools = ref<PoolType[]>([]);
  const isLoading = ref(false);

  async function fetchPools() {
    isLoading.value = true;

    const _pools = await graph.value.getPools();

    pools.value = _pools;

    isLoading.value = false;
  }

  async function fetchPoolsByAddressOrSymbol(addressOrSymbol: string) {
    isLoading.value = true;

    const _pools = await graph.value.getPoolsByAddressOrSymbol(addressOrSymbol);

    pools.value = _pools;

    isLoading.value = false;
  }

  return {
    pools,
    isLoading,
    fetchPoolsByAddressOrSymbol,
    fetchPools,
  };
};

export type BalancerPoolsResponse = ReturnType<typeof balancerPoolsProvider>;

export const BalancerPoolsProviderSymbol: InjectionKey<BalancerPoolsResponse> =
  Symbol('providers.balancerPools');

export function provideBalancerPools(): BalancerPoolsResponse {
  const pools = balancerPoolsProvider();
  provide(BalancerPoolsProviderSymbol, pools);
  return pools;
}

export function usePools(): BalancerPoolsResponse {
  return safeInject(BalancerPoolsProviderSymbol);
}
