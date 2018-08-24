<template>
  <div class="smartContract">
    <mu-alert color="success" delete v-if="showTips" @delete="closeAlert()">
      <pre>{{message}}</pre>
    </mu-alert>
    <div class="right">
      <mu-tooltip content="新建合约">
        <mu-button flat color="primary" @click="showCreateContract">
          <mu-icon :size="48" left value="add"></mu-icon>
        </mu-button>
      </mu-tooltip>
    </div>
    <mu-dialog title="新建合约" width="auto" :esc-press-close="false" :overlay-close="false" :open.sync="openCreateContractAlert">
      <a href="https://remix.ethereum.org/" target="_blank">编写合约代码</a><br/><br/>
      <mu-text-field v-model="contractForm.jsonInterface" placeholder="合约JSON接口" multi-line :rows="1" :rows-max="6"></mu-text-field><br/>
      <mu-text-field v-model="contractForm.data" placeholder="合约字节码"></mu-text-field><br/>
      <mu-text-field v-model="contractForm.password" placeholder="账户密码" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field>
      <mu-button slot="actions" flat @click="hideCreateContract">取消</mu-button>
      <mu-button slot="actions" v-loading="loading" data-mu-loading-size="24" flat color="primary" @click="createSmartContract">确定</mu-button>
    </mu-dialog>

    <div>
      <mu-sub-header>合约列表</mu-sub-header>
      <mu-expansion-panel v-for="contract,index in contracts" :key="index" :expand="panel === index" @change="togglePanel(index)">
        <div slot="header" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{contract.address}}</div>
        <mu-list>
          <mu-divider/>
          <div v-for="item,itemIndex in contract.abi">
            <mu-list-item :ripple="false" button :key="itemIndex">
              <mu-list-item-title>{{item.name + '(' + getParams(item.inputs) + ')'}}</mu-list-item-title>
              <mu-tooltip placement="left" content="调用合约函数">
                <mu-list-item-action @click="showInovke(itemIndex, contract.abi, contract.address, item.name)">
                  <mu-icon value="touch_app"></mu-icon>
                </mu-list-item-action>
              </mu-tooltip>
            </mu-list-item>
            <mu-divider/>
          </div>
        </mu-list>
      </mu-expansion-panel>
      <mu-dialog title="请输入合约方法参数" width="auto" :esc-press-close="false" :overlay-close="false" :open.sync="openInvokeAlert">
        <div v-for="item,index in selectedMethod.inputs">
          <mu-text-field v-model="invokeParams[index]" :placeholder="item.type + ': ' + item.name"></mu-text-field>
        </div>
        <mu-select placeholder="选择执行账户" filterable v-model="selectedAccount" full-width>
          <mu-option v-for="account,index in accountList" :key="index" :label="account" :value="account"></mu-option>
        </mu-select><br/>
        <mu-text-field v-model="selectedPassword" placeholder="账户密码" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field>
        <mu-button slot="actions" flat @click="hideInovke">取消</mu-button>
        <mu-button slot="actions" v-loading="loading" data-mu-loading-size="24" flat color="primary" @click="invokeMethod">确定</mu-button>
      </mu-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: '',
      showTips: false,
      openAlert: false,
      contracts: [],
      panel: '',
      visibility: false,
      contractForm: {
        jsonInterface: '',
        data: '',
        password: ''
      },
      loading: false,
      openCreateContractAlert: false,
      openInvokeAlert: false,
      accountList: [],
      selectedAccount: '',
      selectedPassword: '',
      selectedMethod: {},
      selectedContract: {},
      invokeParams: []
    };
  },
  methods: {
    closeAlert() {
      this.showTips = false;
    },
    togglePanel(panel) {
      this.panel = panel === this.panel ? '' : panel;
    },
    hideCreateContract() {
      this.openCreateContractAlert = false;
    },
    showCreateContract() {
      this.openCreateContractAlert = true;
    },
    createSmartContract() {
      this.loading = true;
      this.$web3.eth.getAccounts().then(accounts => {
        let defaultAccount = accounts[0];
        // 解锁账户
        this.$web3.eth.personal.unlockAccount(defaultAccount, this.contractForm.password, 600).then(response => {
          console.log('unlockAccount', response);

          let jsonInterface = JSON.parse(this.contractForm.jsonInterface);
          var infocontractContract = new this.$web3.eth.Contract(jsonInterface);
          infocontractContract.deploy({
              data: this.contractForm.data,
              arguments: []
          })
          .send({
              from: defaultAccount,
              gas: 1000000,
              gasPrice: '20000000000000'
          }, function(error, transactionHash){
            console.log(1, error, transactionHash);
          })
          .on('error', function(error){
            console.log(2, error);
          })
          .on('transactionHash', function(transactionHash){
            console.log(3, transactionHash);
          })
          .on('receipt', function(receipt){
             console.log(4, receipt.contractAddress); // contains the new contract address
          })
          .on('confirmation', function(confirmationNumber, receipt){
            console.log(5, receipt.contractAddress);
          })
          .then(function(newContractInstance){
              console.log(6, newContractInstance.options.address) // instance with the new contract address
              console.log('contract address', newContractInstance.options.address);
              this.showCreateContract = false;
              this.loading = false;
          });
        });
      });
    },
    getParams(arr) {
      let params = [];
      for(let item of arr) {
        params.push([item.type, item.name].join(' '));
      }
      return params.join(', ');
    },
    hideInovke() {
      this.openInvokeAlert = false;
    },
    showInovke(index, abi, address, methodName) {
      this.loading = false;

      this.selectedMethod = abi[index];
      this.selectedContract = {abi: abi, address: address, method: methodName};
      this.invokeParams = new Array(abi[index].inputs.length);

      this.getAccountList();

      this.openInvokeAlert = true;
    },
    invokeMethod() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let contract = new this.$web3.eth.Contract(this.selectedContract.abi, this.selectedContract.address);

      let method = contract.methods[this.selectedContract.method];
      if (this.invokeParams.length > 0) {
        if (this.selectedMethod.constant) {
          method(this.invokeParams.join(', ')).call({from: this.selectedAccount}).then(response => {
            this.resolveResult(response);
          });
        } else {
          this.$web3.eth.personal.unlockAccount(this.selectedAccount, this.selectedPassword, 600).then(response => {
            method(...this.invokeParams).send({from: this.selectedAccount}).then(response => {
              this.resolveResult(response);
            });
          });
        }
      } else {
        if (this.selectedMethod.constant) {
          method().call({from: this.selectedAccount}).then(response => {
            this.resolveResult(response);
          });
        } else {
          this.$web3.eth.personal.unlockAccount(this.selectedAccount, this.selectedPassword, 600).then(response => {
            method().send({from: this.selectedAccount}).then(response => {
              this.resolveResult(response);
            });
          });
        }
      }
    },
    resolveResult(response) {
      this.message = response;
      this.showTips = true;
      this.openInvokeAlert = false;
    },
    getAccountList() {
      const defaultAccount = this.$web3.eth.defaultAccount
      this.$web3.eth.getAccounts().then(accounts => {
        this.accountList = accounts;
      });
    }
  },
  mounted() {
    this.contracts.push({
      address: '0xE5DD382ac8D4aC2cC6A88B0CccC50DB68CcbCDa4',
      abi: [{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fName","type":"string"},{"name":"_age","type":"uint256"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    });
    this.contracts.push({
      address: '0xd8324762AAad0311241236896768234e501b1E6F',
      abi: [{"constant":true,"inputs":[{"name":"text","type":"string"}],"name":"sayHi","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]
    });
  }
}
</script>

<style lang="less">
</style>
