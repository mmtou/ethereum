<template>
  <mu-drawer :open.sync="drawerOpen" :docked="false">
    <mu-list toggle-nested>
      <mu-list-item button :ripple="false" :to="item.router" nested v-for="item, index in list" :key="index">
        <mu-list-item-action>
          <mu-icon :value="item.icon"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>{{item.name}}</mu-list-item-title>
        <mu-list-item-action v-if="item.children">
          <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
        </mu-list-item-action>
        <mu-list-item button :to="itemItem.router" :href="itemItem.href" :ripple="false" slot="nested" v-for="itemItem, itemIndex in item.children" :key="itemIndex">
          <mu-list-item-title>{{itemItem.name}}</mu-list-item-title>
        </mu-list-item>
      </mu-list-item>
    </mu-list>
  </mu-drawer>
</template>

<script>
export default {
  name: "leftnav",
  data() {
    return {
      drawerOpen: false,
      list: [
        {
          name: '账户管理',
          icon: 'account_circle',
          children: [
            {
              name: '账户列表',
              router: '/'
            },
            {
              name: '钱包',
              router: '/wallet'
            }
          ]
        },
        {
          name: '测试',
          icon: 'explore',
          router: '/test'
        },
        {
          name: '智能合约管理',
          icon: 'assignment',
          children: [
            {
              name: '智能合约列表',
              router: '/smartContract'
            }
          ]
        },
        {
          name: 'web3.js',
          icon: 'apps',
          children: [
            {
              name: '中文文档',
              href: 'http://cw.hubwiz.com/card/c/web3.js-1.0/'
            },
            {
              name: '官方文档',
              href: 'https://web3js.readthedocs.io/'
            }
          ]
        }
      ]
    }
  },
  methods: {
    showLeftnav() {
      this.drawerOpen = true;
    }
  },
  mounted(){
    this.$on('showLeftnav', ()=>{
      this.showLeftnav();
    });
  }
}
</script>

<style lang="less">
</style>
