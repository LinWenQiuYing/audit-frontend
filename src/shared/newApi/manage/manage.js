import store from "@/store";
import axiosInstance from "../index.js";

const defaultYear = store.state.blockAnalysis.blockChoosedYear;
console.log("🚀 ~ defaultYear:", defaultYear);

const manageUrl = "/pierce/dacp/invoke";

//------首页

//获取主管单位右侧概览
export async function getManageOverview(req) {
  // 打印视图层的入参请求
  console.log("getManageOverview req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select unit_cnt  as unit_cnt, abs(unit_cnt_change) as unit_cnt_change, case when unit_cnt_change>0 then 1 when unit_cnt_change<0 then 0 else 2 end as unit_cnt_status,dept_pro_cnt  as dept_pro_cnt, abs(dept_pro_cnt_change) as dept_pro_cnt_change, case when dept_pro_cnt_change>0 then 1 when dept_pro_cnt_change<0 then 0 else 2 end as dept_pro_cnt_status, round(dept_budget_amount/10000,2) as dept_budget_amount, abs(round(dept_budget_amount_change*100,2)) as dept_budget_amount_change, case when dept_budget_amount_change>0 then 1 when dept_budget_amount_change<0 then 0 else 2 end as dept_budget_amount_status,round(dept_pay_amount/10000,2) as dept_pay_amount , abs(round(dept_pay_amount_change*100,2)) as dept_pay_amount_change, case when dept_pay_amount_change>0 then 1 when dept_pay_amount_change<0 then 0 else 2 end as dept_pay_amount_status, abs(round(dept_execute_rate*100,2)) as dept_execute_rate, abs(round(dept_execute_rate_change*100,2)) as dept_execute_rate_change, case when dept_execute_rate_change>0 then 1 when dept_execute_rate_change<0 then 0 else 2 end as execute_status, dept_active_headcount as dept_active_headcount, abs(dept_active_headcount_change) as dept_active_headcount_change, case when dept_active_headcount_change>0 then 1 when dept_active_headcount_change<0 then 0 else 2 end as headcount_status, round(avg_pay_amount/10000,2)  as avg_pay_amount,abs(round(avg_pay_amount_change*100,2)) as avg_pay_amount_change, case when avg_pay_amount_change>0 then 1 when avg_pay_amount_change<0 then 0 else 2 end as avg_pay_amount_status from CAS_FUS_SJ_XZSYDW_ZGDWUNIT_OVERVIEW_I_Y where 1=1 @[and budget_year=${param.year}] @[and dept_code=${param.dept_code}];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageOverview dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageOverview dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    // 提取数据
    const item = data[0];

    return [
      {
        typeName: "预算单位数量(家)",
        num:
          item && item.unit_cnt ? Number(item.unit_cnt).toLocaleString() : "--", // 格式化数字
        percentage: item.unit_cnt_change == null ? "--" : item.unit_cnt_change, // 百分比变化
        status: item.unit_cnt_status, // 直接使用原始状态值
        icon: "预算单位数量",
      },
      {
        typeName: "项目数量(个)",
        num:
          item && item.dept_pro_cnt
            ? Number(item.dept_pro_cnt).toLocaleString()
            : "--",
        percentage:
          item.dept_pro_cnt_change == null ? "--" : item.dept_pro_cnt_change,
        status: item.dept_pro_cnt_status,
        icon: "项目数量",
      },
      {
        typeName: "预算金额(万元)",
        num:
          item && item.dept_budget_amount
            ? Number(item.dept_budget_amount).toLocaleString()
            : "--",
        percentage:
          item.dept_budget_amount_change == null
            ? "--"
            : item.dept_budget_amount_change,
        status: item.dept_budget_amount_status,
        icon: "预算金额1",
      },
      {
        typeName: "执行金额(万元)",
        num:
          item && item.dept_pay_amount
            ? Number(item.dept_pay_amount).toLocaleString()
            : "--",
        percentage:
          item.dept_pay_amount_change == null
            ? "--"
            : item.dept_pay_amount_change,
        status: item.dept_pay_amount_status,
        icon: "执行金额1",
      },
      {
        typeName: "执行率(%)",
        num:
          item && item.dept_execute_rate
            ? Number(item.dept_execute_rate)
            : "--", // 执行率为纯数字，不加逗号
        percentage:
          item.dept_execute_rate_change == null
            ? "--"
            : item.dept_execute_rate_change,
        status: item.execute_status,
        icon: "执行率1",
      },
      {
        typeName: "人员数量(人)",
        num:
          item && item.dept_active_headcount
            ? Number(item.dept_active_headcount).toLocaleString()
            : "--",
        percentage:
          item.dept_active_headcount_change == null
            ? "--"
            : item.dept_active_headcount_change,
        status: item.headcount_status,
        icon: "人员数量",
      },
      {
        typeName: "人均支出金额(万元)",
        num:
          item && item.avg_pay_amount
            ? Number(item.avg_pay_amount).toLocaleString()
            : "--",
        percentage:
          item.avg_pay_amount_change == null
            ? "--"
            : item.avg_pay_amount_change,
        status: item.avg_pay_amount_status,
        icon: "人均支出金额",
      },
    ];
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageOverview res: ", JSON.stringify(res));
  return res;
}

//获取主管单位右侧基本信息——已更新
export async function getManageBasicInfo(req) {
  // 打印视图层的入参请求
  console.log("getManageBasicInfo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select budget_unit_code as orgranld,budget_unit_name as organName,budget_admin_type as xzjgfl,budget_unit_adm_rank_name as xzjb,establish_date as clrq,budget_unit_add as dwdz,post_code as yzbm,contact_person as lxr,budget_unit_tel as lxrdhhm,fax as lxrcz,email as lxremail,finance_charge_person as cwfzr,finance_charge_tel as cwfzrdhhm,finance_charge_fax as cwfzrcz,'--' as cwfzremail,unit_charge_person as dwfzr,unit_charge_tel as dwfzrdhhm,unit_charge_fax as dwfzrcz,unit_charge_email as dwfzremail,unit_active_headcount as bbrysl,sub_unit_headcount as xsdwrysl,note as notes from cas_fus_sj_xzsydw_zgunit_basic_info_i_y where 1=1 @[and finance_year=${param.year}] @[and budget_unit_code='${param.unitCode}'] ;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageBasicInfo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageBasicInfo dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    const info = data[0];
    return [
      {
        key: "organId",
        label: "单位机构代码",
        value: (info && info.orgranld) || "--",
      },
      {
        key: "organName",
        label: "单位名称",
        value: (info && info.organName) || "--",
      },
      {
        key: "xzjgfl",
        label: "行政机关分类",
        value: (info && info.xzjgfl) || "--",
      },
      {
        key: "xzjb",
        label: "行政级别",
        value: (info && info.xzjb) || "--",
      },
      {
        key: "clrq",
        label: "成立日期",
        value: (info && info.clrq) || "--",
      },
      {
        key: "dwdz",
        label: "单位地址",
        value: (info && info.dwdz) || "--",
      },
      {
        key: "yzbm",
        label: "邮政编码",
        value: (info && info.yzbm) || "--",
      },
      {
        key: "lxr",
        label: "联系人",
        value: (info && info.lxr) || "--",
      },
      {
        key: "lxrdhhm",
        label: "电话号码",
        value: (info && info.lxrdhhm) || "--",
      },
      {
        key: "lxrcz",
        label: "传真",
        value: (info && info.lxrcz) || "--",
      },
      {
        key: "lxremail",
        label: "E-mail",
        value: (info && info.lxremail) || "--",
      },
      {
        key: "cwfzr",
        label: "财务负责人",
        value: (info && info.cwfzr) || "--",
      },
      {
        key: "cwfzrdhhm",
        label: "电话号码",
        value: (info && info.cwfzrdhhm) || "--",
      },
      {
        key: "cwfzrcz",
        label: "传真",
        value: (info && info.cwfzrcz) || "--",
      },
      {
        key: "cwfzremail",
        label: "E-mail",
        value: (info && info.cwfzremail) || "--",
      },
      {
        key: "dwfzr",
        label: "单位负责人",
        value: (info && info.dwfzr) || "--",
      },
      {
        key: "dwfzrdhhm",
        label: "电话号码",
        value: (info && info.dwfzrdhhm) || "--",
      },
      {
        key: "dwfzrcz",
        label: "传真",
        value: (info && info.dwfzrcz) || "--",
      },
      {
        key: "dwfzremail",
        label: "E-mail",
        value: (info && info.dwfzremail) || "--",
      },
      {
        key: "bbrysl",
        label: "本部人员数量",
        value: (info && info.bbrysl) || "--",
      },
      {
        key: "xsdwrysl",
        label: "下属单位人员数量",
        value: (info && info.xsdwrysl) || "--",
      },
      {
        key: "notes",
        label: "备注",
        value: (info && info.notes) || "--",
      },
    ];
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageBasicInfo res: ", JSON.stringify(res));
  return res;
}

//echarts图：整体支出均衡性——已更新
export async function getManageSpendGraphDataOne(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendGraphDataOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select a.dept_name as froms,a.unit_name as names,a.budget_year,a.month,round(a.total_month_pay_amount/10000,2) as total_month_pay_amount,round(b.pay_amount_year/10000,2) as pay_amount_year,round(a.total_month_pay_amount*100/b.pay_amount_year,2) as rate from(SELECT  dept_code, unit_name,unit_code, budget_year, dept_name, month, sum(total_month_pay_amount) as total_month_pay_amount FROM  CAS_FUS_SJ_XZSYDW_ZCJHX_XMLB_I_M where 1=1 @[and dept_code='${param.dept_code}'] @[and fund_nature_code in ${param.fund_nature_code}] @[and budget_year=${param.year}] @[and unit_code in ${param.unit_code}] group by dept_code, unit_code,unit_name,budget_year, dept_name, month)  a left join (SELECT  dept_code, unit_code,  budget_year, dept_name, sum(total_month_pay_amount) as pay_amount_year FROM  CAS_FUS_SJ_XZSYDW_ZCJHX_XMLB_I_M where 1=1 @[and dept_code='${param.dept_code}'] @[and fund_nature_code in ${param.fund_nature_code}] @[and budget_year=${param.year}] @[and unit_code in ${param.unit_code}] group by dept_code, unit_code, budget_year, dept_name ) b on a.dept_code=b.dept_code and a.unit_code=b.unit_code and a.budget_year=b.budget_year",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendGraphDataOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendGraphDataOne dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    if (!data.length) {
      return {
        legend: [], // 添加汇总名称到 legend
        xAxis: [],
        seriesData: [],
      };
    }
    // 保留两位小数的辅助函数
    function toFixed(value, decimals) {
      return parseFloat(value).toFixed(decimals);
    }

    let legend = [...new Set(data.map((d) => d.names))];
    const xAxis = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];
    if (legend.length >= 9) {
      legend = legend.slice(0, 8);
    }
    // 初始化 budget 和 manage 的 seriesData
    const seriesData = {};

    legend.forEach((name) => {
      seriesData[name] = {
        type: "budget",
        name,
        from: data[0].froms,
        data: {
          totalMoney: 0,
          money: new Array(12).fill(0),
          rate: new Array(12).fill(0),
        },
      };
    });

    // 汇总预算单位数据
    data.forEach((d) => {
      const monthIndex = parseInt(d.month) - 1; // 月份索引

      if (seriesData[d.names]) {
        seriesData[d.names].data.money[monthIndex] += parseFloat(
          toFixed(d.total_month_pay_amount, 2)
        );
        seriesData[d.names].data.rate[monthIndex] += parseFloat(
          toFixed(d.rate, 2)
        );
        seriesData[d.names].data.totalMoney = parseFloat(
          toFixed(d.pay_amount_year, 2)
        );
      }
    });

    // 转换为数组并添加汇总数据
    const seriesArray = Object.keys(seriesData).map((name) => seriesData[name]);

    // 计算汇总数据
    const totalMonthlyData = xAxis.reduce(
      (acc, month, index) => {
        const monthIndex = index + 1;
        const monthEntries = data.filter(
          (d) => parseInt(d.month) === monthIndex
        );

        const monthTotal = monthEntries.reduce(
          (sum, d) => {
            sum.total_month_pay_amount += d.total_month_pay_amount;
            sum.total_rate += d.rate;
            return sum;
          },
          { total_month_pay_amount: 0, total_rate: 0 }
        );

        acc.money[index] = parseFloat(
          toFixed(
            monthEntries.reduce((sum, d) => sum + d.total_month_pay_amount, 0),
            2
          )
        );
        acc.rate[index] =
          monthEntries.length > 0
            ? parseFloat(
                toFixed(monthTotal.total_rate / monthEntries.length, 2)
              )
            : 0;
        return acc;
      },
      { money: new Array(12).fill(0), rate: new Array(12).fill(0) }
    );

    // 添加汇总数据到 seriesArray
    seriesArray.push({
      name: data[0].froms, // 汇总的名称设置为 'froms'
      type: "manage", // 新目标的 type
      from: data[0].froms,
      data: {
        totalMoney: xAxis.reduce(
          (sum, month, index) => sum + totalMonthlyData.money[index],
          0
        ), // 汇总 totalMoney
        money: totalMonthlyData.money,
        rate: totalMonthlyData.rate,
      },
    });

    return {
      legend: [...new Set([data[0].froms, ...legend])], // 添加汇总名称到 legend
      xAxis,
      seriesData: seriesArray,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageSpendGraphDataOne res: ", JSON.stringify(res));
  return res;
}

//echarts图：资金结构(按资金来源) 圆环——已更新
export async function getManageSpendGraphDataTwo(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendGraphDataTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select sum(actual_pay_amount_nature_y) as value, fund_nature_name as name from CAS_FUS_SJ_XZSYDW_YSUNIT_FUND_NATURE_I_Y where 1=1 @[and budget_year=${param.year}] @[and dept_code='${param.dept_code}'] group by fund_nature_code,budget_year,dept_code;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendGraphDataTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendGraphDataTwo dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    // 计算总金额，并转换为万元，保留两位小数
    const total = (
      data.reduce((sum, item) => sum + item.value, 0) / 1e4
    ).toFixed(2);

    // 转换为目标格式，并将金额转换为万元，保留两位小数
    const seriesData = data.map((item) => ({
      value: (item.value / 1e4).toFixed(2),
      name: item.name,
    }));

    // 构建最终的结果对象
    const result = {
      total: parseFloat(total), // 资金总额
      seriesData: seriesData.map((item) => ({
        value: parseFloat(item.value), // 确保 value 是数字类型
        name: item.name,
      })),
    };

    return result;
  }
  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageSpendGraphDataTwo res: ", JSON.stringify(res));
  return res;
}

