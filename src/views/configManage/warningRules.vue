<template>
  <div class="config-manage-layout">
    <MainContent title="规则定义">
      <template slot="content">
        <div class="condition-count">
          <div class="condition-count-item">
            <div class="item-left">
              <icon-svg icon-class="icon_count1" class="icon-count1" />
            </div>
            <div class="item-right">
              <div class="count-num">
                {{
                  (list[0].children.length &&
                    list[0].children.length.toLocaleString()) ||
                  0
                }}
              </div>
              <span>累计规则分类</span>
            </div>
          </div>
          <div class="condition-count-item">
            <div class="item-left">
              <icon-svg icon-class="icon_count2" class="icon-count2" />
            </div>
            <div class="item-right">
              <div class="count-num">
                {{ pagination.total.toLocaleString() || 0 }}
              </div>
              <span>累计创建规则</span>
            </div>
          </div>
          <div class="condition-count-item">
            <div class="item-left">
              <icon-svg icon-class="icon_count3" class="icon-count3" />
            </div>
            <div class="item-right">
              <div class="count-num">{{ classifyCounts.rule }}</div>
              <span>当月新增规则</span>
            </div>
          </div>
        </div>
        <div class="risk-warning-rules">
          <div class="rules-left">
            <div class="warning-title">
              <div class="warning-title-content">
                <span>策略规则分类</span>
                <!-- <a-tooltip placement="top" overlayClassName="item-title-tooltip">
                  <template slot="title">
                    <span>需求收集</span>
                  </template>
                  <icon-svg icon-class="icon_rocket" class="icon-rocket" />
                </a-tooltip> -->
              </div>

              <!-- <div class="warning-icon">
                <a-icon
                  type="plus-square"
                  class="plus"
                  @click="
                    (e) => {
                      addList(e, '全部');
                    }
                  "
                />
                <a-icon
                  type="folder-add"
                  class="folder"
                  @click="
                    (e) => {
                      addFolder(e);
                    }
                  "
                />
              </div> -->

              <!-- <div class="change-btn">
                <a-radio-group
                  class="result-radio"
                  v-model="resultType"
                  @change="onResultTypeChange"
                >
                  <a-radio-button value="1"> SQL </a-radio-button>
                  <a-radio-button value="2"> 图 </a-radio-button>
                </a-radio-group>
              </div> -->
            </div>
            <div>
              <a-tree
                show-icon
                :default-expanded-keys="['全部']"
                @select="onSelect"
                :treeData="list"
                :icon="getIcon"
                blockNode
                @rightClick="show"
              >
                <template slot="folder" slot-scope="item">
                  <div class="tree-view-item">
                    <span class="tree-view-left">{{ item.title }}</span>
                    <div class="tree-view-right">
                      <a-icon
                        type="plus-square"
                        class="btn"
                        @click="
                          (e) => {
                            addList(e, item.key);
                          }
                        "
                      />
                      <a-icon
                        type="delete"
                        class="btn"
                        @click="
                          (e) => {
                            deleteList(item, e);
                          }
                        "
                      />
                    </div>
                  </div>
                </template>
                <template slot="leaf" slot-scope="item">
                  <div class="tree-view-item">
                    <span class="tree-view-left">{{ item.title }}</span>
                    <div class="tree-view-right">
                      <a-icon
                        type="delete"
                        class="btn"
                        @click="
                          (e) => {
                            deleteList(item, e);
                          }
                        "
                      />
                    </div>
                  </div>
                </template>
              </a-tree>
            </div>
            <a-modal
              title="添加文件夹"
              :visible="showFolder"
              @ok="okFolder"
              @cancel="cancelFolder"
              okText="确定"
              cancelText="取消"
              centered
              :width="450"
            >
              <a-input
                placeholder="请输入需要添加的文件夹名称"
                v-model.trim="folderName"
              />
            </a-modal>
            <a-modal
              title="添加分类"
              :visible="showList"
              @ok="okLeaf"
              @cancel="cancelList"
              okText="确定"
              cancelText="取消"
              centered
              class="add-sub-menu"
              :width="450"
            >
              <div>
                <a-select v-model="defaultKey" class="select-file">
                  <a-select-option
                    v-for="item in optionFileName"
                    :key="item.key"
                    :value="item.key"
                  >
                    {{ item.title }}
                  </a-select-option>
                </a-select>
                <a-input
                  placeholder="请输入需要添加的分类名称"
                  v-model.trim="listName"
                  class="input-file"
                />
              </div>
            </a-modal>
          </div>
          <div class="rules-right">
            <div class="rule-options" v-if="!addRuleVisible">
              <div class="rule-options-content" v-if="resultType === '1'">
                <div class="rule-options-item">
                  <span class="item-label">规则名称：</span>
                  <a-input
                    type="text"
                    class="item-input"
                    v-model.trim="ruleName"
                    placeholder="请输入规则名称"
                  />
                </div>
                <div class="rule-options-item">
                  <span class="item-label">规则描述：</span>
                  <a-input
                    type="text"
                    class="item-input"
                    v-model.trim="ruleDesc"
                    placeholder="请输入规则描述"
                  />
                </div>
                <div class="rule-options-item">
                  <span class="item-label">规则生成方式：</span>
                  <a-select v-model="modeValue" class="item-input">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="0">配置化</a-select-option>
                    <a-select-option :value="1">SQL</a-select-option>
                  </a-select>
                </div>
                <div class="rule-options-item">
                  <span class="item-label">最后修改人：</span>
                  <a-input
                    type="text"
                    class="item-input"
                    v-model.trim="updatePerson"
                    placeholder="请输入最后修改人"
                  />
                </div>
                <div class="rule-options-btns">
                  <a-button
                    type="primary"
                    @click="onSearch('init')"
                    icon="search"
                  >
                    搜索
                  </a-button>
                  <a-button @click="onReset">
                    <a-icon type="redo" :rotate="-90" /> 重置
                  </a-button>
                </div>
              </div>
              <div class="rule-options-content" v-if="resultType === '2'">
                <div class="rule-options-item common-item">
                  <span class="item-label">规则分类：</span>
                  <a-select
                    class="item-input"
                    v-model="warningClass"
                    placeholder="请选择分类"
                  >
                    <a-select-option
                      v-for="item in warningClassOption"
                      :key="item.value"
                      :value="item.value"
                      :title="item.label"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="rule-options-item common-item">
                  <span class="item-label">规则等级：</span>
                  <a-select v-model="warningLevel" class="item-input">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="1">一级</a-select-option>
                    <a-select-option :value="2">二级</a-select-option>
                    <a-select-option :value="3">三级</a-select-option>
                  </a-select>
                </div>
                <div class="rule-options-item common-item">
                  <span class="item-label">规则状态：</span>
                  <a-select v-model="warningState" class="item-input">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="0">上线</a-select-option>
                    <a-select-option :value="1">草稿</a-select-option>
                  </a-select>
                </div>
                <div class="rule-options-item common-item">
                  <span class="item-label">规则类型：</span>
                  <a-select v-model="warningType" class="item-input">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="1">内置</a-select-option>
                    <a-select-option :value="0">自定义</a-select-option>
                  </a-select>
                </div>
                <div class="rule-options-item name-item">
                  <span class="item-label">规则名称：</span>
                  <a-input
                    type="text"
                    class="item-input"
                    v-model.trim="warningName"
                    placeholder="请输入规则名称"
                  />
                </div>
                <div class="rule-options-item info-search">
                  <span class="item-label">规则搜索：</span>
                  <a-input
                    type="text"
                    class="item-input"
                    v-model.trim="warningId"
                    placeholder="请输入规则ID流水号"
                  />
                </div>
                <div class="rule-options-btns">
                  <a-button
                    type="primary"
                    @click="onSearch('init')"
                    icon="search"
                  >
                    搜索
                  </a-button>
                  <a-button @click="onReset">
                    <a-icon type="redo" :rotate="-90" /> 重置
                  </a-button>
                </div>
              </div>
            </div>
            <div class="table-btns" v-if="!addRuleVisible">
              <a-button
                type="primary"
                @click="handleAddRule"
                icon="plus-circle"
              >
                添加
              </a-button>
              <a-button @click="onSearch('init')" icon="sync">刷新</a-button>
            </div>
            <table-component
              :columns="columns"
              :data-source="tableValue"
              :rowKey="(record) => record.id"
              :pagination="pagination"
              :loading="tableLoading"
              class="rule-table"
              v-if="!addRuleVisible"
            >
              <div
                slot="modeValue"
                slot-scope="record"
                class="way-slot"
                v-if="resultType === '1'"
              >
                <span
                  class="way-slot-item item-config"
                  v-if="record.modeValue === 0"
                  >配置化</span
                >
                <span class="way-slot-item item-sql" v-else>SQL</span>
              </div>
              <div slot="modeValue" slot-scope="record" class="way-slot" v-else>
                <span
                  class="way-slot-item item-config"
                  v-if="record.modeValue === '0'"
                  >自定义</span
                >
                <span class="way-slot-item item-sql" v-else>内置</span>
              </div>
              <div slot="actions" slot-scope="record" v-if="resultType === '1'">
                <a @click="startRule(record)" v-if="record.status == 0">停用</a>
                <a @click="startRule(record)" v-else>启用</a>
                <a @click="handleEdit(record)" v-if="record.status === 1"
                  >编辑</a
                >
                <a @click="handleDelete(record)" v-if="record.status === 1"
                  >删除</a
                >
                <a @click="handleExecute(record)" v-else>立即检测</a>
                <a @click="handleCopy(record)">复制</a>
              </div>
              <span slot="actions" slot-scope="record" class="actions" v-else>
                <a @click="detailInfo(record)">详情</a>
                <a v-if="record.status === '草稿'" @click="editInfo(record)"
                  >编辑</a
                >
                <a-popover overlayClassName="more-actions">
                  <template slot="content">
                    <p @click="startRule(record)">
                      {{ record.status === "上线" ? "停用" : "启用" }}
                    </p>
                    <p
                      v-if="record.status === '上线'"
                      @click="testInfo(record)"
                    >
                      立即检测
                    </p>
                    <p @click="checkInfo(record)">结果查询</p>
                    <p
                      v-if="
                        record.ruleType !== '内置' && record.status === '草稿'
                      "
                      @click="handleDelete(record)"
                    >
                      删除
                    </p>
                  </template>
                  <a>更多</a>
                </a-popover>
              </span>
            </table-component>
            <div class="add-rule-part" v-if="addRuleVisible">
              <div class="add-rule-part-content">
                <p class="add-rule-part-title">{{ addTitle }}</p>
                <div class="condition-part" v-if="resultType === '1'">
                  <div class="sub-title">基本信息</div>
                  <div class="rules-details-content">
                    <div class="detail-item">
                      <label class="item-label">规则类型:</label>
                      <div class="item-content">
                        <a-select
                          class="rule-type-select"
                          v-model="checkData.ruleType"
                          placeholder="请选择规则类型"
                        >
                          <a-select-option
                            v-for="item in ruleTypeOptions"
                            :key="item.value"
                            :value="item.value"
                          >
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div class="detail-item">
                      <label class="item-label">规则名称:</label>
                      <div class="item-content">
                        <a-input
                          type="text"
                          autoComplete="off"
                          v-model.trim="checkData.ruleName"
                          placeholder="请输入规则名称"
                          class="rule-name-input"
                          ref="ruleNameRef"
                        />
                      </div>
                    </div>
                    <div class="detail-item">
                      <label class="item-label">执行时间:</label>
                      <div class="item-content">
                        <a-range-picker
                          v-model="checkData.startStopTime"
                          format="YYYY-MM-DD"
                          valueFormat="YYYY-MM-DD"
                          class="do-time-input"
                        >
                          <template slot="suffixIcon">
                            <a-icon type="calendar" />
                          </template>
                        </a-range-picker>
                      </div>
                    </div>
                    <div class="detail-item">
                      <label class="item-label">检测周期:</label>
                      <div class="item-content">
                        <a-input-number
                          type="text"
                          v-model.trim="checkData.checkDate"
                          :min="1"
                          :precision="0"
                          placeholder="请输入数字"
                          class="check-num-input"
                        />
                        <a-select
                          v-model="checkData.cycleUnit"
                          class="cycle-unit-select"
                          placeholder="请选择时间"
                        >
                          <a-select-option :value="0">天</a-select-option>
                          <a-select-option :value="1">月</a-select-option>
                        </a-select>
                      </div>
                    </div>
                    <div class="detail-item" v-if="addTitle !== '新建规则'">
                      <label class="item-label">最后修改人:</label>
                      <div class="item-content">
                        {{ checkData.updatePerson }}
                      </div>
                    </div>
                    <div class="detail-item" v-if="addTitle !== '新建规则'">
                      <label class="item-label">修改时间:</label>
                      <div class="item-content">{{ checkData.updateTime }}</div>
                    </div>
                    <div class="detail-item">
                      <label class="item-label">规则描述:</label>
                      <div class="item-content">
                        <a-textArea
                          allow-clear
                          type="text"
                          placeholder="请输入规则描述"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                          v-model.trim="checkData.ruleDesc"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="sub-title">规则生成信息</div>
                  <div class="condition-group" v-if="addTitle === '新建规则'">
                    <span
                      class="condition-group-label"
                      style="line-height: 32px"
                      >配置方式:</span
                    >
                    <div class="condition-group-content">
                      <a-select
                        :value="checkData.modeValue"
                        class="item-select"
                        placeholder="请选择配置方式"
                        @change="handleChangeWay"
                      >
                        <a-select-option :value="0"
                          >从配置的条件选择</a-select-option
                        >
                        <a-select-option :value="1"
                          >完整SQL语句</a-select-option
                        >
                      </a-select>
                      <a-tooltip placement="top">
                        <template slot="title">
                          <span>
                            当规则配置方式为完整SQL语句时，该规则不可进行其他条件组合，该条件即为一条规则配置方式
                          </span>
                        </template>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </div>
                  </div>
                  <div class="condition-group" v-if="checkData.modeValue === 0">
                    <span
                      class="condition-group-label"
                      style="line-height: 28px"
                      >条件组:</span
                    >
                    <div class="condition-group-content">
                      <a-button
                        type="primary"
                        class="add-condition-btn"
                        @click="selectCondition('config', 'single', [])"
                      >
                        <a-icon type="file-add" />添加条件
                      </a-button>
                      <a-button
                        type="primary"
                        class="add-condition-btn"
                        @click="selectCondition('config', 'multi', [])"
                      >
                        <a-icon type="folder-add" />条件组
                      </a-button>
                      <a-button
                        class="add-condition-btn"
                        @click="resetRulesGroup"
                      >
                        重置
                      </a-button>
                    </div>
                  </div>
                  <div class="condition-group" v-if="checkData.modeValue === 1">
                    <span class="condition-group-label">当前条件:</span>
                    <div
                      class="condition-group-content"
                      v-if="checkData.conditionList.length <= 0"
                    >
                      <span class="condition-text">
                        请先选择一个SQL条件语句
                      </span>
                      <span class="change-btn" @click="selectCondition('sql')"
                        >选择条件</span
                      >
                    </div>
                    <div class="condition-group-content" v-else>
                      <span class="condition-text">{{
                        checkData.conditionList[0].conditionName
                      }}</span>
                      <span class="change-btn" @click="selectCondition('sql')"
                        >切换条件</span
                      >
                    </div>
                  </div>
                  <div class="condition-group" v-if="checkData.modeValue === 0">
                    <condition-group
                      :list="rulesGroup"
                      :originList="rulesGroup"
                      :value="[]"
                      :floor="0"
                      :isCondition="true"
                    />
                    <!-- @selectCondition="selectCondition" -->
                  </div>
                  <div
                    class="condition-group"
                    v-if="checkData.modeValue === 0 && addTitle !== '查看规则'"
                  >
                    <a-button
                      type="primary"
                      class="condition-group-btn"
                      :disabled="rulesGroup.length <= 1 || !isNeedRelation"
                      @click="handleSelectConnect"
                      >选择表关联字段</a-button
                    >
                  </div>
                  <div class="condition-group" v-if="checkData.modeValue === 0">
                    <a-button
                      v-if="addTitle !== '查看规则'"
                      type="primary"
                      class="condition-group-btn"
                      :disabled="rulesGroup.length <= 1"
                      @click="handleSelectName('self')"
                      >线索企业字段名称</a-button
                    >
                    <a-checkbox v-model="isSelfTop"
                      >查询企业所属集团</a-checkbox
                    >
                    <div class="condition-group-name">
                      <span class="name-text">线索企业字段名称：</span>
                      <span
                        class="name-content"
                        @click="handleSelectName('self')"
                        >{{
                          (checkData.tableName1 &&
                            (checkData.tableName1.chValue ||
                              checkData.tableName1.value)) ||
                          ""
                        }}</span
                      >
                      <span
                        class="name-content"
                        v-if="
                          checkData.tableName1 &&
                          (checkData.tableName1.chValue ||
                            checkData.tableName1.value)
                        "
                        >&nbsp;.&nbsp;</span
                      >
                      <span
                        class="name-content"
                        @click="handleSelectName('self')"
                        >{{
                          (checkData.entFiledName &&
                            (checkData.entFiledName.chValue ||
                              checkData.entFiledName.value)) ||
                          ""
                        }}</span
                      >
                    </div>
                  </div>
                  <div class="condition-group" v-if="checkData.modeValue === 0">
                    <a-button
                      v-if="addTitle !== '查看规则'"
                      type="primary"
                      class="condition-group-btn"
                      :disabled="rulesGroup.length <= 1"
                      @click="handleSelectName('relation')"
                      >关联企业字段名称</a-button
                    >
                    <a-checkbox v-model="isRelationTop"
                      >查询企业所属集团</a-checkbox
                    >
                    <div class="condition-group-name">
                      <span class="name-text">关联企业字段名称：</span>
                      <span
                        class="name-content"
                        @click="handleSelectName('relation')"
                        >{{
                          (checkData.tableName2 &&
                            (checkData.tableName2.chValue ||
                              checkData.tableName2.value)) ||
                          ""
                        }}</span
                      >
                      <span
                        class="name-content"
                        v-if="
                          checkData.tableName2 &&
                          (checkData.tableName2.chValue ||
                            checkData.tableName2.value)
                        "
                        >&nbsp;.&nbsp;</span
                      >
                      <span
                        class="name-content"
                        @click="handleSelectName('relation')"
                        >{{
                          (checkData.entRelationName &&
                            (checkData.entRelationName.chValue ||
                              checkData.entRelationName.value)) ||
                          ""
                        }}</span
                      >
                    </div>
                  </div>
                  <DetailTable
                    v-if="tableValue6.length"
                    tableTitle="关联表字段信息"
                    :columns="columns6"
                    :infoData="tableValue6"
                    :loading="tableLoading6"
                    :pagination="false"
                  >
                  </DetailTable>
                  <div
                    class="condition-group"
                    v-if="
                      checkData.modeValue === 1 &&
                      checkData.conditionList.length > 0
                    "
                  >
                    <span class="condition-group-label">条件描述:</span>
                    <div class="condition-group-content">
                      <span class="condition-text">{{
                        checkData.conditionList[0].conditionDesc || "无"
                      }}</span>
                    </div>
                  </div>
                  <div
                    class="condition-group"
                    v-if="
                      checkData.modeValue === 1 &&
                      checkData.conditionList.length > 0
                    "
                  >
                    <span class="condition-group-label">SQL语句:</span>
                    <div class="condition-group-content">
                      <a-textArea
                        allow-clear
                        type="text"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                        :value="checkData.ruleScripts"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div class="condition-part" v-else>
                  <div class="rule-content">
                    <div class="rule-content-item">
                      <p class="rule-content-item-title">
                        <span class="require">*</span>
                        <span class="text">规则名称</span>
                      </p>
                      <a-input
                        v-if="addTitle === '查看规则'"
                        class="rule-content-item-input"
                        type="text"
                        v-model="checkData.ruleName"
                        disabled
                        placeholder="请输入规则名称"
                      />
                      <a-input
                        v-else
                        class="rule-content-item-input"
                        type="text"
                        v-model.trim="ruleName"
                        placeholder="请输入规则名称"
                      />
                    </div>
                    <div class="rule-content-item">
                      <p class="rule-content-item-title">
                        <span class="require">*</span>
                        <span class="text">规则分类</span>
                      </p>
                      <a-select
                        v-if="addTitle === '新建规则'"
                        class="rule-content-item-input"
                        v-model="categoryId"
                        placeholder="请选择规则分类"
                        :options="ruleTypeOptions"
                      >
                      </a-select>
                      <a-input
                        v-else
                        class="rule-content-item-input"
                        type="text"
                        v-model="checkData.ruleCategoryName"
                        disabled
                        placeholder="规则分类"
                      />
                    </div>
                    <div class="rule-content-item">
                      <p class="rule-content-item-title">
                        <span class="require">*</span>
                        <span class="text">规则等级</span>
                      </p>
                      <a-select
                        v-if="addTitle === '新建规则'"
                        class="rule-content-item-input"
                        v-model="ruleLevel"
                        placeholder="请选择规则等级"
                      >
                        <a-select-option :value="1">一级</a-select-option>
                        <a-select-option :value="2">二级</a-select-option>
                        <a-select-option :value="3">三级</a-select-option>
                      </a-select>
                      <a-input
                        v-else
                        class="rule-content-item-input"
                        type="text"
                        v-model="checkData.levelText"
                        disabled
                        placeholder="规则等级"
                      />
                    </div>
                    <div class="rule-content-item">
                      <p class="rule-content-item-title">
                        <span class="require">*</span>
                        <span class="text">生效日期</span>
                      </p>
                      <a-range-picker
                        v-if="addTitle === '查看规则'"
                        v-model="checkData.startStopTime"
                        format="YYYY-MM-DD"
                        valueFormat="YYYY-MM-DD"
                        class="rule-content-item-input"
                        disabled
                      >
                        <template slot="suffixIcon">
                          <a-icon type="calendar" />
                        </template>
                      </a-range-picker>
                      <a-range-picker
                        v-else
                        v-model="startStopTime"
                        format="YYYY-MM-DD"
                        valueFormat="YYYY-MM-DD"
                        class="rule-content-item-input"
                      >
                        <template slot="suffixIcon">
                          <a-icon type="calendar" />
                        </template>
                      </a-range-picker>
                    </div>
                    <div class="rule-content-item">
                      <p class="rule-content-item-title">
                        <span class="require">*</span>
                        <span class="text">检测周期</span>
                      </p>
                      <div class="rule-content-item-input">
                        <a-input
                          v-if="addTitle === '查看规则'"
                          class="config-num-input"
                          type="text"
                          v-model="checkData.checkDate"
                          disabled
                          placeholder="检测周期"
                        />
                        <a-input-number
                          v-else
                          type="text"
                          v-model.trim="checkNum"
                          :min="1"
                          :precision="0"
                          placeholder="请输入数字"
                          class="config-num-input"
                        />
                        <a-select
                          v-if="addTitle === '查看规则'"
                          v-model="checkData.cycleUnit"
                          placeholder="请选择时间"
                          disabled
                        >
                          <a-select-option :value="0">天</a-select-option>
                          <a-select-option :value="1">月</a-select-option>
                        </a-select>
                        <a-select
                          v-else
                          v-model="checkUnit"
                          placeholder="请选择时间"
                        >
                          <a-select-option :value="0">天</a-select-option>
                          <a-select-option :value="1">月</a-select-option>
                        </a-select>
                      </div>
                    </div>
                  </div>
                  <p class="content-title">模型选择</p>
                  <div class="rule-content">
                    <div class="rule-content-item">
                      <p class="rule-content-item-title">
                        <span class="require">*</span>
                        <span class="text">图谱选择</span>
                      </p>
                      <a-input
                        v-if="addTitle === '查看规则'"
                        class="rule-content-item-input"
                        type="text"
                        v-model="checkData.graphChName"
                        disabled
                        placeholder="图谱选择"
                      />
                      <a-select
                        v-else
                        class="rule-content-item-input"
                        v-model="graphId"
                        placeholder="请选择应用图谱"
                        :options="graphOptions"
                      >
                      </a-select>
                    </div>
                    <div class="rule-content-item">
                      <p class="rule-content-item-title">
                        <span class="require">*</span>
                        <span class="text">模型选择</span>
                      </p>
                      <a-input
                        v-if="addTitle === '查看规则'"
                        class="rule-content-item-input"
                        type="text"
                        v-model="checkData.ruleModelName"
                        disabled
                        placeholder="模型"
                      />
                      <a-auto-complete
                        v-else
                        allow-clear
                        backfill
                        :filterOption="filterOption"
                        v-model="ruleModel"
                        @change="handleSelect"
                        placeholder="请选择模型"
                        class="rule-content-item-input"
                      >
                        <template slot="dataSource">
                          <a-select-option
                            v-for="item in modelOptions"
                            :key="item.value"
                            :value="item.value"
                            :title="item.label"
                            >{{ item.label }}</a-select-option
                          >
                        </template>
                      </a-auto-complete>
                    </div>
                  </div>
                  <p class="content-title" v-if="checkGraphVisible">
                    线索主体选择
                  </p>
                  <div class="rule-content" v-if="checkGraphVisible">
                    <div class="rule-content-model">
                      <div class="rule-content-model-box">
                        <SchemaGraph
                          :pathData="modelData"
                          graphId="model-graph-canvas"
                          :isModel="true"
                          :singleSelect="true"
                          @selectedElesChanged="selectedElesChanged"
                        />
                      </div>
                    </div>
                    <div class="rule-content-options">
                      <div class="rule-objs">
                        <p class="rule-objs-title">
                          请选择图中作为线索主体展示的实体
                        </p>
                        <!-- <a-input
                v-if="addTitle === '查看规则'"
                class="rule-objs-select"
                type="text"
                v-model="ruleObjs.value"
                disabled
                placeholder="请选择线索主体"
              />
              <a-select
                v-else
                class="rule-objs-select"
                placeholder="请选择线索主体"
                v-model="ruleObjs.value"
                allow-clear
                @change="handleChangeObjs"
                :options="objOptions"
              /> -->
                      </div>
                      <div
                        class="objs-attr-part"
                        v-if="!selectedEdges.length || addTitle === '查看规则'"
                      >
                        <div
                          class="objs-attr-part-item"
                          v-for="(item, index) in ruleObjs.label"
                          :key="index"
                        >
                          <span class="item-label">{{ item.value }}:</span>
                          <a-select
                            show-search
                            filter-option
                            class="item-select"
                            placeholder="请选择主体的属性"
                            v-model="item.attr"
                            allow-clear
                            :options="item.options"
                            :disabled="addTitle === '查看规则'"
                          />
                        </div>
                      </div>
                      <div
                        class="objs-attr-tips"
                        v-else-if="addTitle !== '查看规则'"
                      >
                        请选择图中的实体点
                      </div>
                    </div>
                  </div>
                  <!-- <p class="content-title">是否触发关联线索</p>
            <div class="rule-content">
              <span class="rule-content-title">标题：</span>
              <a-checkbox
                :indeterminate="indeterminate"
                :checked="checkAll"
                @change="onCheckAllChange"
                :disabled="addTitle === '查看规则' ? true : false"
                >全选</a-checkbox
              >
              <a-checkbox-group
                v-model="checkedList"
                :options="plainOptions"
                @change="onChange"
                :disabled="addTitle === '查看规则' ? true : false"
              />
            </div> -->
                </div>
              </div>
              <div class="add-rule-part-btns">
                <a-button @click="handleCancel"> 取消 </a-button>
                <a-button
                  v-if="addTitle === '查看规则' && checkData.status === 1"
                  type="primary"
                  @click="checkToEdit(checkData)"
                >
                  编辑
                </a-button>
                <a-button @click="handleReset" v-if="addTitle === '新建规则'">
                  重置
                </a-button>
                <a-button
                  v-if="addTitle === '编辑规则' || addTitle === '新建规则'"
                  type="primary"
                  @click="handleConfirm"
                >
                  提交
                </a-button>
              </div>
            </div>
          </div>
          <a-modal
            :width="400"
            :visible="addModelShow"
            :destroyOnClose="true"
            @ok="saveAdd"
            @cancel="onCancel"
            :mask="false"
            centered
            :title="addModelTitle"
          >
            <div class="search-modal-content">
              <a-input
                autoComplete="off"
                v-model.trim="nameValue"
                class="search-modal-input"
                placeholder="请输入类型名称"
              />
            </div>
          </a-modal>
          <a-modal
            :width="400"
            :visible="conditionModalShow"
            :destroyOnClose="true"
            @cancel="onConditionCancel"
            :mask="false"
            class="condition-modal"
            title="条件目录"
          >
            <div class="condition-modal-content">
              <div class="keywords-search">
                <a-input
                  allow-clear
                  v-model.trim="conditionKeywords"
                  autoComplete="off"
                  class="keywords-input"
                  placeholder="请输入条件关键词"
                />
                <a-button class="keywords-btn" icon="search" />
              </div>
              <a-tree
                v-model="checkedKeys"
                :checkable="this.selectMode === 'multiple' ? true : false"
                :expanded-keys="expandedKeys"
                :tree-data="conditionList"
                @expand="onExpand"
                @check="onCheck"
                :selectable="false"
                :load-data="onLoadData"
              />
            </div>
            <template slot="footer">
              <div class="footer-left">
                已选择{{ checkedKeys.length }}个条件
              </div>
              <div class="footer-right">
                <a-button @click="resetSelect"> 重置 </a-button>
                <a-button @click="selectConfirm" type="primary">
                  确定
                </a-button>
              </div>
            </template>
          </a-modal>
          <right-menu
            :show="rightMenuShow"
            @onMenuClick="onContextMenuClick"
            :contextMenuData="contextMenuData"
          />
          <a-modal
            :width="600"
            :visible="fieldModelShow"
            :destroyOnClose="true"
            @cancel="onQuotaCancel"
            :mask="false"
            centered
            :title="
              nameType === 'self'
                ? '请选择线索企业名称字段'
                : '请选择关联企业名称字段'
            "
          >
            <template slot="footer">
              <a-button key="back" @click="handleBack" v-if="current === 1">
                上一步
              </a-button>
              <a-button
                key="next"
                type="primary"
                :loading="loading"
                @click="handleNext"
                v-if="current === 0"
              >
                下一步
              </a-button>
              <a-button
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleSubmit"
                v-if="current === 1"
              >
                确定
              </a-button>
            </template>
            <div class="field-modal-content">
              <a-steps :current="current">
                <a-step
                  v-for="step in stepList"
                  :key="step.title"
                  :title="step.title"
                />
              </a-steps>
              <div class="field-modal-content-item" v-if="current === 0">
                <p class="item-title" v-if="nameType === 'self'">
                  请选择线索企业名称字段来源表
                </p>
                <p class="item-title" v-else>请选择关联企业名称字段来源表</p>
                <keep-alive>
                  <a-table
                    key="1"
                    :columns="columns1"
                    :data-source="tableValue1"
                    :rowKey="(record) => record.id"
                    :pagination="pagination1"
                    :row-selection="rowSelection1"
                    class="library-table"
                    bordered
                  >
                    <div
                      slot="filterDropdown"
                      slot-scope="{
                        setSelectedKeys,
                        selectedKeys,
                        confirm,
                        clearFilters,
                        column,
                      }"
                      style="padding: 8px"
                    >
                      <a-input
                        v-ant-ref="(c) => (searchInput = c)"
                        :placeholder="`Search ${column.dataIndex}`"
                        :value="selectedKeys[0]"
                        style="width: 188px; margin-bottom: 8px; display: block"
                        @change="
                          (e) =>
                            setSelectedKeys(
                              e.target.value ? [e.target.value] : []
                            )
                        "
                        @pressEnter="
                          () =>
                            handleSearch(
                              selectedKeys,
                              confirm,
                              column.dataIndex
                            )
                        "
                      />
                      <a-button
                        type="primary"
                        icon="search"
                        size="small"
                        style="width: 90px; margin-right: 8px"
                        @click="
                          () =>
                            handleSearch(
                              selectedKeys,
                              confirm,
                              column.dataIndex
                            )
                        "
                      >
                        查询
                      </a-button>
                      <a-button
                        size="small"
                        style="width: 90px"
                        @click="() => handleInputReset(clearFilters)"
                      >
                        重置
                      </a-button>
                    </div>
                    <a-icon
                      slot="filterIcon"
                      slot-scope="filtered"
                      type="search"
                      :style="{ color: filtered ? '#108ee9' : undefined }"
                    />
                    <template
                      slot="name"
                      slot-scope="text, record, index, column"
                    >
                      <span
                        v-if="searchText && searchedColumn === column.dataIndex"
                      >
                        <template
                          v-for="(fragment, i) in text
                            .toString()
                            .split(
                              new RegExp(
                                `(?<=${searchText})|(?=${searchText})`,
                                'i'
                              )
                            )"
                        >
                          <mark
                            v-if="
                              fragment.toLowerCase() ===
                              searchText.toLowerCase()
                            "
                            :key="i"
                            class="highlight"
                            >{{ fragment }}</mark
                          >
                          <template v-else>{{ fragment }}</template>
                        </template>
                      </span>
                      <template v-else>
                        {{ text }}
                      </template>
                    </template>
                  </a-table>
                </keep-alive>
              </div>
              <div class="field-modal-content-item" v-else>
                <p class="item-title">
                  当前企业名称字段来源表名称：{{ selectedRowKeys1[0] }}
                </p>
                <keep-alive>
                  <a-table
                    key="2"
                    :columns="columns2"
                    :data-source="tableValue2"
                    :rowKey="(record) => record.id"
                    :pagination="pagination2"
                    :row-selection="rowSelection2"
                    class="library-table"
                    :loading="tableLoading2"
                    bordered
                  >
                    <div
                      slot="filterDropdown"
                      slot-scope="{
                        setSelectedKeys,
                        selectedKeys,
                        confirm,
                        clearFilters,
                        column,
                      }"
                      style="padding: 8px"
                    >
                      <a-input
                        v-ant-ref="(c) => (searchInput = c)"
                        :placeholder="`Search ${column.dataIndex}`"
                        :value="selectedKeys[0]"
                        style="width: 188px; margin-bottom: 8px; display: block"
                        @change="
                          (e) =>
                            setSelectedKeys(
                              e.target.value ? [e.target.value] : []
                            )
                        "
                        @pressEnter="
                          () =>
                            handleSearch(
                              selectedKeys,
                              confirm,
                              column.dataIndex
                            )
                        "
                      />
                      <a-button
                        type="primary"
                        icon="search"
                        size="small"
                        style="width: 90px; margin-right: 8px"
                        @click="
                          () =>
                            handleSearch(
                              selectedKeys,
                              confirm,
                              column.dataIndex
                            )
                        "
                      >
                        Search
                      </a-button>
                      <a-button
                        size="small"
                        style="width: 90px"
                        @click="() => handleInputReset(clearFilters)"
                      >
                        Reset
                      </a-button>
                    </div>
                    <a-icon
                      slot="filterIcon"
                      slot-scope="filtered"
                      type="search"
                      :style="{ color: filtered ? '#108ee9' : undefined }"
                    />
                    <template
                      slot="name"
                      slot-scope="text, record, index, column"
                    >
                      <span
                        v-if="searchText && searchedColumn === column.dataIndex"
                      >
                        <template
                          v-for="(fragment, i) in text
                            .toString()
                            .split(
                              new RegExp(
                                `(?<=${searchText})|(?=${searchText})`,
                                'i'
                              )
                            )"
                        >
                          <mark
                            v-if="
                              fragment.toLowerCase() ===
                              searchText.toLowerCase()
                            "
                            :key="i"
                            class="highlight"
                            >{{ fragment }}</mark
                          >
                          <template v-else>{{ fragment }}</template>
                        </template>
                      </span>
                      <template v-else>
                        {{ text }}
                      </template>
                    </template>
                  </a-table>
                </keep-alive>
              </div>
            </div>
          </a-modal>
          <a-modal
            title="选择表关联字段"
            :visible="showGraphConnect"
            @ok="okGraphConnect"
            @cancel="onConnectCancel"
            :destroyOnClose="true"
            okText="完成"
            cancelText=""
            centered
            :width="1000"
            :loading="tableLoading3"
            class="relation-field-modal"
            :cancel-button-props="{ style: { display: 'none' } }"
          >
            <a-table
              :columns="columns3"
              :data-source="tableValue3"
              :pagination="false"
              :scroll="{ y: 275 }"
              :customRow="customRow"
              bordered
              :rowKey="(record) => record.index"
            >
              <div slot="main" slot-scope="text, record">
                <!-- <a @click="handleClickMain(text, record)">点击查看</a> -->

                <a-radio :checked="text" @click="handleClickMain(text, record)">
                </a-radio>
              </div>
              <!-- <span slot="main" slot-scope="record">
          <input :checked="record" type="radio" name="radio" @change="" />
          {{ record }}
        </span> -->
            </a-table>

            <span class="graphName-title"
              >当前审计专题库表名称：<span class="text-blue">{{
                (selectedGraph && selectedGraph.graphName) || ""
              }}</span></span
            >
            <a-table
              :columns="columns4"
              :data-source="tableValue4"
              :row-selection="rowSelection3"
              :rowKey="(record) => record.index"
              :pagination="false"
              :scroll="{ y: 275 }"
              bordered
            />
            <span class="show-title">关联条件展示</span>
            <a-table
              :columns="columns5"
              :data-source="tableValue5"
              :pagination="false"
              bordered
              :rowKey="(record) => record.graphName"
            />
          </a-modal>
        </div>
      </template>
    </MainContent>
  </div>
