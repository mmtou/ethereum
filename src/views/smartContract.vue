<template>
  <div class="smartContract">
    <appbar/>

    <div class="right">
      <mu-button flat color="primary" @click="createSmartContract">
        <mu-icon left value="add"></mu-icon>
        新建智能合约
      </mu-button>
    </div>

    <mu-dialog title="新建智能合约" width="auto" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
      aa
      <mu-button slot="actions" flat @click="closeAlertDialog">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">确认</mu-button>
    </mu-dialog>
  </div>
</template>

<script>
import Appbar from '../components/appbar.vue';

export default {
  data () {
    return {
      openAlert: false
    };
  },
  components: {
    Appbar
  },
  methods: {
    createSmartContract() {
      this.openAlert = true;
    },
    closeAlertDialog () {
      let myContract = new this.$web3.eth.Contract([
        {
          "type": "function",
          "name": "foo",
          "inputs": [
            {
              "name": "a",
              "type": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "b",
              "type": "address"
            }
          ]
        },
        {
          "type": "event",
          "name": "Event",
          "inputs": [
            {
              "name": "a",
              "type": "uint256",
              "indexed": true
            },
            {
              "name": "b",
              "type": "bytes32",
              "indexed": false
            }
          ]
        }
      ]);
      console.log(myContract);

      myContract.deploy({
          data: '0x12345',
          arguments: [123, 'My String']
      })
      .send({
          from: '0x1234567890123456789012345678901234567891',
          gas: 1500000,
          gasPrice: '30000000000000'
      }, function(error, transactionHash){
        console.log('send error', error);
      })
      .on('error', function(error){
        console.log('send error error', error);
      })
      .on('transactionHash', function(transactionHash){
        console.log('transactionHash', transactionHash);
      })
      .on('receipt', function(receipt){
         console.log(receipt.contractAddress) // 收据中包含了新的合约地址
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log('confirmation', confirmationNumber, receipt);
      })
      .then(function(newContractInstance){
          console.log(newContractInstance.options.address) // 新地址的合约实例
      });

      // data是合约自身的一个可选配置项
      myContract.options.data = '0x12345';

      myContract.deploy({
          arguments: [123, 'My String']
      })
      .send({
          from: '0x1234567890123456789012345678901234567891',
          gas: 1500000,
          gasPrice: '30000000000000'
      })
      .then(function(newContractInstance){
          console.log(newContractInstance.options.address) // instance with the new contract address
      });


      // 编码
      myContract.deploy({
          data: '0x12345',
          arguments: [123, 'My String']
      })
      .encodeABI();


      // 估算gas
      myContract.deploy({
          data: '0x12345',
          arguments: [123, 'My String']
      })
      .estimateGas(function(err, gas){
          console.log(gas);
      });

      this.openAlert = false;
    }
  },
  mounted() {

  }
}
</script>

<style lang="less">
</style>