//echarts图：资金结构(按资金来源) 堆叠柱状图——已更新
export async function getManageSpendGraphDataThree(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendGraphDataThree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select a.dept_code,a.dept_id,a.fund_nature_name as name,a.budget_year as year, a.value,(a.value / total_sum.total_value) as ratio from ( select dept_id,fund_nature_code,fund_nature_name,budget_year,dept_name,dept_code, sum(actual_pay_amount_nature_y) as value from CAS_FUS_SJ_XZSYDW_YSUNIT_FUND_NATURE_I_Y GROUP BY fund_nature_name, fund_nature_code,budget_year,dept_name,dept_code) as a left  join (select budget_year,dept_code,dept_name,sum(actual_pay_amount_nature_y) as total_value from CAS_FUS_SJ_XZSYDW_YSUNIT_FUND_NATURE_I_Y group by budget_year,dept_code,dept_name) as total_sum on a.dept_code = total_sum.dept_code and  a.budget_year = total_sum.budget_year WHERE 1=1 @[and a.budget_year=${param.year}] @[and a.dept_code='${param.dept_code}'];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log(
    "ggetManageSpendGraphDataThree dacpReq: ",
    JSON.stringify(dacpReq)
  );
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log(
    "getManageSpendGraphDataThree dacpRes: ",
    JSON.stringify(dacpRes)
  );

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data, inputYear) {
    // 将输入年份转为数值型
    const startYear = parseInt(inputYear, 10);

    // 生成xAxis，从给定年份向前推4年，并将年份转换为字符串
    const xAxis = Array.from({ length: 5 }, (_, i) =>
      (startYear - 4 + i).toString()
    );

    // 提取所有的name
    const legend = [...new Set(data.map((item) => item.name))];

    // 创建一个初始的seriesData对象
    const seriesData = legend.map((name) => ({
      name: name,
      rate: xAxis.map(() => 0),
      money: xAxis.map(() => 0),
    }));

    // 填充seriesData对象
    data.forEach((item) => {
      const yearIndex = xAxis.indexOf(item.year);
      if (yearIndex !== -1) {
        const seriesItem = seriesData.find(
          (series) => series.name === item.name
        );
        if (seriesItem) {
          seriesItem.rate[yearIndex] = (parseFloat(item.ratio) * 100).toFixed(
            2
          ); // 转换为百分比并保留两位小数
          seriesItem.money[yearIndex] = (item.value / 1e4).toFixed(2); // 金额转换为万元并保留两位小数
        }
      }
    });

    // 格式化rate和money为两位小数并转换回数值类型
    seriesData.forEach((series) => {
      series.rate = series.rate.map((value) => parseFloat(value));
      series.money = series.money.map((value) => parseFloat(value));
    });

    return {
      legend: legend,
      xAxis: xAxis,
      seriesData: seriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManageSpendGraphDataThree res: ", JSON.stringify(res));
  return res;
}

//echarts图：科目 矩形树图——已更新
export async function getManageSpendGraphDataFour(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendGraphDataFour req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "(select exp_subject_name1 as p1,exp_subject_name2 as p2,null as p3,null as ap1,round(actual_pay_amount,2) as ap2,null as ap3 from cas_fus_sj_xzsydw_gov_exp_i_y where 1=1 @[and '0'='${param.flag}'] @[and budget_year=${param.year}] @[and decp_code=${param.dept_code}]) union (select exp_func_name1 as p1,exp_func_name2 as p2,exp_func_name3 as p3,round(actual_pay_amount_1,2) as ap1,round(actual_pay_amount_2,2) as ap2,round(actual_pay_amount_3,2) as ap3 from CAS_FUS_SJ_XZSYDW_GNKM_DEP_I_Y where 1=1 @[and '1'='${param.flag}'] @[and budget_year=${param.year}] @[and dept_code=${param.dept_code}]);",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendGraphDataFour dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendGraphDataFour dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    const result = {};
    let topLevelSum = 0; // 新增变量，用于保存顶层节点的总和

    data.forEach((item) => {
      let topLevelKey = item.p1 || item.p2;

      if (!result[topLevelKey]) {
        result[topLevelKey] = {
          name: topLevelKey,
          value: 0,
        };
      }

      result[topLevelKey].value += item.ap2 || 0;
      topLevelSum += item.ap2 || 0; // 累加顶层节点的值

      if (item.p2 && item.p1 !== null) {
        let childP2 =
          result[topLevelKey].children &&
          result[topLevelKey].children.find((child) => child.name === item.p2);
        if (!childP2) {
          childP2 = {
            name: item.p2,
            value: 0,
          };
          if (!result[topLevelKey].children) {
            result[topLevelKey].children = [];
          }
          result[topLevelKey].children.push(childP2);
        }

        childP2.value += item.ap2 || 0;

        if (item.p3) {
          let childP3 =
            childP2.children &&
            childP2.children.find((child) => child.name === item.p3);
          if (!childP3) {
            childP3 = {
              name: item.p3,
              value: 0,
            };
            if (!childP2.children) {
              childP2.children = [];
            }
            childP2.children.push(childP3);
          }

          childP3.value += item.ap3 || 0;
        }
      }
    });

    // 添加计算比率的功能
    function computeRate(node, parentValue) {
      // 使用原始值来计算比率
      if (parentValue !== undefined) {
        // 如果有父节点，则计算比率
        node.rate = parentValue ? (node.value / parentValue) * 100 : 100;
      } else {
        // 如果没有父节点，则使用顶层节点的总和
        node.rate = topLevelSum ? (node.value / topLevelSum) * 100 : 100;
      }

      node.rate = parseFloat(node.rate.toFixed(2)); // 保留两位小数

      if (node.children) {
        let totalChildValue = 0;
        node.children.forEach((child) => {
          totalChildValue += child.value;
          computeRate(child, node.value); // 递归计算子节点的比率
        });

        // 确保所有子节点的总价值等于父节点的价值
        if (Math.abs(totalChildValue - node.value) > Number.EPSILON) {
          console.warn(
            `Mismatch between parent and children values for ${node.name}`
          );
        }
      }
    }

    const resultArray = Object.values(result);

    // 计算顶层节点的比率
    resultArray.forEach((node) => computeRate(node, topLevelSum));

    const filteredResult = resultArray.map((node) => {
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          value: parseFloat((node.value / 10000).toFixed(2)), // 将 value 除以 10000 并保留两位小数
          children: node.children.map((child) => ({
            ...child,
            value: parseFloat((child.value / 10000).toFixed(2)), // 将 value 除以 10000 并保留两位小数
            children: child.children
              ? child.children.map((grandchild) => ({
                  ...grandchild,
                  value: parseFloat((grandchild.value / 10000).toFixed(2)), // 将 value 除以 10000 并保留两位小数
                }))
              : undefined,
          })),
        };
      }
      return {
        ...node,
        value: parseFloat((node.value / 10000).toFixed(2)), // 将 value 除以 10000 并保留两位小数
      };
    });

    return {
      seriesData: filteredResult,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageSpendGraphDataFour res: ", JSON.stringify(res));
  return res;
}
//echarts图：科目 经济科目选项——已更新
export async function getFinancialSubjectList(req) {
  // 打印视图层的入参请求
  console.log("getFinancialSubjectList req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct gov_exp_subject_name as title from cas_fus_sj_xzsydw_gov_exp_i_y where 1=1 @[and budget_year = ${param.year}] @[and decp_code = ${param.dept_code}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getFinancialSubjectList dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getFinancialSubjectList dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    return data.map((item) => ({
      title: item.title,
      value: item.title,
      key: item.title,
    }));
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getFinancialSubjectList res: ", JSON.stringify(res));
  return res;
}
//echarts图：科目 功能科目选项——已更新
export async function getFunctionSubjectList(req) {
  // 打印视图层的入参请求
  console.log("getFunctionSubjectList req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct exp_func_name as title from cas_fus_sj_xzsydw_gnkm_dep_zxt_i_y where 1=1 @[and budget_year = ${param.year}] @[and dept_code = ${param.dept_code}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getFunctionSubjectList dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getFunctionSubjectList dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    return data.map((item) => ({
      title: item.title,
      value: item.title,
      key: item.title,
    }));
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getFunctionSubjectList res: ", JSON.stringify(res));
  return res;
}
//echarts图：科目 折线图——已更新
export async function getManageSpendGraphDataFive(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendGraphDataFive req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      " select * from (select dept_code,'0' as flag,exp_func_name as grouping_column,sum(round(exp_func_pay_amount/10000,2)) as total_actual_pay_amount,budget_year from cas_fus_sj_xzsydw_gnkm_dep_zxt_i_y group by dept_code,budget_year,exp_func_name union all select decp_code as dept_code,'1' as flag,gov_exp_subject_name as grouping_column,sum(round(actual_pay_amount/10000,2)) as total_actual_pay_amount,budget_year from cas_fus_sj_xzsydw_gov_exp_i_y group by decp_code,budget_year,gov_exp_subject_name ) as xx  where 1=1 @[and dept_code=${param.dept_code}] @[and flag='${param.flag}'] @[and grouping_column in ${param.subject_name}] order by xx.total_actual_pay_amount desc @[limit ${param.nums}]",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendGraphDataFive dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendGraphDataFive dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data, latestYear) {
    // 生成从最新年份向前推的5年列表
    const yearsToInclude = Array.from({ length: 5 }, (_, i) => (parseInt(latestYear) - i).toString()).reverse();;
    
    // 提取预算科目名字
    const legend = [...new Set(data.map(item => item.grouping_column))];
  
    // 初始化 seriesData
    const seriesData = legend.map(deptName => {
      const money = yearsToInclude.map(year => {
        // 过滤出该年份的所有数据
        const yearData = data.filter(item => item.budget_year === year);
        // 计算该年份的总支出金额
        const totalYearAmount = yearData.reduce((sum, item) => sum + item.total_actual_pay_amount, 0);
        // 计算该预算科目在该年份的支出金额
        const deptYearAmount = yearData.filter(item => item.grouping_column === deptName)
                                       .reduce((sum, item) => sum + item.total_actual_pay_amount, 0);
        // 计算占比，并乘以 100，再保留两位小数
        return totalYearAmount === 0 ? "0.00" : ((deptYearAmount / totalYearAmount) * 100).toFixed(2);
      });
  
      // 计算该预算科目在每年的支出金额
      const amount = yearsToInclude.map(year => {
        const yearData = data.filter(item => item.budget_year === year);
        return yearData.filter(item => item.grouping_column === deptName)
                       .reduce((sum, item) => sum + item.total_actual_pay_amount, 0);
      });
  
      return {
        name: deptName,
        data: {
          money: amount,
          rate: money
        }
      };
    });
  
    return {
      legend: legend,
      xAxis: yearsToInclude,
      seriesData: seriesData
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, defaultYear),
  };
  console.log("getManageSpendGraphDataFive res: ", JSON.stringify(res));
  return res;
}

