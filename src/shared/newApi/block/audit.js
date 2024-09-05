import axiosInstance from "../index.js";

const auditUrl = "/pierce/dacp/invoke";

//获取总览数据
export async function getAuditOverviewData(json) {
  const res = await axiosInstance.post(`${auditUrl}/sectionOverview`, json, {
    timeout: -1,
  });
  return res;
}

//获取资产状况一览表
export async function getAuditCardData(json) {
  const res = await axiosInstance.post(`${auditUrl}/sectionOverview`, json, {
    timeout: -1,
  });
  return res;
}

//当年审计项目分布情况（按审计类型）
export async function getAuditChartOne(json) {
  const res = await axiosInstance.post(`${auditUrl}/sectionOverview`, json, {
    timeout: -1,
  });
  return res;
}

//指定审计类型下单位分布情况
export async function getAuditChartTwo(json) {
  const res = await axiosInstance.post(`${auditUrl}/sectionOverview`, json, {
    timeout: -1,
  });
  return res;
}

//当年审计项目分布情况（按主管单位）
export async function getAuditChartThree(json) {
  const res = await axiosInstance.post(`${auditUrl}/sectionOverview`, json, {
    timeout: -1,
  });
  return res;
}

//表格里的柱状图
export async function getAuditTableChart(json) {
  const res = await axiosInstance.post(`${auditUrl}/sectionOverview`, json, {
    timeout: -1,
  });
  return res;
}

//表格里的柱状图  排序
export async function getAuditSort(json) {
  const res = await axiosInstance.post(`${auditUrl}/sectionOverview`, json, {
    timeout: -1,
  });
  return res;
}

//表格里的柱状图  筛选
export async function getAuditFilter(json) {
  const res = await axiosInstance.post(`${auditUrl}/sectionOverview`, json, {
    timeout: -1,
  });
  return res;
}
