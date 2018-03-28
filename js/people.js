/*
* @Author: wc
* @Date:   2017-12-28 12:00:54
* @Last Modified time: 2017-12-28 17:38:11
*/

'use strict';

/*全局变量*/
var peopleContainer = $$.$id('people-container');
var $peopleContainer = $('#people-container');
var people = $$.$all('.people');
var block = $$.$all('.block');
/*容器高度*/
var contentHeight = document.documentElement.clientHeight;

/*动作常量*/
var actionFranme = {
    normal: 0,
    walk: 1,
    stand: 2,
    jump: 3,
};

/*人物*/
var me = {
    init: function(){
        /*初始方向*/
        this.direction = 'right';
        /*每个动作图片的尺寸*/
        this.oneFrameSize = 200;
        /*每个动作的间隔*/
        this.oneFrameDuration = 200;
        /*移动标志*/
        var isMoving = false;
        /*jump标志*/
        var isJumping = false;
        /*定时器*/
        var shiftFrameTimer = '';
        /*跳跃高度*/
        this.jumpBuffer = 150;
        /*人物距离底部距离*/
        this.peopleBottomEdge = 70;
        /*人物左边距离边界距离*/
        this.peopleLeftEdge = 80;
        /*人物右边距离边界距离*/
        this.peopleRightEdge = 150;
    },
    /*更新方向*/
    setDirection: function(distance){
        if(distance > 0){
            this.direction = 'right';
            $$.css(people,'top','0');
        }else if(distance < 0){
            this.direction = 'left';
            $$.css(people,'top','-200px');
        }
    },
    /*设置帧图片*/
    setFrame: function(action){
        var nextFrameLeft = -actionFranme[action] * this.oneFrameSize;
        $$.css(people,'left',nextFrameLeft + 'px');
    },
    /*切换动作帧*/
    switchFrames: function(frames,callback){
        var self = this;
        /*判断有无下一帧*/
        if(frames.length === 0 || !frames[0]){
            callback();
            return;
        }
        /*有下一帧*/
        var nextAction = frames.shift();//shift删除数组第一个，并返回第一个
        self.setFrame(nextAction);
        /*间隔后。切换下一帧*/
        self.shiftFrameTimer = setTimeout(function(){
            self.switchFrames(frames,callback);
        },self.oneFrameDuration);
    },
    /*人物行走*/
    walk: function(){
        var self = this;
        /*如果已经在移动，则不walk*/
        if(self.isMoving || self.isJumping){
            return;
        }
        this.isMoving = true;
        /*设置一帧动作*/
        var nextFrames = ['normal','walk','stand'];
        this.switchFrames(nextFrames,function(){
            self.isMoving = false;
        });
    },
    /*判断是否接触到障碍物*/
    checkJump: function(curPosition,prePosition){
        var self = this;
        /*遍历所有障碍物*/
        for(var i=0,len = block.length; i<len; i++){
            var item = block[i];
            /*获取元素的位置*/
            var itemX = item.offsetLeft;
            var itemWidth = item.offsetWidth;

            /*判断是否碰撞*/
            var rightNeedJump = (prePosition + self.peopleRightEdge <= itemX) && (curPosition + self.peopleRightEdge > itemX);
            var leftNeedJump = (prePosition + self.peopleLeftEdge >= itemX + itemWidth) && (curPosition + self.peopleLeftEdge < itemX + itemWidth);

            /*如果需要跳跃*/
            if(rightNeedJump || leftNeedJump){
                var needDownBlock = (curPosition + self.peopleRightEdge > itemX) && (curPosition + self. peopleLeftEdge < itemX + itemWidth);
                self.jump(item,needDownBlock);
            }

            /*判断是否需要从障碍物上落下*/
            var rightNeedFail = (curPosition + self.peopleLeftEdge >= itemX + itemWidth) && (prePosition + self.peopleLeftEdge < itemX + itemWidth);
            var leftNeedFail = (curPosition + self.peopleRightEdge <= itemX) && (prePosition + self.peopleRightEdge > itemX);

            /*如果需要跳*/
            if(rightNeedFail || leftNeedFail){
                self.drop(item);
            }
        }
    },
    /*人物跳跃*/
    jump: function(item,downBlock){
        var self = this;
        self.setFrame('jump');
        this.isJumping = true;
        /*跳的高度*/
        var height = contentHeight - item.offsetTop + self.jumpBuffer;
        /*peopleContainer.style.bottom = bottom + 'px';*/
        /*我的animate有问题*/
        /*$$.animate.add('people-container',{
           bottom : height
        },100);*/
        $peopleContainer.stop().animate({bottom: height}, 100, function(){
            downBlock && self.downBlock(item);
        });
    },
    /*落到指定障碍物上*/
    downBlock: function(item){
        var self = this;
        self.setFrame('jump');
        /*下降高度，需要注意图片的边框，多减14*/
        var height = contentHeight - item.offsetTop -14;
        $peopleContainer.stop().animate({bottom: height}, 100, function(){
            /*切换状态*/
            self.setFrame('normal');
            self.isJumping = false;
        });
    },
    /*从障碍物跳下*/
    drop: function(item){
        var self = this;
        self.setFrame('jump');
        $peopleContainer.stop().animate({bottom: self.peopleBottomEdge}, 100, function(){
            /*切换状态*/
            self.setFrame('normal');
            self.isJumping = false;
        });
    }
}