<template>
  <div class="budget-assert">
    <div class="budget-right">
      <div class="budget-right-content">
        <div class="header-box">
          <div class="header-box-words">
            <div class="header-box-words-content">资产明细</div>
            <div class="header-box-words-content-small">
              当前单位：{{ curTreeItem.title }}
            </div>
            <div class="header-box-words-content-small">
              主管单位：{{ curTreeItemFather.title }}
            </div>
          </div>
          <!-- 右侧年份不知道要不要 -->
          <div style="margin-right: 50px">年份：2023</div>
        </div>
        <div class="header-box-button">
          <!-- 左侧四个tab -->
          <div class="option-tabs">
            <div
              :class="
                assertsSelected === pane.key
                  ? 'option-tab selected'
                  : 'option-tab'
              "
              v-for="pane in panes"
              :key="pane.key"
              :value="pane.key"
              @click="changeAssertsSelected(pane.key)"
            >
              <!-- <a-icon :type="pane.icon" /> -->
              <span class="option-tab-text">{{ pane.title }}</span>
            </div>
          </div>
          <!-- 右侧按钮 -->
          <div class="top-action">
            <a-button class="top-action-btn" @click="sortBtnDetail()">
              <div class="top-action-btn-icon">
                <icon-svg icon-class="排序"></icon-svg>
              </div>
              排序
            </a-button>
            <a-button class="top-action-btn" @click="filterBtnDetail()">
              <div class="top-action-btn-icon">
                <icon-svg icon-class="筛选"></icon-svg>
              </div>
              筛选
            </a-button>
            <a-button class="top-action-btn" @click="getBack()">
              返回
            </a-button>
            <!-- <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip> -->
          </div>
        </div>
        <!-- 表格 -->
        <div class="bottom-box">
          <!-- 房屋表 -->
          <a-table
            v-if="assertsSelected === 1"
            :columns="columns1"
            :data-source="dataSource1"
            :pagination="pagination"
            :scroll="{ x: 'max-content', y: 'calc(100vh - 440px)' }"
            :bordered="true"
          >
            <!-- <template
            v-for="column in columns"
            :slot="column.scopedSlots ? column.scopedSlots.customRender : ''"
            slot-scope="text, record"
          >
            <slot
              :name="column.scopedSlots ? column.scopedSlots.customRender : ''"
              v-bind="record"
            ></slot>
          </template> -->
          </a-table>
          <!-- 车辆表 -->
          <a-table
            v-if="assertsSelected === 2"
            :columns="columns2"
            :data-source="dataSource2"
            :pagination="pagination"
            :scroll="{ x: 'max-content', y: 'calc(100vh - 440px)' }"
            :bordered="true"
          >
          </a-table>
          <!-- 土地表 -->
          <a-table
            v-if="assertsSelected === 3"
            :columns="columns3"
            :data-source="dataSource3"
            :pagination="pagination"
            :scroll="{ x: 'max-content', y: 'calc(100vh - 440px)' }"
            :bordered="true"
          >
          </a-table>
          <!-- 其他表 -->
          <a-table
            v-if="assertsSelected === 4"
            :columns="columns4"
            :data-source="dataSource4"
            :pagination="pagination"
            :scroll="{ x: 'max-content', y: 'calc(100vh - 440px)' }"
            :bordered="true"
          >
          </a-table>
        </div>
      </div>
    </div>

    <!-- 资产明细查询排序按钮 -->
    <SortModal
      sortTitle="资产明细房屋查询排序配置"
      :sortShow="sortShow1"
      @onSortCancel="onSortCancel1"
      @onSortConfirm="onSortConfirm1"
      :sortOptions="sortOptions1"
    ></SortModal>
    <SortModal
      sortTitle="资产明细车辆查询排序配置"
      :sortShow="sortShow2"
      @onSortCancel="onSortCancel2"
      @onSortConfirm="onSortConfirm2"
      :sortOptions="sortOptions2"
    ></SortModal>
    <SortModal
      sortTitle="资产明细土地查询排序配置"
      :sortShow="sortShow3"
      @onSortCancel="onSortCancel3"
      @onSortConfirm="onSortConfirm3"
      :sortOptions="sortOptions3"
    ></SortModal>
    <SortModal
      sortTitle="资产明细其他查询排序配置"
      :sortShow="sortShow4"
      @onSortCancel="onSortCancel4"
      @onSortConfirm="onSortConfirm4"
      :sortOptions="sortOptions4"
    ></SortModal>
    <!-- 资产明细筛选 -->
    <FilterModal
      filterTitle="资产明细房屋列表过滤器配置"
      :filterShow="filterShow1"
      :paramsOption="paramsOption1"
      :tableData="tableData1"
      @onFilterCancel="onFilterCancel1"
      @onFilterConfirm="onFilterConfirm1"
    ></FilterModal>
    <FilterModal
      filterTitle="资产明细车辆列表过滤器配置"
      :filterShow="filterShow2"
      :paramsOption="paramsOption2"
      :tableData="tableData2"
      @onFilterCancel="onFilterCancel2"
      @onFilterConfirm="onFilterConfirm2"
    ></FilterModal>
    <FilterModal
      filterTitle="资产明细土地列表过滤器配置"
      :filterShow="filterShow3"
      :paramsOption="paramsOption3"
      :tableData="tableData3"
      @onFilterCancel="onFilterCancel3"
      @onFilterConfirm="onFilterConfirm3"
    ></FilterModal>
    <FilterModal
      filterTitle="资产明细其他列表过滤器配置"
      :filterShow="filterShow4"
      :paramsOption="paramsOption4"
      :tableData="tableData4"
      @onFilterCancel="onFilterCancel4"
      @onFilterConfirm="onFilterConfirm4"
    ></FilterModal>
  </div>
