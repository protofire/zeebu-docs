<!-- .vuepress/components/Login.vue -->
<script setup>
import { ref, watch } from 'vue';
import { useWeb3ModalProvider, useWeb3ModalAccount, useDisconnect } from '@web3modal/ethers/vue';
import { useNetwork } from '../../../providers/network';
import { useWhitelistController } from '../../../utils/WhitelistController';

const { walletProvider } = useWeb3ModalProvider();
const { address, isConnected } = useWeb3ModalAccount();
const { network } = useNetwork();

const { checkWhitelist } = useWhitelistController({
  walletProvider,
  network,
});

const isAdmin = ref(false);
isAdmin.value = (typeof window !== 'undefined' && window.localStorage.getItem('isAdmin') === 'true');

// Debounce function to limit the rate of API calls
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Update user state based on whitelist status
const updateUserState = (account, isWhitelisted) => {
  if (isWhitelisted) {
    console.log('User is whitelisted as an admin');
    isAdmin.value = true;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('isAdmin', 'true');
      window.localStorage.setItem('userAddress', account);
    }
  } else {
    alert("You are not whitelisted as an admin.");
  }
};

// Handle whitelist checking
const handleCheckWhitelist = async (account) => {
  if (checkWhitelist.value) {
    const isWhitelisted = await checkWhitelist.value(account);
    updateUserState(account, isWhitelisted);
  }
};

// Watch for wallet connection changes
watch(isConnected, debounce(async (newValue) => {
  if (newValue) {
    await handleCheckWhitelist(address.value);
  } else {
    isAdmin.value = false;
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('isAdmin');
      window.localStorage.removeItem('userAddress');
    }
  }
}, 300));

</script>

<template>
  <div class="body-container">
    <div v-if="!isAdmin">
      <h1>Connect Wallet in order to proceed</h1>
    </div>
    <div v-else>
      <h1>Welcome!</h1>
    </div>
  </div>
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
