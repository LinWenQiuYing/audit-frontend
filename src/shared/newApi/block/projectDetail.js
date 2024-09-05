import axiosInstance from "../index.js";

const projectUrl = "/pierce/dacp/invoke";

//获取项目支出明细标头内容
export async function getPayDetailDes(req) {
  // 打印视图层的入参请求
  console.log("getPayDetailDes req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT pro_name as projectName, unit_name as budgetName, dept_name as unitName, round(sum(actual_pay_amount),2) AS money FROM cas_fus_sj_xzsydw_exep_detail_i_y WHERE 1=1 @[AND unit_name = '${param.unitName}'] @[AND dept_name = '${param.deptName}'] @[AND pro_name = '${param.proName}'] GROUP BY pro_name, unit_name, dept_name;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPayDetailDes dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${projectUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPayDetailDes dacpRes: ", JSON.stringify(dacpRes));

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
    data: transformData(dacpRes.data[0]),
  };
  console.log("getPayDetailDes res: ", JSON.stringify(res));
  return res;
}

// 指定项目支付进度月趋势
export async function getProjectDetailChartOne(req) {
  // 打印视图层的入参请求
  console.log("getProjectDetailChartOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT pro_name, concat(budget_year,'-',MONTH(actual_pay_date)) AS pay_date, round(sum(actual_pay_amount),2) AS total FROM cas_fus_sj_xzsydw_exep_detail_i_y WHERE 1=1 @[AND unit_name = '${param.unitName}'] @[AND dept_name = '${param.deptName}'] @[AND pro_name = '${param.proName}'] GROUP BY pro_name, pay_date ORDER BY actual_pay_date asc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getProjectDetailChartOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${projectUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getProjectDetailChartOne dacpRes: ", JSON.stringify(dacpRes));

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
        legend: [],
        xAxis: [],
        yAxis: {
            name: "金额"
        },
        seriesData: []
    };

    // 从输入数据的pay_date字段中提取日期,日期格式为"2023-1",去重后生成x轴数据,同时补全没有的月份
    const startDate = inputData[0].pay_date;
    const endDate = inputData[inputData.length - 1].pay_date;
    const startYear = Number(startDate.split("-")[0]);
    const startMonth = Number(startDate.split("-")[1]);
    const endYear = Number(endDate.split("-")[0]);
    const endMonth = Number(endDate.split("-")[1]);
    const xAxis = [];
    // 根据输入数据的最早日期和最晚日期,生成x轴数据,补全没有的月份
    for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
            if (year === startYear && month < startMonth) {
                continue;
            }
            if (year === endYear && month > endMonth) {
                break;
            }
            xAxis.push(`${year}-${month}`);
        }
    }

    // 从输入数据的pro_name字段中提取项目名称,去重后生成图例数据
    const legend = Array.from(new Set(inputData.map(item => item.pro_name)));

    // 生成seriesData数据
    // 根据已有的x轴数组的长度,初始化data和rate数组,每个元素都是0
    legend.forEach(pro_name => {
        result.seriesData.push({
            name: pro_name,
            data: xAxis.map(() => 0),
            rate: xAxis.map(() => 0)
        });
    });

    // 遍历输入数据,将数据填充到seriesData中,如果没有对应月份的数据,则对应月份的数据为0
    inputData.forEach(item => {
        const index = xAxis.indexOf(item.pay_date);
        const seriesIndex = legend.indexOf(item.pro_name);
        result.seriesData[seriesIndex].data[index] = item.total;
    });

    result.legend = legend;
    result.xAxis = xAxis;

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getProjectDetailChartOne res: ", JSON.stringify(res));
  return res;
}

