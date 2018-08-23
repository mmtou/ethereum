<template>
<div class="wallet">
  <mu-alert color="success" v-if="showTips">
    {{message}}
  </mu-alert>

  <div class="right">
    <mu-button icon @click="showAddAccount">
      <mu-icon :size="48" color="primary" value="add"></mu-icon>
    </mu-button>
    <mu-dialog title="创建密码" width="auto" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
      <mu-text-field v-model="password" placeholder="请输入密码" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field>
      <mu-button slot="actions" flat @click="hideAddAccount">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="addAccount">好的</mu-button>
    </mu-dialog>
  </div>

  <mu-data-table stripe border :columns="columns" :data="list">
    <template slot-scope="scope">
      <td>{{scope.row.index}}</td>
      <td>
        {{scope.row.account}}
      </td>
      <td class="is-right">{{scope.row.balance}}</td>
    </template>
  </mu-data-table>

</div>
</template>

<script>
import {formatAmount} from '../utils/amountFormat';

export default {
  name: 'wallet',
  data() {
    return {
      columns: [
        { title: '编号', name: 'index', align: 'center' },
        { title: '账号', name: 'account', align: 'center' },
        { title: '余额', name: 'balance', align: 'center' },
      ],
      list: [
      ],
      openAlert: false,
      password: '',
      visibility: false,
      message: '',
      showTips: false,
      buttonLoading: true
    }
  },
  methods: {
    accountList() {
      this.list = [];
      const defaultAccount = this.$web3.eth.defaultAccount
      this.$web3.eth.getAccounts().then(accounts => {
        for(let index in accounts) {
          const account = accounts[index];
          this.$web3.eth.getBalance(account).then(balance => {
            this.list.push({
              index: index,
              account: account,
              balance: formatAmount(this.$web3.utils.fromWei(balance)) + ' ETH'
              // balance: balance + ' wei'
            });
          });
        }
      });
    },
    showAddAccount() {
      this.openAlert = true;
    },
    hideAddAccount() {
      this.openAlert = false;
    },
    addAccount() {
      if (this.password) {
        this.$web3.eth.personal.newAccount(this.password).then(response => {
          this.message = '开户成功';

          this.showTips = true;
          this.openAlert = false;
          this.accountList();
        });
      }
    },
    createWallet(index) {
      let wallet = this.$web3.eth.accounts.wallet.create(index);

      this.account = '创建钱包成功';
      this.openAlert = true;
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
.account {
}
</style>
