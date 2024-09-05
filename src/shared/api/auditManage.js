import axiosInstance from "./index.js";

const conditionUrl = "/pierce/conditionCategory";
const dataUrl = "/pierce/datasource";
const conditionUrl2 = "/pierce/abCondition";
const ruleUrl = "/pierce/auditRule";
const resultUrl = "/pierce/auditRiskResult";

export const dataSourceId = "965934964304650240";

// 查询条件分类列表
export async function classifyCount() {
  const res = await axiosInstance.get(`${ruleUrl}/classifyCount`);
  return res;
}

// 查询条件分类列表
export async function gerTreeConditionCategory() {
  const res = await axiosInstance.get(`${conditionUrl}/treeConditionCategory`);
  return res;
}

// 添加/编辑条件分类
export async function addOrUpdateCategory(json) {
  const res = await axiosInstance.post(
    `${conditionUrl}/saveOrUpdateConditionCategory`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 删除条件分类
export async function delConditionCategory(id) {
  const res = await axiosInstance.delete(
    `${conditionUrl}/delConditionCategory?id=${id}`
  );
  return res;
}

// 保存数据源
export async function saveDataSource(json) {
  const res = await axiosInstance.post(`${dataUrl}/saveDataSource`, json, {
    timeout: -1,
  });
  return res;
}

// 编辑数据源
export async function updateDataSource(json) {
  const res = await axiosInstance.post(`${dataUrl}/updateDataSource`, json, {
    timeout: -1,
  });
  return res;
}

// 查询数据源列表
export async function queryDataSource(json) {
  const res = await axiosInstance.post(`${dataUrl}/queryDataSource`, json, {
    timeout: -1,
  });
  return res;
}

// 删除数据源
export async function delDataSource(id) {
  const res = await axiosInstance.delete(`${dataUrl}/delDataSource?id=${id}`);
  return res;
}

// 获得数据库所有数据表
export async function getDataSourceTables() {
  const res = await axiosInstance.get(
    `${dataUrl}/getDataSourceTables?id=${dataSourceId}`
  );
  return res;
}

// 获取数据库表字段
export async function getDataSourceTablesField(tableName) {
  const res = await axiosInstance.post(
    `${dataUrl}/getDataSourceTablesField`,
    {
      tableName,
      id: dataSourceId,
    },
    {
      timeout: -1,
    }
  );
  return res;
}

// 条件列表分页查询
export async function queryConditionByPage(json) {
  const res = await axiosInstance.post(
    `${conditionUrl2}/queryConditionByPage`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 保存/编辑 条件信息
export async function saveOrUpdateCondition(json) {
  const res = await axiosInstance.post(
    `${conditionUrl2}/saveOrUpdateCondition`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 删除条件信息
export async function delCondition(id) {
  const res = await axiosInstance.delete(
    `${conditionUrl2}/delCondition?id=${id}`
  );
  return res;
}

// 删除规则信息
export async function delAbRule(id) {
  const res = await axiosInstance.delete(`${ruleUrl}/delAbRule?id=${id}`);
  return res;
}

// 分页查询规则列表
export async function queryRuleByPage(json) {
  const res = await axiosInstance.post(`${ruleUrl}/queryRuleByPage`, json, {
    timeout: -1,
  });
  return res;
}

// 保存/编辑 规则信息
export async function saveOrUpdateRule(json) {
  const res = await axiosInstance.post(`${ruleUrl}/saveOrUpdateRule`, json, {
    timeout: -1,
  });
  return res;
}

// 保存/编辑 规则信息
export async function updateAbRuleStatus(json) {
  const res = await axiosInstance.post(`${ruleUrl}/updateAbRuleStatus`, json, {
    timeout: -1,
  });
  return res;
}

// 立即执行sql规则
export async function executeRuleScripts(id, customer) {
  const res = await axiosInstance.get(
    `${ruleUrl}/executeRuleScriptsByRuleId?id=${id}&customer=${customer}`
  );
  return res;
}

// 分页查询审计结果列表
export async function queryAbRiskResultByPage(json) {
  const res = await axiosInstance.post(
    `${resultUrl}/queryAbRiskResultByPage`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

export async function delRiskResult(id) {
  const res = await axiosInstance.delete(`${resultUrl}/delRiskResult?id=${id}`);
  return res;
}
//批量删除
export async function delBulkRiskResult(json) {
  const res = await axiosInstance.post(`${resultUrl}/delBulkRiskResult`, json, {
    timeout: -1,
  });
  return res;
}

export async function riskResultDetail(json) {
  const res = await axiosInstance.post(`${resultUrl}/riskResultDetail`, json, {
    timeout: -1,
  });
  return res;
}

export async function riskResultConditionHit(json) {
  const res = await axiosInstance.post(
    `${resultUrl}/riskResultConditionHit`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询条件使用的表字段
export async function queryConTableField(json) {
  const res = await axiosInstance.post(
    `${conditionUrl2}/queryConTableField`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询条件对应的表的数量
export async function queryConTableCount(arr) {
  const res = await axiosInstance.post(
    `${conditionUrl2}/queryConTableCount`,
    arr,
    {
      timeout: -1,
    }
  );
  return res;
}

// 添加/编辑条件分类
export async function getTagInfo(json) {
  const res = await axiosInstance.post(`${conditionUrl}/getTagInfo`, json, {
    timeout: -1,
  });
  return res;
}
