$(function() {
    // 调用获取用户的基本信息函数
    getUserInfo();
    let layer = layui.layer;
    // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function() {
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 清除本地存储
            localStorage.removeItem('token');
            // 跳转页面
            location.href = '/第四阶段/第四节 大事件/code/login.html'
                // 关闭询问框
            layer.close(index);
        });
    })

});
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('请求失败')
            }
            // 调用渲染用户头像函数
            renderAvatar(res.data);
        },
        /* complete: function(res) {
            // console.log(res);
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 清空本地存储
                localStorage.removeItem('token');
                // 跳转到登陆页面
                location.href = '/第四阶段/第四节 大事件/code/login.html'
            }
        } */
    })
};
// 渲染用户头像函数
function renderAvatar(user) {
    // 获取用户名称
    let name = user.nickname || user.username;
    // 设置欢迎文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 按需渲染头像
    if (user.user_pic !== null) {
        // 头像
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show();
    } else {
        // 文字头像
        $('.layui-nav-img').hide();
        // toUpperCase()转大写
        let test = name[0].toUpperCase();
        $('.text-avatar').html(test).show();
    }
}