//echarts图：资金TOP5趋势 折线图——已更新
export async function getManageSpendGraphDataSix(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendGraphDataSix req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct budget_unit_name as name,round(actual_pay_amount/10000,2) as actual_pay_amount,budget_year as amount from  cas_fus_sj_xzsydw_ysunit_overview_i_y where 1=1 @[and budget_year=${param.year}] @[and dept_code=${param.dept_code}] order by actual_pay_amount desc limit 5",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendGraphDataSix dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendGraphDataSix dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data, inputYear) {
    const startYear = parseInt(inputYear, 10);
    // 生成xAxis，从给定年份向前推4年，并将年份转换为字符串
    const xAxis = Array.from({ length: 5 }, (_, i) =>
      (startYear - 4 + i).toString()
    );

    // 从数据中提取预算单位的名字，用于legend
    const legend = [...new Set(data.map((item) => item.name))];

    // 将数据按预算单位分组
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = [];
      }
      acc[item.name].push(item);
      return acc;
    }, {});

    // 生成 seriesData
    const seriesData = legend.map((deptName) => {
      const deptData = groupedData[deptName] || [];
      const money = new Array(5).fill(0);
      deptData.forEach((item) => {
        const yearIndex = parseInt(item.amount) - startYear + 4; // 获取年份索引
        if (yearIndex >= 0 && yearIndex < 5) {
          money[yearIndex] = (item.actual_pay_amount * 1.0).toFixed(2);
        }
      });

      return {
        name: deptName,
        data: money,
      };
    });

    // 返回结果
    return {
      legend,
      xAxis,
      seriesData,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManageSpendGraphDataSix res: ", JSON.stringify(res));
  return res;
}

