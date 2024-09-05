<template>
  <div style="min-height: 100%; height: 100%">
    <CommonList
      isTitle
      listClass="asserts-detail"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 463px)' }"
      bordered
    >
      <!-- 大标题 -->
      <div slot="tableTitle" class="table-header">
        <div class="table-header-title">资产明细</div>
        <div class="table-header-btn" @click="reBack">返回</div>
      </div>
      <!-- 顶上的选择框 -->
      <template slot="searchOptions">
        <!-- 主管单位 -->
        <div class="bottom-search-item">
          <div class="item-label">主管单位：</div>
          <a-tree-select
            v-model="choosedManageUnit"
            class="item-value"
            :tree-data="manageUnitTree"
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            search-placeholder="请选择"
          />
        </div>
        <!-- 预算单位 -->
        <div class="bottom-search-item">
          <div class="item-label">预算单位：</div>
          <a-tree-select
            v-model="choosedBudgetUnit"
            class="item-value"
            :tree-data="budgetUnitTree"
            tree-checkable
            search-placeholder="请选择"
          />
        </div>
        <div class="bottom-search-item">
          <div class="item-label">已选板块：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="choosedBlock"
            mode="multiple"
          >
            <a-select-option
              v-for="item in blockOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 资产卡片状态 -->
        <div class="bottom-search-item">
          <div class="item-label">资产卡片状态：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="choosedAssetCardStatus"
          >
            <a-select-option
              v-for="item in assetCardStatusOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 资产分类 -->
        <div class="bottom-search-item">
          <div class="item-label">资产分类：</div>
          <a-select
            class="item-value"
            placeholder="请选择"
            v-model="choosedAssetClassification"
          >
            <a-select-option
              v-for="item in assetClassificationOptions"
              :key="item.label"
              :title="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 业务记账日期 -->
        <div class="bottom-search-item">
          <div class="item-label">业务记账日期：</div>
          <a-range-picker
            v-model="accountingTime"
            class="item-value"
            :placeholder="['开始日期', '截止日期']"
          >
            <template slot="suffixIcon">
              <a-icon type="calendar" />
            </template>
          </a-range-picker>
        </div>
        <!-- 财务入账日期 -->
        <div class="bottom-search-item">
          <div class="item-label">财务入账日期：</div>
          <a-range-picker
            v-model="postingTime"
            class="item-value"
            :placeholder="['开始日期', '截止日期']"
          >
            <template slot="suffixIcon">
              <a-icon type="calendar" />
            </template>
          </a-range-picker>
        </div>
        <!-- 查询重置排序按钮 -->
        <div class="bottom-search-item actions">
          <a-button type="primary" class="actions-btn">查询</a-button>
          <a-button type="primary" class="actions-btn">重置</a-button>
          <a-button type="primary" class="actions-btn" @click="sortBtn()">
            <div class="actions-btn-icon">
              <icon-svg icon-class="排序"></icon-svg>
            </div>
            排序
          </a-button>
        </div>
      </template>
      <!-- 表格颜色圈 -->
      <div
        slot="status"
        slot-scope="record"
        style="display: flex; align-items: center"
      >
        <div v-if="record.status == '成功'" class="circle-success"></div>
        <div v-if="record.status == '警告'" class="circle-warning"></div>
        <div v-if="record.status == '错误'" class="circle-error"></div>
        <div v-if="record.status == '默认'" class="circle-default"></div>
        <span>{{ record.status }}</span>
      </div>
      <!-- 表格最后一列的popover -->
      <div
        slot="value"
        slot-scope="record"
        style="cursor: pointer; color: #1776ff"
      >
        <a-popover
          trigger="click"
          placement="left"
          overlayClassName="asserts-detail-pop"
        >
          <!-- 车辆弹窗 -->
          <template slot="content" v-if="record.type == '车辆'">
            <div class="asserts-detail-pop-item">
              <div class="item-label">品牌：</div>
              <div class="item-value">奔驰</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">发票号：</div>
              <div class="item-value">114515413</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">规格：</div>
              <div class="item-value">小汽车</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">用途分类：</div>
              <div class="item-value">自驾</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">申报号：</div>
              <div class="item-value">科目名称二</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">车牌号：</div>
              <div class="item-value">沪A123456</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">发动机号：</div>
              <div class="item-value">6545456654</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">排气量：</div>
              <div class="item-value">2.0T</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">编制情况：</div>
              <div class="item-value">无</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">持证人：</div>
              <div class="item-value">王思聪</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">行驶证：</div>
              <div class="item-value">有</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产编号：</div>
              <div class="item-value">12345678987654321</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">单位名称：</div>
              <div class="item-value">中国银行xxxxx支行</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">国标大类：</div>
              <div class="item-value">类别</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产名称：</div>
              <div class="item-value">动产</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">管理部门：</div>
              <div class="item-value">交通局</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">备注：</div>
              <div class="item-value">xxxxxxxxx</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">车辆品牌：</div>
              <div class="item-value">xxxxxxxxx</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">车辆ID：</div>
              <div class="item-value">xxxxxxxxx</div>
            </div>
          </template>
          <!-- 房产弹窗 -->
          <template slot="content" v-if="record.type == '房产'">
            <div class="asserts-detail-pop-item">
              <div class="item-label">卡片ID：</div>
              <div class="item-value">上海审计局项目</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">投入使用日期：</div>
              <div class="item-value">2024-6-5</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">折旧年限：</div>
              <div class="item-value">50</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">面积：</div>
              <div class="item-value">120</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">位置：</div>
              <div class="item-value">上海市徐汇区梅陇路130号</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">权属性质：</div>
              <div class="item-value">性质1</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">权属编号：</div>
              <div class="item-value">2</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">产权ID：</div>
              <div class="item-value">IDIDIDID</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">产权形式：</div>
              <div class="item-value">不动产</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">自用面积：</div>
              <div class="item-value">110</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">出租面积：</div>
              <div class="item-value">0</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">闲置面积：</div>
              <div class="item-value">0</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">其他面积：</div>
              <div class="item-value">0</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">行业名称：</div>
              <div class="item-value">人工智能</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">建筑结构：</div>
              <div class="item-value">平层</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">竣工日期：</div>
              <div class="item-value">2024-6-5</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">设计用途：</div>
              <div class="item-value">不知道什么用途</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产编号：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">所属单位：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">土地使用权归属人：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产编号：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">所属单位：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产国标大类：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">是否最新：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">记账日期：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产名称：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产分类：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">使用状况：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">取得方式：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">价值：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">价值类型：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">单价：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">财政性资金：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">非财政性资金：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">入账状态：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">财务入账日期：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">会计凭证号：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">累计折旧：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">净值：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">折旧状态：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">原资产编号：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">折旧方法：</div>
              <div class="item-value">张三</div>
            </div>
          </template>
          <!-- 土地弹窗 -->
          <template slot="content" v-if="record.type == '土地'">
            <div class="asserts-detail-pop-item">
              <div class="item-label">卡片ID：</div>
              <div class="item-value">上海审计局项目</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">投入使用日期：</div>
              <div class="item-value">2024-6-5</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">折旧年限：</div>
              <div class="item-value">50</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">面积：</div>
              <div class="item-value">120</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">位置：</div>
              <div class="item-value">上海市徐汇区梅陇路130号</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">权属性质：</div>
              <div class="item-value">性质1</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">权属编号：</div>
              <div class="item-value">2</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">产权ID：</div>
              <div class="item-value">IDIDIDID</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">产权形式：</div>
              <div class="item-value">不动产</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">自用面积：</div>
              <div class="item-value">110</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">出租面积：</div>
              <div class="item-value">0</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">闲置面积：</div>
              <div class="item-value">0</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">其他面积：</div>
              <div class="item-value">0</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">行业名称：</div>
              <div class="item-value">人工智能</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">建筑结构：</div>
              <div class="item-value">平层</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">竣工日期：</div>
              <div class="item-value">2024-6-5</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">设计用途：</div>
              <div class="item-value">不知道什么用途</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产编号：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">所属单位：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">土地使用权归属人：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产编号：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">所属单位：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产国标大类：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">是否最新：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">记账日期：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产名称：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">资产分类：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">使用状况：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">取得方式：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">价值：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">价值类型：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">单价：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">财政性资金：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">非财政性资金：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">入账状态：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">财务入账日期：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">会计凭证号：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">累计折旧：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">净值：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">折旧状态：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">原资产编号：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">折旧方法：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">地类：</div>
              <div class="item-value">张三</div>
            </div>
            <div class="asserts-detail-pop-item">
              <div class="item-label">初始自用面积：</div>
              <div class="item-value">张三</div>
            </div>
          </template>
          {{ record.value }}
        </a-popover>
      </div>
    </CommonList>
    <!-- 资产明细排序按钮 -->
    <SortModal
      sortTitle="资产明细排序配置"
      :sortShow="sortShow"
      @onSortCancel="onSortCancel"
      @onSortConfirm="onSortConfirm"
      :sortOptions="sortOptions"
    ></SortModal>
  </div>
