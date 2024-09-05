import * as echarts from "echarts";

export function handleAddEchartsBackground(chart, option, xAxis) {
  xAxis = xAxis.length ? xAxis : ["", "", "", "", ""];
  let rangeY1 = chart.getModel().getComponent("yAxis").axis.scale._extent;
  option.series.push({
    name: "",
    barGap: "-100%",
    type: "bar",
    z: -1, // 控制层级，类似于z-index
    data: xAxis.map(() => {
      return rangeY1[1];
    }),
    yAxisIndex: 0,
    xAxisIndex: 1,
    barWidth: "96%",
    itemStyle: {
      color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: "#EBF2F8",
        },
        {
          offset: 1,
          color: "#fff",
        },
      ]),
    },
  });
  chart.setOption(option);
  rangeY1 = chart.getModel().getComponent("yAxis").axis.scale._extent;
  const series = option.series.slice(-1)[0];
  series.data = xAxis.map(() => {
    return rangeY1[1];
  });
  chart.setOption(option);
}

//环星图中心文字  长度自适应
export function adjustFontSize(text, maxWidth, initialFontSize) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  let fontSize = initialFontSize;
  context.font = fontSize + "px Arial";
  let textWidth = context.measureText(text).width;

  while (textWidth > maxWidth && fontSize > 1) {
    fontSize -= 1;
    context.font = fontSize + "px Arial";
    textWidth = context.measureText(text).width;
  }

  return fontSize;
}
