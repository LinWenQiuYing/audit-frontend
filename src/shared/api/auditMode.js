import axiosInstance from "./index.js";

const imageUrl = "/pierce/enterpriseImage";
const techUrl = "/pierce/casFusSjGzKjcxIY";
const strucUrl = "/pierce/groupStructure";
const primetonUrl = "/pierce/primeton";
//演示修改  todo  上下游
// const transUrl = "http://172.16.215.62:4523/m1/4564754-0-default/transaction";
const transUrl = "/pierce/transaction";
const negUrl = "/pierce/AsFusSjQyhxFmsjHzbQM";
const entImageUrl = "/pierce/enterpriseImage";
const fusUrl = "/pierce/fusSjQyhxXzxkZzxk";
//演示修改  todo 购销品类
// const asFusUrl = "http://172.16.215.62:4523/m1/4564754-0-default/asFusSjQyhxGxplIM";
const asFusUrl = "/pierce/asFusSjQyhxGxplIM";
//演示修改  todo
// const labelUrl = "http://172.16.215.62:4523/m1/4564754-0-default/lableDetails";
const labelUrl = "/pierce/lableDetails";
const historyUrl = "/pierce/LsygLsygsjlb";
const entPortUrl = "/pierce/entPortrayal";
const basicUrl = "/pierce/basicinfoGzcwjyzk";
const innovateUrl = "/pierce/stInnovateDetail";
//演示股权穿透
// const stockUrl = "http://172.16.215.62:4523/m1/4564754-0-default/transaction";
const stockUrl = "/pierce/transaction";

//股权穿透 查询企业/个人细节接口
export async function getNodeDetail(id) {
  const res = await axiosInstance.get(`${stockUrl}/getNodeDetail/${id}`);
  return res;
}

// 获取当前公司的投资公司
export async function getInvest(json) {
  const res = await axiosInstance.post(`${stockUrl}/getOwnership`, json, {
    timeout: -1,
  });
  return res;
}

// 获取当前公司的所有者
export async function getOwnership(json) {
  const res = await axiosInstance.post(`${stockUrl}/getVest`, json, {
    timeout: -1,
  });
  return res;
}