//预算单位明细简表——已更新
export async function getManageSpendTableOne(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendTableOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select  budget_unit_name as ysdw, unit_pro_cnt as dnxmsl, ROUND(actual_pay_amount / 10000, 2)  as dnzcje, ROUND(budget_amount / 10000, 2)  as dnysje, ROUND(unit_execute_rate*100 ,2) as dnzxl,   unit_active_headcount as dnrysl, ROUND(avg_pay_amount  / 10000, 2)  as dnrjzcje from cas_fus_sj_xzsydw_ysunit_overview_i_y where 1=1 @[and budget_year=${param.year}] @[and dept_code='${param.dept_code}'] @[and ${param.filterCondition}] @[order by ${param.odName}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset};",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendTableOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendTableOne dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data, inputYear) {
    // 将输入年份转为数值型
    const startYear = parseInt(inputYear, 10);

    // 生成xAxis，从给定年份向前推4年，并将年份转换为字符串
    const xAxis = Array.from({ length: 5 }, (_, i) =>
      (startYear - 4 + i).toString()
    );

    // 转换为目标格式
    const transformedData = data.map((item) => {
      // 初始化数据
      const moneyArray = new Array(xAxis.length).fill(0);
      const excuteRateArray = new Array(xAxis.length).fill(0);
      const projectNumberArray = new Array(xAxis.length).fill(0);

      // 找到年份对应的索引
      const yearIndex = xAxis.indexOf(startYear.toString());

      // 如果找到年份索引，则填入对应支出金额
      if (yearIndex !== -1) {
        moneyArray[yearIndex] = item.dnzcje; // 2023年的支出金额
      }

      // 填充近五年数据
      xAxis.forEach((year, idx) => {
        // 用于模拟的数据提取函数
        const yearlyData = data.find(
          (d) => d.ysdw === item.ysdw && year === inputYear
        );
        if (yearlyData) {
          moneyArray[idx] = yearlyData.dnzcje || 0;
          excuteRateArray[idx] = yearlyData.dnzxl || 0;
          projectNumberArray[idx] = yearlyData.dnxmsl || 0;
        }
      });

      return {
        ysdw: item.ysdw || "--", // 预算单位名称
        dnxmsl: item.dnxmsl == null ? "--" : item.dnxmsl, // 当年项目数量
        dnzcje: item.dnzcje == null ? "--" : item.dnzcje, // 当年支出金额
        dnysje: item.dnysje == null ? "--" : item.dnysje, // 当年预算金额
        dnzxl: item.dnzxl == null ? "--" : item.dnzxl, // 当年执行率
        dnrysl: item.dnrysl == null ? "--" : item.dnrysl, // 当前人员数量
        dnrjzcje: item.dnrjzcje == null ? "--" : item.dnrjzcje, // 当年人均支出金额
        wnqs: {
          // 近五年趋势
          xAxis: xAxis,
          seriesData: [
            {
              name: "变化趋势",
              money: moneyArray, // 近五年支出金额
              rate: xAxis.map(() => "--"), // 比率为空
              excuteRate: excuteRateArray, // 近五年执行率
              projectNumber: projectNumberArray, // 近五年项目数量
            },
          ],
        },
      };
    });

    return transformedData;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data, req.year),
  };
  console.log("getManageSpendTableOne res: ", JSON.stringify(res));
  return res;
}

