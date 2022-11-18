$(function() {
    // 点击去注册账号链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击去登陆链接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    // 自定义正则校验
    // 1 从layui中获取form对象
    let form = layui.form;
    let layer = layui.layer;
    // 2 自定义正则校验
    form.verify({
        // 密码必须6到12位，且不能出现空格
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 两次密码一致
        // 通过形参拿到确认密码框的值，在拿到密码框的值，进行判断，失败返回消息
        repsd: function(val) {
            let value = $('.reg-box .psd').val();
            if (val !== value) {
                return '两次密码不一致'
            }
        }
    });
    // 注册信息 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            // 阻止默认提交行为
            e.preventDefault();
            // 发起ajax的post请求
            $.ajax({
                type: 'POST',
                url: '/api/reguser',
                data: {
                    username: $('#form_reg [name=username]').val(),
                    password: $('#form_reg [name=password]').val()
                },
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);

                    }
                    layer.msg('注册成功，请登录');
                    $('#link_login').click();
                }
            })
        })
        // 登录 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起ajax的post请求
        $.ajax({
            type: 'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败');

                }
                layer.msg('登陆成功');
                // 把登录成功得到的token字符串，存储到localStorage中
                localStorage.setItem('token', res.token);
                location.href = '/index.html'
            }
        })
    })
})