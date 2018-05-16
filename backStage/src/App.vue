<template>
  <div id="app">
    <router-view class="router-view"></router-view>
    <loading :value="pageLoading || dataLoading"></loading>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import loading from "@/components/common/loading";
export default {
  components: {
    loading
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["pageLoading", "dataLoading", "path"])
  },
  created() {
    this.setCacheData();
  },
  methods: {
    ...mapMutations(["setCacheData"])
  },
  mounted() {}
};
</script>
<style lang="scss">
@import "src/style/common";
@import "src/icon/icon";
</style>

