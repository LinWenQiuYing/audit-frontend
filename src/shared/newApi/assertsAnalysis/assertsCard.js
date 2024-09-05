//资产分析
import axiosInstance from "../index.js";

const assertsUrl = "/pierce/dacp/invoke";

//------四个tab页面
export async function getAssertsTableHouse(req) {
  // 打印视图层的入参请求
  console.log("getAssertsTableHouse req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " select count(*)  as total from CAS_FUS_SJ_ASSET_REAL_ESTATE_DETAIL_I_Y where 1=1 @[and unit_name like '%${param.unitName}%'] @[and dept_name like '%${param.deptName}%'] @[and block_name like '%${param.blockName}%'] @[and GB_Large_Class like '%${param.gblargeClass}%'] @[and Asset_No like '%${param.assetNo}%'] @[and Asset_ID like '%${param.assetId}%'] @[and Asset_Class_Name like '%${param.assetName}%'] @[and Asset_Large_Class like '%${param.assetLargeClass}%'] @[and Acquisition_Date between '${param.acStartDate}' and '${param.acEndDate}'] @[and Bookkeeping_Date between '${param.bookStartDate}' and '${param.bookEndDate}']",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getAssertsTableHouse dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${assertsUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getAssertsTableHouse dacpTotalRes: ",
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
      " select unit_code as unitCode, Asset_No as assetNo, '房产' as assetType, id, Asset_Name as zcmc, Asset_No as zcbh, Asset_Class_Name as zcfl, unit_name as ssdw, date(Bookkeeping_Date) as jzrq, round(Net_Value,2) as zcjz, case when Location is null or length(Location)=0 then '--' else Location end as other from CAS_FUS_SJ_ASSET_REAL_ESTATE_DETAIL_I_Y where 1=1 @[and unit_name like '%${param.unitName}%'] @[and dept_name like '%${param.deptName}%'] @[and block_name like '%${param.blockName}%'] @[and GB_Large_Class like '%${param.gblargeClass}%'] @[and Asset_No like '%${param.assetNo}%'] @[and Asset_ID like '%${param.assetId}%'] @[and Asset_Class_Name like '%${param.assetName}%'] @[and Asset_Large_Class like '%${param.assetLargeClass}%'] @[and Acquisition_Date between '${param.acStartDate}' and '${param.acEndDate}'] @[and Bookkeeping_Date between '${param.bookStartDate}' and '${param.bookEndDate}'] @[order by ${param.odName}] @[limit ${param.pageSize} offset ${param.pageOffset}];",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getAssertsTableHouse dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${assertsUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getAssertsTableHouse dacpDetailRes: ",
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
      cardData: dacpDetailRes.data,
    },
  };
  console.log("getAssertsTableHouse res: ", JSON.stringify(res));
  return res;
}

//房屋排序
export async function getAssertsTableHouseSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "资产编号", value: "zcbh", "type": "string" },
      { label: "资产名称", value: "zcmc", "type": "string" },
      { label: "资产分类", value: "zcfl", "type": "string" },
      { label: "所属单位", value: "ssdw", "type": "string" },
      { label: "记账日期", value: "jzrq", "type": "string" },
      { label: "资产净值", value: "zcjz", "type": "number" }
    ],
  }
  return res;
}

