<template>
  <div class="blueprint-details">
    <div class="blueprint-details-header">
      <div class="title-box">
        <span class="title-name">{{ blueprintName }}</span>
        <a-button @click="handleReturn">返回</a-button>
      </div>
      <div class="title-desc no-content" v-if="!blueprintDesc">
        <span class="title-label">蓝图描述：</span>
        <span class="title-desc-text">暂无蓝图描述</span>
      </div>
      <p class="title-desc" v-else>
        <span class="title-label">蓝图描述：</span>
        <span class="title-desc-text">{{ blueprintDesc }}</span>
      </p>
    </div>
    <div class="blueprint-details-content">
      <div class="blueprint-details-content-left">
        <div class="left-graph">
          <div class="left-graph-tools">
            <div
              class="left-graph-tools-box"
              v-for="(box, index) in toolIcons"
              :key="index"
            >
              <div
                class="left-graph-tools-box-item"
                v-for="item in box"
                :key="item.label"
                @click="item.onClick(item.label)"
              >
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <span>{{ item.label }}</span>
                  </template>
                  <icon-svg
                    :icon-class="item.icon"
                    color="rgba(0, 0, 0, 0.45)"
                  />
                </a-tooltip>
              </div>
            </div>
            <div class="left-graph-tools-right">
              <span class="ratio"
                >当前比例:{{ (canvasRatio * 100).toFixed(0) }}%</span
              >
            </div>
          </div>
          <div ref="content" id="left-graph-canvas" class="left-graph-canvas">
            <a-spin
              v-if="isloading"
              class="left-graph-loading"
              size="large"
              tip="正在加载"
            />
          </div>
        </div>
      </div>
      <div class="blueprint-details-content-right" v-show="tableValue.length">
        <div class="right-options">
          <div class="right-header">属性展示</div>
          <div class="right-options-content">
            <div class="right-options-content-item">
              <div class="item-content item-table">
                <a-table
                  :columns="columns"
                  :data-source="tableValue"
                  :rowKey="(record) => record.id"
                  :pagination="false"
                  :loading="searchLoading"
                  class="date-table"
                  bordered
                ></a-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import G6 from "@antv/g6";
import { Button, Tooltip, Spin } from "ant-design-vue";
import { cloneDeep } from "lodash";

