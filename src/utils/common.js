import { nanoid } from "nanoid";

export const autoResize = (echarts) => {
  const handleResize = () => echarts.resize();
  window.addEventListener("resize", handleResize);
  // 下面的语句没有起到效果，是配合react useEffect的方法，在vue中不生效
  // return () => window.removeEventListener("resize", handleResize);
};

export function downloadFile(content, fileName) {
  let blob = null;

  if (!(content instanceof Blob)) {
    blob = new Blob([content]);
  } else {
    blob = content;
  }
  let aLink = document.createElement("a");
  let evt = new MouseEvent("click", {
    view: window,
    bubbles: false,
    cancelable: true,
  });
  evt.initEvent("click", false, false);
  aLink.href = URL.createObjectURL(blob);
  aLink.download = fileName || "";
  document.body.appendChild(aLink);
  aLink.dispatchEvent(evt);

  window.setTimeout(() => {
    document.body.removeChild(aLink);
    aLink = null;
    evt = null;
  });
}
class Storage {
  constructor(name) {
    this.name = name;
  }
  //设置缓存
  setItem(params) {
    let obj = {
      name: "",
      value: "",
      expires: 0,
      startTime: new Date().getTime(), //记录何时将值存入缓存，毫秒级
    };
    let options = {};
    //将obj和传进来的params合并
    Object.assign(options, obj, params);
    if (options.expires) {
      //如果options.expires设置了的话
      //以options.name为key，options为值放进去
      localStorage.setItem(options.name, JSON.stringify(options));
    } else {
      //如果options.expires没有设置，就判断一下value的类型
      let type = Object.prototype.toString.call(options.value);
      //如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
      if (type == "[object Object]" || type == "[object Array]") {
        options.value = JSON.stringify(options.value);
      }
      localStorage.setItem(options.name, options.value);
    }
  }
  //拿到缓存
  getItem(name) {
    let item = JSON.parse(localStorage.getItem(name));
    //如果有expires的值，说明设置了失效时间
    if (item && item.expires) {
      let date = new Date().getTime();
      //何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
      if (date - item.startTime > item.expires) {
        //缓存过期，清除缓存，返回false
        localStorage.removeItem(name);
        return false;
      } else {
        //缓存未过期，返回值
        return item.value;
      }
    } else {
      //如果没有设置失效时间，直接返回值
      return item;
    }
  }
  //移出缓存
  removeItem(name) {
    localStorage.removeItem(name);
  }
  //移出全部缓存
  clear() {
    localStorage.clear();
  }
}

export const LocalStorage = new Storage();

export function hideIdCode(idCode) {
  return idCode.replace(/^(.{6})(?:\d+)(.{4})$/, "$1********$2");
}

export function hidePhoneNumber(phoneNumber) {
  return phoneNumber.replace(/(\d{3})\d*(\d{4})/, "$1****$2");
}

export function hideName(name) {
  return name.replace(/(?<=.)./g, "*");
}

export function getUserInfo() {
  return LocalStorage.getItem("userInfo");
}

export function getUserRights() {
  return LocalStorage.getItem("userRights");
}

export function getParamsObj() {
  return JSON.parse(sessionStorage.getItem("paramsObj"));
}

export function strReduct(str, len) {
  // 按需截取字符串方法
  if (str.length <= len) {
    return str;
  } else {
    return str.split("").splice(0, len).join("") + "...";
  }
}

export function modalConfirm(title, _that, onOk, content) {
  _that.$confirm({
    title: title,
    icon: () =>
      _that.$createElement("img", {
        attrs: {
          src: require("@/assets/images/img/icon_info_circle.svg"),
          class: "confirm-icon",
        },
      }),
    content: content,
    okText: "是",
    okType: "primary",
    centered: true,
    cancelText: "否",
    onOk: onOk,
    onCancel: () => {
      _that.$message.info("已取消");
    },
  });
}

// 页面自动滚动到底部
export function scrollToBottom(_that, domId, step) {
  // step: 每次滚动幅度， _that: vue的示例对象-this
  _that.$nextTick(() => {
    // 找到是哪个区域在滚动-domId
    let scrollTop = document.getElementById(domId).scrollTop;
    const clientHeight = document.getElementById(domId).clientHeight;
    const scrollHeight = document.getElementById(domId).scrollHeight;
    const timer = setInterval(() => {
      if (scrollTop + clientHeight < scrollHeight) {
        document.getElementById(domId).scrollTop += step;
        scrollTop += step;
      } else {
        clearInterval(timer);
      }
    }, 10);
  });
}

