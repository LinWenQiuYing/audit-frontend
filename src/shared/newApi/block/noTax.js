import axiosInstance from "../index.js";

const blockUrl = "/pierce/dacp/invoke";

//------非税tab

//非税数据概览
export async function getNoTaxOverviewData(req) {
  // 打印视图层的入参请求
  console.log("getNoTaxOverviewData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select round(sum(nontax_revenue)/10000,2) as nontaxRevenue, (sum(nontax_revenue)/sum(nontax_revenue_ly)) as nontaxRevenueChange, sum(nontax_dep_cnt) as nontaxDepCnt, (sum(nontax_dep_cnt)-sum(nontax_dep_cnt_ly)) as nontaxDepCntChange, sum(nontax_type_cnt) as nontaxTypeCnt, (sum(nontax_type_cnt)-sum(nontax_type_cnt_ly)) as nontaxTypeCntChange, sum(nontax_pro_cnt) as nontaxProCnt, (sum(nontax_pro_cnt)-sum(nontax_pro_cnt_ly)) as nontaxProCntChange from CAS_FUS_SJ_XZSYDW_NONTAX_OVERVIEW_I_Y where nf= '${param.year}' @[and unit_industry_name in ${param.unitIndustry}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getNoTaxOverviewData dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getNoTaxOverviewData dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    const info = data[0];
    return [
      {
        id: 1,
        typeName: "非税收入总金额（万元）",
        num: info.nontaxRevenue,
        percentage:
          info.nontaxRevenueChange == null
            ? null
            : `${Number((info.nontaxRevenueChange * 100).toFixed(2))}%`,
        status:
          info.nontaxRevenueChange == null
            ? 2
            : info.nontaxRevenueChange > 0
            ? 1
            : 0,
        icon: "非税收入总金额",
      },
      {
        id: 2,
        typeName: "非税收入主管单位数量（个）",
        num: info.nontaxDepCnt,
        percentage:
          info.nontaxDepCntChange == null
            ? null
            : `${Number((info.nontaxDepCntChange * 100).toFixed(2))}%`,
        status:
          info.nontaxDepCntChange == null
            ? 2
            : info.nontaxDepCntChange > 0
            ? 1
            : 0,
        icon: "非税收入主管单位数量",
      },
      {
        id: 3,
        typeName: "非税收入类型（个）",
        num: info.nontaxTypeCnt,
        percentage:
          info.nontaxTypeCntChange == null
            ? null
            : `${Number((info.nontaxTypeCntChange * 100).toFixed(2))}%`,
        status:
          info.nontaxTypeCntChange == null
            ? 2
            : info.nontaxTypeCntChange > 0
            ? 1
            : 0,
        icon: "非税收入类型",
      },
      {
        id: 4,
        typeName: "非税收入项目数量（个）",
        num: info.nontaxProCnt,
        percentage:
          info.nontaxProCntChange == null
            ? null
            : `${Number((info.nontaxProCntChange * 100).toFixed(2))}%`,
        status:
          info.nontaxProCntChange == null
            ? 2
            : info.nontaxProCntChange > 0
            ? 1
            : 0,
        icon: "非税收入项目数量",
      },
    ];
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getNoTaxOverviewData res: ", JSON.stringify(res));
  return res;
}

//板块分析非税tab旭日图
export async function getNoTaxChartOne(req) {
  // 打印视图层的入参请求
  console.log("getNoTaxChartOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpFirstReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select nontax_type_code_1 as nontaxTypeCode, nontax_type_name_1 as nontaxTypeName, round(sum(nontax_je_1)/10000,2) as nontaxJe, sum(nontax_je_1)/(${param.jeTotal}*10000) as nontaxJeRatio from CAS_FUS_SJ_XZSYDW_NONTAX_TYPE1_DISTR_I_Y where nf= '${param.year}' @[and unit_industry_name in ${param.unitIndustry}] group by nontax_type_code_1",
    sqlParameter: req,
  };
  console.log("getNoTaxChartOne dacpFirstReq: ", JSON.stringify(dacpFirstReq));
  const dacpFirstRes = await axiosInstance.post(`${blockUrl}`, dacpFirstReq, {
    timeout: -1,
  });
  console.log("getNoTaxChartOne dacpFirstRes: ", JSON.stringify(dacpFirstRes));
  if (dacpFirstRes.code != 0) {
    return {
      code: dacpFirstRes.code,
      message: dacpFirstRes.message,
      data: dacpFirstRes.data,
    };
  }

  const dacpSecReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select nontax_type_code_1 as nontaxTypeCodeParent, nontax_type_code_2 as nontaxTypeCode, nontax_type_name_2 as nontaxTypeName, round(sum(nontax_je_2)/10000,2) as nontaxJe, sum(nontax_je_2)/(${param.jeTotal}*10000) as nontaxJeRatio from CAS_FUS_SJ_XZSYDW_NONTAX_TYPE2_DISTR_I_Y where nf= '${param.year}' @[and unit_industry_name in ${param.unitIndustry}] group by nontax_type_code_2",
    sqlParameter: req,
  };

  console.log("getNoTaxChartOne dacpSecReq: ", JSON.stringify(dacpSecReq));
  const dacpSecRes = await axiosInstance.post(`${blockUrl}`, dacpSecReq, {
    timeout: -1,
  });
  console.log("getNoTaxChartOne dacpSecRes: ", JSON.stringify(dacpSecRes));
  if (dacpSecRes.code != 0) {
    return {
      code: dacpSecRes.code,
      message: dacpSecRes.message,
      data: dacpSecRes.data,
    };
  }

  function transformData(primaryData, secondaryData) {
    // Helper function to format value and percentage
    const formatValue = (value) => value.toFixed(2);
    const formatPercentage = (percentage) => (percentage * 100).toFixed(2);

    // Transform primary data
    const primaryTransformed = primaryData.map((primary) => ({
      name: primary.nontaxTypeName,
      value: formatValue(primary.nontaxJe),
      per: formatPercentage(primary.nontaxJeRatio),
      children: [],
      level: 1,
    }));

    // Create a lookup map for primary data by code
    const primaryMap = primaryData.reduce((acc, primary) => {
      acc[primary.nontaxTypeCode] = primary;
      return acc;
    }, {});

    // Transform secondary data and associate with primary data
    secondaryData.forEach((secondary) => {
      const parent = primaryMap[secondary.nontaxTypeCodeParent];
      if (parent) {
        const secondaryTransformed = {
          name: secondary.nontaxTypeName,
          value: formatValue(secondary.nontaxJe),
          per: formatPercentage(secondary.nontaxJeRatio),
          children: null,
          level: 2,
        };
        primaryTransformed
          .find((p) => p.name === parent.nontaxTypeName)
          .children.push(secondaryTransformed);
      }
    });

    // Clean up empty children arrays
    primaryTransformed.forEach((primary) => {
      if (primary.children.length === 0) {
        primary.children = null;
      }
    });

    return primaryTransformed;
  }

  const res = {
    code: dacpSecRes.code,
    message: "成功",
    data: transformData(dacpFirstRes.data, dacpSecRes.data),
  };
  console.log("getNoTaxChartOne res: ", JSON.stringify(res));
  return res;
}

