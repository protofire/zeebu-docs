<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useVeSystem } from '../../../providers/veSystem';
import { CONFIG } from '../../../constants/config';
import { VeSystem, debounce, secondsToDate } from '../../../utils';
import UnlockAllModal from './UnlockAllModal.vue';
import EarlyUnlockModal from './EarlyUnlockModal.vue';
import EarlyPenaltyModal from './EarlyPenaltyModal.vue';
import { useWeb3ModalProvider } from '@web3modal/ethers/vue';
import { useNetwork } from '../../../providers/network';
import { useController } from '../../../utils/VotingEscrowController';
import { ethers } from 'ethers';
import Tooltip from './Tooltip.vue';
import {
  earlyPenaltyHint,
  earlyUnlockHint,
  unlockAllHint,
} from '../../../constants/hints';
import ItemSelector, { ItemType } from '../ItemSelector.vue';

const { walletProvider } = useWeb3ModalProvider();
const { network } = useNetwork();
const {
  selected: veSystem,
  data: veSystems,
  select,
  fetchByAddressOrName,
  isLoading,
} = useVeSystem();
const {
  allUnlock,
  setAllUnlock,
  earlyUnlock,
  setEarlyUnlock,
  getEarlyUnlockPenalty,
  setEarlyUnlockPenalty,
} = useController({
  walletProvider,
  network,
  veSystem,
});

const allUnlockStatus = ref<boolean>(false);
const earlyUnlockStatus = ref<boolean>(false);
const earlyPenalty = ref<number>(0);

const isLoadingAllUnlock = ref<boolean>(false);
const isEarlyPenaltyModalOpen = ref<boolean>(false);
const isUnlockAllModalOpen = ref<boolean>(false);
const isEarlyUnlockModalOpen = ref<boolean>(false);
const isLoadingEarlyUnlock = ref<boolean>(false);
const isLoadingEarlyPenalty = ref<boolean>(false);

watch(veSystem, async () => {
  await fetchEarlyPenalty();
  await fetchUnlockStatus();
  await fetchEarlyUnlockStatus();
});

const fetchEarlyPenalty = async () => {
  const result = await getEarlyUnlockPenalty.value?.();
  earlyPenalty.value = result ? ethers.toNumber(result) : 0;
};

const fetchUnlockStatus = async () => {
  const allUnlockResult = await allUnlock.value?.();

  allUnlockStatus.value = allUnlockResult ?? false;
};

const fetchEarlyUnlockStatus = async () => {
  const result = await earlyUnlock.value?.();

  earlyUnlockStatus.value = result ?? false;
};

const handleUnlockModalClose = () => {
  isUnlockAllModalOpen.value = false;
};

const handleUnlockModalOpen = () => {
  isUnlockAllModalOpen.value = true;
};

const handleEarlyUnlockModalClose = () => {
  isEarlyUnlockModalOpen.value = false;
};

const handleEarlyUnlockModalOpen = () => {
  isEarlyUnlockModalOpen.value = true;
};

const handleEarlyPenaltyModalClose = () => {
  isEarlyPenaltyModalOpen.value = false;
};

const handleEarlyPenaltyModalOpen = () => {
  isEarlyPenaltyModalOpen.value = true;
};

const handleEarlyUnlock = async () => {
  await setEarlyUnlock.value?.(!earlyUnlockStatus.value, {
    onPrompt: () => {
      console.log('onPrompt');
      isEarlyUnlockModalOpen.value = false;
    },
    onSubmitted: ({ tx }) => {
      console.log('onSubmitted', tx);
      isLoadingEarlyUnlock.value = true;
    },
    onSuccess: async ({ receipt }) => {
      console.log('onSuccess', receipt);
      isLoadingEarlyUnlock.value = false;
      fetchEarlyUnlockStatus();
    },
    onError: err => {
      console.log('err', err);
      isLoadingEarlyUnlock.value = false;
    },
  });
};

