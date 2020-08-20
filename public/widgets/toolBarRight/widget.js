/* 2017-12-5 14:28:44 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
// 此方式：弹窗非iframe模式
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
  options: {
    resources: ['view.css'],
    view: [
      { type: 'append', url: 'view.html', parent: '#centerDiv' }
    ]
  },
  // 此数据也可以放在widget.json的配置中，但是发现很多人容易引起同名误解，所以还是放在这里
  data: [
    // { "name": "漫游", "icon": "fa fa-globe", "onclick": "mars3d.widget.disableAll()", "visible": false },
    { name: '底图', icon: 'fa fa-map', widget: 'widgets/manageBasemaps/widget.js' },
    { name: '图层', icon: 'fa fa-tasks', widget: 'widgets/manageLayers/widget.js' },
    {
      name: '工具',
      icon: 'fa fa-cubes',
      children: [
        { name: '图上量算', icon: 'fa fa-calculator', widget: 'widgets/measure/widget.js' },
        { name: '空间分析', icon: 'fa fa-bar-chart', widget: 'widgets/analysis/widget.js' },
        { name: 'plot-model', icon: 'fa fa-map-pin', widget: 'widgets/plot-model/widget.js' },
        { name: '粒子效果', icon: 'fa fa-map-pin', widget: 'widgetsTS/particalSystem/widget.js' },
        { name: '坐标定位', icon: 'fa fa-map-pin', widget: 'widgets/centerXY/widget.js' },
        { name: '地区导航', icon: 'fa fa-paper-plane', widget: 'widgets/navXZQH/widget.js' },
        { name: '我的标记', icon: 'fa fa-edit', widget: 'widgets/addmarker/widget.js' },
        { name: '视角书签', icon: 'fa fa-tags', widget: 'widgets/bookmark/widget.js' },

        { name: '分屏对比', icon: 'fa fa-window-restore', widget: 'widgets/mapCompare/widget.js' },
        { name: '卷帘对比', icon: 'fa fa-columns', widget: 'widgets/mapSwipe/widget.js' },

        { name: '图上标绘', icon: 'fa fa-object-group', widget: 'widgets/plot/widget.js' },

        { name: '飞行漫游', icon: 'fa fa-send-o', widget: 'widgets/roamLine/widget.js' },
        { name: '路线导航', icon: 'fa fa-level-up', widget: 'widgets/queryRoute/widget.js' },
        { name: '地图打印', icon: 'fa fa-print', widget: 'widgets/print/widget.js' },
        { name: '百度街景', icon: 'fa fa-street-view', widget: 'widgets/streetscape/widget.js' },
        { name: '分享地图', icon: 'fa fa-share', widget: 'widgets/shareUrl/widget.js' },
        { name: '参数设置', icon: 'fa fa-cog', widget: 'widgets/setting/widget.js' }
      ]
    }
  ],
  // 初始化[仅执行1次]
  create() {

  },
  // 每个窗口创建完成后调用
  winCreateOK(viewopt, html) {
    if (viewopt.type != 'append') return;

    const arr = this.config.data || this.data;

    // 移动设备上，处理下菜单层次
    if (!haoutil.system.isPCBroswer()
            && arr.length == 3 && arr[0].children) {
      const item1 = arr.shift();
      const item2 = arr.shift();
      arr[0].children.insert(item2, 0);
      arr[0].children.insert(item1, 0);
    }

    this.initMenu(arr);
  },
  // 构造 菜单
  initMenu(arr) {
    const widgetObj = {};

    let inhtml = '';
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      if (item.hasOwnProperty('visible') && !item.visible) continue;
      if (item.children) { // 分组
        inhtml += `<div class="btn-group">\
                                <button type="button" class="btn btn-link toolBarRight-btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">\
                                    <i class="${item.icon}"></i>${item.name} <span class="caret"></span>\
                                </button>\
                                <ul class="dropdown-menu dropdown-menu-right toolBarRight-dropdown-menu" >`;
        for (let j = 0, jlen = item.children.length; j < jlen; j++) {
          const children_item = item.children[j];
          if (children_item.hasOwnProperty('visible') && !children_item.visible) continue;

          var ex = '';
          if (children_item.onclick) { ex = `onclick="${children_item.onclick}"`; } else if (children_item.widget) { ex = `data-widget="${children_item.widget}"`; }

          inhtml += `<li class="widget-btn" ${ex}><a href="javascript:void(0)"><i class="${children_item.icon}"></i>${children_item.name}</a></li>`;
          widgetObj[children_item.widget] = children_item;
        }
        inhtml += ' </ul></div>';
      } else { // 不是分组
        var ex = '';
        if (item.onclick) { ex = `onclick="${item.onclick}"`; } else if (item.widget) { ex = `data-widget="${item.widget}"`; }

        inhtml += `<button type="button" class="widget-btn btn btn-link toolBarRight-btn " ${ex}>\
                            <i class="${item.icon}"></i>${item.name}\
                        </button>`;
        widgetObj[item.widget] = item;
      }
    }
    $('.toolBarRight').html(inhtml);

    $('.toolBarRight .widget-btn').click(function () {
      const uri = $(this).attr('data-widget');
      if (haoutil.isutil.isNull(uri)) return;

      console.log(`单击了工具栏：${uri}`);

      if (mars3d.widget.isActivate(uri)) {
        mars3d.widget.disable(uri);
      } else {
        const opt = widgetObj[uri] || {};
        opt.uri = uri;

        mars3d.widget.activate(opt);
      }
    });
  },

  // 激活插件
  activate() {

  },
  // 释放插件
  disable() {

  }

}));