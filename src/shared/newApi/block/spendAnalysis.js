import axiosInstance from "../index.js";

const blockUrl = "/pierce/dacp/invoke";

//------支出tab

//支出概览
export async function getSpendOverview(req) {
  // 打印视图层的入参请求
  console.log("getSpendOverview req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT '1' AS budgetAmountTotalId, '预算金额(万元)' AS budgetAmountTotalTypeName, ROUND(SUM(budget_amount_total) / 10000, 2) AS budgetAmountTotalNum, ABS(ROUND(SUM(budget_amount_total) / SUM(budget_amount_total_ly), 4 ) ) * 100 AS budgetAmountTotalPercentage, CASE WHEN SUM(budget_amount_total) / SUM(budget_amount_total_ly) < 0 THEN 0 WHEN SUM(budget_amount_total) / SUM(budget_amount_total_ly) >= 0 THEN 1 ELSE 2 END AS budgetAmountTotalStatus, '预算金额' AS budgetAmountTotalIcon, '2' AS actualPayAmountId, '执行金额(万元)' AS actualPayAmountTypeName, ROUND(SUM(actual_pay_amount_total) / 10000, 2) AS actualPayAmountNum, ABS(ROUND(SUM(actual_pay_amount_total) / SUM(actual_pay_amount_total_ly), 4 ) ) * 100 AS actualPayAmountPercentage, CASE WHEN SUM(actual_pay_amount_total) / SUM(actual_pay_amount_total_ly) < 0 THEN 0 WHEN SUM(actual_pay_amount_total) / SUM(actual_pay_amount_total_ly) >= 0 THEN 1 ELSE 2 END AS actualPayAmountStatus, '执行金额' AS actualPayAmountIcon, '3' AS executeRateId, '执行率(%)' AS executeRateTypeName, ROUND(ROUND(AVG(execute_rate), 4) * 100,2) AS executeRateNum, ROUND(ABS(ROUND(AVG(execute_rate) - AVG(execute_rate_ly) / AVG(execute_rate_ly) , 4) ) * 100, 2 ) AS executeRatePercentage, CASE WHEN SUM(execute_rate) / SUM(execute_rate_ly) < 0 THEN 0 WHEN SUM(execute_rate) / SUM(execute_rate_ly) >= 0 THEN 1 ELSE 2 END AS executeRateStatus, '执行率' AS executeRateIcon, '4' AS cntProId, '项目数(个)' AS cntProTypeName, SUM(cnt_pro) AS cntProNum, ABS(ROUND(SUM(cnt_pro) / SUM(cnt_pro_ly), 4)) * 100 AS cntProPercentage, CASE WHEN SUM(cnt_pro) / SUM(cnt_pro_ly) < 0 THEN 0 WHEN SUM(cnt_pro) / SUM(cnt_pro_ly) >= 0 THEN 1 ELSE 2 END AS cntProStatus, '项目数' AS cntProIcon, '5' AS headcountId, '人员数(人)' AS headcountTypeName, SUM(headcount) AS headcountNum, ABS(ROUND(SUM(headcount) / SUM(headcount_ly), 4)) * 100 AS headcountPercentage, CASE WHEN SUM(headcount) / SUM(headcount_ly) < 0 THEN 0 WHEN SUM(headcount) / SUM(headcount_ly) >= 0 THEN 1 ELSE 2 END AS headcountStatus, '人员数' AS headcountIcon, '6' AS avgPayAmountId, '人均支出金额(万元)' AS avgPayAmountTypeName, ROUND(AVG(avg_pay_amount) / 10000,2) AS avgPayAmountNum, ABS(ROUND(SUM(avg_pay_amount) / SUM(avg_pay_amount_ly), 4) ) * 100 AS avgPayAmountPercentage, CASE WHEN SUM(avg_pay_amount) / SUM(avg_pay_amount_ly) < 0 THEN 0 WHEN SUM(avg_pay_amount) / SUM(avg_pay_amount_ly) >= 0 THEN 1 ELSE 2 END AS avgPayAmountStatus, '人均支出金额' AS avgPayAmountIcon FROM CAS_FUS_SJ_XZSYDW_BKFX_OVERVIEW_BK_I_Y WHERE 1 = 1 AND budget_year = ${param.year} @[and unit_industry_name in ${param.unitIndustry}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendOverview dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendOverview dacpRes: ", JSON.stringify(dacpRes));

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
    const spendData = [
      {
        id: parseInt(data.budgetAmountTotalId),
        typeName: data.budgetAmountTotalTypeName,
        num: data.budgetAmountTotalNum,
        percentage: data.budgetAmountTotalPercentage
          ? data.budgetAmountTotalPercentage
          : "--",
        status: data.budgetAmountTotalStatus,
        icon: data.budgetAmountTotalIcon,
      },
      {
        id: parseInt(data.actualPayAmountId),
        typeName: data.actualPayAmountTypeName,
        num: data.actualPayAmountNum,
        percentage: data.actualPayAmountPercentage
          ? data.actualPayAmountPercentage
          : "--",
        status: data.actualPayAmountStatus,
        icon: data.actualPayAmountIcon,
      },
      {
        id: parseInt(data.executeRateId),
        typeName: data.executeRateTypeName,
        num: data.executeRateNum,
        percentage: data.executeRatePercentage
          ? data.executeRatePercentage
          : "--",
        status: data.executeRateStatus,
        icon: data.executeRateIcon,
      },
      {
        id: parseInt(data.cntProId),
        typeName: data.cntProTypeName,
        num: data.cntProNum,
        percentage: data.cntProPercentage ? data.cntProPercentage : "--",
        status: data.cntProStatus,
        icon: data.cntProIcon,
      },
      {
        id: parseInt(data.headcountId),
        typeName: data.headcountTypeName,
        num: data.headcountNum,
        percentage: data.headcountPercentage ? data.headcountPercentage : "--",
        status: data.headcountStatus,
        icon: data.headcountIcon,
      },
      {
        id: parseInt(data.avgPayAmountId),
        typeName: data.avgPayAmountTypeName,
        num: data.avgPayAmountNum,
        percentage: data.avgPayAmountPercentage
          ? data.avgPayAmountPercentage
          : "--",
        status: data.avgPayAmountStatus,
        icon: data.avgPayAmountIcon,
      },
    ];

    return spendData;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data[0]),
  };
  console.log("getSpendOverview res: ", JSON.stringify(res));
  return res;
}

