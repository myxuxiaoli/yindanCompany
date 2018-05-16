<template>
  <div class="home">
  	<!--搜索栏-->
     	<z-modular ModClass="homeMod">
      	<div class="search input">
  			<el-input type="text" v-model="userName" placeholder="请输入用户名"></el-input>
  		</div>
			<div class="search input">
				<el-date-picker
					v-model="conDate"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					 placeholder="请选择提现申请时间"
					>
				</el-date-picker>
			</div>
			<!--搜索-->
			<div class="search">
  			<el-button type="primary"  @click="handleCurrentChange(1)">搜索</el-button>
  		</div>
  	</z-modular>
  	<!--表格栏-->
  	<z-modular>
  		<el-table :data="tableData" border style="width: 100%" max-height="700">
		    <el-table-column prop="user_name" label="用户" width="180"></el-table-column>
		    <el-table-column prop="available_price" label="可用余额（元）" min-width="130"></el-table-column>
        <el-table-column prop="apply_money" label="提现金额（元）" min-width="120"></el-table-column>
		    <el-table-column  label="申请时间" min-width="120" sortable>
          <template slot-scope="scope">
            {{scope.row.establish_time | format('yyyy-MM-dd hh:mm')}}
		      </template>
        </el-table-column>
		    <el-table-column fixed="right" label="操作" min-width="120">
		      <template slot-scope="scope">
            <div v-if="scope.row.reflect_type=='AUDIT'">
               <el-button type="primary" @click="passThrough(scope.$index,scope.row)" size="small">通过</el-button>
		           <el-button type="danger"  @click="refuse(scope.$index,scope.row)" size="small">拒绝</el-button>
            </div>
		        <div v-else>
               <el-button v-if="scope.row.reflect_type=='PASS'" type="text" size="small">已通过</el-button>
		           <el-button v-if="scope.row.reflect_type=='NOPASS'" type="text"  size="small">已拒绝</el-button>
               <el-button v-if="scope.row.reflect_type=='COMMIT'" type="text"  size="small">提交审核中</el-button>
               <el-button v-if="scope.row.reflect_type=='SUCCESS'" type="text"  size="small">微信提现成功</el-button>
               <el-button v-if="scope.row.reflect_type=='FAIL'" type="text"  size="small">微信提现失败</el-button>
            </div>
		      </template>
		    </el-table-column>
  		</el-table>
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
      //页面条数
      pageSize: 10,
      //总页数
      page: 1,
      //总条数
      size: 1,
      userName: "", //用户名
      conDate: [], //申请时间
      tableData: [],
      options: []
    };
  },
  methods: {
    handleAdd() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("内容添加", "/contentAdd");
    },
    passThrough(index, row) {
      this.$confirm("确认通过该用户的提现申请吗？", "确认后将不可收回", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          async(
            "/applyReflectController/editApplyReflect.do",
            {
              applyReflectId: row.apply_reflect_id,
              reflectType: "PASS",
              userId: row.user_id,
              token: this.$store.state.userInfo.token,
              userId: this.$store.state.userInfo.userId,
              applyMoney: row.apply_money
            },
            "POST"
          ).then(data => {
            console.log(data);
            if (data.code == 200) {
              this.$message({
                type: "info",
                message: "已通过!"
              });
              row.reflect_type = "PASS";
            } else {
              if (data.status == "FAIL") {
                row.reflect_type = "FAIL";
              }
              if (data.status == "SUCCESS") {
                row.reflect_type = "SUCCESS";
              }
              if (data.status == "COMMIT") {
                row.reflect_type = "COMMIT";
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消!"
          });
        });
    },
    refuse(index, row) {
      this.$prompt("请输入拒绝原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          async(
            "/applyReflectController/editApplyReflect.do",
            {
              applyReflectId: row.apply_reflect_id,
              reflectType: "NOPASS",
              refuseReason: value,
              userId: row.user_id,
              token: this.$store.state.userInfo.token,
              userId: this.$store.state.userInfo.userId,
              applyMoney: row.apply_money
            },
            "POST"
          ).then(data => {
            console.log(data);
            if (data.code == 200) {
              this.$message({
                type: "info",
                message: "已拒绝!"
              });
              row.reflect_type = "NOPASS";
            } else {
              this.$message({
                type: "info",
                message: data.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消!"
          });
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
      async(
        "/applyReflectController/ queryApplyReflect.do",
        {
          rows: pageSize,
          page: pageNo,
          userName: this.userName,
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
