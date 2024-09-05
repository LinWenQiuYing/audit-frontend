//组织架构
import axiosInstance from "./index.js";

const blockUrl = "/pierce/dacp/invoke";

//查询组织架构
export async function queryOrgStruct(req) {
  // 打印视图层的入参请求
  console.log("queryOrgStruct req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " select name1, id1, 1 as has_children1, name2, id2, budgetMoney2, executeMoney2, executeRatio2, noTaxMoney2, 1 as has_children2 from ( SELECT     block_name as name1, block_name as id1, a.dept_name as name2, dept_code as id2, round(dept_budget_amount/10000,2) as budgetMoney2, round(dept_payout_amount/10000,2)  as executeMoney2, round(dept_execute_rate*100,2) as executeRatio2, round(b.dept_jkje_total/10000,2)  as noTaxMoney2 FROM CAS_FUS_SJ_XZSYDW_STRCTURE_I_Y AS a LEFT JOIN     (SELECT dept_name, SUM(jkje_total) AS dept_jkje_total FROM CAS_FUS_SJ_XZSYDW_STRCTURE_I_Y GROUP BY dept_name) AS b ON a.dept_name = b.dept_name WHERE 1=1 @[AND nf = ${param.choosedYear}]  ) as c group by name1,id1,name2,id2,budgetMoney2,executeMoney2,executeRatio2,noTaxMoney2 @[order by ${param.sortWay} ${param.sortType}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("queryOrgStruct dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("queryOrgStruct dacpRes: ", JSON.stringify(dacpRes));

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
    const result = [];

    inputData.forEach((item) => {
      // 查找是否已存在该板块
      let block = null;
      for (let i = 0; i < result.length; i++) {
        if (result[i].name === item.name1) {
          block = result[i];
          break;
        }
      }

      // 如果不存在该板块，则创建一个新的板块
      if (!block) {
        block = {
          name: item.name1,
          id: item.id1,
          collapsed: item.name1 == "国企" ? false : true, // 默认展开国企板块
          hasChildren:
            item.has_children1 == 1 ||
            item.has_children1 == "1.0" ||
            item.has_children1 == true
              ? true
              : false,
          children: [],
        };
        result.push(block);
      }

      // 添加主管单位
      const unit = {
        name: item.name2,
        id: item.id2,
        budgetMoney:
          (item.budgetMoney2 && parseFloat(item.budgetMoney2.toFixed(2))) || 0,
        executeMoney:
          (item.executeMoney2 && parseFloat(item.executeMoney2.toFixed(2))) ||
          0,
        executeRatio:
          (item.executeRatio2 && parseFloat(item.executeRatio2.toFixed(2))) ||
          0,
        noTaxMoney:
          (item.noTaxMoney2 && parseFloat(item.noTaxMoney2.toFixed(2))) || 0,
        hasChildren:
          item.has_children2 == 1 ||
          item.has_children2 == "1.0" ||
          item.has_children2 == true
            ? true
            : false,
        parentId: item.id1,
      };

      block.children.push(unit);
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("queryOrgStruct res: ", JSON.stringify(res));
  return res;
}

//查询主管单位明细指标数据
export async function querySupOrgDtlIndData(req) {
  // 打印视图层的入参请求
  console.log("querySupOrgDtlIndData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " SELECT     block_name as name, dept_name as unit, round(dept_payout_amount/10000,2) as spendMoney, round(dept_payout_ratio_total*100,2) as spendPer,     round(dept_payout_ratio_industry*100,2) as blockSpendPer,     dept_payout_ratio_industry_rank as spendPerSort,     round(dept_execute_rate*100,2) as executeRatio,     dept_execute_rate_rank as executeSort,     round(dept_jkje_total/10000,2) as noTaxMoney, round(dept_jkje_ratio_total*100,2) as noTaxMoneyCityRatio,     round(dept_jkje_ratio_industry,2) as noTaxMoneyBlockRatio,     dept_jkje_industry_rank as noTaxMoneyBlockSort,     dept_jkje_total_rank as noTaxMoneyCitySort FROM     CAS_FUS_SJ_XZSYDW_STRCTURE_DETAIL_I_Y WHERE 1=1  AND nf = ${param.year}  and  block_name is not null  @[AND block_name = '${param.id}'] @[order by ${param.odName}] limit ${param.pageSize} offset ${param.pageOffset}",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("querySupOrgDtlIndData dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("querySupOrgDtlIndData dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data.map((item) => ({
      ...item,
      spendMoney:
        (item.spendMoney && parseFloat(item.spendMoney).toLocaleString()) || 0,
      noTaxMoney:
        (item.noTaxMoney && parseFloat(item.noTaxMoney).toLocaleString()) || 0,
    }));
  };

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("querySupOrgDtlIndData res: ", JSON.stringify(res));
  return res;
}

//查询预算单位明细指标数据
export async function queryBudgOrgDtlIndData(req) {
  // 打印视图层的入参请求
  console.log("queryBudgOrgDtlIndData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " SELECT dept_name as name, budget_unit_name as budget, round(unit_payout_amount/10000,2) as spendMoney, round(unit_payout_ratio_all*100,2) as spendPer, round(unit_payout_ratio_dept*100,2) as unitSpendPer, ratio_rk_dept as spendPerSort,   round(unit_execute_rate*100,    2) as executeRatio, excute_rate_rk_dept as executeSort, round(jkje_total/10000,2) as noTaxMoney, round(unit_fs_ratio_all*100,2) as noTaxMoneyBudgetRatio, round(unit_fs_ratio_dept*100,2) as noTaxMoneyUnitRatio, fs_ratio_rk_dept as noTaxMoneyUnitSort    FROM     cas_fus_sj_xzsydw_struc_ys_detail_i_y     WHERE 1=1  AND nf = '${param.year}'  and  block_name is not null  @[AND dept_code = '${param.id}'] @[order by ${param.odName}] limit ${param.pageSize} offset ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("queryBudgOrgDtlIndData dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("queryBudgOrgDtlIndData dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data.map((item) => ({
      ...item,
      spendMoney:
        (item.spendMoney && parseFloat(item.spendMoney).toLocaleString()) || 0,
      noTaxMoney:
        (item.noTaxMoney && parseFloat(item.noTaxMoney).toLocaleString()) || 0,
    }));
  };

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("queryBudgOrgDtlIndData res: ", JSON.stringify(res));
  return res;
}

//查询下级单位
export async function querySubOrg(req) {
  // 打印视图层的入参请求
  console.log("querySubOrg req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select budget_unit_name as name, budget_unit_code as id, round(unit_budget_amount/10000,2) as budgetMoney, round(unit_payout_amount/10000,2) as executeMoney, round(unit_execute_rate*100,2) as executeRatio, round(jkje_total/10000,2) as noTaxMoney, 0 as has_children from CAS_FUS_SJ_XZSYDW_STRCTURE_I_Y where 1=1 @[AND nf = ${param.choosedYear}] @[AND dept_code like '%${param.id}%'] @[order by ${param.sortWay} ${param.sortType}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("querySubOrg dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("querySubOrg dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data.map((item) => ({
      ...item,
      budgetMoney:
        (item.budgetMoney && parseFloat(item.budgetMoney.toFixed(2))) || 0,
      executeMoney:
        (item.executeMoney && parseFloat(item.executeMoney.toFixed(2))) || 0,
      executeRatio:
        (item.executeRatio && parseFloat(item.executeRatio.toFixed(2))) || 0,
      noTaxMoney:
        (item.noTaxMoney && parseFloat(item.noTaxMoney.toFixed(2))) || 0,
      hasChildren:
        item.has_children == 1 ||
        item.has_children == "1.0" ||
        item.has_children == true
          ? true
          : false,
      parentId: req.id,
    }));
  };

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("querySubOrg res: ", JSON.stringify(res));
  return res;
}

// 获取主管单位表格详情排序下拉选项
export async function getManageSortOptions() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "支出金额", value: "spendMoney" },
      { label: "支出占比", value: "spendPer" },
      { label: "支出占比", value: "blockSpendPer" },
      { label: "支出占比排名", value: "spendPerSort" },
      { label: "执行率", value: "executeRatio" },
      { label: "执行率排名", value: "executeSort" },
      { label: "非税收入金额", value: "noTaxMoney" },
      { label: "非税收入占比", value: "noTaxMoneyBlockRatio" },
      { label: "非税收入占比", value: "noTaxMoneyCityRatio" },
      { label: "非税收入排名", value: "noTaxMoneyBlockSort" },
      { label: "非税收入排名", value: "noTaxMoneyCitySort" },
    ],
  };
  console.log("getManageSortOptions res: ", JSON.stringify(res));
  return res;
}

// 获取预算单位表格详情排序下拉选项
export async function getBudgetSortOptions() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "支出金额", value: "spendMoney" },
      { label: "支出占比", value: "spendPer" },
      { label: "支出占比", value: "unitSpendPer" },
      { label: "支出占比排名", value: "spendPerSort" },
      { label: "执行率", value: "executeRatio" },
      { label: "执行率排名", value: "executeSort" },
      { label: "非税收入金额", value: "noTaxMoney" },
      { label: "非税收入占比", value: "noTaxMoneyBudgetRatio" },
      { label: "非税收入占比", value: "noTaxMoneyUnitRatio" },
      { label: "非税收入排名", value: "noTaxMoneyUnitSort" },
    ],
  };
  console.log("getBudgetSortOptions res: ", JSON.stringify(res));
  return res;
}