//板块分析非税tab柱状图
export async function getNoTaxChartTwo(req) {
  // 打印视图层的入参请求
  console.log("getNoTaxChartTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select * from(select nf,  dept_code as deptCode, dept_name as deptName, round(sum(dept_nontax_je)/10000, 2) as deptNontaxJe, sum(dept_nontax_je)/(${param.jeTotal}*10000) as nontaxJeRatio from CAS_FUS_SJ_XZSYDW_NONTAX_ZG_DISTR_I_Y where nf= '${param.year}' @[and unit_industry_name in ${param.unitIndustry}] @[and nontax_type_name_1 = '${param.nontaxTypeNameOne}'] @[and nontax_type_name_2 = '${param.nontaxTypeNameTwo}']  and  dept_name is not null group by nf, deptName, deptCode order by deptNontaxJe asc) as a where deptNontaxJe>=100",
    sqlParameter: req,
  };
  console.log("getNoTaxChartTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getNoTaxChartTwo dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(inputData) {
    // Helper function to format value and percentage
    const formatValue = (value) => (value / 10000).toFixed(2);
    const formatPercentage = (percentage) => (percentage * 100).toFixed(2);

    // Transform input data
    const seriesData = inputData.map((item) => ({
      name: item.deptName,
      code: item.deptCode,
      rate: formatPercentage(item.nontaxJeRatio),
      nontaxJe: formatValue(item.deptNontaxJe),
    }));

    // Sort seriesData by nontaxJe value
    seriesData.sort((a, b) => parseFloat(a.nontaxJe) - parseFloat(b.nontaxJe));

    // Extract data and yaxis
    const data = seriesData.map((item) => parseFloat(item.nontaxJe));
    const yaxis = seriesData.map((item) => item.name);

    // Return the final result
    return {
      seriesData: seriesData,
      data: data,
      yaxis: yaxis,
    };
  }

  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getNoTaxChartTwo res: ", JSON.stringify(res));
  return res;
}

