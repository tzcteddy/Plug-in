/**
 * Created by tzc on 2017/11/14.
 */
var Input = {
    textInputEle: null,
    placeholderEle: null,
    click: function (that) {
        var self = this;
        $(that).siblings("input[type='text']").focus();
    },
    keyUp: function (that) {
        var self = this;
        var val = $(that).val();
        val.length > 0 ? $(that).siblings(".placeholder").hide() : $(that).siblings(".placeholder").show();
    },
    keyDown: function (that) {
        var self = this;
        var val = $(that).val();
        val.length > 0 ? $(that).siblings(".placeholder").hide() : $(that).siblings(".placeholder").show();
    },
    placeholderForIE: function () {
        var self = this;
        if (window.navigator.userAgent.indexOf('MSIE') >= 0) {
            $("#province").attr("disabled", true);
            $("#city").attr("disabled", true);
            self.textInputEle.attr("placeholder", "");
            self.placeholderEle.show();
            self.placeholderEle.click(function () {
                var that = this;
                self.click(that);
            });
            self.textInputEle.keyup(function () {
                var that = this;
                self.keyUp(that);
            });
            self.textInputEle.keydown(function () {
                var that = this;
                self.keyDown(that);
            })
        }
    },
    init: function () {
        var self = this;
        self.placeholderForIE();
    }
}