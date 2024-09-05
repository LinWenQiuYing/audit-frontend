import axiosInstance from "../index.js";

const assertsUrl = "/pierce/dacp/invoke";

//------资产Tab页面
//资产概览
export async function getManageAssertsOverview(req) {
  // 打印视图层的入参请求
  console.log("getManageAssertsOverview req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT ROUND(Property_Tot / 10000,2) AS Property_Tot, ROUND(Property_Area,2) AS Property_Area, ROUND(Vehicle_Tot / 10000,2) AS Vehicle_Tot, ROUND(Vehicle_Num,2) AS Vehicle_Num, ROUND(Land_Tot / 10000,2) AS Land_Tot, ROUND(Land_Area,2) AS Land_Area, ROUND(Other_Tot / 10000,2) AS Other_Tot, ROUND(Asset_Tot / 10000,2) AS Asset_Tot, Staff_Tot, ROUND(Avg_Asset / 10000,2) AS Avg_Asset FROM CAS_FUS_SJ_ASSET_DEPT_OVERVIEW_I_Y WHERE 1=1 @[AND dept_Code = '${param.deptCode}'];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageAssertsOverview dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageAssertsOverview dacpRes: ", JSON.stringify(dacpRes));

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
    const data = inputData[0];
    const result = {
      overView: [
        {
          id: 1,
          typeName: "房产资产总额（万元）",
          num: data.Property_Tot,
          icon: "house",
        },
        {
          id: 2,
          typeName: "车辆资产总额（万元）",
          num: data.Vehicle_Tot,
          icon: "car",
        },
        {
          id: 3,
          typeName: "土地资产总额（万元）",
          num: data.Land_Tot,
          icon: "land",
        },
        {
          id: 4,
          typeName: "人均资产金额（万元）",
          num: data.Avg_Asset,
          icon: "person",
        },
        {
          id: 5,
          typeName: "房产资产面积（m²）",
          num: data.Property_Area,
          icon: "house",
        },
        {
          id: 6,
          typeName: "车辆资产数量（辆）",
          num: data.Vehicle_Num,
          icon: "car",
        },
        {
          id: 7,
          typeName: "土地资产面积（m²）",
          num: data.Land_Area,
          icon: "land",
        },
        {
          id: 8,
          typeName: "其他资产总额（万元）",
          num: data.Other_Tot,
          icon: "others",
        },
      ],
      total: data.Asset_Tot,
    };
    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageAssertsOverview res: ", JSON.stringify(res));
  return res;
}

