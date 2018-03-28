/*
* @Author: wc
* @Date:   2017-12-29 09:21:11
* @Last Modified time: 2017-12-29 10:06:18
*/

'use strict';
/*资源管理器*/
var resourceHelper ={
    /*加载图片*/
    imageLoader: function(src,callback){
        var image = new Image();
        /*图片加载完成*/
        image.addEventListener('load', callback);
        image.addEventListener('error', function(e){
            console.error('img error', e);
        })
        image.src = src;
        return image;
    },
    /*资源加载*/
    load: function(images, callback){
        var self = this;
        images = images || [];
        /*需要加载的总数*/
        var total = images.length;
        if(total == 0){
            return callback([]);
        }
        /*已完成个数*/
        var finish = 0;
        /*保存加载后的图片对象*/
        self.images = [];
        /*遍历加载图片*/
        for(var i=0,len = images.length; i<len; i++){
            var src = images[i];
            /*保存起来*/
            self.images[i] = self.imageLoader(src, function(){
                /*加载完成*/
                finish ++;
                if(finish === total){
                    /*全部加载完成*/
                    callback(self.images);
                }
            });
        }
    }
}