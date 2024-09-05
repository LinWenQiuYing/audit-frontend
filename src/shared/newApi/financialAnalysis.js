//财务分析
import axiosInstance from "./index.js";

const financialUrl = "/pierce/dacp/invoke";

//------电子账簿信息tab
//电子账簿信息表格数据
export async function getElectronicBookData(req) {
  // 打印视图层的入参请求
  console.log("getElectronicBookData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) AS total FROM CAS_DWD_FUS_SJ_CW_ACCT_EBK_I_Y WHERE 1=1 @[AND adm_div_code = '${param.admDivCode}'] @[AND unit_name = '${param.unitName}'] @[AND acct_year = '${param.year}'] @[AND acct_ebk_num = '${param.acctEbkNum}']",
    sqlParameter: req,
  };
  console.log(
    "getElectronicBookData dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getElectronicBookData dacpTotalReq: ",
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
      "SELECT id, adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, unit_code as organizationCode, unit_name as organizationName, org_code as organizationInstitutionCode, acct_ebk_num as accountingElectronicLedgerNumber, acct_ebk_name as  accountingElectronicLedgerName, unit_nature as organizationNature, ind_category as industryClassification, dev_unit as developmentUnit, ver_num as versionNumber, std_curr as baseCurrency, acct_subj_struct as accountingSubjectStructure, inc_budget_acct as containsBudgetLedger, batch_uuid as  batchuuid, bdp_audit as bdpaudit FROM CAS_DWD_FUS_SJ_CW_ACCT_EBK_I_Y WHERE 1=1 @[AND adm_div_code = '${param.admDivCode}'] @[AND unit_name = '${param.unitName}'] @[AND acct_year = '${param.year}'] @[AND acct_ebk_num = '${param.acctEbkNum}'] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };
  console.log(
    "getElectronicBookData dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpDetailReq, {
    timeout: -1,
  });
  console.log("getElectronicBookData dacpRes: ", JSON.stringify(dacpRes));
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

// 电子账簿信息   表格排序字段
export async function getElectronicBooksSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "单位名称",
        value: "organizationName",
        type: "string",
      },
      {
        label: "会计年度",
        value: "fiscalYear",
        type: "string",
      },
      {
        label: "会计电子账簿编号",
        value: "accountingElectronicLedgerNumber",
        type: "string",
      },
      {
        label: "会计电子账簿名称",
        value: "accountingElectronicLedgerName",
        type: "string",
      },
      {
        label: "本位币",
        value: "baseCurrency",
        type: "string",
      },
      {
        label: "会计科目结构",
        value: "accountingSubjectStructure",
        type: "string",
      },
      {
        label: "是否含有预算账",
        value: "containsBudgetLedger",
        type: "string",
      },
      {
        label: "单位代码",
        value: "organizationCode",
        type: "string",
      },
      {
        label: "组织机构代码",
        value: "organizationInstitutionCode",
        type: "string",
      },
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
        type: "string",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
        type: "string",
      },
      {
        label: "单位性质",
        value: "organizationNature",
        type: "string",
      },
      {
        label: "行业分类",
        value: "industryClassification",
        type: "string",
      },
      {
        label: "开发单位",
        value: "developmentUnit",
        type: "string",
      },
      {
        label: "版本号",
        value: "versionNumber",
        type: "string",
      },
      {
        label: "BATCH_UUID",
        value: "batchuuid",
        type: "string",
      },
      {
        label: "BDP_AUDIT",
        value: "bdpaudit",
        type: "string",
      },
    ],
  };
  console.log("getElectronicBooksSort res: ", JSON.stringify(res));
  return res;
}

//电子账簿信息行政区域名称下拉框
export async function getElectronicSectionOptions(req) {
  // 打印视图层的入参请求
  console.log("getElectronicSectionOptions req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name AS label, adm_div_code AS value FROM CAS_DWD_FUS_SJ_CW_ACCT_EBK_I_Y WHERE 1 = 1 @[AND adm_div_name like '%${param.admDivName}%'] ORDER BY adm_div_code ASC;",
    sqlParameter: req,
  };
  console.log("getElectronicSectionOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getElectronicSectionOptions dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getElectronicSectionOptions res: ", JSON.stringify(res));
  return res;
}

//电子账簿信息单位名称下拉框
export async function getElectronicUnitOptions(req) {
  // 打印视图层的入参请求
  console.log("getElectronicUnitOptions req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT unit_name AS label, unit_name AS value FROM CAS_DWD_FUS_SJ_CW_ACCT_EBK_I_Y WHERE 1 = 1 @[AND unit_name like '%${param.unitName}%'] ORDER BY unit_code ASC limit 50;",
    sqlParameter: req,
  };
  console.log("getElectronicUnitOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getElectronicUnitOptions dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getElectronicUnitOptions res: ", JSON.stringify(res));
  return res;
}
//电子账簿信息年份下拉框
export async function getElectronicYearOptions(req) {
  // 打印视图层的入参请求
  console.log("getElectronicYearOptions req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value from CAS_DWD_FUS_SJ_CW_ACCT_EBK_I_Y order by acct_year asc;",
    sqlParameter: req,
  };
  console.log("getElectronicYearOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getElectronicYearOptions dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getElectronicYearOptions res: ", JSON.stringify(res));
  return res;
}

//电子账簿信息电子账簿名称名称下拉框
export async function getElectronicBooksOptions(req) {
  // 打印视图层的入参请求
  console.log("getElectronicBooksOptions req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name AS label, acct_ebk_num AS value FROM CAS_DWD_FUS_SJ_CW_ACCT_EBK_I_Y WHERE 1 = 1 @[AND acct_ebk_name like '%${param.acctEbkName}%'] ORDER BY acct_ebk_num ASC;",
    sqlParameter: req,
  };
  console.log("getElectronicBooksOptions dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getElectronicBooksOptions dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getElectronicBooksOptions res: ", JSON.stringify(res));
  return res;
}

//------总账明细账tab
//总账明细账表格数据查询1
export async function getGeneralDetailsDataOne(req) {
  // 打印视图层的入参请求
  console.log("getGeneralDetailsDataOne req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select concat(id, acct_subj_code) as `key`, acct_subj_code as subjectCode, acct_subj_name as subjectName, full_subj_name as fullSubjectName, ROUND(debit_balance_begin_year,2) as beginningBalanceAtYearStart, ROUND(credit_balance_begin_year,2) as creditBalanceAtYearStart, balance_direction_begin_year as balanceDirectionAtYearStart, ROUND(open_debit_bal,2) as debitBalanceAtPeriodStart, ROUND(open_credit_bal,2) as creditBalanceAtPeriodStart, open_bal_direction as balanceDirectionAtPeriodStart, ROUND(fc_debit_bal_begin_year,2) as foreignCurrencyDebitBalanceAtYearStart, ROUND(fc_credit_bal_begin_year,2) as foreignCurrencyCreditBalanceAtYearStart, ROUND(fc_open_debit_bal,2) as foreignCurrencyDebitBalanceAtPeriodStart, ROUND(fc_open_credit_bal,2) as foreignCurrencyCreditBalanceAtPeriodStart, ROUND(acc_debit_amount,2) as cumulativeDebitAmount, ROUND(acc_fc_debit_amount,2) as foreignCurrencyCumulativeDebitAmount, ROUND(acc_credit_amount,2) as cumulativeCreditAmount, ROUND(acc_fc_credit_amount,2) as foreignCurrencyCumulativeCreditAmount, ROUND(end_debit_bal,2) as debitBalanceAtPeriodEnd, ROUND(end_credit_bal,2) as creditBalanceAtPeriodEnd, end_bal_direction as balanceDirectionAtPeriodEnd, ROUND(fc_end_debit_bal,2) as foreignCurrencyDebitBalanceAtPeriodEnd, ROUND(fc_end_credit_bal,2) as foreignCurrencyCreditBalanceAtPeriodEnd, entry_number as entryCount, acct_subj_level as accountingSubjectLevel, is_lowest_level_subj as isLowestLevelSubject, superior_subj_code as parentSubjectCode, is_cash_eq as isCashOrCashEquivalent, curr_name as currencyName, curr_code as currencyCode, acct_month as accountingMonth, acct_year as accountingYear, ROUND(debit_amount,2) as debitAmount, ROUND(fc_debit_amount,2) as foreignCurrencyDebitAmount, ROUND(credit_amount,2) as creditAmount, ROUND(fc_credit_amount,2) as foreignCurrencyCreditAmount from CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y where 1 = 1 and acct_subj_level <= 3 @[and unit_name = '${param.unitName}'] @[and acct_year = '${param.acctYear}'] @[and acct_ebk_num = '${param.acctEbkNum}'] @[and acct_system = '${param.acctSystem}'] @[and acct_month in ${param.acctMonth}] @[and left(acct_subj_code,4) in ${param.acctSubjCode}] order by acct_subj_code asc, acct_month asc;",
    sqlParameter: req,
  };
  console.log("getGeneralDetailsDataOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getGeneralDetailsDataOne dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    const map = {};
    const roots = [];

    data.forEach((item) => {
      map[item.accountingYear + item.accountingMonth + item.subjectCode] = {
        ...item,
        children: [],
      };
    });

    data.forEach((item) => {
      if (item.parentSubjectCode) {
        map[
          item.accountingYear + item.accountingMonth + item.parentSubjectCode
        ].children.push(
          map[item.accountingYear + item.accountingMonth + item.subjectCode]
        );
      } else {
        roots.push(
          map[item.accountingYear + item.accountingMonth + item.subjectCode]
        );
      }
    });

    return roots;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getGeneralDetailsDataOne res: ", JSON.stringify(res));
  return res;
}

//总账明细账表格数据查询2
export async function getGeneralDetailsDataTwo(req) {
  // 打印视图层的入参请求
  console.log("getGeneralDetailsDataTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) AS total from CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y where 1 = 1 @[and acct_subj_code like '${param.acctSubjCode}%'] @[and acct_ebk_num = '${param.acctEbkNum}'] @[and unit_name = '${param.unitName}'] @[and acct_year = '${param.acctYear}'] @[and acct_month between 1 and ${param.acctMonth}] @[and acct_system = '${param.acctSystem}'];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "getGeneralDetailsDataTwo dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getGeneralDetailsDataTwo dacpTotalRes: ",
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
      "select acct_year as accountingYear, acct_month as accountingMonth, concat(id, acct_subj_code) as `key`, acct_subj_code as subjectCode, acct_subj_name as subjectName, full_subj_name as fullSubjectName, voucher_date as voucherDate, acct_voucher_num as voucherNumber, acct_voucher_summary as accountingSummary, ROUND(debit_amount,2) as debitOccurrenceAmount, ROUND(credit_amount,2) as creditOccurrenceAmount, counterpart_subj_code as counterpartySubjectCode, counterpart_subj_name as counterpartySubjectName from CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y where 1 = 1 @[and acct_subj_code like '${param.acctSubjCode}%'] @[and acct_ebk_num = '${param.acctEbkNum}'] @[and unit_name = '${param.unitName}'] @[and acct_year = '${param.acctYear}'] @[and acct_month between 1 and ${param.acctMonth}] @[and acct_system = '${param.acctSystem}'] order by voucher_date asc, acct_voucher_num asc limit ${param.pageSize} offset ${param.pageOffset};",
    sqlParameter: req,
  };
  console.log(
    "getGeneralDetailsDataTwo dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getGeneralDetailsDataTwo dacpDetailRes: ",
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
  // const transformData = (data) => {
  //   return data;
  // };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: {
      total: dacpTotalRes.data[0].total,
      dateList: dacpDetailRes.data,
    },
  };
  console.log("getGeneralDetailsDataTwo res: ", JSON.stringify(res));
  return res;
}

//总账明细账表格数据查询3
export async function getGeneralDetailsDataThree(req) {
  // 打印视图层的入参请求
  console.log("getGeneralDetailsDataThree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求，获取概览数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select unit_code, acct_ebk_num, acct_system, acct_year, acct_month, acct_voucher_num as voucherNumber, sum(debit_amount) as debitAmountSummary, sum(credit_amount) as creditAmountSummary, voucher_date as voucherDate from CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y where 1=1 @[and acct_subj_code = '${param.acctSubjCode}'] @[and acct_ebk_num='${param.acctEbkNum}'] @[and unit_name='${param.unitName}'] @[and acct_year='${param.acctYear}'] @[and acct_month in ${param.acctMonth}] @[and acct_system='${param.acctSystem}'] @[and acct_voucher_num = '${param.acctTypeNum}'] group by unit_code, acct_ebk_num, acct_system, acct_year, acct_month, voucher_date, acct_voucher_num;",
    sqlParameter: req,
  };
  console.log(
    "getGeneralDetailsDataThree dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getGeneralDetailsDataThree dacpTotalReq: ",
    JSON.stringify(dacpTotalRes)
  );
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " select concat(id,acct_subj_code) as `key`, acct_subj_code as subjectCode, full_subj_name as fullSubjectName, acct_voucher_num as voucherNumber, acct_month as accountingMonth, acct_voucher_summary as summary, ROUND(debit_amount,2) as debitAmount, ROUND(credit_amount,2) as creditAmount, voucher_date as voucherDate from CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y where 1=1 @[and acct_subj_code = '${param.acctSubjCode}'] @[and acct_ebk_num='${param.acctEbkNum}'] @[and unit_name='${param.unitName}'] @[and acct_year='${param.acctYear}'] @[and acct_month in ${param.acctMonth}] @[and acct_system='${param.acctSystem}'] @[and acct_voucher_num = '${param.acctTypeNum}'] ORDER BY  RIGHT(entry_seq_num,2) asc;",
    sqlParameter: req,
  };
  console.log(
    "getGeneralDetailsDataThree dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getGeneralDetailsDataThree dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );
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
      dateList: dacpDetailRes.data,
      ...dacpTotalRes.data[0],
    },
  };
  console.log("getGeneralDetailsDataThree res: ", JSON.stringify(res));
  return res;
}

//获取总账明细账 预算单位
export async function getGeneralDetailsBudget(req) {
  // 打印视图层的入参请求
  console.log("getGeneralDetailsBudget req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT unit_name as `label`, unit_name as `value` FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y where 1 = 1 @[AND unit_name like '%${param.unitName}%'] group by unit_code, unit_name ORDER BY unit_code asc LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getGeneralDetailsBudget dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getGeneralDetailsBudget dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getGeneralDetailsBudget res: ", JSON.stringify(res));
  return res;
}