// 登陆token验证
export async function checkToken(json) {
  const res = await axiosInstance.post(
    `${primetonUrl}/getUserInfoByTicket`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询条件分类列表
// export async function gerTreeConditionCategory() {
//   const res = await axiosInstance.get(`${conditionUrl}/treeConditionCategory`);
//   return res;
// }

// 根据条件查询企业信息
export async function queryEntInfo(json) {
  const res = await axiosInstance.post(`${imageUrl}/queryEntInfo`, json, {
    timeout: -1,
  });
  return res;
}

// 科技创新情况信息
export async function queryTechDetails(json) {
  const res = await axiosInstance.post(`${techUrl}/queryDetails`, json, {
    timeout: -1,
  });
  return res;
}

// 企业基本情况分析
export async function queryEntInfoAnalyse(json) {
  const res = await axiosInstance.post(
    `${imageUrl}/queryEntInfoAnalyse`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 集团画像查询
export async function queryGroupPortray(json) {
  const res = await axiosInstance.post(`${imageUrl}/queryGroupPortray`, json, {
    timeout: -1,
  });
  return res;
}

// 集团架构
export async function queryStructure(json) {
  const res = await axiosInstance.post(`${strucUrl}/query`, json, {
    timeout: -1,
  });
  return res;
}

// 集团架构根据名称筛选
export async function pathQuery(json) {
  const res = await axiosInstance.post(`${strucUrl}/pathQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 集团架构根据名称筛选
export async function domesticPathQuery(json) {
  const res = await axiosInstance.post(`${strucUrl}/domesticPathQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 查询当前企业顶级集团的行业类选选项
export async function industryQuery(json) {
  const res = await axiosInstance.post(`${strucUrl}/industryQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 获取当前企业的集团及层级
export async function levelQuery(json) {
  const res = await axiosInstance.post(`${primetonUrl}/levelQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 获取当前企业的上游Top10供销客户
export async function queryUpperEnt(json) {
  const res = await axiosInstance.post(`${transUrl}/queryUpperEnt`, json, {
    timeout: -1,
  });
  return res;
}

// 获取当前企业的下游Top10供销客户
export async function queryLowerEnt(json) {
  const res = await axiosInstance.post(`${transUrl}/queryLowerEnt`, json, {
    timeout: -1,
  });
  return res;
}

// 获取当前企业的上下游交易信息
export async function queryStatisticReceipt(json) {
  const res = await axiosInstance.post(
    `${transUrl}/queryStatisticReceipt`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 货物分类占比查询
export async function queryGoodsClassify(json) {
  const res = await axiosInstance.post(`${transUrl}/queryGoodsClassify`, json, {
    timeout: -1,
  });
  return res;
}

// 负面事件分析查询
export async function negAnalyseQuery(json) {
  const res = await axiosInstance.post(`${negUrl}/negAnalyseQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 负面事件查询
export async function negEventQuery(json) {
  const res = await axiosInstance.post(`${negUrl}/negEventQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 查询企业商标和专利统计
export async function queryPatentAndBrandStatics(json) {
  const res = await axiosInstance.post(
    `${entImageUrl}/queryPatentAndBrandStatics`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}
// 查询专利明细
export async function queryPatentDetail(json) {
  const res = await axiosInstance.post(
    `${innovateUrl}/queryPatentDetail`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}
// 查询商标明细
export async function queryBrandDetaill(json) {
  const res = await axiosInstance.post(
    `${innovateUrl}/queryBrandDetail`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}
// 主要成员查询
export async function queryMainNember(json) {
  const res = await axiosInstance.post(`${entImageUrl}/queryMainNember`, json, {
    timeout: -1,
  });
  return res;
}

// 查询法院来源
export async function courtSourceQuery(json) {
  const res = await axiosInstance.post(`${negUrl}/courtSourceQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 获取指定企业行政许可来源机构
export async function queryAgenciesGivenLicence(json) {
  const res = await axiosInstance.post(
    `${entImageUrl}/queryAgenciesGivenLicence`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询行政许可汇总
export async function queryLicensingStatics(json) {
  const res = await axiosInstance.post(
    `${entImageUrl}/queryLicensingStatics`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询判决身份
export async function identityQuery(json) {
  const res = await axiosInstance.post(`${negUrl}/identityQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 司法案件明细
export async function justiceDetailQuery(json) {
  const res = await axiosInstance.post(`${negUrl}/justiceDetailQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 行政处罚明细
export async function adminPunDetailQuery(json) {
  const res = await axiosInstance.post(`${negUrl}/adminPunDetailQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 失信行为明细
export async function discreditBehaviorQuery(json) {
  const res = await axiosInstance.post(
    `${negUrl}/discreditBehaviorQuery`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 严重失信名单查询
export async function seriousFaithQuery(json) {
  const res = await axiosInstance.post(`${negUrl}/seriousFaithQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 涉税违法明细查询
export async function taxDetailQuery(json) {
  const res = await axiosInstance.post(`${negUrl}/taxDetailQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 司法事件强制执行明细
export async function enforceDetailQuery(json) {
  const res = await axiosInstance.post(`${negUrl}/enforceDetailQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 负面事件数量趋势查询
export async function negCountQuery(json) {
  const res = await axiosInstance.post(`${negUrl}/negCountQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 行政许可明细查询
export async function adminLicDetailQuery(json) {
  const res = await axiosInstance.post(`${fusUrl}/adminLicDetailQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 保存素材   todo  mock接口
// export async function saveMaterial(json) {
//   const res = await axiosInstance.post(
//     "http://172.16.215.62:4523/m1/4564754-0-default/saveMaterial/saveMaterial",
//     json,
//     {
//       timeout: -1,
//     }
//   );
//   return res;
// }
export async function saveMaterial(json) {
  const res = await axiosInstance.post(
    `/pierce/saveMaterial/saveMaterial`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 获取购方货物品类信息
export async function buyerGoodsDetail(json) {
  const res = await axiosInstance.post(`${asFusUrl}/buyerGoodsDetail`, json, {
    timeout: -1,
  });
  return res;
}

// 获取销方货物品类信息
export async function sellerGoodsDetail(json) {
  const res = await axiosInstance.post(`${asFusUrl}/sellerGoodsDetail`, json, {
    timeout: -1,
  });
  return res;
}

// 获取购方货物价格趋势
export async function buyerGoodsPirce(json) {
  const res = await axiosInstance.post(`${asFusUrl}/buyerGoodsPirce`, json, {
    timeout: -1,
  });
  return res;
}

// 获取销方货物价格趋势
export async function sellerGoodsPirce(json) {
  const res = await axiosInstance.post(`${asFusUrl}/sellerGoodsPirce`, json, {
    timeout: -1,
  });
  return res;
}

// 获取销方货物Top10+1
export async function sellerGoodsTop10(json) {
  const res = await axiosInstance.post(`${asFusUrl}/sellerGoodsTop10`, json, {
    timeout: -1,
  });
  return res;
}

// 获取购方货物Top10+1
export async function buyerGoodsTop10(json) {
  const res = await axiosInstance.post(`${asFusUrl}/buyerGoodsTop10`, json, {
    timeout: -1,
  });
  return res;
}

// 发票明细
export async function billDetail(json) {
  const res = await axiosInstance.post(`${asFusUrl}/billDetail`, json, {
    timeout: -1,
  });
  return res;
}

// 发票商品分类查询
export async function billTab(json) {
  const res = await axiosInstance.post(`${asFusUrl}/billTab`, json, {
    timeout: -1,
  });
  return res;
}

// 企业标签查询
export async function queryEntLable(json) {
  const res = await axiosInstance.post(`${labelUrl}/queryEntLable`, json, {
    timeout: -1,
  });
  return res;
}

// 企业特征列表
export async function queryEntLableFeatures(json) {
  const res = await axiosInstance.post(
    `${labelUrl}/queryEntLableFeatures`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 标签判定结果
export async function queryLabelJudge(json) {
  const res = await axiosInstance.post(`${labelUrl}/queryLabelJudge`, json, {
    timeout: -1,
  });
  return res;
}

// 历史沿革明细查询
export async function historyDetail(json) {
  const res = await axiosInstance.post(`${historyUrl}/historyDetail`, json, {
    timeout: -1,
  });
  return res;
}

// 历史沿革列表
export async function historyList(json) {
  const res = await axiosInstance.post(`${historyUrl}/historyList`, json, {
    timeout: -1,
  });
  return res;
}

// 历史沿革大类接口
export async function historyTab(json) {
  const res = await axiosInstance.post(`${historyUrl}/historyTab`, json, {
    timeout: -1,
  });
  return res;
}

// 历史沿革子类接口
export async function queryEventChildType(json) {
  const res = await axiosInstance.post(
    `${historyUrl}/queryEventChildType`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询集团架构明细数据
export async function queryStructureDetails(json) {
  const res = await axiosInstance.post(
    `${entPortUrl}/queryStructureDetails`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 集团分析
export async function structureAnalyse(json) {
  const res = await axiosInstance.post(`${entPortUrl}/structureAnalyse`, json, {
    timeout: -1,
  });
  return res;
}

// 金字塔接口
export async function queryEntLevelCount(json) {
  const res = await axiosInstance.post(
    `${entPortUrl}/queryEntLevelCount`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询企业某一年度企业数据
export async function queryEntDataByYear(json) {
  const res = await axiosInstance.post(
    `${entPortUrl}/queryEntDataByYear`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询企业数量分布
export async function queryEntCountDistribute(json) {
  const res = await axiosInstance.post(
    `${entPortUrl}/queryEntCountDistribute`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询企业营收分布
export async function queryEntYysryDistribute(json) {
  const res = await axiosInstance.post(
    `${entPortUrl}/queryEntYysryDistribute`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询纳税金额分布
export async function queryEntTaxPayment(json) {
  const res = await axiosInstance.post(
    `${entPortUrl}/queryEntTaxPayment`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询子集团画像金字塔
export async function queryChildEntLevelCount(json) {
  const res = await axiosInstance.post(
    `${entPortUrl}/queryChildEntLevelCount`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询子集团画像明细数据
export async function queryChildEntDataByYear(json) {
  const res = await axiosInstance.post(
    `${entPortUrl}/queryChildEntDataByYear`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 查询子集团画像明细数据
export async function queryChildEntDataByYears(json) {
  const res = await axiosInstance.post(
    `${entPortUrl}/queryChildEntDataByYears`,
    json,
    {
      timeout: -1,
    }
  );
  return res;
}

// 经营页签图表
export async function ecoTable(json) {
  const res = await axiosInstance.post(`${basicUrl}/ecoTable`, json, {
    timeout: -1,
  });
  return res;
}

// 财务页签图表
export async function financeTable(json) {
  const res = await axiosInstance.post(`${basicUrl}/financeTable`, json, {
    timeout: -1,
  });
  return res;
}

// 明细标签查询（筛选项）
export async function ecoDetailsTab(json) {
  const res = await axiosInstance.post(`${basicUrl}/ecoDetailsTab`, json, {
    timeout: -1,
  });
  return res;
}

// 分页查询经营财务状况
export async function ecoDetailsQuery(json) {
  const res = await axiosInstance.post(`${basicUrl}/ecoDetailsQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 科技创新折线图
export async function cnTechInnovative(json) {
  const res = await axiosInstance.post(`${basicUrl}/cnTechInnovative`, json, {
    timeout: -1,
  });
  return res;
}

// 行政许可Tab查询
export async function adminLicTabQuery(json) {
  const res = await axiosInstance.post(`${fusUrl}/adminLicTabQuery`, json, {
    timeout: -1,
  });
  return res;
}

// 查询科技创新Tab

export async function queryPatentTab(json) {
  const res = await axiosInstance.post(`${innovateUrl}/queryPatentTab`, json, {
    timeout: -1,
  });
  return res;
}
