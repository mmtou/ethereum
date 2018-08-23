<template>
  <div class="smartContract">
    <div class="right">
      <mu-button flat color="primary" @click="createSmartContract">
        <mu-icon :size="48" left value="add"></mu-icon>
      </mu-button>
    </div>

    <div>
      <mu-expansion-panel v-for="contract,index in contracts" :key="index" :expand="panel === index" @change="togglePanel(index)">
        <div slot="header" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{contract.address}}</div>
        <mu-list>
          <mu-divider/>
          <div v-for="item,itemIndex in contract.abi">
            <mu-list-item :ripple="false" button :key="itemIndex">
              <mu-list-item-title>{{item.name + '(' + getParams(item.inputs) + ')'}}</mu-list-item-title>
              <mu-list-item-action @click="invokeMethod(item.name)">
                <mu-icon value="touch_app"></mu-icon>
              </mu-list-item-action>
            </mu-list-item>
            <mu-divider/>
          </div>
        </mu-list>
      </mu-expansion-panel>
    </div>

    <mu-button flat color="primary" @click="getInfo">
      <mu-icon left value="get_app"></mu-icon>
    </mu-button>

    <mu-button flat color="primary" @click="setInfo">
      <mu-icon left value="settings"></mu-icon>
    </mu-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      openAlert: false,
      contracts: [],
      panel: ''
    };
  },
  methods: {
    togglePanel(panel) {
      this.panel = panel === this.panel ? '' : panel;
    },
    createSmartContract() {
      this.$web3.eth.getAccounts().then(accounts => {
        let defaultAccount = accounts[0];
        // 解锁账户
        this.$web3.eth.personal.unlockAccount(defaultAccount, "111111", 600).then(response => {
          console.log('unlockAccount', response);
          this.$web3.eth.getBalance(defaultAccount).then(response => {
            console.log('balance', response);
          });

          var infocontractContract = new this.$web3.eth.Contract([{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fName","type":"string"},{"name":"_age","type":"uint256"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
          infocontractContract.deploy({
              data: '0x608060405234801561001057600080fd5b506102fa806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635a9b0b89146100515780638262963b146100e8575b600080fd5b34801561005d57600080fd5b5061006661015b565b6040518080602001838152602001828103825284818151815260200191508051906020019080838360005b838110156100ac578082015181840152602081019050610091565b50505050905090810190601f1680156100d95780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b3480156100f457600080fd5b50610159600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929080359060200190929190505050610207565b005b6060600080600154818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156101f85780601f106101cd576101008083540402835291602001916101f8565b820191906000526020600020905b8154815290600101906020018083116101db57829003601f168201915b50505050509150915091509091565b816000908051906020019061021d929190610229565b50806001819055505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061026a57805160ff1916838001178555610298565b82800160010185558215610298579182015b8281111561029757825182559160200191906001019061027c565b5b5090506102a591906102a9565b5090565b6102cb91905b808211156102c75760008160009055506001016102af565b5090565b905600a165627a7a72305820e6ef72dca4e6f03925bf757cff6b8aa98251446155a6e5f67a84941e3755f53c0029',
              arguments: [123, 'My String']
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
              newContractInstance.methods.getInfo().call({from: defaultAccount}).then(response => {
                  console.log('getInfo1', response);
              });

              newContractInstance.methods.setInfo('mmtou', 24).send({from: defaultAccount}).then(response => {
                  console.log('setInfo', response);

                  newContractInstance.methods.getInfo().call({from: defaultAccount}).then(response => {
                      console.log('getInfo2', response);
                  });
              });
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
    invokeMethod(methodName) {
      console.log(methodName);
    },
    getInfo() {
      let abi = [{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fName","type":"string"},{"name":"_age","type":"uint256"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
      let address = '0xE5DD382ac8D4aC2cC6A88B0CccC50DB68CcbCDa4';
      let infocontractContract = new this.$web3.eth.Contract(abi, address);
      console.log(infocontractContract);
      infocontractContract.methods.getInfo().call().then(response => {
        console.log('getInfo3', response);
      });
    },
    setInfo() {
      let abi = [{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fName","type":"string"},{"name":"_age","type":"uint256"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
      let address = '0xE5DD382ac8D4aC2cC6A88B0CccC50DB68CcbCDa4';
      let infocontractContract = new this.$web3.eth.Contract(abi, address);
      console.log(infocontractContract);

      this.$web3.eth.getAccounts().then(accounts => {
        let defaultAccount = accounts[0];
        this.$web3.eth.personal.unlockAccount(defaultAccount, "111111", 600).then(response => {
          infocontractContract.methods.setInfo('mmtou', 24).send({from: defaultAccount}).then(response => {
            console.log('setInfo2', response);
            infocontractContract.methods.getInfo().call().then(response => {
                console.log('getInfo4', response);
            });
          });
        });
      });
    }
  },
  mounted() {
    this.contracts.push({
      address: '0xE5DD382ac8D4aC2cC6A88B0CccC50DB68CcbCDa4',
      abi: [{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fName","type":"string"},{"name":"_age","type":"uint256"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    });
    this.contracts.push({
      address: '0xE5DD382ac8D4aC2cC6A88B0CccC50DB68CcbCDa4',
      abi: [{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_fName","type":"string"},{"name":"_age","type":"uint256"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    });
  }
}
</script>

<style lang="less">
</style>