//非税收入历年趋势图数据
export async function getNoTaxChartThree(req) {
  // 打印视图层的入参请求
  console.log("getNoTaxChartThree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpPrimaryReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select nf,  dept_code as deptCode, dept_name as deptName, round(sum(dept_nontax_je)/10000, 2) as deptNontaxJe, sum(dept_pro_cnt) as deptProCnt from CAS_FUS_SJ_XZSYDW_NONTAX_ZG_DISTR_I_Y where 1=1 @[AND nf BETWEEN CAST(CAST('${param.year}' AS SIGNED) - 4 AS CHAR) AND '${param.year}'] @[and unit_industry_name in ${param.unitIndustry}] @[and dept_code in ${param.deptNames}] @[and nontax_type_name_1 = '${param.nontaxTypeNameOne}'] @[and nontax_type_name_2 = '${param.nontaxTypeNameTwo}'] group by nf, deptName, deptCode",
    sqlParameter: req,
  };

  console.log(
    "getNoTaxChartThree dacpPrimaryReq: ",
    JSON.stringify(dacpPrimaryReq)
  );
  const dacpPrimaryRes = await axiosInstance.post(
    `${blockUrl}`,
    dacpPrimaryReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getNoTaxChartThree dacpPrimaryRes: ",
    JSON.stringify(dacpPrimaryRes)
  );
  if (dacpPrimaryRes.code != 0) {
    return {
      code: dacpPrimaryRes.code,
      message: dacpPrimaryRes.message,
      data: dacpPrimaryRes.data,
    };
  }

  // 构造后端dacp接口请求
  const dacpSecondaryReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select round(sum(dept_nontax_je)/10000, 2) as deptNontaxJeSum , nf from CAS_FUS_SJ_XZSYDW_NONTAX_ZG_DISTR_I_Y where nf between ${param.year}-4 and  ${param.year} @[and unit_industry_name in ${param.unitIndustry}] @[and nontax_type_name_1 = '${param.typeNameOne}'] @[and nontax_type_name_2 = '${param.typeNameTwo}'] group by nf ",
    sqlParameter: req,
  };

  console.log(
    "getNoTaxChartThree dacpSecondaryReq: ",
    JSON.stringify(dacpSecondaryReq)
  );
  const dacpSecondaryRes = await axiosInstance.post(
    `${blockUrl}`,
    dacpSecondaryReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getNoTaxChartThree dacpSecondaryRes: ",
    JSON.stringify(dacpSecondaryRes)
  );
  if (dacpSecondaryRes.code != 0) {
    return {
      code: dacpSecondaryRes.code,
      message: dacpSecondaryRes.message,
      data: dacpSecondaryRes.data,
    };
  }

  function transformData(
    primaryData,
    secondaryData,
    currentYear,
    sortCondition
  ) {
    const currentYearInt = parseInt(currentYear, 10);
    const years = Array.from({ length: 5 }, (_, i) =>
      (currentYearInt - 4 + i).toString()
    );
    const totalNontaxJeSum = secondaryData[0].deptNontaxJeSum;

    // Initialize the result object
    const data = {
      legend: [],
      seriesData: [],
      yAxis: {
        name: sortCondition === "金额" ? "金额（万元）" : "项目数量（个）",
      },
      xAxis: years,
    };

    // Create a map to store the data by deptCode
    const deptMap = new Map();

    primaryData.forEach((item) => {
      const { deptCode, deptName, nf, deptNontaxJe, deptProCnt } = item;
      if (!deptMap.has(deptCode)) {
        deptMap.set(deptCode, {
          name: deptName,
          code: deptCode,
          data: new Array(5).fill(0),
          projectNum: new Array(5).fill(0),
          rate: new Array(5).fill(0),
        });
        data.legend.push(deptName);
      }
      const deptData = deptMap.get(deptCode);
      const yearIndex = years.indexOf(nf);
      if (yearIndex !== -1) {
        deptData.data[yearIndex] = (deptNontaxJe / 10000).toFixed(2);
        deptData.projectNum[yearIndex] = deptProCnt;
        deptData.rate[yearIndex] = (
          (deptNontaxJe / totalNontaxJeSum) *
          100
        ).toFixed(2);
      }
    });

    // Convert the map to the seriesData array
    data.seriesData = Array.from(deptMap.values());

    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(
      dacpPrimaryRes.data,
      dacpSecondaryRes.data,
      req.year,
      req.odName
    ),
  };
  console.log("getNoTaxChartThree res: ", JSON.stringify(res));
  return res;
}

