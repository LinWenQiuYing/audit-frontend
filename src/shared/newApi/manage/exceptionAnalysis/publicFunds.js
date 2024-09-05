import axiosInstance from "../../index";

const manageUrl = "/pierce/dacp/invoke";

//------疑似三公异常分析
//预算资金体系下拉选项
export async function getPublicFundsMoneyOptions(req) {
  // 打印视图层的入参请求
  console.log("getPublicFundsMoneyOptions req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT COALESCE(fund_nature_name, 'null') AS label,  COALESCE(fund_nature_name, 'null') AS value FROM cas_fus_sj_xzsydw_ysunit_fund_nature_i_y;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicFundsMoneyOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicFundsMoneyOptions dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getPublicFundsMoneyOptions res: ", JSON.stringify(res));
  return res;
}

//获取单位情况表格
export async function getPublicFundsTableOne(req) {
  // 打印视图层的入参请求
  console.log("getPublicFundsTableOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select unitName, ROUND(total_spending, 2) as total_spending, ROUND(suspected_spending.yssg_total,2) as yssg_total, total_spending+yssg_total as total_amount from ( SELECT  unit_name AS unitName,  SUM(actual_pay_amount) AS total_spending FROM cas_fus_sj_bkfx_sg_yssg_fund_detail_i_y  WHERE 1=1 and sg_type_name != '疑似三公支出' @[AND dept_code = '${param.deptCode}'] @[AND nf = '${param.year}'] @[AND (fund_nature_name IN ${param.fundNatureName} OR (fund_nature_name IS NULL AND 'null' IN ${param.fundNatureName}))] @[AND sg_type_name = '${param.sgType}'] GROUP BY unit_name) main left join (SELECT unit_name, SUM(actual_pay_amount)  as yssg_total FROM cas_fus_sj_bkfx_sg_yssg_fund_detail_i_y sub WHERE sub.sg_type_name = '疑似三公支出' @[and sub.nf = '${param.year}']  @[AND sub.dept_code = '${param.deptCode}'] @[AND (sub.fund_nature_name IN ${param.fundNatureName} OR (sub.fund_nature_name IS NULL AND 'null' IN ${param.fundNatureName}))] group by unit_name) AS suspected_spending on main.unitName=suspected_spending.unit_name order by total_amount desc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicFundsTableOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicFundsTableOne dacpRes: ", JSON.stringify(dacpRes));

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
    const result = {
      columns: [
        {
          title: "分析单位",
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: `业务年度：${inputYear}`,
          dataIndex: "year",
          key: "year",
          width: 250,
          scopedSlots: { customRender: "year" },
        },
      ],
      data: [],
      maxSum: 0,
    };

    let maxSum = 0;

    inputData.forEach((item, index) => {
      const totalSpending =
        item.total_spending !== null ? item.total_spending : 0;
      const yssgTotal = item.yssg_total !== null ? item.yssg_total : 0;
      const year = `${yssgTotal}+${totalSpending}`;

      result.data.push({
        id: (index + 1).toString(),
        name: item.unitName,
        year: year,
      });

      const sum = totalSpending + yssgTotal;
      if (sum > maxSum) {
        maxSum = sum;
      }
    });

    result.maxSum = maxSum;

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getPublicFundsTableOne res: ", JSON.stringify(res));
  return res;
}

//获取收款人情况表格
export async function getPublicFundsTableTwo(req) {
  // 打印视图层的入参请求
  console.log("getPublicFundsTableTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select unitName, main.payee_name as payeeName, ROUND(total_spending, 2) as total_spending, ROUND(suspected_spending.yssg_total,2) as yssg_total, total_spending+yssg_total as total_amount from (SELECT  unit_name AS unitName, payee_name, SUM(actual_pay_amount) AS total_spending FROM cas_fus_sj_bkfx_sg_yssg_fund_detail_i_y  WHERE 1=1 and sg_type_name != '疑似三公支出' @[AND unit_name = '${param.unitName}'] @[AND dept_code = '${param.deptCode}'] @[AND nf = '${param.year}'] @[AND (fund_nature_name IN ${param.fundNatureName} OR (fund_nature_name IS NULL AND 'null' IN ${param.fundNatureName}))] @[AND sg_type_name = '${param.sgType}']  GROUP BY payee_name) main left join (SELECT unit_name, payee_name, SUM(actual_pay_amount)  as yssg_total FROM cas_fus_sj_bkfx_sg_yssg_fund_detail_i_y sub WHERE sub.sg_type_name = '疑似三公支出' @[AND unit_name = '${param.unitName}'] @[and sub.nf = '${param.year}']  @[AND sub.dept_code = '${param.deptCode}'] @[AND (sub.fund_nature_name IN ${param.fundNatureName} OR (sub.fund_nature_name IS NULL AND 'null' IN ${param.fundNatureName}))]group by payee_name) AS suspected_spending on main.payee_name=suspected_spending.payee_name order by total_amount desc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPublicFundsTableTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPublicFundsTableTwo dacpRes: ", JSON.stringify(dacpRes));

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
    const result = {
      columns: [
        {
          title: "分析单位",
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: "收款人",
          dataIndex: "payee",
          key: "payee",
          width: 120,
        },
        {
          title: `业务年度：${inputYear}`,
          dataIndex: "year",
          key: "year",
          width: 250,
          scopedSlots: { customRender: "year" },
        },
      ],
      data: [],
      maxSum: 0,
    };
    let maxSum = 0;

    inputData.forEach((item, index) => {
      const totalSpending =
        item.total_spending !== null ? item.total_spending : "0";
      const yssgTotal = item.yssg_total !== null ? item.yssg_total : "0";
      const year = `${yssgTotal}+${totalSpending}`;

      result.data.push({
        id: (index + 1).toString(),
        name: item.unitName,
        payee: item.payeeName,
        year: year,
      });

      const sum = totalSpending + yssgTotal;
      if (sum > maxSum) {
        maxSum = sum;
      }
    });

    result.maxSum = maxSum;
    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getPublicFundsTableTwo res: ", JSON.stringify(res));
  return res;
}

