<template>
  <div class="index">
    <mu-tabs :value.sync="activated" center full-width>
      <mu-tab>
        <mu-icon value="account_balance_wallet"></mu-icon>
        钱包
      </mu-tab>
      <mu-tab>
        <mu-icon value="send"></mu-icon>
        发送
      </mu-tab>
      <mu-tab>
        <mu-icon value="library_books"></mu-icon>
        合约
      </mu-tab>
      <mu-tab disabled>
        <mu-icon value="monetization_on"></mu-icon>
        0.00 ETHER
      </mu-tab>
    </mu-tabs>

    <div v-if="0 == activated">
      <wallet class="item"/>
    </div>
    <div v-if="1 == activated">

    </div>
    <div v-if="2 == activated">
      <smartContract class="item"/>
    </div>
  </div>

</template>

<script>
import Wallet from './wallet.vue';
import SmartContract from './smartContract.vue';

export default {
  data() {
    return {
      activated: 0
    }
  },
  components: {
    Wallet,
    SmartContract
  },
  methods: {

  },
  mounted() {

  }
}
</script>

<style lang="less">
.index {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .item {
    margin: 32px;
  }
}
</style>