//板块分析非税收入类型下拉框
export async function getNoTaxChartThreeType(req) {
  // 打印视图层的入参请求
  console.log("getNoTaxChartThreeType req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpFirstReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select nontax_type_code_1 as nontaxTypeCode, nontax_type_name_1 as nontaxTypeName from CAS_FUS_SJ_XZSYDW_NONTAX_TYPE1_DISTR_I_Y where nf= '${param.year}' @[and unit_industry_name in ${param.unitIndustry}] group by nontax_type_code_1",
    sqlParameter: req,
  };
  console.log(
    "getNoTaxChartThreeType dacpFirstReq: ",
    JSON.stringify(dacpFirstReq)
  );
  const dacpFirstRes = await axiosInstance.post(`${blockUrl}`, dacpFirstReq, {
    timeout: -1,
  });
  console.log(
    "getNoTaxChartThreeType dacpFirstRes: ",
    JSON.stringify(dacpFirstRes)
  );
  if (dacpFirstRes.code != 0) {
    return {
      code: dacpFirstRes.code,
      message: dacpFirstRes.message,
      data: dacpFirstRes.data,
    };
  }

  const dacpSecReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select nontax_type_code_1 as nontaxTypeCodeParent, nontax_type_code_2 as nontaxTypeCode, nontax_type_name_2 as nontaxTypeName from CAS_FUS_SJ_XZSYDW_NONTAX_TYPE2_DISTR_I_Y where nf= '${param.year}' @[and unit_industry_name in ${param.unitIndustry}] group by nontax_type_code_2",
    sqlParameter: req,
  };

  console.log(
    "getNoTaxChartThreeType dacpSecReq: ",
    JSON.stringify(dacpSecReq)
  );
  const dacpSecRes = await axiosInstance.post(`${blockUrl}`, dacpSecReq, {
    timeout: -1,
  });
  console.log(
    "getNoTaxChartThreeType dacpSecRes: ",
    JSON.stringify(dacpSecRes)
  );
  if (dacpSecRes.code != 0) {
    return {
      code: dacpSecRes.code,
      message: dacpSecRes.message,
      data: dacpSecRes.data,
    };
  }

  function transformData(primaryData, secondaryData) {
    // Transform primary data
    const primaryTransformed = primaryData.map((primary) => ({
      title: primary.nontaxTypeName,
      value: `${primary.nontaxTypeName}_1_${primary.nontaxTypeCode}`,
      key: primary.nontaxTypeCode,
      children: [],
    }));

    // Create a lookup map for primary data by code
    const primaryMap = primaryTransformed.reduce((acc, primary) => {
      acc[primary.key] = primary;
      return acc;
    }, {});

    // Transform secondary data and associate with primary data
    secondaryData.forEach((secondary) => {
      const parent = primaryMap[secondary.nontaxTypeCodeParent];
      if (parent) {
        const secondaryTransformed = {
          title: secondary.nontaxTypeName,
          value: `${secondary.nontaxTypeName}_2_${secondary.nontaxTypeCode}`,
          key: secondary.nontaxTypeCode,
          children: null,
        };
        parent.children.push(secondaryTransformed);
      }
    });

    return primaryTransformed;
  }

  const res = {
    code: dacpSecRes.code,
    message: "成功",
    data: transformData(dacpFirstRes.data, dacpSecRes.data),
  };
  console.log("getNoTaxChartThreeType res: ", JSON.stringify(res));
  return res;
}

