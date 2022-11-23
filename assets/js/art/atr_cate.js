$(function() {
    getAtrList();
    // 获取文章分类列表
    function getAtrList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    };
    // 为添加类别按钮绑定点击事件
    let cateAddIndex = null;
    $('#btnAddCate').on('click', function() {
        cateAddIndex = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#addCateList').html()
        });
    });
    // 以代理的形式为表单添加submit事件
    $('body').on('submit', "#addCate", function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('新增文章分类失败！')
                }
                getAtrList();
                layui.layer.msg('新增文章分类成功！');
                layer.close(cateAddIndex);
            }
        })
    });
    // 以代理的形式为编辑按钮添加点击事件
    let cateEditIndex = null;
    $('tbody').on('click', '.editCate', function() {
        cateEditIndex = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#editCateList').html()
        });
        let id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                layui.form.val('editCate', res.data);
            }
        })
    });
    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#editCate', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类信息失败！')
                }
                layui.layer.msg('更新分类信息成功！');
                layui.layer.close(cateEditIndex);
                getAtrList();
            }
        })
    });
    //  以代理的形式为删除按钮添加点击事件
    $('tbody').on('click', '.dleCate', function() {
        let id = $(this).attr('data-id');
        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章分类失败！')
                    }
                    layui.layer.msg('删除文章分类成功！');
                    getAtrList();
                    layer.close(index);
                }
            })
        });
    })
})