//获取总账明细账 会计电子账簿
export async function getGeneralDetailsBook(req) {
  // 打印视图层的入参请求
  console.log("getGeneralDetailsBook req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT acct_ebk_name as label, acct_ebk_num as value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y where 1 = 1 @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name like '%${param.acctEbkName}%'] GROUP BY acct_ebk_name, acct_ebk_num ORDER BY acct_ebk_num ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getGeneralDetailsBook dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getGeneralDetailsBook dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getGeneralDetailsBook res: ", JSON.stringify(res));
  return res;
}

//获取总账明细账 会计体系
export async function getGeneralDetailsSystem(req) {
  // 打印视图层的入参请求
  console.log("getGeneralDetailsSystem req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT acct_system AS `label`, acct_system AS `value` FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y where 1 = 1 @[AND unit_name = '${param.unitName}'] @[AND acct_system like '%${param.acctSystem}%'] GROUP BY acct_system ORDER BY acct_system asc;",
    sqlParameter: req,
  };
  console.log("getGeneralDetailsSystem dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getGeneralDetailsSystem dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getGeneralDetailsSystem res: ", JSON.stringify(res));
  return res;
}

//获取总账明细账 会计科目
export async function getGeneralDetailsSubjects(req) {
  // 打印视图层的入参请求
  console.log("getGeneralDetailsSubjects req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT t1.title, t1.value, t1.key, t1.level, t1.parentKey FROM (SELECT concat(acct_subj_code, '--', acct_subj_name) as title, acct_subj_code as value, acct_subj_code as `key`, acct_subj_level as level, superior_subj_code as parentKey FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y where 1 = 1 @[and acct_subj_level <= ${param.acctSubjLevel}] @[AND unit_name = '${param.unitName}'] @[AND acct_subj_code in ${param.acctSubjCode}] @[AND acct_subj_code like '%${param.inputData}%'] GROUP BY acct_subj_code, acct_subj_name, acct_subj_level, superior_subj_code ORDER BY acct_subj_code asc ) AS t1 UNION SELECT t2.title, t2.value, t2.key, t2.level, t2.parentKey FROM (SELECT concat(acct_subj_code, '--', acct_subj_name) as title, acct_subj_code as value, acct_subj_code as `key`, acct_subj_level as level, superior_subj_code as parentKey FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y where 1 = 1 @[and acct_subj_level <= ${param.acctSubjLevel}] @[AND unit_name = '${param.unitName}'] @[AND acct_subj_code in ${param.acctSubjCode}] @[AND acct_subj_name like '%${param.inputData}%'] GROUP BY acct_subj_code, acct_subj_name, acct_subj_level, superior_subj_code ORDER BY acct_subj_code asc ) AS t2",
    sqlParameter: req,
  };
  console.log("getGeneralDetailsSubjects dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getGeneralDetailsSubjects dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    const map = {};
    const roots = [];

    data.forEach((item) => {
      map[item.key] = { ...item, children: [] };
    });

    data.forEach((item) => {
      if (item.parentKey) {
        map[item.parentKey].children.push(map[item.key]);
      } else {
        roots.push(map[item.key]);
      }
    });

    return roots;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getGeneralDetailsSubjects res: ", JSON.stringify(res));
  return res;
}

//获取总账明细账 年度
export async function getGeneralDetailsYear(req) {
  // 打印视图层的入参请求
  console.log("getGeneralDetailsYear req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT distinct acct_year as value, acct_year as label FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y WHERE 1=1 @[AND unit_name = '${param.unitName}'] ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getGeneralDetailsYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getGeneralDetailsYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getGeneralDetailsYear res: ", JSON.stringify(res));
  return res;
}

//------对比分析tab
//获取对比分析 指定单位
export async function getCompareStructure(req) {
  // 打印视图层的入参请求
  console.log("getCompareStructure req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT unit_name as `label`, unit_name as `value` FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y  where 1=1 @[and unit_name like '%${param.inputData}%'] GROUP BY unit_code, unit_name ORDER BY unit_code ASC limit 50;",
    sqlParameter: req,
  };
  console.log("getCompareStructure dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getCompareStructure dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getCompareStructure res: ", JSON.stringify(res));
  return res;
}

//获取对比分析 指定账簿
export async function getCompareBook(req) {
  // 打印视图层的入参请求
  console.log("getCompareBook req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT acct_ebk_name as `label`, acct_ebk_num as `value` 	FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y     where 1=1  @[and unit_name in ${param.unitName}]   @[and acct_subj_code in ${param.acctSubjCode}] @[and acct_ebk_num in ${param.acctEbkNum}] @[and acct_subj_level <= '${param.acctSubjLevel}']  @[and acct_year between '${param.acctYearStart}' and '${param.acctYearEnd}'] @[and concat(acct_year,'-',RIGHT(LPAD(acct_month, 2, '0'), 2)) between '${param.acctYearMonthStart}' and  '${param.acctYearMonthEnd}']  	GROUP BY acct_ebk_num;",
    sqlParameter: req,
  };
  console.log("getCompareBook dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getCompareBook dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  const transformData = (data) => {
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getCompareBook res: ", JSON.stringify(res));
  return res;
}

//获取对比分析 指定科目
export async function getCompareSubjects(req) {
  // 打印视图层的入参请求
  console.log("getCompareSubjects req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT concat(acct_subj_code, '--', acct_subj_name) as `title`, acct_subj_code as `value`, acct_subj_code as `key`, acct_subj_level as `level`, superior_subj_code as `parentKey` FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y WHERE 1 = 1 @[and unit_name in ${param.unitName}]  @[and acct_subj_code in ${param.acctSubjCode}] @[and acct_ebk_num in ${param.acctEbkNum}] @[and acct_subj_level <= '${param.acctSubjLevel}']  @[and acct_year between '${param.acctYearStart}' and '${param.acctYearEnd}'] @[and concat(acct_year,'-',RIGHT(LPAD(acct_month, 2, '0'), 2)) between '${param.acctYearMonthStart}' and  '${param.acctYearMonthEnd}'] GROUP BY acct_subj_code,acct_subj_name,acct_subj_level,superior_subj_code",
    sqlParameter: req,
  };
  console.log("getCompareSubjects dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getCompareSubjects dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    const map = {};
    const roots = [];

    data.forEach((item) => {
      map[item.key] = { ...item, children: [] };
    });

    data.forEach((item) => {
      if (item.parentKey) {
        map[item.parentKey].children.push(map[item.key]);
      } else {
        roots.push(map[item.key]);
      }
    });

    return roots;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getCompareSubjects res: ", JSON.stringify(res));
  return res;
}

//获取对比分析 表格数据    指定区间选择月份
// export async function getCompareDataByMonth(req) {
//   // 打印视图层的入参请求
//   console.log("getCompareDataByMonth req: ", JSON.stringify(req));

//   // 调用后端dacp接口
//   const dacpReq = {
//     sqlEndpoint: "audit_rds_dataVisualization_3",
//     sqlTemplate:
//       "select acct_subj_code as `key`, superior_subj_code as parent_key,acct_subj_name as project, unit_name, unit_code, acct_year, RIGHT(LPAD(acct_month, 2, '0'), 2) as acct_month, acct_subj_level, concat('startMoneyBrrow',acct_year,RIGHT(LPAD(acct_month, 2, '0'), 2),unit_name) as startMoneyBrrow_name, open_debit_bal as startMoneyBrrow_data, concat('startMoneyGet',acct_year,RIGHT(LPAD(acct_month, 2, '0'), 2),unit_name) as startMoneyGet_name, open_credit_bal as startMoneyGet_data, concat('allMoneyBrrow',acct_year,RIGHT(LPAD(acct_month, 2, '0'), 2),unit_name) as allMoneyBrrow_name, acc_debit_amount as allMoneyBrrow_data, concat('allMoneyGet',acct_year,RIGHT(LPAD(acct_month, 2, '0'), 2),unit_name) as allMoneyGet_name, acc_credit_amount as allMoneyGet_data, concat('endMoneyBrrow',acct_year,RIGHT(LPAD(acct_month, 2, '0'), 2),unit_name) as  endMoneyBrrow_name, end_debit_bal as endMoneyBrrow_data, concat('endMoneyGet',acct_year,RIGHT(LPAD(acct_month, 2, '0'), 2),unit_name) as  endMoneyGet_name, end_credit_bal as endMoneyGet_data from CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y where 1=1  @[and unit_code in ${param.unitCode}]  @[and acct_subj_code in ${param.acctSubjCode}] @[and acct_ebk_num in ${param.acctEbkNum}] @[and acct_subj_level <= '${param.acctSubjLevel}']  @[and acct_year between '${param.acctYearStart}' and '${param.acctYearEnd}'] @[and concat(acct_year,'-',RIGHT(LPAD(acct_month, 2, '0'), 2)) between '${param.acctYearMonthStart}' and '${param.acctYearMonthEnd}'] ;",
//     sqlParameter: req,
//   };
//   console.log("getCompareDataByMonth dacpReq: ", JSON.stringify(dacpReq));
//   const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
//     timeout: -1,
//   });
//   console.log("getCompareDataByMonth dacpRes: ", JSON.stringify(dacpRes));
//   if (dacpRes.code != 0) {
//     return {
//       code: dacpRes.code,
//       message: dacpRes.message,
//       data: dacpRes.data,
//     };
//   }

//   // 转换接口调用结果为前端需要的结构
//   function transformData(inputData) {
//     const columns = [];
//     const data = [];

//     // Extract unique years, months, and units
//     const years = [...new Set(inputData.map((item) => item.acct_year))].sort();
//     const units = [...new Set(inputData.map((item) => item.unit_name))].sort();
//     const months = [
//       ...new Set(inputData.map((item) => item.acct_month)),
//     ].sort();

//     // Create columns structure
//     columns.push({
//       title: "科目名称",
//       dataIndex: "project",
//       key: "project",
//       width: 250,
//       fixed: "left",
//     });

//     years.forEach((year) => {
//       const yearColumn = {
//         title: `${year}`,
//         // width: 400,
//         children: [],
//       };

//       months.forEach((month) => {
//         const monthColumn = {
//           title: `${month}月`,
//           children: [],
//         };

//         units.forEach((unit) => {
//           const unitColumn = {
//             title: unit,
//             children: [
//               {
//                 title: "期初余额",
//                 dataIndex: `startMoney${year}${month}${unit}`,
//                 key: `startMoney${year}${month}${unit}`,
//                 width: 400,
//                 children: [
//                   {
//                     title: "借方",
//                     dataIndex: `startMoneyBrrow${year}${month}${unit}`,
//                     key: `startMoneyBrrow${year}${month}${unit}`,
//                     width: 200,
//                   },
//                   {
//                     title: "贷方",
//                     dataIndex: `startMoneyGet${year}${month}${unit}`,
//                     key: `startMoneyGet${year}${month}${unit}`,
//                     width: 200,
//                   },
//                 ],
//               },
//               {
//                 title: "累计发生额",
//                 dataIndex: `allMoney${year}${month}${unit}`,
//                 key: `allMoney${year}${month}${unit}`,
//                 width: 400,
//                 children: [
//                   {
//                     title: "借方",
//                     dataIndex: `allMoneyBrrow${year}${month}${unit}`,
//                     key: `allMoneyBrrow${year}${month}${unit}`,
//                     width: 200,
//                   },
//                   {
//                     title: "贷方",
//                     dataIndex: `allMoneyGet${year}${month}${unit}`,
//                     key: `allMoneyGet${year}${month}${unit}`,
//                     width: 200,
//                   },
//                 ],
//               },
//               {
//                 title: "期末余额",
//                 dataIndex: `endMoney${year}${month}${unit}`,
//                 key: `endMoney${year}${month}${unit}`,
//                 width: 400,
//                 children: [
//                   {
//                     title: "借方",
//                     dataIndex: `endMoneyBrrow${year}${month}${unit}`,
//                     key: `endMoneyBrrow${year}${month}${unit}`,
//                     width: 200,
//                   },
//                   {
//                     title: "贷方",
//                     dataIndex: `endMoneyGet${year}${month}${unit}`,
//                     key: `endMoneyGet${year}${month}${unit}`,
//                     width: 200,
//                   },
//                 ],
//               },
//             ],
//           };
//           monthColumn.children.push(unitColumn);
//         });

//         yearColumn.children.push(monthColumn);
//       });

//       columns.push(yearColumn);
//     });

//     // Create data structure
//     inputData.forEach((item) => {
//       const dataItem = {
//         key: item.key,
//         parentKey: item.parent_key,
//         project: item.key + "--" + item.project,
//       };

//       years.forEach((year) => {
//         months.forEach((month) => {
//           units.forEach((unit) => {
//             if (
//               item.acct_year === year &&
//               item.acct_month === month &&
//               item.unit_name === unit
//             ) {
//               dataItem[`startMoneyBrrow${year}${month}${unit}`] =
//                 item.startMoneyBrrow_data;
//               dataItem[`startMoneyGet${year}${month}${unit}`] =
//                 item.startMoneyGet_data;
//               dataItem[`allMoneyBrrow${year}${month}${unit}`] =
//                 item.allMoneyBrrow_data;
//               dataItem[`allMoneyGet${year}${month}${unit}`] =
//                 item.allMoneyGet_data;
//               dataItem[`endMoneyBrrow${year}${month}${unit}`] =
//                 item.endMoneyBrrow_data;
//               dataItem[`endMoneyGet${year}${month}${unit}`] =
//                 item.endMoneyGet_data;
//             }
//           });
//         });
//       });

//       data.push(dataItem);
//     });

//     // convert data structure to tree
//     function arrayToTree(arr) {
//       const map = {};
//       const roots = [];

//       // First pass: create a map of nodes keyed by their `key`
//       arr.forEach((node) => {
//         if (!map[node.key]) {
//           map[node.key] = { ...node, children: [] };
//         } else {
//           // Handle duplicate key: merge or add to children
//           Object.assign(map[node.key], node); // Merge properties if needed
//         }
//       });

//       // Second pass: connect nodes to their parent
//       arr.forEach((node) => {
//         if (node.parentKey !== "") {
//           const parentNode = map[node.parentKey];
//           if (parentNode) {
//             if (!parentNode.children.find((item) => item.key === node.key)) {
//               parentNode.children.push(map[node.key]);
//             }
//           } else {
//             // Handle case where parentKey is not found (optional)
//             console.error(
//               `Parent node ${node.parentKey} not found for node ${node.key}`
//             );
//           }
//         } else {
//           if (!roots.find((item) => item.key === node.key)) {
//             roots.push(map[node.key]); // Root nodes have an empty parentKey
//           }
//         }
//       });

//       return roots;
//     }

//     return { columns, data: arrayToTree(data) };
//   }

//   // 构造并返回给视图层的响应
//   const res = {
//     code: 0,
//     message: "成功",
//     data: transformData(dacpRes.data),
//   };
//   console.log("getCompareDataByMonth res: ", JSON.stringify(res));
//   return res;
// }

//获取对比分析 表格数据    指定区间选择年份
export async function getCompareDataByYear(req) {
  // 打印视图层的入参请求
  console.log("getCompareDataByYear req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select acct_subj_code as `key`, superior_subj_code as parent_key, acct_subj_name as project, unit_name, unit_code, acct_year, acct_subj_level, concat ('startMoneyBrrow',acct_year,unit_name ) as startMoneyBrrow_name, cast(round(sum(open_debit_bal), 2) as char) as startMoneyBrrow_data, concat ( 'startMoneyGet',acct_year,unit_name ) as startMoneyGet_name, cast(round(sum(open_credit_bal), 2) as char) as startMoneyGet_data, concat ( 'allMoneyBrrow',acct_year,unit_name ) as allMoneyBrrow_name, cast(round(sum(acc_debit_amount), 2) as char) as allMoneyBrrow_data, concat ( 'allMoneyGet',acct_year,unit_name ) as allMoneyGet_name, cast(round(sum(acc_credit_amount), 2) as char) as allMoneyGet_data, concat ('endMoneyBrrow',acct_year,unit_name ) as endMoneyBrrow_name, cast(round(sum(end_debit_bal), 2) as char) as endMoneyBrrow_data, concat ( 'endMoneyGet',acct_year,unit_name ) as endMoneyGet_name, cast(round(sum(end_credit_bal), 2) as char) as endMoneyGet_data from CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y where 1 = 1 @[and unit_name in ${param.unitName}] @[and acct_subj_code in ${param.acctSubjCode}] @[and acct_ebk_num in ${param.acctEbkNum}] @[and acct_subj_level <= '${param.acctSubjLevel}'] @[and acct_year between '${param.acctYearStart}' and '${param.acctYearEnd}'] @[and acct_system = ${param.acctSystem}] group by acct_year, unit_code, unit_name, acct_subj_code, acct_subj_name, acct_subj_level, superior_subj_code;",
    sqlParameter: req,
  };
  console.log("getCompareDataByYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getCompareDataByYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData) {
    const columns = [];
    const data = [];

    // Extract unique years, months, and units
    const units = [...new Set(inputData.map((item) => item.unit_name))].sort();
    const years = [...new Set(inputData.map((item) => item.acct_year))].sort();

    // Create columns structure
    columns.push({
      title: "科目名称",
      dataIndex: "project",
      key: "project",
      width: 250,
      fixed: "left",
    });

    // 期初余额列
    const startMoneyColumn = {
      title: "期初余额",
      children: [],
    };
    units.forEach((unit) => {
      const unitColumn = {
        title: unit,
        children: [],
      };
      years.forEach((year) => {
        const yearColumn = {
          title: `${year}`,
          children: [
            {
              title: "借方",
              dataIndex: `startMoneyBrrow${year}${unit}`,
              key: `startMoneyBrrow${year}${unit}`,
              width: 150,
            },
            {
              title: "贷方",
              dataIndex: `startMoneyGet${year}${unit}`,
              key: `startMoneyGet${year}${unit}`,
              width: 150,
            },
          ],
        };
        unitColumn.children.push(yearColumn);
      });
      startMoneyColumn.children.push(unitColumn);
    });
    columns.push(startMoneyColumn);

    // 累计发生额列
    const allMoneyColumn = {
      title: "累计发生额",
      children: [],
    };
    units.forEach((unit) => {
      const unitColumn = {
        title: unit,
        children: [],
      };
      years.forEach((year) => {
        const yearColumn = {
          title: `${year}`,
          children: [
            {
              title: "借方",
              dataIndex: `allMoneyBrrow${year}${unit}`,
              key: `allMoneyBrrow${year}${unit}`,
              width: 150,
            },
            {
              title: "贷方",
              dataIndex: `allMoneyGet${year}${unit}`,
              key: `allMoneyGet${year}${unit}`,
              width: 150,
            },
          ],
        };
        unitColumn.children.push(yearColumn);
      });
      allMoneyColumn.children.push(unitColumn);
    });
    columns.push(allMoneyColumn);

    // 期末余额列
    const endMoneyColumn = {
      title: "期末余额",
      children: [],
    };
    units.forEach((unit) => {
      const unitColumn = {
        title: unit,
        children: [],
      };
      years.forEach((year) => {
        const yearColumn = {
          title: `${year}`,
          children: [
            {
              title: "借方",
              dataIndex: `endMoneyBrrow${year}${unit}`,
              key: `endMoneyBrrow${year}${unit}`,
              width: 150,
            },
            {
              title: "贷方",
              dataIndex: `endMoneyGet${year}${unit}`,
              key: `endMoneyGet${year}${unit}`,
              width: 150,
            },
          ],
        };
        unitColumn.children.push(yearColumn);
      });
      endMoneyColumn.children.push(unitColumn);
    });
    columns.push(endMoneyColumn);

    // Create data structure
    inputData.forEach((item) => {
      const dataItem = {
        key: item.key,
        parentKey: item.parent_key,
        project: item.key + "--" + item.project,
      };

      units.forEach((unit) => {
        years.forEach((year) => {
          if (item.unit_name === unit && item.acct_year === year) {
            dataItem[`startMoneyBrrow${year}${unit}`] =
              item.startMoneyBrrow_data;
            dataItem[`startMoneyGet${year}${unit}`] = item.startMoneyGet_data;
            dataItem[`allMoneyBrrow${year}${unit}`] = item.allMoneyBrrow_data;
            dataItem[`allMoneyGet${year}${unit}`] = item.allMoneyGet_data;
            dataItem[`endMoneyBrrow${year}${unit}`] = item.endMoneyBrrow_data;
            dataItem[`endMoneyGet${year}${unit}`] = item.endMoneyGet_data;
          }
        });
      });

      data.push(dataItem);
    });

    // convert data structure to tree
    function arrayToTree(arr) {
      const map = {};
      const roots = [];

      // First pass: create a map of nodes keyed by their `key`
      arr.forEach((node) => {
        if (!map[node.key]) {
          map[node.key] = { ...node };
        } else {
          // Handle duplicate key: merge or add to children
          Object.assign(map[node.key], node); // Merge properties if needed
        }
      });

      // Second pass: connect nodes to their parent
      arr.forEach((node) => {
        if (node.parentKey !== "") {
          const parentNode = map[node.parentKey];
          if (parentNode) {
            if (!parentNode.children) {
              parentNode.children = [];
            }
            if (!parentNode.children.find((item) => item.key === node.key)) {
              parentNode.children.push(map[node.key]);
            }
          } else {
            // Handle case where parentKey is not found (optional)
            console.error(
              `Parent node ${node.parentKey} not found for node ${node.key}`
            );
          }
        } else {
          if (!roots.find((item) => item.key === node.key)) {
            roots.push(map[node.key]); // Root nodes have an empty parentKey
          }
        }
      });

      return roots;
    }

    return { columns, data: arrayToTree(data) };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getCompareDataByYear res: ", JSON.stringify(res));
  return res;
}

//------综合查询tab
//获取综合查询 会计期间定义表数据
export async function getAccPeriodData(req) {
  console.log("getAccPeriodData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) as total FROM CAS_DWD_FUS_SJ_CW_ACCT_RANGE_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}']",
    sqlParameter: req,
  };
  console.log("getAccPeriodData dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log("getAccPeriodData dacpTotalReq: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, acct_month as fiscalMonth, unit_code as organizationCode, unit_name as organizationName, acct_ebk_num as accountingNumber, acct_ebk_name as accountingName, start_date as startTime, end_date as endTime, bdp_audit as bdpaudit FROM CAS_DWD_FUS_SJ_CW_ACCT_RANGE_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };
  console.log(
    "getAccPeriodData dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getAccPeriodData dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );
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
  console.log("getAccPeriodData res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计期间定义表格数据   表格排序字段
export async function getAccPeriodSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
        type: "string",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
        type: "string",
      },
      { label: "会计年度", value: "fiscalYear", type: "string" },
      { label: "会计月份", value: "fiscalMonth", type: "string" },
      { label: "单位代码", value: "organizationCode", type: "string" },
      { label: "单位名称", value: "organizationName", type: "string" },
      { label: "会计电子账簿编号", value: "accountingNumber", type: "string" },
      { label: "会计电子账簿名称", value: "accountingName", type: "string" },
      { label: "开始日期", value: "startTime", type: "string" },
      { label: "截止日期", value: "endTime", type: "string" },
      { label: "BDP_AUDIT", value: "bdpaudit", type: "string" },
    ],
  };
  console.log("getAccPeriodSort res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计期间定义 月份下拉框选项
export async function getAccPeriodMonth(req) {
  // 打印视图层的入参请求
  console.log("getAccPeriodMonth req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT DISTINCT acct_month as label, acct_month as value FROM CAS_DWD_FUS_SJ_CW_ACCT_RANGE_I_Y ORDER BY cast(acct_month as unsigned) asc;",
    sqlParameter: req,
  };
  console.log("getAccPeriodMonth dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccPeriodMonth dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccPeriodMonth res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计期间定义 年份下拉框选项
export async function getAccPeriodYear(req) {
  // 打印视图层的入参请求
  console.log("getAccPeriodYear req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_ACCT_RANGE_I_Y ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getAccPeriodYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccPeriodYear dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccPeriodYear res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计期间定义 行政区划名称下拉框选项
export async function getAccPeriodDivision(req) {
  // 打印视图层的入参请求
  console.log("getAccPeriodDivision req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name as label, adm_div_name as value FROM CAS_DWD_FUS_SJ_CW_ACCT_RANGE_I_Y ORDER BY adm_div_code asc;",
    sqlParameter: req,
  };
  console.log("getAccPeriodDivision dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccPeriodDivision dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccPeriodDivision res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计期间定义 单位名称 输入下拉框选项
export async function getAccPeriodUnitName(req) {
  // 打印视图层的入参请求
  console.log("getAccPeriodUnitName req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT budget_unit_name as label, budget_unit_code as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1=1 @[AND budget_unit_name LIKE '%${param.inputData}%'] ORDER BY budget_unit_code ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getAccPeriodUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccPeriodUnitName dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccPeriodUnitName res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计期间定义 电子账簿名称 输入下拉框选项
export async function getAccPeriodLedgerName(req) {
  // 打印视图层的入参请求
  console.log("getAccPeriodLedgerName req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name as label, acct_ebk_name as value FROM CAS_DWD_FUS_SJ_CW_ACCT_RANGE_I_Y WHERE 1=1 @[AND acct_ebk_name like '%${param.inputData}%'] ORDER BY acct_ebk_num asc LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getAccPeriodLedgerName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccPeriodLedgerName dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccPeriodLedgerName res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计科目表数据
export async function getAccSubData(req) {
  console.log("getAccSubData req: ", JSON.stringify(req));

  // 科目编码操作符转换
  const kmbm = transformKMBM({operator: req.operator, rightValue: req.rightValue});

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) as total FROM CAS_DWD_FUS_SJ_CW_ACCT_SUBJ_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND acct_system = '${param.acctSystem}'] @[AND acct_subj_code ${param.operator} '${param.rightValue}'] @[AND acct_subj_name = '${param.acctSubjName}'];",
    sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log("getAccSubData dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log("getAccSubData dacpTotalReq: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, unit_code as organizationCode, unit_name as organizationName, acct_ebk_num as electronicLedgerNumber, acct_ebk_name as electronicLedgerName, acct_system as accountingSystem, acct_subj_code as subjectCode, acct_subj_name as subjectName, full_subj_name as fullSubjectName, acct_subj_level as accountingSubjectLevel, aux_acct_flag as auxiliaryAccountingFlag, aux_acct_item as auxiliaryAccountingItem, subj_cat_code as subjectCategoryNumber, subj_cat_name as subjectCategoryName, meas_unit_code as measurementUnitCode, bal_direction as balanceDirection, sup_subj_code as parentSubjectCode, is_lowest_lvl_subj as isLowestLevelSubject, is_cash_eqv as isCashOrCashEquivalent, bdp_audit as bdpAudit FROM CAS_DWD_FUS_SJ_CW_ACCT_SUBJ_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND acct_system = '${param.acctSystem}'] @[AND acct_subj_code ${param.operator} '${param.rightValue}'] @[AND acct_subj_name = '${param.acctSubjName}'] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset}",
    sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log("getAccSubData dacpDetailReq: ", JSON.stringify(dacpDetailReq));
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log("getAccSubData dacpDetailRes: ", JSON.stringify(dacpDetailRes));
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
  console.log("getAccSubData res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计科目表格数据   表格排序字段
export async function getAccSubSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "单位名称", value: "organizationName", type: "string" },
      { label: "会计年度", value: "fiscalYear", type: "string" },
      { label: "科目编码", value: "subjectCode", type: "string" },
      { label: "科目名称", value: "subjectName", type: "string" },
      { label: "科目全称", value: "fullSubjectName", type: "string" },
      {
        label: "会计科目级次",
        value: "accountingSubjectLevel",
        type: "string",
      },
      { label: "余额方向", value: "balanceDirection", type: "string" },
      { label: "上级科目编码", value: "parentSubjectCode", type: "string" },
      {
        label: "是否最底级科目",
        value: "isLowestLevelSubject",
        type: "string",
      },
      { label: "会计体系", value: "accountingSystem", type: "string" },
      {
        label: "电子账簿编号",
        value: "electronicLedgerNumber",
        type: "string",
      },
      { label: "电子账簿名称", value: "electronicLedgerName", type: "string" },
      {
        label: "辅助核算标志",
        value: "auxiliaryAccountingFlag",
        type: "string",
      },
      { label: "辅助核算项", value: "auxiliaryAccountingItem", type: "string" },
      { label: "科目类别编号", value: "subjectCategoryNumber", type: "string" },
      { label: "科目类别名称", value: "subjectCategoryName", type: "string" },
      { label: "计量单位代码", value: "measurementUnitCode", type: "string" },
      {
        label: "是否现金或现金等价物",
        value: "isCashOrCashEquivalent",
        type: "string",
      },
      { label: "单位代码", value: "organizationCode", type: "string" },
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
        type: "string",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
        type: "string",
      },
      { label: "BDP_AUDIT", value: "bdpAudit", type: "string" },
    ],
  };
  console.log("getAccPeriodSort res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计科目表 年份下拉框选项
export async function getChartAccountYear(req) {
  // 打印视图层的入参请求
  console.log("getChartAccountYear req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_ACCT_SUBJ_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getChartAccountYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getChartAccountYear dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getChartAccountYear res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计科目表 行政区划名称下拉框选项
export async function getChartAccountDivision(req) {
  // 打印视图层的入参请求
  console.log("getChartAccountDivision req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name as label, adm_div_name as value FROM CAS_DWD_FUS_SJ_CW_ACCT_SUBJ_I_Y ORDER BY adm_div_name asc;",
    sqlParameter: req,
  };
  console.log("getChartAccountDivision dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getChartAccountDivision dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getChartAccountDivision res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计科目表 会计体系下拉框选项
export async function getChartAccountSystem(req) {
  // 打印视图层的入参请求
  console.log("getChartAccountSystem req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_system as label, acct_system as value FROM CAS_DWD_FUS_SJ_CW_ACCT_SUBJ_I_Y ORDER BY acct_system asc;",
    sqlParameter: req,
  };
  console.log("getChartAccountSystem dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getChartAccountSystem dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getChartAccountSystem res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计科目表 行政区划名称下拉框选项
export async function getChartAccountSubjectName(req) {
  // 打印视图层的入参请求
  console.log("getChartAccountSubjectName req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT trim(acct_subj_name) as label, trim(acct_subj_name) as value FROM CAS_DWD_FUS_SJ_CW_ACCT_SUBJ_I_Y WHERE 1=1 @[AND trim(acct_subj_name) like '%${param.inputData}%'] limit 50;",
    sqlParameter: req,
  };
  console.log("getChartAccountSubjectName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getChartAccountSubjectName dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getChartAccountSubjectName res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计科目表 单位名称 输入下拉框选项
export async function getChartAccountUnitName(req) {
  // 打印视图层的入参请求
  console.log("getChartAccountUnitName req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT distinct unit_name as label, unit_name as value FROM CAS_DWD_FUS_SJ_CW_ACCT_SUBJ_I_Y WHERE 1=1 @[AND unit_name like '%${param.inputData}%'] limit 50;",
    sqlParameter: req,
  };
  console.log("getChartAccountUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getChartAccountUnitName dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getChartAccountUnitName res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 会计期间定义 电子账簿名称 输入下拉框选项
export async function getChartAccountLedgerName(req) {
  // 打印视图层的入参请求
  console.log("getChartAccountLedgerName req: ", JSON.stringify(req));

  // 调用后端dacp接口
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name as label, acct_ebk_name as value FROM CAS_DWD_FUS_SJ_CW_ACCT_SUBJ_I_Y WHERE 1=1 @[AND acct_ebk_name like '%${param.inputData}%'];",
    sqlParameter: req,
  };
  console.log("getChartAccountLedgerName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getChartAccountLedgerName dacpRes: ", JSON.stringify(dacpRes));
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
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getChartAccountLedgerName res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 科目年初表数据
export async function getBegYrSubData(req) {
  console.log("getBegYrSubData req: ", JSON.stringify(req));

  // 科目编码操作符转换
  const kmbm = transformKMBM({operator: req.operator, rightValue: req.rightValue});

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) AS total FROM CAS_DWD_FUS_SJ_CW_SUBJ_BOY_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND acct_system = '${param.acctSystem}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND acct_subj_code ${param.operator} '${param.rightValue}'] @[AND acct_subj_name = '${param.acctSubjName}']",
      sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log("getBegYrSubData dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log("getBegYrSubData dacpTotalReq: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code AS administrativeDivisionCode, adm_div_name AS administrativeDivisionName, acct_year AS fiscalYear, unit_code AS organizationCode, unit_name AS organizationName, acct_ebk_num AS accountingElectronicLedgerNumber, acct_ebk_name AS accountingElectronicLedgerName, acct_month AS fiscalMonth, acct_system AS accountingSystem, acct_subj_code AS subjectCode, acct_subj_name AS subjectName, full_subj_name AS fullSubjectName, acct_subj_level AS accountingSubjectLevel, is_lowest_lvl_subj AS isLowestLevelSubject, sup_subj_code AS parentSubjectCode, is_cash_eq AS isCashOrCashEquivalent, curr_name AS currencyName, bal_direction AS balanceDirection, FORMAT(lc_open_bal, 2) AS localCurrencyBeginningBalance, FORMAT(lc_open_debit_bal, 2) AS localCurrencyBeginningDebitBalance, FORMAT(lc_open_credit_bal, 2) AS localCurrencyBeginningCreditBalance, FORMAT(open_qty, 2) AS beginningQuantity, FORMAT(fc_open_bal, 2) AS foreignCurrencyBeginningBalance, bdp_audit AS bdpAudit FROM CAS_DWD_FUS_SJ_CW_SUBJ_BOY_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND acct_system = '${param.acctSystem}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND acct_subj_code ${param.operator} '${param.rightValue}'] @[AND acct_subj_name = '${param.acctSubjName}'] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
      sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log("getBegYrSubData dacpDetailReq: ", JSON.stringify(dacpDetailReq));
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log("getBegYrSubData dacpDetailRes: ", JSON.stringify(dacpDetailRes));
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
  console.log("getBegYrSubData res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 科目年初数表格数据  表格排序字段
export async function getBegYrSubSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "单位名称", value: "organizationName", type: "string" },
      { label: "会计年度", value: "fiscalYear", type: "string" },
      { label: "会计月份", value: "fiscalMonth", type: "string" },
      { label: "科目编码", value: "subjectCode", type: "string" },
      { label: "科目名称", value: "subjectName", type: "string" },
      { label: "科目全称", value: "fullSubjectName", type: "string" },
      {
        label: "本币期初余额",
        value: "localCurrencyBeginningBalance",
        type: "string",
      },
      {
        label: "本币期初借方余额",
        value: "localCurrencyBeginningDebitBalance",
        type: "string",
      },
      {
        label: "本币期初贷方余额",
        value: "localCurrencyBeginningCreditBalance",
        type: "string",
      },
      { label: "期初数量", value: "beginningQuantity", type: "string" },
      {
        label: "外币期初余额",
        value: "foreignCurrencyBeginningBalance",
        type: "string",
      },
      { label: "余额方向", value: "balanceDirection", type: "string" },
      { label: "币种名称", value: "currencyName", type: "string" },
      {
        label: "会计科目级次",
        value: "accountingSubjectLevel",
        type: "string",
      },
      { label: "上级科目编码", value: "parentSubjectCode", type: "string" },
      {
        label: "是否最底级科目",
        value: "isLowestLevelSubject",
        type: "string",
      },
      { label: "会计体系", value: "accountingSystem", type: "string" },
      {
        label: "会计电子账簿编号",
        value: "electronicLedgerNumber",
        type: "string",
      },
      {
        label: "会计电子账簿名称",
        value: "electronicLedgerName",
        type: "string",
      },
      { label: "单位代码", value: "organizationCode", type: "string" },
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
        type: "string",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
        type: "string",
      },
      { label: "BDP_AUDIT", value: "bdpAudit", type: "string" },
      {
        label: "是否现金或现金等价物",
        value: "isCashOrCashEquivalent",
        type: "string",
      },
    ],
  };
  console.log("getBegYrSubSort res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目年初数表格数 年份下拉框选项
export async function getBegYrSubYear(req) {
  console.log("getBegYrSubYear req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BOY_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getBegYrSubYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrSubYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrSubYear res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目年初数表格数 月份下拉框选项
export async function getBegYrSubMonth(req) {
  console.log("getBegYrSubMonth req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT DISTINCT acct_month as label, acct_month as value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BOY_I_Y ORDER BY cast(acct_month as unsigned) asc;",
    sqlParameter: req,
  };
  console.log("getBegYrSubMonth dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrSubMonth dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrSubMonth res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目年初数表格数 行政区划名称下拉框选项
export async function getBegYrSubDivision(req) {
  console.log("getBegYrSubDivision req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name as label, adm_div_name as value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BOY_I_Y ORDER BY adm_div_name asc;",
    sqlParameter: req,
  };
  console.log("getBegYrSubDivision dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrSubDivision dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrSubDivision res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目年初数表格数 单位名称下拉框选项
export async function getBegYrSubUnitName(req) {
  console.log("getBegYrSubUnitName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT budget_unit_name as label, budget_unit_name as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1=1 @[AND budget_unit_name LIKE '%${param.inputData}%'] ORDER BY budget_unit_code ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getBegYrSubUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrSubUnitName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrSubUnitName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目年初数表格数 会计体系下拉框选项
export async function getBegYrSubSystem(req) {
  console.log("getBegYrSubSystem req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_system AS label, acct_system AS value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BOY_I_Y ORDER BY acct_system ASC;",
    sqlParameter: req,
  };
  console.log("getBegYrSubSystem dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrSubSystem dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrSubSystem res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目年初数表格数 科目名称下拉框选项
export async function getBegYrSubSubjectName(req) {
  console.log("getBegYrSubSubjectName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT trim(acct_subj_name) AS label, trim(acct_subj_name) AS value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BOY_I_Y WHERE 1 = 1 @[AND trim(acct_subj_name) LIKE '%${param.inputData}%'] LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getBegYrSubSubjectName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrSubSubjectName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrSubSubjectName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目年初数表格数 电子账簿名称下拉框选项
export async function getBegYrSubLedgerName(req) {
  console.log("getBegYrSubLedgerName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name AS label, acct_ebk_name AS value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BOY_I_Y WHERE 1 = 1 @[AND acct_ebk_name LIKE '%${param.inputData}%'];",
    sqlParameter: req,
  };
  console.log("getBegYrSubLedgerName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrSubLedgerName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrSubLedgerName res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 科目余额表数据
export async function getSubBalData(req) {
  console.log("getSubBalData req: ", JSON.stringify(req));

  // 科目编码操作符转换
  const kmbm = transformKMBM({operator: req.operator, rightValue: req.rightValue});

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) AS total FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND acct_system = '${param.acctSystem}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND acct_subj_code ${param.operator} '${param.rightValue}'] @[AND acct_subj_name = '${param.acctSubjName}']",
    sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log("getSubBalData dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log("getSubBalData dacpTotalReq: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, unit_code as organizationCode, unit_name as organizationName, acct_ebk_num as electronicLedgerNumber, acct_ebk_name as electronicLedgerName, acct_month as fiscalMonth, acct_system as accountingSystem, acct_subj_code as subjectCode, acct_subj_name as subjectName, full_subj_name as fullSubjectName, FORMAT(debit_balance_begin_year, 2) as beginningBalanceAtYearStart, FORMAT(credit_balance_begin_year, 2) as creditBalanceAtYearStart, FORMAT(balance_direction_begin_year, 2) as balanceDirectionAtYearStart, FORMAT(open_debit_bal, 2) as debitBalanceAtBeginning, FORMAT(open_credit_bal, 2) as creditBalanceAtBeginning, FORMAT(open_bal_direction, 2) as balanceDirectionAtBeginning, FORMAT(fc_debit_bal_begin_year, 2) as foreignCurrencyDebitBalanceAtYearStart, FORMAT(fc_credit_bal_begin_year, 2) as foreignCurrencyCreditBalanceAtYearStart, FORMAT(fc_open_debit_bal, 2) as foreignCurrencyDebitBalanceAtBeginning, FORMAT(fc_open_credit_bal, 2) as foreignCurrencyCreditBalanceAtBeginning, FORMAT(debit_amount, 2) as debitOccurrenceAmount, FORMAT(acc_debit_amount, 2) as cumulativeDebitOccurrenceAmount, FORMAT(fc_debit_amount, 2) as foreignCurrencyDebitOccurrenceAmount, FORMAT(acc_fc_debit_amount, 2) as cumulativeForeignCurrencyDebitOccurrenceAmount, FORMAT(credit_amount, 2) as creditOccurrenceAmount, FORMAT(acc_credit_amount, 2) as cumulativeCreditOccurrenceAmount, FORMAT(fc_credit_amount, 2) as foreignCurrencyCreditOccurrenceAmount, FORMAT(acc_fc_credit_amount, 2) as cumulativeForeignCurrencyCreditOccurrenceAmount, FORMAT(end_debit_bal, 2) as debitBalanceAtEnd, FORMAT(end_credit_bal, 2) as creditBalanceAtEnd, FORMAT(end_bal_direction, 2) as balanceDirectionAtEnd, FORMAT(fc_end_debit_bal, 2) as foreignCurrencyDebitBalanceAtEnd, FORMAT(fc_end_credit_bal, 2) as foreignCurrencyCreditBalanceAtEnd, entry_number as entryCount, acct_subj_level as accountingSubjectLevel, is_lowest_level_subj as isLowestLevelSubject, superior_subj_code as parentSubjectCode, is_cash_eq as isCashOrCashEquivalent, curr_name as currencyName, curr_code as currencyCode FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND acct_system = '${param.acctSystem}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND acct_subj_code ${param.operator} '${param.rightValue}'] @[AND acct_subj_name = '${param.acctSubjName}'] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log("getSubBalData dacpDetailReq: ", JSON.stringify(dacpDetailReq));
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log("getSubBalData dacpDetailRes: ", JSON.stringify(dacpDetailRes));
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
  console.log("getSubBalData res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 科目余额表格数据    表格排序字段
export async function getSubBalSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
        type: "string",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
        type: "string",
      },
      { label: "会计年度", value: "fiscalYear", type: "string" },
      { label: "单位代码", value: "organizationCode", type: "string" },
      { label: "单位名称", value: "organizationName", type: "string" },
      {
        label: "电子账簿编号",
        value: "electronicLedgerNumber",
        type: "string",
      },
      { label: "电子账簿名称", value: "electronicLedgerName", type: "string" },
      { label: "会计体系", value: "accountingSystem", type: "string" },
      { label: "会计月份", value: "fiscalMonth", type: "string" },
      { label: "科目编码", value: "subjectCode", type: "string" },
      { label: "科目名称", value: "subjectName", type: "string" },
      { label: "科目全称", value: "fullSubjectName", type: "string" },
      {
        label: "年初借方余额",
        value: "beginningDebitBalanceAtYearStart",
        type: "string",
      },
      {
        label: "年初贷方余额",
        value: "creditBalanceAtYearStart",
        type: "string",
      },
      {
        label: "年初余额方向",
        value: "balanceDirectionAtYearStart",
        type: "string",
      },
      {
        label: "期初借方余额",
        value: "debitBalanceAtBeginning",
        type: "string",
      },
      {
        label: "期初贷方余额",
        value: "creditBalanceAtBeginning",
        type: "string",
      },
      {
        label: "期初余额方向",
        value: "balanceDirectionAtBeginning",
        type: "string",
      },
      {
        label: "外币年初借方余额",
        value: "foreignDebitBalanceAtYearStart",
        type: "string",
      },
      {
        label: "外币年初贷方余额",
        value: "foreignCreditBalanceAtYearStart",
        type: "string",
      },
      {
        label: "外币期初借方余额",
        value: "foreignDebitBalanceAtBeginning",
        type: "string",
      },
      {
        label: "外币期初贷方余额",
        value: "foreignCreditBalanceAtBeginning",
        type: "string",
      },
      { label: "借方发生额", value: "debitOccurrenceAmount", type: "string" },
      {
        label: "借方累计发生额",
        value: "cumulativeDebitOccurrenceAmount",
        type: "string",
      },
      {
        label: "外币借方发生额",
        value: "foreignCurrencyDebitOccurrenceAmount",
        type: "string",
      },
      {
        label: "外币借方累计发生额",
        value: "cumulativeForeignDebitOccurrenceAmount",
        type: "string",
      },
      { label: "贷方发生额", value: "creditOccurrenceAmount", type: "string" },
      {
        label: "贷方累计发生额",
        value: "cumulativeCreditOccurrenceAmount",
        type: "string",
      },
      {
        label: "外币贷方发生额",
        value: "foreignCurrencyCreditOccurrenceAmount",
        type: "string",
      },
      {
        label: "外币贷方累计发生额",
        value: "cumulativeForeignCreditOccurrenceAmount",
        type: "string",
      },
      { label: "期末借方余额", value: "debitBalanceAtEnd", type: "string" },
      { label: "期末贷方余额", value: "creditBalanceAtEnd", type: "string" },
      { label: "期末余额方向", value: "balanceDirectionAtEnd", type: "string" },
      {
        label: "外币期末借方余额",
        value: "foreignDebitBalanceAtEnd",
        type: "string",
      },
      {
        label: "外币期末贷方余额",
        value: "foreignCreditBalanceAtEnd",
        type: "string",
      },
      { label: "分录数", value: "entryCount", type: "string" },
      {
        label: "会计科目级别",
        value: "accountingSubjectLevel",
        type: "string",
      },
      {
        label: "是否最底级科目",
        value: "isLowestLevelSubject",
        type: "string",
      },
      { label: "上级科目编码", value: "parentSubjectCode", type: "string" },
      {
        label: "是否现金或现金等价物",
        value: "isCashOrCashEquivalent",
        type: "string",
      },
      { label: "币种名称", value: "currencyName", type: "string" },
      { label: "币种代码", value: "currencyCode", type: "string" },
    ],
  };
  console.log("getSubBalSort res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目余额表格 年份下拉框选项
export async function getSubBalYear(req) {
  console.log("getSubBalYear req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getSubBalYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSubBalYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSubBalYear res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目余额表格 月份下拉框选项
export async function getSubBalMonth(req) {
  console.log("getSubBalMonth req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT DISTINCT acct_month as label, acct_month as value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y ORDER BY cast(acct_month as unsigned) asc;",
    sqlParameter: req,
  };
  console.log("getSubBalMonth dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSubBalMonth dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSubBalMonth res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目余额表格 行政区划名称下拉框选项
export async function getSubBalDivision(req) {
  console.log("getSubBalDivision req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name as label, adm_div_name as value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y ORDER BY adm_div_name asc;",
    sqlParameter: req,
  };
  console.log("getSubBalDivision dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSubBalDivision dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSubBalDivision res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目余额表格 单位名称下拉框选项
export async function getSubBalUnitName(req) {
  console.log("getSubBalUnitName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT budget_unit_name as label, budget_unit_name as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1=1 @[AND budget_unit_name LIKE '%${param.inputData}%'] ORDER BY budget_unit_code ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getSubBalUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSubBalUnitName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSubBalUnitName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目余额表格 会计体系下拉框选项
export async function getSubBalSystem(req) {
  console.log("getSubBalSystem req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_system AS label, acct_system AS value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y ORDER BY acct_system ASC;",
    sqlParameter: req,
  };
  console.log("getSubBalSystem dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSubBalSystem dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSubBalSystem res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目余额表格 科目名称下拉框选项
export async function getSubBalSubjectName(req) {
  console.log("getSubBalSubjectName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT trim(acct_subj_name) AS label, trim(acct_subj_name) AS value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y WHERE 1 = 1 @[AND trim(acct_subj_name) LIKE '%${param.inputData}%'] LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getSubBalSubjectName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSubBalSubjectName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSubBalSubjectName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 科目余额表格 电子账簿名称下拉框选项
export async function getSubBalLedgerName(req) {
  console.log("getSubBalLedgerName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name AS label, acct_ebk_name AS value FROM CAS_DWD_FUS_SJ_CW_SUBJ_BALANCE_I_Y WHERE 1 = 1 @[AND acct_ebk_name LIKE '%${param.inputData}%'];",
    sqlParameter: req,
  };
  console.log("getSubBalLedgerName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getSubBalLedgerName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getSubBalLedgerName res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 记账凭证表数据
export async function getAccVoucherData(req) {
  console.log("getAccVoucherData req: ", JSON.stringify(req));

  // 科目编码操作符转换
  const kmbm = transformKMBM({operator: req.operator, rightValue: req.rightValue});

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) as total FROM CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y WHERE 1 = 1 @[AND unit_name = '${param.unitName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND acct_subj_name = '${param.acctSubjName}'] @[AND acct_subj_code ${param.operator} '${param.rightValue}'] @[AND acct_system = '${param.acctSystem}'] @[AND acct_voucher_summary like '%${param.acctVoucherSummary}%'] @[AND voucher_date = '${param.voucherDate}'] @[AND acct_ebk_name = '${param.acctEbkName}']",
    sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log("getAccVoucherData dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log("getAccVoucherData dacpTotalRes: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, unit_code as organizationCode, unit_name as organizationName, acct_ebk_num as electronicLedgerNumber, acct_ebk_name as electronicLedgerName, acct_system as accountingSystem, acct_month as fiscalMonth, voucher_date as voucherDate, acct_type_num as voucherTypeDate, acct_type_name as voucherType, acct_voucher_type, acct_voucher_num as voucherNumber, acct_voucher_line_num, entry_seq_num as entrySequenceNumber, acct_voucher_summary as accountingSummary, acct_subj_code as subjectCode, acct_subj_name as subjectName, full_subj_name as fullSubjectName, FORMAT(debit_amount, 2) as debitOccurrenceAmount, FORMAT(credit_amount, 2) as creditOccurrenceAmount, counterpart_subj_code as counterpartySubjectCode, counterpart_subj_name as counterpartySubjectName, curr as currency, FORMAT(debit_fc_amount, 2) as foreignCurrencyDebitOccurrenceAmount, FORMAT(credit_fc_amount, 2) as foreignCurrencyCreditOccurrenceAmount, FORMAT(exchange_rate, 2) as exchangeRate, FORMAT(quantity, 2) as quantity, FORMAT(unit_price, 2) as unitPrice, settlement_method as settlementMethod, attachment_num as attachmentCount, preparer as preparer, reviewer as reviewer, acct_personnel as accountant, cashier as cashier, financial_supervisor as financialSupervisor, source_voucher_num as sourceVoucherNumber, acct_flag as accountingFlag, void_flag as cancellationFlag, is_carried_forward as isCarryForward, is_budget_account as isBudgetAccount, payment_doc_num as paymentDocumentNumber, func_subj_code as functionalSubjectCode, func_subj_name as functionalSubjectName, eco_subj_code as economicSubjectCode, eco_subj_name as economicSubjectName, fund_nature_code as fundNatureCode, fund_nature_name as fundNatureName, indicator_src_code as sourceOfIndicatorCode, indicator_src_name as sourceOfIndicatorName, exp_type_code as supportTypeCode, exp_type_name as expenditureTypeName, budget_mgmt_type_code as budgetManagementTypeCode, budget_mgmt_type_name as budgetManagementTypeName, payment_method_code as paymentMethodCode, payment_method_name as paymentMethodName, budget_proj_code as budgetProjectCode, budget_proj_name as budgetProjectName, proj_category_code as projectCategoryCode, proj_category_name as projectCategoryName, indicator_doc_num_name as indicatorDocumentName, settlement_method_code as settlementMethodCode, settlement_method_name as settlementMethodName FROM CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y WHERE 1 = 1 @[AND unit_name = '${param.unitName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND acct_subj_name = '${param.acctSubjName}'] @[AND acct_subj_code ${param.operator} '${param.rightValue}'] @[AND acct_system = '${param.acctSystem}'] @[AND acct_voucher_summary like '%${param.acctVoucherSummary}%'] @[AND voucher_date = '${param.voucherDate}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log(
    "getAccVoucherData dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getAccVoucherData dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );
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
  console.log("getAccVoucherData res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 记账凭证表格数据   表格排序字段
export async function getAccVoucherSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
      },
      {
        label: "会计年度",
        value: "fiscalYear",
      },
      {
        label: "单位代码",
        value: "organizationCode",
      },
      {
        label: "单位名称",
        value: "organizationName",
      },
      {
        label: "电子账簿编号",
        value: "electronicLedgerNumber",
      },
      {
        label: "电子账簿名称",
        value: "electronicLedgerName",
      },
      {
        label: "会计体系",
        value: "accountingSystem",
      },
      {
        label: "会计月份",
        value: "fiscalMonth",
      },
      {
        label: "记账凭证日期",
        value: "voucherDate",
      },
      {
        label: "记账类型日期",
        value: "voucherTypeDate",
      },
      {
        label: "记账凭证种类",
        value: "voucherType",
      },
      {
        label: "记账凭证编号",
        value: "voucherNumber",
      },
      {
        label: "分录序号",
        value: "entrySequenceNumber",
      },
      {
        label: "记账凭证摘要",
        value: "accountingSummary",
      },
      {
        label: "科目编码",
        value: "subjectCode",
      },
      {
        label: "科目名称",
        value: "subjectName",
      },
      {
        label: "科目全称",
        value: "fullSubjectName",
      },
      {
        label: "借方发生额",
        value: "debitOccurrenceAmount",
      },
      {
        label: "贷方发生额",
        value: "creditOccurrenceAmount",
      },
      {
        label: "对方科目编码",
        value: "counterpartySubjectCode",
      },
      {
        label: "对方科目名称",
        value: "counterpartySubjectName",
      },
      {
        label: "币种",
        value: "currency",
      },
      {
        label: "借方外币发生额",
        value: "foreignCurrencyDebitOccurrenceAmount",
      },
      {
        label: "贷方外币发生额",
        value: "foreignCurrencyCreditOccurrenceAmount",
      },
      {
        label: "汇率",
        value: "exchangeRate",
      },
      {
        label: "数量",
        value: "quantity",
      },
      {
        label: "单价",
        value: "unitPrice",
      },
      {
        label: "结算方式",
        value: "settlementMethod",
      },
      {
        label: "附件数",
        value: "attachmentCount",
      },
      {
        label: "制单人员",
        value: "preparer",
      },
      {
        label: "复核人员",
        value: "reviewer",
      },
      {
        label: "记账人员",
        value: "accountant",
      },
      {
        label: "出纳人员",
        value: "cashier",
      },
      {
        label: "财务主管",
        value: "financialSupervisor",
      },
      {
        label: "源凭证号",
        value: "sourceVoucherNumber",
      },
      {
        label: "记账标志",
        value: "accountingFlag",
      },
      {
        label: "作废标志",
        value: "cancellationFlag",
      },
      {
        label: "是否结转",
        value: "isCarryForward",
      },
      {
        label: "是否为预算账",
        value: "isBudgetAccount",
      },
      {
        label: "支付单据编号",
        value: "paymentDocumentNumber",
      },
      {
        label: "功能科目代码",
        value: "functionalSubjectCode",
      },
      {
        label: "功能科目名称",
        value: "functionalSubjectName",
      },
      {
        label: "经济科目代码",
        value: "economicSubjectCode",
      },
      {
        label: "经济科目名称",
        value: "economicSubjectName",
      },
      {
        label: "资金性质代码",
        value: "fundNatureCode",
      },
      {
        label: "资金性质名称",
        value: "fundNatureName",
      },
      {
        label: "指标来源码",
        value: "sourceOfIndicatorCode",
      },
      {
        label: "指标来源名称",
        value: "sourceOfIndicatorName",
      },
      {
        label: "支持类型码",
        value: "supportTypeCode",
      },
      {
        label: "支出类型名称",
        value: "expenditureTypeName",
      },
      {
        label: "预算管理类型代码",
        value: "budgetManagementTypeCode",
      },
      {
        label: "预算管理类型名称",
        value: "budgetManagementTypeName",
      },
      {
        label: "支付方式代码",
        value: "paymentMethodCode",
      },
      {
        label: "支付方式名称",
        value: "paymentMethodName",
      },
      {
        label: "预算项目代码",
        value: "budgetProjectCode",
      },
      {
        label: "预算项目名称",
        value: "budgetProjectName",
      },
      {
        label: "项目分类代码",
        value: "projectCategoryCode",
      },
      {
        label: "项目分类名称",
        value: "projectCategoryName",
      },
      {
        label: "指标文号名称",
        value: "indicatorDocumentName",
      },
      {
        label: "结算方式代码",
        value: "settlementMethodCode",
      },
      {
        label: "结算方式名称",
        value: "settlementMethodName",
      },
    ],
  };
  console.log("getAccVoucherSort res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 记账凭证表 年份下拉框选项
export async function getAccVoucherYear(req) {
  console.log("getAccVoucherYear req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getAccVoucherYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccVoucherYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccVoucherYear res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 记账凭证表 月份下拉框选项
export async function getAccVoucherMonth(req) {
  console.log("getAccVoucherMonth req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT DISTINCT acct_month as label, acct_month as value FROM CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y ORDER BY cast(acct_month as unsigned) asc;",
    sqlParameter: req,
  };
  console.log("getAccVoucherMonth dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccVoucherMonth dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccVoucherMonth res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 记账凭证表 单位名称输入下拉框选项
export async function getAccVoucherUnitName(req) {
  console.log("getAccVoucherUnitName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT budget_unit_name as label, budget_unit_name as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1=1 @[AND budget_unit_name LIKE '%${param.inputData}%'] ORDER BY budget_unit_code ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getAccVoucherUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccVoucherUnitName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccVoucherUnitName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 记账凭证表 会计体系下拉框选项
export async function getAccVoucherSystem(req) {
  console.log("getAccVoucherSystem req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_system AS label, acct_system AS value FROM CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y ORDER BY acct_system ASC;",
    sqlParameter: req,
  };
  console.log("getAccVoucherSystem dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccVoucherSystem dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccVoucherSystem res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 记账凭证表 科目名称输入下拉框选项
export async function getAccVoucherSubjectName(req) {
  console.log("getAccVoucherSubjectName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT trim(acct_subj_name) AS label, trim(acct_subj_name) AS value FROM CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y WHERE 1 = 1 @[AND trim(acct_subj_name) LIKE '%${param.inputData}%'] LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getAccVoucherSubjectName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccVoucherSubjectName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccVoucherSubjectName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 记账凭证表 电子账簿名称输入下拉框选项
export async function getAccVoucherLedgerName(req) {
  console.log("getAccVoucherLedgerName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name AS label, acct_ebk_name AS value FROM CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y WHERE 1 = 1 @[AND acct_ebk_name LIKE '%${param.inputData}%'] limit 50;",
    sqlParameter: req,
  };
  console.log("getAccVoucherLedgerName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAccVoucherLedgerName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAccVoucherLedgerName res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 辅助信息表数据
export async function getAuxInfoData(req) {
  console.log("getAuxInfoData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) as total FROM CAS_DWD_FUS_SJ_CW_AUX_DESC_I_Y WHERE 1 = 1 @[AND unit_name = '${param.unitName}'] @[AND acct_year = '${param.year}'] @[AND aux_type like '%${param.auxType}%'] @[AND aux_name like '%${param.auxName}%'] @[AND full_aux_name like '%${param.fullAuxName}%'] @[AND aux_code = '${param.auxCode}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND adm_div_name = '${param.admDivName}'];",
    sqlParameter: req,
  };
  console.log("getAuxInfoData dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log("getAuxInfoData dacpTotalReq: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, unit_name as organizationName, unit_code as organizationCode, acct_ebk_num as electronicLedgerNumber, acct_ebk_name as electronicLedgerName, aux_type as assistanceType, aux_code as assistanceCode, aux_name as assistanceName, full_aux_name as fullAssistanceName, aux_level as assistanceLevel, sup_aux_code as parentAssistanceCode, aux_desc as assistanceDescription, is_budget_aux as isBudgetAssistance, bdp_audit as bdpAudit FROM CAS_DWD_FUS_SJ_CW_AUX_DESC_I_Y WHERE 1 = 1 @[AND unit_name = '${param.unitName}'] @[AND acct_year = '${param.year}'] @[AND aux_type like '%${param.auxType}%'] @[AND aux_name like '%${param.auxName}%'] @[AND full_aux_name like '%${param.fullAuxName}%'] @[AND aux_code like '%${param.auxCode}%'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND adm_div_name = '${param.admDivName}'] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };
  console.log("getAuxInfoData dacpDetailReq: ", JSON.stringify(dacpDetailReq));
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log("getAuxInfoData dacpDetailRes: ", JSON.stringify(dacpDetailRes));
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
  console.log("getAuxInfoData res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 辅助信息表格数据   表格排序字段
// 辅助信息表格数据   表格排序字段
export async function getAuxInfoSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
      },
      {
        label: "会计年度",
        value: "fiscalYear",
      },
      {
        label: "单位代码",
        value: "organizationCode",
      },
      {
        label: "单位名称",
        value: "organizationName",
      },
      {
        label: "电子账簿编号",
        value: "electronicLedgerNumber",
      },
      {
        label: "电子账簿名称",
        value: "electronicLedgerName",
      },
      {
        label: "辅助类型",
        value: "assistanceType",
      },
      {
        label: "辅助编码",
        value: "assistanceCode",
      },
      {
        label: "辅助名称",
        value: "assistanceName",
      },
      {
        label: "辅助全称",
        value: "fullAssistanceName",
      },
      {
        label: "辅助级次",
        value: "assistanceLevel",
      },
      {
        label: "上级辅助编码",
        value: "parentAssistanceCode",
      },
      {
        label: "辅助说明",
        value: "assistanceDescription",
      },
      {
        label: "是否为预算辅助",
        value: "isBudgetAssistance",
      },
      {
        label: "BDP_AUDIT",
        value: "bdpAudit",
      },
    ],
  };
  console.log("getAuxInfoSort res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助信息表格 年份下拉框选项
export async function getAuxInfoYear(req) {
  console.log("getAuxInfoYear req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_AUX_DESC_I_Y ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getAuxInfoYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxInfoYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxInfoYear res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助信息表格 单位名称输入下拉框选项
export async function getAuxInfoUnitName(req) {
  console.log("getAuxInfoUnitName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT budget_unit_name as label, budget_unit_name as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1=1 @[AND budget_unit_name LIKE '%${param.inputData}%'] ORDER BY budget_unit_code ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getAuxInfoUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxInfoUnitName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxInfoUnitName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助信息表格 电子账簿名称输入下拉框
export async function getAuxInfoLedgerName(req) {
  console.log("getAuxInfoLedgerName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name AS label, acct_ebk_name AS value FROM CAS_DWD_FUS_SJ_CW_AUX_DESC_I_Y WHERE 1 = 1 @[AND acct_ebk_name LIKE '%${param.inputData}%'] limit 50;",
    sqlParameter: req,
  };
  console.log("getAuxInfoLedgerName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxInfoLedgerName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxInfoLedgerName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助信息表格 行政区划名称下拉框选项
export async function getAuxInfoDivision(req) {
  console.log("getAuxInfoDivision req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name as label, adm_div_name as value FROM CAS_DWD_FUS_SJ_CW_AUX_DESC_I_Y ORDER BY adm_div_name asc;",
    sqlParameter: req,
  };
  console.log("getAuxInfoDivision dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxInfoDivision dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxInfoDivision res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 辅助类型表数据
export async function getAuxTypeData(req) {
  console.log("getAuxTypeData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) AS total FROM CAS_DWD_FUS_SJ_CW_AUX_TYPE_I_Y WHERE 1 = 1 @[AND unit_name = '${param.unitName}'] @[AND acct_year = '${param.year}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND aux_type_code like '%${param.auxCode}%'] @[AND aux_type_name like '%${param.auxName}%'] @[AND aux_type_struct like '%${param.auxTypeStruct}%'] @[AND adm_div_name = '${param.admDivName}'] ",
    sqlParameter: req,
  };
  console.log("getAuxTypeData dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log("getAuxTypeData dacpTotalReq: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, unit_code as organizationCode, unit_name as organizationName, acct_ebk_num as accountingNumber, acct_ebk_name as accountingName, aux_type_code as auxiliaryTypeCode, aux_type_name as auxiliaryTypeName, aux_type_struct as auxiliaryTypeStructure, bdp_audit as bdpAudit FROM CAS_DWD_FUS_SJ_CW_AUX_TYPE_I_Y WHERE 1 = 1 @[AND unit_name = '${param.unitName}'] @[AND acct_year = '${param.year}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND aux_type_code like '%${param.auxCode}%'] @[AND aux_type_name like '%${param.auxName}%'] @[AND aux_type_struct like '%${param.auxTypeStruct}%'] @[AND adm_div_name = '${param.admDivName}'] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset}",
    sqlParameter: req,
  };
  console.log("getAuxTypeData dacpDetailReq: ", JSON.stringify(dacpDetailReq));
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log("getAuxTypeData dacpDetailRes: ", JSON.stringify(dacpDetailRes));
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
  console.log("getAuxTypeData res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 辅助类型表格数据  表格排序字段
export async function getAuxTypeSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
      },
      {
        label: "会计年度",
        value: "fiscalYear",
      },
      {
        label: "单位代码",
        value: "organizationCode",
      },
      {
        label: "单位名称",
        value: "organizationName",
      },
      {
        label: "会计电子账簿编号",
        value: "accountingNumber",
      },
      {
        label: "会计电子账簿名称",
        value: "accountingName",
      },
      {
        label: "辅助类型编码",
        value: "auxiliaryTypeCode",
      },
      {
        label: "辅助类型名称",
        value: "auxiliaryTypeName",
      },
      {
        label: "辅助类型结构",
        value: "auxiliaryTypeStructure",
      },
      {
        label: "BDP_AUDIT",
        value: "bdpAudit",
      },
    ],
  };
  console.log("getAuxTypeSort res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助类型表 年份下拉框选项
export async function getAuxTypeYear(req) {
  console.log("getAuxTypeYear req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_AUX_TYPE_I_Y ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getAuxTypeYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxTypeYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxTypeYear res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助类型表 单位名称输入下拉框选项
export async function getAuxTypeUnitName(req) {
  console.log("getAuxTypeUnitName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT budget_unit_name as label, budget_unit_name as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1=1 @[AND budget_unit_name LIKE '%${param.inputData}%'] ORDER BY budget_unit_code ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getAuxTypeUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxTypeUnitName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxTypeUnitName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助类型表 电子账簿名称输入下拉框
export async function getAuxTypeLedgerName(req) {
  console.log("getAuxTypeLedgerName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name AS label, acct_ebk_name AS value FROM CAS_DWD_FUS_SJ_CW_AUX_TYPE_I_Y WHERE 1 = 1 @[AND acct_ebk_name LIKE '%${param.inputData}%'] limit 50;",
    sqlParameter: req,
  };
  console.log("getAuxTypeLedgerName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxTypeLedgerName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxTypeLedgerName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助类型表 行政区划名称下拉框选项
export async function getAuxTypeDivision(req) {
  console.log("getAuxTypeDivision req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name as label, adm_div_name as value FROM CAS_DWD_FUS_SJ_CW_AUX_TYPE_I_Y ORDER BY adm_div_name asc;",
    sqlParameter: req,
  };
  console.log("getAuxTypeDivision dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxTypeDivision dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxTypeDivision res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 辅助年初数表数据
export async function getBegYrAuxData(req) {
  console.log("getBegYrAuxData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) AS total FROM CAS_DWD_FUS_SJ_CW_AUX_BOY_I_Y WHERE 1 = 1 @[AND unit_name = '${param.unitName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND aux_type like '%${param.auxType}%'] @[AND aux_code like '%${param.auxCode}%'] @[AND aux_name like '%${param.auxName}%'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND adm_div_name = '${param.admDivName}'];",
    sqlParameter: req,
  };
  console.log("getBegYrAuxData dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log("getBegYrAuxData dacpTotalReq: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, unit_code as organizationCode, unit_name as organizationName, acct_ebk_num as accountingElectronicLedgerNumber, acct_ebk_name as accountingElectronicLedgerName, acct_month as accountingMonth, acct_subj_code as subjectCode, acct_subj_name as subjectName, acct_subj_level as subjectLevel, acct_system as accountingSystem, is_lowest_lvl_subj as isBottomLevelSubject, sup_subj_code as parentSubjectCode, aux_type as auxiliaryType, aux_code as auxiliaryCode, aux_name as auxiliaryName, curr_name as currencyName, bal_direction as balanceDirection, FORMAT(lc_open_bal,2) as initialLocalCurrencyBalance, FORMAT(lc_open_debit_bal,2) as initialLocalCurrencyDebitBalance, FORMAT(lc_open_credit_bal,2) as initialLocalCurrencyCreditBalance, FORMAT(open_qty,2) as initialQuantity, FORMAT(fc_open_bal,2) as initialForeignCurrencyBalance, bdp_audit as bdpAudit FROM CAS_DWD_FUS_SJ_CW_AUX_BOY_I_Y WHERE 1 = 1 @[AND unit_name = '${param.unitName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND aux_type like '%${param.auxType}%'] @[AND aux_code like '%${param.auxCode}%'] @[AND aux_name like '%${param.auxName}%'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND adm_div_name = '${param.admDivName}'] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };
  console.log("getBegYrAuxData dacpDetailReq: ", JSON.stringify(dacpDetailReq));
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log("getBegYrAuxData dacpDetailRes: ", JSON.stringify(dacpDetailRes));
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
  console.log("getBegYrAuxData res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 辅助年初数表格数据  表格排序字段
export async function getBegYrAuxSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
      },
      {
        label: "会计年度",
        value: "fiscalYear",
      },
      {
        label: "单位代码",
        value: "organizationCode",
      },
      {
        label: "单位名称",
        value: "organizationName",
      },
      {
        label: "会计电子账簿编号",
        value: "accountingElectronicLedgerNumber",
      },
      {
        label: "会计电子账簿名称",
        value: "accountingElectronicLedgerName",
      },
      {
        label: "会计体系",
        value: "accountingSystem",
      },
      {
        label: "会计月份",
        value: "accountingMonth",
      },
      {
        label: "科目编码",
        value: "subjectCode",
      },
      {
        label: "科目名称",
        value: "subjectName",
      },
      {
        label: "科目级次",
        value: "subjectLevel",
      },
      {
        label: "是否最底级科目",
        value: "isBottomLevelSubject",
      },
      {
        label: "上级科目编码",
        value: "parentSubjectCode",
      },
      {
        label: "辅助类型",
        value: "auxiliaryType",
      },
      {
        label: "辅助编码",
        value: "auxiliaryCode",
      },
      {
        label: "辅助名称",
        value: "auxiliaryName",
      },
      {
        label: "币种名称",
        value: "currencyName",
      },
      {
        label: "余额方向",
        value: "balanceDirection",
      },
      {
        label: "本币期初余额",
        value: "initialLocalCurrencyBalance",
      },
      {
        label: "本币期初借方余额",
        value: "initialLocalCurrencyDebitBalance",
      },
      {
        label: "本币期初贷方余额",
        value: "initialLocalCurrencyCreditBalance",
      },
      {
        label: "期初数量",
        value: "initialQuantity",
      },
      {
        label: "外币期初余额",
        value: "initialForeignCurrencyBalance",
      },
      {
        label: "BDP_AUDIT",
        value: "bdpAudit",
      },
    ],
  };
  console.log("getBegYrAuxSort res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助年初数表格 年份下拉框选项
export async function getBegYrAuxYear(req) {
  console.log("getBegYrAuxYear req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_AUX_BOY_I_Y ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getBegYrAuxYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrAuxYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrAuxYear res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助年初数表格 月份下拉框选项
export async function getBegYrAuxMonth(req) {
  console.log("getBegYrAuxMonth req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT DISTINCT acct_month as label, acct_month as value FROM CAS_DWD_FUS_SJ_CW_AUX_BOY_I_Y ORDER BY cast(acct_month as unsigned) asc;",
    sqlParameter: req,
  };
  console.log("getBegYrAuxMonth dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrAuxMonth dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrAuxMonth res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助年初数表格 单位名称输入下拉框选项
export async function getBegYrAuxUnitName(req) {
  console.log("getBegYrAuxUnitName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT budget_unit_name as label, budget_unit_name as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1=1 @[AND budget_unit_name LIKE '%${param.inputData}%'] ORDER BY budget_unit_code ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getBegYrAuxUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrAuxUnitName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrAuxUnitName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助年初数表格 电子账簿名称输入下拉框
export async function getBegYrAuxLedgerName(req) {
  console.log("getBegYrAuxLedgerName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name AS label, acct_ebk_name AS value FROM CAS_DWD_FUS_SJ_CW_AUX_BOY_I_Y WHERE 1 = 1 @[AND acct_ebk_name LIKE '%${param.inputData}%'] limit 50;",
    sqlParameter: req,
  };
  console.log("getBegYrAuxLedgerName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrAuxLedgerName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrAuxLedgerName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助年初数表格 行政区划名称下拉框选项
export async function getBegYrAuxDivision(req) {
  console.log("getBegYrAuxDivision req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name as label, adm_div_name as value FROM CAS_DWD_FUS_SJ_CW_AUX_BOY_I_Y ORDER BY adm_div_name asc;",
    sqlParameter: req,
  };
  console.log("getBegYrAuxDivision dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBegYrAuxDivision dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBegYrAuxDivision res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 辅助余额表格数据
export async function getAuxiliaryBalance(req) {
  console.log("getAuxiliaryBalance req: ", JSON.stringify(req));

  // 科目编码操作符转换
  const kmbm = transformKMBM({operator: req.operator, rightValue: req.rightValue});

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) as total FROM CAS_DWD_FUS_SJ_CW_AUX_BALANCE_I_Y WHERE 1=1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND acct_system = '${param.acctSystem}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND acct_subj_code = '${param.acctSubjCode}'] @[AND acct_subj_name = '${param.acctSubjName}'] @[AND aux_type = '${param.auxType}'] @[AND aux_code like '%${param.auxCode}%'] @[AND aux_name like '%${param.auxName}%'] ;",
    sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log(
    "getAuxiliaryBalance dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getAuxiliaryBalance dacpTotalReq: ",
    JSON.stringify(dacpTotalRes)
  );
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, unit_name as organizationName, unit_code as organizationCode, acct_ebk_num as accountingElectronicLedgerNumber, acct_ebk_name as accountingElectronicLedgerName, acct_month as accountingMonth, acct_system as accountingSystem, acct_subj_code as subjectCode, acct_subj_name as subjectName, full_name_acct_subj as fullSubjectName, format(debit_bal_begin_year, 2) as beginningDebitBalanceAtYearStart, format(credit_bal_begin_year, 2) as creditBalanceAtYearStart, bal_direction_begin_year as balanceDirectionAtYearStart, format(open_debit_bal, 2) as debitBalanceAtBeginning, format(open_credit_bal, 2) as creditBalanceAtBeginning, open_bal_direction as balanceDirectionAtBeginning, format(debit_amount, 2) as debitOccurrenceAmount, format(acc_debit_amount, 2) as cumulativeDebitOccurrenceAmount, format(credit_amount, 2) as creditOccurrenceAmount, format(acc_credit_amount, 2) as cumulativeCreditOccurrenceAmount, format(end_debit_bal, 2) as debitBalanceAtEnd, format(end_credit_bal, 2) as creditBalanceAtEnd, end_bal_direction as balanceDirectionAtEnd, format(open_fc_debit_bal, 2) as foreignDebitBalanceAtBeginning, format(open_fc_credit_bal, 2) as foreignCreditBalanceAtBeginning, format(debit_fc_amount, 2) as foreignCurrencyDebitOccurrenceAmount, format(credit_fc_amount, 2) as foreignCurrencyCreditOccurrenceAmount, format(end_fc_debit_bal, 2) as foreignDebitBalanceAtEnd, format(end_fc_credit_bal, 2) as foreignCreditBalanceAtEnd, acct_subj_level as accountingSubjectLevel, is_lowest_lvl_subj as isBottomLevelSubject, curr_name as currencyName, sup_subj_code as parentSubjectCode, entry_number as entryCount, aux_type as auxiliaryType, aux_code as auxiliaryCode, aux_name as auxiliaryName, aux_level as auxiliaryLevel, sup_aux_code as parentAuxiliaryCode, curr_code as currencyCode FROM CAS_DWD_FUS_SJ_CW_AUX_BALANCE_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND acct_month = '${param.month}'] @[AND acct_system = '${param.acctSystem}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND acct_subj_code ${param.operator} '${param.rightValue}'] @[AND aux_type = '${param.auxType}'] @[AND aux_code like '%${param.auxCode}%'] @[AND aux_name like '%${param.auxName}%'] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log(
    "getAuxiliaryBalance dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getAuxiliaryBalance dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );
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
  console.log("getAuxiliaryBalance res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 辅助余额表格数据   表格排序字段
export async function getAuxiliaryBalanceSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
      },
      {
        label: "会计年度",
        value: "fiscalYear",
      },
      {
        label: "单位代码",
        value: "organizationCode",
      },
      {
        label: "单位名称",
        value: "organizationName",
      },
      {
        label: "电子账簿编号",
        value: "accountingElectronicLedgerNumber",
      },
      {
        label: "电子账簿名称",
        value: "accountingElectronicLedgerName",
      },
      {
        label: "会计体系",
        value: "accountingSystem",
      },
      {
        label: "会计月份",
        value: "accountingMonth",
      },
      {
        label: "科目编码",
        value: "subjectCode",
      },
      {
        label: "科目名称",
        value: "subjectName",
      },
      {
        label: "科目全称",
        value: "fullSubjectName",
      },
      {
        label: "年初借方余额",
        value: "beginningDebitBalanceAtYearStart",
      },
      {
        label: "年初贷方余额",
        value: "creditBalanceAtYearStart",
      },
      {
        label: "年初余额方向",
        value: "balanceDirectionAtYearStart",
      },
      {
        label: "期初借方余额",
        value: "debitBalanceAtBeginning",
      },
      {
        label: "期初贷方余额",
        value: "creditBalanceAtBeginning",
      },
      {
        label: "期初余额方向",
        value: "balanceDirectionAtBeginning",
      },
      {
        label: "借方发生额",
        value: "debitOccurrenceAmount",
      },
      {
        label: "借方累计发生额",
        value: "cumulativeDebitOccurrenceAmount",
      },
      {
        label: "贷方发生额",
        value: "creditOccurrenceAmount",
      },
      {
        label: "贷方累计发生额",
        value: "cumulativeCreditOccurrenceAmount",
      },
      {
        label: "期末借方余额",
        value: "debitBalanceAtEnd",
      },
      {
        label: "期末贷方余额",
        value: "creditBalanceAtEnd",
      },
      {
        label: "期末余额方向",
        value: "balanceDirectionAtEnd",
      },
      {
        label: "期初外币借方余额",
        value: "foreignDebitBalanceAtBeginning",
      },
      {
        label: "期初外币贷方余额",
        value: "foreignCreditBalanceAtBeginning",
      },
      {
        label: "借方外币发生额",
        value: "foreignCurrencyDebitOccurrenceAmount",
      },
      {
        label: "贷方外币发生额",
        value: "foreignCurrencyCreditOccurrenceAmount",
      },
      {
        label: "期末外币借方余额",
        value: "foreignDebitBalanceAtEnd",
      },
      {
        label: "期末外币贷方余额",
        value: "foreignCreditBalanceAtEnd",
      },
      {
        label: "会计科目级别",
        value: "accountingSubjectLevel",
      },
      {
        label: "是否最底级科目",
        value: "isBottomLevelSubject",
      },
      {
        label: "币种名称",
        value: "currencyName",
      },
      {
        label: "上级科目编码",
        value: "parentSubjectCode",
      },
      {
        label: "分录数",
        value: "entryCount",
      },
      {
        label: "辅助类型",
        value: "auxiliaryType",
      },
      {
        label: "辅助编码",
        value: "auxiliaryCode",
      },
      {
        label: "辅助名称",
        value: "auxiliaryName",
      },
      {
        label: "辅助级别",
        value: "auxiliaryLevel",
      },
      {
        label: "上级辅助编码",
        value: "parentAuxiliaryCode",
      },
      {
        label: "币种代码",
        value: "currencyCode",
      },
    ],
  };
  console.log("getAuxiliaryBalanceSort res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助余额表格 年份下拉框选项
export async function getAuxiliaryBalanceYear(req) {
  console.log("getAuxiliaryBalanceYear req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_AUX_BALANCE_I_Y ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getAuxiliaryBalanceYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxiliaryBalanceYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxiliaryBalanceYear res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助余额表格 月份下拉框选项
export async function getAuxiliaryBalanceMonth(req) {
  console.log("getAuxiliaryBalanceMonth req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT DISTINCT acct_month as label, acct_month as value FROM CAS_DWD_FUS_SJ_CW_AUX_BALANCE_I_Y ORDER BY cast(acct_month as unsigned) asc;",
    sqlParameter: req,
  };
  console.log("getAuxiliaryBalanceMonth dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxiliaryBalanceMonth dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxiliaryBalanceMonth res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助余额表格 单位名称输入下拉框选项
export async function getAuxiliaryBalanceUnitName(req) {
  console.log("getAuxiliaryBalanceUnitName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT budget_unit_name as label, budget_unit_name as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1=1 @[AND budget_unit_name LIKE '%${param.inputData}%'] ORDER BY budget_unit_code ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getAuxiliaryBalanceUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxiliaryBalanceUnitName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxiliaryBalanceUnitName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助余额表格 电子账簿名称输入下拉框
export async function getAuxiliaryBalanceLedgerName(req) {
  console.log("getAuxiliaryBalanceLedgerName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name AS label, acct_ebk_name AS value FROM CAS_DWD_FUS_SJ_CW_VOUCHER_I_Y WHERE 1 = 1 @[AND acct_ebk_name LIKE '%${param.inputData}%'] limit 50;",
    sqlParameter: req,
  };
  console.log(
    "getAuxiliaryBalanceLedgerName dacpReq: ",
    JSON.stringify(dacpReq)
  );
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(
    "getAuxiliaryBalanceLedgerName dacpRes: ",
    JSON.stringify(dacpRes)
  );
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxiliaryBalanceLedgerName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助余额表格 行政区划名称下拉框选项
export async function getAuxiliaryBalanceDivision(req) {
  console.log("getAuxiliaryBalanceDivision req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name as label, adm_div_name as value FROM CAS_DWD_FUS_SJ_CW_AUX_BALANCE_I_Y ORDER BY adm_div_name asc;",
    sqlParameter: req,
  };
  console.log("getAuxiliaryBalanceDivision dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxiliaryBalanceDivision dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxiliaryBalanceDivision res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助余额表格 科目名称输入下拉框选项
export async function getAuxiliaryBalanceSubjectName(req) {
  console.log("getAuxiliaryBalanceSubjectName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT trim(acct_subj_name) AS label, trim(acct_subj_name) AS value FROM CAS_DWD_FUS_SJ_CW_AUX_BALANCE_I_Y WHERE 1 = 1 @[AND trim(acct_subj_name) LIKE '%${param.inputData}%'] LIMIT 50;",
    sqlParameter: req,
  };
  console.log(
    "getAuxiliaryBalanceSubjectName dacpReq: ",
    JSON.stringify(dacpReq)
  );
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(
    "getAuxiliaryBalanceSubjectName dacpRes: ",
    JSON.stringify(dacpRes)
  );
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxiliaryBalanceSubjectName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 辅助余额表格 会计体系下拉框选项
export async function getAuxiliaryBalanceSystem(req) {
  console.log("getAuxiliaryBalanceSystem req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_system AS label, acct_system AS value FROM CAS_DWD_FUS_SJ_CW_AUX_BALANCE_I_Y ORDER BY acct_system ASC;",
    sqlParameter: req,
  };
  console.log("getAuxiliaryBalanceSystem dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAuxiliaryBalanceSystem dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAuxiliaryBalanceSystem res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 凭证辅助明细表数据
export async function getVoucherAuxData(req) {
  console.log("getVoucherAuxData req: ", JSON.stringify(req));

  // 科目编码操作符转换
  const kmbm = transformKMBM({operator: req.operator, rightValue: req.rightValue});

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) as total FROM CAS_DWD_FUS_SJ_CW_AUX_VOUCHER_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND voucher_summary like '%${param.voucherSummary}%'] @[AND acct_voucher_date = '${param.acctVoucherDate}'] @[AND aux_type = '${param.auxType}'] @[AND aux_code like '%${param.auxCode}%'] @[AND aux_name like '%${param.auxName}%'] @[AND full_aux_name = '${param.fullAuxName}'] @[and acct_month = '${param.month}'] @[and acct_subj_name = '${param.acctSubjName}'] @[and acct_subj_code ${param.operator} '${param.rightValue}'] @[and acct_system = '${param.acctSystem}']",
    sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log("getVoucherAuxData dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log("getVoucherAuxData dacpTotalReq: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, unit_name as organizationName, unit_code as organizationCode, acct_ebk_num as electronicLedgerNumber, acct_ebk_name as electronicLedgerName, acct_system as accountingSystem, acct_month as fiscalMonth, acct_voucher_date as voucherDate, acct_voucher_type as voucherType, acct_type_num as accountingTypeNum, acct_voucher_number as voucherNumber, acct_voucher_line_number as voucherLineNumber, entry_sequence_number as classificationNumber, voucher_summary as accountingSummary, acct_subj_code as subjectCode, acct_subj_name as subjectName, aux_type as assistanceType, aux_code as assistanceCode, aux_name as assistanceName, full_aux_name as fullAssistanceName, first_lvl_aux_code as firstLevelAssistanceCode, first_lvl_aux_name as firstLevelAssistanceName, second_lvl_aux_code as secondLevelAssistanceCode, second_lvl_aux_name as secondLevelAssistanceName, third_lvl_aux_code as thirdLevelAssistanceCode, third_lvl_aux_name as thirdLevelAssistanceName, fourth_lvl_aux_code as fourthLevelAssistanceCode, fourth_lvl_aux_name as fourthLevelAssistanceName, fifth_lvl_aux_code as fifthLevelAssistanceCode, fifth_lvl_aux_name as fifthLevelAssistanceName, sixth_lvl_aux_code as sixthLevelAssistanceCode, sixth_lvl_aux_name as sixthLevelAssistanceName, seventh_lvl_aux_code as seventhLevelAssistanceCode, seventh_lvl_aux_name as seventhLevelAssistanceName, eighth_lvl_aux_code as eighthLevelAssistanceCode, eighth_lvl_aux_name as eighthLevelAssistanceName, ninth_lvl_aux_code as ninthLevelAssistanceCode, ninth_lvl_aux_name as ninthLevelAssistanceName, FORMAT(debit_amount, 2) as debitOccurrenceAmount, FORMAT(credit_amount, 2) as creditOccurrenceAmount, curr as currencyType, FORMAT(fc_debit_amount, 2) as foreignCurrencyDebitOccurrenceAmount, FORMAT(fc_credit_amount, 2) as foreignCurrencyCreditOccurrenceAmount, FORMAT(exchange_rate, 2) as exchangeRate, FORMAT(qty, 2) as quantity, FORMAT(unit_price, 2) as unitPrice FROM CAS_DWD_FUS_SJ_CW_AUX_VOUCHER_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND acct_year = '${param.year}'] @[AND unit_name = '${param.unitName}'] @[AND acct_ebk_name = '${param.acctEbkName}'] @[AND voucher_summary like '%${param.voucherSummary}%'] @[AND acct_voucher_date = '${param.acctVoucherDate}'] @[AND aux_type = '${param.auxType}'] @[AND aux_code like '%${param.auxCode}%'] @[AND aux_name like '%${param.auxName}%'] @[AND full_aux_name = '${param.fullAuxName}'] @[and acct_month = '${param.month}'] @[and acct_subj_name = '${param.acctSubjName}'] @[and acct_subj_code ${param.operator} '${param.rightValue}'] @[and acct_system = '${param.acctSystem}'] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset}",
    sqlParameter: {...req, operator: kmbm.op, rightValue: kmbm.rv},
  };
  console.log(
    "getVoucherAuxData dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getVoucherAuxData dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );
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
  console.log("getVoucherAuxData res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 凭证辅助明细表格数据   表格排序字段
export async function getVoucherAuxSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
      },
      {
        label: "会计年度",
        value: "fiscalYear",
      },
      {
        label: "单位编码",
        value: "organizationCode",
      },
      {
        label: "单位名称",
        value: "organizationName",
      },
      {
        label: "会计电子账簿编号",
        value: "electronicLedgerNumber",
      },
      {
        label: "会计电子账簿名称",
        value: "electronicLedgerName",
      },
      {
        label: "会计体系",
        value: "accountingSystem",
      },
      {
        label: "会计月份",
        value: "fiscalMonth",
      },
      {
        label: "记账凭证日期",
        value: "voucherDate",
      },
      {
        label: "记账凭证种类",
        value: "voucherType",
      },
      {
        label: "记账凭证编号",
        value: "voucherNumber",
      },
      {
        label: "记账凭证行号",
        value: "voucherLineNumber",
      },
      {
        label: "分类序号",
        value: "classificationNumber",
      },
      {
        label: "记账凭证摘要",
        value: "accountingSummary",
      },
      {
        label: "科目编码",
        value: "subjectCode",
      },
      {
        label: "科目名称",
        value: "subjectName",
      },
      {
        label: "辅助类型",
        value: "assistanceType",
      },
      {
        label: "辅助编码",
        value: "assistanceCode",
      },
      {
        label: "辅助名称",
        value: "assistanceName",
      },
      {
        label: "辅助全称",
        value: "fullAssistanceName",
      },
      {
        label: "一级辅助编码",
        value: "firstLevelAssistanceCode",
      },
      {
        label: "一级辅助名称",
        value: "firstLevelAssistanceName",
      },
      {
        label: "二级辅助编码",
        value: "secondLevelAssistanceCode",
      },
      {
        label: "二级辅助名称",
        value: "secondLevelAssistanceName",
      },
      {
        label: "三级辅助编码",
        value: "thirdLevelAssistanceCode",
      },
      {
        label: "三级辅助名称",
        value: "thirdLevelAssistanceName",
      },
      {
        label: "四级辅助编码",
        value: "fourthLevelAssistanceCode",
      },
      {
        label: "四级辅助名称",
        value: "fourthLevelAssistanceName",
      },
      {
        label: "五级辅助编码",
        value: "fifthLevelAssistanceCode",
      },
      {
        label: "五级辅助名称",
        value: "fifthLevelAssistanceName",
      },
      {
        label: "六级辅助编码",
        value: "sixthLevelAssistanceCode",
      },
      {
        label: "六级辅助名称",
        value: "sixthLevelAssistanceName",
      },
      {
        label: "七级辅助编码",
        value: "seventhLevelAssistanceCode",
      },
      {
        label: "七级辅助名称",
        value: "seventhLevelAssistanceName",
      },
      {
        label: "八级辅助编码",
        value: "eighthLevelAssistanceCode",
      },
      {
        label: "八级辅助名称",
        value: "eighthLevelAssistanceName",
      },
      {
        label: "九级辅助编码",
        value: "ninthLevelAssistanceCode",
      },
      {
        label: "九级辅助名称",
        value: "ninthLevelAssistanceName",
      },
      {
        label: "借方发生额",
        value: "debitOccurrenceAmount",
      },
      {
        label: "贷方发生额",
        value: "creditOccurrenceAmount",
      },
      {
        label: "币种",
        value: "currencyType",
      },
      {
        label: "外币借方发生额",
        value: "foreignCurrencyDebitOccurrenceAmount",
      },
      {
        label: "外币贷方发生额",
        value: "foreignCurrencyCreditOccurrenceAmount",
      },
      {
        label: "汇率",
        value: "exchangeRate",
      },
      {
        label: "数量",
        value: "quantity",
      },
      {
        label: "单价",
        value: "unitPrice",
      },
    ],
  };
  console.log("getVoucherAuxSort res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 凭证辅助明细表 年份下拉框选项
export async function getVoucherAuxYear(req) {
  console.log("getVoucherAuxYear req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_AUX_VOUCHER_I_Y ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getVoucherAuxYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getVoucherAuxYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getVoucherAuxYear res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 凭证辅助明细表 月份下拉框选项
export async function getVoucherAuxMonth(req) {
  console.log("getVoucherAuxMonth req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: "SELECT DISTINCT acct_month as label, acct_month as value FROM CAS_DWD_FUS_SJ_CW_AUX_VOUCHER_I_Y ORDER BY cast(acct_month as unsigned) asc;",
    sqlParameter: req,
  };
  console.log("getVoucherAuxMonth dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getVoucherAuxMonth dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getVoucherAuxMonth res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 凭证辅助明细表 单位名称输入下拉框选项
export async function getVoucherAuxUnitName(req) {
  console.log("getVoucherAuxUnitName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT budget_unit_name as label, budget_unit_name as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1=1 @[AND budget_unit_name LIKE '%${param.inputData}%'] ORDER BY budget_unit_code ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getVoucherAuxUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getVoucherAuxUnitName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getVoucherAuxUnitName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 凭证辅助明细表 电子账簿名称输入下拉框
export async function getVoucherAuxLedgerName(req) {
  console.log("getVoucherAuxLedgerName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_ebk_name AS label, acct_ebk_name AS value FROM CAS_DWD_FUS_SJ_CW_AUX_VOUCHER_I_Y WHERE 1 = 1 @[ AND acct_ebk_name LIKE '%${param.inputData}%'] limit 50;",
    sqlParameter: req,
  };
  console.log("getVoucherAuxLedgerName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getVoucherAuxLedgerName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getVoucherAuxLedgerName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 凭证辅助明细表 行政区划名称下拉框选项
export async function getVoucherAuxDivision(req) {
  console.log("getVoucherAuxDivision req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name as label, adm_div_name as value FROM CAS_DWD_FUS_SJ_CW_AUX_VOUCHER_I_Y ORDER BY adm_div_name asc;",
    sqlParameter: req,
  };
  console.log("getVoucherAuxDivision dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getVoucherAuxDivision dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getVoucherAuxDivision res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 凭证辅助明细表 科目名称输入下拉框选项
export async function getVoucherAuxSubjectName(req) {
  console.log("getVoucherAuxSubjectName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT trim(acct_subj_name) AS label, trim(acct_subj_name) AS value FROM CAS_DWD_FUS_SJ_CW_AUX_VOUCHER_I_Y WHERE 1 = 1 @[ AND trim(acct_subj_name) LIKE '%${param.inputData}%'] LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getVoucherAuxSubjectName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getVoucherAuxSubjectName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getVoucherAuxSubjectName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 凭证辅助明细表 会计体系下拉框选项
export async function getVoucherAuxSystem(req) {
  console.log("getVoucherAuxSystem req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_system as label, acct_system as value FROM CAS_DWD_FUS_SJ_CW_ACCT_SUBJ_I_Y ORDER BY acct_system asc;",
    sqlParameter: req,
  };
  console.log("getVoucherAuxSystem dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getVoucherAuxSystem dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getVoucherAuxSystem res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 预算单位表数据
export async function getBudgetUnitData(req) {
  console.log("getBudgetUnitData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求，获取总数数据
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) as total FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1 = 1 @[AND adm_div_code = '${param.admDivCode}'] @[AND budget_unit_code = '${param.budgetUnitCode}'] @[AND acct_year = '${param.year}']",
    sqlParameter: req,
  };
  console.log("getBudgetUnitData dacpTotalReq: ", JSON.stringify(dacpTotalReq));
  const dacpTotalRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpTotalReq,
    {
      timeout: -1,
    }
  );
  console.log("getBudgetUnitData dacpTotalReq: ", JSON.stringify(dacpTotalRes));
  if (dacpTotalRes.code != 0) {
    return {
      code: dacpTotalRes.code,
      message: dacpTotalRes.message,
      data: dacpTotalRes.data,
    };
  }

  // 构造后端dacp接口请求，获取明细数据
  const dacpDetailReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT adm_div_code as administrativeDivisionCode, adm_div_name as administrativeDivisionName, acct_year as fiscalYear, budget_unit_code as budgetUnitCode, budget_unit_name as budgetUnitName, org_code as organizationStructureCode, superior_code as superiorUnitCode, code_level as codeLevel, unit_category as unitClassification, is_last_level as isLastLevel, adm_level as administrativeLevel, unit_nature as unitAdministration, budget_mgmt_method as budgetManagementMethod, unit_type as unitType, sup_dept_code as competentDepartmentCode, bdp_audit as bdpAudit FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1 = 1 @[AND adm_div_name = '${param.admDivName}'] @[AND budget_unit_name = '${param.budgetUnitName}'] @[AND acct_year = '${param.year}'] @[ORDER BY ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };
  console.log(
    "getBudgetUnitData dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${financialUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getBudgetUnitData dacpDetailRes: ",
    JSON.stringify(dacpDetailRes)
  );
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
  console.log("getBudgetUnitData res: ", JSON.stringify(res));
  return res;
}

//获取综合查询 预算单位表数据   表格排序字段
export async function getBudgetUnitSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "行政区划代码",
        value: "administrativeDivisionCode",
      },
      {
        label: "行政区划名称",
        value: "administrativeDivisionName",
      },
      {
        label: "会计年度",
        value: "fiscalYear",
      },
      {
        label: "预算单位代码",
        value: "budgetUnitCode",
      },
      {
        label: "预算单位名称",
        value: "budgetUnitName",
      },
      {
        label: "组织机构代码",
        value: "organizationStructureCode",
      },
      {
        label: "上级代码",
        value: "superiorUnitCode",
      },
      {
        label: "代码级次",
        value: "codeLevel",
      },
      {
        label: "单位分类",
        value: "unitClassification",
      },
      {
        label: "是否末级",
        value: "isLastLevel",
      },
      {
        label: "行政级别",
        value: "administrativeLevel",
      },
      {
        label: "单位行政",
        value: "unitAdministration",
      },
      {
        label: "预算管理方式",
        value: "budgetManagementMethod",
      },
      {
        label: "单位类别",
        value: "unitType",
      },
      {
        label: "主管科室代码",
        value: "competentDepartmentCode",
      },
      {
        label: "BDP_AUDIT",
        value: "bdpAudit",
      },
    ],
  };
  console.log("getBudgetUnitSort res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 预算单位表 年份下拉框选项
export async function getBudgetUnitYear(req) {
  console.log("getBudgetUnitYear req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT acct_year as label, acct_year as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y ORDER BY acct_year asc;",
    sqlParameter: req,
  };
  console.log("getBudgetUnitYear dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetUnitYear dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBudgetUnitYear res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 预算单位表 单位名称输入下拉框选项
export async function getBudgetUnitUnitName(req) {
  console.log("getBudgetUnitUnitName req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT budget_unit_name as label, budget_unit_name as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y WHERE 1=1 @[AND budget_unit_name LIKE '%${param.inputData}%'] ORDER BY budget_unit_code ASC LIMIT 50;",
    sqlParameter: req,
  };
  console.log("getBudgetUnitUnitName dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetUnitUnitName dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBudgetUnitUnitName res: ", JSON.stringify(res));
  return res;
}

// 获取综合查询 预算单位表 行政区划名称下拉框选项
export async function getBudgetUnitDivision(req) {
  console.log("getBudgetUnitDivision req: ", JSON.stringify(req));

  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT DISTINCT adm_div_name as label, adm_div_name as value FROM CAS_DWD_FUS_SJ_CW_UNIT_I_Y ORDER BY adm_div_name asc;",
    sqlParameter: req,
  };
  console.log("getBudgetUnitDivision dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${financialUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getBudgetUnitDivision dacpRes: ", JSON.stringify(dacpRes));
  if (dacpRes.code !== 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  function transformData(data) {
    return data;
  }

  const res = {
    code: 0,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getBudgetUnitDivision res: ", JSON.stringify(res));
  return res;
}

// 转换科目编码操作符
function transformKMBM({ operator, rightValue }) {
  let op = "";
  let rv = "";
  switch (operator) {
    case "equals":
      op = "=";
      rv = rightValue;
      break;
    case "contains":
      op = "like";
      rv = `%${rightValue}%`;
      break;
    case "startsWith":
      op = "like";
      rv = `${rightValue}%`;
      break;
    case "endsWith":
      op = "like";
      rv = `%${rightValue}`;
      break;
    default:
      break;
  }
  return { op, rv };
}
