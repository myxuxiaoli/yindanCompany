<template>
    <div>
        <z-modular>
            <el-form ref="companyInfo" label-width="100px">
                <el-form-item  label="名称">
                    <el-input v-model="redEnvelopesName" aria-placeholder="20字以内"></el-input>
                </el-form-item>
                <el-form-item label="金额（元）">
                    <el-input type="number"  v-model="redEnvelopesPrice"></el-input>
                </el-form-item>
                <el-form-item label="数量（个）">
                    <el-input type="number" v-model="redEnvelopesNumber"></el-input>
                </el-form-item>
                <el-form-item label="开抢时间">
                   <el-date-picker
                    v-model="startTime"
                    type="datetime"
                    placeholder="选择开抢时间">
                   </el-date-picker>
                </el-form-item>
                <el-form-item label="内容">
                    <div class="contentBox">
                        <el-input v-model="activityIllustrate" placeholder="100字以内的说明" :maxlength="100" type="textarea" :autosize="{ minRows: 8, maxRows: 4}"></el-input>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addGoods">创建</el-button>
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
      banner: "",
      redEnvelopesName: "", //红包名称
      redEnvelopesPrice: "", //红包金额
      redEnvelopesNumber: "", //红包数量
      startTime: "", //开抢时间
      activityIllustrate: "" //内容描述
    };
  },
  methods: {
    //取消保存
    cancel() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("红包管理", "/redPacketManage");
    },
    //图片查看
    enlarge(url) {
      console.log(url);
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    //banner上传成功
    goodUpload(data) {
      this.banner = data;
    },
    //添加按钮
    addGoods() {
      const _this = this;
      console.log(this.startTime.getTime());
      var redState = true;
      if (this.redEnvelopesName == "") {
        this.$message({
          message: "请输入红包名称",
          type: "warning"
        });
        redState = false;
      }
      if (this.redEnvelopesPrice == "") {
        this.$message({
          message: "请输入红包金额",
          type: "warning"
        });
        redState = false;
      }
      if (this.redEnvelopesNumber == "") {
        this.$message({
          message: "请输入红包数量",
          type: "warning"
        });
        redState = false;
      }
      if (this.redEnvelopesPrice / this.redEnvelopesNumber < 0.1) {
        this.$message({
          message: "每个红包的平均金额不能小于0.1元",
          type: "warning"
        });
        redState = false;
      }
      if (this.startTime == "") {
        this.$message({
          message: "请选择开抢时间",
          type: "warning"
        });
        redState = false;
      }
      if (this.activityIllustrate == "") {
        this.$message({
          message: "请输入红包文字说明",
          type: "warning"
        });
        redState = false;
      }
      if (redState) {
        var data = new FormData();
        data.append("redEnvelopesName", this.redEnvelopesName);
        data.append("userId", 1);
        data.append("redEnvelopesPrice", this.redEnvelopesPrice);
        data.append("redEnvelopesNumber", this.redEnvelopesNumber);
        data.append("activityIllustrate", this.activityIllustrate);
        data.append("startTime", this.startTime.getTime());
        data.append("token", this.$store.state.userInfo.token);
        data.append("userId", this.$store.state.userInfo.userId);
        async("/redEnvelopesController/releaseRedEnvelopes.do", data, "FORM", {
          contentType: ""
        })
          .then(data => {
            if (data.code == 200) {
              _this.$notify({
                title: "成功",
                message: "发布成功",
                type: "success"
              });
              this.$parent.closeJump("红包管理", "/redPacketManage");
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
<style lang="scss" scoped>
.contentBox {
  > * {
    &:first-child {
      margin-top: 0;
    }
    margin-top: 20px;
  }
}
</style>
