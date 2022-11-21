$(function() {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }

    });
    initUserInfo();
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户基本信息失败！')
                }
                console.log(res);
                // 为表单快速赋值
                form.val("formUserInfo", res.data)
            }
        })
    }
    // 表单重置
    $('#btnReset').on('click', function(e) {
        // 阻止表单重置默认事件
        e.preventDefault();
        initUserInfo();
    });
    // 表单提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交事件
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
                    // 调用父页面的方法，重新渲染用户名称头像
                window.parent.getUserInfo();
            }
        })
    })
})