// 获取支出均衡性所有主管单位
export async function getSpendManageTree(req) {
  // 打印视图层的入参请求
  console.log("getSpendManageTree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT CONCAT(dept_code,'--',dept_name) as `key`, dept_code as value FROM CAS_FUS_SJ_XZSYDW_BKFX_PAY_BALANCE_I_M WHERE exep_year = ${param.year} and dept_code is not null @[and unit_industry_name in ${param.unitIndustry}] order by dept_code asc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendManageTree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendManageTree dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
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
  console.log("getSpendManageTree res: ", JSON.stringify(res));
  return res;
}

//这边还要加一个接口，初始获取top8主管单位的id数组
export async function getSpendManageTreeTop8(req) {
  // 打印视图层的入参请求
  console.log("getSpendManageTreeTop8 req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select t1.dept_code from (SELECT dept_code FROM CAS_FUS_SJ_XZSYDW_BKFX_PAY_BALANCE_I_M WHERE exep_year = ${param.year} @[and unit_industry_name in ${param.unitIndustry}] GROUP BY dept_code ORDER BY SUM(actual_pay_dept_amount_y) DESC LIMIT 8) as t1 order by t1.dept_code asc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendManageTreeTop8 dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendManageTreeTop8 dacpRes: ", JSON.stringify(dacpRes));

  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data.map((item) => item.dept_code);
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendManageTreeTop8 res: ", JSON.stringify(res));
  return res;
}

///整体指出均衡性
export async function getSpendChartOne(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartOne req", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select exep_year as year, exep_month as month, name, name as code, money, totalMoney, 'block' as type from (SELECT exep_year, unit_industry_name as name, exep_month, max(actual_pay_industry_amount_m)/ 10000 as money, max(actual_pay_industry_amount_y)/ 10000 as totalMoney FROM CAS_FUS_SJ_XZSYDW_BKFX_PAY_BALANCE_I_M WHERE 1 = 1 and left(exep_month, 4) = exep_year @[and exep_year = '${param.exep_year}'] @[and unit_industry_name IN ${param.unit_industry_name}] GROUP BY exep_year, exep_month, unit_industry_name) AS aaa UNION ALL SELECT exep_year as year, exep_month as month, dept_name as name, dept_code as code, actual_pay_dept_amount_m / 10000 as money, actual_pay_dept_amount_y / 10000 as totalMoney, 'unit' as type FROM CAS_FUS_SJ_XZSYDW_BKFX_PAY_BALANCE_I_M WHERE 1 = 1 and left(exep_month, 4) = exep_year @[and exep_year = '${param.exep_year}'] @[and dept_code in ${param.code}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendChartOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartOne dacpRes: ", JSON.stringify(dacpRes));

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
    const legend = [];
    const monthsSet = new Set();
    const seriesData = [];

    // 获取所有type为block的不同name
    const blockNames = [
      ...new Set(
        data.filter((item) => item.type === "block").map((item) => item.name)
      ),
    ];
    const blockDataName = blockNames.join("，");

    // 收集所有月份
    data.forEach((item) => {
      monthsSet.add(item.month);
    });

    // 将月份集合转换为数组并按字典序排序
    const xAxis = Array.from(monthsSet).sort();

    const blockData = {
      name: blockDataName,
      type: "block",
      data: {
        totalMoney: 0,
        money: new Array(xAxis.length).fill(0),
        rate: new Array(xAxis.length).fill(0),
      },
    };

    const totalMoneyMap = {};

    data.forEach((item) => {
      const monthIndex = xAxis.indexOf(item.month);

      if (item.type === "block") {
        blockData.data.money[monthIndex] += item.money;
        blockData.data.totalMoney += item.money;
      } else {
        if (!totalMoneyMap[item.name]) {
          totalMoneyMap[item.name] = 0;
        }
        totalMoneyMap[item.name] += item.money;
      }
    });

    // 计算blockData的rate
    blockData.data.rate = blockData.data.money.map((money) =>
      Number((money / blockData.data.totalMoney) * 100).toFixed(2)
    );
    blockData.data.money = blockData.data.money.map((money) =>
      Number(money).toFixed(2)
    );
    blockData.data.totalMoney = Number(blockData.data.totalMoney).toFixed(2);
    seriesData.push(blockData);

    const seriesMap = {};

    data.forEach((item) => {
      if (item.type === "unit") {
        if (!seriesMap[item.name]) {
          seriesMap[item.name] = {
            name: item.name,
            type: item.type,
            data: {
              totalMoney: Number(totalMoneyMap[item.name]).toFixed(2),
              money: new Array(xAxis.length).fill(0),
              rate: new Array(xAxis.length).fill(0),
            },
          };
          seriesData.push(seriesMap[item.name]);
        }

        const monthIndex = xAxis.indexOf(item.month);
        seriesMap[item.name].data.money[monthIndex] = Number(
          item.money
        ).toFixed(2);
        seriesMap[item.name].data.rate[monthIndex] = Number(
          (item.money / totalMoneyMap[item.name]) * 100
        ).toFixed(2);
      }
    });

    // 收集legend信息
    seriesData.forEach((series) => {
      legend.push(series.name);
    });

    return {
      legend,
      xAxis,
      seriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendChartOne res: ", JSON.stringify(res));
  return res;
}

//按资金来源环形图数据
export async function getSpendChartTwo(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT ROUND(SUM(actual_pay_amount_fund_nature_y) / 10000,2) as value, fund_nature_name as name FROM CAS_FUS_SJ_XZSYDW_BKFX_FUND_NATUE_I_Y WHERE budget_year = ${param.year} @[and unit_industry_name in ${param.unitIndustry}] GROUP BY fund_nature_name",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendChartTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartTwo dacpRes: ", JSON.stringify(dacpRes));

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
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const seriesData = data.map((item) => ({
      value: item.value,
      name: item.name,
      rate: Number(((item.value / total) * 100).toFixed(2)),
    }));

    return {
      seriesData: seriesData,
      total: total,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendChartTwo res: ", JSON.stringify(res));
  return res;
}

//按资金来源环形图右侧表格
export async function getSpendChartTwoTable(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartTwoTable req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT ROUND(SUM(actual_pay_amount_fund_nature_y) / 10000,2) as value, fund_nature_name as name FROM CAS_FUS_SJ_XZSYDW_BKFX_FUND_NATUE_I_Y WHERE budget_year = ${param.year} @[and unit_industry_name in ${param.unitIndustry}] GROUP BY fund_nature_name order by value desc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendChartTwoTable dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartTwoTable dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData){

    const result = {
        dataSource: [],
        maxMoney: 0,
    }
    let maxMoney = 0;
    inputData.forEach(item => {
        maxMoney = Math.max(maxMoney, item.value);
    });
    let total = 0;
    inputData.forEach(item => {
        total += item.value;
    });
    result.maxMoney = maxMoney;
    inputData.forEach(item => {
        result.dataSource.push({
            zjly: item.name,
            zb: Number((item.value / total * 100).toFixed(2)),
            je: item.value
        })
    });
    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendChartTwoTable res: ", JSON.stringify(res));
  return res;
}

//按资金来源归一化图数据
export async function getSpendChartThree(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartThree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT ROUND(SUM(actual_pay_amount_fund_nature_y) / 10000, 2) as money, fund_nature_name as name, budget_year as year FROM CAS_FUS_SJ_XZSYDW_BKFX_FUND_NATUE_I_Y WHERE budget_year = ${param.year} @[and unit_industry_name in ${param.unitIndustry}] GROUP BY fund_nature_name,budget_year",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendChartThree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartThree dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data, year) {
    let yearGroups = {};
    let totalYearAmount = {};

    // 生成一个包含最大年份及其前四年的年份数组
    const xAxis = Array.from({ length: 5 }, function (_, i) {
      return String(year - 4 + i);
    });

    data.forEach(function (item) {
      if (!yearGroups[item.year]) {
        yearGroups[item.year] = [];
        totalYearAmount[item.year] = 0;
      }
      yearGroups[item.year].push(item);
      totalYearAmount[item.year] += item.money;
    });

    let legend = data
      .map(function (item) {
        return item.name;
      })
      .filter(function (value, index, self) {
        return self.indexOf(value) === index;
      });

    let seriesData = legend.map(function (name) {
      let rate = xAxis.map(function (year) {
        let yearData = (yearGroups[year] || []).find(function (item) {
          return item.name === name;
        });
        let yearTotal = totalYearAmount[year];
        if (yearData && yearTotal > 0) {
          return Number((yearData.money / yearTotal).toFixed(4));
        } else {
          return 0; // 避免NaN
        }
      });

      let money = xAxis.map(function (year) {
        let yearData = (yearGroups[year] || []).find(function (item) {
          return item.name === name;
        });
        return yearData ? yearData.money : 0; // 避免undefined
      });

      return { name: name, rate: rate, money: money };
    });

    return { legend: legend, xAxis: xAxis, seriesData: seriesData };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getSpendChartThree res: ", JSON.stringify(res));
  return res;
}

//按功能科目矩形树图数据
export async function getSpendChartFour(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartFour req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT exp_func_name1 as l1_name, exp_func_name2 as l2_name, exp_func_name3 as l3_name, budget_year as year, actual_pay_amount_1 / 10000 as l1_value, actual_pay_amount_2 / 10000 as l2_value, actual_pay_amount_3 / 10000 as l3_value FROM CAS_FUS_SJ_XZSYDW_BKFX_EXP_FUNC_I_Y WHERE budget_year = ${param.year} @[and unit_industry_name in ${param.unitIndustry}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendChartFour dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartFour dacpRes: ", JSON.stringify(dacpRes));

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
    let dataMap = {};
    let totalValue = 0;

    // 遍历数据，计算总金额并组织数据结构
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let l1_name = item.l1_name;
      let l2_name = item.l2_name;
      let l3_name = item.l3_name;
      let year = item.year;
      let l3_value = parseFloat(item.l3_value);

      // 计算总金额（基于第三级功能科目收入）
      totalValue += l3_value;

      // 如果第一级功能科目不存在，则添加
      if (!dataMap[l1_name]) {
        dataMap[l1_name] = {
          name: l1_name,
          value: 0,
          year: year,
          per: 0,
          children: {},
        };
      }

      var l1 = dataMap[l1_name];

      // 如果第二级功能科目不存在，则添加
      if (l2_name && !l1.children[l2_name]) {
        l1.children[l2_name] = {
          name: l2_name,
          value: 0,
          year: year,
          per: 0,
          children: {},
        };
      }

      if (l2_name) {
        var l2 = l1.children[l2_name];

        // 如果第三级功能科目不存在，则添加
        if (l3_name && !l2.children[l3_name]) {
          l2.children[l3_name] = {
            name: l3_name,
            value: l3_value,
            year: year,
            per: 0,
          };
        }

        // 更新第二级的值
        l2.value += l3_value;
      }

      // 更新第一级的值
      l1.value += l3_value;
    }

    // 计算百分比
    for (var l1_key in dataMap) {
      var l1 = dataMap[l1_key];
      l1.per = totalValue
        ? Number(((l1.value / totalValue) * 100).toFixed(2))
        : 0;
      l1.value = Number(l1.value.toFixed(2)); // 值除以10000后保留两位小数

      for (var l2_key in l1.children) {
        var l2 = l1.children[l2_key];
        l2.per = totalValue
          ? Number(((l2.value / totalValue) * 100).toFixed(2))
          : 0;
        l2.value = Number(l2.value.toFixed(2)); // 值除以10000后保留两位小数

        for (var l3_key in l2.children) {
          let l3 = l2.children[l3_key];
          l3.per = totalValue
            ? Number(((l3.value / totalValue) * 100).toFixed(2))
            : 0;
          l3.value = Number(l3.value.toFixed(2)); // 值除以10000后保留两位小数
        }
      }
    }

    // 将数据结构转换为所需的数组结构
    let seriesData = [];
    for (var l1_key in dataMap) {
      var l1 = dataMap[l1_key];
      let childrenL2 = [];

      for (var l2_key in l1.children) {
        var l2 = l1.children[l2_key];
        let childrenL3 = [];

        for (var l3_key in l2.children) {
          childrenL3.push(l2.children[l3_key]);
        }

        l2.children = childrenL3;
        childrenL2.push(l2);
      }

      l1.children = childrenL2;
      seriesData.push(l1);
    }

    return {
      seriesData: seriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendChartFour res: ", JSON.stringify(res));
  return res;
}

//按功能科目折线图数据
export async function getSpendChartFive(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartFive req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT t1.exp_func_name, t1.budget_year, round(t1.exp_func_pay_amount / 10000,2) as yearTotal, round(t1.exp_func_pay_amount / t3.year_total_amount,4) * 100 as rate FROM CAS_FUS_SJ_EXP_FUNC_BK_I_Y AS t1 LEFT JOIN ( SELECT t2.budget_year, SUM(t2.exp_func_pay_amount) as year_total_amount FROM CAS_FUS_SJ_EXP_FUNC_BK_I_Y AS t2 WHERE 1=1 @[AND t2.budget_year BETWEEN ${param.year} - 4 AND ${param.year}] @[AND t2.block_name in ${param.unitIndustry}] GROUP BY t2.budget_year ) as t3 ON t1.budget_year = t3.budget_year WHERE 1=1 @[AND t1.budget_year BETWEEN ${param.year} - 4 AND ${param.year}] @[AND t1.block_name in ${param.unitIndustry}] @[AND t1.exp_func_code in ${param.expFuncCodes}] GROUP BY t1.exp_func_name, t1.budget_year, t3.year_total_amount ORDER BY t1.budget_year DESC, yearTotal DESC;",
    sqlParameter: req,
  };

  const year = req.year;

  // 调用后端dacp接口
  console.log("getSpendChartFive dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartFive dacpRes: ", JSON.stringify(dacpRes));

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
    // 将输入年份转换为数值型
    const startYear = parseInt(inputYear, 10);

    // 生成 xAxis，从给定年份往前推4年，年份保持为字符串类型
    const xAxis = Array.from({ length: 5 }, (_, i) =>
      (startYear - 4 + i).toString()
    );

    // 初始化结果结构
    const result = {
      legend: [],
      xAxis: xAxis,
      yAxis: {
        name: "金额",
      },
      seriesData: [],
    };

    // 提取所有的 legend 和 seriesData
    const seriesDataMap = {};

    // 遍历输入数据
    inputData.forEach((item) => {
      const name = item.exp_func_name;

      // 如果 legend 中没有当前的 name，则添加
      if (!result.legend.includes(name)) {
        result.legend.push(name);
      }

      // 如果 seriesDataMap 中没有当前的 name，则初始化
      if (!seriesDataMap[name]) {
        seriesDataMap[name] = {
          name: name,
          data: {
            money: Array(5).fill(0),
            rate: Array(5).fill(0),
          },
        };
      }

      // 找到当前数据的年份在 xAxis 中的位置
      const yearIndex = xAxis.indexOf(item.budget_year);
      if (yearIndex !== -1) {
        seriesDataMap[name].data.money[yearIndex] = parseFloat(
          item.yearTotal.toFixed(2)
        );
        seriesDataMap[name].data.rate[yearIndex] = parseFloat(
          item.rate.toFixed(2)
        );
      }
    });

    // 将 seriesDataMap 转换为数组
    result.seriesData = Object.values(seriesDataMap);

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getSpendChartFive res: ", JSON.stringify(res));
  return res;
}

//按功能科目折线图选择框
export async function getFuncSubjects(req) {
  // 打印视图层的入参请求
  console.log("getFuncSubjects req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT exp_func_name as `key`, exp_func_code as `value` FROM CAS_FUS_SJ_EXP_FUNC_BK_I_Y WHERE 1=1 @[AND budget_year = ${param.year}] @[AND block_name in ${param.unitIndustry}] ORDER BY `value` asc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getFuncSubjects dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getFuncSubjects dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
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
  console.log("getFuncSubjects res: ", JSON.stringify(res));
  return res;
}

//功能科目获取top8
export async function getFuncSubjectsTop8(req) {
  // 打印视图层的入参请求
  console.log("getFuncSubjectsTop8 req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT t1.exp_func_code as code FROM (SELECT exp_func_code, SUM(exp_func_pay_amount) as five_year_total FROM CAS_FUS_SJ_EXP_FUNC_BK_I_Y WHERE 1=1 @[and budget_year between ${param.year} - 4 and ${param.year}] @[and block_name in ${param.unitIndustry}] GROUP BY exp_func_code ) AS t1 ORDER BY t1.five_year_total DESC LIMIT 8;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getFuncSubjectsTop8 dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getFuncSubjectsTop8 dacpRes: ", JSON.stringify(dacpRes));

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
    return data.map((item) => item.code);
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getFuncSubjectsTop8 res: ", JSON.stringify(res));
  return res;
}

//按经济科目矩形树图数据
export async function getSpendChartSix(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartSix req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT a.l1_name, b.l1_value, a.year, a.l2_name, a.l2_value FROM (SELECT exp_subject_name1 AS l1_name, exp_subject_name2 AS l2_name, budget_year AS year, SUM(actual_pay_amount) AS l2_value FROM CAS_FUS_SJ_XZSYDW_GOV_EXP_I_Y WHERE 1 = 1 @[and budget_year = ${param.year}] @[AND block_name IN ${param.unitIndustry}] and exp_subject_name1 is not NULL and exp_subject_name2 is not NULL GROUP BY exp_subject_name1, exp_subject_name2, budget_year ) a LEFT JOIN (SELECT exp_subject_name1 AS l1_name, budget_year AS year, SUM(actual_pay_amount) AS l1_value FROM CAS_FUS_SJ_XZSYDW_GOV_EXP_I_Y WHERE 1 = 1 @[and budget_year = ${param.year}] @[AND block_name IN ${param.unitIndustry}] and exp_subject_name1 is not NULL GROUP BY exp_subject_name1, budget_year ) b ON a.year = b.year AND a.l1_name = b.l1_name;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendChartSix dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartSix dacpRes: ", JSON.stringify(dacpRes));

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
    let dataMap = {};
    let totalValue = 0;

    // 遍历数据，计算总金额并组织数据结构
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let l1_name = item.l1_name;
      let l2_name = item.l2_name;
      let year = item.year;
      let l2_value = parseFloat(item.l2_value);

      // 计算总金额（基于第二级功能科目收入）
      totalValue += l2_value;

      // 如果第一级功能科目不存在，则添加
      if (!dataMap[l1_name]) {
        dataMap[l1_name] = {
          name: l1_name,
          value: 0,
          year: year,
          per: 0,
          children: {},
        };
      }

      var l1 = dataMap[l1_name];

      // 如果第二级功能科目不存在，则添加
      if (l2_name && !l1.children[l2_name]) {
        l1.children[l2_name] = {
          name: l2_name,
          value: l2_value,
          year: year,
          per: 0,
        };
      } else if (l2_name) {
        l1.children[l2_name].value += l2_value;
      }

      // 更新第一级的值
      l1.value += l2_value;
    }

    // 计算百分比
    for (var l1_key in dataMap) {
      var l1 = dataMap[l1_key];
      l1.per = totalValue
        ? Number(((l1.value / totalValue) * 100).toFixed(2))
        : 0;
      l1.value = Number((l1.value / 10000).toFixed(2)); // 值除以10000后保留两位小数

      for (var l2_key in l1.children) {
        var l2 = l1.children[l2_key];
        l2.per = totalValue
          ? Number(((l2.value / totalValue) * 100).toFixed(2))
          : 0;
        l2.value = Number((l2.value / 10000).toFixed(2)); // 值除以10000后保留两位小数
      }
    }

    // 将数据结构转换为所需的数组结构
    let seriesData = [];
    for (var l1_key in dataMap) {
      var l1 = dataMap[l1_key];
      let childrenL2 = [];

      for (var l2_key in l1.children) {
        var l2 = l1.children[l2_key];
        childrenL2.push(l2);
      }

      l1.children = childrenL2;
      seriesData.push(l1);
    }

    return {
      seriesData: seriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendChartSix res: ", JSON.stringify(res));
  return res;
}

//按经济科目折线图数据
export async function getSpendChartSeven(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartSeven req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT budget_year as year, gov_exp_subject_name as name, ROUND(SUM(actual_pay_amount)/10000, 2) AS money, round(SUM(actual_pay_amount)/total_amount,4)*100 as rate FROM CAS_FUS_SJ_XZSYDW_GOV_EXP_I_Y a left join (SELECT budget_year as year, SUM(actual_pay_amount) AS total_amount FROM CAS_FUS_SJ_XZSYDW_GOV_EXP_I_Y WHERE 1=1 AND budget_year BETWEEN ${param.year} - 4 AND ${param.year}   @[AND block_name IN ${param.unitIndustry}] GROUP BY budget_year) b on a.budget_year = b.year WHERE 1=1 AND a.budget_year BETWEEN ${param.year} - 4 AND ${param.year}  @[AND a.gov_exp_subject_code IN ${param.expCode}] @[AND a.block_name IN ${param.unitIndustry}] GROUP BY a.budget_year, a.gov_exp_subject_name ORDER BY money DESC LIMIT 8; ",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendChartSeven dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartSeven dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data, year) {
    // 使用ES5语法来创建唯一的名称列表
    let legend = data
      .map(function (item) {
        return item.name;
      })
      .filter(function (value, index, self) {
        return self.indexOf(value) === index;
      });

    // 生成一个包含最大年份及其前四年的年份数组
    let xAxis = Array.from({ length: 5 }, function (_, i) {
      return String(year - 4 + i);
    });

    let seriesData = legend.map(function (name) {
      let series = {
        name: name,
        data: {
          money: [],
          rate: [],
        },
      };

      xAxis.forEach(function (year) {
        let item = data.find(function (d) {
          return d.name === name && d.year === year;
        });
        let money = item ? item.money : 0;
        let rate = item ? item.rate : 0;
        series.data.money.push(Number(money.toFixed(2)));
        series.data.rate.push(rate);
      });

      return series;
    });

    return {
      legend: legend,
      xAxis: xAxis,
      yAxis: {
        name: "金额",
      },
      seriesData: seriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getSpendChartSeven res: ", JSON.stringify(res));
  return res;
}

//按经济科目折线图选择框
export async function getFinacialSubjects(req) {
  // 打印视图层的入参请求
  console.log("getFinacialSubjects req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT gov_exp_subject_name as `key`, gov_exp_subject_code as `value` from CAS_FUS_SJ_XZSYDW_GOV_EXP_I_Y where 1=1 and budget_year = ${param.year} @[and block_name in ${param.unitIndustry}] group by gov_exp_subject_name,gov_exp_subject_code order by `value` asc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getFinacialSubjects dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getFinacialSubjects dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
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
  console.log("getFinacialSubjects res: ", JSON.stringify(res));
  return res;
}

//经济科目获取top8
export async function getFinacialSubjectsTop8(req) {
  // 打印视图层的入参请求
  console.log("getFinacialSubjectsTop8 req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT gov_exp_subject_code as code FROM (SELECT gov_exp_subject_code, SUM(yearly_total) AS 5_year_total FROM (SELECT gov_exp_subject_code, budget_year, SUM(actual_pay_amount) AS yearly_total FROM CAS_FUS_SJ_XZSYDW_GOV_EXP_I_Y WHERE  budget_year BETWEEN ${param.year} - 4 AND ${param.year} @[AND block_name IN ${param.unitIndustry}] GROUP BY gov_exp_subject_code, budget_year) AS yearly_data GROUP BY gov_exp_subject_code ORDER BY 5_year_total DESC LIMIT 8) AS top_8_exp_codes; ",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getFinacialSubjectsTop8 dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getFinacialSubjectsTop8 dacpRes: ", JSON.stringify(dacpRes));

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
    return data.map((item) => item.code);
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getFinacialSubjectsTop8 res: ", JSON.stringify(res));
  return res;
}

//按当年分布情况(按主管单位)环形图数据
export async function getSpendChartEight(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartEight req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select dept_name as name, ROUND(sum(dept_payout_amount)/ 10000, 2) as value, cast(dept_pro_cnt as unsigned) as dept_pro_cnt from CAS_FUS_SJ_XZSYDW_BKFX_ZG_PAYOUT_I_Y where nf = ${param.year} @[and unit_industry_name in ${param.unitIndustry}] @[and dept_code in ${param.deptCodes}] group by dept_code, dept_name, dept_pro_cnt;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendChartEight dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartEight dacpRes: ", JSON.stringify(dacpRes));

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
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const deptSet = new Set(data.map(item => item.name));
    const projectTotal = data.reduce((sum, item) => sum + item.dept_pro_cnt, 0);

    const seriesData = data.map(item => ({
        name: item.name,
        value: Number(item.value.toFixed(2)),
        rate: Number(((item.value / total) * 100).toFixed(2))
    }));

    return {
        seriesData: seriesData,
        total: Number(total.toFixed(2)),
        unitTotal: deptSet.size,
        projectTotal: projectTotal
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendChartEight res: ", JSON.stringify(res));
  return res;
}

//当年分布情况表格图形数据
export async function getSpendTableChart(req) {
  // 打印视图层的入参请求
  console.log("getSpendTableChart req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select nf, dept_code as id, dept_name as manageName,  ROUND(dept_payout_amount/10000, 2) as amountValue, ROUND(dept_execute_rate * 100, 2) as exeRate, CAST(dept_pro_cnt AS UNSIGNED) as proCnt from CAS_FUS_SJ_XZSYDW_BKFX_ZG_PAYOUT_I_Y  where nf > ${param.year} - 5 and nf <= ${param.year}  and  dept_name is not null @[and unit_industry_name in ${param.unitIndustry}] @[and ${param.filterCondition}] @[order by ${param.odName}] ",
    sqlParameter: {
      ...req,
      odName: req.odName ? req.odName : "amountValue desc",
    },
  };

  // 调用后端dacp接口
  console.log("getSpendTableChart dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendTableChart dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data, nf) {
    let startYear = nf - 4;
    let endYear = nf;

    // 创建一个空对象，用于按id存储数据
    let tempData = {};

    // 创建一个空数组来存放结果的顺序
    let order = [];

    // 过滤数据，保留在范围内的数据
    let filteredData = data.filter(
      (item) => parseInt(item.nf) >= startYear && parseInt(item.nf) <= endYear
    );

    // 遍历过滤后的数据数组
    filteredData.forEach((item) => {
      // 记录单位顺序
      if (!tempData[item.id]) {
        order.push(item.id);
      }

      // 如果tempData中已经有该单位的数据，则更新对应的graphTrend数据
      if (tempData[item.id]) {
        tempData[item.id].graphTrend.money.data.push(item.amountValue);
        tempData[item.id].graphTrend.project.data.push(parseInt(item.proCnt));
        tempData[item.id].graphTrend.trend.data.push(item.exeRate);
      } else {
        // 否则创建新的数据对象，并初始化数据结构
        tempData[item.id] = {
          id: item.id,
          manageName: item.manageName,
          graphTrend: {
            money: {
              name: "支出金额",
              type: "bar",
              data: Array(5).fill(0),
            },
            project: {
              name: "项目数量",
              type: "bar",
              data: Array(5).fill(0),
            },
            trend: {
              name: "执行率",
              type: "line",
              data: Array(5).fill(0),
            },
          },
          data: "",
        };
      }

      let yearIndex = parseInt(item.nf) - startYear;

      if (item.amountValue !== null && item.amountValue !== undefined) {
        tempData[item.id].graphTrend.money.data[yearIndex] = item.amountValue;
      }
      if (item.proCnt !== null && item.proCnt !== undefined) {
        tempData[item.id].graphTrend.project.data[yearIndex] = parseInt(
          item.proCnt
        );
      }
      if (item.exeRate !== null && item.exeRate !== undefined) {
        tempData[item.id].graphTrend.trend.data[yearIndex] = item.exeRate;
      }

      if (yearIndex === 4) {
        let ttt = item.amountValue + "+" + item.proCnt + "+" + item.exeRate;
        tempData[item.id].data = ttt;
      }
    });

    // 按照 order 数组的顺序生成最终结果
    let transformedData = order.map((id) => tempData[id]);

    return transformedData;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getSpendTableChart res: ", JSON.stringify(res));
  return res;
}

//主管单位——————主管单位排序选项获取
export async function getSpendTableSortOptions() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "支出金额", value: "amountValue" },
      { label: "项目数量", value: "proCnt" },
      { label: "执行率", value: "exeRate" },
    ],
  };
  console.log("getSpendTableSortOptions res: ", JSON.stringify(res));
  return res;
}

//主管单位————主管单位筛选选项获取
export async function getSpendTableFilterOptions() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "主管单位名称", value: "dept_name", type: "string" },
      {
        label: "支出金额",
        value: "ROUND(dept_payout_amount/10000, 2)",
        type: "number",
      },
      { label: "项目数量", value: "dept_pro_cnt", type: "number" },
      {
        label: "执行率",
        value: "ROUND(dept_execute_rate * 100, 2)",
        type: "number",
      },
    ],
  };
  console.log("getSpendTableFilterOptions res: ", JSON.stringify(res));
  return res;
}

