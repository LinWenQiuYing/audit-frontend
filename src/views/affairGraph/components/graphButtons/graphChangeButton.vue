<template>
  <div class="graph-change-button">
    <a-select
      class="graph-obj"
      :value="graphValue"
      @change="handleChangeGraph"
      placeholder="请选择图谱"
    >
      <template slot="suffixIcon">
        <a-icon type="swap" :rotate="90" />
      </template>
      <a-select-option
        v-for="item in graphOptions"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import { Icon } from "ant-design-vue";
import { mapState, mapMutations } from "vuex";
import { queryGraphList } from "@/shared/api/configManage.js";
import { find } from "lodash";

export default {
  name: "GraphChangeButton",
  data() {
    return {
      graphOptions: [],
      graphValue: undefined,
    };
  },
  components: {
    AIcon: Icon,
  },
  computed: {
    ...mapState("graphOptions", ["graphId"]),
  },
  async mounted() {
    this.getGraphList();
  },
  methods: {
    ...mapMutations("graphOptions", {
      setBranchId: "setBranchId",
      setGraphId: "setGraphId",
    }),
    handleChangeGraph(value) {
      this.graphValue = value;
      const target = find(this.graphOptions, (v) => v.value === value);
      this.$emit("changeGraph", value, target.branchId);
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
        this.graphOptions = graphOptions;

        if (graphOptions.length) {
          this.setBranchId(graphOptions[0].branchId);
          this.setGraphId(graphOptions[0].value);
          sessionStorage.setItem("branchId", graphOptions[0].branchId);
          sessionStorage.setItem("graphId", graphOptions[0].value);
          this.graphValue = graphOptions[0].value;
        } else {
          this.$message.error("暂无可用图谱数据");
          this.setBranchId(undefined);
          this.setGraphId(undefined);
          sessionStorage.setItem("branchId", undefined);
          sessionStorage.setItem("graphId", undefined);
          this.graphValue = undefined;
        }
      }
    },
  },
};
</script>
<style lang="less">
.graph-change-button {
  left: 24px;
  top: 53px;
  width: 280px;
  position: absolute;

  .graph-obj {
    width: 100%;

    .ant-select-selection {
      .ant-select-arrow {
        top: 0;
        right: 0;
        margin: 0;
        width: 30px;
        height: 100%;
        color: #fff;
        display: flex;
        align-items: center;
        background: @activeFontColor;
        justify-content: center;
      }
    }
  }
}
</style>
