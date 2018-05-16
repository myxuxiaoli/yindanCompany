<template>
  <div class="home">
  	<!--搜索栏-->
  	<z-modular ModClass="homeMod">
  		<!--输入框-->
  		<div class="search input">
  			<el-input type="text" v-model="userName" placeholder="昵称"></el-input>
  		</div>
  		  
      <div class="search input">
        <el-select v-model="registrationval" placeholder="注册方式">
          <el-option
            v-for="item in registration"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
			<div class="search input">
				<el-date-picker
					v-model="conDate"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					 placeholder="注册时间"
					>
				</el-date-picker>
			</div>
      <div class="search input">
         <el-cascader
            placeholder="请选择城市"
            expand-trigger="hover"
            :options="cities"
            v-model="selectedOptions"
            @change="handleChange">
         </el-cascader>
      </div>
			<!--搜索-->
			<div class="search">
  			<el-button type="primary" @click="handleCurrentChange(1)">搜索</el-button>
  		</div>
  	</z-modular>
  	
  	<!--表格栏-->
  	<z-modular>
  		<el-table :data="tableData" border style="width: 100%" max-height="700">
		    <el-table-column prop="userId" label="用户ID" width="120"></el-table-column>
		    <el-table-column prop="userName" label="昵称" min-width="120" sortable></el-table-column>
		    <el-table-column prop="city" label="位置" min-width="120" sortable></el-table-column>
		    <el-table-column prop="number" label="邀请数人数" min-width="120"></el-table-column>
		    <el-table-column prop="moeny" label="奖励金（元）" min-width="100" sortable></el-table-column>
		    <el-table-column prop="count" label="订单数" min-width="100"></el-table-column>
		    <el-table-column prop="price" label="成交金额（元）" min-width="100"></el-table-column>
		    <el-table-column prop="registration" label="注册方式" min-width="100"></el-table-column>
		    <el-table-column label="注册时间" min-width="160" sortable>
            <template slot-scope="scope">
              {{scope.row.establishTime | format('yyyy-MM-dd hh:mm')}}
		        </template>
        </el-table-column>
		    <el-table-column fixed="right" label="操作" min-width="100">
		      <template slot-scope="scope">
		        <el-button v-if="scope.row.whetherDisable==2" type="primary" size="small" @click="carrageStatus(scope.$index,scope.row.userId,1)">禁用</el-button>
		        <el-button v-else type="warning" size="small" @click="carrageStatus(scope.$index,scope.row.userId,2)">启用</el-button>
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
      userName: "", //昵称
      tableData: [],
      conDate: [],
      selectedOptions: ["", ""], //省份城市id数组
      cities: [],
      registrationval: "",
      registration: [
        {
          value: 1,
          label: "手机"
        },
        {
          value: 2,
          label: "微信"
        }
      ],
      value: "",
      value2: "",
      value3: ""
    };
  },
  methods: {
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
    //启用/禁用
    carrageStatus(index, business_id, whetherDisable) {
      console.log(this.tableData[index].whetherDisable);
      async(
        "/userController/updateUserDisable.do",
        {
          userId: business_id,
          whetherDisable: whetherDisable
        },
        "POST"
      ).then(data => {
        console.log(data);
        if (data.code == 200) {
          this.tableData[index].whetherDisable = whetherDisable;
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
      console.log(this.cities);
      const _this = this;
      var queryEstablishTime = "";
      if (this.conDate.length > 0) {
        queryEstablishTime = JSON.stringify({
          start: this.conDate[0].getTime(),
          end: this.conDate[1].getTime()
        });
      }
      if (this.selectedOptions == undefined) {
        this.selectedOptions = ["", ""];
      }
      async(
        "/userController/queryUser.do",
        {
          rows: pageSize,
          page: pageNo,
          userName: this.userName,
          registration: this.registrationval,
          queryEstablishTime: queryEstablishTime,
          provinces: this.selectedOptions[0],
          city: this.selectedOptions[1]
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
    this.provice();
    this.pageData(this.pageNo, this.pageSize);
  }
};
</script>
<style scoped>
.el-button {
  margin-left: 5px;
  float: left;
}
</style>
