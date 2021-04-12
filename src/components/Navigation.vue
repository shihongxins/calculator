<template>
  <transition name="aside">
    <aside v-show="show">
      <ul @click="itemClick">
        <li class="category">计算器</li>
        <li class="item" data-type="Standard"><i class="iconfont icon-calculator"></i>标准</li>
        <li class="item" data-type="Date"><i class="iconfont icon-date"></i>日期计算</li>
        <li class="category">转换器</li>
        <li class="item" data-type="Currency"><i class="iconfont icon-currency"></i>汇率</li>
        <li class="item" data-type="Temperature"><i class="iconfont icon-temperature"></i>温度</li>
        <li class="item" data-type="Speed"><i class="iconfont icon-speed"></i>速度</li>
        <li class="item" data-type="Ruler"><i class="iconfont icon-ruler"></i>长度</li>
        <li class="item" data-type="Area"><i class="iconfont icon-area"></i>面积</li>
        <li class="item" data-type="Volume"><i class="iconfont icon-volume"></i>体积</li>
        <li class="item" data-type="Time"><i class="iconfont icon-time"></i>时间</li>
      </ul>
      <div class="footer">
        <div class="item" data-type="Info"><i class="iconfont icon-info"></i>关于</div>
      </div>
    </aside>
  </transition>
</template>

<script>
export default {
  name: 'Navgation',
  computed: {
    show() {
      return this.$store.state.asideShow;
    },
    feature() {
      return this.$store.state.feature;
    },
  },
  watch: {
    show() {
      if (this.show) {
        const last = this.$el.querySelector('.item.active');
        if (last) { last.className = 'item'; }
        this.$el.querySelector(`[data-type=${this.feature.type}]`).classList.add('active');
      }
    },
  },
  methods: {
    itemClick(e) {
      const item = e.target || e.srcTarget;
      if (item.tagName === 'LI' && item.className.indexOf('active') === -1) {
        const feature = {};
        feature.type = item.dataset.type.replace(/^\w/, '$&'.toUpperCase());
        feature.description = item.innerText;
        this.$store.commit('changeFeature', feature);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/index.scss";
//组件基本样式
aside {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 6;
  width: 256px;
  height: calc(100% - 32px);
  background: rgb(231, 231, 231);
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 70px;
  ul {
    margin: 56px 0 0;
    padding: 0;
    list-style: none;
    overflow-y: auto;
    @include scrollbar;
  }
  .footer {
    padding: 20px 0 10px;
  }
  .category,
  .item {
    padding: 0 5px;
    height: 40px;
    line-height: 40px;
    border: 2px solid transparent {
      right: none;
      left: none;
    }
    &:hover {
      border-color: whitesmoke;
    }
    @include iconfont-btns;
  }
  .category {
    font-weight: bold;
  }
  .item:hover {
    background: $hover-color;
  }
  .item.active .iconfont {
    border-left: 4px solid $theme-color;
  }
}
// 组件过渡效果
// Vue3 将 v-enter/v-leave 等过渡效果第一帧改为了 v-enter-from/v-leave-from ，分别与最后一帧 v-****-to 对应
.aside-enter-active,
.aside-leave-active {
  transition: left .5s ease;
}
.aside-enter-from,
.aside-leave-to {
  left: -260px;
}
</style>