//当前资产分布（按专项资产类型）  环形图
export async function getManageAssertsGraphOne(req) {
  // 打印视图层的入参请求
  console.log("getManageAssertsGraphOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT ROUND(dept_asset_value / 10000, 2) AS dept_asset_value, asset_type, ROUND(type_asset_value / 10000, 2) AS type_asset_value, ROUND(type_asset_ratio * 100, 2) AS type_asset_ratio FROM CAS_FUS_SJ_ASSET_TYPE_DISTR_I_Y WHERE 1=1 @[AND dept_code = '${param.deptCode}'];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageAssertsGraphOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageAssertsGraphOne dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData, year){
    const result = {
        year: year,
        total: inputData.length > 0 ? (inputData[0].dept_asset_value === null ? 0 : inputData[0].dept_asset_value) : 0,
        seriesData: []
    };

    inputData.forEach(item => {
        result.seriesData.push({
            value: item.type_asset_value === null ? 0 : item.type_asset_value,
            name: item.asset_type,
            rate: item.type_asset_ratio === null ? 0 : item.type_asset_ratio
        });
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManageAssertsGraphOne res: ", JSON.stringify(res));
  return res;
}

//当前资产分布情况 表格
export async function getManageAssertsTableOne(req) {
  // 打印视图层的入参请求
  console.log("getManageAssertsTableOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT * FROM (SELECT unit_name, ROUND(dept_asset_value / 10000, 2) AS dept_asset_value, ROUND(unit_asset_value / 10000, 2) AS unit_asset_value, ROUND(unit_asset_ratio * 100, 2) AS unit_asset_ratio, asset_type, ROUND(type_asset_value / 10000, 2) AS type_asset_value, ROUND(type_asset_ratio * 100, 2) AS type_asset_ratio FROM CAS_FUS_SJ_UNIT_ASSET_TYPE_DISTR_I_Y WHERE 1 = 1 @[AND dept_code = '${param.deptCode}'] ) as t1 WHERE 1=1 @[AND ${param.filterCondition}] @[ORDER BY ${param.odName}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageAssertsTableOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageAssertsTableOne dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData, year) {
    const result = {
      dataSource1: [],
      maxMoney: 0,
    };

    const unitMap = {};

    inputData.forEach((item) => {
      if (!unitMap[item.unit_name]) {
        unitMap[item.unit_name] = [];
      }
      unitMap[item.unit_name].push(item);
    });

    Object.entries(unitMap).forEach(([key, val]) => {
      const seriesData = {
        ysdw: key,
        year: year,
        zgdwzcze:
          val[0].dept_asset_value === null ? 0 : val[0].dept_asset_value,
        dqzcze: {
          ratio: val[0].unit_asset_ratio === null ? 0 : val[0].unit_asset_ratio,
          money: val[0].unit_asset_value === null ? 0 : val[0].unit_asset_value,
        },
        zxzcfbqk: {
          houseRatio: 0,
          houseMoney: 0,
          carRatio: 0,
          carMoney: 0,
          landRatio: 0,
          landMoney: 0,
          otherRatio: 0,
          otherMoney: 0,
          maxMoney: 0,
        },
      };
      const maxMoneyArr = [];
      val.forEach((item) => {
        maxMoneyArr.push(item.type_asset_value);
        switch (item.asset_type) {
          case "房产":
            seriesData.zxzcfbqk.houseRatio =
              item.type_asset_ratio === null ? 0 : item.type_asset_ratio;
            seriesData.zxzcfbqk.houseMoney =
              item.type_asset_value === null ? 0 : item.type_asset_value;
            break;
          case "车辆":
            seriesData.zxzcfbqk.carRatio =
              item.type_asset_ratio === null ? 0 : item.type_asset_ratio;
            seriesData.zxzcfbqk.carMoney =
              item.type_asset_value === null ? 0 : item.type_asset_value;
            break;
          case "土地":
            seriesData.zxzcfbqk.landRatio =
              item.type_asset_ratio === null ? 0 : item.type_asset_ratio;
            seriesData.zxzcfbqk.landMoney =
              item.type_asset_value === null ? 0 : item.type_asset_value;
            break;
          case "其他":
            seriesData.zxzcfbqk.otherRatio =
              item.type_asset_ratio === null ? 0 : item.type_asset_ratio;
            seriesData.zxzcfbqk.otherMoney =
              item.type_asset_value === null ? 0 : item.type_asset_value;
            break;
        }
      });
      seriesData.zxzcfbqk.maxMoney = Math.max(...maxMoneyArr);
      result.dataSource1.push(seriesData);
    });
    result.maxMoney = Math.max(
      ...result.dataSource1.map((item) => item.dqzcze.money)
    );
    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManageAssertsTableOne res: ", JSON.stringify(res));
  return res;
}

//当前资产分布情况 排序
export async function getManageAssertsTableOneSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "预算单位代码",
        value: "unit_code",
        type: "string",
      },
      {
        label: "当前资产总额",
        value: "unit_asset_value",
        type: "number",
      },
    ],
  };
  return res;
}

//当前资产分布情况 筛选
export async function getManageAssertsTableOneFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "预算单位名称",
        value: "unit_name",
        type: "string",
      },
      {
        label: "当前资产总额",
        value: "unit_asset_value",
        type: "number",
      },
    ],
  };
  return res;
}

