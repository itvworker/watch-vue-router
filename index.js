import Router from 'vue-router'
//事件列表

let router = []
let nowIndex = 0;
let urlname = '';


function getIndex(value) {
    let index = null;
    for(let i = 0, l = router.length; i < l; i++) {
        if(router[i].query[urlname] == value) {
            index = i;
        }
    }
    return index;
}



function pushRouter(temp, value) {
    let index = null
    if(temp){
        index = getIndex(temp)
    }else{
        router = router.splice(0, 1)
    }
    
    if(index !== null){
       router = router.splice(0, index+1)
    }
    
    let obj= {
        name:  value.name,
        query: value.query,
        meta: value.meta,
        path: value.path,
        fullPath: value.fullPath
    }
    router.push(obj)
    sessionStorage.setItem(urlname, JSON.stringify(router))
}


function replaceRouter(temp, value) {
    
    if(router.length<=1) {
        router[0] = {
            name:  value.name,
            query: value.query,
            meta: value.meta,
            path: value.path,
            fullPath: value.fullPath
        }
        return
    }

    let index = getIndex(temp)
   router = router.splice(0, index)
    let obj= {
        name:  value.name,
        query: value.query,
        meta: value.meta,
        path: value.path,
        fullPath: value.fullPath
    }
    router.push(obj)
    sessionStorage.setItem(urlname, JSON.stringify(router))
}




export default function (paramname){
   urlname = paramname
   let arr = sessionStorage.getItem(urlname) 
   if(arr) {
       router = JSON.parse(arr);
   }
    Router.events = [];
    //监听事件
    Router.$on = function(event, obj) {
        Router.events.push({
            name: event,
            fun: obj
        })
    } 

    //移除事件
    Router.$off = function(event, obj) {
        for(let i = 0, l = Router.events.length; i < l; i++) {
            if(Router.events[i].name===event && obj===Router.events[i].fun) {
                Router.events.splice(i, 1)    
                break
            }
        }
    } 


    //监听$router.push方法
    let push = Router.prototype.push;  
    Router.prototype.push =  function(location, onComplete, onAbort) {
        
        if(typeof location==='string') {
            location = {
                path: location,
                query:{}
            }
        }else{
            location.query = location.query || {};
            
        }
        location.query[paramname] = new Date().getTime()

        
        let up = this.app.$route;
        if(router.length<=0) {
            let obj= {
                name: up.name,
                query: up.query,
                meta: up.meta,
                path: up.path,
                fullPath: up.fullPath
            }
            router.push(obj);
        }
        
        function finish(value) {
            pushRouter(up.query[paramname], value)
            if(onComplete) {
                onComplete(value)
            }
        }

        
        push.call(this, location, finish, onAbort)

        Router.events.forEach(element => {
            let arr = element.name.split(' ');
            if(arr.indexOf('push')>=0) {
                element.fun(location, 'push')
            }    
        });
    }

    //监听$router.go方法
    let go = Router.prototype.go;  
    Router.prototype.go =  function(n) {
        go.call(this, n)
        Router.events.forEach(element => {
            let arr = element.name.split(' ');
            if(arr.indexOf('go')>=0) {
                element.fun(n, 'go')
            }    
        });
    }

    //监听$router.replace方法
    let replace = Router.prototype.replace;  
    Router.prototype.replace =  function(location, onComplete, onAbort) {
        if(typeof location==='string') {
            location = {
                path: location,
                query:{}
            }
        }else{
            location.query = location.query || {};
        }
        location.query[paramname] = new Date().getTime()

        let up = this.app.$route;
        if(router.length<=0) {
            let obj= {
                name: up.name,
                query: up.query,
                meta: up.meta,
                path: up.path,
                fullPath: up.fullPath
            }
            router.push(obj);
        }

        function finish(value) {
            replaceRouter(up.query[paramname], value);
            if(onComplete) {
                onComplete(value)
            }
        }

        replace.call(this, location, finish, onAbort)
        Router.events.forEach(element => {
            let arr = element.name.split(' ');
            if(arr.indexOf('replace')>=0) {
                element.fun(n, 'replace')
            }    
        });
    }

    //监听$router.back方法
    let back = Router.prototype.back;  
    Router.prototype.back =  function() {
        back.call(this)
        Router.events.forEach(element => {
            let arr = element.name.split(' ');
            if(arr.indexOf('back')>=0) {
                element.fun('back', 'back')
            }    
        });
    }

    //监听$router.forward方法
    let forward = Router.prototype.forward;  
    Router.prototype.forward =  function() {
        forward.call(this)
        Router.events.forEach(element => {
            let arr = element.name.split(' ');
            if(arr.indexOf('forward')>=0) {
                element.fun('forwar', 'forward')
            }    
        });
    }

    /**
     * @description 后退指定路由
     * @param {Array|String} value 路由名称  home:-1
     */
    Router.prototype.backRouteName = function(value){
        let isarr = Array.isArray(value)
        let temp = this.app.$route.query[urlname];
        let index = getIndex(temp); 
        let goIndex = 0; 
        for(let i = index-1; i>=0; i--) {
            goIndex += -1;
            let isBreak = false;
            if(isarr) {
                value.forEach((item)=>{
                    //拆分参数
                    let names = item.split(':')
                    //判断是否找到相路由
                    if( names[0] == router[i].name) {
                        isBreak = true; //跳出for
                        if(names.length>=2) { //是否有参数
                            //是否有第二个参数
                            if(names[2] && names[2] === 'same') {
                                    if(router[i+parseInt(names[1])].name === names[0]) {
                                        goIndex+= parseInt(names[1])
                                    }
                            }else{
                                goIndex+= parseInt(names[1])
                            }   
                        }
                        
                    }
                })
            }else{
                let names = value.split(':')
                if(router[i].name == names[0]) {
                    isBreak = true;
                    if(names.length>=2) { //是否有参数
                        //是否有第二个参数
                        if(names[2] && names[2] === 'same') {
                           
                                if(router[i+parseInt(names[1])].name === names[0]) {
                                    goIndex+= parseInt(names[1])
                                }
                        }else{
                            goIndex+= parseInt(names[1])
                        }   
                    }
                }
            }
            if(isBreak) {
                break;
            }
        }
        if(goIndex!==0) {
            this.app.$router.go(goIndex)
        }
    }
}




