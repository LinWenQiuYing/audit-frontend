<template>
  <div class="budget-detail">
    <div class="budget-right">
      <div class="budget-right-content">
        <!-- <div class="budget-right-content-header">
          当前单位：{{ curTreeItem.title }}
        </div> -->
        <div class="budget-right-content-overview">
          <div
            v-for="(item, index) in budgetData"
            :key="index"
            class="overview-item"
          >
            <div class="item-top">{{ item.typeName }}</div>
            <div class="item-middle">
              {{
                item.num.indexOf("-") === -1
                  ? Number(item.num).toLocaleString()
                  : item.num
              }}
            </div>
            <div class="item-bottom">
              <span class="item-bottom-title">同比 {{ item.percentage }}</span>
              <div class="item-bottom-icon">
                <icon-svg
                  icon-class="icon-up"
                  color="#E31430"
                  v-if="item.status === 1"
                />
                <icon-svg
                  icon-class="icon-down"
                  color="#1BB46D"
                  v-else-if="item.status === 0"
                />
                <icon-svg icon-class="icon-down" color="#97A3B7" v-else />
              </div>
            </div>
            <div class="item-icon">
              <icon-svg :icon-class="`${item.icon}`"></icon-svg>
            </div>
          </div>
        </div>
        <div style="padding-bottom: 20px">
          <div class="layout-btns">
            <div class="layout-btns-item">
              <a-button
                type="primary"
                :class="basicInfoShow ? 'layout-btn active' : 'layout-btn'"
                @click="handleSkip('基本信息')"
              >
                <span class="layout-btn-text">基本信息</span>
              </a-button>
            </div>
            <div class="layout-btns-item">
              <a-button
                type="primary"
                :class="institutionShow ? 'layout-btn active' : 'layout-btn'"
                @click="handleSkip('内设机构')"
              >
                <span class="layout-btn-text">内设机构</span>
              </a-button>
            </div>
            <div class="layout-btns-item">
              <a-button
                type="primary"
                :class="powerShow ? 'layout-btn active' : 'layout-btn'"
                @click="handleSkip('权力清单')"
              >
                <span class="layout-btn-text">权力清单</span>
              </a-button>
            </div>
          </div>
          <div class="layout-basic-details" v-if="basicInfoShow">
            <div
              class="details-item"
              v-for="item in detailsData"
              :key="item.label"
            >
              <div class="details-item-label">
                <span class="label-text">{{ item.label }}</span>
              </div>
              <span class="details-item-value">{{ item.value }}</span>
            </div>
          </div>
          <!-- 内设机构 -->
          <div class="layout-institution" v-if="institutionShow">
            <!-- <div
            class="layout-institution-item"
            v-for="(item, index) in institutionData"
            :key="index"
          >
            <div class="item-title">
              <div class="item-title-icon">
                <icon-svg icon-class="institution"></icon-svg>
              </div>
              {{ item.title }}
            </div>
            <div class="item-content">{{ item.content }}</div>
          </div> -->
            <a-table
              :columns="columnsInstitution"
              :data-source="dataSourceInstitution"
              :pagination="false"
              :bordered="true"
              :scroll="{ x: 'max-content', y: '370px' }"
              class="layout-power-table inner-table"
            >
            </a-table>
          </div>
          <!-- 权力清单 -->
          <div class="layout-power" v-if="powerShow">
            <!-- <div class="layout-power-search">
            <a-input
              type="text"
              placeholder="请输入关键字查询"
              class="search-input"
              :value="powerSearch"
            />
            <a-button type="primary">查询</a-button>
          </div> -->

            <a-table
              :columns="columns1"
              :data-source="dataSource1"
              :scroll="{ x: 'max-content', y: '370px' }"
              :bordered="true"
              :pagination="false"
              class="layout-power-table inner-table"
            ></a-table>
          </div>
          <!-- 整体支出均衡性 -->
          <div class="sub-title">整体支出均衡性</div>
          <!-- 整体指出均衡性大框 -->
          <div class="expenditure-balance">
            <!-- 框内顶部标题和按钮 -->
            <div class="wrapper-top">
              <!-- 标题 -->
              <div class="wrapper-top-title">整体支出均衡性</div>
              <!-- 右侧按钮和提示框 -->
              <div class="wrapper-top-action">
                <!-- <div
                class="action-choose"
                @click="handleChooseBudget('预算单位选择')"
              >
                选择展示预算单位
              </div>
              <div class="action-reset">重置</div> -->
                <a-tooltip
                  placement="topLeft"
                  overlayClassName="wrapper-title-tooltip"
                >
                  <template slot="title">
                    <span>111111</span>
                  </template>
                  <div class="tooltip-icon">
                    <icon-svg
                      icon-class="icon-warning"
                      color="#1776FF"
                    ></icon-svg>
                  </div>
                </a-tooltip>
              </div>
            </div>
            <!-- 分割线 -->
            <div class="wrapper-split"></div>
            <!-- 图片内容 -->
            <div class="wrapper-content">
              <div class="wrapper-content-graph" ref="graph1"></div>
            </div>
          </div>
          <!-- 资金结构两个框 -->
          <div class="sub-title">资金结构</div>
          <div class="capital-structure">
            <!-- 左侧饼图 -->
            <div class="capital-structure-item">
              <!-- 头部文字 -->
              <div class="item-top">
                <div class="item-top-title">当年分布情况（按资金来源）</div>
                <a-tooltip
                  placement="topLeft"
                  overlayClassName="item-title-tooltip"
                >
                  <template slot="title">
                    <span>111111</span>
                  </template>
                  <div class="tooltip-icon">
                    <icon-svg
                      icon-class="icon-warning"
                      color="#1776FF"
                    ></icon-svg>
                  </div>
                </a-tooltip>
              </div>
              <!-- 分割线 -->
              <div class="item-split"></div>
              <!-- 底部图片 -->
              <div class="item-content">
                <div class="item-content-graph" ref="graph2"></div>
              </div>
            </div>
            <!-- 右侧折线图按资金来源趋势 -->
            <div class="capital-structure-item">
              <!-- 头部文字 -->
              <div class="item-top">
                <div class="item-top-title">近五年趋势（按资金来源）</div>
                <a-tooltip
                  placement="topLeft"
                  overlayClassName="item-title-tooltip"
                >
                  <template slot="title">
                    <span>111111</span>
                  </template>
                  <div class="tooltip-icon">
                    <icon-svg
                      icon-class="icon-warning"
                      color="#1776FF"
                    ></icon-svg>
                  </div>
                </a-tooltip>
              </div>
              <!-- 分割线 -->
              <div class="item-split"></div>
              <!-- 底部图片 -->
              <div class="item-content">
                <div class="item-content-graph" ref="graph3"></div>
              </div>
            </div>
          </div>
          <!-- 项目类型两个框 -->
          <!-- <div class="sub-title">项目类型</div> -->
          <div class="project-type">
            <!-- 左侧按类型饼图 -->
            <div class="project-type-item">
              <!-- 头部文字 -->
              <div class="item-top">
                <div class="item-top-title">当年分布情况（按项目类型）</div>
                <a-tooltip
                  placement="topLeft"
                  overlayClassName="item-title-tooltip"
                >
                  <template slot="title">
                    <span>111111</span>
                  </template>
                  <div class="tooltip-icon">
                    <icon-svg
                      icon-class="icon-warning"
                      color="#1776FF"
                    ></icon-svg>
                  </div>
                </a-tooltip>
              </div>
              <!-- 分割线 -->
              <div class="item-split"></div>
              <!-- 底部图片 -->
              <div class="item-content">
                <div class="item-content-graph" ref="graph4"></div>
              </div>
            </div>
            <!-- 右侧按类型趋势折线图 -->
            <div class="project-type-item">
              <!-- 头部文字 -->
              <div class="item-top">
                <div class="item-top-title">近五年趋势（按项目类型）</div>
                <a-tooltip
                  placement="topLeft"
                  overlayClassName="item-title-tooltip"
                >
                  <template slot="title">
                    <span>111111</span>
                  </template>
                  <div class="tooltip-icon">
                    <icon-svg
                      icon-class="icon-warning"
                      color="#1776FF"
                    ></icon-svg>
                  </div>
                </a-tooltip>
              </div>
              <!-- 分割线 -->
              <div class="item-split"></div>
              <!-- 底部图片 -->
              <div class="item-content">
                <div class="item-content-graph" ref="graph5"></div>
              </div>
            </div>
          </div>
          <!-- 项目执行明细表格 -->
          <div class="table-top">
            <div class="sub-title">项目执行明细</div>
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
              <a-button class="top-action-btn" @click="lookMoreOne()">
                查看更多
              </a-button>
              <a-tooltip
                placement="topLeft"
                overlayClassName="wrapper-title-tooltip"
              >
                <template slot="title">
                  <span>111111</span>
                </template>
                <div class="tooltip-icon">
                  <icon-svg
                    icon-class="icon-warning"
                    color="#1776FF"
                  ></icon-svg>
                </div>
              </a-tooltip>
            </div>
          </div>
          <a-table
            :columns="columns2"
            :data-source="dataSource2"
            :scroll="{ x: 'max-content', y: 500 }"
            :bordered="true"
            :pagination="false"
            class="inner-table"
          >
            <span slot="zxje" slot-scope="zxje">
              <span
                :style="{
                  color:
                    parseFloat(zxje) >=
                    parseFloat(highProjectExpenditureConfirm)
                      ? '#ff4053'
                      : '',
                }"
                >{{ Number(zxje).toLocaleString() }}</span
              >
            </span>
            <span slot="ysje" slot-scope="ysje">
              <span>{{ Number(ysje).toLocaleString() }}</span>
            </span>
            <span slot="zxl" slot-scope="zxl">
              <span
                :style="{
                  color:
                    parseFloat(zxl) >=
                    parseFloat((highExecutionRateConfirm * 100).toFixed(0))
                      ? '#ff4053'
                      : parseFloat(zxl) <=
                        parseFloat((lowExecutionRateConfirm * 100).toFixed(0))
                      ? '#f28518'
                      : '',
                }"
                >{{ zxl }}%</span
              >
            </span>
          </a-table>
          <!-- 非税收入明细表格 -->
          <div class="table-top">
            <div class="sub-title">非税收入明细</div>
            <div class="top-action">
              <a-button class="top-action-btn" @click="sortTwo()">
                <div class="top-action-btn-icon">
                  <icon-svg icon-class="排序"></icon-svg>
                </div>
                排序
              </a-button>
              <a-button class="top-action-btn" @click="filterTwo()">
                <div class="top-action-btn-icon">
                  <icon-svg icon-class="筛选"></icon-svg>
                </div>
                筛选
              </a-button>
              <a-button class="top-action-btn" @click="lookMoreTwo()">
                查看更多
              </a-button>
              <a-tooltip
                placement="topLeft"
                overlayClassName="wrapper-title-tooltip"
              >
                <template slot="title">
                  <span>111111</span>
                </template>
                <div class="tooltip-icon">
                  <icon-svg
                    icon-class="icon-warning"
                    color="#1776FF"
                  ></icon-svg>
                </div>
              </a-tooltip>
            </div>
          </div>
          <a-table
            :columns="columns3"
            :data-source="dataSource3"
            :scroll="{ x: 'max-content', y: 500 }"
            :bordered="true"
            :pagination="false"
            class="inner-table"
          >
            <span slot="fssrje" slot-scope="fssrje">
              <span
                :style="{
                  color:
                    parseFloat(fssrje) >= parseFloat(highProjectRevenueConfirm)
                      ? '#ff4053'
                      : '',
                }"
                >{{ Number(fssrje).toLocaleString() }}</span
              >
            </span>
            <span slot="tbzzl" slot-scope="tbzzl">
              <span>{{ tbzzl ? tbzzl : "--" }}%</span>
            </span>
          </a-table>
          <!-- 三公支出明细表格 -->
          <div class="table-top">
            <div class="sub-title">三公支出明细</div>
            <div class="top-action">
              <a-button class="top-action-btn" @click="lookMoreThree()">
                查看更多
              </a-button>
              <a-tooltip
                placement="topLeft"
                overlayClassName="wrapper-title-tooltip"
              >
                <template slot="title">
                  <span>111111</span>
                </template>
                <div class="tooltip-icon">
                  <icon-svg
                    icon-class="icon-warning"
                    color="#1776FF"
                  ></icon-svg>
                </div>
              </a-tooltip>
            </div>
          </div>
          <a-table
            :columns="columns4"
            :data-source="dataSource4"
            :scroll="{ x: 'max-content', y: 500 }"
            :bordered="true"
            :pagination="false"
            class="inner-table"
          >
            <span slot="zcje" slot-scope="zcje">
              <span>{{ Number(zcje).toLocaleString() }}</span>
            </span>
            <span slot="zb" slot-scope="zb">
              <span>{{ zb }}%</span>
            </span>
            <span slot="tbzzl" slot-scope="tbzzl">
              <span>{{ tbzzl ? tbzzl : "--" }}%</span>
            </span>
          </a-table>
          <!-- 资产明细表格 -->
          <div class="table-top">
            <div class="sub-title">资产明细</div>
          </div>
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
                    <icon-svg
                      icon-class="icon-warning"
                      color="#1776FF"
                    ></icon-svg>
                  </div>
                </a-tooltip>
              </div>
            </div>
            <div class="asserts-details-wrapper-bottom">
              <!-- 房屋表 -->
              <a-table
                v-if="assertsSelected === 1"
                :columns="columns5"
                :data-source="dataSource5"
                :pagination="pagination"
                :loading="tableLoading5"
                :scroll="{ x: 'max-content', y: 500 }"
                :bordered="true"
                class="inner-table"
              >
                <div
                  slot="cz"
                  slot-scope="text, record"
                  style="
                    cursor: pointer;
                    color: #1776ff;
                    width: 16px;
                    height: 16px;
                  "
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
                  style="
                    cursor: pointer;
                    color: #1776ff;
                    width: 16px;
                    height: 16px;
                  "
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
                  style="
                    cursor: pointer;
                    color: #1776ff;
                    width: 16px;
                    height: 16px;
                  "
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
                  style="
                    cursor: pointer;
                    color: #1776ff;
                    width: 16px;
                    height: 16px;
                  "
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
        </div>
      </div>
      <div class="params-config">
        <div class="params-config-header">参数设置</div>
        <div class="params-config-item">
          <div class="item-label">年份：</div>
          <a-select
            placeholder="请选择"
            v-model="curYear"
            :options="yearOptions"
            class="item-input"
          />
        </div>
        <div class="params-config-item">
          <div class="item-label">均衡性比例</div>
          <a-input-number
            class="right-action-input"
            placeholder="请输入"
            :min="0"
            :max="1"
            :step="0.1"
            v-model="ratioNumber"
          />
          <!-- <a-slider
            v-model="ratioNumber"
            :min="0"
            :max="1"
            :step="0.1"
            :tipFormatter="(value) => value * 100 + '%'"
          /> -->
        </div>
        <div class="params-config-item">
          <div class="item-label">执行率偏大值</div>
          <div class="item-set">
            <a-input-number
              class="item-set-input"
              placeholder="请输入"
              :min="0"
              :max="1"
              :step="0.1"
              v-model="highExecutionRate"
            />
            <div class="item-set-color-red"></div>
          </div>
        </div>
        <div class="params-config-item">
          <div class="item-label">执行率偏小值</div>
          <div class="item-set">
            <a-input-number
              class="item-set-input"
              placeholder="请输入"
              :min="0"
              :max="1"
              :step="0.1"
              v-model="lowExecutionRate"
            />
            <div class="item-set-color-orange"></div>
          </div>

          <!-- <a-slider
            v-model="lowExecutionRate"
            :min="0"
            :max="1"
            :step="0.1"
            :tipFormatter="(value) => value * 100 + '%'"
          /> -->
        </div>
        <div class="params-config-item">
          <div class="item-label">项目支出较大值(万元)</div>
          <div class="item-set">
            <a-input-number
              class="item-set-input"
              placeholder="请输入"
              :min="0"
              :step="1"
              v-model="highProjectExpenditure"
            />
            <div class="item-set-color-red"></div>
          </div>

          <!-- <a-slider
            v-model="highProjectExpenditure"
            :min="0"
            :max="1"
          /> -->
        </div>
        <div class="params-config-item">
          <div class="item-label">项目收入较大值(万元)</div>
          <div class="item-set">
            <a-input-number
              class="item-set-input"
              placeholder="请输入"
              :min="0"
              :step="1"
              v-model="highProjectRevenue"
            />
            <div class="item-set-color-red"></div>
          </div>

          <!-- <a-slider
            v-model="highProjectRevenue"
            :min="0"
            :max="1"
          /> -->
        </div>
        <div class="params-config-btns">
          <a-button style="margin-right: 8px" @click="handleParamsReset"
            >重置</a-button
          >
          <a-button type="primary" @click="handleParamsConfig">确定</a-button>
        </div>
      </div>
    </div>
    <!-- 项目执行明细排序按钮 -->
    <SortModal
      v-if="sortOptions1.length"
      sortTitle="项目执行明细排序配置"
      :sortShow="sortShow1"
      @onSortCancel="onSortCancel1"
      @onSortConfirm="onSortConfirm1"
      :sortOptions="sortOptions1"
      firstSortName="执行金额"
    ></SortModal>
    <!-- 非税收入明细排序按钮 -->
    <SortModal
      v-if="sortOptions2.length"
      sortTitle="非税收入明细排序配置"
      :sortShow="sortShow2"
      @onSortCancel="onSortCancel2"
      @onSortConfirm="onSortConfirm2"
      :sortOptions="sortOptions2"
      firstSortName="非税收入金额"
    ></SortModal>

    <!-- 项目执行明细筛选 -->
    <FilterModal
      v-if="paramsOption1.length"
      filterTitle="项目执行明细筛选配置"
      :filterShow="filterShow1"
      :paramsOption="paramsOption1"
      :tableData="tableData1"
      @addTable3="addTable1"
      @delTable3="delTable1"
      @onFilterCancel="onFilterCancel1"
      @onFilterConfirm="onFilterConfirm1"
    ></FilterModal>

    <!-- 非税收入明细筛选 -->
    <FilterModal
      v-if="paramsOption2.length"
      filterTitle="非税收入明细筛选配置"
      :filterShow="filterShow2"
      :paramsOption="paramsOption2"
      :tableData="tableData2"
      @addTable3="addTable2"
      @delTable3="delTable2"
      @onFilterCancel="onFilterCancel2"
      @onFilterConfirm="onFilterConfirm2"
    ></FilterModal>

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
  getBudgetBasicInfo,
  getBudgetGraphDataFive,
  getBudgetGraphDataFour,
  // getSearchPower,
  getBudgetGraphDataOne,
  getBudgetGraphDataThree,
  getBudgetGraphDataTwo,
  getBudgetInstitution,
  getBudgetOverview,
  getBudgetPowerList,
  getBudgetTableCar,
  getBudgetTableCarFilter,
  getBudgetTableCarSort,
  getBudgetTableHouse,
  getBudgetTableHouseFilter,
  getBudgetTableHouseSort,
  getBudgetTableLand,
  getBudgetTableLandFilter,
  getBudgetTableLandSort,
  getBudgetTableOne,
  getBudgetTableOneFilter,
  getBudgetTableOneSort,
  getBudgetTableOthers,
  getBudgetTableOthersFilter,
  getBudgetTableOthersSort,
  getBudgetTableThree,
  getBudgetTableTwo,
  getBudgetTableTwoFilter,
  getBudgetTableTwoSort,
} from "@/shared/newApi/budget/budget.js";
import {
  getMonthStartEnd,
  getYearStartEnd,
  monthNameToNumber,
} from "@/utils/common.js";
import { adjustFontSize } from "@/utils/echarts.js";
// import { adjustFontSize, handleAddEchartsBackground } from "@/utils/echarts.js";
import { Button, InputNumber, Select, Tooltip } from "ant-design-vue";
import { mapMutations, mapState } from "vuex";
export default {
  name: "BudgetDetail",
  data() {
    return {
      //抽屉显示
      assertDetailShow: false,
      drawerInfo: "",
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

      //页面右上角弹框
      //年份选项
      curYear: "2023",
      curYearConfirm: "2023",
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
      ],
      //均衡性比例
      ratioNumber: 0.25,
      ratioNumberConfirm: 0.25,
      //执行率偏大值
      highExecutionRate: 0.98,
      highExecutionRateConfirm: 0.98,
      //执行率偏小值
      lowExecutionRate: 0.7,
      lowExecutionRateConfirm: 0.7,
      //项目支出较大值
      highProjectExpenditure: undefined,
      highProjectExpenditureConfirm: undefined,
      //项目收入较大值
      highProjectRevenue: undefined,
      highProjectRevenueConfirm: undefined,

      budgetData: [],

      // budgetData: [
      //   {
      //     typeName: "项目数量（个）",
      //     num: 40, //加逗号用的
      //     percentage: "20",
      //     status: 0, //0:down  1:up
      //     icon: "项目数量",
      //   },
      //   {
      //     typeName: "预算金额（万元）",
      //     num: 4000,
      //     percentage: "10%", //如果这边返回null，需要映射为“--%”
      //     status: 1, //0:down  1:up
      //     icon: "预算金额",
      //   },
      //   {
      //     typeName: "执行金额（万元",
      //     num: 17774,
      //     percentage: "8%", //如果这边返回null，需要映射为“--%”
      //     status: 0, //0:down  1:up
      //     icon: "执行金额",
      //   },
      //   {
      //     typeName: "执行率（万元）",
      //     num: 17774,
      //     percentage: "8%", //如果这边返回null，需要映射为“--%”
      //     status: 0, //0:down  1:up
      //     icon: "执行率",
      //   },
      //   {
      //     typeName: "人员数量（人）",
      //     num: 13,
      //     percentage: "100", //如果这边返回null，需要映射为“--%”
      //     status: 0, //0:down  1:up
      //     icon: "人员数量",
      //   },
      //   {
      //     typeName: "三公支出金额（万元）",
      //     num: 17774,
      //     percentage: "8%", //如果这边返回null，需要映射为“--%”
      //     status: 0, //0:down  1:up
      //     icon: "三公支出金额",
      //   },
      //   {
      //     typeName: "非税收入金额（万元）",
      //     num: 17774,
      //     percentage: "8%", //如果这边返回null，需要映射为“--%”
      //     status: 0, //0:down  1:up
      //     icon: "非税收入金额",
      //   },
      //   {
      //     typeName: "资产金额（万元）",
      //     num: 17774,
      //     percentage: "8%", //如果这边返回null，需要映射为“--%”
      //     status: 0, //0:down  1:up
      //     icon: "资产金额",
      //   },
      // ],

      institutionShow: false,
      basicInfoShow: true,
      powerShow: false,
      //基本信息
      detailsData: [],

      // detailsData: [
      //   {
      //     key: "organId",
      //     label: "单位机构代码",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "organName",
      //     label: "单位名称",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "xzjgfl",
      //     label: "行政机关分类",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "xzjb",
      //     label: "行政级别",
      //     value: "市级",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "clrq",
      //     label: "成立日期",
      //     value: "2023-10-01 ",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "dwdz",
      //     label: "单位地址",
      //     value: "南京市雨花台区宁双路12号",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "yzbm",
      //     label: "邮政编码",
      //     value: "--",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "zzjgdm",
      //     label: "组织机构代码",
      //     value: "--",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "sjdw",
      //     label: "上级单位",
      //     value: "--",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "dmjc",
      //     label: "代码级次",
      //     value: "--",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "dwxz",
      //     label: "单位性质",
      //     value: "--",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "ysglfs",
      //     label: "预算管理方式",
      //     value: "--",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "dwlb",
      //     label: "单位类别",
      //     value: "--",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "lxr",
      //     label: "联系人",
      //     value: "马国成",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "lxrdhhm",
      //     label: "联系人电话号码",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "lxrcz",
      //     label: "联系人传真",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "lxremail",
      //     label: "联系人E-mail",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "cwfzr",
      //     label: "财务负责人",
      //     value: "田文镜",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "cwfzrdhhm",
      //     label: "财务负责人电话号码",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "cwfzrcz",
      //     label: "财务负责人传真",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "dwfzr",
      //     label: "单位负责人",
      //     value: "田文镜",
      //     // dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "dwfzrdhhm",
      //     label: "单位负责人电话号码",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "dwfzrcz",
      //     label: "单位负责人传真",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "dwfzremail",
      //     label: "单位负责人E-mail",
      //     value: "--",
      //     //dataSource: "上海市场监督管理局",
      //   },
      //   {
      //     key: "rysl",
      //     label: "人员数量",
      //     value: "1024人",
      //     //dataSource: "上海人社局",
      //   },
      //   {
      //     key: "notes",
      //     label: "备注",
      //     value: "--",
      //     //dataSource: "上海人社局",
      //   },
      // ],
      //内设机构
      columnsInstitution: [
        {
          title: "序号",
          dataIndex: "id",
          key: "id",
          width: 70,
        },
        {
          title: "内设机构名称",
          dataIndex: "title",
          key: "title",
          width: 170,
        },
        {
          title: "内设机构职责",
          dataIndex: "content",
          key: "content",
          width: 660,
        },
      ],
      dataSourceInstitution: [],

      // dataSourceInstitution: [
      //   {
      //     id: "1",
      //     title: "xxxxx科",
      //     content:
      //       "垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1、垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1",
      //   },
      //   {
      //     id: "2",
      //     title: "xxxxx科",
      //     content:
      //       "垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1、垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1",
      //   },
      //   {
      //     id: "3",
      //     title: "xxxxx科",
      //     content:
      //       "垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1、垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1",
      //   },
      //   {
      //     id: "4",
      //     title: "xxxxx科",
      //     content:
      //       "垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1、垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1",
      //   },
      //   {
      //     id: "5",
      //     title: "xxxxx科",
      //     content:
      //       "垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1、垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1",
      //   },
      //   {
      //     id: "6",
      //     title: "xxxxx科",
      //     content:
      //       "垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1、垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1",
      //   },
      //   {
      //     id: "7",
      //     title: "xxxxx科",
      //     content:
      //       "垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1、垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1",
      //   },
      //   {
      //     id: "8",
      //     title: "xxxxx科",
      //     content:
      //       "垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1、垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1",
      //   },
      //   {
      //     id: "9",
      //     title: "xxxxx科",
      //     content:
      //       "垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1、垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1",
      //   },
      //   {
      //     id: "10",
      //     title: "xxxxx科",
      //     content:
      //       "垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1、垦利10-2油田位于渤海南部海域，北部紧邻垦利10-1",
      //   },
      // ],
      //权力清单
      powerSearch: "",
      columns1: [
        {
          title: "序号",
          dataIndex: "id",
          key: "id",
          width: 70,
        },
        {
          title: "事项类型",
          dataIndex: "sxlx",
          key: "sxlx",
          width: 170,
        },
        {
          title: "事项名称",
          dataIndex: "sxmc",
          key: "sxmc",
          width: 660,
        },
      ],
      dataSource1: [
        // {
        //   zqmc: "部长", //职权名称
        //   zqyj: "证书", //职权依据
        //   zrsx: "管理", //责任事项
        //   zcjz: "15678", //资产价值
        //   zryj: "手册", //责任依据
        //   zrbm: "监察部", //责任部门
        //   bz: "xxxxxxx", //备注
        // },
      ],

      //预算单位弹框
      // budgetShow: false,
      // budgetTitle: "",
      // manageUnitTree: [
      //   {
      //     title: "市级",
      //     value: "0-0",
      //     key: "0-0",
      //     children: [
      //       {
      //         title: "民政局",
      //         value: "0-0-0",
      //         key: "0-0-0",
      //       },
      //     ],
      //   },
      //   {
      //     title: "省级",
      //     value: "0-1",
      //     key: "0-1",
      //     children: [
      //       {
      //         title: "统计局",
      //         value: "0-1-0",
      //         key: "0-1-0",
      //       },
      //       {
      //         title: "交管局",
      //         value: "0-1-1",
      //         key: "0-1-1",
      //       },
      //       {
      //         title: "审计局",
      //         value: "0-1-2",
      //         key: "0-1-2",
      //       },
      //     ],
      //   },
      // ],
      //用户选择的预算单位
      // choosedBudgetUnit: [],
      // choosedBudgetUnitCopy: [],

      //项目执行明细排序
      sortShow1: false,
      sortStringOne: "",
      //排序选项
      sortOptions1: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],

      //非税收入明细排序
      sortShow2: false,
      sortStringTwo: "",
      //排序选项
      sortOptions2: [
        // {
        //   label: "字段1",
        //   value: "字段1",
        // },
      ],

      //项目执行明细筛选
      filterShow1: false,
      filterConfirmArrOne: "",
      paramsOption1: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
      ],

      tableData1: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],
      //非税收入明细筛选
      filterShow2: false,
      filterConfirmArrTwo: "",
      paramsOption2: [
        // {
        //   value: "字段一",
        //   label: "字段一",
        // },
      ],
      tableData2: [
        // {
        //   id: "1",
        //   name: "字段一",
        //   compare: "等于",
        //   value: "1234",
        // },
      ],

      //图1整体支出均衡性折线图
      myChart1: null, //整体支出均衡性
      graphData1: {
        // legend: ["预算单位1"],
        // xAxis: [
        //   "一月",
        //   "二月",
        //   "三月",
        //   "四月",
        //   "五月",
        //   "六月",
        //   "七月",
        //   "八月",
        //   "九月",
        //   "十月",
        //   "十一月",
        //   "十二月",
        // ],
        // seriesData: [
        //   {
        //     name: "预算单位1",
        //     type: "budget", //单位性质，主管单位为budget
        //     funds: "某种性质", //资金性质，如果没有请和我确认，确认后考虑删除
        //     from: "主管单位2", //如果是预算单位，隶属于哪个主管单位；如果没有请和我确认，确认后考虑删除
        //     data: {
        //       totalMoney: 100, //年度支出金额（万元）
        //       money: [90, 8, 5, 10, 11, 7, 9, 6, 13, 10, 6, 9], //月度支出金额（万元）
        //       rate: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], //月度支出占比
        //     },
        //   },
        // ],
      },

      //图2按资金来源分布情况图
      graphData2: {
        // total: 2320, //总额
        // year: 2023, //年份
        // seriesData: [
        //   { value: 580, name: "政府性基金预算", rate: "25" }, //name: 资金性质；value:支出金额
        //   { value: 580, name: "国有资本经营预算", rate: "25" },
        //   { value: 580, name: "社会保险基金预算", rate: "25" },
        //   { value: 580, name: "一般公共预算", rate: "25" },
        // ],
      },

      //图3按资金来源趋势折线图
      graphData3: {
        // legend: [
        //   "一般公共预算",
        //   "社会保险基金预算",
        //   "国有资本经营预算",
        //   "政府性基金预算",
        // ],
        // xAxis: ["2019", "2020", "2021", "2022", "2023"],
        // yAxis: {
        //   name: "金额",
        // },
        // seriesData: [
        //   {
        //     name: "政府性基金预算",
        //     rate: [1, 2, 3, 4, 5],
        //     data: [24, 32, 75, 27, 42],
        //     total: [24, 32, 75, 27, 42],
        //   },
        //   {
        //     name: "一般公共预算",
        //     rate: [1, 2, 3, 4, 5],
        //     data: [52.4, 10.1, 13.4, 23, 52.7],
        //     total: [24, 32, 75, 27, 42],
        //   },
        //   {
        //     name: "社会保险基金预算",
        //     rate: [11, 22, 33, 44, 55],
        //     data: [22, 87.2, 23.4, 31, 45.5],
        //     total: [24, 32, 75, 27, 42],
        //   },
        //   {
        //     name: "国有资本经营预算",
        //     rate: [12, 24, 32, 42, 52],
        //     data: [42.9, 45.3, 45.4, 31, 12.5],
        //     total: [24, 32, 75, 27, 42],
        //   },
        // ],
      },

      // 图4按项目类型分布情况图
      graphData4: {
        // total: 2320,
        // year: 2023,
        // seriesData: [
        //   { value: 580, name: "类型1", rate: "25" },
        //   { value: 580, name: "类型2", rate: "25" },
        //   { value: 580, name: "类型3", rate: "25" },
        //   { value: 580, name: "类型4", rate: "25" },
        // ],
      },

      //图5按项目类型趋势折线图
      graphData5: {
        // legend: ["类型1", "类型2", "类型3", "类型4"],
        // xAxis: ["2019", "2020", "2021", "2022", "2023"],
        // yAxis: {
        //   name: "金额",
        // },
        // seriesData: [
        //   {
        //     name: "类型1",
        //     rate: [1, 2, 3, 4, 5],
        //     data: [24, 32, 75, 27, 42],
        //     total: [24, 32, 75, 27, 42],
        //   },
        //   {
        //     name: "类型2",
        //     rate: [1, 2, 3, 4, 5],
        //     data: [52.4, 10.1, 13.4, 23, 52.7],
        //     total: [24, 32, 75, 27, 42],
        //   },
        //   {
        //     name: "类型3",
        //     rate: [11, 22, 33, 44, 55],
        //     data: [22, 87.2, 23.4, 31, 45.5],
        //     total: [24, 32, 75, 27, 42],
        //   },
        //   {
        //     name: "类型4",
        //     rate: [12, 24, 32, 42, 52],
        //     data: [42.9, 45.3, 45.4, 31, 12.5],
        //     total: [24, 32, 75, 27, 42],
        //   },
        // ],
      },

      //项目执行明细表2
      columns2: [
        {
          title: "项目名称",
          dataIndex: "xmmc",
          key: "xmmc",
          width: 160,
        },
        {
          title: "项目编码",
          dataIndex: "xmbm",
          key: "xmbm",
          width: 180,
        },
        {
          title: "执行金额（万元）",
          dataIndex: "zxje",
          key: "zxje",
          width: 160,
          scopedSlots: { customRender: "zxje" },
        },
        {
          title: "预算金额（万元）",
          dataIndex: "ysje",
          key: "ysje",
          width: 180,
          scopedSlots: { customRender: "ysje" },
        },
        {
          title: "执行率",
          dataIndex: "zxl",
          key: "zxl",
          width: 180,
          scopedSlots: { customRender: "zxl" },
        },
      ],
      dataSource2: [
        // {
        //   xmmc: "xxx项目", //项目名称
        //   xmbm: "xxxxxxxxxx", //项目编码
        //   zxje: "123456789", //执行金额（万元）
        //   ysje: "987654321", //预算金额（万元）
        //   zxl: "99.99%", //执行率
        // },
      ],

      //非税收入明细表3
      columns3: [
        {
          title: "项目名称",
          dataIndex: "xmmc",
          key: "xmmc",
          width: 160,
        },
        {
          title: "项目编码",
          dataIndex: "xmbm",
          key: "xmbm",
          width: 180,
        },
        {
          title: "非税收入金额（万元）",
          dataIndex: "fssrje",
          key: "fssrje",
          width: 160,
          scopedSlots: { customRender: "fssrje" },
        },
        {
          title: "同比增长率",
          dataIndex: "tbzzl",
          key: "tbzzl",
          width: 180,
          scopedSlots: { customRender: "tbzzl" },
        },
      ],
      dataSource3: [
        // {
        //   xmmc: "xxx项目", //项目名称
        //   xmbm: "xxxxxxxxxx", //项目编码
        //   fssrje: "123456789", //非税收入金额（万元）
        //   tbzzl: "99.99%", //同比增长率
        // }
      ],
      //三公支出明细表4
      columns4: [
        {
          title: "三公类型",
          dataIndex: "sglx",
          key: "sglx",
          width: 160,
        },
        {
          title: "支出金额（元）",
          dataIndex: "zcje",
          key: "zcje",
          width: 180,
          scopedSlots: { customRender: "zcje" },
        },
        {
          title: "占比",
          dataIndex: "zb",
          key: "zb",
          width: 160,
          scopedSlots: { customRender: "zb" },
        },
        {
          title: "同比增长率",
          dataIndex: "tbzzl",
          key: "tbzzl",
          width: 180,
          scopedSlots: { customRender: "tbzzl" },
        },
      ],
      dataSource4: [
        // {
        //   sglx: "因公出国费用", //三公类型
        //   zcje: "xxxxxxxxxx", //支出金额（万元）
        //   zb: "99.99%", //占比
        //   tbzzl: "99.99%", //同比增长率
        // }
      ],

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
        //   value: "字段一",
        //   label: "字段一",
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
        //   value: "字段一",
        //   label: "字段一",
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
        //   value: "字段一",
        //   label: "字段一",
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
  components: {
    SortModal,
    AssertDrawer,
    FilterModal,
    ASelect: Select,
    // ASlider: Slider,
    AInputNumber: InputNumber,
    ATooltip: Tooltip,
    // AInput: Input,
    AButton: Button,
  },
  watch: {
    curTreeItem: {
      async handler(newVal, oldVal) {
        console.log("预算单位curTreeItem changed", newVal, oldVal);
        if (newVal.key) {
          this.assertsSelected = 1;
          this.getAllData();
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState("blockAnalysis", ["blockChoosedYear"]),
    ...mapState("budgetPortrait", ["curTreeItem"]),
    yearRange() {
      return getYearStartEnd(this.curYearConfirm);
    },
  },
  async mounted() {
    window.goPayDetail = this.goPayDetail;
    console.log(
      this.$props,
      "页面内 获取概览情况前端传递的choosedKey",
      this.curTreeItem
    );
    this.getAllData();
  },
  beforeDestroy() {
    this.myChart1.dispose();
    this.myChart2.dispose();
    this.myChart3.dispose();
    this.myChart4.dispose();
    this.myChart5.dispose();

    const f = () => {
      this.myChart1.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
      this.myChart5.resize();
    };
    window.removeEventListener("resize", f);
  },
  methods: {
    ...mapMutations("blockAnalysis", {
      setBlockChoosedYear: "setBlockChoosedYear",
      setChoosedBlockName: "setChoosedBlockName",
      setChoosedBlockId: "setChoosedBlockId",
    }),

    async getAllData() {
      if (!this.curTreeItem.key) return;
      this.getBudgetOverview(); //获取概览情况
      this.getBudgetInstitution(); //获取内设机构数据
      this.getBudgetPowerList(); //获取权力清单数据
      this.getBudgetBasicInfo(); //获取预算单位右侧基本信息
      await this.getBudgetTableOneSort(); //项目执行明细简表-排序字段
      await this.getBudgetTableOneFilter(); //项目执行明细简表-筛选字段
      //因为有默认排序值，故放置排序确认函数内
      // this.getBudgetTableOne();
      await this.getBudgetTableTwoSort(); //非税收入明细简表排序
      await this.getBudgetTableTwoFilter(); //非税收入明细简表筛选
      //因为有默认排序值，故放置排序确认函数内
      // this.getBudgetTableTwo();
      this.getBudgetTableThree(); //三公支出明细简表

      await this.getBudgetTableHouseSort(); //房屋表格排序  初始只展示房屋表格数据
      this.getBudgetTableHouseFilter(); //房屋 筛选
      this.getBudgetTableCarFilter(); //车辆筛选
      this.getBudgetTableLandFilter(); //土地筛选
      this.getBudgetTableOthersFilter(); //其他筛选

      this.initAllCharts();
    },

    //统一启动图
    initAllCharts() {
      this.initEcharts1();
      this.initEcharts2();
      this.initEcharts3();
      this.initEcharts4();
      this.initEcharts5();
      const f = () => {
        this.myChart1.resize();
        this.myChart2.resize();
        this.myChart3.resize();
        this.myChart4.resize();
        this.myChart5.resize();
      };
      window.addEventListener("resize", f);
    },

    // 跳转到支出明细
    goPayDetail(timeStart, timeEnd, manage, source, funcSub, finanSub, budget) {
      this.setChoosedBlockId([]);
      this.setChoosedBlockName([]);
      //开始时间+结束时间+主管单位+资金来源+功能科目+经济科目+预算单位
      // const queryParams = this.queryParams;
      const params = {
        time: [timeStart, timeEnd],
        manage: manage,
        budget: budget,
        source: source,
        funcSub: funcSub,
        finanSub: finanSub,
      };
      // this.$router.push({
      //   name: "payDetail",
      //   params: { id: 1 },
      // });
      this.$router.push({
        path: "/block-analysis/pay-detail",
        query: params,
      });
    },
    handleParamsReset() {
      //均衡性比例
      this.ratioNumber = 0.25;
      this.ratioNumberConfirm = 0.25;
      this.handleRatioChange();
      //执行率偏大值
      this.highExecutionRate = 0.98;
      this.highExecutionRateConfirm = 0.98;
      //执行率偏小值
      this.lowExecutionRate = 0.7;
      this.lowExecutionRateConfirm = 0.7;
      //项目支出较大值
      this.highProjectExpenditure = undefined;
      this.highProjectExpenditureConfirm = undefined;
      //项目收入较大值
      this.highProjectRevenue = undefined;
      this.highProjectRevenueConfirm = undefined;

      this.curYear = "2023";
      if (this.curYear !== this.curYearConfirm) {
        this.curYearConfirm = this.curYear;
        this.getAllData();
      }
    },
    handleParamsConfig() {
      this.ratioNumberConfirm = this.ratioNumber;
      this.handleRatioChange();
      this.highExecutionRateConfirm = this.highExecutionRate;
      this.lowExecutionRateConfirm = this.lowExecutionRate;
      this.highProjectExpenditureConfirm = this.highProjectExpenditure;
      this.highProjectRevenueConfirm = this.highProjectRevenue;

      if (this.curYear !== this.curYearConfirm) {
        this.curYearConfirm = this.curYear;
        this.assertsSelected = 1;
        this.getAllData();
      }
    },
    //均衡性比例修改
    handleRatioChange() {
      // 高亮大于等于均衡值的节点
      this.graphData1.seriesData[0].data.rate.map((item, index) => {
        if (
          this.ratioNumber !== null &&
          this.ratioNumber !== undefined &&
          item >= parseFloat((this.ratioNumber * 100).toFixed(0))
        ) {
          this.myChart1.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: index,
          });
        } else {
          this.myChart1.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: index,
          });
        }
      });
    },

    //获取概览情况
    async getBudgetOverview() {
      console.log("页面内 获取概览情况前端传递的choosedKey", this.curTreeItem);
      const json = {
        year: this.curYearConfirm,
        unitCode: this.curTreeItem.key,
      };
      const res = await getBudgetOverview(json);
      console.log("页面内 获取概览情况res", res);
      if (res.message === "成功") {
        console.log("message成功 获取概览情况", res.data);
        this.budgetData = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取内设机构表格数据
    async getBudgetInstitution() {
      const json = {
        unitCode: this.curTreeItem.key,
      };
      const res = await getBudgetInstitution(json);
      console.log("页面内 获取内设机构表格数据res", res);
      if (res.message === "成功") {
        console.log("message成功 获取内设机构表格数据", res.data);
        res.data.forEach((item, index) => {
          item.id = (index + 1).toString(); // 将 id 赋值为索引 + 1，并转换为字符串
        });
        this.dataSourceInstitution = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取权力清单表格数据
    async getBudgetPowerList() {
      const json = {
        unitCode: this.curTreeItem.key,
      };
      const res = await getBudgetPowerList(json);
      console.log("页面内 获取权力清单表格数据res", res);
      if (res.message === "成功") {
        console.log("message成功 获取权力清单表格数据", res.data);
        res.data.forEach((item, index) => {
          item.id = (index + 1).toString(); // 将 id 赋值为索引 + 1，并转换为字符串
        });
        this.dataSource1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取预算单位右侧基本信息
    async getBudgetBasicInfo() {
      const json = {
        year: this.curYearConfirm,
        unitCode: this.curTreeItem.key,
      };
      const res = await getBudgetBasicInfo(json);
      console.log("页面内 获取预算单位右侧基本信息res", res);
      if (res.message === "成功") {
        console.log("message成功 获取预算单位右侧基本信息", res.data);
        this.detailsData = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //获取echarts图：整体支出均衡性数据   折线
    async getBudgetGraphDataOne() {
      const json = {
        year: this.curYearConfirm,
        budgetUnitCode: this.curTreeItem.key,
      };
      const res = await getBudgetGraphDataOne(json);
      console.log("页面内 获取echarts图：整体支出均衡性数据   折线res", res);
      if (res.message === "成功") {
        console.log(
          "message成功 获取echarts图：整体支出均衡性数据   折线",
          res.data
        );
        this.graphData1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //echarts图：当年分布情况（按资金来源） 圆环
    async getBudgetGraphDataTwo() {
      const json = {
        year: this.curYearConfirm,
        unitCode: this.curTreeItem.key,
      };
      const res = await getBudgetGraphDataTwo(json);
      console.log("页面内 当年分布情况（按资金来源） 圆环res", res);
      if (res.message === "成功") {
        console.log("message成功 当年分布情况（按资金来源） 圆环", res.data);
        this.graphData2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //echarts图：五年趋势（按资金来源）   堆叠折线
    async getBudgetGraphDataThree() {
      const json = {
        year: this.curYearConfirm,
        unitCode: this.curTreeItem.key,
      };
      const res = await getBudgetGraphDataThree(json);
      console.log("页面内 五年趋势（按资金来源）   堆叠折线res", res);
      if (res.message === "成功") {
        console.log("message成功 五年趋势（按资金来源）   堆叠折线", res.data);
        this.graphData3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //echarts图：当年分布情况（按项目类型）
    async getBudgetGraphDataFour() {
      const json = {
        year: this.curYearConfirm,
        unitCode: this.curTreeItem.key,
      };
      const res = await getBudgetGraphDataFour(json);
      console.log("页面内 echarts图：当年分布情况（按项目类型） res", res);
      if (res.message === "成功") {
        console.log(
          "message成功 echarts图：当年分布情况（按项目类型） ",
          res.data
        );
        this.graphData4 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //echarts图：echarts图：五年趋势（按项目类型）  堆叠折线
    async getBudgetGraphDataFive() {
      const json = {
        year: this.curYearConfirm,
        unitCode: this.curTreeItem.key,
      };
      const res = await getBudgetGraphDataFive(json);
      console.log("页面内 echarts图：五年趋势（按项目类型）  堆叠折线res", res);
      if (res.message === "成功") {
        console.log(
          "message成功 echarts图：五年趋势（按项目类型）  堆叠折线",
          res.data
        );
        this.graphData5 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //项目执行明细简表-排序字段
    async getBudgetTableOneSort() {
      this.sortOptions1 = []; //强制排序组件刷新
      const res = await getBudgetTableOneSort();
      console.log("页面内 项目执行明细简表-排序字段res", res);
      if (res.message === "成功") {
        console.log("message成功 项目执行明细简表-排序字段", res.data);
        this.sortOptions1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //项目执行明细简表-筛选字段
    async getBudgetTableOneFilter() {
      const res = await getBudgetTableOneFilter();
      console.log("页面内 项目执行明细简表-筛选字段res", res);
      if (res.message === "成功") {
        console.log("message成功 项目执行明细简表-筛选字段", res.data);
        this.paramsOption1 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //项目执行明细简表
    async getBudgetTableOne() {
      const json = {
        year: this.curYearConfirm,
        unitCode: this.curTreeItem.key,
        pageSize: "100", //页面大小
        pageOffset: "0", //页面页码
        filterCondition: this.filterConfirmArrOne,
        odName: this.sortStringOne,
      };
      const res = await getBudgetTableOne(json);
      console.log("页面内 项目执行明细简表res", res);
      if (res.message === "成功") {
        console.log("message成功 项目执行明细简表", res.data);
        this.dataSource2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //非税收入明细简表排序
    async getBudgetTableTwoSort() {
      this.sortOptions2 = [];
      const res = await getBudgetTableTwoSort();
      console.log("页面内 非税收入明细简表排序res", res);
      if (res.message === "成功") {
        console.log("message成功 非税收入明细简表排序", res.data);
        this.sortOptions2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //非税收入明细简表筛选
    async getBudgetTableTwoFilter() {
      const res = await getBudgetTableTwoFilter();
      console.log("页面内 非税收入明细简表筛选res", res);
      if (res.message === "成功") {
        console.log("message成功 非税收入明细简表筛选", res.data);
        this.paramsOption2 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //非税收入明细简表
    async getBudgetTableTwo() {
      const json = {
        year: this.curYearConfirm,
        unitCode: this.curTreeItem.key,
        pageSize: "100", //页面大小
        pageOffset: "0", //页面页码
        filterCondition: this.filterConfirmArrTwo,
        odName: this.sortStringTwo,
      };
      const res = await getBudgetTableTwo(json);
      console.log("页面内 非税收入明细简表res", res);
      if (res.message === "成功") {
        console.log("message成功 非税收入明细简表", res.data);
        this.dataSource3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //三公支出明细简表
    async getBudgetTableThree() {
      const json = {
        year: this.curYearConfirm,
        unitCode: this.curTreeItem.key,
      };
      const res = await getBudgetTableThree(json);
      console.log("页面内 三公支出明细简表res", res);
      if (res.message === "成功") {
        console.log("message成功 三公支出明细简表", res.data);
        this.dataSource4 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //------资产所有图表
    //房屋表格
    changePagination() {
      switch (this.assertsSelected) {
        case 1:
          this.getBudgetTableHouseSort();
          break;
        case 2:
          this.getBudgetTableCarSort();
          break;
        case 3:
          this.getBudgetTableLandSort();
          break;
        case 4:
          this.getBudgetTableOthersSort();
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

    async getBudgetTableHouse() {
      const json = {
        unitCode: this.curTreeItem.key,
        year: this.curYearConfirm,
        filterCondition: this.filterConfirmArrThree,
        odName: this.sortStringThree,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量,
      };
      this.tableLoading5 = true;
      const res = await getBudgetTableHouse(json);
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
    async getBudgetTableHouseSort() {
      this.sortOptions3 = [];
      const res = await getBudgetTableHouseSort();
      if (res.message === "成功") {
        console.log("message成功 房屋排序", res.data);
        this.sortOptions3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //房屋 筛选
    async getBudgetTableHouseFilter() {
      const res = await getBudgetTableHouseFilter();
      if (res.message === "成功") {
        console.log("message成功 房屋筛选", res.data);
        this.paramsOption3 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //车辆表格
    async getBudgetTableCar() {
      const json = {
        unitCode: this.curTreeItem.key,
        year: this.curYearConfirm,
        filterCondition: this.filterConfirmArrFour,
        odName: this.sortStringFour,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量,
      };
      this.tableLoading6 = true;
      const res = await getBudgetTableCar(json);
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
    async getBudgetTableCarSort() {
      this.sortOptions4 = [];

      const res = await getBudgetTableCarSort();
      if (res.message === "成功") {
        console.log("message成功 车辆排序", res.data);
        this.sortOptions4 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //车辆 筛选
    async getBudgetTableCarFilter() {
      const res = await getBudgetTableCarFilter();
      if (res.message === "成功") {
        console.log("message成功 非税收入分布（按项目）筛选", res.data);
        this.paramsOption4 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //土地表格
    async getBudgetTableLand() {
      const json = {
        unitCode: this.curTreeItem.key,
        year: this.curYearConfirm,
        filterCondition: this.filterConfirmArrFive,
        odName: this.sortStringFive,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量,
      };
      this.tableLoading7 = true;
      const res = await getBudgetTableLand(json);
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
    async getBudgetTableLandSort() {
      this.sortOptions5 = [];

      const res = await getBudgetTableLandSort();
      if (res.message === "成功") {
        console.log("message成功 土地排序", res.data);
        this.sortOptions5 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //土地 筛选
    async getBudgetTableLandFilter() {
      const res = await getBudgetTableLandFilter();
      if (res.message === "成功") {
        console.log("message成功 土地 筛选", res.data);
        this.paramsOption5 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    //其他表格
    async getBudgetTableOthers() {
      const json = {
        unitCode: this.curTreeItem.key,
        year: this.curYearConfirm,
        filterCondition: this.filterConfirmArrSix,
        odName: this.sortStringSix,
        pageSize: this.pagination.pageSize,
        pageOffset: this.pagination.pageSize * (this.pagination.current - 1), //偏移量,
      };
      this.tableLoading8 = true;
      const res = await getBudgetTableOthers(json);
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
    async getBudgetTableOthersSort() {
      this.sortOptions6 = [];

      const res = await getBudgetTableOthersSort();
      if (res.message === "成功") {
        console.log("message成功 其他 排序", res.data);
        this.sortOptions6 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //其他 筛选
    async getBudgetTableOthersFilter() {
      const res = await getBudgetTableOthersFilter();
      if (res.message === "成功") {
        console.log("message成功 其他 筛选", res.data);
        this.paramsOption6 = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //点击资产明细表格tab
    changeAssertsSelected(key) {
      this.resetPagination();
      this.assertsSelected = key;
      switch (this.assertsSelected) {
        case 1:
          this.getBudgetTableHouseSort();
          break;
        case 2:
          this.getBudgetTableCarSort();
          break;
        case 3:
          this.getBudgetTableLandSort();
          break;
        case 4:
          this.getBudgetTableOthersSort();
          break;
        default:
          break;
      }
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
      console.log("子组件触发关闭");
      // this.showDrawer = true;
      //发送请求，拿到相应数据
      this.assertDetailShow = false;
    },

    handleSkip(val) {
      switch (val) {
        case "基本信息":
          this.basicInfoShow = true;
          this.institutionShow = false;
          this.powerShow = false;
          break;
        case "内设机构":
          this.basicInfoShow = false;
          this.institutionShow = true;
          this.powerShow = false;
          break;
        case "权力清单":
          this.basicInfoShow = false;
          this.institutionShow = false;
          this.powerShow = true;
          break;

        default:
          break;
      }
    },

    // 整体指出均衡性预算单位弹框
    // handleChooseBudget(value) {
    //   this.budgetShow = true;
    //   this.budgetTitle = value;
    // },

    //预算单位选择弹框
    // onCancel() {
    //   this.budgetShow = false;
    //   this.choosedBudgetUnit = this.choosedBudgetUnitCopy;
    // },

    // onConfirm() {
    //   // this.initEcharts1();
    //   this.choosedBudgetUnitCopy = this.choosedBudgetUnit;
    //   this.onCancel();
    // },

    // 图1整体支出均衡性折线图表展示
    async initEcharts1() {
      if (this.myChart1) {
        this.myChart1.dispose();
      }
      this.myChart1 = this.$echarts.init(this.$refs.graph1);
      await this.getBudgetGraphDataOne();

      const _that = this;
      //整体支出均衡性
      const option1 = {
        tooltip: {
          //trigger: "axis",
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          // triggerOn: "click", // 设置触发方式为点击
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
          //jump
          //月度支出金额带蓝色超链接，用户点击后穿透至支出明细页面
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            console.log(params, "params");
            //跳转携带时间
            let month = monthNameToNumber(params.name);
            const paramsMonth = getMonthStartEnd(_that.curYearConfirm, month);
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
              <div> 年份：${_that.curYearConfirm}
              </div>
              <div> 月份：${params.name}
              </div>
              <div>年度支出金额：${Number(
                _that.graphData1.seriesData[params.seriesIndex].data.totalMoney
              ).toLocaleString()}元</div>
              <a onClick="goPayDetail('${paramsMonth[0]}','${
              paramsMonth[1]
            }',null,null,null,null,'${
              params.seriesName
            }')" style="cursor: pointer;">月度支出金额：${Number(
              _that.graphData1.seriesData[params.seriesIndex].data.money[
                params.dataIndex
              ]
            ).toLocaleString()}元</a>
              <div>占比：${params.data}%</div>
            </div>`;
          },
        },
        legend: {
          type: "scroll",
          // top: 10,
          data: this.graphData1.legend,
          // data: [],
        },
        grid: {
          x: 15,
          y: 50,
          x2: 15,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData1.xAxis,
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            axisTick: {
              // 不展示刻度
              show: false,
            },
          },
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: {
          type: "value",
          name: "比率",
          minInterval: 1,
          axisLabel: {
            formatter: "{value}%",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          min: "dataMin",
          max: "dataMax",
        },
        series: [],
      };

      // 月度
      for (let i = 0; i < this.graphData1.seriesData.length; i++) {
        option1.series.push({
          type: "line",
          // stack: "total",
          name: this.graphData1.seriesData[i].name,
          data: this.graphData1.seriesData[i].data.rate,
          lineStyle: {
            width: 1.5, // 设置线条的粗细，表示1.5个像素
          },
          color: this.lineColor[i],
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              const money = Number(
                _that.graphData1.seriesData[params.seriesIndex].data.money[
                  params.dataIndex
                ]
              ).toLocaleString();
              const ratio = params.value;
              return (
                // "占比：" +
                money + "元" + "\n" + ratio + "%"
                // "支出金额：" +
              );
            },
          },
          emphasis: {
            disabled: true,
            itemStyle: {
              color: "red",
              borderColor: "yellow",
              borderWidth: 2,
              borderType: "solid",
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
            // scale: 3,
          },
          symbolSize: 10,
        });
      }
      this.myChart1.setOption(option1, true);
      this.handleRatioChange();
      //图表背景色
      // handleAddEchartsBackground(this.myChart1, option1, this.graphData1.xAxis);
    },

    //图2按资金来源分布情况图
    async initEcharts2() {
      //联动需要先clear
      if (this.myChart2) {
        this.myChart2.dispose();
      }
      this.myChart2 = this.$echarts.init(this.$refs.graph2);
      await this.getBudgetGraphDataTwo();
      const _that = this;
      //环形图中心总额文字长度自适应
      let maxWidth = 80; // 设置最大宽度
      let initialFontSize = 24; // 初始字体大小
      let adjustedFontSize = adjustFontSize(
        Number(this.graphData2.total).toLocaleString(),
        maxWidth,
        initialFontSize
      );
      const option2 = {
        tooltip: {
          //弹框固定位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          //triggerOn: "click", // 设置触发方式为点击
          //jump
          // 提供图表穿透功能：用户点击图形上的某一分类后，系统跳转进入【资产卡片明细表】，并自动附带筛选条件【主管单位】【资产类型】【时间范围】。
          formatter: (params) => {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }

            console.log(params, "图2params");
            //跳转携带时间
            const paramsYear = _that.yearRange;
            const name = params.data.name;
            const value = Number(params.data.value).toLocaleString();
            const rate = params.data.rate;
            const total = Number(_that.graphData2.total).toLocaleString();
            //支出金额带超链接，点击后进入支出明细页面。
            return `<div class="ratio-tooltip-box">
              <div>年份：${_that.graphData2.year}年</div>
              <div>
                资产来源：${name}
              </div>
              <a style="cursor: pointer;" onClick="goPayDetail('${paramsYear[0]}','${paramsYear[1]}',null,'${params.name}',null,null,'${_that.curTreeItem.title}')">年度支出金额：${value}万元</a>
              <div>年度支出总额：${total}万元</div>
              <div>
                金额占比：${rate}%
              </div>

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
            radius: ["40%", "70%"],
            center: ["50%", "50%"],
            // roseType: "radius", //控制每个圆环粗细是否一致
            // 避免数据过小 不展示
            // minAngle: 1,
            data: this.graphData2.seriesData,
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
                return name + "\n" + value + "万元\n" + rate + "% ";
                // return `
                //   ${name}
                //   支出金额：${value}万元
                //   占比：${occ}
                // `;
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
            top: 115,
            style: {
              text: this.graphData2.total.toLocaleString(),
              textAlign: "center",
              fill: "#1C222B", //文字的颜色
              fontSize: adjustedFontSize,
              lineHeight: adjustedFontSize,
              fontWeight: 600,
            },
          },
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 145,
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

      this.myChart2.setOption(option2);
      // this.myChart2.on("click", (params) => {
      //   console.log("点击环形图事件", params);
      //   this.$router.push({
      //     name: "assertsDetail",
      //     params: {
      //       //参数
      //     },
      //   });
      // });
    },

    //图3按资金来源趋势折线图
    async initEcharts3() {
      //联动需要先clear
      if (this.myChart3) {
        this.myChart3.dispose();
      }
      this.myChart3 = this.$echarts.init(this.$refs.graph3);
      await this.getBudgetGraphDataThree();
      const _that = this;
      //整体支出均衡性
      const option3 = {
        tooltip: {
          //trigger: "axis",
          // triggerOn: "click",
          enterable: true,
          triggerOn: "mousemove", // 设置触发方式为悬停
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            console.log(params, "图3params");
            //跳转携带时间
            const paramsYear = getYearStartEnd(params.name);
            let data = Number(params.data).toLocaleString();
            let total = Number(
              _that.graphData3.seriesData[params.componentIndex].total[
                params.dataIndex
              ]
            ).toLocaleString();

            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                <div>年份：${params.name}</div>
                <div>资金来源：${params.seriesName}</div>
                <a onClick="goPayDetail('${paramsYear[0]}','${
              paramsYear[1]
            }',null,'${params.seriesName}',null,null,'${
              _that.curTreeItem.title
            }')">年度支出金额：${data}万元</a>
                <div>年度支出总额：${total}万元</div>
                <div>占比：${
                  _that.graphData3.seriesData[params.seriesIndex].rate[
                    params.dataIndex
                  ]
                }%</div>

            </div>`;
            // <div>资产数量：${
            //       _that.graphData3.seriesData[params.seriesIndex].count
            //     }</div>
          },
        },
        legend: {
          type: "scroll",
          data: this.graphData3.legend,
        },
        grid: {
          x: 15,
          y: 50,
          x2: 15,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData3.xAxis,
            axisLabel: {
              color: "#97A3B7",
            },
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            axisTick: {
              // 不展示刻度
              show: false,
            },
          },
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: {
          type: "value",
          name: this.graphData3.yAxis.name + "（万元）",
          minInterval: 1,
          axisLabel: {
            formatter: "{value}",
            color: "#97A3B7",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          min: "dataMin",
          max: "dataMax",
        },
        series: [],
      };

      // 月度
      for (let i = 0; i < this.graphData3.seriesData.length; i++) {
        option3.series.push({
          type: "line",
          // stack: "Total",
          name: this.graphData3.seriesData[i].name,
          data: this.graphData3.seriesData[i].data,
          color: this.lineColor[i],
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              const money = Number(
                _that.graphData3.seriesData[params.seriesIndex].data[
                  params.dataIndex
                ]
              ).toLocaleString();
              return money + "万元";
            },
          },
        });
      }
      this.myChart3.setOption(option3, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart3, option3, this.graphData3.xAxis);
    },

    //图4按项目类型分布情况图
    async initEcharts4() {
      //联动需要先clear
      if (this.myChart4) {
        this.myChart4.dispose();
      }
      this.myChart4 = this.$echarts.init(this.$refs.graph4);
      await this.getBudgetGraphDataFour();

      const _that = this;
      //环形图中心文字长度自适应
      let maxWidth = 80; // 设置最大宽度
      let initialFontSize = 24; // 初始字体大小
      let adjustedFontSize = adjustFontSize(
        Number(this.graphData4.total).toLocaleString(),
        maxWidth,
        initialFontSize
      );
      const option4 = {
        tooltip: {
          enterable: true,
          trigger: "item",
          triggerOn: "mousemove",
          //triggerOn: "click", // 设置触发方式为点击
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
          //jump
          // 提供图表穿透功能：用户点击图形上的某一分类后，系统跳转进入【资产卡片明细表】，并自动附带筛选条件【主管单位】【资产类型】【时间范围】。
          formatter: (params) => {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            console.log(params, "图4params");
            const paramsYear = _that.yearRange;
            const name = params.data.name;
            const value = Number(params.data.value).toLocaleString();
            const rate = params.data.rate;
            const total = Number(_that.graphData4.total).toLocaleString();
            //跳转
            return `<div class="ratio-tooltip-box">
              <div>年份：${_that.graphData4.year}年</div>
              <div>
                项目类型：${name}
              </div>
              <a style="cursor: pointer;" onClick="goPayDetail('${paramsYear[0]}','${paramsYear[1]}',null,null,null,null,'${_that.curTreeItem.title}')">支出金额：${value}万元</a>
              <div>支出总额：${total}万元</div>
              <div>
                占比：${rate}%
              </div>
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
            radius: ["40%", "70%"],
            center: ["50%", "50%"],
            // roseType: "radius", //控制每个圆环粗细是否一致
            // 避免数据过小 不展示
            // minAngle: 1,
            data: this.graphData4.seriesData,
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
                return name + "\n" + value + "万元\n" + rate + "% ";
                // return `
                //   ${name}
                //   支出金额：${value}万元
                //   占比：${occ}
                // `;
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
            top: 115,
            style: {
              text: Number(this.graphData4.total).toLocaleString(),
              textAlign: "center",
              fill: "#1C222B", //文字的颜色
              fontSize: adjustedFontSize,
              lineHeight: adjustedFontSize,
              fontWeight: 600,
            },
          },
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: 145,
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

      this.myChart4.setOption(option4);
      // this.myChart4.on("click", (params) => {
      //   console.log("点击环形图事件", params);
      //   this.$router.push({
      //     name: "assertsDetail",
      //     params: {
      //       //参数
      //     },
      //   });
      // });
    },

    //图5按项目类型趋势折线图
    async initEcharts5() {
      //联动需要先clear
      if (this.myChart5) {
        this.myChart5.dispose();
      }
      this.myChart5 = this.$echarts.init(this.$refs.graph5);
      await this.getBudgetGraphDataFive();

      const _that = this;
      //整体支出均衡性
      const option5 = {
        tooltip: {
          //trigger: "axis",
          // triggerOn: "click",
          enterable: true,
          triggerOn: "mousemove", // 设置触发方式为悬停
          //弹框固定位置
          position: function (point) {
            return [point[0] + 5, point[1] + 5];
          },
          formatter: function (params) {
            if (params.seriesName.length === 0) {
              return ""; // 没有数据时，不显示 tooltip
            }
            console.log(params, "图5params");
            //跳转携带时间
            const paramsYear = _that.yearRange;
            const total = Number(
              _that.graphData5.seriesData[params.componentIndex].total[
                params.dataIndex
              ]
            ).toLocaleString();

            const data = Number(params.data).toLocaleString();
            return `<div class="ratio-tooltip-box" style="pointer-events:auto">
                <div>年份：${params.name}</div>
                <div>项目类型：${params.seriesName}</div>
                <a onClick="goPayDetail('${paramsYear[0]}','${
              paramsYear[1]
            }',null,null,null,null,'${
              _that.curTreeItem.title
            }')">年度支出金额：${data}万元</a>
                <div>年度支出总额：${total}万元</div>
                <div>占比：${
                  _that.graphData5.seriesData[params.seriesIndex].rate[
                    params.dataIndex
                  ]
                }%</div>

            </div>`;
            // <div>资产数量：${
            //       _that.graphData5.seriesData[params.seriesIndex].count
            //     }</div>
          },
        },
        legend: {
          type: "scroll",
          data: this.graphData5.legend,
        },
        grid: {
          x: 15,
          y: 50,
          x2: 15,
          y2: 10,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.graphData5.xAxis,
            axisLabel: {
              color: "#97A3B7",
            },
            axisPointer: {
              type: "shadow",
            },
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: false,
            },
            axisTick: {
              // 不展示刻度
              show: false,
            },
          },
          {
            type: "category",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            axisPointer: { show: false },
          },
        ],
        yAxis: {
          type: "value",
          name: this.graphData5.yAxis.name + "（万元）",
          minInterval: 1,
          axisLabel: {
            formatter: "{value}",
            color: "#97A3B7",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          min: "dataMin",
          max: "dataMax",
        },
        series: [],
      };

      // 月度
      for (let i = 0; i < this.graphData5.seriesData.length; i++) {
        option5.series.push({
          type: "line",
          // stack: "Total",
          name: this.graphData5.seriesData[i].name,
          data: this.graphData5.seriesData[i].data,
          color: this.lineColor[i],
        });
      }
      this.myChart5.setOption(option5, true);
      //图表背景色
      // handleAddEchartsBackground(this.myChart5, option5, this.graphData5.xAxis);
      //点击legend实时改变纵坐标
      this.myChart5.on("legendselectchanged", (params) => {
        const selectedSeries = params.selected;
        const data = [];

        for (const seriesName in selectedSeries) {
          if (selectedSeries[seriesName]) {
            const series = option5.series.find((s) => s.name === seriesName);
            if (series) {
              data.push(...series.data);
            }
          }
        }
        const _that = this;
        if (data.length > 0) {
          const max = Math.max(...data);
          const min = Math.min(...data);

          _that.myChart5.setOption({
            yAxis: {
              min: min - 10, // 可以根据需要调整
              max: max + 10, // 可以根据需要调整
            },
          });
          // handleAddEchartsBackground(
          //   _that.myChart5,
          //   option5,
          //   _that.graphData5.xAxis
          // );
        }
      });
    },

    //项目执行明细排序
    sortOne() {
      this.sortShow1 = true;
    },
    onSortCancel1() {
      this.sortShow1 = false;
    },
    onSortConfirm1(sortStringOne) {
      this.sortStringOne = sortStringOne;
      this.getBudgetTableOne();
      // this.initTable();
      this.onSortCancel1();
    },

    //非税收入明细排序
    sortTwo() {
      this.sortShow2 = true;
    },
    onSortCancel2() {
      this.sortShow2 = false;
    },
    onSortConfirm2(sortStringTwo) {
      this.sortStringTwo = sortStringTwo;
      this.getBudgetTableTwo();
      this.onSortCancel2();
    },

    //项目执行明细筛选
    filterOne() {
      this.filterShow1 = true;
    },
    addTable1(json) {
      this.tableData1 = [...this.tableData1, json];
    },
    //筛选：增加
    delTable1(arr) {
      this.tableData1 = arr;
    },
    onFilterCancel1() {
      this.filterShow1 = false;
    },
    onFilterConfirm1(filterConfirmArrOne) {
      this.filterConfirmArrOne = filterConfirmArrOne;
      this.getBudgetTableOne();
      // this.initTable();
      this.onFilterCancel1();
    },

    //非税收入明细筛选
    filterTwo() {
      this.filterShow2 = true;
    },

    addTable2(json) {
      this.tableData2 = [...this.tableData2, json];
    },
    //筛选：增加
    delTable2(arr) {
      this.tableData2 = arr;
    },
    onFilterCancel2() {
      this.filterShow2 = false;
    },
    onFilterConfirm2(filterConfirmArrTwo) {
      this.filterConfirmArrTwo = filterConfirmArrTwo;
      this.getBudgetTableTwo();
      // this.getSpendTable();
      this.onFilterCancel2();
    },

    //资产明细四个表
    //------资产明细排序按钮
    sortBtnDetail() {
      switch (this.assertsSelected) {
        case 1:
          this.sortShow3 = true;
          break;
        case 2:
          this.sortShow4 = true;
          break;
        case 3:
          this.sortShow5 = true;
          break;
        case 4:
          this.sortShow6 = true;
          break;
        default:
          break;
      }
    },

    //房屋
    onSortCancel3() {
      this.sortShow3 = false;
    },
    onSortConfirm3(sortStringThree) {
      this.sortStringThree = sortStringThree;
      this.getBudgetTableHouse();
      this.onSortCancel3();
    },

    //车辆
    onSortCancel4() {
      this.sortShow4 = false;
    },
    onSortConfirm4(sortStringFour) {
      this.sortStringFour = sortStringFour;
      this.getBudgetTableCar();
      this.onSortCancel4();
    },

    //土地
    onSortCancel5() {
      this.sortShow5 = false;
    },
    onSortConfirm5(sortStringFive) {
      this.sortStringFive = sortStringFive;
      this.getBudgetTableLand();
      this.onSortCancel5();
    },

    //其他
    onSortCancel6() {
      this.sortShow6 = false;
    },
    onSortConfirm6(sortStringSix) {
      this.sortStringSix = sortStringSix;
      this.getBudgetTableOthers();
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

    //房屋
    onFilterCancel3() {
      this.filterShow3 = false;
    },
    onFilterConfirm3(filterConfirmArrThree) {
      this.filterConfirmArrThree = filterConfirmArrThree;
      this.getBudgetTableHouse();
      this.onFilterCancel3();
    },
    addTable3(json) {
      this.filterTableData3 = [...this.filterTableData3, json];
    },
    delTable3(arr) {
      this.filterTableData3 = arr;
    },

    //车辆
    onFilterCancel4() {
      this.filterShow4 = false;
    },
    onFilterConfirm4(filterConfirmArrFour) {
      this.filterConfirmArrFour = filterConfirmArrFour;
      this.getBudgetTableCar();
      this.onFilterCancel4();
    },
    addTable4(json) {
      this.filterTableData4 = [...this.filterTableData4, json];
    },
    delTable4(arr) {
      this.filterTableData4 = arr;
    },

    //土地
    onFilterCancel5() {
      this.filterShow5 = false;
    },
    onFilterConfirm5(filterConfirmArrFive) {
      this.filterConfirmArrFive = filterConfirmArrFive;
      this.getBudgetTableLand();
      this.onFilterCancel5();
    },
    addTable5(json) {
      this.filterTableData5 = [...this.filterTableData5, json];
    },
    delTable5(arr) {
      this.filterTableData5 = arr;
    },

    //其他
    onFilterCancel6() {
      this.filterShow6 = false;
    },
    onFilterConfirm6(filterConfirmArrSix) {
      this.filterConfirmArrSix = filterConfirmArrSix;
      this.getBudgetTableOthers();
      this.onFilterCancel6();
    },
    addTable6(json) {
      this.filterTableData6 = [...this.filterTableData6, json];
    },
    delTable6(arr) {
      this.filterTableData6 = arr;
    },

    //---查看更多跳转   该功能取消
    //资产明细查看更多跳转
    // lookMore() {
    //   this.$router.push({
    //     path: "/budget-portrait/budget-assert",
    //     // query: {
    //     //   type: 1,
    //     // },
    //   });

    //项目执行明细跳转
    lookMoreOne() {
      const params = {
        year: this.curYearConfirm,
        budgetUnitCode: this.curTreeItem.key,
      };
      this.$router.push({
        path: "/budget-portrait/budget-project",
        query: params,
      });
    },
    //非税收入明细跳转
    lookMoreTwo() {
      const params = {
        year: this.curYearConfirm,
        budgetUnitCode: this.curTreeItem.key,
      };
      this.$router.push({
        path: "/budget-portrait/budget-tax",
        query: params,
      });
    },
    //三公支出明细跳转
    lookMoreThree() {
      const params = {
        year: this.curYearConfirm,
        budgetUnitCode: this.curTreeItem.key,
      };
      this.$router.push({
        path: "/budget-portrait/budget-public",
        query: params,
      });
    },
  },
};
</script>
<style lang="less">
.budget-detail {
  width: calc(100% - 320px);
  min-height: 100%;
  padding: 20px;
  background: #fff;
  display: flex;

  .budget-right {
    display: flex;
    width: 100%;
    min-height: 100%;
    position: relative;

    &-content {
      width: calc(100% - 220px);
      margin-right: 220px;

      &-header {
        height: 28px;
        line-height: 28px;
        color: #1c222b;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      &-overview {
        width: 100%;
        height: 272px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 126px;
        gap: 20px;
        margin-bottom: 20px;

        .overview-item {
          //每个小方块
          height: 126px;
          padding: 20px 0 20px 16px;
          color: #3c485c;
          border-radius: 6px;
          background: linear-gradient(104deg, #dfeaff 0%, #f4f6ff 100.1%);
          position: relative;

          .item-top {
            height: 22px;
            line-height: 22px;
          }

          .item-middle {
            margin: 10px 0;
            font-weight: 500;
            font-size: 24px;
            height: 24px;
            line-height: 24px;
          }

          .item-bottom {
            display: flex;

            &-icon {
              width: 12px;
              height: 12px;
              margin-left: 4px;
            }
          }

          .item-icon {
            width: 64px;
            height: 64px;
            position: absolute;
            right: 15px;
            bottom: 10px;
          }
        }
      }

      .layout-btns {
        width: 100%;
        height: 80px;
        padding: 24px 0;
        display: flex;
        background: #fff;
        position: relative;
        align-items: center;
        transition: all 0.3s;

        &-item {
          margin-right: 14px;
          cursor: pointer;

          .layout-btn {
            border: none;
            border-radius: 2px !important;
            background: linear-gradient(
              to right,
              rgba(1, 110, 255, 0.6),
              rgba(1, 110, 255)
            );
            color: #fff;
            padding: 0 14px;
            display: flex;
            align-items: center;

            &-text {
              font-size: 16px;
              line-height: 32px;
            }

            &.active {
              color: @cyan;
            }
          }
        }
      }

      @media screen and (max-width: 1356px) {
        .layout-btns {
          &-item {
            margin-right: 8px;

            .layout-btn {
              padding: 0 8px;
            }
          }
        }
      }

      .layout-basic-details {
        width: 100%;
        display: grid;
        border-top: 1px solid @borderColor;
        border-left: 1px solid @borderColor;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: repeat(5, 42px) auto;
        margin-bottom: 36px;
        transition: all 0.2s;

        .details-item {
          display: flex;
          width: 100%;
          align-items: center;
          font-size: 14px;
          color: @primaryTextColor;
          border-right: 1px solid @borderColor;
          border-bottom: 1px solid @borderColor;

          &-label {
            width: 160px;
            text-align: right;
            background: @tableHeaderColor;
            display: inline-block;
            height: 100%;
            line-height: 42px;
            padding-right: 20px;
            border-right: 1px solid @borderColor;
            position: relative;
          }

          &-value {
            width: calc(100% - 160px);
            padding-left: 12px;
          }

          &.main {
            grid-column-start: 1;
            grid-column-end: 4;
            grid-row-start: 6;
            grid-row-end: 7;
            align-items: stretch;

            .details-item-label {
              height: auto;

              .label-text {
                height: auto;
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
              }
            }

            .details-item-value {
              line-height: 32px;
              padding: 5px 12px;
            }
          }
        }
        // .details-item:nth-of-type(17) {
        //   /* 列合并 */
        //   grid-column: 2 / span 2;
        // }
        .details-item:nth-of-type(26) {
          /* 列合并 */
          grid-column: 2 / span 2;
        }
      }

      // .layout-institution {
      //   height: 216px;
      //   max-height: 216px;
      //   margin-bottom: 36px;
      //   display: grid;
      //   grid-template-columns: 1fr 1fr 1fr 1fr;
      //   grid-template-rows: 98px;
      //   gap: 16px;
      //   overflow: auto;

      //   &-item {
      //     border-radius: 4px;
      //     border: 1px solid #d6dbe3;
      //     background: #fff;
      //     padding: 14px 16px;

      //     .item-title {
      //       height: 20px;
      //       margin-bottom: 10px;
      //       display: flex;
      //       align-items: center;

      //       &-icon {
      //         width: 20px;
      //         height: 20px;
      //       }
      //     }

      //     .item-content {
      //       color: #97a3b7;
      //       display: -webkit-box; /*  display: -webkit-box; 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示  */
      //       -webkit-box-orient: vertical; /*  -webkit-box-orient 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式  */
      //       -webkit-line-clamp: 2; /*  -webkit-line-clamp用来限制在一个块元素显示的文本的行数 */
      //       overflow: hidden;
      //     }
      //   }
      // }

      .layout-institution {
        height: 400px;
        margin-bottom: 36px;

        &-table {
          min-height: 200px;
        }
      }

      .layout-power {
        height: 400px;
        margin-bottom: 36px;

        &-search {
          display: flex;
          margin-bottom: 20px;

          .search-input {
            width: 356px;
            margin-right: 10px;
          }
        }

        &-table {
          min-height: 200px;
        }
      }

      // 整体指出均衡性框
      .expenditure-balance {
        width: 100%;
        height: 360px;
        margin-bottom: 20px;
        border-radius: 6px;
        border: 1px solid #d6dbe3;
        background: #fff;
        padding: 12px 20px 20px 20px;

        .wrapper-top {
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          &-title {
            color: #1c222b;
            font-weight: 600;
          }

          &-action {
            display: flex;
            align-items: center;
            //width: 200px;
            justify-content: space-between;

            .action-choose,
            .action-reset {
              color: #1776ff;
              cursor: pointer;
            }
          }
        }

        .wrapper-split {
          width: 100%;
          height: 1px;
          background: #016eff;
          margin-bottom: 20px;
        }

        // 图的部分
        .wrapper-content {
          width: 100%;
          height: calc(100% - 43px);
          display: flex;
          justify-content: center;

          &-graph {
            width: 82%;
            height: 100%;
          }
        }
      }

      // 第二行的资金结构两个图
      .capital-structure {
        width: 100%;
        height: 360px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;

        &-item {
          //一左一右两个图
          height: 100%;
          width: calc(50% - 10px);
          border: 1px solid #d6dbe3;
          border-radius: 6px;
          padding: 12px 20px 20px 20px;
          background: #fff;

          .item-top {
            height: 22px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 9px;

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
            height: calc(100% - 52px);
            display: flex;
            justify-content: center;
            //内部图片
            &-graph {
              width: 95%;
              height: 100%;
            }
          }
        }
      }

      // 第三行的项目类型两个图
      .project-type {
        width: 100%;
        height: 360px;
        display: flex;
        justify-content: space-between;

        &-item {
          //一左一右两个图
          height: 100%;
          width: calc(50% - 10px);
          border: 1px solid #d6dbe3;
          border-radius: 6px;
          padding: 12px 20px 20px 20px;
          background: #fff;

          .item-top {
            height: 22px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 9px;

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
            height: calc(100% - 52px);
            display: flex;
            justify-content: center;
            //内部图片
            &-graph {
              width: 95%;
              height: 100%;
            }
          }
        }
      }

      //按钮
      .table-top {
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
    }

    .params-config {
      width: 200px;
      position: fixed;
      right: 40px;
      border: 1px solid #d6dbe3;
      border-radius: 6px;
      padding: 12px 16px;

      &-header {
        color: #3c485c;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      &-item {
        width: 100%;
        margin-bottom: 10px;

        .item-label {
          margin-bottom: 4px;
        }

        .item-set {
          width: 100%;
          display: flex;
          align-items: center;

          &-input {
            width: 60%;
          }

          &-color-red,
          &-color-orange {
            width: 24px;
            height: 24px;
            margin-left: 16px;
          }

          &-color-red {
            background-color: red;
          }
          &-color-orange {
            background-color: #f28518;
          }
        }

        .item-input {
          width: 100%;

          .ant-input-number-handler-wrap {
            display: none;
          }
        }

        .right-action-input {
          width: 100%;

          // .ant-input-number-handler-wrap {
          //   display: none;
          // }
        }
      }

      &-btns {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20px;
      }
    }
  }
}
// 页面弹框
.budget-details-fixed {
  .ant-popover-content {
    border-radius: 4px;
    border: 1px solid #d6dbe3;
    background: #fff;
    box-shadow: 0px 8px 16px 0px rgba(23, 118, 255, 0.05),
      0px 20px 16px 4px rgba(23, 118, 255, 0.08);

    .ant-popover-arrow {
      display: none !important;
    }

    .ant-popover-inner-content {
      width: 210px;

      .content-item {
        &-label {
          margin-bottom: 4px;
        }
        &-value {
          width: 100%;
        }

        &:not(:last-child) {
          margin-bottom: 16px;
        }
      }

      .content-btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