//项目分析环形图数据
export async function getSpendChartNine(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartNine req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT a.pro_type_name AS name, max(c.total) as total, round(SUM(a.pro_type_payout_amount)/ 10000, 2) AS value, ROUND((SUM(a.pro_type_payout_amount) / b.total_amount), 4 ) * 100  AS rate FROM CAS_FUS_SJ_XZSYDW_BKFX_PRO_TYPE_I_Y AS a left JOIN (SELECT nf, SUM(pro_type_payout_amount) AS total_amount FROM CAS_FUS_SJ_XZSYDW_BKFX_PRO_TYPE_I_Y WHERE 1 = 1 @[and unit_industry_name IN ${param.unitIndustry}] GROUP BY nf) AS b ON a.nf = b.nf left join (select nf, count(*) as total FROM CAS_FUS_SJ_XZSYDW_BKFX_PRO_DETAIL_I_Y WHERE 1 = 1 @[and unit_industry_name IN ${param.unitIndustry}] ) as c on a.nf = c.nf WHERE 1 = 1 and b.total_amount is not null and a.nf = ${param.year} @[AND a.unit_industry_name IN ${param.unitIndustry}] GROUP BY a.pro_type_name, b.total_amount;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendChartNine dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartNine dacpRes: ", JSON.stringify(dacpRes));

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
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const seriesData = data.map(item => ({
        name: item.name,
        value: Number(item.value.toFixed(2)),
        rate: Number(((item.value / total) * 100).toFixed(2))
    }));

    return {
        seriesData: seriesData,
        total: Number(total.toFixed(2)),
        projectTotal: data.length > 0 ? data[0].total : 0
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendChartNine res: ", JSON.stringify(res));
  return res;
}

//项目分析矩形树图
export async function getSpendChartTen(req) {
  // 打印视图层的入参请求
  console.log("getSpendChartTen req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT t1.dept_name as l1_name, 'manage' as l1_type, t1.pro_type_name as projectType, t1.nf as year, t1.unit_name as l2_name, round(t2.unit_payout_amount / 10000, 2) as l2_value, 'budget' as l2_type FROM cas_fus_sj_xzsydw_bkfx_pro_detail_i_y AS t1 LEFT JOIN (SELECT unit_name, nf, round(sum(payout_amount), 2) as unit_payout_amount, pro_type_name FROM cas_fus_sj_xzsydw_bkfx_pro_detail_i_y WHERE 1 = 1 @[AND nf = ${param.year}] @[AND unit_industry_name in ${param.unitIndustry}] @[AND pro_type_name = '${param.projectName}'] GROUP BY unit_name, nf, pro_type_name) as t2 on t1.unit_name = t2.unit_name and t1.nf = t2.nf and t1.pro_type_name = t2.pro_type_name WHERE 1 = 1 @[AND t1.nf = ${param.year}] @[AND t1.unit_industry_name in ${param.unitIndustry}] @[AND t1.pro_type_name = '${param.projectName}'] GROUP BY t1.dept_name, t1.pro_type_name, t1.nf, t1.unit_name, t2.unit_payout_amount",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendChartTen dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendChartTen dacpRes: ", JSON.stringify(dacpRes));

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
    const result = { seriesData: [] };
    const map = {};
    const projectTypeSet = new Set();
    let totalAmount = 0;

    inputData.forEach((item) => {
      const l1Name = item.l1_name;
      const l2Name = item.l2_name;
      const l2Value = parseFloat(item.l2_value);
      const year = item.year;
      const l1Type = item.l1_type;
      const l2Type = item.l2_type;
      const projectType = item.projectType;
      projectTypeSet.add(projectType);

      if (!map[l1Name]) {
        map[l1Name] = {
          name: l1Name,
          value: 0,
          year,
          per: 0,
          type: l1Type,
          projectType,
          children: [],
        };
      }

      map[l1Name].value += l2Value;
      map[l1Name].children.push({
        name: l2Name,
        value: Number(l2Value.toFixed(2)),
        year,
        per: 0,
        type: l2Type,
        projectType,
      });

      totalAmount += l2Value;
    });

    if (projectTypeSet.size > 1) {
      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          const l1Item = map[key];
          l1Item.projectType = "全部";

          const childrenMap = {};
          l1Item.children.forEach((child) => {
            if (!childrenMap[child.name]) {
              childrenMap[child.name] = Object.assign({}, child, { value: 0 });
            }
            childrenMap[child.name].value += child.value;
          });

          l1Item.children = [];
          for (const childKey in childrenMap) {
            if (childrenMap.hasOwnProperty(childKey)) {
              const child = childrenMap[childKey];
              child.value = Number(child.value.toFixed(2)); // 确保子节点的 value 保留两位小数
              child.projectType = "全部";
              l1Item.children.push(child);
            }
          }
        }
      }
    }

    for (const key in map) {
      if (map.hasOwnProperty(key)) {
        const l1Item = map[key];
        l1Item.children.forEach((child) => {
          child.per =
            totalAmount > 0
              ? Number(((child.value / totalAmount) * 100).toFixed(2))
              : 0;
        });

        l1Item.value = Number(l1Item.value.toFixed(2)); // 确保 value 保留两位小数
        l1Item.per =
          totalAmount > 0
            ? Number(((l1Item.value / totalAmount) * 100).toFixed(2))
            : 0;

        result.seriesData.push(l1Item);
      }
    }

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendChartTen res: ", JSON.stringify(res));
  return res;
}

