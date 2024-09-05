<template>
  <div class="group-structure">
    <div class="group-structure-graph">
      <div class="graph-filter" :style="graphFilterStyle">
        <div class="graph-filter-radio">
          <span class="graph-filter-radio-title">合并集团财务</span>
          <a-radio-group v-model="radioValue2" @change="onChange2">
            <a-radio :value="1">否</a-radio>
            <a-radio :value="2">是</a-radio>
          </a-radio-group>
        </div>
        <div class="graph-filter-select">
          <span class="content-label">年份筛选：</span>
          <!-- <a-select
            :options="yearOptions"
            class="content-input"
            placeholder="请选择"
            v-model="yearValue"
            @change="doSort"
          /> -->
          <a-date-picker
            v-model="yearValue"
            mode="year"
            format="YYYY"
            :open="yearShow"
            @openChange="openChangeOne"
            @panelChange="panelChangeOne"
          />
        </div>
        <div class="graph-filter-btns">
          <a-button class="graph-filter-btn" @click="handleFilter">
            <icon-svg icon-class="icon_filter" />
            查询
          </a-button>
          <a-button class="graph-filter-btn" type="primary" @click="handleSort">
            <icon-svg icon-class="icon_sort" />
            展示
          </a-button>
        </div>
        <div class="graph-filter-tools">
          <icon-svg icon-class="icon_zoomIn" @click="handleZoomIn" />
          <icon-svg icon-class="icon_zoomOut" @click="handleZoomOut" />
        </div>
      </div>
      <div class="graph-content" ref="graph"></div>
      <div class="graph-bar" @mousedown="onmousedown">
        <img src="@/assets/images/img/flex.svg" alt="" />
      </div>
    </div>
    <a-modal
      class="structure-filter-modal"
      :width="572"
      :visible="structureFilterVisible"
      :destroyOnClose="true"
      @cancel="onFilterCancel"
      okText="查询"
      @ok="doFilter"
      :mask="false"
      :dialogStyle="modalStyle"
      title="查询条件"
    >
      <div class="filter-modal-content">
        <a-radio-group v-model="radioValue" @change="onChange">
          <a-radio :value="1">
            <span class="content-label">企业名称：</span>
            <a-input
              v-model="enterpriseName"
              class="content-input"
              placeholder="请输入"
              :disabled="radioValue !== 1"
            />
          </a-radio>
          <a-radio :value="2">
            <span class="content-label">行业分类：</span>
            <a-select
              :options="industryOptions"
              class="content-input"
              placeholder="请选择"
              v-model="industryValue"
              :disabled="radioValue !== 2"
            />
          </a-radio>
          <a-radio :value="3">
            <span class="content-label">企业类型：</span>
            <a-select
              :options="typeOptions"
              class="content-input"
              placeholder="请选择"
              v-model="entTpeValue"
              :disabled="radioValue !== 3"
            />
          </a-radio>
          <!-- <a-radio :value="4">
            <span class="content-label">金额筛选：</span>
            <a-select
              :options="moneyOptions"
              class="content-input"
              placeholder="请选择"
              v-model="moneyValue"
              :disabled="radioValue !== 4"
            />
          </a-radio> -->
        </a-radio-group>
      </div>
    </a-modal>
    <a-modal
      class="structure-sort-modal"
      :width="572"
      :visible="structureSortVisible"
      :destroyOnClose="true"
      @cancel="onSortCancel"
      okText="查询"
      @ok="doSort"
      :mask="false"
      :dialogStyle="modalStyle"
      title="展示条件"
    >
      <div class="sort-modal-content">
        <div class="sort-modal-content-item">
          <span class="content-label">展示层级：</span>
          <a-select
            :options="levelOptions"
            class="content-input"
            placeholder="请选择"
            v-model="levelValue2"
          />
        </div>
        <div class="sort-modal-content-item">
          <span class="content-label">排序方式：</span>
          <a-select
            :options="conditionOptions"
            class="content-input"
            placeholder="请选择"
            v-model="conditionValue"
            @change="conditionChange"
          />
        </div>
        <div class="sort-modal-content-item">
          <span class="content-label">金额筛选：</span>
          <a-select
            :options="moneyOptions"
            class="content-input"
            placeholder="请选择"
            v-model="moneyValue"
            :disabled="
              conditionValue === 1 || conditionValue === 2 ? true : false
            "
          />
        </div>
        <!-- <div class="sort-modal-content-item">
          <span class="content-label">年份筛选：</span>
          <a-select
            :options="yearOptions"
            class="content-input"
            placeholder="请选择"
            v-model="yearValue"
          />
        </div> -->
      </div>
    </a-modal>
    <div class="group-structure-table">
      <DetailTable
        tableTitle="明细指标数据"
        :foldValue="foldValue"
        :columns="columns"
        :infoData="dataList"
        :pagination="false"
        tableClass="group-table"
        :loading="tableLoading"
        @handleChangebtn="handleChangebtn"
        :infoQuery="infoQuery"
        @onSortChange="onSortChange"
      >
        <!-- :pagination="pagination" -->
        <div slot="searchOption">
          <div class="option-tabs">
            <div
              :class="selected === 1 ? 'option-tab selected' : 'option-tab'"
              @click="changeSelected(1)"
            >
              <div class="option-tab-icon">
                <icon-svg icon-class="icon_global" />
              </div>
              <span class="option-tab-text">全局对比</span>
            </div>
            <div
              :class="selected === 2 ? 'option-tab selected' : 'option-tab'"
              @click="changeSelected(2)"
            >
              <div class="option-tab-icon">
                <icon-svg icon-class="icon_mergeCells" />
              </div>
              <span class="option-tab-text">同级对比</span>
            </div>
            <a-tooltip placement="right">
              <template slot="title">
                <span
                  >全局对比为当前公司除以同一母公司的，同级对比为当前公司除以同一级别所有的</span
                >
              </template>
              <a-icon type="question-circle" class="tips" />
            </a-tooltip>
          </div>
          <div class="options-content">
            <div class="options-content-item">
              <label class="item-label">企业分类:</label>
              <div class="item-content">
                <a-radio-group
                  default-value="0"
                  button-style="solid"
                  v-model="childValue"
                  @change="onRadioChange"
                >
                  <a-radio-button :value="1"> 一级 </a-radio-button>
                  <a-radio-button :value="2"> 二级 </a-radio-button>
                  <a-radio-button :value="3"> 三级 </a-radio-button>
                  <a-radio-button :value="4"> 四级 </a-radio-button>
                  <a-radio-button :value="5"> 五级 </a-radio-button>
                  <a-radio-button :value="6"> 六级 </a-radio-button>
                  <a-radio-button :value="7"> 七级 </a-radio-button>
                </a-radio-group>
              </div>
            </div>
          </div>
          <p class="table-title">
            <!-- 当前集团名称：
            <span class="text-blue">{{ paramsObj.corpName || "" }}</span>
            <br /> -->
            当前年份：
            <!-- <span class="text-blue">{{
              dataList.length ? dataList[0].name : ""
            }}</span> -->
            <span class="text-blue">{{ yearValue || "" }}</span>
            <!-- ，共有
            <span class="text-blue">1248</span>
            家子公司，其中，一级子公司
            <span class="text-blue">20</span>
            家，二级子公司
            <span class="text-blue">120</span>
            家，三级子公司
            <span class="text-blue">1108</span>
            家，四级子公司
            <span class="text-blue">1108</span>
            家，五级子公司
            <span class="text-blue">1108</span>
            家，六级子公司
            <span class="text-blue">1108</span>
            家，七级子公司
            <span class="text-blue">1108</span>
            家。 -->
          </p>
        </div>
      </DetailTable>
    </div>
    <!-- <right-menu
      :show="rightMenuShow"
      @onMenuClick="onMenuClick"
      :contextMenuData="contextMenuData"
    /> -->
  </div>