</template>
<script>
import FilterModal from "@/components/filterModal.vue";
import SortModal from "@/components/sortModal.vue";
import {
  Button,
  // Input,
  TreeSelect,
} from "ant-design-vue";
import { mapState } from "vuex";
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
export default {
  name: "BudgetAssert",
  data() {
    return {
      SHOW_PARENT,

      //------资产明细排序弹框显示
      sortShow1: false,
      sortShow2: false,
      sortShow3: false,
      sortShow4: false,
      //排序选项
      sortOptions1: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      sortOptions2: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      sortOptions3: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      sortOptions4: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],

      // ------资产明细筛选弹框显示
      filterShow1: false,
      filterShow2: false,
      filterShow3: false,
      filterShow4: false,
      paramsOption1: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
      ],
      tableData1: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],
      paramsOption2: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
      ],
      tableData2: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],
      paramsOption3: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
      ],
      tableData3: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],
      paramsOption4: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
      ],
      tableData4: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],

      //tab相关
      assertsSelected: 1,
      panes: [
        {
          title: "房屋",
          key: 1,
        },
        {
          title: "车辆",
          key: 2,
        },
        {
          title: "土地",
          key: 3,
        },
        {
          title: "其他",
          key: 4,
        },
      ],

      //房屋表
      columns1: [
        {
          title: "资产编号",
          dataIndex: "zcbh",
          key: "zcbh",
          width: 140,
          fixed: "left",
        },
        {
          title: "资产名称",
          dataIndex: "zcmc",
          key: "zcmc",
          width: 130,
          fixed: "left",
        },
        {
          title: "卡片状态",
          dataIndex: "kpzt",
          key: "kpzt",
          width: 140,
          fixed: "left",
        },
        {
          title: "失效日期",
          dataIndex: "sxrq",
          key: "sxrq",
          width: 110,
          fixed: "left",
        },
        {
          title: "记账日期",
          dataIndex: "jzrq",
          key: "jzrq",
          width: 110,
          fixed: "left",
        },
        {
          title: "审核状态",
          dataIndex: "shzt",
          key: "shzt",
          width: 180,
        },
        {
          title: "是否最新",
          dataIndex: "sfzx",
          key: "sfzx",
          width: 160,
        },
        {
          title: "行业分类",
          dataIndex: "hyfl",
          key: "hyfl",
          width: 160,
        },
        {
          title: "行业大类",
          dataIndex: "hydl",
          key: "hydl",
          width: 160,
        },
        {
          title: "投入使用日期",
          dataIndex: "trsyrq",
          key: "trsyrq",
          width: 160,
        },
        {
          title: "折旧年限",
          dataIndex: "zjnx",
          key: "zjnx",
          width: 190,
        },
        {
          title: "面积",
          dataIndex: "mj",
          key: "mj",
          width: 150,
        },
        {
          title: "位置",
          dataIndex: "wz",
          key: "wz",
          width: 160,
        },
        {
          title: "自用面积",
          dataIndex: "zymj",
          key: "zymj",
          width: 160,
        },
        {
          title: "出租面积",
          dataIndex: "czmj",
          key: "czmj",
          width: 140,
        },
        {
          title: "闲置面积",
          dataIndex: "xzmj",
          key: "xzmj",
          width: 180,
        },
        {
          title: "建筑结构",
          dataIndex: "jzjg",
          key: "jzjg",
          width: 190,
        },
        {
          title: "竣工日期",
          dataIndex: "jgrq",
          key: "jgrq",
          width: 150,
        },
        {
          title: "设计用途",
          dataIndex: "sjyt",
          key: "sjyt",
          width: 160,
        },
        {
          title: "土地使用权归属人",
          dataIndex: "tdsyqgsr",
          key: "tdsyqgsr",
          width: 160,
        },
        {
          title: "资产国标大类",
          dataIndex: "zcgbdl",
          key: "zcgbdl",
          width: 140,
        },
        {
          title: "使用状况",
          dataIndex: "syzk",
          key: "syzk",
          width: 180,
        },
        {
          title: "取得方式",
          dataIndex: "qdfs",
          key: "qdfs",
          width: 150,
        },
        {
          title: "价值",
          dataIndex: "jiaz",
          key: "jiaz",
          width: 160,
        },
        {
          title: "价值类型",
          dataIndex: "jzlx",
          key: "jzlx",
          width: 160,
        },
        {
          title: "单价",
          dataIndex: "dj",
          key: "dj",
          width: 140,
        },
        {
          title: "财政性资金",
          dataIndex: "czxzj",
          key: "czxzj",
          width: 180,
        },
        {
          title: "非财政性资金",
          dataIndex: "fczxzj",
          key: "fczxzj",
          width: 150,
        },
        {
          title: "入账状态",
          dataIndex: "rzzt",
          key: "rzzt",
          width: 160,
        },
        {
          title: "财务入账日期",
          dataIndex: "cwrzrq",
          key: "cwrzrq",
          width: 160,
        },
        {
          title: "会计凭证号",
          dataIndex: "kjpzh",
          key: "kjpzh",
          width: 140,
        },
        {
          title: "累计折旧",
          dataIndex: "ljzj",
          key: "ljzj",
          width: 180,
        },
        {
          title: "净值",
          dataIndex: "jz",
          key: "jz",
          width: 150,
        },
        {
          title: "折旧状态",
          dataIndex: "zjzt",
          key: "zjzt",
          width: 160,
        },
        {
          title: "原资产编号",
          dataIndex: "yzcbh",
          key: "yzcbh",
          width: 160,
        },
        {
          title: "折旧方法",
          dataIndex: "zjff",
          key: "zjff",
          width: 140,
        },
        {
          title: "处置情况",
          dataIndex: "czqk",
          key: "czqk",
          width: 180,
        },
      ],
      dataSource1: [
        // {
        //   zcbh: "示例内容", // 资产编号
        //   zcmc: "示例内容", // 资产名称
        //   kpzt: "示例内容", // 卡片状态
        //   sxrq: "示例内容", // 失效日期
        //   jzrq: "示例内容", // 记账日期
        //   shzt: "示例内容", // 审核状态
        //   sfzx: "示例内容", // 是否最新
        //   hyfl: "示例内容", // 行业分类
        //   hydl: "示例内容", // 行业大类
        //   trsyrq: "示例内容", // 投入使用日期
        //   zjnx: "示例内容", // 折旧年限
        //   mj: "示例内容", // 面积
        //   wz: "示例内容", // 位置
        //   zymj: "示例内容", // 自用面积
        //   czmj: "示例内容", // 出租面积
        //   xzmj: "示例内容", // 闲置面积
        //   jzjg: "示例内容", // 建筑结构
        //   jgrq: "示例内容", // 竣工日期
        //   sjyt: "示例内容", // 设计用途
        //   tdsyqgsr: "示例内容", // 土地使用权归属人
        //   zcgbdl: "示例内容", // 资产国标大类
        //   syzk: "示例内容", // 使用状况
        //   qdfs: "示例内容", // 取得方式
        //   jiaz: "示例内容", // 价值
        //   jzlx: "示例内容", // 价值类型
        //   dj: "示例内容", // 单价
        //   czxzj: "示例内容", // 财政性资金
        //   fczxzj: "示例内容", // 非财政性资金
        //   rzzt: "示例内容", // 入账状态
        //   cwrzrq: "示例内容", // 财务入账日期
        //   kjpzh: "示例内容", // 会计凭证号
        //   ljzj: "示例内容", // 累计折旧
        //   jz: "示例内容", // 净值
        //   zjzt: "示例内容", // 折旧状态
        //   yzcbh: "示例内容", // 原资产编号
        //   zjff: "示例内容", // 折旧方法
        //   czqk: "示例内容", // 处置情况
        // },
      ],
      //车辆表
      columns2: [
        {
          title: "资产编号",
          dataIndex: "zcbh",
          key: "zcbh",
          width: 140,
          fixed: "left",
        },
        {
          title: "资产名称",
          dataIndex: "zcmc",
          key: "zcmc",
          width: 130,
          fixed: "left",
        },
        {
          title: "卡片状态",
          dataIndex: "kpzt",
          key: "kpzt",
          width: 130,
          fixed: "left",
        },
        {
          title: "失效日期",
          dataIndex: "sxrq",
          key: "sxrq",
          width: 110,
          fixed: "left",
        },
        {
          title: "记账日期",
          dataIndex: "jzrq",
          key: "jzrq",
          width: 110,
          fixed: "left",
        },
        {
          title: "审核状态",
          dataIndex: "shzt",
          key: "shzt",
          width: 180,
        },
        {
          title: "是否最新",
          dataIndex: "sfzx",
          key: "sfzx",
          width: 160,
        },
        {
          title: "行业分类",
          dataIndex: "hyfl",
          key: "hyfl",
          width: 160,
        },
        {
          title: "行业大类",
          dataIndex: "hydl",
          key: "hydl",
          width: 160,
        },
        {
          title: "投入使用日期",
          dataIndex: "trsyrq",
          key: "trsyrq",
          width: 160,
        },
        {
          title: "品牌",
          dataIndex: "pp",
          key: "pp",
          width: 190,
        },
        {
          title: "发票号",
          dataIndex: "fph",
          key: "fph",
          width: 150,
        },
        {
          title: "规格",
          dataIndex: "gg",
          key: "gg",
          width: 160,
        },
        {
          title: "用途分类",
          dataIndex: "ytlx",
          key: "ytlx",
          width: 160,
        },
        {
          title: "申报号",
          dataIndex: "sbh",
          key: "sbh",
          width: 140,
        },
        {
          title: "车牌",
          dataIndex: "cp",
          key: "cp",
          width: 180,
        },
        {
          title: "发动机号",
          dataIndex: "fdjh",
          key: "fdjh",
          width: 150,
        },
        {
          title: "排气量",
          dataIndex: "pql",
          key: "pql",
          width: 160,
        },
        {
          title: "编制情况",
          dataIndex: "bzqk",
          key: "bzqk",
          width: 160,
        },
        {
          title: "持证人",
          dataIndex: "czr",
          key: "czr",
          width: 140,
        },
        {
          title: "行驶证",
          dataIndex: "xsz",
          key: "xsz",
          width: 180,
        },
        {
          title: "资产国标类别",
          dataIndex: "zcgblb",
          key: "zcgblb",
          width: 150,
        },
        {
          title: "管理部门",
          dataIndex: "glbm",
          key: "glbm",
          width: 160,
        },
        {
          title: "备注",
          dataIndex: "bz",
          key: "bz",
          width: 160,
        },
        {
          title: "车辆品牌",
          dataIndex: "clpp",
          key: "clpp",
          width: 140,
        },
        {
          title: "车辆ID",
          dataIndex: "clid",
          key: "clid",
          width: 180,
        },
        {
          title: "处置情况",
          dataIndex: "czqk",
          key: "czqk",
          width: 180,
        },
      ],
      dataSource2: [
        // {
        //   zcbh: "示例内容", // 资产编号
        //   zcmc: "示例内容", // 资产名称
        //   kpzt: "示例内容", // 卡片状态
        //   sxrq: "示例内容", // 失效日期
        //   jzrq: "示例内容", // 记账日期
        //   shzt: "示例内容", // 审核状态
        //   sfzx: "示例内容", // 是否最新
        //   hyfl: "示例内容", // 行业分类
        //   hydl: "示例内容", // 行业大类
        //   trsyrq: "示例内容", // 投入使用日期
        //   pp: "示例内容", // 品牌
        //   fph: "示例内容", // 发票号
        //   gg: "示例内容", // 规格
        //   ytlx: "示例内容", // 用途分类
        //   sbh: "示例内容", // 申报号
        //   cp: "示例内容", // 车牌
        //   fdjh: "示例内容", // 发动机号
        //   pql: "示例内容", // 排气量
        //   bzqk: "示例内容", // 编制情况
        //   czr: "示例内容", // 持证人
        //   xsz: "示例内容", // 行驶证
        //   zcgblb: "示例内容", // 资产国标类别
        //   glbm: "示例内容", // 管理部门
        //   bz: "示例内容", // 备注
        //   clpp: "示例内容", // 车辆品牌
        //   clid: "示例内容", // 车辆ID
        //   czqk: "示例内容", // 处置情况
        // },
      ],
      //土地表
      columns3: [
        {
          title: "资产编号",
          dataIndex: "zcbh",
          key: "zcbh",
          width: 140,
          fixed: "left",
        },
        {
          title: "资产名称",
          dataIndex: "zcmc",
          key: "zcmc",
          width: 130,
          fixed: "left",
        },
        {
          title: "卡片状态",
          dataIndex: "kpzt",
          key: "kpzt",
          width: 140,
          fixed: "left",
        },
        {
          title: "失效日期",
          dataIndex: "sxrq",
          key: "sxrq",
          width: 110,
          fixed: "left",
        },
        {
          title: "记账日期",
          dataIndex: "jzrq",
          key: "jzrq",
          width: 110,
          fixed: "left",
        },
        {
          title: "审核状态",
          dataIndex: "shzt",
          key: "shzt",
          width: 180,
        },
        {
          title: "是否最新",
          dataIndex: "sfzx",
          key: "sfzx",
          width: 160,
        },
        {
          title: "行业分类",
          dataIndex: "hyfl",
          key: "hyfl",
          width: 160,
        },
        {
          title: "行业大类",
          dataIndex: "hydl",
          key: "hydl",
          width: 160,
        },
        {
          title: "投入使用日期",
          dataIndex: "trsyrq",
          key: "trsyrq",
          width: 160,
        },
        {
          title: "折旧年限",
          dataIndex: "zjnx",
          key: "zjnx",
          width: 190,
        },
        {
          title: "面积",
          dataIndex: "mj",
          key: "mj",
          width: 150,
        },
        {
          title: "位置",
          dataIndex: "wz",
          key: "wz",
          width: 160,
        },
        {
          title: "自用面积",
          dataIndex: "zymj",
          key: "zymj",
          width: 160,
        },
        {
          title: "出租面积",
          dataIndex: "czmj",
          key: "czmj",
          width: 140,
        },
        {
          title: "闲置面积",
          dataIndex: "xzmj",
          key: "xzmj",
          width: 180,
        },
        {
          title: "建筑结构",
          dataIndex: "jzjg",
          key: "jzjg",
          width: 190,
        },
        {
          title: "竣工日期",
          dataIndex: "jgrq",
          key: "jgrq",
          width: 150,
        },
        {
          title: "设计用途",
          dataIndex: "sjyt",
          key: "sjyt",
          width: 160,
        },
        {
          title: "土地使用权归属人",
          dataIndex: "tdsyqgsr",
          key: "tdsyqgsr",
          width: 160,
        },
        {
          title: "资产国标大类",
          dataIndex: "zcgbdl",
          key: "zcgbdl",
          width: 140,
        },
        {
          title: "使用状况",
          dataIndex: "syzk",
          key: "syzk",
          width: 180,
        },
        {
          title: "取得方式",
          dataIndex: "qdfs",
          key: "qdfs",
          width: 150,
        },
        {
          title: "价值",
          dataIndex: "jiaz",
          key: "jiaz",
          width: 160,
        },
        {
          title: "价值类型",
          dataIndex: "jzlx",
          key: "jzlx",
          width: 160,
        },
        {
          title: "单价",
          dataIndex: "dj",
          key: "dj",
          width: 140,
        },
        {
          title: "财政性资金",
          dataIndex: "czxzj",
          key: "czxzj",
          width: 180,
        },
        {
          title: "非财政性资金",
          dataIndex: "fczxzj",
          key: "fczxzj",
          width: 150,
        },
        {
          title: "入账状态",
          dataIndex: "rzzt",
          key: "rzzt",
          width: 160,
        },
        {
          title: "财务入账日期",
          dataIndex: "cwrzrq",
          key: "cwrzrq",
          width: 160,
        },
        {
          title: "会计凭证号",
          dataIndex: "kjpzh",
          key: "kjpzh",
          width: 140,
        },
        {
          title: "累计折旧",
          dataIndex: "ljzj",
          key: "ljzj",
          width: 180,
        },
        {
          title: "净值",
          dataIndex: "jz",
          key: "jz",
          width: 150,
        },
        {
          title: "折旧状态",
          dataIndex: "zjzt",
          key: "zjzt",
          width: 160,
        },
        {
          title: "原资产编号",
          dataIndex: "yzcbh",
          key: "yzcbh",
          width: 160,
        },
        {
          title: "折旧方法",
          dataIndex: "zjff",
          key: "zjff",
          width: 140,
        },
        {
          title: "地类",
          dataIndex: "dl",
          key: "dl",
          width: 180,
        },
        {
          title: "初始自用面积",
          dataIndex: "cszymj",
          key: "cszymj",
          width: 180,
        },
        {
          title: "处置情况",
          dataIndex: "czqk",
          key: "czqk",
          width: 180,
        },
      ],
      dataSource3: [
        // {
        //   zcbh: "示例内容", // 资产编号
        //   zcmc: "示例内容", // 资产名称
        //   kpzt: "示例内容", // 卡片状态
        //   sxrq: "示例内容", // 失效日期
        //   jzrq: "示例内容", // 记账日期
        //   shzt: "示例内容", // 审核状态
        //   sfzx: "示例内容", // 是否最新
        //   hyfl: "示例内容", // 行业分类
        //   hydl: "示例内容", // 行业大类
        //   trsyrq: "示例内容", // 投入使用日期
        //   zjnx: "示例内容", // 折旧年限
        //   mj: "示例内容", // 面积
        //   wz: "示例内容", // 位置
        //   zymj: "示例内容", // 自用面积
        //   czmj: "示例内容", // 出租面积
        //   xzmj: "示例内容", // 闲置面积
        //   jzjg: "示例内容", // 建筑结构
        //   jgrq: "示例内容", // 竣工日期
        //   sjyt: "示例内容", // 设计用途
        //   tdsyqgsr: "示例内容", // 土地使用权归属人
        //   zcgbdl: "示例内容", // 资产国标大类
        //   syzk: "示例内容", // 使用状况
        //   qdfs: "示例内容", // 取得方式
        //   jiaz: "示例内容", // 价值
        //   jzlx: "示例内容", // 价值类型
        //   dj: "示例内容", // 单价
        //   czxzj: "示例内容", // 财政性资金
        //   fczxzj: "示例内容", // 非财政性资金
        //   rzzt: "示例内容", // 入账状态
        //   cwrzrq: "示例内容", // 财务入账日期
        //   kjpzh: "示例内容", // 会计凭证号
        //   ljzj: "示例内容", // 累计折旧
        //   jz: "示例内容", // 净值
        //   zjzt: "示例内容", // 折旧状态
        //   yzcbh: "示例内容", // 原资产编号
        //   zjff: "示例内容", // 折旧方法
        //   dl: "示例内容", // 地类
        //   cszymj: "示例内容", // 初始自用面积
        //   czqk: "示例内容", // 处置情况
        // },
      ],
      //其他表
      columns4: [
        {
          title: "资产编号",
          dataIndex: "zcbh",
          key: "zcbh",
          width: 140,
          fixed: "left",
        },
        {
          title: "资产名称",
          dataIndex: "zcmc",
          key: "zcmc",
          width: 130,
          fixed: "left",
        },
        {
          title: "卡片状态",
          dataIndex: "kpzt",
          key: "kpzt",
          width: 130,
          fixed: "left",
        },
        {
          title: "失效日期",
          dataIndex: "sxrq",
          key: "sxrq",
          width: 110,
          fixed: "left",
        },
        {
          title: "记账日期",
          dataIndex: "jzrq",
          key: "jzrq",
          width: 110,
          fixed: "left",
        },
        {
          title: "资产分类",
          dataIndex: "zcfl",
          key: "zcfl",
          width: 110,
        },
        {
          title: "审核状态",
          dataIndex: "shzt",
          key: "shzt",
          width: 180,
        },
        {
          title: "是否最新",
          dataIndex: "sfzx",
          key: "sfzx",
          width: 160,
        },
        {
          title: "行业分类",
          dataIndex: "hyfl",
          key: "hyfl",
          width: 160,
        },
        {
          title: "行业大类",
          dataIndex: "hydl",
          key: "hydl",
          width: 160,
        },
        {
          title: "资产价值",
          dataIndex: "zcjz",
          key: "zcjz",
          width: 160,
        },
        {
          title: "价值类型",
          dataIndex: "jzlx",
          key: "jzlx",
          width: 190,
        },
        {
          title: "权属性质",
          dataIndex: "qszx",
          key: "qszx",
          width: 150,
        },
        {
          title: "累计折旧",
          dataIndex: "ljzj",
          key: "ljzj",
          width: 160,
        },
        {
          title: "净值",
          dataIndex: "jz",
          key: "jz",
          width: 160,
        },
        {
          title: "取得方式",
          dataIndex: "qdfs",
          key: "qdfs",
          width: 140,
        },
        {
          title: "资产国标类别",
          dataIndex: "zcgblb",
          key: "zcgblb",
          width: 180,
        },
        {
          title: "管理部门",
          dataIndex: "glbm",
          key: "glbm",
          width: 150,
        },
        {
          title: "财务入账日期",
          dataIndex: "cwrzrq",
          key: "cwrzrq",
          width: 160,
        },
        {
          title: "处置情况",
          dataIndex: "czqk",
          key: "czqk",
          width: 180,
        },
      ],
      dataSource4: [
        // {
        //   zcbh: "示例内容", // 资产编号
        //   zcmc: "示例内容", // 资产名称
        //   kpzt: "示例内容", // 卡片状态
        //   sxrq: "示例内容", // 失效日期
        //   jzrq: "示例内容", // 记账日期
        //   zcfl: "示例内容", // 资产分类
        //   shzt: "示例内容", // 审核状态
        //   sfzx: "示例内容", // 是否最新
        //   hyfl: "示例内容", // 行业分类
        //   hydl: "示例内容", // 行业大类
        //   zcjz: "示例内容", // 资产价值
        //   jzlx: "示例内容", // 价值类型
        //   qszx: "示例内容", // 权属性质
        //   ljzj: "示例内容", // 累计折旧
        //   jz: "示例内容", // 净值
        //   qdfs: "示例内容", // 取得方式
        //   zcgblb: "示例内容", // 资产国标类别
        //   glbm: "示例内容", // 管理部门
        //   cwrzrq: "示例内容", // 财务入账日期
        //   czqk: "示例内容", // 处置情况
        // },
      ],

      //分页
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 1000,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["1000", "1500", "2000"],
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
    };
  },
  components: {
    SortModal,
    FilterModal,
    // ATreeSelect: TreeSelect,
    // AInputNumber: InputNumber,
    // ATooltip: Tooltip,
    // APopover: Popover,
    // AInput: Input,
    AButton: Button,
    // AProgress: Progress,
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("budgetPortrait", ["curTreeItem", "curTreeItemFather"]),
  },
  methods: {
    //返回跳转
    getBack() {
      this.$router.push({
        path: "/budget-portrait/budget-detail",
      });
    },

    //------资产明细筛选
    filterBtnDetail() {
      switch (this.assertsSelected) {
        case 1:
          // this.sortBtn5();
          this.filterShow1 = true;
          break;
        case 2:
          // this.sortBtn6();
          this.filterShow2 = true;
          break;
        case 3:
          // this.sortBtn7();
          this.filterShow3 = true;
          break;
        case 4:
          // this.sortBtn8();
          this.filterShow4 = true;
          break;
        default:
          break;
      }
    },
    onFilterCancel1() {
      this.filterShow1 = false;
    },
    onFilterConfirm1() {
      // this.initTable();
      this.onFilterCancel1();
    },

    onFilterCancel2() {
      this.filterShow2 = false;
    },
    onFilterConfirm2() {
      // this.initTable();
      this.onFilterCancel2();
    },

    onFilterCancel3() {
      this.filterShow3 = false;
    },
    onFilterConfirm3() {
      // this.initTable();
      this.onFilterCancel3();
    },

    onFilterCancel4() {
      this.filterShow4 = false;
    },
    onFilterConfirm4() {
      // this.initTable();
      this.onFilterCancel4();
    },

    //------资产明细排序按钮
    sortBtnDetail() {
      switch (this.assertsSelected) {
        case 1:
          // this.sortBtn1();
          this.sortShow1 = true;
          break;
        case 2:
          // this.sortBtn2();
          this.sortShow2 = true;
          break;
        case 3:
          // this.sortBtn3();
          this.sortShow3 = true;
          break;
        case 4:
          // this.sortBtn4();
          this.sortShow4 = true;
          break;
        default:
          break;
      }
    },
    onSortCancel1() {
      this.sortShow1 = false;
    },
    onSortConfirm1() {
      // this.initTable();
      this.onSortCancel1();
    },

    onSortCancel2() {
      this.sortShow2 = false;
    },
    onSortConfirm2() {
      // this.initTable();
      this.onSortCancel2();
    },

    onSortCancel3() {
      this.sortShow3 = false;
    },
    onSortConfirm3() {
      // this.initTable();
      this.onSortCancel3();
    },

    onSortCancel4() {
      this.sortShow4 = false;
    },
    onSortConfirm4() {
      // this.initTable();
      this.onSortCancel4();
    },

    //点击资产明细表格tab
    changeAssertsSelected(key) {
      this.assertsSelected = key;
    },
  },
};
</script>
<style lang="less">
.budget-assert {
  width: calc(100% - 320px);
  min-height: 100%;
  padding: 20px;
  background: #fff;
  display: flex;

  .budget-right {
    width: 100%;
    min-height: 100%;

    &-content {
      width: 100%;

      //顶部标题文字以及按钮
      .header-box {
        display: flex;
        justify-content: space-between;
        height: 32px;
        margin-bottom: 20px;

        &-words {
          display: flex;
          justify-content: center;
          align-items: center;

          //大标题
          &-content {
            height: 28px;
            line-height: 28px;
            color: #1c222b;
            font-size: 20px;
            font-weight: 600;
          }

          //小标题
          .header-box-words-content-small {
            height: 22px;
            line-height: 22px;
            color: #3c485c;
            font-size: 14px;
            font-weight: 400;
            margin-left: 20px;
          }
        }
      }

      .header-box-button {
        width: 100%;
        display: flex;
        justify-content: space-between;

        //排序筛选按钮
        //所有排序筛选查看更多按钮
        .top-action {
          display: flex;

          &-btn {
            width: 84px;
            height: 32px;
            margin-left: 10px;
            border-radius: 6px;
            padding: 6px 16px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #3c485c;

            &-icon {
              width: 16px;
              height: 16px;
              display: flex;
              margin-right: 8px;
            }
          }

          &-btn:last-of-type {
            //返回按钮窄一点
            width: 70px;
            justify-content: center;
            margin-right: 50px;
            //待修改
          }

          .tooltip-icon {
            margin-top: 7px;
            margin-left: 10px;
          }
        }
      }

      //
    }
  }
}
// 页面弹框
.budget-assert-fixed {
  .ant-popover-content {
    border-radius: 4px;
    border: 1px solid #d6dbe3;
    background: #fff;
    box-shadow: 0px 8px 16px 0px rgba(23, 118, 255, 0.05),
      0px 20px 16px 4px rgba(23, 118, 255, 0.08);

    .ant-popover-arrow {
      display: none !important;
    }

    .ant-popover-inner-content {
      width: 210px;

      .content-item {
        &-label {
          margin-bottom: 4px;
        }

        .color-box {
          display: flex;

          &-red {
            width: 24px;
            height: 24px;
            background-color: #e31430;
            margin: 6px 0 0 25px;
          }

          &-green {
            width: 24px;
            height: 24px;
            background-color: #1bb46d;
            margin: 6px 0 0 25px;
          }
        }

        &-value {
          width: 100%;
        }

        &:not(:last-child) {
          margin-bottom: 16px;
        }
      }

      .content-btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
