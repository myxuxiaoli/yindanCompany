<template>
    <div>
        <z-modular>
            <el-form ref="companyInfo" label-width="100px">
                <div class="agreement">
                  <el-form-item label="用户协议">
                      <quill-editor v-model="umeditorTableContent"></quill-editor>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="collect">保存</el-button>
                      <el-button type="danger" @click="cancel">取消保存</el-button>
                  </el-form-item>
                </div>
            </el-form>
        </z-modular>
    </div>
</template>
<script>
import quillEditor from "@/components/common/quillEditor";
import { async } from "@/config/fetch";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      umeditorTableContent: "",
      umeditorTableId: null
    };
  },
  methods: {
    pageData() {
      console.log(this.$store.state.userInfo.token);
      async(
        "/umeditorTableController/queryAllInfo.do",
        {
          umeditorTableType: 2,
          token: this.$store.state.userInfo.token
        },
        "POST"
      )
        .then(data => {
          console.log(data);
          if (data.code == 200 && data.info != null) {
            this.umeditorTableContent = data.info.umeditorTableContent;
            this.umeditorTableId = data.info.umeditorTableId;
          }
        })
        .catch(err => {
          console.log(err);
          this.$notify.error({
            title: "错误",
            message: "加载失败！123"
          });
        });
    },
    collect() {
      var umeditorTableId;
      var data = new FormData();
      data.append("umeditorTableContent", this.umeditorTableContent);
      data.append("umeditorTableId", this.umeditorTableId);
      data.append("umeditorTableType", 2);
      data.append("token", this.$store.state.userInfo.token);
      async("/umeditorTableController/insertUmeditor.do", data, "FORM", {
        contentType: ""
      })
        .then(data => {
          console.log(data);
          if (data.code == 200) {
            this.$message({
              message: "保存成功",
              type: "warning"
            });
            this.$parent.closeJump("内容管理", "/contentManage");
          }
        })
        .catch(err => {
          console.log(err);
          this.$notify.error({
            title: "错误",
            message: "加载失败！"
          });
        });
    },
    cancel() {
      this.$parent.closeJump("内容管理", "/contentManage");
    }
  },
  mounted() {
    this.pageData();
  }
};
</script>

