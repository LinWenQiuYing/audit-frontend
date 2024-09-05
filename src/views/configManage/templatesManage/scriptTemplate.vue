<template>
  <div class="script-template">
    <div class="script-template-item">
      <p class="content-sub-title">模板脚本展示</p>
      <!-- <a-textArea
        allow-clear
        type="text"
        :auto-size="{ minRows: 8, maxRows: 15 }"
        class="script-template-input"
        placeholder="请输入模板脚本"
        :disabled="detailsType === 'check' || isLock"
        v-model.trim="details.templateScript"
      /> -->
      <div
        v-if="detailsType !== 'check'"
        :style="{
          '-webkit-user-modify': 'read-write-plaintext-only',
        }"
        class="script-template-input"
        @input="handleInput($event.currentTarget.innerHTML)"
        ref="inputTag"
        id="inputTag"
      ></div>
      <div
        v-else
        class="script-template-input"
        ref="inputTag"
        id="inputTag"
        :style="{
          '-webkit-user-modify': 'read-only',
        }"
      ></div>
      <div class="script-template-tools">
        <div class="script-template-upload">
          <span class="upload-label">上传示例图片：</span>
          <a-upload
            v-if="!imgUrl"
            name="file"
            :multiple="false"
            :show-upload-list="false"
            :before-upload="beforeUpLoad"
          >
            <span class="upload-btn">点击上传</span>
          </a-upload>
          <span class="upload-btn" v-else @click="handlePreview"
            >点击查看示例图片</span
          >
        </div>
        <div class="script-template-btns">
          <a-button
            type="primary"
            @click="handleAddParams"
            :disabled="disabled || detailsType === 'check'"
            class="script-template-btn"
          >
            添加参数
          </a-button>
          <a-button
            type="primary"
            @click="handleSelectParams"
            :disabled="
              disabled || detailsType === 'check' || !details.data.length
            "
            class="script-template-btn"
          >
            选择参数
          </a-button>
        </div>
        <!-- <a-button
          type="primary"
          class="script-template-btn"
          @click="handleSaveScript"
          >{{ isLock ? "修改脚本" : "保存脚本" }}</a-button
        > -->
      </div>
    </div>
    <div class="script-template-item">
      <p class="content-sub-title">脚本化参数及语句配置展示</p>
      <a-table
        class="templates-table"
        :columns="columns"
        :data-source="details.data"
        :pagination="pagination"
        :rowKey="(record) => record.index"
        bordered
      >
        <template
          v-for="col in ['type', 'content', 'example']"
          :slot="col"
          slot-scope="text, record, index"
        >
          <div :key="col">
            <a-cascader
              v-if="col === 'type'"
              allow-clear
              class="slot-input"
              :value="text"
              :options="paramOptions"
              placeholder="参数类型"
              :disabled="detailsType === 'check'"
              @change="(e) => handleChange(e, record.id, col)"
            />
            <a-button
              v-else-if="
                col === 'example' && record.type && record.type[0] === 'Enum'
              "
              class="slot-btn"
              @click="handleCheckEnum(record, col)"
            >
              {{ detailsType === "add" ? "配置枚举值" : "查看枚举值" }}
            </a-button>
            <a-input
              v-else
              allow-clear
              class="slot-input"
              :value="text"
              :disabled="detailsType === 'check'"
              :placeholder="
                col === 'content' ? 'e.g.过滤节点的出入度为' : 'e.g.出度填out'
              "
              @change="(e) => handleChange(e.target.value, record.id, col)"
            />
          </div>
        </template>
      </a-table>
    </div>
    <a-modal
      class="enum-modal"
      :width="600"
      :visible="isEnumModalShow"
      :destroyOnClose="true"
      @cancel="onCancel(true)"
      @ok="handleOk"
      centered
      title="枚举值"
    >
      <div class="enum-modal-content">
        <div class="enum-modal-content-title">
          <div class="title-index">编号</div>
          <div class="title-text">枚举值</div>
          <div class="title-content">展示字段</div>
        </div>
        <div class="enum-modal-content-box">
          <div class="box-item" v-for="item in enumList" :key="item.index">
            <div class="title-index" v-if="item.index < 10">
              {{ `0${item.index}` }}
            </div>
            <div class="title-index" v-else>
              {{ item.index }}
            </div>
            <div class="title-text">
              <a-input
                allow-clear
                class="modal-input"
                :value="item.text"
                placeholder="枚举值"
                :disabled="detailsType === 'check'"
                @change="
                  (e) => handleInputChange(e.target.value, item.index, 'text')
                "
              />
            </div>
            <div class="title-content">
              <a-input
                allow-clear
                class="modal-input"
                :value="item.content"
                placeholder="展示字段"
                :disabled="detailsType === 'check'"
                @change="
                  (e) =>
                    handleInputChange(e.target.value, item.index, 'content')
                "
              />
            </div>
            <a-icon
              v-if="detailsType !== 'check'"
              type="minus-circle"
              class="delete-icon"
              @click="handleDelete(item.index)"
            />
          </div>
          <a-icon
            v-if="detailsType !== 'check'"
            type="plus-circle"
            class="add-icon"
            @click="handleAdd"
          />
        </div>
      </div>
    </a-modal>
    <a-modal
      class="params-name-modal"
      :width="400"
      :visible="isParamsNameModalShow"
      :destroyOnClose="true"
      @cancel="handleModalCancel"
      @ok="addfactor"
      centered
      :title="paramModalTitle"
    >
      <div class="params-name-modal-content">
        <div class="params-name-modal-content-item">
          <span class="item-label">参数名称：</span>
          <a-select
            v-if="paramModalTitle === '选择参数'"
            allow-clear
            class="item-input"
            v-model.trim="addName"
            placeholder="参数名称"
            :options="
              details.data.map((item) => ({
                label: item.index,
                value: item.index,
              }))
            "
          />
          <a-input
            v-else
            allow-clear
            class="item-input"
            v-model.trim="addName"
            placeholder="参数名称"
            @pressEnter="addfactor"
          />
        </div>
      </div>
    </a-modal>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img
        alt="example"
        style="width: 100%"
        :src="`http://172.18.192.65:8082${imgUrl}`"
      />
    </a-modal>
  </div>
