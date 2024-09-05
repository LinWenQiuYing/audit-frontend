<template>
  <div class="model-manage">
    <MainContent title="模型管理">
      <template slot="content">
        <List
          v-if="listShow"
          ref="list"
          @addModelShowChange="addModelShowChange"
          @isListShowChanged="isListShowChanged"
          @isDetailsShowChanged="isDetailsShowChanged"
          @getCategoryOptions="getCategoryOptions"
          @templateDetailsChanged="templateDetailsChanged"
          @isTemplateDetailsShowChanged="isTemplateDetailsShowChanged"
        ></List>
        <AddModel
          v-if="addModelShow"
          :details="details"
          parentType="model"
          :isSkiped="isSkiped"
          :detailsType="detailsType"
          :categoryOptions="categoryOptions"
          @detailsChanged="detailsChanged"
          @addModelSuccessed="addModelSuccessed"
          @addModelShowChange="addModelShowChange"
          @isListShowChanged="isListShowChanged"
          @isSkipedChanged="isSkipedChanged"
          ref="addModel"
        />
        <Details
          v-if="isTemplateDetailsShow"
          :details="templateDetails"
          detailsType="check"
          @handleCreateModel="handleCreateModel"
          @isListShowChanged="isListShowChanged"
          @isDetailsShowChanged="isDetailsShowChanged"
          @isTemplateDetailsShowChanged="isTemplateDetailsShowChanged"
        />
      </template>
    </MainContent>
  </div>
</template>
<script>
import MainContent from "@/components/mainContent";
import { mapState } from "vuex";
import Details from "../templatesManage/details.vue";
import AddModel from "./addModel.vue";
import List from "./list.vue";

export default {
  name: "ModelsManage",
  data() {
    return {
      details: {},
      process: false, // 表示是否正在过程中，节流作用
      detailsType: "add",
      addModelShow: false,
      listShow: true,
      isTemplateDetailsShow: false,
      templateDetails: {},
      isSkiped: false, // 是否是模板跳转过来的
      categoryOptions: [],
    };
  },
  components: {
    AddModel,
    Details,
    List,
    MainContent,
  },
  computed: {
    ...mapState("rightsOptions", ["userInfo"]),
  },
  watch: {
    $route(to) {
      if (to.name === "modelsManage" && to.params.isSearch) {
        this.$refs.list.onSearch("init");
      }
    },
  },
  methods: {
    addModelShowChange(value, record, detailsType) {
      this.details = {
        ...record,
        template: {
          schemaId: record.schemaId,
        },
      };
      this.listShow = !value;
      this.detailsType = detailsType;
      if (record.id) {
        this.isSkiped = true;
      }
      this.addModelShow = value;
    },
    addModelSuccessed() {
      this.addModelShowChange(false, {});
      this.$refs.list.onSearch("init");
    },
    detailsChanged(value) {
      this.details = value;
    },
    templateDetailsChanged(value) {
      this.templateDetails = value;
    },
    getCategoryOptions(value) {
      this.categoryOptions = value;
    },
    isListShowChanged(value, isSearch) {
      this.listShow = value;
      if (isSearch) {
        this.$refs.list.onSearch("init");
      }
    },
    isDetailsShowChanged(value) {
      this.addModelShow = value;
    },
    isTemplateDetailsShowChanged(value) {
      this.isTemplateDetailsShow = value;
    },
    handleCreateModel(record) {
      console.log("🚀 ~ handleCreateModel:", record);
      this.isTemplateDetailsShow = false;

      this.addModelShowChange(
        true,
        {
          ...record,
          templateId: record.id,
          templateName: record.name,
        },
        "add"
      );
      this.isSkiped = true;
    },
    isSkipedChanged(value) {
      this.isSkiped = value;
    },
  },
};
</script>
<style lang="less">
.model-manage {
  width: 100%;
  height: 100%;
  border-radius: 5px;

  // &-top {
  //   display: flex;
  //   flex-wrap: wrap;
  //   background: #fff;
  //   margin-bottom: 24px;
  //   transition: all 0.3s;
  //   padding: 24px 24px 0;
  //   justify-content: flex-end;

  //   &-item {
  //     display: flex;
  //     margin-right: 16px;
  //     margin-bottom: 16px;
  //     align-items: center;
  //     width: calc((100% - 32px) / 3);

  //     &:nth-child(3n-1) {
  //       justify-content: center;
  //     }
  //     &:nth-child(3n) {
  //       margin-right: 0;
  //       justify-content: flex-end;
  //     }

  //     &-label {
  //       width: 75px;
  //       text-align: right;
  //     }

  //     &-input {
  //       max-width: 275px;
  //       width: calc(100% - 75px);
  //     }

  //     .fold-btn {
  //       border: 0 !important;
  //       color: #1890ff;

  //       &::after {
  //         content: none;
  //       }
  //     }

  //     .ant-btn:first-child {
  //       margin-right: 10px;
  //     }
  //   }
  // }

  .model-manage-bottom {
    background: #fff;

    .bottom-header {
      height: 54px;
      display: flex;
      padding: 0 16px;
      line-height: 54px;
      align-items: center;
      margin-bottom: 16px;
      justify-content: space-between;
      border-bottom: 1px solid #d9d9d9;

      &-title {
        font-size: 16px;
        font-weight: 600;
        color: @primaryTextColor;
      }

      .add-btn {
        margin-right: 5px;
      }
    }

    .model-table {
      padding: 0 16px;
      height: calc(100% - 70px);

      .way-slot {
        &-item {
          font-size: 12px;
          padding: 2px 10px;
        }

        .item-config {
          color: @cyan;
          background: #e6fffb;
          border: 1px solid #87e8de;
        }

        .item-sql {
          color: @blue;
          background: #e6f7ff;
          border: 1px solid #91d5ff;
        }
      }

      .ant-table-row-cell-break-word,
      .state-text {
        color: #949dad;
      }
    }
  }
}
</style>
