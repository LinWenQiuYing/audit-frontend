import axiosInstance from "../index.js";

const budgetUrl = "/pierce/dacp/invoke";

//------首页

// 获取预算单位列表
export async function getLeftTreeOptions(req) {
  // 打印视图层的入参请求
  console.log("getLeftTreeOptions req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select t1.value, t1.label from ( select distinct budget_unit_code as value, budget_unit_name as label from cas_fus_sj_xzsydw_ys_unit_tree_i_y where 1 = 1 @[and finance_year = ${param.year}] @[and (budget_unit_code like '%${param.value}%' or budget_unit_name like '%${param.value}%')] limit 50) as t1  UNION select t2.value, t2.label from( select distinct dept_code as value, dept_name as label from cas_fus_sj_xzsydw_ys_unit_tree_i_y where 1 = 1 @[and finance_year = ${param.year}] @[and (dept_code like '%${param.value}%' or dept_name like '%${param.value}%')] limit 50) as t2",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getLeftTreeOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getLeftTreeOptions dacpRes: ", JSON.stringify(dacpRes));

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
    // todo

    return data;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getLeftTreeOptions res: ", JSON.stringify(res));
  return res;
}

//获取预算单位左侧树
export async function getBudgetLeftTree(req) {
  // 打印视图层的入参请求
  console.log("getBudgetLeftTree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select 'city' as key1,'市级'  as title1,'city' as type1,dept_code as key2,dept_name as title2,'manage' as type2,budget_unit_code as key3,budget_unit_name as title3,'budget' as type3 from cas_fus_sj_xzsydw_ys_unit_tree_i_y where 1=1 @[and finance_year=${param.year}] order by budget_unit_code asc;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetLeftTree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetLeftTree dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(input) {
    // Create a map to hold the structured data
    const cityMap = new Map();
    cityMap.set("city", {
      key: "city",
      title: "市级",
      slots: { icon: "city" },
      children: new Map(),
    });
    cityMap.set("district", {
      key: "district",
      title: "区级",
      slots: { icon: "district" },
      children: new Map(),
    });

    input.forEach((item) => {
      const { key1, title1, type1, key2, title2, type2, key3, title3, type3 } =
        item;

      // Get the city level data
      const cityData = cityMap.get(key1);

      // If the manage level does not exist under the city, add it
      if (!cityData.children.has(key2)) {
        cityData.children.set(key2, {
          key: key2,
          title: title2,
          slots: { icon: type2 },
          children: new Map(),
        });
      }

      // Get the manage level data
      const manageData = cityData.children.get(key2);

      // Add the budget level under the manage level
      manageData.children.set(key3, {
        key: key3,
        title: title3,
        slots: { icon: type3 },
      });
    });

    // Convert map structure to array structure
    const result = Array.from(cityMap.values()).map((city) => ({
      ...city,
      children: Array.from(city.children.values()).map((manage) => ({
        ...manage,
        children: Array.from(manage.children.values()),
      })),
    }));

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBudgetLeftTree res: ", JSON.stringify(res));
  return res;
}

//获取预算单位右侧概览
export async function getBudgetOverview(req) {
  // 打印视图层的入参请求
  console.log("getBudgetOverview req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select coalesce(unit_pro_cnt,'--')  as unit_pro_cnt, coalesce(abs(unit_pro_cnt_change),'--') as unit_pro_cnt_change, case when unit_pro_cnt_change>0 then 1 when unit_pro_cnt_change<0 then 0 else 2 end as pro_cnt_status, coalesce(round(budget_amount/10000,2),'--') as budget_amount, concat(coalesce(abs(round(budget_amount_change*100,2)),'--'),'%') as budget_amount_change, case when budget_amount_change>0 then 1 when budget_amount_change<0 then 0 else 2 end as budget_amount_status, coalesce(round(actual_pay_amount/10000,2),'--') as actual_pay_amount , concat(coalesce(abs(round(actual_pay_amount_change*100,2)),'--'),'%') as actual_pay_amount_change, case when actual_pay_amount_change>0 then 1 when actual_pay_amount_change<0 then 0 else 2 end as pay_amount_status, coalesce(abs(round(unit_execute_rate*100,2)),'--') as unit_execute_rate, concat(coalesce(abs(round(unit_execute_rate_change*100,2)),'--'),'%') as unit_execute_rate_change, case when unit_execute_rate_change>0 then 1 when unit_execute_rate_change<0 then 0 else 2 end as execute_status, coalesce(unit_active_headcount,'--') as unit_active_headcount, coalesce(abs(unit_active_headcount_change),'--') as unit_active_headcount_change, case when unit_active_headcount_change>0 then 1 when unit_active_headcount_change<0 then 0 else 2 end as headcount_status, coalesce(round(sg_je,2),'--') as sg_je,concat(coalesce(abs(round(sg_je_change*100,2)),'--'),'%') as sg_je_change, case when sg_je_change>0 then 1 when sg_je_change<0 then 0 else 2 end as sg_je_status, coalesce(round(unit_jkje/10000,2),'--') as unit_jkje, concat(coalesce(abs(round(unit_jkje_change*100,2)),'--'),'%') as unit_jkje_change, case when unit_jkje_change>0 then 1 when unit_jkje_change<0 then 0 else 2 end as jkje_status, coalesce(round(asset_je/10000,2),'--') as asset_je, concat(coalesce(abs(round(asset_je_change*100,2)),'--'),'%') as asset_je_change, case when asset_je_change>0 then 1 when asset_je_change<0 then 0 else 2 end as asset_status from cas_fus_sj_xzsydw_ysunit_overview_i_y where 1=1 @[and budget_year=${param.year}] @[and budget_unit_code=${param.unitCode}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetOverview dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetOverview dacpRes: ", JSON.stringify(dacpRes));

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
    const info = data[0];
    return [
      {
        typeName: "项目数量（个）",
        num: info.unit_pro_cnt, //加逗号用的
        percentage: info.unit_pro_cnt_change,
        status: info.pro_cnt_status, //0:down  1:up
        icon: "项目数量",
      },
      {
        typeName: "预算金额（万元）",
        num: info.budget_amount,
        percentage: info.budget_amount_change, //如果这边返回null，需要映射为“--%”
        status: info.budget_amount_status, //0:down  1:up
        icon: "预算金额",
      },
      {
        typeName: "执行金额（万元）",
        num: info.actual_pay_amount,
        percentage: info.actual_pay_amount_change, //如果这边返回null，需要映射为“--%”
        status: info.pay_amount_status, //0:down  1:up
        icon: "执行金额",
      },
      {
        typeName: "执行率（%）",
        num: info.unit_execute_rate,
        percentage: info.unit_execute_rate_change, //如果这边返回null，需要映射为“--%”
        status: info.execute_status, //0:down  1:up
        icon: "执行率",
      },
      {
        typeName: "人员数量（人）",
        num: info.unit_active_headcount,
        percentage: info.unit_active_headcount_change, //如果这边返回null，需要映射为“--%”
        status: info.headcount_status, //0:down  1:up
        icon: "预算人员数量",
      },
      {
        typeName: "三公支出金额（元）",
        num: info.sg_je,
        percentage: info.sg_je_change, //如果这边返回null，需要映射为“--%”
        status: info.sg_je_status, //0:down  1:up
        icon: "三公支出金额",
      },
      {
        typeName: "非税收入金额（万元）",
        num: info.unit_jkje,
        percentage: info.unit_jkje_change, //如果这边返回null，需要映射为“--%”
        status: info.jkje_status, //0:down  1:up
        icon: "非税收入金额",
      },
      {
        typeName: "资产金额（万元）",
        num: info.asset_je,
        percentage: info.asset_je_change, //如果这边返回null，需要映射为“--%”
        status: info.asset_status, //0:down  1:up
        icon: "资产金额",
      },
    ];
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBudgetOverview res: ", JSON.stringify(res));
  return res;
}

//获取预算单位右侧基本信息
export async function getBudgetBasicInfo(req) {
  // 打印视图层的入参请求
  console.log("getBudgetBasicInfo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select  budget_unit_code as organId, budget_unit_name as organName,budget_admin_type as xzjgfl,budget_unit_adm_rank_name as xzjb,establish_date as clrq,budget_unit_add as dwdz,post_code as yzbm,organ_code as  zzjgdm,dept_name as sjdw,rank as dmjc,unit_nature as dwxz,budget_management as ysglfs,budget_unit_type as dwlb,contact_person as lxr,budget_unit_tel as lxrdhhm,fax as lxrcz,email as lxremail,finance_charge_person as cwfzr,finance_charge_tel as cwfzrdhhm,finance_charge_fax as cwfzrcz,unit_charge_person as dwfzr,unit_charge_tel as dwfzrdhhm,unit_charge_fax as dwfzrcz,unit_charge_email as dwfzremail,unit_active_headcount as rysl,note as notes from cas_fus_sj_xzsydw_ysunit_basic_info_i_y where 1=1 @[and finance_year=${param.year}] @[and budget_unit_code=${param.unitCode}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetBasicInfo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetBasicInfo dacpRes: ", JSON.stringify(dacpRes));

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
    const info = data[0];
    return [
      {
        key: "organId",
        label: "单位机构代码",
        value: info.organId || "--",
      },
      {
        key: "organName",
        label: "单位名称",
        value: info.organName || "--",
      },
      {
        key: "xzjgfl",
        label: "行政机关分类",
        value: info.xzjgfl || "--",
      },
      {
        key: "xzjb",
        label: "行政级别",
        value: info.xzjb || "--",
      },
      {
        key: "clrq",
        label: "成立日期",
        value: info.clrq || "--",
      },
      {
        key: "dwdz",
        label: "单位地址",
        value: info.dwdz || "--",
      },
      {
        key: "yzbm",
        label: "邮政编码",
        value: info.yzbm || "--",
      },
      {
        key: "zzjgdm",
        label: "组织机构代码",
        value: info.zzjgdm || "--",
      },
      {
        key: "sjdw",
        label: "上级单位",
        value: info.sjdw || "--",
      },
      {
        key: "dmjc",
        label: "代码级次",
        value: info.dmjc || "--",
      },
      {
        key: "dwxz",
        label: "单位性质",
        value: info.dwxz || "--",
      },
      {
        key: "ysglfs",
        label: "预算管理方式",
        value: info.ysglfs || "--",
      },
      {
        key: "dwlb",
        label: "单位类别",
        value: info.dwlb || "--",
      },
      {
        key: "lxr",
        label: "联系人",
        value: info.lxr || "--",
      },
      {
        key: "lxrdhhm",
        label: "联系人电话号码",
        value: info.lxrdhhm || "--",
      },
      {
        key: "lxrcz",
        label: "联系人传真",
        value: info.lxrcz || "--",
      },
      {
        key: "lxremail",
        label: "联系人E-mail",
        value: info.lxremail || "--",
      },
      {
        key: "cwfzr",
        label: "财务负责人",
        value: info.cwfzr || "--",
      },
      {
        key: "cwfzrdhhm",
        label: "财务负责人电话号码",
        value: info.cwfzrdhhm || "--",
      },
      {
        key: "cwfzrcz",
        label: "财务负责人传真",
        value: info.cwfzrcz || "--",
      },
      {
        key: "dwfzr",
        label: "单位负责人",
        value: info.dwfzr || "--",
      },
      {
        key: "dwfzrdhhm",
        label: "单位负责人电话号码",
        value: info.dwfzrdhhm || "--",
      },
      {
        key: "dwfzrcz",
        label: "单位负责人传真",
        value: info.dwfzrcz || "--",
      },
      {
        key: "dwfzremail",
        label: "单位负责人E-mail",
        value: info.dwfzremail || "--",
      },
      {
        key: "rysl",
        label: "人员数量",
        value: info.rysl || "--",
      },
      {
        key: "notes",
        label: "备注",
        value: info.notes || "--",
      },
    ];
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBudgetBasicInfo res: ", JSON.stringify(res));
  return res;
}

//获取预算单位右侧内设机构
export async function getBudgetInstitution(req) {
  // 打印视图层的入参请求
  console.log("getBudgetInstitution req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT id, internal_agent as title, agent_duty as content FROM cas_fus_sj_unit_internal_agent_i_y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] order by xh+0 asc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetInstitution dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetInstitution dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getBudgetInstitution res: ", JSON.stringify(res));
  return res;
}

//获取预算单位右侧权力清单列表
export async function getBudgetPowerList(req) {
  // 打印视图层的入参请求
  console.log("getBudgetPowerList req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT id, item_type as sxlx, item_name as sxmc FROM cas_fus_sj_unit_duty_items_i_y WHERE 1=1 @[AND unit_code = '${param.unitCode}']  order by xh+0 asc",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetPowerList dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetPowerList dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getBudgetPowerList res: ", JSON.stringify(res));
  return res;
}

//echarts图：整体支出均衡性
export async function getBudgetGraphDataOne(req) {
  // 打印视图层的入参请求
  console.log("getBudgetGraphDataOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select budget_unit_name, budget_unit_code, 'budget' as typeName, exep_year, exep_month, dept_name, ROUND(actual_pay_amount_m,2) AS actual_pay_amount_m, ROUND(actual_pay_amount_y,2) AS actual_pay_amount_y, FORMAT(actual_pay_ratio_m,4) AS actual_pay_ratio_m from  CAS_FUS_SJ_XZSYDW_YSHX_PAY_BALANCE_I_M WHERE 1=1 @[AND exep_year = ${param.year}] @[AND budget_unit_code = '${param.budgetUnitCode}'] order by budget_unit_code,exep_month",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetGraphDataOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetGraphDataOne dacpRes: ", JSON.stringify(dacpRes));

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
    // 固定的 x 轴标签
    const xAxis = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];

    // 从数据中提取预算单位的名字，用于legend
    const legend = [...new Set(data.map((item) => item.budget_unit_name))];

    // 将数据按预算单位分组
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.budget_unit_name]) {
        acc[item.budget_unit_name] = [];
      }
      acc[item.budget_unit_name].push(item);
      return acc;
    }, {});

    // 生成 seriesData
    const seriesData = legend.map((unitName) => {
      const unitData = groupedData[unitName];
      const totalMoney = unitData[0].actual_pay_amount_y;
      const money = new Array(12).fill(0);
      const rate = new Array(12).fill(0);

      unitData.forEach((item) => {
        const monthIndex = new Date(item.exep_month).getMonth(); // 获取月份索引
        money[monthIndex] = item.actual_pay_amount_m;
        rate[monthIndex] = parseFloat(
          (item.actual_pay_ratio_m * 100).toFixed(2)
        ); // 转换为百分比并保留两位小数
      });

      return {
        name: unitName,
        type: unitData[0].typeName,
        from: unitData[0].dept_name,
        data: {
          totalMoney,
          money,
          rate,
        },
      };
    });

    // 返回结果
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
  console.log("getBudgetGraphDataOne res: ", JSON.stringify(res));
  return res;
}

