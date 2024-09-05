import axiosInstance from "../index.js";

const blockUrl = "/pierce/dacp/invoke";

//------板块总区域

//板块分析概览
export async function getOverviewData(req) {
  // 打印视图层的入参请求
  console.log("getOverviewData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求

  const dacpCityReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " select cnt_dept as cntDept, cnt_dept_change as cntDeptChange, cnt_budget as cntBudget, cnt_budget_change as cntBudgetChange, cnt_pro as cntPro, cnt_pro_change as cntProChange, budget_amount_total as budgetAmountTotal, actual_pay_amount_total as actualPayAmountTotal, actual_pay_amount_change_rate as actualPayAmountChangeRate, execute_rate as executeRate, execute_rate_change as executeRateChange, cnt_no_shenji_ly5 as cntNoShenjiLy5, cnt_no_shenji_ly5_change as cntNoShenjiLy5Change, cnt_never_shenji as cntNeverShenji, cnt_never_shenji_change as cntNeverShenjiChange from CAS_FUS_SJ_XZSYDW_BKFX_OVERVIEW_ALL_I_Y where 1=1 @[and budget_year = '${param.year}'] @[and q_finance_area_code = '${param.financeAreaCode}'] ",
    sqlParameter: {
      year: req.year,
      financeAreaCode: req.financeAreaCode,
    },
  };
  console.log("getOverviewData dacpCityReq: ", JSON.stringify(dacpCityReq));
  const dacpCityRes = await axiosInstance.post(`${blockUrl}`, dacpCityReq, {
    timeout: -1,
  });
  console.log("getOverviewData dacpCityRes: ", JSON.stringify(dacpCityRes));
  if (dacpCityRes.code != 0) {
    return {
      code: dacpCityRes.code,
      message: dacpCityRes.message,
      data: dacpCityRes.data,
    };
  }

  const dacpSecReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select unit_industry_name as unitIndustryName, cnt_dept as cntDept, cnt_dept_change as cntDeptChange, cnt_budget as cntBudget, cnt_budget_change as cntBudgetChange, cnt_pro as cntPro, cnt_pro_change as cntProChange, cnt_no_shenji_ly5 as cntNoShenjiLy5, cnt_no_shenji_ly5_change as cntNoShenjiLy5Change, cnt_never_shenji as cntNeverShenji, cnt_never_shenji_change as cntNeverShenjiChange from CAS_FUS_SJ_XZSYDW_BKFX_OVERVIEW_BK_I_Y where 1=1 @[and budget_year = '${param.year}'] @[and q_finance_area_code = '${param.financeAreaCode}'] order by headcount desc",
    sqlParameter: {
      year: req.year,
      financeAreaCode: req.financeAreaCode,
    },
  };
  console.log("getOverviewData dacpSecReq: ", JSON.stringify(dacpSecReq));
  const dacpSecRes = await axiosInstance.post(`${blockUrl}`, dacpSecReq, {
    timeout: -1,
  });
  console.log("getOverviewData dacpSecRes: ", JSON.stringify(dacpSecRes));
  if (dacpSecRes.code != 0) {
    return {
      code: dacpSecRes.code,
      message: dacpSecRes.message,
      data: dacpSecRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformCityData(allOverview) {
    let resAllOverview = {};
    if (allOverview) {
      resAllOverview = {
        id: "1",
        name: "全市概况",
        businessNum: allOverview.cntDept,
        businessPer: allOverview.cntDeptChange,
        businessStatus:
          allOverview.cntDeptChange === null ||
          allOverview.cntDeptChange === undefined
            ? 2
            : allOverview.cntDeptChange >= 0
            ? 1
            : 0,
        budgetNum: allOverview.cntBudget,
        budgetPer: allOverview.cntBudgetChange,
        budgetStatus:
          allOverview.cntBudgetChange === null ||
          allOverview.cntBudgetChange === undefined
            ? 2
            : allOverview.cntBudgetChange >= 0
            ? 1
            : 0,
        projectNum: allOverview.cntPro,
        projectPer: allOverview.cntProChange,
        projectStatus:
          allOverview.cntProChange === null ||
          allOverview.cntProChange === undefined
            ? 2
            : allOverview.cntProChange >= 0
            ? 1
            : 0,
        budgetMoney:
          allOverview.budgetAmountTotal === null ||
          allOverview.budgetAmountTotal === undefined
            ? null
            : (allOverview.budgetAmountTotal / 10000).toFixed(2),
        budgetMoneyPer:
          allOverview.budgetAmountChangeRate === null ||
          allOverview.budgetAmountChangeRate === undefined
            ? null
            : (allOverview.budgetAmountChangeRate * 100).toFixed(2),
        budgetMoneyStatus:
          allOverview.budgetAmountChangeRate === null ||
          allOverview.budgetAmountChangeRate === undefined
            ? 2
            : allOverview.budgetAmountChangeRate >= 0
            ? 1
            : 0,
        executeMoney:
          allOverview.actualPayAmountTotal === null ||
          allOverview.actualPayAmountTotal === undefined
            ? null
            : (allOverview.actualPayAmountTotal / 10000).toFixed(2),
        executionMoneyPer:
          allOverview.actualPayAmountChangeRate === null ||
          allOverview.actualPayAmountChangeRate === undefined
            ? null
            : (allOverview.actualPayAmountChangeRate * 100).toFixed(2),
        executeMoneyStatus:
          allOverview.actualPayAmountChangeRate === null ||
          allOverview.actualPayAmountChangeRate === undefined
            ? 2
            : allOverview.actualPayAmountChangeRate >= 0
            ? 1
            : 0,
        executePer:
          allOverview.executeRate === null ||
          allOverview.executeRate === undefined
            ? null
            : (allOverview.executeRate * 100).toFixed(2),
        executionPerPer:
          allOverview.executeRateChange === null ||
          allOverview.executeRateChange === undefined
            ? null
            : (allOverview.executeRateChange * 100).toFixed(2),
        executePerStatus:
          allOverview.executeRateChange === null ||
          allOverview.executeRateChange === undefined
            ? 2
            : allOverview.executeRateChange >= 0
            ? 1
            : 0,
        noAuditNum: allOverview.cntNoShenjiLy5,
        noAuditPer: allOverview.cntNoShenjiLy5Change,
        noAuditStatus:
          allOverview.cntNoShenjiLy5Change === null ||
          allOverview.cntNoShenjiLy5Change === undefined
            ? 2
            : allOverview.cntNoShenjiLy5Change >= 0
            ? 1
            : 0,
        neverNum: allOverview.cntNeverShenji,
        neverPer: allOverview.cntNeverShenjiChange,
        neverStatus:
          allOverview.cntNeverShenjiChange === null ||
          allOverview.cntNeverShenjiChange === undefined
            ? 2
            : allOverview.cntNeverShenjiChange >= 0
            ? 1
            : 0,
      };
    }
    return resAllOverview;
  }

  function transformSecData(secOverviewS) {
    let blockList = [];
    if (secOverviewS && secOverviewS.length > 0) {
      let idCounter = 1;
      secOverviewS.forEach((secOverview) => {
        let block = {
          id: idCounter.toString(),
          name: secOverview.unitIndustryName,
          businessNum: secOverview.cntDept,
          businessPer: secOverview.cntDeptChange,
          businessStatus:
            secOverview.cntDeptChange === null ||
            secOverview.cntDeptChange === undefined
              ? 2
              : secOverview.cntDeptChange >= 0
              ? 1
              : 0,
          budgetNum: secOverview.cntBudget,
          budgetPer: secOverview.cntBudgetChange,
          budgetStatus:
            secOverview.cntBudgetChange === null ||
            secOverview.cntBudgetChange === undefined
              ? 2
              : secOverview.cntBudgetChange >= 0
              ? 1
              : 0,
          projectNum: secOverview.cntPro,
          projectPer: secOverview.cntProChange,
          projectStatus:
            secOverview.cntProChange === null ||
            secOverview.cntProChange === undefined
              ? 2
              : secOverview.cntProChange >= 0
              ? 1
              : 0,
          noAuditNum: secOverview.cntNoShenjiLy5,
          noAuditPer: secOverview.cntNoShenjiLy5Change,
          noAuditStatus:
            secOverview.executeRateChange === null ||
            secOverview.executeRateChange === undefined
              ? 2
              : secOverview.executeRateChange >= 0
              ? 1
              : 0,
          neverNum: secOverview.cntNeverShenji,
          neverPer: secOverview.cntNeverShenjiChange,
          neverStatus:
            secOverview.cntNeverShenjiChange === null ||
            secOverview.cntNeverShenjiChange === undefined
              ? 2
              : secOverview.cntNeverShenjiChange >= 0
              ? 1
              : 0,
        };
        blockList.push(block);
        idCounter++;
      });
    }
    return blockList;
  }
  // 构造并返回给视图层的响应
  const res = {
    code: dacpSecRes.code,
    message: "成功",
    data: {
      overview: transformCityData(dacpCityRes.data[0]),
      blocks: transformSecData(dacpSecRes.data),
    },
  };
  console.log("getOverviewData res: ", JSON.stringify(res));
  return res;
}
