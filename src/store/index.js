import { createStore } from 'vuex';

export default createStore({
  state: {
    asideShow: false,
    feature: {
      type: 'Standard',
      description: '标准',
    },
  },
  mutations: {
    toggleAside(state) {
      state.asideShow = !state.asideShow;
    },
    changeFeature(state, payload) {
      if (payload.type && payload.description) {
        state.feature.type = payload.type;
        state.feature.description = payload.description;
        this.commit('toggleAside');
      }
    },
  },
  actions: {
  },
  modules: {
  },
});