//echarts图：当年分布情况（按资金来源）
export async function getBudgetGraphDataTwo(req) {
  // 打印视图层的入参请求
  console.log("getBudgetGraphDataTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT budget_year as year, fund_nature_name, ROUND(actual_pay_amount_y/10000,2) as yearTotal, ROUND(actual_pay_amount_nature_y/10000,2) as natureYearTotal, FORMAT(actual_pay_ratio_nature,4) as ratio FROM CAS_FUS_SJ_XZSYDW_YSUNIT_FUND_NATURE_I_Y WHERE 1=1 @[AND budget_year = ${param.year}] @[AND unit_code = ${param.unitCode}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetGraphDataTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetGraphDataTwo dacpRes: ", JSON.stringify(dacpRes));

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
    // 取第一个数据项的 yearTotal 作为总额
    const total = data[0].yearTotal;
    // 假设所有数据的年份相同，取第一个数据项的年份
    const year = parseInt(data[0].year, 10);

    // 生成 seriesData
    const seriesData = data.map((item) => ({
      value: item.natureYearTotal,
      name: item.fund_nature_name,
      rate: (item.ratio * 100).toFixed(2), // 转换为百分比并保留两位小数
    }));

    // 返回结果
    return {
      total,
      year,
      seriesData,
    };
  }
  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBudgetGraphDataTwo res: ", JSON.stringify(res));
  return res;
}

