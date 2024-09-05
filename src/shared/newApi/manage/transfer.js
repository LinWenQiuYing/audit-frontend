import axiosInstance from "../index.js";

const manageUrl = "/pierce/dacp/invoke";

//总体情况表格
export async function getTransferTableDataOne(req) {
  // 打印视图层的入参请求
  console.log("getTransferTableDataOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select  unit_name as dwmc, payee_name as skrmc, pay_amount  as zxje from CAS_FUS_SJ_DEPT_RELA_PAY_I_Y where 1=1 @[and budget_year=${param.year}] @[and dept_code='${param.dept_code}'] @[and fund_nature_code in ${param.fund_nature_code}]  order by unit_name desc,payee_name desc, pay_amount desc  LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getTransferTableDataOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getTransferTableDataOne dacpRes: ", JSON.stringify(dacpRes));

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
    return data.map((item) => ({
      dwmc: item.dwmc, // 单位名称
      skrmc: item.skrmc, // 收款人名称
      zxje: item.zxje == null ? "--" : parseFloat(item.zxje).toFixed(2), // 执行金额，转换为数字后除以10000，并保留两位小数
    }));
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getTransferTableDataOne res: ", JSON.stringify(res));
  return res;
}

//总体情况表格排序
export async function getTransferTableDataOneSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: " 单位名称",
        value: "dwmc",
        type: "string",
      },
      {
        label: "收款人名称",
        value: "skrmc",
        type: "string",
      },
      {
        label: "执行金额",
        value: "zxje",
        type: "number",
      },
    ],
  };
  return res;
}

//总体情况表格筛选
export async function getTransferTableDataOneFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: " 单位名称",
        value: "unit_name",
        type: "string",
      },
      {
        label: "收款人名称",
        value: "payee_name",
        type: "string",
      },
      {
        label: "执行金额",
        value: "ROUND(pay_amount/ 10000, 2)",
        type: "number",
      },
    ],
  };
  return res;
}

//项目情况表格
export async function getTransferTableDataTwo(req) {
  // 打印视图层的入参请求
  console.log("getTransferTableDataTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select budget_year,exep_month,unit_name, payee_name,dept_code , pro_name ,pay_amount from CAS_FUS_SJ_DEPT_PAY_PRO_I_M where 1=1 @[and budget_year=${param.year}] @[and dept_code='${param.dept_code}'] @[and exep_month=${param.month}] @[and unit_name='${param.unit_name}']  @[and unit_code='${param.unit_code}'] @[and fund_nature_code in ${param.fund_nature_code}] @[and payee_name='${param.payee_name}']  LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getTransferTableDataTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getTransferTableDataTwo dacpRes: ", JSON.stringify(dacpRes));

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
    // 初始数据结构
    const unitMap = {};

    // 遍历原始数据
    data.forEach((item) => {
      const {
        unit_name,
        exep_month,
        pay_amount,
        payee_name,
        pro_name,
        fund_type,
      } = item;
      const month = new Date(exep_month).getMonth(); // 获取月份（0-11）
      const amount = parseFloat(pay_amount).toFixed(2); // 转为浮点数并保留两位小数
      const key = `${unit_name}||${payee_name}||${pro_name}`; // 用于唯一标识每个组合

      // 如果该单位尚未在unitMap中，则初始化
      if (!unitMap[key]) {
        unitMap[key] = {
          dwmc: unit_name,
          skrmc: payee_name,
          xmmc: pro_name,
          zxzje: 0,
          zxqk: {
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
            seriesData: [{ name: "变化趋势", money: Array(12).fill(0) }],
          },
        };
      }

      // 更新总金额
      unitMap[key].zxzje = Number((
        parseFloat(unitMap[key].zxzje) + parseFloat(amount)
      ).toFixed(2));

      // 更新每个月的支出金额
      unitMap[key].zxqk.seriesData[0].money[month] = Number((
        parseFloat(unitMap[key].zxqk.seriesData[0].money[month]) +
        parseFloat(amount)
      ).toFixed(2));
    });

    // 将unitMap转换为目标格式的数组
    const result = Object.values(unitMap);

    // 多级排序
    result.sort((a, b) => {
      if (a.dwmc !== b.dwmc) return b.dwmc.localeCompare(a.dwmc); // 按单位名称降序
      if (a.skrmc !== b.skrmc) return b.skrmc.localeCompare(a.skrmc); // 按收款人名称降序
      if (a.xmmc !== b.xmmc) return b.xmmc.localeCompare(a.xmmc); // 按项目名称降序
      return b.zxzje - a.zxzje; // 按总金额降序
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getTransferTableDataTwo res: ", JSON.stringify(res));
  return res;
}

//项目情况表格排序
export async function getTransferTableDataTwoSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: " 单位名称",
        value: "dwmc",
        type: "string",
      },
      {
        label: "收款人名称",
        value: "skrmc",
        type: "string",
      },
      {
        label: "项目名称",
        value: "xmmc",
        type: "string",
      },
      {
        label: "执行总金额",
        value: "zxzje",
        type: "number",
      },
    ],
  };
  return res;
}

