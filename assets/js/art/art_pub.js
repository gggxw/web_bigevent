$(function() {
    initCate();
    // 初始化富文本编辑器
    initEditor()
        // 获取文章类别
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败！')
                }
                let htmlStr = template('art_cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 重新渲染
                layui.form.render();
            }
        })
    };
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 为选择封面的按钮，绑定点击事件
    $('.btn-file').on('click', function() {
        $('#file').click();
    });
    // 监听#file的change事件，获取用户选择的文件列表
    $('#file').on('change', function(e) {
        let file = e.target.files[0];
        // 判断用户是否选择了文件
        if (file.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(file);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 定义文章的状态
    let art_state = '已发布';
    // 为存为草稿绑定点击事件
    $('#btnSeve2').on('click', function() {
        art_state = '草稿';
    });
    // 为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 基于form表单，快速创建FormData对象
        let fd = new FormData($(this)[0]);
        // 将文章状态存到fd中
        fd.append('state', art_state);
        // 将裁剪完的封面输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到fd中
                fd.append('cover_img', blob);
                // 发起ajax数据请求，将数据提交到服务器
                console.log(fd);
                publiahArticle(fd);

            })
    });
    // 定义发表文章的方法
    function publiahArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是FormData格式的数据，必须添加一下两个配置项
            // contenType: false,
            // processData: false,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('发布文章失败！')
                }
                layui.layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '../art/art_list.html'
            }
        })
    }
})