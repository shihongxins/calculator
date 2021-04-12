<template>
  <header>
    <h6>计算器</h6>
    <div class="btns">
      <button class="minimize" title="最小化">&#8211;</button>
      <button class="maximize" title="最大化">&#8414;</button>
      <button class="close" title="关闭">&#10006;</button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import '../assets/css/index.scss';

header {
  height: 32px;
  //min-width: 400px;
  width: 320px;
  display: grid;
  grid-template-columns: 1fr 132px;
  @include font;
  line-height: 32px;
  font-size: 8px;
  background: $theme-color;
  h6 {
    margin: 0;
    padding: 0 0 0 2em;
    font-weight: normal;
  }
  .btns {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    text-align: center;
    cursor: default;
    button {
      width: 44px;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      &:hover {
        background-color: darken($theme-color, 20);
      }
      &.close:hover {
        color: #fff;
        background-color: $waring-color;
      }
    }
  }
}
</style>