export async function getAssertsTableCar(req) {
  // 打印视图层的入参请求
  console.log("getAssertsTableCar req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " select count(*)  as total from CAS_FUS_SJ_ASSET_VEHICLES_DETAIL_I_Y where 1=1 @[and unit_name like '%${param.unitName}%'] @[and dept_name like '%${param.deptName}%'] @[and block_name like '%${param.blockName}%'] @[and GB_Large_Class like '%${param.gblargeClass}%'] @[and Asset_No like '%${param.assetNo}%'] @[and Asset_ID like '%${param.assetId}%'] @[and Asset_Class_Name like '%${param.assetName}%'] @[and Asset_Large_Class like '%${param.assetLargeClass}%'] @[and Acquisition_Date between '${param.acStartDate}' and '${param.acEndDate}'] @[and Bookkeeping_Date between '${param.bookStartDate}' and '${param.bookEndDate}']",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getAssertsTableCar dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${assertsUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getAssertsTableCar dacpTotalRes: ",
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
      " select unit_code as unitCode, Asset_No as assetNo, '车辆' as assetType,id, Asset_Name as zcmc, Asset_No as zcbh, Asset_Class_Name as zcfl, unit_name as ssdw, date(Bookkeeping_Date) as jzrq, round(Net_Value,2) as zcjz, case when License_No is null or length(License_No)=0 then '--' else License_No end as other from CAS_FUS_SJ_ASSET_VEHICLES_DETAIL_I_Y where 1=1 @[and unit_name like '%${param.unitName}%'] @[and dept_name like '%${param.deptName}%'] @[and block_name like '%${param.blockName}%'] @[and GB_Large_Class like '%${param.gblargeClass}%'] @[and Asset_No like '%${param.assetNo}%'] @[and Asset_ID like '%${param.assetId}%'] @[and Asset_Class_Name like '%${param.assetName}%'] @[and Asset_Large_Class like '%${param.assetLargeClass}%'] @[and Acquisition_Date between '${param.acStartDate}' and '${param.acEndDate}'] @[and Bookkeeping_Date between '${param.bookStartDate}' and '${param.bookEndDate}'] @[order by ${param.odName}] @[limit ${param.pageSize} offset ${param.pageOffset}];",  
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getAssertsTableCar dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${assertsUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getAssertsTableCar dacpDetailRes: ",
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
      cardData: dacpDetailRes.data,
    },
  };
  console.log("getAssertsTableCar res: ", JSON.stringify(res));
  return res;
}

//车辆排序
export async function getAssertsTableCarSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "资产编号", value: "zcbh", "type": "string" },
      { label: "资产名称", value: "zcmc", "type": "string" },
      { label: "资产分类", value: "zcfl", "type": "string" },
      { label: "所属单位", value: "ssdw", "type": "string" },
      { label: "记账日期", value: "jzrq", "type": "string" },
      { label: "资产净值", value: "zcjz", "type": "number" }
    ],
  }
  return res;
}


export async function getAssertsTableLand(req) {
  // 打印视图层的入参请求
  console.log("getAssertsTableLand req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " select count(*) as total  from CAS_FUS_SJ_ASSET_LAND_DETAIL_I_Y where 1=1 @[and unit_name like '%${param.unitName}%'] @[and dept_name like '%${param.deptName}%'] @[and block_name like '%${param.blockName}%'] @[and GB_Large_Class like '%${param.gblargeClass}%'] @[and Asset_No like '%${param.assetNo}%'] @[and Asset_ID like '%${param.assetId}%'] @[and Asset_Class_Name like '%${param.assetName}%'] @[and Asset_Large_Class like '%${param.assetLargeClass}%'] @[and Acquisition_Date between '${param.acStartDate}' and '${param.acEndDate}'] @[and Bookkeeping_Date between '${param.bookStartDate}' and '${param.bookEndDate}']",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getAssertsTableLand dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${assertsUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getAssertsTableLand dacpTotalRes: ",
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
      " select  unit_code as unitCode, Asset_No as assetNo,  '土地' as assetType, id, Asset_Name as zcmc, Asset_No as zcbh, Asset_Class_Name as zcfl, unit_name as ssdw, date(Bookkeeping_Date) as jzrq, round(Net_Value,2) as zcjz, case when Location is null or length(Location)=0 then '--' else Location end as other from CAS_FUS_SJ_ASSET_LAND_DETAIL_I_Y where 1=1 @[and unit_name like '%${param.unitName}%'] @[and dept_name like '%${param.deptName}%'] @[and block_name like '%${param.blockName}%'] @[and GB_Large_Class like '%${param.gblargeClass}%'] @[and Asset_No like '%${param.assetNo}%'] @[and Asset_ID like '%${param.assetId}%'] @[and Asset_Class_Name like '%${param.assetName}%'] @[and Asset_Large_Class like '%${param.assetLargeClass}%'] @[and Acquisition_Date between '${param.acStartDate}' and '${param.acEndDate}'] @[and Bookkeeping_Date between '${param.bookStartDate}' and '${param.bookEndDate}'] @[order by ${param.odName}] @[limit ${param.pageSize} offset ${param.pageOffset}];",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getAssertsTableLand dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${assertsUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getAssertsTableLand dacpDetailRes: ",
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
      cardData: dacpDetailRes.data,
    },
  };
  console.log("getAssertsTableLand res: ", JSON.stringify(res));
  return res;
}