//年新增资产分析 表格
export async function getManageAssertsTableTwo(req) {
  // 打印视图层的入参请求
  console.log("getManageAssertsTableTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT unit_name, nf, asset_type, ROUND(type_asset_value / 10000, 2) AS type_asset_value, ROUND(unit_asset_value / 10000, 2) AS unit_asset_value, ROUND(type_asset_ratio * 100, 2) AS type_asset_ratio FROM CAS_FUS_SJ_DEPT_ASSET_ADD_I_Y WHERE 1=1 @[AND dept_code = '${param.deptCode}'] @[AND nf BETWEEN ${param.year} - 4 AND ${param.year}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageAssertsTableTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${assertsUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageAssertsTableTwo dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(inputData, inputYear) {
    // Convert the input year to a numeric value
    const startYear = parseInt(inputYear, 10);

    // Generate xAxis, with years as string, starting from the given year
    const years = Array.from({ length: 5 }, (_, i) => startYear - 4 + i);

    // Create columns2
    const columns2 = [
      {
        title: "预算单位",
        dataIndex: "budgetName",
        key: "budgetName",
        width: 200,
        fixed: "left",
        scopedSlots: { customRender: "budgetName" },
        customRender: (text, record, index) => {
          const obj = {
            children: text,
            attrs: {},
          };
          if (
            index > 0 &&
            dataSource2[index].budgetName === dataSource2[index - 1].budgetName
          ) {
            obj.attrs.rowSpan = 0;
          } else {
            let rowSpan = 1;
            for (let i = index + 1; i < dataSource2.length; i++) {
              if (dataSource2[i].budgetName === dataSource2[index].budgetName) {
                rowSpan++;
              } else {
                break;
              }
            }
            obj.attrs.rowSpan = rowSpan;
          }
          return obj;
        },
      },
      {
        title: "资产类型",
        dataIndex: "type",
        key: "type",
        scopedSlots: { customRender: "type" },
        width: 90,
      },
    ];

    const yearColumns = years.map((year, index) => ({
      title: year,
      dataIndex: [
        "firstYear",
        "secondYear",
        "thirdYear",
        "forthYear",
        "fifthYear",
      ][index],
      key: ["firstYear", "secondYear", "thirdYear", "forthYear", "fifthYear"][
        index
      ],
      width: 208,
      scopedSlots: {
        customRender: [
          "firstYear",
          "secondYear",
          "thirdYear",
          "forthYear",
          "fifthYear",
        ][index],
      },
    }));

    yearColumns.forEach((column) => columns2.push(column));

    const assetTypeArr = ["房产", "车辆", "土地", "其他"];

    // Group data by budget unit and asset type
    const groupedData = inputData.reduce((acc, item) => {
      for (let i = 0; i < assetTypeArr.length; i++) {
        const key = `${item.unit_name}-${assetTypeArr[i]}`;
        if (!acc[key]) {
          acc[key] = { budgetName: item.unit_name, type: assetTypeArr[i] };
        }
        if (item.asset_type === assetTypeArr[i]) {
          const yearIndex = years.indexOf(parseInt(item.nf));
          const yearKey = [
            "firstYear",
            "secondYear",
            "thirdYear",
            "forthYear",
            "fifthYear",
          ][yearIndex];
          acc[key][yearKey] = {
            year: item.nf,
            ratio: item.type_asset_ratio || "--",
            money: item.type_asset_value || "--",
            maxMoney: item.type_asset_value || "--", // 最大值是这个预算单位,这一列数据中的最大值
            total: item.unit_asset_value || "--",
          };
        }
      }
      return acc;
    }, {});

    // 统一每个单位每年的 total 和 maxMoney
    const unitYearTotals = {};
    inputData.forEach((item) => {
      const unitYearKey = `${item.unit_name}-${item.nf}`;
      if (!unitYearTotals[unitYearKey]) {
        unitYearTotals[unitYearKey] = {
          total: item.unit_asset_value || "--",
          maxMoney: item.type_asset_value || "--",
        };
      } else {
        unitYearTotals[unitYearKey].total = item.unit_asset_value || "--";
        unitYearTotals[unitYearKey].maxMoney = Math.max(
          unitYearTotals[unitYearKey].maxMoney,
          item.type_asset_value || "--"
        );
      }
    });

    Object.values(groupedData).forEach((data) => {
      years.forEach((year, index) => {
        const yearKey = [
          "firstYear",
          "secondYear",
          "thirdYear",
          "forthYear",
          "fifthYear",
        ][index];
        const unitYearKey = `${data.budgetName}-${year}`;
        if (data[yearKey]) {
          data[yearKey].total = unitYearTotals[unitYearKey].total;
          data[yearKey].maxMoney = unitYearTotals[unitYearKey].maxMoney;
        } else {
          data[yearKey] = {
            year: year.toString(),
            ratio: "--",
            money: "--",
            maxMoney: unitYearTotals[unitYearKey]
              ? unitYearTotals[unitYearKey].maxMoney
              : "--",
            total: unitYearTotals[unitYearKey]
              ? unitYearTotals[unitYearKey].total
              : "--",
          };
        }
      });
    });

    // Convert grouped data into an array format for tableData
    const dataSource2 = Object.values(groupedData);

    // Sort dataSource2 by budgetName to ensure unit_name is adjacent
    dataSource2.sort((a, b) => a.budgetName.localeCompare(b.budgetName));
    return {
      columns2,
      dataSource2,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManageAssertsTableTwo res: ", JSON.stringify(res));
  return res;
}

//------四个tab页面
export async function getManageAssertsTableHouse(req) {
  // 打印视图层的入参请求
  console.log("getManageAssertsTableHouse req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select count(*) as total from ( select unit_code as unitCode, Asset_No as assetNo, '房产' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Own_Certificate as qszm, Cert_Number as qszh, Location as zlwz, Own_Area as qsmj, In_Use_Area as zymj, Rental_Area as czmj, Loan_Area as cjmj, Idle_Area as xzmj, Acquisition_Date as qdrq, Start_Use_Date as trsymj, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_REAL_ESTATE_DETAIL_I_Y where dept_code = '${param.deptCode}') as aa where 1=1 @[and ${param.filterCondition}];",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getManageAssertsTableHouse dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${assertsUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getManageAssertsTableHouse dacpTotalRes: ",
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
      "select * from ( select unit_code as unitCode, Asset_No as assetNo, '房产' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Own_Certificate as qszm, Cert_Number as qszh, Location as zlwz, Own_Area as qsmj, In_Use_Area as zymj, Rental_Area as czmj, Loan_Area as cjmj, Idle_Area as xzmj, Acquisition_Date as qdrq, Start_Use_Date as trsymj, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_REAL_ESTATE_DETAIL_I_Y where dept_code = '${param.deptCode}') as aa where 1=1 @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getManageAssertsTableHouse dacpDetailReq: ",
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
    "getManageAssertsTableHouse dacpDetailRes: ",
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
  console.log("getManageAssertsTableHouse res: ", JSON.stringify(res));
  return res;
}

//房屋排序
export async function getManageAssertsTableHouseSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "单位名称",
        value: "dwmc",
        type: "string",
      },
      {
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "权属证明",
        value: "qszm",
        type: "string",
      },
      {
        label: "权属证号",
        value: "qszh",
        type: "string",
      },
      {
        label: "坐落位置",
        value: "zlwz",
        type: "string",
      },
      {
        label: "权属面积",
        value: "qsmj",
        type: "string",
      },
      {
        label: "在用面积",
        value: "zymj",
        type: "string",
      },
      {
        label: "出租面积",
        value: "czmj",
        type: "string",
      },
      {
        label: "出借面积",
        value: "cjmj",
        type: "string",
      },
      {
        label: "闲置面积",
        value: "xzmj",
        type: "string",
      },
      {
        label: "取得日期",
        value: "qdrq",
        type: "string",
      },
      {
        label: "投入使用日期",
        value: "trsymj",
        type: "string",
      },
      {
        label: "处置时间",
        value: "czsj",
        type: "string",
      },
    ],
  };
  return res;
}

