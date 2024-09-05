<template>
  <div class="audit-mode" id="audit-mode">
    <MainContent
      :title="paramsObj.corpName"
      :subTitle="
        paramsObj.topEnt ? `${paramsObj.topEnt}（${paramsObj.level}公司）` : ''
      "
    >
      <template slot="right">
        <a-input
          allow-clear
          v-model.trim="searchValue"
          autoComplete="off"
          class="search-input"
          placeholder="请输入企业名称"
        >
          <a-icon slot="suffix" type="search" @click="handleSearch" />
        </a-input>
      </template>
      <template slot="content">
        <router-view></router-view>
      </template>
    </MainContent>
  </div>
</template>
<script>
import MainContent from "@/components/mainContent";
import { Icon, Input } from "ant-design-vue";
import { mapState } from "vuex";

export default {
  name: "auditMode",
  data() {
    return {
      searchValue: undefined,
    };
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  components: {
    AIcon: Icon,
    AInput: Input,
    MainContent,
  },
  methods: {
    handleSearch() {
      console.log("handleSearch", this.searchValue);
      // ${this.paramsObj.token}
      //todo
      window.open(
        //         `http://10.83.70.241:8081/#/portal/main/index?token=Bearer
        // eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImhpdmUiLCJyb2xlcyI6IltcIlNPUEhPTl9BRE1JTlwiXSIsInNjb3BlIjoiZXh0ZXJuYWwiLCJleHAiOjQ4MTQ5MTg3MzMsImlhdCI6MTY2MTMxODczM30.7JO6iYTWnKNwsYaygy5gusvzVflHOedb0Z4vDoAsymZlL_JfFj9Z549g8seopMliYPEEmUGwsIoM2Y5KowQdHA&redirect=https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/kg/graph_list/personalBlueprint/ca0f95a6-f9b6-44ef-ade0-f352a54d5984&corpName=${this.searchValue}`
        `http://10.83.242.185:8081/#/portal/main?token=${this.paramsObj.token}&corpName=${this.searchValue}`
      );
      // window.open(
      //   //         `http://10.83.70.241:8081/#/portal/main/index?token=Bearer
      //   // eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImhpdmUiLCJyb2xlcyI6IltcIlNPUEhPTl9BRE1JTlwiXSIsInNjb3BlIjoiZXh0ZXJuYWwiLCJleHAiOjQ4MTQ5MTg3MzMsImlhdCI6MTY2MTMxODczM30.7JO6iYTWnKNwsYaygy5gusvzVflHOedb0Z4vDoAsymZlL_JfFj9Z549g8seopMliYPEEmUGwsIoM2Y5KowQdHA&redirect=https://10.83.70.195/i3mjsnq/clus-21-sophon-infra-3-0-1-04d31a3d/kg/graph_list/personalBlueprint/ca0f95a6-f9b6-44ef-ade0-f352a54d5984&corpName=${this.searchValue}`
      //   `http://10.83.70.241:8081/#/portal/main?token=${this.paramsObj.token}&corpName=${this.searchValue}`
      // );
    },
  },
};
</script>
<style lang="less">
.audit-mode {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .fold {
    height: 0 !important;
    margin-bottom: 0 !important;
    opacity: 0 !important;
    overflow: hidden !important;
  }

  // .option-tabs {
  //   display: flex;
  //   min-height: 40px;
  //   line-height: 40px;
  //   align-items: center;
  //   font-size: 16px;
  //   margin-bottom: 24px;
  //   flex-wrap: wrap;

  //   .option-tab {
  //     padding: 0 12px;
  //     margin-right: 5px;
  //     cursor: pointer;
  //     color: @secondaryTextColor;
  //     height: 40px;
  //     display: flex;
  //     align-items: center;

  //     &:hover {
  //       .option-tab-text {
  //         color: @activeFontColor;
  //       }

  //       .option-tab-icon,
  //       .anticon {
  //         color: @activeFontColor;
  //       }
  //     }

  //     &-icon,
  //     .anticon {
  //       width: 16px;
  //       height: 16px;
  //       display: flex;
  //       margin-right: 5px;
  //     }

  //     &-text {
  //       user-select: none;
  //       color: @secondaryTextColor;
  //     }

  //     &-disable {
  //       cursor: not-allowed;
  //       color: rgba(119, 136, 153, 0.6);
  //     }
  //     &.selected {
  //       background: url("~@/assets/images/img/页签.svg") no-repeat center;
  //       background-size: cover;
  //       -webkit-background-size: cover;
  //       -o-background-size: cover;
  //       color: @activeFontColor;

  //       .option-tab-text {
  //         color: @activeFontColor;
  //       }

  //       .anticon {
  //         color: @activeFontColor;
  //       }
  //     }
  //   }

  //   .tips {
  //     color: @blue;
  //     font-size: 14px;
  //     margin-left: 17px;
  //   }
  // }

  .business-table-btn {
    position: absolute;
    right: 5px;
    top: 0;
    width: 75px;
    border: 0 !important;
    color: @blue;
    box-shadow: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0;
  }
}
</style>