//echarts图：五年趋势（按资金来源）
export async function getBudgetGraphDataThree(req) {
  // 打印视图层的入参请求
  console.log("getBudgetGraphDataThree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT budget_year as year, fund_nature_name, ROUND(actual_pay_amount_nature_y/10000,2) as natureYearTotal, ROUND(actual_pay_amount_y/10000,2) as yearTotal, FORMAT(actual_pay_ratio_nature,4) as ratio FROM CAS_FUS_SJ_XZSYDW_YSUNIT_FUND_NATURE_I_Y WHERE 1=1 @[AND budget_year BETWEEN ${param.year} - 4 AND ${param.year}] @[AND unit_code = ${param.unitCode}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("ggetBudgetGraphDataThree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetGraphDataThree dacpRes: ", JSON.stringify(dacpRes));

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
    // 将传入的年份字符串转换为数值型
    const numericYear = parseInt(year, 10);

    // 生成xAxis，从给定年份向前推4年，并将年份转换为字符串
    const years = Array.from({ length: 5 }, (_, i) =>
      (numericYear - 4 + i).toString()
    );

    // 提取所有的fund_nature_name
    const fundNatureNames = [
      ...new Set(data.map((item) => item.fund_nature_name)),
    ];

    // 创建一个初始的seriesData对象
    const initialSeriesData = fundNatureNames.map((name) => ({
      name: name,
      rate: years.map(() => 0), // 初始化每年的比例为0（数值型）
      data: years.map(() => 0), // 初始化每年的数据为0
      total: years.map(() => 0), // 初始化每年的总额为0
    }));

    // 填充seriesData对象
    data.forEach((item) => {
      const yearIndex = years.indexOf(item.year);
      const seriesItem = initialSeriesData.find(
        (series) => series.name === item.fund_nature_name
      );
      if (seriesItem && yearIndex !== -1) {
        seriesItem.total[yearIndex] = item.yearTotal;
        seriesItem.rate[yearIndex] = parseFloat(item.ratio) * 100; // 计算rate
        seriesItem.data[yearIndex] = item.natureYearTotal;
      }
    });

    // 保持rate为数值类型并保留两位小数
    initialSeriesData.forEach((series) => {
      series.rate = series.rate.map((value) => parseFloat(value.toFixed(2)));
    });

    return {
      legend: fundNatureNames,
      xAxis: years, // 保持xAxis为字符串类型
      yAxis: { name: "金额" },
      seriesData: initialSeriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getBudgetGraphDataThree res: ", JSON.stringify(res));
  return res;
}

//echarts图：当年分布情况（按项目类型）
export async function getBudgetGraphDataFour(req) {
  // 打印视图层的入参请求
  console.log("getBudgetGraphDataFour req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT nf as year, pro_type_name, ROUND(pro_type_payout_amount/10000,2) AS pro_type_payout_amount, FORMAT(pro_type_payout_ratio,4) AS pro_type_payout_ratio, ROUND(unit_payout_amount/10000,2) as total FROM CAS_FUS_SJ_XZSYDW_YSUNIT_PRO_TYPE_I_Y  WHERE 1=1 @[AND nf = ${param.year}] @[AND unit_code = '${param.unitCode}']",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetGraphDataFour dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetGraphDataFour dacpRes: ", JSON.stringify(dacpRes));

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
    if (data.length === 0) {
      return null;
    }

    const year = parseInt(data[0].year, 10);
    const total = data[0].total;

    const seriesData = data.map((item) => ({
      value: item.pro_type_payout_amount,
      name: item.pro_type_name,
      rate: (parseFloat(item.pro_type_payout_ratio) * 100).toFixed(2),
    }));

    return {
      total: total,
      year: year,
      seriesData: seriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBudgetGraphDataFour res: ", JSON.stringify(res));
  return res;
}

//echarts图：五年趋势（按项目类型）
export async function getBudgetGraphDataFive(req) {
  // 打印视图层的入参请求
  console.log("getBudgetGraphDataFive req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT nf as year, pro_type_name, ROUND(pro_type_payout_amount/10000,2) AS pro_type_payout_amount, FORMAT(pro_type_payout_ratio,4) AS pro_type_payout_ratio, ROUND(unit_payout_amount/10000,2) as total FROM CAS_FUS_SJ_XZSYDW_YSUNIT_PRO_TYPE_I_Y WHERE 1=1 @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}] @[AND unit_code = '${param.unitCode}']",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetGraphDataFive dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetGraphDataFive dacpRes: ", JSON.stringify(dacpRes));

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
    // 将输入年份转为数值型
    const startYear = parseInt(inputYear, 10);

    // 生成xAxis，从给定年份向前推4年，并将年份转换为字符串
    const years = Array.from({ length: 5 }, (_, i) =>
      (startYear - 4 + i).toString()
    );

    // 提取所有的pro_type_name
    const legend = [...new Set(inputData.map((item) => item.pro_type_name))];

    // 创建一个初始的seriesData对象
    const initialSeriesData = legend.map((name) => ({
      name: name,
      rate: years.map(() => 0),
      data: years.map(() => 0),
      total: years.map(() => 0),
    }));

    // 填充seriesData对象
    inputData.forEach((item) => {
      const yearIndex = years.indexOf(item.year);
      if (yearIndex !== -1) {
        const seriesItem = initialSeriesData.find(
          (series) => series.name === item.pro_type_name
        );
        if (seriesItem) {
          seriesItem.rate[yearIndex] =
            parseFloat(item.pro_type_payout_ratio) * 100;
          seriesItem.data[yearIndex] = item.pro_type_payout_amount;
          seriesItem.total[yearIndex] = item.total;
        }
      }
    });

    // 格式化rate为两位小数
    initialSeriesData.forEach((series) => {
      series.rate = series.rate.map((value) => parseFloat(value.toFixed(2)));
    });

    return {
      legend: legend,
      xAxis: years,
      yAxis: { name: "金额" },
      seriesData: initialSeriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getBudgetGraphDataFive res: ", JSON.stringify(res));
  return res;
}

//项目执行明细简表
export async function getBudgetTableOne(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT pro_name AS xmmc, pro_code AS xmbm, ROUND(payout_amount / 10000, 2) AS zxje, ROUND(budget_amount / 10000, 2) AS ysje, ROUND(execute_rate*100, 2) AS zxl FROM CAS_FUS_SJ_XZSYDW_BKFX_PRO_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] @[and ${param.filterCondition}]  @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset}; ",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetTableOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetTableOne dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getBudgetTableOne res: ", JSON.stringify(res));
  return res;
}

//项目执行明细简表排序
export async function getBudgetTableOneSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "项目名称",
        value: "xmmc",
        type: "string",
      },
      {
        label: "项目编码",
        value: "xmbm",
        type: "string",
      },
      {
        label: "执行金额",
        value: "zxje",
        type: "number",
      },
      {
        label: "预算金额",
        value: "ysje",
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

//项目执行明细简表筛选
export async function getBudgetTableOneFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "项目名称",
        value: "pro_name",
        type: "string",
      },
      {
        label: "项目编码",
        value: "pro_code",
        type: "string",
      },
      {
        label: "执行金额",
        value: "ROUND(payout_amount / 10000, 2)",
        type: "number",
      },
      {
        label: "预算金额",
        value: "ROUND(budget_amount / 10000, 2)",
        type: "number",
      },
      {
        label: "执行率",
        value: " ROUND(execute_rate, 2)",
        type: "number",
      },
    ],
  };
  return res;
}

