# Q & A
+ > Q: 异步组件没有加载成功，提示 `[Vue warn]: Failed to resolve component` 。
  > A: Vue 3 中的异步组件依赖于 `defineAsyncComponent` 方法才能加载。
+ > Q: 使用过渡效果 `<transition>` 组件时，只有结束效果，进入效果不生效。
  > A: Vue 3 将过渡效果中的 `v-enter/v-leave` 两个阶段的名称改为了 `v-****-from` ，以便于和原来的 `v-****-to` 区分。
+ > Q: Vue 实例中 methods 的方法同级调用
  > A: `this.$options.methods.****.bind(this)()`
+ > Q: Vuex 中 mutations 的方法同级调用
  > A: 直接使用 `this.commit('****')`
