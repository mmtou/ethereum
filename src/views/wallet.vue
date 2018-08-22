<template>
<div class="wallet">
  <appbar/>

  <mu-data-table stripe border :columns="columns" :data="list">
    <template slot-scope="scope">
      <td>{{scope.row.address}}</td>
      <td>{{scope.row.privateKey}}</td>
      <td>
        <mu-button flat color="primary" @click="createAccount(scope.row.privateKey)">创建账户</mu-button>
      </td>
    </template>
  </mu-data-table>
</div>
</template>

<script>
import Appbar from '../components/appbar.vue';

export default {
  data() {
    return {
      columns: [
          { title: 'address', name: 'address' },
          { title: 'privateKey', name: 'privateKey' },
          { title: 'operate', name: '操作' }
      ],
      list: [],
      openDialog: false,
      account: {}
    }
  },
  components: {
    Appbar
  },
  methods: {
    walletList() {
      let result = this.$web3.eth.accounts.wallet;
      console.log(result);
      if (result.length) {
          for (var key in result) {
            if (key <= result.length) {
              this.list.push(result[key]);
            }
          }
      }
    },
    createAccount(privateKey) {
      let result = this.$web3.eth.accounts.wallet.add(privateKey);
      console.log(result);
    }
  },
  mounted() {
    this.walletList();
  }
}
</script>

<style lang="less">
.wallet {
}
</style>