//预算单位明细简表排序——已更新
export async function getManageSpendTableOneSort() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: " 预算单位名称",
        value: "ysdw",
        type: "string",
      },
      {
        label: "当年项目数量",
        value: "dnxmsl",
        type: "number",
      },
      {
        label: "当年支出金额",
        value: "dnzcje",
        type: "number",
      },
      {
        label: "当年预算金额",
        value: "dnysje",
        type: "number",
      },
      {
        label: "当年执行率",
        value: "dnzxl",
        type: "number",
      },
      {
        label: "当前人员数量",
        value: "dnrysl",
        type: "number",
      },
      {
        label: "当年人均支出金额",
        value: "dnrjzcje",
        type: "number",
      },
    ],
  };
  return res;
}

//预算单位明细简表筛选——已更新
export async function getManageSpendTableOneFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: [
      {
        label: " 预算单位名称",
        value: "budget_unit_name",
        type: "string",
      },
      {
        label: "当年项目数量",
        value: "unit_pro_cnt",
        type: "number",
      },
      {
        label: "当年支出金额(万元)",
        value: "ROUND(actual_pay_amount / 10000, 2)",
        type: "number",
      },
      {
        label: "当年预算金额(万元)",
        value: "ROUND(budget_amount / 10000, 2)",
        type: "number",
      },
      {
        label: "当年执行率",
        value: " concat(coalesce(ROUND(unit_execute_rate*100 ,2),'--'),'%') ",
        type: "number",
      },
      {
        label: "当前人员数量",
        value: "unit_active_headcount",
        type: "number",
      },
      {
        label: "当年人均支出金额(万元)",
        value: "ROUND(avg_pay_amount / 10000, 2) ",
        type: "number",
      },
    ],
  };
  return res;
}

