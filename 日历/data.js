/**
 * Created by HiWin10 on 2018/3/15.
 */
/*2018-3-10*/
(function (window,undefined) {
    String.prototype.formatTime=function (template) {
        var template = template||'{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var dataAry = this.match(/\d+/g);
        template = template.replace(/\{(\d)\}/g,function () {
            var index = arguments[1];
            var num = dataAry[index]||'00';
            num.length < 2 ? num = "0" + num:null;
            return num;
        });
        return template;
    };

    function Calendar() {

        this.panel = document.getElementById("calendarPanel");
        this.selectMonth=false;

        this.date = new Date();
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();

        this.day = this.date.getDate();
        this.week = this.date.getDay();


        /*this.newMonth=this.month==11?0:this.month+1;
        this.firstDay=new Date(this.year,this.month,1);//获取当前月第一天
        this.lastDay=new Date(this.year,this.newMonth,0);//获取当前月最后一天
        this.firstDayWeek=this.firstDay.getDay()==0?7:this.firstDay.getDay();
        this.lastDayWeek=this.lastDay.getDay()==0?7:this.lastDay.getDay();
        this.beforeMonthDays=new Date(this.year,this.month,0).getDate();//获取上个月天数*/


        this.colors = {
            title_bg:'#99AFD6',               //标题和底部背景色
            title_hover:"#8FA1C7",           //鼠标滑过标题的年月背景色
            cur_font_color:"#4B79D7",        //当前时间的字体颜色
            select_hover:"#9CAFD9",          //选择时鼠标滑过背景色
            bar_font_color:"#FFFFFF",         //字体颜色
            week_border:"#C2CEE8",            //week的下边框色
            week_color:"#656565",             //week字体颜色
            time_color:"#000",                 //时间颜色
            time_out_color:"#CDCDCE",          //非本月日期字体颜色
        };

        this.language = {
            year:[],
            month:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
            week:["日","一","二","三","四","五","六"],
        };


    };
    Calendar.prototype.getDayAry=function () {
        var calendar = this;
        calendar.newMonth = calendar.month==11?0:calendar.month+1;
        calendar.firstDay = new Date(calendar.year,calendar.month,1);//获取当前月第一天
        calendar.lastDay = new Date(calendar.year,calendar.newMonth,0);//获取当前月最后一天
        calendar.firstDayWeek = calendar.firstDay.getDay()==0?7:calendar.firstDay.getDay();
        calendar.lastDayWeek = calendar.lastDay.getDay()==0?7:calendar.lastDay.getDay();
        this.beforeMonthDays = new Date(this.year,this.month,0).getDate();//获取上个月天数

        var dayAry = [];
        for(var i = calendar.firstDayWeek-2;i >= 0;i--){
            dayAry.push(calendar.beforeMonthDays-i);
        }
        for(var i=1;i<=calendar.lastDay.getDate();i++){
            dayAry.push(i);
        }
        var length=dayAry.length;
        for(var i=1;i<=42-length;i++){
            dayAry.push(i);
        }
        return dayAry;

    }
    Calendar.prototype.draw = function () {
           var calendar = this;

           var strAry = [];
        /*标题table*/
           strAry[strAry.length] = '<div name="calendarForm" style="border-radius: 3px;overflow: hidden">';
           /*@填充标题*/
           strAry[strAry.length] = '<table style="width: 100%;background: '+calendar.colors.title_bg+';" cellspacing="0">';
           strAry[strAry.length] = '<tbody>';
           strAry[strAry.length] = '<tr style="height:26px;line-height: 26px;text-align: center;color: '+calendar.colors.bar_font_color+'">';
           strAry[strAry.length] = '<td style="width: 14%;cursor: pointer;">&lt;</td>';
           if(this.selectMonth){
               /*标题只显示年*/
               strAry[strAry.length] = '<td style="width: 72%;background: '+calendar.colors.title_hover+';cursor: pointer;"><span>'+calendar.year+'</span></td>';
           }else {
               /*标题显示月，年*/
               strAry[strAry.length] = '<td style="width: 72%;background:  '+calendar.colors.title_hover+';cursor: pointer;"><span>'+calendar.language.month[calendar.month]+','+calendar.year+'</span></td>';
           }
           strAry[strAry.length] = '<td style="width: 14%;cursor: pointer;">&gt;</td></tr></tbody></table>';
        /*标题table结束*/

        /*时间table*/
           strAry[strAry.length] = '<table id="calendarTable" style="width: 100%;" cellspacing="0" cellpadding="3px">';
          if(calendar.selectMonth){
              /*月份*/
              strAry[strAry.length] = '<tbody style="">';
              var index=0;

              for(var i=0;i<4;i++){
                  strAry[strAry.length] = '<tr style="height: 40px;line-height: 40px;text-align: center">';
                  for(var j=0;j<3;j++){
                      if(index==this.month){
                          strAry[strAry.length] = '<td style="color:'+calendar.colors.cur_font_color+';">'+calendar.language.month[index]+'</td>';
                      }else {
                          strAry[strAry.length] = '<td>'+calendar.language.month[index]+'</td>';
                      }
                      index++;
                  }
                  strAry[strAry.length] = '</tr>'
              }

              strAry[strAry.length] = '</tbody>'
          }else {
              /*@填充周*/
              strAry[strAry.length] = '<thead style="">';
              strAry[strAry.length] = '<tr style="text-align: center;font-size: 14px;color: '+calendar.colors.week_color+';font-weight: normal">'
              for(var i=0;i<7;i++){
                  var week = (i+1)==7?"日":calendar.language.week[i+1];
                  strAry[strAry.length] = '<th style="border-bottom: 1px solid '+calendar.colors.week_border+';">'+week+'</th>';
              }
              strAry[strAry.length] = '</tr></thead>';
              /*@填充时间*/
              strAry[strAry.length] = '<tbody style="text-align: center;font-size: 14px;">';
              // TODO
              var dayAry = calendar.getDayAry();

              for(var i=0;i<6;i++){//六行
                  strAry[strAry.length] = '<tr style="width: 100%;">';
                      for(var j=0;j<7;j++){
                          strAry[strAry.length] = '<td style="';
                          //非本月的字体颜色
                          if((i==0&&dayAry[7*i+j]>20)||i>=4&&dayAry[7*i+j]<13){strAry[strAry.length] = 'color: '+calendar.colors.time_out_color+';';}
                          //今天的字体颜色
                          if(dayAry[7*i+j]==calendar.day){strAry[strAry.length] = 'color:'+calendar.colors.cur_font_color+';'}
                          strAry[strAry.length] = '">'+dayAry[7*i+j]+'</td>'
                      }
                  strAry[strAry.length] = '</tr>';
              }

              strAry[strAry.length] ='</tbody>';
          }
        strAry[strAry.length] = '</table>';
          /*时间table结束*/

          /*底部table*/
        strAry[strAry.length] = '<table style="width: 100%" cellspacing="0"><tbody>';
        strAry[strAry.length] = '<tr style="height: 22px;line-height:22px;background: '+calendar.colors.title_bg+';text-align: center;color:'+calendar.colors.bar_font_color+'">';
        strAry[strAry.length] = '<td style="width: 50%;cursor: pointer">今天</td>';
        strAry[strAry.length] = '<td style="width: 50%;cursor: pointer">清除</td>';
        strAry[strAry.length] = '</tr>';
        strAry[strAry.length] = '</tbody></table>';
        strAry[strAry.length] = '</div>';

        this.panel.innerHTML=strAry.join("");
    }
    return window.Calendar = Calendar;
})(window,undefined);
var calendar=new Calendar();
calendar.draw();