const handleUnlock = async () => {
  await setAllUnlock.value?.({
    onPrompt: () => {
      console.log('onPrompt');
    },
    onSubmitted: ({ tx }) => {
      console.log('onSubmitted', tx);
      isUnlockAllModalOpen.value = false;
      isLoadingAllUnlock.value = true;
    },
    onSuccess: async ({ receipt }) => {
      console.log('onSuccess', receipt);
      isLoadingAllUnlock.value = false;
      fetchUnlockStatus();
    },
    onError: err => {
      console.log('err', err);
      isLoadingAllUnlock.value = false;
    },
  });
};

const handleSetEarlyPenalty = async (penalty: number) => {
  console.log('set penalty', penalty);

  await setEarlyUnlockPenalty.value?.(ethers.toBigInt(penalty), {
    onPrompt: () => {
      console.log('onPrompt');
    },
    onSubmitted: ({ tx }) => {
      console.log('onSubmitted', tx);
      isEarlyPenaltyModalOpen.value = false;
      isLoadingEarlyPenalty.value = true;
    },
    onSuccess: async ({ receipt }) => {
      console.log('onSuccess', receipt);
      isLoadingEarlyPenalty.value = false;
      fetchEarlyPenalty();
    },
    onError: err => {
      console.log('err', err);
      isLoadingEarlyPenalty.value = false;
    },
  });
};

const formFields = computed(() => {
  const startTime = '';
  const supplyVested = veSystem.value
    ? parseFloat(veSystem.value.votingEscrow.supplyVestedPercent) * 100
    : 0;

  return [
    {
      label: 'Locked Token Address',
      placeholder: '0xa0b...6eb48',
      name: 'bptAddress',
      value: veSystem.value?.bptToken,
    },
    {
      label: 'veSystem Name',
      placeholder: 'Voting Escrow Balancer 80 GNO',
      name: 'veTokenName',
      value: veSystem.value?.votingEscrow.name,
    },
    {
      label: 'veSystem Symbol',
      placeholder: 'veGNO80-WETH20',
      name: 'veTokenSymbol',
      value: veSystem.value?.votingEscrow.symbol,
    },
    {
      label: 'Launchpad Address',
      placeholder: '0x67c3...9a65c',
      name: 'factoryUsed',
      value: CONFIG.get(network.value.id)?.LAUNCHPAD_CONTRACT,
    },
    {
      label: 'Rewards Distribution Address',
      placeholder: '0x67c3...9a65c',
      name: 'rewardsAddress',
      value: veSystem.value?.rewardDistributorAddress,
    },
    {
      label: 'Distribution Start-time',
      type: 'date',
      name: 'distribution',
      value: startTime,
    },
    {
      label: 'Supply % vested',
      placeholder: '37%',
      name: 'supplyVested',
      value: supplyVested.toString().concat('%'),
    },
    {
      label: 'Rewards Distribution Admin',
      placeholder: '0xb76f3...987b5',
      name: 'rewardsDistribution',
      value: veSystem.value?.admin,
    },
  ];
});

const selectedItem = ref<ItemType>();
const filteredVeSystems = ref<VeSystem[]>([]);

watch(veSystems, value => {
  filteredVeSystems.value = value;
});

const items = computed(() => {
  return filteredVeSystems.value.map(x => ({
    id: x.id,
    name: x.votingEscrow.name,
  }));
});

const handleVeSystemChange = async (value: ItemType) => {
  selectedItem.value = value;
  await select(value.id);
  filteredVeSystems.value = [];
};

const handleVeSystemSearch = debounce(async (value: string) => {
  if (value === '') return;

  await fetchByAddressOrName(value);
}, 500);

watch(items, value => console.log('items', value));
</script>