// 房屋筛选
export async function getManageAssertsTableHouseFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "单位名称",
        value: "dwmc",
        type: "string",
      },
      {
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "权属证明",
        value: "qszm",
        type: "string",
      },
      {
        label: "权属证号",
        value: "qszh",
        type: "string",
      },
      {
        label: "坐落位置",
        value: "zlwz",
        type: "string",
      },
      {
        label: "权属面积",
        value: "qsmj",
        type: "string",
      },
      {
        label: "在用面积",
        value: "zymj",
        type: "string",
      },
      {
        label: "出租面积",
        value: "czmj",
        type: "string",
      },
      {
        label: "出借面积",
        value: "cjmj",
        type: "string",
      },
      {
        label: "闲置面积",
        value: "xzmj",
        type: "string",
      },
      {
        label: "取得日期",
        value: "qdrq",
        type: "string",
      },
      {
        label: "投入使用日期",
        value: "trsymj",
        type: "string",
      },
      {
        label: "处置时间",
        value: "czsj",
        type: "string",
      },
    ],
  };
  return res;
}

export async function getManageAssertsTableCar(req) {
  // 打印视图层的入参请求
  console.log("getManageAssertsTableCar req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select count(*) as total from ( select unit_code as unitCode, Asset_No as assetNo, '车辆' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz,Brand as pp,Specs as ggxh,License_No as cph,Vehicle_Cert as clxsz,Vehicle_Type as cllx,Displacement as qcpqldm,Engine_No as fdjh,Vehicle_Origin as clcd,Vehicle_Cert as xsz,Vehicle_Owner as clcyr,Warranty_Date as bxjzrq from CAS_FUS_SJ_ASSET_VEHICLES_DETAIL_I_Y where dept_code = '${param.deptCode}') as aa where 1=1 @[and ${param.filterCondition}];",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getManageAssertsTableCar dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${assertsUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getManageAssertsTableCar dacpTotalRes: ",
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
      "select * from ( select unit_code as unitCode, Asset_No as assetNo, '车辆' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz,Brand as pp,Specs as ggxh,License_No as cph,Vehicle_Cert as clxsz,Vehicle_Type as cllx,Displacement as qcpqldm,Engine_No as fdjh,Vehicle_Origin as clcd,Vehicle_Cert as xsz,Vehicle_Owner as clcyr,Warranty_Date as bxjzrq from CAS_FUS_SJ_ASSET_VEHICLES_DETAIL_I_Y where dept_code = '${param.deptCode}') as aa where 1=1 @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getManageAssertsTableCar dacpDetailReq: ",
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
    "getManageAssertsTableCar dacpDetailRes: ",
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
  console.log("getManageAssertsTableCar res: ", JSON.stringify(res));
  return res;
}

//车辆排序
export async function getManageAssertsTableCarSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "单位名称",
        value: "dwmc",
        type: "string",
      },
      {
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "品牌",
        value: "pp",
        type: "string",
      },
      {
        label: "规格型号",
        value: "ggxh",
        type: "string",
      },
      {
        label: "车牌号",
        value: "cph",
        type: "string",
      },
      {
        label: "车辆行驶证",
        value: "clxsz",
        type: "string",
      },
      {
        label: "车辆类型",
        value: "cllx",
        type: "string",
      },
      {
        label: "汽车排期量代码",
        value: "qcpqldm",
        type: "string",
      },
      {
        label: "发动机号",
        value: "fdjh",
        type: "string",
      },
      {
        label: "车辆产地",
        value: "clcd",
        type: "string",
      },
      {
        label: "行驶证",
        value: "xsz",
        type: "string",
      },
      {
        label: "车辆所有人",
        value: "clcyr",
        type: "string",
      },
      {
        label: "保修截止日期",
        value: "bxjzrq",
        type: "string",
      },
    ],
  };
  return res;
}

