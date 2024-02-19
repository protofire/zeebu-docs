<script setup>
import { createProviderComponent } from '../../../providers/createProviderComponent';
import { provideNetwork } from '../../../providers/network';
import { provideVeSystem } from '../../../providers/veSystem';
import { provideTabs, Tab } from '../../../providers/tabs';
import { provideBalancerPools } from '../../../providers/balancerPools';
import TabsComponent from './ActivateRewards/TabsComponent.vue';

const NetworkProvider = createProviderComponent(() => provideNetwork());
const VeSystemProvider = createProviderComponent(() => provideVeSystem());
const BalancerPoolsProvider = createProviderComponent(() => {
  provideBalancerPools();
});
const TabsProvider = createProviderComponent(() => {
  provideTabs(Tab.FORM_1);
});
</script>

<template>
  <NetworkProvider>
    <BalancerPoolsProvider>
      <VeSystemProvider>
        <TabsProvider>
          <TabsComponent />
        </TabsProvider>
      </VeSystemProvider>
    </BalancerPoolsProvider>
  </NetworkProvider>
</template>

<style scoped>
.network-select {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.main-container {
  width: 100%;
  margin-top: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.dark .main-container {
  border: 1px solid #3e4c5a;
}

.body-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
</style>
