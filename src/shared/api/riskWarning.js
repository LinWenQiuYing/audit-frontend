import axiosInstance from "./index.js";

const myUrl = "/pierce/risk/warning";
const ruleUrl = "/pierce/warningRule";
const authUrl = "/pierce/auth/dept/company";
const riskUrl = "/pierce/auditRiskResult";

//风险线索列表查询
export async function getWarningList(info) {
  const res = await axiosInstance.post(`${myUrl}/query`, info, {
    timeout: -1,
  });
  return res.data;
}

//风险线索忽略设置
export async function warningIgnore(info) {
  const res = await axiosInstance.post(`${myUrl}/ignore`, info, {
    timeout: -1,
  });
  return res;
}

//风险线索详情查看
export async function warningDetailCheck(id) {
  const res = await axiosInstance.get(`${myUrl}/detail/${id}`);
  return res.data;
}

//风险线索详情编辑
export async function warningDetailEdit(info) {
  const res = await axiosInstance.post(`${myUrl}/edit/detail`, info, {
    timeout: -1,
  });
  return res;
}

//风险线索状态修改——三期
export async function riskStatusEdit(info) {
  const res = await axiosInstance.post(`${myUrl}/single/info`, info, {
    timeout: -1,
  });
  return res;
}

//查询线索分类信息
export async function getWarningType() {
  const res = await axiosInstance.get(`${ruleUrl}/allRuleCategory`);
  return res.data;
}

// 查询风险路径
export async function getWarningPath(info) {
  const res = await axiosInstance.post(`${myUrl}/queryPathByProperty`, info, {
    timeout: -1,
  });
  return res.data;
}

// 获取最新待处理事件列表
export async function getLatestList() {
  const res = await axiosInstance.get(`${myUrl}/latestPendingWarning`);
  return res.data;
}

// 根据客户名查询风险数量
export async function getWaringCountByCustomer(name) {
  const res = await axiosInstance.get(
    `${myUrl}/getWaringCountByCustomer?customerName=${name}`
  );
  return res.data;
}

// 根据客户名查询指定规则的预警数量
export async function getWaringCountByRuleName(json) {
  const res = await axiosInstance.post(
    `${myUrl}/getWaringCountByRuleName`,
    json,
    {
      timeout: -1,
    }
  );
  return res.data;
}

// 批量查询风险路径
export async function batchQueryRiskWarningPaths(json) {
  const res = await axiosInstance.post(
    `${myUrl}/batchQueryRiskWarningPaths`,
    json,
    {
      timeout: -1,
    }
  );
  return res.data;
}

// 风险线索概览列表查询
export async function queryRiskOverviewByPage(json) {
  const res = await axiosInstance.post(`${myUrl}/overview/page`, json, {
    timeout: -1,
  });
  return res;
}

// 风险线索列表查询
export async function queryRiskByPage(json) {
  const res = await axiosInstance.post(`${myUrl}/query/page`, json, {
    timeout: -1,
  });
  return res;
}

// 查看线索详情
export async function getRiskDetails(id) {
  const res = await axiosInstance.get(`${myUrl}/detail/${id}`);
  return res;
}

// 获取线索筛选排序字段选项
export async function getRiskSortFilterOptions(name) {
  const res = await axiosInstance.get(`${myUrl}/sortField?tableName=${name}`);
  return res;
}

// 有调度执行历史的策略名称
export async function getRiskHistoryName() {
  const res = await axiosInstance.get(`${ruleUrl}/exec/history/rule`);
  return res;
}

// 根据条件查询调度历史list
export async function getRiskHistoryList(json) {
  const res = await axiosInstance.post(`${ruleUrl}/exec/history/list`, json, {
    timeout: -1,
  });
  return res;
}

// 二维表查询条件生成二维表
export async function getRiskDetailTable(json) {
  const res = await axiosInstance.post(
    `${myUrl}/generate/file/detail/table`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 校验二维表文件生成的状态
export async function checkRiskDetailTableStatus(key) {
  const res = await axiosInstance.get(
    `${myUrl}/generate/file/detail/status?fileRdKey=${key}`
  );
  return res;
}

// 校验二维表文件生成的状态
export async function exportRiskDetailTable(key) {
  const res = await axiosInstance.get(
    `${myUrl}/downloadFile?fileRdKey=${key}`,
    { responseType: "blob" }
  );
  return res;
}

// 线索全量图搜索——图谱
export async function getRiskWarningDetail(id) {
  const res = await axiosInstance.post(
    `${myUrl}/riskDetailQuery/warningId/${id}`
  );
  return res;
}

// 线索全量图搜索——图谱
export async function allSearchGraphRisk(json) {
  const res = await axiosInstance.post(`${myUrl}/search/num/page`, json, {
    timeout: -1,
  });
  return res;
}

// 线索全量图搜索——规则
export async function allSearchGraphRule(json) {
  const res = await axiosInstance.post(`${riskUrl}/search/num/page`, json, {
    timeout: -1,
  });
  return res;
}

// 查询全部部门权限list
export async function getDeptList(json) {
  const res = await axiosInstance.post(`${authUrl}/list`, json, {
    timeout: -1,
  });
  return res;
}

// 新增部门权限
export async function addDept(json) {
  const res = await axiosInstance.post(`${authUrl}/add`, json, {
    timeout: -1,
  });
  return res;
}

// 修改部门权限
export async function editDept(json) {
  const res = await axiosInstance.put(`${authUrl}/update`, json, {
    timeout: -1,
  });
  return res;
}

// 查询全部部门id+name
export async function getDeptTree() {
  const res = await axiosInstance.get(`${authUrl}/baseInfo/dept/list`);
  return res;
}