//车辆筛选
export async function getManageAssertsTableCarFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "单位名称",
        value: "dwmc",
        type: "string",
      },
      {
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "品牌",
        value: "pp",
        type: "string",
      },
      {
        label: "规格型号",
        value: "ggxh",
        type: "string",
      },
      {
        label: "车牌号",
        value: "cph",
        type: "string",
      },
      {
        label: "车辆行驶证",
        value: "clxsz",
        type: "string",
      },
      {
        label: "车辆类型",
        value: "cllx",
        type: "string",
      },
      {
        label: "汽车排期量代码",
        value: "qcpqldm",
        type: "string",
      },
      {
        label: "发动机号",
        value: "fdjh",
        type: "string",
      },
      {
        label: "车辆产地",
        value: "clcd",
        type: "string",
      },
      {
        label: "行驶证",
        value: "xsz",
        type: "string",
      },
      {
        label: "车辆所有人",
        value: "clcyr",
        type: "string",
      },
      {
        label: "保修截止日期",
        value: "bxjzrq",
        type: "string",
      },
    ],
  };
  return res;
}

export async function getManageAssertsTableLand(req) {
  // 打印视图层的入参请求
  console.log("getManageAssertsTableLand req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select count(*) as total from (select unit_code as unitCode, Asset_No as assetNo, '土地' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Own_Certificate as qszm, Cert_Number as qszh, Location as zlwz, Own_Area as qsmj, In_Use_Area as zymj, Rental_Area as czmj, Loan_Area as cjmj, Idle_Area as xzmj, Acquisition_Date as qdrq, Start_Use_Date as trsymj, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_LAND_DETAIL_I_Y where dept_code = '${param.deptCode}') as aa where 1=1 @[and ${param.filterCondition}];",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getManageAssertsTableLand dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${assertsUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getManageAssertsTableLand dacpTotalRes: ",
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
      "select * from (select unit_code as unitCode, Asset_No as assetNo, '土地' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Own_Certificate as qszm, Cert_Number as qszh, Location as zlwz, Own_Area as qsmj, In_Use_Area as zymj, Rental_Area as czmj, Loan_Area as cjmj, Idle_Area as xzmj, Acquisition_Date as qdrq, Start_Use_Date as trsymj, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_LAND_DETAIL_I_Y where dept_code = '${param.deptCode}') as aa where 1=1 @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getManageAssertsTableLand dacpDetailReq: ",
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
    "getManageAssertsTableLand dacpDetailRes: ",
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
  console.log("getManageAssertsTableLand res: ", JSON.stringify(res));
  return res;
}

//土地排序
export async function getManageAssertsTableLandSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "单位名称",
        value: "dwmc",
        type: "string",
      },
      {
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "权属证明",
        value: "qszm",
        type: "string",
      },
      {
        label: "权属证号",
        value: "qszh",
        type: "string",
      },
      {
        label: "坐落位置",
        value: "zlwz",
        type: "string",
      },
      {
        label: "权属面积",
        value: "qsmj",
        type: "string",
      },
      {
        label: "在用面积",
        value: "zymj",
        type: "string",
      },
      {
        label: "出租面积",
        value: "czmj",
        type: "string",
      },
      {
        label: "出借面积",
        value: "cjmj",
        type: "string",
      },
      {
        label: "闲置面积",
        value: "xzmj",
        type: "string",
      },
      {
        label: "取得日期",
        value: "qdrq",
        type: "string",
      },
      {
        label: "投入使用日期",
        value: "trsymj",
        type: "string",
      },
      {
        label: "处置时间",
        value: "czsj",
        type: "string",
      },
    ],
  };
  return res;
}