//获取收款人情况表格
export async function getPayDetailTableOne(req) {
  // 打印视图层的入参请求
  console.log("getPayDetailTableOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT uuid() AS id, payee_name AS skrmc, round(actual_pay_amount,2) AS zfje FROM cas_fus_sj_xzsydw_exep_detail_i_y WHERE 1=1 @[AND budget_year = '${param.year}'] @[AND MONTH(actual_pay_date) = '${param.month}'] @[AND unit_name = '${param.unitName}'] @[AND dept_name = '${param.deptName}'] @[AND pro_name = '${param.proName}'] ORDER BY actual_pay_amount DESC;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPayDetailTableOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${projectUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPayDetailTableOne dacpRes: ", JSON.stringify(dacpRes));

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
        dateList: [],
        maxMoney: 0,
    };
    let maxMoney = 0;
    inputData.forEach(item => {
        maxMoney = Math.max(maxMoney, item.zfje);
    });
    result.maxMoney = maxMoney;
    result.dateList = inputData;
    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getPayDetailTableOne res: ", JSON.stringify(res));
  return res;
}

//获取支付明细表格
export async function getPayDetailTableTwo(req) {
  // 打印视图层的入参请求
  console.log("getPayDetailTableTwo req: ", JSON.stringify(req));

  // 构造后端dacp总数接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT count(*) as total FROM CAS_FUS_SJ_XZSYDW_EXEP_DETAIL_I_Y WHERE 1 = 1 @[AND budget_year = '${param.year}'] @[AND MONTH(actual_pay_date) = '${param.month}'] @[AND unit_name = '${param.unitName}'] @[AND dept_name = '${param.deptName}'] @[AND pro_name = '${param.proName}'] @[AND payee_name = '${param.payeeName}'];",
    sqlParameter: req,
  };

  // 调用后端dacp总数接口
  console.log("getPayDetailTableTwo dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(`${projectUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log("getPayDetailTableTwo dacpTotalRes: ", JSON.stringify(dacpTotalRes));

  // 判断后端dacp总数接口调用响应码，如果不成功，直接返回失败
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp明细接口请求
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT uuid() AS id, date_format(actual_pay_date,'%Y%m%d') AS zfrq, abstract AS zy, payee_name AS skrmc, industry_name AS hymc, gov_exp_subject_name AS jjkmmc, format(actual_pay_amount,2) AS zfje, pro_name AS xmmc, exp_func_name AS gnkmmc, pay_mode_name AS zcfsmc, gov_purchase AS zfcgfs, clear_fun_name AS jsfs, pay_account AS zfzhmc, pay_bank AS zfyhmc, clear_account_name AS qsyhmc, payee_account AS skrzhbh, payee_bank AS skrzhyh, format(actual_pay_amount,2) AS zxje FROM CAS_FUS_SJ_XZSYDW_EXEP_DETAIL_I_Y WHERE 1 = 1 @[AND budget_year = '${param.year}'] @[AND MONTH(actual_pay_date) = '${param.month}'] @[AND unit_name = '${param.unitName}'] @[AND dept_name = '${param.deptName}'] @[AND pro_name = '${param.proName}'] @[AND payee_name = '${param.payeeName}'] ORDER BY actual_pay_date ASC limit ${param.pageSize} offset ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端dacp明细接口
  console.log("getPayDetailTableTwo dacpDetailReq: ", JSON.stringify(dacpDetailReq));
  const dacpDetailRes = await axiosInstance.post(`${projectUrl}`, dacpDetailReq, {
    timeout: -1,
  });
  console.log("getPayDetailTableTwo dacpDetailRes: ", JSON.stringify(dacpDetailRes));

  // 判断后端dacp明细接口调用响应码，如果不成功，直接返回失败
  if (dacpDetailRes.code != 0) {
    return {
      code: dacpDetailRes.code,
      message: dacpDetailRes.message,
      data: dacpDetailRes.data,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: {
      total: dacpTotalRes.data[0].total,
      dateList: dacpDetailRes.data,
    },
  };
  console.log("getPayDetailTableTwo res: ", JSON.stringify(res));
  return res;
}
