import axiosInstance from "../index.js";

const manageUrl = "/pierce/dacp/invoke";

//下属单位表格
export async function getExecutionTableDataOne(req) {
  // 打印视图层的入参请求
  console.log("getExecutionTableDataOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select unit_name as xsdwmc,pro_type_name as xmlx,round(pro_type_budget_amount/10000,2) as ysje,round(pro_type_payout_amount/10000,2) as zxje,round(pro_type_payout_amount/pro_type_budget_amount,4)*100 as zxl from cas_fus_sj_xzsydw_ysunit_pro_type_i_y where 1=1 @[and dept_code=${param.dept_code}] @[and pro_type_name in ${param.pro_type_name}] @[and nf=${param.year}] @[and ${param.filterCondition}] order by xsdwmc desc, zxl desc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getExecutionTableDataOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getExecutionTableDataOne dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getExecutionTableDataOne res: ", JSON.stringify(res));
  return res;
}

//下属单位表格排序
export async function getExecutionTableDataOneSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "预算金额",
        value: "ysje",
        type: "number",
      },

      {
        label: "执行金额",
        value: "zxje",
        type: "number",
      },

      {
        label: "执行率",
        value: "zxl",
        type: "number",
      },
    ],
  };
  return res;
}

//下属单位表格筛选
export async function getExecutionTableDataOneFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: " 下属单位名称",
        value: "xsdwmc",
        type: "string",
      },
      {
        label: "预算金额",
        value: "ysje",
        type: "number",
      },
      {
        label: "执行金额",
        value: " zxje ",
        type: "number",
      },
      {
        label: "执行率",
        value: "zxl",
        type: "number",
      },
    ],
  };
  return res;
}

// 项目表格
export async function getExecutionTableDataTwo(req) {
  // 打印视图层的入参请求
  console.log("getExecutionTableDataTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select unit_name as dwmc,pro_type_name as xmlx,pro_name xmmc,budget_amount as ysje,payout_amount as zxje,execute_rate as zxl from cas_fus_sj_xzsydw_bkfx_pro_detail_i_y where 1=1 @[and nf=${param.year}] @[and unit_name='${param.unit_name}'] @[and pro_type_name='${param.pro_type_name}'] @[and dept_code=${param.dept_code}] @[and ${param.filterCondition}] order by unit_code,pro_type_name",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getExecutionTableDataTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getExecutionTableDataTwo dacpRes: ", JSON.stringify(dacpRes));

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
      // Divide ysje and zxje by 10,000 and round to two decimal places
      item.ysje = (item.ysje / 10000).toFixed(2);
      item.zxje = (item.zxje / 10000).toFixed(2);

      // Calculate zxl as a percentage and round to two decimal places
      item.zxl = (
        (parseFloat(item.zxje) * 100) /
        parseFloat(item.ysje)
      ).toFixed(2);

      return item;
    });
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getExecutionTableDataTwo res: ", JSON.stringify(res));
  return res;
}

//项目表格排序
export async function getExecutionTableDataTwoSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "预算金额",
        value: "ysje",
        type: "number",
      },
      {
        label: "执行金额",
        value: "zxje",
        type: "number",
      },
      {
        label: "执行率",
        value: "zxl",
        type: "number",
      },
    ],
  };
  return res;
}

//项目表格筛选
export async function getExecutionTableDataTwoFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "单位名称",
        value: "dwmc",
        type: "string",
      },
      {
        label: "项目类型",
        value: "xmlx",
        type: "string",
      },
      {
        label: "项目名称",
        value: "xmmc",
        type: "string",
      },
      {
        label: "预算金额",
        value: "ysje",
        type: "number",
      },
      {
        label: "执行金额",
        value: "zxje",
        type: "number",
      },
      {
        label: "执行率",
        value: "zxl",
        type: "number",
      },
    ],
  };
  return res;
}

export async function getProjectOptions(req) {
  // 打印视图层的入参请求
  console.log("getProjectOptions req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct pro_type_name as value,pro_type_name as label from cas_fus_sj_xzsydw_ysunit_pro_type_i_y",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getProjectOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getProjectOptions dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getProjectOptions res: ", JSON.stringify(res));
  return res;
}
