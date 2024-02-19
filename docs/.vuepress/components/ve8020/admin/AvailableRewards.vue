<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useVeSystem } from '../../../providers/veSystem';
import { ethers } from 'ethers';
import ItemSelector, { ItemType } from '../ItemSelector.vue';
import { VeSystem } from '../../../utils/LaunchpadSubgraph';
import { debounce } from '../../../utils';

const {
  selected: veSystem,
  data: veSystems,
  select,
  fetchByAddressOrName,
  isLoading,
} = useVeSystem();

const availableRewards = computed(() => {
  if (!veSystem.value) return [];

  return veSystem.value.rewardDistributor.rewardTokens.map(rt => ({
    token: rt.name,
    amount: ethers.formatUnits(rt.availableRewardAmount || '0', rt.decimals),
  }));
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
  <div class="section-container">
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
      <div
        v-for="reward in availableRewards"
        :key="reward.token"
        class="item-row"
      >
        <p class="item-name">{{ reward.token }}</p>
        <div class="input-group">
          <input
            :value="reward.amount"
            type="text"
            class="input"
            disabled="true"
          />
        </div>
      </div>
    </section>
  </div>
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
