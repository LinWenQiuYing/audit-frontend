<template>
  <div>
    <table-component
      :columns="columns"
      :data-source="dataList"
      :rowKey="(record) => record.index"
      :pagination="pagination"
      :loading="tableLoading"
      :class="foldValue && foldValue1 ? 'feature-table' : 'feature-table fold'"
    >
      <div
        slot="positiveNegativeType"
        slot-scope="record"
        :class="
          record.positiveNegativeType === '正面'
            ? 'color-type green'
            : record.positiveNegativeType === '负面'
            ? 'color-type red'
            : 'color-type orange'
        "
      >
        <a-badge
          :color="
            record.positiveNegativeType === '正面'
              ? '#13C213'
              : record.positiveNegativeType === '负面'
              ? '#FF4053'
              : '#F28518'
          "
          :text="record.positiveNegativeType"
        />
      </div>
      <div slot="features" slot-scope="record" class="table-features">
        <span
          class="table-features-text"
          v-for="(s, index) in record.features"
          :key="index"
        >
          {{ s }}
          {{ index === record.features.length - 1 ? "" : ";" }}
        </span>
      </div>
      <!-- <div slot="labelRule" slot-scope="record" class="table-rule">
      <span
        class="table-rule-text"
        v-for="(s, index) in record.labelRule"
        :key="index"
      >
        {{ s }}
        {{ index === record.labelRule.length - 1 ? "" : ";" }}
      </span>
    </div> -->
      <div slot="detail" slot-scope="record" class="table-detail">
        <a @click="handleCheck(record)">点击查看</a>
      </div>
    </table-component>
    <a-modal
      class="tag-detail-modal"
      :width="1142"
      :visible="tagDetailVisible"
      :destroyOnClose="true"
      @cancel="onCancel"
      centered
      title="标签判定详情"
    >
      <template slot="footer">
        <a-button type="primary" @click="onConfirm"> 确认 </a-button>
      </template>
      <div class="detail-modal-content">
        <div class="detail-modal-content-item">
          <div class="name">标签名称：{{ judgeList.topLabel }}</div>
          <div class="sub-title">数据筛选</div>
          <div class="item-content">
            <p class="item-content-text">
              {{ featureString }}
            </p>
          </div>
        </div>
        <div class="detail-modal-content-item">
          <div class="sub-title">标签判定</div>
          <div class="content-item-box">
            <div
              class="content-item-box-header"
              :data-value="judgeList.dataValue"
            >
              <span class="item-box">{{ judgeList.topLabel }}</span>
              <span class="labelJudgeExpression">{{
                judgeList.labelJudgeExpression
              }}</span>
            </div>
            <div class="item-content">
              <div class="feature-header">
                <div class="feature-header-item">
                  <img
                    class="item-icon"
                    src="@/assets/images/img/union.png"
                    alt=""
                  />
                  <span class="item-title">特&nbsp;&nbsp;征</span>
                  <img
                    class="item-icon reversed"
                    src="@/assets/images/img/union.png"
                    alt=""
                  />
                </div>
                <div class="feature-header-item">
                  <img
                    class="item-icon"
                    src="@/assets/images/img/union.png"
                    alt=""
                  />
                  <span class="item-title">特征值</span>
                  <img
                    class="item-icon reversed"
                    src="@/assets/images/img/union.png"
                    alt=""
                  />
                </div>
                <div class="feature-header-item">
                  <img
                    class="item-icon"
                    src="@/assets/images/img/union.png"
                    alt=""
                  />
                  <span class="item-title">特征判定</span>
                  <img
                    class="item-icon reversed"
                    src="@/assets/images/img/union.png"
                    alt=""
                  />
                </div>
              </div>
              <div
                class="tags-box"
                v-for="(item, index) in judgeList.featuresList"
                :key="index"
              >
                <div
                  :class="[
                    'tags-box-item before top',
                    judgeList.featuresList.length > 1 &&
                    index < judgeList.featuresList.length - 1
                      ? 'after'
                      : '',
                    item.isHit ? 'red' : 'blue',
                  ]"
                >
                  <span class="item-label">特征{{ index + 1 }}：</span>
                  <span class="item-text">{{ item.labelName }}</span>
                </div>
                <div class="tags-box-item">
                  <span class="item-box">{{ item.labelValue }}</span>
                </div>
                <div :class="['tags-box-item', item.isHit ? 'red' : 'blue']">
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      <span>{{ item.labelDesc }}</span>
                      <br />
                      <span>{{ item.labelDescWithValue }}</span>
                    </template>
                    <span class="item-box">{{ item.labelDesc }}</span>
                    <span class="item-box">{{ item.labelDescWithValue }}</span>
                  </a-tooltip>
                </div>
              </div>
              <!-- <div class="tags-box">
                <div class="tags-box-item before red">
                  <span class="item-label">特征2：</span>
                  <span class="item-text"
                    >人均社保缴纳金额人均社保缴纳金额xxxxxxxxxxxxxxx</span
                  >
                </div>
                <div class="tags-box-item">
                  <span class="item-box">人均社保缴纳金额=35,000</span>
                </div>
                <div class="tags-box-item">
                  <span class="item-box">人均社保缴纳金额>=30,000</span>
                </div>
              </div>
              <div class="tags-box">
                <div class="tags-box-item before after bottom blue">
                  <span class="item-label">特征3：</span>
                  <span class="item-text">人均薪酬</span>
                </div>
                <div class="tags-box-item">
                  <span class="item-box">人均薪酬=20,000</span>
                </div>
                <div class="tags-box-item">
                  <span class="item-box">人均薪酬>=35,000</span>
                </div>
              </div> -->
            </div>
          </div>
          <!-- <div class="data-detail">
            <div class="data-detail-item">
              <span class="data-detail-label">业务数据时间：</span>
              <span class="data-detail-content">2020年10月</span>
            </div>
            <div class="data-detail-item">
              <span class="data-detail-label">业务数据来源：</span>
              <span class="data-detail-content">上海市人社局</span>
            </div>
          </div> -->
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import TableComponent from "@/components/tableComponent";
import { Badge, Button, Tooltip } from "ant-design-vue";
import { mapState } from "vuex";
import {
  queryLabelJudge,
  queryEntLableFeatures,
} from "@/shared/api/auditMode.js";

