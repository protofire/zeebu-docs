<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { VeSystem } from '../../../utils';
import { functions, httpsCallable } from '../../../utils/firebase';


const filteredVeSystems = ref<VeSystem[]>([]);
const title = ref<string>('');
const body = ref<string>('');
const isLoading = ref<boolean>(false);
const topics = ["alerts", "promotions", "rewards"];
const selectedTopic = ref<string>('');

const items = computed(() => {
  return filteredVeSystems.value.map(x => ({
    id: x.id,
    name: x.votingEscrow.name,
  }));
});

const handleSendNotification = async () => {
    isLoading.value = true;
    try {
      const sendNotification = httpsCallable(functions, 'sendNotification');
      await sendNotification({
        topic: selectedTopic.value,
        title: title.value,
        message: body.value,
      });
      alert("Notification sent successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      clearForm();
      isLoading.value = false;
    }
  };

const clearForm = () => {
  title.value = '';
  body.value = '';
  selectedTopic.value = '';
};


watch(items, value => console.log('items', value));
</script>

<template>
  <div class="section-container">
    <div class="item-row">
      <p class="item-name">Send notification</p>
      <div class="input-group">
        <select v-model="selectedTopic" class="input">
          <option disabled value="">Topic</option>
          <option v-for="topic in topics" :key="topic" :value="topic">{{ topic }}</option>
        </select>
      </div>
      <div class="item-action">
        <div class="input-group">
        <input
          v-model="title"
          placeholder="Title"
          type="text"
          class="input"
        />
      </div>
      <div class="input-group">
        <input
          v-model="body"
          placeholder="Body"
          type="text"
          class="input"
        />
      </div>
      <button
        :disabled="
          selectedTopic === '' || title === '' || body === '' || isLoading
        "
        class="submit-button"
        @click="handleSendNotification"
      >
        Send
      </button>
    </div>
    </div>
  </div>
</template>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
.item-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  max-width: 700px;
  height: 45px;
  gap: 10px;
}

.item-row .item-name {
  width: 35%;
  max-width: 350px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}
.item-row .item-name .icon {
  fill: #2c3e50;
}
.dark .item-row .item-name .icon {
  fill: #ffffff;
}
.item-row .item-action {
  display: flex;
  width: 65%;
  align-items: center;
  height: 100%;
  gap: 10px;
}


.item-row .item-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 130px;
}

.item-row .input-group {
  height: 100%;
}

.item-row .input-group.calendar-container {
  width: 130px;
  position: relative;
}

.item-row .input-group .input,
.item-row .item-action .input-amount,
.item-row .item-action .input {
  background-color: transparent;
  border: 1px solid #e2e8f0;
  position: relative;
  border-radius: 6px;
  height: 100%;
  width: 100%;
  padding-inline: 20px;
  font-size: 14px;
  outline: none;
  display: flex;
  align-items: center;
}
.item-row .input-group.calendar-container .title-input {
  position: absolute;
  font-size: 11px;
  margin: 0;
  top: 1px;
}

.item-row .input-group.calendar-container .title-input {
  left: 5px;
}

.item-row .item-action .input-amount {
  width: 70px;
  padding-inline: 10px;
}

.item-row .item-action .input-group.calendar-container .input {
  width: 130px;
  padding-inline: 10px;
  padding-top: 10px;
}
.dark .item-row .input-group .input,
.dark .item-row .item-action .input-amount {
  border: 1px solid #3e4c5a;
}

.item-row .input-group .input:focus,
.dark .item-row .item-action .input-amount:focus {
  border: 1px solid #384aff;
}

.submit-button {
  min-width: 75px;
  height: 45px;
  background-color: #eaf0f6;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-end;
  font-weight: 600;
  font-size: 14px;
  box-shadow: none;
  border: none;
}

.dark .submit-button {
  background-color: #384aff;
}
.submit-button:disabled {
  background-color: rgba(56, 74, 255, 0.2);
  cursor: not-allowed;
}
</style>
