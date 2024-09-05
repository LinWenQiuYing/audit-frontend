import axiosInstance from "./index.js";

const ruleUrl = "/pierce/warningRule";
const graphUrl = "/pierce/graphTableResource";
const schemaUrl = "/pierce/graphSchema";
const templateUrl = "/pierce/template";

// 规则与模型接口

// 查询线索规则分类列表
export async function getCategoryList(categoryType) {
  // 0：条件分类，1：规则分类 2：风险分类（二期）
  const res = await axiosInstance.get(
    `${ruleUrl}/treeRuleCategory?categoryType=${categoryType}`
  );
  return res.data;
}

// 添加线索规则分类
export async function addListCategory(json) {
  const res = await axiosInstance.post(`${ruleUrl}/addRuleCategory`, json, {
    timeout: -1,
  });
  return res;
}

// 搜索线索规则列表
export async function searchRuleList(json) {
  const res = await axiosInstance.post(`${ruleUrl}/list`, json, {
    timeout: -1,
  });
  return res.data;
}

// 查询风险分类
export async function getRuleCategory() {
  const res = await axiosInstance.get(`${ruleUrl}/allRuleCategory`);
  return res.data;
}

// 搜索分类
export async function searchCategory(json) {
  const res = await axiosInstance.post(`${ruleUrl}/allRuleCategory`, json, {
    timeout: -1,
  });
  return res;
}

// 更新分类
export async function updateListCategory(json) {
  const res = await axiosInstance.put(`${ruleUrl}/update`, json, {
    timeout: -1,
  });
  return res;
}

// 查询客户类型
export async function getCustomerType() {
  const res = await axiosInstance.get(`${ruleUrl}/customerType`);
  return res.data;
}

// 查询行业类型
export async function getIndustryType() {
  const res = await axiosInstance.get(`${ruleUrl}/industry`);
  return res.data;
}

// 查询产品分类
export async function getProductCategory() {
  const res = await axiosInstance.get(`${ruleUrl}/productCategory`);
  return res.data;
}

// 查询模型
export async function getRuleModel(json) {
  const res = await axiosInstance.post(`${ruleUrl}/ruleModel`, json, {
    timeout: -1,
  });
  return res.data;
}

// 查询模型列表不分页
export async function queryRuleModelList(id = "") {
  const res = await axiosInstance.get(
    `${ruleUrl}/queryRuleModelList?schemaId=${id}`
  );
  return res;
}

export async function getRuleModelByPage(json) {
  const res = await axiosInstance.post(`${ruleUrl}/ruleModel/page`, json, {
    timeout: -1,
  });
  return res;
}

// 查询线索关联风险
export async function getWarningRelate() {
  const res = await axiosInstance.get(`${ruleUrl}/warningRelate`);
  return res.data;
}

// 编辑线索规则(批处理对象),上传文件
export async function uploadDocument(json) {
  const res = await axiosInstance.post(`${ruleUrl}/edit/batch`, json, {
    timeout: -1,
  });
  return res;
}

// 编辑线索规则(群体对象)
export async function editGroupRules(json) {
  const res = await axiosInstance.post(`${ruleUrl}/edit/group`, json, {
    timeout: -1,
  });
  return res;
}

// 编辑线索规则(单一对象)
export async function editSingleRules(json) {
  const res = await axiosInstance.post(`${ruleUrl}/edit/single`, json, {
    timeout: -1,
  });
  return res;
}

// 删除线索规则(单一对象)
export async function deleteSingleRules(json) {
  const res = await axiosInstance.post(`${ruleUrl}/del/single`, json, {
    timeout: -1,
  });
  return res;
}

// 删除线索分类
export async function deleteWarningCategory(json) {
  const res = await axiosInstance.post(`${ruleUrl}/delRuleCategory`, json, {
    timeout: -1,
  });
  return res;
}

