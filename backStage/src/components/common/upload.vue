<template>
  <div class="uploadPicture">
    <div class="imgList" v-for="(item,index) of imgList">
      <video v-if="item.fragmentType === 2" :src="item.newsFileUrl || item.fragmentUrl"></video>
    		<img v-else :src="item.newsFileUrl || item.photoUrl"/>
      <div class="mask">
    		<i class="el-icon-view" @click="preview(item)"></i>
    		<i class="el-icon-delete2" v-if="disabled" @click="deletes(index)"></i>
    	</div>
    	<i></i>
    </div>
    <div class="uploadBut" v-if="disabled && imgList.length < length" v-loading.body="isLoading">
    	<input type="file" @change="filechange($event)"/>
    	<span v-if="!isLoading">+</span>
    </div>
    <!--//预览图片-->
    <el-dialog v-model="dialogVisible" size="tiny">
      <img v-if="dialog.fragmentType ===1"  width="100%" :src="dialog.newsFileUrl || dialog.photoUrl"/>
      <video v-if="dialog.fragmentType === 2"  width="100%"  controls="controls" :src="dialog.newsFileUrl || dialog.fragmentUrl"></video>
    </el-dialog>
  </div>
</template>
<script>
import { async } from "@/config/fetch";
export default {
  props: {
    value: {
      default: function() {
        return "";
      }
    },
    disabled: {
      default: function() {
        return true;
      }
    },
    length: {
      default: function() {
        return 7;
      }
    },
    type: {
      default: function() {
        return 1; //0 可传图片和视频 1只能传图片  2只能传视频
      }
    },
    fileType: {
      default: function() {
        return "内容"; //
      }
    }
  },
  data() {
    return {
      imgList: [],
      isLoading: false,
      dialogVisible: false,
      dialog: {},
      valueName: ""
    };
  },
  computed: {},
  methods: {
    //删除
    deletes(index) {
      this.imgList.splice(index, 1);
      this.$emit("upload", this.imgList);
    },
    //查看
    preview(data) {
      this.dialog = data;
      this.dialogVisible = true;
    },
    //
    fileAjax(files, state) {
      const _this = this;
      if (typeof FileReader === "undefined") {
        this.$notify.error({
          title: "错误",
          message: "抱歉，你的浏览器不支持 FileReader"
        });
      } else {
        this.isLoading = true;
        var data = new FormData();
        data.append("files", files);
        data.append("valueName", this.fileType);
        var fileUrl = "/newsController/uploadNewsFile.do";
        if (this.type == 1) {
          fileUrl = "/newsController/uploadNewsBanner.do";
        }
        async(fileUrl, data, "FORM", {
          contentType: ""
        })
          .then(data => {
            var red = data.data[0];
            _this.isLoading = false;
            _this.$notify({
              title: "成功",
              message: "上传成功",
              type: "success"
            });
            if (state === 1) {
              if (_this.type == 1) {
                _this.imgList.push({
                  compressPhotoUrlWidth: red.compressPhotoUrlWidth,
                  photoUrlHeight: red.photoUrlHeight,
                  photoUrlWidth: red.photoUrlWidth,
                  photoUrl: red.photoUrl,
                  compressPhotoUrlHeight: red.compressPhotoUrlHeight,
                  compressPhotoUrl: red.compressPhotoUrl,
                  fragmentType: 1
                });
              } else {
                _this.imgList.push({
                  newsFileUrl: red.newsFileUrl,
                  width: red.width,
                  height: red.height,
                  fragmentType: 1
                });
              }
            } else {
              _this.imgList.push({
                newsFileUrl: red.newsFileUrl,
                width: red.width,
                height: red.height,
                fragmentType: 2
              });
            }
            console.log(JSON.parse(JSON.stringify(_this.imgList)));
            _this.$emit("input", _this.imgList);
          })
          .catch(function(err) {
            console.log(err);
            _this.isLoading = false;
            _this.$notify.error({
              title: "错误",
              message: "上传失败"
            });
          });
      }
    },
    //上传图片
    filechange(e) {
      const _this = this;
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return false;
      }
      const patnImg = /\.jpg$|\.jpeg$|\.png$|\.gif$/;
      if (this.type == 1) {
        if (patnImg.test(files[0].name)) {
          this.fileAjax(files[0], 1);
        } else {
          _this.$notify.error({
            title: "错误",
            message: "只能上传jpg、jpeg、png、gif格式图片"
          });
        }
      } else if (this.type == 2) {
        if (/\.mp4$|\.mpeg$|\.3gp$/.test(files[0].name)) {
          this.fileAjax(files[0], 2);
        } else {
          _this.$notify.error({
            title: "错误",
            message: "只能上传mp4、mpeg、3gp格式视频"
          });
        }
      } else {
        if (patnImg.test(files[0].name)) {
          this.fileAjax(files[0], 1);
        } else if (/\.mp4$|\.mpeg$|\.3gp$/.test(files[0].name)) {
          this.fileAjax(files[0], 2);
        } else {
          _this.$notify.error({
            title: "错误",
            message:
              "只能上传jpg、jpeg、png、gif格式图片或mp4、mpeg、3gp格式视频"
          });
        }
      }
    }
  },
  watch: {
    value(val) {
      if (val instanceof Array) {
        this.imgList = val;
      } else {
        if (val) {
          this.imgList = val.split(",");
        }
      }
    }
  },
  mounted() {
    if (this.value instanceof Array) {
      this.imgList = this.value;
    } else {
      if (this.value) {
        this.imgList = this.value.split(",");
      }
    }
  }
};
</script>
<style scoped lang="scss">
.uploadPicture {
  display: flex;
  .uploadBut {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    width: 120px;
    height: 120px;
    cursor: pointer;
    line-height: 120px;
    vertical-align: top;
    font-size: 60px;
    text-align: center;
    color: #999;
    margin-right: 15px;
    position: relative;
    input {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
  .imgList {
    background-color: #fbfdff;
    border-radius: 6px;
    box-sizing: border-box;
    width: 120px;
    height: 120px;
    cursor: pointer;
    line-height: 120px;
    vertical-align: top;
    overflow: hidden;
    position: relative;
    margin-right: 15px;
    box-shadow: 0px 1px 2px 2px #dfdfdf;
    img {
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }
    video {
      width: 120px;
      height: 120px;
    }
    .mask {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      border-radius: 6px;
      transition: all 0.5s;
      text-align: center;

      i {
        color: #fff;
        margin: 0px 5px;
        font-size: 20px;
      }
    }
  }
  .imgList:hover {
    .mask {
      opacity: 1;
    }
  }
}
</style>
