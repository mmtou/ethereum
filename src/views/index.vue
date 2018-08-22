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
        合同
      </mu-tab>
      <mu-tab disabled>
        <mu-icon value="monetization_on"></mu-icon>
        0.00 ETHER
      </mu-tab>
    </mu-tabs>

    <div v-if="0 == activated">
      <mu-button icon color="primary" @click="showAddAccount()">
        <mu-icon :size="48" value="add"></mu-icon>
      </mu-button>

      <mu-dialog title="创建密码" width="auto" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
        <mu-text-field v-model="password" placeholder="请输入密码" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field>
        <mu-button slot="actions" flat color="primary" @click="hideAddAccount">取消</mu-button>
        <mu-button slot="actions" flat color="primary" @click="hideAddAccount">好的</mu-button>
      </mu-dialog>
    </div>
    <div v-if="1 == activated">
      发送
    </div>
    <div v-if="2 == activated">
      合同
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      activated: 0,
      openAlert: false,
      password: '',
      visibility: false
    }
  },
  methods: {
    showAddAccount() {
      this.openAlert = true;
    },
    hideAddAccount() {
      this.openAlert = false;
    }
  }
}
</script>

<style lang="less">
</style>
