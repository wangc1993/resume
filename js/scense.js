/*
* @Author: wc
* @Date:   2017-12-28 09:51:30
* @Last Modified time: 2017-12-28 10:58:31
*/

'use strict';

/*全局变量*/
var scenseHorizontal = $$.$all('.layer-horizontal')[0];
var cloud = $$.$all('.cloud',scenseHorizontal)[0];
var mountain = $$.$all('.mountain',scenseHorizontal)[0];

/*场景对象*/
var scense = {
    /*计算场景的宽度*/
    computeWidth: function(){
        /*这种方式取不到：console.log(scenseHorizontal.style.width);*/
        return $$.Width(scenseHorizontal) +'px';
    },
    /*背景移动层次感*/
    move: function(curPos){
        var curPos = -parseInt(curPos);
        /*整体向左移动*/
        $$.css(scenseHorizontal,'left',curPos + 'px')
        /*scenseHorizontal.style.left = -parseInt(curPos) + 'px';*/
        // 云更远，因此只移动 1 - 0.95 = 0.05
        $$.css(cloud,'left',-curPos * 0.95 + 'px');
        // // 山比较远，因此只移动 1 - 0.75 = 0.25
        $$.css(mountain,'left',-100 - curPos * 0.75 + 'px');
    }
}