// 页面自动滚动到顶部
export function scrollToTop(_that, domId, step) {
  // step: 每次滚动幅度， _that: vue的示例对象-this
  _that.$nextTick(() => {
    // 找到是哪个区域在滚动-domId
    let scrollTop = document.getElementById(domId).scrollTop;
    const timer = setInterval(() => {
      if (scrollTop > 0) {
        document.getElementById(domId).scrollTop -= step;
        scrollTop -= step;
      } else {
        clearInterval(timer);
      }
    }, 10);
  });
}

export function getRulesGroup(list) {
  let result = [
    {
      id: -1,
      types: "relations",
      relations: "且",
    },
  ];
  list.map((item) => {
    if (!item.parentId) {
      if (item.logic === 2) {
        // 条件组
        result.push([
          {
            id: item.id,
            types: "relations",
            relations: "且",
          },
        ]);
      } else {
        // 条件
        if (item.logic === 0) {
          result[0].relations = "或";
        } else if (item.logic === 1) {
          result[0].relations = "且";
        }
        result.push({
          id: nanoid(),
          condition: {
            key: item.conditionId,
            conditionDesc: item.conditionDesc,
            title: item.conditionName,
            content: item.sqlContext,
            detail: item.sqlContextValue ? item.sqlContextValue : null,
            hitStatus: item.hitStatus ? item.hitStatus : false,
          },
          types: "single",
        });
      }
    } else {
      let target = [];
      for (let i = 0; i < result.length; i++) {
        const ele = result[i];
        if (Array.isArray(ele) && ele[0].id === item.parentId) {
          target = ele;
          break;
        }
      }
      if (item.logic === 0) {
        target[0].relations = "或";
      } else if (item.logic === 1) {
        target[0].relations = "且";
      }
      target.push({
        id: nanoid(),
        condition: {
          key: item.conditionId,
          conditionDesc: item.conditionDesc,
          title: item.conditionName,
          content: item.sqlContext,
          detail: item.sqlContextValue ? item.sqlContextValue : null,
          hitStatus: item.hitStatus ? item.hitStatus : false,
        },
        types: "single",
      });
    }
  });
  return result;
}

// 获取图片base64
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

//获取某一年的初始日期和结束日期
export function getYearStartEnd(year) {
  // 构造该年的开始日期
  let startDate = new Date(year, 0, 1); // 月份从0开始，0表示一月
  let endDate = new Date(year, 11, 31); // 月份从0开始，11表示十二月

  // 格式化日期为 'yyyy-MM-dd'
  function formatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份补零处理
    let day = date.getDate().toString().padStart(2, "0"); // 日补零处理
    return `${year}-${month}-${day}`;
  }

  // 返回格式化后的开始日期和结束日期组成的数组
  return [formatDate(startDate), formatDate(endDate)];

  // 示例用法
  // var year = 2024;
  // var yearRange = getYearStartEnd(year);
  // console.log(yearRange); // 输出 ["2024-01-01", "2024-12-31"]
}