//非税收入明细简表
export async function getBudgetTableTwo(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT  nontax_project_name AS xmmc, nontax_project_code AS xmbm, ROUND(unit_jkje_y / 10000, 2) AS fssrje, coalesce(ROUND(unit_jkje_ratio_ly,2),'--') AS tbzzl FROM  cas_fus_sj_xzsydw_nontax_pro_i_y  WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset} ;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetTableTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetTableTwo dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getBudgetTableTwo res: ", JSON.stringify(res));
  return res;
}

//非税收入明细简表排序
export async function getBudgetTableTwoSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "项目名称",
        value: "xmmc",
        type: "string",
      },
      {
        label: "项目编码",
        value: "xmbm",
        type: "string",
      },
      {
        label: "非税收入金额",
        value: "fssrje",
        type: "number",
      },
      {
        label: "同比增长率",
        value: "tbzzl",
        type: "number",
      },
    ],
  };
  return res;
}

//非税收入明细简表筛选
export async function getBudgetTableTwoFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "项目名称",
        value: "nontax_project_name ",
        type: "string",
      },
      {
        label: "项目编码",
        value: "nontax_project_code ",
        type: "string",
      },
      {
        label: "非税收入金额",
        value: "ROUND(unit_jkje_y / 10000, 2)",
        type: "number",
      },
      {
        label: "同比增长率",
        value: "coalesce(ROUND(unit_jkje_ratio_ly,2),'--')",
        type: "number",
      },
    ],
  };
  return res;
}

