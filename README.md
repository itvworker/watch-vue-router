# watch-vue-router
watch-vue-router,是一个扩展vue-router方法的插件，可以在头部添中一个时间戳的参数，也可以监听vue-router路由是否调用了go,push,replace, forward, back方法

### contact
email: xieke76@qq.com


## Usage

```javascrit
import watch from 'watch-vue-router'; //在入口处引入，要在vue-router之前引入
watch('urltime') //参数为时间参数的参数名字


```


### 在vue文件中使用

```html
<template>

<template>
<script>
import Router from 'vue-router'
export defualt {
    watch: {
        $route(to, from) {
            let now = parseInt(to.query.urltime)
            let old = parseInt(from.query.urltime)
            
            if(now > old) { //前进
                //....
                return
            }
            //返之后退
        }
    },
    methods: {
        watchrouter(value,eventname) {
            //value为url参数，即push,repalce的参数传过来的url参数, 没有参返回方法名
            //eventname 为方法名：push go back forward replace
        }
    },
    mounted() {
        //可监听多个方法，也可以监听一个
        Router.$on('push go back forward', this.watchrouter)

        //删除监听
        Router.$on('push go back forward', this.watchrouter)


    }
}
</script>
```