//项目分析表格分页总条数获取
export async function getSpendTableTotal(req) {
  // 打印视图层的入参请求
  console.log("getSpendTableTotal req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select max(data) as data from(SELECT COUNT(*) AS data FROM CAS_FUS_SJ_XZSYDW_BKFX_PRO_DETAIL_I_Y WHERE 1 = 1 @[and nf = ${param.year}] @[and pro_type_name = '${param.protype}'] @[and dept_name = '${param.choosedName}'] @[and unit_industry_name IN ${param.unitIndustry}] @[and ${param.filterCondition}] UNION SELECT COUNT(*) AS data FROM CAS_FUS_SJ_XZSYDW_BKFX_PRO_DETAIL_I_Y WHERE 1 = 1 @[and nf = ${param.year}] @[and pro_type_name = '${param.protype}'] @[and unit_name = '${param.choosedName}'] @[and unit_industry_name IN ${param.unitIndustry}] @[and ${param.filterCondition}] ) as t1",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getSpendTableTotal dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendTableTotal dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data[0].data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendTableTotal res: ", JSON.stringify(res));
  return res;
}

//项目分析表格数据
export async function getSpendTable(req) {
  // 打印视图层的入参请求
  console.log("getSpendTable req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select dept_name as manageName, unit_name as budgetName, pro_name as project, round(payout_amount / 10000, 2) as money, pro_type_name as projectType from CAS_FUS_SJ_XZSYDW_BKFX_PRO_DETAIL_I_Y where 1 = 1 @[and nf = ${param.year}] @[and pro_type_name = '${param.protype}'] @[and unit_industry_name IN ${param.unitIndustry}] @[and dept_name = '${param.choosedName}'] @[and ${param.filterCondition}] union select dept_name as manageName, unit_name as budgetName, pro_name as project, round(payout_amount / 10000, 2) as money, pro_type_name as projectType from CAS_FUS_SJ_XZSYDW_BKFX_PRO_DETAIL_I_Y where 1 = 1 @[and nf = ${param.year}] @[and pro_type_name = '${param.protype}'] @[and unit_industry_name IN ${param.unitIndustry}] @[and unit_name = '${param.choosedName}'] @[and ${param.filterCondition}] @[order by ${param.odName}] limit ${param.pageSize} offset ${param.pageOffset};",
    sqlParameter: {
      ...req,
      odName: req.odName ? req.odName : "money desc",
    },
  };

  // 调用后端dacp接口
  console.log("getSpendTable dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSpendTable dacpRes: ", JSON.stringify(dacpRes));

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
    return data.map((item) => {
      return {
        ...item,
        money: parseFloat(item.money.toFixed(2)),
      };
    });
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSpendTable res: ", JSON.stringify(res));
  return res;
}

//项目分析——————主管单位排序
export async function getManageSortOptions() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "主管单位名称", value: "manageName" },
      { label: "预算单位名称", value: "budgetName" },
      { label: "项目类型", value: "projectType" },
      { label: "项目名称", value: "project" },
      { label: "支出金额", value: "money" },
    ],
  };
  console.log("getManageSortOptions res: ", JSON.stringify(res));
  return res;
}