//土地排序
export async function getAssertsTableLandSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "资产编号", value: "zcbh", "type": "string" },
      { label: "资产名称", value: "zcmc", "type": "string" },
      { label: "资产分类", value: "zcfl", "type": "string" },
      { label: "所属单位", value: "ssdw", "type": "string" },
      { label: "记账日期", value: "jzrq", "type": "string" },
      { label: "资产净值", value: "zcjz", "type": "number" }
    ],
  }
  return res;
}

export async function getAssertsTableOther(req) {
  // 打印视图层的入参请求
  console.log("getAssertsTableOther req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " select count(*) as total from CAS_FUS_SJ_ASSET_OTHERS_DETAIL_I_Y where 1=1 @[and unit_name like '%${param.unitName}%'] @[and dept_name like '%${param.deptName}%'] @[and block_name like '%${param.blockName}%'] @[and GB_Large_Class like '%${param.gblargeClass}%'] @[and Asset_No like '%${param.assetNo}%'] @[and Asset_ID like '%${param.assetId}%'] @[and Asset_Class_Name like '%${param.assetName}%'] @[and Asset_Large_Class like '%${param.assetLargeClass}%'] @[and Acquisition_Date between '${param.acStartDate}' and '${param.acEndDate}'] @[and Bookkeeping_Date between '${param.bookStartDate}' and '${param.bookEndDate}']",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getAssertsTableOther dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${assertsUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getAssertsTableOther dacpTotalRes: ",
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
      " select  unit_code as unitCode, Asset_No as assetNo, '其他' as assetType, id, Asset_Name as zcmc, Asset_No as zcbh, Asset_Class_Name as zcfl, unit_name as ssdw, date(Bookkeeping_Date)  as jzrq, round(Net_Value,2) as zcjz from CAS_FUS_SJ_ASSET_OTHERS_DETAIL_I_Y where 1=1 @[and unit_name like '%${param.unitName}%'] @[and dept_name like '%${param.deptName}%'] @[and block_name like '%${param.blockName}%'] @[and GB_Large_Class like '%${param.gblargeClass}%'] @[and Asset_No like '%${param.assetNo}%'] @[and Asset_ID like '%${param.assetId}%'] @[and Asset_Class_Name like '%${param.assetName}%'] @[and Asset_Large_Class like '%${param.assetLargeClass}%'] @[and Acquisition_Date between '${param.acStartDate}' and '${param.acEndDate}'] @[and Bookkeeping_Date between '${param.bookStartDate}' and '${param.bookEndDate}'] @[order by ${param.odName}] @[limit ${param.pageSize} offset ${param.pageOffset}];",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getAssertsTableOther dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${assertsUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getAssertsTableOther dacpDetailRes: ",
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
      cardData: dacpDetailRes.data,
    },
  };
  console.log("getAssertsTableOther res: ", JSON.stringify(res));
  return res;
}

//其他排序
export async function getAssertsTableOtherSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      { label: "资产编号", value: "zcbh", "type": "string" },
      { label: "资产名称", value: "zcmc", "type": "string" },
      { label: "资产分类", value: "zcfl", "type": "string" },
      { label: "所属单位", value: "ssdw", "type": "string" },
      { label: "记账日期", value: "jzrq", "type": "string" },
      { label: "资产净值", value: "zcjz", "type": "number" }
    ],
  }
  return res;
}

