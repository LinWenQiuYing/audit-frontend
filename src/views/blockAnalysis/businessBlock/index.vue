<template>
  <div class="business-block">
    <div class="business-block-content">
      <!-- <BlockOverview></BlockOverview> -->
      <div class="block-overview">
        <div class="block-overview-left">
          <div class="block-overview-left-header">
            <div class="header-icon">
              <icon-svg icon-class="block-overview" />
            </div>
            <span class="header-title">全市概览</span>
          </div>
          <div class="block-overview-left-content">
            <div class="content-item">
              <span class="content-item-left"
                >主管单位数量：{{
                  overviewParams.businessNum.toLocaleString()
                }}家</span
              >
              <div class="content-item-right">
                <span class="content-item-right-value">{{
                  overviewParams.businessPer
                }}</span>
                <icon-svg
                  icon-class="icon-up"
                  color="red"
                  v-if="overviewParams.businessStatus === 1"
                />
                <icon-svg
                  icon-class="icon-down"
                  color="#1BB46D"
                  v-else-if="overviewParams.businessStatus === 0"
                />
                <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
              </div>
            </div>
            <div class="content-item">
              <span class="content-item-left"
                >预算单位数量：{{
                  overviewParams.budgetNum.toLocaleString()
                }}家</span
              >
              <div class="content-item-right">
                <span class="content-item-right-value">{{
                  overviewParams.budgetPer
                }}</span>
                <icon-svg
                  icon-class="icon-up"
                  color="red"
                  v-if="overviewParams.budgetMoneyStatus === 1"
                />
                <icon-svg
                  icon-class="icon-down"
                  color="#1BB46D"
                  v-else-if="overviewParams.budgetMoneyStatus === 0"
                />
                <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
              </div>
            </div>
            <div class="content-item">
              <span class="content-item-left"
                >项目数量：{{
                  overviewParams.projectNum.toLocaleString()
                }}个</span
              >
              <div class="content-item-right">
                <span class="content-item-right-value">{{
                  overviewParams.projectPer
                }}</span>
                <icon-svg
                  icon-class="icon-up"
                  color="red"
                  v-if="overviewParams.projectStatus === 1"
                />
                <icon-svg
                  icon-class="icon-down"
                  color="#1BB46D"
                  v-else-if="overviewParams.projectStatus === 0"
                />
                <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
              </div>
            </div>
            <div class="content-item">
              <span class="content-item-left"
                >预算金额：{{
                  overviewParams.budgetMoney.toLocaleString()
                }}万元</span
              >
              <div class="content-item-right">
                <span class="content-item-right-value"
                  >{{ overviewParams.budgetMoneyPer }}%</span
                >
                <icon-svg
                  icon-class="icon-up"
                  color="red"
                  v-if="overviewParams.budgetMoneyStatus === 1"
                />
                <icon-svg
                  icon-class="icon-down"
                  color="#1BB46D"
                  v-else-if="overviewParams.budgetMoneyStatus === 0"
                />
                <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
              </div>
            </div>
            <div class="content-item">
              <span class="content-item-left"
                >执行金额:
                {{ overviewParams.executeMoney.toLocaleString() }}万元</span
              >
              <div class="content-item-right">
                <span class="content-item-right-value"
                  >{{ overviewParams.executeMoneyPer }}%</span
                >
                <icon-svg
                  icon-class="icon-up"
                  color="red"
                  v-if="overviewParams.executeMoneyStatus === 1"
                />
                <icon-svg
                  icon-class="icon-down"
                  color="#1BB46D"
                  v-else-if="overviewParams.executeMoneyStatus === 0"
                />
                <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
              </div>
            </div>
            <div class="content-item">
              <span class="content-item-left"
                >执行率: {{ overviewParams.executePer }}%</span
              >
              <div class="content-item-right">
                <span class="content-item-right-value"
                  >{{ overviewParams.executePerPer }}%</span
                >
                <icon-svg
                  icon-class="icon-up"
                  color="red"
                  v-if="overviewParams.executePerStatus === 1"
                />
                <icon-svg
                  icon-class="icon-down"
                  color="#1BB46D"
                  v-else-if="overviewParams.executePerStatus === 0"
                />
                <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
              </div>
            </div>
            <div class="content-item">
              <span class="content-item-left"
                >五年内未审计单位数量：{{
                  overviewParams.noAuditNum.toLocaleString()
                }}家</span
              >
              <div class="content-item-right">
                <span class="content-item-right-value">{{
                  overviewParams.noAuditPer
                }}</span>
                <icon-svg
                  icon-class="icon-up"
                  color="red"
                  v-if="overviewParams.noAuditStatus === 1"
                />
                <icon-svg
                  icon-class="icon-down"
                  color="#1BB46D"
                  v-else-if="overviewParams.noAuditStatus === 0"
                />
                <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
              </div>
            </div>
            <div class="content-item">
              <span class="content-item-left"
                >从未审计单位数量:
                {{ overviewParams.neverNum.toLocaleString() }}家</span
              >
              <div class="content-item-right">
                <span class="content-item-right-value">{{
                  overviewParams.neverPer
                }}</span>
                <icon-svg
                  icon-class="icon-up"
                  color="red"
                  v-if="overviewParams.neverStatus === 1"
                />
                <icon-svg
                  icon-class="icon-down"
                  color="#1BB46D"
                  v-else-if="overviewParams.neverStatus === 0"
                />
                <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
              </div>
            </div>
          </div>
        </div>
        <div class="block-overview-right">
          <div class="block-overview-right-container"></div>
          <div class="block-overview-right-row" style="margin-bottom: 15px">
            <div
              :class="[
                'block-overview-right-item',
                {
                  'block-overview-right-item-active': choosedBlockId.includes(
                    item.id
                  ),
                },
              ]"
              v-for="(item, index) in blockParams.slice(
                0,
                Math.ceil(blockParams.length / 2)
              )"
              :key="index"
              @click="handleClick(item)"
            >
              <div class="item-header">{{ item.name }}</div>
              <div class="item-content">
                <div class="item-content-left">
                  <div class="left-label">
                    <div class="left-label-key">
                      主管单位数量：{{ item.businessNum.toLocaleString() }}
                    </div>
                    <div style="margin-left: 15px">{{ item.businessPer }}</div>
                    <div class="left-label-per">
                      <icon-svg
                        icon-class="icon-up"
                        color="red"
                        v-if="item.businessStatus === 1"
                      />
                      <icon-svg
                        icon-class="icon-down"
                        color="#1BB46D"
                        v-else-if="item.businessStatus === 0"
                      />
                      <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
                    </div>
                  </div>
                  <div class="left-label">
                    <div class="left-label-key">
                      预算单位数量：{{ item.budgetNum.toLocaleString() }}
                    </div>
                    <div style="margin-left: 15px">{{ item.budgetPer }}</div>
                    <div class="left-label-per">
                      <icon-svg
                        icon-class="icon-up"
                        color="red"
                        v-if="item.budgetStatus === 1"
                      />
                      <icon-svg
                        icon-class="icon-down"
                        color="#1BB46D"
                        v-else-if="item.budgetStatus === 0"
                      />
                      <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
                    </div>
                  </div>
                  <div class="left-label">
                    <div class="left-label-key">
                      项目数量：{{ item.projectNum.toLocaleString() }}
                    </div>
                    <div style="margin-left: 15px">{{ item.projectPer }}</div>
                    <div class="left-label-per">
                      <icon-svg
                        icon-class="icon-up"
                        color="red"
                        v-if="item.projectStatus === 1"
                      />
                      <icon-svg
                        icon-class="icon-down"
                        color="#1BB46D"
                        v-else-if="item.projectStatus === 0"
                      />
                      <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
                    </div>
                  </div>
                  <div class="left-label">
                    <div class="left-label-key">
                      五年内未审计单位数量：{{
                        item.noAuditNum.toLocaleString()
                      }}
                    </div>
                    <div style="margin-left: 15px">{{ item.noAuditPer }}</div>
                    <div class="left-label-per">
                      <icon-svg
                        icon-class="icon-up"
                        color="red"
                        v-if="item.noAuditStatus === 1"
                      />
                      <icon-svg
                        icon-class="icon-down"
                        color="#1BB46D"
                        v-else-if="item.noAuditStatus === 0"
                      />
                      <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
                    </div>
                  </div>
                  <div class="left-label">
                    <div class="left-label-key">
                      从未审计单位数量：{{ item.neverNum.toLocaleString() }}
                    </div>
                    <div style="margin-left: 15px">{{ item.neverPer }}</div>
                    <div class="left-label-per">
                      <icon-svg
                        icon-class="icon-up"
                        color="red"
                        v-if="item.neverStatus === 1"
                      />
                      <icon-svg
                        icon-class="icon-down"
                        color="#1BB46D"
                        v-else-if="item.neverStatus === 0"
                      />
                      <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
                    </div>
                  </div>
                </div>
                <div class="item-content-right">
                  <img
                    class="qixinbao-modal-title-icon"
                    :src="require(`@/assets/images/img/${index}.png`)"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="block-overview-right-row">
            <div
              :class="[
                'block-overview-right-item',
                {
                  'block-overview-right-item-active': choosedBlockId.includes(
                    item.id
                  ),
                },
              ]"
              v-for="(item, index) in blockParams.slice(
                Math.ceil(blockParams.length / 2)
              )"
              :key="index"
              @click="handleClick(item)"
            >
              <div class="item-header">{{ item.name }}</div>
              <div class="item-content">
                <div class="item-content-left">
                  <div class="left-label">
                    <div class="left-label-key">
                      主管单位数量：{{ item.businessNum.toLocaleString() }}
                    </div>
                    <div style="margin-left: 15px">{{ item.businessPer }}</div>
                    <div class="left-label-per">
                      <icon-svg
                        icon-class="icon-up"
                        color="red"
                        v-if="item.businessStatus === 1"
                      />
                      <icon-svg
                        icon-class="icon-down"
                        color="#1BB46D"
                        v-else-if="item.businessStatus === 0"
                      />
                      <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
                    </div>
                  </div>
                  <div class="left-label">
                    <div class="left-label-key">
                      预算单位数量：{{ item.budgetNum.toLocaleString() }}
                    </div>
                    <div style="margin-left: 15px">{{ item.budgetPer }}</div>
                    <div class="left-label-per">
                      <icon-svg
                        icon-class="icon-up"
                        color="red"
                        v-if="item.budgetStatus === 1"
                      />
                      <icon-svg
                        icon-class="icon-down"
                        color="#1BB46D"
                        v-else-if="item.budgetStatus === 0"
                      />
                      <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
                    </div>
                  </div>
                  <div class="left-label">
                    <div class="left-label-key">
                      项目数量：{{ item.projectNum.toLocaleString() }}
                    </div>
                    <div style="margin-left: 15px">{{ item.projectPer }}</div>
                    <div class="left-label-per">
                      <icon-svg
                        icon-class="icon-up"
                        color="red"
                        v-if="item.projectStatus === 1"
                      />
                      <icon-svg
                        icon-class="icon-down"
                        color="#1BB46D"
                        v-else-if="item.projectStatus === 0"
                      />
                      <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
                    </div>
                  </div>
                  <div class="left-label">
                    <div class="left-label-key">
                      五年内未审计单位数量：{{
                        item.noAuditNum.toLocaleString()
                      }}
                    </div>
                    <div style="margin-left: 15px">{{ item.noAuditPer }}</div>
                    <div class="left-label-per">
                      <icon-svg
                        icon-class="icon-up"
                        color="red"
                        v-if="item.noAuditStatus === 1"
                      />
                      <icon-svg
                        icon-class="icon-down"
                        color="#1BB46D"
                        v-else-if="item.noAuditStatus === 0"
                      />
                      <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
                    </div>
                  </div>
                  <div class="left-label">
                    <div class="left-label-key">
                      从未审计单位数量：{{ item.neverNum.toLocaleString() }}
                    </div>
                    <div style="margin-left: 15px">{{ item.neverPer }}</div>
                    <div class="left-label-per">
                      <icon-svg
                        icon-class="icon-up"
                        color="red"
                        v-if="item.neverStatus === 1"
                      />
                      <icon-svg
                        icon-class="icon-down"
                        color="#1BB46D"
                        v-else-if="item.neverStatus === 0"
                      />
                      <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
                    </div>
                  </div>
                </div>
                <div class="item-content-right">
                  <img
                    class="qixinbao-modal-title-icon"
                    :src="
                      require(`@/assets/images/img/${
                        index + Math.ceil(blockParams.length / 2)
                      }.png`)
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LayoutBtns></LayoutBtns>
      <SpendCondition v-if="spendingShow" ref="childRef1"></SpendCondition>
      <ThreePublic v-if="threePublicShow" ref="childRef2"></ThreePublic>
      <NoTax v-if="noTaxShow" ref="childRef3"></NoTax>
      <AssertsCondition v-if="assertsShow" ref="childRef4"></AssertsCondition>
      <AuditSituation v-if="auditShow" ref="childRef5"></AuditSituation>
    </div>
    <!-- <div>{{ choosedBlockName }}</div> -->
    <a-popover
      trigger="click"
      placement="leftTop"
      overlayClassName="block-popover"
      :visible="isPopoverVisible"
      @visibleChange="handleVisibleChange"
    >
      <template slot="content">
        <div class="fixed-content">
          <div class="fixed-content-title">已选板块</div>
          <div
            v-for="item in choosedBlockName"
            :key="item"
            class="fixed-content-item"
          >
            {{ item }}
          </div>
        </div>
      </template>
      <div class="fixed-icon">
        <icon-svg icon-class="choose-block" />
      </div>
    </a-popover>
  </div>
