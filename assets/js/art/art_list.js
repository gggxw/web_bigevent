$(function() {
    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, //页码值，默认请求第一页数据
        pagesize: 2, //每页显示几条数据，默认每页显示两条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    };
    // 定义时间过滤器，美化时间
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        const y = dt.getFullYear()
        const m = padZero(dt.getMonth() + 1)
        const d = padZero(dt.getDate())

        const hh = padZero(dt.getHours())
        const mm = padZero(dt.getMinutes())
        const ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable();
    initCate();
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败！')
                }
                console.log(res);
                // 使用模板引擎渲染页面数据
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页方法
                renderPage(res.total);
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败！')
                }
                let htmlStr = template('cateList', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单区的ui结构
                layui.form.render();
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // 为查群参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染列表
        initTable();

    });
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render方法渲染分页
        layui.laypage.render({
            elem: 'pageBox', //存放分页的容器
            count: total, //数据总数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页切换时，触发jump回调函数
            // 触发jump 两种方式：
            // 1.点击页码
            // 2.调用laypage.render（）方法
            // 可以通过first值来判断是通过那种方式触发的jump回调函数
            // 如果first值为true，是方式二触发的
            // 否则就是方式一触发的
            jump: function(obj, first) {
                //得到最新的页码值，赋值给q查询参数对象中
                q.pagenum = obj.curr;
                // 得到最新的条目数，赋值给q
                q.pagesize = obj.limit;
                //首次不执行,防止死循环
                if (!first) {
                    //根据最新 q ，获取对应数据列表，重新渲染页面列表
                    initTable();
                }
            }
        });
    }
    // 通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-del', function() {
        // 获取页面上删除按钮个数
        let len = $('.btn-del').length;
        // 获取当前id值
        let id = $(this).attr('data-id');
        // 弹出层询问用户
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.lyaer.msg('删除失败！')
                    }
                    layui.layer.msg('删除成功！');
                    // 当删除数据完成时，先判断当前页是否还有数据
                    // 如果没有数据，让页码值-1
                    // 重新调用initTable方法
                    if (len === 1) {
                        // 如果len等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 注意：页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
            layer.close(index);
        });


    })

})