<template>
  <div id="app">
    <div class="btn_wapper">
      <template v-for="(item,index) in allRouters">
        <el-button @click="jump(item.link)">{{index+1}}. {{item.name}}</el-button>
      </template>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      allRouters: [{
        link: '/feesApply',
        name: '留学资费标准调整-申请'
      }, {
        link: '/',
        name: '留学资费标准-编辑'
      }, {
        link: "/feesApply?type=history",
        name: '历史资费标准-申请'
      }, {
        link: 'feesHistoryReedit',
        name: '历史资费标准-详情'
      }, {
        link: 'feesApplyApproval',
        name: '留学资费标准调整-审批'
      }]
    }
  },
  methods: {
    jump(url) {
      this.$router.push({ path: url })
    }
  }
}

</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  margin-top: 60px;
}

.btn_wapper {
  margin-bottom: 30px;

}

</style>
