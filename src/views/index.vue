<template>
  <div class="index">
    <mu-tabs :value.sync="activated" center full-width>
      <mu-tab>
        <mu-icon value="account_balance_wallet"></mu-icon>
        钱包
      </mu-tab>
      <mu-tab>
        <mu-icon value="library_books"></mu-icon>
        合约
      </mu-tab>
      <mu-tab disabled>
        <mu-icon value="最低交易价格"></mu-icon>
        {{gasPrice | formatAmount}} ETHER
      </mu-tab>
      <mu-tab disabled>
        <mu-icon value="monetization_on"></mu-icon>
        {{defaultAccountBalance | formatAmount}} ETHER
      </mu-tab>
    </mu-tabs>

    <div v-if="0 == activated">
      <wallet class="item"/>
    </div>
    <div v-if="1 == activated">
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
      activated: 0,
      defaultAccountBalance: 0,
      gasPrice: 0
    }
  },
  components: {
    Wallet,
    SmartContract
  },
  methods: {
    getDefaultAccountBalance() {
      this.$web3.eth.getCoinbase().then(address => {
        this.$web3.eth.getBalance(address).then(balance => {
          this.defaultAccountBalance = this.$web3.utils.fromWei(balance);
        });
      });
    },
    getGasPrice() {
      this.$web3.eth.getGasPrice().then(gasPrice => {
        this.gasPrice = this.$web3.utils.fromWei(gasPrice);
      });
    }
  },
  mounted() {
    this.getDefaultAccountBalance();
    this.getGasPrice();
    setInterval(this.getDefaultAccountBalance, 5000);
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
.mu-loading-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  z-index: 20151223;
}
</style>
