<template>
  <div class="detail-table">
    <div class="sub-title" v-show="tableTitle">{{ tableTitle }}</div>
    <a-button class="business-table-btn" @click="handleChangebtn">
      <!-- {{ foldValue ? "收起" : "展开" }} -->
      <a-icon :type="foldValue ? 'up' : 'down'" />
    </a-button>
    <div
      :class="
        foldValue ? 'business-table-content' : 'business-table-content fold'
      "
    >
      <slot name="searchOption"></slot>
      <!-- <a-button class="business-table-save" icon="download" @click="handleSave">
        保存
      </a-button> -->
      <a-table
        :columns="columns"
        :data-source="infoData"
        :pagination="pagination"
        :class="tableClass"
        :rowKey="(record) => record.index"
        :loading="loading"
        @change="onSortChange"
        bordered
      >
        <!-- @change="handleTableChange" -->
        <!-- <div slot="titleSlot1" class="title-slot" slot-scope="sort">
          <span class="title-slot-title">{{ tab.titleSlot1 }}</span>
          <a-icon
            :type="
              sort.sortColumn &&
              sort.sortColumn.key === 'name' &&
              sort.sortOrder === 'descend'
                ? 'sort-descending'
                : 'sort-ascending'
            "
            :style="{
              color:
                sort.sortColumn &&
                sort.sortColumn.key === 'name' &&
                sort.sortOrder
                  ? '#016eff'
                  : 'rgba(0, 0, 0, 0.45)',
            }"
          />
        </div> -->
        <div
          :class="text === '有效' ? 'color-type green' : 'color-type red'"
          slot="isValid"
          slot-scope="text"
        >
          <a-badge
            :color="text === '有效' ? '#13C213' : '#FF4053'"
            :text="text"
          />
        </div>
        <!-- <div slot="titleSlot" class="title-slot">
          <span class="title-slot-title">年度指标值</span>
          <span class="title-slot-brackets">(</span>
          <span class="title-slot-img"
            ><icon-svg color="#13C213" icon-class="灯泡"
          /></span>
          <span class="title-slot-text">优秀、良好</span>
          <span class="title-slot-img"
            ><icon-svg color="rgba(0, 0, 0, 0.25)" icon-class="灯泡"
          /></span>
          <span class="title-slot-text">平均</span>
          <span class="title-slot-img"
            ><icon-svg color="#F28518" icon-class="灯泡"
          /></span>
          <span class="title-slot-text">较低</span>
          <span class="title-slot-img"
            ><icon-svg color="#FF4053" icon-class="灯泡"
          /></span>
          <span class="title-slot-text">较差</span>
          <span class="title-slot-brackets">)</span>
        </div> -->
        <div class="year-slot" slot="result1" slot-scope="text">
          <span class="year-slot-img">
            <icon-svg
              v-if="text === '优秀' || text === '良好'"
              color="#13C213"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '平均'"
              color="rgba(0, 0, 0, 0.25)"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '较低'"
              color="#F28518"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '较差'"
              color="#FF4053"
              icon-class="灯泡"
            />
          </span>
          <span class="year-slot-text">{{ text }}</span>
        </div>
        <div class="year-slot" slot="result2" slot-scope="text">
          <span class="year-slot-img">
            <icon-svg
              v-if="text === '优秀' || text === '良好'"
              color="#13C213"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '平均'"
              color="rgba(0, 0, 0, 0.25)"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '较低'"
              color="#F28518"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '较差'"
              color="#FF4053"
              icon-class="灯泡"
            />
          </span>
          <span class="year-slot-text">{{ text }}</span>
        </div>
        <div class="year-slot" slot="result3" slot-scope="text">
          <span class="year-slot-img">
            <icon-svg
              v-if="text === '优秀' || text === '良好'"
              color="#13C213"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '平均'"
              color="rgba(0, 0, 0, 0.25)"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '较低'"
              color="#F28518"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '较差'"
              color="#FF4053"
              icon-class="灯泡"
            />
          </span>
          <span class="year-slot-text">{{ text }}</span>
        </div>
        <div class="year-slot" slot="result4" slot-scope="text">
          <span class="year-slot-img">
            <icon-svg
              v-if="text === '优秀' || text === '良好'"
              color="#13C213"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '平均'"
              color="rgba(0, 0, 0, 0.25)"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '较低'"
              color="#F28518"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '较差'"
              color="#FF4053"
              icon-class="灯泡"
            />
          </span>
          <span class="year-slot-text">{{ text }}</span>
        </div>
        <div class="year-slot" slot="result5" slot-scope="text">
          <span class="year-slot-img">
            <icon-svg
              v-if="text === '优秀' || text === '良好'"
              color="#13C213"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '平均'"
              color="rgba(0, 0, 0, 0.25)"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '较低'"
              color="#F28518"
              icon-class="灯泡"
            />
            <icon-svg
              v-else-if="text === '较差'"
              color="#FF4053"
              icon-class="灯泡"
            />
          </span>
          <span class="year-slot-text">{{ text }}</span>
        </div>
        <div slot="infoType" slot-scope="text, record" class="info-type-slot">
          <span
            :class="[
              record.infoType.level === '中'
                ? 'middle'
                : record.infoType.level === '高'
                ? 'high'
                : 'low',
              'info-type-slot-label',
            ]"
            >{{ record.infoType.level }}</span
          >
          <span class="info-type-slot-text">{{ record.infoType.type }}</span>
        </div>
        <div
          slot="emoType"
          slot-scope="text, record"
          :class="
            record.emoType === '正面'
              ? 'color-type green'
              : record.emoType === '负面'
              ? 'color-type red'
              : 'color-type grey'
          "
        >
          <a-badge
            :color="
              record.emoType === '正面'
                ? '#13C213'
                : record.emoType === '负面'
                ? '#FF4053'
                : 'rgba(0, 0, 0, 0.25)'
            "
            :text="record.emoType"
          />
        </div>

        <div
          slot="infoClass"
          slot-scope="text"
          :class="[
            text === '工商变更' ? 'class1' : '',
            text === '资质许可' ? 'class2' : '',
            text === '行政处罚' ? 'class3' : '',
            text === '司法事件' ? 'class4' : '',
            text === '企业专利' ? 'class5' : '',
            'info-class-slot',
          ]"
        >
          {{ text }}
        </div>

        <div slot="moneyProportionChild" slot-scope="text" class="money-slot">
          <span class="tax-slot-text">{{
            text === "--" ? "--" : parseInt(text * 100) + "%"
          }}</span>
          <a-progress
            :percent="typeof text === 'string' ? 0 : parseInt(text * 100)"
            :show-info="false"
          />
        </div>
        <div slot="taxProportionChild" slot-scope="text" class="tax-slot">
          <span class="tax-slot-text">{{
            text === "--" ? "--" : parseInt(text * 100) + "%"
          }}</span>
          <a-progress
            :percent="typeof text === 'string' ? 0 : parseInt(text * 100)"
            :show-info="false"
          />
        </div>
        <div slot="moneyProportionAll" slot-scope="text" class="tax-slot">
          <span class="tax-slot-text">{{
            text === "--" ? "--" : parseInt(text * 100) + "%"
          }}</span>
          <a-progress
            :percent="typeof text === 'string' ? 0 : parseInt(text * 100)"
            :show-info="false"
          />
        </div>
        <div slot="taxProportionAll" slot-scope="text" class="tax-slot">
          <span class="tax-slot-text">{{
            text === "--" ? "--" : Number(text) * 100 + "%"
          }}</span>
          <a-progress
            :percent="typeof text === 'string' ? 0 : Number(text) * 100"
            :show-info="false"
          />
        </div>

        <div slot="source" slot-scope="text, record" class="source-slot">
          <img
            alt="link"
            class="source-slot-img"
            src="@/assets/images/img/link.svg"
          />
          <span class="source-slot-text">{{ record.source }}</span>
        </div>
        <div class="actions-slot" slot="actions" slot-scope="text, record">
          <a>评论</a>
          <a>收藏</a>
        </div>
      </a-table>
    </div>
  </div>
