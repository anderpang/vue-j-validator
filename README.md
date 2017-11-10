# vue-j-validator

vue2.X 表单验证，简单易用。本来是自写的原生验证代码，稍作修改后成为vue验证插件。

## npm

```bash

$ npm install vue-j-validator

```

## Options


| Option                  | Purpose                                                                                                                                                                                                                                                                                                                         |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| defaultMessage             | Object,设置全局默认提示文字{required:"","select-required":"","pattern":"","type":""}   |
| focus                       | Boolean，出错后表单元素获取焦点  |
| callback                    | Function，自定义输出错误提示，其有两参数，1、错误信息；2、错误源(dom表单)。默认错误输出为span.valid-msg标签输出 |

## Usage

#### main.js
```javascript
  import Vue from "vue";
  import validator from "vue-j-validator";

  Vue.use(validator);

  //<form v-valid="">
```
带选项
```javascript
  import Vue from "vue";
  import validator from "vue-j-validator";

  var options={
            callback:function(err,el){
                if(err){
                    alert(err);   //或其它弹层插件，如layer.alert(err)
                    el.focus();
                }
            }
      };

  Vue.use(validator,options);

  //<form v-valid="提交函数">
```



#### Example

```javascript
<template>
  <form v-valid.prevent="submit"> 
    <div>有并且“只有一个”prevent修饰符，submit为最后提交的方法</div>
    <p>姓名<input type="text" required pattern=".{1,4}" data-required="请填写姓名" data-pattern="你的姓能超过4个字！！！" /></p>
    <div>data-为自定义错误信息</div>
	<p>年龄<input type="text" required pattern="\d+" data-pattern="要填数字啊！！！" /></p>
	<p>h5验证邮箱<input type="email" data-type="邮箱！邮箱！邮箱！" />(IE9不行）</p>
	<p>邮箱<input type="email" pattern="\w+(?:\.\w+)*@\w+(?:\.\w+)+" data-pattern="正则邮箱验证出错！" />(兼容IE9，必须得正则）</p>
	<p>
	   性别<select name="sex" required data-required="别闹！快选！">
	     <option value="">性别 </option>
		 <option value="0">男</option>
		 <option value="1">女</option>
	   </select>
    </p>
	<p>输入密码：<input type="password" v-model="pwd" required pattern="[\x00-\xff]{6,}" @change="comparePwd" ref="pwd" /></p>
	<p>核对密码：<input type="password" v-model="repwd" required pattern="[\x00-\xff]{6,}" @change="comparePwd" /></p>
	<p>单选一<input type="radio" name="aa" value="" /></p>
  <p>单选二<input type="radio" name="aa" value="" required />radio随便加一个required即可，全加也行</p>

	<p>多选一<input type="checkbox" name="bb" value="" required /><br />
     多选二<input type="checkbox" name="bb" value="" required /></p>
	<p><input type="submit" value="提交" /></p>
  </form>
</template>

<script>
export default {
    data () {
        return {
        pwd:'',
        repwd:''
        }
    },

    methods:{
        comparePwd(){
            if(this.repwd&&this.pwd){
                if(this.pwd===this.repwd){
                    this.$refs.pwd.setMessage("");
                }
                else
                {
                    this.$refs.pwd.setMessage("两次密码不一致！");
                }
            }
        },
        submit(){
            console.log("submit");
            console.log(this.pwd);
        }
    }
}
</script>
```
