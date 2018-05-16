<template>
  <div class="home">
  	<!--搜索栏-->
  	<z-modular ModClass="homeMod">
			<!--添加-->
  		<div class="search">
  			<el-button type="primary" icon="plus" @click="handleAdd">发布内容</el-button>
  		</div>
  		<!--输入框-->
  		<div class="search input">
  			<el-input type="text" placeholder="请输入标题" v-model="conTitle"></el-input>
  		</div>
  		<div class="search input">
  			<el-select v-model="plateVal" placeholder="请选择板块">
                            <el-option
                                v-for="item in plateType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
  		</div>
  		<div class="search input">
  			<el-input type="text" placeholder="请输入发布人" v-model="conPerson"></el-input>
  		</div>
			<div class="search input">
				<el-date-picker
					v-model="conDate"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					 placeholder="请选择发布时间"
					>
				</el-date-picker>
			</div>
			<!--搜索-->
			<div class="search">
  			<el-button type="primary" @click="handleCurrentChange(1)">搜索</el-button>
  		</div>
  	</z-modular>
  	
  	<!--表格栏-->
  	<z-modular>
  		<el-table :data="tableData" border style="width: 100%" max-height="700">
		    <el-table-column prop="news_title" label="标题" width="180"></el-table-column>
		    <el-table-column label="板块" min-width="80">
          <template slot-scope="scope">
            {{scope.row.news_plate == "2" ? "养生堂" : scope.row.news_plate =="3" ? "活动" :"看世界"}}
		      </template>
        </el-table-column>
		    <el-table-column label="发布时间" min-width="170" sortable>
          <template slot-scope="scope">
            {{scope.row.establish_time | format('yyyy-MM-dd hh:mm')}}
		      </template>
        </el-table-column>
		    <el-table-column prop="userName" label="发布人" min-width="100"></el-table-column>
		    <el-table-column prop="seeCount" label="查看数" min-width="100" sortable></el-table-column>
		    <el-table-column prop="commentCount" label="评论数" min-width="100" sortable></el-table-column>
		    <el-table-column fixed="right" label="操作" min-width="200">
		      <template slot-scope="scope">
		        <el-button type="primary" @click="contentEdit(scope.$index, scope.row)" size="small">编辑</el-button>
		        <el-button type="danger" @click="contentDelete(scope.$index, scope.row.news_id)" size="small">删除</el-button>
            <el-button v-if="scope.row.hide_type==1" type="primary" @click="displayStatus(scope.$index,scope.row.news_id,2)" size="small">隐藏</el-button>
            <el-button v-else type="warning" @click="displayStatus(scope.$index,scope.row.news_id,1)" size="small">显示</el-button>
		      </template>
		    </el-table-column>
  		</el-table>
      <div>

 </div>

  		<!--分页-->
  		<div class="paginationdiv">
  			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="pageNo"
		      :page-sizes="[10, 20, 30, 50]"
		      :page-size="pageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="size">
		    </el-pagination>
  		</div>
  	</z-modular>

  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { async } from "@/config/fetch";
export default {
  computed: {
    ...mapState(["userInfo"])
  },
  data() {
    return {
      //当前页数
      pageNo: 1,
      hide_type: 1,
      //页面条数
      pageSize: 10,
      //总页数
      page: 1,
      //总条数
      size: 1,
      //标题
      conTitle: "",
      //板块
      plateVal: "",
      //发布人
      conPerson: "",
      //时间
      conDate: [],
      tableData: [],
      plateType: [
        {
          value: 1,
          label: "看世界"
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
  methods: {
    //发布内容
    handleAdd() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("发布内容", "/contentAdd");
    },
    //删除内容
    contentDelete(index, news_id) {
      const _this = this;
      console.log(index);
      this.$confirm("确定删除这条内容吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData.splice(index, 1);
          console.log(this.tableData);
          async(
            "/newsController/deleteNews.do",
            {
              newsId: news_id
            },
            "POST"
          ).then(data => {
            if (data.code == 200) {
              _this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.userPopover = false;
        });
    },
    //编辑内容
    contentEdit(index, row) {
      console.log(index + "----" + row);
      this.$parent.leftItme("编辑内容", "/contentEdit/" + row.news_id);
      //向编辑修改页面发送数据
      this.$store.commit("id", row.news_id);
    },
    //隐藏/展示内容
    displayStatus(index, news_id, hide_type) {
      console.log(this.tableData[index].hide_type);
      async(
        "/newsController/editNewsHide.do",
        {
          newsId: news_id,
          hideType: hide_type
        },
        "POST"
      ).then(data => {
        console.log(data);
        if (data.code == 200) {
          this.tableData[index].hide_type = hide_type;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageData(this.pageNo, val);
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.pageData(val, this.pageSize);
    },
    pageData(pageNo, pageSize) {
      const _this = this;
      var queryEstablishTime = "";
      if (this.conDate.length > 0) {
        queryEstablishTime = JSON.stringify({
          start: this.conDate[0].getTime(),
          end: this.conDate[1].getTime()
        });
      }
      console.log(this.conTitle, this.plateVal, this.conPerson, this.conDate);
      async(
        "/newsController/querNews.do",
        {
          rows: pageSize,
          page: pageNo,
          newsTitle: this.conTitle,
          newsPlate: this.plateVal,
          userName: this.conPerson,
          queryEstablishTime: queryEstablishTime
        },
        "POST"
      )
        .then(data => {
          console.log(data);
          this.tableData = data.rows;
          this.size = data.total;
        })
        .catch(err => {
          console.log(err);
          _this.$notify.error({
            title: "错误",
            message: "加载失败！"
          });
        });
    }
  },
  mounted() {
    this.pageData(this.pageNo, this.pageSize);
  }
};
</script>

