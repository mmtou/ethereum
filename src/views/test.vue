<template>
  <div class="test">
    <appbar/>
  </div>
</template>

<script>
import Appbar from '../components/appbar.vue';

export default {
  components: {
    Appbar
  },
  mounted() {
    // this.$web3.eth.abi.encodeParameter('uint256', {
    //   'name': '张三',
    //   'age': 24
    // });
    // this.$web3.eth.abi.encodeParameter('uint256', '112');
    console.log(this.$web3.eth.defaultAccount);
  }
}
</script>

<style lang="less">
</style>
