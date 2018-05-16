<template>
  <div class="home">
  	<!--搜索栏-->
  	<z-modular ModClass="homeMod">
			<!--添加-->
  		<div class="search">
  			<el-button type="primary" icon="plus" @click="handleAdd">发布商品</el-button>
  		</div>
  		<!--输入框-->
  		<div class="search input">
  			<el-input type="text" placeholder="请输入商品名称" v-model="commodityName"></el-input>
  		</div>
  		<div class="search input">
  			<el-input type="text" placeholder="请输入商家" v-model="businessName"></el-input>
  		</div>
  		<div class="search input">
  			<el-select v-model="whetherUndercarriage" placeholder="上下架">
					<el-option
						v-for="item in carrageState"
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
					 placeholder="请选择发布时间"
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
		    <el-table-column prop="commodity_name" label="商品名称" width="180"></el-table-column>
		    <el-table-column prop="commodityTypePrice" label="单价（元）" min-width="130" sortable></el-table-column>
		    <el-table-column prop="commodityTypeStock" label="库存" min-width="160" sortable></el-table-column>
		    <el-table-column prop="salesVolume" label="销量" min-width="100" sortable></el-table-column>
		    <el-table-column prop="business_name" label="商家" min-width="100"></el-table-column>
		    <el-table-column prop="commodityTypeRebate" label="返佣（%）" min-width="100"></el-table-column>
        <el-table-column prop="freight" label="运费（元）" min-width="120"></el-table-column>
		    <el-table-column prop="reward" label="奖励（元）" min-width="100"></el-table-column>
		    <el-table-column prop="issueTime" label="发布时间" min-width="130" sortable>
           <template slot-scope="scope">
            {{scope.row.establish_time | format('yyyy-MM-dd hh:mm')}}
		      </template>
        </el-table-column>
		    <el-table-column fixed="right" label="操作" min-width="250">
		      <template slot-scope="scope">
		        <el-button type="primary" size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
		        <el-button type="danger" @click="barcode(scope.$index,scope.row)" size="small">二维码</el-button>
            <el-button type="info" size="small" @click="itemDelete(scope.$index,scope.row.commodity_id)">删除</el-button>
            <el-button v-if="scope.row.whether_undercarriage==2" @click="carrageStatus(scope.$index,scope.row.commodity_id,1)" type="success" size="small">上架</el-button>
            <el-button v-else type="warning" size="small" @click="carrageStatus(scope.$index,scope.row.commodity_id,2)">下架</el-button>
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
    <!-- 二维码弹框 -->
    <el-dialog
        title="商品二维码"
        :visible.sync="dialogVisible"
        width="25%"
        :before-close="handleClose">
        <div class="ewmImg" style="width:25%;">
          <img :src="qrCode" alt="">
        </div>
    </el-dialog>
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
      commodityName: "", //商品名称
      businessName: "", //商家名称
      whetherUndercarriage: "", //是否下架
      conDate: [], //发布时间
      tableData: [],
      carrageState: [
        {
          value: 1,
          label: "上架中"
        },
        {
          value: 2,
          label: "已下架"
        }
      ],
      dialogVisible: false, //二维码弹框状态
      qrCode: "" //二维码地址
    };
  },
  methods: {
    handleClose(done) {
      done();
    },
    //二维码
    barcode(index, row) {
      this.dialogVisible = true;
      this.qrCode = row.qrCode;
    },
    //上架/下架
    carrageStatus(index, commodity_id, carrageType) {
      console.log(this.tableData[index].whether_undercarriage);
      this.tableData[index].whether_undercarriage = carrageType;
      async(
        "/commodityController/commodityUpDown.do",
        {
          commodityId: commodity_id,
          whetherUndercarriage: carrageType
        },
        "POST"
      ).then(data => {
        console.log(data);
      });
    },
    handleAdd() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("发布商品", "/goodsAdd");
    },
    handleEdit(index, row) {
      this.$parent.leftItme("商品编辑", "/goodsDetails/" + row.commodity_id);
      //向编辑修改页面发送数据
      this.$store.commit("id", row.commodity_id);
    },
    //商品删除
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
            "/commodityController/deleteCommodity.do",
            {
              commodityId: comId
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
        "/commodityController/queryCommodity.do",
        {
          rows: pageSize,
          page: pageNo,
          commodityName: this.commodityName,
          whetherUndercarriage: this.whetherUndercarriage,
          businessName: this.businessName,
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
<style lang="less" scoped>
.el-dialog--small {
  width: 25% !important;
}
</style>



