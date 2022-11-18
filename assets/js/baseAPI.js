// 每次调用ajax请求之前先调用这个函数，拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
})