//三公支出明细简表
export async function getBudgetTableThree(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableThree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT sg_type_name AS sglx, ROUND(current_year_total, 2) AS zcje, ROUND(percentage, 2) AS zb, growth_rate AS tbzzl FROM (SELECT c.unit_id, c.unit_code, c.unit_name, c.year, c.sg_type_name, c.total_amount AS current_year_total, p.total_amount AS previous_year_total, (c.total_amount / total_sum) * 100 AS percentage, CASE WHEN p.total_amount IS NOT NULL THEN ROUND((((c.total_amount - p.total_amount) / p.total_amount) * 100), 2) ELSE '--' END AS growth_rate FROM (SELECT unit_id, unit_code, unit_name, nf AS year, sg_type_name, SUM(actual_pay_amount) AS total_amount, (SELECT SUM(actual_pay_amount) FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}']) AS total_sum FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] GROUP BY unit_id, unit_code, unit_name, nf, sg_type_name) c LEFT JOIN (SELECT unit_id, unit_code, unit_name, nf AS year, sg_type_name, SUM(actual_pay_amount) AS total_amount FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = CAST(CAST('${param.year}' AS SIGNED) - 1 AS CHAR)] GROUP BY unit_id, unit_code, unit_name, nf, sg_type_name) p ON c.unit_id = p.unit_id AND c.sg_type_name = p.sg_type_name) combined_data;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetTableThree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetTableThree dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getBudgetTableThree res: ", JSON.stringify(res));
  return res;
}

//-----项目执行明细完整表
export async function getBudgetTableOneAll(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableOneAll req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) AS total FROM CAS_FUS_SJ_XZSYDW_BKFX_PRO_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] @[and pro_type_name = '${param.proTypeName}'] @[and ${param.filterCondition}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getBudgetTableOneAll dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${budgetUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getBudgetTableOneAll dacpTotalRes: ",
    JSON.stringify(dacpTotalRes)
  );

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
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
      "SELECT pro_type_name AS currentYearProjectCategory, pro_name AS currentYearProjectName, pro_code AS currentYearProjectCode, ROUND(budget_amount / 10000, 2) AS currentYearBudgetAmount, ROUND(payout_amount / 10000, 2) AS currentYearExecutedAmount, ROUND(execute_rate, 2) AS currentYearExecutionRate FROM CAS_FUS_SJ_XZSYDW_BKFX_PRO_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] @[and pro_type_name = '${param.proTypeName}']  @[and ${param.filterCondition}] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };
  console.log(
    "getBudgetTableOneAll dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${budgetUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getBudgetTableOneAll dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );
  if (dacpDetailRes.code != 0) {
    return {
      code: dacpDetailRes.code,
      message: dacpDetailRes.message,
      data: dacpDetailRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  // function transformData(data) {
  //   return data;
  // }

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: {
      total: dacpTotalRes.data[0].total,
      dateList: dacpDetailRes.data,
    },
  };
  console.log("getBudgetTableOneAll res: ", JSON.stringify(res));
  return res;
}

//项目执行明细项目分类
export async function getBudgetTableOneAllOptions(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableOneAllOptions req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT pro_type_name AS label, pro_type_name AS value FROM CAS_FUS_SJ_XZSYDW_BKFX_PRO_DETAIL_I_Y WHERE pro_type_name is not null ORDER BY pro_type_code ASC;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getBudgetTableOneAllOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetTableOneAllOptions dacpRes: ", JSON.stringify(dacpRes));

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
  console.log("getBudgetTableOneAllOptions res: ", JSON.stringify(res));
  return res;
}

//项目执行明细完整表排序
export async function getBudgetTableOneAllSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "当年项目分类",
        value: "currentYearProjectCategory",
        type: "string",
      },
      {
        label: "当年项目名称",
        value: "currentYearProjectName",
        type: "string",
      },
      {
        label: "当年项目编号",
        value: "currentYearProjectCode",
        type: "string",
      },
      {
        label: "当年预算金额",
        value: "currentYearBudgetAmount",
        type: "number",
      },
      {
        label: "当年执行金额",
        value: "currentYearExecutedAmount",
        type: "number",
      },
      {
        label: "当年执行率",
        value: "currentYearExecutionRate",
        type: "number",
      },
    ],
  };
  return res;
}

//项目执行明细简完整表筛选
export async function getBudgetTableOneAllFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "当年项目分类",
        value: "pro_type_name",
        type: "string",
      },
      {
        label: "当年项目名称",
        value: "pro_name",
        type: "string",
      },
      {
        label: "当年项目编号",
        value: "pro_code",
        type: "string",
      },
      {
        label: "当年预算金额",
        value: "ROUND(budget_amount / 10000, 2)",
        type: "number",
      },
      {
        label: "当年执行金额",
        value: "ROUND(payout_amount / 10000, 2)",
        type: "number",
      },
      {
        label: "当年执行率",
        value: "ROUND(execute_rate, 2)",
        type: "number",
      },
    ],
  };
  return res;
}

