<template>
    <div>
        <z-modular>
            <el-form ref="companyInfo" label-width="100px">
                <el-form-item label="名称">
                    <el-input v-model="commodityName" :maxlength="20"></el-input>
                </el-form-item>
                 <el-form-item label="商家" :data="businessNameData">
                  <div class="search input">
                    <el-select v-model="businessNameVal" placeholder="选择商家" @change="businessChange">
                        <el-option
                            v-for="(item,index) in businessNameData"
                            :key="item.businessId"
                            :label="item.businessName"
                            :value="index">
                        </el-option>
                    </el-select>
  		            </div>
                </el-form-item>
                <el-form-item label="封面图">
                    <z-upload v-model="banner" @preview="enlarge" @upload="goodUpload" length="10" fileType="商品"></z-upload>
                    <p class="prompt">* 图片规格为 1000 * 1000</p>
                </el-form-item>
                <el-form :inline="true"  class="demo-form-inline">
                  <span>商品种类</span>
                  <div class="businessTypeBox">
                     <div class="businessType"  v-for="(item,index) of commodityTypeList">
                        <span class="closeBtn" @click="goodsTypeDelete(index)"></span>
                        <el-form-item label="种类">
                           <el-input v-model="item.commodityTypeName" placeholder="种类"></el-input>
                         </el-form-item>
                         <el-form-item label="价格（元）">
                           <el-input type="number" v-model="item.commodityTypePrice" placeholder="价格"></el-input>
                         </el-form-item>
                         <el-form-item label="库存">
                           <el-input type="number" v-model="item.commodityTypeStock" placeholder="库存(请输入整数)"></el-input>
                         </el-form-item>
                         <el-form-item label="运费（元）">
                           <el-input type="number" v-model="item.freight" placeholder="运费"></el-input>
                         </el-form-item>
                         <el-form-item label="返佣（%）">
                           <el-input type="text"  v-model="item.commodityTypeRebate" placeholder="返佣"></el-input>
                         </el-form-item>
                         <el-form-item label="奖励（元）">
                           <el-input type="number" v-model="item.reward" placeholder="奖励"></el-input>
                         </el-form-item>
                     </div>
                     <el-button type="primary" @click="addgoosType">添加种类</el-button>
                  </div>
                </el-form>
                 <el-form-item label="段落内容">
                    <div class="videoImgTextBox">
                      <div class="videoImg" v-for="(items,index) of goodsContent">
                        <span class="close" @click="newsDelete(index)"></span>
                        <el-input v-model="items.text" placeholder="图片/视频说明" type="textarea" :autosize="{ minRows: 8, maxRows: 4}"></el-input>
                        <z-upload fileType="商品" v-model="items.url" @preview="enlarge" type="0" length="10"></z-upload>
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
      commodityName: "", //商品名称
      businessNameVal: "", //商家名称值
      businessNameData: [], //商家名称
      commodityTypeList: [
        {
          commodityTypeName: "", //商品种类
          commodityTypePrice: "", //商品价格
          commodityTypeStock: "", //商品库存
          freight: "", //商品运费
          commodityTypeRebate: "", //商品返佣
          reward: "", //商品奖励
          salesVolume: 0 //销量
        }
      ],
      banner: "", //封面图
      //段落内容
      goodsContent: [
        {
          url: [],
          text: ""
        }
      ]
    };
  },
  methods: {
    //取消保存
    cancel() {
      this.$parent.closeJump("商品管理", "/goodsManage");
    },
    newsDelete(index) {
      this.goodsContent.splice(index, 1);
    },
    //添加商品种类
    addgoosType() {
      this.commodityTypeList.push({
        commodityTypeName: "", //商品种类
        commodityTypePrice: "", //商品价格
        commodityTypeStock: "", //商品库存
        freight: "", //商品运费
        commodityTypeRebate: this.commodityTypeList[0].commodityTypeRebate, //商品返佣
        reward: "", //商品奖励
        salesVolume: 0 //商品销量
      });
    },
    goodsTypeDelete(index) {
      this.commodityTypeList.splice(index, 1);
    },
    //下一段
    addPhase() {
      this.goodsContent.push({
        url: [],
        text: "",
        newsTypeVal: ""
      });
    },
    //图片查看
    enlarge(url) {
      console.log(url);
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    businessChange(index) {
      this.commodityTypeList[0].commodityTypeRebate = this.businessNameData[
        index
      ].businessRebate;
    },
    //banner上传成功
    goodUpload(data) {
      this.banner = data;
    },
    //商家名称集合数据请求
    businessName() {
      async("/commodityController/queryBusiness.do")
        .then(data => {
          this.businessNameData = data.buList;
        })
        .catch(err => {
          console.log(err);
          _this.$notify.error({
            title: "错误",
            message: "加载失败！"
          });
        });
    },
    //添加按钮
    addGoods() {
      const _this = this;
      if (this.commodityName == "") {
        this.$message({
          message: "请输入商品名称",
          type: "warning"
        });
      } else if (this.businessNameVal.length == 0) {
        this.$message({
          message: "请选择商家",
          type: "warning"
        });
      } else if (this.banner == "" || this.banner.length == 0) {
        this.$message({
          message: "请上传商品封面图",
          type: "warning"
        });
      } else {
        var commodityState = true;
        this.commodityTypeList.forEach(item => {
          if (item.commodityTypeName.length == 0) {
            this.$message({
              message: "请输入种类名称",
              type: "warning"
            });
            commodityState = false;
          }
          if (item.commodityTypePrice.length == 0) {
            this.$message({
              message: "请输入价格",
              type: "warning"
            });
            commodityState = false;
          } else if (parseInt(item.commodityTypePrice) < 0) {
            this.$message({
              message: "价格不能为负数",
              type: "warning"
            });
            commodityState = false;
          }
          var reg = /[%]/g;
          console.log(item.commodityTypeRebate);
          if (item.commodityTypeRebate.length == 0) {
            this.$message({
              message: "请输入返佣值",
              type: "warning"
            });
            commodityState = false;
          } else if (parseInt(item.commodityTypeRebate) < 0) {
            this.$message({
              message: "返佣不能为负数",
              type: "warning"
            });
            commodityState = false;
          } else if (!reg.test(item.commodityTypeRebate)) {
            this.$message({
              message: "返佣必须为百分数",
              type: "warning"
            });
            commodityState = false;
          }
          if (item.commodityTypeStock.length == 0) {
            this.$message({
              message: "请输入库存数量",
              type: "warning"
            });
            commodityState = false;
          } else if (parseInt(item.commodityTypeStock) < 0) {
            this.$message({
              message: "库存不能为负数",
              type: "warning"
            });
            commodityState = false;
          } else if (String(item.commodityTypeStock).indexOf(".") > -1) {
            this.$message({
              message: "库存不能为小数",
              type: "warning"
            });
            commodityState = false;
          }
          if (item.freight.length == 0) {
            this.$message({
              message: "请输入运费",
              type: "warning"
            });
            commodityState = false;
          } else if (parseInt(item.freight) < 0) {
            this.$message({
              message: "运费不能为负数",
              type: "warning"
            });
            commodityState = false;
          }
          var fanyong =
            parseInt(item.commodityTypePrice) *
            parseInt(item.commodityTypeRebate) *
            0.01;
          if (item.reward.length == 0) {
            this.$message({
              message: "请输入奖励",
              type: "warning"
            });
            commodityState = false;
          } else if (parseInt(item.reward) < 0) {
            this.$message({
              message: "奖励不能为负数",
              type: "warning"
            });
            commodityState = false;
          } else if (parseInt(item.reward) > fanyong) {
            this.$message({
              message: "奖励不能超过" + fanyong,
              type: "warning"
            });
            commodityState = false;
          }
        });
        if (commodityState) {
          var data = new FormData();
          var goodsContentJson = JSON.stringify(this.goodsContent);
          var bannerJson = JSON.stringify(this.banner);
          var businessTypeJson = JSON.stringify(this.commodityTypeList);
          data.append(
            "businessId",
            this.businessNameData[this.businessNameVal].businessId
          );
          data.append("commodityId", this.$route.params.id);
          data.append("commodityCode", "");
          data.append("commodityName", this.commodityName);
          data.append("commodityFfList", goodsContentJson);
          data.append("commodityPhotoList", bannerJson);
          data.append("token", this.$store.state.userInfo.token);
          data.append("userId", this.$store.state.userInfo.userId);
          data.append("commodityTypeList", businessTypeJson);
          async("/commodityController/editCommodity.do", data, "FORM", {
            contentType: ""
          })
            .then(data => {
              if (data.code == 200) {
                _this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success"
                });
                this.$parent.closeJump("商品管理", "/goodsManage");
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
    pageData() {
      console.log(this.$route.params.id);
      async(
        "/commodityController/toEditCommodity.do",
        {
          commodityId: this.$route.params.id
        },
        "POST"
      )
        .then(data => {
          console.log(data);
          if (data.code == 200) {
            this.commodityName = data.commodityName;
            this.businessNameData.forEach((item, index) => {
              if (item.businessId == data.businessId) {
                console.log(index);
                this.businessNameVal = index;
              }
            });
            this.banner = data.commodityPhotoList;
            this.commodityTypeList = data.commodityTypeList;
            this.goodsContent = data.commodityFfList;
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
            message: "加载失败"
          });
        });
    }
  },
  mounted() {
    this.pageData();
    this.businessName();
  }
};
</script>
<style lang="scss">
.demo-form-inline {
  padding-left: 45px;
}
.businessTypeBox {
  margin: 15px 0px 15px 55px;
  .businessType {
    padding: 20px;
    position: relative;
    border: 1px solid#e6e6e6;
    margin-bottom: 15px;
    .el-input {
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
    .el-form-item {
      margin-right: 80px;
    }
    .closeBtn {
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
      border: 0px;
    }
    .el-textarea__inner {
      border: 0px !important;
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
.search {
  margin-top: 0;
}
</style>
