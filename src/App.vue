<template>
  <div id="app">
  <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">GET/POST请求</el-menu-item>
  </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      value1: 0,
      menuData: [
        {
          name: '首页',
          selected: true
        },
        {
          name: '最新动态',
        },
        {
          name: '关注健康',
        },
        {
          name: '关于我们',
        },
      ]
    }
  },
  methods: {
    handleSelect() {
      
    }
  }

}
</script>

<style>
*{
  margin:0;
  padding:0;
}
body{
  background:#fff !important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