//获取支付明细表格
export async function getPublicFundsTableThree(req) {
  // 打印视图层的入参请求
  console.log("getPublicFundsTableThree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) as total FROM (SELECT actual_pay_date AS zfrq, payee_name AS skrmc, pro_name AS xmmc, dept_exp_subject_name AS jjkmmc, '--' AS zy, fund_nature_name AS yszjtx, ROUND(actual_pay_amount, 2) AS zfje, '1' AS isNormal FROM cas_fus_sj_bkfx_sg_yssg_fund_detail_i_y WHERE 1=1 AND sg_type_name != '疑似三公支出' @[AND dept_code = '${param.deptCode}'] @[AND unit_name = '${param.unitName}'] @[AND payee_name = '${param.payeeName}'] @[AND nf = '${param.year}'] @[AND (fund_nature_name IN ${param.fundNatureName} OR (fund_nature_name IS NULL AND 'null' IN ${param.fundNatureName}))] @[AND sg_type_name = '${param.sgType}'] UNION ALL SELECT actual_pay_date AS zfrq, payee_name AS skrmc, pro_name AS xmmc, dept_exp_subject_name AS jjkmmc, '--' AS zy, fund_nature_name AS yszjtx, ROUND(actual_pay_amount, 2) AS zfje, '0' AS isNormal FROM cas_fus_sj_bkfx_sg_yssg_fund_detail_i_y WHERE 1=1 AND sg_type_name = '疑似三公支出' AND actual_pay_amount IS NOT NULL @[AND dept_code = '${param.deptCode}'] @[AND unit_name = '${param.unitName}'] @[AND payee_name = '${param.payeeName}'] @[AND nf = '${param.year}'] @[AND (fund_nature_name IN ${param.fundNatureName} OR (fund_nature_name IS NULL AND 'null' IN ${param.fundNatureName}))]) as result WHERE 1=1 @[and ${param.filterCondition}] @[order by ${param.odName}];",
    sqlParameter: req,
  };
  console.log(
    "getPublicFundsTableThree dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${manageUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getPublicFundsTableThree dacpTotalReq: ",
    JSON.stringify(dacpTotalRes)
  );
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }
  // 调用后端dacp接口
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT * FROM (SELECT unit_name as dwmc, actual_pay_date AS zfrq, payee_name AS skrmc, pro_name AS xmmc, dept_exp_subject_name AS jjkmmc, '--' AS zy, fund_nature_name AS yszjtx, ROUND(actual_pay_amount, 2) AS zfje, '1' AS isNormal FROM cas_fus_sj_bkfx_sg_yssg_fund_detail_i_y WHERE 1=1 AND sg_type_name != '疑似三公支出' @[AND dept_code = '${param.deptCode}'] @[AND unit_name = '${param.unitName}'] @[AND payee_name = '${param.payeeName}'] @[AND nf = '${param.year}'] @[AND (fund_nature_name IN ${param.fundNatureName} OR (fund_nature_name IS NULL AND 'null' IN ${param.fundNatureName}))] @[AND sg_type_name = '${param.sgType}'] UNION ALL SELECT unit_name as dwmc, actual_pay_date AS zfrq, payee_name AS skrmc, pro_name AS xmmc, dept_exp_subject_name AS jjkmmc, '--' AS zy, fund_nature_name AS yszjtx, ROUND(actual_pay_amount, 2) AS zfje, '0' AS isNormal FROM cas_fus_sj_bkfx_sg_yssg_fund_detail_i_y WHERE 1=1 AND sg_type_name = '疑似三公支出' AND actual_pay_amount IS NOT NULL @[AND dept_code = '${param.deptCode}'] @[AND unit_name = '${param.unitName}'] @[AND payee_name = '${param.payeeName}'] @[AND nf = '${param.year}'] @[AND (fund_nature_name IN ${param.fundNatureName} OR (fund_nature_name IS NULL AND 'null' IN ${param.fundNatureName}))]) as result WHERE 1=1 @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };
  console.log(
    "getPublicFundsTableThree dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpDetailReq, {
    timeout: -1,
  });
  console.log("getPublicFundsTableThree dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  // const transformData = (data) => {
  //   return data;
  // };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: {
      total: dacpTotalRes.data[0].total,
      dateList: dacpRes.data,
    },
  };
  console.log("getElectronicBookData res: ", JSON.stringify(res));
  return res;
}

//下支付明细表格筛选
export async function getPublicFundsTableThreeFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "支付日期",
        value: "zfrq",
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
        label: "经济科目名称",
        value: "jjkmmc",
        type: "string",
      },
      {
        label: "预算资金体系",
        value: "yszjtx",
        type: "string",
      },
      {
        label: "支付金额",
        value: "zfje",
        type: "number",
      },
    ],
  };
  return res;
}

//下支付明细表格排序
export async function getPublicFundsTableThreeSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "支付日期",
        value: "zfrq",
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
        label: "经济科目名称",
        value: "jjkmmc",
        type: "string",
      },
      {
        label: "预算资金体系",
        value: "yszjtx",
        type: "string",
      },
      {
        label: "支付金额",
        value: "zfje",
        type: "number",
      },
    ],
  };
  return res;
}
