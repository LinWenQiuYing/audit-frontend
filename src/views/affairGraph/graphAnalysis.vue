<template>
  <div class="graph-app">
    <top-tool-bar
      v-if="graphReady"
      ref="topToolBar"
      @isCloseGraphMenu="isCloseGraphMenu"
      @isCloseGraphDetail="isCloseGraphDetail"
      @canvasLoadingChanged="canvasLoadingChanged"
    />
    <div class="graph-app-content" id="graph-app-content">
      <div class="drawing-canvas-wrapper">
        <a-spin
          :spinning="canvasLoading.loading"
          class="graph-canvas-loading"
          size="large"
          :tip="canvasLoading.tip"
        />
        <div id="graphCanvas" class="graph-app-canvas" />
        <!-- {canvasLoading && <BottomToolBar />} -->
      </div>
    </div>
    <graph-detail
      v-if="graphReady"
      ref="graphDetail"
      :graphNodes="graphNodes"
      :canvasLoading="canvasLoading"
      :selectedNodes="selectedNodes"
      :selectedEdges="selectedEdges"
    />
    <graph-hover-buttons
      :selectedNodes="selectedNodes"
      :entitySearchOption="entitySearchOption"
      @isShowSiftEdgeChanged="isShowSiftEdgeChanged"
      @isShowGroupFoundChanged="isShowGroupFoundChanged"
      @isShowRiskCheckChanged="isShowRiskCheckChanged"
      @isShowSceneSearchChanged="isShowSceneSearchChanged"
    />
    <graph-change-button
      v-if="userRights.btn_graphChange"
      @changeGraph="changeGraph"
    />
    <graph-context-menu
      v-if="graphReady"
      ref="graphContextMenu"
      :graphNodes="graphNodes"
      :searchNodeAll="searchNodeAll"
      :searchEdgeAll="searchEdgeAll"
      @graphNodesChanged="graphNodesChanged"
      @isCxtClickChanged="isCxtClickChanged"
      @selectedElesChanged="selectedElesChanged"
      @canvasLoadingChanged="canvasLoadingChanged"
    />
    <graph-filter-edges
      ref="graphFilterEdges"
      :graphNodes="graphNodes"
      :showSiftEdge="showSiftEdge"
      :searchNodeAll="searchNodeAll"
      :searchEdgeAll="searchEdgeAll"
      @canvasLoadingChanged="canvasLoadingChanged"
      @isShowSiftEdgeChanged="isShowSiftEdgeChanged"
      @isHappenSiftEdgeChanged="isHappenSiftEdgeChanged"
    />
    <group-found
      ref="groupFound"
      :graphNodes="graphNodes"
      :searchNodeAll="searchNodeAll"
      :showGroupFound="showGroupFound"
      :entitySearchAllOption="entitySearchAllOption"
      @isShowGroupFoundChanged="isShowGroupFoundChanged"
      @isHappenGroupFoundChanged="isHappenGroupFoundChanged"
    />
    <risk-check-modal
      v-if="graphReady && selectedNodes.length"
      :graphNodes="graphNodes"
      :showRiskCheck="showRiskCheck"
      :selectedNodes="selectedNodes"
      @isShowRiskCheckChanged="isShowRiskCheckChanged"
      @graphNodesChanged="graphNodesChanged"
      @selectedElesChanged="selectedElesChanged"
      @canvasLoadingChanged="canvasLoadingChanged"
    />
    <scene-search-modal
      v-if="graphReady && entitySearchOption.length"
      :graphNodes="graphNodes"
      :searchNodeAll="searchNodeAll"
      :savedSentenceData="savedSentenceData"
      :savedEntityData="savedEntityData"
      :showSceneSearch="showSceneSearch"
      :entitySearchOption="entitySearchOption"
      @graphNodesChanged="graphNodesChanged"
      @selectedElesChanged="selectedElesChanged"
      @canvasLoadingChanged="canvasLoadingChanged"
      @savedSentenceDataChanged="savedSentenceDataChanged"
      @savedEntityDataChanged="savedEntityDataChanged"
      @isShowSceneSearchChanged="isShowSceneSearchChanged"
    />
  </div>
