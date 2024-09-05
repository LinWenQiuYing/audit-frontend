<template>
  <div class="template-details" ref="templateDetails">
    <div class="template-details-header">
      <span class="template-details-header-title">
        {{
          detailsType === "add"
            ? "新建模板"
            : detailsType === "edit"
            ? `模板编辑（${details.id}）`
            : `模板详情（${details.id}）`
        }}
      </span>
      <div class="template-details-header-btns">
        <a-button @click="handleReturn"> 返回 </a-button>
        <!-- <a-button
          type="primary"
          @click="handleEdit"
          v-if="detailsType === 'check'"
          :disabled="details.status == 0"
        >
          编辑模板
        </a-button> -->
        <a-button
          type="primary"
          @click="handleCreateModel"
          v-if="detailsType === 'check'"
        >
          创建模型
        </a-button>
      </div>
    </div>
    <div class="template-details-content" id="template-details-content">
      <div class="sub-title">基本信息</div>
      <div class="content-top">
        <div class="content-top-item">
          <div class="item-box">
            <span class="item-label">模板名称：</span>
            <div class="item-text" v-if="detailsType === 'check'">
              {{ details.name }}
            </div>
            <a-input
              v-else
              allow-clear
              class="item-input"
              placeholder="模板名称"
              :disabled="detailsType === 'edit'"
              v-model.trim="details.name"
            />
          </div>
          <div class="item-box">
            <span class="item-label long-label">图模式选择：</span>
            <a-tooltip
              placement="top"
              v-if="detailsType === 'check' && selectItem.length"
            >
              <template slot="title">
                <span>{{ selectItem[0].name }}</span>
              </template>
              <span class="item-btn long-btn disabled">{{
                selectItem[0].name
              }}</span>
            </a-tooltip>
            <a-tooltip
              placement="top"
              v-else-if="detailsType === 'check' && details.schemaName"
            >
              <template slot="title">
                <span>{{ details.schemaName }}</span>
              </template>
              <span class="item-btn long-btn disabled">{{
                details.schemaName
              }}</span>
            </a-tooltip>
            <a-tooltip
              placement="top"
              v-else-if="selectItem.length && detailsType !== 'check'"
            >
              <template slot="title">
                <span>{{ selectItem[0].name }}</span>
              </template>
              <span class="item-btn long-btn" @click="handleSelectSchema">{{
                selectItem[0].name
              }}</span>
            </a-tooltip>
            <a-tooltip
              placement="top"
              v-else-if="details.schemaName && detailsType !== 'check'"
            >
              <template slot="title">
                <span>{{ details.schemaName }}</span>
              </template>
              <span class="item-btn long-btn" @click="handleSelectSchema">{{
                details.schemaName
              }}</span>
            </a-tooltip>
            <span class="item-btn" @click="handleSelectSchema" v-else
              >选择Schema</span
            >
          </div>
          <div class="item-box">
            <span class="item-label long-label">模板分类：</span>
            <div v-if="detailsType === 'check'" class="item-text">
              {{ details.categoryName }}
            </div>
            <a-select
              v-else
              class="item-input"
              v-model="details.categoryId"
              placeholder="模板分类"
              :options="categoryOptions"
            />
          </div>
        </div>
        <div class="content-top-item">
          <div class="item-box textarea">
            <span class="item-label">模板描述：</span>
            <div class="item-text" v-if="detailsType === 'check'">
              {{ details.desc }}
            </div>
            <a-textArea
              v-else
              allow-clear
              type="text"
              :auto-size="{ minRows: 4, maxRows: 4 }"
              class="item-input"
              placeholder="模板描述"
              v-model.trim="details.desc"
            />
          </div>
        </div>
      </div>
      <div
        class="sub-title"
        v-if="detailsType !== 'add' && details.createType === 2"
      >
        脚本展示
      </div>
      <div
        class="sub-title"
        v-else-if="detailsType !== 'add' && details.createType === 1"
      >
        配置化展示
      </div>
      <div class="sub-title" v-else>配置详情</div>
      <div class="content-radio" v-show="detailsType === 'add'">
        <span class="item-label">生成方式：</span>
        <a-radio-group :value="details.createType" @change="onRadioChange">
          <a-radio :value="2"> 脚本化生成 </a-radio>
          <a-radio :value="1"> 配置化生成 </a-radio>
        </a-radio-group>
      </div>
      <keep-alive>
        <script-template
          v-if="details.createType === 2"
          :details="details"
          :detailsType="detailsType"
          @detailsChanged="detailsChanged"
        />
        <config-template
          v-if="details.createType === 1"
          ref="configTemplate"
          type="template"
          :selectItem="selectItem"
          :details="details"
          :detailsType="detailsType"
          @detailsChanged="detailsChanged"
        />
      </keep-alive>
    </div>
    <div class="content-footer">
      <div class="content-footer-btns">
        <a-button @click="handleReturn">
          {{ detailsType === "check" ? "返回" : "取消" }}
        </a-button>
        <a-button
          type="primary"
          @click="handleConfirm"
          v-if="detailsType === 'edit'"
        >
          提交
        </a-button>
        <a-button
          type="primary"
          @click="handleConfirm"
          v-else-if="detailsType === 'add'"
        >
          生成模板
        </a-button>
      </div>
    </div>
    <a-modal
      class="schema-list-modal"
      width="calc(100% - 96px)"
      :visible="isSchemaListShow"
      :destroyOnClose="true"
      @cancel="onSelectCancel"
      @ok="handleSelected"
      centered
      title="Schema选择"
      :maskClosable="false"
      :getContainer="() => $refs.templateDetails"
    >
      <schema-list @selectChanged="selectChanged" />
    </a-modal>
    <a-modal
      :width="648"
      :visible="successModalShow"
      :destroyOnClose="true"
      centered
      class="success-model-modal"
      :closable="false"
      :maskClosable="false"
      :footer="null"
    >
      <div class="success-model-modal-content">
        <img src="@/assets/images/img/check.svg" class="content-img" alt="" />
        <p class="content-text">{{ modalTitle }}</p>
        <a-button type="primary" @click="onSuccessCancel"> 确定 </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { addTemplate, editTemplate } from "@/shared/api/configManage.js";
