import { InjectionKey, provide, ref, watch, computed } from 'vue';
import { safeInject } from './inject';
import { LaunchpadSubgraph, VeSystem } from '../utils/LaunchpadSubgraph';
import { CONFIG } from '../constants/config';
import { useNetwork } from '../providers/network';

export const veSystemProvider = () => {
  const { network } = useNetwork();

  const subgraphUrl = ref('');

  watch(network, value => {
    subgraphUrl.value = CONFIG.get(value.id)?.SUBGRAPH_URL;
  });

  const graph = computed(() => new LaunchpadSubgraph(subgraphUrl.value));

  const data = ref<VeSystem[]>([]);
  const isLoading = ref<boolean>(false);
  const selected = ref<VeSystem | undefined>();

  watch(selected, value => console.log('Selected VeSystem: ', value));

  const fetchByAdmin = async (admin: string, bptToken?: string) => {
    isLoading.value = true;

    data.value = await graph.value.getAdminVeSystems(admin, bptToken);

    isLoading.value = false;
  };

  const fetch = async (bptToken?: string) => {
    isLoading.value = true;

    data.value = await graph.value.getVeSystems(bptToken);

    isLoading.value = false;
  };

  const select = async (id: string) => {
    isLoading.value = true;

    try {
      const veSystem = await graph.value.getVeSystem(id);
      selected.value = veSystem;
    }
    catch (error) {
      console.error(error.message);
    }

    isLoading.value = false;
  };

  async function fetchByAddressOrName(addressOrName: string) {
    isLoading.value = true;

    const _pools = await graph.value.getVeSystemsByAddressOrName(addressOrName);

    data.value = _pools;

    isLoading.value = false;
  }

  return {
    data,
    selected,
    isLoading,
    fetch,
    select,
    fetchByAdmin,
    fetchByAddressOrName,
  };
};

export type VeSystemProviderType = ReturnType<typeof veSystemProvider>;

export const VeSystemProviderSymbol: InjectionKey<VeSystemProviderType> =
  Symbol('providers.vesystem');

export function provideVeSystem(): VeSystemProviderType {
  const data = veSystemProvider();
  provide(VeSystemProviderSymbol, data);
  return data;
}

export function useVeSystem(): VeSystemProviderType {
  return safeInject(VeSystemProviderSymbol);
}