<template>
  <main class="section-container">
    <section class="section-body">
      <div class="item-row">
        <p class="item-name">Select veSystem</p>
        <div class="input-group item-selector">
          <ItemSelector
            :items="items"
            :onChange="handleVeSystemChange"
            :onSearch="handleVeSystemSearch"
            :value="selectedItem"
            :loading="isLoading"
            placeholder="Select veSystem"
          />
        </div>
      </div>
      <div v-if="veSystem" class="section-body">
        <div v-for="field in formFields" :key="field.label" class="item-row">
          <p class="item-name">{{ field.label }}</p>
          <div class="input-group">
            <input
              :value="field.value"
              :placeholder="field.placeholder"
              type="text"
              class="input"
              disabled="true"
            />
          </div>
        </div>
        <article class="group-btn">
          <div class="section-btn">
            <UnlockAllModal
              :open="isUnlockAllModalOpen"
              :onClose="handleUnlockModalClose"
              :onUnlock="handleUnlock"
            />
            <p class="status">
              Status: {{ allUnlockStatus }}
              <Tooltip
                :text="unlockAllHint"
                :width="400"
                position="left-bottom"
                :fontSize="12"
              >
                <svg width="16" height="16" class="icon">
                  <use href="/images/exclamation-circle.svg#icon"></use>
                </svg>
              </Tooltip>
            </p>
            <button
              class="btn"
              :disabled="allUnlockStatus || isLoadingAllUnlock"
              @click="handleUnlockModalOpen"
            >
              {{ isLoadingAllUnlock ? 'Unlocking...' : 'Unlock All' }}
            </button>
          </div>
          <div class="section-btn">
            <EarlyUnlockModal
              :open="isEarlyUnlockModalOpen"
              :onClose="handleEarlyUnlockModalClose"
              :onUnlock="handleEarlyUnlock"
              :earlyUnlock="earlyUnlockStatus"
            />
            <p class="status">
              Status: {{ earlyUnlockStatus }}
              <Tooltip
                :text="earlyUnlockHint"
                :width="400"
                position="bottom"
                :fontSize="12"
              >
                <svg width="16" height="16" class="icon">
                  <use href="/images/exclamation-circle.svg#icon"></use>
                </svg>
              </Tooltip>
            </p>
            <button
              class="btn"
              :disabled="isLoadingEarlyUnlock"
              @click="handleEarlyUnlockModalOpen"
            >
              {{ isLoadingEarlyUnlock ? 'Processing...' : 'Early Unlock' }}
            </button>
          </div>
          <div class="section-btn">
            <EarlyPenaltyModal
              :open="isEarlyPenaltyModalOpen"
              :onClose="handleEarlyPenaltyModalClose"
              :onSubmit="handleSetEarlyPenalty"
              :earlyPenalty="earlyPenalty"
            />
            <div class="status">
              Early Penalty: {{ earlyPenalty
              }}<Tooltip
                :text="earlyPenaltyHint"
                :width="800"
                position="right-bottom"
                :fontSize="12"
              >
                <svg width="16" height="16" class="icon">
                  <use href="/images/exclamation-circle.svg#icon"></use>
                </svg>
              </Tooltip>
            </div>
            <button
              class="btn"
              :disabled="isLoadingEarlyPenalty"
              @click="handleEarlyPenaltyModalOpen"
            >
              {{
                isLoadingEarlyPenalty
                  ? 'Processing...'
                  : 'Set Early Penalty Speed'
              }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.section-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.item-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.section-body {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-row .item-name {
  width: 50%;
  max-width: 350px;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.item-row .input-group {
  display: flex;
  align-items: center;
  height: 45px;
  width: 50%;
}

.item-row .input-group .input {
  background-color: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  height: 100%;
  width: 100%;
  /* max-width: 340px; */
  padding-inline: 20px;
  font-size: 14px;
  outline: none;
}

.dark .item-row .input-group .input {
  border: 1px solid #3e4c5a;
}

.item-row .input-group .input:focus {
  border: 1px solid #384aff;
}

.group-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-btn .section-btn {
  display: flex;
  flex-direction: column;
}

.group-btn .section-btn .status {
  margin: 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.group-btn .section-btn .status .icon {
  fill: #2c3e50;
}

.dark .group-btn .section-btn .status .icon {
  fill: #ffffff;
}
.btn {
  width: 180px;
  height: 40px;
  background-color: #384aff;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
}

.btn:disabled {
  cursor: not-allowed;
  background-color: rgba(56, 74, 255, 0.2);
  color: grey;
}
</style>
