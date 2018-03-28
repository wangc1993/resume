/*
* @Author: wc
* @Date:   2017-12-27 17:12:16
* @Last Modified time: 2017-12-29 10:18:25
*/

'use strict';

/*移动简历*/
/*全局变量*/
var loading = document.querySelectorAll('.loading')[0];
var intro = document.querySelectorAll('.introduce')[0];
var containerPage = document.querySelectorAll('#page');

var images = [
  './images/people.png',
  './images/mountain.png',
  './images/cloud.png',
  './images/background.png',
  './images/pipe.png',
  './images/trees.png',
  './images/project.png',
  'https://p.qpic.cn/qqconadmin/0/5f0034fb4ebb4bc4b7fd44acc087c61b/0',
  'https://p.qpic.cn/qqconadmin/0/0ae6340cbf0243b0be1784d5746e22cd/0?tp=webp',
  'https://p.qpic.cn/qqconadmin/0/2739451893134a1cbb300dd2e52083be/0?tp=webp'
];

/*简历对象*/
var resume = {
    /*初始化*/
    init: function(){
        var self = this;
        /*初始化任务对象*/
        me.init()
        /*页面滚动开始*/
        $$.wScrollTop(0);
        resourceHelper.load(images, function(result){
            loading.style.display = 'none';
            /*去除loading*/
            /*$$.animate.add('loading',{zIndex:9},500,function(){
                loading.style.display = 'none';
            });*/
            /*绑定事件*/
            self.bindEvent();
        });
    },
    /*绑定事件*/
    bindEvent: function(){
        /*出现滚动条*/
        $$.on('js-start-resume','click',function(){
            intro.style.display = 'none';
            $$.css(containerPage,'height',scense.computeWidth());
        });
        /*监听滚动事件*/
        var self = this;
        /*当前位置*/
        var curPosition = 0;
        /*先前位置*/
        var prePosition = 0;

        window.onscroll = function(e){
            /*获取当前页面的滚动位置*/
            curPosition = $$.wScrollTop();
            /*计算移动距离*/
            var distance = parseInt(curPosition) - parseInt(prePosition);

            /*背景移动*/
            scense.move(curPosition);

            /*更新人物状态*/
            me.setDirection(distance);

            /*判断障碍物*/
            me.checkJump(parseInt(curPosition),parseInt(prePosition));

            /*人物walk*/
            me.walk();

            /*更新之前位置*/
            prePosition = curPosition;
        }
    }
}

/*页面初始化*/
resume.init();