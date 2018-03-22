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
    /**
     * @options Object
     *    @panel  String:页面容器ID
     *    @inputBox   String:页面输入框ID
     *    @selectedDate String:已选中的时间，格式：'2018-08-08'
     * */
    function Calendar(options) {

        this.panel = options.panel ? document.getElementById(options.panel) : document.getElementById("calendarPanel");
        this.inputBox = document.getElementById(options.inputBox);
        this.selectedDate = options&&options.selectedDate;

        this.startTime = options.startTime||"";
        this.endTime = options.endTime||"";

        this.selectMonth = false;
        this.isClose = true;

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
                      if((index==new Date().getMonth())&&(calendar.year==new Date().getFullYear())){//当前月样式
                          if((index==calendar.selectedMonth-1)&&(calendar.year==calendar.selectedYear)){
                              strAry[strAry.length] = 'style="color:#fff;background-color:'+calendar.colors.select_hover+';color:'+calendar.colors.cur_font_color+';cursor: pointer;">';
                          }else {
                              strAry[strAry.length] = 'style="color:'+calendar.colors.cur_font_color+';cursor: pointer">';
                          }
                      }else {
                          if((index==calendar.selectedMonth-1)&&(calendar.year==calendar.selectedYear)){
                              strAry[strAry.length] = 'style="color:#fff;background-color:'+calendar.colors.select_hover+';cursor: pointer;">';
                          }else {
                              strAry[strAry.length] = 'style="cursor: pointer;color:'+calendar.colors.time_color+';">';
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
                              //console.log(calendar.scopeCtrl(calendar.startTime,calendar.endTime,calendar.year+'-'+calendar.month+'-'+dayAry[7*i+j]))
                              if(calendar.scopeCtrl(calendar.startTime,calendar.endTime,calendar.year+'-'+(calendar.month+1)+'-'+dayAry[7*i+j])){
                                  strAry[strAry.length] ='data-id="'+dayAry[7*i+j]+'" style="cursor:pointer;color:'+calendar.colors.time_color+';';
                                  if((dayAry[7*i+j]==new Date().getDate())&&(calendar.month==new Date().getMonth())&&(calendar.year==new Date().getFullYear())){
                                      //今天的字体颜色
                                      strAry[strAry.length] = 'color:'+calendar.colors.cur_font_color+';';
                                  }
                                  if((dayAry[7*i+j]==calendar.selectedDay)&&(calendar.month==calendar.selectedMonth-1)&&(calendar.year==calendar.selectedYear)){
                                      //设置选中日期的样式
                                      strAry[strAry.length] = 'color:#fff;background-color:'+calendar.colors.select_hover+';';
                                  }
                              }else {
                                  //不在范围的日子（开始时间晚于结束时间 或 结束时间早于开始时间）
                                  strAry[strAry.length] = 'style="color: '+calendar.colors.time_out_color+';';
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

    /**
     * @startTime  String:开始时间
     * @endTime   String:结束时间
     * @curTime   String:进行比较的时间*/
    Calendar.prototype.scopeCtrl=function (startTime,endTime,curTime) {
        var calendar=this;
        var curS=Date.parse(curTime);
        var startS=Date.parse(startTime);
        var endS=Date.parse(endTime);
        if((curS<startS)&&startTime!==""){
            return false;
        } else if((curS>endS)&&endTime!==""){
            return false;
        } else {return true;}
    };
    Calendar.prototype.event=function () {
        var calendar=this;

        //title上的事件
        var prevMonth=document.getElementsByClassName("prev")[0];
        var nextMonth=document.getElementsByClassName("next")[0];
        var selectMonth=document.getElementsByClassName("select-month")[0];
        prevMonth.onclick=function () {
            if(calendar.selectMonth){
                calendar.year--;
                calendar.draw()
            }else {
                calendar.month--;
                if(calendar.month==-1){
                    calendar.month=11;
                    calendar.year--;
                }
                calendar.draw();
            }

        };
        nextMonth.onclick=function () {
            if(calendar.selectMonth){
                calendar.year++;
                calendar.draw()
            }else {
                calendar.month++;
                if(calendar.month==12){
                    calendar.month=0;
                    calendar.year++;
                }
                calendar.draw();
            }

        };
        selectMonth.onclick=function () {
            calendar.selectMonth=true;
            calendar.draw();
        };
        calendar.hover(selectMonth);

        //中间日期部分的事件
        var obj=document.getElementById("calendarTable");
        var dataBody=obj.tBodies[0];
        var dataTd=dataBody.getElementsByTagName("td");
        if(calendar.selectMonth){//选择month事件

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
        }else {//选择day事件
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
                       calendar.selectedYear=calendar.year;
                       calendar.selectedMonth=calendar.month+1;
                       calendar.selectedDay=this.getAttribute("data-id");
                       var y=calendar.selectedYear;

                       var m=String(calendar.selectedMonth).length<2?"0"+calendar.selectedMonth:calendar.selectedMonth;
                       var d=calendar.selectedDay.length<2?"0"+calendar.selectedDay:calendar.selectedDay;
                       //TODO 回填表单
                       calendar.inputBox.value=y+'-'+m+'-'+d;
                       calendar.close();
                   }
               }
           }
        }

        //底部事件
        var today=document.getElementsByClassName("s-today")[0];
        var clear=document.getElementsByClassName("s-clear")[0];
        var y,m,d;
        today.onclick=function () {
            calendar.selectedYear=calendar.year=new Date().getFullYear();
            calendar.selectedMonth=calendar.month=new Date().getMonth();
            calendar.selected=calendar.day=new Date().getDate();
            calendar.selectedDay=calendar.day=new Date().getDate();
            var y=calendar.year;
            var m=String((calendar.month+1)).length<2?"0"+(calendar.month+1):(calendar.month+1);
            var d=calendar.day.length<2?"0"+calendar.day:calendar.day;
            if(!calendar.scopeCtrl(calendar.startTime,calendar.endTime,y+'-'+m+'-'+d)) return;
            calendar.inputBox.value=y+'-'+m+'-'+d;
            calendar.close();
        };
        if(calendar.scopeCtrl(calendar.startTime,calendar.endTime,new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate())){
            calendar.hover(today);
        }else {today.style.color=calendar.colors.time_out_color;}



        clear.onclick=function () {
            calendar.year=new Date().getFullYear();
            calendar.month=new Date().getMonth();
            calendar.day=new Date().getDate();

            calendar.selectedMonth=null;
            calendar.selectedDay=null;

            calendar.draw();
            calendar.inputBox.value='';
        };
        calendar.hover(clear)
    };
    /**
     * @domObj :鼠标滑过的对象*/
    Calendar.prototype.hover=function (domObj) {
        var calendar=this;
        domObj.onmouseover=function () {
            this.style.backgroundColor=calendar.colors.title_hover;
        };
        domObj.onmouseout=function () {
            this.style.backgroundColor=calendar.colors.title_bg;
        };
    };
    Calendar.prototype.close=function () {
      var calendar = this;
        calendar.isClose=true;
        var calendarForm = calendar.panel.getElementsByClassName("calendarForm")[0];
        calendar.panel.removeChild(calendarForm);
    };
    return window.Calendar = Calendar;
})(window,undefined);

