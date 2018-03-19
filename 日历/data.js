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

    function Calendar(options) {

        this.panel =options.panel ? document.getElementById(options.panel) : document.getElementById("calendarPanel");
        this.inputBox=document.getElementById(options.inputBox);
        console.log(this.inputBox);
        this.selectedDate=options&&options.selectedDate;

        this.selectMonth=false;
        this.isClose=true;

        this.date = new Date();
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
        this.day =this.date.getDate();
        this.week = this.date.getDay();

        this.selected=function(selectedDate){
            var calendar=this;
            if(selectedDate=="")return;
            var dateAry = selectedDate.split("-");
            calendar.year=calendar.selectedYear = parseFloat(dateAry[0]);
            calendar.month=calendar.selectedMonth = parseFloat(dateAry[1]);
            calendar.month=calendar.selectedMonth-1;
            calendar.day=calendar.selectedDay = parseFloat(dateAry[2]);
        };
        this.selected(this.selectedDate);


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

    };
    Calendar.prototype.draw = function () {
           var calendar = this;
           calendar.isClose=false;
           var strAry = [];
        /*标题table*/
           strAry[strAry.length] = '<div class="calendarForm" style="border-radius: 3px;overflow: hidden">';
           /*@填充标题*/
           strAry[strAry.length] = '<table id="calendarOpera" style="width: 100%;background: '+calendar.colors.title_bg+';" cellspacing="0">';
           strAry[strAry.length] = '<tbody>';
           strAry[strAry.length] = '<tr  style="height:26px;line-height: 26px;text-align: center;color: '+calendar.colors.bar_font_color+'">';
           strAry[strAry.length] = '<td class="prev" style="width: 14%;cursor: pointer;">&lt;</td>';
           if(this.selectMonth){
               /*标题只显示年*/
               strAry[strAry.length] = '<td class="select-month" style="width: 72%;cursor: pointer;cursor: pointer;"><span>'+calendar.year+'</span></td>';
           }else {
               /*标题显示月，年*/
               console.log(calendar.month);
               strAry[strAry.length] = '<td class="select-month" style="width: 72%;cursor: pointer;"><span>'+calendar.language.month[calendar.month]+','+calendar.year+'</span></td>';
           }
           strAry[strAry.length] = '<td class="next" style="width: 14%;cursor: pointer;">&gt;</td></tr></tbody></table>';
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
                      strAry[strAry.length] = '<td ';
                      if((index==new Date().getMonth())&&(calendar.year==new Date().getFullYear())){
                          if((index==calendar.selectedMonth-1)&&(calendar.year==calendar.selectedYear)){
                              strAry[strAry.length] = 'style="color:#fff;background-color:'+calendar.colors.select_hover+';color:'+calendar.colors.cur_font_color+';cursor: pointer;">';
                          }else {
                              strAry[strAry.length] = 'style="color:'+calendar.colors.cur_font_color+';cursor: pointer">';
                          }
                      }else {
                          if((index==calendar.selectedMonth-1)&&(calendar.year==calendar.selectedYear)){
                              strAry[strAry.length] = 'style="color:#fff;background-color:'+calendar.colors.select_hover+';cursor: pointer;">';
                          }else {
                              strAry[strAry.length] = 'style="cursor: pointer;">';
                          }
                      }
                      strAry[strAry.length] = calendar.language.month[index]+'</td>';
                      index++;
                  }
                  strAry[strAry.length] = '</tr>'
              }

              strAry[strAry.length] = '</tbody>'
          }else {
              /*@填充周*/
              strAry[strAry.length] = '<thead style="">';
              strAry[strAry.length] = '<tr style="text-align: center;font-size: 14px;color: '+calendar.colors.week_color+';">';
              for(var i=0;i<7;i++){
                  var week = (i+1)==7?"日":calendar.language.week[i+1];
                  strAry[strAry.length] = '<th style="border-bottom: 1px solid '+calendar.colors.week_border+';font-weight: normal;" >'+week+'</th>';
              }
              strAry[strAry.length] = '</tr></thead>';
              /*@填充时间*/
              strAry[strAry.length] = '<tbody style="line-height: 24px;text-align: center;font-size: 14px;">';
              // TODO
              var dayAry = calendar.getDayAry();

              for(var i=0;i<6;i++){//六行
                  strAry[strAry.length] = '<tr style="width: 100%;">';
                      for(var j=0;j<7;j++){
                          strAry[strAry.length] = '<td ';
                          //非本月的字体颜色
                          if((i==0&&dayAry[7*i+j]>20)||i>=4&&dayAry[7*i+j]<=14){
                              strAry[strAry.length] = 'style="color: '+calendar.colors.time_out_color+';';
                          }else {
                              strAry[strAry.length] ='data-id="'+dayAry[7*i+j]+'" style="cursor:pointer;';
                              if((dayAry[7*i+j]==new Date().getDate())&&(calendar.month==new Date().getMonth())&&(calendar.year==new Date().getFullYear())){
                                  //今天的字体颜色
                                  strAry[strAry.length] = 'color:'+calendar.colors.cur_font_color+';';
                              }
                              if((dayAry[7*i+j]==calendar.selectedDay)&&(calendar.month==calendar.selectedMonth-1)&&(calendar.year==calendar.selectedYear)){
                                  strAry[strAry.length] = 'color:#fff;background-color:'+calendar.colors.select_hover+';';
                              }
                          }


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
        strAry[strAry.length] = '<td class="s-today" style="width: 50%;cursor: pointer">今天</td>';
        strAry[strAry.length] = '<td class="s-clear" style="width: 50%;cursor: pointer">清除</td>';
        strAry[strAry.length] = '</tr>';
        strAry[strAry.length] = '</tbody></table>';
        strAry[strAry.length] = '</div>';

        this.panel.innerHTML=strAry.join("");
         calendar.event();

    };
    Calendar.prototype.event=function () {
        var calendar=this;
        var prevMonth=document.getElementsByClassName("prev")[0];
        var nextMonth=document.getElementsByClassName("next")[0];
        var selectMonth=document.getElementsByClassName("select-month")[0];
        prevMonth.onclick=function () {
            calendar.year--;
            calendar.draw()
        };
        nextMonth.onclick=function () {
            calendar.year++;
            calendar.draw()
        };
        selectMonth.onmouseover=function () {
            this.style.backgroundColor=calendar.colors.title_hover;
        };
        selectMonth.onmouseout=function () {
            this.style.backgroundColor="transparent";
        };
        selectMonth.onclick=function () {
            calendar.selectMonth=true;
            calendar.draw();
        };


        var obj=document.getElementById("calendarTable");
        var dataBody=obj.tBodies[0];
        var dataTd=dataBody.getElementsByTagName("td");
        if(calendar.selectMonth){//选择月事件

            for(var i=0;i<dataTd.length;i++){
                dataTd[i].index=i;
                dataTd[i].onmouseover=function () {
                    this.style.backgroundColor=calendar.colors.select_hover;
                    this.style.color="#fff";
                };
                dataTd[i].onmouseout=function () {
                    this.style.backgroundColor="transparent";
                    this.style.color="#000";
                };
                dataTd[i].onclick=function () {
                    calendar.selectMonth=false;
                    calendar.month=this.index;

                    calendar.selectedYear=calendar.year;
                    calendar.selectedMonth=calendar.month+1;
                    calendar.selectedDay=null;
                    calendar.draw();
                }
            }
        }else {//选择日事件
           for(var i=0;i<dataTd.length;i++){
               if(dataTd[i].getAttribute("data-id")){
                   dataTd[i].onmouseover=function () {
                       this.style.backgroundColor=calendar.colors.select_hover;
                       this.style.color="#fff";
                   };
                   dataTd[i].onmouseout=function () {
                       this.style.backgroundColor="transparent";
                       this.style.color="#000";
                   };
                   dataTd[i].onclick=function () {
                       console.log(this.getAttribute("data-id"));
                       calendar.selectedYear=calendar.year;
                       calendar.selectedMonth=calendar.month+1;
                       calendar.selectedDay=this.getAttribute("data-id");

                       //TODO 回填表单
                       calendar.inputBox.value=calendar.selectedYear+'-'+calendar.selectedMonth+'-'+calendar.selectedDay;
                       calendar.close();
                   }
               }
           }
        }

        var today=document.getElementsByClassName("s-today")[0];
        var clear=document.getElementsByClassName("s-clear")[0];
        today.onclick=function () {
            calendar.selectedYear=calendar.year=new Date().getFullYear();
            calendar.selectedMonth=calendar.month=new Date().getMonth();
            calendar.selected=calendar.day=new Date().getDate();
            calendar.selectedDay=calendar.day=new Date().getDate();
            calendar.inputBox.value=calendar.year+'-'+(calendar.month+1)+'-'+calendar.day;
            calendar.close();
        };
        clear.onclick=function () {
            calendar.year=new Date().getFullYear();
            calendar.month=new Date().getMonth();
            calendar.day=new Date().getDate();

            calendar.selectedMonth=null;
            calendar.selectedDay=null;

            calendar.draw();
            calendar.inputBox.value='';
        }


    };
    Calendar.prototype.close=function () {
      var calendar = this;
        calendar.isClose=true;
        var calendarForm = calendar.panel.getElementsByClassName("calendarForm")[0];
        console.log(calendarForm);
        calendar.panel.removeChild(calendarForm);
    };
    return window.Calendar = Calendar;
})(window,undefined);

