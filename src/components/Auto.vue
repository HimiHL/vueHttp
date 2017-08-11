<template>
    <div id="auto">
    <el-row :gutter="20">
        <el-col :span="4">
            <div style="padding:20px 20px;">
                <el-select v-model="selectedMenu" placeholder="请选择" @change="buildMenu">
                    <el-option
                    v-for="(item, key) in menuList"
                    :key="key"
                    :label="item.name"
                    :value="key">
                    </el-option>
                </el-select>
            </div>
            <div style="padding:20px 20px;">
                <el-tree
                    :data="menuData"
                    accordion
                    @node-click="handleNodeClick">
                    </el-tree>
            </div>
        </el-col>
        <el-col :span="8">
            <div style="margin-top: 15px;padding:0 20px;">
                <el-input placeholder="网址" v-model="uri">
                    <el-select v-model="method" slot="prepend" placeholder="请选择">
                        <el-option label="GET" value="get"></el-option>
                        <el-option label="POST" value="post"></el-option>
                        <el-option label="PUT" value="put"></el-option>
                        <el-option label="DELETE" value="delete"></el-option>
                    </el-select>
                </el-input>
            </div>
            <div style="padding:10px 20px;">
                <el-tabs type="border-card">
                    <el-tab-pane label="Body">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-button @click="addBody">添加</el-button>
                            </el-col>
                        </el-row>
                        <template v-for="item in form.body">
                            <el-row :gutter="20">
                                <el-col :span="10">
                                    <el-input
                                        placeholder="Key"
                                        v-model="item.key">
                                    </el-input>
                                </el-col>
                                <el-col :span="11">
                                    <el-input
                                        placeholder="Value"
                                        v-model="item.value">
                                    </el-input>
                                </el-col>
                                <el-button type="danger" :plain="true" icon="delete" @click="deleteBody(item)"></el-button>
                            </el-row>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="Header">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-button @click="addHeaders">添加</el-button>
                            </el-col>
                        </el-row>
                        <template v-for="item in form.headers">
                            <el-row :gutter="20">
                                <el-col :span="10">
                                    <el-input
                                        placeholder="Key"
                                        v-model="item.key">
                                    </el-input>
                                </el-col>
                                <el-col :span="11">
                                    <el-input
                                        placeholder="Value"
                                        v-model="item.value">
                                    </el-input>
                                </el-col>
                                <el-button type="danger" :plain="true" icon="delete" @click="deleteHeaders(item)"></el-button>
                            </el-row>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </div>
             <div style="padding:10px 20px;">
                <el-radio-group v-model="defaultContentType">
                    <template v-for='item in form.contentType'>
                        <el-radio :label="item">{{ item }}</el-radio>
                    </template>
                </el-radio-group>
            </div>
            <div style="padding:10px 20px;">
                <el-button type="primary" @click="http">提交</el-button>
                <el-button type="primary" @click="setMarkdown" :disabled="disabledMarkdown">生成文档</el-button>
            </div> 
        </el-col>
        <el-col :span="10">
            <div style="margin-top: 15px;padding:0 20px;">
                <el-tabs type="border-card">
                    <el-tab-pane label="JSON">
                        <pre style="background:#f1f1f1;padding:5px 0px 5px 2em;overflow-y:auto;max-height:300px;">{{ response }}</pre>
                    </el-tab-pane>
                    <el-tab-pane label="源码">
                    <div style="min-height:250px;overflow-y:auto;max-height:300px;">{{ response }}</div>
                    </el-tab-pane>
                    <el-tab-pane label="页面">
                        <div v-html="response" style="min-height:250px;overflow-y:auto;max-height:300px;"></div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-col>
    </el-row>
    <template v-if="showMarkdownEditor == true">
        <el-row :gutter="20">
        <mavonEditor :value="markdownText" @change="update" />
        </el-row>
    </template>
     <el-dialog title="选择文档模板" :visible.sync="dialogFormVisible">
        <div style="padding:10px 20px;">
            文档模板：
            <el-select v-model="selectTemplate" placeholder="请选择">
                <el-option
                v-for="item in markdownTemplate"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="formatMarkdown">确 定</el-button>
        </div>
    </el-dialog> 
    </div>