</template>
<script>
import Vue from "vue";
import KGraph from "@sophon/kgraph";
import GraphChangeButton from "./components/graphButtons/graphChangeButton";
import GraphContextMenu from "./components/graphTools/graphContextMenu";
import GraphDetail from "./components/graphTools/graphDetail";
import GraphFilterEdges from "./components/graphTools/graphFilterEdges";
import GraphHoverButtons from "./components/graphButtons/graphHoverButtons";
import GroupFound from "./components/graphTools/groupFound";
import RiskCheckModal from "./components/graphMenus/riskCheckModal";
import SceneSearchModal from "./components/graphMenus/sceneSearchModal";
import TopToolBar from "./components/graphTools/topToolbar";
import moment from "moment";
import { Spin } from "ant-design-vue";
import {
  checkThreshold,
  CONTAINER_ID,
  CYTON_MAX_ZOOM,
  CYTON_MIN_ZOOM,
} from "@/utils/graph.js";
import {
  searchEntitiesFake,
  getNeighbors,
  checkSavedSentence,
  checkSavedEntity,
} from "@/shared/api/graph.js";
import { queryGraphList, getGraphMeta } from "@/shared/api/configManage.js";
import { mapState, mapMutations } from "vuex";

export default {
  name: "GraphAnalysis",
  data() {
    return {
      graphNodes: [], // 不包含社群节点，原则上只增不减--为了保证删除有了redu、undo后的删除逻辑所受影响最小，所以只做取并集操作
      graphedges: [],
      selectedNodes: [],
      selectedEdges: [],
      savedSentenceData: [],
      savedEntityData: [],
      graphReady: false,
      isCxtClick: false,
      showRiskCheck: false,
      showSiftEdge: false,
      showGroupFound: false,
      showSceneSearch: false,
      isHappenSiftEdge: false, // 是否已经进行了子图筛选
      isHappenGroupFound: false, // 是否已经进行了社群发现
      searchNodeAll: [], // 添加关联实体时的节点类型选项
      searchEdgeAll: [], // 添加关联实体时的边类型选项
      entitySearchOption: [], // 场景查询中单个规则选项
      entitySearchAllOption: [], // 社群发现中的分组选项
      canvasLoading: { loading: false, tip: "正在布局..." },
    };
  },
  computed: {
    ...mapState("graphOptions", [
      "firstNode",
      "searchVertex",
      "branchId",
      "graphId",
      "searchNames",
    ]),
    ...mapState("rightsOptions", ["userRights"]),
  },
  watch: {
    $route(to) {
      if (to.name === "affairGraphAnalysis" && to.params.nodeData) {
        this.$graph.datas.clear();
        const nodeData = to.params.nodeData;
        const pathData = to.params.pathData;
        this.createGraph(nodeData, pathData);
      }
    },
  },
  async mounted() {
    const graph = new KGraph({
      containerId: CONTAINER_ID,
      initData: [],
      layout: "breadthfirst",
      maxZoom: CYTON_MAX_ZOOM,
      minZoom: CYTON_MIN_ZOOM,
    });
    Vue.prototype.$graph = graph;
    // 判断是否有branchid，如果没有则获取
    if (!this.branchId || !this.graphId) {
      await this.getGraphList();
    }
    // 修复searchVertex与firstNode获取不及时，导致页面无法展示的问题
    const searchVertex = JSON.parse(sessionStorage.getItem("searchVertex"));
    const firstNode = JSON.parse(sessionStorage.getItem("firstNode"));
    this.setSearchVertex(searchVertex);
    this.setFirstNode(firstNode);
    const nodeData = this.$route.params.nodeData;
    const pathData = this.$route.params.pathData;
    this.createGraph(nodeData, pathData);
    this.fetchSavedSentence();
  },
  beforeDestroy() {
    this.$graph.events.dispose();
    this.setSearchVertex([]);
    this.setFirstNode({});
    this.$graph = null;
  },
  components: {
    ASpin: Spin,
    GraphChangeButton,
    GraphContextMenu,
    GraphDetail,
    GraphFilterEdges,
    GraphHoverButtons,
    GroupFound,
    RiskCheckModal,
    SceneSearchModal,
    TopToolBar,
  },
  methods: {
    ...mapMutations("graphOptions", {
      setSearchVertex: "setSearchVertex",
      setFirstNode: "setFirstNode",
      setBranchId: "setBranchId",
      setGraphId: "setGraphId",
    }),
    createGraph(nodeData, pathData) {
      if (nodeData && pathData && !pathData.vertices.length) {
        // 只有单独的点，则以该点进行查询
        this.setSearchVertex([nodeData]);
        sessionStorage.setItem("searchVertex", JSON.stringify([nodeData]));
        this.fetchNeighbors();
      } else if (pathData && pathData.vertices.length) {
        // 点边信息都有，直接展示
        this.fetchBranch();
        const nodeId = nodeData && nodeData.id ? nodeData.id : "";
        const graphData = pathData;
        const resultEdges = graphData.edges;
        const resultVertices = graphData.vertices;
        const elements = [...resultEdges, ...resultVertices];
        const data = {
          replace: false,
          elements,
          referenceNodes: [resultVertices],
          anchorNodeIds: nodeId === "" ? [nodeId] : [],
          type: "NEIGHBOR",
        };
        const targetNode = resultVertices.filter((vertex) => {
          if (vertex.id === nodeId) {
            return vertex;
          }
        });
        if (!targetNode.length) {
          this.setSearchVertex([elements[0]]);
          sessionStorage.setItem("searchVertex", JSON.stringify([elements[0]]));
        } else {
          this.setSearchVertex([targetNode[0]]);
          sessionStorage.setItem(
            "searchVertex",
            JSON.stringify([targetNode[0]])
          );
        }

        if (nodeId !== "") {
          this.setFirstNode(nodeData);
          sessionStorage.setItem("firstNode", JSON.stringify(nodeData));
        }

        const { nodes, edges } = checkThreshold(data, this.$graph, "1");
        // 找到初始节点，并标识出来
        nodes.map((item) => {
          if (item.data.id === this.firstNode.id) {
            const label = this.firstNode.label;
            switch (label) {
              case "个人":
                item.data.backgroundImage[0] = require("@/assets/images/img/first_person.png");
                item.data.backgroundWidth = [112, 50];
                item.data.backgroundHeight = [106, 50];
                break;
              case "贷款下发机构":
                item.data.backgroundImage[0] = require("@/assets/images/img/first_bank.png");
                item.data.backgroundWidth = [126, 50];
                item.data.backgroundHeight = [120, 50];
                break;
              case "账户":
                item.data.backgroundImage[0] = require("@/assets/images/img/first_account.png");
                item.data.backgroundWidth = [128, 50];
                item.data.backgroundHeight = [98, 50];
                break;
              default:
                item.data.backgroundImage[0] = require("@/assets/images/img/first_enterprise.png");
                item.data.backgroundWidth = [110, 50];
                item.data.backgroundHeight = [136, 50];
                break;
            }
            item.data.height = 240;
            item.data.width = 240;
          } else {
            item.data.height = 150;
            item.data.width = 150;
            item.data.backgroundWidth = [90, 32];
            item.data.backgroundHeight = [90, 32];
          }
        });

        // 设置文本宽度，超过则换行
        this.$graph.cy
          .style()
          .selector(".default-node:selected")
          .css({
            "border-color": "#CFF0FF",
            color: "#016eff",
            "background-color": "#fff",
          })
          .selector("edge:selected")
          .css({
            color: "#016eff",
          })
          .update();

        nodes.forEach((node) => {
          this.$graph.datas.addNode(node);
        });
        edges.forEach((edge) => {
          this.$graph.datas.addEdge(edge);
        });
        this.graphNodes = nodes.map((node) => node.data);
        this.graphReady = true;
        setTimeout(() => {
          this.$graph.events.changeLayout("breadthfirst");
          this.$refs.topToolBar.initLayoutKey();
          this.$refs.topToolBar.handleFit();
        }, 200);
        this.canvasLoading = { loading: false, tip: "布局完成" };

        // 添加快照进历史，方便redo、undo
        this.$graph.events.history.pushSnapshot(this.$graph.cy.json());
      } else if (!nodeData && !pathData) {
        // 点边信息都没有，根据searchVertex进行查询
        this.fetchNeighbors();
      }
    },
    graphNodesChanged(nodes) {
      this.graphNodes = nodes;
    },
    selectedElesChanged(nodes, edges) {
      this.selectedNodes = nodes;
      this.selectedEdges = edges;
      if (!this.isCxtClick) {
        if (nodes.length) {
          this.isCloseGraphDetail(false);
        } else if (edges.length) {
          this.isCloseGraphDetail(false);
        }
      } else {
        this.isCloseGraphDetail(true);
      }
    },
    canvasLoadingChanged(value) {
      this.canvasLoading = value;
    },
    async fetchNeighbors() {
      this.canvasLoading = { loading: true, tip: "正在布局..." };
      if (!this.searchVertex) {
        const json = {
          branchId: this.graphId,
          types: "findVertex",
          names: this.searchNames,
          isFuzzy: true,
          limit: 100,
          isFilterNote: false,
        };
        const res = await searchEntitiesFake(json);
        const vertex = res.data;
        if ((vertex && !vertex.length) || !vertex) {
          this.canvasLoading = { loading: false, tip: "布局完成" };
          this.$message.error("暂未查询到相应节点，请切换图谱", 3);
          return false;
        }
        if (vertex) {
          this.setFirstNode(vertex[0]);
          sessionStorage.setItem("firstNode", JSON.stringify(vertex[0]));
          this.setSearchVertex(vertex);
          sessionStorage.setItem("searchVertex", JSON.stringify(vertex));
        }
      }
      if (this.searchVertex) {
        const vertexIDs = this.searchVertex.map((v) => v.id);
        const json = {
          branchId: this.graphId,
          commonOnly: false,
          direction: "both",
          edgesFieldsLimitMap: {},
          layers: 1,
          nodeTypes: [],
          types: "findNeighbor",
          vertexIDs,
        };
        try {
          const neighborsData = await getNeighbors(json);
          if (!neighborsData) {
            this.$message.error("查询点边信息失败，请切换图谱", 3);
            return false;
          } else {
            // 查询图谱schema信息
            this.fetchBranch();
          }
          neighborsData.vertices.map((item) => {
            return (item.parent = this.firstNode);
          });
          let elements = [
            ...neighborsData.edges,
            ...neighborsData.vertices,
            ...this.searchVertex,
          ];
          const data = {
            replace: false,
            elements,
            referenceNodes: [...neighborsData.vertices, ...this.searchVertex],
            anchorNodeIds: json.vertexIDs,
            type: "NEIGHBOR",
          };

          const { nodes, edges } = checkThreshold(data, this.$graph, "1");
          // 找到初始节点，并标识出来
          nodes.map((item) => {
            if (item.data.id === this.firstNode.id) {
              const label = this.firstNode.label;
              switch (label) {
                case "个人":
                  item.data.backgroundImage[0] = require("@/assets/images/img/first_person.png");
                  item.data.backgroundWidth = [112, 50];
                  item.data.backgroundHeight = [106, 50];
                  break;
                case "贷款下发机构":
                  item.data.backgroundImage[0] = require("@/assets/images/img/first_bank.png");
                  item.data.backgroundWidth = [126, 50];
                  item.data.backgroundHeight = [120, 50];
                  break;
                case "账户":
                  item.data.backgroundImage[0] = require("@/assets/images/img/first_account.png");
                  item.data.backgroundWidth = [128, 50];
                  item.data.backgroundHeight = [98, 50];
                  break;
                default:
                  item.data.backgroundImage[0] = require("@/assets/images/img/first_enterprise.png");
                  item.data.backgroundWidth = [110, 50];
                  item.data.backgroundHeight = [136, 50];
                  break;
              }
              item.data.height = 240;
              item.data.width = 240;
            } else {
              item.data.height = 150;
              item.data.width = 150;
              item.data.backgroundWidth = [90, 32];
              item.data.backgroundHeight = [90, 32];
            }
          });

          // 设置文本宽度，超过则换行
          this.$graph.cy
            .style()
            .selector(".default-node:selected")
            .css({
              "border-color": "#CFF0FF",
              color: "#016eff",
              "background-color": "#fff",
            })
            .selector("edge:selected")
            .css({
              color: "#016eff",
            })
            .update();
          // 找到企业主体事件，并添加事件发生时间
          const evtriggers = nodes.filter((node) => {
            if (
              node.data.nodeType === "主体企业事件" ||
              node.data.nodeType === "事件"
            ) {
              return node;
            }
          });
          evtriggers.map((node) => {
            node.data.params.forEach((value, key) => {
              if (key === "evpubdate") {
                const time = new Date(parseInt(value));
                const year = time.getFullYear(); // 获取完整的年份(4位,1970)
                const month = time.getMonth() + 1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
                const date = time.getDate(); // 获取日(1-31)
                return (node.data.label =
                  node.data.label + "" + `${year}-${month}-${date}`);
              }
            });
          });
          nodes.forEach((node) => {
            this.$graph.datas.addNode(node);
          });
          edges.forEach((edge) => {
            this.$graph.datas.addEdge(edge);
          });
          this.graphNodes = nodes.map((node) => node.data);
          setTimeout(() => {
            this.$graph.events.changeLayout("breadthfirst");
            this.$refs.topToolBar.initLayoutKey();
            this.$refs.topToolBar.handleFit();
          }, 200);
        } finally {
          this.graphReady = true;
          this.canvasLoading = { loading: false, tip: "布局完成" };

          // 添加快照进历史，方便redo、undo
          this.$graph.events.history.pushSnapshot(this.$graph.cy.json());
        }
      }
    },
    async fetchSavedSentence() {
      const sentenceData = await checkSavedSentence(this.graphId);
      const entityData = await checkSavedEntity(this.graphId);
      if (!sentenceData) {
        this.$message.error("查询已保存语句查询失败");
      } else {
        sentenceData.map((item) => {
          item.name = item.cqlName;
          item.createTime = moment(item.createDate).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.cqlContext = item.cql;
        });
        this.savedSentenceData = sentenceData;
      }
      if (!entityData) {
        this.$message.error("查询已保存实体查询失败");
      } else {
        entityData.map((item) => {
          item.createTime = moment(item.createDate).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.cqlContext = JSON.parse(item.context).context;
          item.conditions = JSON.parse(item.context).condition;
        });
        this.savedEntityData = entityData;
      }
    },
    isShowSiftEdgeChanged(value) {
      // 收缩图谱信息
      this.isCloseGraphDetail(true);
      this.isCloseGraphMenu(false);
      this.showSiftEdge = value;
      if (!value && this.isHappenGroupFound) {
        // 执行子图筛选功能，默认重置社群发现
        this.$refs.groupFound.onReset();
      }
    },
    isShowGroupFoundChanged(value) {
      // 收缩图谱信息
      this.isCloseGraphDetail(true);
      this.isCloseGraphMenu(false);
      this.showGroupFound = value;
      if (!value && this.isHappenSiftEdge) {
        // 执行社群发现功能，默认重置子图筛选
        this.$refs.graphFilterEdges.onReset();
      }
    },
    isShowRiskCheckChanged(value) {
      // 收缩图谱信息
      this.isCloseGraphDetail(true);
      this.isCloseGraphMenu(false);
      this.showRiskCheck = value;
    },
    isShowSceneSearchChanged(value) {
      // 收缩图谱信息
      this.isCloseGraphDetail(true);
      this.isCloseGraphMenu(false);
      this.showSceneSearch = value;
    },
    savedSentenceDataChanged(value) {
      this.savedSentenceData = value;
    },
    savedEntityDataChanged(value) {
      this.savedEntityData = value;
    },
    async fetchBranch() {
      // graphPreview
      const branchData = await getGraphMeta(this.graphId);
      if (!branchData) {
        this.$message.error("查询图谱信息失败");
        return false;
      }
      // 保存边的类别的总集合
      const edgeMetas = branchData.edgeMetas;
      // const reg1 = /^([\u4E00-\u9FA5_])*$/; // 检出中文key
      const reg2 = /^(?!_)[a-zA-Z0-9_]+$/; // 检出英文key && 不以下划线开头
      this.searchEdgeAll = edgeMetas.map((item) => {
        return item.label;
      });

      // 保存关系节点的类别的总集合
      const vertexMetas = branchData.vertexMetas;
      const arr4 = [];
      const arr8 = [];
      this.searchNodeAll = vertexMetas.map((item) => {
        const arr6 = item.properties.map((cell) => {
          return {
            value: cell.fieldName,
            type: cell.fieldType,
          };
        });
        arr8.push({
          label: item.label,
          property: arr6,
        });
        const arr7 = arr6.filter((cell) => {
          if (reg2.test(cell.fieldName)) {
            return cell;
          }
        });
        arr4.push({
          label: item.label,
          property: arr7,
        });
        return item.label;
      });
      // arr4与arr8都不含有spark算法选项，需要时需添加
      this.entitySearchOption = arr4;
      this.entitySearchAllOption = arr8;
    },
    changeGraph(id, branchId) {
      this.setGraphId(id);
      this.setBranchId(branchId);
      sessionStorage.setItem("graphId", id);
      sessionStorage.setItem("branchId", branchId);
      this.$graph.datas.clear();
      this.graphNodes = [];
      this.fetchNeighbors();
      this.fetchSavedSentence();
      this.selectedNodes = [];
      this.selectedEdges = [];

      // 初始化graphDetail的四个状态
      this.$refs.graphDetail.totalMax = -Infinity;
      this.$refs.graphDetail.nodeMax = -Infinity;
      this.$refs.graphDetail.edgeMax = -Infinity;
      this.$refs.graphDetail.tagMax = -Infinity;

      // 初始化一些组件展示状态
      if (this.graphReady) {
        this.isCloseGraphDetail(true);
        this.isCloseGraphMenu(false);
        this.$refs.groupFound.newCombArr = [];
        this.$refs.topToolBar.initLayoutKey();
      }
    },
    isCxtClickChanged(value) {
      this.isCxtClick = value;
    },
    isCloseGraphDetail(flag) {
      this.$refs.graphDetail.handleChangeFold(flag);
    },
    isCloseGraphMenu(flag) {
      this.$refs.graphContextMenu.handleChangeShowMenu(flag);
    },
    isHappenSiftEdgeChanged(value) {
      this.isHappenSiftEdge = value;
    },
    isHappenGroupFoundChanged(value) {
      this.isHappenGroupFound = value;
    },
    async getGraphList() {
      const graphList = await queryGraphList();
      const graphOptions = [];
      if (!graphList) {
        this.$message.error("获取可选图谱失败");
      } else {
        graphList.map((graph) => {
          graphOptions.push({
            label: graph.graphChName,
            value: graph.id,
            branchId: graph.branchId,
          });
        });
        if (graphOptions.length) {
          this.setBranchId(graphOptions[0].branchId);
          this.setGraphId(graphOptions[0].value);
          sessionStorage.setItem("branchId", graphOptions[0].branchId);
          sessionStorage.setItem("graphId", graphOptions[0].value);
        } else {
          this.$message.error("暂无可用图谱数据");
          this.setBranchId(undefined);
          sessionStorage.setItem("branchId", undefined);
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.graph-app {
  display: flex;
  position: relative;
  background: #f8fbff;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 2px;

  .graph-app-content {
    height: 100%;
    display: flex;
    min-height: 0;
    padding-top: 88px;

    .drawing-canvas-wrapper {
      width: 100%;
      height: 100%;
      transition: all 0.1s;

      .graph-canvas-loading {
        left: 45%;
        top: 50%;
        z-index: 1041;
        position: absolute;
      }

      .graph-app-canvas {
        width: 100%;
        height: 100%;
        background: #f8fbff;
      }
    }
  }
}
</style>
