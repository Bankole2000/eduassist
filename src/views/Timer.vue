<script setup>
import { computed } from 'vue';

const props = defineProps({
  digit: {
    type: Number,
    required: true
  }
})


const leftDigit = computed(() => props.digit.value >= 10 ? props.digit.value.toString()[0] : '0')
const rightDigit = computed(() => props.digit.value >= 10 ? props.digit.value.toString()[1] : props.digit.value.toString())
</script>

<template>
   <span class="single-digit">
        {{ leftDigit }}
    </span>
    <span class="single-digit">
        {{ rightDigit }}
    </span>
</template>
