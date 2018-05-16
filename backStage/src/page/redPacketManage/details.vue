<template>
    <div>
        <z-modular>
            <el-form ref="companyInfo" label-width="100px">
                <el-form-item  label="名称">
                    <el-input v-model="redEnvelopesName" aria-placeholder="20字以内"></el-input>
                </el-form-item>
                <el-form-item label="金额（元）">
                    <el-input v-model="redEnvelopesPrice"></el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="redEnvelopesNumber"></el-input>
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
    pageData() {
      console.log(this.$route.params.id);
      async(
        "/redEnvelopesController/ toEditRedEnvelopes.do",
        {
          redEnvelopesId: this.$route.params.id
        },
        "POST"
      )
        .then(data => {
          console.log(data);
          if (parseInt(data.code) == 200) {
            var datas = data.resultInfo;
            this.redEnvelopesName = datas.redEnvelopesName;
            this.redEnvelopesNumber = datas.redEnvelopesNumber;
            this.userName = datas.userName;
            this.redEnvelopesPrice = datas.redEnvelopesPrice;
            this.startTime = datas.startTime;
            this.activityIllustrate = datas.activityIllustrate;
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
