<template>
  <div class="calculator">
    <Title></Title>
    <Toolbar
      :feature="feature"
      @menuClick="toggleAside"></Toolbar>
    <Navigation
      :show="aside"
      :featureType="feature.type"
      @itemClick="changeFeature"></Navigation>
    <main>
      <component :is="feature.type"></component>
    </main>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'; // Vue3 的异步组件加载需要此方法

import Title from './components/Title.vue';
import Toolbar from './components/Toolbar.vue';
import Navigation from './components/Navigation.vue';

export default {
  name: 'App',
  data() {
    return {
      aside: false,
      feature: {
        type: 'Standard',
        description: '标准',
      },
    };
  },
  components: {
    Title,
    Toolbar,
    Navigation,
    Standard: defineAsyncComponent(() => import('./views/Standard')),
    Date: defineAsyncComponent(() => import('./views/Date')),
  },
  methods: {
    toggleAside() {
      this.aside = !this.aside;
    },
    changeFeature(newFeature) {
      if (newFeature && newFeature.type) {
        this.feature = newFeature;
      }
      this.aside = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './assets/css/index.scss';

.calculator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 500px;
  border: 1px solid #bbb;
  box-shadow: 0 0 10px 5px rgba($bg-color,0.6);
  background: $bg-color;
  @include font;
  overflow: hidden;
  user-select: none;
}
main {
  position: absolute;
  top: calc(32px + 40px);
  bottom: 0;
  width: 100%;
}
</style>