//板块分析非税明细预算单位选择框数据获取
export async function getNoTaxChartThreeBudget(req) {
  // 打印视图层的入参请求
  console.log("getNoTaxChartThreeBudget req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select DISTINCT concat(budget_unit_code,'--',budget_unit_name) as `key`, budget_unit_code as value from CAS_FUS_SJ_XZSYDW_YSUNIT_BASIC_INFO_I_Y where q_finance_area_code = '310000'  @[and finance_year = '${param.year}']  @[and unit_industry_name in ${param.unitIndustry}] @[and dept_code in ${param.deptCodes}]  order by budget_unit_code asc",
    sqlParameter: req,
  };
  console.log("getNoTaxChartThreeBudget dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getNoTaxChartThreeBudget dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  const res = {
    code: dacpRes.code,
    message: "成功",
    data: dacpRes.data,
  };
  console.log("getNoTaxChartThreeBudget res: ", JSON.stringify(res));
  return res;
}

//板块分析非税明细主管单位选择框数据获取
export async function getNoTaxChartThreeUnit(req) {
  // 打印视图层的入参请求
  console.log("getNoTaxChartThreeUnit req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select DISTINCT  CONCAT(dept_code,'--',dept_name) as `key`, dept_code as value from CAS_FUS_SJ_XZSYDW_YSUNIT_BASIC_INFO_I_Y  where q_finance_area_code = '310000'  @[and finance_year = '${param.year}']  @[and unit_industry_name in ${param.unitIndustry}] @[and budget_unit_code in ${param.unitCodes}]  order by dept_code asc",
    sqlParameter: req,
  };

  console.log("getNoTaxChartThreeUnit dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getNoTaxChartThreeUnit dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  const res = {
    code: dacpRes.code,
    message: "成功",
    data: dacpRes.data,
  };
  console.log("getNoTaxChartThreeUnit res: ", JSON.stringify(res));
  return res;
}