//----非税收入明细完整表
export async function getBudgetTableTwoAll(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableTwoAll req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " SELECT COUNT(*) AS total FROM CAS_FUS_SJ_XZSYDW_NONTAX_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] @[and nontax_type_name = '${param.nontax_type_name}'] @[and funds_nature_name = '${param.funds_nature_name}'] @[and ${param.filterCondition}] ;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getBudgetTableTwoAll dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${budgetUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getBudgetTableTwoAll dacpTotalRes: ",
    JSON.stringify(dacpTotalRes)
  );

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
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
      "SELECT nontax_project_name AS currentYearProjectName, nontax_type_name AS nonTaxRevenueType, funds_nature_name AS fundNature, payer_name AS payerFullName,payee_name AS payeeFullName, payment_date AS paymentDate, recorded_date AS entryDate, ROUND(jkje , 2) AS nonTaxRevenueAmount FROM CAS_FUS_SJ_XZSYDW_NONTAX_DETAIL_I_Y where 1 = 1  @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] @[and nontax_type_name = '${param.nontax_type_name}'] @[and funds_nature_name in ${param.funds_nature_name}]@[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };
  console.log(
    "getBudgetTableTwoAll dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${budgetUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getBudgetTableTwoAll dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );
  if (dacpDetailRes.code != 0) {
    return {
      code: dacpDetailRes.code,
      message: dacpDetailRes.message,
      data: dacpDetailRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  // function transformData(data) {
  //   return data;
  // }

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: {
      total: dacpTotalRes.data[0].total,
      dateList: dacpDetailRes.data,
    },
  };
  console.log("getBudgetTableTwoAll res: ", JSON.stringify(res));
  return res;
}

//非税收入类型下拉框
export async function getBudgetTableTwoAllNoTaxOptions(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableTwoAllNoTaxOptions req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT nontax_type_name_1 AS value, nontax_type_name_1 AS label FROM cas_fus_sj_xzsydw_nontax_type1_distr_i_y ORDER BY nontax_type_name_1 ASC;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getBudgetTableTwoAllNoTaxOptions dacpReq: ",
    JSON.stringify(dacpReq)
  );
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(
    "getBudgetTableTwoAllNoTaxOptions dacpRes: ",
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
  console.log("getBudgetTableTwoAllNoTaxOptions res: ", JSON.stringify(res));
  return res;
}

//资金性质下拉框
export async function getBudgetTableTwoAllMoneyOptions(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableTwoAllMoneyOptions req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT funds_nature_name AS value, funds_nature_name AS label FROM CAS_FUS_SJ_XZSYDW_NONTAX_DETAIL_I_Y ORDER BY funds_nature_name ASC;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getBudgetTableTwoAllMoneyOptions dacpReq: ",
    JSON.stringify(dacpReq)
  );
  const dacpRes = await axiosInstance.post(`${budgetUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(
    "getBudgetTableTwoAllMoneyOptions dacpRes: ",
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
  console.log("getBudgetTableTwoAllMoneyOptions res: ", JSON.stringify(res));
  return res;
}

//非税收入明细完整表排序
export async function getBudgetTableTwoAllSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "当年项目名称",
        value: "currentYearProjectName",
        type: "string",
      },
      {
        label: "非税收入类型",
        value: "nonTaxRevenueType",
        type: "string",
      },
      {
        label: "资金性质",
        value: "fundNature",
        type: "string",
      },
      {
        label: "缴款人全称",
        value: "payerFullName",
        type: "string",
      },
      {
        label: "收款人全称",
        value: "payeeFullName",
        type: "string",
      },
      {
        label: "缴款日期",
        value: "paymentDate",
        type: "string",
      },
      {
        label: "入账日期",
        value: "entryDate",
        type: "string",
      },
      {
        label: "非税收入金额",
        value: "nonTaxRevenueAmount",
        type: "number",
      },
    ],
  };
  return res;
}

//非税收入明细完整表筛选
export async function getBudgetTableTwoAllFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "当年项目名称",
        value: "nontax_project_name",
        type: "string",
      },
      {
        label: "非税收入类型",
        value: "nontax_type_name",
        type: "string",
      },
      {
        label: "资金性质",
        value: "funds_nature_name",
        type: "string",
      },
      {
        label: "缴款人全称",
        value: "payer_name",
        type: "string",
      },
      {
        label: "收款人全称",
        value: "payee_name",
        type: "string",
      },
      {
        label: "缴款日期",
        value: "payment_date",
        type: "string",
      },
      {
        label: "入账日期",
        value: "recorded_date",
        type: "string",
      },
      {
        label: "非税收入金额",
        value: "ROUND(jkje, 2) ",
        type: "number",
      },
    ],
  };
  return res;
}

//----三公支出明细完整表
export async function getBudgetTableThreeAll(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableThreeAll req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " SELECT COUNT(*) AS total FROM (SELECT payee_name AS payeeName, pro_name AS projectName, actual_pay_date AS paymentDate, '--' AS summary, actual_pay_amount AS amountReceived, sg_type_name as sgTypeName FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] @[and pro_type_name = '${param.proTypeName}'] @[and ${param.filterCondition}]  UNION ALL SELECT payee_name AS payeeName, pro_name AS projectName, actual_pay_date AS paymentDate, '--' AS summary, actual_pay_amount AS amountReceived, sg_type_name as sgTypeName FROM CAS_FUS_SJ_BKFX_YSSG_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] @[and pro_type_name = '${param.proTypeName}'] @[and ${param.filterCondition}]) AS combined;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getBudgetTableThreeAll dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${budgetUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getBudgetTableThreeAll dacpTotalRes: ",
    JSON.stringify(dacpTotalRes)
  );

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
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
      "SELECT payeeName, projectName, paymentDate, summary, amountReceived, sgTypeName FROM (SELECT payee_name AS payeeName, pro_name AS projectName, actual_pay_date AS paymentDate, '--' AS summary, ROUND(actual_pay_amount, 2)AS amountReceived, sg_type_name as sgTypeName FROM CAS_FUS_SJ_BKFX_SG_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] @[and pro_type_name = '${param.proTypeName}'] @[and ${param.filterCondition}]  UNION ALL SELECT payee_name AS payeeName, pro_name AS projectName, actual_pay_date AS paymentDate, '--' AS summary, ROUND(actual_pay_amount, 2)AS amountReceived, sg_type_name as sgTypeName FROM CAS_FUS_SJ_BKFX_YSSG_DETAIL_I_Y WHERE 1=1 @[and unit_code = '${param.unitCode}'] @[and nf = '${param.year}'] @[and pro_type_name = '${param.proTypeName}'] @[and ${param.filterCondition}] ) AS combined @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };
  console.log(
    "getBudgetTableThreeAll dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${budgetUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getBudgetTableThreeAll dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );
  if (dacpDetailRes.code != 0) {
    return {
      code: dacpDetailRes.code,
      message: dacpDetailRes.message,
      data: dacpDetailRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  // function transformData(data) {
  //   return data;
  // }

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: {
      total: dacpTotalRes.data[0].total,
      dateList: dacpDetailRes.data,
    },
  };
  console.log("getBudgetTableThreeAll res: ", JSON.stringify(res));
  return res;
}

//三公支出明细完整表排序
export async function getBudgetTableThreeAllSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "收款人名称",
        value: "payeeName",
        type: "string",
      },
      {
        label: "项目名称",
        value: "projectName",
        type: "string",
      },
      {
        label: "支付日期",
        value: "paymentDate",
        type: "string",
      },
      {
        label: "支付金额",
        value: "amountReceived",
        type: "number",
      },
      {
        label: "三公类型名称",
        value: "sgTypeName",
        type: "string",
      },
    ],
  };
  return res;
}

//三公支出明细完整表筛选
export async function getBudgetTableThreeAllFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
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
        label: "支付日期",
        value: "actual_pay_date",
        type: "string",
      },
      {
        label: "支出金额",
        value: "ROUND(actual_pay_amount, 2)",
        type: "number",
      },
      {
        label: "三公类型名称",
        value: "sg_type_name",
        type: "string",
      },
    ],
  };
  return res;
}

//--------资产
//资产明细：房屋支出明细简表
export async function getBudgetTableHouse(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableHouse req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select count(*) as total from ( select unit_code as unitCode, Asset_No as assetNo, '房产' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Own_Certificate as qszm, Cert_Number as qszh, Location as zlwz, Own_Area as qsmj, In_Use_Area as zymj, Rental_Area as czmj, Loan_Area as cjmj, Idle_Area as xzmj, Acquisition_Date as qdrq, Start_Use_Date as trsymj, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_REAL_ESTATE_DETAIL_I_Y where unit_code = '${param.unitCode}') as aa where 1=1 @[and ${param.filterCondition}];",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getBudgetTableHouse dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${budgetUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getBudgetTableHouse dacpTotalRes: ",
    JSON.stringify(dacpTotalRes)
  );

  // 判断后端总数dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端明细dacp接口请求
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select * from ( select unit_code as unitCode, Asset_No as assetNo, '房产' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Own_Certificate as qszm, Cert_Number as qszh, Location as zlwz, Own_Area as qsmj, In_Use_Area as zymj, Rental_Area as czmj, Loan_Area as cjmj, Idle_Area as xzmj, Acquisition_Date as qdrq, Start_Use_Date as trsymj, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_REAL_ESTATE_DETAIL_I_Y where unit_code = '${param.unitCode}') as aa where 1=1 @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getBudgetTableHouse dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${budgetUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getBudgetTableHouse dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );

  // 判断后端明细dacp接口调用响应码，如果不成功，直接返回失败
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
  console.log("getBudgetTableHouse res: ", JSON.stringify(res));
  return res;
}

//资产明细：房屋支出明细简表排序
export async function getBudgetTableHouseSort() {
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
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "权属证明",
        value: "qszm",
        type: "string",
      },
      {
        label: "权属证号",
        value: "qszh",
        type: "string",
      },
      {
        label: "坐落位置",
        value: "zlwz",
        type: "string",
      },
      {
        label: "权属面积",
        value: "qsmj",
        type: "string",
      },
      {
        label: "在用面积",
        value: "zymj",
        type: "string",
      },
      {
        label: "出租面积",
        value: "czmj",
        type: "string",
      },
      {
        label: "出借面积",
        value: "cjmj",
        type: "string",
      },
      {
        label: "闲置面积",
        value: "xzmj",
        type: "string",
      },
      {
        label: "取得日期",
        value: "qdrq",
        type: "string",
      },
      {
        label: "投入使用日期",
        value: "trsymj",
        type: "string",
      },
      {
        label: "处置时间",
        value: "czsj",
        type: "string",
      },
    ],
  };
  return res;
}

//资产明细：房屋支出明细简表筛选
export async function getBudgetTableHouseFilter() {
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
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "权属证明",
        value: "qszm",
        type: "string",
      },
      {
        label: "权属证号",
        value: "qszh",
        type: "string",
      },
      {
        label: "坐落位置",
        value: "zlwz",
        type: "string",
      },
      {
        label: "权属面积",
        value: "qsmj",
        type: "string",
      },
      {
        label: "在用面积",
        value: "zymj",
        type: "string",
      },
      {
        label: "出租面积",
        value: "czmj",
        type: "string",
      },
      {
        label: "出借面积",
        value: "cjmj",
        type: "string",
      },
      {
        label: "闲置面积",
        value: "xzmj",
        type: "string",
      },
      {
        label: "取得日期",
        value: "qdrq",
        type: "string",
      },
      {
        label: "投入使用日期",
        value: "trsymj",
        type: "string",
      },
      {
        label: "处置时间",
        value: "czsj",
        type: "string",
      },
    ],
  };
  return res;
}

//资产明细：车辆支出明细简表
export async function getBudgetTableCar(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableCar req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select count(*) as total from ( select unit_code as unitCode, Asset_No as assetNo, '车辆' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz,Brand as pp,Specs as ggxh,License_No as cph,Vehicle_Cert as clxsz,Vehicle_Type as cllx,Displacement as qcpqldm,Engine_No as fdjh,Vehicle_Origin as clcd,Vehicle_Cert as xsz,Vehicle_Owner as clcyr,Warranty_Date as bxjzrq from CAS_FUS_SJ_ASSET_VEHICLES_DETAIL_I_Y where unit_code = '${param.unitCode}') as aa where 1=1 @[and ${param.filterCondition}];",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log("getBudgetTableCar dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(`${budgetUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log("getBudgetTableCar dacpTotalRes: ", JSON.stringify(dacpTotalRes));

  // 判断后端总数dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端明细dacp接口请求
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select * from ( select unit_code as unitCode, Asset_No as assetNo, '车辆' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz,Brand as pp,Specs as ggxh,License_No as cph,Vehicle_Cert as clxsz,Vehicle_Type as cllx,Displacement as qcpqldm,Engine_No as fdjh,Vehicle_Origin as clcd,Vehicle_Cert as xsz,Vehicle_Owner as clcyr,Warranty_Date as bxjzrq from CAS_FUS_SJ_ASSET_VEHICLES_DETAIL_I_Y where unit_code = '${param.unitCode}') as aa where 1=1 @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getBudgetTableCar dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${budgetUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getBudgetTableCar dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );

  // 判断后端明细dacp接口调用响应码，如果不成功，直接返回失败
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
  console.log("getBudgetTableCar res: ", JSON.stringify(res));
  return res;
}

//资产明细：车辆支出明细简表排序
export async function getBudgetTableCarSort() {
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
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "品牌",
        value: "pp",
        type: "string",
      },
      {
        label: "规格型号",
        value: "ggxh",
        type: "string",
      },
      {
        label: "车牌号",
        value: "cph",
        type: "string",
      },
      {
        label: "车辆行驶证",
        value: "clxsz",
        type: "string",
      },
      {
        label: "车辆类型",
        value: "cllx",
        type: "string",
      },
      {
        label: "汽车排期量代码",
        value: "qcpqldm",
        type: "string",
      },
      {
        label: "发动机号",
        value: "fdjh",
        type: "string",
      },
      {
        label: "车辆产地",
        value: "clcd",
        type: "string",
      },
      {
        label: "行驶证",
        value: "xsz",
        type: "string",
      },
      {
        label: "车辆所有人",
        value: "clcyr",
        type: "string",
      },
      {
        label: "保修截止日期",
        value: "bxjzrq",
        type: "string",
      },
    ],
  };
  return res;
}

