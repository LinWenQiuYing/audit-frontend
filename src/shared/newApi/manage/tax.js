import axiosInstance from "../index.js";

const manageUrl = "/pierce/dacp/invoke";

//------非税收入Tab页面
//非税概览
export async function getManageTaxOverview(req) {
  // 打印视图层的入参请求
  console.log("getManageTaxOverview req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT round(nontax_revenue,2) as nontax_revenue, nontax_revenue_change, nontax_unit_cnt, nontax_unit_cnt_change, nontax_type_cnt, nontax_type_cnt_change, nontax_pro_cnt, nontax_pro_cnt_change FROM CAS_FUS_SJ_XZSYDW_NONTAX_DEP_OVERVIEW_I_Y WHERE 1=1 @[AND nf = ${param.year}] @[AND dept_code = ${param.deptCode}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageTaxOverview dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageTaxOverview dacpRes: ", JSON.stringify(dacpRes));

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
    const result = [
      {
        id: 1,
        typeName: "非税收入总金额（万元）",
        num: 0,
        percentage: "--",
        status: 2,
        icon: "非税收入总金额",
      },
      {
        id: 2,
        typeName: "非税收入预算单位数量（个）",
        num: 0,
        percentage: "--",
        status: 2,
        icon: "非税收入预算单位数量",
      },
      {
        id: 3,
        typeName: "非税收入类型（个）",
        num: 0,
        percentage: "--",
        status: 2,
        icon: "非税收入类型",
      },
      {
        id: 4,
        typeName: "非税项目数量（个）",
        num: 0,
        percentage: "--",
        status: 2,
        icon: "非税项目数量",
      },
    ];
    if (inputData === null || inputData.length === 0) {
      return result;
    }

    result[0].num = Number((inputData[0].nontax_revenue / 10000).toFixed(2));
    result[0].percentage =
      inputData[0].nontax_revenue_change == null
        ? "--"
        : `${(inputData.nontax_revenue_change * 100).toFixed(2)}%`;
    result[0].status =
      inputData[0].nontax_revenue_change == null
        ? 2
        : inputData.nontax_revenue_change > 0
        ? 1
        : 0;

    result[1].num = inputData[0].nontax_unit_cnt;
    result[1].percentage =
      inputData[0].nontax_unit_cnt_change == null
        ? "--"
        : `${(inputData.nontax_unit_cnt_change * 100).toFixed(2)}%`;
    result[1].status =
      inputData[0].nontax_unit_cnt_change == null
        ? 2
        : inputData.nontax_unit_cnt_change > 0
        ? 1
        : 0;

    result[2].num = inputData[0].nontax_type_cnt;
    result[2].percentage =
      inputData[0].nontax_type_cnt_change == null
        ? "--"
        : `${(inputData.nontax_type_cnt_change * 100).toFixed(2)}%`;
    result[2].status =
      inputData[0].nontax_type_cnt_change == null
        ? 2
        : inputData.nontax_type_cnt_change > 0
        ? 1
        : 0;

    result[3].num = inputData[0].nontax_pro_cnt;
    result[3].percentage =
      inputData[0].nontax_pro_cnt_change == null
        ? "--"
        : `${(inputData.nontax_pro_cnt_change * 100).toFixed(2)}%`;
    result[3].status =
      inputData[0].nontax_pro_cnt_change == null
        ? 2
        : inputData.nontax_pro_cnt_change > 0
        ? 1
        : 0;

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageTaxOverview res: ", JSON.stringify(res));
  return res;
}