//板块分析非税明细表格和总数获取
export async function getNoTaxTable(req) {
  // 打印视图层的入参请求
  console.log("getNoTaxTable req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select nontax_type_name as nontaxTypeName, nontax_project_name as nontaxProjectName, payment_date as paymentDate, recorded_date as recordedDate, payer_name as payerName, payee_name as payeeName, srkmmc, jkje, dept_name as deptName, unit_name as unitName, yjje, znjje, funds_nature_name as fundsNatureName from cas_fus_sj_xzsydw_nontax_detail_i_y where 1=1 @[and nf = '${param.year}'] @[and unit_industry_name in ${param.unitIndustry}] @[and dept_code in ${param.deptCode}] @[and unit_code in ${param.unitCode}] @[and nontax_type_name = '${param.nontaxTypeName}'] @[and srkmmc like '%${param.srkmmc}%'] @[and nontax_project_name like '%${param.nontaxProjectName}%'] @[and payment_date between ${param.paymentDateStart} and ${param.paymentDateEnd}] @[and recorded_date between ${param.recordedDateStart} and ${param.recordedDateEnd}] @[order by ${param.odName}] limit ${param.pageSize} offset ${param.pageNumber}",
    sqlParameter: req,
  };
  console.log("getNoTaxTable dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getNoTaxTable dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select count(*) as total from cas_fus_sj_xzsydw_nontax_detail_i_y where 1=1 @[and nf = '${param.year}'] @[and unit_industry_name in ${param.unitIndustry}] @[and dept_code in ${param.deptCode}] @[and unit_code in ${param.unitCode}] @[and nontax_type_name = '${param.nontaxTypeName}'] @[and srkmmc like '%${param.srkmmc}%'] @[and nontax_project_name like '%${param.nontaxProjectName}%'] @[and payment_date between ${param.paymentDateStart} and ${param.paymentDateEnd}] @[and recorded_date between ${param.recordedDateStart} and ${param.recordedDateEnd}] @[order by ${param.odName}] ",
    sqlParameter: req,
  };
  console.log("getNoTaxTable dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(`${blockUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log("getNoTaxTable dacpTotalRes: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  const res = {
    code: dacpRes.code,
    message: "成功",
    data: {
      total: dacpTotalRes.data[0].total,
      dateList: dacpRes.data,
    },
  };
  console.log("getNoTaxTable res: ", JSON.stringify(res));
  return res;
}

//板块分析非税明细排序
export async function getNoTaxTableSortedOptions() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "金额",
        value: "jkje",
        type: "number",
      },
      {
        label: "主管单位",
        value: "deptName",
        type: "string",
      },
      {
        label: "预算单位",
        value: "unitName",
        type: "string",
      },
      {
        label: "项目名称",
        value: "nontaxProjectName",
        type: "string",
      },
      {
        label: "非税收入类别",
        value: "nontaxTypeName",
        type: "string",
      },
      {
        label: "缴款日期",
        value: "paymentDate",
        type: "string",
      },
      {
        label: "入账日期",
        value: "recordedDate",
        type: "string",
      },
      {
        label: "缴款人",
        value: "payerName",
        type: "string",
      },
      {
        label: "收款人",
        value: "payeeName",
        type: "string",
      },
      {
        label: "收入科目",
        value: "srkmmc",
        type: "string",
      },
    ],
  };
  return res;
}

//初始获取选项为金额时的top8主管单位的id数组
export async function getNoTaxChartThreeMoneyTop8(req) {
  // 打印视图层的入参请求
  console.log("getNoTaxChartThreeMoneyTop8 req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select t.dept_name, t.dept_code from( select dept_name , dept_code, sum(dept_nontax_je) as je_total, sum(dept_pro_cnt) as pro_total  from CAS_FUS_SJ_XZSYDW_NONTAX_ZG_DISTR_I_Y where  dept_name  is not null and nf between ${param.year}-4 and  ${param.year} @[and unit_industry_name in ${param.unitIndustry} ]                @[and nontax_type_name_1 = '${param.typeNameOne}'] @[and nontax_type_name_2 = '${param.typeNameTwo}']  group by dept_code, dept_name  order by  je_total desc    limit 8) as t order by t.dept_code asc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getNoTaxChartThreeMoneyTop8 dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getNoTaxChartThreeMoneyTop8 dacpRes: ", JSON.stringify(dacpRes));

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
    return data.map((item) => item.dept_code);
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getNoTaxChartThreeMoneyTop8 res: ", JSON.stringify(res));
  return res;
}

//初始获取选项为项目数量时的top8主管单位的id数组
export async function getNoTaxChartThreeProjectTop8(req) {
  // 打印视图层的入参请求
  console.log("getNoTaxChartThreeProjectTop8 req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select t.dept_name, t.dept_code from( select dept_name , dept_code,  sum(dept_nontax_je) as je_total, sum(dept_pro_cnt) as pro_total  from CAS_FUS_SJ_XZSYDW_NONTAX_ZG_DISTR_I_Y where dept_name is not null and nf between ${param.year}-4 and  ${param.year} @[and unit_industry_name in ${param.unitIndustry} ] @[and nontax_type_name_1 = '${param.typeNameOne}'] @[and nontax_type_name_2 = '${param.typeNameTwo}']  group by dept_code, dept_name  order by  pro_total desc    limit 8) as t order by t.dept_code asc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getNoTaxChartThreeProjectTop8 dacpReq: ",
    JSON.stringify(dacpReq)
  );
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(
    "getNoTaxChartThreeProjectTop8 dacpRes: ",
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
    return data.map((item) => item.dept_code);
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getNoTaxChartThreeProjectTop8 res: ", JSON.stringify(res));
  return res;
}
