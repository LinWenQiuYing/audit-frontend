import axiosInstance from "../index.js";

const blockUrl = "/pierce/dacp/invoke";

// ------三公tab
//三公数据概览
export async function getPublicOverviewData(req) {
  // 打印视图层的入参请求
  console.log("getPublicOverviewData req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select uuid() as id, concat(trim(a.sg_type_name), '（元）') as typeName, round(a.actual_pay_amount, 2) as num, a.actual_pay_amount / b.actual_pay_amount as percentage, case when a.actual_pay_amount / b.actual_pay_amount>0 then 1 when a.actual_pay_amount / b.actual_pay_amount <= 0 then 0 else 2 end as status, trim(a.sg_type_name) as icon from (select sg_type_name, sum(actual_pay_amount) as actual_pay_amount from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y where 1 = 1 @[and nf = ${param.year}] @[and unit_industry_name in ${param.unitIndustry}] group by sg_type_name union all select '三公支出总额' as sg_type_name, sum(actual_pay_amount) as actual_pay_amount from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y where nf = ${param.year} @[and unit_industry_name in ${param.unitIndustry}]) a left join (select sg_type_name, sum(actual_pay_amount) as actual_pay_amount from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y where 1 = 1 @[and nf = ${param.year}-1] @[and unit_industry_name in ${param.unitIndustry}] group by sg_type_name union all select '三公支出总额' as sg_type_name, sum(actual_pay_amount) as actual_pay_amount from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y where nf = ${param.year}-1 @[and unit_industry_name in ${param.unitIndustry}]) b on a.sg_type_name = b.sg_type_name;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicOverviewData dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicOverviewData dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: "失败 " + dacpRes.message,
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
  console.log("getPublicOverviewData res: ", JSON.stringify(res));
  return res;
}

//三公费用分布饼图
export async function getPublicChartOne(req) {
  // 打印视图层的入参请求
  console.log("getPublicChartOne req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select name, round(value, 2) as value from (select trim(sg_type_name) as name, sum(actual_pay_amount) as value from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y where 1 = 1 @[and nf = ${param.year}] @[and unit_industry_name in ${param.unitIndustry}] group by sg_type_name)aaa union all select '三公支出总额' as name, round(sum(actual_pay_amount), 2) as value from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y where 1 = 1 @[and nf = ${param.year}] @[and unit_industry_name in ${param.unitIndustry}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicChartOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicChartOne dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: "失败 " + dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData) {
    // Find the total value
    let total = 0;
    for (let i = 0; i < inputData.length; i++) {
      if (inputData[i].name === "三公支出总额") {
        total = inputData[i].value;
        break;
      }
    }

    // Calculate percentages and format the output
    let seriesData = [];
    for (let i = 0; i < inputData.length; i++) {
      if (inputData[i].name !== "三公支出总额") {
        let per = ((inputData[i].value / total) * 100).toFixed(2);
        seriesData.push({
          value: parseFloat(inputData[i].value.toFixed(2)),
          name: inputData[i].name,
          per: parseFloat(per),
        });
      }
    }

    // Prepare the result object
    let result = {
      total: parseFloat(total.toFixed(2)),
      seriesData: seriesData,
    };

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getPublicChartOne res: ", JSON.stringify(res));
  return res;
}

//获取所有主管单位
export async function getPublicManageTree(req) {
  // 打印视图层的入参请求
  console.log("getPublicManageTree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT distinct CONCAT(dept_code, '——', dept_name) as `key`, dept_code as value FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y WHERE 1=1 @[and nf = ${param.year}] @[and unit_industry_name in ${param.unitIndustry}] @[and sg_type_name = '${param.sgTypeName}'] ORDER BY dept_code;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicManageTree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicManageTree dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: "失败 " + dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getPublicManageTree res: ", JSON.stringify(res));
  return res;
}

//获取月趋势图的top8主管单位
export async function getPublicTop8Month(req) {
  // 打印视图层的入参请求
  console.log("getPublicTop8Month req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select dept_name, dept_code, round(sum(actual_pay_amount), 2) as actual_pay_amount_total from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y where 1 = 1 @[and nf = ${param.year} ] @[and unit_industry_name in ${param.unitIndustry}] @[and sg_type_name = '${param.sgTypeName}'] group by dept_name, dept_code order by actual_pay_amount_total desc limit 8;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicTop8Month dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicTop8Month dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: "失败 " + dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    let deptCodes = [];
    for (let i = 0; i < data.length; i++) {
      deptCodes.push(data[i].dept_code);
    }

    return deptCodes;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getPublicTop8Month res: ", JSON.stringify(res));
  return res;
}

let yearTotalParams = "";

export function setYearTotal(value) {
  yearTotalParams = value;
}

//三公费用分布月趋势图
export async function getPublicChartTwo(req) {
  // 打印视图层的入参请求
  console.log("getPublicChartTwo req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select * from (select dept_name as name, dept_code, nf, sg_type_name, pay_month, round(sum(actual_pay_amount),2) as actual_pay_amount_total from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y where 1=1 @[and nf = ${param.year}] @[and unit_industry_name in ${param.unitIndustry}] @[and sg_type_name = '${param.sgTypeName}'] group by dept_name,dept_code,nf,pay_month) as aaa where 1=1 @[and dept_code in ${param.dept_code}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicChartTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicChartTwo dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: "失败 " + dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData, yearTotal) {
    // 初始化结果对象
    let result = {
      legend: [],
      xAxis: [
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
      ],
      yAxis: { name: "金额" },
      seriesData: [],
      yearMoney: yearTotal || 0,
    };

    // 使用一个对象来按照 name 分组数据
    let map = {};

    // 遍历输入数据，按 name 分组
    for (let i = 0; i < inputData.length; i++) {
      let item = inputData[i];
      let name = item.name;
      let monthIndex = parseInt(item.pay_month.split("-")[1], 10) - 1; // 提取月份的索引（0-11）
      let amount = parseFloat(item.actual_pay_amount_total.toFixed(2)); // 保留两位小数

      // 如果 name 在 map 中不存在，则创建一个新的条目
      if (!map[name]) {
        map[name] = {
          name: name,
          data: new Array(12).fill(0),
          totalAmount: 0,
        };
      }

      // 更新每月的金额和总金额
      map[name].data[monthIndex] += amount;
      map[name].totalAmount += amount;
    }

    // 遍历 map，计算 rate 并生成 seriesData
    for (let key in map) {
      if (map.hasOwnProperty(key)) {
        let value = map[key];
        let rate = new Array(12);
        let totalAmount = yearTotal || 0;

        for (let j = 0; j < value.data.length; j++) {
          if (totalAmount > 0) {
            rate[j] = parseFloat(
              ((value.data[j] / totalAmount) * 100).toFixed(2)
            ); // 保留两位小数
          } else {
            rate[j] = 0;
          }
        }

        // 将 name 加入到 legend
        result.legend.push(key);

        // 将条目添加到 seriesData
        result.seriesData.push({
          name: key,
          data: value.data,
          rate: rate,
        });
      }
    }

    return result;
  }
  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, yearTotalParams),
  };
  console.log("getPublicChartTwo res: ", JSON.stringify(res));
  return res;
}

export function getYearMoney(yearMoney) {
  return yearMoney;
}

//获取年趋势图的top8主管单位
export async function getPublicTop8Year(req) {
  // 打印视图层的入参请求
  console.log("getPublicTop8Year req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select dept_name, dept_code, sum(actual_pay_amount) as actual_pay_amount_total from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y where 1 = 1 @[and nf between ${param.year} - 4 AND ${param.year} ] @[and unit_industry_name in ${param.unitIndustry}] @[and sg_type_name = '${param.sgTypeName}'] group by dept_name, dept_code order by actual_pay_amount_total desc limit 8;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicTop8Year dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicTop8Year dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: "失败 " + dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    return data.map((item) => item.dept_code);
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getPublicTop8Year res: ", JSON.stringify(res));
  return res;
}

let plateYearTotalParams = "";

export function setPlateYearTotal(value) {
  plateYearTotalParams = value;
}

//三公费用分布年趋势图
export async function getPublicChartThree(req) {
  // 打印视图层的入参请求
  console.log("getPublicChartThree req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select * from (select dept_name, dept_code, nf, round(sum(actual_pay_amount), 2) as actual_pay_amount_total from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y where 1 = 1 @[and nf between ${param.year}-4 and ${param.year}] @[and unit_industry_name in ${param.unitIndustry}] @[and sg_type_name = '${param.sgTypeName}'] group by dept_name, dept_code, nf) as aaa where 1 = 1 @[and dept_code in ${param.dept_code}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicChartThree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicChartThree dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: "失败 " + dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData, year, plateYearMoney) {
    // 生成 xAxis（5年范围）
    const xAxis = Array.from({ length: 5 }, (_, i) => String(year - 4 + i));

    const result = {
      legend: [],
      xAxis: xAxis,
      yAxis: {
        name: "金额",
      },
      seriesData: [],
      plateYearMoney: plateYearMoney || 0,
    };

    // 初始化映射
    const yearTotalAmountMap = {};

    // 填充年份和总金额映射
    inputData.forEach((item) => {
      if (!yearTotalAmountMap[item.nf]) {
        yearTotalAmountMap[item.nf] = 0;
      }
      yearTotalAmountMap[item.nf] += item.actual_pay_amount_total || 0;
    });

    // 提取主管单位名称到 legend
    inputData.forEach((item) => {
      if (!result.legend.includes(item.dept_name)) {
        result.legend.push(item.dept_name);
      }
    });

    // 转换数据
    result.legend.forEach((legendItem) => {
      const seriesItem = {
        name: legendItem,
        data: [],
        rate: [],
      };

      xAxis.forEach((year) => {
        const item = inputData.find(
          (item) => item.dept_name === legendItem && item.nf === year
        );
        const yearTotal = plateYearMoney || 0; // 使用传入的 plateYearMoney
        const value = item ? item.actual_pay_amount_total || 0 : 0;
        const rate = yearTotal ? (value / yearTotal) * 100 : 0;

        seriesItem.data.push(parseFloat(value.toFixed(2)));
        seriesItem.rate.push(parseFloat(rate.toFixed(2)));
      });

      result.seriesData.push(seriesItem);
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year, plateYearTotalParams),
  };
  console.log("getPublicChartThree res: ", JSON.stringify(res));
  return res;
}

export function getPlateYearMoney(plateYearMoney) {
  return plateYearMoney;
}

//三公费用横向柱状图数据
export async function getPublicChartFour(req) {
  // 打印视图层的入参请求
  console.log("getPublicChartFour req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT l1a.dept_name, l1a.dept_code, l1a.nf, ROUND(SUM(l1a.actual_pay_amount / l1c.hc), 2) AS pay_avage, ROUND(SUM(l1a.actual_pay_amount), 2) AS actual_pay_amount_total, l1c.hc, l2d.average_value FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y AS l1a LEFT JOIN (SELECT nf, dept_id, dept_code, SUM(unit_active_headcount) AS hc FROM (SELECT nf, unit_id, unit_code, dept_id, dept_code, unit_active_headcount FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y GROUP BY nf, unit_id, unit_code, dept_id, dept_code, unit_active_headcount ) AS l1b GROUP BY nf, dept_id, dept_code ) AS l1c ON l1a.dept_id = l1c.dept_id LEFT JOIN (SELECT l2a.nf, ROUND(SUM(l2a.actual_pay_amount / l2c.hc), 2) AS average_value FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y AS l2a LEFT JOIN (SELECT nf, SUM(unit_active_headcount) AS hc FROM (SELECT unit_industry_name, nf, unit_active_headcount FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y GROUP BY unit_industry_name, nf, unit_active_headcount ) AS l2b WHERE 1=1 @[and l2b.unit_industry_name in ${param.unitIndustry}] GROUP BY l2b.nf ) AS l2c ON l2a.nf = l2c.nf WHERE 1 = 1 @[and l2a.nf BETWEEN ${param.year} - 4 AND ${param.year}] @[and l2a.unit_industry_name IN ${param.unitIndustry}] @[and l2a.sg_type_name = '${param.sgTypeName}'] GROUP BY l2a.nf ) AS l2d on l1a.nf = l2d.nf WHERE 1 = 1 @[AND l1a.nf = ${param.year}] @[AND l1a.unit_industry_name IN ${param.unitIndustry}] @[AND l1a.sg_type_name = '${param.sgTypeName}'] GROUP BY l1a.dept_name, l1a.dept_code, l1a.nf, l1c.hc, l2d.average_value ORDER BY pay_avage DESC;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicChartFour dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicChartFour dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: "失败 " + dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData){

    inputData.forEach(item => {
        if(item.pay_avage == null){
            item.pay_avage = 0;
        }
    });

    let blockMoneyTotal = 0;
    let blockHcTotal = 0;
    let moneyListMax = -Infinity;
    const result = {
        moneyList:[],
        moneyListMax: 0,
        averageValue: 0
    };

    inputData.forEach(item => {
        blockMoneyTotal += item.actual_pay_amount_total;
        blockHcTotal += item.hc;
        result.moneyList.push({
            name: item.dept_name,
            personNum: item.hc,
            moneyTotal: item.actual_pay_amount_total,
            personMoney: item.pay_avage
        });
        moneyListMax = Math.max(moneyListMax, item.pay_avage);
    });

    result.moneyListMax = moneyListMax;
    result.averageValue = Number((blockMoneyTotal / blockHcTotal).toFixed(2));

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getPublicChartFour res: ", JSON.stringify(res));
  return res;
}

let choosedRange = "全部";
export function changeChoosedRange(value) {
  choosedRange = value;
}
//三公费用某个主管单位年趋势图
export async function getPublicChartFive(req) {
  // 打印视图层的入参请求
  console.log("getPublicChartFive req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      choosedRange === "全部"
        ? "SELECT 'block' AS type, '板块' AS name, a.nf, ROUND(SUM(a.actual_pay_amount / c.hc), 2) AS pay_avage, FORMAT(c.hc, 0) AS hc, '全部' AS sg_type_name, ROUND(SUM(a.actual_pay_amount), 2) AS total FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y AS a LEFT JOIN (SELECT nf, SUM(unit_active_headcount) AS hc FROM (SELECT unit_industry_name, nf, unit_active_headcount FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y GROUP BY unit_industry_name, nf, unit_active_headcount ) AS b WHERE 1 = 1 @[and b.unit_industry_name IN ${param.unitIndustry}] GROUP BY nf ) AS c ON a.nf = c.nf WHERE 1 = 1 @[AND a.nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND a.unit_industry_name IN ${param.unitIndustry}] GROUP BY a.nf, c.hc union all select 'unit' as type, a.dept_name as name, a.nf, round(sum(a.actual_pay_amount / c.hc), 2) AS pay_avage, format(c.hc, 0) as hc, '全部' as sg_type_name, round(sum(a.actual_pay_amount), 2) as total from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y as a left join (select nf, dept_id, dept_code, sum(unit_active_headcount) as hc from (select nf, unit_id, unit_code, dept_id, dept_code, unit_active_headcount from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y group by nf, unit_id, unit_code, dept_id, dept_code, unit_active_headcount) as b group by nf, dept_id, dept_code) as c on a.dept_id = c.dept_id WHERE 1 = 1 @[AND a.nf between ${param.year} - 4 and ${param.year}] @[AND a.unit_industry_name IN ${param.unitIndustry}] @[and a.dept_name = '${param.deptName}'] group by a.dept_name, a.nf, c.hc"
        : "SELECT 'block' AS type, '板块' AS name, a.nf, ROUND(SUM(a.actual_pay_amount / c.hc), 2) AS pay_avage, FORMAT(c.hc, 0) AS hc, a.sg_type_name, ROUND(SUM(a.actual_pay_amount), 2) AS total FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y AS a LEFT JOIN (SELECT nf, SUM(unit_active_headcount) AS hc FROM (SELECT unit_industry_name, nf, unit_active_headcount FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y GROUP BY unit_industry_name, nf, unit_active_headcount ) AS b WHERE 1 = 1 @[and b.unit_industry_name IN ${param.unitIndustry}] GROUP BY nf ) AS c ON a.nf = c.nf WHERE 1 = 1 @[AND a.nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND a.unit_industry_name IN ${param.unitIndustry}] @[and a.sg_type_name = '${param.sgTypeName}'] GROUP BY a.nf, c.hc, a.sg_type_name union all select 'unit' as type, a.dept_name as name, a.nf, round(sum(a.actual_pay_amount / c.hc), 2) AS pay_avage, format(c.hc, 0) as hc, a.sg_type_name, round(sum(a.actual_pay_amount), 2) as total from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y as a left join (select nf, dept_id, dept_code, sum(unit_active_headcount) as hc from (select nf, unit_id, unit_code, dept_id, dept_code, unit_active_headcount from CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y group by nf, unit_id, unit_code, dept_id, dept_code, unit_active_headcount) as b group by nf, dept_id, dept_code) as c on a.dept_id = c.dept_id WHERE 1 = 1 @[AND a.nf between ${param.year} - 4 and ${param.year}] @[AND a.unit_industry_name IN ${param.unitIndustry}] @[and a.sg_type_name = '${param.sgTypeName}'] @[and a.dept_name = '${param.deptName}'] group by a.dept_name, a.nf, c.hc, a.sg_type_name;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicChartFive dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicChartFive dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: "失败 " + dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData, inputYear) {
    // 将输入年份转换为数值型
    const startYear = parseInt(inputYear, 10);

    // 生成 xAxis，从给定年份往前推4年，年份保持为字符串类型
    const xAxis = Array.from({ length: 5 }, (_, i) =>
      (startYear - 4 + i).toString()
    );

    // 提取所有的 legend 和 seriesData
    const legendSet = new Set();
    const seriesDataMap = {};
    let plateYearMoney = 0;

    inputData.forEach((item) => {
      const name = item.type === "block" ? "板块" : item.name;
      legendSet.add(name);

      if (!seriesDataMap[name]) {
        seriesDataMap[name] = {
          name: name,
          data: Array(5)
            .fill()
            .map(() => ({
              personNum: 0,
              moneyType: item.sg_type_name.trim(),
              moneyTotal: 0,
              value: 0,
            })),
        };
      }

      const yearIndex = xAxis.indexOf(item.nf);
      if (yearIndex !== -1) {
        seriesDataMap[name].data[yearIndex] = {
          personNum: parseInt(item.hc.replace(/,/g, ""), 10) || 0,
          moneyType: item.sg_type_name.trim(),
          moneyTotal: item.total || 0,
          value: item.pay_avage || 0,
        };

        // 如果类型是block，将total赋值给plateYearMoney
        if (item.type === "block") {
          plateYearMoney = item.total;
        }
      }
    });

    const legend = Array.from(legendSet);
    const seriesData = Object.values(seriesDataMap);

    return {
      legend,
      xAxis,
      yAxis: { name: "人均费用（元）" },
      seriesData,
      plateYearMoney,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getPublicChartFive res: ", JSON.stringify(res));
  return res;
}