// 土地筛选
export async function getManageAssertsTableLandFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: "单位名称",
        value: "dwmc",
        type: "string",
      },
      {
        label: "资产编号",
        value: "zcbh",
        type: "string",
      },
      {
        label: "资产名称",
        value: "zcmc",
        type: "string",
      },
      {
        label: "资产净值",
        value: "zcjz",
        type: "number",
      },
      {
        label: "权属证明",
        value: "qszm",
        type: "string",
      },
      {
        label: "权属证号",
        value: "qszh",
        type: "string",
      },
      {
        label: "坐落位置",
        value: "zlwz",
        type: "string",
      },
      {
        label: "权属面积",
        value: "qsmj",
        type: "string",
      },
      {
        label: "在用面积",
        value: "zymj",
        type: "string",
      },
      {
        label: "出租面积",
        value: "czmj",
        type: "string",
      },
      {
        label: "出借面积",
        value: "cjmj",
        type: "string",
      },
      {
        label: "闲置面积",
        value: "xzmj",
        type: "string",
      },
      {
        label: "取得日期",
        value: "qdrq",
        type: "string",
      },
      {
        label: "投入使用日期",
        value: "trsymj",
        type: "string",
      },
      {
        label: "处置时间",
        value: "czsj",
        type: "string",
      },
    ],
  };
  return res;
}

