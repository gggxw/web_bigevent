// 每次调用ajax请求之前先调用这个函数，拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
        // console.log(options.url);
        // 统一给有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局挂载complete回调函数
    options.complete = function(res) {
        // complete回调函数中使用res.responseJSON拿到服务器相应回来的数据
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空本地存储
            localStorage.removeItem('token');
            // 跳转到登陆页面
            location.href = '/第四阶段/第四节 大事件/code/login.html'
        }
    }

})