<template>
  <nav>
    <button class="menu" @click="menuClick" title="功能"><i class="iconfont icon-menu"></i></button>
    <strong>{{feature.description}}</strong>
    <button class="pin" title="固定在顶层"><i class="iconfont icon-pin"></i></button>
    <button class="history" title="历史"
      v-if="feature.type=='Standard'"><i class="iconfont icon-history"></i></button>
  </nav>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    feature: Object,
  },
  methods: {
    menuClick() {
      this.$emit('menuClick');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/index.scss";

nav {
  position: absolute;
  top: 32px;
  padding-bottom: 1em;
  width: 100%;
  strong {
    @include font;
    font-weight: bold;
    padding: 0 0.5em;
    z-index: -1;
  }
  button {
    width: 40px;
    height: 40px;
    line-height: 40px;
    &:hover {
      background-color: $hover-color;
    }
    @include iconfont-btns;
  }
  .menu {
    position: relative;
    z-index: 9;
  }
  .history {
    position: absolute;
    right: 0;
  }
}
</style>
