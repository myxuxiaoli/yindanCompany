<template>
    <div>
        <z-modular>
            <el-form ref="companyInfo" label-width="100px">
                <el-form-item  label="版本号">
                    <el-input v-model="version" placeholder="请输入版本号"></el-input>
                </el-form-item>
                <el-form-item label="版本类型" :data="versionTypes">
                    <div class="search input">
                        <el-select v-model="versionTypeVal" placeholder="选择版本类型">
                            <el-option
                                v-for="item in versionTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
  		            </div>
                </el-form-item>
                 <el-form-item label="手机类型" :data="machineTypes">
                    <div class="search input">
                        <el-select v-model="machineTypeVal" placeholder="选择手机类型">
                            <el-option
                                v-for="item in machineTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
  		            </div>
                </el-form-item>
                <el-form-item  label="下载地址" v-if="machineTypeVal==2">
                    <el-input v-model="downloadUrl" placeholder="请输入下载地址"></el-input>
                </el-form-item>
                <el-form-item label="版本介绍">
                    <div class="contentBox">
                        <el-input v-model="versionIntroduce" placeholder="请输入版本介绍" type="textarea" :autosize="{ minRows: 8, maxRows: 4}"></el-input>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addVersion">添加</el-button>
                    <el-button type="danger" @click="cancel">取消</el-button>
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
      version: "", //版本号
      versionIntroduce: "", //版本介绍
      versionTypeVal: "", //版本类型值
      machineTypeVal: "", //手机类型值
      downloadUrl: "", //下载地址
      machineTypes: [
        {
          //手机类型
          value: 1,
          label: "IOS"
        },
        {
          value: 2,
          label: "Android"
        }
      ],
      versionTypes: [
        //版本类型
        {
          value: 1,
          label: "一般更新"
        },
        {
          value: 2,
          label: "重要更新"
        },
        {
          value: 3,
          label: "强制更新"
        }
      ]
    };
  },
  methods: {
    //取消发布
    cancel() {
      //跳转到商品添加页面，并且刷新会储存
      //   this.$parent.leftItme("商品管理", "/goodsManage");
    },
    newsDelete(index) {
      this.goodsContent.splice(index, 1);
    },
    //图片查看
    enlarge(url) {
      console.log(url);
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    //取消编辑保存
    cancel() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("版本管理", "/version");
    },
    //添加按钮
    addVersion() {
      const _this = this;
      var versionState = true;
      if (this.version == "") {
        this.$message({
          message: "请输入版本号",
          type: "warning"
        });
        versionState = false;
      }
      if (this.versionTypeVal == "") {
        this.$message({
          message: "请选择版本类型",
          type: "warning"
        });
        versionState = false;
      }
      if (this.versionIntroduce == "") {
        this.$message({
          message: "请输入版本介绍",
          type: "warning"
        });
        versionState = false;
      }
      if (this.machineTypeVal == 2 && this.downloadUrl == "") {
        this.$message({
          message: "请输入安卓下载地址",
          type: "warning"
        });
        versionState = false;
      }
      if (versionState) {
        var data = new FormData();
        data.append("version", this.version);
        data.append("token", this.$store.state.userInfo.token);
        data.append("userId", this.$store.state.userInfo.userId);
        data.append("versionControlId", this.$route.params.id);
        data.append("versionType", this.versionTypeVal);
        data.append("downloadUrl", this.downloadUrl);
        data.append("machineType", this.machineTypeVal);
        data.append("versionIntroduce", this.versionIntroduce);
        async("/versionControlController/updateVc.do", data, "FORM", {
          contentType: ""
        })
          .then(data => {
            if (data.code == 200) {
              _this.$notify({
                title: "成功",
                message: "编辑成功",
                type: "success"
              });
              this.$parent.closeJump("版本管理", "/version");
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
    //原来版本信息
    pageVersion() {
      async(
        "/versionControlController/queryDetails.do",
        {
          versionControlId: this.$route.params.id
        },
        "POST"
      )
        .then(data => {
          console.log(data);
          if (data.code == 200 && data.info != null) {
            this.version = data.info.version;
            this.versionIntroduce = data.info.versionIntroduce;
            this.versionTypeVal = data.info.versionType;
            this.machineTypeVal = data.info.machineType;
            this.downloadUrl = data.info.downloadUrl;
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
    this.pageVersion();
  }
};
</script>
<style lang="less" scoped>
.el-textarea {
  max-width: 600px;
  .el-textarea__inner {
    width: 150%;
    min-height: 200% !important;
  }
}
</style>