import { modalConfirm } from "@/utils/common.js";
import { Button, Input, Radio, Tooltip } from "ant-design-vue";
import SchemaList from "../components/schemaList";
import ConfigTemplate from "./configTemplate";
import ScriptTemplate from "./scriptTemplate";
import { find } from "lodash";

const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default {
  name: "TemplateDetails",
  props: ["detailsType", "details", "categoryOptions"],
  data() {
    return {
      isSchemaListShow: false,
      selectItem: [],
      selectBaseItem: [],
      modalTitle: "",
      successModalShow: false,
    };
  },
  components: {
    AButton: Button,
    AInput: Input,
    ARadio: Radio,
    ARadioGroup: RadioGroup,
    ATextArea: TextArea,
    ATooltip: Tooltip,
    ConfigTemplate,
    SchemaList,
    ScriptTemplate,
  },
  mounted() {
    console.log("props", this.details);
    // this.getSchemaList();
  },
  methods: {
    handleReturn() {
      this.$emit("isListShowChanged", true);
      this.$emit("isDetailsShowChanged", false);
      this.$emit("isTemplateDetailsShowChanged", false);
    },
    async handleEdit() {
      console.log("🚀 ~ handleEdit ~ handleEdit:", this.details);
      if (this.details.status == 0) return false;
      this.$emit("isDetailsShowChanged", true);
      this.$emit("detailsTypeChanged", "edit");
    },
    handleCreateModel() {
      this.$emit("isDetailsShowChanged", false);
      this.$emit("handleCreateModel", this.details);
    },
    async handleConfirm() {
      if (!this.details.name) {
        this.$message.error("请输入模板名称！");
        return false;
      }
      if (!this.details.schemaId) {
        this.$message.error("请选择schema！");
        return false;
      }
      if (!this.details.categoryId) {
        this.$message.error("请选择模板分类！");
        return false;
      } else {
        const label = find(
          this.categoryOptions,
          (option) => option.value === this.details.categoryId
        ).label;
        this.details.categoryName = label;
      }
      const json = {
        name: this.details.name,
        desc: this.details.desc,
        schemaId: this.details.schemaId,
        createType: this.details.createType,
        categoryId: this.details.categoryId,
        categoryName: this.details.categoryName,
      };
      if (this.details.createType === 2) {
        // 脚本化
        if (!this.details.templateScript) {
          this.$message.error("请输入模板脚本！");
          return false;
        }
        if (!this.details.imagePath) {
          this.$message.error("请上传模板图片！");
          return false;
        } else {
          json.imagePath = this.details.imagePath;
        }
        if (this.details.data && this.details.data.length) {
          let flag = false;
          for (let i = 0; i < this.details.data.length; i++) {
            const element = this.details.data[i];
            if (
              !element.content ||
              !element.example ||
              !element.type ||
              !element.type.length
            ) {
              this.$message.error("请填写完整的语句配置！");
              flag = true;
              break;
            } else if (element.type[0] === "Enum") {
              for (let i = 0; i < element.example.length; i++) {
                const ele = element.example[i];
                if (!ele.content || !ele.text) {
                  this.$message.error("请配置完整的枚举值！");
                  flag = true;
                  break;
                }
              }
            }
          }
          if (flag) {
            return false;
          }
        } else {
          this.$message.error("请配置枚举值！");
          return false;
        }
        const paramList = [];
        let templateScript = this.details.templateScript;
        templateScript = this.HTMLDecode(templateScript);
        this.details.data.map((item) => {
          const reg = new RegExp(
            `<wise class="param-box"><span class="param-box-input ${item.id}" ` +
              `data-id="${item.id}">` +
              item.index +
              '</span><span style="color: black;">✕</span></wise>',
            "g"
          );
          templateScript = templateScript.replace(reg, `\${${item.index}}`);
          switch (item.type.slice(-1)[0]) {
            case 1:
              paramList.push({
                paramType: 1,
                paramDesc: item.content,
                paramEg: item.example,
                paramName: item.index,
              });
              break;
            case 2:
              paramList.push({
                paramType: 2,
                paramDesc: item.content,
                paramEg: item.example,
                paramName: item.index,
              });
              break;
            case 3:
              paramList.push({
                paramType: 3,
                paramDesc: item.content,
                paramName: item.index,
                enums: item.example.map((ele) => ({
                  tempScript: this.details.templateScript,
                  paramValue: ele.text,
                  paramDesc: ele.content,
                })),
              });
              break;
            case 4:
              paramList.push({
                paramType: 4,
                paramDesc: item.content,
                paramName: item.index,
                enums: item.example.map((ele) => ({
                  tempScript: this.details.templateScript,
                  paramValue: ele.text,
                  paramDesc: ele.content,
                })),
              });
              break;

            default:
              break;
          }
        });
        json.templateScript = templateScript;
        json.paramList = paramList;
      } else {
        // 配置化
        const cy = this.$refs.configTemplate.$refs.modelGraph.$schema2.cy;
        const modelInfo = {
          vertexMetas: [],
          edgeMetas: [],
        };
        const condition = {
          matchList: this.$refs.configTemplate.matchList,
          rulesGroup: this.$refs.configTemplate.rulesGroup,
        };
        cy.nodes((node) => {
          const nodeData = node.data();
          modelInfo.vertexMetas.push({
            x: node.json().position.x,
            y: node.json().position.y,
            id: nodeData.id,
            label: nodeData.label,
            name: nodeData.name,
            property: {},
            nodeType: nodeData.nodeType,
            icon: nodeData.icon,
          });
        });
        cy.edges((edge) => {
          const edgeData = edge.data();
          modelInfo.edgeMetas.push({
            srcId: edgeData.source,
            dstId: edgeData.target,
            id: edgeData.id,
            label: edgeData.label,
            name: edgeData.name,
            property: {},
            nodeType: edgeData.nodeType,
          });
        });
        json.schemaInfo = JSON.stringify(modelInfo); // 模型结构-点边信息
        json.condition = JSON.stringify(condition); // match和where条件
      }
      try {
        let res = undefined;
        console.log("json", json, this.details);
        // return false;
        if (this.detailsType === "edit") {
          json.id = this.details.id;
          res = await editTemplate(json);
        } else {
          res = await addTemplate(json);
        }
        if (res.message === "成功") {
          this.modalTitle =
            this.detailsType === "edit" ? "模板修改成功！" : "模板创建成功！";
          this.successModalShow = true;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.$message.destroy();
        const message =
          this.detailsType === "edit" ? "模板修改失败！" : "模板创建失败！";
        this.$message.error(message);
      }
    },
    HTMLDecode(str) {
      let temp = str.replace(/&amp;/g, "&");
      temp = temp.replace(/&lt;/g, "<");
      temp = temp.replace(/&gt;/g, ">");
      temp = temp.replace(/&nbsp;/g, " ");
      temp = temp.replace(/&#39;/g, "'");
      temp = temp.replace(/&quot;/g, '"');
      temp = temp.replace(/[\r\n]/g, "");
      return temp;
    },
    handleSelectSchema() {
      this.isSchemaListShow = true;
    },
    selectChanged(list) {
      this.selectBaseItem = list;
    },
    handleSelected() {
      console.log("🚀 ~ handleSelected ~ handleSelected:", this.selectBaseItem);
      if (this.selectBaseItem.length) {
        this.selectItem = this.selectBaseItem;
        this.$set(this.details, "schemaId", this.selectItem[0].id);
        this.detailsChanged(this.details);
        this.onSelectCancel();
      } else {
        this.$message.error("请选择一个schema！");
      }
    },
    onSelectCancel() {
      this.isSchemaListShow = false;
    },
    onRadioChange(e) {
      if (this.details.createType !== e.target.value) {
        const _that = this;
        const details = this.details;
        const title = `是否确定更换模板生成方式？`;
        const onOk = () => {
          if (this.selectItem.length) {
            details.createType = e.target.value;
          } else {
            this.$message.error("请先选择Schema！");
            return false;
          }
        };
        modalConfirm(title, _that, onOk);
        this.detailsChanged(details);
      }
    },
    detailsChanged(value) {
      this.$emit("detailsChanged", value);
    },
    onSuccessCancel() {
      this.successModalShow = false;
      this.handleReturn();
    },
  },
};
</script>
<style lang="less">
.template-details {
  height: 100%;
  display: flex;
  overflow: auto;
  padding: 20px;
  background: #fff;
  flex-direction: column;

  .script-template,
  .config-template-config {
    flex: 1;
  }

  &-header {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    &-title {
      font-size: 20px;
      font-weight: 600;
    }

    &-btns {
      .ant-btn {
        margin-left: 10px;
      }
    }
  }

  &-content {
    display: flex;
    flex-direction: column;
    padding-bottom: 53px;

    .content-top {
      margin-bottom: 40px;
      background: #fff;

      &-item {
        display: flex;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .item-box {
          display: flex;
          max-width: 360px;
          line-height: 32px;
          margin-right: 100px;
          width: calc((100% - 300px) / 3);

          &.textarea {
            width: calc((100% - 300px) / 3 * 2 + 100px);
            margin-right: 0;
            max-width: 820px;
          }
        }

        .item-label {
          width: 75px;

          &.long-label {
            width: 90px;
          }
        }

        .item-btn {
          color: @blue;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          &.long-btn {
            width: calc(100% - 90px);
          }

          &.disabled {
            cursor: not-allowed;
            color: @disabledColor;
          }
        }

        .item-input,
        .item-text {
          width: calc(100% - 75px);
        }
      }
    }

    .content-radio {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .ant-radio-group {
        display: flex;
        align-items: center;

        .ant-radio-wrapper {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .content-footer {
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    height: 53px;
    display: flex;
    padding: 0 24px;
    line-height: 52px;
    position: absolute;
    background: #fff;
    align-items: center;
    justify-content: flex-end;

    .ant-btn {
      margin-left: 8px;
    }
  }

  .schema-list-modal {
    .ant-modal {
      max-width: 1200px;
    }
  }
}

.success-model-modal-content {
  text-align: center;
  padding: 30px 24px 24px;

  .content-img {
    width: 70px;
    height: 70px;
    margin-bottom: 30px;
  }

  .content-text {
    height: 28px;
    font-size: 20px;
    line-height: 28px;
    padding-left: 16px;
    margin-bottom: 60px;
    color: @primaryTextColor;
  }
}
</style>