//非税收入分布（按类型）表格
export async function getManageTaxTableOne(req) {
  // 打印视图层的入参请求
  console.log("getManageTaxTableOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT nontax_type_name as noTaxType, nf as year, ROUND(SUM(unit_jkje_y) / 10000,2) as yearTotal FROM cas_fus_sj_xzsydw_nontax_pro_i_y WHERE 1=1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND dept_code = '${param.deptCode}'] @[AND ${param.filterCondition}] GROUP BY nontax_type_name, nf @[ORDER BY ${param.odName}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageTaxTableOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageTaxTableOne dacpRes: ", JSON.stringify(dacpRes));

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
    const currentYear = parseInt(inputYear, 10);

    // 生成年份数组，从当前年份往前推4年
    const years = Array.from({ length: 5 }, (_, i) =>
      (currentYear - 4 + i).toString()
    );

    // 初始化结果结构
    const result = {
      columns1: [],
      dataSource1: [],
    };

    // 生成表头
    result.columns1.push({
      title: "非税收入类型",
      dataIndex: "noTaxType",
      key: "noTaxType",
      width: 160,
    });
    years.forEach((year, index) => {
      const yearKey = [
        "firstYear",
        "secondYear",
        "thirdYear",
        "forthYear",
        "fifthYear",
      ][index];
      result.columns1.push({
        title: `${year}`,
        dataIndex: yearKey,
        key: yearKey,
        width: 214,
        scopedSlots: { customRender: `${yearKey}` },
      });
    });

    // 聚合每年的数据
    const aggregatedData = {};
    inputData.forEach((item) => {
      const year = item.year;
      const noTaxType = item.noTaxType;
      const yearTotal = item.yearTotal;

      if (!aggregatedData[year]) {
        aggregatedData[year] = { total: 0, types: {} };
      }

      if (yearTotal !== null) {
        aggregatedData[year].total += yearTotal || 0;

        if (!aggregatedData[year].types[noTaxType]) {
          aggregatedData[year].types[noTaxType] = 0;
        }

        aggregatedData[year].types[noTaxType] += yearTotal || 0;
      }
    });

    // 提取所有的 noTaxType 并初始化结果数据
    const noTaxTypesSet = new Set();
    inputData.forEach((item) => noTaxTypesSet.add(item.noTaxType));

    noTaxTypesSet.forEach((noTaxType) => {
      const resultItem = { noTaxType };

      years.forEach((year, index) => {
        const yearKey = [
          "firstYear",
          "secondYear",
          "thirdYear",
          "forthYear",
          "fifthYear",
        ][index];
        const yearData = aggregatedData[year];
        if (yearData && yearData.types.hasOwnProperty(noTaxType)) {
          const yearTotal = yearData.total;
          const typeTotal = yearData.types[noTaxType] || 0;
          const rate = yearTotal ? (typeTotal / yearTotal) * 100 : 0;
          resultItem[yearKey] = `${Number(rate.toFixed(2))}+${typeTotal.toFixed(
            2
          )}`;
        } else {
          resultItem[yearKey] = "--+--";
        }
      });

      result.dataSource1.push(resultItem);
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManageTaxTableOne res: ", JSON.stringify(res));
  return res;
}

//非税收入分布（按类型）表格 筛选
export async function getManageTaxTableOneFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "非税收入类型",
        value: "nontax_type_name",
        type: "string",
      },
    ],
  };
  return res;
}