//资产明细：车辆支出明细简表筛选
export async function getBudgetTableCarFilter() {
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
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "品牌",
        value: "pp",
        type: "string",
      },
      {
        label: "规格型号",
        value: "ggxh",
        type: "string",
      },
      {
        label: "车牌号",
        value: "cph",
        type: "string",
      },
      {
        label: "车辆行驶证",
        value: "clxsz",
        type: "string",
      },
      {
        label: "车辆类型",
        value: "cllx",
        type: "string",
      },
      {
        label: "汽车排期量代码",
        value: "qcpqldm",
        type: "string",
      },
      {
        label: "发动机号",
        value: "fdjh",
        type: "string",
      },
      {
        label: "车辆产地",
        value: "clcd",
        type: "string",
      },
      {
        label: "行驶证",
        value: "xsz",
        type: "string",
      },
      {
        label: "车辆所有人",
        value: "clcyr",
        type: "string",
      },
      {
        label: "保修截止日期",
        value: "bxjzrq",
        type: "string",
      },
    ],
  };
  return res;
}

//资产明细：土地支出明细简表
export async function getBudgetTableLand(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableLand req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select count(*) as total from (select unit_code as unitCode, Asset_No as assetNo, '土地' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Own_Certificate as qszm, Cert_Number as qszh, Location as zlwz, Own_Area as qsmj, In_Use_Area as zymj, Rental_Area as czmj, Loan_Area as cjmj, Idle_Area as xzmj, Acquisition_Date as qdrq, Start_Use_Date as trsymj, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_LAND_DETAIL_I_Y where unit_code = '${param.unitCode}') as aa where 1=1 @[and ${param.filterCondition}];",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getBudgetTableLand dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${budgetUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getBudgetTableLand dacpTotalRes: ",
    JSON.stringify(dacpTotalRes)
  );

  // 判断后端总数dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端明细dacp接口请求
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select * from (select unit_code as unitCode, Asset_No as assetNo, '土地' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Own_Certificate as qszm, Cert_Number as qszh, Location as zlwz, Own_Area as qsmj, In_Use_Area as zymj, Rental_Area as czmj, Loan_Area as cjmj, Idle_Area as xzmj, Acquisition_Date as qdrq, Start_Use_Date as trsymj, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_LAND_DETAIL_I_Y where unit_code = '${param.unitCode}') as aa where 1=1 @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getBudgetTableLand dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${budgetUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getBudgetTableLand dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );

  // 判断后端明细dacp接口调用响应码，如果不成功，直接返回失败
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
  console.log("getBudgetTableLand res: ", JSON.stringify(res));
  return res;
}