export default {
  name: "BlueprintDetails",
  props: ["detailsType", "details"],
  data() {
    return {
      blueprintName: this.details.name || undefined,
      blueprintDesc: this.details.desc || undefined,
      attrValue: undefined,
      attrValueAll: undefined,
      attrOptions: [],
      attrOptionsChildren: [],
      keyValue: undefined,
      keyOptions: [],
      styleValue: "1",
      iconValue: undefined,
      sizeValue: 48,
      colorValue: undefined,
      columns: [
        {
          title: "字段名",
          dataIndex: "fieldName",
          key: "fieldName",
          width: 224,
        },
        {
          title: "字段类型",
          dataIndex: "fieldType",
          key: "fieldType",
          width: 102,
        },
      ],
      tableValue: [
        // {
        //   fieldName: "test",
        //   fieldType: "string",
        // },
      ],
      searchLoading: false,
      graph: null,
      canvasWidth: 0,
      canvasHeight: 0,
      graphData: this.details.graphData || {
        nodes: [],
        edges: [],
      },
      nodeIndex: 1,
      edgeIndex: 1,
      isHover: false, // 是否悬浮
      isChosen: false, // 是否选中
      graphItem: undefined,
      selectItem: undefined, // 单个选择
      toolIcons: [
        [
          {
            icon: "icon-zoomIn",
            label: "放大",
            isActive: true,
            onClick: () => {
              // if (this.detailsType === "check") return;
              this.handleZoomIn();
            },
          },
          {
            icon: "icon-zoomOut",
            label: "缩小",
            isActive: true,
            onClick: () => {
              // if (this.detailsType === "check") return;
              this.handleZoomOut();
            },
          },
          {
            icon: "icon-compress",
            label: "适应画布",
            isActive: true,
            onClick: () => {
              // if (this.detailsType === "check") return;
              this.handleFitView();
            },
          },
          {
            icon: "icon-oneToOne",
            label: "还原比例",
            isActive: true,
            onClick: () => {
              // if (this.detailsType === "check") return;
              this.handleFitBack();
            },
          },
        ],
      ],
      graphCanvas: null,
      canvasRatio: 1,
      isClear: false, // 判断是否是清空级联框时
      isloading: false,
    };
  },
  components: {
    AButton: Button,
    ASpin: Spin,
    ATooltip: Tooltip,
  },
  watch: {
    selectItem(newValue) {
      if (newValue) {
        console.log("newValue", newValue);
        this.selectItem = newValue;
        const data = newValue.data;
        this.updateIconState(["复制", "删除"], [true, true]);
        if (data.attrValue) {
          this.tableValue = data.tableValue;
        }
      } else {
        this.tableValue = [];
      }
    },
    graphData(newValue) {
      // 如果图中有节点，则对应图标高亮
      if (newValue.nodes.length) {
        this.updateIconState(
          ["放大", "缩小", "适应画布", "还原比例", "多选"],
          [true, true, true, true, true]
        );
      } else {
        this.updateIconState(
          ["放大", "缩小", "适应画布", "还原比例", "多选"],
          [false, false, false, false, false]
        );
      }
    },
  },
  computed: {},
  mounted() {
    console.log("props", this.details);
    setTimeout(() => {
      const that = this;
      window.onresize = () => {
        that.canvasWidth = that.$refs.content.clientWidth;
        // 修改画布的大小
        that.graph.changeSize(that.canvasWidth, that.canvasHeight);
        // 将图移动到画布中心位置
        // that.graph.fitCenter();
      };
    }, 100);
    this.initGraph();
  },
  beforeDestroy() {
    this.graph.destroy();
  },
  methods: {
    initGraph() {
      this.canvasWidth = this.$refs.content.clientWidth;
      this.canvasHeight = this.$refs.content.clientHeight;
      console.log(
        "🚀 ~ initGraph ~ canvasWidth:",
        this.canvasWidth,
        this.canvasHeight
      );

      // 创建自定义节点
      G6.registerEdge(
        "graph-edge",
        {
          draw(cfg, group) {
            console.log("draw", cfg, group);
            const startPoint = cfg.startPoint;
            const endPoint = cfg.endPoint;
            const shape = group.addShape("path", {
              attrs: {
                stroke: "#333",
                path: [
                  ["M", startPoint.x, startPoint.y],
                  ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
                  ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
                  ["L", endPoint.x, endPoint.y],
                ],
              },
              // must be assigned in G6 3.3 and later versions. it can be any value you want
              name: "path-shape",
            });
            return shape;
          },
        },
        "line"
      );

      const graph = new G6.Graph({
        container: "left-graph-canvas",
        width: this.canvasWidth,
        height: this.canvasHeight,
        minZoom: 0.5,
        maxZoom: 2.4,
        linkCenter: true,
        enabledStack: true,
        animate: true,
        animateCfg: {
          duration: 300, // Number，一次动画的时长
        },
        layout: {
          type: "dagre",
          rankdir: "LR", // 可选，默认为图的中心
          align: "DL", // 可选
          nodesep: 40, // 可选
          ranksep: 40, // 可选
          // controlPoints: true, // 可选
        },
        defaultNode: {
          type: "circle", // 节点类型
          size: 48, // 节点大小
          style: {
            lineWidth: 0,
            cursor: "move",
          },
          icon: {
            show: true,
            width: 14,
            height: 14,
            img: "",
          },
          labelCfg: {
            position: "bottom",
            offset: 5,
            style: {
              // fill: "#666",
              fill: "rgba(0, 0, 0, 0.45)",
            },
          },
        },
        defaultEdge: {
          type: "line",
          style: {
            stroke: "#CECECE",
            lineWidth: 1,
            lineAppendWidth: 10,
            cursor: "pointer",
            startArrow: {
              path: G6.Arrow.vee(0, 0, 24), // 内置箭头，参数为箭头宽度、长度、偏移量 d（默认为 0）
              d: 24, // 偏移量
            },
            endArrow: {
              path: G6.Arrow.vee(10, 10, 24), // 内置箭头，参数为箭头宽度、长度、偏移量 d（默认为 0）
              d: 24, // 偏移量
              fill: "#CECECE",
            },
          },
          labelCfg: {
            autoRotate: true,
            style: {
              lineWidth: 5,
              fill: "rgba(0, 0, 0, 0.45)",
              stroke: "#F8FBFF",
            },
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
          // 鼠标点击节点，即 click 状态为 true 时的样式
          click: {
            shadowColor: "rgba(0, 0, 0, 0.4)",
            shadowBlur: 10,
            "text-shape": {
              fill: "#016EFF",
            },
          },
          chosen: {
            stroke: "#B7EB8F",
            lineWidth: 3,
          },
        },
        edgeStateStyles: {
          click: {
            stroke: "#016EFF",
            "text-shape": {
              fill: "#016EFF",
            },
          },
        },

        modes: {
          default: ["drag-canvas", "drag-node"],
          direction: "both",
        },
      });
      this.graph = graph;
      this.graphCanvas = document.getElementsByTagName("canvas")[0];

      // 绑定事件
      // 悬浮事件
      graph.on("node:mouseenter", (e) => {
        graph.setItemState(e.item, "hover", true);
        this.graphItem = e.item;
        if (!this.isChosen) {
          this.isHover = true;
        } else {
          this.isHover = false;
        }
      });
      graph.on("node:mouseleave", (e) => {
        graph.setItemState(e.item, "hover", false);
        this.graphItem = e.item;
        this.isHover = false;
      });

      // 点击事件
      graph.on("node:click", (e) => {
        this.rightMenuShow = false;
        const itemMap = e.currentTarget.cfg.itemMap;
        for (let i in itemMap) {
          graph.setItemState(itemMap[i], "click", false);
        }
        for (let i = 0; i < this.graphData.nodes.length; i++) {
          const node = this.graphData.nodes[i];
          if (node.id === e.item._cfg.id) {
            // node.data.colorValue = node.style.fill;
            this.selectItem = node;
            break;
          }
        }
        graph.setItemState(e.item, "click", true);
      });
      graph.on("edge:click", (e) => {
        this.rightMenuShow = false;
        const itemMap = e.currentTarget.cfg.itemMap;
        for (let i in itemMap) {
          graph.setItemState(itemMap[i], "click", false);
        }
        for (let i = 0; i < this.graphData.edges.length; i++) {
          const edge = this.graphData.edges[i];
          if (edge.id === e.item._cfg.id) {
            // edge.data.colorValue = edge.style.stroke;
            this.selectItem = edge;
            break;
          }
        }
        graph.setItemState(e.item, "click", true);
      });
      graph.on("canvas:click", (e) => {
        const itemMap = e.currentTarget.cfg.itemMap;
        this.canvasClick(itemMap);
      });

      // 读取数据
      graph.data(this.graphData);
      // 渲染图
      graph.render();
      this.resetEdges();
      this.isloading = true;
      const _that = this;
      setTimeout(() => {
        _that.isloading = false;
        graph.fitCenter();
      }, 1000);
    },
    handleReturn() {
      this.$emit("isDetailsShowChanged", false, undefined, false);
    },
    resetEdges() {
      const edges = this.graph.save().edges;
      const noLoopEdges = edges.filter((edge) => {
        if (edge.target !== edge.source) {
          return edge;
        }
      });
      G6.Util.processParallelEdges(noLoopEdges, 20);
      const nodes = [];
      let dist = 90;
      this.graph.getEdges().forEach((edge, i) => {
        if (edges[i].target === edges[i].source) {
          // 将边的自环点放入数组，方便校验是否为同一个点的自环边
          const index = nodes.indexOf(edges[i].target);
          if (index === -1) {
            dist = 90;
          }
          nodes.push(edges[i].target);
          this.graph.updateItem(
            edge,
            {
              loopCfg: {
                dist,
              },
              labelCfg: {
                autoRotate: true,
                backgroundColor: "#fff",
              },
              style: {
                startArrow: {
                  path: G6.Arrow.vee(0, 0, edges[i].style.lineWidth),
                  d: edges[i].style.lineWidth,
                },
                endArrow: {
                  path: G6.Arrow.vee(10, 10, edges[i].style.lineWidth), // 内置箭头，参数为箭头宽度、长度、偏移量 d（默认为 0）
                  d: edges[i].style.lineWidth, // 偏移量
                  fill: edges[i].style.stroke,
                },
              },
              type: "loop",
            },
            false
          );
          dist += 50;
        } else {
          this.graph.updateItem(
            edge,
            {
              curveOffset: edges[i].curveOffset,
              curvePosition: 0.425, // 手动调出来的
              style: {
                startArrow: {
                  path: G6.Arrow.vee(
                    0,
                    0,
                    edges[i].style.lineWidth +
                      edge._cfg.targetNode.getModel().size / 2
                  ),
                  d:
                    edges[i].style.lineWidth +
                    edge._cfg.targetNode.getModel().size / 2,
                },
                endArrow: {
                  path: G6.Arrow.vee(
                    10,
                    10,
                    edges[i].style.lineWidth +
                      edge._cfg.targetNode.getModel().size / 2
                  ), // 内置箭头，参数为箭头宽度、长度、偏移量 d（默认为 0）
                  d:
                    edges[i].style.lineWidth +
                    edge._cfg.targetNode.getModel().size / 2, // 偏移量
                  fill: edges[i].style.stroke,
                },
              },
              labelCfg: {
                autoRotate: true,
                backgroundColor: "#fff",
              },
            },
            false
          );
        }
      });
    },
    handleZoomIn() {
      // 放大
      if (!this.graphData.nodes.length) return;
      const center = {
        x: this.canvasWidth / 2,
        y: this.canvasHeight / 2,
      };
      this.canvasRatio *= 1.25;
      this.canvasRatio = this.canvasRatio.toFixed(2); // 保留两位小数，方便变成百分数
      if (this.canvasRatio > 2.4) {
        this.canvasRatio = 2.4;
        this.updateIconState(["放大"], [false]);
        return false;
      } else {
        this.graph.zoomTo(this.canvasRatio, center);
        this.updateIconState(["放大", "缩小"], [true, true]);
        this.graph.setMode("default");
      }
    },
    handleZoomOut() {
      // 缩小
      if (!this.graphData.nodes.length) return;
      const center = {
        x: this.canvasWidth / 2,
        y: this.canvasHeight / 2,
      };
      this.canvasRatio *= 0.8;
      this.canvasRatio = this.canvasRatio.toFixed(2); // 保留两位小数，方便变成百分数
      if (this.canvasRatio < 0.5) {
        this.canvasRatio = 0.5;
        this.updateIconState(["缩小"], [false]);
        return false;
      } else {
        this.graph.zoomTo(this.canvasRatio, center);
        this.updateIconState(["放大", "缩小"], [true, true]);
        this.graph.setMode("default");
      }
    },
    handleFitView() {
      if (!this.graphData.nodes.length) return;
      this.graph.fitView(50);
      this.graph.setMode("default");
      this.canvasRatio = this.graph.getZoom().toFixed(2);
    },
    handleFitBack() {
      if (!this.graphData.nodes.length) return;
      const center = {
        x: this.canvasWidth / 2,
        y: this.canvasHeight / 2,
      };
      this.graph.zoomTo(1, center);
      this.graph.setMode("default");
      this.canvasRatio = 1;
    },
    updateIconState(labels, flags) {
      const toolIcons = cloneDeep(this.toolIcons);
      toolIcons.map((box) => {
        box.map((item) => {
          labels.map((label, index) => {
            if (item.label === label) {
              item.isActive = flags[index];
            }
          });
        });
      });
      this.toolIcons = toolIcons;
    },
    canvasClick(items) {
      this.rightMenuShow = false;
      for (let i in items) {
        this.graph.setItemState(items[i], "click", false);
      }
      this.selectItem = undefined;
      this.graph.setMode("default");
      this.updateIconState(["复制", "删除"], [false, false]);
      this.$nextTick(() => {
        this.graphCanvas.style.cursor = "default";
      });
    },
  },
};
</script>
<style lang="less">
.blueprint-details {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;
  display: flex;
  flex-direction: column;

  &-header {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    margin-bottom: 20px;

    .title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .title-name {
        font-size: 20px;
        font-weight: 600;
        color: @primaryTextColor;
      }
    }

    .title-desc {
      display: flex;

      .title-label {
        width: 76px;
        color: #97a3b7;
      }

      &-text {
        color: @primaryTextColor;
        width: 100%;
        flex: 1;
      }

      &.no-content {
        .title-desc-text {
          color: @blue;
        }
      }
    }
  }

  &-content {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    border: 1px solid #d6dbe3;

    &-left {
      flex: 1;
      display: flex;
      background: #fff;
      flex-direction: column;
      width: calc(100% - 546px);

      .left-graph {
        height: 100%;

        &-tools {
          width: 100%;
          height: 44px;
          display: flex;
          overflow: auto;
          padding: 0 16px;
          align-items: center;
          justify-content: space-between;
          background-color: #f1f2f5;

          &-box {
            display: flex;
            align-items: center;

            &-item {
              width: 14px;
              height: 14px;
              display: flex;
              cursor: pointer;
              align-items: center;

              .svg-icon {
                &.disabled {
                  cursor: not-allowed;
                }
              }

              &:not(:last-child) {
                margin-right: 24px;
              }
            }
          }

          &-right {
            padding-right: 16px;
            user-select: none;

            .ratio {
              color: @secondaryTextColor;
            }
          }
        }

        &-canvas {
          display: flex;
          position: relative;
          background: #f8fbff;
          height: calc(100% - 44px);

          &-addbtn {
            width: 14px;
            height: 14px;
            cursor: copy;
            display: flex;
            position: absolute;
            transition: all 0.1s;

            .anticon {
              color: @blue;
            }
          }
        }

        &-loading {
          width: 100%;
          height: 100%;
          background: #f8fbff;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
      }
    }

    &-right {
      width: 360px;
      background: #fff;

      .right-header {
        height: 44px;
        padding: 0 16px;
        line-height: 44px;
        font-weight: 600;
        color: @primaryTextColor;
        background-color: #f1f2f5;
        border-left: 1px solid @dividersColor;
      }

      .right-options {
        height: 100%;
        border-left: 1px solid @dividersColor;

        &-content {
          display: flex;
          padding: 16px;
          overflow: auto;
          flex-direction: column;
          height: calc(100% - 44px);

          &-item {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .item-title {
              z-index: 9;
              color: @blue;
              height: 22px;
              cursor: pointer;
              max-width: 125px;
              line-height: 22px;

              &-text {
                margin-right: 10px;
              }
            }

            .item-content {
              opacity: 1;
              display: flex;
              transition: all 0.3s;
              flex-direction: column;

              .date-table {
                height: auto;

                .ant-spin-nested-loading {
                  height: auto;

                  .ant-spin-container {
                    height: auto;

                    .ant-table {
                      height: auto;
                    }
                  }
                }
                .ant-table-row-cell-break-word {
                  font-size: 12px;
                  padding: 6px 8px !important;
                }
              }
            }

            .item-box {
              opacity: 1;
              display: flex;
              flex-wrap: wrap;
              margin-top: 8px;
              transition: all 0.3s;

              &-item {
                display: flex;
                margin-right: 24px;
                margin-bottom: 24px;
                flex-direction: column;
                width: calc((100% - 24px) / 2);

                &:nth-child(2n) {
                  margin-right: 0;
                }

                .item-box-label {
                  height: 22px;
                  line-height: 22px;
                  margin-bottom: 4px;
                  color: @primaryTextColor;
                }

                .item-box-input {
                  .ant-select-selection {
                    .ant-select-selection__rendered {
                      .ant-select-selection-selected-value {
                        height: 30px;
                        align-items: center;
                        display: flex !important;

                        .option-img {
                          display: none;
                        }

                        .option-dot {
                          width: 16px;
                          height: 16px;
                          border-radius: 8px;
                          display: inline-block;
                        }
                      }
                    }
                  }

                  .ant-cascader-picker-label {
                    .svg-icon {
                      width: 20px;
                      height: 20px;
                      color: @secondaryTextColor;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