//非税收入分布（按预算单位）表格
export async function getManageTaxTableTwo(req) {
  // 打印视图层的入参请求
  console.log("getManageTaxTableTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT * FROM (SELECT unit_name as budgetName, nf as year, COUNT(distinct nontax_project_code) as num, ROUND(SUM(unit_jkje_y) / 10000, 2) as money FROM cas_fus_sj_xzsydw_nontax_pro_i_y WHERE 1 = 1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND dept_code = '${param.deptCode}'] GROUP BY dept_name, unit_name, nf @[ORDER BY ${param.odName}] ) as t1 WHERE 1=1 @[AND ${param.filterCondition}] order by t1.money desc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageTaxTableTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageTaxTableTwo dacpRes: ", JSON.stringify(dacpRes));

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
    const currentYear = parseInt(inputYear, 10);

    // 生成年份数组，从当前年份往前推4年
    const years = Array.from({ length: 5 }, (_, i) =>
      (currentYear - 4 + i).toString()
    );

    // 初始化结果结构
    const result = [];

    // 聚合每年的数据
    const aggregatedData = {};
    inputData.forEach((item) => {
      const year = item.year;
      const budgetName = item.budgetName;
      const num = item.num !== null ? item.num : 0;
      const money = item.money !== null ? item.money : 0;

      if (!aggregatedData[year]) {
        aggregatedData[year] = { totalMoney: 0, totalNum: 0, units: {} };
      }

      aggregatedData[year].totalMoney += money;
      aggregatedData[year].totalNum += num;

      if (!aggregatedData[year].units[budgetName]) {
        aggregatedData[year].units[budgetName] = { money: 0, num: 0 };
      }

      aggregatedData[year].units[budgetName].money += money;
      aggregatedData[year].units[budgetName].num += num;
    });

    // 初始化 budgetNamesSet 和结果数据
    const budgetNamesSet = new Set();
    inputData.forEach((item) => budgetNamesSet.add(item.budgetName));

    let idCounter = 1;
    budgetNamesSet.forEach((budgetName) => {
      const resultItem = {
        id: idCounter.toString(),
        budgetName,
        num: "--+--",
        money: "--+--",
        graphTrend: {
          money: {
            data: Array(5).fill(0),
            rate: Array(5).fill(0),
            total: Array(5).fill(0),
          },
          num: {
            data: Array(5).fill(0),
            rate: Array(5).fill(0),
            total: Array(5).fill(0),
          },
        },
      };

      // 处理每一年的数据
      years.forEach((year, index) => {
        const yearData = aggregatedData[year];
        if (yearData) {
          const yearTotalMoney = yearData.totalMoney;
          const yearTotalNum = yearData.totalNum;
          const unitData = yearData.units[budgetName] || { money: 0, num: 0 };

          const moneyRate = yearTotalMoney
            ? (unitData.money / yearTotalMoney) * 100
            : 0;
          const numRate = yearTotalNum
            ? (unitData.num / yearTotalNum) * 100
            : 0;

          resultItem.graphTrend.money.data[index] = unitData.money;
          resultItem.graphTrend.money.rate[index] = parseFloat(
            moneyRate.toFixed(2)
          );
          resultItem.graphTrend.money.total[index] = yearTotalMoney;

          resultItem.graphTrend.num.data[index] = unitData.num;
          resultItem.graphTrend.num.rate[index] = parseFloat(
            numRate.toFixed(2)
          );
          resultItem.graphTrend.num.total[index] = yearTotalNum;

          if (index === 4) {
            const inputItem = inputData.find(
              (item) => item.budgetName === budgetName && item.year === year
            );
            if (
              inputItem &&
              (inputItem.num === null || inputItem.money === null)
            ) {
              resultItem.money = "--+--";
              resultItem.num = "--+--";
            } else {
              resultItem.money = `${unitData.money.toFixed(2)}+${Number(
                moneyRate.toFixed(2)
              )}`;
              resultItem.num = `${unitData.num}+${Number(numRate.toFixed(2))}`;
            }
          }
        }
      });

      result.push(resultItem);
      idCounter++;
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManageTaxTableTwo res: ", JSON.stringify(res));
  return res;
}

//非税收入分布（按预算单位）筛选
export async function getManageTaxTableTwoFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "预算单位名称",
        value: "budgetName",
        type: "string",
      },
      {
        label: "当年非税项目数量",
        value: "num",
        type: "number",
      },
      {
        label: "当年非税收入金额",
        value: "money",
        type: "number",
      },
    ],
  };
  return res;
}