</template>
<script>
import { Badge, Button, Icon, Progress } from "ant-design-vue";
import { saveMaterial } from "@/shared/api/auditMode.js";
import { mapState } from "vuex";

export default {
  name: "DetailTable",
  props: [
    "tableTitle",
    "foldValue",
    "columns",
    "infoData",
    "pagination",
    "tableClass",
    "loading",
    "infoQuery",
  ],
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  components: {
    ABadge: Badge,
    AButton: Button,
    AIcon: Icon,
    AProgress: Progress,
  },
  methods: {
    handleChangebtn() {
      this.$emit("handleChangebtn");
    },
    onSortChange(pagination, filters, sorter, event) {
      console.log(
        "pagination, filters, sorter",
        pagination,
        filters,
        sorter,
        event
      );
      this.$emit("onSortChange", sorter);
      return false;
    },
    async handleSave() {
      const logoMap = {
        主要成员: "1",
        专利明细: "2",
        资质许可明细: "3",
        司法事件明细: "4",
        行政处罚明细: "5",
        涉税违法明细: "6",
        历史沿革事件明细: "7",
        财务指标明细: "8",
        强制执行明细表: "9",
        失信行为明细: "10",
        严重失信名单: "11",
        发票金额和数量统计: "12",
        明细指标数据: "13", //集团架构
      };

      const json = {
        material_name: this.tableTitle,
        material_type: "2",
        corp_name: this.paramsObj.corpName,
        imgString: "",
        tableLogo: logoMap[this.tableTitle],
        infoQuery:
          logoMap[this.tableTitle] === "1" ? this.infoQuery : undefined,
        xkQuery: logoMap[this.tableTitle] === "2" ? this.infoQuery : undefined,
        asQyhxFmsj:
          logoMap[this.tableTitle] === "3" ||
          logoMap[this.tableTitle] === "4" ||
          logoMap[this.tableTitle] === "5" ||
          logoMap[this.tableTitle] === "9" ||
          logoMap[this.tableTitle] === "10" ||
          logoMap[this.tableTitle] === "11"
            ? this.infoQuery
            : undefined,
        fusionLsygQuery:
          logoMap[this.tableTitle] === "7" ? this.infoQuery : undefined,
        ecoQuery: logoMap[this.tableTitle] === "8" ? this.infoQuery : undefined,
        entImageQuery:
          logoMap[this.tableTitle] === "13" ? this.infoQuery : undefined,
        asFusGxplQuery:
          logoMap[this.tableTitle] === "12" ? this.infoQuery : undefined,
      };
      const res = await saveMaterial(json);
      console.log(res);
      if (res.message === "成功") {
        this.$message.success("下载成功");
      } else {
        this.$message.error("下载失败");
      }
    },
  },
};
</script>
<style lang="less">
.detail-table {
  position: relative;

  .business-table-btn {
    right: 5px !important;
    top: 0 !important;
  }

  .business-table-save {
    top: 0;
    right: 5px;
    position: absolute;
    color: @primaryTextColor;
    border: 1px solid @borderColor;
    border-radius: 2px;

    &:hover {
      color: @blue;
    }
  }

  .business-options {
    height: 48px;
    display: flex;
    flex-wrap: wrap;
    padding-right: 5px;

    &-item {
      width: calc((100% - 200px) / 3);
      display: flex;
      position: relative;
      align-items: center;
      margin-bottom: 16px;
      // max-width: 600px;
      justify-content: flex-start;

      &:not(:last-child) {
        margin-right: 100px;
      }

      .item-label {
        width: 85px;
        color: @primaryTextColor;
        padding-right: 8px;
        text-align: right;
      }

      .item-content {
        width: calc(100% - 85px);
        display: flex;
        align-items: center;

        &-input {
          width: 100%;
        }
      }

      .item-buttons {
        position: absolute;
        right: 0px;

        .button-left {
          margin-right: 12px;
        }
      }
    }
  }

  .features-table2,
  .features-table3 {
    padding-right: 5px;

    .ant-spin-nested-loading {
      .ant-spin-container {
        .ant-table {
          overflow: auto;
        }
      }
    }

    .ant-table-thead {
      .ant-table-row-cell-break-word {
        color: @secondaryTextColor;
      }
    }

    .actions-slot {
      a {
        &:not(:last-child) {
          margin-right: 8px;
        }
      }
    }

    .title-slot {
      display: flex;
      align-items: center;

      &-img {
        width: 14px;
        height: 22px;
      }

      &-title,
      &-text {
        white-space: nowrap;
      }

      &-text {
        &:not(:nth-child(10)) {
          margin-right: 24px;
        }
      }
    }

    .year-slot {
      display: flex;
      align-items: center;
      justify-content: space-around;

      &-img {
        display: flex;
        width: 14px;
        height: 22px;
      }
    }

    .info-type-slot {
      line-height: 20px;

      &-label {
        width: 22px;
        height: 22px;
        font-size: 12px;
        margin-right: 8px;
        border: 1px solid;
        text-align: center;
        display: inline-block;

        &.middle {
          color: @blue;
          background: #e6f7ff;
          border-color: #91d5ff;
        }

        &.high {
          color: #f5222d;
          background: #fff1f0;
          border-color: #ffa39e;
        }

        &.low {
          color: @secondaryTextColor;
          border-color: @borderColor;
          background: @tableHeaderColor;
        }
      }

      &-text {
        color: @primaryTextColor;
      }
    }

    .source-slot {
      display: flex;
      align-items: center;
      color: @primaryTextColor;

      &-img {
        margin-right: 8px;
      }
    }

    .info-class-slot {
      width: 64px;
      height: 22px;
      font-size: 12px;
      line-height: 20px;
      border: 1px solid;
      text-align: center;

      &.class1 {
        color: @blue;
        background: #cce2ff;
        border-color: #67a8ff;
      }

      &.class2 {
        color: @skyBlue;
        background: #d1f4fc;
        border-color: #74ddf7;
      }

      &.class3 {
        color: @red;
        background: #ffd9dd;
        border-color: #ff8c98;
      }

      &.class4 {
        color: @purple;
        background: #e6e1fe;
        border-color: #b4a6fb;
      }

      &.class5 {
        color: @orange;
        background: #fce7d1;
        border-color: #f7b674;
      }

      &.class6 {
        color: @green;
        background: #d1fcd1;
        border-color: #74f774;
      }
    }
  }
}
</style>
