import Router from 'vue-router'
//事件列表

export default function (paramname){
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
        push.call(this, location, onComplete, onAbort)
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
        replace.call(this, location, onComplete, onAbort)
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

}




