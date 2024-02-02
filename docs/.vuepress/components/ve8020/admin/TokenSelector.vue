<script setup lang="ts">
import { ref, watch, defineProps } from 'vue';
import { Select, SelectTrigger, SelectOptions } from '../../Select';

export type TokenType = {
  symbol: string;
  address: string;
};

type SelectorProps = {
  tokens: TokenType[];
  value?: TokenType;
  onChange: (value: TokenType) => void;
  onSearch: (value: string) => void;
  loading?: boolean;
};

const props = defineProps<SelectorProps>();

const filteredTokens = ref<TokenType[]>([]);
const selected = ref<TokenType>();

watch(
  () => props.tokens,
  value => {
    filteredTokens.value = value;
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
    <SelectTrigger :value="selected?.address" placeholder="Select Token">
      <Avatar :address="selected?.address" :size="20" />
      <span>{{ selected?.symbol }}</span>
    </SelectTrigger>
    <SelectOptions
      v-slot="token"
      :options="filteredTokens"
      optionKey="address"
      :searchFn="onSearch"
      :loading="loading"
    >
      <Avatar :address="token.address" :size="20" />
      <span>{{ token.symbol }}</span>
    </SelectOptions>
  </Select>
</template>

<style>
.token-select ul.menu {
  width: 340px;
}
</style>