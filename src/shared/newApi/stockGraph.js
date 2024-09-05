import axiosInstance from "./index.js";

const blockUrl = "/pierce/dacp/invoke";

//股权穿透 查询企业/个人详情接口

// 获取当前公司的股东
export async function getShareOwnership(req) {
  // 打印视图层的入参请求
  console.log("getShareOwnership req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "rds-SJCJTS-getShareOwnership",
    // sqlEndpoint: "audit_rds_dataVisualization_3",
    // sqlTemplate: "SELECT gd_id AS id, investorname AS name, 'in' as showDirection, is_actctrl AS isActualControl, has_upstream AS hasChildren, case when investorname is not null and char_length(investorname)<=5 then '个人' else '企业' end as nodeType, round(invtratio,2) AS percent, cptl AS money FROM CAS_FUS_SJ_GQCT_GD_I_M WHERE 1=1 @[AND biz_corp_name= '${param.name}'];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getShareOwnership dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getShareOwnership dacpRes: ", JSON.stringify(dacpRes));

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
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getShareOwnership res: ", JSON.stringify(res));
  return res;
}


// 获取当前公司所投资的公司
export async function getShareInvest(req) {
  // 打印视图层的入参请求
  console.log("getShareInvest req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "rds-SJCJTS-getShareInvest",
    // sqlEndpoint: "audit_rds_dataVisualization_3",
    // sqlTemplate: "SELECT btz_tyshxydm as id, biz_corp_name AS name, 'out' as showDirection, is_actctrl AS isActualControl, has_downstream AS hasChildren, '企业' AS nodeType, round(invtratio,2) as percent, cptl AS money FROM CAS_FUS_SJ_GQCT_CG_I_M WHERE 1=1 @[AND investorname = '${param.name}'];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getShareInvest dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${blockUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getShareInvest dacpRes: ", JSON.stringify(dacpRes));

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
    return data;
  };

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getShareInvest res: ", JSON.stringify(res));
  return res;
}