//项目分析————主管单位筛选
export async function getManageFilterOptions() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "主管单位名称", value: "dept_name", type: "string" },
      { label: "预算单位名称", value: "unit_name", type: "string" },
      { label: "项目类型", value: "pro_type_name", type: "string" },
      { label: "项目名称", value: "pro_name", type: "string" },
      {
        label: "支出金额",
        value: "round(payout_amount/10000,2)",
        type: "number",
      },
    ],
  };
  console.log("getManageFilterOptions res: ", JSON.stringify(res));
  return res;
}

//------支付明细页
//获取支付明细表格数据总数
export async function getPayDetailTableTotal(req) {
  // 打印视图层的入参请求
  console.log("getPayDetailTableTotal req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT  COUNT(*)  AS  data  FROM     CAS_FUS_SJ_XZSYDW_EXEP_DETAIL_I_Y WHERE 1=1   and budget_year = '${param.year}'   @[AND block_name IN ${param.unitIndustry}]     @[AND unit_code IN ${param.unitIds}]     @[AND dept_code IN ${param.deptIds}] @[AND pro_name like '%${param.proName}%'] @[AND exp_func_name like '%${param.functionName}%'] @[AND gov_exp_subject_name like '%${param.financialName}%']   @[AND actual_pay_date BETWEEN '${param.startDate}' AND '${param.endDate}'] @[AND pro_type_name = '${param.proTypeName}']  @[order by ${param.odName}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPayDetailTableTotal dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPayDetailTableTotal dacpRes: ", JSON.stringify(dacpRes));

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
    return data[0].data;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getPayDetailTableTotal res: ", JSON.stringify(res));
  return res;
}

