<template>
  <div class="template-manage">
    <MainContent title="模板管理">
      <template slot="content">
        <List
          v-if="isListShow"
          ref="templateList"
          @detailsChanged="detailsChanged"
          @modelDetailsChanged="modelDetailsChanged"
          @detailsTypeChanged="detailsTypeChanged"
          @isListShowChanged="isListShowChanged"
          @isDetailsShowChanged="isDetailsShowChanged"
          @addModelShowChange="addModelShowChange"
          @handleCreateModel="handleCreateModel"
          @getCategoryOptions="getCategoryOptions"
        />
        <Details
          v-if="isDetailsShow"
          :details="details"
          :categoryOptions="categoryOptions"
          :detailsType="detailsType"
          @detailsChanged="detailsChanged"
          @detailsTypeChanged="detailsTypeChanged"
          @isListShowChanged="isListShowChanged"
          @isDetailsShowChanged="isDetailsShowChanged"
          @addModelShowChange="addModelShowChange"
          @handleCreateModel="handleCreateModel"
        />
        <AddModel
          v-if="addModelShow"
          parentType="template"
          :isSkiped="isSkiped"
          :details="modelDetails"
          :detailsType="detailsType"
          :categoryOptions="categoryOptions"
          @modelDetailsChanged="modelDetailsChanged"
          @isListShowChanged="isListShowChanged"
          @addModelShowChange="addModelShowChange"
          @detailsChanged="detailsChanged"
          @isSkipedChanged="isSkipedChanged"
          ref="addModel"
        />
      </template>
    </MainContent>
  </div>
</template>
<script>
import MainContent from "@/components/mainContent";
import AddModel from "../modelsManage/addModel.vue";
import Details from "./details.vue";
import List from "./list.vue";

export default {
  name: "TemplatesManage",
  data() {
    return {
      details: {
        id: undefined,
        name: undefined,
        desc: undefined,
        data: [],
        schemaId: undefined,
        templateScript: undefined,
        createType: 2,
      },
      isListShow: true,
      isDetailsShow: false,
      isSuccessShow: false,
      detailsType: "check",
      addModelShow: false,
      modelDetails: {},
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
  methods: {
    detailsChanged(value) {
      this.details = value;
    },
    modelDetailsChanged(value) {
      this.modelDetails = value;
    },
    isListShowChanged(value) {
      this.isListShow = value;
    },
    isDetailsShowChanged(value) {
      this.isDetailsShow = value;
    },
    detailsTypeChanged(value) {
      this.detailsType = value;
      this.isSkiped = true;
    },
    handleCreateModel(record) {
      console.log("handleCreateModel", record);
      this.addModelShowChange(true, record);
    },
    handleReturn() {
      // this.isSuccessShowChanged(false);
      this.isDetailsShowChanged(false);
      this.$nextTick(() => {
        this.$refs.templateList.onSearch("init");
      });
    },
    addModelShowChange(value, record) {
      console.log(
        "🚀 ~ addModelShowChange ~ addModelShowChange:",
        value,
        record
      );
      this.modelDetails = {
        id: undefined,
        name: undefined,
        createType: record.createType,
        desc: undefined,
        template: {
          schemaId: record.schemaId,
        },
        list: record.list || [],
        templateId: record.id,
        templateName: record.name,
        categoryId: record.categoryId,
        categoryName: record.categoryName,
        status: undefined,
      };
      this.addModelShow = value;
      this.detailsType = "add";
      this.isSkiped = true;
    },
    isSkipedChanged(value) {
      this.isSkiped = value;
    },
    getCategoryOptions(value) {
      console.log("🚀 ~ getCategoryOptions ~ getCategoryOptions:", value);
      this.categoryOptions = value;
    },
  },
};
</script>
<style lang="less">
.template-manage {
  width: 100%;
  height: 100%;
  border-radius: 5px;

  &-success {
    text-align: center;
    padding: 100px 0 24px;
    height: 100%;
    background: #fff;

    .success-img {
      width: 70px;
      height: 70px;
      margin: 0 auto;
      margin-bottom: 30px;
    }

    .title {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      margin-bottom: 5px;
      color: @primaryTextColor;
    }

    .subtitle {
      width: 425px;
      margin: 0 auto;
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 24px;
      color: @secondaryTextColor;
    }

    .success-btns {
      .ant-btn {
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
}

.check-drawer {
  .ant-drawer-wrapper-body {
    .ant-drawer-header {
      .ant-drawer-title {
        font-weight: 600;
      }
    }

    .ant-drawer-body {
      .check-drawer-item {
        display: flex;
        margin-bottom: 16px;
        justify-content: space-between;

        &-label {
          width: 75px;
        }

        &-content {
          color: #949dad;
          width: calc(100% - 80px);

          .desc-content {
            height: 190px;
            padding: 12px;
            border: 1px solid #e6e6e6;
            border-radius: 5px;
          }

          .rules-item {
            color: @activeFontColor;
            margin-bottom: 10px;

            &.no-apply {
              color: #949dad;
            }
          }
        }
      }
    }
  }
}
</style>
