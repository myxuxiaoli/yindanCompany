<template>
    <div>
        <z-modular :data="tableData">
            <el-form ref="companyInfo" label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="newsTitle"></el-input>
                </el-form-item>
               <el-form-item label="板块">
                   	<div class="search input">
                        <el-cascader
                          placeholder="选择板块"
                          expand-trigger="hover"
                          :options="plateType"
                          v-model="selectedOptions"
                          @change="handleChange">
                        </el-cascader>
  		            </div>
                </el-form-item>
                <el-form-item label="封面图" v-if="selectedOptions[0]==3">
                    <z-upload v-model="banner" @preview="enlarge" length="1" fileType="内容"></z-upload>
                    <p class="prompt">* 图片规格为 1000 * 1000</p>
                </el-form-item>
                <el-form-item label="段落内容">
                    <div class="videoImgTextBox">
                      <div class="videoImg" v-for="(items,index) of newsContent">
                        <span class="close" @click="newsDelete(index)"></span>
                        <el-input v-model="items.text" placeholder="图片/视频说明" type="textarea" :autosize="{ minRows: 8, maxRows: 4}"></el-input>
                        <z-upload fileType="内容" v-model="items.fragmentList" @preview="enlarge" type="0" length="10"></z-upload>
                      </div>
                    </div> 
                      <el-button type="primary" @click="addPhase">下一段</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addGoods">保存修改</el-button>
                    <el-button type="danger" @click="cancel">取消保存</el-button>
                </el-form-item>
            </el-form>
        </z-modular>
        <!--//预览图片-->
        <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
import { async } from "@/config/fetch";
export default {
  data() {
    return {
      // 预览图片
      dialogVisible: false,
      dialogImageUrl: "",
      newsTitle: "", //新闻标题
      selectedOptions: [], //板块数组
      newsPlate: "", //新闻板块
      //新闻内容
      newsContent: [
        {
          text: ""
        }
      ],
      banner: [], //banner图必须默认数组
      tableData: [],
      //板块类型
      plateType: [
        {
          value: 1,
          label: "看世界",
          children: [
            {
              value: 1,
              label: "新闻"
            },
            {
              value: 2,
              label: "视频"
            }
          ]
        },
        {
          value: 2,
          label: "养生堂"
        },
        {
          value: 3,
          label: "活动"
        }
      ]
    };
  },
  watch: {},
  methods: {
    //取消保存
    cancel() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("内容管理", "/contentManage");
    },
    handleChange(value) {
      console.log(value);
    },
    //图片查看
    enlarge(url) {
      console.log(url);
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    addPhase() {
      this.newsContent.push({
        text: ""
      });
    },
    newsDelete(index) {
      this.newsContent.splice(index, 1);
    },
    //保存修改的时候提交
    addGoods() {
      const _this = this;
      console.log(this.newsContent);
      console.log(this.banner + "...");
      if (this.newsTitle == "") {
        this.$message({
          message: "请输入新闻标题",
          type: "warning"
        });
      } else if (this.selectedOptions == []) {
        this.$message({
          message: "请选择新闻板块",
          type: "warning"
        });
      } else if (this.selectedOptions[0] == 3 && this.banner == "") {
        this.$message({
          message: "请上传活动封面图",
          type: "warning"
        });
      } else {
        var data = new FormData();
        var newsContentJson = JSON.stringify(this.newsContent);
        var bannerJson = JSON.stringify(this.banner);
        console.log(bannerJson);
        data.append("newsId", this.$route.params.id);
        data.append("newsTitle", this.newsTitle);
        data.append("newsPlate", this.selectedOptions);
        data.append("newsContent", newsContentJson);
        data.append("bannerUrl", bannerJson);
        data.append("newsReleaseType", 1);
        data.append("token", this.$store.state.userInfo.token);
        data.append("userId", this.$store.state.userInfo.userId);
        async("/newsController/editNews.do", data, "FORM", {
          contentType: ""
        })
          .then(data => {
            if (data.code == 200) {
              _this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success"
              });
              this.$parent.closeJump("内容管理", "/contentManage");
            }
          })
          .catch(err => {
            console.log(err);
            _this.$notify.error({
              title: "错误",
              message: "上传失败"
            });
          });
      }
    },
    pageData() {
      console.log(this.$route.params.id);
      async(
        "/newsController/toEditNews.do",
        {
          newsId: this.$route.params.id
        },
        "POST"
      )
        .then(data => {
          console.log(data);
          if (parseInt(data.code) == 200) {
            this.tableData = data.newsInfo;
            this.newsContent = data.newsContent;
            this.banner = data.bannerList;
            this.newsTitle = data.newsTitle;
            this.selectedOptions = data.newsPlate;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$notify.error({
            title: "错误",
            message: "加载失败！123"
          });
        });
    }
  },
  mounted() {
    this.pageData();
  }
};
</script>
<style lang="scss">
.search {
  margin-top: 0;
}

.videoImgTextBox {
  border: 1px solid #ccc;
  margin-bottom: 15px;
  .nextPhaseBtn {
    margin-bottom: 15px;
  }
  .videoImg {
    padding: 10px;
    position: relative;
    border-bottom: 1px solid #e6e6e6;
    .el-textarea {
      margin-bottom: 15px;
      max-width: 100%;
    }
    .el-textarea__inner {
      border: 0px;
    }
    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ccc;
      cursor: pointer;
      &::after {
        content: "×";
        font-size: 26px;
        transform: translateY(-3px);
        color: #999;
      }
      &:hover::after {
        color: #f00;
      }
    }
  }
}
</style>
