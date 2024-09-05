<template>
  <div class="portrait-detail">
    <div class="manage-right">
      <div class="manage-right-header">当前单位：{{ curTreeItem.title }}</div>
      <div class="manage-right-overview">
        <div
          v-for="(item, index) in unitData"
          :key="index"
          :class="[
            'overview-item',
            {
              'overview-item-one':
                item.typeName === '预算单位数量(家)' ||
                item.typeName === '项目数量(个)',
            },
            {
              'overview-item-two':
                item.typeName === '预算金额(万元)' ||
                item.typeName === '执行金额(万元)' ||
                item.typeName === '执行率(%)',
            },
            {
              'overview-item-third':
                item.typeName === '人员数量(人)' ||
                item.typeName === '人均支出金额(万元)',
            },
          ]"
        >
          <div class="item-top">{{ item.typeName }}</div>
          <div class="item-middle">{{ item.num }}</div>
          <div class="item-bottom">
            <span class="item-bottom-title">同比 {{ item.percentage }}</span>
            <div class="item-bottom-icon">
              <icon-svg
                icon-class="icon-up"
                color="#E31430"
                v-if="item.status === 1"
              />
              <icon-svg
                icon-class="icon-down"
                color="#1BB46D"
                v-else-if="item.status == 0"
              />
              <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
            </div>
          </div>
          <div class="item-icon">
            <icon-svg :icon-class="item.icon"></icon-svg>
          </div>
        </div>
      </div>
      <div class="layout-btns">
        <div class="layout-btns-item">
          <a-button
            type="primary"
            :class="basicInfoShow ? 'layout-btn active' : 'layout-btn'"
            @click="handleSkip()"
          >
            <span class="layout-btn-text">基本信息</span>
          </a-button>
        </div>
        <div class="layout-btns-item">
          <a-button
            type="primary"
            :class="subordinateShow ? 'layout-btn active' : 'layout-btn'"
            @click="handleSkip()"
          >
            <span class="layout-btn-text">下属预算单位</span>
          </a-button>
        </div>
      </div>

      <div class="layout-basic-details" v-if="basicInfoShow">
        <div class="details-item" v-for="item in detailsData" :key="item.key">
          <div class="details-item-label">
            <span class="label-text">{{ item.label }}</span>
          </div>
          <span class="details-item-value">{{ item.value }}</span>
        </div>
      </div>
      <div class="layout-basic-graph" v-if="subordinateShow">
        <div class="container-wrapper">
          <!-- 框内顶部标题和按钮 -->
          <div class="wrapper-top">
            <!-- 标题 -->
            <div class="wrapper-top-title">分布情况</div>
            <a-tooltip
              placement="topLeft"
              overlayClassName="wrapper-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
          <!-- 分割线 -->
          <div class="wrapper-split"></div>
          <!-- 图片内容 -->
          <div class="wrapper-content">
            <!-- 左侧饼图 -->
            <div class="wrapper-content-left">
              <div class="wrapper-content-left-graph" ref="graph1"></div>
            </div>
            <!-- 右侧方块 -->
            <div class="wrapper-content-right">
              <div class="wrapper-content-right-graph" ref="graph2"></div>
              <!-- <div class="blocks">
                <a-tooltip
                  :title="item.label"
                  v-for="item in blocks"
                  :key="item.label"
                >
                  <div
                    class="block-item"
                    @click="handleBlockClick(item)"
                    :style="{ background: colorOptions[randomNumberId() % 8] }"
                  >
                    {{ item.label }}
                  </div>
                </a-tooltip>
              </div> -->
            </div>
          </div>
        </div>
      </div>

      <div class="manage-right-box">
        <div class="option-tabs">
          <div
            :class="
              selected === pane.key ? 'option-tab selected' : 'option-tab'
            "
            v-for="pane in panes"
            :key="pane.key"
            :value="pane.key"
            @click="changeSelected(pane.key)"
          >
            <span class="option-tab-text">{{ pane.title }}</span>
          </div>
        </div>

        <UnitSpend v-if="selected === 1"></UnitSpend>
        <UnitThreePublic v-if="selected === 2"></UnitThreePublic>
        <UnitNoTax v-if="selected === 3"></UnitNoTax>
        <UnitAsserts v-if="selected === 4"></UnitAsserts>
        <UnitAudit v-if="selected === 5"></UnitAudit>
      </div>
    </div>
    <div class="params-config">
      <div class="params-config-header">参数设置</div>
      <div class="params-config-item">
        <div class="item-label">年份：</div>
        <a-select
          placeholder="请选择"
          v-model="curYear"
          :options="yearOptions"
          class="item-input"
        />
      </div>
      <div class="params-config-item">
        <div class="item-label">资金性质：</div>
        <a-checkbox
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onCheckAllChange"
          >全部</a-checkbox
        >
        <a-checkbox-group
          v-model="fundType"
          :options="fundTypeOptions"
          @change="onChange"
          class="item-input"
        />
      </div>
      <div class="params-config-item">
        <div class="item-label">均衡性比例</div>
        <a-input-number
          class="item-input"
          placeholder="请输入"
          :min="0"
          :max="1"
          :step="0.1"
          v-model="ratioNumber"
        />
        <!-- <a-slider
          v-model="ratioNumber"
          :min="0"
          :max="1"
          :step="0.1"
          :tipFormatter="(value) => value * 100 + '%'"
        /> -->
      </div>
      <div class="params-config-item">
        <div class="item-label">执行率偏大值</div>
        <div class="item-set">
          <a-input-number
            class="item-set-input"
            placeholder="请输入"
            :min="0"
            :max="1"
            :step="0.1"
            v-model="highExecutionRate"
          />
        </div>
      </div>
      <div class="params-config-item">
        <div class="item-label">执行率偏小值</div>
        <div class="item-set">
          <a-input-number
            class="item-set-input"
            placeholder="请输入"
            :min="0"
            :max="1"
            :step="0.1"
            v-model="lowExecutionRate"
          />
          <div class="item-set-color-orange"></div>
        </div>

        <!-- <a-slider
          v-model="lowExecutionRate"
          :min="0"
          :max="1"
          :step="0.1"
          :tipFormatter="(value) => value * 100 + '%'"
        /> -->
      </div>
      <div class="params-config-item">
        <div class="item-label">项目支出较大值(万元)</div>
        <div class="item-set">
          <a-input-number
            class="item-set-input"
            placeholder="请输入"
            :min="0"
            :step="1"
            v-model="highProjectExpenditure"
          />
          <div class="item-set-color-red"></div>
        </div>

        <!-- <a-slider
          v-model="highProjectExpenditure"
          :min="0"
          :max="1"
        /> -->
      </div>
      <div class="params-config-item">
        <div class="item-label">项目收入较大值(万元)</div>
        <div class="item-set">
          <a-input-number
            class="item-set-input"
            placeholder="请选择"
            :min="0"
            :step="1"
            v-model="highProjectRevenue"
          />
          <div class="item-set-color-red"></div>
        </div>

        <!-- <a-slider
          v-model="highProjectRevenue"
          :min="0"
          :max="1"
        /> -->
      </div>
      <div class="params-config-btns">
        <a-button style="margin-right: 8px" @click="handleParamsReset"
          >重置</a-button
        >
        <a-button type="primary" @click="handleParamsConfig">确定</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getFundsTypeOption,
  getManageBasicInfo,
  getManageOverview,
  getPieData,
} from "@/shared/newApi/manage/manage.js";
import { Button, Checkbox, InputNumber, Select, Tooltip } from "ant-design-vue";
import { customAlphabet } from "nanoid";
import { mapMutations, mapState } from "vuex";
import UnitAsserts from "./components/unitAsserts.vue";
import UnitAudit from "./components/unitAudit.vue";
import UnitNoTax from "./components/unitNoTax.vue";
import UnitSpend from "./components/unitSpend.vue";
import UnitThreePublic from "./components/unitThreePublic.vue";

