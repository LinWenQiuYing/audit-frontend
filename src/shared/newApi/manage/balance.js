import axiosInstance from "../index.js";

const manageUrl = "/pierce/dacp/invoke";

//echarts图：支出均衡性——按项目类别
export async function getManageBalanceGraphDataOne(req) {
  // 打印视图层的入参请求
  console.log("getManageBalanceGraphDataOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select a.budget_year, a.dept_code, a.month, a.pro_type_name, a.month_amount, b.year_amount, month_amount/year_amount as rate from (select budget_year, dept_code, month, pro_type_name, sum(total_month_pay_amount) as month_amount from CAS_FUS_SJ_XZSYDW_ZCJHX_XMLB_I_M where 1 = 1 @[and budget_year='${param.year}'] @[and dept_code='${param.dept_code}'] @[and fund_nature_code in ${param.fund_nature_code}] group by budget_year, dept_code, month, pro_type_name) a left join (select budget_year, dept_code, pro_type_name, sum(total_month_pay_amount) as year_amount from CAS_FUS_SJ_XZSYDW_ZCJHX_XMLB_I_M where 1 = 1 @[and budget_year='${param.year}'] @[and dept_code='${param.dept_code}'] @[and fund_nature_code in ${param.fund_nature_code}] group by budget_year, dept_code, pro_type_name) b on a.budget_year = b.budget_year and a.dept_code = b.dept_code and a.pro_type_name = b.pro_type_name;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getManageBalanceGraphDataOne dacpReq: ",
    JSON.stringify(dacpReq)
  );
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(
    "getManageBalanceGraphDataOne dacpRes: ",
    JSON.stringify(dacpRes)
  );

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
    // 定义目标结构
    let result = {
      legend: [],
      xAxis: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      seriesData: [],
    };

    // 创建一个按项目类型分组的数据结构
    let groupedData = {};

    // 遍历原始数据，将数据按项目类型分组
    data.forEach((item) => {
      let key = `${item.budget_year}-${item.dept_code}-${item.pro_type_name}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          name: item.pro_type_name,
          money: new Array(12).fill(0),
          rate: new Array(12).fill(0),
        };
        if (!result.legend.includes(item.pro_type_name)) {
          result.legend.push(item.pro_type_name);
        }
      }

      let monthIndex = parseInt(item.month, 10) - 1;
      groupedData[key].rate[monthIndex] = parseFloat(
        (item.rate * 100).toFixed(2)
      ); // 先×100再保留两位小数
      groupedData[key].money[monthIndex] = parseFloat(
        (item.month_amount / 10000).toFixed(2)
      ); // 金额/10000再保留两位小数
    });

    // 将按项目类型分组的数据转换为目标结构中的 seriesData
    result.seriesData = Object.values(groupedData);

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageBalanceGraphDataOne res: ", JSON.stringify(res));
  return res;
}

//echarts图：支出均衡性——按项目
export async function getManageBalanceGraphDataTwo(req) {
  // 打印视图层的入参请求
  console.log("getManageBalanceGraphDataTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select a.pro_code, a.pro_name, a.budget_year, a.unit_code, a.dept_code, a.month, a.month_amount, b.year_amount, month_amount/year_amount as rate from ( select pro_code, pro_name, budget_year, dept_code, unit_code, month, sum(total_month_pay_amount) as month_amount from CAS_FUS_SJ_XZSYDW_ZCJHX_XMLB_I_M where 1 = 1 @[and budget_year='${param.year}'] @[and dept_code='${param.dept_code}'] @[and unit_code='${param.unit_code}'] @[and fund_nature_code in ${param.fund_nature_code}] group by budget_year, unit_code, unit_name, dept_code, month, pro_code, pro_name) a left join ( select pro_code, pro_name, budget_year, unit_code, dept_code, sum(total_month_pay_amount) as year_amount from CAS_FUS_SJ_XZSYDW_ZCJHX_XMLB_I_M where 1 = 1 @[and budget_year='${param.year}'] @[and dept_code='${param.dept_code}'] @[and unit_code='${param.unit_code}'] @[and fund_nature_code in ${param.fund_nature_code}] group by pro_code, pro_name, budget_year, unit_code, unit_name, dept_code) b on a.budget_year = b.budget_year and a.unit_code=b.unit_code and a.dept_code = b.dept_code and a.pro_code=b.pro_code and a.pro_name=b.pro_name;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getManageBalanceGraphDataTwo dacpReq: ",
    JSON.stringify(dacpReq)
  );
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(
    "getManageBalanceGraphDataTwo dacpRes: ",
    JSON.stringify(dacpRes)
  );

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
    // 1. 初始化项目数据对象
    const projectData = {};

    // 2. 遍历原始数据，将数据按项目名称分组
    data.forEach((item) => {
      const { pro_name, month, month_amount, pro_code, unit_code, rate } = item;
      const monthIndex = parseInt(month, 10) - 1; // 转换为0索引

      // 初始化项目名称数据
      if (!projectData[pro_name]) {
        projectData[pro_name] = {
          projectCode: pro_code,
          unitName: unit_code,
          money: new Array(12).fill(0),
          rate: new Array(12).fill(0),
        };
      }

      // 更新项目数据
      projectData[pro_name].money[monthIndex] += month_amount;
      projectData[pro_name].rate[monthIndex] = rate * 100; // 转换比例为百分数并保留两位
    });

    // 3. 生成目标格式的数据
    const result = {
      legend: Object.keys(projectData),
      xAxis: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      seriesData: Object.entries(projectData).map(([name, data]) => ({
        name,
        data: {
          projectCode: data.projectCode,
          unitName: data.unitName,
          money: data.money.map((amount) => amount.toFixed(2)), // 金额保留两位小数
          rate: data.rate.map((r) => r.toFixed(2)), // 比例保留两位小数
        },
      })),
    };

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageBalanceGraphDataTwo res: ", JSON.stringify(res));
  return res;
}

//预算单位表格
export async function getManageBalanceTable(req) {
  // 打印视图层的入参请求
  console.log("getManageBalanceTable req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select a.budget_year, a.unit_code,a.unit_name,a.dept_code, a.month, a.month_amount, b.year_amount, month_amount/year_amount as rate from ( select unit_code,unit_name,budget_year, dept_code, month, sum(total_month_pay_amount) as month_amount from CAS_FUS_SJ_XZSYDW_ZCJHX_XMLB_I_M where 1 = 1 @[and budget_year='${param.year}'] @[and dept_code='${param.dept_code}'] @[and fund_nature_code in ${param.fund_nature_code}]  group by budget_year, unit_code, unit_name, dept_code, month) a left join ( select unit_code,unit_name,budget_year, dept_code, sum(total_month_pay_amount) as year_amount from CAS_FUS_SJ_XZSYDW_ZCJHX_XMLB_I_M where 1 = 1 @[and budget_year='${param.year}'] @[and dept_code='${param.dept_code}'] @[and fund_nature_code in ${param.fund_nature_code}]  group by budget_year, unit_code, unit_name, dept_code) b on a.budget_year = b.budget_year and a.unit_code=b.unit_code and a.dept_code = b.dept_code;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageBalanceTable dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageBalanceTable dacpRes: ", JSON.stringify(dacpRes));

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
    // 创建一个以 unit_code 为键的 Map
    const unitMap = new Map();

    // 遍历数据
    data.forEach((item) => {
      const unitCode = item.unit_code;
      const monthIndex = parseInt(item.month, 10) - 1; // 月份索引从0开始

      // 如果 Map 中没有该单位，初始化一个新的对象
      if (!unitMap.has(unitCode)) {
        unitMap.set(unitCode, {
          dwmc: item.unit_name,
          code: item.unit_code,
          zcqk: {
            xAxis: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            seriesData: [
              {
                name: "变化趋势",
                money: Array(12).fill(0), // 初始化支出金额数组
                rate: Array(12).fill(0), // 初始化比例数组
              },
            ],
          },
        });
      }

      const unit = unitMap.get(unitCode);
      unit.zcqk.seriesData[0].money[monthIndex] = (
        item.month_amount / 10000
      ).toFixed(2); // 将金额单位从分转为万，并保留2位小数
      unit.zcqk.seriesData[0].rate[monthIndex] = (item.rate * 100).toFixed(2); // 将比例转为百分比并保留2位小数
    });

    // 将 Map 转为数组
    return Array.from(unitMap.values());
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageBalanceTable res: ", JSON.stringify(res));
  return res;
}