</template>
<script>
import MainContent from "@/components/mainContent";
import RightMenu from "@/components/rightMenu";
import TableComponent from "@/components/tableComponent";
import {
  delAbRule,
  executeRuleScripts,
  gerTreeConditionCategory,
  getDataSourceTablesField,
  queryConditionByPage,
  queryConTableCount,
  queryConTableField,
  queryRuleByPage,
  saveOrUpdateRule,
  updateAbRuleStatus,
} from "@/shared/api/auditManage.js";
import {
  addListCategory,
  addOrEditWarningRule,
  deleteSingleRules,
  deleteWarningCategory,
  editWarningRuleStatus,
  getCategoryList,
  getRuleDetails,
  getRuleModelDetails,
  graphPreview,
  queryRuleRelation,
  searchRuleList,
} from "@/shared/api/configManage.js";
import { doModelTask } from "@/shared/api/graph.js";
import { getWarningList } from "@/shared/api/riskWarning.js";
import { getRulesGroup, modalConfirm } from "@/utils/common.js";
import ConditionGroup from "@/views/auditMode/components/conditionGroup";
import SchemaGraph from "@/views/configManage/components/schemaGraph";
import {
  AutoComplete,
  Button,
  Checkbox,
  DatePicker,
  Icon,
  Input,
  InputNumber,
  Popover,
  Radio,
  Steps,
  Tooltip,
  Tree,
} from "ant-design-vue";
import { cloneDeep, difference, find, findIndex } from "lodash";
import moment from "moment";
import { nanoid } from "nanoid";
import { mapState } from "vuex";
import DetailTable from "./components/detailTable";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Step } = Steps;

