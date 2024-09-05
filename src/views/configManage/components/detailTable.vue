<template>
  <div class="detail-table">
    <div class="sub-title" v-show="tableTitle">{{ tableTitle }}</div>
    <div class="business-table-content">
      <slot name="searchOption"></slot>
      <a-table
        :columns="columns"
        :data-source="infoData"
        :pagination="pagination"
        :class="tableClass"
        :rowKey="(record) => record.index"
        :loading="tableLoading"
        bordered
      >
      </a-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "DetailTable",
  props: [
    "tableTitle",
    "columns",
    "infoData",
    "pagination",
    "tableClass",
    "tableLoading",
  ],
  data() {
    return {};
  },
  mounted() {},
  components: {},
  methods: {},
};
</script>
<style lang="less">
.detail-table {
  position: relative;
}
</style>
