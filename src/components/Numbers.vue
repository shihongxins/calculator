<template>
  <div class="numbers" @click="numbersClick">
    <button data-key="7">7</button>
    <button data-key="8">8</button>
    <button data-key="9">9</button>
    <button data-key="4">4</button>
    <button data-key="5">5</button>
    <button data-key="6">6</button>
    <button data-key="1">1</button>
    <button data-key="2">2</button>
    <button data-key="3">3</button>
    <button data-key="-" v-if="showOppositeKey">&#177;</button>
    <button data-key="0">0</button>
    <button data-key=".">.</button>
  </div>
</template>

<script>
export default {
  name: 'Numbers',
  props: {
    mode: String,
  },
  computed: {
    showOppositeKey() {
      return this.mode === 'standard';
    },
  },
  methods: {
    numbersClick(e) {
      const keyValue = (e.target || e.srcElement).dataset.key;
      this.$emit('numbersClick', keyValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/css/index.scss';
.numbers {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-template-rows: repeat(4,1fr);
  gap: 2px;
  button {
    font-weight: bold;
    background: $numbers-color;
    &:hover {
      background: $hover-color;
    }
    &[data-key='0'] {
      grid-column-start: 2;
    }
  }
}
</style>
