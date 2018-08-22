<template>
  <div class="appbar">
    <mu-appbar>
      <mu-button icon slot="left" @click="showLeftnav">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <span v-if="!showMore">以太坊 {{version}}</span>
      <span v-if="showMore">通信服务提供器: {{currentProvider}}</span>
      <mu-button icon slot="right" @click="showMore = !showMore">
        <mu-icon value="more_vert"></mu-icon>
      </mu-button>
    </mu-appbar>

    <leftnav ref="leftnav"/>
  </div>
</template>

<script>
import Leftnav from './leftnav.vue';

export default {
  name: 'appbar',
  data() {
    return {
        version: '',
        currentProvider: '',
        showMore: false
    }
  },
  components: {
    Leftnav
  },
  methods: {
    showLeftnav() {
      this.$refs.leftnav.$emit("showLeftnav");
    }
  },
  mounted() {
    this.version = this.$web3.version;
    this.currentProvider = this.$web3.currentProvider.host;
  }
}
</script>

<style lang="css">
</style>
