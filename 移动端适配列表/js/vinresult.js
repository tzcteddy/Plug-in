/**
 * Created by tzc on 2017/11/2.
 */
var $sectionInfo = $(".section_info");
var $sectionInfoList = $(".section_info_list");
var sectionInfoW = $sectionInfo.width();
var sectionInfoListW = $sectionInfoList.width();
var Sort = {
    toArray: function (likeArray) {
        try {
            return Array.prototype.slice.call(likeArray);
        } catch (e) {
            var a = [];
            for (var i = 0; i < likeArray.length; i++) {
                a.push(likeArray[i]);
            }
            return a;
        }
    },
    resetWidth: function () {
        var $sectionInfo = $(".section_info");
        var $sectionInfoList = $(".section_info_list");
        var sectionInfoW = $sectionInfo.width();
        $sectionInfo.each(function (index, item) {
            if (index == 0) return;
            $(item).find(".section_info_list").each(function (index, item) {
                if (item.clientWidth / sectionInfoW > 0.48) {
                    $(item).width("100%");
                } else if (item.clientWidth / sectionInfoW >= 0.31 && item.clientWidth / sectionInfoW <= 0.48) {
                    $(item).width("44%")
                } else {
                    $(item).width("28%")
                }
            })
        })
    },
    backFill: function (array, parent) {
        var self = this;
        var shortAry=[];
        for (var i = 0; i < array.length; i++) {
            if(array[i].clientWidth/sectionInfoW<0.31){
                shortAry.push(array[i]);
            }
            parent.appendChild(array[i])
        }
        if(shortAry.length%3==1){
            console.log(shortAry[shortAry.length-1]);
            $(shortAry[shortAry.length-1]).width("44%")
        }else if(shortAry.length%3==2){
            $(shortAry[shortAry.length-1]).width("44%");
            $(shortAry[shortAry.length-2]).width("44%");
        }
    },
    sortRand: function (likeArray) {
        var self = this;
        var array = self.toArray(likeArray);
        array.sort(function (ary1, ary2) {
            var W1 = ary1.clientWidth;
            var W2 = ary2.clientWidth;
            return W1 - W2;
        });
        return array;
    },

    init: function () {
        var self = this;
        $sectionInfo.each(function (index, item) {
            if (index === 0) return;
            else {
                var listAry = $(item).find(".section_info_list");
                self.backFill(self.sortRand(listAry), item)
            }
            ;
        });
        self.resetWidth();
    }
}
Sort.init();
var Action = {
    elementAry: [$(".detail_box_active").find("h3")],
    isSingleConfig:function () {
        if($(".select_title").length==1){
            $(".select_title").css("text-align","left");
        }
        return;
    },
    configRender: function (eleStr) {
        var self = this;
        $("." + eleStr).click(function () {
            var query = $(this).attr("data_relate");
            $("." + eleStr).each(function (index, item) {
                if ($(item).attr("data_relate") == query) {
                    $(item).addClass("active");
                    $("." + query + "_detail").show();
                } else {
                    $(item).removeClass("active");
                    $("." + $(item).attr("data_relate") + "_detail").hide();
                }
            })
        })
    },
    initParamH: function () {
        var H = $(".param_info_active").find("li").height();
        var length = $(".param_info_active").find("li").length;
        $(".param_info_active").height(H * length + "px").addClass("param_info");
    },
    accordionRender: function () {
        var self = this;
        $("h3").click(function () {
            if ($(this).parent().hasClass("detail_box_active")) {
                $(".param_info").height(0);
                $(".detail_box").removeClass("detail_box_active")
            } else {
                var newH = $(this).siblings("ul").find("li").height();
                var length = $(this).siblings("ul").find("li").length;
                self.elementAry.pop()
                    .siblings("ul").height(0)
                    .parent().removeClass("detail_box_active");
                self.elementAry.push($(this));
                $(this)
                    .siblings("ul").height(newH * length)
                    .parent().addClass("detail_box_active");
            }
        })
    },
    init: function () {
        var self = this;
        self.isSingleConfig();
        self.initParamH();
        self.configRender("config");
        self.accordionRender();
    }
};
Action.init();