//获取某年某一月的初始日期和结束日期
function formatDate(date) {
  // 格式化日期为 'yyyy-mm-dd' 格式的字符串
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function getMonthStartEnd(year, month) {
  // 获取第一天日期
  let firstDay = new Date(year, month - 1, 1);
  let firstDayString = formatDate(firstDay);

  // 获取最后一天日期
  let lastDay = new Date(year, month, 0);
  let lastDayString = formatDate(lastDay);

  // 返回结果数组
  return [firstDayString, lastDayString];
}

export function monthNameToNumber(monthName) {
  // 将月份名称转换为数字
  switch (monthName.toLowerCase()) {
    case "一月":
      return 1;
    case "二月":
      return 2;
    case "三月":
      return 3;
    case "四月":
      return 4;
    case "五月":
      return 5;
    case "六月":
      return 6;
    case "七月":
      return 7;
    case "八月":
      return 8;
    case "九月":
      return 9;
    case "十月":
      return 10;
    case "十一月":
      return 11;
    case "十二月":
      return 12;
    default:
      return null; // 如果输入的月份名称不合法，返回 null 或者其他合适的默认值
  }
}

// treeToList
export function treeToList(data) {
  if (!data || !data.length) {
    return;
  }
  const dataList = data.map((item) => {
    return {
      title: item.categoryName,
      key: item.id,
      scopedSlots: {
        title: item.children && item.children.length ? "folder" : "leaf",
      },
      isLeaf: item.children && item.children.length ? false : true,
      children: treeToList(item.children),
    };
  });
  return dataList;
}

//主管单位、预算单位根据名称获取id
export function findValueByTitle(name, nodes) {
  let arr = [];
  for (let node of nodes) {
    if (node.title === name) {
      arr.push(node.value);
      return arr; // 找到匹配的标题返回其对应的 value 值
    }
    if (node.children) {
      let foundValue = findValueByTitle(name, node.children);
      if (foundValue) {
        return foundValue; // 如果在子节点中找到则返回
      }
    }
  }
  return []; // 如果未找到返回 null
}

//----非税收入明细  预算单位反显
export function findValueByTitleNoTax(name, nodes) {
  let arr = [];
  for (let node of nodes) {
    if (node.label.split("--")[1] === name) {
      arr.push(node.value);
      return arr; // 找到匹配的标题返回其对应的 value 值
    }
    // if (node.children) {
    //   let foundValue = findValueByTitle(name, node.children);
    //   if (foundValue) {
    //     return foundValue; // 如果在子节点中找到则返回
    //   }
    // }
  }
  return null; // 如果未找到返回 null
}

//label、value的选项，根据label返回value的数组
export function findValueByLabel(name, nodes) {
  let id = "";
  for (let node of nodes) {
    if (node.lable === name) {
      id = node.value;
      return id; // 找到匹配的标题返回其对应的 value 值
    }
  }
  return null; // 如果未找到返回 null
}

export function findNodeByIcon(treeData, icon) {
  // 遍历树形结构
  function traverse(nodes) {
    for (let node of nodes) {
      // 如果当前节点的 icon 属性等于目标 icon，则返回该节点
      if (node.slots && node.slots.icon === icon) {
        return node;
      }
      // 如果当前节点有子节点，则递归遍历子节点
      if (node.children) {
        let result = traverse(node.children);
        if (result) {
          return result; // 如果找到符合条件的节点，则直接返回
        }
      }
    }
    return null; // 如果遍历完所有节点都没找到，则返回 null
  }

  // 调用递归遍历函数开始查找
  return traverse(treeData);
}

export function findItemInTree(
  tree,
  key,
  keyName = "key",
  childrenName = "children"
) {
  for (let item of tree) {
    if (item[keyName] === key) {
      return item;
    }
    if (item[childrenName] && item[childrenName].length > 0) {
      const foundItem = findItemInTree(
        item[childrenName],
        key,
        keyName,
        childrenName
      );
      if (foundItem) {
        return foundItem;
      }
    }
  }
  return null;
}

//找到当前节点的最近一级父节点的信息
export function findParentNodeInfo(
  key,
  treeData,
  keyName = "key",
  childrenName = "children"
) {
  function findParent(key, currentNode, parentPath = []) {
    if (currentNode[keyName] === key) {
      return parentPath;
    } else if (currentNode[childrenName]) {
      for (let child of currentNode[childrenName]) {
        const result = findParent(key, child, [...parentPath, currentNode]);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  // Find the node with the given key in the treeData
  let parentNodePath = null;
  for (let node of treeData) {
    parentNodePath = findParent(key, node);
    if (parentNodePath) {
      break;
    }
  }

  // parentNodePath will be an array of parent nodes leading to the direct parent of the node with the given key
  if (parentNodePath && parentNodePath.length > 0) {
    return parentNodePath[parentNodePath.length - 1]; // Return the direct parent node info
  } else {
    return null; // If no parent found (root node case), return null
  }
}

//todo
//主管单位画像+预算单位画像  左侧树，根据当前单位的名称获取到该节点的全部信息，可以直接setCurItem
export function findNodeByName(treeData, nodeName) {
  // 遍历树的每个节点
  for (let node of treeData) {
    // 检查当前节点是否为目标节点
    if (node.title === nodeName) {
      return node; // 找到目标节点，返回该节点
    }

    // 如果当前节点有子节点，递归查找子节点
    if (node.children) {
      let foundNode = findNodeByName(node.children, nodeName);
      if (foundNode) {
        return foundNode; // 如果找到子节点，直接返回找到的节点
      }
    }
  }

  return null; // 如果在当前节点及其子节点中都未找到目标节点，返回 null
}

// 查找数组中的key对应的最大值
export function getMax(arr, key) {
  let max = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] > max) {
      max = arr[i][key];
    }
  }
  return max;
}

// 判断数字是否存在（包括字符串数字）
export function isNumber(value) {
  if (typeof value === "number" && !isNaN(value)) {
    return true;
  }
  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    !isNaN(Number(value))
  ) {
    return true;
  }
  return false;
}

