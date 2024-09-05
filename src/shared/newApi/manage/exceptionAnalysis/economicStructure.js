import axiosInstance from "../../index.js";

const manageUrl = "/pierce/dacp/invoke";

//------经济科目异常分析
//项目大类下拉选项
export async function getEconomicStructureProjectOptions(req) {
  // 打印视图层的入参请求
  console.log("getEconomicStructureProjectOptions req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct pro_type_name as value,pro_type_name as label from CAS_FUS_SJ_XZSYDW_JJKM_JGFX_I_Y where 1=1 @[and dept_code=${param.dept_code}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getEconomicStructureProjectOptions dacpReq: ",
    JSON.stringify(dacpReq)
  );
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(
    "getEconomicStructureProjectOptions dacpRes: ",
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
    return data;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getEconomicStructureProjectOptions res: ", JSON.stringify(res));
  return res;
}

//预算资金体系下拉选项
export async function getEconomicStructureMoneyOptions(req) {
  // 打印视图层的入参请求
  console.log("getEconomicStructureMoneyOptions req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct fund_nature_name as value,fund_nature_name as label from CAS_FUS_SJ_XZSYDW_JJKM_JGFX_I_Y where 1=1 @[and dept_code=${param.dept_code}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getEconomicStructureMoneyOptions dacpReq: ",
    JSON.stringify(dacpReq)
  );
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(
    "getEconomicStructureMoneyOptions dacpRes: ",
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
    return data;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getEconomicStructureMoneyOptions res: ", JSON.stringify(res));
  return res;
}

//总体情况表格
export async function getEconomicStructureTable(req) {
  // 打印视图层的入参请求
  console.log("getEconomicStructureTable req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT distinct t1.gov_exp_subject_name, t1.budget_year, round(t3.subj_total_val,2) as pay_amount, round(t3.subj_total_val * 100 / t2.total_val, 2) as rate, round(t2.total_val,2) as total_val from CAS_FUS_SJ_DEPT_JJKM_ZTQK_I_Y as t1 left join (select dept_code, budget_year, sum(pay_amount) as total_val from CAS_FUS_SJ_DEPT_JJKM_ZTQK_I_Y WHERE 1 = 1 @[and budget_year >= ${param.start_year}] @[and budget_year <= ${param.end_year}] @[and dept_code = ${param.dept_code}] @[and fund_nature_name in ${param.fund_nature_name}] @[and pro_type_name in ${param.pro_type_name}] group BY dept_code, budget_year ) as t2 on t1.dept_code = t2.dept_code and t1.budget_year = t2.budget_year left JOIN (select dept_code, budget_year, gov_exp_subject_name, sum(pay_amount) as subj_total_val from CAS_FUS_SJ_DEPT_JJKM_ZTQK_I_Y WHERE 1 = 1 @[and budget_year >= ${param.start_year}] @[and budget_year <= ${param.end_year}] @[and dept_code = ${param.dept_code}] @[and fund_nature_name in ${param.fund_nature_name}] @[and pro_type_name in ${param.pro_type_name}] group by dept_code, budget_year, gov_exp_subject_name ) as t3 on t1.dept_code = t3.dept_code and t1.budget_year = t3.budget_year and t1.gov_exp_subject_name = t3.gov_exp_subject_name WHERE 1 = 1 @[and t1.budget_year >= ${param.start_year}] @[and t1.budget_year <= ${param.end_year}] @[and t1.dept_code = ${param.dept_code}] @[and t1.fund_nature_name in ${param.fund_nature_name}] @[and t1.pro_type_name in ${param.pro_type_name}] order by rate desc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getEconomicStructureTable dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getEconomicStructureTable dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  //width  也需要修改   180   206
  // 转换接口调用结果为前端需要的结构
  function transformData(inputData, yearStart, yearEnd) {
    // 将传入的年份转换为数值型
    const startYear = parseInt(yearStart, 10);
    const endYear = parseInt(yearEnd, 10);

    // 生成年份数组
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    // 初始化结果结构
    const result = {
      columns: [
        {
          title: "经济科目名称",
          dataIndex: "name",
          key: "name",
          width: 180,
          scopedSlots: { customRender: "name" },
        },
      ],
      data: [],
      tableSlots: years.map((year) => year.toString()),
    };

    // 为每个年份生成对应的列配置
    years.forEach((year) => {
      result.columns.push({
        title: year.toString(),
        dataIndex: year.toString(),
        key: year.toString(),
        width: 206,
        scopedSlots: { customRender: year.toString() },
      });
    });

    // 聚合数据
    const dataMap = new Map();
    inputData.forEach((item, index) => {
      const { gov_exp_subject_name, budget_year, pay_amount, rate, total_val } =
        item;
      if (!dataMap.has(gov_exp_subject_name)) {
        dataMap.set(gov_exp_subject_name, {
          id: index.toString(),
          name: gov_exp_subject_name,
        });
      }
      const subjectData = dataMap.get(gov_exp_subject_name);
      subjectData[budget_year] = `${rate.toFixed(2)}+${pay_amount.toFixed(2)}`;
      dataMap.set(gov_exp_subject_name, subjectData);
    });

    // 填充数据
    let idCounter = 0;
    dataMap.forEach((subjectData, gov_exp_subject_name) => {
      years.forEach((year) => {
        const yearStr = year.toString();
        if (!subjectData[yearStr]) {
          subjectData[yearStr] = "0+0.00";
        }
      });
      result.data.push({ id: idCounter.toString(), ...subjectData });
      idCounter++;
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.start_year, req.end_year),
  };
  console.log("getEconomicStructureTable res: ", JSON.stringify(res));
  return res;
}

//下属单位经济科目对比
export async function getEconomicStructureGraph(req) {
  // 打印视图层的入参请求
  console.log("getEconomicStructureGraph req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct t1.unit_code, t1.unit_name, t1.dept_code as dept_code, t1.gov_exp_subject_name, t1.budget_year as year, round(t2.sub_total_val / 10000,2) as pay_amount_year, round(t2.sub_total_val * 100 / t3.total_val, 2) as rate, ${param.avg_line} as line, round(t3.total_val / 10000,2) as total_val from CAS_FUS_SJ_XZSYDW_JJKM_JGFX_I_Y as t1 left join (select unit_code, budget_year, gov_exp_subject_name, sum(pay_amount_year) as sub_total_val from CAS_FUS_SJ_XZSYDW_JJKM_JGFX_I_Y where 1 = 1 @[and pro_type_name in ${param.pro_type_name}] @[and fund_nature_name in ${param.fund_nature_name}] group by unit_code, budget_year, gov_exp_subject_name ) as t2 on t1.unit_code = t2.unit_code and t1.budget_year = t2.budget_year and t1.gov_exp_subject_name = t2.gov_exp_subject_name left join (select unit_code, budget_year, sum(pay_amount_year) as total_val from CAS_FUS_SJ_XZSYDW_JJKM_JGFX_I_Y where 1 = 1 @[and pro_type_name in ${param.pro_type_name}] @[and fund_nature_name in ${param.fund_nature_name}] group by unit_code, budget_year ) as t3 on t1.unit_code = t3.unit_code and t1.budget_year = t3.budget_year where 1 = 1 @[and t1.budget_year = ${param.year}] @[and t1.dept_code = ${param.dept_code}] @[and t1.gov_exp_subject_name = '${param.gov_exp_subject_name}'] @[and t1.pro_type_name in ${param.pro_type_name}] @[and t1.fund_nature_name in ${param.fund_nature_name}] order by rate desc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getEconomicStructureGraph dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getEconomicStructureGraph dacpRes: ", JSON.stringify(dacpRes));

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
    // 计算average
    const average = inputData.length > 0 ? inputData[0].line : 0;

    // 生成xAxis
    const xAxis = inputData.map((item) => item.unit_name);

    // 生成seriesData
    const seriesData = inputData.map((item) => ({
      name: item.unit_name,
      code: item.unit_code,
      year: item.year,
      subjectName: item.gov_exp_subject_name,
      money: item.pay_amount_year,
    }));

    // 生成data
    const data = inputData.map((item) => item.rate);

    // 返回结果
    return {
      average: average,
      xAxis: xAxis,
      seriesData: seriesData,
      data: data,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getEconomicStructureGraph res: ", JSON.stringify(res));
  return res;
}