export default {
  name: "FeatureTable",
  props: ["foldValue", "type"],
  data() {
    return {
      foldValue1: true,
      dataList: [],
      tableLoading: false,
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 72,
        },
        {
          title: "标签大类",
          dataIndex: "labelClass",
          key: "labelClass",
          width: 140,
        },
        {
          title: "标签名称",
          dataIndex: "labelName",
          key: "labelName",
          width: 180,
        },
        {
          title: "时间",
          dataIndex: "time",
          key: "time",
          width: 120,
        },
        {
          title: "正负面类型",
          dataIndex: "positiveNegativeType",
          key: "positiveNegativeType",
          width: 120,
          scopedSlots: { customRender: "positiveNegativeType" },
        },
        {
          title: "特征",
          dataIndex: "features",
          key: "features",
          width: 200,
          // scopedSlots: { customRender: "features" },
        },
        {
          title: "判定详情",
          dataIndex: "detail",
          key: "detail",
          width: 100,
          scopedSlots: { customRender: "detail" },
          align: "center",
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
          this.queryEntLableFeatures("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.queryEntLableFeatures("repeat");
        },
      },
      tagDetailVisible: false,
      judgeList: {
        featuresList: [],
      },
      featureString: "",
      dataValue: "",
    };
  },
  components: {
    ABadge: Badge,
    AButton: Button,
    ATooltip: Tooltip,
    TableComponent,
  },
  mounted() {
    this.queryEntLableFeatures();
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  methods: {
    handleCheck(record) {
      console.log("handleCheck", record);
      this.queryLabelJudge(record.labelId, record.labelName);
    },
    onCancel() {
      this.tagDetailVisible = false;
    },
    onConfirm() {
      this.onCancel();
    },
    async queryEntLableFeatures(type) {
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        uniScId: this.paramsObj.uniScId,
        // uniScId: "913101150129382K1",
        labelType: this.type,
        // labelType: "1",
      };
      this.tableLoading = true;
      const res = await queryEntLableFeatures(json);
      this.tableLoading = false;
      const dataList = [];
      if (res.message === "成功" && res.data && res.data.length) {
        const classMap = {
          1: "基本情况",
          2: "经营情况",
          3: "负面事件",
          4: "行政许可",
          5: "科技创新",
          6: "历史沿革",
          7: "财务状况",
          8: "舆情信息",
        };
        // const effectMap = { 1: "正面", 2: "中性", 3: "负面" };
        const numberMap = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
        res.data.map((item, index) => {
          // let date = new Date(parseInt(item.createrTime));
          const data = {
            index: index + 1,
            labelClass: classMap[Number(item.hitLabelClassfy)],
            // labelClass: classMap[item.labelType],
            labelName: item.hitLabelValue,
            time: item.createrTime,
            // time: `${date.getFullYear()}-${
            //   date.getMonth() + 1
            // }-${date.getDate()}`,
            // positiveNegativeType: effectMap[item.effect],
            positiveNegativeType: item.hitLabelEffect,
            // positiveNegativeType: item.effect,
            // features: item.featuresList.map((item, index) => {
            //   return `${numberMap[index]}${item.labelName}`;
            // }),
            features: item.hitLabelFeatures,
            labelId: item.hitLabelId,
          };
          dataList.push(data);
        });
      } else if (res.message === "成功" && (!res.data || !res.data.length)) {
        this.$message.info("暂无特征列表信息");
        this.foldValue1 = false;
      } else {
        this.$message.error(res.message);
        this.foldValue1 = false;
      }
      this.dataList = dataList;
    },
    async queryLabelJudge(labelId, labelName) {
      const json = {
        uniScId: this.paramsObj.uniScId,
        labelId,
        // uniScId: "913101150129382K1",
        // labelId: "label_uuid_0001",
      };
      const loading = this.$message.loading("正在查询", 0);
      const res = await queryLabelJudge(json);
      loading();
      console.log("queryLabelJudge", res);
      if (res.message === "成功" && res.data) {
        const data = res.data;
        let featureString = data.entLabelInfo.labelDesc;
        this.judgeList = {
          topLabel: labelName,
          dataValue: data.labelRelation,
          labelJudgeExpression: data.labelJudgeExpression,
          featuresList: data.entLabelRuleInfo.map((item) => {
            return {
              // andOr: item.andOr,
              // labelName: item.hitRuleName,
              labelName: item.hitChacMdName,
              labelValue: item.hitChacValue,
              labelDesc: item.hitRuleExpr,
              labelDescWithValue: item.hitRuleExprWithValue,
              isHit:
                item.hitResult === "1" || item.hitResult === 1 ? true : false,
            };
          }),
        };
        this.featureString = featureString;
        this.tagDetailVisible = true;
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无标签详情");
      } else {
        this.$message.error(res.message);
      }
    },
    formatDate(value) {
      //调用时间戳为日期显示
      let date = new Date(value);
      let y = date.getFullYear(); //获取年份
      let m = date.getMonth() + 1; //获取月份
      m = m < 10 ? "0" + m : m; //月份不满10天显示前加0
      let d = date.getDate(); //获取日期
      d = d < 10 ? "0" + d : d; //日期不满10天显示前加0
      return y + "-" + m + "-" + d;
      //也可以获取更精准时间
      //let h = date.getHours(),                   //小时
      //let m = date.getMinutes(),                 //分
      //let s = date.getSeconds(),                 //秒
      //let ls = date.getMilliseconds()            //毫秒
    },
  },
};
</script>
<style lang="less">
.tag-detail-modal {
  .ant-modal-body {
    background: url("~@/assets/images/img/tags-background.png") no-repeat;
    background-position: top right;
  }
  .ant-modal-footer {
    padding: 10px 24px;
  }

  .detail-modal-content {
    &-item {
      .name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 24px;
      }
      .content-item-box {
        display: flex;
        align-items: center;

        &-header {
          width: 240px;
          font-weight: 600;
          text-align: center;
          position: relative;
          margin-right: 36px;
          background: #ffd9dd;
          padding: 0 16px;
          line-height: 18px;
          height: 64px;
          margin-bottom: 8px;
          display: flex;
          justify-content: center;

          .labelJudgeExpression {
            position: absolute;
            top: 72px;
          }

          &::before {
            content: attr(data-value);
            position: absolute;
            top: 68px;
            left: 0;
            right: 0;
            text-align: center;
            color: @secondaryTextColor;
          }

          &::after {
            content: "";
            width: 12px;
            height: 1px;
            position: absolute;
            top: 32px;
            right: -12px;
            background: @red;
          }
          .item-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }

      .item-content {
        margin-bottom: 72px;
        color: @primaryTextColor;

        &-text {
          .text-num {
            color: @blue;
          }
        }

        .feature-header {
          &-item {
            background: @backgroundColor;
          }
        }

        .tags-box {
          &-item {
            background: #fafafa;

            &.red {
              &:last-child {
                background: #ffd9dd;
              }
            }

            &.blue {
              &:last-child {
                background: #cce2ff;
              }
            }
          }
        }

        .feature-header,
        .tags-box {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          &-item {
            width: 270px;
            height: 64px;
            display: flex;
            padding: 0 16px;
            line-height: 22px;
            margin-right: 4px;
            margin-bottom: 8px;
            align-items: center;
            // flex-direction: column;

            &:last-child {
              margin-right: 0;

              .item-box {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
              }
            }

            &.after {
              position: relative;

              &::after {
                content: "";
                width: 1px;
                height: 72.5px;
                position: absolute;
                left: -24.5px;
              }

              &.top {
                &::after {
                  top: 32px;
                }
              }

              &.bottom {
                &::after {
                  bottom: 31px;
                }
              }

              &.red {
                &::after {
                  background: @red;
                }
              }

              &.blue {
                &::after {
                  background: @blue;
                }
              }
            }

            &.before {
              position: relative;

              &::before {
                content: "";
                width: 17.5px;
                height: 1px;
                position: absolute;
                top: 32px;
                left: -24px;
              }

              &.red {
                &::before {
                  background: @red;
                }
              }

              &.blue {
                &::before {
                  background: @blue;
                }
              }
            }

            .item-icon {
              width: 72px;

              &.reversed {
                transform: rotate(180deg);
              }
            }

            .item-title {
              width: 94px;
              text-align: center;
            }

            .item-label {
              width: 55px;
            }

            .item-text {
              width: calc(100% - 55px);
            }

            .item-box {
              width: 100%;
            }
          }
        }
      }

      .data-detail {
        display: flex;
        align-items: center;

        &-item {
          margin-right: 24px;
        }

        &-label {
          color: @secondaryTextColor;
        }

        &-content {
          color: @primaryTextColor;
        }
      }
    }
  }
}
</style>
