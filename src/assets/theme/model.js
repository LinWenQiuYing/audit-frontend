const subTitleBackgroundImage = require("@/assets/images/img/title_background.svg");
import * as echarts from "echarts";

export const themes = {
  blueWhite: {
    activeFontColor: "#016eff",
    mainBackgroundColor: `#F0F3F9`,
    layoutHeaderColor: `linear-gradient(to right, #3178F8, #3178F8)`,
    logoBackgroundColor: `#3178F8`,
    fontColor1: `#fff`,
    fontColor2: `#fff`,
    leftMenuColor: `rgba(0, 0, 0, 0.85)`,
    leftMenuBackgroundColor: `#F2F3F5`,
    primaryButtonBackgroundColor: `linear-gradient(270deg, #016eff 0%, #016eff99 100%)`,
    commonButtonColor: `#fff`,
    paginationBackgroundColor: `#016eff`,
    paginationColor: `#fff`,
    tableHeaderBackgroundColor: `rgba(0, 0, 0, 0.02)`,
    subTitleColor: "#fff",
    subTitlePadding: "0 0 0 26px",
    subTitleBackgroundImage: `url(${subTitleBackgroundImage})`,
  },
};

// 右下左上
// 1, 1, 1, 0,  //(上-下 渐变)
// 1, 1, 0, 0,  //(左上-右下 渐变)
// 1, 0, 0, 0,  //(左-右 渐变)
// 0, 1, 1, 0,  //(右上-左下 渐变)
// 0, 1, 1, 1,  //(左-右 渐变)
// 1, 0, 1, 1,  //(上-下 渐变)
// 0, 0, 1, 0,  //(左-右 渐变)
// 0, 0, 0, 1,  //(上-下 渐变)
// 饼图
export const color1 = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
  { offset: 0, color: "#63A1FF" },
  { offset: 1, color: "#0259DA" },
]);
export const color2 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#7BB4FF" },
  { offset: 1, color: "#026AF7" },
]);
export const color3 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#A4D1FF" },
  { offset: 1, color: "#2E91FF" },
]);
export const color4 = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
  { offset: 0, color: "#ABEFFF" },
  { offset: 1, color: "#18C7F2" },
]);
export const color5 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  { offset: 0, color: "#CEF7FF" },
  { offset: 1, color: "#42E1FB" },
]);
export const color6 = new echarts.graphic.LinearGradient(1, 0, 0, 1, [
  { offset: 0, color: "#E4FFFA" },
  { offset: 1, color: "#3CF4CE" },
]);
export const color7 = new echarts.graphic.LinearGradient(1, 0, 0, 1, [
  { offset: 0, color: "#EAFFF7" },
  { offset: 1, color: "#7FFFE1" },
]);
export const color8 = new echarts.graphic.LinearGradient(1, 0, 0, 0, [
  { offset: 0, color: "#E4FFEA" },
  { offset: 1, color: "#94FFB7" },
]);
export const color9 = new echarts.graphic.LinearGradient(1, 1, 0, 0, [
  { offset: 0, color: "#E1FDEE" },
  { offset: 1, color: "#42FF9A" },
]);
export const color10 = new echarts.graphic.LinearGradient(1, 1, 0, 0, [
  { offset: 0, color: "#E1FDEE" },
  { offset: 1, color: "#42FF9A" },
]);
export const color11 = new echarts.graphic.LinearGradient(1, 1, 0, 0, [
  { offset: 0, color: "#C8FEE5" },
  { offset: 1, color: "#0BC876" },
]);

