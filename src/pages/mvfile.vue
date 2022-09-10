<!--
  功能: 主页
  作者: gyh
  版本: v0.1
-->
<template>
  <div class="home-page">
    <div class="home-container">
      <div class="main-container">
        <div class="file-oldPath">
          <sui-statistic>
            <sui-statistic-label class="label-text">
              源目录
            </sui-statistic-label>
          </sui-statistic>
          <sui-input
            placeholder="请输入源目录"
            class="label-input"
            v-model="oldPath"
          />
          <sui-label
            basic
            color="red"
            pointing="left"
            v-show="oldPathIsNotExits"
          >
            {{ oldPathError }}
          </sui-label>
        </div>
        <div class="file-oldPath">
          <sui-statistic>
            <sui-statistic-label class="label-text">
              目的目录
            </sui-statistic-label>
          </sui-statistic>
          <sui-input
            placeholder="请输入目的目录"
            class="label-input"
            v-model="newPath"
          />
          <sui-label
            basic
            color="red"
            pointing="left"
            v-show="newPathIsNotExits"
          >
            {{ newPathError }}
          </sui-label>
        </div>
        <sui-tab class="tab-container">
          <sui-tab-pane title="视频资源" icon="video">
            <sui-checkbox
              :label="allVideoType ? '全不选' : '全选'"
              v-model="allVideoType"
              class="m-checkbox"
            />
            <sui-checkbox
              v-for="item in allType.videoType"
              :key="item.key"
              :label="item.key"
              v-model="item.value"
              class="m-checkbox"
            />
          </sui-tab-pane>
          <sui-tab-pane title="图片资源" icon="image">
            <sui-checkbox
              :label="allImageType ? '全不选' : '全选'"
              v-model="allImageType"
              class="m-checkbox"
            />
            <sui-checkbox
              v-for="item in allType.imageType"
              :key="item.key"
              :label="item.key"
              v-model="item.value"
              class="m-checkbox"
            />
          </sui-tab-pane>
          <sui-tab-pane title="其他资源" icon="file">
            <sui-checkbox
              :label="allOtherType ? '全不选' : '全选'"
              v-model="allOtherType"
              class="m-checkbox"
            />
            <sui-checkbox
              v-for="item in allType.otherType"
              :key="item.key"
              :label="item.key"
              v-model="item.value"
              class="m-checkbox"
            />
          </sui-tab-pane>
          <sui-tab-pane title="自定义后缀资源" icon="file">
            <sui-input
              v-model="costomizeType"
              class="m-checkbox"
              placeholder="多个后缀用逗号分割"
            />
          </sui-tab-pane>
        </sui-tab>
        <div class="m-submit">
          <sui-button primary @click="handleMove" :loading="ismoving">
            开始移动文件
          </sui-button>
        </div>
        <div class="m-message" v-show="isFinish">
          <sui-message>
            <sui-message-header>移动完成</sui-message-header>
            <p>一共移动了{{ fileCount }}个文件</p>
          </sui-message>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const fs = require("fs");
const parseTime = require("@/utils/parseTime");