// 判断变量是否存在
export function isExist(value) {
  if (value === undefined || value === null || value === "") {
    return false;
  }
  return true;
}
/**
 * 探索功能，用于跳转到图谱探索
 * @param {VueComponent} _that vue组件实例本身
 * @param {Object} record 行信息对象
 */
let targetWindow = null;
export async function toAffairGraph(_that, json) {
  targetWindow = null;
  const store = _that.$store;
  console.log("toAffairGraph", json);
  const { userInfo } = store.state.rightsOptions;
  console.log("state", store, userInfo.token);
  let kgUrl = "https://172.18.192.133"; // todo （需要跳转登录的url）
  console.log("kgUrl", kgUrl);

  // 通过pierce token获取kg token
  // const result = await getKgToken(userInfo.token); // 根据pierce token换取kg token，本地联调或者124上可以关闭，使用targetToken
  // if (result.data) {
  _that.params = {
    branchId: json.kgBranchId, // "519fa9e1-e2f3-4af4-83cf-640953117265"
    graphName: json.graph_name, // "pierce_资金流向v1"
    bluePrintId: json.kgBluePrintId, // "840b3150-4cdc-4219-9418-231f32dd32f4"
    clueIds: json.clueIds,
    type: "审计",
    // token: `${result.data}`,
  };
  // _that.targetWindow = window.open(
  //   `http://10.144.5.87:29111/customization/sso/login?token=${userInfo.token}`
  // );

  let link = document.createElement("a");
  let evt = new MouseEvent("click", {
    view: window,
    bubbles: false,
    cancelable: true,
  });
  const id = "skip-to-kg";
  const url = `${kgUrl}/evwpg1x/clus-1-sophon-infra-3-0-1-162627308/kg/graph_analysis_pierce`;
  const onclick = () => {
    targetWindow = window.open(url);
  };
  link.setAttribute("href", "javascript:void(0)");
  link.setAttribute("id", id);
  link.onclick = onclick;
  if (!document.getElementById(id)) {
    document.body.appendChild(link);
  }

  link.dispatchEvent(evt);

  window.setTimeout(() => {
    document.body.removeChild(link);
    link = null;
    evt = null;
  });
  // _that.targetWindow = window.open(
  //   `${kgUrl}/gateway/user/api/users/password-free/login?redirect=${kgUrl}/kg/graph_analysis_pierce&token=${result.data}`
  // );
  // _that.targetWindow = window.open(
  //   `${kgUrl}/gateway/user/api/users/password-free/login?redirect=${kgUrl}/kg/graph_analysis_pierce&refer=${systemUrl}/login&token=${targetToken}`
  // );
  console.log("params", _that.params, JSON.stringify(_that.params));
  _that.isReady = true;
  // } else {
  //   console.log("result", result);
  //   _that.$message.error("获取token失败，请管理员检查！");
  // }
}
/**
 * 探索功能，用于跳转到图谱探索
 * @param {VueComponent} _that vue组件实例本身
 * @param {Object} e rescieveMessage原始对象
 */
export function rescieveMessage(e, _that) {
  console.log("rescieveMessage", e, _that);
  console.log("params", _that.params);
  const origin = e.origin;
  if (!_that.isReady) return;
  let kgUrl = "https://172.18.192.133"; // todo （需要跳转登录的url）
  console.log("kgUrl", kgUrl);

  console.log("rescieveMessage", _that.isReady, targetWindow, e, origin);
  console.log("bingo----", origin, kgUrl, origin === kgUrl);
  // 通常，onmessage()事件处理程序应当首先检测其中的origin属性，忽略来自未知源的消息
  if (origin !== kgUrl) return;
  console.log("origin", e, e.origin);
  console.log("params", _that.params);
  const data = e.data ? JSON.parse(e.data) : {};
  if (data && data.canReceive) {
    targetWindow.postMessage(JSON.stringify(_that.params), `${kgUrl}/`);
  }
  _that.isReady = false;
}