// 柱状图
export const barColor1 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#016EFF" },
  { offset: 0.6, color: "#99C5FF" },
  { offset: 1, color: "#016EFF" },
]);
export const barColor2 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#18F218" },
  { offset: 0.6, color: "#A3FAA3" },
  { offset: 1, color: "#18F218" },
]);
export const barColor3 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#298DFF" },
  { offset: 0.6, color: "#9CCAFF" },
  { offset: 1, color: "#298DFF" },
]);
export const barColor4 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#18C7F2" },
  { offset: 0.6, color: "#A3E9FA" },
  { offset: 1, color: "#18C7F2" },
]);
export const barColor5 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#30F2CB" },
  { offset: 0.6, color: "#ACFAEA" },
  { offset: 1, color: "#30F2CB" },
]);
export const barColor6 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#0ACC72" },
  { offset: 0.6, color: "#77E8B3" },
  { offset: 1, color: "#0ACC72" },
]);
export const barColor7 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#017AA6" },
  { offset: 0.6, color: "#5BB2D1" },
  { offset: 1, color: "#017AA6" },
]);
export const barColor8 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#0A9FCC" },
  { offset: 0.6, color: "#6BCEEC" },
  { offset: 1, color: "#0A9FCC" },
]);
export const barColor9 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#0157D9" },
  { offset: 0.6, color: "#5B94EC" },
  { offset: 1, color: "#0157D9" },
]);
export const barColor10 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#0041B3" },
  { offset: 0.6, color: "#4D80DB" },
  { offset: 1, color: "#0041B3" },
]);
export const barColor11 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#A2FEB7" },
  { offset: 0.6, color: "#E1FFE8" },
  { offset: 1, color: "#A2FEB7" },
]);
export const barColor12 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#11A692" },
  { offset: 0.6, color: "#3ED4C0" },
  { offset: 1, color: "#11A692" },
]);
export const barColor13 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#1FCCAF" },
  { offset: 0.6, color: "#6FEFDA" },
  { offset: 1, color: "#1FCCAF" },
]);
export const barColor14 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#42E0FF" },
  { offset: 0.6, color: "#A7F1FF" },
  { offset: 1, color: "#42E0FF" },
]);
export const barColor15 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: "#7EFFE1" },
  { offset: 0.6, color: "#D4FFF5" },
  { offset: 1, color: "#7EFFE1" },
]);

// 折线图
// export const lineColor1 = "#165DFF"; //蓝色
// // export const lineColor2 = "#F53F3F";//红色
// // export const lineColor2 = "#ee6cd2"; //粉色
// export const lineColor2 = "#14C9C9";
// export const lineColor3 = "#FF7F00";
// // export const lineColor4 = "#00B42A";
// export const lineColor4 = "#722ED1";
// export const lineColor5 = "#9CD5FF";
// export const lineColor6 = "#D91AD9";
// export const lineColor7 = "#007F7F";
// export const lineColor8 = "#7F7F00";
// export const lineColor9 = "#7F0000";
// export const lineColor10 = "#00007F";
// export const lineColor11 = "#00B42A"; //绿色
//三期UI修改
export const lineColor1 = "#1776FF"; //蓝色
// export const lineColor2 = "#F53F3F";//红色
// export const lineColor2 = "#ee6cd2"; //粉色
export const lineColor2 = "#5991EB";
export const lineColor3 = "#3CC7FF";
// export const lineColor4 = "#00B42A";
export const lineColor4 = "#3CF4CE";
export const lineColor5 = "#1ECF82";
export const lineColor6 = "#FFDA7F";
export const lineColor7 = "#FFBE90";
export const lineColor8 = "#CF844F";
export const lineColor9 = "#9386FF";
export const lineColor10 = "#EEB1FF";
export const lineColor11 = "#EDE080";
export const lineColor12 = "#FFD797";

//旭日图
export const sunColor = [
  ["#165DFF", "#B3CDF2"],
  // ["#F53F3F", "#F45C5C"],//红色
  ["#14C9C9", "#C3F2F6"],
  ["#FF7F00", "#FDA37C"],
  // ["#00B42A", "#99E88D"],//绿色
  ["#722ED1", "#A9A6C4"],
  ["#9CD5FF", "#C1FBFA"],
  ["#D91AD9", "#F2BCDF"],
  ["#007F7F", "#51A4A4"],
  ["#7F7F00", "#E5FF9E"],
  ["#7F0000", "#DD7373"],
  ["#00007F", "#7D82EE"],
];

// 购销品类点阵图
export const dotColor1 = "#CCE2FF";
export const dotColor2 = "#FFD9DD";
export const dotColor3 = "#FCE7D1";
export const dotColor4 = "#FCF8D1";
export const dotColor5 = "#D1FCD1";
export const dotColor6 = "#D6FCF5";
export const dotColor7 = "#E6E1FE";
export const dotColor8 = "#D1F4FC";
