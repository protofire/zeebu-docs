<script setup lang="ts">
import SetAvailableRewardsForm from './SetAvailableRewardsForm.vue';
import AddRewardsCurrentWeek from './AddRewardsCurrentWeek.vue';
import AddRewardsNWeeks from './AddRewardsNWeeks.vue';
import AddRewardsExactWeek from './AddRewardsExactWeek.vue';
import { useVeSystem } from '../../../providers/veSystem';
import ItemSelector, { ItemType } from '../ItemSelector.vue';
import { computed, ref, watch } from 'vue';
import { VeSystem, debounce } from '../../../utils';

const {
  data: veSystems,
  fetchByAddressOrName,
  isLoading,
  select,
} = useVeSystem();

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
    <div class="item-row">
      <p class="item-name">Select veSystem</p>
      <div class="item-selector">
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
    <SetAvailableRewardsForm />
    <AddRewardsCurrentWeek />
    <AddRewardsNWeeks />
    <AddRewardsExactWeek />
  </div>
</template>

<style scoped>
.section-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  align-items: center;
  margin-top: 16px;
}

.item-row {
  display: flex;
  width: 100%;
  max-width: 700px;
  /* height: auto; */
  gap: 10px;
}

.item-row .item-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 450px;
}

.item-row .item-name {
  width: 35%;
  max-width: 350px;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  height: 45px;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
