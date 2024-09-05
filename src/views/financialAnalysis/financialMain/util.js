//minimumFractionDigits 和 maximumFractionDigits 选项被设置为 4，以确保小数部分保留四位小数。

//改为千分位
function formatNumberWithCommas(string) {
  // return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return Number(string).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}
//对比分析tab页面修改为千分位
export function formatDataWithCommas(data) {
  // 遍历对象或数组
  if (Array.isArray(data)) {
    // 如果是数组，则递归处理每个元素
    return data.map((item) => formatDataWithCommas(item));
  } else if (typeof data === "object" && data !== null) {
    // 如果是对象，则递归处理每个属性的值
    const formattedObj = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        // typeof value === "number"
        // todo 需要确认真实数据是否都包含小数点   如果后续生产数据金额不包含小数点，替换如下判断
        // if(key.startsWith('startMoney') || key.startsWith('allMoney') || key.startsWith('endMoney'))
        if (value.includes(".") && typeof value === "string") {
          formattedObj[key] = formatNumberWithCommas(value);
        } else {
          formattedObj[key] = formatDataWithCommas(value);
        }
      }
    }
    return formattedObj;
  } else {
    // 如果是其他类型（字符串、数字等），直接返回
    return data;
  }
}

//对比分析展示栏目递归筛选展示项目
export function filterDataByCheckedList(data, checkedList) {
  function filterNode(node) {
    if (node.title.indexOf("额") !== -1) {
      return checkedList.includes(node.title) ? node : null;
    } else {
      const filteredChildren = node.children
        .map((child) => filterNode(child))
        .filter((child) => child !== null);

      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }

      return checkedList.includes(node.title)
        ? { ...node, children: [] }
        : null;
    }
  }
  return data.map((item) => filterNode(item)).filter((item) => item !== null);
}

//总账明细账获取会计科目的父亲、祖父
export function generateHierarchy(inputSet) {
  // Convert inputSet to an array and sort it
  const sortedSet = Array.from(inputSet).sort();

  // Initialize a set to store the result
  const resultSet = new Set();

  // Function to recursively add all prefixes to the set
  function addPrefixes(code) {
    const lengths = [4, 6, 8];
    lengths.forEach((length) => {
      if (code.length >= length) {
        const prefix = code.slice(0, length);
        resultSet.add(prefix);
      }
    });
  }

  // Process each code in the sorted set
  sortedSet.forEach((code) => addPrefixes(code));

  // Convert the result set back to an array and sort it
  const resultArray = Array.from(resultSet).sort();

  return resultArray;
}

//总账明细账: 表格带有三层结构的内部金额（字符串类型）转换为千分位
export function formatArray(arr) {
  const formatDecimalValues = function (obj) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (typeof value === "string" && value.includes(".")) {
          obj[key] = Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }); // 格式化为千分位
        } else if (
          typeof value === "number" &&
          value.toString().includes(".")
        ) {
          obj[key] = Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }); // 格式化为千分位
        } else if (Array.isArray(value)) {
          value.forEach((child) => formatDecimalValues(child)); // 递归处理 children 数组
        }
      }
    }
    return obj;
  };
  return arr.map((obj) => formatDecimalValues(obj));
}

//单层表格内部金额（字符串类型）转换为千分位： 综合分析tab
export function formatDecimalValues(arr) {
  return arr.map((obj) => {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value.includes(".")) {
          newObj[key] = Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }); // 格式化为千分位
        } else {
          newObj[key] = value;
        }
      }
    }
    return newObj;
  });
}
