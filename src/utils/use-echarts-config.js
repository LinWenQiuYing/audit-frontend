export const MONTHS = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

export const highlight = (chart) => {
  chart.getZr().on("click", function (params) {
    console.log("🚀 ~ params:", params);
    let seriesindex = null;
    if (
      params.target && // ECPolyline对象
      params.target.parent && // Group对象
      params.target.parent.parent &&
      params.target.parent.parent.__ecComponentInfo &&
      params.target.parent.parent.__ecComponentInfo.mainType === "series"
    ) {
      // 点击了line
      seriesindex = params.target.parent.parent.__ecComponentInfo.index;
    }
    if (
      params.target && // sub对象
      params.target.parent && // Symbol对象
      params.target.parent.parent && // Group对象
      params.target.parent.parent.parent &&
      params.target.parent.parent.parent.__ecComponentInfo &&
      params.target.parent.parent.parent.__ecComponentInfo.mainType === "series"
    ) {
      // 点击了节点
      seriesindex = params.target.parent.parent.parent.__ecComponentInfo.index;
    }
    if (
      params.target && // TSpan对象
      params.target.parent && // ZRText对象
      params.target.parent.__hostTarget && // Sub对象
      params.target.parent.__hostTarget.parent &&
      params.target.parent.__hostTarget.parent.parent &&
      params.target.parent.__hostTarget.parent.parent.parent &&
      params.target.parent.__hostTarget.parent.parent.parent
        .__ecComponentInfo &&
      params.target.parent.__hostTarget.parent.parent.parent.__ecComponentInfo
        .mainType === "series"
    ) {
      // 点击了节点的text
      seriesindex =
        params.target.parent.__hostTarget.parent.parent.parent.__ecComponentInfo
          .index;
    }
    // 更新series(改变线宽)
    const updatedSeries = chart
      .getOption()
      .series.map(function (series, index) {
        if (index === seriesindex) {
          return {
            ...series,
            lineStyle: {
              normal: {
                width: 5,
                opacity: 1,
              },
            },
          };
        } else {
          return {
            ...series,
            lineStyle: {
              width: 1.5,
              opacity: 1,
            },
          };
        }
      });

    chart.setOption({
      series: updatedSeries,
    });
  });
};
