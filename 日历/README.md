##日历

###实现功能

+ 选择日期（选择年、月）
+ 清空日期
+ 选择开始时间后，选择结束时间不能早于开始时间
+ 选择开始结束后，选择开始时间不能晚于开始时间
+ 今天快捷选择；如果今天不在开始或结束范围内，则禁止点击
###对象方法

+ Calendar.year
+ Calendar.month
+ Calendar.selectMonth true：选择month的状态；false：选择day的状态
+ Calendar.isClose true:非选择状态；false:选择状态
+ Calendar.colors
```
{
   title_bg:'#99AFD6',               //标题和底部背景色
   title_hover:"#8FA1C7",           //鼠标滑过标题的年月背景色
   cur_font_color:"#4B79D7",        //当前时间的字体颜色
   select_hover:"#9CAFD9",          //选择时鼠标滑过背景色
   bar_font_color:"#FFFFFF",         //字体颜色
   week_border:"#C2CEE8",            //week的下边框色
   week_color:"#656565",             //week字体颜色
   time_color:"#000",                 //时间颜色
   time_out_color:"#CDCDCE",          //非本月日期字体颜色
}
```

###实例上的方法

+ calendar.getDateAry()获取日期数组
+ calendar.draw()重绘日期内容
+ calendar.scopeCtrl()判断范围
+ calendar.event()绑定事件
+ calendar.hover()绑定鼠标滑过事件
+ calendar.close()关闭选择框

###初始化
```
new Calendar({
  panle:"panle",              //页面容器的id
  inputBox:"inputBox",        //页面input框的id
  selectedDate:"2018-08-08"   //已选中的时间，可有可无
})
```