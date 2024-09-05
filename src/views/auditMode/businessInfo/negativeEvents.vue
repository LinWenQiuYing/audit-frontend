<template>
  <div class="negative-events">
    <div class="business-table-item">
      <div class="sub-title">特征列表</div>
      <a-button class="business-table-btn" @click="handleChangebtn(1)">
        <!-- {{ foldValue1 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue1 ? 'up' : 'down'" />
      </a-button>
      <feature-table :dataList="dataList" :foldValue="foldValue1" :type="3" />
    </div>
    <div class="business-table-item">
      <div class="sub-title">负面事件总体分析</div>
      <a-button class="business-table-btn" @click="handleChangebtn(2)">
        <!-- {{ foldValue2 ? "收起" : "展开" }} -->
        <a-icon :type="foldValue2 ? 'up' : 'down'" />
      </a-button>
      <div
        :class="
          foldValue2 ? 'business-table-content' : 'business-table-content fold'
        "
      >
        <data-graphs ref="dataGraphs" :list="graphList" />
      </div>
    </div>
    <div class="business-table-item">
      <a-tabs :active-key="activeKey" @change="onKeychange">
        <a-tab-pane
          forceRender
          :key="tab.key"
          :tab="tab.title"
          v-for="tab in tabs"
        >
          <data-graphs :ref="tab.ref" :list="tab.list" />
          <a-tabs
            v-if="activeKey === 1"
            :active-key="subActiveKey1"
            @change="onSubKeychange"
          >
            <a-tab-pane :key="tab.key" :tab="tab.title" v-for="tab in subTabs1">
            </a-tab-pane>
          </a-tabs>
          <a-tabs
            v-if="activeKey === 3"
            :active-key="subActiveKey2"
            @change="onSubKeychange"
          >
            <a-tab-pane :key="tab.key" :tab="tab.title" v-for="tab in subTabs2">
            </a-tab-pane>
          </a-tabs>
          <div class="business-table-item-box">
            <DetailTable
              :tableTitle="tab.tableTitle"
              :foldValue="foldValue3"
              :columns="tableColumns"
              :infoData="infoData"
              :pagination="pagination"
              :tableClass="tab.tableClass"
              :loading="tableLoading"
              :infoQuery="infoQuery"
              @handleChangebtn="handleChangebtn(3)"
            >
              <div
                slot="searchOption"
                v-show="activeKey === 1 && subActiveKey1 === 1"
              >
                <div class="business-options">
                  <div class="business-options-item">
                    <label class="item-label">案件类别：</label>
                    <div class="item-content">
                      <a-select
                        allow-clear
                        :options="caseOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="caseValue"
                      />
                    </div>
                  </div>
                  <!-- <div class="business-options-item">
                    <label class="item-label second-type">当事人类型：</label>
                    <div class="item-content second-type">
                      <a-select
                        allow-clear
                        :options="partyOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="partyValue"
                      />
                    </div>
                  </div> -->
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
                  <div class="business-options-item"></div>
                  <div class="business-options-item">
                    <div class="item-buttons">
                      <a-button class="button-left" @click="reset"
                        >重置</a-button
                      >
                      <a-button
                        type="primary"
                        class="button-right"
                        icon="search"
                        @click="handleSearch"
                        >查询</a-button
                      >
                    </div>
                  </div>
                </div>
                <!-- <div class="business-options">
                  <div class="business-options-item"></div>
                  <div class="business-options-item"></div>
                </div> -->
              </div>
              <div
                slot="searchOption"
                v-show="activeKey === 1 && subActiveKey1 === 2"
              >
                <div class="business-options">
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
                  <div class="business-options-item"></div>
                  <div class="business-options-item"></div>
                  <div class="business-options-item">
                    <div class="item-buttons">
                      <a-button class="button-left" @click="reset"
                        >重置</a-button
                      >
                      <a-button
                        type="primary"
                        class="button-right"
                        icon="search"
                        @click="handleSearch"
                        >查询</a-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div slot="searchOption" v-show="activeKey === 2">
                <div class="business-options">
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
                  <div class="business-options-item">
                    <label class="item-label">处罚类型：</label>
                    <div class="item-content">
                      <a-select
                        allow-clear
                        :options="punishOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="punishValue"
                      />
                    </div>
                  </div>
                  <div class="business-options-item"></div>
                  <div class="business-options-item">
                    <div class="item-buttons">
                      <a-button class="button-left" @click="reset"
                        >重置</a-button
                      >
                      <a-button
                        type="primary"
                        class="button-right"
                        icon="search"
                        @click="handleSearch"
                        >查询</a-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                slot="searchOption"
                v-show="activeKey === 3 && subActiveKey2 === 1"
              >
                <div class="business-options">
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
                  <div class="business-options-item">
                    <label class="item-label third-type">失信事件小类：</label>
                    <div class="item-content third-type">
                      <a-select
                        allow-clear
                        :options="childTypeOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="childTypeValue"
                      />
                    </div>
                  </div>
                  <div class="business-options-item"></div>
                  <div class="business-options-item">
                    <div class="item-buttons">
                      <a-button class="button-left" @click="reset"
                        >重置</a-button
                      >
                      <a-button
                        type="primary"
                        class="button-right"
                        icon="search"
                        @click="handleSearch"
                        >查询</a-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                slot="searchOption"
                v-show="activeKey === 3 && subActiveKey2 === 2"
              >
                <div class="business-options">
                  <div class="business-options-item">
                    <label class="item-label third-type">申请列入年度：</label>
                    <div class="item-content third-type">
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
                  <div class="business-options-item">
                    <label class="item-label">状态：</label>
                    <div class="item-content">
                      <a-select
                        allow-clear
                        :options="stateOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="stateValue"
                      />
                    </div>
                  </div>
                  <div class="business-options-item">
                    <label class="item-label">违法类型：</label>
                    <div class="item-content">
                      <a-select
                        allow-clear
                        :options="illegalOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="illegalValue"
                      />
                    </div>
                  </div>
                  <div class="business-options-item">
                    <div class="item-buttons">
                      <a-button class="button-left" @click="reset"
                        >重置</a-button
                      >
                      <a-button
                        type="primary"
                        class="button-right"
                        icon="search"
                        @click="handleSearch"
                        >查询</a-button
                      >
                    </div>
                  </div>
                </div>
                <!-- <div class="business-options">
                  <div class="business-options-item"></div>
                  <div class="business-options-item"></div>
                </div> -->
              </div>
              <div slot="searchOption" v-show="activeKey === 4">
                <div class="business-options">
                  <div class="business-options-item">
                    <label class="item-label fourth-type"
                      >处罚记录所属年度：</label
                    >
                    <div class="item-content fourth-type">
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
                  <div class="business-options-item">
                    <label class="item-label fourth-type"
                      >违法违章类型名称：</label
                    >
                    <div class="item-content fourth-type">
                      <a-select
                        allow-clear
                        :options="nameOptions"
                        class="item-content-input"
                        placeholder="请选择"
                        v-model="nameValue"
                      />
                    </div>
                  </div>
                  <div class="business-options-item"></div>
                  <div class="business-options-item">
                    <div class="item-buttons">
                      <a-button class="button-left" @click="reset"
                        >重置</a-button
                      >
                      <a-button
                        type="primary"
                        class="button-right"
                        icon="search"
                        @click="handleSearch"
                        >查询</a-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </DetailTable>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import DataGraphs from "../components/dataGraphs";
import DetailTable from "../components/detailTable";
import FeatureTable from "../components/featureTable";
import { Button, DatePicker, Icon, Tabs, Tooltip } from "ant-design-vue";
import { find, union } from "lodash";
import {
  lineColor1,
  lineColor2,
  lineColor3,
  lineColor4,
  lineColor5,
  lineColor6,
  lineColor7,
  lineColor8,
  lineColor9,
  lineColor10,
  lineColor11,
} from "@/assets/theme/model.js";
import { scrollToBottom } from "@/utils/common.js";
import { mapState } from "vuex";
import {
  negAnalyseQuery,
  negEventQuery,
  courtSourceQuery,
  identityQuery,
  justiceDetailQuery,
  adminPunDetailQuery,
  discreditBehaviorQuery,
  enforceDetailQuery,
  seriousFaithQuery,
  taxDetailQuery,
  negCountQuery,
} from "@/shared/api/auditMode.js";
import { handleAddEchartsBackground } from "@/utils/echarts.js";
import { findIndex } from "lodash";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default {
  name: "NegativeEvents",
  data() {
    return {
      dataList: [],
      graphList: [
        {
          title: "负面事件年度分析",
          ref: "graph1",
          // width: "calc((100% - 48px) / 3 * 2 + 24px)",
          width: "calc((100% - 24px) / 2)",
          paddingTop: "381px",
          dataSource: "融合上海市各委办局负面信息",
        },
        {
          title: "负面事件数量趋势分析",
          ref: "graph2",
          // width: "calc((100% - 48px) / 3)",
          width: "calc((100% - 24px) / 2)",
          paddingTop: "381px",
          dataSource: "融合上海市各委办局负面信息",
        },
      ],
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,
      myChart5: null,
      myChart6: null,
      myChart7: null,
      myChart8: null,
      myChart9: null,
      myChart10: null,
      myChart11: null,
      activeKey: 1,
      activedKeys: [1],
      subActiveKey1: 1,
      subActiveKey2: 1,
      startStopTime: [],
      caseValue: undefined,
      caseOptions: [],
      partyValue: undefined,
      partyOptions: [],
      punishValue: undefined,
      punishOptions: [],
      stateValue: undefined,
      stateOptions: [],
      illegalValue: undefined,
      illegalOptions: [],
      childTypeValue: undefined,
      childTypeOptions: [],
      nameValue: undefined,
      nameOptions: [],
      isOpen: false,
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
          this.handleSearch();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.handleSearch();
        },
      },
      tableColumns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 62,
        },
        {
          title: "案号",
          dataIndex: "number",
          key: "number",
          width: 120,
        },
        {
          title: "案由名称",
          dataIndex: "name",
          key: "name",
          width: 120,
        },
        {
          title: "案件类型",
          dataIndex: "type",
          key: "type",
          width: 120,
        },
        {
          title: "立案日期",
          dataIndex: "createDate",
          key: "createDate",
          width: 120,
        },
        {
          title: "结案日期",
          dataIndex: "endDate",
          key: "endDate",
          width: 120,
        },
        {
          title: "诉讼地位",
          dataIndex: "level",
          key: "levl",
          width: 100,
        },
        {
          title: "案件其他相关人",
          dataIndex: "other",
          key: "other",
          width: 240,
        },
      ],
      tableLoading: false,
      infoData: [],
      tabs: [
        {
          key: 1,
          title: "司法事件",
          ref: "dataGraphs1",
          list: [
            {
              title: "个案数量趋势",
              ref: "graph3",
              width: "calc((100% - 48px) / 3)",
              paddingTop: "381px",
              dataSource: "上海市高院",
            },
            {
              title: "司法投诉来源法院TOP10",
              ref: "graph4",
              width: "calc((100% - 48px) / 3)",
              paddingTop: "381px",
              dataSource: "上海市高院",
            },
            {
              title: "司法事件判决身份",
              ref: "graph5",
              width: "calc((100% - 48px) / 3)",
              paddingTop: "381px",
              dataSource: "上海市高院",
            },
          ],
          tableTitle: "司法事件明细",
          tableClass: "features-table2",
          titleSlot1: "案件类别中文名",
          titleSlot2: "法院名称",
          titleSlot3: "诉讼地位名称",
        },
        {
          key: 2,
          title: "行政处罚",
          ref: "dataGraphs2",
          list: [
            {
              title: "行政处罚事件数量分布",
              ref: "graph6",
              width: "calc((100% - 24px) / 2)",
              paddingTop: "381px",
              dataSource: "融合上海市各委办局行政处罚信息",
            },
            {
              title: "行政违法源办局分布",
              ref: "graph7",
              width: "calc((100% - 24px) / 2)",
              paddingTop: "381px",
              dataSource: "融合上海市各委办局行政处罚信息",
            },
          ],
          tableTitle: "行政处罚明细",
          tableClass: "features-table2",
          titleSlot1: "行政处罚名称",
          titleSlot2: "处罚单位",
          titleSlot3: "处罚类型",
        },
        {
          key: 3,
          title: "失信行为",
          ref: "dataGraphs3",
          list: [
            {
              title: "企业失信行为趋势分析",
              ref: "graph8",
              width: "calc((100% - 24px) / 2)",
              paddingTop: "381px",
              dataSource: "融合上海市各委办局失信行为信息",
            },
            {
              title: "企业失信行为类型分布",
              ref: "graph9",
              width: "calc((100% - 24px) / 2)",
              paddingTop: "381px",
              dataSource: "融合上海市各委办局失信行为信息",
            },
          ],
          tableTitle: "失信行为明细",
          tableClass: "features-table3",
          titleSlot1: "失信行为类别中文名称",
        },
        {
          key: 4,
          title: "涉税违章",
          ref: "dataGraphs4",
          list: [
            {
              title: "涉税违章趋势分析",
              ref: "graph10",
              width: "calc((100% - 24px) / 2)",
              paddingTop: "381px",
              dataSource: "上海市税务局",
            },
            {
              title: "涉税违章类型分布",
              ref: "graph11",
              width: "calc((100% - 24px) / 2)",
              paddingTop: "381px",
              dataSource: "上海市税务局",
            },
          ],
          tableTitle: "涉税违法明细",
          tableClass: "features-table3",
          titleSlot1: "涉税违法类型名称",
        },
      ],
      subTabs1: [
        {
          key: 1,
          title: "司法事件明细表",
        },
        {
          key: 2,
          title: "强制执行明细表",
        },
      ],
      subTabs2: [
        {
          key: 1,
          title: "失信行为明细",
        },
        {
          key: 2,
          title: "严重失信名单",
        },
      ],
      foldValue1: true,
      foldValue2: true,
      foldValue3: true,
      labelMap: {
        司法事件: ["法院名称", "案件性质", "判决身份"],
        行政处罚: ["来源委派局", "子类事件"],
        失信行为: ["年度统计", "类型分布"],
        涉税违章: ["年度统计", "违章类型"],
      },
      infoQuery: {},
      lineColor: [
        lineColor1,
        lineColor2,
        lineColor3,
        lineColor4,
        lineColor5,
        lineColor6,
        lineColor7,
        lineColor8,
        lineColor9,
        lineColor10,
        lineColor11,
      ],
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    ARangePicker: RangePicker,
    ATabPane: TabPane,
    ATabs: Tabs,
    ATooltip: Tooltip,
    DataGraphs,
    DetailTable,
    FeatureTable,
  },
  mounted() {
    this.negAnalyseQuery();
    this.negEventQuery();
    this.courtSourceQuery();
    this.identityQuery();
    this.justiceDetailQuery("init");
    this.negCountQuery();
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
      this.myChart5.resize();
      if (this.myChart6) {
        this.myChart6.resize();
      }
      if (this.myChart7) {
        this.myChart7.resize();
      }
      if (this.myChart8) {
        this.myChart8.resize();
      }
      if (this.myChart9) {
        this.myChart9.resize();
      }
      if (this.myChart10) {
        this.myChart10.resize();
      }
      if (this.myChart11) {
        this.myChart11.resize();
      }
    };
    window.addEventListener("resize", f);
  },
  beforeDestroy() {
    this.myChart1.clear();
    this.myChart2.clear();
    this.myChart3.clear();
    this.myChart4.clear();
    this.myChart5.clear();
    if (this.myChart6) {
      this.myChart6.clear();
    }
    if (this.myChart7) {
      this.myChart7.clear();
    }
    if (this.myChart8) {
      this.myChart8.clear();
    }
    if (this.myChart9) {
      this.myChart9.clear();
    }
    if (this.myChart10) {
      this.myChart10.clear();
    }
    if (this.myChart11) {
      this.myChart11.clear();
    }
    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
      this.myChart5.resize();
      if (this.myChart6) {
        this.myChart6.resize();
      }
      if (this.myChart7) {
        this.myChart7.resize();
      }
      if (this.myChart8) {
        this.myChart8.resize();
      }
      if (this.myChart9) {
        this.myChart9.resize();
      }
      if (this.myChart10) {
        this.myChart10.resize();
      }
      if (this.myChart11) {
        this.myChart11.resize();
      }
    };
    window.removeEventListener("resize", f);
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  methods: {
    initGraph(chart, option, xAxis) {
      // 渲染echarts图表
      chart.setOption(option);
      if (xAxis) {
        handleAddEchartsBackground(chart, option, xAxis);
      }
    },
    async onKeychange(activeKey) {
      this.activeKey = activeKey;
      const index = findIndex(this.activedKeys, (v) => v === activeKey);
      this.infoData = [];
      this.startStopTime = [];
      this.activedKeys.push(this.activeKey);

      if (index === -1) {
        this.negEventQuery();

        if (activeKey === 3) {
          // 如果是失信行为，则重置subActiveKey
          this.subActiveKey2 = 1;
        }
      }

      if (activeKey === 2) {
        // 行政处罚
        this.tableColumns = [
          {
            title: "序号",
            dataIndex: "index",
            key: "index",
            width: 62,
          },
          {
            title: "处罚类型",
            dataIndex: "type",
            key: "type",
            width: 140,
          },
          {
            title: "处罚文书号",
            dataIndex: "number",
            key: "number",
            width: 120,
          },
          {
            title: "处罚行为",
            dataIndex: "action",
            key: "action",
            width: 110,
          },
          {
            title: "处罚结果",
            dataIndex: "result",
            key: "result",
            width: 113,
          },
          {
            title: "处罚决定单位名称",
            dataIndex: "office",
            key: "office",
            width: 160,
          },
          {
            title: "处罚年份",
            dataIndex: "year",
            key: "year",
            width: 110,
          },
          {
            title: "处罚金额",
            dataIndex: "money",
            key: "money",
            width: 110,
          },
          {
            title: "罚款实缴金额",
            dataIndex: "moneyClosed",
            key: "moneyClosed",
            width: 125,
          },
          {
            title: "违法事实",
            dataIndex: "fact",
            key: "fact",
            width: 280,
          },
          {
            title: "处罚程序",
            dataIndex: "procedure",
            key: "procedure",
            width: 110,
          },
        ];
        this.adminPunDetailQuery("init");
      } else if (activeKey === 4) {
        // 涉税违章
        this.tableColumns = [
          {
            title: "序号",
            dataIndex: "index",
            key: "index",
            width: 62,
          },
          {
            title: "处罚记录日期",
            dataIndex: "time",
            key: "time",
            sortOrder: "",
            width: 120,
          },
          {
            title: "违法违章类型名称",
            dataIndex: "name",
            key: "name",
            sortOrder: "",
            width: 120,
          },
          {
            title: "违法手段",
            dataIndex: "method",
            key: "method",
            width: 160,
          },
          {
            title: "处罚决定",
            dataIndex: "result",
            key: "result",
            width: 160,
          },
        ];
        this.taxDetailQuery("init");
      } else if (activeKey === 1) {
        // 司法事件
        this.onSubKeychange(this.subActiveKey1);
      } else {
        // 失信行为
        this.onSubKeychange(this.subActiveKey2);
      }
    },
    async onSubKeychange(activeKey) {
      if (this.activeKey === 1) {
        this.subActiveKey1 = activeKey;
      } else {
        this.subActiveKey2 = activeKey;
      }
      this.startStopTime = [];
      this.infoData = [];
      if (this.activeKey === 1) {
        if (this.subActiveKey1 === 1) {
          // 司法案件明细表
          // this.onKeychange(1);
          this.tabs[0].tableTitle = "司法事件明细";
          this.tableColumns = [
            {
              title: "序号",
              dataIndex: "index",
              key: "index",
              width: 62,
            },
            {
              title: "案号",
              dataIndex: "number",
              key: "number",
              width: 120,
            },
            {
              title: "案由名称",
              dataIndex: "name",
              key: "name",
              width: 120,
            },
            {
              title: "案件类型",
              dataIndex: "type",
              key: "type",
              width: 120,
            },
            {
              title: "立案日期",
              dataIndex: "createDate",
              key: "createDate",
              width: 120,
            },
            {
              title: "结案日期",
              dataIndex: "endDate",
              key: "endDate",
              width: 120,
            },
            {
              title: "诉讼地位",
              dataIndex: "level",
              key: "levl",
              width: 100,
            },
            {
              title: "案件其他相关人",
              dataIndex: "other",
              key: "other",
              width: 240,
            },
          ];
          this.justiceDetailQuery("init");
        } else {
          // 强制执行明细表
          this.tableColumns = [
            {
              title: "序号",
              dataIndex: "index",
              key: "index",
              width: 62,
            },
            {
              title: "执行案号",
              dataIndex: "number",
              key: "number",
              width: 120,
            },
            {
              title: "被执行人",
              dataIndex: "name",
              key: "name",
              width: 120,
            },
            {
              title: "执行法院",
              dataIndex: "court",
              key: "court",
              width: 120,
            },
            {
              title: "信息状态",
              dataIndex: "status",
              key: "status",
              width: 160,
            },
          ];
          this.enforceDetailQuery("init");
          this.tabs[0].tableTitle = "强制执行明细表";
          // this.tabs[0].titleSlot1 = "执行案号";
          // this.tabs[0].titleSlot2 = "执行法院";
          // this.tabs[0].titleSlot3 = "执行案号";
        }
      } else {
        if (this.subActiveKey2 === 1) {
          // 失信行为明细
          // this.onKeychange(3);
          this.tabs[2].tableTitle = "失信行为明细";
          this.tableColumns = [
            {
              title: "序号",
              dataIndex: "index",
              key: "index",
              width: 62,
            },
            {
              title: "失信事件小类",
              dataIndex: "childType",
              key: "childType",
              sortOrder: "",
              width: 120,
            },

            {
              title: "年份",
              dataIndex: "year",
              key: "year",
              width: 120,
            },
            {
              title: "状态",
              dataIndex: "status",
              key: "status",
              width: 120,
            },
            {
              title: "失信类型",
              dataIndex: "type",
              key: "type",
              width: 120,
            },
            {
              title: "事件描述",
              dataIndex: "detail",
              key: "detail",
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
          ];
          this.discreditBehaviorQuery("init");
        } else {
          // 严重失信名单
          this.tableColumns = [
            {
              title: "序号",
              dataIndex: "index",
              key: "index",
              width: 62,
            },
            {
              title: "列入原因",
              dataIndex: "reason",
              key: "reason",
              width: 120,
            },
            {
              title: "违法类型",
              dataIndex: "type",
              key: "type",
              width: 120,
            },
            {
              title: "状态",
              dataIndex: "status",
              key: "status",
              width: 120,
            },
            {
              title: "列入申请时间",
              dataIndex: "inTime",
              key: "inTime",
              width: 160,
            },
            {
              title: "列入机关名称",
              dataIndex: "inName",
              key: "inName",
              width: 160,
            },
            {
              title: "列入决定日期",
              dataIndex: "inDate",
              key: "inDate",
              width: 160,
            },
            {
              title: "移出决定时间",
              dataIndex: "outTime",
              key: "outTime",
              width: 160,
            },
            {
              title: "列入申请机关",
              dataIndex: "inGroup",
              key: "inGroup",
              width: 160,
            },
            {
              title: "移出申请机关",
              dataIndex: "outGroup",
              key: "outGroup",
              width: 160,
            },
          ];
          this.tabs[2].tableTitle = "严重失信名单";
          this.seriousFaithQuery("init");
        }
      }
    },
    onPanelChange(value) {
      this.startStopTime = value;
    },
    onChange(date) {
      this.startStopTime = date;
    },
    onOpenChange(status) {
      this.isOpen = status;
    },
    reset() {
      this.caseValue = undefined;
      this.punishValue = undefined;
      this.stateValue = undefined;
      this.illegalValue = undefined;
      this.childTypeValue = undefined;
      this.nameValue = undefined;
      this.startStopTime = [];
      this.onKeychange(this.activeKey);
    },
    handleSearch() {
      switch (this.activeKey) {
        case 1:
          if (this.subActiveKey1 === 1) {
            this.justiceDetailQuery("init");
          } else {
            this.enforceDetailQuery("init");
          }
          break;
        case 2:
          this.adminPunDetailQuery("init");
          break;
        case 3:
          if (this.subActiveKey2 === 1) {
            this.discreditBehaviorQuery("init");
          } else {
            this.seriousFaithQuery("init");
          }
          break;
        case 4:
          this.taxDetailQuery("init");
          break;
        default:
          break;
      }
    },
    // handleTableChange(pagination, filters, sorter) {
    //   const targetColumn = find(
    //     this.tableColumns,
    //     (v) => v.key === sorter.columnKey
    //   );
    //   targetColumn.sortOrder = sorter.order;
    // },
    handleChangebtn(num) {
      switch (num) {
        case 1:
          this.foldValue1 = !this.foldValue1;
          if (
            this.foldValue1 &&
            !this.foldValue2 &&
            !this.foldValue3 &&
            !this.foldValue4
          ) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 30);
            }, 200);
          }
          break;
        case 2:
          this.foldValue2 = !this.foldValue2;
          if (this.foldValue2 && !this.foldValue3 && !this.foldValue4) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 30);
            }, 200);
          }
          break;
        case 3:
          this.foldValue3 = !this.foldValue3;
          if (this.foldValue3 && !this.foldValue4) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 20);
            }, 300);
          }
          break;

        default:
          this.foldValue4 = !this.foldValue4;
          if (this.foldValue4) {
            setTimeout(() => {
              scrollToBottom(this, "audit-mode", 20);
            }, 300);
          }
          break;
      }
    },
    async negAnalyseQuery() {
      // 负面事件年度分析
      const json = {
        corpName: this.paramsObj.corpName,
      };
      const res = await negAnalyseQuery(json);
      if (res.message === "成功" && res.data) {
        const data = res.data;
        const xAxis = ["司法事件", "行政处罚", "失信行为", "涉税违章"];
        const yAxis = [];
        const graphData = [];
        const map = { 司法事件: 0, 行政处罚: 1, 失信行为: 2, 涉税违章: 3 };
        data.map((item, index) => {
          yAxis.unshift(item.ndh);
          item.res.map((i) => {
            graphData.push([
              map[i.fmsjlx1],
              data.length - index - 1,
              i.cn || 0,
            ]);
          });
          console.log("graphData", graphData);
        });

        // 准备渲染echarts图表
        this.myChart1 = this.$echarts.init(
          this.$refs.dataGraphs.$refs.graph1[0]
        );
        const option = {
          tooltip: {
            position: "top",
          },
          grid: {
            top: "10",
            right: "70",
            bottom: "30",
          },
          xAxis: {
            type: "category",
            data: xAxis,
            splitArea: {
              show: true,
            },
          },
          yAxis: {
            type: "category",
            data: yAxis,
            minInterval: 1,
            // data:['2022','2021','2020'],
            splitArea: {
              show: true,
            },
          },
          visualMap: {
            max: 10,
            calculable: true,
            orient: "vertical",
            top: "center",
            right: "0%",
            inRange: {
              color: ["#E8F3FF", "#4080FF", "#000D4D"],
            },
          },
          series: [
            {
              type: "heatmap",
              data: graphData.map(function (item) {
                return [item[0], item[1], item[2] || "-"];
              }),
              label: {
                show: true,
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
              color: this.lineColor,
            },
          ],
        };
        // 开始渲染
        this.initGraph(this.myChart1, option);
      } else {
        this.$message.error("获取负面事件信息失败！");
      }
    },
    async negEventQuery() {
      // 柱状图折线图接口
      const currentTab = this.tabs.find((item) => item.key === this.activeKey);
      const title = currentTab.title;
      let secondLabel;
      for (let key in this.labelMap) {
        if (key === title) {
          secondLabel = this.labelMap[key];
        }
      }
      const json = {
        corpName: this.paramsObj.corpName,
        firstLabel: title,
        secondLabel,
      };
      const loading = this.$message.loading("正在查询", 0);
      const res = await negEventQuery(json);
      loading();
      if (res.message === "成功" && res.data) {
        const xAxis = [];
        const data = res.data;
        // 取年份为横坐标
        for (let i in data.res) {
          xAxis.push(i);
        }
        const option1 = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
            formatter: (params) => {
              let date = "";
              let htmls = params.map((item) => {
                date = item.axisValueLabel;
                let value = item.data || 0;
                if (item.seriesName !== "") {
                  return item.marker + item.seriesName + "：" + value;
                }
              });
              return date + "<br>" + htmls.join("<br>");
            },
          },
          legend: {
            top: 15,
            type: "scroll",
            orient: "horizontal",
          },
          grid: {
            x: 30,
            y: 70,
            x2: 0,
            y2: 10,
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: xAxis,
              axisPointer: {
                type: "shadow",
              },
              axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: false,
              },
              axisTick: {
                // 不展示刻度
                show: false,
              },
            },
            {
              type: "category",
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              splitArea: { show: false },
              splitLine: { show: false },
              axisPointer: { show: false },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "单位：件",
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
              label: {
                show: true,
                position: "top",
                color: "#000",
              },
            },
          ],
          series: [
            // {
            //   name: "民事",
            //   type: "bar",
            //   stack: "tax",
            //   barWidth: "30%",
            //   emphasis: {
            //     focus: "series",
            //   },
            //   data: [],
            //   itemStyle: {
            //     color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
            //       { offset: 0, color: "#298DFF" },
            //       { offset: 0.6, color: "#9CCAFF" },
            //       { offset: 1, color: "#298DFF" },
            //     ]),
            //   },
            // },
            // {
            //   name: "海事",
            //   type: "bar",
            //   stack: "tax",
            //   barWidth: "30%",
            //   emphasis: {
            //     focus: "series",
            //   },
            //   data: [],
            //   itemStyle: {
            //     color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
            //       { offset: 0, color: "#30F2CB" },
            //       { offset: 0.6, color: "#ACFAEA" },
            //       { offset: 1, color: "#30F2CB" },
            //     ]),
            //   },
            // },
            // {
            //   name: "执行",
            //   type: "bar",
            //   stack: "tax",
            //   barWidth: "30%",
            //   emphasis: {
            //     focus: "series",
            //   },
            //   data: [],
            //   itemStyle: {
            //     color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
            //       { offset: 0, color: "#0157D9" },
            //       { offset: 0.6, color: "#5B94EC" },
            //       { offset: 1, color: "#0157D9" },
            //     ]),
            //   },
            // },
          ],
        };
        const option2 = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
          },
          legend: {
            top: 15,
          },
          grid: {
            x: 0,
            y: 70,
            x2: 0,
            y2: 10,
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: xAxis,
              axisPointer: {
                type: "shadow",
              },
              axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: false,
              },
              axisTick: {
                // 不展示刻度
                show: false,
              },
            },
            {
              type: "category",
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              splitArea: { show: false },
              splitLine: { show: false },
              axisPointer: { show: false },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "单位：件",
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
          ],
          series: [],
        };
        const option3 = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
          },
          legend: {
            top: 15,
          },
          grid: {
            x: 10,
            y: 70,
            x2: 10,
            y2: 50,
            containLabel: true,
          },
          dataZoom: [
            {
              type: "inside",
            },
            {
              type: "slider",
            },
          ],
          xAxis: [
            {
              type: "category",
              data: xAxis,
              axisPointer: {
                type: "shadow",
              },
              axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: false,
              },
              axisTick: {
                // 不展示刻度
                show: false,
              },
            },
            {
              type: "category",
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              splitArea: { show: false },
              splitLine: { show: false },
              axisPointer: { show: false },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "单位：元",
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
          ],
          series: [
            {
              name: "市场监督局",
              type: "line",
              data: [],
              color: this.lineColor[0],
              showSymbol: true,
            },
            {
              name: "农业委",
              type: "line",
              data: [],
              color: this.lineColor[1],
              showSymbol: true,
            },
            {
              name: "生态环境局",
              type: "line",
              data: [],
              color: this.lineColor[2],
              showSymbol: true,
            },
            {
              name: "食药监局",
              type: "line",
              data: [],
              color: this.lineColor[3],
              showSymbol: true,
            },
            {
              name: "卫健委",
              type: "line",
              data: [],
              color: this.lineColor[4],
              showSymbol: true,
            },
            {
              name: "文旅局",
              type: "line",
              data: [],
              color: this.lineColor[5],
              showSymbol: true,
            },
          ],
        };
        const option4 = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
          },
          legend: {
            top: 15,
          },
          grid: {
            x: 10,
            y: 70,
            x2: 10,
            y2: 10,
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: xAxis,
              axisPointer: {
                type: "shadow",
              },
              axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: false,
              },
              axisTick: {
                // 不展示刻度
                show: false,
              },
            },
            {
              type: "category",
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              splitArea: { show: false },
              splitLine: { show: false },
              axisPointer: { show: false },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "单位：元",
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
            {
              type: "value",
              name: "单位：件",
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
          ],
          series: [
            {
              name: "失信行为金额",
              type: "bar",
              barWidth: "30%",
              seriesLayoutBy: "row",
              symbol: "none",
              smooth: true,
              tooltip: {
                valueFormatter: function (value) {
                  return value;
                },
              },
              data: [],
              color: this.lineColor[0],
            },
            {
              name: "失信行为次数",
              type: "bar",
              barWidth: "30%",
              seriesLayoutBy: "row",
              symbol: "none",
              smooth: true,
              tooltip: {
                valueFormatter: function (value) {
                  return value + " 人";
                },
              },
              data: [],
              color: this.lineColor[1],
              yAxisIndex: 1,
            },
            {
              name: "近五年失信数量平均线",
              type: "line",
              tooltip: {
                valueFormatter: function (value) {
                  return value + " %";
                },
              },
              data: [],
              color: this.lineColor[2],
            },
          ],
        };
        const option5 = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
            formatter: (params) => {
              let date = "";
              let htmls = params.map((item) => {
                date = item.axisValueLabel;
                let value = item.data || 0;
                if (item.seriesName !== "") {
                  return item.marker + item.seriesName + "：" + value;
                }
              });
              return date + "<br>" + htmls.join("<br>");
            },
          },
          legend: {
            top: 15,
          },
          grid: {
            x: 30,
            y: 70,
            x2: 0,
            y2: 10,
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: xAxis,
              axisPointer: {
                type: "shadow",
              },
              axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: false,
              },
              axisTick: {
                // 不展示刻度
                show: false,
              },
            },
            {
              type: "category",
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              splitArea: { show: false },
              splitLine: { show: false },
              axisPointer: { show: false },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "单位：件",
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
          ],
          series: [],
        };
        const option6 = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
            formatter: (params) => {
              let date = "";
              let htmls = params.map((item, index) => {
                date = item.axisValueLabel;
                let value = item.data || 0;
                if (item.seriesName === "同比增长率") {
                  value = value + "%";
                }
                return item.marker + item.seriesName + "：" + value;
              });
              return date + "<br>" + htmls.join("<br>");
            },
          },
          legend: {
            top: 15,
          },
          grid: {
            x: 10,
            y: 70,
            x2: 10,
            y2: 10,
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: xAxis,
              axisPointer: {
                type: "shadow",
              },
              axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: false,
              },
              axisTick: {
                // 不展示刻度
                show: false,
              },
            },
            {
              type: "category",
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              splitArea: { show: false },
              splitLine: { show: false },
              axisPointer: { show: false },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "单位：件",
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
          ],
          series: [
            {
              name: "涉税违章数量",
              type: "bar",
              barWidth: "30%",
              seriesLayoutBy: "row",
              symbol: "none",
              smooth: true,
              tooltip: {
                valueFormatter: function (value) {
                  return value;
                },
              },
              data: [],
              itemStyle: {
                // 柱子上方显示数据
                label: {
                  show: true,
                  position: "top",
                },
                color: this.lineColor[0],
              },
            },
            {
              name: "同比增长率",
              type: "line",
              tooltip: {
                valueFormatter: function (value) {
                  return value + " %";
                },
              },
              data: [],
              lineStyle: {
                color: this.lineColor[1],
              },
            },
          ],
        };
        const option7 = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
          },
          legend: {
            top: 15,
          },
          grid: {
            x: 0,
            y: 70,
            x2: 0,
            y2: 10,
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: xAxis,
              axisPointer: {
                type: "shadow",
              },
              axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: false,
              },
              axisTick: {
                // 不展示刻度
                show: false,
              },
            },
            {
              type: "category",
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              splitArea: { show: false },
              splitLine: { show: false },
              axisPointer: { show: false },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "单位：件",
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
          ],
          series: [],
        };
        let sumData1 = [];
        let sumData2 = [];
        switch (data.label) {
          case "司法事件":
            this.myChart3 = this.$echarts.init(
              this.$refs.dataGraphs1[0].$refs.graph3[0]
            );
            // option1.series = this.getSeriesName(data, "案件性质");
            option1.series = [
              {
                name: "执行",
                type: "bar",
                stack: "tax",
                barWidth: "30%",
                emphasis: {
                  focus: "series",
                },
                data: [],
                itemStyle: {
                  color: this.lineColor[0],
                },
              },
              {
                name: "民事",
                type: "bar",
                stack: "tax",
                barWidth: "30%",
                emphasis: {
                  focus: "series",
                },
                data: [],
                itemStyle: {
                  color: this.lineColor[1],
                },
              },
              {
                name: "刑事",
                type: "bar",
                stack: "tax",
                barWidth: "30%",
                emphasis: {
                  focus: "series",
                },
                data: [],
                itemStyle: {
                  color: this.lineColor[2],
                },
              },
              {
                name: "行政",
                type: "bar",
                stack: "tax",
                barWidth: "30%",
                emphasis: {
                  focus: "series",
                },
                data: [],
                itemStyle: {
                  color: this.lineColor[3],
                },
              },
              {
                name: "不予受理",
                type: "bar",
                stack: "tax",
                barWidth: "30%",
                emphasis: {
                  focus: "series",
                },
                data: [],
                itemStyle: {
                  color: this.lineColor[4],
                },
              },
              {
                name: "海事",
                type: "bar",
                stack: "tax",
                barWidth: "30%",
                emphasis: {
                  focus: "series",
                },
                data: [],
                itemStyle: {
                  color: this.lineColor[5],
                },
              },
            ];
            for (let key in data.res) {
              if (data.res[key]["案件性质"].length === 0) {
                option1.series.map((item) => {
                  item.data.push(0);
                });
              } else {
                data.res[key]["案件性质"].map((item) => {
                  option1.series.map((v) => {
                    if (v.name === item.fmsjlx3) {
                      v.data.push(item.cn || 0);
                    }
                  });
                  // switch (item.fmsjlx3) {
                  //   case option1.series[1].name:
                  //     option1.series[1].data.push(item.cn || 0);
                  //     break;
                  //   case option1.series[0].name:
                  //     option1.series[0].data.push(item.cn || 0);
                  //     break;
                  //   case "海事":
                  //     option1.series[2].data.push(item.cn || 0);
                  //     break;
                  //   case "执行":
                  //     option1.series[3].data.push(item.cn || 0);
                  //     break;
                  // }
                });
                // 某一项无数据时填充0
                const lens = option1.series.map((v) => v.data.length);
                const lensMaxSort = lens.sort((a, b) => b - a);
                const maxLen = lensMaxSort[0];
                option1.series.map((v) => {
                  if (v.data.length !== maxLen) {
                    v.data.push(0);
                  }
                });
              }
            }
            sumData1 = new Array(
              (option1.series.length && option1.series[0].data.length) || 0
            ).fill(0);
            option1.series.map((item) => {
              item.data.map((v, index) => {
                sumData1[index] += Number(v);
              });
            });
            option1.series.push({
              name: "",
              type: "bar",
              stack: "y",
              data: sumData1, //为前面对应数据的总和
              z: -1,
              barWidth: "30%",
              label: {
                show: true,
                position: "top",
                color: "#000",
              },
              barGap: "-100%", //与堆叠柱条重合
            });
            this.initGraph(this.myChart3, option1, xAxis);
            break;
          case "行政处罚":
            this.myChart6 = this.$echarts.init(
              this.$refs.dataGraphs2[0].$refs.graph6[0]
            );
            this.myChart7 = this.$echarts.init(
              this.$refs.dataGraphs2[0].$refs.graph7[0]
            );
            option2.series = this.getSeriesName(data, "子类事件");
            for (let key in data.res) {
              if (data.res[key]["子类事件"].length === 0) {
                option2.series.map((item) => {
                  item.data.push(0);
                });
              } else {
                data.res[key]["子类事件"].map((item) => {
                  option2.series.map((v) => {
                    if (v.name === item.fmsjlx3) {
                      v.data.push(item.cn || 0);
                    }
                  });
                });
                // 某一项无数据时填充0
                const lens = option2.series.map((v) => v.data.length);
                const lensMaxSort = lens.sort((a, b) => b - a);
                const maxLen = lensMaxSort[0];
                option2.series.map((v) => {
                  if (v.data.length !== maxLen) {
                    v.data.push(0);
                  }
                });
              }
              if (data.res[key]["来源委派局"].length === 0) {
                option3.series[0].data.push(0);
                option3.series[1].data.push(0);
                option3.series[2].data.push(0);
                option3.series[3].data.push(0);
                option3.series[4].data.push(0);
                option3.series[5].data.push(0);
              } else {
                data.res[key]["来源委派局"].map((item) => {
                  switch (item.fmsjlx3) {
                    case "市场监督局":
                      option3.series[0].data.push(item.cn || 0);
                      break;
                    case "农业委":
                      option3.series[1].data.push(item.cn || 0);
                      break;
                    case "生态环境局":
                      option3.series[2].data.push(item.cn || 0);
                      break;
                    case "食药监局":
                      option3.series[3].data.push(item.cn || 0);
                      break;
                    case "卫健委":
                      option3.series[4].data.push(item.cn || 0);
                      break;
                    case "文旅局":
                      option3.series[5].data.push(item.cn || 0);
                      break;
                    default:
                      break;
                  }
                });
              }
            }
            this.initGraph(this.myChart6, option2, xAxis);
            this.initGraph(this.myChart7, option3, xAxis);
            break;
          case "失信行为":
            this.myChart8 = this.$echarts.init(
              this.$refs.dataGraphs3[0].$refs.graph8[0]
            );
            this.myChart9 = this.$echarts.init(
              this.$refs.dataGraphs3[0].$refs.graph9[0]
            );
            option5.series = this.getSeriesName(data, "类型分布");
            for (let key in data.res) {
              if (data.res[key]["年度统计"].length === 0) {
                option4.series[0].data.push(0);
                option4.series[1].data.push(0);
                option4.series[2].data.push(0);
              } else {
                data.res[key]["年度统计"].map((item) => {
                  option4.series[0].data.push(item.je || 0);
                  option4.series[1].data.push(item.cn || 0);
                  option4.series[2].data.push(item.pjz || 0);
                });
              }
              if (data.res[key]["类型分布"].length === 0) {
                option5.series.map((item) => {
                  item.data.push(0);
                });
              } else {
                data.res[key]["类型分布"].map((item) => {
                  option5.series.map((v) => {
                    if (v.name === item.fmsjlx3) {
                      v.data.push(Number(item.cn) || 0);
                    }
                  });
                });
                // 某一项无数据时填充0
                const lens = option5.series.map((v) => v.data.length);
                const lensMaxSort = lens.sort((a, b) => b - a);
                const maxLen = lensMaxSort[0];
                option5.series.map((v) => {
                  if (v.data.length !== maxLen) {
                    v.data.push(0);
                  }
                });
              }
            }

            this.initGraph(this.myChart8, option4, xAxis);

            sumData2 = new Array(
              (option5.series.length && option5.series[0].data.length) || 0
            ).fill(0);
            option5.series.map((item) => {
              item.data.map((v, index) => {
                sumData2[index] += v;
              });
            });
            option5.series.push({
              name: "",
              type: "bar",
              stack: "y",
              data: sumData2, //为前面对应数据的总和
              z: -1,
              barWidth: "30%",
              label: {
                show: true,
                position: "top",
                color: "#000",
              },
              barGap: "-100%", //与堆叠柱条重合
            });
            console.log("option5", option5);
            this.initGraph(this.myChart9, option5, xAxis);
            break;
          case "涉税违章":
            this.myChart10 = this.$echarts.init(
              this.$refs.dataGraphs4[0].$refs.graph10[0]
            );
            this.myChart11 = this.$echarts.init(
              this.$refs.dataGraphs4[0].$refs.graph11[0]
            );
            // option7.series = this.getSeriesName(data, "违章类型");
            option7.series = data.threeLabel["违章类型"].map((v, index) => {
              return {
                name: v,
                type: "bar",
                stack: "tax",
                barWidth: "30%",
                emphasis: {
                  focus: "series",
                },
                data: [],
                itemStyle: {
                  color: this.lineColor[index],
                },
              };
            });
            for (let key in data.res) {
              if (data.res[key]["年度统计"].length === 0) {
                option6.series[0].data.push(0);
                option6.series[1].data.push(0);
              } else {
                data.res[key]["年度统计"].map((item) => {
                  option6.series[0].data.push(item.cn || 0);
                  option6.series[1].data.push(item.tbzzl || 0);
                });
              }
              if (data.res[key]["违章类型"].length === 0) {
                option7.series.map((item) => {
                  item.data.push(0);
                });
              } else {
                data.res[key]["违章类型"].map((item) => {
                  option7.series.map((v) => {
                    if (v.name === item.fmsjlx3) {
                      v.data.push(item.cn || 0);
                    }
                  });
                });
                // 某一项无数据时填充0
                const lens = option7.series.map((v) => v.data.length);
                const lensMaxSort = lens.sort((a, b) => b - a);
                const maxLen = lensMaxSort[0];
                option7.series.map((v) => {
                  if (v.data.length !== maxLen) {
                    v.data.push(0);
                  }
                });
              }
            }

            this.initGraph(this.myChart10, option6, xAxis);
            this.initGraph(this.myChart11, option7, xAxis);
            break;
          default:
            break;
        }
      } else {
        this.$message.error("查询负面事件失败！");
      }
    },
    async courtSourceQuery() {
      // 司法投诉来源法院TOP10
      const json = {
        corpName: this.paramsObj.corpName,
        firstLabel: "司法事件",
        secondLabel: "法院名称",
      };
      const res = await courtSourceQuery(json);
      if (res.message === "成功" && res.data) {
        const data = res.data;
        const graphData = [];
        const xAxis = [];
        data.map((item) => {
          xAxis.push(item.courtName);
          graphData.push([item.minCount, item.maxCount]);
        });
        this.myChart4 = this.$echarts.init(
          this.$refs.dataGraphs1[0].$refs.graph4[0]
        );
        const option = {
          grid: {
            top: 100,
          },
          angleAxis: {
            type: "category",
            data: xAxis,
          },
          tooltip: {
            show: true,
            formatter: (params) => {
              const id = params.dataIndex;
              return (
                xAxis[id] +
                "<br>最小值：" +
                graphData[id][0] +
                "<br>最大值：" +
                graphData[id][1]
              );
            },
          },
          radiusAxis: {},
          polar: {},
          series: [
            {
              type: "bar",
              itemStyle: {
                color: "transparent",
                // color: color1,
              },
              data: graphData.map((d) => {
                return d[0];
              }),
              coordinateSystem: "polar",
              stack: "Min Max",
              silent: true,
            },
            {
              type: "bar",
              itemStyle: {
                // color: "transparent",
                color: this.lineColor[0],
              },
              data: graphData.map(function (d) {
                if (d[1] - d[0] === 0) {
                  return d[1];
                }
                return d[1] - d[0];
              }),
              coordinateSystem: "polar",
              name: "Range",
              stack: "Min Max",
            },
          ],
        };
        this.initGraph(this.myChart4, option);
      } else {
        this.$message.error("查询法院来源失败！");
      }
    },
    async identityQuery() {
      const json = {
        corpName: this.paramsObj.corpName,
        firstLabel: "司法事件",
        secondLabel: "判决身份",
      };
      const res = await identityQuery(json);
      if (res.message === "成功" && res.data) {
        const data = res.data;
        // const graphData = [
        //   {
        //     value: 0,
        //     name: "原告",
        //   },
        //   {
        //     value: 0,
        //     name: "被告",
        //   },
        //   {
        //     value: 0,
        //     name: "其他",
        //   },
        // ];
        this.myChart5 = this.$echarts.init(
          this.$refs.dataGraphs1[0].$refs.graph5[0]
        );

        const graphData = data.map((item) => {
          return {
            name: item.fmsjlx3,
            value: item.cn,
          };
          // if (item.fmsjlx3 === "原告") {
          //   graphData[0].value = item.cn;
          // } else if (item.fmsjlx3 === "被告") {
          //   graphData[1].value = item.cn;
          // } else {
          //   graphData[2].value += item.cn;
          // }
        });
        const option = {
          tooltip: {
            trigger: "item",
          },
          series: [
            {
              type: "pie",
              radius: [0, 100],
              center: ["50%", "50%"],
              roseType: "radius",
              data: graphData,
              color: this.lineColor,
              animationType: "scale",
              animationEasing: "elasticOut",
              animationDelay: function (idx) {
                return Math.random() * 200;
              },
            },
          ],
        };
        this.initGraph(this.myChart5, option);
      } else {
        this.$message.error("查询判决身份失败！");
      }
    },
    async justiceDetailQuery(type) {
      // 司法案件明细
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      console.log("justiceDetailQuery", this.startStopTime);
      const json = {
        corpName: this.paramsObj.corpName,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        startYear:
          (this.startStopTime.length && this.startStopTime[0].format("YYYY")) ||
          undefined,
        endYear:
          (this.startStopTime.length && this.startStopTime[1].format("YYYY")) ||
          undefined,
        caseType: this.caseValue,
        personType: this.partyValue,
      };
      this.infoQuery = json;
      this.tableLoading = true;
      const res = await justiceDetailQuery(json);
      this.tableLoading = false;
      this.pagination.total = res.data.totalCount;
      const dataList = res.data.dateList;
      const infoData = [];
      dataList.map((item, index) => {
        let infoDetail = {
          index:
            (this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1,
          number: item.ah || "--",
          type: item.ajlbbh || "--",
          courtName: item.fymc || "--",
          name: item.ayzs || "--",
          createDate: item.larq || "--",
          endDate: item.jarq || "--",
          level: item.ssdwmc || "--",
          other: item.ajqtxgr || "--",
        };

        infoData.push(infoDetail);
        const caseOption = {
          label: item.ajlbbh,
          value: item.ajlbbh,
        };
        const partyOption = {
          label: item.dsrlx,
          value: item.dsrlx,
        };
        if (item.ajlbbh) {
          let isExist = false;
          this.caseOptions.map((v) => {
            if (v.label === item.ajlbbh) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.caseOptions.push(caseOption);
          }
        }
        if (item.dsrlx) {
          let isExist = false;
          this.partyOptions.map((v) => {
            if (v.label === item.dsrlx) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.partyOptions.push(partyOption);
          }
        }
      });
      this.infoData = infoData;
    },
    async adminPunDetailQuery(type) {
      // 行政处罚明细
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        corpName: this.paramsObj.corpName,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        startYear:
          (this.startStopTime.length && this.startStopTime[0].format("YYYY")) ||
          undefined,
        endYear:
          (this.startStopTime.length && this.startStopTime[1].format("YYYY")) ||
          undefined,
        punishType: this.punishValue,
      };
      this.infoQuery = json;
      this.tableLoading = true;
      const res = await adminPunDetailQuery(json);
      this.tableLoading = false;
      this.pagination.total = res.data.totalCount;
      const dataList = res.data.dateList;
      const infoData = [];
      dataList.map((item, index) => {
        const infoDetail = {
          index:
            (this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1,
          type: item.punishType || "--",
          year: item.year || "--",
          number: item.punishDocCode || "--",
          action: item.punishActionName || "--",
          office: item.punishOrgan || "--",
          money: item.fine || "--",
          moneyClosed: item.casesClosedFine || "--",
          result: item.penaltyResult || "--",
          fact: item.illegalFact || "--",
          procedure: item.punishProcedure || "--",
        };
        infoData.push(infoDetail);
        if (item.punishType) {
          const punishOption = {
            label: item.punishType,
            value: item.punishType,
          };
          let isExist = false;
          this.punishOptions.map((v) => {
            if (v.label === item.punishType) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.punishOptions.push(punishOption);
          }
        }
      });
      this.infoData = infoData;
      console.log("this.punishOptions", this.punishOptions);
    },
    async discreditBehaviorQuery(type) {
      // 失信行为明细
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        corpName: this.paramsObj.corpName,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        startYear:
          (this.startStopTime.length && this.startStopTime[0].format("YYYY")) ||
          undefined,
        endYear:
          (this.startStopTime.length && this.startStopTime[1].format("YYYY")) ||
          undefined,
        behaviour: this.childTypeValue,
      };
      this.infoQuery = json;
      this.tableLoading = true;
      const res = await discreditBehaviorQuery(json);
      this.tableLoading = false;
      this.pagination.total = res.data.totalCount;
      const dataList = res.data.dateList;
      const infoData = [];
      dataList.map((item, index) => {
        const infoDetail = {
          index:
            (this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1,
          childType: item.sxsjxl || "--",
          year: item.year || "--",
          detail: item.sjms || "--",
          status: item.status || "--",
          type: item.sxlx || "--",
        };
        infoData.push(infoDetail);
        if (item.sxsjxl) {
          const childTypeOption = {
            label: item.sxsjxl,
            value: item.sxsjxl,
          };
          let isExist = false;
          this.childTypeOptions.map((v) => {
            if (v.label === item.sxsjxl) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.childTypeOptions.push(childTypeOption);
          }
        }
      });
      this.infoData = infoData;
    },
    async enforceDetailQuery(type) {
      // 强制执行明细
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        corpName: this.paramsObj.corpName,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        startYear:
          (this.startStopTime.length && this.startStopTime[0].format("YYYY")) ||
          undefined,
        endYear:
          (this.startStopTime.length && this.startStopTime[1].format("YYYY")) ||
          undefined,
      };
      this.infoQuery = json;
      const res = await enforceDetailQuery(json);
      this.tableLoading = false;
      this.pagination.total = res.data.totalCount;
      const dataList = res.data.dateList;
      const infoData = [];
      dataList.map((item, index) => {
        const infoDetail = {
          index:
            (this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1,
          number: item.ah || "--",
          name: item.bzxrmc || "--",
          court: item.zxfy || "--",
          status: item.xxzt || "--",
        };
        infoData.push(infoDetail);
      });
      this.infoData = infoData;
    },
    async seriousFaithQuery(type) {
      // 严重失信名单明细
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        corpName: this.paramsObj.corpName,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        startYear:
          (this.startStopTime.length && this.startStopTime[0].format("YYYY")) ||
          undefined,
        endYear:
          (this.startStopTime.length && this.startStopTime[1].format("YYYY")) ||
          undefined,
        type: this.illegalValue,
        status: this.stateValue,
      };
      this.infoQuery = json;
      this.tableLoading = true;
      const res = await seriousFaithQuery(json);
      this.tableLoading = false;
      this.pagination.total = res.data.totalCount;
      const dataList = res.data.dateList;
      const infoData = [];
      dataList.map((item, index) => {
        const infoDetail = {
          index:
            (this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1,
          reason: item.abnRes || "--",
          type: item.entType || "--",
          status: item.statusCd || "--",
          inTime: item.abnAppTime || "--",
          inName: item.abnOrganName || "--",
          inDate: item.abnDesTime || "--",
          outTime: item.remDesTime || "--",
          inGroup: item.abnAppOrgan || "--",
          outGroup: item.remAppOrgan || "--",
        };
        infoData.push(infoDetail);
        if (item.statusCd) {
          const stateOption = {
            label: item.statusCd,
            value: item.statusCd,
          };
          let isExist = false;
          this.stateOptions.map((v) => {
            if (v.label === item.statusCd) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.stateOptions.push(stateOption);
          }
        }
        if (item.entType) {
          const illegalOption = {
            label: item.entType,
            value: item.entType,
          };
          let isExist = false;
          this.illegalOptions.map((v) => {
            if (v.label === item.entType) {
              isExist = true;
            }
          });
          if (!isExist) {
            this.illegalOptions.push(illegalOption);
          }
        }
      });
      this.infoData = infoData;
    },
    async taxDetailQuery(type) {
      // 涉嫌违法明细接口查询
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      const json = {
        corpName: this.paramsObj.corpName,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        type: this.nameValue,
        startYear:
          (this.startStopTime.length && this.startStopTime[0].format("YYYY")) ||
          undefined,
        endYear:
          (this.startStopTime.length && this.startStopTime[1].format("YYYY")) ||
          undefined,
      };
      this.infoQuery = json;
      this.tableLoading = true;
      const res = await taxDetailQuery(json);
      this.tableLoading = false;
      this.pagination.total = res.data.totalCount;
      const dataList = res.data.dateList;
      const infoData = [];
      dataList.map((item, index) => {
        const infoDetail = {
          index:
            (this.pagination.current - 1) * this.pagination.pageSize +
            index +
            1,
          time: item.cfjlrq || "--",
          name: item.wfwzlxmc || "--",
          method: item.wfsd || "--",
          result: item.cfjd || "--",
        };
        infoData.push(infoDetail);
        const nameOption = {
          label: item.wfwzlxmc,
          value: item.wfwzlxmc,
        };
        let isExist = false;
        this.nameOptions.map((v) => {
          if (v.label === item.wfwzlxmc) {
            isExist = true;
          }
        });
        if (!isExist) {
          this.nameOptions.push(nameOption);
        }
      });
      this.infoData = infoData;
    },
    async negCountQuery() {
      // 负面事件数量趋势分析
      const json = {
        corpName: this.paramsObj.corpName,
      };
      const res = await negCountQuery(json);
      const data = res.data;
      const xAxis = [];
      const graphData = {
        sum: [],
        zzl: [],
      };
      for (let key in data) {
        xAxis.push(key);

        if (data[key].length) {
          graphData.sum.push(data[key][0].cn || 0);
          graphData.zzl.push(data[key][0].tbzzl || 0);
        } else {
          graphData.sum.push(0);
          graphData.zzl.push(0);
        }
      }
      // data.map((item) => {
      //   xAxis.push(item.ndh);
      //   graphData.sum.push(item.cn || 0);
      //   graphData.zzl.push(item.tbzzl || 0);
      // });

      this.myChart2 = this.$echarts.init(this.$refs.dataGraphs.$refs.graph2[0]);
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
          formatter: (params) => {
            let date = "";
            let htmls = params.map((item, index) => {
              date = item.axisValueLabel;
              let value = item.data || 0;
              if (item.seriesName === "同比增长率") {
                value = value + "%";
              }
              return item.marker + item.seriesName + "：" + value;
            });
            return date + "<br>" + htmls.join("<br>");
          },
        },
        legend: {
          top: 15,
        },
        grid: {
          x: 10,
          y: 70,
          x2: 10,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: xAxis,
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            axisTick: {
              // 不展示刻度
              show: false,
            },
          },
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：件",
            minInterval: 1,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
          {
            type: "value",
            minInterval: 1,
            axisLabel: {
              formatter: "{value}%",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            name: "负面事件数量",
            type: "bar",
            barWidth: "30%",
            seriesLayoutBy: "row",
            symbol: "none",
            smooth: true,
            tooltip: {
              valueFormatter: function (value) {
                return value + " 人";
              },
            },
            data: graphData.sum,
            itemStyle: {
              label: {
                show: true,
                position: "top",
              },
              color: this.lineColor[0],
            },
          },
          {
            name: "同比增长率",
            type: "line",
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + " °F";
              },
            },
            data: graphData.zzl,
            lineStyle: {
              color: this.lineColor[1],
            },
            label: {
              position: "top",
              show: true,
              formatter: "{c}%",
            },
          },
        ],
      };
      this.initGraph(this.myChart2, option, xAxis);
    },
    getSeriesName(data, graph) {
      // 获取图例
      let names = [];
      for (let key in data.res) {
        const name = data.res[key][graph].map((item) => item.fmsjlx3);
        names = union(names, name);
      }
      console.log("names", names);
      let series = [];
      names.map((item, index) => {
        const obj = {
          name: item,
          type: "bar",
          stack: "tax",
          barWidth: "30%",
          emphasis: {
            focus: "series",
          },
          data: [],
          itemStyle: {
            color: this.lineColor[index],
          },
        };
        series.push(obj);
      });
      return series;
    },
  },
};
</script>
<style lang="less">
.negative-events {
  .business-table {
    &-item {
      .ant-tabs {
        .ant-tabs-bar {
          border: 0;

          .ant-tabs-nav-wrap {
            .ant-tabs-tab {
              padding: 12px 0;
            }
          }
        }
      }

      .business-options {
        &-item {
          .item-label {
            &.second-type {
              width: 100px;
            }
            &.third-type {
              width: 115px;
            }
            &.fourth-type {
              width: 145px;
            }
          }

          .item-content {
            &.second-type {
              width: calc(100% - 100px);
            }
            &.third-type {
              width: calc(100% - 115px);
            }
            &.fourth-type {
              width: calc(100% - 145px);
            }
          }
        }
      }
    }
  }

  .business-options {
    &-item {
      width: calc((100% - 72px) / 4);
      margin-right: 24px !important;

      &:last-child {
        margin-right: 0 !important;
      }
    }
  }
}
.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5; /* 自定义的行数 */
  overflow: hidden;
}
</style>
