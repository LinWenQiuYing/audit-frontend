<template>
  <div class="business-info-content">
    <div class="business-info-content-obj">
      <div class="content-obj-img">
        <icon-svg icon-class="enterprise_solid_blue" />
      </div>
      <span class="content-obj-text">{{ paramsObj.corpName }}</span>
    </div>
    <div
      class="tags-item"
      v-for="(item, index) in tagsList"
      :key="index"
      @mouseenter="onMouse(item.title, 'enter')"
      @mouseleave="onMouse(item.title, 'leave')"
    >
      <img v-if="item.isHover" :src="item.activeSrc" alt="" />
      <img v-else :src="item.src" alt="" />
      <!-- class:太阳图竖线样式 舆情信息置空 隐掉竖线 -->
      <div
        :class="
          item.title === ''
            ? ''
            : item.isHover
            ? index > 0 && index < 6
              ? 'tags-item-content right active'
              : 'tags-item-content left active'
            : index > 0 && index < 6
            ? 'tags-item-content right'
            : 'tags-item-content left'
        "
      >
        <div class="content-title">{{ item.title }}</div>
        <div class="content-tags">
          <div
            :class="tag.isActive ? 'content-tag active' : 'content-tag'"
            v-for="(tag, num) in item.tags"
            :key="num"
          >
            {{ tag.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { queryEntLable } from "@/shared/api/auditMode.js";
import { mapState } from "vuex";

export default {
  name: "BusinessInfoContent",
  data() {
    return {
      tagsList: [
        {
          title: "经营情况",
          src: require("@/assets/images/img/经营情况-未选中.svg"),
          activeSrc: require("@/assets/images/img/经营情况-选中.svg"),
          tags: [],
          isHover: false,
        },
        {
          title: "基本情况",
          src: require("@/assets/images/img/基本情况-未选中.svg"),
          activeSrc: require("@/assets/images/img/基本情况-选中.svg"),
          tags: [],
          isHover: false,
        },
        {
          title: "行政许可",
          src: require("@/assets/images/img/行政许可-未选中.svg"),
          activeSrc: require("@/assets/images/img/行政许可-选中.svg"),
          tags: [],
          isHover: false,
        },
        {
          title: "科技创新",
          src: require("@/assets/images/img/科技创新-未选中.svg"),
          activeSrc: require("@/assets/images/img/科技创新-选中.svg"),
          tags: [],
          isHover: false,
        },
        {
          title: "负面事件",
          src: require("@/assets/images/img/负面事件-未选中.svg"),
          activeSrc: require("@/assets/images/img/负面事件-选中.svg"),
          tags: [],
          isHover: false,
        },
        {
          title: "", // 舆情信息
          src: require("@/assets/images/img/舆情信息-未选中.svg"),
          activeSrc: require("@/assets/images/img/舆情信息-选中.svg"),
          tags: [],
          isHover: false,
        },
        {
          title: "财务状况",
          src: require("@/assets/images/img/财务状况-未选中.svg"),
          activeSrc: require("@/assets/images/img/财务状况-选中.svg"),
          tags: [],
          isHover: false,
        },
        {
          title: "历史沿革",
          src: require("@/assets/images/img/历史沿革-未选中.svg"),
          activeSrc: require("@/assets/images/img/历史沿革-选中.svg"),
          tags: [],
          isHover: false,
        },
      ],
    };
  },
  computed: {
    ...mapState("auditOptions", ["paramsObj"]),
  },
  mounted() {
    this.queryEntLable();
  },
  methods: {
    onMouse(title, type) {
      for (let i = 0; i < this.tagsList.length; i++) {
        const element = this.tagsList[i];
        if (title === element.title) {
          element.isHover = type === "enter" ? true : false;
        } else {
          element.isHover = false;
        }
      }
    },
    handleClickTag(index, num) {
      this.tagsList[index].tags[num].isActive =
        !this.tagsList[index].tags[num].isActive;
    },
    async queryEntLable() {
      const json = {
        uniScId: this.paramsObj.uniScId,
        // uniScId: "913101150129382K1",
      };
      const res = await queryEntLable(json);
      console.log("queryEntLable", res);
      if (res.message === "成功" && res.data) {
        let tags = [];
        // 基本信息
        res.data.basicSituationLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        // 命中的标签放前面
        tags.sort((a, b) => b.isActive - a.isActive);
        this.tagsList.splice(1, 1, {
          title: "基本情况",
          src: require("@/assets/images/img/基本情况-未选中.svg"),
          activeSrc: require("@/assets/images/img/基本情况-选中.svg"),
          tags,
          isHover: false,
        });
        // 舆情信息
        // tags = [];
        // res.data.consensusLabels.map((item) => {
        //   tags.push({
        //     id: item.labelId,
        //     text: item.labelName,
        //     isActive: item.isOrNoHit === "1" ? true : false,
        //   });
        // });
        // tags.sort((a, b) => b.isActive - a.isActive);
        // this.tagsList.splice(5, 1, {
        //   title: "",
        //   src: require("@/assets/images/img/舆情信息-未选中.svg"),
        //   activeSrc: require("@/assets/images/img/舆情信息-选中.svg"),
        //   tags,
        //   isHover: false,
        // });
        // 财务情况
        tags = [];
        res.data.financialSituationLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.tagsList.splice(6, 1, {
          title: "财务状况",
          src: require("@/assets/images/img/财务状况-未选中.svg"),
          activeSrc: require("@/assets/images/img/财务状况-选中.svg"),
          tags,
          isHover: false,
        });
        // 历史沿革
        tags = [];
        res.data.historyLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.tagsList.splice(7, 1, {
          title: "历史沿革",
          src: require("@/assets/images/img/历史沿革-未选中.svg"),
          activeSrc: require("@/assets/images/img/历史沿革-选中.svg"),
          tags,
          isHover: false,
        });
        // 行政许可
        tags = [];
        res.data.licenseLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.tagsList.splice(2, 1, {
          title: "行政许可",
          src: require("@/assets/images/img/行政许可-未选中.svg"),
          activeSrc: require("@/assets/images/img/行政许可-选中.svg"),
          tags,
          isHover: false,
        });
        // 负面事件
        tags = [];
        res.data.negativeEventLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.tagsList.splice(4, 1, {
          title: "负面事件",
          src: require("@/assets/images/img/负面事件-未选中.svg"),
          activeSrc: require("@/assets/images/img/负面事件-选中.svg"),
          tags,
          isHover: false,
        });
        // 科技创新
        tags = [];
        res.data.sciAndInnonegativeEventLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.tagsList.splice(3, 1, {
          title: "科技创新",
          src: require("@/assets/images/img/科技创新-未选中.svg"),
          activeSrc: require("@/assets/images/img/科技创新-选中.svg"),
          tags,
          isHover: false,
        });
        // 经营情况
        tags = [];
        res.data.businessConditionsLabels.map((item) => {
          tags.push({
            id: item.labelId,
            text: item.labelName,
            isActive: item.isOrNoHit === "1" ? true : false,
          });
        });
        tags.sort((a, b) => b.isActive - a.isActive);
        this.tagsList.splice(0, 1, {
          title: "经营情况",
          src: require("@/assets/images/img/经营情况-未选中.svg"),
          activeSrc: require("@/assets/images/img/经营情况-选中.svg"),
          tags,
          isHover: false,
        });
      } else if (res.message === "成功" && !res.data) {
        this.$message.info("暂无标签数据");
      } else {
        this.$message.error(res.message);
      }
    },
  },
};
</script>
<style lang="less">
.business-info-content {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("~@/assets/images/img/earth.svg") no-repeat center;
  background-size: 70%;
  -webkit-background-size: 70%;
  -o-background-size: 70%;

  &-obj {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    display: flex;
    flex-direction: column;
    width: 15%;
    align-items: center;

    .content-obj-img {
      width: 50%;
      height: 40px;
      padding-bottom: 6px;
    }

    span {
      color: #336ce2;
      font-weight: 600;
      text-align: center;
    }
  }

  .tags-item {
    position: absolute;
    width: 20%;
    height: 20%;
    cursor: pointer;

    img {
      width: 100%;
      position: absolute;
    }

    &:nth-of-type(2) {
      left: 37.5%;
      top: 12%;
      img {
        transform: translateX(-50%) rotate(135deg);
      }

      .tags-item-content {
        top: 20%;
        left: -155%;
      }
    }
    &:nth-of-type(3) {
      left: 50%;
      top: 3.4%;
      img {
        transform: translateX(-50%) rotate(180deg);
      }

      .tags-item-content {
        top: -30%;
        left: 14%;
      }
    }
    &:nth-of-type(4) {
      left: 62.5%;
      top: 12%;
      img {
        transform: translateX(-50%) rotate(225deg);
      }

      .tags-item-content {
        top: 20%;
        left: 30%;
      }
    }
    &:nth-of-type(5) {
      left: 67.8%;
      top: 33%;
      img {
        transform: translateX(-50%) rotate(270deg);
      }

      .tags-item-content {
        top: 50%;
        left: 40%;
      }
    }
    &:nth-of-type(6) {
      left: 62.5%;
      top: 54%;
      img {
        transform: translateX(-50%) rotate(315deg);
      }

      .tags-item-content {
        top: 98%;
        left: 30%;
      }
    }
    &:nth-of-type(7) {
      left: 50%;
      top: 62.6%;
      img {
        transform: translateX(-50%);
      }

      .tags-item-content {
        top: 90%;
        left: 14%;
      }
    }
    &:nth-of-type(8) {
      left: 37.5%;
      top: 54%;
      img {
        transform: translateX(-50%) rotate(45deg);
      }

      .tags-item-content {
        top: 98%;
        left: -155%;
      }
    }
    &:nth-of-type(9) {
      left: 32.2%;
      top: 33%;
      img {
        transform: translateX(-50%) rotate(90deg);
      }

      .tags-item-content {
        top: 58%;
        left: -165%;
      }
    }

    &-content {
      padding: 14px 10px 10px;
      width: 125%;
      height: 100%;
      position: absolute;

      &.right {
        border-left: 1px solid @blue;
      }
      &.left {
        border-right: 1px solid @blue;

        .content-title,
        .content-tags {
          text-align: right;
        }
      }

      &.active {
        background: url("~@/assets/images/img/tags-background.svg") no-repeat
          center;
        background-size: cover;
        -webkit-background-size: cover;
        -o-background-size: cover;
      }

      .content-title {
        font-size: 13px;
        color: @primaryTextColor;
        font-weight: 600;
        padding-bottom: 4px;
      }

      .content-tags {
        height: calc(100% - 23.5px);
        overflow: auto;

        &::-webkit-scrollbar {
          display: none;
        }

        .content-tag {
          display: inline-block;
          border: 1px solid @borderColor;
          padding: 0 8px;
          font-size: 12px;
          background: #fff;
          color: @primaryTextColor;
          height: 22px;
          line-height: 22px;
          margin-right: 4px;
          margin-bottom: 4px;

          &.active {
            color: @activeFontColor;
            border-color: #99c5ff;
            background-color: #f2f8ff;
          }
        }
      }
    }
  }
}
</style>