</template>
<script>
import { getBase64, scrollToBottom } from "@/utils/common.js";
import { Button, Cascader, Input, Upload, Tooltip, Icon } from "ant-design-vue";
import { cloneDeep, find, findIndex, intersection } from "lodash";
import { nanoid } from "nanoid";
import { saveModelImg } from "@/shared/api/configManage.js";

// const { TextArea } = Input;

export default {
  name: "ScriptTemplate",
  props: ["detailsType", "details"],
  data() {
    return {
      columns: [
        {
          title: "参数编号",
          dataIndex: "index",
          key: "index",
          width: "15%",
        },
        {
          title: "参数类型",
          dataIndex: "type",
          key: "type",
          width: "20%",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "参数语句",
          dataIndex: "content",
          key: "content",
          width: "30%",
          scopedSlots: { customRender: "content" },
        },
        {
          title: "示例语句",
          dataIndex: "example",
          key: "example",
          width: "35%",
          scopedSlots: { customRender: "example" },
        },
      ],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 5,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
        },
      },
      paramOptions: [
        {
          label: "数字",
          value: 1,
        },
        {
          label: "字符串",
          value: 2,
        },
        {
          label: "枚举值",
          value: "Enum",
          children: [
            {
              label: "数字",
              value: 3,
            },
            {
              label: "字符串",
              value: 4,
            },
          ],
        },
      ],
      isEnumModalShow: false,
      enumList: [],
      enumBaseList: [], // 备份enumList，以备取消配置枚举值时可以回到原来的数据状态下
      isLock: false,
      checkItem: undefined,
      col: undefined,
      list: [], // 存放变量的名字
      data: [], // 存放已经配置好的参数信息
      disabled: true, // 是否可以添加参数
      range: undefined,
      addName: undefined, // 弹窗内的添加的参数名
      addId: undefined, // 弹窗内的添加的参数id
      paramName: undefined, // 当前添加的参数名
      isParamsNameModalShow: false, // 添加参数弹窗是否展示
      paramModalTitle: "添加参数", // 添加参数弹窗的标题
      isAdd: true, // 是添加参数还是编辑参数
      imgUrl: undefined, // 存放已经上传的文件的base64
      previewVisible: false, // 是否显示预览
    };
  },
  components: {
    AButton: Button,
    ACascader: Cascader,
    AInput: Input,
    AIcon: Icon,
    ATooltip: Tooltip,
    AUpload: Upload,
  },
  watch: {
    details: {
      handler(newValue) {
        this.details = newValue;
      },
      deep: true,
    },
  },
  mounted() {
    document.addEventListener("selectionchange", this.selecthandler);
    console.log("details", this.details);
    if (this.details.imagePath) {
      this.imgUrl = this.details.imagePath;
    }
    // 监听脚本输入框的参数变化情况
    this.handleListenerParamChange();
    if (this.details.templateScript) {
      const dom = this.$refs.inputTag;
      let templateScript = this.details.templateScript;
      templateScript = templateScript.replace(/([><])/g, " $1 "); // 将<>运算符的前后加上空格
      templateScript = templateScript.replace(/> =/g, ">="); // 将> =替换为>=
      templateScript = templateScript.replace(/< =/g, "<="); // 将< =替换为<=
      templateScript = templateScript.replace(/- >/g, "->"); // 将- >替换为->
      templateScript = templateScript.replace(/< -/g, "<-"); // 将< -替换为<-
      // 将${param}替换为dom
      this.details.data.map((item) => {
        const reg = new RegExp("\\${" + item.index + "}", "g");
        const r = templateScript.match(reg);
        item.sumNum = r.length;
        const domStr = `<wise class="param-box"><span class="param-box-input ${item.id}" data-id="${item.id}">${item.index}</span><span style="color: black;">✕</span></wise>`;
        templateScript = templateScript.replace(reg, domStr);
      });
      dom.innerHTML = templateScript;
      if (this.detailsType === "check") return; // 如果为查看模板详情，则不需要支持下面的点击事件
      // 给每个替换过的dom添加onclick事件
      this.$nextTick(() => {
        this.details.data.map((item) => {
          const paramDom = document.getElementsByClassName(item.id);
          Array.from(paramDom).map((dom) => {
            dom.onclick = (event) => {
              this.disabled = true;
              this.isParamsNameModalShow = true;
              this.paramModalTitle = "编辑参数";
              this.isAdd = false;
              this.addName = event.target.innerHTML;
              this.addId = event.target.dataset.id;
            };

            const cancelNode = dom.nextSibling;
            cancelNode.onclick = (even) => {
              this.$refs.inputTag.removeChild(even.target.parentElement);
              this.handleInput(this.$refs.inputTag.innerHTML);
            };
          });
        });
      });
    }
  },
  beforeDestroy() {
    document.removeEventListener("selectionchange", this.selecthandler);
  },
  methods: {
    handleSaveScript() {
      // 弃用
      if (this.details && this.details.templateScript) {
        this.isLock = !this.isLock;
        if (!this.isLock) return false;
        const reg = /\$\{(.+?)\}/;
        const reg_g = /\$\{(.+?)\}/g;
        const result = this.details.templateScript.match(reg_g);
        const list = [];
        if (result) {
          for (let i = 0; i < result.length; i++) {
            const item = result[i];
            list.push(item.match(reg)[1]);
            if (result.indexOf(item) !== i) {
              this.$message.error("参数编号重复，请修改!");
              this.$set(this.details, "data", []);
              return false;
            }
          }
          const newList = intersection(this.list, list); // 交集
          this.list = list; // 保存是为了下一次做比较
          const data = [];
          list.map((item, index) => {
            if (newList.indexOf(item) !== -1) {
              // 在交集中
              const target = find(this.data, (v) => v.index === item);
              data.push(target);
            } else {
              // 其余的在差集中
              data.push({
                id: index,
                index: item,
                type: undefined,
                content: undefined,
                example: undefined,
              });
            }
          });
          this.data = data; // 保存是为了下一次做比较
          this.$set(this.details, "data", data);
          if (this.isLock) {
            scrollToBottom(this, "template-details-content", 10);
          }
        } else {
          this.$message.error("请输入正确的模板");
          this.isLock = !this.isLock;
          return false;
        }
      } else {
        this.$message.error("请先输入脚本内容！");
      }
    },
    handleChange(value, id, column) {
      const newData = [...this.details.data];
      // return false;
      const target = find(newData, (v) => v.id == id);
      if (target) {
        target[column] = value;
        if (column === "type") {
          if (value.length) {
            switch (value.slice(-1)[0]) {
              case 1:
                target.typeText = "数字";
                break;
              case 2:
                target.typeText = "字符串";
                break;
              case 3:
                target.typeText = "整数枚举值";
                break;
              case 4:
                target.typeText = "字符串枚举值";
                break;

              default:
                break;
            }
          } else {
            target.typeText = undefined;
            // target.content = undefined;
            target.example = undefined;
          }
        }
        this.$set(this.details, "data", newData);
      }
    },
    handleCheckEnum(record, col) {
      if (!record.type || (record.type && record.type[0] !== "Enum")) return;
      this.checkItem = record;
      this.col = col;
      const target = find(this.details.data, (v) => v.id == record.id);
      console.log("target", target, this.details.data, record.id, col);
      if (!target.example || !Array.isArray(target.example)) {
        this.handleChange(
          [
            {
              index: 1,
              text: undefined,
              content: undefined,
            },
          ],
          record.id,
          col
        );
      }
      this.enumList = target.example;
      this.enumBaseList = cloneDeep(this.enumList);
      this.isEnumModalShow = true;
    },
    onCancel(flag) {
      if (flag) {
        const target = find(
          this.details.data,
          (v) => v.id == this.checkItem.id
        );
        target[this.col] = this.enumBaseList;
      }
      this.isEnumModalShow = false;
    },
    handleOk() {
      let flag = false;
      if (this.enumList.length) {
        for (let i = 0; i < this.enumList.length; i++) {
          const element = this.enumList[i];
          if (!element.text || !element.content) {
            this.$message.error("请填写完整的枚举值！");
            flag = true;
            break;
          }
        }
      } else {
        this.$message.error("请至少填写一个完整的枚举值！");
        flag = true;
      }
      if (!flag) {
        this.onCancel(false);
      }
    },
    handleInputChange(value, index, type) {
      this.enumList[index - 1][type] = value;
    },
    handleDelete(index) {
      if (this.detailsType === "check") return false;
      this.enumList.splice(index - 1, 1);
      this.enumList.map((item, index) => {
        item.index = index + 1;
      });
    },
    handleAdd() {
      if (this.detailsType === "check") return false;
      this.enumList.push({
        index: this.enumList.length ? this.enumList.slice(-1)[0].index + 1 : 1,
        text: undefined,
        content: undefined,
      });
    },
    handleInput(value) {
      if (this.disabled && this.detailsType === "check") return;
      this.$set(this.details, "templateScript", value);
    },
    async beforeUpLoad(file) {
      console.log("file", file);
      // if (file.size / Math.pow(1024, 2) < 10) {
      //   this.fileList = [file];
      // } else {
      //   this.fileList = [];
      //   this.$message.error("上传文件不超过10M，仅支持CSV文件");
      // }
      const isImage = file.type.match("image/*");
      if (!isImage) {
        this.$message.error("只能上传图片文件！");
        return false;
      }
      try {
        file.url = await getBase64(file);
        const payload = {
          modelName: nanoid(),
          imgString: file.url,
        };
        const preview = await saveModelImg(payload);
        if (!preview.data) {
          this.$message.error("上传模板图片失败，请重试");
          return false;
        }
        this.imgUrl = preview.data;
      } catch (error) {
        this.$message.destroy();
        this.$message.error("上传模板图片失败，请重试");
      }
      this.$set(this.details, "imagePath", this.imgUrl);
      return false;
    },
    async handlePreview() {
      this.previewVisible = true;
    },
    selecthandler() {
      let sel = window.getSelection();
      let range = sel ? (sel.rangeCount > 0 ? sel.getRangeAt(0) : null) : null;
      if (
        range &&
        range.commonAncestorContainer.ownerDocument.activeElement.id ===
          "inputTag"
      ) {
        this.range = range;
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    addfactor() {
      const data = this.details.data;
      const inputNode = document.createElement("span");
      this.handleModalCancel();
      const index = findIndex(data, (v) => v.index === this.paramName);
      if (index > -1 && this.paramModalTitle !== "选择参数") {
        this.$message.error("参数编号重复，请重新填写！");
        return false;
      }
      if (this.paramModalTitle === "选择参数") {
        const target = find(data, (v) => v.index === this.paramName);
        this.addId = target.id;
        target.sumNum++;
      }
      if (!this.isAdd) {
        // 编辑节点
        const target = find(data, (v) => v.id == this.addId);
        console.log("this.addId", this.addId, target);
        target.index = this.paramName;

        const doms = document.getElementsByClassName(this.addId);
        Array.from(doms).map((ele) => {
          ele.innerText = this.paramName;
          this.handleInput(this.$refs.inputTag.innerHTML);
        });
        setTimeout(() => {
          this.$refs.inputTag.blur();
          this.disabled = true;
        }, 0);
        return;
      }

      const id = nanoid();
      inputNode.innerText = this.paramName;
      const addId = this.addId || this.addId === 0 ? this.addId : id;
      inputNode.className = "param-box-input " + addId;
      inputNode.dataset.id = addId;
      inputNode.onclick = (event) => {
        this.disabled = true;
        this.isParamsNameModalShow = true;
        this.paramModalTitle = "编辑参数";
        this.isAdd = false;
        this.addName = event.target.innerHTML;
        this.addId = event.target.dataset.id;
      };
      this.addTag(inputNode);
    },
    addTag(html) {
      let node = null;
      setTimeout(() => {
        this.$refs.inputTag.blur();
        this.disabled = true;
      }, 0);
      if (this.paramModalTitle !== "编辑参数") {
        node = document.createElement("wise");
        node.className = "param-box";
        node.append(html);
        const cancelNode = document.createElement("span");
        cancelNode.innerText = "✕";
        cancelNode.style.color = "black";
        cancelNode.onclick = (even) => {
          this.$refs.inputTag.removeChild(even.target.parentElement);
          this.handleInput(this.$refs.inputTag.innerHTML);
        };
        node.append(cancelNode);
        this.insertNode(node);
      }
      this.disabled = true;
    },
    insertNode(node) {
      if (this.range) {
        this.range.deleteContents(); // 删除选中的内容
        this.range.insertNode(node);
      }
      this.handleInput(this.$refs.inputTag.innerHTML);
    },
    handleAddParams() {
      this.isAdd = true;
      this.addId = undefined;
      this.isParamsNameModalShow = true;
      this.paramModalTitle = "添加参数";
    },
    handleSelectParams() {
      this.isAdd = true;
      this.addId = undefined;
      this.isParamsNameModalShow = true;
      this.paramModalTitle = "选择参数";
    },
    handleModalCancel() {
      this.isParamsNameModalShow = false;
      this.paramName = this.addName;
      this.addName = undefined;
    },
    handleListenerParamChange() {
      const targetNode = this.$refs.inputTag;
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.map((item) => {
          if (item.type === "childList") {
            let targetName = null;
            let targetId = null;
            let sameNameNum = 0;
            let flag = null; // remove为true，add为false
            if (item.removedNodes.length && item.removedNodes[0].children) {
              targetName = item.removedNodes[0].children[0].innerText;
              targetId = item.removedNodes[0].children[0].dataset.id;
              const target = find(this.details.data, (v) => v.id == targetId);
              target.sumNum--;
              sameNameNum = target.sumNum;
              flag = true;
            } else if (item.addedNodes.length && item.addedNodes[0].children) {
              targetName = item.addedNodes[0].children[0].innerText;
              targetId = item.addedNodes[0].children[0].dataset.id;
              flag = false;
            }
            if (flag === null) return;
            const index = findIndex(this.details.data, (v) => v.id == targetId);
            const data = cloneDeep(this.details.data);
            if (flag && index > -1 && sameNameNum === 0) {
              data.splice(index, 1);
            } else if (!flag && index === -1) {
              setTimeout(() => {
                this.$refs.inputTag.blur();
                this.disabled = true;
              }, 0);
              data.push({
                id: targetId,
                index: targetName,
                type: undefined,
                content: undefined,
                example: undefined,
                sumNum: 1,
              });
            }
            this.$set(this.details, "data", data);
          }
        });
      });
      observer.observe(targetNode, {
        childList: true, // 观察目标子节点的变化，是否有添加或者删除
        attributes: false, // 观察属性变动
        subtree: false, // 观察后代节点，默认为 false
      });
    },
  },
};
</script>
<style lang="less">
.script-template {
  &-item {
    overflow: hidden;
  }

  .templates-table {
    .slot-input {
      width: 100%;
      margin: -5px 0;
      color: @primaryTextColor !important;

      .ant-input[disabled] {
        text-align: center;
        background-color: #fff !important;
        color: @primaryTextColor !important;
      }
    }

    .slot-btn {
      border: 0;
      width: 100%;
      color: @blue;
      margin: 0 auto;
    }
  }

  &-input {
    width: 100%;
    height: 178px;
    overflow: hidden;
    padding: 4px 11px;
    border-radius: 4px;
    box-sizing: border-box;
    word-break: break-all;
    white-space: break-spaces;
    border: 1px solid #d9d9d9;
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 20px;

    &:hover {
      border-color: #40a9ff;
    }

    &:focus-visible,
    &:focus {
      outline: 0;
      border-color: #40a9ff;
      border-right-width: 1px !important;
    }

    .param-box {
      height: 22px;
      margin: 0 4px;
      padding: 0 8px;
      cursor: default;
      color: #262626;
      user-select: none;
      line-height: 22px;
      border-radius: 2px;
      white-space: nowrap;
      display: inline-block;
      background-color: #f0f6fe;
      -webkit-user-modify: read-only !important;

      &-input {
        margin-right: 8px;
      }
    }
  }

  &-tools {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .upload-btn {
      color: @blue;
      cursor: pointer;
    }
  }

  &-btns {
    .ant-btn {
      margin-left: 10px;
    }
  }
}

.enum-modal {
  &-content {
    max-height: 500px;

    &-title {
      display: flex;
      align-items: center;
      margin-bottom: 14px;
      padding-bottom: 12px;
      color: @primaryTextColor;
      border-bottom: 1px solid #d9d9d9;
    }

    &-box {
      overflow: auto;
      max-height: 452px;
      color: @primaryTextColor;

      .box-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
    }

    .title-index {
      width: 40px;
      margin-right: 60px;
      text-align: center;
    }

    .title-text {
      width: 180px;
      text-align: center;
      margin-right: 60px;
    }

    .modal-input {
      .ant-input[disabled] {
        text-align: center;
        background-color: #fff !important;
        color: @primaryTextColor !important;
      }
    }

    .title-content {
      width: 180px;
      text-align: center;
    }

    .add-icon {
      width: 40px;
      color: @blue;
    }

    .delete-icon {
      color: @blue;
      margin-left: 10px;
    }
  }
}

.params-name-modal {
  &-content {
    &-item {
      display: flex;
      align-items: center;

      .item-label {
        width: 75px;
      }

      .item-input {
        width: calc(100% - 75px);
      }
    }
  }
}

.script-content-tooltip {
  max-width: 530px;
}
</style>