export default {
  name: "PortraitDetail",
  data() {
    return {
      selected: 1,
      panes: [
        {
          title: "支出情况",
          key: 1,
          //icon: "solution",
        },
        {
          title: "三公费用",
          key: 2,
          // icon: "calendar",
        },
        {
          title: "非税收入",
          key: 3,
          //icon: "dollar",
        },
        {
          title: "资产情况",
          key: 4,
          // icon: "calendar",
        },
        // {
        //   title: "审计情况",
        //   key: 5,
        //   //icon: "dollar",
        // },
      ],
      unitData: [
        // {
        //   typeName: "预算单位数量（家）",
        //   num: 40, //加逗号用的
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "预算单位数量",
        // },
        // {
        //   typeName: "项目数量（个）",
        //   num: 4000,
        //   percentage: "8%",
        //   status: 1, //0:down  1:up
        //   icon: "项目数量",
        // },
        // {
        //   typeName: "预算金额（万元）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "预算金额1",
        // },
        // {
        //   typeName: "执行金额（万元）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "执行金额1",
        // },
        // {
        //   typeName: "执行率（%）",
        //   num: 13,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "执行率1",
        // },
        // {
        //   typeName: "人员数量（人）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "人员数量",
        // },
        // {
        //   typeName: "人均支出金额（万元）",
        //   num: 17774,
        //   percentage: "8%",
        //   status: 0, //0:down  1:up
        //   icon: "人均支出金额",
        // },
      ],
      subordinateShow: false,
      basicInfoShow: true,
      //基本信息
      detailsData: [
        {
          key: "organId",
          label: "单位机构代码",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "organName",
          label: "单位名称",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "xzjgfl",
          label: "行政机关分类",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "xzjb",
          label: "行政级别",
          value: "--",
          // dataSource: "上海市场监督管理局",
        },
        {
          key: "clrq",
          label: "成立日期",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "dwdz",
          label: "单位地址",
          value: "--",
          // dataSource: "上海市场监督管理局",
        },
        {
          key: "yzbm",
          label: "邮政编码",
          value: "--",
          // dataSource: "上海市场监督管理局",
        },
        {
          key: "lxr",
          label: "联系人",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "lxrdhhm",
          label: "电话号码",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "lxrcz",
          label: "传真",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "lxremail",
          label: "E-mail",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "cwfzr",
          label: "财务负责人",
          value: "--",
          // dataSource: "上海市场监督管理局",
        },
        {
          key: "cwfzrdhhm",
          label: "电话号码",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "cwfzrcz",
          label: "传真",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "cwfzremail",
          label: "E-mail",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "dwfzr",
          label: "单位负责人",
          value: "--",
          // dataSource: "上海市场监督管理局",
        },
        {
          key: "dwfzrdhhm",
          label: "电话号码",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "dwfzrcz",
          label: "传真",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "dwfzremail",
          label: "E-mail",
          value: "--",
          //dataSource: "上海市场监督管理局",
        },
        {
          key: "bbrysl",
          label: "本部人员数量",
          value: "--",
          //dataSource: "上海人社局",
        },
        {
          key: "xsdwrysl",
          label: "下属单位人员数量",
          value: "--",
          //dataSource: "上海人社局",
        },
        {
          key: "notes",
          label: "备注",
          value: "--",
          //dataSource: "上海人社局",
        },
      ],
      myChart1: null,
      myChart2: null,
      graphData: [
        {
          value: 1048,
          name: "Search Engine",
          units: [
            {
              label: "单位1",
            },
            {
              label: "单位2",
            },
          ],
        },
        {
          value: 735,
          name: "Direct",
          units: [
            {
              label: "单位3",
            },
            {
              label: "单位4",
            },
          ],
        },
        {
          value: 580,
          name: "Email",
          units: [
            {
              label: "单位5",
            },
            {
              label: "单位6",
            },
          ],
        },
        {
          value: 484,
          name: "Union Ads",
          units: [
            {
              label: "单位7",
            },
            {
              label: "单位8",
            },
          ],
        },
        {
          value: 300,
          name: "Video Ads",
          units: [
            {
              label: "单位9",
            },
            {
              label: "单位10",
            },
            {
              label: "单位11",
            },
          ],
        },
      ],
      colorOptions: [
        "#B9E0FF",
        "#FFD2AB",
        "#D6F7FF",
        "#FFBAB9",
        "#D3DDF5",
        "#016eff",
        "#30f2cb",
        "#18c7f2",
      ],

      //页面右上角弹框
      //年份选项
      yearOptions: [
        {
          value: "2021",
          label: "2021",
        },
        {
          value: "2022",
          label: "2022",
        },
        {
          value: "2023",
          label: "2023",
        },
        {
          value: "2024",
          label: "2024",
        },
      ],
      //年份
      curYear: "2023",
      //资金性质
      fundType: [],
      indeterminate: false,
      checkAll: true,
      //均衡性比例
      ratioNumber: 0.25,
      //执行率偏大值
      highExecutionRate: 0.98,
      //执行率偏小值
      lowExecutionRate: 0.7,
      //项目支出较大值
      highProjectExpenditure: undefined,
      //项目收入较大值
      highProjectRevenue: undefined,

      dataIndex: -1,
      fundTypeOptions: [],
    };
  },
  components: {
    AButton: Button,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    ASelect: Select,
    AInputNumber: InputNumber,
    ATooltip: Tooltip,
    UnitSpend,
    UnitThreePublic,
    UnitNoTax,
    UnitAsserts,
    UnitAudit,
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("managePortrait", ["curTreeItem", "configParams"]),
    randomNumberId() {
      const numbers = "0123456789";
      return customAlphabet(numbers, 10);
    },
    blocks() {
      if (this.dataIndex === -1) {
        const result = [];
        this.graphData.map((item) => {
          item.units.map((v) => {
            result.push({
              name: v.label,
              value: 1,
              code: v.code,
            });
          });
        });

        return result;
      } else {
        return this.graphData[this.dataIndex].units.map((v) => {
          return {
            name: v.label,
            value: 1,
            code: v.code,
          };
        });
      }
    },
  },
  watch: {
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("curTreeItem", newVal, oldVal);
        if (newVal.key) {
          this.dataIndex = -1;
          await this.getAllData();

          if (this.subordinateShow) {
            this.$nextTick(() => {
              this.initEcharts1();
              this.initEcharts2();
            });
          }
        }
      },
      deep: true,
    },
    blocks: {
      async handler(newVal, oldVal) {
        console.log("blocks", newVal, oldVal);
        if (newVal.length) {
          if (this.subordinateShow) {
            this.$nextTick(() => {
              this.initEcharts2();
            });
          }
        }
      },
      deep: true,
    },
    configParams: {
      handler(newVal, oldVal) {
        if (newVal.curYear !== oldVal.curYear) {
          this.getAllData();
        }
      },
    },
  },
  async mounted() {
    this.getAllData();
  },
  methods: {
    ...mapMutations("managePortrait", {
      setConfigParams: "setConfigParams",
    }),
    async getFundsTypeOption() {
      const json = {
        year: this.configParams.curYear,
      };
      const res = await getFundsTypeOption(json);
      if (res.message === "成功") {
        this.fundTypeOptions = res.data;
        this.fundType = res.data.map((item) => item.value);

        const configParams = {
          curYear: "2023",
          fundType: res.data.map((item) => item.value),
          ratioNumber: 0.25,
          highExecutionRate: 0.98,
          lowExecutionRate: 0.7,
          highProjectExpenditure: undefined,
          highProjectRevenue: undefined,
        };
        this.setConfigParams(configParams);
      } else {
        this.$message.error(res.message);
      }
    },
    handleParamsReset() {
      //年份
      this.curYear = "2023";
      //资金性质
      this.fundType = this.fundTypeOptions.map((item) => item.value);
      this.checkAll = true;
      this.indeterminate = false;
      //均衡性比例
      this.ratioNumber = 0.25;
      //执行率偏大值
      this.highExecutionRate = 0.98;
      //执行率偏小值
      this.lowExecutionRate = 0.7;
      //项目支出较大值
      this.highProjectExpenditure = undefined;
      //项目收入较大值
      this.highProjectRevenue = undefined;

      const configParams = {
        curYear: "2023",
        fundType: this.fundTypeOptions.map((item) => item.value),
        ratioNumber: 0.25,
        highExecutionRate: 0.98,
        lowExecutionRate: 0.7,
        highProjectExpenditure: undefined,
        highProjectRevenue: undefined,
      };
      this.setConfigParams(configParams);
    },
    handleParamsConfig() {
      const configParams = {
        curYear: this.curYear,
        fundType: this.fundType,
        ratioNumber: this.ratioNumber,
        highExecutionRate: this.highExecutionRate,
        lowExecutionRate: this.lowExecutionRate,
        highProjectExpenditure: this.highProjectExpenditure,
        highProjectRevenue: this.highProjectRevenue,
      };
      this.setConfigParams(configParams);
    },
    async getAllData() {
      if (!this.curTreeItem.key) return;
      await this.getFundsTypeOption();
      await this.getManageOverview();
      await this.getManageBasicInfo();
      await this.getPieData();
    },
    //获取概览情况
    async getManageOverview() {
      const json = {
        year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
      };
      const res = await getManageOverview(json);
      if (res.message === "成功") {
        this.unitData = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //获取主管单位右侧基本信息
    async getManageBasicInfo() {
      const json = {
        year: this.configParams.curYear,
        unitCode: this.curTreeItem.key,
      };
      const res = await getManageBasicInfo(json);
      if (res.message === "成功") {
        this.detailsData = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    changeSelected(val) {
      this.selected = val;
    },
    async getPieData() {
      const json = {
        // year: this.configParams.curYear,
        dept_code: this.curTreeItem.key,
      };
      const res = await getPieData(json);
      if (res.message === "成功") {
        this.graphData = res.data;
      } else {
        this.$message.error(res.message);
      }
      console.log("🚀 ~ getPieData ~ this.graphData:", this.graphData);
    },
    handleSkip() {
      this.subordinateShow = !this.subordinateShow;
      this.basicInfoShow = !this.basicInfoShow;

      if (this.subordinateShow) {
        this.$nextTick(() => {
          this.initEcharts1();
          this.initEcharts2();
        });
      }
    },
    initEcharts1() {
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);
      const _that = this;
      const option = {
        tooltip: {
          trigger: "item",
          formatter: "单位性质：{b}<br />单位数量：{c}<br />占比：{d}%",
        },
        series: [
          {
            name: "预算单位",
            type: "pie",
            radius: "80%",
            center: ["48%", "50%"],
            data: _that.graphData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 24,
              formatter: "{b}\n{d}%",
            },
            //伸出的箭头
            labelLine: {
              //以下代码注释为实现：指示线颜色与扇形块颜色一致
              lineStyle: {
                color: "#97A3B7",
              },
              smooth: 0.2,
              // length: 30,
              // length2: 20,
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function () {
              return Math.random() * 200;
            },
            //选中高亮
            selectedMode: "single",
            select: {
              itemStyle: {
                // color: "#000",
                // border: "1px solid #000",
                // borderWidth: 2,
                borderColor: "rgba(0, 255, 0, 0.8)",
                // borderType: "solid",
                color: "rgba(0, 255, 0, 0.8)", // 选中时的颜色
                shadowBlur: 30, // 选中时的阴影模糊程度
                shadowColor: "rgba(0, 0, 0, 0.5)", // 选中时的阴影颜色
                shadowOffsetX: 15, // 选中时的阴影水平偏移
                shadowOffsetY: 15, // 选中时的阴影垂直偏移
              },
            },
          },
        ],
      };

      this.myChart1.setOption(option);

      this.myChart1.on("click", function (params) {
        console.log("🚀 ~ params:", params);
        if (_that.dataIndex !== params.dataIndex) {
          // 选中
          _that.dataIndex = params.dataIndex;
        } else {
          // 取消选中
          _that.dataIndex = -1;
        }
      });
    },
    initEcharts2() {
      if (this.myChart2) {
        this.myChart2.dispose();
      }
      this.myChart2 = this.$echarts.init(this.$refs.graph2);
      const _that = this;
      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}",
        },
        series: [
          {
            name: "预算单位",
            type: "treemap",
            roam: false, //false是否开启拖拽漫游（移动和缩放）。
            data: _that.blocks,
            breadcrumb: {
              show: false, //是否展示下方黑色导航栏
            },
            nodeClick: false,
          },
        ],
      };

      this.myChart2.setOption(option);

      this.myChart2.on("click", function (params) {
        console.log("🚀 ~ params:", params);
        _that.handleBlockClick(params.data);
      });
    },
    handleBlockClick(item) {
      this.$router.push({
        name: "budgetPortrait",
        query: { key: item.code },
      });
    },
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length &&
        checkedList.length < this.fundTypeOptions.length;
      this.checkAll = checkedList.length === this.fundTypeOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        fundType: e.target.checked
          ? this.fundTypeOptions.map((item) => item.value)
          : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },
  },
};
</script>
<style lang="less">
.portrait-detail {
  width: calc(100% - 320px);
  min-height: 100%;
  padding: 20px;
  background: #fff;
  display: flex;

  .manage-right {
    width: calc(100% - 220px);
    margin-right: 220px;

    &-header {
      height: 28px;
      line-height: 28px;
      color: #1c222b;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    &-box {
      padding-bottom: 20px;
    }

    &-overview {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      grid-template-rows: 126px;
      gap: 20px;
      margin-bottom: 20px;

      .overview-item {
        //每个小方块
        height: 126px;
        padding: 20px 8px;
        color: #3c485c;
        border-radius: 6px;
        position: relative;

        .item-top {
          height: 22px;
          line-height: 22px;
        }

        .item-middle {
          margin: 10px 0;
          font-weight: 500;
          font-size: 24px;
          height: 24px;
          line-height: 24px;
          font-family: "DIN";
        }

        .item-bottom {
          display: flex;

          &-icon {
            width: 12px;
            height: 12px;
            margin-left: 4px;
          }
        }

        .item-icon {
          width: 40px;
          height: 40px;
          position: absolute;
          right: 15px;
          bottom: 10px;
        }
      }

      .overview-item-one {
        background: linear-gradient(104deg, #dfeaff 0%, #f4f6ff 100.1%);

        .icon-up {
          color: #cbddff;
        }
      }

      .overview-item-two {
        background: linear-gradient(104deg, #fff2df 0%, #fffaf2 100.1%);

        .icon-up {
          color: #ffe6c1;
        }
      }

      .overview-item-third {
        background: linear-gradient(104deg, #e1f8ff 0%, #eff9ff 100.1%);

        .icon-up {
          color: #c3ebff;
        }
      }
    }

    .layout-btns {
      width: 100%;
      height: 80px;
      padding: 24px 0;
      display: flex;
      background: #fff;
      position: relative;
      align-items: center;
      transition: all 0.3s;

      &-item {
        margin-right: 14px;
        cursor: pointer;

        .layout-btn {
          border: none;
          border-radius: 2px !important;
          background: linear-gradient(
            to right,
            rgba(1, 110, 255, 0.6),
            rgba(1, 110, 255)
          );
          color: #fff;
          padding: 0 14px;
          display: flex;
          align-items: center;

          &-text {
            font-size: 16px;
            line-height: 32px;
          }

          &.active {
            color: @cyan;
          }
        }
      }
    }

    @media screen and (max-width: 1356px) {
      .layout-btns {
        &-item {
          margin-right: 8px;

          .layout-btn {
            padding: 0 8px;
          }
        }
      }
    }

    .layout-basic-details {
      width: 100%;
      display: grid;
      border-top: 1px solid @borderColor;
      border-left: 1px solid @borderColor;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: repeat(5, 42px) auto;
      margin-bottom: 36px;
      transition: all 0.2s;

      .details-item {
        display: flex;
        width: 100%;
        align-items: center;
        font-size: 14px;
        color: @primaryTextColor;
        border-right: 1px solid @borderColor;
        border-bottom: 1px solid @borderColor;

        &-label {
          width: 160px;
          text-align: right;
          background: @tableHeaderColor;
          display: inline-block;
          height: 100%;
          line-height: 42px;
          padding-right: 20px;
          border-right: 1px solid @borderColor;
          position: relative;
        }

        &-value {
          width: calc(100% - 160px);
          padding-left: 12px;
        }

        &.main {
          grid-column-start: 1;
          grid-column-end: 4;
          grid-row-start: 6;
          grid-row-end: 7;
          align-items: stretch;

          .details-item-label {
            height: auto;

            .label-text {
              height: auto;
              position: absolute;
              top: 50%;
              right: 20px;
              transform: translateY(-50%);
            }
          }

          .details-item-value {
            line-height: 32px;
            padding: 5px 12px;
          }
        }
      }
      // .details-item:nth-of-type(17) {
      //   /* 列合并 */
      //   grid-column: 2 / span 2;
      // }
      .details-item:nth-of-type(22) {
        /* 列合并 */
        grid-column: 1 / span 3;
      }
    }

    .layout-basic-graph {
      .container-wrapper {
        width: 100%;
        height: 360px;
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
        padding: 12px 20px 20px 20px;
        margin-bottom: 20px;

        .wrapper-top {
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          &-title {
            color: #1c222b;
            font-weight: 600;
            display: flex;
            align-items: center;
          }
        }

        .wrapper-split {
          width: 100%;
          height: 1px;
          background: #016eff;
          margin-bottom: 20px;
        }

        // 图的部分
        .wrapper-content {
          width: 100%;
          height: calc(100% - 43px);
          display: flex;
          justify-content: center;

          // 左侧饼图
          &-left {
            width: 500px;
            height: 100%;
            margin-right: 20px;
            display: flex;
            justify-content: center;

            &-graph {
              width: 100%;
              height: 100%;
            }
          }

          // 右侧堆叠图
          &-right {
            width: calc(100% - 520px);
            height: 100%;
            display: flex;

            &-graph {
              width: 100%;
              height: 100%;
            }

            .blocks {
              width: auto;
              height: 272px;
              display: grid;
              grid-template-rows: repeat(4, 68px);
              grid-auto-flow: column;
              overflow-x: auto;
              overflow-y: hidden;

              .block-item {
                padding: 12px;
                width: 170px;
                height: 68px;
                line-height: 44px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }

  .params-config {
    width: 200px;
    position: fixed;
    top: 192px;
    right: 40px;
    border: 1px solid #d6dbe3;
    border-radius: 6px;
    padding: 12px 16px;

    &-header {
      color: #3c485c;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    &-item {
      width: 100%;
      margin-bottom: 10px;

      .item-label {
        margin-bottom: 4px;
      }

      .item-set {
        width: 100%;
        display: flex;
        align-items: center;

        &-input {
          width: 60%;
        }

        &-color-red,
        &-color-orange {
          width: 24px;
          height: 24px;
          margin-left: 16px;
        }

        &-color-red {
          background-color: red;
        }
        &-color-orange {
          background-color: #f28518;
        }
      }

      .item-input {
        width: 100%;

        .ant-input-number-handler-wrap {
          display: none;
        }

        &.ant-checkbox-group {
          .ant-checkbox-group-item {
            display: flex;

            .ant-checkbox {
              width: 16px;
              height: 16px;
              margin-top: 4px;
            }
          }
        }
      }

      .color-box {
        width: 100%;
        display: flex;
        // justify-content: space-between;

        &-red {
          width: 30px;
          height: 30px;
          margin-left: 30px;
          background-color: red;
        }
      }
    }

    &-btns {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 20px;
    }
  }
}
</style>