//项目分析明细简表——已更新
export async function getManageSpendTableTwo(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendTableTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select * from (select pro_type_name as xmlx, unit_name as ysdw, pro_code as xmdm, pro_name as xmmc, round(sum(payout_amount)/10000,2) as zcje   from  cas_fus_sj_xzsydw_bkfx_pro_detail_i_y where 1=1  @[and nf= '${param.year}'] @[and dept_code = '${param.dept_code}'] group by dept_code, pro_type_name, unit_name,unit_code , pro_code, pro_name, nf @[order by ${param.odName}]) aa where 1=1 @[and ${param.filterCondition}] LIMIT ${param.pageSize} OFFSET ${param.pageOffset} ;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendTableTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendTableTwo dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
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
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageSpendTableTwo res: ", JSON.stringify(res));
  return res;
}

//项目分析明细简表——已更新
export async function getManageSpendTableTwoTotal(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendTableTwoTotal req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "SELECT COUNT(*) AS total from (select dept_code, pro_type_name, unit_name,unit_code , pro_code, pro_name, nf FROM cas_fus_sj_xzsydw_bkfx_pro_detail_i_y  where 1=1  @[and nf= '${param.year}'] @[and dept_code = '${param.dept_code}'] group by dept_code, pro_type_name, unit_name,unit_code ,pro_code, pro_name, nf) as sss;",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendTableTwoTotal dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendTableTwoTotal dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: dacpRes.data,
  };
  console.log("getManageSpendTableTwoTotal res: ", JSON.stringify(res));
  return res;
}