export default {
  components: {},
  data() {
    return {
      //表单数据
      oldPath: localStorage.getItem("oldPath")
        ? localStorage.getItem("oldPath")
        : "",
      newPath: localStorage.getItem("newPath")
        ? localStorage.getItem("newPath")
        : "",
      ismoving: false,
      oldPathIsNotExits: false,
      newPathIsNotExits: false,
      oldPathError: "",
      newPathError: "",

      //tab数据
      allType: JSON.parse(localStorage.getItem("allType"))
        ? JSON.parse(localStorage.getItem("allType"))
        : {
            videoType: [
              { key: ".mp4", value: false },
              { key: ".wmv", value: false },
              { key: ".rmvb", value: false },
              { key: ".avi", value: false },
              { key: "mkv", value: false },
              { key: ".rm", value: false },
              { key: ".mov", value: false },
              { key: ".flv", value: false },
            ],
            imageType: [
              { key: ".png", value: false },
              { key: ".jpg", value: false },
              { key: ".gif", value: false },
              { key: ".jpeg", value: false },
              { key: ".bmp", value: false },
            ],
            otherType: [
              { key: ".rar", value: false },
              { key: ".zip", value: false },
              { key: ".7z", value: false },
              { key: ".iso", value: false },
              { key: ".wav", value: false },
              { key: ".flac", value: false },
              { key: ".mp3", value: false },
              { key: ".aac", value: false },
            ],
          },
      costomizeType: "",
      allVideoType: false,
      allImageType: false,
      allOtherType: false,
      fileCount: 0,
      isFinish: false,
    };
  },
  computed: {},
  watch: {
    oldPath() {
      this.oldPathIsNotExits = false;
    },
    newPath() {
      this.newPathIsNotExits = false;
    },
    allVideoType(n) {
      if (n) {
        this.allType.videoType.forEach((type) => {
          type.value = true;
        });
      } else {
        this.allType.videoType.forEach((type) => {
          type.value = false;
        });
      }
    },
    allImageType(n) {
      if (n) {
        this.allType.imageType.forEach((type) => {
          type.value = true;
        });
      } else {
        this.allType.imageType.forEach((type) => {
          type.value = false;
        });
      }
    },
    allOtherType(n) {
      if (n) {
        this.allType.otherType.forEach((type) => {
          type.value = true;
        });
      } else {
        this.allType.otherType.forEach((type) => {
          type.value = false;
        });
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 提交按钮
     */
    handleMove() {
      this.newPathIsNotExits = false;
      this.oldPathIsNotExits = false;
      this.fileCount = 0;

      const oldPath = this.oldPath;
      const newPath = this.newPath;
      const allType = Object.values(this.allType).flat();
      let chooseType = allType.filter((type) => {
        return type.value;
      });
      const costomizeType = this.costomizeType.split(",").map((item) => {
        return {
          key: item.trim(),
          value: true,
        };
      });
      chooseType = [...chooseType, ...costomizeType];
      console.log("源目录:", oldPath);
      console.log("目的目录:", newPath);
      console.log("chooseType:", chooseType);
      if (oldPath === "") {
        this.oldPathIsNotExits = true;
        this.oldPathError = "目录不存在";
        return;
      }
      if (newPath === "") {
        this.newPathIsNotExits = true;
        this.newPathError = "目录不存在";
        return;
      }
      //新建文件夹,根据当天命名
      const currentTime = new Date();
      const folderName = parseTime(currentTime, "{y}_{m}_{d}_{h}_{i}_{s}");
      const finalPath = `${newPath}\\${folderName}`;
      this.ismoving = true;
      this.makeDir(finalPath);
      this.findFilm(finalPath, oldPath, chooseType);
      this.ismoving = false;
      this.isFinish = true;
      this.setLocalVariable(oldPath, newPath, this.allType);
    },
    /**
     * 确定文件的格式是否是所选的
     */
    fileisChooseType(name, chooseType) {
      let meetConditions = false;
      for (let index = 0; index < chooseType.length; index++) {
        const suffix = chooseType[index].key;
        if (name.endsWith(suffix)) {
          meetConditions = true;
        }
      }
      return meetConditions;
    },
    /**
     * 新建文件夹
     */
    makeDir(name) {
      try {
        fs.mkdirSync(name);
      } catch (error) {
        console.log(error);
        this.newPathIsNotExits = true;
        this.newPathError = error;
      }
    },
    /**
     * 主要函数-处理文件移动
     */
    findFilm(finalPath, oldPath, chooseType) {
      const that = this;
      try {
        let downloadDirArr = fs.readdirSync(oldPath, { withFileTypes: true });
        for (let index = 0; index < downloadDirArr.length; index++) {
          const element = downloadDirArr[index];
          if (element.isDirectory()) {
            const deepPath = oldPath + "\\" + element.name;
            //递归查询
            that.findFilm(finalPath, deepPath, chooseType);
          } else {
            //找到符合所选格式文件
            const deepPath = oldPath + "\\" + element.name;
            const newName = finalPath + "\\" + element.name;

            if (that.fileisChooseType(element.name, chooseType)) {
              try {
                fs.renameSync(deepPath, newName);
                //移动文件
                that.fileCount += 1;
              } catch (error) {
                console.log("rename failed!!!", element, error);
                this.oldPathIsNotExits = true;
                this.oldPathError = error;
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
        this.oldPathIsNotExits = true;
        this.oldPathError = error;
      }
    },
    /**
     * 将输入的内容作为默认设置
     */
    setLocalVariable(oldPath, newPath, allType) {
      localStorage.setItem("oldPath", oldPath);
      localStorage.setItem("newPath", newPath);
      localStorage.setItem("allType", JSON.stringify(allType));
    },
  },
};
</script>

<style scoped type="text/css">
.home-page {
  position: relative;
}
.home-container {
  display: flex;
}
.main-container {
  display: flex;
  flex-direction: column;
}
.file-oldPath {
  margin-bottom: 20px;
}
.label-text {
  width: 100px;
  text-align: left !important;
}
.tab-container {
  margin-bottom: 20px;
}
.m-checkbox {
  margin-right: 20px;
}
.m-submit {
  margin-top: 20px;
}
.m-message {
  margin-top: 20px;
}
</style>
