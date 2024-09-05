import axiosInstance from "../index.js";

const assertsUrl = "/pierce/dacp/invoke";

//------资产分析区域
//资产总览
export async function getAssertsOveview(req) {
  // 打印视图层的入参请求
  console.log("getAssertsOveview req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT ROUND(SUM(Asset_Tot) / 10000, 2) as Asset_Tot, ROUND((SUM(Asset_Tot) / SUM(Staff_Tot)) / 10000, 2) as Avg_Asset, ROUND(SUM(Property_Tot) / 10000, 2) as Property_Tot, ROUND(SUM(Property_Area),2) as Property_Area, ROUND(SUM(Vehicle_Tot) / 10000, 2) as Vehicle_Tot, SUM(Vehicle_Num) as Vehicle_Num, ROUND(SUM(Land_Tot) / 10000, 2) as Land_Tot, ROUND(SUM(Land_Area),2) as Land_Area, ROUND(SUM(Other_Tot) / 10000, 2) as Other_Tot FROM CAS_FUS_SJ_ASSET_BK_OVERVIEW_I_Y WHERE 1=1 @[AND block_Name in ${param.blockNames}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getAssertsOveview dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAssertsOveview dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData) {
    const data = inputData[0];
    const result = {
      overView: [
        {
          id: 1,
          typeName: "房产资产总额（万元）",
          num: data.Property_Tot,
          icon: "house",
        },
        {
          id: 2,
          typeName: "车辆资产总额（万元）",
          num: data.Vehicle_Tot,
          icon: "car",
        },
        {
          id: 3,
          typeName: "土地资产总额（万元）",
          num: data.Land_Tot,
          icon: "land",
        },
        {
          id: 4,
          typeName: "人均资产金额（万元）",
          num: data.Avg_Asset,
          icon: "person",
        },
        {
          id: 5,
          typeName: "房产资产面积（m²）",
          num: data.Property_Area,
          icon: "house",
        },
        {
          id: 6,
          typeName: "车辆资产数量（辆）",
          num: data.Vehicle_Num,
          icon: "car",
        },
        {
          id: 7,
          typeName: "土地资产面积（m²）",
          num: data.Land_Area,
          icon: "land",
        },
        {
          id: 8,
          typeName: "其他资产总额（万元）",
          num: data.Other_Tot,
          icon: "others",
        },
      ],
      total: data.Asset_Tot,
    };
    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAssertsOveview res: ", JSON.stringify(res));
  return res;
}

//当前资产分布（按资产大类）  环形图
export async function getAssertsChartOne(req) {
  // 打印视图层的入参请求
  console.log("getAssertsChartOne req", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT (case when asset_large_class = '' then '--' when asset_large_class is null then '--' else asset_large_class end) as name, ROUND(SUM(asset_value_total) / 10000, 2) as asset_value_total FROM CAS_FUS_SJ_ASSET_LARGE_CLASS_BK_I_Y WHERE 1=1 @[AND block_name in ${param.blockNames}] GROUP BY asset_large_class;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getAssertsChartOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAssertsChartOne dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData) {
    const result = {
      total: 0,
      seriesData: [],
    };

    inputData.forEach((item) => {
      result.total += item.asset_value_total;
      result.seriesData.push({
        value: item.asset_value_total,
        name: item.name,
        rate: 0,
      });
    });

    result.seriesData.forEach((item) => {
      item.rate = Number(
        ((item.value / result.total) * 100).toFixed(2)
      ).toString();
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAssertsChartOne res: ", JSON.stringify(res));
  return res;
}

//资产分布  表格
export async function getAssertsTableOne(req) {
  // 打印视图层的入参请求
  console.log(" getAssertsTableOne req", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT (case when asset_large_class = '' then '--' when asset_large_class is null then '--'  else asset_large_class end) as zcdl, ROUND(SUM(asset_value_total) / 10000, 2) as je FROM CAS_FUS_SJ_ASSET_LARGE_CLASS_BK_I_Y WHERE 1=1 @[AND block_name in ${param.blockNames}] GROUP BY asset_large_class order by je desc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(" getAssertsTableOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(" getAssertsTableOne dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData) {
    let total = 0;
    const result = {
      dataSource: [],
      maxMoney: 0,
    };

    inputData.forEach((item) => {
      total += item.je;
      result.dataSource.push({
        zcdl: item.zcdl,
        je: item.je,
        zb: 0,
      });
    });

    result.dataSource.forEach((item) => {
      item.zb = Number(((item.je / total) * 100).toFixed(2));
    });

    //maxMoney是dataSource中je的最大值
    result.maxMoney = result.dataSource.reduce(
      (max, item) => Math.max(max, item.je),
      -Infinity
    );
    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log(" getAssertsTableOne res: ", JSON.stringify(res));
  return res;
}

//当前资产分布（按资产大类与主管单位）   矩形树图
export async function getAssertsChartTwo(req) {
  // 打印视图层的入参请求
  console.log("getAssertsChartTwo req", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT dept_name as l1_name, dept_code as l1_code, unit_name as l2_name, unit_code as l2_code, asset_large_class as type, asset_value as l2_value FROM CAS_FUS_SJ_ASSET_LARGE_CLASS_DISTR_I_Y WHERE 1=1 @[AND block_name in ${param.blockNames}] @[AND asset_large_class = '${param.assetType}']",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getAssertsChartTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAssertsChartTwo dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData) {
    const result = {
      seriesData: [],
    };

    // 存放输入数据中有多少种资产类型,如果有多种,则最终结果中的from替换为"全部",如果只有一种,则直接使用该种资产类型
    const assetTypes = new Set();
    // 使用一个对象来按照 l1_name 分组数据
    const map = {};
    // 存放全市资产
    let wholeCity = 0;
    for (let i = 0; i < inputData.length; i++) {
      const item = inputData[i];
      let l2_value = parseFloat(item.l2_value);
      assetTypes.add(item.type);
      if (!map[item.l1_name]) {
        map[item.l1_name] = {
          name: item.l1_name,
          code: item.l1_code,
          value: 0,
          wholeCity: 0,
          rate: 0,
          type: "manage",
          from: item.type,
          children: [],
        };
      }
      const l1Item = map[item.l1_name];
      // 向children中添加l2数据
      l1Item.children.push({
        name: item.l2_name,
        code: item.l2_code,
        value: l2_value,
        wholeCity: 0,
        rate: 0,
        type: "budget",
        from: item.type,
      });
      // 计算l1的value
      l1Item.value += l2_value;
      // 计算全市资产
      wholeCity += l2_value;
    }

    // 赋值wholeCity,计算rate,同时判断是否有多种资产类型
    for (const key in map) {
      const item = map[key];
      // 处理l1value
      item.value = Number((item.value / 10000).toFixed(2));
      // 赋值wholeCity
      item.wholeCity = Number((wholeCity / 10000).toFixed(2));
      // 计算主管单位的占比
      item.rate = Number(((item.value / item.wholeCity) * 100).toFixed(2));
      // 判断是否有多种资产类型
      if (assetTypes.size > 1) {
        item.from = "全部";
      }
      // 处理子节点
      for (let i = 0; i < item.children.length; i++) {
        const child = item.children[i];
        // 处理l2value
        child.value = Number((child.value / 10000).toFixed(2));
        child.wholeCity = Number((wholeCity / 10000).toFixed(2));
        child.rate = Number(((child.value / child.wholeCity) * 100).toFixed(2));
        if (assetTypes.size > 1) {
          child.from = "全部";
        }
      }
      result.seriesData.push(item);
    }
    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAssertsChartTwo res: ", JSON.stringify(res));
  return res;
}

//主管单位历年趋势  折线图
export async function getAssertsChartThree(req) {
  // 打印视图层的入参请求
  console.log("getAssertsChartThree req", JSON.stringify(req));

  // 根据请求的资产大类及单位代码是否为空来确定sql语句
  let sqlTemplate = "SELECT add_name as name, add_year as year, add_unit as unit, add_type as type, add_value as value FROM (SELECT '资产新增' as add_name, nf as add_year, '全市' as add_unit, '全部' as add_type, round(sum(asset_value) / 10000, 2) as add_value FROM CAS_FUS_SJ_ASSET_BL_ADD_I_Y WHERE 1=1  @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[and block_name in ${param.blockNames}] GROUP BY nf UNION SELECT '资产新增' as add_name, nf as add_year, '全市' as add_unit, '全部' as add_type, round(sum(asset_value) / 10000, 2) as add_value FROM CAS_FUS_SJ_ASSET_BL_ADD_I_Y WHERE 1=1  @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[and block_name in ${param.blockNames}] GROUP BY nf ) AS t1 UNION SELECT disp_name as name, disp_year as year, disp_unit as unit, disp_type as type, disp_value as value FROM (SELECT '资产处置' as disp_name, nf as disp_year, '全市' as disp_unit, '全部' as disp_type, round(sum(asset_value) / 10000, 2) as disp_value FROM CAS_FUS_SJ_ASSET_BL_DISPOSAL_I_Y WHERE 1=1  @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[and block_name in ${param.blockNames}] GROUP BY nf UNION SELECT '资产处置' as disp_name, nf as disp_year, '全市' as disp_unit, '全部' as disp_type, round(sum(asset_value) / 10000, 2) as disp_value FROM CAS_FUS_SJ_ASSET_BL_DISPOSAL_I_Y WHERE 1=1  @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[and block_name in ${param.blockNames}] GROUP BY nf ) as t2";
  if (req.class && req.code) {
    sqlTemplate = "SELECT add_name as name, add_year as year, add_unit as unit, add_type as type, add_value as value FROM (SELECT '资产新增' as add_name, nf as add_year, dept_name as add_unit, asset_large_class as add_type, round(sum(asset_value) / 10000, 2) as add_value FROM CAS_FUS_SJ_ASSET_BL_ADD_I_Y WHERE dept_code = '${param.code}' @[and nf between ${param.year} - 4 and ${param.year}] @[and asset_large_class = '${param.class}'] @[and block_name in ${param.blockNames}] GROUP BY nf, dept_name, asset_large_class UNION SELECT '资产新增' as add_name, nf as add_year, unit_name as add_unit, asset_large_class as add_type, round(sum(asset_value) / 10000, 2) as add_value FROM CAS_FUS_SJ_ASSET_BL_ADD_I_Y WHERE unit_code = '${param.code}' @[and nf between ${param.year} - 4 and ${param.year}] @[and asset_large_class = '${param.class}'] @[and block_name in ${param.blockNames}] GROUP BY nf, unit_name, asset_large_class ) as t1 UNION SELECT disp_name as name, disp_year as year, disp_unit as unit, disp_type as type, disp_value as value FROM (SELECT '资产处置' as disp_name, nf as disp_year, dept_name as disp_unit, asset_large_class as disp_type, round(sum(asset_value) / 10000, 2) as disp_value FROM CAS_FUS_SJ_ASSET_BL_DISPOSAL_I_Y WHERE dept_code = '${param.code}' @[and nf between ${param.year} - 4 and ${param.year}] @[and asset_large_class = '${param.class}'] @[and block_name in ${param.blockNames}] GROUP BY nf, dept_name, asset_large_class UNION SELECT '资产处置' as disp_name, nf as disp_year, unit_name as disp_unit, asset_large_class as disp_type, round(sum(asset_value) / 10000, 2) as disp_value FROM CAS_FUS_SJ_ASSET_BL_DISPOSAL_I_Y WHERE unit_code = '${param.code}' @[and nf between ${param.year} - 4 and ${param.year}] @[and asset_large_class = '${param.class}'] @[and block_name in ${param.blockNames}] GROUP BY nf, unit_name, asset_large_class ) as t2";
  } else if (req.class) {
    sqlTemplate = "SELECT add_name as name, add_year as year, add_unit as unit, add_type as type, add_value as value FROM (SELECT '资产新增' as add_name, nf as add_year, '全市' as add_unit, asset_large_class as add_type, round(sum(asset_value) / 10000, 2) as add_value FROM CAS_FUS_SJ_ASSET_BL_ADD_I_Y WHERE 1=1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND asset_large_class = '${param.class}'] @[and block_name in ${param.blockNames}] GROUP BY nf, asset_large_class UNION SELECT '资产新增' as add_name, nf as add_year, '全市' as add_unit, asset_large_class as add_type, round(sum(asset_value) / 10000, 2) as add_value FROM CAS_FUS_SJ_ASSET_BL_ADD_I_Y WHERE 1=1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND asset_large_class = '${param.class}'] @[and block_name in ${param.blockNames}] GROUP BY nf, asset_large_class ) as t1 UNION SELECT disp_name as name, disp_year as year, disp_unit as unit, disp_type as type, disp_value as value FROM (SELECT '资产处置' as disp_name, nf as disp_year, '全市' as disp_unit, asset_large_class as disp_type, round(sum(asset_value) / 10000, 2) as disp_value FROM CAS_FUS_SJ_ASSET_BL_DISPOSAL_I_Y WHERE 1=1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND asset_large_class = '${param.class}'] @[and block_name in ${param.blockNames}] GROUP BY nf, asset_large_class UNION SELECT '资产处置' as disp_name, nf as disp_year, '全市' as disp_unit, asset_large_class as disp_type, round(sum(asset_value) / 10000, 2) as disp_value FROM CAS_FUS_SJ_ASSET_BL_DISPOSAL_I_Y WHERE 1=1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND asset_large_class = '${param.class}'] @[and block_name in ${param.blockNames}] GROUP BY nf, asset_large_class ) as t2";
  } else if (req.code) {
    sqlTemplate = "SELECT add_name as name, add_year as year, add_unit as unit, add_type as type, add_value as value FROM (SELECT '资产新增' as add_name, nf as add_year, dept_name as add_unit, '全部' as add_type, round(sum(asset_value) / 10000, 2) as add_value FROM CAS_FUS_SJ_ASSET_BL_ADD_I_Y WHERE 1=1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND dept_code = '${param.code}'] @[and block_name in ${param.blockNames}] GROUP BY nf, dept_name UNION SELECT '资产新增' as add_name, nf as add_year, unit_name as add_unit, '全部' as add_type, round(sum(asset_value) / 10000, 2) as add_value FROM CAS_FUS_SJ_ASSET_BL_ADD_I_Y WHERE 1=1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND unit_code = '${param.code}'] @[and block_name in ${param.blockNames}] GROUP BY nf, unit_name ) as t1 UNION SELECT disp_name as name, disp_year as year, disp_unit as unit, disp_type as type, disp_value as value FROM (SELECT '资产处置' as disp_name, nf as disp_year, dept_name as disp_unit, '全部' as disp_type, round(sum(asset_value) / 10000, 2) as disp_value FROM CAS_FUS_SJ_ASSET_BL_DISPOSAL_I_Y WHERE 1=1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND dept_code = '${param.code}'] @[and block_name in ${param.blockNames}] GROUP BY nf, dept_name UNION SELECT '资产处置' as disp_name, nf as disp_year, unit_name as disp_unit, '全部' as disp_type, round(sum(asset_value) / 10000, 2) as disp_value FROM CAS_FUS_SJ_ASSET_BL_DISPOSAL_I_Y WHERE 1=1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND unit_code = '${param.code}'] @[and block_name in ${param.blockNames}] GROUP BY nf, unit_name ) as t2";
  }

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: sqlTemplate,
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getAssertsChartThree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAssertsChartThree dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData, inputYear) {
    // 将输入年份转为数值型
    const startYear = parseInt(inputYear, 10);
  
    // 生成xAxis，从给定年份向前推4年，并将年份转换为字符串
    const years = Array.from({ length: 5 }, (_, i) =>
      (startYear - 4 + i).toString()
    );
  
    // Generate the xAxis array with the latest year and the previous four years
    const xAxis = years;
  
    // Initialize the seriesData with empty data arrays for "资产新增" and "资产处置"
    const seriesData = [
      { name: "资产新增", data: [] },
      { name: "资产处置", data: [] },
    ];
  
    // Group the inputData by name ("资产新增" or "资产处置")
    const groupedData = inputData.reduce((acc, item) => {
      if (!acc[item.name]) acc[item.name] = [];
      acc[item.name].push(item);
      return acc;
    }, {});
  
    // Get the first item from inputData to use as a fallback
    const fallbackItem = inputData[0] || { unit: "", type: "", value: 0 };
  
    // Iterate through each type ("资产新增" and "资产处置") and fill the seriesData arrays
    seriesData.forEach((seriesItem) => {
      const data = groupedData[seriesItem.name] || [];
  
      xAxis.forEach((year) => {
        const entry = data.find((item) => item.year === year);
  
        if (entry) {
          seriesItem.data.push({
            name: entry.unit,
            moneyType: entry.type,
            value: entry.value,
          });
        } else {
          // Fill missing year with fallback data
          seriesItem.data.push({
            name: fallbackItem.unit,
            moneyType: fallbackItem.type,
            value: 0,
          });
        }
      });
    });
  
    // Construct the final result
    const result = {
      legend: ["资产新增", "资产处置"],
      xAxis,
      yAxis: {
        name: "资产金额（万元）",
      },
      seriesData,
    };
  
    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getAssertsChartThree res: ", JSON.stringify(res));
  return res;
}

//当前资产排行榜（按主管单位）  横向柱状图
export async function getAssertsChartFour(req) {
  // 打印视图层的入参请求
  console.log("getAssertsChartFour req", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select dept_code as code, dept_name as name, sum(round(asset_value/10000, 2)) as value from CAS_FUS_SJ_ASSET_LARGE_CLASS_DISTR_I_Y where 1=1 @[and block_name in ${param.blockNameIn}] @[and asset_type in ${param.assetTypeIn}] group by dept_name order by value asc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getAssertsChartFour dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAssertsChartFour dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    // 提取 yAxis 列表
    const yAxis = data.map((item) => item.name);

    // 计算总值
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    // 计算 seriesData 列表，并计算平均值
    const seriesData = data.map((item) => ({
      per: ((item.value / totalValue) * 100).toFixed(2),
      value: item.value,
      code: item.code,
    }));

    // 计算 averageValue
    const averageValue = totalValue / data.length;

    // 构造结果对象
    return {
      yAxis: yAxis,
      seriesData: seriesData,
      averageValue: averageValue,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAssertsChartFour res: ", JSON.stringify(res));
  return res;
}

//业务板块下拉框
export async function getAssertsChartFourOptions(req) {
  // 打印视图层的入参请求
  console.log("getAssertsChartFourOptions req", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select unit_industry_name as label, unit_industry_name as value from CAS_FUS_SJ_XZSYDW_BKFX_OVERVIEW_BK_I_Y where 1=1 @[and budget_year = '${param.year}'] @[and q_finance_area_code = '${param.financeAreaCode}'] order by headcount desc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getAssertsChartFourOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAssertsChartFourOptions dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    return data;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAssertsChartFourOptions res: ", JSON.stringify(res));
  return res;
}

//主管单位特定资产分布情况） 环形图
export async function getAssertsChartFive(req) {
  // 打印视图层的入参请求
  console.log("getAssertsChartFive req", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select asset_type as type, sum(round(asset_value/10000, 2)) as value from CAS_FUS_SJ_ASSET_LARGE_CLASS_DISTR_I_Y where dept_code = '${param.deptCode}' group by asset_type order by value desc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getAssertsChartFive dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAssertsChartFive dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    // 计算总值
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // 计算 seriesData 列表，并按要求生成 rate 值
    const seriesData = data.map((item) => ({
      value: item.value,
      type: item.type,
      rate: ((item.value / total) * 100).toFixed(2),
    }));

    // 构造结果对象
    return {
      total: total,
      seriesData: seriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAssertsChartFive res: ", JSON.stringify(res));
  return res;
}

//主管单位历年趋势 折线图
export async function getAssertsChartSix(req) {
  // 打印视图层的入参请求
  console.log("getAssertsChartSix req", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select '资产处置' as name, nf as year,count(1) as count, sum(round(type_asset_value/10000, 2)) as data from CAS_FUS_SJ_ASSET_TYPE_DISPOSAL_I_Y where dept_code = '${param.deptCode}' @[and asset_type = '${param.assetType}'] @[and nf between ${param.year} - 4 and ${param.year}] group by nf union select '资产新增' as name, nf as year,count(1) as count, sum(round(type_asset_value/10000, 2)) as data from CAS_FUS_SJ_ASSET_TYPE_ADD_I_Y where dept_code = '${param.deptCode}' @[and asset_type = '${param.assetType}'] @[and nf between ${param.year} - 4 and ${param.year}] group by nf",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getAssertsChartSix dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAssertsChartFive dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData, inputYear) {
    const legend = ["资产新增", "资产处置"];
    const xAxis = Array.from({ length: 5 }, (_, i) =>
      (parseInt(inputYear, 10) - 4 + i).toString()
    );
    const yAxis = {name: "资产金额（万元）"};
  
    // 构建 seriesData 列表
    const seriesData = legend.map(name => {
      const filteredData = inputData.filter(item => item.name === name);
      
      // 计算当前类型的所有年份的 data 总和
      const totalData = filteredData.reduce((sum, item) => sum + item.data, 0);
  
      const seriesItem = {
        name: name,
        count: filteredData.reduce((sum, item) => sum + item.count, 0),
        rate: [],
        data: []
      };
  
      // 构建 rate 和 data 列表
      xAxis.forEach(year => {
        const yearData = filteredData.find(item => item.year === year);
        if (yearData) {
          seriesItem.data.push(yearData.data);
          // 计算 rate 为当年 data 除以所有年份 data 总和，并保留两位小数
          seriesItem.rate.push(Number(((yearData.data / totalData) * 100).toFixed(2)));
        } else {
          seriesItem.data.push(0); // 如果没有数据，则默认 data 为 0
          seriesItem.rate.push(0.00); // 如果没有数据，则默认 rate 为 0.00
        }
      });
  
      return seriesItem;
    });
  
    // 构造最终结果对象
    return {
      legend: legend,
      xAxis: xAxis,
      yAxis: yAxis,
      seriesData: seriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getAssertsChartSix res: ", JSON.stringify(res));
  return res;
}
