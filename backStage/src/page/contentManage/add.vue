<template>
    <div>
        <z-modular>
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
                <el-form-item label="封面图" v-show="selectedOptions[0]==3?true:false">
                    <z-upload v-model="banner" @preview="enlarge" length="1" fileType="内容"></z-upload>
                    <p class="prompt">* 图片规格为 1000 * 1000</p>
                </el-form-item>
                <el-form-item label="段落内容">
                    <div class="videoImgTextBox">
                      <div class="videoImg" v-for="(items,index) of newsContent">
                        <span class="close" @click="newsDelete(index)"></span>
                        <el-input v-model="items.text" placeholder="图片/视频说明" type="textarea" :autosize="{ minRows: 8, maxRows: 4}"></el-input>
                        <z-upload v-model="items.url" @preview="enlarge" type="0" length="10" fileType="内容"></z-upload>
                      </div>
                    </div> 
                      <el-button type="primary" @click="addPhase">下一段</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addGoods">发布内容</el-button>
                    <el-button type="danger" @click="cancel">取消发布</el-button>
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
      //新闻标题
      newsTitle: "",
      selectedOptions: [], //板块数组
      //段落内容
      newsContent: [
        {
          url: [],
          text: ""
        }
      ],
      banner: [],
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
    //取消发布
    cancel() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("内容管理", "/contentManage");
    },
    handleChange(val) {
      console.log(val);
      console.log(this.selectedOptions);
    },
    //图片查看
    enlarge(url) {
      console.log(url);
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    addPhase() {
      this.newsContent.push({
        url: [],
        text: "",
        newsTypeVal: ""
      });
    },
    newsDelete(index) {
      this.newsContent.splice(index, 1);
    },
    //添加按钮
    addGoods() {
      const _this = this;
      console.log(this.newsContent);
      var newsState = true;
      if (this.newsTitle == "") {
        this.$message({
          message: "请输入新闻标题",
          type: "warning"
        });
        newsState = false;
      }
      if (this.selectedOptions == []) {
        this.$message({
          message: "请选择新闻板块",
          type: "warning"
        });
        newsState = false;
      }
      if (
        this.selectedOptions[0] == 3 &&
        (this.banner == "" || this.banner.length == 0)
      ) {
        this.$message({
          message: "请上传活动封面图",
          type: "warning"
        });
        newsState = false;
      }
      if (newsState) {
        var data = new FormData();
        var newsContentJson = JSON.stringify(this.newsContent);
        var bannerJson = JSON.stringify(this.banner);
        console.log(bannerJson);

        data.append("newsTitle", this.newsTitle);
        data.append("newsPlate", this.selectedOptions);
        data.append("newsContent", newsContentJson);
        data.append("bannerUrl", bannerJson);
        data.append("newsReleaseType", 1);
        data.append("token", this.$store.state.userInfo.token);
        data.append("userId", this.$store.state.userInfo.userId);
        async("/newsController/releaseNews.do", data, "FORM", {
          contentType: ""
        })
          .then(data => {
            if (data.code == 200) {
              _this.$notify({
                title: "成功",
                message: "发布成功",
                type: "success"
              });
              this.$parent.closeJump("内容管理", "/contentManage");
            }
          })
          .catch(function(err) {
            console.log(err);
            _this.$notify.error({
              title: "错误",
              message: "上传失败"
            });
          });
      }
    }
  },
  mounted() {}
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
