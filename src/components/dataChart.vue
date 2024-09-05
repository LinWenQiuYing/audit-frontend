<template>
  <div class="data-chart">
    <div
      class="data-chart-item"
      v-for="(item, index) in list"
      :key="index"
      :style="{ width: item.width }"
    >
      <div class="item-box">
        <div class="item-title">
          <div class="item-title-left">
            <span class="left-main">{{ item.title }}</span>

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
          class="item-content"
          :ref="item.ref"
          v-if="item.chartNumber === 1"
        ></div>
        <div class="item-content" :ref="item.ref" v-if="item.chartNumber === 2">
          <div class="item-content-left" :ref="item.ref[0]"></div>
          <div class="item-content-right" :ref="item.ref[1]"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Icon, Tooltip } from "ant-design-vue";
export default {
  name: "DataChart",
  props: ["list"],
  data() {
    return {};
  },
  components: {
    AIcon: Icon,
    ATooltip: Tooltip,
  },
  mounted() {},
  // computed: {
  //   ...mapState("auditOptions", ["paramsObj"]),
  // },
  methods: {
    async handleSave(ref, title) {
      console.log("ref, title", ref, title);
      // const myChart = this.$echarts.init(this.$refs[ref][0]);
      // const img = new Image();
      // img.src = myChart.getDataURL({
      //   pixelRatio: 2,
      //   backgroundColor: "#fff",
      // });

      // const json = {
      //   material_name: title,
      //   material_type: "1",
      //   corp_name: this.paramsObj.corpName,
      //   imgString: img.src,
      // };
      // const res = await saveMaterial(json);
      // console.log(res);
      // if (res.message === "成功") {
      //   this.$message.success("下载成功");
      // } else {
      //   this.$message.error("下载失败");
      // }
    },
    // handleSelectChange(value, index) {
    //   this.$emit("handleSelectChange", value, index);
    // },
  },
};
</script>
<style lang="less">
.data-chart {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &-item {
    padding-top: 300px;
    padding: 0px 24px;
    margin-bottom: 24px;
    position: relative;
    transition: all 0.3s;

    .item-box {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0 16px;
      position: absolute;
      border-radius: 4px;
      border: 1px solid #f0f0f0;
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