//右侧弹窗
//基本信息   会给到入参显示是房屋、土地、车辆还是其他，不支持再分成四个接口
export async function getAssertsDrawerOne(req) {
  // 打印视图层的入参请求
  console.log("getAssertsDrawerOne req: ", JSON.stringify(req));

  // 根据请求入参确定查询语句
  let sqlTemplate = "";
  switch (req.assetType) {
    case "房产":
      sqlTemplate =
        "SELECT Asset_No, Asset_Name, unit_code, unit_name, Card_Type, Card_Status, Audit_Status, Latest_Flag, Original_Value, Net_Value, Quantity_Area, Quantity_Unit, Unit_Price, Voucher_No, Bookkeeping_Date, Use_Purpose_Code, Business_Seq, Acquisition_Code, Acquisition_Name, Start_Use_Date, Disposal_Date, disp_meth_code, disp_proceed, Asset_Class_Code, Asset_Class_Name, Asset_Large_Class, GB_Large_Class, finance_area_code, finance_area_name, Asset_ID, Business_ID FROM CAS_FUS_SJ_ASSET_REAL_ESTATE_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND Asset_No = '${param.assetNo}'];";
      break;
    case "车辆":
      sqlTemplate =
        "SELECT Asset_No, Asset_Name, unit_code, unit_name, Card_Type, Card_Status, Audit_Status, Latest_Flag, Original_Value, Net_Value, Quantity_Area, Quantity_Unit, Unit_Price, Voucher_No, Bookkeeping_Date, Use_Purpose_Code, Business_Seq, Acquisition_Code, Acquisition_Name, Start_Use_Date, Disposal_Date, disp_meth_code, disp_proceed, Asset_Class_Code, Asset_Class_Name, Asset_Large_Class, GB_Large_Class, finance_area_code, finance_area_name, Asset_ID, Business_ID FROM CAS_FUS_SJ_ASSET_VEHICLES_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND Asset_No = '${param.assetNo}'];";
      break;
    case "土地":
      sqlTemplate =
        "SELECT Asset_No, Asset_Name, unit_code, unit_name, Card_Type, Card_Status, Audit_Status, Latest_Flag, Original_Value, Net_Value, Quantity_Area, Quantity_Unit, Unit_Price, Voucher_No, Bookkeeping_Date, Use_Purpose_Code, Business_Seq, Acquisition_Code, Acquisition_Name, Start_Use_Date, Disposal_Date, disp_meth_code, disp_proceed, Asset_Class_Code, Asset_Class_Name, Asset_Large_Class, GB_Large_Class, finance_area_code, finance_area_name, Asset_ID, Business_ID FROM CAS_FUS_SJ_ASSET_LAND_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND Asset_No = '${param.assetNo}'];";
      break;
    case "其他":
      sqlTemplate =
        "SELECT Asset_No, Asset_Name, unit_code, unit_name, Card_Type, Card_Status, Audit_Status, Latest_Flag, Original_Value, Net_Value, Quantity_Area, Quantity_Unit, Unit_Price, Voucher_No, Bookkeeping_Date, Use_Purpose_Code, Business_Seq, Acquisition_Code, Acquisition_Name, Start_Use_Date, Disposal_Date, disp_meth_code, disp_proceed, Asset_Class_Code, Asset_Class_Name, Asset_Large_Class, GB_Large_Class, finance_area_code, finance_area_name, Asset_ID, Business_ID FROM CAS_FUS_SJ_ASSET_OTHERS_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND Asset_No = '${param.assetNo}'];";
      break;
    default:
      break;
  }

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: sqlTemplate,
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getAssertsDrawerOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAssertsDrawerOne dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(Data){

    function formatNumber(num){
        if(num === "" || num === null) return "0元";
        return Number((parseFloat(num,10)).toFixed(2)).toLocaleString() + "元";
    }

    const inputData = Data[0];
    const result = [
        {
            label: "资产编号：",
            value: inputData.Asset_No
        },
        {
            label: "资产名称：",
            value: inputData.Asset_Name
        },
        {
            label: "单位代码：",
            value: inputData.unit_code
        },
        {
            label: "单位名称：",
            value: inputData.unit_name
        },
        {
            label: "卡片类型：",
            value: inputData.Card_Type
        },
        {
            label: "卡片状态：",
            value: inputData.Card_Status
        },
        {
            label: "审核状态：",
            value: inputData.Audit_Status
        },
        {
            label: "是否最新：",
            value: inputData.Latest_Flag
        },
        {
            label: "资产原值：",
            value: formatNumber(inputData.Original_Value)
        },
        {
            label: "净值：",
            value: formatNumber(inputData.Net_Value)
        },
        {
            label: "数量或面积：",
            value: inputData.Quantity_Area
        },
        {
            label: "数量计量单位：",
            value: inputData.Quantity_Unit
        },
        {
            label: "均价或单价：",
            value: inputData.Unit_Price
        },
        {
            label: "记账凭证号：",
            value: inputData.Voucher_No
        },
        {
            label: "记账日期：",
            value: inputData.Bookkeeping_Date
        },
        {
            label: "资产用途代码：",
            value: inputData.Use_Purpose_Code
        },
        {
            label: "业务序列：",
            value: inputData.Business_Seq
        },
        {
            label: "取得方式代码：",
            value: inputData.Acquisition_Code
        },
        {
            label: "取得方式名称：",
            value: inputData.Acquisition_Name
        },
        {
            label: "投入使用日期：",
            value: inputData.Start_Use_Date
        },
        {
            label: "处置时间：",
            value: inputData.Disposal_Date
        },
        {
            label: "处置形式代码：",
            value: inputData.disp_meth_code
        },
        {
            label: "处置收益：",
            value: formatNumber(inputData.disp_proceed)
        },
        {
            label: "资产分类代码：",
            value: inputData.Asset_Class_Code
        },
        {
            label: "资产分类名称：",
            value: inputData.Asset_Class_Name
        },
        {
            label: "资产大类：",
            value: inputData.Asset_Large_Class
        },
        {
            label: "国标大类：",
            value: inputData.GB_Large_Class
        },
        {
            label: "财政区划编码：",
            value: inputData.finance_area_code
        },
        {
            label: "财政区划名称：",
            value: inputData.finance_area_name
        },
        {
            label: "资产主键：",
            value: inputData.Asset_ID
        },
        {
            label: "业务唯一标识：",
            value: inputData.Business_ID
        },
        
    ];
    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAssertsDrawerOne res: ", JSON.stringify(res));
  return res;
}

//详细信息 会给到入参显示是房屋、土地、车辆还是其他，不支持再分成四个接口
export async function getAssertsDrawerTwo(req) {
  // 打印视图层的入参请求
  console.log("getAssertsDrawerTwo req: ", JSON.stringify(req));

  // 根据请求入参确定查询语句
  let sqlTemplate = "";
  switch (req.assetType) {
    case "房产":
      sqlTemplate =
        "SELECT Prop_Nature, Own_Form, Own_Certificate, Cert_Issue, Cert_Number, Own_Area, Owner, Use_Type, Exclusive_Area, Shared_Area, Location, In_Use_Area, Rental_Area, Loan_Area, Idle_Area, Disposal_Area, In_Use_Value, Rental_Value, Loan_Value, Idle_Value, Disposal_Value, Completion_Date, Building_Struc, Dangerous_Area, Heating_Area, Land_Area, Res_Units, Project_Invest, Delivery_Date FROM CAS_FUS_SJ_ASSET_REAL_ESTATE_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND Asset_No = '${param.assetNo}'];";
      break;
    case "车辆":
      sqlTemplate =
        "SELECT Prep_Status, Supplier, Purchase_No, Invoice_No, Vehicle_Cert, Brand, Specs, Vehicle_Type, License_No, Vehicle_Owner, Engine_No, VIN, Vehicle_Origin, Displacement, Warranty_Date, Reg_Date, Manufacturer, Product_No FROM CAS_FUS_SJ_ASSET_VEHICLES_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND Asset_No = '${param.assetNo}'];";
      break;
    case "土地":
      sqlTemplate =
        "SELECT Prop_Nature, Own_Form, Own_Certificate, Cert_Issue, Cert_Number, Own_Area, Owner, Use_Type, Exclusive_Area, Shared_Area, Location, In_Use_Area, Rental_Area, Loan_Area, Idle_Area, Disposal_Area, In_Use_Value, Rental_Value, Loan_Value, Idle_Value, Disposal_Value, Completion_Date, Building_Struc, Dangerous_Area, Heating_Area, Land_Area, Res_Units, Project_Invest, Delivery_Date FROM CAS_FUS_SJ_ASSET_LAND_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND Asset_No = '${param.assetNo}'];";
      break;
    case "其他":
      sqlTemplate =
        "SELECT is_oper_inf, pub_infra_c, charge_yrs, rem_charge, gov_reserve, reserve_yr, cult_herit, address, note FROM CAS_FUS_SJ_ASSET_OTHERS_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND Asset_No = '${param.assetNo}'];";
      break;
    default:
      break;
  }

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate: sqlTemplate,
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getAssertsDrawerTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getAssertsDrawerTwo dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  //详细信息-房产
  function transformDataHouse(inputData) {
    const data = inputData[0];
    const result = [
      {
        label: "权属性质代码：",
        value: data.Prop_Nature,
      },
      {
        label: "产权形式代码：",
        value: data.Own_Form,
      },
      {
        label: "权属证明：",
        value: data.Own_Certificate,
      },
      {
        label: "发证日期：",
        value: data.Cert_Issue,
      },
      {
        label: "权属证号：",
        value: data.Cert_Number,
      },
      {
        label: "权属面积：",
        value: data.Own_Area,
      },
      {
        label: "权属人：",
        value: data.Owner,
      },
      {
        label: "使用权类型：",
        value: data.Use_Type,
      },
      {
        label: "独用面积：",
        value: data.Exclusive_Area,
      },
      {
        label: "分摊面积：",
        value: data.Shared_Area,
      },
      {
        label: "坐落位置：",
        value: data.Location,
      },
      {
        label: "在用面积：",
        value: data.In_Use_Area,
      },
      {
        label: "出租面积：",
        value: data.Rental_Area,
      },
      {
        label: "出借面积：",
        value: data.Loan_Area,
      },
      {
        label: "闲置面积：",
        value: data.Idle_Area,
      },
      {
        label: "待处置待报废或毁损等面积：",
        value: data.Disposal_Area,
      },
      {
        label: "在用价值：",
        value: data.In_Use_Value,
      },
      {
        label: "出租价值：",
        value: data.Rental_Value,
      },
      {
        label: "出借价值：",
        value: data.Loan_Value,
      },
      {
        label: "闲置价值：",
        value: data.Idle_Value,
      },
      {
        label: "待处置待报废或毁损等价值：",
        value: data.Disposal_Value,
      },
      {
        label: "竣工决算日期：",
        value: data.Completion_Date,
      },
      {
        label: "建筑结构：",
        value: data.Building_Struc,
      },
      {
        label: "危房面积：",
        value: data.Dangerous_Area,
      },
      {
        label: "取暖面积：",
        value: data.Heating_Area,
      },
      {
        label: "占地面积：",
        value: data.Land_Area,
      },
      {
        label: "住宅套数：",
        value: data.Res_Units,
      },
      {
        label: "项目总投资：",
        value: data.Project_Invest,
      },
      {
        label: "交付使用日期：",
        value: data.Delivery_Date,
      },
    ];
    return result;
  }

  //详细信息-车辆
  function transformDataCar(inputData) {
    const data = inputData[0];
    const result = [
      {
        label: "资产编制情况代码：",
        value: data.Prep_Status,
      },
      {
        label: "供应商：",
        value: data.Supplier,
      },
      {
        label: "采购合同编号：",
        value: data.Purchase_No,
      },
      {
        label: "发票号：",
        value: data.Invoice_No,
      },
      {
        label: "车辆行驶证：",
        value: data.Vehicle_Cert,
      },
      {
        label: "品牌：",
        value: data.Brand,
      },
      {
        label: "规格型号：",
        value: data.Specs,
      },
      {
        label: "车辆类型：",
        value: data.Vehicle_Type,
      },
      {
        label: "车牌号：",
        value: data.License_No,
      },
      {
        label: "车辆所有人：",
        value: data.Vehicle_Owner,
      },
      {
        label: "发动机号：",
        value: data.Engine_No,
      },
      {
        label: "车辆识别代码：",
        value: data.VIN,
      },
      {
        label: "车辆产地：",
        value: data.Vehicle_Origin,
      },
      {
        label: "汽车排气量代码：",
        value: data.Displacement,
      },
      {
        label: "保修截止日期：",
        value: data.Warranty_Date,
      },
      {
        label: "注册日期：",
        value: data.Reg_Date,
      },
      {
        label: "生产厂家：",
        value: data.Manufacturer,
      },
      {
        label: "产品序列号：",
        value: data.Product_No,
      },
    ];
    return result;
  }

  //详细信息-土地
  function transformDataLand(inputData) {
    const data = inputData[0];
    const result = [
      {
        label: "权属性质代码：",
        value: data.Prop_Nature,
      },
      {
        label: "产权形式代码：",
        value: data.Own_Form,
      },
      {
        label: "权属证明：",
        value: data.Own_Certificate,
      },
      {
        label: "发证日期：",
        value: data.Cert_Issue,
      },
      {
        label: "权属证号：",
        value: data.Cert_Number,
      },
      {
        label: "权属面积：",
        value: data.Own_Area,
      },
      {
        label: "权属人：",
        value: data.Owner,
      },
      {
        label: "使用权类型：",
        value: data.Use_Type,
      },
      {
        label: "独用面积：",
        value: data.Exclusive_Area,
      },
      {
        label: "分摊面积：",
        value: data.Shared_Area,
      },
      {
        label: "坐落位置：",
        value: data.Location,
      },
      {
        label: "在用面积：",
        value: data.In_Use_Area,
      },
      {
        label: "出租面积：",
        value: data.Rental_Area,
      },
      {
        label: "出借面积：",
        value: data.Loan_Area,
      },
      {
        label: "闲置面积：",
        value: data.Idle_Area,
      },
      {
        label: "待处置待报废或毁损等面积：",
        value: data.Disposal_Area,
      },
      {
        label: "在用价值：",
        value: data.In_Use_Value,
      },
      {
        label: "出租价值：",
        value: data.Rental_Value,
      },
      {
        label: "出借价值：",
        value: data.Loan_Value,
      },
      {
        label: "闲置价值：",
        value: data.Idle_Value,
      },
      {
        label: "待处置待报废或毁损等价值：",
        value: data.Disposal_Value,
      },
      {
        label: "竣工决算日期：",
        value: data.Completion_Date,
      },
      {
        label: "建筑结构：",
        value: data.Building_Struc,
      },
      {
        label: "危房面积：",
        value: data.Dangerous_Area,
      },
      {
        label: "取暖面积：",
        value: data.Heating_Area,
      },
      {
        label: "占地面积：",
        value: data.Land_Area,
      },
      {
        label: "住宅套数：",
        value: data.Res_Units,
      },
      {
        label: "项目总投资：",
        value: data.Project_Invest,
      },
      {
        label: "交付使用日期：",
        value: data.Delivery_Date,
      },
    ];
    return result;
  }

  //详细信息-其他
  function transformDataOthers(inputData) {
    const data = inputData[0];
    const result = [
      {
        label: "是否经营性公共基础设施：",
        value: data.is_oper_inf,
      },
      {
        label: "公共基础设施分类代码：",
        value: data.pub_infra_c,
      },
      {
        label: "收费年限：",
        value: data.charge_yrs,
      },
      {
        label: "剩余收费年限：",
        value: data.rem_charge,
      },
      {
        label: "政府储备物资分类代码：",
        value: data.gov_reserve,
      },
      {
        label: "储备年限：",
        value: data.reserve_yr,
      },
      {
        label: "文物等级：",
        value: data.cult_herit,
      },
      {
        label: "地址：",
        value: data.address,
      },
      {
        label: "备注：",
        value: data.note,
      },
    ];
    return result;
  }

  // 根据请求类型确定转化函数
  let transformData = (data) => {
    return data;
  };
  switch (req.assetType) {
    case "房产": {
      transformData = transformDataHouse;
      break;
    }
    case "车辆": {
      transformData = transformDataCar;
      break;
    }
    case "土地": {
      transformData = transformDataLand;
      break;
    }
    case "其他": {
      transformData = transformDataOthers;
      break;
    }
    default:
      break;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getAssertsDrawerTwo res: ", JSON.stringify(res));
  return res;
}

//资产变动记录   会给到入参显示是房屋、土地、车辆还是其他，不支持再分成四个接口
export async function getAssertsDrawerThree(req) {
  // 打印视图层的入参请求
  console.log("getAssertsDrawerThree req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) AS total FROM CAS_FUS_SJ_ASSET_CHANGE_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND asset_no = '${param.assetNo}'];",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getAssertsDrawerThree dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${assertsUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getAssertsDrawerThree dacpTotalRes: ",
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
      "SELECT creation_time as cjsj, creator_name as cjrxm, change_reason as bdyy, application_date as sqrq, document_number as djbh, document_status as djzt, document_creator as zdr FROM CAS_FUS_SJ_ASSET_CHANGE_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND asset_no = '${param.assetNo}'] ORDER BY creation_time asc LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getAssertsDrawerThree dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${assertsUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getAssertsDrawerThree dacpDetailRes: ",
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
  console.log("getAssertsDrawerTwo res: ", JSON.stringify(res));
  return res;
}

//资产处置记录     会给到入参显示是房屋、土地、车辆还是其他，不支持再分成四个接口
export async function getAssertsDrawerFour(req) {
  // 打印视图层的入参请求
  console.log("getAssertsDrawerFour req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) AS total FROM CAS_FUS_SJ_ASSET_DISPOSAL_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND asset_no = '${param.assetNo}'];",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getAssertsDrawerFour dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${assertsUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getAssertsDrawerFour dacpTotalRes: ",
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
      "SELECT create_time as cjsj, creator_full_name as cjrxm, disp_form_code as czxsdm, recv_exchange_code as jshzhfdm, doc_id as djbh, doc_status as djzt, note as bz FROM CAS_FUS_SJ_ASSET_DISPOSAL_DETAIL_I_Y WHERE 1=1 @[AND unit_code = '${param.unitCode}'] @[AND asset_no = '${param.assetNo}'] ORDER BY create_time asc LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getAssertsDrawerFour dacpDetailReq: ",
    JSON.stringify(dacpDetailReq)
  );
  const dacpDetailRes = await axiosInstance.post(
    `${assertsUrl}`,
    dacpDetailReq,
    {
      timeout: -1,
    }
  );
  console.log(
    "getAssertsDrawerFour dacpDetailRes: ",
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
  console.log("getAssertsDrawerFour res: ", JSON.stringify(res));
  return res;
}