</template>
<script>
import CommonList from "@/components/commonList.vue";
import SortModal from "@/components/sortModal.vue";
import // getAssertsDetailTable,
// getOverviewData,
"@/shared/newApi/block/assert.js";
import { getOverviewData } from "@/shared/newApi/block/block.js";

import {
  Button,
  DatePicker,
  Icon,
  Popover,
  Select,
  TreeSelect,
} from "ant-design-vue";
import { mapMutations, mapState } from "vuex";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
import { findValueByTitle, findValueByLabel } from "@/utils/common.js";
const { RangePicker } = DatePicker;
export default {
  name: "AssertsDetail",
  data() {
    return {
      SHOW_PARENT,
      //主管单位
      choosedManageUnit: [],
      manageUnitTree: [
        {
          title: "主管单位一",
          value: "1",
          key: "1",
          children: [
            {
              title: "预算单位一",
              value: "1-1",
              key: "1-1",
            },
          ],
        },
        {
          title: "主管单位二",
          value: "2",
          key: "2",
          children: [
            {
              title: "预算单位二",
              value: "2-1",
              key: "2-1",
            },
          ],
        },
        {
          title: "主管单位三",
          value: "3",
          key: "3",
          children: [
            {
              title: "预算单位三",
              value: "3-1",
              key: "3-1",
            },
          ],
        },
        {
          title: "主管单位四",
          value: "4",
          key: "4",
          children: [
            {
              title: "预算单位四",
              value: "4-1",
              key: "4-1",
            },
          ],
        },
        {
          title: "主管单位五",
          value: "5",
          key: "5",
          children: [
            {
              title: "预算单位五",
              value: "5-1",
              key: "5-1",
            },
          ],
        },
        {
          title: "主管单位六",
          value: "6",
          key: "6",
          children: [
            {
              title: "预算单位六",
              value: "6-1",
              key: "6-1",
            },
          ],
        },
        {
          title: "主管单位七",
          value: "7",
          key: "7",
          children: [
            {
              title: "预算单位七",
              value: "7-1",
              key: "7-1",
            },
          ],
        },
        {
          title: "主管单位八",
          value: "8",
          key: "8",
          children: [
            {
              title: "预算单位八",
              value: "8-1",
              key: "8-1",
            },
          ],
        },
      ],
      //预算单位
      choosedBudgetUnit: [],
      budgetUnitTree: [
        {
          title: "主管单位一",
          value: "1",
          key: "1",
          children: [
            {
              title: "预算单位一",
              value: "1-1",
              key: "1-1",
            },
          ],
        },
        {
          title: "主管单位二",
          value: "2",
          key: "2",
          children: [
            {
              title: "预算单位二",
              value: "2-1",
              key: "2-1",
            },
          ],
        },
        {
          title: "主管单位三",
          value: "3",
          key: "3",
          children: [
            {
              title: "预算单位三",
              value: "3-1",
              key: "3-1",
            },
          ],
        },
        {
          title: "主管单位四",
          value: "4",
          key: "4",
          children: [
            {
              title: "预算单位四",
              value: "4-1",
              key: "4-1",
            },
          ],
        },
        {
          title: "主管单位五",
          value: "5",
          key: "5",
          children: [
            {
              title: "预算单位五",
              value: "5-1",
              key: "5-1",
            },
          ],
        },
        {
          title: "主管单位六",
          value: "6",
          key: "6",
          children: [
            {
              title: "预算单位六",
              value: "6-1",
              key: "6-1",
            },
          ],
        },
        {
          title: "主管单位七",
          value: "7",
          key: "7",
          children: [
            {
              title: "预算单位七",
              value: "7-1",
              key: "7-1",
            },
          ],
        },
        {
          title: "主管单位八",
          value: "8",
          key: "8",
          children: [
            {
              title: "预算单位八",
              value: "8-1",
              key: "8-1",
            },
          ],
        },
      ],

      //所选板块
      blockOptions: [
        {
          label: "公检法",
          value: "1",
        },
        {
          label: "科技",
          value: "2",
        },
        {
          label: "教育",
          value: "3",
        },
        {
          label: "经济",
          value: "4",
        },
        {
          label: "城乡建设",
          value: "5",
        },
        {
          label: "卫生医疗",
          value: "6",
        },
        {
          label: "交通",
          value: "7",
        },
        {
          label: "基础设施",
          value: "8",
        },
      ],
      choosedBlock: [],

      //卡片状态
      assetCardStatusOptions: [
        {
          label: "成功",
          value: "1",
        },
        {
          label: "默认",
          value: "2",
        },
        {
          label: "错误",
          value: "3",
        },
        {
          label: "警告",
          value: "4",
        },
      ],
      choosedAssetCardStatus: [],
      //资产分类
      assetClassificationOptions: [
        {
          label: "房产",
          value: "1",
        },
        {
          label: "土地",
          value: "2",
        },
        {
          label: "车辆",
          value: "3",
        },
        {
          label: "其他",
          value: "4",
        },
      ],
      choosedAssetClassification: [],
      //记账日期
      accountingTime: [],
      //入账日期
      postingTime: [],
      popoverVisible: false,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      // 表头
      columns: [
        {
          title: "资产编号",
          dataIndex: "num",
          key: "num",
          width: 120,
        },
        {
          title: "资产分类",
          dataIndex: "type",
          key: "type",
          width: 200,
        },
        {
          title: "资产名称",
          dataIndex: "name",
          key: "name",
          width: 300,
        },
        {
          title: "资产卡片状态",
          dataIndex: "status",
          key: "status",
          width: 140,
          scopedSlots: { customRender: "status" }, //slot
        },
        {
          title: "业务记账日期",
          dataIndex: "countingTime",
          width: 180,
          key: "countingTime",
        },
        {
          title: "财务入账日期",
          dataIndex: "postingTime",
          width: 180,
          key: "postingTime",
        },
        {
          title: "取得方式",
          dataIndex: "getWay",
          width: 200,
          key: "getWay",
        },
        {
          title: "编制情况",
          dataIndex: "compilationStatus",
          width: 200,
          key: "compilationStatus",
        },
        {
          title: "数量",
          dataIndex: "count",
          width: 150,
          key: "count",
        },
        {
          title: "价值类型",
          dataIndex: "valueType",
          width: 150,
          key: "valueType",
        },
        {
          title: "价值",
          dataIndex: "value",
          width: 200,
          key: "value",
          scopedSlots: { customRender: "value" }, //slot
          fixed: "right",
        },
      ],
      // 表格数据来源
      dataSource: [
        {
          num: "1",
          type: "车辆",
          name: "资产名称",
          status: "成功",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "2",
          type: "车辆",
          name: "资产名称",
          status: "错误",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "3",
          type: "车辆",
          name: "资产名称",
          status: "警告",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "4",
          type: "房产",
          name: "资产名称",
          status: "默认",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "5",
          type: "房产",
          name: "资产名称",
          status: "成功",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "6",
          type: "房产",
          name: "资产名称",
          status: "错误",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "7",
          type: "房产",
          name: "资产名称",
          status: "错误",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "1",
          type: "土地",
          name: "资产名称",
          status: "错误",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "1",
          type: "土地",
          name: "资产名称",
          status: "成功",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "1",
          type: "土地",
          name: "资产名称",
          status: "成功",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "1",
          type: "土地",
          name: "资产名称",
          status: "成功",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "1",
          type: "土地",
          name: "资产名称",
          status: "成功",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "1",
          type: "车辆",
          name: "资产名称",
          status: "成功",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
        {
          num: "1",
          type: "房产",
          name: "资产名称",
          status: "成功",
          countingTime: "2023.09",
          postingTime: "2023.09",
          getWay: "xxx",
          compilationStatus: "xxx",
          count: "100",
          valueType: "xxx",
          value: "123456789",
        },
      ],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 15,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
        },
      },
      //排序弹框显示
      sortShow: false,
      //排序选项
      sortOptions: [
        {
          label: "字段1",
          value: "字段1",
        },
        {
          label: "字段2",
          value: "字段2",
        },
        {
          label: "字段3",
          value: "字段3",
        },
        {
          label: "字段4",
          value: "字段4",
        },
        {
          label: "字段5",
          value: "字段5",
        },
        {
          label: "字段6",
          value: "字段6",
        },
        {
          label: "字段7",
          value: "字段7",
        },
        {
          label: "字段8",
          value: "字段8",
        },
      ],
    };
  },
  components: {
    SortModal,
    CommonList,
    ASelect: Select,
    AIcon: Icon,
    AButton: Button,
    ARangePicker: RangePicker,
    APopover: Popover,
    ATreeSelect: TreeSelect,
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear", "choosedBlockId"]),
    // curYear: {
    //   get() {
    //     return this.blockChoosedYear;
    //   },
    // },
    //别删
    // choosedBlock: {
    //   get() {
    //     return this.choosedBlockId;
    //   },
    //   set(val) {
    //     const arr = this.blockOptions.filter((item) =>
    //       val.includes(item.value)
    //     );
    //     const name = arr.map((option) => option.label);
    //     this.setChoosedBlockName(name);
    //     this.setChoosedBlockId(val);
    //   },
    // },
  },
  mounted() {
    console.log("query传参", this.$route.query);
    this.postingTime = this.$route.query.time;
    const arr1 = findValueByTitle(
      this.$route.query.manage,
      this.manageUnitTree
    );
    this.choosedManageUnit = arr1;
    const arr2 = findValueByTitle(
      this.$route.query.budget,
      this.budgetUnitTree
    );
    this.choosedBudgetUnit = arr2;
    const id = findValueByLabel(
      this.$route.query.assertsType,
      this.assetClassificationOptions
    );
    this.choosedAssetClassification = id;
    // this.choosedYear = this.curYear;
    this.choosedBlock = this.choosedBlockId;
    // this.getAssertsDetailTable();
    // this.getData();
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setChoosedBlockName: "setChoosedBlockName",
      setChoosedBlockId: "setChoosedBlockId",
    }),

    //获取列表数据
    // async getAssertsDetailTable() {
    //   const json = {
    //     sectName: "string", //板块名称
    //     supUnitName: "string", //主管单位名称
    //     year: "string",
    //   };
    //   const res = await getAssertsDetailTable(json);
    //   if (res.message === "成功") {
    //     this.dataSource = res.data;
    //   } else {
    //     this.$message(res.message);
    //   }
    // },

    //获取所有板块下拉框
    async getData() {
      const json = {
        year: this.blockChoosedYear,
      };
      const res = await getOverviewData(json);
      if (res.message === "成功") {
        this.blockOptions = res.data.blocks.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      } else {
        this.$message(res.message);
      }
    },

    //排序按钮
    sortBtn() {
      this.sortShow = true;
    },
    onSortCancel() {
      this.sortShow = false;
    },
    onSortConfirm() {
      // this.initTable();
      this.onSortCancel();
    },

    //返回板块首页
    reBack() {
      this.$router.push({
        name: "businessBlock",
        // params: {
        //   entName: name,
        // },
      });
    },
  },
};
</script>
<style lang="less">
.asserts-detail {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;
}

.asserts-detail-pop {
  width: 400px;
  padding: 16px;
  &-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .item-label {
      width: 132px;
      color: #97a3b7;
      display: flex;
      justify-content: flex-end;
    }

    .item-value {
      flex: 1;
      color: #3c485c;
    }
  }
}

.ant-popover-inner-content {
  max-height: 620px;
  overflow-y: auto;
}

.circle-success,
.circle-error,
.circle-warning,
.circle-default {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
}
.circle-success {
  background-color: #1bb46d;
}

.circle-error {
  background-color: #e31430;
}

.circle-warning {
  background-color: #f0560a;
}

.circle-default {
  background-color: #97a3b7;
}
</style>