export default {
  name: "WarningRules",
  data() {
    return {
      list: [
        {
          title: "全部",
          key: "全部",
          level: 0,
          children: [],
        },
      ],
      showList: false,
      showFolder: false,
      folderName: "",
      listName: "",
      columns: [],
      defaultKey: "全部",
      tableValue: [],
      warningLevel: "",
      warningClass: "全部",
      warningState: "",
      warningId: "",
      warningClassOption: [],
      graphRuleClassOptions: [],
      SQLRuleClassOptions: [],
      ruleModel: undefined,
      ruleLevel: undefined,
      modelOptions: [],
      startStopTime: undefined,
      checkNum: "",
      checkUnit: 0,
      addRuleVisible: false,
      indeterminate: false,
      checkAll: false,
      plainOptions: [],
      checkedList: [],
      ruleTypeOptions: [],
      pagination: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total, current) => {
          return `共${total}条记录，当前第${Math.ceil(
            current[0] / this.pagination.pageSize
          )}页`;
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.onSearch("repeat");
        },
        onShowSizeChange: (current, size) => {
          this.pagination.current = 1;
          this.pagination.pageSize = size;
          this.onSearch("repeat");
        },
      },
      addTitle: "",
      checkData: {},
      tableLoading: false,
      warningName: "",
      warningType: "",
      optionFileName: [],
      graphOptions: [],
      graphId: undefined,
      process: false, // 是否正在调用接口
      checkGraphVisible: false, // 是否展示选择主体部分
      // objOptions: [], // 作为线索主体展示的实体可选项
      ruleObjs: {
        // value: undefined,
        label: [],
      }, // 作为线索主体展示的实体，可多选
      ruleModelObjs: undefined,
      modelData: {
        edgeMetas: [],
        vertexMetas: [],
      }, // 存放模型结构信息
      propertyData: [], // scheme对应节点的property集合
      selectedNodes: [],
      selectedEdges: [],
      customerVos: [], // 保存已存在的线索主体信息
      resultType: "1", // 1：SQL, 2：图
      ruleName: undefined,
      ruleDesc: undefined,
      modeValue: "",
      updatePerson: undefined,
      categoryId: undefined,
      rulesGroup: [
        {
          id: -1,
          types: "relations",
          relations: "且",
        },
      ],
      conditionModalShow: false,
      conditionList: [],
      addModelShow: false,
      nameValue: undefined,
      conditionKeywords: undefined,
      checkedKeys: [],
      expandedKeys: [],
      selectMode: undefined,
      parentIds: [],
      childOptions: [],
      addKey: [],
      isSingle: undefined,
      rightMenuShow: false,
      contextMenuData: {},
      treeData: undefined,
      addModelTitle: "",
      objName: "", // 线索主体名称
      fieldModelShow: false,
      current: 0,
      stepList: [
        {
          title: "选择企业名称字段来源表",
        },
        {
          title: "选择企业名称字段",
        },
      ],
      loading: false,
      columns1: [
        {
          title: "企业名称字段来源表名称",
          dataIndex: "name",
          key: "name",
          width: 276,
          scopedSlots: {
            customRender: "name",
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
          },
          onFilter: (value, record) =>
            record.name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          title: "库表描述",
          dataIndex: "desc",
          key: "desc",
          width: 200,
        },
      ],
      columns2: [
        {
          title: "字段名",
          dataIndex: "name",
          key: "name",
          width: 276,
          scopedSlots: {
            customRender: "name",
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
          },
          onFilter: (value, record) =>
            record.name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          title: "字段描述",
          dataIndex: "desc",
          key: "desc",
          width: 200,
        },
      ],
      columns3: [
        {
          title: "序号",
          dataIndex: "index",
        },
        {
          title: "审计专题表名称",
          dataIndex: "graphName",
        },
        {
          title: "专题表描述",
          dataIndex: "graphDesc",
        },
        {
          title: "是否为主表",
          dataIndex: "main",
          key: "main",
          scopedSlots: { customRender: "main" },
        },
      ],
      columns4: [
        // {
        //   title: "选中",
        //   dataIndex: "selected",
        // },
        {
          title: "序号",
          dataIndex: "index",
        },
        {
          title: "字段名称",
          dataIndex: "fieldName",
        },
        {
          title: "字段描述",
          dataIndex: "fieldDesc",
        },
      ],
      columns5: [
        {
          title: "审计专题表名称",
          dataIndex: "graphName",
        },
        {
          title: "字段名称",
          dataIndex: "fieldName",
        },
      ],
      columns6: [
        {
          title: "序号",
          dataIndex: "index",
        },
        {
          title: "审计专题表名称",
          dataIndex: "graphName",
        },
        {
          title: "专题表描述",
          dataIndex: "graphDesc",
        },
        {
          title: "字段名称",
          dataIndex: "fieldName",
        },
        {
          title: "字段描述",
          dataIndex: "fieldDesc",
        },
      ],
      tableValue1: [],
      tableValue2: [],
      tableValue3: [],
      tableValue4: [],
      tableValue5: [],
      tableValue6: [],
      pagination1: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 5,
        onChange: (page, pageSize) => {
          this.pagination1.current = page;
          this.pagination1.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination1.current = 1;
          this.pagination1.pageSize = size;
        },
      },
      pagination2: {
        size: "small",
        total: 0,
        current: 1,
        pageSize: 5,
        onChange: (page, pageSize) => {
          this.pagination2.current = page;
          this.pagination2.pageSize = pageSize;
        },
        onShowSizeChange: (current, size) => {
          this.pagination2.current = 1;
          this.pagination2.pageSize = size;
        },
      },
      searchText: "",
      tableLoading2: false,
      selectedRowKeys1: [],
      selectedRowKeys2: [],
      selectedRowKeys3: [0],
      tableName1: {},
      tableName2: {},
      fieldName: {},
      relationName: {},
      isSelfTop: false,
      isRelationTop: false,
      showGraphConnect: false, //是否展示表关联字段弹窗
      selectedRowKeys: [],
      tableLoading3: false,
      tableLoading4: false,
      tableLoading5: false,
      tableLoading6: false,
      selectedGraph: {},
      priTable: "", //主表名称
      nameType: undefined, // self or relation 选择线索企业名称还是关联企业名称
      isReady: false, // 是否可以对rulesGroup进行监听了，注：当编辑和复制时，会对rulesGroup和相关变量进行赋值，应当在赋值完成后开始监听
      isNeedRelation: false, // 是否需要选择表关联字段，理论上来说，表数量超过1个才需要选择表关联字段
    };
  },
  components: {
    AAutoComplete: AutoComplete,
    AButton: Button,
    ACheckbox: Checkbox,
    AIcon: Icon,
    AInput: Input,
    AInputNumber: InputNumber,
    APopover: Popover,
    ARangePicker: RangePicker,
    ATextArea: TextArea,
    ATree: Tree,
    ARadio: Radio,
    ARadioButton: RadioButton,
    ARadioGroup: RadioGroup,
    AStep: Step,
    ASteps: Steps,
    ATooltip: Tooltip,
    ConditionGroup,
    MainContent,
    RightMenu,
    SchemaGraph,
    TableComponent,
    DetailTable,
  },
  computed: {
    ...mapState("rightsOptions", ["userRights"]),
    ...mapState("auditOptions", ["paramsObj", "classifyCounts"]),
    rowSelection1() {
      return {
        key: "1",
        columnTitle: "选择",
        columnWidth: 70,
        selectedRowKeys: this.selectedRowKeys1,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys1 = selectedRowKeys;
          const target = find(
            this.tableValue1,
            (v) => v.id === selectedRowKeys[0]
          );
          if (this.nameType === "self") {
            this.tableName1.value = selectedRowKeys[0];
            this.tableName1.chValue = target.desc;
          } else {
            this.tableName2.value = selectedRowKeys[0];
            this.tableName2.chValue = target.desc;
          }
        },
        type: "radio",
      };
    },
    rowSelection2() {
      return {
        key: "2",
        columnTitle: "选择",
        columnWidth: 70,
        selectedRowKeys: this.selectedRowKeys2,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys2 = selectedRowKeys;
          const target = find(
            this.tableValue2,
            (v) => v.id === selectedRowKeys[0]
          );
          if (this.nameType === "self") {
            this.fieldName.value = selectedRowKeys[0];
            this.fieldName.chValue = target.desc;
          } else {
            this.relationName.value = selectedRowKeys[0];
            this.relationName.chValue = target.desc;
          }
        },
        type: "radio",
      };
    },
    rowSelection3() {
      return {
        key: "3",
        columnTitle: "选中",
        columnWidth: 70,
        selectedRowKeys: this.selectedRowKeys3,
        onChange: (selectedRowKeys) => {
          console.log("selectedRowKeys", selectedRowKeys);
          this.selectedRowKeys3 = [...selectedRowKeys];
          let isExist = false;
          this.tableLoading5 = true;
          this.tableValue5.map((item) => {
            if (item.graphName === this.selectedGraph.graphName) {
              isExist = true;
              item.fieldName =
                this.tableValue4[selectedRowKeys[0] - 1].fieldName;
              item.fieldDesc =
                this.tableValue4[selectedRowKeys[0] - 1].fieldDesc;
            }
          });
          if (!isExist) {
            this.tableValue5.push({
              graphName: this.selectedGraph.graphName,
              graphDesc: this.selectedGraph.graphDesc,
              fieldName: this.tableValue4[selectedRowKeys[0] - 1].fieldName,
              fieldDesc: this.tableValue4[selectedRowKeys[0] - 1].fieldDesc,
            });
          }
          this.tableLoading5 = false;
        },
        type: "radio",
      };
    },
  },
  watch: {
    rulesGroup(newValue) {
      this.rulesGroup = newValue;
      if (this.isReady) {
        console.log("rulesGroup-change", this.rulesGroup);
        this.$set(this.checkData, "tableName1", undefined);
        this.$set(this.checkData, "tableName2", undefined);
        this.$set(this.checkData, "entFiledName", undefined);
        this.$set(this.checkData, "entRelationName", undefined);
        this.tableName1 = {};
        this.tableName2 = {};
        this.fieldName = {};
        this.relationName = {};
        this.isSelfTop = false;
        this.isRelationTop = false;
        this.tableValue6 = [];
      }
      if (newValue.length > 1) {
        // 理论上只有当选了条件之后，才有调用该接口的意义
        this.queryConTableCount();
      }
    },
  },
  mounted() {
    setTimeout(() => {
      window.addEventListener("click", this.clickOther);
    }, 100);
    this.init();
    this.getConditionCategory();
  },
  beforeDestroy() {
    window.onresize = null;
    window.removeEventListener("click", this.clickOther);
  },
  methods: {
    clickOther() {
      this.rightMenuShow = false;
    },
    show(e) {
      e.event.stopPropagation();
      let menuList = [];
      if (this.resultType === "1") {
        if (e.node.dataRef.level === 0) {
          // 全部
          menuList = [
            {
              key: "addChild",
              title: "添加子类型",
            },
          ];
        } else if (e.node.dataRef.level === 1) {
          // 该分类是一级分类
          menuList = [
            {
              key: "addRule",
              title: "添加规则",
            },
            {
              key: "addBrother",
              title: "添加同级类型",
            },
            {
              key: "delete",
              title: "删除",
            },
          ];
        }
      } else {
        if (e.node.dataRef.level === 0) {
          // 全部
          menuList = [
            {
              key: "addChild",
              title: "添加子类型",
            },
          ];
        } else if (e.node.dataRef.level === 1) {
          // 该分类是一级分类
          menuList = [
            {
              key: "addChild",
              title: "添加子类型",
            },
            {
              key: "addBrother",
              title: "添加同级类型",
            },
            {
              key: "delete",
              title: "删除",
            },
          ];
        } else {
          // 该分类已经是二级分类了，不能再添加子分类了
          menuList = [
            {
              key: "addRule",
              title: "添加规则",
            },
            {
              key: "addBrother",
              title: "添加同级类型",
            },
            {
              key: "delete",
              title: "删除",
            },
          ];
        }
      }
      const menuData = {
        position: {
          x: e.event.pageX,
          y: e.event.pageY,
        },
        context: menuList,
      };
      this.contextMenuData = menuData;
      this.rightMenuShow = true;
      this.treeData = {
        parent: e.node.$parent.dataRef,
        children: e.node.dataRef,
      };
    },
    onContextMenuClick(event) {
      event.domEvent.stopPropagation();
      const menuKey = event.key;
      const _that = this;
      this.rightMenuShow = false;
      switch (menuKey) {
        case "addChild":
          _that.addModelTitle = "添加子类型";
          _that.addModelShow = true;
          break;
        case "addBrother":
          _that.addModelTitle = "添加同级类型";
          _that.addModelShow = true;
          break;
        case "addRule":
          this.handleAddRule();
          break;
        case "delete":
          this.deleteList(_that.treeData.children);
          break;

        default:
          break;
      }
    },
    async init() {
      this.getRuleCategory("1");
      this.onSearch("init");

      // 模型分类
      // const json = {
      //   modelCode: null,
      //   modelName: null,
      //   status: "",
      // };
      // const ruleModel = await getRuleModel(json);
      // const modelOptions = [];
      // if (!ruleModel) {
      //   this.$message.error("获取模型失败");
      // } else {
      //   ruleModel.map((item) => {
      //     modelOptions.push({
      //       value: item.id,
      //       label: item.modelName,
      //     });
      //   });
      //   this.modelOptions = modelOptions;
      // }

      // 关联线索
      // const warningRelate = await getWarningRelate();
      // const plainOptions = [];
      // if (!warningRelate) {
      //   this.$message.error("获取关联线索失败");
      // } else {
      //   warningRelate.map((item) => {
      //     plainOptions.push({
      //       value: item.id,
      //       label: item.warningName,
      //     });
      //   });
      //   this.plainOptions = plainOptions;
      // }

      // 可选图谱
      // const graphList = await queryGraphList();
      // const graphOptions = [];
      // if (!graphList) {
      //   this.$message.error("获取可选图谱失败");
      // } else {
      //   graphList.map((graph) => {
      //     graphOptions.push({
      //       label: graph.graphChName,
      //       value: graph.id,
      //     });
      //   });
      //   this.graphOptions = graphOptions;
      // }
    },
    async onSelect(selectedKeys, e) {
      this.treeData = {
        parent: e.node.$parent.dataRef,
        children: e.node.dataRef,
      };
      if (!e.node.isLeaf) {
        e.node.onExpand();
        if (!selectedKeys.length) {
          this.warningClass = "全部";
        }
      } else {
        this.categoryId = selectedKeys[0];
        this.warningClass = selectedKeys[0];
        this.onSearch("init");
      }
    },
    addList(e, key) {
      e.stopPropagation();
      this.defaultKey = key;
      this.showList = true;
    },
    addFolder(e) {
      e.stopPropagation();
      this.showFolder = true;
    },
    async okLeaf() {
      if (this.listName !== "" && this.defaultKey !== "") {
        const json = {
          categoryName: this.listName,
          parentId: this.defaultKey === "全部" ? -1 : this.defaultKey,
          status: 0,
          categoryType: this.resultType === "1" ? 1 : 0,
        };
        const loading = this.$message.loading("正在添加", 0);
        const data = await addListCategory(json);
        loading();
        if (data.message === "成功") {
          this.$message.success("添加成功");
          this.cancelList();
          this.init();
        } else {
          this.$message.info(`添加失败 ${data.message}`);
        }
      } else if (this.defaultKey === "") {
        this.$message.warning("请选择添加至哪个文件夹");
      } else {
        this.$message.warning("分类名称不可为空！");
        this.listName = "";
      }
    },
    async saveAdd() {
      console.log("add", this.resultType);
      let parentId = -1;
      if (this.treeData.parent) {
        if (this.treeData.parent.key === "全部") {
          if (this.addModelTitle === "添加子类型") {
            parentId = this.treeData.children.key;
          } else {
            // 同级
            parentId = -1;
          }
        } else {
          parentId = this.treeData.parent.key;
        }
      } else {
        parentId = -1;
      }
      const json = {
        categoryName: this.nameValue,
        parentId,
        status: 0,
        categoryType: this.resultType === "1" ? 1 : 0,
      };
      this.onCancel();
      const loading = this.$message.loading("正在添加", 0);
      const res = await addListCategory(json);
      if (res.message === "成功") {
        await this.getRuleCategory(this.resultType);
        loading();
        this.$message.success("添加成功");
      } else {
        loading();
        this.$message.error(`${res.message}`);
      }
    },
    onCancel() {
      this.addModelShow = false;
    },
    cancelList() {
      this.defaultKey = "全部";
      this.listName = "";
      this.showList = false;
    },
    async okFolder() {
      if (this.folderName !== "") {
        const json = {
          categoryName: this.folderName,
          parentId: -1,
          categoryType: this.resultType === "1" ? 1 : 0,
        };
        const loading = this.$message.loading("正在添加", 0);
        const data = await addListCategory(json);
        loading();
        if (data.message === "成功") {
          this.$message.success("添加成功");
          this.cancelFolder();
          this.init();
        } else {
          this.$message.info(`添加失败 ${data.message}`);
        }
      } else {
        this.$message.warning("文件夹名字不可为空！");
        this.folderName = "";
      }
    },
    okGraphConnect() {
      if (this.tableValue3.length !== this.tableValue5.length) {
        this.$message.info("每个表都需要选择字段！");
        return;
      }
      this.tableLoading6 = true;
      this.tableValue6 = this.tableValue5.map((item, index) => {
        return {
          index: index + 1,
          ...item,
        };
      });
      console.log("priTable", this.priTable);
      this.tableLoading6 = false;
      this.showGraphConnect = false;
    },
    cancelFolder() {
      this.folderName = "";
      this.showFolder = false;
    },
    async detailInfo(record) {
      this.getRuleDetails("check", record);
    },
    checkToEdit(record) {
      this.ruleName = record.ruleName;
      this.graphId = record.graphId;
      this.categoryId = record.categoryId;
      this.ruleLevel = record.level;
      this.ruleModel = record.ruleModelId || undefined;
      this.startStopTime = record.startStopTime;
      this.checkNum = record.checkDate;
      this.checkUnit = record.cycleUnit || 0;
      this.addTitle = "编辑规则";
    },
    async editInfo(record) {
      this.getRuleDetails("edit", record);
    },
    async getRuleDetails(type, record) {
      const detailData = await getRuleDetails(record.id);
      console.log("getRuleDetails", detailData);
      if (!detailData) {
        this.$message.error("查询规则详情失败");
        return false;
      }
      detailData.startStopTime = [
        moment(detailData.effectStartDate || undefined).format("YYYY-MM-DD"),
        moment(detailData.effectEndDate || undefined).format("YYYY-MM-DD"),
      ];
      const checkData = detailData;
      checkData.levelText =
        detailData.level === 1
          ? "一级"
          : detailData.level === 2
          ? "二级"
          : detailData.level === 3
          ? "三级"
          : "";
      checkData.modelId = detailData.ruleModelId;
      // this.checkedList = detailData.relateWaringList.map((item) => item.id);
      // this.checkAll =
      //   this.plainOptions.length === this.checkedList.length ? true : false;
      // this.indeterminate =
      //   this.plainOptions.length > this.checkedList.length &&
      //   this.checkedList.length > 0
      //     ? true
      //     : false;
      await this.getModelGraph(record.modelId);
      const nodeType = detailData.customerVos.map((item) => {
        return {
          label: item.vertexLabelId,
          attr: item.propertyName,
        };
      });
      this.customerVos = nodeType;
      this.ruleObjs.label = this.getLabel(nodeType);

      if (type === "edit") {
        this.checkToEdit(detailData);
      } else {
        checkData.typeName = detailData.typeName ? detailData.typeName : "全部";
        this.addTitle = "查看规则";
      }
      this.checkData = checkData;
      this.addRuleVisible = true;
    },
    async testInfo(record) {
      const loading = this.$message.loading("正在执行", 0);
      const res = await doModelTask(record.id);
      loading();
      if (res.message === "成功") {
        this.$message.success("执行成功");
      } else {
        this.$message.error(`${res.message}`);
      }
    },
    async checkInfo(record) {
      if (this.process) {
        return false;
      }
      this.process = true;
      const loading = this.$message.loading("正在查询", 0);
      const json = {
        pageNo: 1,
        pageSize: 100,
        ruleName: record.ruleName,
        warningRuleId: record.id,
      };
      const data = await getWarningList(json);
      loading();
      this.process = false;
      if (data && data.dateList && data.dateList.length) {
        this.$router.push({
          name: "riskWarningInfo",
          params: {
            ruleName: record.ruleName,
            warningRuleId: record.id,
          },
        });
      } else {
        this.$message.info("暂无线索信息");
      }
    },
    async startRule(record) {
      const _that = this;
      let text = undefined;
      let status = undefined;
      if (this.resultType === "1") {
        // sql
        text = record.status === 1 ? "启用" : "停用";
        status = record.status === 1 ? 0 : 1;
      } else {
        // 图
        text = record.ruleStatus === "1" ? "启用" : "停用";
        status = record.ruleStatus === "1" ? "0" : "1";
      }
      const title = `确定要${text} ${record.ruleName} 吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading(`正在${text}`, 0);
        const json = {
          id: record.id,
          status,
        };
        let res = undefined;
        if (this.resultType === "1") {
          res = await updateAbRuleStatus(json);
        } else {
          res = await editWarningRuleStatus(json);
        }
        loading();
        if (res.message === "成功") {
          _that.$message.success(`${text}成功`);
          _that.onSearch("init");
        } else {
          _that.$message.error(`${res.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    handleDelete(record) {
      const _that = this;
      const title = `确定要删除 ${record.ruleName} 吗？`;
      const onOk = async () => {
        const loading = _that.$message.loading("正在删除", 0);
        let res = undefined;
        if (this.resultType === "1") {
          res = await delAbRule(record.id);
        } else {
          const json = {
            warningRuleId: record.id,
          };
          res = await deleteSingleRules(json);
        }
        loading();
        if (res.message === "成功") {
          _that.$message.success("删除成功");
          _that.onSearch("init");
        } else {
          _that.$message.error(`${res.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    deleteList(item, e) {
      if (e) {
        e.stopPropagation();
      }
      const _that = this;
      const title = `确定要删除 ${item.title} 吗？`;
      const onOk = async () => {
        const json = {
          id: item.key,
        };
        const data = await deleteWarningCategory(json);
        if (data.message === "成功") {
          _that.$message.success("删除成功");
          _that.onReset();
          _that.getRuleCategory(this.resultType);
          _that.onSearch("init");
        } else {
          _that.$message.error(`删除失败，${data.message}`);
        }
      };
      modalConfirm(title, _that, onOk);
    },
    async onSearch(type) {
      this.tableLoading = true;
      if (type === "init") {
        this.$set(this.pagination, "current", 1);
      }
      if (this.resultType === "1") {
        // SQL
        const json = {
          ruleName: "",
          ruleCode: "",
          categoryId: this.categoryId,
          ruleType: "",
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
        };
        const res = await queryRuleByPage(json);
        this.tableLoading = false;
        if (res.message === "成功") {
          this.$set(this.pagination, "total", parseInt(res.data.totalCount));
          this.columns = [
            {
              title: "规则名称",
              dataIndex: "ruleName",
              key: "ruleName",
              width: 160,
            },
            {
              title: "规则类型",
              dataIndex: "ruleTypeName",
              key: "ruleTypeName",
              width: 140,
            },
            {
              title: "规则描述",
              dataIndex: "ruleDesc",
              key: "ruleDesc",
              width: 180,
            },
            {
              title: "规则生成方式",
              dataIndex: "modeValue",
              key: "modeValue",
              width: 140,
              scopedSlots: { customRender: "modeValue" },
            },
            {
              title: "最后修改人",
              dataIndex: "updatePerson",
              key: "updatePerson",
              width: 120,
            },
            {
              title: "最后修改时间",
              dataIndex: "updateTime",
              key: "updateTime",
              width: 191,
            },
            {
              title: "操作",
              dataIndex: "actions",
              key: "actions",
              width: 240,
              scopedSlots: { customRender: "actions" },
            },
          ];
          this.tableValue = res.data.dateList.map((item) => {
            return {
              id: item.id,
              ruleName: item.ruleName,
              ruleType: item.categoryId,
              ruleTypeName: item.categoryName,
              ruleDesc: item.ruleDesc,
              modeValue: item.ruleType,
              updatePerson: item.updateUser,
              updateTime: item.updateDate,
              conditionList: item.conditionList,
              ruleScripts: item.ruleScripts,
              cycleUnit: item.cycleUnit,
              checkDate: item.checkDate,
              startStopTime: [
                moment(item.effectStartDate),
                moment(item.effectEndDate),
              ],
              status: item.status,
              entFiledName: item.entFiledName,
              filedsDesc: item.filedsDesc,
              isSelfTop: item.isEnt === 1 ? true : false,
              isRelationTop: item.isRelEnt === 1 ? true : false,
            };
          });
        } else {
          this.$message.error("获取规则列表失败");
        }
      } else {
        // 图
        const json = {
          id: this.warningId,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ruleStatus: this.warningState,
          warningLevel: this.warningLevel || undefined,
          warningRuleName: this.warningName,
          warningType: this.warningType,
          categoryId:
            this.warningClass === "全部" ? undefined : this.warningClass,
        };
        this.defaultKey = "全部";
        const data = await searchRuleList(json);
        if (!data) {
          this.$message.error("获取规则列表失败");
        } else {
          this.$set(this.pagination, "total", parseInt(data.totalCount));
          this.columns = [
            {
              title: "规则编号",
              dataIndex: "id",
              key: "id",
              width: 160,
            },
            {
              title: "规则名称",
              dataIndex: "ruleName",
              key: "ruleName",
              width: 200,
            },
            {
              title: "规则分类",
              dataIndex: "ruleCategory",
              key: "ruleCategory",
              width: 150,
            },
            {
              title: "规则类型",
              dataIndex: "ruleType",
              key: "ruleType",
              width: 120,
            },
            {
              title: "状态",
              key: "status",
              dataIndex: "status",
              width: 80,
            },
            {
              title: "最新更新日期",
              key: "lastTime",
              dataIndex: "lastTime",
              width: 150,
            },
            {
              title: "操作",
              key: "actions",
              dataIndex: "actions",
              scopedSlots: { customRender: "actions" },
              width: 200,
            },
          ];
          this.tableValue = data.dateList.map((item) => {
            return {
              ...item,
              ruleType: item.ruleType === "1" ? "内置" : "自定义",
              status: item.ruleStatus === "0" ? "上线" : "草稿",
            };
          });
        }
      }
      this.tableLoading = false;
    },
    onReset() {
      if (this.resultType === "1") {
        this.ruleName = undefined;
        this.modeValue = "";
        this.updatePerson = undefined;
        this.ruleDesc = undefined;
        this.categoryId = undefined;
        this.tableValue6 = [];
      } else {
        this.warningId = "";
        this.warningName = "";
        this.warningState = "";
        this.warningLevel = "";
        this.warningClass = "全部";
        this.warningType = "";
        this.categoryId = undefined;
      }
      this.onSearch("init");
    },
    handleAddRule() {
      this.addRuleVisible = true;
      this.isReady = true;
      this.addTitle = "新建规则";
      this.checkData = {
        ruleType: (this.treeData && this.treeData.children.key) || undefined,
        ruleName: undefined,
        startStopTime: undefined,
        checkDate: undefined,
        cycleUnit: 0,
        modeValue: undefined,
        ruleDesc: undefined,
        conditionList: [],
      };
    },
    // onCheckAllChange(e) {
    //   this.indeterminate = false;
    //   this.checkAll = e.target.checked;
    //   this.checkedList = e.target.checked
    //     ? this.plainOptions.map((item) => item.value)
    //     : [];
    // },
    // onChange(checkedList) {
    //   if (checkedList.length === 0) {
    //     this.indeterminate = false;
    //     this.checkAll = false;
    //   } else if (checkedList.length < this.plainOptions.length) {
    //     this.indeterminate = true;
    //     this.checkAll = false;
    //   } else {
    //     this.indeterminate = false;
    //     this.checkAll = true;
    //   }
    // },
    async handleConfirm() {
      console.log(
        "handleConfirm",
        this.fieldName,
        this.relationName,
        this.isSelfTop,
        this.isRelationTop
      );
      if (this.process) {
        return false;
      }
      this.process = true;
      if (this.resultType === "1") {
        let ruleRelations = null;
        if (!this.checkData.ruleType) {
          this.$message.error("规则类型不可为空！");
          return false;
        }
        if (this.checkData.ruleName === "" || !this.checkData.ruleName) {
          this.$message.error("规则名称不可为空！");
          return false;
        }
        if (
          this.checkData.startStopTime &&
          !this.checkData.startStopTime.length
        ) {
          this.$message.error("执行时间不可为空！");
          return false;
        }
        if (!this.checkData.checkDate) {
          this.$message.error("检测周期不可为空！");
          return false;
        }
        if (!this.fieldName.value) {
          this.$message.error("请选择线索企业名称字段！");
          return false;
        }
        // if (!this.relationName.value) {
        //   this.$message.error("请选择关联企业名称字段！");
        //   return false;
        // }
        if (this.isNeedRelation && !this.tableValue6.length) {
          this.$message.error("请选择表关联字段！");
          return false;
        } else {
          ruleRelations = this.tableValue6.map((item) => {
            return {
              tableName: item.graphName,
              field: item.fieldName,
              tableDesc: item.graphDesc,
              fieldDesc: item.fieldDesc,
            };
          });
        }
        const json = {
          id: this.addTitle === "编辑规则" ? this.checkData.id : null,
          ruleName: this.checkData.ruleName,
          categoryId: this.checkData.ruleType,
          ruleDesc: this.checkData.ruleDesc,
          ruleType: this.checkData.modeValue,
          effectStartDate: this.checkData.startStopTime[0],
          effectEndDate: this.checkData.startStopTime[1],
          cycleUnit: this.checkData.cycleUnit,
          checkDate: this.checkData.checkDate,
          entFiledName: this.fieldName.value,
          relEntFiledName: this.relationName.value,
          isEnt: this.isSelfTop ? 1 : 0,
          isRelEnt: this.isRelationTop ? 1 : 0,
          ruleRelations,
          priTable: this.priTable,
          filedsDesc: JSON.stringify({
            tableName1: this.tableName1,
            tableName2: this.tableName2,
            fieldName: this.fieldName,
            relationName: this.relationName,
          }),
        };
        let conditions = [];
        if (this.checkData.modeValue === 0) {
          // 配置化
          conditions = this.getPostJson(this.rulesGroup);
        } else {
          // sql
          if (!this.checkData.conditionList[0].content) {
            this.$message.error("sql语句不可为空！");
            return false;
          } else {
            json.ruleScripts = this.checkData.conditionList[0].content;
            conditions.push({
              logic: null,
              conditionId: this.checkData.conditionList[0].conditionId,
              conditionList: [],
            });
          }
        }
        json.conditions = conditions;
        const loading = this.$message.loading("正在保存", 0);
        const res = await saveOrUpdateRule(json);
        loading();
        this.process = false;
        if (res.message === "成功") {
          const message =
            this.addTitle === "编辑规则" ? "修改成功" : "添加成功";
          this.$message.success(`${message}`);
          this.handleCancel();
          this.onSearch("init");
        } else {
          this.$message.error(`${res.message}`);
        }
      } else {
        if (!this.ruleName) {
          this.$message.warning("请输入规则名称");
          return false;
        }
        if (!this.categoryId) {
          this.$message.warning("请选择规则分类");
          return false;
        }
        if (!this.ruleLevel) {
          this.$message.warning("请选择规则等级");
          return false;
        }
        if (this.startStopTime && !this.startStopTime.length) {
          this.$message.warning("请选择生效日期");
          return false;
        }
        if (!this.checkNum) {
          this.$message.warning("请输入检测周期");
          return false;
        }
        if (!this.graphId) {
          this.$message.warning("请选择应用图谱");
          return false;
        }
        const index = findIndex(
          this.modelOptions,
          (o) => o.value === this.ruleModel
        );
        if (!this.ruleModel || index === -1) {
          this.$message.warning("请选择模型");
          return false;
        }
        const propertyVoList = [];
        if (!this.ruleObjs.label.length) {
          // || !this.ruleObjs.value
          this.$message.warning("请选择线索主体");
          return false;
        } else {
          // 校验有没有选择主体的属性
          let flag = false;
          for (let i = 0; i < this.ruleObjs.label.length; i++) {
            const ele = this.ruleObjs.label[i];
            if (!ele.attr) {
              flag = true;
              break;
            }
          }
          if (flag) {
            this.$message.warning("请选择线索主体的属性");
            return false;
          } else {
            this.ruleObjs.label.map((item) => {
              propertyVoList.push({
                propertyName: item.attr,
                vertexLabelId: item.value,
              });
            });
          }
        }
        let json = {
          warningRuleId: this.addTitle === "编辑规则" ? this.checkData.id : "",
          ruleName: this.ruleName,
          level: this.ruleLevel,
          ruleModel: this.ruleModel,
          effectEndDate: this.startStopTime[1],
          effectStartDate: this.startStopTime[0],
          cycleUnit: this.checkUnit,
          dateNum: this.checkNum,
          categoryIds: [this.categoryId],
          graphId: this.graphId,
          checkStatus: 0,
          propertyVoList,
        };
        const res = await addOrEditWarningRule(json);
        this.process = false;
        if (res.message === "成功") {
          this.$message.success(
            this.addTitle === "编辑规则" ? "修改成功" : "添加成功"
          );
          this.handleCancel();
          this.onSearch("init");
        } else if (res.message === "图谱、模型不一致请确认") {
          const _that = this;
          const title = `该模型对应的图与当前选择的图不匹配，是否确认当前选择并继续提交？`;
          const onOk = async () => {
            json.checkStatus = 1;
            const data = await addOrEditWarningRule(json);
            if (data.message === "成功") {
              _that.$message.success(
                _that.addTitle === "编辑规则" ? "修改成功" : "添加成功"
              );
              _that.onSearch("init");
            } else {
              _that.$message.info(
                _that.addTitle === "编辑规则"
                  ? `修改失败 ${data.message}`
                  : `添加失败 ${data.message}`
              );
            }
            _that.handleCancel();
          };
          modalConfirm(title, _that, onOk);
        } else {
          this.$message.info(
            this.addTitle === "编辑规则"
              ? `修改失败 ${res.message}`
              : `添加失败 ${res.message}`
          );
        }
      }
    },
    handleCancel() {
      this.addRuleVisible = false;
      this.handleReset();
    },
    getIcon(props) {
      const { isLeaf, expanded } = props;
      if (isLeaf) {
        return <a-icon type="file" />;
      }
      return <a-icon type={expanded ? "folder-open" : "folder"} />;
    },
    filterOption(inputValue, option) {
      if (option.componentOptions.propsData.title.indexOf(inputValue) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    handleReset() {
      if (this.resultType === "1") {
        this.checkData = {
          ruleType: undefined,
          ruleName: undefined,
          startStopTime: undefined,
          checkDate: undefined,
          cycleUnit: 0,
          modeValue: undefined,
          ruleDesc: undefined,
          conditionList: [],
        };
        this.toEdit = true;
        this.isShowTotal = false;
        this.resetSelect();
        this.resetRulesGroup();
        this.categoryId = undefined;
        this.tableValue3 = [];
        this.tableValue4 = [];
        this.tableValue5 = [];
        this.tableValue6 = [];
      } else {
        this.ruleName = "";
        this.graphId = undefined;
        this.categoryId = undefined;
        this.ruleLevel = undefined;
        this.ruleModel = undefined;
        this.startStopTime = undefined;
        this.checkNum = "";
        this.checkUnit = 0;
        this.checkedList = [];
        this.checkAll = false;
        this.indeterminate = false;
        this.checkGraphVisible = false;
        this.modelData = {
          edgeMetas: [],
          vertexMetas: [],
        };
        this.ruleObjs = {
          value: undefined,
          label: [],
        };
        this.selectedNodes = [];
        this.selectedEdges = [];

        this.checkData = {
          ruleType: undefined,
          ruleName: undefined,
          startStopTime: undefined,
          checkDate: undefined,
          cycleUnit: 0,
          modeValue: undefined,
          ruleDesc: undefined,
          conditionList: [],
        };
        this.toEdit = true;
        this.isShowTotal = false;
        this.resetSelect();
        this.resetRulesGroup();
      }
    },
    async handleSelect(value) {
      const index = findIndex(
        this.modelOptions,
        (o) => o.value === this.ruleModel
      );
      if (value && index !== -1) {
        this.getModelGraph(value);
        this.ruleObjs.label = [];
      }
    },
    // handleChangeObjs(value) {},
    selectedElesChanged(nodes, edges) {
      this.selectedNodes = nodes;
      this.selectedEdges = edges;
      if (this.addTitle === "新建规则") {
        if (nodes.length) {
          this.ruleObjs.label = this.getLabel(nodes[0].nodeType);
        }
      } else if (this.addTitle === "编辑规则") {
        if (nodes.length) {
          const arr1 = this.customerVos.map((item) => item.label);
          const arr2 = nodes[0].nodeType.map((item) => item.label);
          const flag = JSON.stringify(arr1) == JSON.stringify(arr2);
          if (flag) {
            this.ruleObjs.label = this.getLabel(this.customerVos);
          } else {
            this.ruleObjs.label = this.getLabel(nodes[0].nodeType);
          }
        }
      }
    },
    async getModelGraph(value) {
      const loading = this.$message.loading("正在获取图谱结构信息", 0);
      const res = await getRuleModelDetails(value);
      const schemaInfo = JSON.parse(res.data.schemaInfo);
      const schemaId = res.data.schemaId;
      let schemaData = undefined;
      const propertyData = [];
      if (schemaId) {
        schemaData = await graphPreview(schemaId);
        if (
          schemaData &&
          schemaData.vertexMetas &&
          schemaData.vertexMetas.length
        ) {
          schemaData.vertexMetas.map((vertex) => {
            propertyData.push({
              label: vertex.label,
              property: vertex.property,
            });
          });
          this.propertyData = propertyData;
        } else {
          loading();
          this.schemaData = {};
          this.$message.destroy();
          this.$message.info("暂无图谱结构信息，请重新选择");
          this.checkGraphVisible = false;
          return false;
        }
      } else {
        loading();
        this.schemaData = {};
        this.$message.destroy();
        this.$message.info("暂无图谱结构信息，请重新选择");
        this.checkGraphVisible = false;
        return false;
      }
      if (
        schemaInfo &&
        schemaInfo.vertexMetas &&
        schemaInfo.vertexMetas.length
      ) {
        this.modelData = schemaInfo;
        this.checkGraphVisible = true;
        loading();
      } else {
        this.$message.destroy();
        this.$message.info("暂无图谱结构信息");
        this.checkGraphVisible = false;
      }
    },
    getLabel(target) {
      const result = [];
      target.map((item) => {
        const propTarget = find(
          this.propertyData,
          (v) => v.label === item.label
        );
        const options = propTarget.property.map((v) => {
          return {
            value: v,
            label: v,
          };
        });
        result.push({
          value: item.label,
          attr: item.attr || undefined,
          options,
        });
      });
      return result;
    },
    async getRuleCategory(type) {
      if (type === "1") {
        const resData = await getCategoryList(1);
        if (!resData) {
          this.$message.error("获取规则分类失败，请重试");
          return false;
        }
        const SQLRuleClassOptions = [];
        const list = resData.map((item) => {
          SQLRuleClassOptions.push({
            value: item.id,
            label: item.categoryName,
          });
          return {
            title: item.categoryName,
            key: item.id,
            isLeaf: true,
            level: 1,
            scopedSlots: { title: "leaf" },
          };
        });
        this.SQLRuleClassOptions = SQLRuleClassOptions;
        this.warningClassOption = SQLRuleClassOptions;
        this.ruleTypeOptions = SQLRuleClassOptions;
        this.$set(this.list[0], "children", list);
      } else {
        const listData = await getCategoryList(0);
        const ruleTypeOptions = []; // 统计全部规则分类
        const ruleOptions = [];
        if (listData && listData.length) {
          const nowList = [{ title: "全部", key: "全部" }];
          const list = listData.map((item) => {
            if (item.diff === 0) {
              nowList.push({
                title: item.categoryName,
                key: item.id,
              });
            }
            if (!item.children.length) {
              ruleOptions.push({
                value: item.id,
                label: item.categoryName,
              });
            }
            const children = item.children.map((ele) => {
              ruleTypeOptions.push({
                value: ele.id,
                label: ele.categoryName,
              });
              return {
                key: ele.id,
                isLeaf: true,
                level: 2,
                title: ele.categoryName,
                scopedSlots: { title: "leaf" },
              };
            });
            return {
              key: item.id,
              isLeaf: item.children.length ? false : true,
              title: item.categoryName,
              children,
              level: 1,
              scopedSlots: { title: item.children.length ? "folder" : "leaf" },
            };
          });
          this.graphRuleClassOptions = [
            {
              value: "全部",
              label: "全部",
            },
            ...ruleTypeOptions,
            ...ruleOptions,
          ];
          this.warningClassOption = this.graphRuleClassOptions;
          this.optionFileName = nowList;
          this.ruleTypeOptions = [...ruleTypeOptions, ...ruleOptions];
          this.$set(this.list[0], "children", list);
        } else {
          this.$message.error("获取规则分类失败");
        }
      }
    },
    onResultTypeChange(e) {
      console.log("onResultTypeChange", e.target.value);
      this.resultType = e.target.value;
      this.categoryId = undefined;
      this.warningClass = "全部";
      this.warningClassOption =
        e.target.value === "1"
          ? this.SQLRuleClassOptions
          : this.graphRuleClassOptions;
      this.onSearch("init");
      this.getRuleCategory(e.target.value);
    },
    async handleEdit(record) {
      const reluRelations = await queryRuleRelation(record.id);
      this.tableValue6 = reluRelations.data.map((item, index) => {
        // ispk 为1 是主表，为0是其他表
        if (item.ispk === 1) this.priTable = item.tableName;
        return {
          index: index + 1,
          graphName: item.tableName,
          fieldName: item.field,
          graphDesc: item.tableDesc,
          fieldDesc: item.fieldDesc,
        };
      });
      // this.priTable = reluRelations.tableName;
      const filedsDesc = JSON.parse(record.filedsDesc);
      console.log("handleEdit", reluRelations, filedsDesc);
      record.tableName1 = filedsDesc.tableName1;
      record.tableName2 = filedsDesc.tableName2;
      record.entFiledName = filedsDesc.fieldName;
      record.entRelationName = filedsDesc.relationName;
      this.tableName1 = filedsDesc.tableName1;
      this.tableName2 = filedsDesc.tableName2;
      this.fieldName = filedsDesc.fieldName;
      this.relationName = filedsDesc.relationName;
      this.isSelfTop = record.isSelfTop;
      this.isRelationTop = record.isRelationTop;
      this.checkData = record;
      console.log("checkData", this.checkData);
      if (record.modeValue === 0) {
        this.rulesGroup = getRulesGroup(record.conditionList);
      }
      this.$nextTick(() => {
        this.isReady = true;
      });
      this.addTitle = "编辑规则";
      this.addRuleVisible = true;
    },
    async handleExecute(record) {
      console.log("handleExecute1", record);
      const loading = this.$message.loading("正在执行", 0);
      const res = await executeRuleScripts(record.id, this.paramsObj.corpName);
      loading();
      if (res.message === "成功") {
        this.$message.success("执行成功");
      } else {
        this.$message.error(res.message);
      }
      return false;
      if (record.modeValue === 1) {
        const loading = this.$message.loading("正在执行", 0);
        const res = await executeRuleScripts(record.id);
        loading();
        if (res.message === "成功") {
          this.$message.success("执行成功");
        } else {
          this.$message.error(res.message);
        }
      } else {
        this.$message.error(res.message);
      }
    },
    async handleCopy(record) {
      const reluRelations = await queryRuleRelation(record.id);
      this.tableValue6 = reluRelations.data.map((item, index) => {
        // ispk 为1 是主表，为0是其他表
        if (item.ispk === 1) this.priTable = item.tableName;
        return {
          index: index + 1,
          graphName: item.tableName,
          fieldName: item.field,
          graphDesc: item.tableDesc,
          fieldDesc: item.fieldDesc,
        };
      });

      const filedsDesc = JSON.parse(record.filedsDesc);
      console.log("handleCopy", reluRelations, filedsDesc);
      record.tableName1 = filedsDesc.tableName1;
      record.tableName2 = filedsDesc.tableName2;
      record.entFiledName = filedsDesc.fieldName;
      record.entRelationName = filedsDesc.relationName;
      this.tableName1 = filedsDesc.tableName1;
      this.tableName2 = filedsDesc.tableName2;
      this.fieldName = filedsDesc.fieldName;
      this.relationName = filedsDesc.relationName;
      this.isSelfTop = record.isSelfTop;
      this.isRelationTop = record.isRelationTop;
      console.log("record-copy", record);
      this.checkData = record;
      this.checkData.ruleName = undefined;
      if (record.modeValue === 0) {
        this.rulesGroup = getRulesGroup(record.conditionList);
      }
      this.$nextTick(() => {
        this.isReady = true;
      });
      this.addTitle = "新建规则";
      this.addRuleVisible = true;
      this.$nextTick(() => {
        this.$refs.ruleNameRef.focus();
      });
    },
    handleChangeWay(value) {
      this.$set(this.checkData, "modeValue", value);
    },
    resetRulesGroup() {
      this.rulesGroup = [
        {
          id: -1,
          types: "relations",
          relations: "且",
        },
      ];
      this.isReady = false;
    },
    selectCondition(type, isSingle, key) {
      if (type === "config") {
        // const rulesArr = this.rulesGroup;
        // const resultRulesArr = this.updateRulesGroup(key, rulesArr);
        this.selectMode = "multiple";
        this.isSingle = isSingle;
        // if (isSingle === "multi") {
        //   resultRulesArr.push([
        //     {
        //       id: nanoid(),
        //       types: "relations",
        //       relations: "且",
        //     },
        //   ]);
        //   this.addKey = key;
        //   this.conditionModalShow = true;
        // } else {
        //   this.addKey = key;
        //   this.conditionModalShow = true;

        //   const conditionList = cloneDeep(this.conditionList);
        //   this.conditionList = conditionList.map((item) => {
        //     return {
        //       ...item,
        //       disabled: false,
        //     };
        //   });
        // }
        this.addKey = key;
        this.conditionModalShow = true;

        const conditionList = cloneDeep(this.conditionList);
        this.conditionList = conditionList.map((item) => {
          if (!item.status) {
            // 可用自动展开
            this.expandedKeys.push(item.id);
          }
          return {
            ...item,
            // disabled: false,
            disabled: item.status ? true : false, // status : 0可用 1不可用
          };
        });
      } else {
        this.selectMode = "single";
        this.conditionModalShow = true;

        const conditionList = cloneDeep(this.conditionList);
        this.conditionList = conditionList.map((item) => {
          let children = [];
          if (item.children.length) {
            children = item.children.map((child) => {
              if (!child.status) {
                this.expandedKeys.push(child.id);
              }
              return {
                ...child,
                // disabled: true,
                disabled: child.status ? true : false,
              };
            });
          }
          if (!item.status) {
            this.expandedKeys.push(item.id);
          }
          return {
            ...item,
            // disabled: true,
            disabled: item.status ? true : false,
            children,
          };
        });
      }
    },
    onConditionCancel() {
      this.conditionModalShow = false;
      this.resetSelect();
    },
    updateRulesGroup(key, rulesArr) {
      if (key.length) {
        let resultArr = rulesArr[key[0]];
        if (key.length > 1) {
          key.map((num, index) => {
            if (index > 0) {
              resultArr = resultArr[num];
            }
          });
        }
        return resultArr;
      } else {
        return rulesArr;
      }
    },
    resetSelect() {
      this.checkedKeys = [];
    },
    selectConfirm() {
      const childIds = difference(this.checkedKeys, this.parentIds);
      const targetArr = childIds.map((id) => {
        const arr = this.childOptions.filter((child) => {
          if (child.key === id) {
            return child;
          }
        });
        return arr[0];
      });
      if (this.selectMode === "single") {
        // sql
        const conditionList = [
          {
            conditionName: targetArr[0].title,
            conditionDesc: targetArr[0].conditionDesc,
            content: targetArr[0].sqlContent,
            conditionId: targetArr[0].key,
          },
        ];
        this.$set(this.checkData, "conditionList", conditionList);
        this.$set(this.checkData, "ruleScripts", targetArr[0].sqlContent);
      } else {
        const rulesArr = this.rulesGroup;
        const resultRulesArr = this.updateRulesGroup(this.addKey, rulesArr);
        if (this.isSingle === "multi") {
          resultRulesArr.push([
            {
              id: nanoid(),
              types: "relations",
              relations: "且",
            },
          ]);
          targetArr.map((item) => {
            resultRulesArr.slice(-1)[0].push({
              id: nanoid(),
              condition: item,
              types: "single",
            });
          });
          this.conditionModalShow = true;
        } else {
          this.conditionModalShow = true;

          targetArr.map((item) => {
            resultRulesArr.push({
              id: nanoid(),
              condition: item,
              types: "single",
            });
          });
        }
      }
      this.onConditionCancel();
    },
    onLoadData(treeNode) {
      return this.getConditionList(treeNode);
    },
    async getConditionCategory() {
      const res = await gerTreeConditionCategory();
      if (res.message === "成功") {
        this.conditionList = this.getAllchildren(res.data, 1);
      } else {
        this.$message.error("查询条件分类失败，请重试");
      }
    },
    getAllchildren(arr, level) {
      const list = arr.map((item) => {
        let children = [];
        this.parentIds.push(item.id);
        if (item.children.length) {
          this.expandedKeys.push(item.id);
          children = this.getAllchildren(item.children, 2);
        }
        return {
          title: item.categoryName,
          key: item.id,
          children,
          isLeaf: false,
          level,
          hasChildren: true, // 默认有孩子
        };
      });
      return list;
    },
    async getConditionList(treeNode) {
      // return false;
      if (!treeNode.dataRef.children.length && treeNode.dataRef.hasChildren) {
        const json = {
          categoryId: treeNode.dataRef.key,
          conType: this.checkData.modeValue,
          pageNo: 1,
          pageSize: 1000,
        };
        const res = await queryConditionByPage(json);
        if (res.message === "成功") {
          const conditionList = res.data.dateList.map((item) => {
            return {
              title: item.conditionName,
              key: item.id,
              children: item.children,
              isLeaf: true,
              level: 3,
              sqlContent:
                (item.dsList.length && item.dsList[0].sqlContext) || "",
              conditionDesc: item.conditionDesc,
            };
          });
          if (conditionList.length) {
            const list = this.conditionList;
            const targetArr = this.getTargetArr(list, treeNode.dataRef.key);
            conditionList.map((item) => {
              targetArr.push(item);
              this.childOptions.push(item);
            });
            this.conditionList = list;
            treeNode.dataRef.hasChildren = true;
          } else {
            this.$message.destroy();
            treeNode.dataRef.hasChildren = false;
            this.$message.info("暂无条件，请先添加！");
          }
        } else {
          this.$message.error("获取条件失败");
        }
      }
    },
    getTargetArr(list, key) {
      let targetArr = [];
      for (let i = 0; i < list.length; i++) {
        const ele1 = list[i];
        if (ele1.key === key) {
          targetArr = ele1.children;
          break;
        }
        for (let j = 0; j < ele1.children.length; j++) {
          const ele2 = ele1.children[j];
          if (ele2.key === key) {
            targetArr = ele2.children;
            break;
          }
        }
      }
      return targetArr;
    },
    getPostJson(list) {
      const resultArr = [];
      const logic = list[0].relations === "且" ? 1 : 0;
      list.map((item, index) => {
        if (index > 0 && Array.isArray(item)) {
          // 条件组
          resultArr.push({
            logic: 2,
            groupLogic: logic,
            conditionList: this.getPostJson(item),
          });
        } else if (index > 0 && item.types === "single") {
          // 条件
          resultArr.push({
            logic,
            conditionId: item.condition.key,
          });
        }
      });
      return resultArr;
    },
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys, e) {
      if (this.selectMode === "multiple") {
        this.checkedKeys = checkedKeys;
      } else {
        if (checkedKeys.length > 1) {
          this.checkedKeys = [e.node.dataRef.key];
        } else {
          this.checkedKeys = checkedKeys;
        }
      }
    },
    async handleSelectName(type) {
      console.log("handleSelectName", type, this.rulesGroup);
      this.nameType = type;
      const ruleIdList = this.getRuleIdList(this.rulesGroup, []);
      console.log("ruleIdList", ruleIdList);
      const loading = this.$message.loading("正在查询", 0);
      const res = await queryConTableField(ruleIdList);
      loading();
      console.log("res", res);
      if (res.message === "成功" && res.data) {
        const tableValue = [];
        for (let i in res.data) {
          const value = res.data[i];
          tableValue.push({
            id: i,
            name: i,
            desc: value,
          });
        }
        this.tableValue1 = tableValue;
        this.fieldModelShow = true;
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无库表信息");
      } else {
        this.$message.error(res.message);
      }
    },
    getRuleIdList(arr, list) {
      arr.map((item, index) => {
        if (index < 1) return;
        if (Array.isArray(item)) {
          // 条件组
          const childList = this.getRuleIdList(item, []);
          console.log("childList", childList);
          list = [...list, ...childList];
        } else {
          list.push(item.condition.key);
        }
      });
      return list;
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleInputReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    onQuotaCancel() {
      this.fieldModelShow = false;
      this.selectedRowKeys1 = [];
      this.selectedRowKeys2 = [];
      this.current = 0;
    },
    onConnectCancel() {
      this.showGraphConnect = false;
      this.selectedRowKeys3 = [];
    },
    handleBack() {
      this.current = 0;
    },
    handleNext() {
      console.log("handleNext", this.tableName1);
      if (this.nameType === "self") {
        if (!this.tableName1.value) {
          return this.$message.info("请选择一个专题库表！");
        }
      } else {
        if (!this.tableName2.value) {
          return this.$message.info("请选择一个专题库表！");
        }
      }
      this.current = 1;
      this.getDataSourceTablesField();
    },
    handleSubmit() {
      if (this.nameType === "self") {
        if (!this.fieldName.value) {
          return this.$message.info("请选择字段");
        }
      } else {
        if (!this.relationName.value) {
          return this.$message.info("请选择字段");
        }
      }
      this.onQuotaCancel();
      if (this.nameType === "self") {
        this.checkData.entFiledName = this.fieldName;
        this.checkData.tableName1 = this.tableName1;
      } else {
        this.checkData.entRelationName = this.relationName;
        this.checkData.tableName2 = this.tableName2;
      }
    },
    async getDataSourceTablesField() {
      this.tableLoading2 = true;
      const res = await getDataSourceTablesField(this.selectedRowKeys1[0]);
      this.tableLoading2 = false;
      if (res.message === "成功") {
        const tableValue2 = [];
        for (let i in res.data) {
          const value = res.data[i];
          tableValue2.push({
            id: i,
            name: i,
            desc: value,
          });
        }
        this.tableValue2 = tableValue2;
      } else {
        this.$message.error("获取专题库表失败");
        this.tableValue2 = [];
      }
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys2 = selectedRowKeys;
    },
    customRow(record) {
      return {
        on: {
          click: (event) => {
            console.log("event", event);
            console.log("record", record);
            // this.tableValue3 = this.tableValue3.map((item) => {
            //   if (item.graphName === record.graphName) {
            //     return {
            //       ...item,
            //       main: true,
            //     };
            //   } else {
            //     return {
            //       ...item,
            //       main: false,
            //     };
            //   }
            // });
            this.selectedGraph = {
              graphName: record.graphName,
              graphDesc: record.graphDesc,
              main: record.main,
            };
            this.getTablesField();
            // this.tableValue4 = record.children;
          },
        },
      };
    },
    async handleSelectConnect() {
      // 选择表关联字段
      console.log("handleSelectConnect", this.rulesGroup);
      const ruleIdList = this.getRuleIdList(this.rulesGroup, []);
      console.log("ruleIdList", ruleIdList);
      const loading = this.$message.loading("正在查询", 0);
      const res = await queryConTableField(ruleIdList);
      loading();
      console.log("res", res);
      if (res.message === "成功" && res.data) {
        const tableValue = [];
        if (this.addTitle === "新建规则") {
          let index = 1;
          for (let i in res.data) {
            const value = res.data[i];
            tableValue.push({
              index,
              id: i,
              graphName: i,
              graphDesc: value,
              main: index === 1 ? true : false,
            });
            index++;
          }
          this.tableValue3 = tableValue;
          this.priTable =
            (this.tableValue3.length && this.tableValue3[0].graphName) || "";
        } else if (this.addTitle === "编辑规则") {
          let index = 1;
          for (let i in res.data) {
            const value = res.data[i];
            tableValue.push({
              index,
              id: i,
              graphName: i,
              graphDesc: value,
              main: i === this.priTable ? true : false,
            });
            index++;
          }
          this.tableValue3 = tableValue;
          this.tableValue5 = this.tableValue6;
        }
        this.selectedGraph = this.tableValue3[0];
        this.showGraphConnect = true;
        if (this.selectedGraph) await this.getTablesField();
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无库表信息");
      } else {
        this.$message.error(res.message);
      }

      // this.tableValue4 = this.tableValue3[0].children;
      // this.tableValue5 = [this.tableValue3[0]];
    },
    async getTablesField() {
      this.tableLoading4 = true;
      const res = await getDataSourceTablesField(this.selectedGraph.graphName);
      if (res.message === "成功") {
        const tableValue = [];
        let index = 1;
        for (let i in res.data) {
          const value = res.data[i];
          tableValue.push({
            index,
            id: i,
            fieldName: i,
            fieldDesc: value,
          });
          index++;
        }
        this.tableValue4 = tableValue;
        this.selectedRowKeys3 = [];
        this.tableValue5.map((item) => {
          if (item.graphName === this.selectedGraph.graphName) {
            //已经选择过该表的字段
            this.tableValue4.map((item1, index) => {
              if (item1.fieldName === item.fieldName) {
                this.selectedRowKeys3[0] = index + 1;
              }
            });
          }
        });
      } else {
        this.$message.error("获取专题库表失败");
        this.tableValue4 = [];
      }
      this.tableLoading4 = false;
    },
    handleClickMain(text, record) {
      //处理主表选择
      console.log("handleClickMain", record);
      console.log("text", text);
      this.tableValue3.map((item) => {
        if (item.index === record.index) {
          item.main = true;
          this.priTable = item.graphName;
        } else {
          item.main = false;
        }
      });
    },
    async queryConTableCount() {
      const ruleIdList = this.getRuleIdList(this.rulesGroup, []);
      console.log("queryConTableCount", this.rulesGroup, ruleIdList);
      const res = await queryConTableCount(ruleIdList);
      console.log("res", res);
      if (res.data && res.message === "成功") {
        if (res.data > 1) {
          this.isNeedRelation = true;
        } else {
          this.isNeedRelation = false;
        }
      } else {
        this.$message.error(`查询表数量失败，${res.message}`);
      }
    },
  },
};
</script>
<style lang="less">
.config-manage-layout {
  height: 100%;
  width: 100%;

  .condition-count {
    height: 104px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &-item {
      height: 104px;
      width: calc((100% - 48px) / 3);
      background: url("~@/assets/images/img/condition_bottom.png") no-repeat
        right;
      margin: 0px 0px 0px 24px;
      background-color: #ffffff;
      display: flex;
      align-items: center;

      &:first-child {
        margin: 0;
      }
      .item-left {
        width: 72px;
        height: 72px;
        margin: 24px;
      }
      .item-right {
        .count-num {
          font-family: "DIN Alternate";
          font-style: normal;
          font-weight: 700;
          font-size: 36px;
        }
        span {
          font-size: 16px;
          color: @secondaryTextColor;
        }
      }
    }
  }

  .risk-warning-rules {
    width: 100%;
    display: flex;
    min-height: 500px;
    padding-top: 24px;
    height: calc(100% - 104px);
    justify-content: space-between;

    .rules-left {
      width: 320px;
      padding: 24px;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fff;
      margin-right: 20px;
      border-radius: 5px;
      // box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);

      .warning-title {
        // height: 60px;
        line-height: 24px;
        font-size: 16px;
        position: relative;
        font-weight: 600;
        padding-left: 5px;
        padding-bottom: 15px;
        margin-bottom: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);

        &-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .icon-rocket {
          width: 16px;
          height: 16px;
        }
        .warning-icon {
          top: 68px;
          right: 10px;
          z-index: 10;
          display: flex;
          position: absolute;

          .folder {
            margin-left: 10px;
            color: @activeFontColor;
            font-size: 18px;
          }
          .plus {
            color: @activeFontColor;
            font-size: 16px;
          }
        }

        .change-btn {
          position: absolute;
          top: -2px;
          right: 0;

          .result-radio {
            .ant-radio-button-wrapper {
              height: 28px;
              font-weight: 400;
              line-height: 26px;
              border-style: dashed;
              color: @secondaryTextColor;

              &.ant-radio-button-wrapper-checked {
                color: #fff;
                background-color: @blue;
              }
            }
          }
        }
      }

      .ant-tree {
        position: relative;

        .ant-tree-title,
        .tree-view-left {
          user-select: none;
        }

        .ant-tree-switcher {
          .ant-tree-switcher-icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .ant-tree-child-tree {
          li,
          .ant-tree-treenode-switcher-open,
          .ant-tree-treenode-switcher-close {
            .ant-tree-node-content-wrapper {
              width: calc(100% - 24px);

              .ant-tree-title {
                padding-right: 5px;
                width: calc(100% - 24px);
                display: inline-block;

                .tree-view-item {
                  display: flex;

                  .tree-view-left {
                    flex: 1;
                    height: 24px;
                    overflow: hidden;
                    white-space: nowrap;
                    display: inline-block;
                    width: calc(100% - 53px);
                    text-overflow: ellipsis;

                    &.ant-input {
                      width: 100%;
                      padding-left: 8px;
                      padding-right: 30px;
                    }
                  }

                  .tree-view-right {
                    display: none;

                    .btn {
                      color: @activeFontColor;

                      &:not(:first-child) {
                        margin-left: 5px;
                      }
                    }

                    .anticon-close-circle {
                      color: @blue;
                    }
                    .anticon-check-circle {
                      color: @blue;
                      margin-left: 2px;
                    }
                  }
                }
              }

              &:hover {
                .tree-view-right {
                  display: block !important;
                }
              }
            }
          }
        }
      }
    }

    .rules-right {
      height: 100%;
      padding: 16px;
      display: flex;
      background: #fff;
      border-radius: 5px;
      flex-direction: column;
      width: calc(100% - 340px);
      // box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);

      .rule-options {
        margin-bottom: 16px;
        border-bottom: 1px dashed #e2e3e6;

        &-content {
          display: flex;
          flex-wrap: wrap;
        }

        &-item {
          width: 20%;
          min-width: 200px;
          max-width: 300px;
          margin-bottom: 16px;
          margin-right: 16px;

          .item-label {
            width: 85px;
          }

          .item-input {
            width: calc(100% - 75px);
          }

          &:nth-child(3) {
            .item-label {
              width: 108px;
            }

            .item-input {
              width: calc(100% - 108px);
            }
          }

          &:nth-child(4) {
            .item-label {
              width: 91px;
            }

            .item-input {
              width: calc(100% - 91px);
            }
          }
        }

        &-btns {
          margin-bottom: 16px;

          .ant-btn-primary {
            margin-right: 16px;
          }
        }
      }

      .table-btns {
        margin-bottom: 16px;

        .ant-btn {
          margin-right: 16px;
        }
      }

      .rule-table {
        flex: 1;
        height: calc(100% - 161px);

        .ant-table-cell {
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .way-slot {
          &-item {
            font-size: 12px;
            padding: 2px 10px;
          }

          .item-config {
            color: @orange;
            background: #fce7d1;
            border: 1px solid #f7b674;
          }

          .item-sql {
            color: @blue;
            background: #cce2ff;
            border: 1px solid #67a8ff;
          }
        }
      }
    }

    .add-rule-part {
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
      background: #fff;
      padding-bottom: 56px;

      &-content {
        height: 100%;
        overflow: auto;
      }

      &-title {
        color: #000;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
      }

      .rule-content {
        display: flex;
        padding: 0 20px;
        flex-wrap: wrap;
        margin-bottom: 6px;

        &-item {
          width: 25%;
          max-width: 300px;
          margin-right: 5%;
          margin-bottom: 24px;

          &-title {
            color: #000;
            margin-bottom: 10px;

            .require {
              color: #ff3838;
              margin-right: 5px;
            }
          }

          &-input {
            width: 100%;

            .config-num-input {
              width: calc(50% - 10px);
              margin-right: 10px;
            }

            .ant-select {
              width: 50%;
            }
          }
        }

        &-title,
        .ant-checkbox-wrapper {
          margin-right: 8px;
          margin-bottom: 8px;
        }

        .ant-checkbox-group {
          display: contents;
        }

        @media screen and (max-width: 1587px) {
          .rule-content-model {
            width: calc((100% - 20px) / 2);
            padding-top: calc((100% - 20px) / 2 * 0.7 + 30px);
          }
          .rule-content-options {
            width: calc((100% - 20px) / 2);
          }
        }

        @media screen and (min-width: 1587px) {
          .rule-content-model {
            width: 600px;
            padding-top: 450px;
          }
          .rule-content-options {
            width: calc(100% - 620px);
          }
        }

        &-model,
        &-options,
        .rule-objs,
        .rule-objs-title {
          transition: all 0.1s;
        }

        &-model {
          margin-right: 20px;
          position: relative;

          &-box {
            top: 0;
            width: 100%;
            height: 100%;
            max-height: 450px;
            position: absolute;
          }
        }

        &-options {
          .rule-objs {
            border-bottom: 1px solid #f2f3f5;

            &-title {
              padding-bottom: 8px;
              color: #4e5969;
            }

            &-select {
              width: 100%;
              max-width: 300px;
            }
          }

          .objs-attr-part {
            display: flex;
            padding: 12px 0;
            flex-wrap: wrap;

            &-item {
              height: 32px;
              display: flex;
              max-width: 380px;
              min-width: 260px;
              margin-right: 60px;
              align-items: center;
              margin-bottom: 16px;
              width: calc((100% - 120px) / 2);

              .item-label {
                color: #4e5969;
                padding-right: 5px;
                white-space: nowrap;
              }

              .item-select {
                width: 100%;
              }
            }
          }

          .objs-attr-tips {
            color: #f60001;
            padding: 16px 0;
          }
        }
      }

      .rule-content-upload {
        padding: 0 20px;
        margin-bottom: 30px;

        .ant-upload.ant-upload-drag {
          width: 70%;
          background: #fff;

          .ant-upload-btn {
            .ant-upload-drag-container {
              .csv-file-img {
                color: @activeFontColor;
                padding: 10px;
              }

              .upload-text {
                margin-bottom: 10px;
              }

              .download-text {
                .info-circle {
                  margin-right: 6px;
                }

                span:first-child {
                  margin-right: 50px;
                }
              }
            }
          }
        }

        .has-files {
          .ant-upload.ant-upload-drag {
            background: #e6f7ff;
          }
        }

        .show-files {
          width: 70%;
          margin-top: 40px;

          &-title {
            height: 32px;
            display: flex;
            padding: 0 12px;
            line-height: 32px;
            margin-bottom: 10px;
            background: #fafafa;
            justify-content: space-between;

            &.fail-title {
              color: #f6001a;
            }

            .actions-text {
              width: 72px;
            }

            .actions {
              color: #5e5e5e;
            }
          }

          .upload-file {
            height: 27px;
            display: flex;
            padding: 0 17px;
            margin-bottom: 10px;
            justify-content: space-between;

            &-content {
              width: 450px;
              display: flex;
              align-items: center;

              .csv-file-img-line {
                width: 18px;
                height: 18px;
                margin-right: 10px;
              }

              .file-name {
                width: 344px;
                overflow: hidden;
                white-space: nowrap;
                display: inline-block;
                text-overflow: ellipsis;
              }
            }

            .check-actions {
              .check-btn {
                color: @activeFontColor;
                cursor: pointer;

                &:not(:last-child) {
                  margin-right: 10px;
                }

                &.disabled {
                  color: #a5aab3;
                  cursor: not-allowed;
                }

                &.fail {
                  color: #f6001a;
                }
              }
            }

            .delete-btn {
              color: #f6001a;
              cursor: pointer;
            }
          }
        }
      }

      .content-title {
        font-size: 16px;
        font-weight: 600;
        padding-left: 10px;
        position: relative;
        margin-bottom: 20px;

        &::before {
          content: "";
          left: 0;
          top: 4px;
          width: 4px;
          height: 16px;
          background: @activeFontColor;
          position: absolute;
        }
      }

      .ant-radio-group {
        margin-bottom: 30px;

        .ant-radio-button-wrapper {
          padding: 0;
          border: none;
          margin: 0 15px;
          border-radius: 0;
          color: #515a6e;
          padding-bottom: 35px;

          &.ant-radio-button-wrapper-checked {
            border: none;
            color: @activeFontColor;
            background-color: #fff;
            border-bottom: 1px solid @activeFontColor;

            &:focus-within {
              box-shadow: none;
            }
          }

          &:hover {
            color: #2362fb;
          }

          &::before {
            content: none;
          }
        }
      }

      &-btns {
        bottom: 0;
        right: 12px;
        padding-left: 6px;
        position: absolute;
        padding-bottom: 12px;

        .ant-btn {
          margin-left: 8px;
          line-height: 28px;
        }
      }

      .condition-part {
        overflow: auto;
        padding-bottom: 36px;
        height: calc(100% - 54px);

        .rules-details-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          max-width: 860px;
          width: 100%;

          .detail-item {
            width: calc((100% - 80px) / 2);
            display: flex;
            line-height: 32px;
            margin-bottom: 16px;
            color: @primaryTextColor;

            &:last-child {
              width: 100%;
            }

            .item-label {
              color: @secondaryTextColor;
              width: 85px;
              text-align: right;
            }

            .item-content {
              padding-left: 12px;
              width: calc(100% - 85px);
              display: flex;
              align-items: center;

              .rule-type-select,
              .rule-name-input {
                width: 100%;
              }

              .check-num-input,
              .cycle-unit-select {
                width: calc((100% - 16px) / 2);
              }

              .check-num-input {
                margin-right: 16px;
              }
            }
          }
        }

        .condition-group {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 16px;

          &-label {
            width: 75px;
            text-align: right;
            margin-right: 10px;
            color: @secondaryTextColor;
          }

          &-content {
            display: flex;
            width: calc(100% - 85px);

            .condition-item {
              line-height: 24px;
              padding: 2px 8px;
              background: @backgroundColor;
              font-size: 12px;
              color: @secondaryTextColor;
              margin-right: 8px;
            }

            .item-select {
              width: 280px;
            }

            .anticon-info-circle {
              margin-left: 10px;
              font-size: 18px;
              color: @blue;
              cursor: pointer;

              svg {
                margin-top: 7px;
              }
            }

            .condition-text {
              color: @primaryTextColor;
            }

            .change-btn {
              color: @blue;
              cursor: pointer;
              margin-left: 12px;
            }

            .ant-input[disabled] {
              color: @primaryTextColor;
              background-color: #fff;
            }

            .add-condition-btn {
              height: 28px;
              line-height: 26px;
              font-size: 12px;
              padding: 0 10px;
              margin-right: 16px;
            }
          }

          &-btn {
            height: 32px;
            font-size: 12px;
            padding: 0 10px;
            margin-right: 16px;
          }

          .ant-checkbox-wrapper {
            display: flex;
            margin-right: 16px;
            align-items: center;

            .ant-checkbox {
              margin-top: 3px;

              & + span {
                padding-right: 0;
                color: @primaryTextColor;
              }
            }
          }

          &-name {
            display: flex;
            font-size: 12px;
            padding: 0 12px;
            border-radius: 3px;
            align-items: center;
            background: @tableHeaderColor;
            border: 1px solid @dividersColor;

            .name-text {
              color: @primaryTextColor;
            }

            .name-content {
              color: @blue;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

.add-sub-menu {
  .select-file {
    width: 100%;
    margin-bottom: 10px;
  }
}

.more-actions {
  .ant-popover-content {
    .ant-popover-arrow {
      border-right-color: rgba(0, 0, 0, 0.75);
      border-bottom-color: rgba(0, 0, 0, 0.75);
    }

    .ant-popover-inner {
      &-content {
        padding: 8px;
        background: rgba(0, 0, 0, 0.75);
        color: rgba(255, 255, 255, 0.85);

        p {
          cursor: pointer;

          &:hover {
            color: #fff;
          }
        }
      }
    }
  }
}
.condition-modal {
  .ant-modal {
    top: 64px;
    right: 0;
    margin: 0;
    padding: 0;
    bottom: 30px;
    position: absolute;

    .ant-modal-content {
      height: 100%;

      .ant-modal-body {
        overflow: auto;
        height: calc(100% - 108px);

        .condition-modal-content {
          .keywords-search {
            display: flex;
            margin-bottom: 6px;

            .keywords-input {
              width: calc(100% - 32px);
              color: @disabledColor;

              .ant-input {
                border-right: 0;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              }
            }

            .keywords-btn {
              width: 32px;
              color: #8c8c8c;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
          }
        }
      }

      .ant-modal-footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}

.field-modal-content {
  .ant-steps {
    width: 480px;
    margin: 0 auto;
  }

  &-item {
    margin-top: 24px;

    .item-title {
      margin-bottom: 8px;
      color: @secondaryTextColor;
    }

    .library-table {
      .ant-table-thead {
        .ant-table-row-cell-break-word {
          font-weight: 600;
          color: @secondaryTextColor;
          padding: 8px 20px !important;
        }
      }

      .ant-table-row-cell-break-word {
        color: @primaryTextColor;
        padding: 8px 20px !important;
      }

      .ant-pagination {
        float: none;
        text-align: center;
      }
    }
  }
}

.relation-field-modal {
  .ant-table-wrapper {
    .ant-table-header,
    .ant-table-thead {
      background-color: #e8f2ff !important;

      th {
        background-color: #e8f2ff !important;
      }
    }
  }

  .graphName-title {
    display: block;
    margin-top: 16px;
    margin-bottom: 8px;

    .text-blue {
      color: @activeFontColor;
    }
  }

  .show-title {
    display: block;
    margin-top: 32px;
    margin-bottom: 16px;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #000;
  }
}
</style>
