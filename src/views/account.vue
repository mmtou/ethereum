<template>
<div class="index">

  <appbar/>

  <div class="right">
    <mu-button icon @click="createAccount">
      <mu-icon value="add"></mu-icon>
    </mu-button>
  </div>

  <mu-data-table stripe border :columns="columns" :data="list">
    <template slot-scope="scope">
      <td>{{scope.row.index}}</td>
      <td>
        <mu-badge content="默认" color="primary" v-if="scope.row.default"></mu-badge>
        {{scope.row.account}}
      </td>
      <td class="is-right">{{scope.row.balance}}</td>
      <td>
        <mu-button flat color="primary" @click="createWallet(scope.row.index)">创建钱包</mu-button>
        <mu-button flat color="primary" @click="setDefaultAccount(scope.row.account)">设为默认</mu-button>
      </td>
    </template>
  </mu-data-table>

  <mu-dialog title="新增账户完成" width="auto" :open.sync="openDialog">
    {{account}}
    <mu-button slot="actions" flat color="primary" @click="openDialog = false">好的</mu-button>
  </mu-dialog>
</div>
</template>

<script>
import Appbar from '../components/appbar.vue';

export default {
  data() {
    return {
      columns: [
        { title: 'index', name: 'index' },
        { title: '账号', name: 'account' },
        { title: '余额', name: 'balance' },
        { title: '操作', name: 'operate' },
      ],
      list: [
      ],
      openDialog: false,
      account: {}
    }
  },
  components: {
    Appbar
  },
  methods: {
    showLeftnav() {
      this.$refs.leftnav.$emit("showLeftnav");
    },
    accountList() {
      this.list = [];
      const defaultAccount = this.$web3.eth.defaultAccount
      this.$web3.eth.getAccounts().then(accounts => {
        for(let index in accounts) {
          const account = accounts[index];
          this.$web3.eth.getBalance(account).then(balance => {
            this.list.push({
              index: index,
              default: defaultAccount === account ? true: false,
              account: account,
              balance: this.$web3.utils.fromWei(balance) + ' ETH'
            });
          });
        }
      });
    },
    createAccount() {
      let account = this.$web3.eth.accounts.create();

      this.account = account;
      this.openDialog = true;

      this.accountList();
    },
    createWallet(index) {
      let wallet = this.$web3.eth.accounts.wallet.create(index);

      this.account = '创建钱包成功';
      this.openDialog = true;
    },
    setDefaultAccount(account) {
      this.$web3.eth.defaultAccount = account;
      this.accountList();
    }
  },
  mounted() {
    this.accountList();
  }
}
</script>

<style lang="less">
.index {
}
</style>
