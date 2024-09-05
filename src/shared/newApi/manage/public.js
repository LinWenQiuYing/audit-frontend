import axiosInstance from "../index.js";

const manageUrl = "/pierce/dacp/invoke";

//------三公费用Tab页面
//三公概览
export async function getManagePublicOverview(req) {
  // 打印视图层的入参请求
  console.log("getManagePublicOverview req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT * FROM ( SELECT 1 AS id, '三公支出总金额（元）' AS typeName, ROUND(c.sg_total, 2) AS num, CASE WHEN p.sg_total IS NOT NULL THEN CONCAT(ROUND(ABS((c.sg_total - p.sg_total) / p.sg_total * 100), 2), '%') ELSE '--%' END AS percentage, CASE WHEN p.sg_total IS NOT NULL THEN CASE WHEN (c.sg_total - p.sg_total) >= 0 THEN 1 ELSE 0 END ELSE 2 END AS status, '三公支出总金额' AS icon FROM CAS_FUS_SJ_SG_DEPT_I_Y c LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y p ON c.dept_code = p.dept_code AND p.nf = CAST(CAST('${param.year}' AS SIGNED) - 1 AS CHAR) WHERE 1=1 @[AND c.dept_code = '${param.deptCode}'] @[AND c.nf = '${param.year}'] UNION ALL SELECT 2 AS id, '公务车费用（元）' AS typeName, ROUND(c.sg_gwyc, 2) AS num, CASE WHEN p.sg_gwyc IS NOT NULL THEN CONCAT(ROUND(ABS((c.sg_gwyc - p.sg_gwyc) / p.sg_gwyc * 100), 2), '%') ELSE '--%' END AS percentage, CASE WHEN p.sg_gwyc IS NOT NULL THEN CASE WHEN (c.sg_gwyc - p.sg_gwyc) >= 0 THEN 1 ELSE 0 END ELSE 2 END AS status, '公务车费用' AS icon FROM CAS_FUS_SJ_SG_DEPT_I_Y c LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y p ON c.dept_code = p.dept_code AND p.nf = CAST(CAST('${param.year}' AS SIGNED) - 1 AS CHAR) WHERE 1=1 @[AND c.dept_code = '${param.deptCode}'] @[AND c.nf = '${param.year}']UNION ALL SELECT 3 AS id, '公务接待费用（元）' AS typeName, ROUND(c.sg_gwjd, 2) AS num, CASE WHEN p.sg_gwjd IS NOT NULL THEN CONCAT(ROUND(ABS((c.sg_gwjd - p.sg_gwjd) / p.sg_gwjd * 100), 2), '%') ELSE '--%' END AS percentage, CASE WHEN p.sg_gwjd IS NOT NULL THEN CASE WHEN (c.sg_gwjd - p.sg_gwjd) >= 0 THEN 1 ELSE 0 END ELSE 2 END AS status, '公务接待费用' AS icon FROM CAS_FUS_SJ_SG_DEPT_I_Y c LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y p ON c.dept_code = p.dept_code AND p.nf = CAST(CAST('${param.year}' AS SIGNED) - 1 AS CHAR) WHERE 1=1 @[AND c.dept_code = '${param.deptCode}'] @[AND c.nf = '${param.year}'] UNION ALL SELECT 4 AS id, '因公出国费用（元）' AS typeName, ROUND(c.sg_gwcg, 2) AS num, CASE WHEN p.sg_gwcg IS NOT NULL THEN CONCAT(ROUND(ABS((c.sg_gwcg - p.sg_gwcg) / p.sg_gwcg * 100), 2), '%') ELSE '--%' END AS percentage, CASE WHEN p.sg_gwcg IS NOT NULL THEN CASE WHEN (c.sg_gwcg - p.sg_gwcg) >= 0 THEN 1 ELSE 0 END ELSE 2 END AS status, '因公出国费用' AS icon FROM CAS_FUS_SJ_SG_DEPT_I_Y c LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y p ON c.dept_code = p.dept_code AND p.nf = CAST(CAST('${param.year}' AS SIGNED) - 1 AS CHAR) WHERE 1=1 @[AND c.dept_code = '${param.deptCode}'] @[AND c.nf = '${param.year}'] ) AS final_result;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManagePublicOverview dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManagePublicOverview dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getManagePublicOverview res: ", JSON.stringify(res));
  return res;
}

