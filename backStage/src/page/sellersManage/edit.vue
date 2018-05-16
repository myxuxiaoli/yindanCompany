<template>
    <div>
        <z-modular>
            <el-form ref="companyInfo" label-width="100px">
                <el-form-item label="名称">
                    <el-input v-model="businessName"></el-input>
                </el-form-item>
                 <el-form-item label="商家LOGO">
                    <z-upload v-model="banner" @preview="enlarge" @upload="goodUpload" length="1" fileType="商家"></z-upload>
                    <p class="prompt">* 图片规格为 1000 * 1000</p>
                </el-form-item>
                <el-form-item label="城市">
                  <el-cascader
                    placeholder="请选择城市"
                    expand-trigger="hover"
                    :options="cities"
                    v-model="selectedOptions"
                    @change="handleChange">
                  </el-cascader>
                </el-form-item>
                 <el-form-item label="联系电话">
                    <el-input type="number" v-model="contactNumber"></el-input>
                </el-form-item>
                 <el-form-item label="平台返佣">
                    <el-input  placeholder="%" v-model="businessRebate"></el-input>
                </el-form-item>
                <el-form-item label="简介内容">
                    <div class="videoImgTextBox">
                      <div class="videoImg" v-for="(items,index) of businessFfList">
                        <span class="close" @click="newsDelete(index)"></span>
                        <el-input v-model="items.text" placeholder="图片/视频说明" type="textarea" :autosize="{ minRows: 8, maxRows: 4}"></el-input>
                        <z-upload fileType="商家" v-model="items.url" @preview="enlarge" type="0" length="10"></z-upload>
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
      businessName: "", //商家名称
      contactNumber: "", //电话
      cities: [],
      selectedOptions: [],
      businessRebate: "",
      banner: "", //商家LOGO
      //段落内容
      businessFfList: [
        {
          url: [],
          text: ""
        }
      ],
      contents: [
        {
          val: "选项1",
          lab: "图片文字混排"
        },
        {
          val: "选项2",
          lab: "视频文字混排"
        }
      ],
      value2: "",
      value4: "",
      contentText: ""
    };
  },
  methods: {
    //取消保存
    cancel() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("商家管理", "/sellersManage");
    },
    handleChange(value) {
      console.log(value);
    },
    //省份城市
    provice() {
      const _this = this;
      async("/provincesController/queryProvincesAndCity.do")
        .then(data => {
          console.log(data);
          this.cities = data.proList.list;
          console.log("三级", this.cities);
        })
        .catch(err => {
          console.log(err);
          _this.$notify.error({
            title: "错误",
            message: "加载失败！"
          });
        });
    },
    //图片查看
    enlarge(url) {
      console.log(url);
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    //下一段
    addPhase() {
      this.businessFfList.push({
        url: [],
        text: "",
        newsTypeVal: ""
      });
    },
    newsDelete(index) {
      this.businessFfList.splice(index, 1);
    },
    //banner上传成功
    goodUpload(data) {
      this.banner = data;
    },
    //添加按钮
    addGoods() {
      const _this = this;
      console.log(this.businessFfList);
      var sellerState = true;
      var reg = /[%]/g;
      if (this.businessName == "") {
        this.$message({
          message: "请输入商家名称",
          type: "warning"
        });
        sellerState = false;
      }
      if (this.banner == "" || this.banner.length == 0) {
        this.$message({
          message: "请上传商家LOGO",
          type: "warning"
        });
        sellerState = false;
      }
      if (this.selectedOptions[0] == "" && this.selectedOptions[1] == "") {
        this.$message({
          message: "请选择商家所在城市",
          type: "warning"
        });
        sellerState = false;
      }
      if (this.contactNumber == "") {
        this.$message({
          message: "请输入商家联系电话",
          type: "warning"
        });
        sellerState = false;
      }
      if (this.businessRebate == "") {
        this.$message({
          message: "请输入平台返佣",
          type: "warning"
        });
        sellerState = false;
      } else if (this.businessRebate < 0) {
        this.$message({
          message: "平台返佣不能为负数",
          type: "warning"
        });
        sellerState = false;
      } else if (!reg.test(this.businessRebate)) {
        this.$message({
          message: "返佣必须为百分数",
          type: "warning"
        });
        sellerState = false;
      }
      if (sellerState) {
        var data = new FormData();
        var businessFfListJson = JSON.stringify(this.businessFfList);
        var bannerJson = JSON.stringify(this.banner);
        data.append("backstageUserId", 1);
        data.append("businessId", this.$route.params.id);
        data.append("sellerBanners", bannerJson);
        data.append("businessName", this.businessName);
        data.append("provinces", this.selectedOptions[0]);
        data.append("city", this.selectedOptions[1]);
        data.append("token", this.$store.state.userInfo.token);
        data.append("backstageUserId", this.$store.state.userInfo.userId);
        data.append("contactNumber", this.contactNumber);
        data.append("businessRebate", this.businessRebate);
        data.append("businessFfList", businessFfListJson);
        async("/businessController/editBusiness.do", data, "FORM", {
          contentType: ""
        })
          .then(data => {
            if (data.code == 200) {
              _this.$notify({
                title: "成功",
                message: "编辑成功",
                type: "success"
              });
              this.$parent.closeJump("商家管理", "/sellersManage");
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
    },
    pageData() {
      console.log(this.$route.params.id);
      async(
        "/businessController/toEditBusiness.do",
        {
          businessId: this.$route.params.id
        },
        "POST"
      )
        .then(data => {
          console.log(data);
          if (parseInt(data.code) == 200) {
            this.businessName = data.businessName;
            this.businessRebate = data.businessRebate;
            this.contactNumber = data.contactNumber;
            this.banner = data.sellerBanners;
            this.selectedOptions[0] = data.provinces;
            this.selectedOptions[1] = data.city;
            this.businessFfList = data.businessFfList;
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
    this.provice();
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
      .el-textarea__inner {
        border: 0px !important;
      }
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