</template>
<script>
import { Popover } from "ant-design-vue";
import AssertsCondition from "./assertsCondition.vue";
import AuditSituation from "./auditSituation.vue";
// import BlockOverview from "./components/blockOverview.vue";
import { getOverviewData } from "@/shared/newApi/block/block.js";
import { mapMutations, mapState } from "vuex";
import LayoutBtns from "./components/layoutBtns.vue";
import NoTax from "./noTax.vue";
import SpendCondition from "./spendCondition.vue";
import ThreePublic from "./threePublic.vue";

export default {
  name: "BusinessBlock",

  data() {
    return {
      isContentShow: false,
      isPopoverVisible: true, // 默认展开
      fromRoute: null, //从哪边跳转过来

      overviewParams: {
        // budgetMoney: 5000, //预算金额
        // budgetMoneyPer: 10,
        // budgetMoneyStatus: 1,
        // budgetNum: 2540, //预算单位数量
        // budgetPer: 10,
        // budgetStatus: 1,
        // executeMoney: 4500, //执行金额
        // executeMoneyPer: 8,
        // executeMoneyStatus: 0,
        // executePer: 90, //执行率
        // executePerPer: 5,
        // executePerStatus: 0,
        // neverNum: 30, //从未审计单位数量
        // neverPer: 10,
        // neverStatus: 0,
        // noAuditNum: 80, //五年内从未审计单位数量
        // noAuditPer: 10,
        // noAuditStatus: 1,
        // businessNum: 280, //主管单位数量
        // businessPer: 10,
        // businessStatus: 1,
        // projectNum: 5000, //项目数量
        // projectPer: 300,
        // projectStatus: 1,
        // name: "全市概况",
      },
      blockParams: [
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "1",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "国企",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "2",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "农业",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "3",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "自然资源和生态环境",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "4",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "债务",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "5",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "行政政法",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "6",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "社会保障",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "7",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "预算",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "8",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "政府采购管理",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "9",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "教科文",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "10",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "经济建设",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "11",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "涉外经济（金融）",
        // },
        // {
        //   budgetNum: 200,
        //   budgetPer: 10,
        //   budgetStatus: 1,
        //   id: "12",
        //   neverNum: 10,
        //   neverPer: 5,
        //   neverStatus: 0,
        //   noAuditNum: 20,
        //   noAuditPer: 5,
        //   noAuditStatus: 0,
        //   businessNum: 200,
        //   businessPer: 10,
        //   businessStatus: 1,
        //   projectNum: 200,
        //   projectPer: 5,
        //   projectStatus: 0,
        //   name: "企业",
        // },
      ],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log("板块分析页面记录路由从哪里过来的", to, from);
      console.log("赋值前", vm.fromRoute);
      // 通过 `vm` 访问组件实例
      if (from) {
        vm.fromRoute = from.name;
      }
      console.log("赋值后", vm.fromRoute);
    });
  },
  components: {
    AuditSituation,
    APopover: Popover,
    // BlockOverview,
    LayoutBtns,
    SpendCondition,
    ThreePublic,
    NoTax,
    AssertsCondition,
  },
  computed: {
    ...mapState("blockAnalysis", [
      "spendingShow",
      "threePublicShow",
      "noTaxShow",
      "assertsShow",
      "auditShow",
      "choosedBlockName",
      "choosedBlockId",
      "blockChoosedYear",
    ]),
  },
  watch: {
    // $route: {
    //   handler(to, from) {
    //     console.log("板块分析页面记录路由从哪里过来的", to, from);
    //     console.log("路由从哪里过来", from.fullPath);
    //     console.log("路由变化到", to.fullPath);
    //     // 可以在这里做一些处理，比如：
    //     const url = to.path.slice(1);
    //     console.log("新路由的路径", url);
    //   },
    //   immediate: true, // 立即执行一次处理函数
    // },
    // choosedBlockId: {
    //   handler(newVal, oldVal) {
    //     const name = this.$route.name;
    //     // console.log("this.$route", this.$route);
    //     console.log("5656555", newVal, oldVal);
    //     if (name === "blockAnalysis") {
    //       if (this.spendingShow) {
    //         this.$refs.childRef1.initAllCharts();
    //       } else if (this.threePublicShow) {
    //         this.$refs.childRef2.initAllCharts();
    //       } else if (this.noTaxShow) {
    //         this.$refs.childRef3.initAllCharts();
    //       } else if (this.assertsShow) {
    //         this.$refs.childRef4.initAllCharts();
    //       }
    //     }
    //   },
    //   deep: true,
    // },
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setChoosedBlockName: "setChoosedBlockName",
      setChoosedBlockId: "setChoosedBlockId",
      setSpendingShow: "setSpendingShow",
      setThreePublicShow: "setThreePublicShow",
      setNoTaxShow: "setNoTaxShow",
      setAssertsShow: "setAssertsShow",
      setAuditShow: "setAuditShow",
    }),

    //获取总览数据
    async getData() {
      const json = {
        year: this.blockChoosedYear,
      };
      const res = await getOverviewData(json);
      if (res.message === "成功") {
        const overview = res.data.overview;
        this.overviewParams = {
          budgetMoney: overview.budgetMoney
            ? Number(overview.budgetMoney)
            : "--",
          budgetMoneyPer: overview.budgetMoneyPer
            ? Number(overview.budgetMoneyPer)
            : "--",
          budgetMoneyStatus: overview.budgetMoneyStatus,
          budgetNum: overview.budgetNum ? Number(overview.budgetNum) : "--",
          budgetPer: overview.budgetPer ? Number(overview.budgetPer) : "--",
          budgetStatus: overview.budgetStatus,
          executeMoney: overview.executeMoney
            ? Number(overview.executeMoney)
            : "--",
          executeMoneyPer: overview.executeMoneyPer
            ? overview.executeMoneyPer
            : "--",
          executeMoneyStatus: overview.executeMoneyStatus,
          executePer: overview.executePer ? Number(overview.executePer) : "--",
          executePerPer: overview.executePerPer
            ? Number(overview.executePerPer)
            : "--",
          executePerStatus: overview.executePerStatus,
          neverNum: overview.neverNum ? Number(overview.neverNum) : "--",
          neverPer: overview.neverPer ? Number(overview.neverPer) : "--",
          neverStatus: overview.neverStatus,
          noAuditNum: overview.noAuditNum ? Number(overview.noAuditNum) : "--",
          noAuditPer: overview.noAuditPer ? Number(overview.noAuditPer) : "--",
          noAuditStatus: overview.noAuditStatus,
          businessNum: overview.businessNum
            ? Number(overview.businessNum)
            : "--",
          businessPer: overview.businessPer
            ? Number(overview.businessPer)
            : "--",
          businessStatus: overview.businessStatus,
          projectNum: overview.projectNum ? Number(overview.projectNum) : "--",
          projectPer: overview.projectPer ? Number(overview.projectPer) : "--",
          projectStatus: overview.projectStatus,
          name: "全市概况",
        };
        const blocks = res.data.blocks;
        this.blockParams = blocks.map((item) => {
          return {
            ...item,
            budgetNum: item.budgetNum ? Number(item.budgetNum) : "--",
            budgetPer: item.budgetPer ? Number(item.budgetPer) : "--",
            neverNum: item.neverNum ? Number(item.neverNum) : "--",
            neverPer: item.neverPer ? Number(item.neverPer) : "--",
            noAuditNum: item.noAuditNum ? Number(item.noAuditNum) : "--",
            noAuditPer: item.noAuditPer ? Number(item.noAuditPer) : "--",
            businessNum: item.businessNum ? Number(item.businessNum) : "--",
            businessPer: item.businessPer ? Number(item.businessPer) : "--",
            projectNum: item.projectNum ? Number(item.projectNum) : "--",
            projectPer: item.projectPer ? Number(item.projectPer) : "--",
          };
        });
        if (this.blockParams.length > 0) {
          //初始选中第一个板块 todo
          const id = this.blockParams[0].id;
          const name = this.blockParams[0].name;
          this.setChoosedBlockId([id]);
          this.setChoosedBlockName([name]);
          if (this.fromRoute == "noTaxDetail") {
            this.setSpendingShow(false); //只有数据出来之后再渲染
            this.setThreePublicShow(false);
            this.setNoTaxShow(true);
            this.setAssertsShow(false);
            this.setAuditShow(false);
          } else {
            this.setSpendingShow(true); //只有数据出来之后再渲染
            this.setThreePublicShow(false);
            this.setNoTaxShow(false);
            this.setAssertsShow(false);
            this.setAuditShow(false);
          }
        }
      } else {
        this.$message(res.message);
      }
    },

    //点击板块事件
    handleClick(item) {
      if (this.choosedBlockName.includes(item.name)) {
        const arr = this.choosedBlockName.filter((name) => name !== item.name);
        const arr1 = this.choosedBlockId.filter((id) => id !== item.id);
        this.setChoosedBlockName(arr);
        this.setChoosedBlockId(arr1);
      } else {
        this.setChoosedBlockName([...this.choosedBlockName, item.name]);
        this.setChoosedBlockId([...this.choosedBlockId, item.id]);
      }
    },

    //呼出已选板块popover
    contentShow() {
      this.isContentShow = true;
    },
    handleVisibleChange(visible) {
      this.isPopoverVisible = visible;
    },
  },
};
</script>
<style lang="less">
.business-block {
  width: 100%;
  min-height: 100%;

  &-content {
    // padding: 20px;
    // background: #ffffff;

    .block-overview {
      height: 388px;
      display: flex;
      margin-bottom: 30px;

      &-left {
        width: 300px;
        height: 388px;
        padding: 12px 20px 40px 20px;
        margin-right: 20px;
        border-radius: 6px;
        // background: linear-gradient(118deg, #026fff 0%, #78afff 99.09%);
        box-shadow: 0px 1px 4px 0px rgba(23, 118, 255, 0.26),
          0px 8px 10px 0px rgba(23, 118, 255, 0.21);
        background-image: url("~@/assets/images/img/overview2.png");

        &-header {
          height: 28px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          .header-icon {
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }

          .header-title {
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
          }
        }

        &-content {
          .content-item {
            height: 22px;
            line-height: 22px;
            color: #ffffff;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &-left {
              font-weight: 600;
            }

            .svg-icon {
              width: 12px;
              height: 12px;
              margin-left: 4px;
            }
          }
        }
      }

      &-right {
        max-width: calc(100% - 320px);
        width: calc(100% - 320px);
        // height: 100%;
        height: 405px;
        // max-height: 100%;
        // overflow-x: scroll;
        overflow-y: hidden;
        overflow-x: auto; /* 横向滚动条，当项目超出容器宽度时显示 */

        // overflow-y: scroll;
        // overflow-x: hidden;

        // display: grid;
        // gap: 20px;
        //grid-template-columns: repeat(auto-fill, 400px);
        // grid-template-columns: 1fr 1fr 1fr 1fr;
        // grid-template-rows: 184px 184px;

        &-container {
          display: flex;
        }

        &-row {
          height: 184px;
          display: flex;
        }

        &-item {
          //width: 400px;
          // width: 300px;
          flex: 0 0 358.75px;
          // width: 325px !important;
          height: 184px;
          margin-right: 20px;
          border-radius: var(--BorderRadius-borderRadius, 6px);
          border: 2px solid #ffffff;
          padding: 8px 0 8px 16px;
          background: linear-gradient(118deg, #e8f3ff 0%, #fdfdfd 100%);
          position: relative;

          /* 卡片阴影 */
          box-shadow: 0px 2px 8px 0px rgba(31, 48, 78, 0.05),
            0px 10px 16px 4px rgba(31, 48, 78, 0.04);

          .item-header {
            height: 28px;
            line-height: 28px;
            color: #1c222b;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .item-content {
            width: 100%;
            height: calc(100% - 28px);
            &-left {
              // width: 197px;
              height: 100%;

              .left-label {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                color: #3c485c;
                height: 20px;
                line-height: 20px;
                font-size: 14px;

                &-key {
                  margin-right: 8px;
                }

                &-per {
                  display: flex;
                  align-items: center;
                  width: 28px;
                  height: 12px;
                }
              }
            }

            &-right {
              width: 120px;
              height: 120px;
              position: absolute;
              top: 0;
              right: 0;

              img {
                width: 120px;
                height: 120px;
              }
            }
          }
        }

        &-item-active {
          border: 2px solid var(----6, #1776ff);

          /* 选中阴影 */
          box-shadow: 0px 1px 4px 0px rgba(23, 118, 255, 0.26),
            0px 8px 10px 0px rgba(23, 118, 255, 0.21);
        }
      }
    }
  }

  .fixed-icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
    padding: 5px;
    background: #1776ff;
    border-radius: 100px;
    // border: 2px solid #1776ff;
    box-shadow: 0px 4px 16px 0px rgba(31, 48, 78, 0.1),
      0px 10px 16px 4px rgba(31, 48, 78, 0.08);
    position: fixed;
    top: 132px;
    right: 20px;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;

    icon-svg {
      width: 20px;
      height: 20px;
    }
  }
}
.block-popover {
  .ant-popover-content {
    width: 180px;
    max-height: 158px;
    overflow-y: scroll;
    // padding: 16px;
    border-radius: 12px;
    border: 2px solid #1776ff;
    background: #fff;
    box-shadow: 0px 8px 16px 0px rgba(23, 118, 255, 0.05),
      0px 20px 16px 4px rgba(23, 118, 255, 0.08);

    .ant-popover-arrow {
      display: none !important;
    }
    .fixed-content {
      &-title {
        font-weight: 600;
        color: #3c485c;
      }

      &-item {
        color: #1776ff;
        width: 100%;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        border: 1px solid #1776ff;
        background: #e6f4ff;
        margin-top: 10px;
      }
    }
  }
}
</style>
