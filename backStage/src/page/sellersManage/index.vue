<template>
  <div class="home">
  	<!--搜索栏-->
  	<z-modular ModClass="homeMod">
			<!--添加-->
  		<div class="search">
  			<el-button type="primary" icon="plus" @click="handleAdd">添加商家</el-button>
  		</div>
      <!--输入框-->
  		<div class="search input">
  			<el-input type="text" v-model="businessName" placeholder="请输入商家"></el-input>
  		</div>
  		<div class="search input">
  			 <el-cascader
         placeholder="请选择商家所在城市"
          expand-trigger="hover"
          :options="cities"
          v-model="selectedOptions"
          @change="handleChange">
         </el-cascader>
  		</div>
			<div class="search input">
				<el-date-picker
					v-model="conDate"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					placeholder="请选择入驻时间"
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
		    <el-table-column prop="business_name" label="名称" width="180"></el-table-column>
		    <el-table-column prop="business_city" label="城市" min-width="130"></el-table-column>
		    <el-table-column prop="contact_number" label="联系电话" min-width="160" sortable></el-table-column>
		    <el-table-column prop="business_rebate" label="返佣（%）" min-width="120"></el-table-column>
		    <el-table-column prop="count" label="订单数" min-width="100" sortable></el-table-column>
		    <el-table-column prop="price" label="成交额（元）" min-width="100" sortable></el-table-column>
        <el-table-column  label="入驻时间" min-width="160" sortable>
          <template slot-scope="scope">
            {{scope.row.establish_time | format('yyyy-MM-dd hh:mm')}}
		      </template>
        </el-table-column>
		    <el-table-column fixed="right" label="操作" min-width="200">
		      <template slot-scope="scope">
		        <el-button type="primary" size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
		        <el-button type="danger" size="small"  @click="itemDelete(scope.$index,scope.row.business_id)">删除</el-button>
            <el-button v-if="scope.row.whether_disable==2" @click="carrageStatus(scope.$index,scope.row.business_id,1)" type="warning" size="small">启用</el-button>
            <el-button v-else type="info" size="small" @click="carrageStatus(scope.$index,scope.row.business_id,2)">禁用</el-button>
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
      businessName: "", //商家名称
      conDate: [],
      tableData: [],
      cities: [],
      selectedOptions: ["", ""],
      value2: ""
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
    handleAdd() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("添加商家", "/sellersManageAdd");
    },
    //启用/禁用
    carrageStatus(index, business_id, whether_disable) {
      console.log(this.tableData[index].whether_disable);
      this.tableData[index].whether_disable = whether_disable;
      async(
        "/businessController/updateBusiness.do",
        {
          businessId: business_id,
          whetherDisable: whether_disable
        },
        "POST"
      ).then(data => {
        console.log(data);
      });
    },
    //商家删除
    itemDelete(index, comId) {
      const _this = this;
      this.$confirm("确定删除这条内容吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.size = this.tableData.total;
          console.log(this.tableData);
          async(
            "/businessController/deleteBusiness.do",
            {
              businessId: comId
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
    handleEdit(index, row) {
      //跳转到商品修改页面，并且刷新不储存
      this.$parent.leftItme(
        "商家编辑",
        "/sellersManageEdit/" + row.business_id
      );
      //向商品修改页面发送数据
      this.$store.commit("id", row.business_id);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageData(this.pageNo, val);
    },
    handleCurrentChange(val) {
      console.log(this.selectedOptions);
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
        "/businessController/queryBusiness.do",
        {
          rows: pageSize,
          page: pageNo,
          businessName: this.businessName,
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