</template>
<script>
import DetailTable from "../components/detailTable";
import {
  Button,
  Icon,
  Input,
  Radio,
  Tooltip,
  DatePicker,
} from "ant-design-vue";
import G6 from "@antv/g6";
import {
  queryStructure,
  pathQuery,
  domesticPathQuery,
  industryQuery,
  queryStructureDetails,
} from "@/shared/api/auditMode.js";
import { mapState } from "vuex";
import { nanoid } from "nanoid";
import { scrollToBottom } from "@/utils/common.js";

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default {
  name: "GroupStructure",
  data() {
    return {
      typeValue: "1",
      industryValue: undefined,
      industryOptions: [],
      entTpeValue: undefined,
      typeOptions: [
        {
          label: "境内企业",
          value: "境内企业",
        },
        {
          label: "纯境外企业",
          value: "纯境外企业",
        },
      ],
      startStopTime: undefined,
      enterpriseName: undefined,
      levelValue: "0",
      childValue: 3,
      sortValue: "name",
      myChart: null,
      container: null,
      data: undefined,
      contextMenuData: {},
      rightMenuShow: false,
      columns: [
        {
          title: "一级公司",
          dataIndex: "child1",
          key: "child1",
          customRender(_, row) {
            return {
              children: row.child1,
              attrs: {
                rowSpan: row.child1RowSpan,
              },
            };
          },
          width: 120,
        },
        {
          title: "二级公司",
          dataIndex: "child2",
          key: "child2",
          customRender(_, row) {
            return {
              children: row.child2,
              attrs: {
                rowSpan: row.child2RowSpan,
              },
            };
          },
          width: 120,
        },
        {
          title: "三级公司",
          dataIndex: "child3",
          key: "child3",
          customRender(_, row) {
            return {
              children: row.child3,
              attrs: {
                rowSpan: row.child3RowSpan,
              },
            };
          },
          width: 120,
        },
        {
          title: "四级公司",
          dataIndex: "child4",
          key: "child4",
          customRender(_, row) {
            return {
              children: row.child4,
              attrs: {
                rowSpan: row.child4RowSpan,
              },
            };
          },
          width: 120,
        },
        {
          title: "五级公司",
          dataIndex: "child5",
          key: "child5",
          customRender(_, row) {
            return {
              children: row.child5,
              attrs: {
                rowSpan: row.child5RowSpan,
              },
            };
          },
          width: 120,
        },
        {
          title: "六级公司",
          dataIndex: "child6",
          key: "child6",
          customRender(_, row) {
            return {
              children: row.child6,
              attrs: {
                rowSpan: row.child6RowSpan,
              },
            };
          },
          width: 120,
        },
        {
          title: "七级公司",
          dataIndex: "child7",
          key: "child7",
          customRender(_, row) {
            return {
              children: row.child7,
              attrs: {
                rowSpan: row.child7RowSpan,
              },
            };
          },
          width: 120,
        },
        {
          title: "营收总额\n(万元)",
          dataIndex: "totalMoney",
          key: "totalMoney",
          width: 110,
        },
        {
          title: "营收占比\n(本级所有)",
          dataIndex: "moneyProportionAll",
          key: "moneyProportionAll",
          width: 160,
          scopedSlots: { customRender: "moneyProportionAll" },
        },
        {
          title: "营收占比排名\n(本级所有)",
          dataIndex: "moneyProportionAllRanking",
          key: "moneyProportionAllRanking",
          width: 125,
        },
        {
          title: "纳税总额\n(万元)",
          dataIndex: "totalTax",
          key: "totalTax",
          width: 110,
        },
        {
          title: "纳税占比\n(当级所有)",
          dataIndex: "taxProportionAll",
          key: "taxProportionAll",
          width: 160,
          scopedSlots: { customRender: "taxProportionAll" },
        },
        {
          title: "纳税占比排名\n(当级所有)",
          dataIndex: "taxProportionAllRanking",
          key: "taxProportionAllRanking",
          width: 125,
        },
      ],
      dataList: [],
      infoQuery: {},
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
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
        },
      },
      tableLoading: false,
      selected: 1,
      canvasWidth: 0,
      canvasHeight: 800,
      structureFilterVisible: false,
      structureSortVisible: false,
      foldValue: true,
      graphFilterStyle: {
        position: "absolute",
        top: "-56px",
      },
      scrollTop: 0,
      modalStyle: {
        top: "278px",
      },
      levelValue2: undefined,
      levelOptions: [
        // 一级只会对顶级企业进行排序，但顶级企业只有一个，也就失去了排序的意义，和后端商量后，隐藏一级选项
        // {
        //   label: "一级",
        //   value: 1,
        // },
        {
          label: "二级",
          value: 2,
        },
        {
          label: "三级",
          value: 3,
        },
        {
          label: "四级",
          value: 4,
        },
        {
          label: "五级",
          value: 5,
        },
        {
          label: "六级",
          value: 6,
        },
        {
          label: "七级",
          value: 7,
        },
        {
          label: "八级",
          value: 8,
        },
      ],
      conditionValue: undefined,
      conditionOptions: [
        {
          label: "名称",
          value: 1,
        },
        {
          label: "企业规模",
          value: 2,
        },
        {
          label: "收入规模",
          value: 3,
        },
        {
          label: "纳税规模",
          value: 4,
        },
      ],
      moneyValue: undefined,
      moneyOptions: [
        {
          label: "0-1000万元",
          value: "0-1000万元",
        },
        {
          label: "1000-5000万元",
          value: "1000-5000万元",
        },
        {
          label: "5000-10000万元",
          value: "5000-10000万元",
        },
        {
          label: "10000万元以上",
          value: "10000万元以上",
        },
      ],
      graphHeight: 800,
      mouseDownY: 0, // 记录鼠标按下时的y位置
      ismousedown: false, // 是否正在按下鼠标尚未抬起
      radioValue: 1,
      radioValue2: 1,
      yearOptions: [
        {
          label: "2017",
          value: "2017",
        },
        {
          label: "2018",
          value: "2018",
        },
        {
          label: "2019",
          value: "2019",
        },
        {
          label: "2020",
          value: "2020",
        },
        {
          label: "2021",
          value: "2021",
        },
        {
          label: "2022",
          value: "2022",
        },
      ],
      yearValue: "2021",
      yearShow: false,
      highLightList: [], // 保存每次高亮的节点名称
      sortField: undefined,
      sortRule: undefined, //明细排序
    };
  },
  components: {
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
    ARadio: Radio,
    ARadioButton: RadioButton,
    ARadioGroup: RadioGroup,
    ATooltip: Tooltip,
    ADatePicker: DatePicker,
    DetailTable,
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  async mounted() {
    this.queryStructureDetails();
    await this.handleSearch();
    setTimeout(() => {
      window.onresize = () => {
        if (!this.myChart || this.myChart.get("destroyed")) return;
        if (
          !this.container ||
          !this.container.offsetWidth ||
          !this.container.offsetHeight
        )
          return;
        this.myChart.changeSize(
          this.container.offsetWidth,
          this.container.offsetHeight
        );
      };
      document
        .getElementById("audit-mode")
        .addEventListener("scroll", this.handleScroll); // 监听页面滚动
    }, 100);

    this.rowSpan("child1");
    this.rowSpan("child2");
    this.rowSpan("child3");
  },
  beforeDestroy() {
    window.removeEventListener("mouseup", this.removeUp, false);
    window.removeEventListener("mousemove", this.handleMove, false);
    document
      .getElementById("audit-mode")
      .removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    init(type) {
      if (type === "sort") {
        this.myChart.updateChild(this.data);
        this.handleMoveTree(this.myChart);
        return false;
      }
      this.container = this.$refs.graph;
      this.canvasWidth = this.container.offsetWidth;
      this.canvasHeight = this.container.offsetHeight || 800;
      const wrapNum = 24; // 换行的字符数

      if (this.myChart) {
        this.myChart.destroy();
      }

      const ring_grey = require("@/assets/images/img/ring_grey.svg");
      const dot_blue = require("@/assets/images/img/dot_blue.svg");

      G6.registerNode(
        "tree-node",
        {
          drawShape: function drawShape(cfg, group) {
            const rect = group.addShape("rect", {
              attrs: {
                fill: "#fff",
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                radius: 2,
              },
              name: "rect-shape",
            });
            const lineNum = Math.floor(cfg.name.length / wrapNum); // 向下取整
            const restNum = cfg.name.length % wrapNum; // 不满一行的条件下的剩余字符数
            let content = "";
            for (let i = 0; i < lineNum; i++) {
              content +=
                i === lineNum - 1 && restNum === 0
                  ? cfg.name.slice(
                      wrapNum * (i + 1) - wrapNum,
                      wrapNum * (i + 1)
                    )
                  : cfg.name.slice(
                      wrapNum * (i + 1) - wrapNum,
                      wrapNum * (i + 1)
                    ) + "\n";
            }
            content += cfg.name.slice(
              wrapNum * lineNum,
              wrapNum * lineNum + restNum
            );
            const text = group.addShape("text", {
              attrs: {
                text: content,
                textAlign: "left",
                fontSize: 12,
                textBaseline: "middle",
                fill: "rgba(0, 0, 0, 0.85)",
              },
              name: "text-shape",
            });
            const bbox = text.getBBox();
            const hasChildren = cfg.children && cfg.children.length > 0;
            rect.attr({
              x: 0,
              y: -bbox.height / 2 - 7,
              width: bbox.width + (hasChildren ? 32 : 16),
              height: bbox.height + 12,
            });
            text.attr({
              x: 8,
              y: 0,
            });
            if (hasChildren) {
              group.addShape("image", {
                attrs: {
                  x: bbox.width + 16,
                  y: -5,
                  img: cfg.collapsed ? ring_grey : dot_blue,
                  cursor: "pointer",
                },
                name: "collapse-icon",
              });
            }
            return rect;
          },
          update: (cfg, item) => {
            const group = item.getContainer();
            const icon = group.find((e) => e.get("name") === "collapse-icon");
            icon.attr("img", cfg.collapsed ? ring_grey : dot_blue);
          },
        },
        "single-node"
      );

      G6.registerNode(
        "first-node",
        {
          drawShape: function drawShape(cfg, group) {
            const rect = group.addShape("rect", {
              attrs: {
                fill: "#016EFF",
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                radius: 2,
              },
              name: "rect-shape",
            });
            const lineNum = Math.floor(cfg.name.length / wrapNum); // 向下取整
            const restNum = cfg.name.length % wrapNum; // 不满一行的条件下的剩余字符数
            let content = "";
            for (let i = 0; i < lineNum; i++) {
              content +=
                i === lineNum - 1 && restNum === 0
                  ? cfg.name.slice(
                      wrapNum * (i + 1) - wrapNum,
                      wrapNum * (i + 1)
                    )
                  : cfg.name.slice(
                      wrapNum * (i + 1) - wrapNum,
                      wrapNum * (i + 1)
                    ) + "\n";
            }
            content += cfg.name.slice(
              wrapNum * lineNum,
              wrapNum * lineNum + restNum
            );
            const text = group.addShape("text", {
              attrs: {
                text: content,
                textAlign: "left",
                fontSize: 16,
                textBaseline: "middle",
                fill: "#fff",
              },
              name: "text-shape",
            });
            const bbox = text.getBBox();
            rect.attr({
              x: 0,
              y: -bbox.height / 2 - 7,
              width: bbox.width + 24,
              height: bbox.height + 16,
            });
            text.attr({
              x: 12,
              y: 2,
            });
            return rect;
          },
        },
        "single-node"
      );

      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        // itemTypes: ["node", "edge"],
        itemTypes: ["node"],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          const model = e.item.getModel();
          const outDiv = document.createElement("div");
          outDiv.style.width = "fit-content";
          outDiv.style.padding = "0px 2px 8px";
          outDiv.innerHTML = `
            <div>
              <p>${model.name}：</p>
              <p>企业规模: ${model.entSize}</p>
              <p>收入规模: ${model.incomeSize.toLocaleString()}</p>
              <p>纳税规模: ${model.taxSize.toLocaleString()}</p>
            </div>`;
          return outDiv;
        },
      });

      const graph = new G6.TreeGraph({
        container: this.container,
        width: this.canvasWidth,
        height: this.canvasHeight,
        plugins: [tooltip],
        minZoom: 1,
        maxZoom: 2.4,
        animate: true,
        animateCfg: {
          duration: 500, // Number，一次动画的时长
          easing: "linearEasing", // String，动画函数
        },
        modes: {
          default: [
            {
              type: "collapse-expand",
              onChange: function onChange(item, collapsed) {
                const data = item.get("model");
                graph.updateItem(item, {
                  collapsed,
                });
                data.collapsed = collapsed;
                return true;
              },
            },
            "drag-canvas",
          ],
        },
        defaultNode: {
          type: "tree-node",
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
        defaultEdge: {
          type: "cubic-horizontal",
          style: {
            stroke: "#A3B1BF",
          },
        },
        // 节点不同状态下的样式集合
        nodeStateStyles: {
          // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
          hover: {
            "text-shape": {
              fill: "#016EFF",
            },
          },
          // highLight 状态为 true 时的样式
          highLight: {
            stroke: "#016EFF",
            fill: "rgba(204, 226, 255, 0.5)",
            "text-shape": {
              fill: "#016EFF",
            },
          },
        },
        layout: {
          type: "compactBox",
          direction: "LR",
          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 8;
          },
          getHGap: function getHGap() {
            return 180;
          },
        },
      });

      graph.node((node) => {
        if (node.isTop) {
          return {
            id: node.id,
            type: "first-node",
          };
        } else {
          return { ...node };
        }
      });

      graph.data(this.data);
      graph.render();

      // const height = graph.getHeight();

      this.handleMoveTree(graph);

      graph.on("node:mouseenter", (e) => {
        const model = e.item.getModel();
        if (model.id === this.data.id) return; // 不给根节点添加hover样式
        graph.setItemState(e.item, "hover", true);
      });
      graph.on("node:mouseleave", (e) => {
        graph.setItemState(e.item, "hover", false);
      });

      this.myChart = graph;
    },
    handleMoveTree(graph) {
      // 默认将根节点移动到屏幕中间左边
      const item = graph.findById(this.data.id);
      const model = item.getModel();
      const point = graph.getCanvasByPoint(model.x, model.y);

      graph.translate(-point.x, -point.y + this.canvasHeight / 2);
    },
    handleZoomIn() {
      const center = {
        x: this.canvasWidth / 2,
        y: this.canvasHeight / 2,
      };
      this.myChart.zoom(1.25, center);
    },
    handleZoomOut() {
      const center = {
        x: this.canvasWidth / 2,
        y: this.canvasHeight / 2,
      };
      this.myChart.zoom(0.8, center);
    },
    getDataMap(list, arr, position) {
      // list为要处理的数组，arr为结果数组
      list.map((item, index) => {
        arr.push([...position, index]);
        if (item.children && item.children.length) {
          this.getDataMap(item.children, arr, [...position, index]);
        }
      });
      return arr;
    },
    updateOptionData(index) {
      const option = this.myChart.getOption();
      let target = option.series[0].data;
      const dataMap = this.getDataMap(option.series[0].data, [], []);
      const list = dataMap[index - 1];
      const length = list.length;
      list.map((num, index) => {
        if (index < length - 1) {
          target = target[num].children;
        }
      });
      return {
        option,
        target,
        list,
      };
    },
    rowSpan(key) {
      console.log("rowSpan", key);
      let arr = this.dataList
        .reduce((result, item) => {
          if (result.indexOf(item[key]) < 0) {
            result.push(item[key]);
          }
          return result;
        }, [])
        .reduce((result, keys) => {
          const children = this.dataList.filter((item) => item[key] === keys);
          result = result.concat(
            children.map((item, index) => ({
              ...item,
              [`${key}RowSpan`]: index === 0 ? children.length : 0,
            }))
          );
          return result;
        }, []);
      this.dataList = arr;
    },
    changeSelected(key) {
      this.selected = key;
      this.dataList = [];
      this.queryStructureDetails();
    },
    handleFilter() {
      this.structureFilterVisible = true;
      if (this.graphFilterStyle.position === "absolute") {
        this.modalStyle = {
          top: 278 - this.scrollTop + "px",
        };
      } else {
        this.modalStyle = {
          top: "136px",
        };
      }
    },
    async getIndustryOptions() {
      const json = {
        corpName: this.paramsObj.corpName,
        uid: this.data.uid,
      };
      const res = await industryQuery(json);
      if (res.message === "成功") {
        this.industryOptions = res.data.map((v) => {
          return {
            label: v,
            value: v,
          };
        });
      } else {
        this.industryOptions = [];
        this.$message.error(res.message);
      }
      this.industryValue = undefined;
    },
    async doFilter() {
      let res = null;
      if (this.radioValue === 1) {
        // 名称筛选
        if (!this.enterpriseName) {
          this.$message.error("请输入企业名称！");
          return false;
        }
        const json = {
          corpName: this.enterpriseName,
          topName: this.paramsObj.topEnt,
          year: this.yearValue,
        };
        const loading = this.$message.loading("正在筛选", 0);
        res = await pathQuery(json);
        loading();
      } else if (this.radioValue === 2) {
        // 行业筛选
        if (!this.industryValue) {
          this.$message.error("请选择行业分类！");
          return false;
        }
        const json = {
          qylb: this.industryValue,
          corpName: this.paramsObj.corpName,
          topName: this.paramsObj.topEnt,
          year: this.yearValue,
        };
        const loading = this.$message.loading("正在筛选", 0);
        res = await pathQuery(json);
        loading();
      } else {
        // 企业类型筛选
        if (!this.entTpeValue) {
          this.$message.error("请选择企业类型！");
          return false;
        }
        const json = {
          corpName: this.paramsObj.corpName,
          topName: this.paramsObj.topEnt,
          domesticName: this.entTpeValue,
          year: this.yearValue,
        };
        const loading = this.$message.loading("正在筛选", 0);
        res = await domesticPathQuery(json);
        loading();
      }
      if (res.message === "成功") {
        if (res.data && res.data.length) {
          this.setNodeHighLight(res.data);
          this.highLightList = res.data;
          this.handleMoveTree(this.myChart);
          this.$message.success("筛选成功！");
        } else {
          this.$message.error("没有查到相关企业！");
          return false;
        }
      } else {
        this.$message.error(res.message);
        return false;
      }
      this.onFilterCancel();
    },
    setNodeHighLight(list) {
      this.highLightList.map((item) => {
        let targetNode = undefined;
        targetNode = this.myChart.findById(item);
        this.myChart.clearItemStates(targetNode);
      });
      list.map((item) => {
        let targetNode = undefined;
        targetNode = this.myChart.findById(item);
        this.myChart.setItemState(targetNode, "highLight", true);
      });
    },
    onFilterCancel() {
      this.structureFilterVisible = false;
    },
    handleSort() {
      this.structureSortVisible = true;
      if (this.graphFilterStyle.position === "absolute") {
        this.modalStyle = {
          top: 278 - this.scrollTop + "px",
        };
      } else {
        this.modalStyle = {
          top: "136px",
        };
      }
    },
    doSort() {
      if (this.conditionValue && !this.levelValue2) {
        this.$message.error("请选择层级！");
        return false;
      }
      if (this.levelValue2 && !this.conditionValue) {
        this.$message.error("请选择同级筛选条件！");
        return false;
      }

      console.log("moneyValue", this.moneyValue);
      const type =
        !this.levelValue2 && !this.conditionValue ? "search" : "sort";
      // 判断是收入规模还是税收规模
      let conditionalType = undefined;
      if (this.conditionValue === 3) {
        conditionalType = 1;
      } else if (this.conditionValue === 4) {
        conditionalType = 2;
      }
      const moneyMap = {
        "0-1000万元": { leftLimit: 0, rightLimit: 10000000 },
        "1000-5000万元": { leftLimit: 10000000, rightLimit: 50000000 },
        "5000-10000万元": { leftLimit: 50000000, rightLimit: 100000000 },
        "10000万元以上": { leftLimit: 100000000, rightLimit: null },
      };
      const json = {
        corpName: this.paramsObj.corpName,
        level: this.levelValue2,
        sortRule: this.conditionValue,
        year: this.yearValue, // 以名称作为排序条件时不加年份筛选条件
        isSingle: this.radioValue2,
        conditional:
          (this.conditionValue === 3 || this.conditionValue === 4) &&
          this.moneyValue
            ? moneyMap[this.moneyValue]
            : undefined,
        conditionalType,
      };
      this.queryStructure(json, type);
      this.queryStructureDetails();
      // todo 筛选和排序互不干扰
      this.handleMoveTree(this.myChart);
      this.onSortCancel();
    },
    onSortCancel() {
      this.structureSortVisible = false;
    },
    handleScroll(e) {
      this.scrollTop = e.target.scrollTop;
      if (this.scrollTop <= 142) {
        this.graphFilterStyle = {
          position: "absolute",
          top: "-56px",
          right: "24px",
        };
      } else if (this.scrollTop <= this.graphHeight + 142) {
        this.graphFilterStyle = {
          position: "fixed",
          top: "88px",
          right: "53px",
        };
      } else {
        this.graphFilterStyle = {
          display: "none",
        };
      }
    },
    onmousedown(e) {
      this.ismousedown = true;
      this.mouseDownY = e.pageY;
      // 记录此时模型区域的宽度
      this.graphHeight = this.$refs.graph.offsetHeight;
      document.body.onselectstart = () => false; // 防止页面元素出现被选中的蓝色状态，学到了
      window.addEventListener("mousemove", this.handleMove, false);
      window.addEventListener("mouseup", this.removeUp, false);
    },
    handleMove(e) {
      if (this.graphHeight >= 800) {
        const deltaY = e.pageY - this.mouseDownY; // 移动距离
        this.graphHeight += deltaY;
        this.$refs.graph.style.height = this.graphHeight + "px";
        this.mouseDownY = e.pageY;
        this.myChart.changeSize(this.container.offsetWidth, this.graphHeight);
      }
    },
    removeUp(e) {
      document.body.onselectstart = () => true;
      if (this.ismousedown && e.pageY !== this.mouseDownY) {
        this.ismousedown = false;
      }
      window.removeEventListener("mousemove", this.handleMove, false);
    },
    onChange(e) {
      this.radioValue = e.target.value;
      if (e.target.value === 1) {
        this.industryValue = undefined;
        this.entTpeValue = undefined;
      } else if (e.target.value === 2) {
        this.enterpriseName = undefined;
        this.entTpeValue = undefined;
      } else {
        this.industryValue = undefined;
        this.enterpriseName = undefined;
      }
    },
    onChange2(e) {
      this.radioValue2 = e.target.value;
      this.handleSearch();
    },
    async handleSearch() {
      const json = {
        corpName: this.paramsObj.corpName,
        year: this.yearValue,
        isSingle: this.radioValue2,
      };
      await this.queryStructure(json, "search");
    },
    async queryStructure(json, type) {
      const text = type === "search" ? "正在查询" : "正在排序";
      const loading = this.$message.loading(text, 0);
      const res = await queryStructure(json);
      loading();
      if (res.message === "成功") {
        if (res.data) {
          // 保存层级选项
          // const levelOptions = [
          //   {
          //     label: "一级",
          //     value: 1,
          //   },
          //   {
          //     label: "二级",
          //     value: 2,
          //   },
          //   {
          //     label: "三级",
          //     value: 3,
          //   },
          //   {
          //     label: "四级",
          //     value: 4,
          //   },
          //   {
          //     label: "五级",
          //     value: 5,
          //   },
          //   {
          //     label: "六级",
          //     value: 6,
          //   },
          //   {
          //     label: "七级",
          //     value: 7,
          //   },
          //   {
          //     label: "八级",
          //     value: 8,
          //   },
          //   {
          //     label: "九级",
          //     value: 9,
          //   },
          //   {
          //     label: "十级",
          //     value: 10,
          //   },
          //   {
          //     label: "十一级",
          //     value: 11,
          //   },
          //   {
          //     label: "十二级",
          //     value: 12,
          //   },
          //   {
          //     label: "十三级",
          //     value: 13,
          //   },
          //   {
          //     label: "十四级",
          //     value: 14,
          //   },
          //   {
          //     label: "十五级",
          //     value: 15,
          //   },
          //   {
          //     label: "十六级",
          //     value: 16,
          //   },
          //   {
          //     label: "十七级",
          //     value: 17,
          //   },
          //   {
          //     label: "十八级",
          //     value: 18,
          //   },
          //   {
          //     label: "十九级",
          //     value: 19,
          //   },
          //   {
          //     label: "二十级",
          //     value: 20,
          //   },
          // ];
          // this.levelOptions = levelOptions.slice(0, res.data.sumLevel - 1);

          // 渲染架构图
          this.data = this.getGraphData(res.data, 0, 1);
          this.init(type);
          const message = type === "search" ? "查询成功" : "排序完成";
          this.$message.success(message, 2);
          this.getIndustryOptions();
        } else {
          this.$message.error("没有查到相关企业！");
          return false;
        }
      } else {
        this.$message.error(res.message);
        return false;
      }
    },
    getGraphData(data, depth, index) {
      const result = {};
      result.name = depth === 0 ? data.qymc : index + "|" + data.qymc;
      result.id = data.qymc;
      result.isTop = data.qymc === data.djqymc ? true : false;
      result.depth = depth;
      result.uid = data.uid || null;
      result.entSize = data.entScale || 0;
      result.incomeSize = data.incomeScale ? data.incomeScale.toFixed(2) : 0;
      result.taxSize = data.taxScale ? data.taxScale.toFixed(2) : 0;
      result.children = data.childResources.map((item, num) => {
        return this.getGraphData(item, depth + 1, num + 1);
      });
      return result;
    },
    async queryStructureDetails() {
      const _that = this;
      const json = {
        corpName: _that.paramsObj.corpName,
        level: _that.childValue,
        type: _that.selected, // 全局：1，同级：2
        year: _that.yearValue,
        sortField: _that.sortField, //排序字段 1：营收 2纳税
        sortRule: _that.sortRule, //1 正序 2 倒叙
      };
      this.infoQuery = json;
      _that.tableLoading = true;
      const res = await queryStructureDetails(json);
      _that.tableLoading = false;
      let dataList = [];
      if (res.message === "成功" && res.data) {
        const data = [res.data];
        dataList = _that.getDataList(data, [], {}, 1);
      } else if (res.message === "成功" && !res.data) {
        _that.$message.info("暂无明细指标数据信息");
      } else {
        _that.$message.error(res.message);
      }
      _that.dataList = dataList;
      console.log("dataList", dataList);
      if (_that.selected === 1) {
        // 全局
        _that.columns = [
          {
            title: "一级公司",
            dataIndex: "child1",
            key: "child1",
            customRender(_, row) {
              return {
                children: row.child1,
                attrs: {
                  rowSpan: row.child1RowSpan,
                },
              };
            },
            width: 120,
          },
          {
            title: "二级公司",
            dataIndex: "child2",
            key: "child2",
            customRender(_, row) {
              return {
                children: row.child2,
                attrs: {
                  rowSpan: row.child2RowSpan,
                },
              };
            },
            width: 120,
          },
          {
            title: "三级公司",
            dataIndex: "child3",
            key: "child3",
            customRender(_, row) {
              return {
                children: row.child3,
                attrs: {
                  rowSpan: row.child3RowSpan,
                },
              };
            },
            width: 120,
          },
          {
            title: "四级公司",
            dataIndex: "child4",
            key: "child4",
            customRender(_, row) {
              return {
                children: row.child4,
                attrs: {
                  rowSpan: row.child4RowSpan,
                },
              };
            },
            width: 120,
          },
          {
            title: "五级公司",
            dataIndex: "child5",
            key: "child5",
            customRender(_, row) {
              return {
                children: row.child5,
                attrs: {
                  rowSpan: row.child5RowSpan,
                },
              };
            },
            width: 120,
          },
          {
            title: "六级公司",
            dataIndex: "child6",
            key: "child6",
            customRender(_, row) {
              return {
                children: row.child6,
                attrs: {
                  rowSpan: row.child6RowSpan,
                },
              };
            },
            width: 120,
          },
          {
            title: "七级公司",
            dataIndex: "child7",
            key: "child7",
            customRender(_, row) {
              return {
                children: row.child7,
                attrs: {
                  rowSpan: row.child7RowSpan,
                },
              };
            },
            width: 120,
          },
          {
            title: "营收总额\n(万元)",
            dataIndex: "totalMoney",
            key: "totalMoney",
            width: 110,
            sorter: true,
          },
          {
            title: "营收占比\n(当级所有)",
            dataIndex: "moneyProportionAll",
            key: "moneyProportionAll",
            width: 160,
            scopedSlots: { customRender: "moneyProportionAll" },
            sorter: true,
          },
          {
            title: "营收占比排名\n(当级所有)",
            dataIndex: "moneyProportionAllRanking",
            key: "moneyProportionAllRanking",
            width: 125,
            sorter: true,
          },
          {
            title: "纳税总额\n(万元)",
            dataIndex: "totalTax",
            key: "totalTax",
            width: 110,
            sorter: true,
          },
          {
            title: "纳税占比\n(当级所有)",
            dataIndex: "taxProportionAll",
            key: "taxProportionAll",
            width: 160,
            scopedSlots: { customRender: "taxProportionAll" },
            sorter: true,
          },
          {
            title: "纳税占比排名\n(当级所有)",
            dataIndex: "taxProportionAllRanking",
            key: "taxProportionAllRanking",
            width: 125,
            sorter: true,
          },
        ];
        _that.columns.splice(_that.childValue, 7 - _that.childValue);
        for (let i = 0; i < _that.childValue; i++) {
          console.log("childValue", _that.childValue);
          _that.rowSpan(`child${i + 1}`);
        }
      } else {
        const obj = {
          1: "一",
          2: "二",
          3: "三",
          4: "四",
          5: "五",
          6: "六",
          7: "七",
        };
        _that.columns = [
          // {
          //   title: "集团名称",
          //   dataIndex: "name",
          //   key: "name",
          //   width: 300,
          //   customRender(_, row) {
          //     return {
          //       children: row.name,
          //       attrs: {
          //         rowSpan: row.nameRowSpan,
          //       },
          //     };
          //   },
          // },
          {
            title: "一级公司",
            dataIndex: "child1",
            key: "child1",
            customRender(_, row) {
              return {
                children: row.child1,
                attrs: {
                  rowSpan: row.child1RowSpan,
                },
              };
            },
            width: 300,
          },
          {
            title: "营收总额\n(万元)",
            dataIndex: "totalMoney",
            key: "totalMoney",
            width: 150,
            sorter: true,
          },
          {
            title: "营收占比",
            dataIndex: "moneyProportionChild",
            key: "moneyProportionChild",
            width: 200,
            scopedSlots: { customRender: "moneyProportionChild" },
            sorter: true,
          },
          {
            title: "营收占比排名",
            dataIndex: "moneyProportionChildRanking",
            key: "moneyProportionChildRanking",
            width: 160,
            sorter: true,
          },
          {
            title: "纳税总额\n(万元)",
            dataIndex: "totalTax",
            key: "totalTax",
            width: 150,
            sorter: true,
          },
          {
            title: "纳税占比",
            dataIndex: "taxProportionChild",
            key: "taxProportionChild",
            width: 200,
            scopedSlots: { customRender: "taxProportionChild" },
            sorter: true,
          },
          {
            title: "纳税占比排名",
            dataIndex: "taxProportionChildRanking",
            key: "taxProportionChildRanking",
            width: 160,
            sorter: true,
          },
        ];
        if (_that.childValue !== 1) {
          _that.columns.splice(1, 0, {
            title: `${obj[_that.childValue]}级公司`,
            dataIndex: `child${_that.childValue}`,
            key: `child${_that.childValue}`,
            customRender(_, row) {
              return {
                children: row[`child${_that.childValue}`],
                attrs: {
                  rowSpan: row[`child${_that.childValue}RowSpan`],
                },
              };
            },
            width: 300,
          });
          _that.rowSpan(`child${_that.childValue}`);
        }
        _that.rowSpan("child1");
      }
    },
    getDataList(arr, data, lastItem, depth) {
      arr.map((item) => {
        if (this.selected === 1) {
          // 全局
          if (item.child && item.child.length && depth < this.childValue) {
            // if (depth > 1) {
            lastItem[`child${depth}`] = item.corpName;
            // } else {
            //   lastItem.name = item.corpName;
            // }
            data = this.getDataList(item.child, data, lastItem, depth + 1);
          } else {
            console.log("bingo", item);
            // 当前为目标数据
            if (item.details) {
              lastItem = {
                ...lastItem,
                index: nanoid(),
                totalMoney:
                  parseFloat(item.details.yysrY) >= 0
                    ? Number(item.details.yysrY).toLocaleString()
                    : "--",
                moneyProportionAll:
                  parseFloat(item.details.yysrZb) >= 0
                    ? item.details.yysrZb
                    : "--",
                moneyProportionAllRanking: item.details.yysrZbRanking || "--",
                moneyProportionChild:
                  parseFloat(item.details.yysrZb) >= 0
                    ? item.details.yysrZb
                    : "--",
                moneyProportionChildRanking: item.details.yysrZbRanking || "--",
                totalTax:
                  parseFloat(item.details.qysdszeY) >= 0
                    ? Number(item.details.qysdszeY).toFixed(2).toLocaleString()
                    : "--",
                taxProportionAll:
                  parseFloat(item.details.qysdsZb) >= 0
                    ? item.details.qysdsZb
                    : "--",
                taxProportionAllRanking: item.details.qysdsZbRanking || "--",
                taxProportionChild: parseFloat(item.details.qysdsZb)
                  ? item.details.qysdsZb
                  : "--",
                taxProportionChildRanking: item.details.qysdsZbRanking || "--",
              };
            } else {
              lastItem = {
                ...lastItem,
                index: nanoid(),
                totalMoney: "--",
                moneyProportionAll: "--",
                moneyProportionAllRanking: "--",
                moneyProportionChild: "--",
                moneyProportionChildRanking: "--",
                totalTax: "--",
                taxProportionAll: "--",
                taxProportionAllRanking: "--",
                taxProportionChild: "--",
                taxProportionChildRanking: "--",
              };
            }
            console.log("item.corpName", item.corpName);
            lastItem[`child${depth}`] = item.corpName;
            console.log("lastItem", lastItem);
            data.push(lastItem);
            console.log("data", data);
          }
        } else {
          // 同级
          // if (depth === this.childValue) {
          //   // 当前为目标数据
          //   if (item.details) {
          //     lastItem = {
          //       ...lastItem,
          //       index: nanoid(),
          //       totalMoney: item.details.yysrY
          //         ? Number(item.details.yysrY).toFixed(2).toLocaleString()
          //         : "--",
          //       moneyProportionAll: item.details.yysrZb || "--",
          //       moneyProportionAllRanking: item.details.qysdsZbRanking || "--",
          //       moneyProportionChild: item.details.yysrZb || "--",
          //       moneyProportionChildRanking:
          //         item.details.qysdsZbRanking || "--",
          //       totalTax: item.details.qysdszeY
          //         ? Number(item.details.qysdszeY).toFixed(2).toLocaleString()
          //         : "--",
          //       taxProportionAll: item.details.qysdsZb || "--",
          //       taxProportionAllRanking: item.details.qysdsZbRanking || "--",
          //       taxProportionChild: item.details.qysdsZb || "--",
          //       taxProportionChildRanking: item.details.qysdsZbRanking || "--",
          //     };
          //     lastItem[`child${depth}`] = item.corpName;
          //     data.push(lastItem);
          //   } else {
          //     lastItem = {
          //       ...lastItem,
          //       index: nanoid(),
          //       totalMoney: "--",
          //       moneyProportionAll: "--",
          //       moneyProportionAllRanking: "--",
          //       moneyProportionChild: "--",
          //       moneyProportionChildRanking: "--",
          //       totalTax: "--",
          //       taxProportionAll: "--",
          //       taxProportionAllRanking: "--",
          //       taxProportionChild: "--",
          //       taxProportionChildRanking: "--",
          //     };
          //     lastItem[`child${depth}`] = item.corpName;
          //     data.push(lastItem);
          //   }
          // } else if (item.child && item.child.length) {
          //   // if (depth > 0) {
          //   lastItem[`child${depth}`] = item.corpName;
          //   // } else {
          //   //   lastItem.name = item.corpName;
          //   // }
          //   data = this.getDataList(item.child, data, lastItem, depth + 1);
          // }
          if (item.child) {
            //一级以后
            const child1 = item.corpName;
            item.child.map((v) => {
              if (v.details) {
                lastItem = {
                  child1,
                  index: nanoid(),
                  totalMoney:
                    parseFloat(v.details.yysrY) >= 0
                      ? Number(v.details.yysrY).toLocaleString()
                      : "--",
                  moneyProportionAll:
                    parseFloat(v.details.yysrZb) >= 0 ? v.details.yysrZb : "--",
                  moneyProportionAllRanking: v.details.yysrZbRanking || "--",
                  moneyProportionChild:
                    parseFloat(v.details.yysrZb) >= 0 ? v.details.yysrZb : "--",
                  moneyProportionChildRanking: v.details.yysrZbRanking || "--",
                  totalTax:
                    parseFloat(v.details.qysdszeY) >= 0
                      ? Number(v.details.qysdszeY).toFixed(2).toLocaleString()
                      : "--",
                  taxProportionAll:
                    parseFloat(v.details.qysdsZb) >= 0
                      ? v.details.qysdsZb
                      : "--",
                  taxProportionAllRanking: v.details.qysdsZbRanking || "--",
                  taxProportionChild: parseFloat(v.details.qysdsZb)
                    ? v.details.qysdsZb
                    : "--",
                  taxProportionChildRanking: v.details.qysdsZbRanking || "--",
                };
              } else {
                lastItem = {
                  child1,
                  index: nanoid(),
                  totalMoney: "--",
                  moneyProportionAll: "--",
                  moneyProportionAllRanking: "--",
                  moneyProportionChild: "--",
                  moneyProportionChildRanking: "--",
                  totalTax: "--",
                  taxProportionAll: "--",
                  taxProportionAllRanking: "--",
                  taxProportionChild: "--",
                  taxProportionChildRanking: "--",
                };
              }

              lastItem[`child${this.childValue}`] = v.corpName;
              data.push(lastItem);
            });
          } else {
            //一级
            data = [
              {
                child1: item.corpName,
                index: nanoid(),
                totalMoney:
                  parseFloat(item.details.yysrY) >= 0
                    ? Number(item.details.yysrY).toLocaleString()
                    : "--",
                moneyProportionAll:
                  parseFloat(item.details.yysrZb) >= 0
                    ? item.details.yysrZb
                    : "--",
                moneyProportionAllRanking: item.details.yysrZbRanking || "--",
                moneyProportionChild:
                  parseFloat(item.details.yysrZb) >= 0
                    ? item.details.yysrZb
                    : "--",
                moneyProportionChildRanking: item.details.yysrZbRanking || "--",
                totalTax:
                  parseFloat(item.details.qysdszeY) >= 0
                    ? Number(item.details.qysdszeY).toFixed(2).toLocaleString()
                    : "--",
                taxProportionAll:
                  parseFloat(item.details.qysdsZb) >= 0
                    ? item.details.qysdsZb
                    : "--",
                taxProportionAllRanking: item.details.qysdsZbRanking || "--",
                taxProportionChild: parseFloat(item.details.qysdsZb)
                  ? item.details.qysdsZb
                  : "--",
                taxProportionChildRanking: item.details.qysdsZbRanking || "--",
              },
            ];
          }
          console.log("dataTJ", data);
        }
      });
      return data;
    },
    handleChangebtn() {
      this.foldValue = !this.foldValue;
      if (this.foldValue) {
        setTimeout(() => {
          scrollToBottom(this, "audit-mode", 20);
        }, 300);
      }
    },
    onRadioChange(e) {
      this.childValue = e.target.value;
      this.queryStructureDetails();
    },
    conditionChange() {
      if (this.conditionValue === 1 || this.conditionValue === 2) {
        this.moneyValue = undefined;
      }
    },
    onSortChange(sorter) {
      console.log("onSortChange");
      console.log("sorter!!", sorter);

      if (sorter.order) {
        this.sortRule = sorter.order === "ascend" ? 2 : 1;
        this.sortField =
          sorter.field === "totalMoney" ||
          sorter.field === "moneyProportion" ||
          sorter.field === "moneyProportionAllRanking" ||
          sorter.field === "moneyProportionChild" ||
          sorter.field === "moneyProportionChildRanking"
            ? 1
            : 2;
      } else {
        this.sortRule = undefined;
        this.sortField = undefined;
      }

      this.queryStructureDetails();
    },
    // 弹出日历和关闭日历的回调
    openChangeOne(status) {
      if (status) {
        this.yearShow = true;
      }
    },
    // 得到年份选择器的值
    panelChangeOne(value) {
      console.log("value", value.format("YYYY"));
      this.yearValue = value.format("YYYY");
      this.yearShow = false;
      this.doSort();
    },
  },
};
</script>
<style lang="less">
.g6-component-tooltip {
  padding: 12px 24px 2px 10px !important;
}
.group-structure {
  &-options,
  &-graph,
  &-table {
    background: #fff;
    position: relative;
    padding: 0 24px 56px;

    &:not(:last-child) {
      margin-bottom: 24px;
    }

    &-item {
      transition: all 0.3s;
    }

    .options-content {
      margin-bottom: 24px;

      &-item {
        overflow: hidden;

        .item-label {
          width: 65px;
          text-align: right;
          margin-right: 16px;
          color: @primaryTextColor;
          float: left;
          line-height: 24px;

          &.disabled {
            color: @disabledColor;
          }
        }

        .item-content {
          width: calc(100% - 81px);
          float: left;

          .ant-radio-group {
            .ant-radio-button-wrapper {
              color: @primaryTextColor;
              border: 1px solid @borderColor;
              border-radius: 16px;
              margin-right: 16px;
              padding: 0 14px;
              margin-bottom: 16px;
              height: 24px;
              line-height: 22px;

              &.ant-radio-button-wrapper-checked {
                color: @activeFontColor;
                border-color: @blue;
                background: rgba(1, 110, 255, 0.1);
              }

              &:not(:first-child)::before {
                content: none;
              }

              &.ant-radio-button-wrapper-disabled {
                color: @disabledColor;
                border-color: #d9d9d9;
                background-color: #f5f5f5;
              }
            }
          }

          &-input {
            width: 300px;
            margin-bottom: 16px;
          }
        }
      }
    }

    .options-btns {
      position: absolute;
      right: 16px;

      .button-left {
        margin-right: 24px;
      }
    }
  }

  &-graph {
    padding: 0 24px;

    .graph-filter {
      width: 600px;
      top: -56px;
      right: 24px;
      display: flex;
      flex-wrap: wrap;
      position: absolute;
      align-items: center;
      justify-content: flex-end;

      &-radio {
        display: flex;
        align-items: center;
        width: 210px;
        height: 32px;
        line-height: 32px;
        margin-bottom: 16px;

        &-title {
          width: 100px;
        }

        .ant-radio-group {
          display: flex;
        }
      }

      &-btns {
        display: flex;

        .graph-filter-btn {
          width: 88px;
          display: flex;
          align-items: center;

          .svg-icon {
            width: 16px;
            height: 16px;
            margin-right: 10px;
          }

          span {
            font-size: 16px;
          }

          &:not(.ant-btn-primary) {
            &:hover {
              color: @activeFontColor;

              span {
                color: @activeFontColor;
              }
            }
            span {
              color: @primaryTextColor;
            }
          }

          &:not(:last-child) {
            margin-right: 10px;
          }
        }
      }

      &-select {
        display: flex;
        margin-bottom: 16px;

        .ant-select {
          width: 100px;
          margin-right: 18px;
        }

        .content-label {
          line-height: 32px;
        }
      }

      &-tools {
        .svg-icon {
          width: 16px;
          height: 16px;
          color: @blue;
          cursor: pointer;
          margin-left: 24px;
        }
      }
    }

    .graph-content {
      width: 100%;
      display: flex;
      min-height: 800px;
    }
    .graph-bar {
      width: 100%;
      height: 12px;
      display: flex;
      margin-top: 6px;
      user-select: none;
      cursor: ns-resize;
      position: relative;
      justify-content: center;
      background-color: @borderColor;

      img {
        top: 50%;
        position: absolute;
        transform: translateY(-50%);
      }
    }
  }

  .context-Menu {
    position: fixed;
    min-width: 170px;
    max-width: 400px;
    box-shadow: 0 2px 8px @borderColor;
    color: #485378;
    background-color: #fff;
    border-radius: 2px;

    .ant-menu-vertical {
      padding: 10px 0;
      color: #485378;

      .ant-menu-item,
      .ant-menu-submenu {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        margin: 0;

        &-title {
          height: 30px;
          line-height: 30px;
        }

        &:hover,
        &-title:hover {
          background-color: #e5f3ff;
          color: #485378;
        }
      }

      .with-description {
        height: 50px;

        .menu-item-description {
          color: #afb0b3;
        }
      }

      .item-divider {
        display: flex;
        align-items: center;
        padding: 0;
        height: 15px;
        line-height: 15px;

        &:hover {
          cursor: auto;
        }
      }

      .horizontal-separator-line {
        height: 1px;
        margin: 12px 0;
        padding: 0;
        width: 100%;
        background-color: #e8edf9;
      }
    }

    .ant-menu-submenu {
      .ant-menu-sub {
        padding: 10px 7px;
      }

      .ant-menu-item {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        margin: 0;

        &:hover {
          background-color: #e5f3ff;
          color: #485378;
        }
      }

      .with-description {
        height: 50px;

        .menu-item-description {
          color: #afb0b3;
        }
      }
    }
  }

  &-table {
    padding: 24px;

    .options-content {
      margin-bottom: 0;
    }

    .table-title {
      color: #8c8c8c;
      margin-bottom: 16px;

      .text-blue {
        color: @activeFontColor;
      }
    }

    .group-table {
      .ant-table-thead {
        .ant-table-row-cell-break-word {
          &:nth-last-child(1),
          &:nth-last-child(2),
          &:nth-last-child(3),
          &:nth-last-child(4),
          &:nth-last-child(5),
          &:nth-last-child(6) {
            background-color: #d1f4fc !important;
          }
        }
      }

      .ant-table-header-column {
        .ant-table-column-title {
          word-break: break-word;
          white-space: pre;
          text-align: center;
        }
      }

      .ant-table-row-cell-break-word {
        .money-slot,
        .tax-slot {
          display: flex;

          &-text {
            width: 70px;
          }

          .ant-progress {
            width: calc(100% - 70px);
          }
        }
      }
    }
  }

  .business-table-save {
    top: 144px;
    right: 0;
  }
}

.structure-filter-modal,
.structure-sort-modal {
  .ant-modal {
    padding: 0;
    right: 53px;
    top: 278px;
    position: absolute;
  }

  .sort-modal-content,
  .filter-modal-content {
    &-item {
      display: flex;
      align-items: center;
      justify-content: center;

      &:not(:last-child) {
        margin-bottom: 16px;
      }

      .content-label {
        width: 75px;
      }

      .content-input {
        width: 320px;
      }
    }

    .ant-radio-group {
      display: flex;
      flex-wrap: wrap;
      padding: 0 55px;

      .ant-radio-wrapper {
        width: 100%;
        margin-right: 0;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .content-input {
          width: calc(100% - 94px);
        }
      }
    }
  }
}
</style>