// 获取支付明细表格数据
export async function getPayDetailTable(req) {
  // 打印视图层的入参请求
  console.log("getPayDetailTable req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT     pro_type_name AS type,     pro_name AS name,     actual_pay_date AS time,     abstract AS abstract,     payee_name AS getName,     block_name AS industryName,     exp_func_name AS functionName,     gov_exp_subject_name AS finicialName,     fund_source_name AS `source`,     fund_nature_name AS nature,     round(actual_pay_amount,2)  AS money,     pay_mode_name AS zcfsmc,     gov_purchase AS zfcgfs,     clear_fun_name AS jsfs,     pay_account AS zfzhmc,     pay_bank AS zfyhmc,     clear_bank AS qsyhmc,     payee_account AS skrzhbh,     payee_bank AS skrzhyh  FROM CAS_FUS_SJ_XZSYDW_EXEP_DETAIL_I_Y WHERE 1=1 @[AND budget_year = ${param.year}] @[AND block_name IN ${param.unitIndustry}] @[AND unit_code IN ${param.unitIds}] @[AND dept_code IN ${param.deptIds}]  @[AND pro_name like '%${param.proName}%'] @[AND exp_func_name like '%${param.functionName}%'] @[AND gov_exp_subject_name like '%${param.financialName}%'] @[AND actual_pay_date BETWEEN '${param.startDate}' AND '${param.endDate}'] @[AND pro_type_name = '${param.proTypeName}']  @[ORDER BY ${param.odName}]  LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPayDetailTable dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPayDetailTable dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
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
  console.log("getPayDetailTable res: ", JSON.stringify(res));
  return res;
}

// 获取主管单位下拉框数据
export async function getPayDetailManageOptions(req) {
  // 打印视图层的入参请求
  console.log("getPayDetailManageOptions req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT distinct CONCAT(dept_code,'--',dept_name) as `key`, dept_code as value FROM cas_fus_sj_xzsydw_ysunit_basic_info_i_y  WHERE finance_year = ${param.year} @[and unit_industry_name in ${param.unitIndustry}] @[and budget_unit_code in ${param.unitCodes}] order by dept_code asc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPayDetailManageOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPayDetailManageOptions dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
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
  console.log("getPayDetailManageOptions res: ", JSON.stringify(res));
  return res;
}

// 获取预算单位下拉框数据
export async function getPayDetailBudgetOptions(req) {
  // 打印视图层的入参请求
  console.log("getPayDetailBudgetOptions req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT distinct CONCAT(budget_unit_code,'--',budget_unit_name) as `key`, budget_unit_code as value FROM cas_fus_sj_xzsydw_ysunit_basic_info_i_y  WHERE finance_year = ${param.year} @[and unit_industry_name in ${param.unitIndustry}] @[and dept_code in ${param.deptCodes}] order by budget_unit_code asc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPayDetailBudgetOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPayDetailBudgetOptions dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getPayDetailBudgetOptions res: ", JSON.stringify(res));
  return res;
}

//获取所有板块
export async function getPayDetailAllBlocks(req) {
  // 打印视图层的入参请求
  console.log("getPayDetailAllBlocks req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT  unit_industry_name as label, unit_industry_name as `value`  FROM CAS_FUS_SJ_XZSYDW_BKFX_OVERVIEW_BK_I_Y  WHERE 1=1  group by unit_industry_name;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPayDetailAllBlocks dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPayDetailAllBlocks dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
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
  console.log("getPayDetailAllBlocks res: ", JSON.stringify(res));
  return res;
}

//获取支付明细表排序按钮选项数据
export async function getPayDetailSortOptions() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "项目名称",
        value: "name",
      },
      {
        label: "支付日期",
        value: "time",
      },
      {
        label: "摘要",
        value: "abstract",
      },
      {
        label: "收款人名称",
        value: "getName",
      },
      {
        label: "行业名称",
        value: "industryName",
      },
      {
        label: "功能科目名称",
        value: "functionName",
      },
      {
        label: "经济科目名称",
        value: "finicialName",
      },
      {
        label: "资金来源",
        value: "source",
      },
      {
        label: "资金性质",
        value: "nature",
      },
      {
        label: "金额",
        value: "money",
      },
    ],
  };
  console.log("getPayDetailSortOptions res: ", JSON.stringify(res));
  return res;
}
