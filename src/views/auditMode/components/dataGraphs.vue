<template>
  <div class="data-graphs">
    <div
      class="data-graphs-item"
      v-for="(item, index) in list"
      :key="index"
      :style="{ width: item.width, paddingTop: item.paddingTop }"
    >
      <div class="sub-title" v-show="item.header">{{ item.header }}</div>
      <div class="item-header" v-show="item.commonHeader">
        {{ item.commonHeader }}
      </div>
      <div
        :class="
          item.header
            ? 'item-box has-header'
            : item.commonHeader
            ? 'item-box has-commonheader'
            : 'item-box'
        "
      >
        <div class="item-title">
          <div class="item-title-left">
            <span class="left-main">{{ item.title }}</span>
            <span class="left-sub">{{ item.sub }}</span>
            <a-tooltip
              placement="topLeft"
              overlayClassName="item-title-tooltip"
            >
              <template slot="title" v-if="item.formula">
                <!-- <span>通过概念类别和属性值进行筛选</span> -->
                <span v-html="item.formula"></span>
              </template>
              <a-icon type="question-circle" />
            </a-tooltip>
          </div>
          <div class="item-title-right">
            <a-tooltip placement="top" overlayClassName="item-title-tooltip">
              <template slot="title" v-if="item.dataSource">
                <div class="item-title-right">
                  <p>数据来源：{{ item.dataSource }}</p>
                  <!-- <p>更新日期：2022年1月</p> -->
                </div>
              </template>
              <div class="item-title-right">
                <span
                  >数据来源：{{
                    item.dataSource ? item.dataSource : "暂无数据"
                  }}</span
                >
                <!-- <span>更新日期：2022年1月</span> -->
                <!-- <icon-svg icon-class="info_circle" class="info_circle" /> -->
              </div>
            </a-tooltip>
            <a-tooltip placement="top" overlayClassName="item-title-tooltip">
              <template slot="title">
                <div class="item-title-right">
                  <p>保存为图片</p>
                </div>
              </template>
              <icon-svg
                icon-class="icon_download"
                class="icon-download"
                @click="handleSave(item.ref, item.title)"
              />
            </a-tooltip>
          </div>
        </div>
        <div class="item-img"></div>
        <div class="item-content" v-if="item.noData">
          <img src="@/assets/images/img/noData.png" alt="" />
        </div>
        <div
          class="item-select"
          v-if="item.selectOptions && item.selectOptions.length"
        >
          <a-select
            class="item-select-option"
            v-model="item.selectValue"
            @change="
              (value) => {
                handleSelectChange(value, index);
              }
            "
            placeholder="请选择"
            :options="item.selectOptions"
          />
        </div>
        <div class="item-content" :ref="item.ref"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { saveMaterial } from "@/shared/api/auditMode.js";
import { Icon, Tooltip } from "ant-design-vue";
import { mapState } from "vuex";
export default {
  name: "DataGraphs",
  props: ["list"],
  data() {
    return {};
  },
  components: {
    AIcon: Icon,
    ATooltip: Tooltip,
  },
  mounted() {},
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  methods: {
    async handleSave(ref, title) {
      const myChart = this.$echarts.init(this.$refs[ref][0]);
      const img = new Image();
      img.src = myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: "#fff",
      });

      const json = {
        material_name: title,
        material_type: "1",
        corp_name: this.paramsObj.corpName,
        // imgString: img.src,   //todo  演示先注释，后面记得打开
      };
      const res = await saveMaterial(json);
      console.log(res);
      if (res.message === "成功") {
        this.$message.success("下载成功");
      } else {
        this.$message.error("下载失败");
      }
    },
    handleSelectChange(value, index) {
      this.$emit("handleSelectChange", value, index);
    },
  },
};
</script>
<style lang="less">
.data-graphs {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &-item {
    padding-top: 300px;
    padding: 0px 24px;
    margin-bottom: 24px;
    position: relative;
    transition: all 0.3s;

    .sub-title {
      position: absolute;
      top: 0;
      left: 0;
    }

    .item-header {
      top: 0;
      left: 0;
      font-size: 14px;
      font-weight: 600;
      line-height: 24px;
      position: absolute;
      color: @primaryTextColor;
    }

    .item-box {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0 16px;
      position: absolute;
      border-radius: 4px;
      border: 1px solid #f0f0f0;

      &.has-header,
      &.has-commonheader {
        top: 40px;
      }
    }

    .item-title {
      height: 54px;
      display: flex;
      line-height: 54px;
      align-items: center;
      justify-content: space-between;

      &-left {
        display: flex;
        align-items: center;
        margin-right: 10px;

        .left-main {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          color: @primaryTextColor;
        }

        .left-sub {
          font-size: 14px;
          color: @activeFontColor;
        }

        .anticon {
          color: @disabledColor;
          padding-left: 8px;
          cursor: pointer;
        }

        span {
          word-break: normal;
          width: auto;
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
        }
      }

      &-right {
        height: 14px;
        display: flex;
        align-items: center;
        color: @disabledColor;

        .item-title-dataSource {
          display: flex;
        }
        span {
          color: @secondaryTextColor;
          white-space: nowrap;
          margin-right: 10px;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .icon-download {
          width: 20px;
          height: 20px;
          color: @blue;
          cursor: pointer;
          // margin-left: 16px;
        }
      }
    }

    .item-img {
      width: 100%;
      height: 2px;
      background: url("~@/assets/images/img/rectangle_line.svg") no-repeat
        bottom;
      background-size: 100%;
    }

    .item-select {
      top: -45px;
      z-index: 9;
      right: 0;
      width: 100px;
      position: absolute;

      &-option {
        width: 100%;
      }
    }

    .item-content {
      width: 100%;
      height: calc(100% - 56px);
      img {
        // width: 80%;
        height: 80%;
        margin-top: 16px;
      }
    }
  }
}

.item-title-tooltip {
  .ant-tooltip-content {
    .ant-tooltip-arrow {
      &::before {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }

    .ant-tooltip-inner {
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
