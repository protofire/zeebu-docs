<!-- .vuepress/components/Login.vue -->
<script setup>
import { createProviderComponent } from '../../../providers/createProviderComponent';
import { provideNetwork } from '../../../providers/network';
import { provideVeSystem } from '../../../providers/veSystem';
import { provideBalancerPools } from '../../../providers/balancerPools';
import Wallet from '../../Navbar/Wallet.vue';
import WhitelistCheck from './WhitelistCheck.vue';

const NetworkProvider = createProviderComponent(() => provideNetwork());
const VeSystemProvider = createProviderComponent(() => provideVeSystem());
const BalancerPoolsProvider = createProviderComponent(() => provideBalancerPools());

</script>

<template>
  <NetworkProvider>
    <BalancerPoolsProvider>
      <VeSystemProvider>
        <div class="network-select">
          <Wallet />
        </div>
        <WhitelistCheck />
      </VeSystemProvider>
    </BalancerPoolsProvider>
  </NetworkProvider>
</template>

<style scoped>
.network-select {
  width: 100%;
  display: flex;
  align-items: center;
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
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  width: 100%;
}
</style>