//项目分析明细简表排序——已更新
export async function getManageSpendTableTwoSort() {
  const res = {
      code: 0,
      message: "成功",
      data: 
      [
          {
              "label": " 项目类型",
              "value": "xmlx",
              "type": "string"
          },
          {
              "label": "预算单位名称",
              "value": "ysdw",
              "type": "string"
          },
          {
              "label": "项目名称",
              "value": "xmmc",
              "type": "string"
          },
         {
              "label": "支出金额(万元)",
              "value": "zcje",
              "type": "number"
         }
      ]
  }
  return res;
}

//项目分析明细简表筛选——已更新
export async function getManageSpendTableTwoFilter() {
  const res = {
    code: 0,
    message: "成功",
    data: 
    [
        {
            "label": " 项目类型",
            "value": "xmlx",
            "type": "string"
        },
        {
            "label": "预算单位名称",
            "value": "ysdw",
            "type": "string"
        },
        {
            "label": "项目名称",
            "value": "xmmc",
            "type": "string"
        },
       {
            "label": "支出金额(万元)",
            "value": "zcje",
            "type": "number"
       }
    ]
  }
  return res;
}

//排行榜——资金TOP5——已更新
export async function getManageSpendTopListOne(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendTopListOne req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct budget_unit_name as name,ROUND(actual_pay_amount/10000,2) as actual_pay_amount from cas_fus_sj_xzsydw_ysunit_overview_i_y where 1=1 @[and budget_year=${param.year}] @[and dept_code=${param.dept_code}] order by actual_pay_amount desc limit 5",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendTopListOne dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendTopListOne dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    // 计算所有 actual_pay_amount 的总和
    let total = data.reduce((sum, item) => sum + item.actual_pay_amount, 0);

    // 为每个对象添加 value 属性
    data = data.map((item) => {
      return {
        name: item.name,
        value: ((item.actual_pay_amount / total) * 100).toFixed(2),
        money: (item.actual_pay_amount * 1.0).toFixed(2),
      };
    });
    return data;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageSpendTopListOne res: ", JSON.stringify(res));
  return res;
}

