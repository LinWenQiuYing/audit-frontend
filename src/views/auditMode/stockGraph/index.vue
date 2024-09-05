<template>
  <div class="stock-graph">
    <div class="stock-graph-content" ref="graphDom"></div>
    <div class="stock-graph-filter">
      <span class="content-label">控股股权比例：</span>
      <a-input-number
        placeholder="请选择"
        :min="0"
        :max="100"
        v-model="showNumber"
        @pressEnter="showNumberChange"
        style="width: 70px; margin-right: 8px"
      />
      <span class="content-label">%</span>
    </div>
  </div>
</template>
<script>
import {
  getShareInvest,
  // getShareNodeDetail,
  getShareOwnership,
} from "@/shared/newApi/stockGraph.js";
import G6 from "@antv/g6";
import { InputNumber } from "ant-design-vue";
import { mapState } from "vuex";
import { nanoid } from "nanoid";

export default {
  name: "StockGraph",
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  data() {
    return {
      showNumber: 50,
      detailData: {
        id: "",
        name: "",
        money: "", //控股/持股金额数目，以万元为单位
        percent: 0.679, // 控股/持股比例
      },
      isTooltipShow: false,
      graphData: {
        name: "",
        isTop: true,
        children: [
          // {
          //   id: "c1",
          //   name: "海南巧易科11",
          //   showDirection: "out",
          //   hasChildren: true,
          //   collapsed: false,
          //   nodeType: "enterprise",
          //   percent: 50,
          //   money: 0,
          //   children: [
          //     {
          //       id: "c1df",
          //       name: "测试测试测试测试",
          //       post: "主管",
          //       hasChildren: true,
          //       percent: 50,
          //       money: 1000000000,
          //       nodeType: "enterprise",
          //       showDirection: "out",
          //       children: [],
          //     },
          //     {
          //       id: "打发发达",
          //       name: "海南巧易科技有限公司海南巧易科技有限公司",
          //       percent: 50,
          //       money: 1000000000,
          //       showDirection: "out",
          //       hasChildren: true,
          //       nodeType: "enterprise",
          //       collapsed: false,
          //       children: [],
          //     },
          //     {
          //       id: "幅度萨芬",
          //       name: "蔡徐坤",
          //       percent: 50,
          //       money: 1000000000,
          //       nodeType: "person",
          //       showDirection: "out",
          //     },
          //   ],
          // },
          // {
          //   id: "市国资委",
          //   name: "市国资委",
          //   showDirection: "in",
          //   percent: 50,
          //   money: "1000000000",
          //   hasChildren: true,
          //   nodeType: "个人",
          //   children: [],
          // },
          // {
          //   id: "c4",
          //   name: "海南巧易科技有限公司海33",
          //   showDirection: "in",
          //   hasChildren: true,
          //   percent: 50,
          //   money: 1000000000,
          //   collapsed: false,
          //   nodeType: "enterprise",
          //   children: [],
          // },
          // {
          //   id: "c5",
          //   name: "海南巧易44",
          //   showDirection: "out",
          //   hasChildren: true,
          //   nodeType: "enterprise",
          //   percent: 50,
          //   money: 1000000000,
          //   children: [],
          // },
        ],
      },
      graph: null,
      canvasRatio: 1,
    };
  },
  components: { AInputNumber: InputNumber },
  methods: {
    showNumberChange() {
      if (this.showNumber > 100) {
        this.showNumber = 100;
      } else if (this.showNumber < 0) {
        this.showNumber = 0;
      }
      this.initGraph(this.$refs.graphDom);
    },
    COLLAPSE_ICON(x, y, r) {
      return [
        ["M", x - r, y - r],
        ["a", r, r, 0, 1, 0, r * 2, 0],
        ["a", r, r, 0, 1, 0, -r * 2, 0],
        ["M", x + 3 - r, y - r],
        ["L", x + r - 3, y - r],
      ];
    },

    EXPAND_ICON(x, y, r) {
      return [
        ["M", x - r, y - r],
        ["a", r, r, 0, 1, 0, r * 2, 0],
        ["a", r, r, 0, 1, 0, -r * 2, 0],
        ["M", x + 3 - r, y - r],
        ["L", x + r - 3, y - r],
        ["M", x, y - 2 * r + 3],
        ["L", x, y - 3],
      ];
    },

    getIcon(cfg) {
      if (cfg.hasChildren && cfg.collapsed === undefined) {
        return this.EXPAND_ICON;
      } else {
        return cfg.collapsed ? this.EXPAND_ICON : this.COLLAPSE_ICON;
      }
    },

    initGraph(dom) {
      if (this.graph) {
        this.graph.destroy();
      }
      const _that = this;

      // 注册根节点
      G6.registerNode(
        "first-node",
        {
          draw(cfg, group) {
            const styles = this.getShapeStyle(cfg);
            const { labelCfg = {} } = cfg;

            const w = 192;
            const h = 48;

            const keyShape = group.addShape("rect", {
              attrs: {
                ...styles,
                fill: "#1776FF",
                stroke: "#1776FF",
                width: w,
                height: h,
                x: -26, // 不加样式不对齐，很奇怪，不明原因
                y: 10,
              },
            });
            if (cfg.name) {
              /** 判断文字位置，折行等 **/
              const wrapNum = 10;
              let textY = 44 + 10;
              let content = cfg.name;
              if (cfg.name.length > wrapNum * 2) {
                content =
                  content.slice(0, wrapNum) +
                  "\n" +
                  content.slice(wrapNum, wrapNum * 2 - 1) +
                  "...";
              } else if (cfg.name.length > wrapNum) {
                content =
                  content.slice(0, wrapNum) + "\n" + content.slice(wrapNum);
              } else {
                textY = h - 16 + 10;
              }
              /**添加节点名称**/
              group.addShape("text", {
                attrs: {
                  ...labelCfg.style,
                  fill: "#fff",
                  fontSize: 16,
                  text: content,
                  lineHeight: 22,
                  textAlign: "center",
                  x: w / 2 - 26,
                  y: textY,
                },
              });
            }

            return keyShape;
          },
        },
        "rect"
      );

      // 注册普通节点
      G6.registerNode(
        "icon-node",
        {
          draw(cfg, group) {
            const styles = this.getShapeStyle(cfg);
            const { labelCfg = {} } = cfg;

            const w = styles.width;
            const h = styles.height;

            const keyShape = group.addShape("rect", {
              attrs: {
                ...styles,
                // fill: cfg.nodeType === "个人" ? "#E6F4FF" : "#fff",
                // stroke: cfg.nodeType === "个人" ? "#1776FF" : "#D6DBE3",
                fill: "#fff",
                stroke: "#D6DBE3",
                x: 0,
                y: 0,
              },
            });
            if (cfg.hasChildren) {
              group.addShape("marker", {
                attrs: {
                  x: w / 2,
                  y: cfg.showDirection === "in" ? -1 : h + 13,
                  r: 6,
                  stroke: "#fff",
                  fill: "#5F7292",
                  cursor: "pointer",
                  symbol: _that.getIcon(cfg),
                },
                name: "collapse-icon",
              });
            }
            if (cfg.name) {
              /** 判断文字位置，折行等 **/
              const wrapNum = 8;
              let textY1 = 45.5; // ui图里的距离
              let textY2; // textY1 + 21 持股数文字高度
              let textY3 = 72 + 11 + 28; // rect高度 + 持股比例文字高度 + 偏移度
              let content = cfg.name;
              if (cfg.name.length > wrapNum * 2) {
                content =
                  content.slice(0, wrapNum) +
                  "\n" +
                  content.slice(wrapNum, wrapNum * 2 - 1) +
                  "...";
              } else if (cfg.name.length > wrapNum) {
                content =
                  content.slice(0, wrapNum) + "\n" + content.slice(wrapNum);
              } else {
                textY1 = 35.5;
              }
              textY2 = textY1 + 21;
              /**添加节点名称**/
              group.addShape("text", {
                attrs: {
                  ...labelCfg.style,
                  fill: "#3C485C",
                  fontSize: 14,
                  text: content,
                  lineHeight: 20,
                  textAlign: "center",
                  x: w / 2,
                  y: textY1,
                },
              });
              /**持股金额信息**/
              group.addShape("text", {
                attrs: {
                  fill: "#97A3B7",
                  fontSize: 10,
                  text: cfg.money
                    ? "认缴金额: " +
                      parseFloat(cfg.money).toLocaleString() +
                      "万元"
                    : "认缴金额: 0万元",
                  textAlign: "center",
                  x: w / 2,
                  y: textY2,
                },
              });
              /**持股比例信息**/
              if (cfg.percent) {
                const text1 = group.addShape("text", {
                  attrs: {
                    fill: "#1776FF",
                    fontSize: 8,
                    lineHeight: 11,
                    text: cfg.percent + "%",
                    textAlign: "center",
                  },
                });
                const bbox1 = text1.getBBox();
                text1.attr({
                  x: w / 2 + bbox1.width / 2 + 10,
                  y: cfg.showDirection === "in" ? textY3 : -30,
                });
              }
              /**持股比例文字**/
              group.addShape("rect", {
                attrs: {
                  ...styles,
                  width: 22,
                  height: 13,
                  // fill: "#E6F4FF",
                  fill: cfg.percent > _that.showNumber ? "#E6F4FF" : "#f7faff", //todo
                  lineWidth: 0,
                  radius: 2,
                  x: w / 2 - 29,
                  y: cfg.showDirection === "in" ? textY3 - 11 : -41,
                },
              });
              const text2 = group.addShape("text", {
                attrs: {
                  fill: "#1776FF",
                  fontSize: 8,
                  lineHeight: 11,
                  text: cfg.percent >= _that.showNumber ? "控股" : "",
                  textAlign: "center",
                },
              });
              const bbox2 = text2.getBBox();
              text2.attr({
                x: w / 2 - bbox2.width / 2 - 10,
                y: cfg.showDirection === "in" ? textY3 : -30,
              });
            }

            return keyShape;
          },
          update: (cfg, item) => {
            const group = item.getContainer();
            const icon = group.find((e) => e.get("name") === "collapse-icon");
            icon.attr("symbol", _that.getIcon(cfg));
          },
        },
        "rect"
      );

      // 实际控制人
      G6.registerNode(
        "actual-node",
        {
          draw(cfg, group) {
            const styles = this.getShapeStyle(cfg);
            const { labelCfg = {} } = cfg;

            const w = styles.width;
            const h = styles.height;

            const keyShape = group.addShape("rect", {
              attrs: {
                ...styles,
                fill: "#FFE6E5",
                stroke: "#E31430",
                x: 0,
                y: -23,
                height: h + 23,
              },
            });
            // 顶部颜色板
            group.addShape("rect", {
              attrs: {
                ...styles,
                fill: "#E31430",
                stroke: "#E31430",
                radius: [6, 6, 0, 0],
                x: 0,
                y: -23,
                height: 23,
              },
            });
            // 添加顶部标题文字
            group.addShape("text", {
              attrs: {
                fill: "#fff",
                stroke: "#E31430",
                fontSize: 12,
                text: "实际控制人",
                lineHeight: 17,
                textAlign: "center",
                x: w / 2,
                y: -4,
              },
            });
            // 添加顶部颜色板下的三角形
            group.addShape("polygon", {
              attrs: {
                points: [
                  [w / 2 - 5, 0],
                  [w / 2, 6],
                  [w / 2 + 5, 0],
                ],
                fill: "#E31430",
              },
              // must be assigned in G6 3.3 and later versions. it can be any value you want
              name: "polygon-shape",
            });

            if (cfg.hasChildren) {
              group.addShape("marker", {
                attrs: {
                  x: w / 2,
                  y: cfg.showDirection === "in" ? -1 - 23 : h + 13,
                  r: 6,
                  stroke: "#fff",
                  fill: "#5F7292",
                  cursor: "pointer",
                  symbol: _that.getIcon(cfg),
                },
                name: "collapse-icon",
              });
            }
            if (cfg.name) {
              /** 判断文字位置，折行等 **/
              const wrapNum = 8;
              let textY1 = 45.5; // ui图里的距离
              let textY2; // textY1 + 21 持股数文字高度
              let textY3 = 72 + 11 + 28; // rect高度 + 持股比例文字高度 + 偏移度
              let content = cfg.name;
              if (cfg.name.length > wrapNum * 2) {
                content =
                  content.slice(0, wrapNum) +
                  "\n" +
                  content.slice(wrapNum, wrapNum * 2 - 1) +
                  "...";
              } else if (cfg.name.length > wrapNum) {
                content =
                  content.slice(0, wrapNum) + "\n" + content.slice(wrapNum);
              } else {
                textY1 = 35.5;
              }
              textY2 = textY1 + 21;
              /**添加节点名称**/
              group.addShape("text", {
                attrs: {
                  ...labelCfg.style,
                  fill: "#3C485C",
                  fontSize: 14,
                  text: content,
                  lineHeight: 20,
                  textAlign: "center",
                  x: w / 2,
                  y: textY1,
                },
              });
              /**持股金额信息**/
              group.addShape("text", {
                attrs: {
                  fill: "#97A3B7",
                  fontSize: 10,
                  text: cfg.money
                    ? "认缴金额: " +
                      parseFloat(cfg.money).toLocaleString() +
                      "万元"
                    : "认缴金额: 0万元",
                  textAlign: "center",
                  x: w / 2,
                  y: textY2,
                },
              });
              /**持股比例信息**/
              if (cfg.percent) {
                const text1 = group.addShape("text", {
                  attrs: {
                    fill: "#1776FF",
                    fontSize: 8,
                    lineHeight: 11,
                    text: cfg.percent + "%",
                    textAlign: "center",
                  },
                });
                const bbox1 = text1.getBBox();
                text1.attr({
                  x: w / 2 + bbox1.width / 2 + 10,
                  y: cfg.showDirection === "in" ? textY3 : -30,
                });
              }
              /**持股比例文字**/
              group.addShape("rect", {
                attrs: {
                  ...styles,
                  width: 22,
                  height: 13,
                  // fill: "#E6F4FF",
                  fill: cfg.percent > _that.showNumber ? "#E6F4FF" : "#f7faff", //todo
                  lineWidth: 0,
                  radius: 2,
                  x: w / 2 - 29,
                  y: cfg.showDirection === "in" ? textY3 - 11 : -41,
                },
              });
              const text2 = group.addShape("text", {
                attrs: {
                  fill: "#1776FF",
                  fontSize: 8,
                  lineHeight: 11,
                  text: cfg.percent >= _that.showNumber ? "控股" : "",
                  textAlign: "center",
                },
              });
              const bbox2 = text2.getBBox();
              text2.attr({
                x: w / 2 - bbox2.width / 2 - 10,
                y: cfg.showDirection === "in" ? textY3 : -30,
              });
            }

            return keyShape;
          },
          update: (cfg, item) => {
            const group = item.getContainer();
            const icon = group.find((e) => e.get("name") === "collapse-icon");
            icon.attr("symbol", _that.getIcon(cfg));
          },
        },
        "rect"
      );

      // 注册折线边
      G6.registerEdge("flow-line", {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;
          const { style } = cfg;
          if (cfg.targetNode._cfg.model.showDirection === "out") {
            //out代表对外投资
            let shape = group.addShape("path", {
              attrs: {
                stroke: style.stroke,
                endArrow: style.endArrow,
                path: [
                  ["M", startPoint.x, startPoint.y],
                  [
                    "L",
                    startPoint.x,
                    (startPoint.y + cfg.targetNode.getBBox().minY) / 2,
                  ],
                  [
                    "L",
                    endPoint.x,
                    (startPoint.y + cfg.targetNode.getBBox().minY) / 2,
                  ],
                  ["L", endPoint.x, cfg.targetNode.getBBox().minY],
                ],
              },
            });
            return shape;
          } else {
            let shape = group.addShape("path", {
              attrs: {
                stroke: style.stroke,
                endArrow: style.reverseArrow,
                path: [
                  ["M", startPoint.x, startPoint.y],
                  [
                    "L",
                    startPoint.x,
                    (startPoint.y + cfg.targetNode.getBBox().maxY) / 2,
                  ],
                  [
                    "L",
                    endPoint.x,
                    (startPoint.y + cfg.targetNode.getBBox().maxY) / 2,
                  ],
                  ["L", endPoint.x, cfg.targetNode.getBBox().maxY],
                ],
              },
            });
            return shape;
          }
        },
      });
      const defaultStateStyles = {
        hover: {
          stroke: "#1776FF",
          lineWidth: 1.6,
        },
      };

      const defaultNodeStyle = {
        fill: "#fff",
        stroke: "#1776FF",
        radius: 6,
        lineWidth: 1,
      };

      const defaultEdgeStyle = {
        stroke: "#E3E6EB",
        endArrow: {
          path: "M 0,0 L 7.5, 4.75 L 7.5,0 L 7.5, -4.75 Z",
          fill: "#1776FF",
          stroke: "#1776FF",
          d: -30,
        },
        reverseArrow: {
          path: "M 7.5,0 L 0, 4.75 L 0,0 L 0, -4.75 Z",
          fill: "#1776FF",
          stroke: "#1776FF",
          d: -30,
        },
      };

      const defaultLayout = {
        type: "compactBox",
        direction: "V", //V 垂直分布  H 水平分布
        getId: function getId(d) {
          return d.id;
        },
        getVGap: function getVGap() {
          return 80;
        },
        getHGap: function getHGap() {
          return 78;
        },
        getSide: (d) => {
          /**上下布局，此处判断在节点上还是下**/
          if (d.data.showDirection === "out") {
            return "right";
          } else {
            return "left";
          }
        },
      };

      const defaultLabelCfg = {
        style: {
          fill: "#3C485C",
          fontSize: 14,
          fontFamily: "PingFang SC",
        },
      };

      // tooltip
      const tooltip = this.useTooltip();

      const width = dom.clientWidth;
      const height = dom.clientHeight;
      this.graph = new G6.TreeGraph({
        container: dom,
        width,
        height,
        linkCenter: true,
        plugins: [tooltip],
        modes: {
          default: ["drag-canvas", "zoom-canvas"],
        },
        defaultNode: {
          type: "icon-node",
          size: [140, 72],
          style: defaultNodeStyle,
          labelCfg: defaultLabelCfg,
        },
        defaultEdge: {
          type: "flow-line",
          style: defaultEdgeStyle,
        },
        nodeStateStyles: defaultStateStyles,
        edgeStateStyles: defaultStateStyles,
        layout: defaultLayout,
      });
      this.graph.get("canvas").set("localRefresh", false);

      // 监听事件
      this.graph.on("mousemove", (e) => {
        this.graph.get("canvas").set("localRefresh", false); // gitee上查到的避免拖动出现重影的方法
      });

      // this.graph.on("node:mouseenter", (e) => {
      //   // 获取节点详情数据
      //   const model = e.item.getModel();
      //   if (model.type !== "person-node") {
      //     this.getShareNodeDetail(model.id);
      //   }
      // });

      // 点击事件
      this.graph.on("node:click", async (evt) => {
        let { item, target } = evt;
        let targetType = target.get("type");
        const model = item.getModel();
        console.log("🚀 ~ this.graph.on ~ model:", model);
        const upDownType = model.showDirection; // in / out
        if (targetType === "marker") {
          if (target.attr("symbol") === this.EXPAND_ICON) {
            //判断点击为'+'号--展开
            let result = [];
            if (model.copyChildren && model.copyChildren.length) {
              result = model.copyChildren;
            } else {
              if (upDownType === "in") {
                result = await this.getUpData(model.name, model.depth + 1);
              } else {
                result = await this.getDownData(model.name, model.depth + 1);
              }
            }
            console.log("result", result, this.graph.save());
            model.children = result;
            const icon = item
              .get("group")
              .find((element) => element.get("name") === "collapse-icon");
            icon.attr("symbol", this.COLLAPSE_ICON);
            model.collapsed = false;
            this.graph.updateChild(model, model.id);
            if (!result.length) {
              // 实际没有children数据，则置hasChildren为false并且隐藏图标
              model.hasChildren = false;
              icon.cfg.visible = false;
              this.graph.updateChild(model, model.id);
              this.$message.info("未查询到相关数据");
              return false;
            }
          } else if (target.attr("symbol") === this.COLLAPSE_ICON) {
            model.copyChildren = model.children;
            model.children = [];
            const icon = item
              .get("group")
              .find((element) => element.get("name") === "collapse-icon");
            icon.attr("symbol", this.EXPAND_ICON);
            model.collapsed = true;
            this.graph.updateChild(model, model.id);
            if (!model.hasChildren) {
              return false;
            }
            this.graph.focusItem(model.id);
          }
        }
      });

      this.graph.node((node) => {
        if (node.isTop) {
          return {
            ...node,
            type: "first-node",
          };
        } else {
          return {
            ...node,
          };
        }
        //  else if (node.isActualControl) {
        //   // 实际控制人
        //   return {
        //     ...node,
        //     type: "actual-node",
        //   };
        // }
      });

      this.graph.data(this.graphData);
      this.graph.render();
      this.graph.fitCenter();

      // 监听窗口大小变化，动态修改画布大小
      if (typeof window !== "undefined") {
        window.onresize = () => {
          if (!this.graph || this.graph.get("destroyed")) return;
          if (!dom || !dom.scrollWidth || !dom.scrollHeight) return;
          const width = dom.clientWidth;
          const height = dom.clientHeight;
          this.graph.changeSize(width, height);
        };
      }
    },

    async getTreeData() {
      //这边的id与
      this.graphData.id = this.paramsObj.uniScId;
      this.graphData.name = this.paramsObj.corpName;
      const upData = await this.getUpData(this.paramsObj.corpName, 1);
      const downData = await this.getDownData(this.paramsObj.corpName, 1);
      this.graphData.children = [
        // ...this.graphData.children,
        ...upData,
        ...downData,
      ];
      this.initGraph(this.$refs.graphDom);
    },

    async getUpData(name, depth) {
      const json = {
        name,
      };
      const result = [];
      const loading = this.$message.loading("正在查询", 0);
      try {
        const res = await getShareOwnership(json);
        loading();
        if (res.message === "成功") {
          res.data.map((item) => {
            result.push({
              ...item,
              id: item.name + "-" + depth + "-" + nanoid(5),
              showDirection: "in",
              isActualControl:
                item.isActualControl == "1" ||
                item.isActualControl == "1.0" ||
                item.isActualControl == true
                  ? true
                  : false,
              hasChildren:
                item.hasChildren == "1" ||
                item.hasChildren == "1.0" ||
                item.hasChildren == true
                  ? true
                  : false,
              percent: item.percent ? item.percent.toFixed(2) : null,
              children: [],
              copyChildren: [],
            });
          });
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        loading();
        this.$message.destroy();
        this.$message.error(error);
      } finally {
        loading();
      }
      console.log("result-getUpData", result);
      return result;
    },

    async getDownData(name, depth) {
      const json = {
        name,
      };
      const result = [];
      const loading = this.$message.loading("正在查询", 0);
      try {
        const res = await getShareInvest(json);
        if (res.message === "成功") {
          res.data.map((item) => {
            result.push({
              ...item,
              id: item.name + "-" + depth + "-" + nanoid(5),
              showDirection: "out",
              hasChildren:
                item.hasChildren == "1" ||
                item.hasChildren == "1.0" ||
                item.hasChildren == true
                  ? true
                  : false,
              nodeType: item.nodeType,
              percent: item.percent ? item.percent.toFixed(2) : null,
              children: [],
              copyChildren: [],
            });
          });
        } else {
          this.$message.error(res.message);
        }
        console.log("result-getDownData", result);
        return result;
      } catch (error) {
        loading();
        this.$message.destroy();
        this.$message.error(error);
      } finally {
        loading();
      }
    },

    // enterpriseId: "916100006949266167";
    // enterpriseName: "陕西中广传播有限公司";
    // establishTime: "2009/10/15";
    // legalPerson: "孙朝晖";
    // nameBefore: "";
    // registryMoney: "2000";
    // status: "开业";
    // 获取节点详情数据
    // async getShareNodeDetail(id) {
    //   const res = await getShareNodeDetail({
    //     id,
    //   });
    //   if (res.message === "成功") {
    //     const detailData = {
    //       id: res.data.id,
    //       name: res.data.name,
    //       money: res.data.money ? res.data.money + "万人民币" : "--",
    //       percent: res.data.percent
    //         ? res.data.percent.toFixed(2)
    //         : null,
    //       label: res.data.label,
    //       //date: res.data.establishTime || "--",
    //       //legalPerson: res.data.legalPerson || "--",
    //       //status: res.data.status,
    //     };
    //     this.detailData = detailData;
    //     this.isTooltipShow = true;
    //   } else {
    //     this.detailData = {};
    //     this.isTooltipShow = false;
    //     this.$message.error(res.message);
    //   }
    // },

    useTooltip() {
      // tooltip提示框
      const tooltip = new G6.Tooltip({
        offsetX: 30,
        offsetY: 30,
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        // itemTypes: ["node", "edge"],
        itemTypes: ["node"],
        // 是否固定出现在相对于目标节点的某个位置，鼠标在节点上方移动时不实时更新。false 代表不固定，[number, number] 类型的值用于指定固定位置，例如 [1, 0.5] 代表 tooltip 的左上角固定到目标节点的正右方（数组代表的类似 Anchor Point 的位置定义）。仅在节点上生效
        // fixToNode: [1, 0],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          const outDiv = document.createElement("div");
          outDiv.style.width = "fit-content";
          outDiv.style.padding = "8px";
          outDiv.innerHTML = `
              <div >
                <p style="font-size: 14px; font-weight: 600; color: #3C485C; margin-bottom: 8px;">投资关系</p>
                <div style="height: 20px; line-height: 20px; font-size: 14px; color: #97A3B7; margin-bottom: 8px;">持股比例：<span style="color:#3C485C">${this.detailData.percent}%</span></div>
                <div style="height: 20px; line-height: 20px; font-size: 14px; color: #97A3B7; ">认缴出资：<span style="color:#3C485C">${this.detailData.money}</span></div>
              </div>
        `;
          return outDiv;
        },
        shouldBegin: (e) => {
          const model = e.item.getModel();
          if (
            JSON.stringify(this.detailData) === "{}" ||
            this.detailData.id !== model.id
          ) {
            return false;
          } else {
            return this.isTooltipShow;
          }
          // if (
          //   model.nodeType !== "enterprise" ||
          //   JSON.stringify(this.detailData) === "{}" ||
          //   this.detailData.id !== model.id
          // ) {
          //   return false;
          // } else {
          //   return this.isTooltipShow;
          // }
        },
      });

      return tooltip;
    },
  },
  mounted() {
    this.getTreeData();
    // this.initGraph(this.$refs.graphDom);
  },
};
</script>
<style lang="less">
.stock-graph {
  width: 100%;
  height: calc(100vh - 272px);
  background: #f7faff;
  display: flex;

  &-content {
    width: 100%;
    height: 100%;
  }

  &-filter {
    top: 131px;
    right: 50px;
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
