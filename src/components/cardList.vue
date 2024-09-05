<template>
  <div :class="[cardClass, 'card-list']">
    <div class="card-list-no-data" v-if="!data.length">
      <img src="@/assets/images/img/noData.png" alt="" />
    </div>
    <div class="card-list-wrapper" v-else>
      <div class="card-list-item" v-for="(item, index) in data" :key="index">
        <div class="card-list-item-top">
          <div :class="['card-list-item-top-left', iconBack]">
            <div class="card-list-item-top-left-icon">
              <icon-svg :icon-class="`${iconClass}`"></icon-svg>
            </div>
          </div>
          <div class="card-list-item-top-right">
            <div class="card-list-item-top-right-title">{{ item.zcmc }}</div>
            <div class="card-list-item-top-right-subtitle">{{ item.zcbh }}</div>
            <a-tooltip placement="top">
              <template slot="title">
                <!-- <span>通过概念类别和属性值进行筛选</span> -->
                详情
              </template>
              <div
                class="card-list-item-top-right-icon"
                @click="lookmore(item.unitCode, item.assetNo, item.assetType)"
              >
                <icon-svg icon-class="详情"></icon-svg>
              </div>
            </a-tooltip>
          </div>
        </div>
        <div class="card-list-item-content">
          <div class="card-list-item-content-item">
            <div class="card-list-item-content-item-left">
              <div class="card-list-item-content-item-left-icon">
                <icon-svg icon-class="资产分类"></icon-svg>
              </div>
              <div class="card-list-item-content-item-left-value">
                {{ item.zcfl }}
              </div>
            </div>
            <div class="card-list-item-content-item-right">
              <div class="card-list-item-content-item-right-icon">
                <icon-svg icon-class="所属单位"></icon-svg>
              </div>
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ item.ssdw }}</span>
                </template>
                <div class="card-list-item-content-item-right-value">
                  {{ item.ssdw }}
                </div>
              </a-tooltip>
            </div>
          </div>
          <div class="card-list-item-content-item">
            <div class="card-list-item-content-item-left">
              <div class="card-list-item-content-item-left-icon">
                <icon-svg icon-class="记账日期"></icon-svg>
              </div>
              <div class="card-list-item-content-item-left-value">
                {{ item.jzrq }}
              </div>
            </div>
            <div class="card-list-item-content-item-right">
              <div class="card-list-item-content-item-right-icon">
                <icon-svg icon-class="资产净值"></icon-svg>
              </div>
              <div class="card-list-item-content-item-right-value">
                {{ Number(item.zcjz).toLocaleString() }}元
              </div>
            </div>
          </div>
          <div class="card-list-item-content-all" v-if="item.other">
            <div class="card-list-item-content-all-icon">
              <icon-svg
                icon-class="车牌号"
                v-if="iconClass == 'car'"
              ></icon-svg>
              <icon-svg icon-class="其他" v-else></icon-svg>
            </div>
            <div class="card-list-item-content-all-value">{{ item.other }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Tooltip } from "ant-design-vue";

export default {
  name: "CardList",
  props: {
    cardClass: {
      type: String,
      default: () => "",
    },
    //背景色
    iconBack: {
      type: String,
      default: () => "",
    },
    iconClass: {
      type: String,
      default: () => "",
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    console.log("22222222", this.$props);
  },
  data() {
    return {};
  },
  components: {
    ATooltip: Tooltip,
  },
  computed: {
    // scroll() {
    //   return { x: "max-content", y: `calc(100vh - ${this.scrollHeight}px)` };
    // },
  },
  methods: {
    lookmore(unitCode, assetNo, assetType) {
      this.$emit("lookAssertDetail", unitCode, assetNo, assetType);
    },
  },
};
</script>

<style lang="less">
.card-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &-no-data {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;

    img {
      width: 492px;
      height: 256px;
    }
  }

  &-wrapper {
    width: 100%;
    min-height: 300px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    /* grid-template-rows: 88px 88px; */
    gap: 20px;
  }

  &-item {
    width: 100%;
    height: 181px;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid #d6dbe3;

    &-top {
      height: 41px;
      width: 100%;
      display: flex;

      &-left {
        width: 41px;
        height: 41px;
        margin-right: 8px;
        border-radius: 8px;
        background: var(----6, #1776ff);
        display: flex;
        justify-content: center;
        align-items: center;
        // background: red;

        &-icon {
          width: 25px;
          height: 25px;
        }

        &-car {
          background: #2fa9e6;
        }

        &-land {
          background: #1bb46d;
        }

        &-others {
          background: #fe9e17;
        }
      }

      &-right {
        width: calc(100% - 49px);
        position: relative;

        &-title,
        &-subtitle {
          height: 20px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 220px;
        }

        &-title {
          font-weight: 600;
        }

        &-subtitle {
          color: #5f7292;
          font-size: 12px;
        }

        &-icon {
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
    }

    &-content {
      width: 100%;

      &-item {
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;
        margin-top: 10px;

        &-left,
        &-right {
          width: 50%;
          height: 20px;
          display: flex;
          align-items: center;

          &-icon {
            width: 14px;
            height: 14px;
            display: flex;
            align-items: center;
            margin-right: 8px;
          }

          &-value {
            height: 20px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 115px;
          }
        }
      }

      &-all {
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;
        margin-top: 10px;

        &-icon {
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          margin-right: 8px;
        }

        &-value {
          height: 20px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 260px;
        }
      }
    }
  }

  &-top {
    width: 100%;
  }
}

// width: 40px;
// height: 40px;
// border-radius: 8px;
// margin-right: 16px;
// display: flex;
// align-items: center;
// justify-content: center;

// &-icon {
//   width: 26px;
//   height: 26px;
// }
</style>
