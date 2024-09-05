<template>
  <div class="financial-analysis">
    <MainContent title="财务分析">
      <template slot="right">
        <a-select
          placeholder="请选择"
          v-model="curYear"
          :options="yearOptions"
          :class="[isDisplay ? 'select-display' : '']"
        />
        <!-- @change="handleYearChange" -->
      </template>
      <template slot="content">
        <router-view></router-view>
      </template>
    </MainContent>
  </div>
</template>
<script>
import MainContent from "@/components/mainContent";
import { mapMutations, mapState } from "vuex";

export default {
  name: "financialAnalysis",
  data() {
    return {
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
      isDisplay: false,
    };
  },
  mounted() {
    console.log("7a8sa7s7a8s8a", this.$route.path);
    // 判断是否以指定的前缀开头
    if (this.$route.path.startsWith("/financial-analysis")) {
      // 如果以 '/financial-analysis' 开头
      this.isDisplay = true;
    }
  },
  components: {
    // AssertsMain,
    MainContent,
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    curYear: {
      get() {
        return this.blockChoosedYear;
      },
      set(val) {
        this.setBlockChoosedYear(val);
      },
    },
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setBlockChoosedYear: "setBlockChoosedYear",
    }),
    handleYearChange() {
      console.log("handleYearChange");
    },
  },
};
</script>
<style lang="less">
.financial-analysis {
  width: 100%;
  height: 100%;

  .select-display {
    display: none;
  }
}
</style>