//三公支出分析（按类型）表格
export async function getManagePublicTableOne(req) {
  // 打印视图层的入参请求
  console.log("getManagePublicTableOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT * FROM ( SELECT '公务车费用' AS threePublicType, COALESCE(CONCAT(ROUND((c1.sg_gwyc / c1.sg_total) * 100, 2), '+', ROUND(c1.sg_gwyc, 2)), '--+--') AS fifthYear, COALESCE(CONCAT(ROUND((c2.sg_gwyc / c2.sg_total) * 100, 2), '+', ROUND(c2.sg_gwyc, 2)), '--+--') AS forthYear, COALESCE(CONCAT(ROUND((c3.sg_gwyc / c3.sg_total) * 100, 2), '+', ROUND(c3.sg_gwyc, 2)), '--+--') AS thirdYear, COALESCE(CONCAT(ROUND((c4.sg_gwyc / c4.sg_total) * 100, 2), '+', ROUND(c4.sg_gwyc, 2)), '--+--') AS secondYear, COALESCE(CONCAT(ROUND((c5.sg_gwyc / c5.sg_total) * 100, 2), '+', ROUND(c5.sg_gwyc, 2)), '--+--') AS firstYear FROM CAS_FUS_SJ_SG_DEPT_I_Y c1 LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c2 ON c1.dept_code = c2.dept_code AND c2.nf = CAST(CAST('${param.year}' AS SIGNED) - 1 AS CHAR) LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c3 ON c1.dept_code = c3.dept_code AND c3.nf = CAST(CAST('${param.year}' AS SIGNED) - 2 AS CHAR) LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c4 ON c1.dept_code = c4.dept_code AND c4.nf = CAST(CAST('${param.year}' AS SIGNED) - 3 AS CHAR) LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c5 ON c1.dept_code = c5.dept_code AND c5.nf = CAST(CAST('${param.year}' AS SIGNED) - 4 AS CHAR) WHERE 1=1 @[AND c1.dept_code = '${param.deptCode}'] @[AND c1.nf = '${param.year}'] UNION ALL SELECT '公务接待费用' AS threePublicType, COALESCE(CONCAT(ROUND((c1.sg_gwjd / c1.sg_total) * 100, 2), '+', ROUND(c1.sg_gwjd, 2)), '--+--') AS fifthYear, COALESCE(CONCAT(ROUND((c2.sg_gwjd / c2.sg_total) * 100, 2), '+', ROUND(c2.sg_gwjd, 2)), '--+--') AS forthYear, COALESCE(CONCAT(ROUND((c3.sg_gwjd / c3.sg_total) * 100, 2), '+', ROUND(c3.sg_gwjd, 2)), '--+--') AS thirdYear, COALESCE(CONCAT(ROUND((c4.sg_gwjd / c4.sg_total) * 100, 2), '+', ROUND(c4.sg_gwjd, 2)), '--+--') AS secondYear, COALESCE(CONCAT(ROUND((c5.sg_gwjd / c5.sg_total) * 100, 2), '+', ROUND(c5.sg_gwjd, 2)), '--+--') AS firstYear FROM CAS_FUS_SJ_SG_DEPT_I_Y c1 LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c2 ON c1.dept_code = c2.dept_code AND c2.nf = CAST(CAST('${param.year}' AS SIGNED) - 1 AS CHAR) LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c3 ON c1.dept_code = c3.dept_code AND c3.nf = CAST(CAST('${param.year}' AS SIGNED) - 2 AS CHAR) LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c4 ON c1.dept_code = c4.dept_code AND c4.nf = CAST(CAST('${param.year}' AS SIGNED) - 3 AS CHAR) LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c5 ON c1.dept_code = c5.dept_code AND c5.nf = CAST(CAST('${param.year}' AS SIGNED) - 4 AS CHAR) WHERE 1=1 @[AND c1.dept_code = '${param.deptCode}'] @[AND c1.nf = '${param.year}'] UNION ALL SELECT '因公出国费用' AS threePublicType, COALESCE(CONCAT(ROUND((c1.sg_gwcg / c1.sg_total) * 100, 2), '+', ROUND(c1.sg_gwcg, 2)), '--+--') AS fifthYear, COALESCE(CONCAT(ROUND((c2.sg_gwcg / c2.sg_total) * 100, 2), '+', ROUND(c2.sg_gwcg, 2)), '--+--') AS forthYear, COALESCE(CONCAT(ROUND((c3.sg_gwcg / c3.sg_total) * 100, 2), '+', ROUND(c3.sg_gwcg, 2)), '--+--') AS thirdYear, COALESCE(CONCAT(ROUND((c4.sg_gwcg / c4.sg_total) * 100, 2), '+', ROUND(c4.sg_gwcg, 2)), '--+--') AS secondYear, COALESCE(CONCAT(ROUND((c5.sg_gwcg / c5.sg_total) * 100, 2), '+', ROUND(c5.sg_gwcg, 2)), '--+--') AS firstYear FROM CAS_FUS_SJ_SG_DEPT_I_Y c1 LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c2 ON c1.dept_code = c2.dept_code AND c2.nf = CAST(CAST('${param.year}' AS SIGNED) - 1 AS CHAR) LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c3 ON c1.dept_code = c3.dept_code AND c3.nf = CAST(CAST('${param.year}' AS SIGNED) - 2 AS CHAR) LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c4 ON c1.dept_code = c4.dept_code AND c4.nf = CAST(CAST('${param.year}' AS SIGNED) - 3 AS CHAR) LEFT JOIN CAS_FUS_SJ_SG_DEPT_I_Y c5 ON c1.dept_code = c5.dept_code AND c5.nf = CAST(CAST('${param.year}' AS SIGNED) - 4 AS CHAR) WHERE 1=1 @[AND c1.dept_code = '${param.deptCode}'] @[AND c1.nf = '${param.year}'] ) AS final_result;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManagePublicTableOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManagePublicTableOne dacpRes: ", JSON.stringify(dacpRes));

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
      title: "三公支出类型",
      dataIndex: "threePublicType",
      key: "threePublicType",
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

    // 生成数据源
    inputData.forEach((item) => {
      const resultItem = {
        threePublicType: item.threePublicType,
        firstYear: item.firstYear,
        secondYear: item.secondYear,
        thirdYear: item.thirdYear,
        forthYear: item.forthYear,
        fifthYear: item.fifthYear,
      };
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
  console.log("getManagePublicTableOne res: ", JSON.stringify(res));
  return res;
}

//三公支出分布（按预算单位）
export async function getManagePublicTableTwo(req) {
  // 打印视图层的入参请求
  console.log("getManagePublicTableTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT budgetName, type,  data, year, sglxfy, total, ratio FROM ( SELECT unit_name AS budgetName, '公务车费用' AS type, COALESCE(CONCAT(ROUND(sg_gwyc, 2), '+', ROUND(sg_gwyc_ratio * 100, 2)), '--+--') AS data, nf AS year, ROUND(sg_gwyc, 2) AS sglxfy, ROUND(sg_total, 2) AS total, ROUND(sg_gwyc_ratio *100, 2) AS ratio FROM CAS_FUS_SJ_SG_DEPT_UNIT_I_Y WHERE 1=1 @[AND dept_code = '${param.deptCode}'] @[AND nf BETWEEN CAST(CAST('${param.year}' AS SIGNED) - 4 AS CHAR) AND '${param.year}'] UNION ALL SELECT unit_name AS budgetName, '公务接待费用' AS type, COALESCE(CONCAT(ROUND(sg_gwjd, 2), '+', ROUND(sg_gwjd_ratio * 100, 2)), '--+--') AS data, nf AS year, ROUND(sg_gwjd, 2) AS sglxfy, ROUND(sg_total, 2) AS total, ROUND(sg_gwjd_ratio * 100, 2) AS ratio FROM CAS_FUS_SJ_SG_DEPT_UNIT_I_Y WHERE 1=1 @[AND dept_code = '${param.deptCode}'] @[AND nf BETWEEN CAST(CAST('${param.year}' AS SIGNED) - 4 AS CHAR) AND '${param.year}'] UNION ALL SELECT unit_name AS budgetName, '因公出国费用' AS type, COALESCE(CONCAT(ROUND(sg_gwcg, 2), '+', ROUND(sg_gwcg_ratio * 100, 2)), '--+--') AS data, nf AS year, ROUND(sg_gwcg, 2) AS sglxfy, ROUND(sg_total, 2) AS total, ROUND(sg_gwcg_ratio * 100, 2) AS ratio FROM CAS_FUS_SJ_SG_DEPT_UNIT_I_Y WHERE 1=1 @[AND dept_code = '${param.deptCode}'] @[AND nf BETWEEN CAST(CAST('${param.year}' AS SIGNED) - 4 AS CHAR) AND '${param.year}'] ) AS final_result WHERE 1=1 @[and ${param.filterCondition}] ORDER BY budgetName,year,type;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManagePublicTableTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManagePublicTableTwo dacpRes: ", JSON.stringify(dacpRes));

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

    // 首先计算每个 budgetName 的 maxNum
    const maxNumMap = inputData.reduce((acc, item) => {
      const budgetName = item.budgetName;
      const sglxfy = item.sglxfy !== null ? item.sglxfy : 0;

      if (!acc[budgetName]) {
        acc[budgetName] = sglxfy;
      } else {
        acc[budgetName] = Math.max(acc[budgetName], sglxfy);
      }
      return acc;
    }, {});

    // 分组数据并添加 maxNum
    const groupedData = inputData.reduce((acc, item) => {
      const key = `${item.budgetName}_${item.type}`;
      if (!acc[key]) {
        acc[key] = {
          id: Object.keys(acc).length + 1,
          budgetName: item.budgetName,
          type: item.type,
          data: item.data,
          graphTrend: {
            money: {
              type: "line",
              data: new Array(5).fill(0),
              total: new Array(5).fill(0),
              rate: new Array(5).fill(0),
            },
          },
          maxNum: maxNumMap[item.budgetName],
        };
      }

      const yearIndex = years.indexOf(item.year);
      if (yearIndex !== -1) {
        acc[key].graphTrend.money.data[yearIndex] = item.sglxfy || 0;
        acc[key].graphTrend.money.total[yearIndex] = item.total || 0;
        acc[key].graphTrend.money.rate[yearIndex] = item.ratio || 0;
      }

      return acc;
    }, {});

    // 生成结果数组
    const result = Object.values(groupedData).map((item) => {
      // 补全缺失年份数据
      for (let i = 0; i < 5; i++) {
        if (!item.graphTrend.money.data[i]) item.graphTrend.money.data[i] = 0;
        if (!item.graphTrend.money.total[i]) item.graphTrend.money.total[i] = 0;
        if (!item.graphTrend.money.rate[i]) item.graphTrend.money.rate[i] = 0;
      }
      return item;
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManagePublicTableTwo res: ", JSON.stringify(res));
  return res;
}

//三公支出分布（按预算单位）筛选
export async function getManagePublicTableTwoFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "预算单位",
        value: "budgetName",
        type: "string",
      },
      {
        label: "三公支出类型",
        value: "type",
        type: "string",
      },
      {
        label: "三公支出费用",
        value: "sglxfy",
        type: "number",
      },
    ],
  };
  return res;
}

