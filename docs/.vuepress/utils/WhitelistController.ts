import { ethers, BrowserProvider } from 'ethers';
import { Ref, ref, watch } from 'vue';
import WhitelistABI from './abis/WhitelistABI.json';
import { NetworkConfig } from '../constants/networks';
import { CallbackOptionsType, submitAction } from './LaunchpadController';
import { CONFIG } from '../constants/config';

type AddAddressParamsType = {
  address: string;
};

type RemoveAddressParamsType = {
  address: string;
};

type CheckWhitelistFunctionType = (address: string) => Promise<boolean>;

type AddAddressFunctionType = (
  data: AddAddressParamsType,
  callbacks: CallbackOptionsType
) => Promise<void>;

type RemoveAddressFunctionType = (
  data: RemoveAddressParamsType,
  callbacks: CallbackOptionsType
) => Promise<void>;

type UseWhitelistControllerReturnType = {
  checkWhitelist: Ref<CheckWhitelistFunctionType | undefined>;
  addAddress: Ref<AddAddressFunctionType | undefined>;
  removeAddress: Ref<RemoveAddressFunctionType | undefined>;
};

export const useWhitelistController = ({
  walletProvider,
  network,
}: {
  walletProvider: Ref<
    | {
        request: (request: {
          method: string;
          params?: any[] | Record<string, any> | undefined;
        }) => Promise<any>;
      }
    | undefined
  >;
  network: Ref<NetworkConfig>;
}): UseWhitelistControllerReturnType => {
  const checkWhitelist = ref<CheckWhitelistFunctionType>();
  const addAddress = ref<AddAddressFunctionType>();
  const removeAddress = ref<RemoveAddressFunctionType>();

  const initialize = () => {
    checkWhitelist.value = async (address: string): Promise<boolean> => {
      if (!walletProvider.value) throw new Error('Wallet provider not found');

      const provider = new BrowserProvider(
        walletProvider.value,
        network.value.id
      );

      const WHITELIST_CONTRACT = CONFIG.get(
        network.value.id
      )?.WHITELIST_CONTRACT;

      if (!WHITELIST_CONTRACT) {
        console.error('missing Whitelist contract address');
        return false;
      }

      const contract = new ethers.Contract(
        WHITELIST_CONTRACT,
        WhitelistABI,
        provider
      );
      return await contract.isWhitelisted(address);
    };

    addAddress.value = async (
      data: AddAddressParamsType,
      callbacks: CallbackOptionsType
    ): Promise<void> => {
      if (!walletProvider.value) throw new Error('Wallet provider not found');

      const provider = new BrowserProvider(
        walletProvider.value,
        network.value.id
      );

      const WHITELIST_CONTRACT = CONFIG.get(
        network.value.id
      )?.WHITELIST_CONTRACT;

      if (!WHITELIST_CONTRACT) {
        console.error('missing Whitelist contract address');
        return;
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        WHITELIST_CONTRACT,
        WhitelistABI,
        signer
      );

      await submitAction(
        async () => await contract.addAddressToWhitelist(data.address),
        callbacks
      );
    };

    removeAddress.value = async (
      data: RemoveAddressParamsType,
      callbacks: CallbackOptionsType
    ): Promise<void> => {
      if (!walletProvider.value) throw new Error('Wallet provider not found');

      const provider = new BrowserProvider(
        walletProvider.value,
        network.value.id
      );

      const WHITELIST_CONTRACT = CONFIG.get(
        network.value.id
      )?.WHITELIST_CONTRACT;

      if (!WHITELIST_CONTRACT) {
        console.error('missing Whitelist contract address');
        return;
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        WHITELIST_CONTRACT,
        WhitelistABI,
        signer
      );

      await submitAction(
        async () => await contract.removeAddressFromWhitelist(data.address),
        callbacks
      );
    };
  };

  watch([network], initialize);

  return {
    checkWhitelist,
    addAddress,
    removeAddress,
  };
};
