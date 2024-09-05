<template>
  <div class="history-evolution">
    <div class="business-table-item">
      <div class="sub-title">特征列表</div>
      <a-button class="business-table-btn" @click="handleChangebtn(1)">
        <!-- {{ foldValue1 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue1 ? 'up' : 'down'" />
      </a-button>
      <feature-table :dataList="dataList" :foldValue="foldValue1" :type="6" />
    </div>
    <div class="business-table-item">
      <div class="sub-title">历史沿革</div>
      <a-button class="business-table-btn" @click="handleChangebtn(2)">
        <!-- {{ foldValue2 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue2 ? 'up' : 'down'" />
      </a-button>
      <div
        :class="
          foldValue2 ? 'business-table-content' : 'business-table-content fold'
        "
      >
        <div class="item-checkbox">
          <div class="item-checkbox-left">
            <span class="item-checkbox-label">事件性质：</span>
            <a-checkbox-group
              :options="attrOptions"
              :value="checkedList"
              @change="onCheckChange"
            >
              <span
                slot="label"
                slot-scope="{ value, color }"
                class="item-slot"
              >
                <span class="label-color" :style="{ background: color }"></span>
                <span class="label-text">{{ value }}</span>
              </span>
            </a-checkbox-group>
          </div>
          <div class="item-checkbox-right">
            <a-tooltip
              placement="right"
              overlayClassName="item-content-tooltip"
            >
              <template slot="title">
                <span>当前鱼骨图为最近十年数据，明细为全部数据</span>
              </template>
              <a-icon type="info-circle" />
            </a-tooltip>
          </div>
        </div>
        <div class="history-list" v-if="listLoading">
          <a-spin
            :spinning="listLoading"
            class="history-list-loading"
            size="large"
            tip="正在查询"
          />
        </div>
        <div class="history-list" v-else-if="showList.length">
          <div
            :class="[
              'history-list-btn left',
              showIndex[0] === 0 ? 'disabled' : '',
            ]"
            @click="handleToLeft"
          >
            <a-icon type="left" />
          </div>
          <div class="history-list-box" ref="historyBox">
            <div
              class="history-list-box-item"
              v-for="info in showList"
              :key="info.year"
              :style="{
                transform: `translateX(${translateX}px)`,
                opacity: info.opacity,
              }"
            >
              <div class="history-list-box-item-title">
                <span class="title-year">{{ info.year }}</span>
                <div class="title-number">
                  <span class="text">(</span>
                  <span class="number">{{ info.num }}</span>
                  <span class="text">件)</span>
                </div>
              </div>
              <div class="history-list-box-item-content">
                <div class="content-box">
                  <div
                    class="content-item"
                    v-for="item in info.info"
                    :key="item.id"
                  >
                    <div
                      class="content-item-circle"
                      :style="{ borderColor: item.color }"
                    ></div>
                    <div class="content-item-box">
                      <div class="box-title">
                        {{ item.time }} {{ item.subType }}
                      </div>
                      <a-tooltip
                        placement="topLeft"
                        overlayClassName="item-content-tooltip"
                      >
                        <template slot="title">
                          <span class="test">{{ item.content }}</span>
                        </template>
                        <div class="box-text">{{ item.content }}</div>
                      </a-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            :class="[
              'history-list-btn right',
              showIndex.slice(-1)[0] === showList.length - 1 ? 'disabled' : '',
            ]"
            @click="handleToRight"
          >
            <a-icon type="right" />
          </div>
        </div>
        <div class="history-list" v-else>暂无历史沿革数据</div>
      </div>
      <div class="history-table">
        <DetailTable
          tableTitle="历史沿革事件明细"
          :foldValue="foldValue3"
          :columns="columns"
          :infoData="tableData"
          :pagination="pagination"
          tableClass="features-table2"
          :loading="tableLoading"
          :infoQuery="infoQuery"
          @handleChangebtn="handleChangebtn(3)"
        >
          <div slot="searchOption">
            <div class="business-options">
              <div class="business-options-item">
                <label class="item-label">事件大类：</label>
                <div class="item-content">
                  <a-select
                    allow-clear
                    :options="plainOptions"
                    class="item-content-input"
                    placeholder="请选择"
                    @change="handlePlainChange"
                    v-model="parentValue"
                  />
                </div>
              </div>
              <div class="business-options-item">
                <label class="item-label">事件子类：</label>
                <div class="item-content">
                  <a-select
                    allow-clear
                    :options="childOptions"
                    class="item-content-input"
                    placeholder="请选择"
                    v-model="childValue"
                  />
                </div>
              </div>
              <div class="business-options-item">
                <label class="item-label">年度选择：</label>
                <div class="item-content">
                  <a-range-picker
                    :placeholder="['开始年份', '截止年份']"
                    class="item-content-input"
                    format="YYYY"
                    valueFormat="YYYY"
                    :value="startStopTime"
                    :mode="['year', 'year']"
                    @panelChange="onPanelChange"
                    @change="onChange"
                  >
                    <template slot="suffixIcon">
                      <a-icon type="calendar" />
                    </template>
                  </a-range-picker>
                </div>
              </div>
            </div>
            <div class="business-options">
              <div class="business-options-item"></div>
              <div class="business-options-item"></div>
              <div class="business-options-item">
                <div class="item-buttons">
                  <a-button class="button-left" @click="reset">重置</a-button>
                  <a-button
                    type="primary"
                    class="button-right"
                    icon="search"
                    @click="historyDetail('init')"
                    >查询</a-button
                  >
                </div>
              </div>
            </div>
          </div>
        </DetailTable>
      </div>
    </div>
  </div>
</template>
<script>
import DetailTable from "../components/detailTable";
import FeatureTable from "../components/featureTable";
import {
  Button,
  Checkbox,
  DatePicker,
  Icon,
  Spin,
  Tooltip,
} from "ant-design-vue";
import { scrollToBottom } from "@/utils/common.js";
import { mapState } from "vuex";
import {
  historyDetail,
  historyList,
  historyTab,
  queryEventChildType,
} from "@/shared/api/auditMode.js";

const { RangePicker } = DatePicker;
const { Group } = Checkbox;

export default {
  name: "HistoryEvolution",
  data() {
    return {
      foldValue1: true,
      foldValue2: true,
      foldValue3: true,
      columns: [
        {
          title: "事件编号",
          dataIndex: "infoIndex",
          key: "infoIndex",
          width: 100,
        },
        {
          title: "事件名称",
          dataIndex: "infoName",
          key: "infoName",
          width: 160,
        },
        {
          title: "事件时间",
          dataIndex: "infoTime",
          key: "infoTime",
          width: 100,
        },
        {
          title: "事件大类",
          dataIndex: "infoClass",
          key: "infoClass",
          width: 80,
          scopedSlots: { customRender: "infoClass" },
        },
        {
          title: "事件子类",
          dataIndex: "infoChildClass",
          key: "infoChildClass",
          width: 80,
        },
        {
          title: "发布单位",
          dataIndex: "publishCompany",
          key: "publishCompany",
          width: 80,
        },
        {
          title: "事件内容描述",
          dataIndex: "infoDesc",
          key: "infoDesc",
          width: 200,
          customRender: (text, record, index) => {
            return (
              <a-tooltip placement="left">
                <template slot="title">{text}</template>
                <div class="ellipsis">{text}</div>
              </a-tooltip>
            );
          },
        },
      ],
      dataList: [],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
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
          this.historyDetail("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.historyDetail("repeat");
        },
      },
      attrOptions: [
        {
          value: "工商变更",
          color: "#016EFF",
        },
        {
          value: "资质许可",
          color: "#18C7F2",
        },
        {
          value: "行政处罚",
          color: "#FF4053",
        },
        {
          value: "企业专利",
          color: "#F28518",
        },
        {
          value: "司法事件",
          color: "#826AF9",
        },
      ],
      plainOptions: [
        // {
        //   value: "工商变更",
        //   color: "#016EFF",
        // },
        // {
        //   value: "行政许可",
        //   color: "#18C7F2",
        // },
        // {
        //   value: "行政处罚",
        //   color: "#FF4053",
        // },
        // {
        //   value: "司法事件",
        //   color: "#F28518",
        // },
        // {
        //   value: "企业资质",
        //   color: "#826AF9",
        // },
        // {
        //   value: "企业专利",
        //   color: "#13C213",
        // },
      ],
      childOptions: [],
      parentValue: undefined, // 事件大类
      childValue: undefined, // 事件子类
      startStopTime: [],
      checkedList: ["工商变更", "资质许可", "行政处罚", "企业专利", "司法事件"],
      infoList: [],
      showList: [], // 鱼骨图数据
      showIndex: [], // 存放页面上能看到的几项的index
      tableData: [
        // {
        //   index: "1",
        //   infoName: "2021最佳机器学习平台TOP20",
        //   infoTime: "2022-01-01",
        //   infoClass: "工商变更",
        //   infoChildClass: "公司注册",
        //   publishCompany: "工商局",
        //   infoIndex: "GSBG123456",
        //   infoDesc: "2021最佳机器学习",
        // },
      ],
      tableLoading: false,
      translateX: 0, // 鱼骨图左右移动的距离
      listLoading: true,
      infoQuery: undefined,
    };
  },
  components: {
    AButton: Button,
    ACheckboxGroup: Group,
    AIcon: Icon,
    ARangePicker: RangePicker,
    ASpin: Spin,
    ATooltip: Tooltip,
    DetailTable,
    FeatureTable,
  },
  mounted() {
    this.historyDetail("init");
    this.historyTab();
    this.historyList();
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  methods: {
    onCheckChange(list) {
      this.checkedList = list;
      if (this.checkedList.length === 5) {
        this.showList = this.infoList;
        return;
      }
      console.log("list", list);
      console.log("this.checkedList", this.checkedList);
      if (list.length) {
        this.showList = this.infoList.map((item) => {
          const info = [];
          item.info.map((cell) => {
            if (list.indexOf(cell.type) !== -1) {
              info.push(cell);
            }
          });
          //更新数量
          return {
            ...item,
            info,
            num: info.length,
          };
        });
      } else {
        this.showList = this.infoList.map((item) => {
          return {
            ...item,
            num: 0,
          };
        });
        // this.showList = [];
      }
      console.log("this.showList", this.showList);
    },
    handleTableChange(pagination, filters, sorter) {
      console.log("handleTableChange", pagination, filters, sorter);
    },
    handleChangebtn(num) {
      switch (num) {
        case 1:
          this.foldValue1 = !this.foldValue1;
          if (this.foldValue1 && !this.foldValue2 && !this.foldValue3) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 30);
            }, 200);
          }
          break;
        case 2:
          this.foldValue2 = !this.foldValue2;
          if (this.foldValue2 && !this.foldValue3) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 30);
            }, 200);
          }
          break;
        case 3:
          this.foldValue3 = !this.foldValue3;
          if (this.foldValue3) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 20);
            }, 300);
          }
          break;

        default:
          break;
      }
    },
    async historyDetail(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        corpName: this.paramsObj.corpName,
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current,
        sjdl: this.parentValue,
        sjzl: this.childValue,
        startYear:
          (this.startStopTime.length && this.startStopTime[0].format("YYYY")) ||
          undefined,
        endYear:
          (this.startStopTime.length && this.startStopTime[1].format("YYYY")) ||
          undefined,
      };
      this.infoQuery = json;
      this.tableLoading = true;
      const res = await historyDetail(json);
      this.tableLoading = false;
      if (res.message === "成功" && res.data && res.data.dateList.length) {
        const tableData = [];
        res.data.dateList.map((item) => {
          const detail = {
            index: item.uuid,
            infoName: item.sjmc,
            infoTime: item.sjsj,
            infoClass: item.sjdl,
            infoChildClass: item.sjzl,
            publishCompany: item.fbdw,
            infoIndex: item.sjbh,
            infoDesc: item.sjnrms,
          };
          tableData.push(detail);
        });
        this.tableData = tableData;
        this.$set(this.pagination, "total", res.data.totalCount);
      } else if (
        res.message === "成功" &&
        ((res.data && !res.data.dateList.length) || !res.data)
      ) {
        this.$message.info("暂无历史沿革事件明细信息");
      } else {
        this.$message.error(res.message);
      }
    },
    async historyTab() {
      const json = {
        corpName: this.paramsObj.corpName,
      };
      const res = await historyTab(json);
      const color = [
        "#016EFF",
        "#18C7F2",
        "#FF4053",
        "#F28518",
        "#826AF9",
        "#13C213",
      ];
      this.plainOptions = res.data["事件大类"].map((item, index) => {
        item = JSON.parse(item);
        const obj = {
          value: item.sjdl,
          label: item.sjdl,
          color: color[index],
        };
        return obj;
      });
      // this.childOptions = res.data["事件小类"].map((item) => {
      //   item = JSON.parse(item);
      //   const obj = {
      //     value: item.sjzl,
      //     label: item.sjzl,
      //   };
      //   return obj;
      // });
    },
    async historyList() {
      const json = {
        corpName: this.paramsObj.corpName,
      };
      this.listLoading = true;
      const res = await historyList(json);
      this.listLoading = false;
      for (let key in res.data) {
        const obj = {
          year: key,
          num: res.data[key].length,
          opacity: 1,
          info: [],
        };
        res.data[key].map((item) => {
          // item = JSON.parse(item);
          const color = this.attrOptions.filter((v) => {
            if (v.value === item.sjdl) {
              return v;
            }
          });
          console.log("color", color);
          const info = {
            id: item.uuid,
            time: item.sjsj,
            type: item.sjdl,
            subType: item.sjmc,
            content: item.sjnrms,
            color: color.length ? color[0].color : "rgba(0, 0, 0, 0.45)",
          };
          obj.info.push(info);
        });
        console.log("obj", obj);
        this.infoList.unshift(obj); // 如果需要倒序，就改为unshift，顺序：push
        console.log("infoList", this.infoList);
      }
      if (this.infoList.length > 4) {
        for (let i = 0; i < this.infoList.length; i++) {
          const element = this.infoList[i];
          if (i <= 3) {
            // 小于等于3的，展示在页面上，大于3的，移动到右边，隐藏
            this.showIndex.push(i);
          } else {
            element.opacity = 0;
          }
        }
        console.log("this.showIndex", this.showIndex);
        console.log("this.infoList", this.infoList);
      } else {
        for (let i = 0; i < this.infoList.length; i++) {
          this.showIndex.push(i);
        }
      }
      this.showList = this.infoList;
    },
    onPanelChange(value) {
      this.startStopTime = value;
    },
    onChange(date) {
      this.startStopTime = date;
    },
    reset() {
      this.parentValue = undefined;
      this.childValue = undefined;
      this.startStopTime = [];
      this.historyDetail("init");
    },
    handleToLeft() {
      // showIndex [0, 1, 2, 3]
      if (this.showIndex[0] === 0) return;
      const itemWidth = (this.$refs.historyBox.offsetWidth - 53) / 4;
      // 移除showIndex的最后一项
      const outIndex = this.showIndex.splice(this.showIndex.length - 1, 1); // 值为数组
      // 添加showIndex的第一项少1的一项
      const pushIndex = this.showIndex[0] - 1;
      this.showIndex.unshift(pushIndex);

      // 把push进showIndex的一项的opacity置为1
      const target1 = this.showList[pushIndex];
      target1.opacity = 1;

      // 把移除掉的一项的opacity置为0
      const target2 = this.showList[outIndex[0]];
      target2.opacity = 0;

      // 向右移动
      this.translateX += itemWidth;
    },
    handleToRight() {
      if (this.showIndex.slice(-1)[0] === this.showList.length - 1) return;
      const itemWidth = (this.$refs.historyBox.offsetWidth - 53) / 4;
      // 移除showIndex的最后一项
      const outIndex = this.showIndex.splice(0, 1); // 值为数组
      // 添加showIndex的第一项多1的一项
      const pushIndex = this.showIndex.slice(-1)[0] + 1;
      this.showIndex.push(pushIndex);

      // 把push进showIndex的一项的opacity置为1
      const target1 = this.showList[pushIndex];
      target1.opacity = 1;

      // 把移除掉的一项的opacity置为0
      const target2 = this.showList[outIndex[0]];
      target2.opacity = 0;

      // 向右移动
      this.translateX -= itemWidth;
    },
    handlePlainChange(value) {
      this.parentValue = value;

      this.queryEventChildType(value);
    },
    async queryEventChildType(value) {
      const json = {
        corpName: this.paramsObj.corpName,
        sjdl: value,
      };
      const res = await queryEventChildType(json);
      console.log("res", res);
      this.childOptions = res.data["事件小类"].map((item) => {
        item = JSON.parse(item);
        const obj = {
          value: item.sjzl,
          label: item.sjzl,
        };
        return obj;
      });
    },
  },
};
</script>
<style lang="less">
.history-evolution {
  .business-table {
    &-item {
      .item-checkbox {
        display: flex;
        justify-content: space-between;

        &-label {
          color: @primaryTextColor;
        }

        .ant-checkbox-group {
          .ant-checkbox-wrapper {
            .item-slot {
              .label-color {
                top: 1px;
                width: 12px;
                height: 12px;
                margin-right: 8px;
                position: relative;
                display: inline-block;
              }

              .label-text {
                color: @primaryTextColor;
              }
            }
          }
        }
      }

      .history-list {
        width: 100%;
        margin: 24px 0;
        padding: 0 24px;
        position: relative;
        text-align: center;

        &-btn {
          top: 8px;
          width: 24px;
          height: 24px;
          color: @blue;
          cursor: pointer;
          line-height: 24px;
          background: #fff;
          position: absolute;
          text-align: center;
          border-radius: 12px;
          box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.08),
            0px 0px 28px rgba(0, 0, 0, 0.05),
            0px 0px 48px 16px rgba(0, 0, 0, 0.03);

          &.left {
            left: 0;
          }

          &.right {
            right: 0;

            &::before {
              top: 11px;
              left: -53px;
              width: 53px;
              content: "";
              height: 2px;
              position: absolute;
              background: @borderColor;
            }
          }

          &.disabled {
            cursor: not-allowed;
            color: @secondaryTextColor;
          }
        }

        &-box {
          width: 100%;
          display: flex;
          overflow: hidden;

          &-item {
            position: relative;
            transition: all 0.3s;
            min-width: calc((100% - 53px) / 4);

            &::before,
            &::after {
              top: 19px;
              content: "";
              height: 2px;
              position: absolute;
              background: @borderColor;
            }

            &::before {
              width: 16px;
              left: 0;
            }

            &::after {
              left: 150px;
              width: calc(100% - 150px);
            }

            &-title {
              left: 16px;
              width: 134px;
              height: 40px;
              display: flex;
              position: relative;
              border-radius: 20px;
              align-items: center;
              justify-content: center;
              border: 2px solid @blue;
              background: white;
              z-index: 9;

              .title-year {
                font-size: 16px;
                font-weight: 600;
                line-height: 24px;
                margin-right: 8px;
                color: @primaryTextColor;
              }

              .title-number {
                font-size: 12px;
                line-height: 20px;

                .text {
                  color: @primaryTextColor;
                }

                .number {
                  color: @blue;
                }
              }
            }

            &-content {
              left: 13px;
              top: -13px;
              overflow: auto;
              padding: 0 5px;
              max-height: 600px;
              position: relative;
              width: calc(100% - 5px);

              &::-webkit-scrollbar {
                display: none;
              }

              &:hover::-webkit-scrollbar {
                display: inline-block;
              }

              .content-box {
                padding: 30px 8px 0;
                border-left: 2px solid @dividersColor;
              }

              .content-item {
                padding: 8px;
                position: relative;

                &:hover {
                  background: @backgroundColor;
                }

                &-circle {
                  top: 14px;
                  width: 12px;
                  height: 12px;
                  left: -15px;
                  display: flex;
                  border: 2px solid;
                  position: absolute;
                  border-radius: 6px;
                  background: #fff;
                  align-items: center;
                  justify-content: center;
                }

                &-box {
                  display: flex;
                  text-align: left;
                  flex-direction: column;
                  align-items: flex-start;

                  .box-title {
                    margin-bottom: 8px;
                    color: @secondaryTextColor;
                  }

                  .box-text {
                    width: 100%;
                    overflow: hidden;
                    line-height: 20px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: @primaryTextColor;
                  }
                }
              }
            }
          }
        }
      }

      .history-table {
        position: relative;

        &-title {
          font-size: 14px;
          font-weight: 600;
          line-height: 22px;
          margin-bottom: 16px;
          color: @primaryTextColor;
        }
      }
    }
  }

  .business-table-save {
    top: 48px;
  }
}

.item-content-tooltip {
  max-width: 400px;
}
.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1 !important; /* 自定义的行数 */
  overflow: hidden;
}
</style>