//排行榜——资金增长率TOP5——已更新
export async function getManageSpendTopListTwo(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendTopListTwo req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct budget_unit_name as name,ROUND(actual_pay_amount_change,4)*100 as value from cas_fus_sj_xzsydw_ysunit_overview_i_y where 1=1 @[and budget_year=${param.year}] @[and dept_code=${param.dept_code}] order by actual_pay_amount_change desc limit 5",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendTopListTwo dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendTopListTwo dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    return data.map((item) => ({
      ...item,
      value: item.value ? item.value : 0,
    }));
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageSpendTopListTwo res: ", JSON.stringify(res));
  return res;
}

//排行榜——资金执行率后5——已更新
export async function getManageSpendTopListThree(req) {
  // 打印视图层的入参请求
  console.log("getManageSpendTopListThree req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct budget_unit_name as name,round(unit_execute_rate,4)*100 as value from cas_fus_sj_xzsydw_ysunit_overview_i_y where 1=1 and unit_execute_rate is not null @[and budget_year=${param.year}] @[and dept_code=${param.dept_code}] order by unit_execute_rate asc limit 5",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getManageSpendTopListThree dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getManageSpendTopListThree dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    return data.map((item) => ({
      ...item,
      value: item.value ? item.value : 0,
    }));
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getManageSpendTopListThree res: ", JSON.stringify(res));
  return res;
}

//获取下属预算单位信息——已更新
export async function getPieData(req) {
  // 打印视图层的入参请求
  console.log("getPieData req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select bb.budget_unit_type, bb.cnt, aa.budget_unit_name, aa.budget_unit_code from CAS_FUS_SJ_XZSYDW_YSUNIT_BASIC_INFO_I_Y as aa left join (select budget_unit_type,count(*) as cnt from CAS_FUS_SJ_XZSYDW_YSUNIT_BASIC_INFO_I_Y where 1=1 @[and dept_code='${param.dept_code}'] group by budget_unit_type) as bb on aa.budget_unit_type=bb.budget_unit_type where 1=1 @[and aa.dept_code='${param.dept_code}'];",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getPieData dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getPieData dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
  if (dacpRes.code != 0) {
    return {
      code: dacpRes.code,
      message: dacpRes.message,
      data: dacpRes.data,
    };
  }

  // 转换接口调用结果为前端需要的结构
  function transformData(data) {
    const result = [];

    data.forEach((item) => {
      // 查找当前预算单位类型是否已存在于结果数组中
      let category = result.find((cat) => cat.name === item.budget_unit_type);
      if (!category) {
        // 如果不存在，创建新类型对象并初始化
        category = {
          name: item.budget_unit_type,
          value: 0, // 用于累加cnt
          units: [],
        };
        result.push(category);
      }
      // 增加类型的计数值
      category.value = item.cnt;
      // 添加预算单位名称到对应的 units 数组中
      category.units.push({
        label: item.budget_unit_name,
        code: item.budget_unit_code,
      });
    });

    return result;
  }

  // 构造并返回给视图层的响应
  const res = {
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getPieData res: ", JSON.stringify(res));
  return res;
}

//获取主管单位资金性质——已更新
export async function getFundsTypeOption(req) {
  // 打印视图层的入参请求
  console.log("getFundsTypeOption req: ", JSON.stringify(req));

  // 构造后端dacp接口请求
  const dacpReq = {
    sqlEndpoint: "audit_rds_dataVisualization_3",
    sqlTemplate:
      "select distinct fund_nature_name as label,fund_nature_code as value from cas_fus_sj_xzsydw_ysunit_fund_nature_i_y where 1=1 @[and budget_year=${param.year}] ",
    sqlParameter: req,
  };

  // 调用后端dacp接口
  console.log("getFundsTypeOption dacpReq: ", JSON.stringify(dacpReq));
  const dacpRes = await axiosInstance.post(`${manageUrl}`, dacpReq, {
    timeout: -1,
  });
  console.log("getFundsTypeOption dacpRes: ", JSON.stringify(dacpRes));

  // 判断后端dacp接口调用响应码，如果不成功，直接返回失败
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
    code: dacpRes.code,
    message: "成功",
    data: transformData(dacpRes.data),
  };
  console.log("getFundsTypeOption res: ", JSON.stringify(res));
  return res;
}
