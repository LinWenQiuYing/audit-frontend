//key、value的选项，根据key返回value的数组   单层主管单位
export function findValueByKey(name, nodes) {
  let arr = [];
  for (let node of nodes) {
    if (node.key.split("--")[1] === name) {
      arr.push(node.value);
      return arr; // 找到匹配的标题返回其对应的 value 值
    }
  }
  return []; // 如果未找到返回 null
}

//树形预算单位根据名称获取id
export function findValueByTitle(name, nodes) {
  let arr = [];
  for (let node of nodes) {
    if (node.title.split("——")[1] === name) {
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

//判断树形选择框是否是父节点
export function filterMenuList(treeData) {
  return treeData.map((item) => ({
    ...item,
    disabled: item.children && item.children.length > 0 ? true : false,
    children: item.children ? filterMenuList(item.children) : [],
  }));
}

//------非税明细表
//非税收入明细：树形收入类别单位根据名称获取value
export function findNotaxValueByTitle(name, nodes) {
  // let arr = [];
  for (let node of nodes) {
    if (node.title == name) {
      return node.value;
      // arr.push(node.value); // 这里value值样例为"广告收入_2_103029901"
      // return arr; // 找到匹配的标题返回其对应的 value 值
    }
    if (node.children) {
      let foundValue = findNotaxValueByTitle(name, node.children);
      if (foundValue) {
        return foundValue; // 如果在子节点中找到则返回
      }
    }
  }
  return null; // 如果未找到返回 null
}
