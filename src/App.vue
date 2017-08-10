<template>
  <div id="app">
  <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="/">HTTP请求</el-menu-item>
    <el-menu-item index="auto">自动完成HTTP请求</el-menu-item>
    <el-menu-item index="md5">md5加密</el-menu-item>
    <el-menu-item index="replace">自动替换器</el-menu-item>
  </el-menu>
    <router-view></router-view>
    <el-dialog title="md5加密" :visible.sync="md5Dialog">
      <div style="padding:10px 20px;">
        <el-row :gutter="20">
            <el-col :span="2">
                明文：
            </el-col>
            <el-col :span="10">
                <el-input
                    v-model="md5Text">
                </el-input>
            </el-col>
            <el-button type="primary" @click="doEncryptMd5">加密</el-button>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="2">
                密文：
            </el-col>
            <el-col :span="10">
                <el-input
                    v-model="md5Encrypt">
                </el-input>
            </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog title="自动替换器" :visible.sync="replaceDialog">
      <div style="padding:10px 20px;">
        <el-row :gutter="20">
            <el-col :span="24">
                <el-button @click="addItem">添加</el-button>
            </el-col>
        </el-row>
        <template v-for="item in replaces">
            <el-row :gutter="20">
            <el-col :span="3">
              <el-select v-model="item.type" placeholder="替换区域">
                  <el-option label="body"  value="body"></el-option>
                  <el-option label="header" value="header"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
                <el-input
                    placeholder="Key"
                    v-model="item.key">
                </el-input>
            </el-col>
            <el-col :span="10">
                <el-input
                    placeholder="Value"
                    v-model="item.value">
                </el-input>
            </el-col>
              <el-button type="danger" :plain="true" icon="delete" @click="deleteItem(item)"></el-button>
            </el-row>
        </template>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveReplaceData">确定</el-button>
            </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: 'app',
  data () {
    return {
      md5Dialog: false,
      replaceDialog: false,
      md5Text: '',
      md5Encrypt: '',
      replaces: [
      ]
    }
  },
  mounted() {
      this.init();
  },
  methods: {
    init() {
      this.replaces = this.$store.state.replaces;
    },
    doEncryptMd5() {
      this.md5Encrypt = md5(this.md5Text);
    },
    addItem() {
      this.replaces.push({
          type: 'body',
          key: '',
          value: ''
        })
    },
    deleteItem(item) {
        let index = this.replaces.indexOf(item);
        this.replaces.splice(index, 1)
    },
    saveReplaceData(){
        this.$store.state.replaces = this.replaces;
        this.replaceDialog = false;
    },
    handleSelect(key, keyPath) {
      let _this = this;
      switch (key) {
        case "md5" :
          _this.md5Dialog = true;
          break;
        case "replace" :
          _this.replaceDialog = true;
          break;
        default:
          _this.$router.push({
            path: key
          })
          break;
      } 
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