//人均三公费用对比  横向柱状图
export async function getManagePublicGraphOne(req) {
  // 打印视图层的入参请求
  console.log("getManagePublicGraphOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT * FROM (SELECT unit_name, ROUND(per_sg_gwyc, 2) AS per_spending, '公务用车费用' AS assertsType, unit_active_headcount AS count, ROUND(sg_gwyc, 2) AS total FROM CAS_FUS_SJ_SG_DEPT_UNIT_I_Y WHERE 1=1 @[AND dept_code = '${param.deptCode}'] @[AND nf = '${param.year}'] @[AND '${param.sgType}' = '公务车'] UNION ALL SELECT unit_name, ROUND(per_sg_gwjd, 2) AS per_spending, '公务接待费用' AS assertsType, unit_active_headcount AS count, ROUND(sg_gwjd, 2) AS total FROM CAS_FUS_SJ_SG_DEPT_UNIT_I_Y WHERE 1=1 @[AND dept_code = '${param.deptCode}'] @[AND nf = '${param.year}'] @[AND '${param.sgType}' = '公务接待'] UNION ALL SELECT unit_name, ROUND(per_sg_gwcg, 2) AS per_spending, '因公出国（境）费用' AS assertsType, unit_active_headcount AS count, ROUND(sg_gwcg, 2) AS total FROM CAS_FUS_SJ_SG_DEPT_UNIT_I_Y WHERE 1=1 @[AND dept_code = '${param.deptCode}'] @[AND nf = '${param.year}'] @[AND '${param.sgType}' = '因公出国'] UNION ALL SELECT unit_name, ROUND(per_sg_total, 2) AS per_spending, '全部' AS assertsType, unit_active_headcount AS count, ROUND(sg_total, 2) AS total FROM CAS_FUS_SJ_SG_DEPT_UNIT_I_Y WHERE 1=1 @[AND dept_code = '${param.deptCode}'] @[AND nf = '${param.year}'] @[AND '${param.sgType}' = '全部'] ) as result order by per_spending asc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManagePublicGraphOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManagePublicGraphOne dacpRes: ", JSON.stringify(dacpRes));

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
    // 将所有null值转化为0，并转换数据类型
    const sanitizedData = inputData.map((item) => ({
      unit_name: item.unit_name,
      per_spending:
        item.per_spending !== null ? parseFloat(item.per_spending) : 0,
      assertsType: item.assertsType,
      count: item.count !== null ? parseInt(item.count, 10) : 0,
      total: item.total !== null ? parseFloat(item.total) : 0,
    }));

    // 计算总的count和total，用于计算averageValue
    const totalCount = sanitizedData.reduce((acc, item) => acc + item.count, 0);
    const totalSum = sanitizedData.reduce((acc, item) => acc + item.total, 0);

    // 计算averageValue，保留两位小数
    const averageValue =
      totalCount !== 0 ? (totalSum / totalCount).toFixed(2) : 0;

    // 按per_spending升序排列数据
    const sortedData = sanitizedData.sort(
      (a, b) => a.per_spending - b.per_spending
    );

    // 提取yAxis和seriesData
    const yAxis = sortedData.map((item) => item.unit_name);
    const seriesData = sortedData.map((item) => item.per_spending);

    // 生成data数组
    const data = sortedData.map((item) => ({
      name: item.unit_name,
      assertsType: item.assertsType,
      count: item.count,
      total: item.total,
      average: item.per_spending,
    }));

    // 返回结果
    return {
      yAxis: yAxis,
      data: data,
      seriesData: seriesData,
      averageValue: averageValue,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManagePublicGraphOne res: ", JSON.stringify(res));
  return res;
}

//人均三公费用对比  折线图
export async function getManagePublicGraphTwo(req) {
  // 打印视图层的入参请求
  console.log("getManagePublicGraphTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT u.unit_name, d.dept_name, u.nf AS year, u.unit_active_headcount AS unit_count, '${param.sgType}' AS assertsType, d.dept_active_headcount AS dept_count, ROUND(CASE WHEN '${param.sgType}' = '公务用车费用' THEN u.per_sg_gwyc WHEN '${param.sgType}' = '公务接待费用' THEN u.per_sg_gwjd WHEN '${param.sgType}' = '因公出国（境）费用' THEN u.per_sg_gwcg WHEN '${param.sgType}' = '全部' THEN u.per_sg_total ELSE NULL END, 2) AS unit_avg, ROUND(CASE WHEN '${param.sgType}' = '公务用车费用' THEN d.sg_gwyc / d.dept_active_headcount WHEN '${param.sgType}' = '公务接待费用' THEN d.sg_gwjd / d.dept_active_headcount WHEN '${param.sgType}' = '因公出国（境）费用' THEN d.sg_gwcg / d.dept_active_headcount WHEN '${param.sgType}' = '全部' THEN d.sg_total / d.dept_active_headcount ELSE NULL END, 2) AS dept_avg, ROUND(CASE WHEN '${param.sgType}' = '公务用车费用' THEN u.sg_gwyc WHEN '${param.sgType}' = '公务接待费用' THEN u.sg_gwjd WHEN '${param.sgType}' = '因公出国（境）费用' THEN u.sg_gwcg  WHEN '${param.sgType}' = '全部' THEN u.sg_total ELSE NULL END, 2) AS unit_total, ROUND(CASE WHEN '${param.sgType}' = '公务用车费用' THEN d.sg_gwyc WHEN '${param.sgType}' = '公务接待费用' THEN d.sg_gwjd WHEN '${param.sgType}' = '因公出国（境）费用' THEN d.sg_gwcg WHEN '${param.sgType}' = '全部' THEN d.sg_total ELSE NULL END, 2) AS dept_total FROM CAS_FUS_SJ_SG_DEPT_UNIT_I_Y u JOIN CAS_FUS_SJ_SG_DEPT_I_Y d ON u.dept_code = d.dept_code AND u.nf = d.nf WHERE 1=1 @[AND u.dept_code = '${param.deptCode}'] @[AND u.unit_name = '${param.unitName}'] @[AND u.nf BETWEEN CAST('${param.year}' AS UNSIGNED) - 4 AND '${param.year}'] ORDER BY u.nf ASC;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManagePublicGraphTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManagePublicGraphTwo dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData, currentYear) {
    const currentYearInt = parseInt(currentYear, 10);
    const years = Array.from({ length: 5 }, (_, i) =>
      (currentYearInt - i).toString()
    ).reverse();

    // 初始化结构
    const result = {
      legend: [],
      xAxis: years,
      yAxis: {
        name: "人均费用/元",
      },
      seriesData: [],
    };

    inputData.forEach((item) => {
      result.legend.push(item.dept_name, item.unit_name);

      const manageData = {
        name: item.dept_name,
        type: "manage",
        assertsType: item.assertsType,
        count: [],
        total: [],
        data: [],
      };

      const budgetData = {
        name: item.unit_name,
        type: "budget",
        assertsType: item.assertsType,
        count: [],
        total: [],
        data: [],
      };

      // 填充数据，如果某一年的数据找不到，设置为0
      years.forEach((year) => {
        manageData.count.push(
          year === item.year ? parseInt(item.dept_count, 10) : 0
        );
        manageData.total.push(
          year === item.year ? parseFloat(item.dept_total) : 0
        );
        manageData.data.push(
          year === item.year ? parseFloat(item.dept_avg) : 0
        );

        budgetData.count.push(
          year === item.year ? parseInt(item.unit_count, 10) : 0
        );
        budgetData.total.push(
          year === item.year ? parseFloat(item.unit_total) : 0
        );
        budgetData.data.push(
          year === item.year ? parseFloat(item.unit_avg) : 0
        );
      });

      result.seriesData.push(manageData, budgetData);
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManagePublicGraphTwo res: ", JSON.stringify(res));
  return res;
}