//非税收入分布（按项目） 表格
export async function getManageTaxTableThree(req) {
  // 打印视图层的入参请求
  console.log("getManageTaxTableThree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT t1.noTaxType, t1.budgetName, t1.projectName, t1.year, t1.yearTotal FROM (SELECT nontax_type_name as noTaxType, unit_name as budgetName, nontax_project_name as projectName, nf as year, ROUND(SUM(unit_jkje_y) / 10000, 2) as yearTotal FROM cas_fus_sj_xzsydw_nontax_pro_i_y WHERE 1 = 1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND dept_code = '${param.deptCode}'] GROUP BY nontax_type_name, unit_name, nontax_project_name, nf ) AS t1 WHERE 1=1 @[AND ${param.filterCondition}] @[ORDER BY ${param.odName}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageTaxTableThree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageTaxTableThree dacpRes: ", JSON.stringify(dacpRes));

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
    const currentYear = parseInt(inputYear, 10);
    const years = Array.from({ length: 5 }, (_, i) =>
      (currentYear - 4 + i).toString()
    );

    const aggregatedData = {};
    const projectData = {};

    inputData.forEach((item) => {
      const { noTaxType, budgetName, projectName, year, yearTotal } = item;

      if (!aggregatedData[year]) {
        aggregatedData[year] = { total: 0, units: {} };
      }
      aggregatedData[year].total += yearTotal || 0;

      if (!aggregatedData[year].units[budgetName]) {
        aggregatedData[year].units[budgetName] = { total: 0, projects: {} };
      }
      aggregatedData[year].units[budgetName].total += yearTotal || 0;

      if (!aggregatedData[year].units[budgetName].projects[projectName]) {
        aggregatedData[year].units[budgetName].projects[projectName] = 0;
      }
      aggregatedData[year].units[budgetName].projects[projectName] +=
        yearTotal || 0;

      if (!projectData[noTaxType]) {
        projectData[noTaxType] = [];
      }
      projectData[noTaxType].push(item);
    });

    const result = [];
    let idCounter = 1;

    for (const [noTaxType, projects] of Object.entries(projectData)) {
      projects.forEach((item) => {
        const { budgetName, projectName, year, yearTotal } = item;

        const resultItem = {
          id: idCounter.toString(),
          noTaxType,
          budgetName,
          projectName,
          data: yearTotal === null ? "--" : "0+0.00",
          graphTrend: {
            money: {
              type: "line",
              data: Array(5).fill(0),
              data2: Array(5).fill(0),
              rate: Array(5).fill(0),
            },
          },
        };

        years.forEach((y, index) => {
          const yearData = aggregatedData[y];
          if (yearData) {
            const yearTotalMoney = yearData.total;
            const unitData = yearData.units[budgetName];
            const projectMoney = unitData
              ? unitData.projects[projectName] || 0
              : 0;

            resultItem.graphTrend.money.data[index] = Number(
              projectMoney.toFixed(2)
            );
            resultItem.graphTrend.money.data2[index] = Number(
              yearTotalMoney.toFixed(2)
            );
            resultItem.graphTrend.money.rate[index] = Number(
              ((projectMoney / yearTotalMoney) * 100).toFixed(2)
            );
          }
        });

        if (yearTotal === null) {
          resultItem.data = "--+--";
        } else {
          const totalForYear = aggregatedData[year].total;
          const rateForYear = ((yearTotal / totalForYear) * 100).toFixed(2);
          resultItem.data = `${Number(yearTotal.toFixed(2))}+${rateForYear}`;
        }

        result.push(resultItem);
        idCounter++;
      });
    }

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManageTaxTableThree res: ", JSON.stringify(res));
  return res;
}

//非税收入分布（按项目）排序
export async function getManageTaxTableThreeSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "非税收入类型",
        value: "noTaxType",
        type: "string",
      },
      {
        label: "预算单位名称",
        value: "budgetName",
        type: "string",
      },
      {
        label: "项目名称",
        value: "projectName",
        type: "string",
      },
      {
        label: "当年非税收入金额",
        value: "yearTotal",
        type: "number",
      },
    ],
  };
  return res;
}

//非税收入分布（按项目）筛选
export async function getManageTaxTableThreeFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "非税收入类型",
        value: "noTaxType",
        type: "string",
      },
      {
        label: "预算单位名称",
        value: "budgetName",
        type: "string",
      },
      {
        label: "项目名称",
        value: "projectName",
        type: "string",
      },
      {
        label: "当年非税收入金额",
        value: "yearTotal",
        type: "number",
      },
    ],
  };
  return res;
}
