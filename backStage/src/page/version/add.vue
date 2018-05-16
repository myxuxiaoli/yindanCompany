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
      this.$parent.leftItme("版本管理", "/version");
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
      if (versionState) {
        var data = new FormData();
        data.append("version", this.version);
        data.append("versionType", this.versionTypeVal);
        data.append("token", this.$store.state.userInfo.token);
        data.append("userId", this.$store.state.userInfo.userId);
        data.append("versionIntroduce", this.versionIntroduce);
        data.append("downloadUrl", this.downloadUrl);
        data.append("machineType", this.machineTypeVal);
        async("/versionControlController/insertVc.do", data, "FORM", {
          contentType: ""
        })
          .then(data => {
            if (data.code == 200) {
              _this.$notify({
                title: "成功",
                message: "添加成功",
                type: "success"
              });
              this.$parent.closeJump("版本管理", "/version");
            } else if (data.code == 201) {
              _this.$notify({
                title: "提示",
                message: data.msg,
                type: "success"
              });
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
  }
};
</script>
<style lang="less" scoped>
.search {
  margin-top: 0;
}
.el-textarea {
  max-width: 600px;
  .el-textarea__inner {
    width: 150%;
    min-height: 200% !important;
  }
}
</style>