export async function getManageAssertsTableOther(req) {
  // 打印视图层的入参请求
  console.log("getManageAssertsTableOther req: ", JSON.stringify(req));

  // 构造后端总数dacp接口请求
  const dacpTotalReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select count(*) as total from (select unit_code as unitCode, Asset_No as assetNo, '其他' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Asset_Large_Class as zcdl, Asset_Class_Name as zcflmc, Quantity_Area as slhpm, Quantity_Unit as sljldw, Acquisition_Date as zcqdrq, Acquisition_Name as zcqdfs, Start_Use_Date as trsyrq, round(Original_Value, 2) as zcyz, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_OTHERS_DETAIL_I_Y where dept_code = '${param.deptCode}') as aa where 1=1 @[and ${param.filterCondition}];",
    sqlParameter: req,
  };

  // 调用后端总数dacp接口
  console.log(
    "getManageAssertsTableOther dacpTotalReq: ",
    JSON.stringify(dacpTotalReq)
  );
  const dacpTotalRes = await axiosInstance.post(`${assertsUrl}`, dacpTotalReq, {
    timeout: -1,
  });
  console.log(
    "getManageAssertsTableOther dacpTotalRes: ",
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
      "select * from (select unit_code as unitCode, Asset_No as assetNo, '其他' as assetType, unit_name as dwmc, Asset_No as zcbh, Asset_Name as zcmc, round(Net_Value,2) as zcjz, Asset_Large_Class as zcdl, Asset_Class_Name as zcflmc, Quantity_Area as slhpm, Quantity_Unit as sljldw, Acquisition_Date as zcqdrq, Acquisition_Name as zcqdfs, Start_Use_Date as trsyrq, round(Original_Value, 2) as zcyz, Disposal_Date as czsj from CAS_FUS_SJ_ASSET_OTHERS_DETAIL_I_Y where dept_code = '${param.deptCode}') as aa where 1=1 @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端明细dacp接口
  console.log(
    "getManageAssertsTableOther dacpDetailReq: ",
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
    "getManageAssertsTableOther dacpDetailRes: ",
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
  console.log("getManageAssertsTableOther res: ", JSON.stringify(res));
  return res;
}

//其他排序
export async function  getManageAssertsTableOtherSort() {
  const res = {
      "code": 0,
      "message": "成功",
      "data": [
        {
          "label": "单位名称",
          "value": "dwmc",
          "type": "string"
        },
        {
          "label": "资产编号",
          "value": "zcbh",
          "type": "string"
        },
        {
          "label": "资产名称",
          "value": "zcmc",
          "type": "string"
        },
        {
          "label": "资产净值",
          "value": "zcjz",
          "type": "number"
        },
        {
          "label": "资产大类",
          "value": "zcdl",
          "type": "string"
        },
        {
          "label": "资产分类名称",
          "value": "zcflmc",
          "type": "string"
        },
        {
          "label": "数量或面积",
          "value": "slhpm",
          "type": "string"
        },
        {
          "label": "数量计量单位",
          "value": "sljldw",
          "type": "string"
        },
        {
          "label": "资产取得日期",
          "value": "zcqdrq",
          "type": "string"
        },
        {
          "label": "资产取得方式名称",
          "value": "zcqdfs",
          "type": "string"
        },
        {
          "label": "投入使用日期",
          "value": "trsyrq",
          "type": "string"
        },
        {
          "label": "资产原值",
          "value": "zcyz",
          "type": "number"
        },
        {
          "label": "处置时间",
          "value": "czsj",
          "type": "string"
        }
      ]
  }
  return res;
}


//其他筛选
export async function getManageAssertsTableOtherFilter() {
  const res = {
      "code": 0,
      "message": "成功",
      "data": [
        {
          "label": "单位名称",
          "value": "dwmc",
          "type": "string"
        },
        {
          "label": "资产编号",
          "value": "zcbh",
          "type": "string"
        },
        {
          "label": "资产名称",
          "value": "zcmc",
          "type": "string"
        },
        {
          "label": "资产净值",
          "value": "zcjz",
          "type": "number"
        },
        {
          "label": "资产大类",
          "value": "zcdl",
          "type": "string"
        },
        {
          "label": "资产分类名称",
          "value": "zcflmc",
          "type": "string"
        },
        {
          "label": "数量或面积",
          "value": "slhpm",
          "type": "string"
        },
        {
          "label": "数量计量单位",
          "value": "sljldw",
          "type": "string"
        },
        {
          "label": "资产取得日期",
          "value": "zcqdrq",
          "type": "string"
        },
        {
          "label": "资产取得方式名称",
          "value": "zcqdfs",
          "type": "string"
        },
        {
          "label": "投入使用日期",
          "value": "trsyrq",
          "type": "string"
        },
        {
          "label": "资产原值",
          "value": "zcyz",
          "type": "number"
        },
        {
          "label": "处置时间",
          "value": "czsj",
          "type": "string"
        }
      ]
  }
  return res;
}
