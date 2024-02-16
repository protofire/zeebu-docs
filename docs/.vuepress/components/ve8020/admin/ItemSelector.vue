<script setup lang="ts">
import { ref, watch, defineProps } from 'vue';
import { Select, SelectTrigger, SelectOptions } from '../../Select';

export type ItemType = {
  id: string;
  name: string;
};

type SelectorProps = {
  items: ItemType[];
  value?: ItemType;
  onChange: (value: ItemType) => void;
  onSearch: (value: string) => void;
  loading?: boolean;
  placeholder: string;
};

const props = defineProps<SelectorProps>();

const filteredItems = ref<ItemType[]>([]);
const selected = ref<ItemType>();

watch(
  () => props.items,
  value => {
    filteredItems.value = value;
  }
);

watch(
  () => props.value,
  value => {
    selected.value = value;
  }
);
</script>
<template>
  <Select :onChange="onChange" :value="selected">
    <SelectTrigger :value="selected?.id" :placeholder="placeholder">
      <Avatar :address="selected?.id" :size="20" />
      <span>{{ selected?.name }}</span>
    </SelectTrigger>
    <SelectOptions
      v-slot="token"
      :options="filteredItems"
      optionKey="id"
      :searchFn="onSearch"
      :loading="loading"
    >
      <Avatar :address="token.id" :size="20" />
      <span>{{ token.name }}</span>
    </SelectOptions>
  </Select>
</template>

<style>
.item-selector ul.menu {
  width: 100%;
}
.item-selector .select {
  width: 100%;
}
</style>