//项目情况表格筛选
export async function getTransferTableDataTwoFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: " 单位名称",
        value: "unit_name",
        type: "string",
      },
      {
        label: "收款人名称",
        value: "payee_name",
        type: "string",
      },
      {
        label: "项目名称",
        value: "pro_name",
        type: "string",
      },
      {
        label: "执行总金额",
        value: "zxzje",
        type: "number",
      },
    ],
  };
  return res;
}

//支付明细表格
export async function getTransferTableDataThree(req) {
  // 打印视图层的入参请求
  console.log("getTransferTableDataThree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select unit_name as dwmc, payee_name as skrmc, pro_name as xmmc, actual_pay_amount as zfje, actual_pay_date as zfrq, abstract as descp, gov_exp_subject_name as subject from cas_fus_sj_xzsydw_exep_detail_i_y where 1=1 @[and budget_year='${param.year'}] @[and dept_code='${param.dept_code}'] @[and fund_nature_code in ${param.fund_nature_code}]  @[and unit_code='${param.unit_code}'] @[and payee_name='${param.payee_name}'] @[and pro_name='${param.pro_name}'] order by unit_name desc, payee_name desc, actual_pay_date desc, pro_name desc LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getTransferTableDataThree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getTransferTableDataThree dacpRes: ", JSON.stringify(dacpRes));

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
      // 将时间戳转换为 YYYY-MM-DD 格式的日期
      const date = new Date(item.zfrq);
      const formattedDate = date.toISOString().split("T")[0]; // 获取 YYYY-MM-DD 格式的日期

      // 处理 desc 字段，如果为 null 或 空值，设置为 "--"
      const desc =
        item.descp !== null && item.descp.trim() !== "" ? item.descp : "--";

      // 格式化金额保留两位小数
      const formattedAmount = parseFloat(item.zfje).toFixed(2);

      return {
        dwmc: item.dwmc, // 预算单位名称
        skrmc: item.skrmc, // 收款人名称
        xmmc: item.xmmc, // 项目名称
        zfje: formattedAmount, // 支付金额，保留两位小数
        zfrq: formattedDate, // 支付日期
        desc: desc, // 摘要
        subject: item.subject, // 科目名称
      };
    });
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getTransferTableDataThree res: ", JSON.stringify(res));
  return res;
}

//支付明细表格排序
export async function getTransferTableDataThreeSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: " 单位名称",
        value: "dwmc",
        type: "string",
      },
      {
        label: "收款人名称",
        value: "skrmc",
        type: "string",
      },
      {
        label: "项目名称",
        value: "xmmc",
        type: "string",
      },
      {
        label: "支付金额",
        value: "zfje",
        type: "number",
      },
      {
        label: "支付日期",
        value: "zfrq",
        type: "string",
      },
      {
        label: "摘要",
        value: "desc",
        type: "string",
      },
      {
        label: "经济科目名称",
        value: "subject",
        type: "string",
      },
    ],
  };
  return res;
}

//支付明细表格筛选
export async function getTransferTableDataThreeFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: " 单位名称",
        value: "unit_name",
        type: "string",
      },
      {
        label: "收款人名称",
        value: "payee_name",
        type: "string",
      },
      {
        label: "项目名称",
        value: "pro_name",
        type: "string",
      },
      {
        label: "支付金额",
        value: "ROUND(actual_pay_amount / 10000, 2) ",
        type: "number",
      },
      {
        label: "支付日期",
        value: "actual_pay_date",
        type: "string",
      },
      {
        label: "摘要",
        value: "abstract",
        type: "string",
      },
      {
        label: "经济科目名称",
        value: "gov_exp_subject_name",
        type: "string",
      },
    ],
  };
  return res;
}