//资产明细：土地支出明细简表排序
export async function getBudgetTableLandSort() {
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
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "权属证明",
        value: "qszm",
        type: "string",
      },
      {
        label: "权属证号",
        value: "qszh",
        type: "string",
      },
      {
        label: "坐落位置",
        value: "zlwz",
        type: "string",
      },
      {
        label: "权属面积",
        value: "qsmj",
        type: "string",
      },
      {
        label: "在用面积",
        value: "zymj",
        type: "string",
      },
      {
        label: "出租面积",
        value: "czmj",
        type: "string",
      },
      {
        label: "出借面积",
        value: "cjmj",
        type: "string",
      },
      {
        label: "闲置面积",
        value: "xzmj",
        type: "string",
      },
      {
        label: "取得日期",
        value: "qdrq",
        type: "string",
      },
      {
        label: "投入使用日期",
        value: "trsymj",
        type: "string",
      },
      {
        label: "处置时间",
        value: "czsj",
        type: "string",
      },
    ],
  };
  return res;
}

//资产明细：土地支出明细简表筛选
export async function getBudgetTableLandFilter() {
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
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "权属证明",
        value: "qszm",
        type: "string",
      },
      {
        label: "权属证号",
        value: "qszh",
        type: "string",
      },
      {
        label: "坐落位置",
        value: "zlwz",
        type: "string",
      },
      {
        label: "权属面积",
        value: "qsmj",
        type: "string",
      },
      {
        label: "在用面积",
        value: "zymj",
        type: "string",
      },
      {
        label: "出租面积",
        value: "czmj",
        type: "string",
      },
      {
        label: "出借面积",
        value: "cjmj",
        type: "string",
      },
      {
        label: "闲置面积",
        value: "xzmj",
        type: "string",
      },
      {
        label: "取得日期",
        value: "qdrq",
        type: "string",
      },
      {
        label: "投入使用日期",
        value: "trsymj",
        type: "string",
      },
      {
        label: "处置时间",
        value: "czsj",
        type: "string",
      },
    ],
  };
  return res;
}

//资产明细：其他支出明细简表
export async function getBudgetTableOthers(req) {
  // 打印视图层的入参请求
  console.log("getBudgetTableOthers req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select count(*) as total from (select unit_code as unitCode, Asset_No as assetNo, '其他' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Asset_Large_Class as zcdl, Asset_Class_Name as zcflmc, Quantity_Area as slhpm, Quantity_Unit as sljldw, Acquisition_Date as zcqdrq, Acquisition_Name as zcqdfs, Start_Use_Date as trsyrq, round(Original_Value,2) as zcyz, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_OTHERS_DETAIL_I_Y where unit_code = '${param.unitCode}') as aa where 1=1 @[and ${param.filterCondition}];",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getBudgetTableOthers dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${budgetUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getBudgetTableOthers dacpTotalRes: ",
    JSON.stringify(dacpTotalRes)
  );

  // 判断后端总数dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端明细dacp接口请求
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select * from (select unit_code as unitCode, Asset_No as assetNo, '其他' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Asset_Large_Class as zcdl, Asset_Class_Name as zcflmc, Quantity_Area as slhpm, Quantity_Unit as sljldw, Acquisition_Date as zcqdrq, Acquisition_Name as zcqdfs, Start_Use_Date as trsyrq, round(Original_Value,2) as zcyz, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_OTHERS_DETAIL_I_Y where unit_code = '${param.unitCode}') as aa where 1=1 @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getBudgetTableOthers dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${budgetUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getBudgetTableOthers dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );

  // 判断后端明细dacp接口调用响应码，如果不成功，直接返回失败
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
  console.log("getBudgetTableOthers res: ", JSON.stringify(res));
  return res;
}

//资产明细：其他支出明细简表排序
export async function getBudgetTableOthersSort() {
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
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "资产大类",
        value: "zcdl",
        type: "string",
      },
      {
        label: "资产分类名称",
        value: "zcflmc",
        type: "string",
      },
      {
        label: "数量或面积",
        value: "slhpm",
        type: "string",
      },
      {
        label: "数量计量单位",
        value: "sljldw",
        type: "string",
      },
      {
        label: "资产取得日期",
        value: "zcqdrq",
        type: "string",
      },
      {
        label: "资产取得方式名称",
        value: "zcqdfs",
        type: "string",
      },
      {
        label: "投入使用日期",
        value: "trsyrq",
        type: "string",
      },
      {
        label: "资产原值",
        value: "zcyz",
        type: "number",
      },
      {
        label: "处置时间",
        value: "czsj",
        type: "string",
      },
    ],
  };
  return res;
}

//资产明细：其他支出明细简表筛选
export async function getBudgetTableOthersFilter() {
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
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "资产大类",
        value: "zcdl",
        type: "string",
      },
      {
        label: "资产分类名称",
        value: "zcflmc",
        type: "string",
      },
      {
        label: "数量或面积",
        value: "slhpm",
        type: "string",
      },
      {
        label: "数量计量单位",
        value: "sljldw",
        type: "string",
      },
      {
        label: "资产取得日期",
        value: "zcqdrq",
        type: "string",
      },
      {
        label: "资产取得方式名称",
        value: "zcqdfs",
        type: "string",
      },
      {
        label: "投入使用日期",
        value: "trsyrq",
        type: "string",
      },
      {
        label: "资产原值",
        value: "zcyz",
        type: "number",
      },
      {
        label: "处置时间",
        value: "czsj",
        type: "string",
      },
    ],
  };
  return res;
}
