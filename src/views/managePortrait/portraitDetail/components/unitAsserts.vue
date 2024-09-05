<template>
  <div class="unit-asserts">
    <div class="sub-title">当前资产分布情况</div>
    <div class="unit-asserts-data">
      <div class="unit-asserts-data-left">
        <div class="unit-asserts-data-left-title">资产总额（万元）</div>
        <div class="unit-asserts-data-left-content">
          {{ Number(assertsOverviewData.total).toLocaleString() }}
        </div>
        <img
          src="@/assets/images/img/asserts.png"
          alt=""
          class="unit-asserts-data-left-img"
        />
      </div>
      <div class="unit-asserts-data-right">
        <div
          class="unit-asserts-data-right-item"
          v-for="(item, index) in assertsOverviewData.overView"
          :key="index"
        >
          <div
            :class="[
              'unit-asserts-data-right-item-left',
              item.typeName.includes('房产')
                ? 'unit-asserts-data-right-item-house'
                : item.typeName.includes('车辆')
                ? 'unit-asserts-data-right-item-car'
                : item.typeName.includes('土地')
                ? 'unit-asserts-data-right-item-land'
                : 'unit-asserts-data-right-item-others',
            ]"
          >
            <div class="unit-asserts-data-right-item-left-icon">
              <icon-svg :icon-class="`${item.icon}`"></icon-svg>
            </div>
          </div>
          <div class="unit-asserts-data-right-item-right">
            <div class="unit-asserts-data-right-item-right-title">
              {{ Number(item.num).toLocaleString() }}
            </div>
            <div class="unit-asserts-data-right-item-right-content">
              {{ item.typeName }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前资产分布情况 -->
    <div class="unit-asserts-distribution">
      <div class="sub-title">当前资产分布情况</div>
      <div class="top-action">
        <a-button class="top-action-btn" @click="sortOne()">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="排序"></icon-svg>
          </div>
          排序
        </a-button>
        <a-button class="top-action-btn" @click="filterOne()">
          <div class="top-action-btn-icon">
            <icon-svg icon-class="筛选"></icon-svg>
          </div>
          筛选
        </a-button>
        <!-- <a-button class="top-action-btn" @click="lookMoreTwo()">
          查看更多
        </a-button> -->
        <a-tooltip placement="topLeft" overlayClassName="wrapper-title-tooltip">
          <template slot="title">
            <span>111111</span>
          </template>
          <div class="tooltip-icon">
            <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
          </div>
        </a-tooltip>
      </div>
    </div>

    <div class="unit-asserts-wrapper">
      <div class="unit-asserts-wrapper-item">
        <div class="item-top">
          <div class="item-top-title">当前资产分布（按专项资产类型）</div>
          <div class="flex">
            <!-- <div class="action-reset" style="margin-right: 8px">重置</div> -->
            <a-tooltip
              placement="topLeft"
              overlayClassName="item-title-tooltip"
            >
              <template slot="title">
                <span>111111</span>
              </template>
              <div class="tooltip-icon">
                <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
              </div>
            </a-tooltip>
          </div>
        </div>
        <div class="item-split"></div>
        <div class="item-content">
          <div class="item-content-graph" ref="graph1"></div>
        </div>
      </div>
      <div class="unit-asserts-wrapper-table">
        <a-table
          bordered
          :rowKey="(record) => record.index"
          :columns="columns1"
          :data-source="tableData1.dataSource1"
          :loading="tableLoading1"
          :pagination="false"
          class="wrapper-table-graph"
          :scroll="{ x: 'max-content', y: 480 }"
        >
          <template slot="dqzcze" slot-scope="text, record">
            <!-- <div style="cursor: pointer">{{ text }}</div> -->
            <div style="display: flex">
              <a-progress
                :percent="calculatePercent(text.money, tableData1.maxMoney)"
                size="small"
                :show-info="false"
                style="width: 50px"
              />
              <a-popover placement="rightBottom">
                <template slot="content">
                  <div>预算单位：{{ record.ysdw }}</div>
                  <div>年份：{{ record.year }}</div>

                  <div>
                    资金金额：{{
                      text.money.toString().includes("--")
                        ? "--"
                        : Number(text.money).toLocaleString()
                    }}万元
                  </div>
                  <div>
                    主管单位资产总额：{{
                      record.zgdwzcze.toString().includes("--")
                        ? "--"
                        : Number(record.zgdwzcze).toLocaleString()
                    }}万元
                  </div>
                  <div>
                    占比：{{
                      text.ratio.toString().includes("--")
                        ? "--"
                        : text.ratio * 1
                    }}%
                  </div>
                </template>
                <div style="margin-left: 8px">
                  <span
                    >{{
                      text.ratio.toString().includes("--")
                        ? "--"
                        : text.ratio * 1
                    }}%</span
                  >,&nbsp;&nbsp;
                  <span
                    >{{
                      text.money.toString().includes("--")
                        ? "--"
                        : Number(text.money).toLocaleString()
                    }}万元</span
                  >
                </div>
              </a-popover>
            </div>
          </template>
          <template slot="zxzcfbqk" slot-scope="text, record">
            <div style="display: flex; margin-bottom: 8px">
              <a-progress
                :percent="calculatePercent(text.houseMoney, text.maxMoney)"
                size="small"
                :show-info="false"
                style="width: 50px"
              />
              <a-popover placement="rightBottom">
                <template slot="content">
                  <div>预算单位：{{ record.ysdw }}</div>
                  <div>年份：{{ record.year }}年</div>
                  <div>专项类型：房产</div>
                  <div>
                    专项类型资产金额：{{
                      text.houseMoney.toString().includes("--")
                        ? "--"
                        : Number(text.houseMoney).toLocaleString()
                    }}万元
                  </div>
                  <div>
                    本单位资产总金额：{{
                      record.dqzcze.money.toString().includes("--")
                        ? "--"
                        : Number(record.dqzcze.money).toLocaleString()
                    }}万元
                  </div>

                  <div>
                    占比：{{
                      text.houseRatio.toString().includes("--")
                        ? "--"
                        : text.houseRatio * 1
                    }}%
                  </div>
                </template>

                <div style="margin-left: 8px">
                  <span>房产</span>,&nbsp;&nbsp;
                  <span
                    >{{
                      text.houseRatio.toString().includes("--")
                        ? "--"
                        : text.houseRatio * 1
                    }}%</span
                  >,&nbsp;&nbsp;
                  <span
                    >{{
                      text.houseMoney.toString().includes("--")
                        ? "--"
                        : Number(text.houseMoney).toLocaleString()
                    }}万元</span
                  >
                </div>
              </a-popover>
            </div>

            <div style="display: flex; margin-bottom: 8px">
              <a-progress
                :percent="calculatePercent(text.carMoney, text.maxMoney)"
                size="small"
                :show-info="false"
                style="width: 50px"
                class="car-progress"
              />
              <a-popover placement="rightBottom">
                <template slot="content">
                  <div>预算单位：{{ record.ysdw }}</div>
                  <div>年份：{{ record.year }}年</div>
                  <div>专项类型：车辆</div>
                  <div>
                    专项类型资产金额：{{
                      text.carMoney.toString().includes("--")
                        ? "--"
                        : Number(text.carMoney).toLocaleString()
                    }}万元
                  </div>
                  <div>
                    本单位资产总金额：{{
                      record.dqzcze.money.toString().includes("--")
                        ? "--"
                        : Number(record.dqzcze.money).toLocaleString()
                    }}万元
                  </div>

                  <div>
                    占比：{{
                      text.carRatio.toString().includes("--")
                        ? "--"
                        : text.carRatio * 1
                    }}%
                  </div>
                </template>

                <div style="margin-left: 8px">
                  <span>车辆，</span>,&nbsp;&nbsp;
                  <span
                    >{{
                      text.carRatio.toString().includes("--")
                        ? "--"
                        : text.carRatio * 1
                    }}%</span
                  >,&nbsp;&nbsp;
                  <span
                    >{{
                      text.carMoney.toString().includes("--")
                        ? "--"
                        : Number(text.carMoney).toLocaleString()
                    }}万元</span
                  >
                </div>
              </a-popover>
            </div>

            <div style="display: flex; margin-bottom: 8px">
              <a-progress
                :percent="calculatePercent(text.landMoney, text.maxMoney)"
                size="small"
                :show-info="false"
                style="width: 50px"
                class="land-progress"
              />
              <a-popover placement="rightBottom">
                <template slot="content">
                  <div>预算单位：{{ record.ysdw }}</div>
                  <div>年份：{{ record.year }}</div>
                  <div>专项类型：土地</div>
                  <div>
                    专项类型资产金额：{{
                      text.landMoney.toString().includes("--")
                        ? "--"
                        : Number(text.landMoney).toLocaleString()
                    }}万元
                  </div>
                  <div>
                    本单位资产总金额：{{
                      record.dqzcze.money.toString().includes("--")
                        ? "--"
                        : Number(record.dqzcze.money).toLocaleString()
                    }}万元
                  </div>

                  <div>
                    占比：{{
                      text.landRatio.toString().includes("--")
                        ? "--"
                        : text.landRatio * 1
                    }}%
                  </div>
                </template>

                <div style="margin-left: 8px">
                  <span>土地</span>,&nbsp;&nbsp;
                  <span
                    >{{
                      text.landRatio.toString().includes("--")
                        ? "--"
                        : text.landRatio * 1
                    }}%</span
                  >,&nbsp;&nbsp;
                  <span
                    >{{
                      text.landMoney.toString().includes("--")
                        ? "--"
                        : Number(text.landMoney).toLocaleString()
                    }}万元</span
                  >
                </div>
              </a-popover>
            </div>

            <div style="display: flex">
              <a-progress
                :percent="calculatePercent(text.otherMoney, text.maxMoney)"
                size="small"
                :show-info="false"
                style="width: 50px"
                class="other-progress"
              />
              <a-popover placement="rightBottom">
                <template slot="content">
                  <div>预算单位：{{ record.ysdw }}</div>
                  <div>年份：{{ record.year }}</div>
                  <div>专项类型：土地</div>
                  <div>
                    专项类型资产金额：{{
                      text.otherMoney.toString().includes("--")
                        ? "--"
                        : Number(text.otherMoney).toLocaleString()
                    }}万元
                  </div>
                  <div>
                    本单位资产总金额：{{
                      record.dqzcze.money.toString().includes("--")
                        ? "--"
                        : Number(record.dqzcze.money).toLocaleString()
                    }}万元
                  </div>

                  <div>
                    占比：{{
                      text.otherRatio.toString().includes("--")
                        ? "--"
                        : text.otherRatio * 1
                    }}%
                  </div>
                </template>

                <div style="margin-left: 8px">
                  <span>其他</span>,&nbsp;&nbsp;
                  <span
                    >{{
                      text.otherRatio.toString().includes("--")
                        ? "--"
                        : text.otherRatio * 1
                    }}%</span
                  >,&nbsp;&nbsp;
                  <span
                    >{{
                      text.otherMoney.toString().includes("--")
                        ? "--"
                        : Number(text.otherMoney).toLocaleString()
                    }}万元</span
                  >
                </div>
              </a-popover>
            </div>
          </template>
        </a-table>
      </div>
    </div>

    <div class="sub-title">年新增资产分析</div>
    <a-table
      :rowKey="(record) => record.index"
      :columns="tableData2.columns2"
      :data-source="tableData2.dataSource2"
      :scroll="{ x: 'max-content', y: 600 }"
      :bordered="true"
      :pagination="false"
      class="unit-asserts-table"
    >
      <template slot="firstYear" slot-scope="text, record">
        <div style="display: flex; margin-bottom: 8px">
          <a-progress
            :percent="calculatePercent(text.money, text.maxMoney)"
            size="small"
            :show-info="false"
            style="width: 50px"
          />
          <a-popover placement="rightBottom">
            <template slot="content">
              <div>预算单位：{{ record.budgetName }}</div>
              <div>年份：{{ text.year }}</div>
              <div>专项类型：{{ record.type }}</div>
              <div>
                专项类型新增资产金额：{{
                  text.money.toString().includes("--")
                    ? "--"
                    : Number(text.money).toLocaleString()
                }}万元
              </div>
              <div>
                本单位新增资产总金额：{{
                  text.total.toString().includes("--")
                    ? "--"
                    : Number(text.total).toLocaleString()
                }}万元
              </div>

              <div>
                占比：{{
                  text.ratio.toString().includes("--") ? "--" : text.ratio * 1
                }}%
              </div>
            </template>

            <div style="margin-left: 8px">
              <span
                >{{
                  text.ratio.toString().includes("--") ? "--" : text.ratio * 1
                }}%</span
              >,&nbsp;&nbsp;
              <span
                >{{
                  text.money.toString().includes("--")
                    ? "--"
                    : Number(text.money).toLocaleString()
                }}万元</span
              >
            </div>
          </a-popover>
        </div>
      </template>
      <template slot="secondYear" slot-scope="text, record">
        <div style="display: flex; margin-bottom: 8px">
          <a-progress
            :percent="calculatePercent(text.money, text.maxMoney)"
            size="small"
            :show-info="false"
            style="width: 50px"
          />
          <a-popover placement="rightBottom">
            <template slot="content">
              <div>预算单位：{{ record.budgetName }}</div>
              <div>年份：{{ text.year }}</div>
              <div>专项类型：{{ record.type }}</div>
              <div>
                专项类型新增资产金额：{{
                  text.money.toString().includes("--")
                    ? "--"
                    : Number(text.money).toLocaleString()
                }}万元
              </div>
              <div>
                本单位新增资产总金额：{{
                  text.total.toString().includes("--")
                    ? "--"
                    : Number(text.total).toLocaleString()
                }}万元
              </div>

              <div>
                占比：{{
                  text.ratio.toString().includes("--") ? "--" : text.ratio * 1
                }}%
              </div>
            </template>

            <div style="margin-left: 8px">
              <span
                >{{
                  text.ratio.toString().includes("--") ? "--" : text.ratio * 1
                }}%</span
              >,&nbsp;&nbsp;
              <span
                >{{
                  text.money.toString().includes("--")
                    ? "--"
                    : Number(text.money).toLocaleString()
                }}万元</span
              >
            </div>
          </a-popover>
        </div>
      </template>
      <template slot="thirdYear" slot-scope="text, record">
        <div style="display: flex; margin-bottom: 8px">
          <a-progress
            :percent="calculatePercent(text.money, text.maxMoney)"
            size="small"
            :show-info="false"
            style="width: 50px"
          />
          <a-popover placement="rightBottom">
            <template slot="content">
              <div>预算单位：{{ record.budgetName }}</div>
              <div>年份：{{ text.year }}</div>
              <div>专项类型：{{ record.type }}</div>
              <div>
                专项类型新增资产金额：{{
                  text.money.toString().includes("--")
                    ? "--"
                    : Number(text.money).toLocaleString()
                }}万元
              </div>
              <div>
                本单位新增资产总金额：{{
                  text.total.toString().includes("--")
                    ? "--"
                    : Number(text.total).toLocaleString()
                }}万元
              </div>

              <div>
                占比：{{
                  text.ratio.toString().includes("--") ? "--" : text.ratio * 1
                }}%
              </div>
            </template>

            <div style="margin-left: 8px">
              <span
                >{{
                  text.ratio.toString().includes("--") ? "--" : text.ratio * 1
                }}%</span
              >,&nbsp;&nbsp;
              <span
                >{{
                  text.money.toString().includes("--")
                    ? "--"
                    : Number(text.money).toLocaleString()
                }}万元</span
              >
            </div>
          </a-popover>
        </div>
      </template>
      <template slot="forthYear" slot-scope="text, record">
        <div style="display: flex; margin-bottom: 8px">
          <a-progress
            :percent="calculatePercent(text.money, text.maxMoney)"
            size="small"
            :show-info="false"
            style="width: 50px"
          />
          <a-popover placement="rightBottom">
            <template slot="content">
              <div>预算单位：{{ record.budgetName }}</div>
              <div>年份：{{ text.year }}</div>
              <div>专项类型：{{ record.type }}</div>
              <div>
                专项类型新增资产金额：{{
                  text.money.toString().includes("--")
                    ? "--"
                    : Number(text.money).toLocaleString()
                }}万元
              </div>
              <div>
                本单位新增资产总金额：{{
                  text.total.toString().includes("--")
                    ? "--"
                    : Number(text.total).toLocaleString()
                }}万元
              </div>

              <div>
                占比：{{
                  text.ratio.toString().includes("--") ? "--" : text.ratio * 1
                }}%
              </div>
            </template>

            <div style="margin-left: 8px">
              <span
                >{{
                  text.ratio.toString().includes("--") ? "--" : text.ratio * 1
                }}%</span
              >,&nbsp;&nbsp;
              <span
                >{{
                  text.money.toString().includes("--")
                    ? "--"
                    : Number(text.money).toLocaleString()
                }}万元</span
              >
            </div>
          </a-popover>
        </div>
      </template>
      <template slot="fifthYear" slot-scope="text, record">
        <div style="display: flex; margin-bottom: 8px">
          <a-progress
            :percent="calculatePercent(text.money, text.maxMoney)"
            size="small"
            :show-info="false"
            style="width: 50px"
          />
          <a-popover placement="rightBottom">
            <template slot="content">
              <div>预算单位：{{ record.budgetName }}</div>
              <div>年份：{{ text.year }}</div>
              <div>专项类型：{{ record.type }}</div>
              <div>
                专项类型新增资产金额：{{
                  text.money.toString().includes("--")
                    ? "--"
                    : Number(text.money).toLocaleString()
                }}万元
              </div>
              <div>
                本单位新增资产总金额：{{
                  text.total.toString().includes("--")
                    ? "--"
                    : Number(text.total).toLocaleString()
                }}万元
              </div>

              <div>
                占比：{{
                  text.ratio.toString().includes("--") ? "--" : text.ratio * 1
                }}%
              </div>
            </template>

            <div style="margin-left: 8px">
              <span
                >{{
                  text.ratio.toString().includes("--") ? "--" : text.ratio * 1
                }}%</span
              >,&nbsp;&nbsp;
              <span
                >{{
                  text.money.toString().includes("--")
                    ? "--"
                    : Number(text.money).toLocaleString()
                }}万元</span
              >
            </div>
          </a-popover>
        </div>
      </template>
    </a-table>

    <div class="sub-title">资产条目明细</div>
    <div class="asserts-details-wrapper">
      <div class="asserts-details-wrapper-top">
        <!-- 左侧四个tab -->
        <div class="option-tabs">
          <div
            :class="
              assertsSelected === pane.key
                ? 'option-tab selected'
                : 'option-tab'
            "
            v-for="pane in panes"
            :key="pane.key"
            :value="pane.key"
            @click="changeAssertsSelected(pane.key)"
          >
            <!-- <a-icon :type="pane.icon" /> -->
            <span class="option-tab-text">{{ pane.title }}</span>
          </div>
        </div>
        <!-- 右侧仨按钮 -->
        <div class="top-action">
          <a-button class="top-action-btn" @click="sortBtnDetail()">
            <div class="top-action-btn-icon">
              <icon-svg icon-class="排序"></icon-svg>
            </div>
            排序
          </a-button>
          <a-button class="top-action-btn" @click="filterBtnDetail()">
            <!-- @click="filterButton('资产明细筛选')" -->
            <div class="top-action-btn-icon">
              <icon-svg icon-class="筛选"></icon-svg>
            </div>
            筛选
          </a-button>
          <!-- <a-button class="top-action-btn" @click="lookMore('资产明细')">
                查看更多
              </a-button> -->
          <a-tooltip
            placement="topLeft"
            overlayClassName="wrapper-title-tooltip"
          >
            <template slot="title">
              <span>111111</span>
            </template>
            <div class="tooltip-icon">
              <icon-svg icon-class="icon-warning" color="#1776FF"></icon-svg>
            </div>
          </a-tooltip>
        </div>
      </div>
      <div class="asserts-details-wrapper-bottom">
        <!-- 房屋表 -->
        <a-table
          v-if="assertsSelected === 1"
          :rowKey="(record) => record.index"
          :columns="columns5"
          :data-source="dataSource5"
          :loading="tableLoading5"
          :pagination="pagination"
          :scroll="{ x: 'max-content', y: 500 }"
          :bordered="true"
          class="inner-table"
        >
          <div
            slot="cz"
            slot-scope="text, record"
            style="cursor: pointer; color: #1776ff; width: 16px; height: 16px"
            @click="
              lookAssertDetail(
                record.unitCode,
                record.assetNo,
                record.assetType
              )
            "
          >
            <icon-svg icon-class="查看"></icon-svg>
          </div>
        </a-table>

        <!-- 车辆表 -->
        <a-table
          v-if="assertsSelected === 2"
          :rowKey="(record) => record.index"
          :columns="columns6"
          :data-source="dataSource6"
          :loading="tableLoading6"
          :pagination="pagination"
          :scroll="{ x: 'max-content', y: 500 }"
          :bordered="true"
          class="inner-table"
        >
          <div
            slot="cz"
            slot-scope="text, record"
            style="cursor: pointer; color: #1776ff; width: 16px; height: 16px"
            @click="
              lookAssertDetail(
                record.unitCode,
                record.assetNo,
                record.assetType
              )
            "
          >
            <icon-svg icon-class="查看"></icon-svg>
          </div>
        </a-table>
        <!-- 土地表 -->
        <a-table
          v-if="assertsSelected === 3"
          :rowKey="(record) => record.index"
          :columns="columns7"
          :data-source="dataSource7"
          :loading="tableLoading7"
          :pagination="pagination"
          :scroll="{ x: 'max-content', y: 500 }"
          :bordered="true"
          class="inner-table"
        >
          <div
            slot="cz"
            slot-scope="text, record"
            style="cursor: pointer; color: #1776ff; width: 16px; height: 16px"
            @click="
              lookAssertDetail(
                record.unitCode,
                record.assetNo,
                record.assetType
              )
            "
          >
            <icon-svg icon-class="查看"></icon-svg>
          </div>
        </a-table>
        <!-- 其他表 -->
        <a-table
          v-if="assertsSelected === 4"
          :rowKey="(record) => record.index"
          :columns="columns8"
          :data-source="dataSource8"
          :loading="tableLoading8"
          :pagination="pagination"
          :scroll="{ x: 'max-content', y: 500 }"
          :bordered="true"
          class="inner-table"
        >
          <div
            slot="cz"
            slot-scope="text, record"
            style="cursor: pointer; color: #1776ff; width: 16px; height: 16px"
            @click="
              lookAssertDetail(
                record.unitCode,
                record.assetNo,
                record.assetType
              )
            "
          >
            <icon-svg icon-class="查看"></icon-svg>
          </div>
        </a-table>
      </div>
    </div>

    <!-- 当前资产分布（按预算单位与专项资产类型） 筛选配 -->
    <FilterModal
      filterTitle="当前资产分布（按预算单位与专项资产类型）筛选配置"
      :filterShow="filterShow1"
      :paramsOption="paramsOption1"
      :tableData="filterTableData1"
      @addTable3="addTable1"
      @delTable3="delTable1"
      @onFilterCancel="onFilterCancel1"
      @onFilterConfirm="onFilterConfirm1"
    ></FilterModal>

    <!-- 当前资产分布（按预算单位与专项资产类型） 排序按钮 -->
    <SortModal
      v-if="sortOptions1.length"
      sortTitle="当前资产分布（按预算单位与专项资产类型）排序配置"
      :sortShow="sortShow1"
      @onSortCancel="onSortCancel1"
      @onSortConfirm="onSortConfirm1"
      :sortOptions="sortOptions1"
      firstSortName="当前资产总额"
    ></SortModal>
    <!-- 资产明细四个表 -->
    <!-- 四个排序 -->
    <SortModal
      v-if="sortOptions3.length"
      sortTitle="资产明细房屋查询排序配置"
      :sortShow="sortShow3"
      @onSortCancel="onSortCancel3"
      @onSortConfirm="onSortConfirm3"
      :sortOptions="sortOptions3"
      firstSortName="资产净值"
    ></SortModal>
    <!-- firstSortName="字段1" -->
    <SortModal
      v-if="sortOptions4.length"
      sortTitle="资产明细车辆查询排序配置"
      :sortShow="sortShow4"
      @onSortCancel="onSortCancel4"
      @onSortConfirm="onSortConfirm4"
      :sortOptions="sortOptions4"
      firstSortName="资产净值"
    ></SortModal>
    <SortModal
      v-if="sortOptions5.length"
      sortTitle="资产明细土地查询排序配置"
      :sortShow="sortShow5"
      @onSortCancel="onSortCancel5"
      @onSortConfirm="onSortConfirm5"
      :sortOptions="sortOptions5"
      firstSortName="资产净值"
    ></SortModal>
    <SortModal
      v-if="sortOptions6.length"
      sortTitle="资产明细其他查询排序配置"
      :sortShow="sortShow6"
      @onSortCancel="onSortCancel6"
      @onSortConfirm="onSortConfirm6"
      :sortOptions="sortOptions6"
      firstSortName="资产净值"
    ></SortModal>
    <!-- 四个筛选 -->
    <FilterModal
      filterTitle="资产明细房屋列表筛选配置"
      :filterShow="filterShow3"
      :paramsOption="paramsOption3"
      :tableData="filterTableData3"
      @addTable3="addTable3"
      @delTable3="delTable3"
      @onFilterCancel="onFilterCancel3"
      @onFilterConfirm="onFilterConfirm3"
    ></FilterModal>
    <FilterModal
      filterTitle="资产明细车辆列表筛选配置"
      :filterShow="filterShow4"
      :paramsOption="paramsOption4"
      :tableData="filterTableData4"
      @addTable3="addTable4"
      @delTable3="delTable4"
      @onFilterCancel="onFilterCancel4"
      @onFilterConfirm="onFilterConfirm4"
    ></FilterModal>
    <FilterModal
      filterTitle="资产明细土地列表筛选配置"
      :filterShow="filterShow5"
      :paramsOption="paramsOption5"
      :tableData="filterTableData5"
      @addTable3="addTable5"
      @delTable3="delTable5"
      @onFilterCancel="onFilterCancel5"
      @onFilterConfirm="onFilterConfirm5"
    ></FilterModal>
    <FilterModal
      filterTitle="资产明细其他列表筛选配置"
      :filterShow="filterShow6"
      :paramsOption="paramsOption6"
      :tableData="filterTableData6"
      @addTable3="addTable6"
      @delTable3="delTable6"
      @onFilterCancel="onFilterCancel6"
      @onFilterConfirm="onFilterConfirm6"
    ></FilterModal>
    <!-- 资产情况的抽屉 -->
    <AssertDrawer
      :showDrawer="assertDetailShow"
      :drawerInfo="drawerInfo"
      @closeAssertDrawer="closeAssertDrawer"
    >
    </AssertDrawer>
  </div>
</template>
<script>
//import { Select } from "ant-design-vue";
import {
  lineColor1,
  lineColor10,
  lineColor11,
  lineColor2,
  lineColor3,
  lineColor4,
  lineColor5,
  lineColor6,
  lineColor7,
  lineColor8,
  lineColor9,
} from "@/assets/theme/model.js";
import AssertDrawer from "@/components/assertDrawer.vue";
import FilterModal from "@/components/filterModal.vue";
import SortModal from "@/components/sortModal.vue";
import {
  getManageAssertsGraphOne,
  getManageAssertsOverview,
  getManageAssertsTableCar,
  getManageAssertsTableCarFilter,
  getManageAssertsTableCarSort,
  getManageAssertsTableHouse,
  getManageAssertsTableHouseFilter,
  getManageAssertsTableHouseSort,
  getManageAssertsTableLand,
  getManageAssertsTableLandFilter,
  getManageAssertsTableLandSort,
  getManageAssertsTableOne,
  getManageAssertsTableOneFilter,
  getManageAssertsTableOneSort,
  getManageAssertsTableOther,
  getManageAssertsTableOtherFilter,
  getManageAssertsTableOtherSort,
  getManageAssertsTableTwo,
} from "@/shared/newApi/manage/asserts.js";
import { Button, Popover, Progress, Tooltip } from "ant-design-vue";
import { mapState } from "vuex";
export default {
  name: "UnitAsserts",
  data() {
    return {
      //颜色
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

      //概览数据
      assertsOverviewData: {
        // overView: [
        //   {
        //     id: 1,
        //     typeName: "房产资产总额（万元）",
        //     num: 17774,
        //     icon: "house",
        //   },
        //   {
        //     id: 2,
        //     typeName: "车辆资产总额（万元）",
        //     num: 17774,
        //     icon: "car",
        //   },
        //   {
        //     id: 3,
        //     typeName: "土地资产总额（万元）",
        //     num: 17774,
        //     icon: "land",
        //   },
        //   {
        //     id: 4,
        //     typeName: "人均资产金额（万元）",
        //     num: 17774,
        //     icon: "person",
        //   },
        //   {
        //     id: 5,
        //     typeName: "房产资产面积（m²）",
        //     num: 17774,
        //     icon: "house",
        //   },
        //   {
        //     id: 6,
        //     typeName: "车辆资产数量（辆）",
        //     num: 17774,
        //     icon: "car",
        //   },
        //   {
        //     id: 7,
        //     typeName: "土地资产面积（m²）",
        //     num: 17774,
        //     icon: "land",
        //   },
        //   {
        //     id: 8,
        //     typeName: "其他资产总额（万元）",
        //     num: 17774,
        //     icon: "others",
        //   },
        // ],
        // total: 999, //资产总额
      },

      // 图1
      myChart1: null,
      graphData1: {
        // year: "2023",
        // total: 1000,
        // seriesData: [
        //   { value: 300, name: "车辆", rate: 30 },
        //   { value: 450, name: "房产", rate: 45 },
        //   { value: 250, name: "土地", rate: 25 },
        // ],
      },

      //当前资产分布（按预算单位与专项资产类型）表格
      columns1: [
        {
          title: "预算单位",
          dataIndex: "ysdw",
          key: "ysdw",
          width: 150,
        },
        {
          title: "当前资产总额",
          dataIndex: "dqzcze",
          key: "dqzcze",
          width: 250,
          scopedSlots: { customRender: "dqzcze" },
        },
        {
          title: "专项资产分布情况",
          dataIndex: "zxzcfbqk",
          key: "zxzcfbqk",
          width: 316,
          scopedSlots: { customRender: "zxzcfbqk" },
        },
      ],
      tableLoading1: false,
      tableData1: {
        // dataSource1: [
        //   {
        //     ysdw: "单位1",
        //     year: "2023",
        //     zgdwzcze: 999, //主管单位资产总额
        //     dqzcze: {
        //       ratio: 30,
        //       money: 112,
        //     },
        //     zxzcfbqk: {
        //       houseRatio: 20,
        //       houseMoney: 200,
        //       carRatio: 30,
        //       carMoney: 300,
        //       landRatio: 40,
        //       landMoney: 400,
        //       otherRatio: 50,
        //       otherMoney: 500,
        //       maxMoney: 500, //houseMoney,carMoney,landMoney以及otherMoney的最大值
        //     },
        //   },
        //   {
        //     ysdw: "单位1",
        //     year: "2023",
        //     zgdwzcze: 999, //主管单位资产总额
        //     dqzcze: {
        //       ratio: 30,
        //       money: 112,
        //     },
        //     zxzcfbqk: {
        //       houseRatio: 20,
        //       houseMoney: 200,
        //       carRatio: 30,
        //       carMoney: 300,
        //       landRatio: 40,
        //       landMoney: 400,
        //       otherRatio: 50,
        //       otherMoney: 500,
        //       maxMoney: 500, //houseMoney,carMoney,landMoney以及otherMoney的最大值
        //     },
        //   },
        //   {
        //     ysdw: "单位1",
        //     year: "2023",
        //     zgdwzcze: 999, //主管单位资产总额
        //     dqzcze: {
        //       ratio: 30,
        //       money: 112,
        //     },
        //     zxzcfbqk: {
        //       houseRatio: 20,
        //       houseMoney: 200,
        //       carRatio: 30,
        //       carMoney: 300,
        //       landRatio: 40,
        //       landMoney: 400,
        //       otherRatio: 50,
        //       otherMoney: 500,
        //       maxMoney: 500, //houseMoney,carMoney,landMoney以及otherMoney的最大值
        //     },
        //   },
        //   {
        //     ysdw: "单位1",
        //     year: "2023",
        //     zgdwzcze: 999, //主管单位资产总额
        //     dqzcze: {
        //       ratio: 30,
        //       money: 112,
        //     },
        //     zxzcfbqk: {
        //       houseRatio: 20,
        //       houseMoney: 200,
        //       carRatio: 30,
        //       carMoney: 300,
        //       landRatio: 40,
        //       landMoney: 400,
        //       otherRatio: 50,
        //       otherMoney: 500,
        //       maxMoney: 500, //houseMoney,carMoney,landMoney以及otherMoney的最大值
        //     },
        //   },
        //   {
        //     ysdw: "单位1",
        //     year: "2023",
        //     zgdwzcze: 999, //主管单位资产总额
        //     dqzcze: {
        //       ratio: 30,
        //       money: 112,
        //     },
        //     zxzcfbqk: {
        //       houseRatio: 20,
        //       houseMoney: 200,
        //       carRatio: 30,
        //       carMoney: 300,
        //       landRatio: 40,
        //       landMoney: 400,
        //       otherRatio: 50,
        //       otherMoney: 500,
        //       maxMoney: 500, //houseMoney,carMoney,landMoney以及otherMoney的最大值
        //     },
        //   },
        // ],
        // maxMoney: 1, //dataSource1中资产总额的最大值  money
      },

      //当前资产分布（按预算单位与专项资产类型）
      //排序
      sortShow1: false,
      sortStringOne: "",
      //排序选项
      sortOptions1: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],

      //筛选
      filterShow1: false,
      filterConfirmArrOne: "",
      //筛选选项
      paramsOption1: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
        // {
        //   value: "字段二",
        //   label: "字段二",
        // },
        // {
        //   value: "字段三",
        //   label: "字段三",
        // },
      ],
      filterTableData1: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],

      tableData2: {
        // columns2: [
        //   {
        //     title: "预算单位",
        //     dataIndex: "budgetName",
        //     key: "budgetName",
        //     width: 100,
        //     fixed: "left",
        //     scopedSlots: { customRender: "budgetName" },
        //     //第一列合并三行
        //     customRender: (text, record, index) => {
        //       const obj = {
        //         children: text,
        //         attrs: {},
        //       };
        //       if (index % 4 === 0) {
        //         obj.attrs.rowSpan = 4;
        //       } else {
        //         obj.attrs.rowSpan = 0;
        //       }
        //       return obj;
        //     },
        //   },
        //   {
        //     title: "资产类型",
        //     dataIndex: "type",
        //     key: "type",
        //     scopedSlots: { customRender: "type" },
        //     width: 90,
        //   },
        //   {
        //     title: "2019",
        //     dataIndex: "firstYear",
        //     key: "firstYear",
        //     width: 208,
        //     scopedSlots: { customRender: "firstYear" },
        //   },
        //   {
        //     title: "2020",
        //     dataIndex: "secondYear",
        //     key: "secondYear",
        //     width: 208,
        //     scopedSlots: { customRender: "secondYear" },
        //   },
        //   {
        //     title: "2021",
        //     dataIndex: "thirdYear",
        //     key: "thirdYear",
        //     width: 208,
        //     scopedSlots: { customRender: "thirdYear" },
        //   },
        //   {
        //     title: "2022",
        //     dataIndex: "forthYear",
        //     key: "forthYear",
        //     width: 208,
        //     scopedSlots: { customRender: "forthYear" },
        //   },
        //   {
        //     title: "2023",
        //     dataIndex: "fifthYear",
        //     key: "fifthYear",
        //     width: 208,
        //     scopedSlots: { customRender: "fifthYear" },
        //   },
        // ],
        // dataSource2: [
        //   {
        //     budgetName: "公务车费用", // 三公支出类型
        //     type: "房产",
        //     firstYear: {
        //       year: "2019",
        //       ratio: 30, //占比   数据没有返回 --，  0是0，  没有是没有
        //       money: 112, //金额
        //       maxMoney: 112, //第一年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第一年占比
        //     secondYear: {
        //       year: "2020",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第二年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第二年
        //     thirdYear: {
        //       year: "2021",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第三年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第三年
        //     forthYear: {
        //       year: "2022",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第四年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第四年
        //     fifthYear: {
        //       year: "2023",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第五年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第五年
        //   },
        //   {
        //     budgetName: "公务车费用", // 三公支出类型
        //     type: "车辆",
        //     firstYear: {
        //       year: "2019",
        //       ratio: 30, //占比   数据没有返回 --，  0是0，  没有是没有
        //       money: 112, //金额
        //       maxMoney: 112, //第一年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第一年占比
        //     secondYear: {
        //       year: "2020",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第二年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第二年
        //     thirdYear: {
        //       year: "2021",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第三年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第三年
        //     forthYear: {
        //       year: "2022",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第四年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第四年
        //     fifthYear: {
        //       year: "2023",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第五年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第五年
        //   },
        //   {
        //     budgetName: "公务车费用", // 三公支出类型
        //     type: "土地",
        //     firstYear: {
        //       year: "2019",
        //       ratio: 30, //占比   数据没有返回 --，  0是0，  没有是没有
        //       money: 112, //金额
        //       maxMoney: 112, //第一年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第一年占比
        //     secondYear: {
        //       year: "2020",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第二年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第二年
        //     thirdYear: {
        //       year: "2021",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第三年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第三年
        //     forthYear: {
        //       year: "2022",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第四年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第四年
        //     fifthYear: {
        //       year: "2023",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第五年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第五年
        //   },
        //   {
        //     budgetName: "公务车费用", // 三公支出类型
        //     type: "其他",
        //     firstYear: {
        //       year: "2019",
        //       ratio: 30, //占比   数据没有返回 --，  0是0，  没有是没有
        //       money: 112, //金额
        //       maxMoney: 112, //第一年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第一年占比
        //     secondYear: {
        //       year: "2020",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第二年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第二年
        //     thirdYear: {
        //       year: "2021",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第三年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第三年
        //     forthYear: {
        //       year: "2022",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第四年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第四年
        //     fifthYear: {
        //       year: "2023",
        //       ratio: 30, //占比
        //       money: 112, //金额
        //       maxMoney: 112, //第五年 公务车费用 的房产、车辆、土地以及其他的最大金额
        //       total: 333, //本单位新增资产总金额
        //     }, // 第五年
        //   },
        // ],
      },

      //抽屉显示
      assertDetailShow: false,
      drawerInfo: "",

      //资产明细四个表
      //资产明细表格的选择tab
      pagination: {
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
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.changePagination();
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = current;
          this.pagination.pageSize = size;
          this.changePagination();
        },
      },
      assertsSelected: 1,
      panes: [
        {
          title: "房产",
          key: 1,
        },
        {
          title: "车辆",
          key: 2,
        },
        {
          title: "土地",
          key: 3,
        },
        {
          title: "其他",
          key: 4,
        },
      ],
      //------资产明细排序弹框显示
      sortShow3: false,
      sortStringThree: "",
      sortShow4: false,
      sortStringFour: "",
      sortShow5: false,
      sortStringFive: "",
      sortShow6: false,
      sortStringSix: "",
      //排序选项
      sortOptions3: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      sortOptions4: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      sortOptions5: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      sortOptions6: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      // ------资产明细筛选弹框显示
      filterShow3: false,
      filterConfirmArrThree: "",
      filterShow4: false,
      filterConfirmArrFour: "",
      filterShow5: false,
      filterConfirmArrFive: "",
      filterShow6: false,
      filterConfirmArrSix: "",
      paramsOption3: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
      ],
      filterTableData3: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],
      paramsOption4: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      filterTableData4: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],
      paramsOption5: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      filterTableData5: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],
      paramsOption6: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],
      filterTableData6: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],
      //表格数据
      //房屋表
      tableLoading5: false,
      columns5: [
        {
          title: "单位名称",
          dataIndex: "dwmc",
          key: "dwmc",
          width: 160,
          fixed: "left",
        },
        {
          title: "资产编号",
          dataIndex: "zcbh",
          key: "zcbh",
          width: 160,
          // fixed: "left",
        },
        {
          title: "资产名称",
          dataIndex: "zcmc",
          key: "zcmc",
          width: 150,
        },
        {
          title: "资产净值",
          dataIndex: "zcjz",
          key: "zcjz",
          width: 180,
        },
        {
          title: "权属证明",
          dataIndex: "qszm",
          key: "qszm",
          width: 180,
        },
        {
          title: "权属证号",
          dataIndex: "qszh",
          key: "qszh",
          width: 150,
        },
        {
          title: "坐落位置",
          dataIndex: "zlwz",
          key: "zlwz",
          width: 160,
        },
        {
          title: "权属面积",
          dataIndex: "qsmj",
          key: "qsmj",
          width: 150,
        },
        {
          title: "在用面积",
          dataIndex: "zymj",
          key: "zymj",
          width: 150,
        },
        {
          title: "出租面积",
          dataIndex: "czmj",
          key: "czmj",
          width: 150,
        },
        {
          title: "出借面积",
          dataIndex: "cjmj",
          key: "cjmj",
          width: 150,
        },
        {
          title: "闲置面积",
          dataIndex: "xzmj",
          key: "xzmj",
          width: 150,
        },
        {
          title: "取得日期",
          dataIndex: "qdrq",
          key: "qdrq",
          width: 160,
        },
        {
          title: "投入使用日期",
          dataIndex: "trsymj",
          key: "trsymj",
          width: 160,
        },
        {
          title: "处置时间",
          dataIndex: "czsj",
          key: "czsj",
          width: 180,
        },
        {
          title: "操作",
          dataIndex: "cz",
          key: "cz",
          width: 160,
          scopedSlots: { customRender: "cz" },
          fixed: "right",
        },
      ],
      dataSource5: [
        // {
        //   dwmc: "单位1", // 单位名称
        //   zcbh: "示例内容", // 资产编号
        //   zcmc: "示例内容", // 资产名称
        //   zcjz: "示例内容", // 资产净值
        //   qszm: "示例内容", // 权属证明
        //   qszh: "示例内容", // 权属证号
        //   zlwz: "示例内容", // 坐落位置
        //   qsmj: "示例内容", // 权属面积
        //   zymj: "示例内容", // 在用面积
        //   czmj: "示例内容", // 出租面积
        //   cjmj: "示例内容", // 出借面积
        //   xzmj: "示例内容", // 闲置面积
        //   qdrq: "示例内容", // 取得日期
        //   trsymj: "示例内容", // 投入使用日期
        //   czsj: "示例内容", // 处置时间
        //   // cz: "资产详情", //资产详情（写死就行）
        // },
        // {
        //   dwmc: "单位2", // 单位名称
        //   zcbh: "示例内容", // 资产编号
        //   zcmc: "示例内容", // 资产名称
        //   zcjz: "示例内容", // 资产净值
        //   qszm: "示例内容", // 权属证明
        //   qszh: "示例内容", // 权属证号
        //   zlwz: "示例内容", // 坐落位置
        //   qsmj: "示例内容", // 权属面积
        //   zymj: "示例内容", // 在用面积
        //   czmj: "示例内容", // 出租面积
        //   cjmj: "示例内容", // 出借面积
        //   xzmj: "示例内容", // 闲置面积
        //   qdrq: "示例内容", // 取得日期
        //   trsymj: "示例内容", // 投入使用日期
        //   czsj: "示例内容", // 处置时间
        //   // cz: "资产详情", //资产详情（写死就行）
        // },
        // {
        //   dwmc: "单位3", // 单位名称
        //   zcbh: "示例内容", // 资产编号
        //   zcmc: "示例内容", // 资产名称
        //   zcjz: "示例内容", // 资产净值
        //   qszm: "示例内容", // 权属证明
        //   qszh: "示例内容", // 权属证号
        //   zlwz: "示例内容", // 坐落位置
        //   qsmj: "示例内容", // 权属面积
        //   zymj: "示例内容", // 在用面积
        //   czmj: "示例内容", // 出租面积
        //   cjmj: "示例内容", // 出借面积
        //   xzmj: "示例内容", // 闲置面积
        //   qdrq: "示例内容", // 取得日期
        //   trsymj: "示例内容", // 投入使用日期
        //   czsj: "示例内容", // 处置时间
        //   // cz: "资产详情", //资产详情（写死就行）
        // },
      ],
      //车辆表
      tableLoading6: false,
      columns6: [
        {
          title: "单位名称",
          dataIndex: "dwmc",
          key: "dwmc",
          width: 160,
          fixed: "left",
        },
        {
          title: "资产编号",
          dataIndex: "zcbh",
          key: "zcbh",
          width: 160,
        },
        {
          title: "资产名称",
          dataIndex: "zcmc",
          key: "zcmc",
          width: 150,
        },
        {
          title: "资产净值",
          dataIndex: "zcjz",
          key: "zcjz",
          width: 180,
        },
        {
          title: "品牌",
          dataIndex: "pp",
          key: "pp",
          width: 180,
        },
        {
          title: "规格型号",
          dataIndex: "ggxh",
          key: "ggxh",
          width: 180,
        },
        {
          title: "车牌号",
          dataIndex: "cph",
          key: "cph",
          width: 160,
        },
        {
          title: "车辆行驶证",
          dataIndex: "clxsz",
          key: "clxsz",
          width: 180,
        },
        {
          title: "车辆类型",
          dataIndex: "cllx",
          key: "cllx",
          width: 180,
        },
        {
          title: "汽车排期量代码",
          dataIndex: "qcpqldm",
          key: "qcpqldm",
          width: 180,
        },
        {
          title: "发动机号",
          dataIndex: "fdjh",
          key: "fdjh",
          width: 160,
        },
        {
          title: "车辆产地",
          dataIndex: "clcd",
          key: "clcd",
          width: 160,
        },
        {
          title: "行驶证",
          dataIndex: "xsz",
          key: "xsz",
          width: 160,
        },
        {
          title: "车辆所有人",
          dataIndex: "clcyr",
          key: "clcyr",
          width: 190,
        },
        {
          title: "保修截止日期",
          dataIndex: "bxjzrq",
          key: "bxjzrq",
          width: 150,
        },
        {
          title: "操作",
          dataIndex: "cz",
          key: "cz",
          width: 160,
          scopedSlots: { customRender: "cz" },
          fixed: "right",
        },
      ],
      dataSource6: [
        // {
        //   dwmc: "示例内容", // 单位名称
        //   zcbh: "示例内容", // 资产编号
        //   zcmc: "示例内容", // 资产名称
        //   zcjz: "示例内容", // 资产净值
        //   pp: "示例内容", // 品牌
        //   ggxh: "示例内容", // 规格型号
        //   cph: "示例内容", // 车牌号
        //   clxsz: "示例内容", // 车辆行驶证
        //   cllx: "示例内容", // 车辆类型
        //   qcpqldm: "示例内容", // 汽车排期量代码
        //   fdjh: "示例内容", // 发动机号
        //   clcd: "示例内容", // 车辆产地
        //   xsz: "示例内容", // 行驶证
        //   clcyr: "示例内容", // 车辆所有人
        //   bxjzrq: "示例内容", // 保修截止日期
        //   // cz: "示例内容", // 操作
        // },
      ],
      //土地表
      tableLoading7: false,
      columns7: [
        {
          title: "单位名称",
          dataIndex: "dwmc",
          key: "dwmc",
          width: 160,
          fixed: "left",
        },
        {
          title: "资产编号",
          dataIndex: "zcbh",
          key: "zcbh",
          width: 160,
          // fixed: "left",
        },
        {
          title: "资产名称",
          dataIndex: "zcmc",
          key: "zcmc",
          width: 150,
        },
        {
          title: "资产净值",
          dataIndex: "zcjz",
          key: "zcjz",
          width: 180,
        },
        {
          title: "权属证明",
          dataIndex: "qszm",
          key: "qszm",
          width: 180,
        },
        {
          title: "权属证号",
          dataIndex: "qszh",
          key: "qszh",
          width: 150,
        },
        {
          title: "坐落位置",
          dataIndex: "zlwz",
          key: "zlwz",
          width: 160,
        },
        {
          title: "权属面积",
          dataIndex: "qsmj",
          key: "qsmj",
          width: 150,
        },
        {
          title: "在用面积",
          dataIndex: "zymj",
          key: "zymj",
          width: 150,
        },
        {
          title: "出租面积",
          dataIndex: "czmj",
          key: "czmj",
          width: 150,
        },
        {
          title: "出借面积",
          dataIndex: "cjmj",
          key: "cjmj",
          width: 150,
        },
        {
          title: "闲置面积",
          dataIndex: "xzmj",
          key: "xzmj",
          width: 150,
        },
        {
          title: "取得日期",
          dataIndex: "qdrq",
          key: "qdrq",
          width: 160,
        },
        {
          title: "投入使用日期",
          dataIndex: "trsymj",
          key: "trsymj",
          width: 160,
        },
        {
          title: "处置时间",
          dataIndex: "czsj",
          key: "czsj",
          width: 180,
        },
        {
          title: "操作",
          dataIndex: "xsz",
          key: "xsz",
          width: 160,
          scopedSlots: { customRender: "cz" },
          fixed: "right",
        },
      ],
      dataSource7: [
        // {
        //   dwmc: "示例内容", // 单位名称
        //   zcbh: "示例内容", // 资产编号
        //   zcmc: "示例内容", // 资产名称
        //   zcjz: "示例内容", // 资产净值
        //   qszm: "示例内容", // 权属证明
        //   qszh: "示例内容", // 权属证号
        //   zlwz: "示例内容", // 坐落位置
        //   qsmj: "示例内容", // 权属面积
        //   zymj: "示例内容", // 在用面积
        //   czmj: "示例内容", // 出租面积
        //   cjmj: "示例内容", // 出借面积
        //   xzmj: "示例内容", // 闲置面积
        //   qdrq: "示例内容", // 取得日期
        //   trsymj: "示例内容", // 投入使用日期
        //   czsj: "示例内容", // 处置时间
        // },
      ],
      //其他表
      tableLoading8: false,
      columns8: [
        {
          title: "单位名称",
          dataIndex: "dwmc",
          key: "dwmc",
          width: 160,
          fixed: "left",
        },
        {
          title: "资产编号",
          dataIndex: "zcbh",
          key: "zcbh",
          width: 160,
        },
        {
          title: "资产名称",
          dataIndex: "zcmc",
          key: "zcmc",
          width: 150,
        },
        {
          title: "资产净值",
          dataIndex: "zcjz",
          key: "zcjz",
          width: 180,
        },
        {
          title: "资产大类",
          dataIndex: "zcdl",
          key: "zcdl",
          width: 160,
        },
        {
          title: "资产分类名称",
          dataIndex: "zcflmc",
          key: "zcflmc",
          width: 180,
        },
        {
          title: "数量或面积",
          dataIndex: "slhpm",
          key: "slhpm",
          width: 180,
        },
        {
          title: "数量计量单位",
          dataIndex: "sljldw",
          key: "sljldw",
          width: 180,
        },
        {
          title: "资产取得日期",
          dataIndex: "zcqdrq",
          key: "zcqdrq",
          width: 190,
        },
        {
          title: "资产取得方式名称",
          dataIndex: "zcqdfs",
          key: "zcqdfs",
          width: 150,
        },
        {
          title: "投入使用日期",
          dataIndex: "trsyrq",
          key: "trsyrq",
          width: 160,
        },
        {
          title: "资产原值",
          dataIndex: "zcyz",
          key: "zcyz",
          width: 160,
        },
        {
          title: "处置时间",
          dataIndex: "czsj",
          key: "czsj",
          width: 160,
        },
        {
          title: "操作",
          dataIndex: "xsz",
          key: "xsz",
          width: 160,
          scopedSlots: { customRender: "cz" },
          fixed: "right",
        },
      ],
      dataSource8: [
        // {
        //   dwmc: "示例内容", // 单位名称
        //   zcbh: "示例内容", // 资产编号
        //   zcmc: "示例内容", // 资产名称
        //   zcjz: "示例内容", // 资产净值
        //   zcdl: "示例内容", // 资产大类
        //   zcflmc: "示例内容", // 资产分类名称
        //   slhpm: "示例内容", // 数量或面积
        //   sljldw: "示例内容", // 数量计量单位
        //   zcqdrq: "示例内容", // 资产取得日期
        //   zcqdfs: "示例内容", // 资产取得方式名称
        //   trsyrq: "示例内容", // 投入使用日期
        //   zcyz: "示例内容", // 资产原值
        //   czsj: "示例内容", // 处置时间
        //   cz: "示例内容", // 操作
        // },
      ],
    };
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("managePortrait", ["curTreeItem", "configParams"]),
  },
  watch: {
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.assertsSelected = 1;
        this.getAllData();
      },
      deep: true,
    },
    "configParams.curYear": {
      async handler(newVal, oldVal) {
        console.log("5656555", newVal, oldVal);
        this.assertsSelected = 1;
        this.getAllData();
      },
      deep: true,
    },
  },
  components: {
    AssertDrawer,
    SortModal,
    FilterModal,
    AButton: Button,
    APopover: Popover,
    AProgress: Progress,
    ATooltip: Tooltip,
  },
  beforeDestroy() {
    this.myChart1.dispose();
    const f = () => {
      this.myChart1.resize();
    };
    window.removeEventListener("resize", f);
  },
  mounted() {
    this.getAllData();
  },
  methods: {
    initAllCharts() {
      this.initEcharts1();
      const f = () => {
        this.myChart1.resize();
      };
      window.addEventListener("resize", f);
    },

    //所有请求
    async getAllData() {
      this.getManageAssertsOverview(); //获取资产概览情况
      await this.getManageAssertsTableOneSort(); //当前资产分布情况  排序
      //this.getManageAssertsTableOne(); //获取默认排序，就会自动获取表格数据了；所以这边不需要再请求 当前资产分布情况 表格
      this.getManageAssertsTableOneFilter(); //当前资产分布情况 筛选
      this.getManageAssertsTableTwo(); //年新增资产分析 表格
      await this.getManageAssertsTableHouseSort(); //房屋表格排序  初始只展示房屋表格数据
      this.getManageAssertsTableHouseFilter(); //房屋 筛选
      this.getManageAssertsTableCarFilter(); //车辆 筛选
      this.getManageAssertsTableLandFilter(); //土地 筛选
      this.getManageAssertsTableOtherFilter(); //其他 筛选

      this.initAllCharts(); //当前资产分布（按专项资产类型）  环形图  图1
    },

    //获取资产概览情况
    async getManageAssertsOverview() {
      const json = {
        deptCode: this.curTreeItem.key,
      };
      const res = await getManageAssertsOverview(json);
      if (res.message === "成功") {
        console.log("message成功 获取非税概览情况", res.data);
        this.assertsOverviewData = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //当前资产分布（按专项资产类型）  环形图  图1
    async getManageAssertsGraphOne() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
      };
      const res = await getManageAssertsGraphOne(json);
      if (res.message === "成功") {
        console.log(
          "message成功 当前资产分布（按专项资产类型）  环形图",
          res.data
        );
        this.graphData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //当前资产分布情况 表格
    async getManageAssertsTableOne() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
        filterCondition: this.filterConfirmArrOne, //筛选条件
        odName: this.sortStringOne, //排序字段
      };
      const res = await getManageAssertsTableOne(json);
      if (res.message === "成功") {
        console.log("message成功 当前资产分布情况 表格 ", res.data);
        this.tableData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //当前资产分布情况 排序
    async getManageAssertsTableOneSort() {
      this.sortOptions1 = [];

      const res = await getManageAssertsTableOneSort();
      if (res.message === "成功") {
        console.log("message成功 当前资产分布情况 排序", res.data);
        this.sortOptions1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //当前资产分布情况 筛选
    async getManageAssertsTableOneFilter() {
      const res = await getManageAssertsTableOneFilter();
      if (res.message === "成功") {
        console.log("message成功 当前资产分布情况 筛选", res.data);
        this.paramsOption1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //年新增资产分析 表格
    async getManageAssertsTableTwo() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
      };
      const res = await getManageAssertsTableTwo(json);
      if (res.message === "成功") {
        console.log("message成功 年新增资产分析 表格 ", res.data);
        this.tableData2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //-----4个表格
    changePagination() {
      switch (this.assertsSelected) {
        case 1:
          this.getManageAssertsTableHouseSort();
          break;
        case 2:
          this.getManageAssertsTableCarSort();
          break;
        case 3:
          this.getManageAssertsTableLandSort();
          break;
        case 4:
          this.getManageAssertsTableOtherSort();
          break;
        default:
          break;
      }
    },
    resetPagination() {
      this.pagination.total = 0;
      this.pagination.current = 1;
      this.pagination.pageSize = 20;
    },
    //房屋表格
    async getManageAssertsTableHouse() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
        filterCondition: this.filterConfirmArrThree,
        odName: this.sortStringThree,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量,
      };
      this.tableLoading5 = true;
      const res = await getManageAssertsTableHouse(json);
      this.tableLoading5 = false;
      if (res.message === "成功") {
        console.log("message成功 房屋表格", res.data);
        this.dataSource5 = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },
    //房屋 排序
    async getManageAssertsTableHouseSort() {
      this.sortOptions3 = [];

      const res = await getManageAssertsTableHouseSort();
      if (res.message === "成功") {
        console.log("message成功 房屋排序", res.data);
        this.sortOptions3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //房屋 筛选
    async getManageAssertsTableHouseFilter() {
      const res = await getManageAssertsTableHouseFilter();
      if (res.message === "成功") {
        console.log("message成功 房屋筛选", res.data);
        this.paramsOption3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //车辆表格
    async getManageAssertsTableCar() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
        filterCondition: this.filterConfirmArrFour,
        odName: this.sortStringFour,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量,
      };
      this.tableLoading6 = true;
      const res = await getManageAssertsTableCar(json);
      this.tableLoading6 = false;
      if (res.message === "成功") {
        console.log("message成功 车辆表格", res.data);
        this.dataSource6 = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },
    //车辆 排序
    async getManageAssertsTableCarSort() {
      this.sortOptions4 = [];

      const res = await getManageAssertsTableCarSort();
      if (res.message === "成功") {
        console.log("message成功 车辆排序", res.data);
        this.sortOptions4 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //车辆 筛选
    async getManageAssertsTableCarFilter() {
      const res = await getManageAssertsTableCarFilter();
      if (res.message === "成功") {
        console.log("message成功 非税收入分布（按项目）筛选", res.data);
        this.paramsOption4 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //土地表格
    async getManageAssertsTableLand() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
        filterCondition: this.filterConfirmArrFive,
        odName: this.sortStringFive,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量,
      };
      this.tableLoading7 = true;
      const res = await getManageAssertsTableLand(json);
      this.tableLoading7 = false;
      if (res.message === "成功") {
        console.log("message成功 土地表格", res.data);
        this.dataSource7 = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },
    //土地 排序
    async getManageAssertsTableLandSort() {
      this.sortOptions5 = [];

      const res = await getManageAssertsTableLandSort();
      if (res.message === "成功") {
        console.log("message成功 土地排序", res.data);
        this.sortOptions5 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //土地 筛选
    async getManageAssertsTableLandFilter() {
      const res = await getManageAssertsTableLandFilter();
      if (res.message === "成功") {
        console.log("message成功 土地 筛选", res.data);
        this.paramsOption5 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //其他表格
    async getManageAssertsTableOther() {
      const json = {
        year: this.configParams.curYear,
        deptCode: this.curTreeItem.key,
        filterCondition: this.filterConfirmArrSix,
        odName: this.sortStringSix,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量,
      };
      this.tableLoading8 = true;
      const res = await getManageAssertsTableOther(json);
      this.tableLoading8 = false;
      if (res.message === "成功") {
        console.log("message成功 其他表格", res.data);
        this.dataSource8 = res.data.dateList;
        this.pagination.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
    },
    //其他 排序
    async getManageAssertsTableOtherSort() {
      this.sortOptions6 = [];
      const res = await getManageAssertsTableOtherSort();
      if (res.message === "成功") {
        console.log("message成功 其他 排序", res.data);
        this.sortOptions6 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //其他 筛选
    async getManageAssertsTableOtherFilter() {
      const res = await getManageAssertsTableOtherFilter();
      if (res.message === "成功") {
        console.log("message成功 其他 筛选", res.data);
        this.paramsOption6 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //计算当前资产总额的百分比
    calculatePercent(money, maxNum) {
      if (money.toString().includes("--") || maxNum === 0) {
        return 0;
      }
      let numberPart = money.toString().trim(); // Get the first part and trim any whitespace
      let numberValue = parseFloat(numberPart); // Convert to number

      if (!isNaN(numberValue)) {
        return (numberValue / maxNum) * 100;
      } else {
        return 0;
      }
    },

    async initEcharts1() {
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);
      await this.getManageAssertsGraphOne();
      const _that = this;
      const option1 = {
        tooltip: {
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          borderColor: "transparent",
          //triggerOn: "click", // 设置触发方式为点击
          // jump
          // 用户点击图形上的某一分类后，系统跳转进入【资产卡片明细表】，并自动附带筛选条件【板块名称】【资产类型】【时间范围】。
          formatter: (params) => {
            const name = params.data.name;
            const value = params.data.value;
            // const year = _that.configParams.curYear;
            // const paramsYear = _that.yearRange;
            // onClick="goAssertsDetail('${paramsYear[0]}','${paramsYear[1]}',null,null,'${params.name}')"
            return `<div class="ratio-tooltip-box" style="pointer-events:auto;cursor:pointer;" >
              <div>专项类型：${name}</div>
              <div>年份：${_that.graphData1.year}年</div>
              <div>资金金额：${Number(
                params.data.value
              ).toLocaleString()}万元</div>
              <div>占比：${value}%</div>

            </div>`;
          },
        },
        // legend: {
        //   type: "scroll",
        //   orient: "horizontal",
        //   //top: -10,
        //   // bottom: 60,
        //   //data: this.legendData,
        // },
        series: [
          {
            type: "pie",
            radius: ["30%", "60%"],
            center: ["50%", "50%"],
            // roseType: "radius", //控制每个圆环粗细是否一致
            // 避免数据过小 不展示
            // minAngle: 1,
            data: this.graphData1.seriesData,
            color: [
              this.lineColor[0],
              this.lineColor[1],
              this.lineColor[2],
              this.lineColor[3],
              this.lineColor[4],
            ],
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 24,
              formatter: (params) => {
                const name = params.data.name;
                const value = Number(params.data.value).toLocaleString();
                const rate = params.data.rate;
                return name + "\n\n" + value + "万元\n\n" + rate + "% ";
              },
            },
            //伸出的箭头
            labelLine: {
              //以下代码注释为实现：指示线颜色与扇形块颜色一致
              lineStyle: {
                color: "#97A3B7",
              },
              smooth: 0.2,
              // length: 30,
              // length2: 20,
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function () {
              return Math.random() * 200;
            },
          },
        ],
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 200,
            style: {
              text: Number(this.graphData1.total).toLocaleString(),
              textAlign: "center",
              fill: "#1C222B", //文字的颜色
              fontSize: 24,
              lineHeight: 24,
              fontWeight: 600,
            },
          },
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 230,
            style: {
              text: "资金总额  (万元)",
              textAlign: "center",
              fill: "##1C222B", //文字的颜色
              fontSize: 12,
              lineHeight: 20,
            },
          },
        ],
      };

      this.myChart1.setOption(option1);
      this.myChart1.on("click", (params) => {
        console.log("点击环形图事件", params);
        // this.initEcharts2();
        //更新子图  主图子图联动
      });
    },

    //第一个表格——当前资产分布（按预算单位与专项资产类型）筛选
    filterOne() {
      this.filterShow1 = true;
    },
    onFilterCancel1() {
      this.filterShow1 = false;
    },
    onFilterConfirm1(filterConfirmArrOne) {
      this.filterConfirmArrOne = filterConfirmArrOne;
      this.getManageAssertsTableOne();
      this.onFilterCancel1();
    },
    addTable1(json) {
      this.filterTableData1 = [...this.filterTableData1, json];
    },
    delTable1(arr) {
      this.filterTableData1 = arr;
    },
    //第一个表格——当前资产分布（按预算单位与专项资产类型）排序
    sortOne() {
      this.sortShow1 = true;
    },
    onSortCancel1() {
      this.sortShow1 = false;
    },
    onSortConfirm1(sortStringOne) {
      this.sortStringOne = sortStringOne;
      this.getManageAssertsTableOne();
      this.onSortCancel1();
    },

    //资产明细四个表
    //点击资产明细表格tab
    changeAssertsSelected(key) {
      this.resetPagination();
      this.assertsSelected = key;
      switch (this.assertsSelected) {
        case 1:
          this.getManageAssertsTableHouseSort();
          break;
        case 2:
          this.getManageAssertsTableCarSort();
          break;
        case 3:
          this.getManageAssertsTableLandSort();
          break;
        case 4:
          this.getManageAssertsTableOtherSort();
          break;
        default:
          break;
      }
    },

    //------资产明细排序按钮
    sortBtnDetail() {
      switch (this.assertsSelected) {
        case 1:
          // this.sortBtn1();
          this.sortShow3 = true;
          break;
        case 2:
          // this.sortBtn2();
          this.sortShow4 = true;
          break;
        case 3:
          // this.sortBtn3();
          this.sortShow5 = true;
          break;
        case 4:
          // this.sortBtn4();
          this.sortShow6 = true;
          break;
        default:
          break;
      }
    },

    onSortCancel3() {
      this.sortShow3 = false;
    },
    onSortConfirm3(sortStringThree) {
      this.sortStringThree = sortStringThree;
      this.getManageAssertsTableHouse();
      this.onSortCancel3();
    },

    onSortCancel4() {
      this.sortShow4 = false;
    },
    onSortConfirm4(sortStringFour) {
      this.sortStringFour = sortStringFour;
      this.getManageAssertsTableCar();
      this.onSortCancel4();
    },

    onSortCancel5() {
      this.sortShow5 = false;
    },
    onSortConfirm5(sortStringFive) {
      this.sortStringFive = sortStringFive;
      this.getManageAssertsTableLand();
      this.onSortCancel5();
    },

    onSortCancel6() {
      this.sortShow6 = false;
    },
    onSortConfirm6(sortStringSix) {
      this.sortStringSix = sortStringSix;
      this.getManageAssertsTableOther();
      this.onSortCancel6();
    },

    //------资产明细筛选
    filterBtnDetail() {
      switch (this.assertsSelected) {
        case 1:
          this.filterShow3 = true;
          break;
        case 2:
          this.filterShow4 = true;
          break;
        case 3:
          this.filterShow5 = true;
          break;
        case 4:
          this.filterShow6 = true;
          break;
        default:
          break;
      }
    },

    onFilterCancel3() {
      this.filterShow3 = false;
    },
    onFilterConfirm3(filterConfirmArrThree) {
      this.filterConfirmArrThree = filterConfirmArrThree;
      this.getManageAssertsTableHouse();
      this.onFilterCancel3();
    },
    addTable3(json) {
      this.filterTableData3 = [...this.filterTableData3, json];
    },
    delTable3(arr) {
      this.filterTableData3 = arr;
    },

    onFilterCancel4() {
      this.filterShow4 = false;
    },
    onFilterConfirm4(filterConfirmArrFour) {
      this.filterConfirmArrFour = filterConfirmArrFour;
      this.getManageAssertsTableCar();
      this.onFilterCancel4();
    },
    addTable4(json) {
      this.filterTableData4 = [...this.filterTableData4, json];
    },
    delTable4(arr) {
      this.filterTableData4 = arr;
    },

    onFilterCancel5() {
      this.filterShow5 = false;
    },
    onFilterConfirm5(filterConfirmArrFive) {
      this.filterConfirmArrFive = filterConfirmArrFive;
      this.getManageAssertsTableLand();
      this.onFilterCancel5();
    },
    addTable5(json) {
      this.filterTableData5 = [...this.filterTableData5, json];
    },
    delTable5(arr) {
      this.filterTableData5 = arr;
    },

    onFilterCancel6() {
      this.filterShow6 = false;
    },
    onFilterConfirm6(filterConfirmArrSix) {
      this.filterConfirmArrSix = filterConfirmArrSix;
      this.getManageAssertsTableOther();
      this.onFilterCancel6();
    },
    addTable6(json) {
      this.filterTableData6 = [...this.filterTableData6, json];
    },
    delTable6(arr) {
      this.filterTableData6 = arr;
    },

    //资产详情弹框
    lookAssertDetail(unitCode, assetNo, assetType) {
      //   "unitCode": "050039002",//预算单位编码
      // "assetNo": "FW20100908000126",//资产编号
      // "assetType": "房产" // 房产、土地、车辆、其他
      console.log("点击了", unitCode, assetNo, assetType);
      this.drawerInfo = `${unitCode}+${assetNo}+${assetType}`;
      //发送请求，拿到相应数据
      this.assertDetailShow = true;
    },
    // lookAssertDetail(block, type, value) {

    //   console.log("点击了", block, type, value);
    //   this.drawerInfo = `${block}+${type}+${value}`;
    //   //发送请求，拿到相应数据
    //   this.assertDetailShow = true;
    // },

    closeAssertDrawer() {
      // console.log("子组件触发关闭");
      //发送请求，拿到相应数据
      this.assertDetailShow = false;
    },
  },
};
</script>
<style lang="less">
.unit-asserts {
  width: 100%;

  // 概览板块
  &-data {
    display: flex;

    &-left {
      width: 200px;
      height: 196px;
      padding: 20px;
      border-radius: 6px;
      margin-right: 20px;
      background: #bed7ff;
      position: relative;

      &-title {
        font-size: 16px;
        color: #3c485c;
        margin-bottom: 20px;
      }

      &-content {
        font-size: 28px;
        font-weight: 600;
      }

      &-img {
        width: 90px;
        height: 90px;
        position: absolute;
        right: 20px;
      }
    }

    &-right {
      width: calc(100% - 120px);
      height: 196px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 88px 88px;
      gap: 20px;

      &-item {
        height: 88px;
        padding: 16px 20px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        border: 1px solid #d6dbe3;
        background: #fff;

        &-right {
          &-title {
            font-size: 24px;
            font-weight: 600;
            display: flex;
            justify-content: flex-end;
          }
          &-content {
            color: #3c485c;
            display: flex;
            justify-content: flex-end;
          }
        }

        &-left {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          margin-right: 16px;
          display: flex;
          align-items: center;
          justify-content: center;

          &-icon {
            width: 26px;
            height: 26px;
          }
        }

        &-house {
          background: #1776ff;
        }

        &-car {
          background: #2fa9e6;
        }

        &-land {
          background: #1bb46d;
        }

        &-others {
          background: #fe9e17;
        }
      }
    }
  }

  &-distribution {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    //所有排序筛选查看更多按钮
    .top-action {
      display: flex;

      &-btn {
        width: 84px;
        height: 32px;
        margin-left: 10px;
        border-radius: 6px;
        padding: 6px 16px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #3c485c;

        &-icon {
          width: 16px;
          height: 16px;
          display: flex;
          margin-right: 8px;
        }
      }

      .tooltip-icon {
        margin-top: 7px;
        margin-left: 10px;
      }
    }
  }

  &-wrapper {
    width: 100%;
    height: 524px;

    margin-bottom: 20px;
    display: flex;

    &-item {
      width: 40%;
      height: 100%;
      margin-right: 20px;
      border-radius: 6px;
      border: 1px solid #d6dbe3;
      background: #fff;
      padding: 12px 20px 20px 20px;

      .item-top {
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        &-title {
          color: #1c222b;
          font-weight: 600;
        }
      }

      .item-split {
        width: 100%;
        height: 1px;
        background: #016eff;
        margin-bottom: 20px;
      }

      .item-content {
        width: 100%;
        height: calc(100% - 43px);
        display: flex;
        justify-content: center;

        &-graph {
          width: 90%;
          height: 100%;
        }
      }
    }

    &-table {
      width: calc(60% - 20px);
      height: 100%;
    }
  }

  &-table {
    margin-bottom: 20px;
  }

  .asserts-details-wrapper {
    //大框
    // height: 578px;
    background: #fff;
    width: 100%;

    &-top {
      width: 100%;
      display: flex;
      justify-content: space-between;

      //排序筛选按钮
      .top-action {
        display: flex;

        &-btn {
          width: 84px;
          height: 32px;
          margin-left: 10px;
          border-radius: 6px;
          padding: 6px 16px;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #3c485c;

          &-icon {
            width: 16px;
            height: 16px;
            display: flex;
            margin-right: 8px;
          }
        }

        .tooltip-icon {
          margin-top: 7px;
          margin-left: 10px;
        }
      }
    }

    &-bottom {
      width: 100%;
      min-width: 100%;
      // height: 514px;
    }
  }

  //鼠标移入样式清除
  // .ant-table-row {
  //   &:hover {
  //     td {
  //       background: transparent !important;
  //     }
  //   }
  // }
}
.car-progress {
  .ant-progress-outer {
    .ant-progress-inner {
      .ant-progress-bg,
      .ant-progress-success-bg {
        background: #14c9c9 !important;
      }
    }
  }
}

.land-progress {
  .ant-progress-outer {
    .ant-progress-inner {
      .ant-progress-bg,
      .ant-progress-success-bg {
        background: #1bb46d !important;
      }
    }
  }
}

.other-progress {
  .ant-progress-outer {
    .ant-progress-inner {
      .ant-progress-bg,
      .ant-progress-success-bg {
        background: #fe9e17 !important;
      }
    }
  }
}
</style>
