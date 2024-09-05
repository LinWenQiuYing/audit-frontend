<template>
  <div class="assert-drawer">
    <!-- <div @click="showDrawer = true">资产详情</div> -->
    <a-drawer
      :visible="showDrawer"
      @close="closeDrawer"
      :width="1300"
      placement="right"
      :closable="false"
      class="assert-drawer-content"
    >
      <template #title>
        <span style="font-weight: bold; font-size: 20px">资产卡片详情</span>
        <a-button @click="closeDrawer">关闭</a-button>
      </template>
      <div class="text-content">
        <div class="sub-title">基本信息</div>
        <div class="basic-info">
          <div
            v-for="(item, index) in dataSource1"
            :key="index"
            class="basic-info-item"
          >
            <div class="basic-info-item-label">{{ item.label }}</div>
            <div class="basic-info-item-value">{{ item.value }}</div>
          </div>
        </div>
        <div class="sub-title">详细信息</div>
        <div class="specific-info">
          <div
            v-for="(item, index) in dataSource2"
            :key="index"
            class="specific-info-item"
          >
            <div class="specific-info-item-label">{{ item.label }}</div>
            <div class="specific-info-value">{{ item.value }}</div>
          </div>
        </div>
      </div>
      <div class="sub-title">资产变动记录</div>
      <a-table
        :dataSource="dataSource3"
        :columns="columns3"
        rowKey="id"
        :pagination="pagination1"
        :loading="tableLoading1"
        :bordered="true"
        :scroll="{ x: 'max-content', y: 480 }"
        style="margin-bottom: 20px"
      />
      <div class="sub-title">资产处置记录</div>
      <a-table
        :dataSource="dataSource4"
        :columns="columns4"
        rowKey="id"
        :pagination="pagination2"
        :loading="tableLoading2"
        :bordered="true"
        :scroll="{ x: 'max-content', y: 480 }"
      />
    </a-drawer>
  </div>