</template>
<style>
</style>
<script>
let qs = require('qs');
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    name: 'auto',
    data() {
        return {
            menuData: [],
            method: 'get',
            baseUri: '',
            uri: '',
            response: '',
            responseData: [],
            defaultContentType: '',
            markdownTemplate: {},
            selectTemplate: 'API.md',
            markdownText: '',
            disabledMarkdown: true,
            showMarkdownEditor: false,
            dialogFormVisible: false,
            form: {
                headers: [
                ],
                body: [
                ],
                contentType: [
                    'x-www-form-urlencoded',
                    'form-data',
                    'json'
                ]
            },
            menuList: {},
            selectedMenu: ''
        }
    },
    computed: {
        compiledMarkdown: function () {
            return marked(this.markdownText , { sanitize: true })
        }
    },
    mounted() {
        this.initMenu();
    },
    methods: {
        initMenu() {
            let _this = this;
            _this.$http.get('static/data/template.json').then(function(resp){
                _this.menuList = resp.data;
            }).catch(function(err){
                _this.$notify({
                    title: '读取JSON目录列表失败',
                    message: '',
                    type: 'warning'
                });
            });
        },
        buildMenu(key) {
            let _this = this;
            let item = _this.menuList[key];
            _this.$http.get('static/data/'+item.path).then(function(resp){
                _this.menuData = resp.data.menu;
                _this.baseUri = resp.data.baseUri;
            }).catch(function(err){
                _this.$notify({
                    title: '读取模板JSON失败',
                    message: '',
                    type: 'warning'
                });
            });
        },
        buildView(jsonFile) {
            let _this = this;
            let baseMenu = _this.menuList[_this.selectedMenu].baseMenu;
            _this.$http.get('static/data'+baseMenu+jsonFile).then(function(resp){
                let _resp = resp.data;
                let replaces = _this.$store.state.replaces;
                _this.uri = _this.baseUri+_resp.uri;
                _this.method = _resp.method;
                _this.defaultContentType = _resp.contentType;
                // 遍历store里的state
                for (let i in replaces) {
                    if (replaces[i].type == 'body') {
                        for (let body_i in _resp.body) {
                            if(_resp.body[body_i].key == replaces[i].key) {
                                _resp.body[body_i].value = replaces[i].value;
                            }
                        }
                    } else {
                        for (let header_i in _resp.headers) {
                            if(_resp.headers[header_i].key == replaces[i].key) {
                                _resp.headers[header_i].value = replaces[i].value;
                            }
                        }
                    }
                }
                _this.form.headers = _resp.headers;
                _this.form.body = _resp.body;
            }).catch(function(err){
                _this.$notify({
                    title: '读取数据JSON失败',
                    message: '',
                    type: 'warning'
                });
            });
        },
        handleNodeClick(data) {
            if (typeof(data.path) != 'undefined') {
                this.buildView(data.path);
            }
        },
        addHeaders() {
        	this.form.headers.push({
            	key: "",
                value: ""
            })
        },
        deleteHeaders(item) {
            let index = this.form.headers.indexOf(item);
        	this.form.headers.splice(index, 1)
        },
        addBody() {
        	this.form.body.push({
            	key: "",
                value: ""
            })
        },
        deleteBody(item) {
            let index = this.form.body.indexOf(item);
        	this.form.body.splice(index, 1)
        },
        http() {
            var _this = this;
            _this.response = '正在请求中..';
            _this.showMarkdownEditor = false;
            _this.disabledMarkdown = true;
            if ( _this.method == 'get' || _this.method == 'delete') {
                _this.$http({
                    method: _this.method,
                    url: _this.uri + _this.buildParams(),
                    headers: _this.buildJson(true),
                }).then(function(resp){
                    _this.response = JSON.stringify(resp.data, null , 4);
                    _this.disabledMarkdown = false;
                }).catch(function(error){
                    if (error.response) {
                        _this.$notify.error({
                            title: '状态：'+error.response.status,
                            message: '',
                        });
                        _this.response = error.response.data;
                    } else {
                        _this.$notify.error({
                            title: error.message,
                            message: '',
                        });
                        _this.response = error.message;
                        console.log('Error', error.message);
                    }
                });
            } else {
                _this.$http({
                    method: _this.method,
                    url: _this.uri,
                    headers: _this.buildJson(true),
                    data: qs.stringify(_this.buildJson()),
                }).then(function(resp){
                    _this.response = JSON.stringify(resp.data, null , 4);
                    _this.disabledMarkdown = false;
                }).catch(function(error){
                    if (error.response) {
                        _this.$notify.error({
                            title: '状态：'+error.response.status,
                            message: '',
                        });
                        _this.response = error.response.data;
                    } else {
                        _this.$notify.error({
                            title: error.message,
                            message: '',
                        });
                        _this.response = error.message;
                        console.log('Error', error.message);
                    }
                });
            }
        },
        buildParams() {
            let param = '?';
            for ( let index in this.form.body ) {
                param += this.form.body[index].key + '=' + this.form.body[index].value + '&';
            }
            return param.substring(0,param.length - 1);
        },
        buildJson(isHeader = false) {
            let _this = this;
            let json = {};
            if ( isHeader == true) {
                for ( let index in _this.form.headers ) {
                    if (_this.form.headers[index].key != '') {
                        json[_this.form.headers[index].key] = _this.form.headers[index].value;
                    }
                }
                json['Content-Type'] = 'application/' + _this.defaultContentType;
            } else {
                for ( let index in _this.form.body ) {
                    if (_this.form.body[index].key != '') {
                        json[_this.form.body[index].key] = _this.form.body[index].value;
                    }
                }
            }
            return json;
        },
        readJson() {
            let _this = this;
            _this.$http.get('static/template/template.json').then(function(resp){
                _this.markdownTemplate = resp.data.file;
            }).catch(function(err){
                _this.$notify({
                    title: '读取模板JSON失败',
                    message: '',
                    type: 'warning'
                });
            });
        },
        readMarkdown() {
            let _this = this;
            _this.$http.get('static/template/'+_this.selectTemplate).then(function(resp){
                _this.markdownText = resp.data;
                _this.markdownText = _this.markdownText.replace('{{$uri}}', _this.uri);
                _this.markdownText = _this.markdownText.replace('{{$method}}', _this.method);
                _this.markdownText = _this.markdownText.replace('{{$request}}', function(){
                    let request = '';
                    for (let index in _this.form.body) {
                        request += '|'+_this.form.body[index].key+'|-|String|Y|-|\n';
                    }
                    return request;
                });
                _this.markdownText = _this.markdownText.replace('{{$response}}', _this.response);
                // _this.markdownText = _this.markdownText.replace('{{$result}}', function(){
                //     let result = '';
                //     let json = JSON.parse(_this.response);
                //     for ( let index in json ) {
                //         result += '|'+index+'|-|'+typeof(json[index])+'|Y|-|\n';
                //     }
                //     return result;
                // });
                _this.markdownText = _this.markdownText.replace('{{$result}}', function(){
                    let result = '';
                    let json = _this.cycleReadJson(JSON.parse(_this.response));
                    for (let index in json) {
                        result += '|'+json[index].key+'|-|'+json[index].type+'|Y|-|\n';
                    }
                    return result;
                });
                
            }).catch(function(err){

            });
        },
        update(e) {
            this.markdownText = e.target.value
        },
        formatMarkdown() {
            this.dialogFormVisible = false
            this.readMarkdown();
            this.showMarkdownEditor = true;
            this.disabledMarkdown = true;
        },
        setMarkdown() {
            this.readJson();
            this.dialogFormVisible = true;
        },
        cycleReadJson(json) { 
            let _this = this;
            let type = typeof(json);
            if (type != 'undefined') {
                for (let key in json) {
                    let keyType = typeof(json[key]);
                    if (keyType == 'undefined' || keyType == 'function') {
                        continue;
                    } else if (keyType == 'object') {
                        _this.responseData.push({
                            key: key,
                            value: json[key],
                            type: keyType
                        })
                        _this.cycleReadJson(json[key]);
                    } else {
                        console.log({
                            key: key,
                            value: json[key],
                            type: keyType
                        });
                        _this.responseData.push({
                            key: key,
                            value: json[key],
                            type: keyType
                        })
                    }
                }
                return _this.responseData;
            }
        }
    },
    components: {
        mavonEditor
    }
}
</script>