// 启用/停用规则
export async function editWarningRuleStatus(json) {
  const res = await axiosInstance.put(
    `${ruleUrl}/editWarningRuleStatus`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 启用/停用模型
export async function editRuleModel(json) {
  const res = await axiosInstance.post(`${ruleUrl}/editRuleModel`, json, {
    timeout: -1,
  });
  return res;
}

// 获取模型详情
export async function getRuleModelDetail(json) {
  const res = await axiosInstance.post(`${ruleUrl}/ruleModelDetail`, json, {
    timeout: -1,
  });
  return res.data;
}

// 删除模型
export async function delRuleModel(json) {
  const res = await axiosInstance.post(`${ruleUrl}/delRuleModel`, json, {
    timeout: -1,
  });
  return res;
}

// 批量上传
export async function batchUpload(formData) {
  const res = await axiosInstance.post(`${ruleUrl}/batchUpload`, formData, {
    timeout: 30000,
  });
  return res;
}

// 查看规则详情
export async function getRuleDetails(id) {
  const res = await axiosInstance.get(`${ruleUrl}/getRuleDetails?ruleId=${id}`);
  return res.data;
}

// 下载批量上传文件
export async function getDownloadFiles(path) {
  const res = await axiosInstance.get(
    encodeURI(`${ruleUrl}/batchDownLoad?path=${path}`)
  );
  return res;
}

// 条件pdf下载
export async function pdfDownLoad() {
  const res = await axiosInstance.get(
    encodeURI(
      `${ruleUrl}/batchDownLoad?path=/media/rule-file/应用库表字段范围.pdf`
    )
  );
  return res;
}

// 下载示例
export async function downloadSampleFile() {
  const res = await axiosInstance.get(
    encodeURI(
      `${ruleUrl}/batchDownLoad?path=/media/rule-file/批量查询示例文件.csv`
    )
  );
  return res;
}

// schema相关接口

// 分页查询接口
export async function queryGraphSchemaByPage(json) {
  const res = await axiosInstance.post(
    `${schemaUrl}/queryGraphSchemaByPage`,
    json,
    {
      timeout: -1,
    }
  );
  return res.data;
}

// 预览接口
export async function graphPreview(id) {
  const res = await axiosInstance.get(`${schemaUrl}/graphPreview?id=${id}`);
  return res.data;
}

// 获取函数列表和操作符列表的接口
export async function queryDicList(type) {
  const res = await axiosInstance.get(
    `${schemaUrl}/queryDicList?dicType=${type}`
  );
  return res.data;
}

// 生成cypher语句接口
export async function createCypher(json) {
  const res = await axiosInstance.post(`${schemaUrl}/createCypher`, json, {
    timeout: -1,
  });
  return res;
}

// 保存新增模型接口
export async function addRuleModel(json) {
  const res = await axiosInstance.post(`${ruleUrl}/addRuleModel`, json, {
    timeout: -1,
  });
  return res;
}

// 保存新增模型图片接口
export async function saveModelImg(json) {
  const res = await axiosInstance.post(`${ruleUrl}/saveModelImg`, json, {
    timeout: -1,
  });
  return res;
}

// 获取模型详情
export async function getRuleModelDetails(id) {
  const res = await axiosInstance.get(
    `${ruleUrl}/getRuleModelDetails?id=${id}`
  );
  return res;
}

// 查询可选图谱接口
export async function queryGraphList() {
  const res = await axiosInstance.get(`${graphUrl}/queryGraphList`);
  return res.data;
}

// 查询图谱以及版本分支
export async function queryGraphCascader() {
  const res = await axiosInstance.get(`${graphUrl}/available/list/branch`);
  return res.data;
}

// 新增/编辑规则
export async function addOrEditWarningRule(json) {
  const res = await axiosInstance.post(
    `${ruleUrl}/addOrEditWarningRule`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查看规则运行历史
export async function queryRuleHistory(json) {
  const res = await axiosInstance.post(`${ruleUrl}/exec/history/list`, json, {
    timeout: -1,
  });
  return res;
}

// 查看规则运行历史——分页
export async function queryRuleHistoryByPage(json) {
  const res = await axiosInstance.post(`${ruleUrl}/exec/history/page`, json, {
    timeout: -1,
  });
  return res;
}

// 模型图谱检查
// export async function checkWarnOrNot(json) {
//   const res = await axiosInstance.post(`${ruleUrl}/checkWarnOrNot`, json, {
//     timeout: -1,
//   });
//   return res;
// }

// 查询可选图谱接口
export async function getGraphMeta(graphId) {
  const res = await axiosInstance.get(`${schemaUrl}/graphLabel?id=${graphId}`);
  return res.data;
}

//规则关联表查询
export async function queryRuleRelation(id) {
  const res = await axiosInstance.get(
    `/pierce/auditRule/ruleRelation?id=${id}`
  );
  return res;
}

// 分页查询模板列表
export async function queryTemplateByPage(json) {
  const res = await axiosInstance.post(
    `${templateUrl}/queryTemplateByPage`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 启用/停用模板
export async function updateTemplateStatus(json) {
  const res = await axiosInstance.post(
    `${templateUrl}/updateTemplateStatus`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 删除模板
export async function delTemplate(json) {
  const res = await axiosInstance.post(`${templateUrl}/delTemplate`, json, {
    timeout: -1,
  });
  return res;
}

// 新增模板
export async function addTemplate(json) {
  const res = await axiosInstance.post(`${templateUrl}/addTemplate`, json, {
    timeout: -1,
  });
  return res;
}

// 编辑模板
export async function editTemplate(json) {
  const res = await axiosInstance.post(`${templateUrl}/editTemplate`, json, {
    timeout: -1,
  });
  return res;
}

// 根据模板创建模型
export async function createModelByTempId(json) {
  const res = await axiosInstance.post(
    `${templateUrl}/createModelByTempId`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 模型编辑
export async function updateRuleModel(json) {
  const res = await axiosInstance.post(`${ruleUrl}/updateRuleModel`, json, {
    timeout: -1,
  });
  return res;
}

// 查询模板详情
export async function getTemplateDetails(id, type) {
  const res = await axiosInstance.get(
    `${templateUrl}/getTemplateDetails?id=${id}&type=${type}`
  );
  return res.data;
}