</template>
<script>
import {
  getAssertsDrawerFour,
  getAssertsDrawerOne,
  getAssertsDrawerThree,
  getAssertsDrawerTwo,
} from "@/shared/newApi/assertsAnalysis/assertsCard.js";
import { Button, Drawer, Table } from "ant-design-vue";
export default {
  name: "AssertDrawer",
  props: {
    drawerInfo: {
      type: String,
      default: "",
    },
    showDrawer: {
      type: Boolean,
      default: false,
    },
    // title: {
    //   type: String,
    //   default: "抽屉标题",
    // },
    position: {
      type: String,
      default: "right", // 'left', 'right', 'top', 'bottom'
    },
  },
  data() {
    return {
      // 预算单位编码
      unitCode: "",
      // 资产编号
      assetNo: "",
      // 抽屉具体种类 // 房产、土地、车辆、其他
      assetType: "",
      //   showDrawer: false,
      dataSource1: [
        // { label: "资产编号：", value: "xxx" },
        // { label: "资产原值：", value: "xxx" },
        // { label: "业务序列：", value: "xxx" },
        // { label: "资产分类代码：", value: "xxx" },
        // { label: "资产名称：", value: "xxx" },
        // { label: "净值：", value: "xxx" },
        // { label: "取得方式代码：", value: "xxx" },
        // { label: "资产分类名称：", value: "xxx" },
        // { label: "单位代码：", value: "xxx" },
        // { label: "数量或面积：", value: "xxx" },
        // { label: "取得方式名称：", value: "xxx" },
        // { label: "资产大类：", value: "xxx" },
        // { label: "单位名称：", value: "xxx" },
        // { label: "数量计量单位：", value: "xxx" },
        // { label: "投入使用日期：", value: "xxx" },
        // { label: "国标大类：", value: "xxx" },
        // { label: "卡片类型：", value: "xxx" },
        // { label: "均价或单价：", value: "xxx" },
        // { label: "处置时间：", value: "xxx" },
        // { label: "财政区划编码：", value: "xxx" },
        // { label: "卡片状态：", value: "xxx" },
        // { label: "记账凭证号：", value: "xxx" },
        // { label: "处置形式代码：", value: "xxx" },
        // { label: "财政区划名称：", value: "xxx" },
        // { label: "审核状态：", value: "xxx" },
        // { label: "记账日期：", value: "xxx" },
        // { label: "处置收益：", value: "xxx" },
        // { label: "资产主键：", value: "xxx" },
        // { label: "是否最新：", value: "xxx" },
        // { label: "资产用途代码：", value: "xxx" },
        // { label: "", value: "" },
        // { label: "业务唯一标识：", value: "xxx" },
      ],
      dataSource2: [
        // { label: "权属性质代码：", value: "xxx" },
        // { label: "独用面积：", value: "xxx" },
        // { label: "在用价值：", value: "xxx" },
        // { label: "竣工决算日期：", value: "xxx" },
        // { label: "产权形式代码：", value: "xxx" },
        // { label: "分摊面积：", value: "xxx" },
        // { label: "出租价值：：", value: "xxx" },
        // { label: "建筑结构：", value: "xxx" },
        // { label: "权属证明：", value: "xxx" },
        // { label: "坐落位置：", value: "xxx" },
        // { label: "出借价值：", value: "xxx" },
        // { label: "危房面积：", value: "xxx" },
        // { label: "发证日期：", value: "xxx" },
        // { label: "在用面积：", value: "xxx" },
        // { label: "闲置价值：", value: "xxx" },
        // { label: "取暖面积：", value: "xxx" },
        // { label: "权属证号：", value: "xxx" },
        // { label: "出租面积：", value: "xxx" },
        // { label: "待处置待报废或毁损等价值：", value: "xxx" },
        // { label: "占地面积：", value: "xxx" },
        // { label: "权属面积：", value: "xxx" },
        // { label: "出借面积：", value: "xxx" },
        // { label: "", value: "" },
        // { label: "住宅套数：", value: "xxx" },
        // { label: "权属人：", value: "xxx" },
        // { label: "闲置面积：", value: "xxx" },
        // { label: "", value: "" },
        // { label: "项目总投资：", value: "xxx" },
        // { label: "使用权类型：", value: "xxx" },
        // { label: "待处置待报废或毁损等面积：", value: "xxx" },
        // { label: "", value: "" },
        // { label: "交付使用日期：", value: "xxx" },
      ],
      columns3: [
        {
          title: "创建时间",
          dataIndex: "cjsj",
          key: "cjsj",
          width: 70,
        },
        {
          title: "创建人姓名",
          dataIndex: "cjrxm",
          key: "cjrxm",
          width: 70,
        },
        {
          title: "变动原因",
          dataIndex: "bdyy",
          key: "bdyy",
          width: 70,
        },
        {
          title: "申请日期",
          dataIndex: "sqrq",
          key: "sqrq",
          width: 70,
        },
        {
          title: "单据编号",
          dataIndex: "djbh",
          key: "djbh",
          width: 70,
        },
        {
          title: "单据状态",
          dataIndex: "djzt",
          key: "djzt",
          width: 70,
        },
        {
          title: "制单人",
          dataIndex: "zdr",
          key: "zdr",
          width: 70,
        },
      ],
      dataSource3: [
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   bdyy: "示例内容", // 变动原因
        //   sqrq: "示例内容", // 申请日期
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   zdr: "示例内容", // 制单人
        // },
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   bdyy: "示例内容", // 变动原因
        //   sqrq: "示例内容", // 申请日期
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   zdr: "示例内容", // 制单人
        // },
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   bdyy: "示例内容", // 变动原因
        //   sqrq: "示例内容", // 申请日期
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   zdr: "示例内容", // 制单人
        // },
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   bdyy: "示例内容", // 变动原因
        //   sqrq: "示例内容", // 申请日期
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   zdr: "示例内容", // 制单人
        // },
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   bdyy: "示例内容", // 变动原因
        //   sqrq: "示例内容", // 申请日期
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   zdr: "示例内容", // 制单人
        // },
      ],
      columns4: [
        {
          title: "创建时间",
          dataIndex: "cjsj",
          key: "cjsj",
          width: 70,
        },
        {
          title: "创建人姓名",
          dataIndex: "cjrxm",
          key: "cjrxm",
          width: 70,
        },
        {
          title: "处置形式代码",
          dataIndex: "czxsdm",
          key: "czxsdm",
          width: 70,
        },
        {
          title: "接收或置换方代码",
          dataIndex: "jshzhfdm",
          key: "jshzhfdm",
          width: 70,
        },
        {
          title: "单据编号",
          dataIndex: "djbh",
          key: "djbh",
          width: 70,
        },
        {
          title: "单据状态",
          dataIndex: "djzt",
          key: "djzt",
          width: 70,
        },
        {
          title: "备注",
          dataIndex: "bz",
          key: "bz",
          width: 70,
        },
      ],
      dataSource4: [
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   czxsdm: "示例内容", // 处置形式代码
        //   jshzhfdm: "示例内容", // 接收或置换方代码
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   bz: "示例内容", // 备注
        // },
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   czxsdm: "示例内容", // 处置形式代码
        //   jshzhfdm: "示例内容", // 接收或置换方代码
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   bz: "示例内容", // 备注
        // },
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   czxsdm: "示例内容", // 处置形式代码
        //   jshzhfdm: "示例内容", // 接收或置换方代码
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   bz: "示例内容", // 备注
        // },
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   czxsdm: "示例内容", // 处置形式代码
        //   jshzhfdm: "示例内容", // 接收或置换方代码
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   bz: "示例内容", // 备注
        // },
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   czxsdm: "示例内容", // 处置形式代码
        //   jshzhfdm: "示例内容", // 接收或置换方代码
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   bz: "示例内容", // 备注
        // },
        // {
        //   cjsj: "示例内容", // 创建时间
        //   cjrxm: "示例内容", // 创建人姓名
        //   czxsdm: "示例内容", // 处置形式代码
        //   jshzhfdm: "示例内容", // 接收或置换方代码
        //   djbh: "示例内容", // 单据编号
        //   djzt: "示例内容", // 单据状态
        //   bz: "示例内容", // 备注
        // },
      ],

      //分页
      tableLoading1: false,
      pagination1: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["20", "50", "100"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination1.current = page;
          this.pagination1.pageSize = pageSize;
          this.getAssertsDrawerThree();
        },
        onShowSizeChange: (current, size) => {
          this.pagination1.current = current;
          this.pagination1.pageSize = size;
          this.getAssertsDrawerThree();
        },
      },
      tableLoading2: false,
      pagination2: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["20", "50", "100"],
        showTotal: (total) => {
          return `共${total}条记录`;
        },
        onChange: (page, pageSize) => {
          this.pagination2.current = page;
          this.pagination2.pageSize = pageSize;
          this.getAssertsDrawerFour();
        },
        onShowSizeChange: (current, size) => {
          this.pagination2.current = current;
          this.pagination2.pageSize = size;
          this.getAssertsDrawerFour();
        },
      },
    };
  },
  watch: {
    showDrawer: {
      immediate: true,
      handler(val) {
        // this.$emit('input',val)
        console.log("showDrawer值改变", val);
      },
    },
    drawerInfo: {
      // immediate: true,
      handler(val) {
        // this.$emit('input',val)
        console.log("抽屉组件内部   assetNo值改变", val);
        this.unitCode = val.split("+")[0] == "null" ? null : val.split("+")[0];
        this.assetNo = val.split("+")[1];
        this.assetType = val.split("+")[2];
        console.log(
          "抽屉组件内部  assetNo值改变",
          this.unitCode,
          this.assetNo,
          this.assetType
        );
        this.dataSource1 = [];
        this.dataSource2 = [];
        this.dataSource3 = [];
        this.dataSource4 = [];
        this.getAssertsDrawerOne();
        this.getAssertsDrawerTwo();
        this.getAssertsDrawerThree();
        this.getAssertsDrawerFour();
      },
    },
  },
  components: {
    ADrawer: Drawer,
    AButton: Button,
    ATable: Table,
  },
  methods: {
    closeDrawer() {
      this.$emit("closeAssertDrawer");
    },

    //基本信息
    async getAssertsDrawerOne() {
      const json = {
        unitCode: this.unitCode, //预算单位编码
        assetNo: this.assetNo, //资产编号
        assetType: this.assetType, // 房产、土地、车辆、其他
      };
      const res = await getAssertsDrawerOne(json);
      if (res.message === "成功") {
        console.log("message成功 抽屉基本信息 ", res.data);
        this.dataSource1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //详细信息
    async getAssertsDrawerTwo() {
      const json = {
        unitCode: this.unitCode, //预算单位编码
        assetNo: this.assetNo, //资产编号
        assetType: this.assetType, // 房产、土地、车辆、其他
      };
      const res = await getAssertsDrawerTwo(json);
      if (res.message === "成功") {
        console.log("message成功 抽屉详细信息 ", res.data);
        this.dataSource2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //资产变动记录
    async getAssertsDrawerThree() {
      const json = {
        unitCode: this.unitCode, //预算单位编码
        assetNo: this.assetNo, //资产编号
        pageSize: this.pagination1.pageSize, //页面大小
        pageOffset: this.pagination1.pageSize * (this.pagination1.current - 1), //偏移量
      };
      this.tableLoading1 = true;
      const res = await getAssertsDrawerThree(json);
      this.tableLoading1 = false;
      if (res.message === "成功") {
        console.log("message成功 抽屉资产变动记录 ", res.data);
        this.dataSource3 = res.data.dateList;
        this.pagination1.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },

    //资产处置记录
    async getAssertsDrawerFour() {
      const json = {
        unitCode: this.unitCode, //预算单位编码
        assetNo: this.assetNo, //资产编号
        pageSize: this.pagination2.pageSize, //页面大小
        pageOffset: this.pagination2.pageSize * (this.pagination1.current - 1), //偏移量
      };
      this.tableLoading2 = true;
      const res = await getAssertsDrawerFour(json);
      this.tableLoading2 = false;
      if (res.message === "成功") {
        console.log("message成功 抽屉资产处置记录 ", res.data);
        this.dataSource4 = res.data.dateList;
        this.pagination2.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },
  },
};
</script>

<style lang="less">
.assert-drawer {
  width: 100%;
}

.assert-drawer-content {
  .ant-drawer-content-wrapper {
    .ant-drawer-content {
      .ant-drawer-wrapper-body {
        .ant-drawer-header {
          position: fixed;
          width: 1300px;
          .ant-drawer-title {
            display: flex;
            justify-content: space-between;
          }
        }
        .ant-drawer-body {
          .text-content {
            width: 100%;

            /* padding: 16px; */

            .basic-info,
            .specific-info {
              width: 100%;
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              margin-bottom: 20px;
              row-gap: 16px; /* 设置行间隔为16px */

              &-item {
                display: flex;
                align-items: center;
                &-label {
                  color: #97a3b7;
                }

                &-value {
                  color: #3c485c;
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
