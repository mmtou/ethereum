<template>
<div class="wallet">
  <mu-alert color="success" v-if="showTips">
    {{message}}
  </mu-alert>

  <div class="right">
    <mu-button icon @click="showAddAccount">
      <mu-icon :size="48" color="primary" value="add"></mu-icon>
    </mu-button>
    <mu-dialog title="开户" width="auto" :esc-press-close="false" :overlay-close="false" :open.sync="openAddAccountAlert">
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
      <td>
        <mu-button flat @click="showTransaction(scope.row.account)">
          <mu-icon color="primary" value="compare_arrows"></mu-icon>转账
        </mu-button>
      </td>
    </template>
  </mu-data-table>
  <mu-dialog title="转账" width="auto" :esc-press-close="false" :overlay-close="false" :open.sync="openTransactionAlert">
    <mu-select placeholder="对方账户" filterable v-model="transactionForm.account" full-width>
      <mu-option v-for="account,index in list" :key="index" v-if="currentAccount !== account.account" :label="account.account" :value="account.account"></mu-option>
    </mu-select><br/>
    <mu-text-field v-model="transactionForm.amount" placeholder="转账金额" type="number" suffix="ETH"></mu-text-field><br/>
    <mu-text-field v-model="transactionForm.password" placeholder="请输入密码" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field>
    <mu-button slot="actions" flat @click="hideTransaction">取消</mu-button>
    <mu-button slot="actions" flat color="primary" @click="transaction">好的</mu-button>
  </mu-dialog>

</div>
</template>

<script>
import {formatAmount} from '../utils/amountFormat';

export default {
  name: 'wallet',
  data() {
    return {
      columns: [
        { title: '编号', name: 'index', align: 'center', width: 100 },
        { title: '账号', name: 'account', align: 'center' },
        { title: '余额', name: 'balance', align: 'center' },
        { title: '操作', name: 'operation', align: 'center' },
      ],
      list: [
      ],
      openAddAccountAlert: false,
      password: '',
      visibility: false,
      message: '',
      showTips: false,
      openTransactionAlert: false,
      transactionForm: {
        account: '',
        password: '',
        amount: ''
      },
      currentAccount: ''
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
              balance: formatAmount(this.$web3.utils.fromWei(balance)) + ' ETH',
              // balance: balance + ' wei',
            });
          });
        }
      });
    },
    showAddAccount() {
      this.openAddAccountAlert = true;
    },
    hideAddAccount() {
      this.openAddAccountAlert = false;
    },
    addAccount() {
      if (this.password) {
        this.$web3.eth.personal.newAccount(this.password).then(response => {
          this.message = '开户成功';

          this.showTips = true;
          this.openAddAccountAlert = false;
          this.accountList();
        });
      }
    },
    showTransaction(account) {
      this.currentAccount = account;
      this.openTransactionAlert = true;
    },
    hideTransaction() {
      this.openTransactionAlert = false;
    },
    transaction() {
      this.$web3.eth.personal.unlockAccount(this.currentAccount, this.transactionForm.password, 600).then(response => {
        this.$web3.eth.sendTransaction({
          from: this.currentAccount,
          to: this.transactionForm.account,
          value: this.$web3.utils.toWei(this.transactionForm.amount, 'ether')
        }).then(receipt => {
          console.log(receipt);
          this.message = '开户成功';
          this.showTips = true;
          this.openTransactionAlert = false;

          this.accountList();
        });
      });
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
