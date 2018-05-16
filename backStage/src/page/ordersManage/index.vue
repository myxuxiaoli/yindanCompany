<template>
  <div class="home">
  	<!--搜索栏-->
  	<z-modular ModClass="homeMod">
  		<!--输入框-->
  		<div class="search input">
  			<el-input type="text" v-model="orderNumber" placeholder="请输入订单号"></el-input>
  		</div>
  		<div class="search input">
  			<el-input type="text" v-model="commodityName" placeholder="请输入商品名称"></el-input>
  		</div>
      <div class="search input">
  			<el-input type="text" v-model="userName" placeholder="请输入下单人"></el-input>
  		</div>
       <div class="search input">
  			<el-input type="text" v-model="businessName" placeholder="请输入商家"></el-input>
  		</div>
      	<div class="search input">
  			<el-select v-model="orderTypeval" placeholder="订单状态">
					<el-option
						v-for="item in orderType"
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
					 placeholder="下单时间"
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
		    <el-table-column prop="order_number" label="订单号" width="180"></el-table-column>
		    <el-table-column prop="order_type" label="订单状态" min-width="100"></el-table-column>
		    <el-table-column prop="commodity_name" label="商品名称" min-width="160"></el-table-column>
		    <el-table-column prop="price" label="金额（元）" min-width="100" sortable></el-table-column>
		    <el-table-column prop="business_name" label="商家" min-width="100"></el-table-column>
		    <el-table-column prop="user_name" label="下单人" min-width="100"></el-table-column>
		    <el-table-column label="下单时间" min-width="140" sortable>
					<template slot-scope="scope">
            {{scope.row.establish_time | format('yyyy-MM-dd hh:mm')}}
		      </template>
				</el-table-column>
		    <el-table-column label="支付时间" min-width="140" sortable>
					<template slot-scope="scope">
            {{scope.row.purchase_time | format('yyyy-MM-dd hh:mm')}}
		      </template>
				</el-table-column>
		    <el-table-column fixed="right" label="操作" min-width="200">
		      <template slot-scope="scope">
		        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
		        <el-button @click="LogisticsInfo(scope.$index,scope.row)" v-if="scope.row.order_type=='待收货' || scope.row.order_type=='已完成' ||scope.row.order_type=='待评价'" type="warning" size="small">物流</el-button>
		        <el-button @click="showRefund(scope.$index,scope.row)" v-if="scope.row.order_type=='申请退款中' ||scope.row.order_type=='待评价' ||scope.row.order_type=='待发货'" type="danger" size="small">退款</el-button>
            <el-button  @click="showDelivery(scope.$index,scope.row)" v-if="scope.row.order_type=='待发货'" type="primary" size="small">发货</el-button>
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
    <!-- 发货弹框 -->
      <el-dialog title="发货提醒" :visible.sync="dialogFormVisible1">
        <el-form>
          <el-form-item label="快递单号" :label-width="formLabelWidth">
            <el-input v-model="deliveryNum" auto-complete="off" placeholder="请输入快递单号"></el-input>
          </el-form-item>
          <el-form-item label="快递类型" :label-width="formLabelWidth">
            <el-select v-model="deliveryVal" placeholder="请选择快递类型">
                <el-option
                  v-for="item in expressDelivery"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="toDelivery">发  货</el-button>
        </div>
      </el-dialog>
      <!-- 物流弹框 -->
      <el-dialog
          title="物  流  信  息"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
          <div class="logisticsInfos">
            <div class="logisticsInfosTop">
              <p>快递类型：<span>{{LogisticsInfoObj.expressDeliveryName}}</span></p>
              <p>快递单号：<span>{{LogisticsInfoObj.expressDeliveryNo}}</span></p>
            </div>
            <ul>
              <li v-for="item3 in LogisticsInfoObj.info">
                <div class="littleInfo">{{item3.acceptStation}}</div>
                <p class="infoDate">{{item3.acceptTime}}</p>
              </li>
            </ul>
          </div>
      </el-dialog>
      <!-- 退款弹框 -->
       <el-dialog
          title="退  款  申  请"
          :visible.sync="dialogVisible2"
          width="30%"
          :before-close="handleClose">
          <div class="refundInfo">
            <div class="refundInfoTop">
              <p>申请时间：<span>{{applyTime | format('yyyy-MM-dd hh:mm')}}</span></p>
              <p>申请理由：<span>{{applyMsg}}</span></p>
            </div>
            <div class="rufundBottom">
              <p>支付金额（元）：{{haveDone}}</p>
              <p><label>退款金额（元）</label>：<input type="number" v-model="refundMoney"></p>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="toRefund('NOPASS')">拒绝退款</el-button>
            <el-button type="primary" @click="toRefund('PASS')">确认退款</el-button>
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
      userName: "", //下单人
      commodityName: "", //商品名称
      businessName: "", //商家名称
      orderNumber: "", //订单号
      tableData: [],
      //订单状态数组
      orderType: [
        {
          value: 1,
          label: "待付款"
        },
        {
          value: 2,
          label: "待发货"
        },
        {
          value: 3,
          label: "待收货"
        },
        {
          value: 4,
          label: "申请退款中"
        },
        {
          value: 5,
          label: "已取消"
        },
        {
          value: 6,
          label: "已完成"
        }
      ],
      orderTypeval: "", //订单状态值
      conDate: [], //下单时间
      expressDelivery: [], //所有快递
      deliveryVal: "", //快递类型值
      deliveryNum: "", //快递单号
      dialogFormVisible1: false,
      dialogVisible2: false,
      dialogVisible: false,
      diveryNum: false, //发货时这个订单的ID
      LogisticsInfoObj: "", //物流信息
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      refundNum: "", //退款金额
      applyTime: "", //申请退款时间
      applyMsg: "", //申请退款理由
      haveDone: "", //已支付金额
      refundMoney: "", //退款金额
      applyIndex: false, //退款时这条信息的index
      orderNum: false //退款时这个订单的订单ID
    };
  },
  methods: {
    //弹出退款框
    showRefund(index, row) {
      this.dialogVisible2 = true;
      this.applyTime = row.apply_return_goods_time;
      this.applyMsg = row.refund_msg;
      this.haveDone = row.price;
      this.applyIndex = index;
      this.orderNum = row.my_order_id;
    },
    //确认退款
    toRefund(status) {
      const _this = this;
      var data = new FormData();
      data.append("myOrderId", this.orderNum);
      data.append("refundStatus", status);
      data.append("money", this.refundMoney);
      data.append("refundReson", "");
      data.append("token", this.$store.state.userInfo.token);
      data.append("userId", this.$store.state.userInfo.userId);
      if (this.refundMoney > this.haveDone) {
        _this.$notify.error({
          title: "退款失败",
          message: "退款金额不能超过支付金额"
        });
      } else {
        async("/myorderController/updateTKMyorder.do", data, "FORM", {
          contentType: ""
        })
          .then(data => {
            if (data.code == 200) {
              _this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success"
              });
              this.diveryNum = false;
              this.dialogVisible2 = false;
              this.tableData[this.applyIndex].order_type = "已取消";
              this.applyIndex = false;
            } else {
              _this.$notify.error({
                title: "操作失败",
                message: data.msg
              });
              this.dialogVisible2 = false;
            }
          })
          .catch(function(err) {
            console.log(err);
            _this.$notify.error({
              title: "错误",
              message: "发货失败"
            });
          });
      }
    },
    //关闭物流信息弹框
    handleClose(done) {
      done();
    },
    //物流信息
    LogisticsInfo(index, row) {
      async(
        "/myorderController/queryMyorderLogistics.do",
        {
          expressDeliveryName: row.express_delivery_name,
          expressDeliveryNo: row.express_delivery_no,
          myOrderId: row.my_order_id
        },
        "POST"
      ).then(data => {
        console.log(data);
        if (data.code == 200) {
          this.dialogVisible = true;
          this.LogisticsInfoObj = data;
          this.LogisticsInfoObj.info.reverse();
        }
      });
    },
    //所有快递查询
    allDeliveries() {
      const _this = this;
      async("/logisticsController/queryAllInfo.do")
        .then(data => {
          console.log(data);
          if (data != undefined && data.length != 0) {
            this.expressDelivery = data;
          }
        })
        .catch(err => {
          console.log(err);
          _this.$notify.error({
            title: "错误",
            message: "加载失败！"
          });
        });
    },
    handleEdit(index, row) {
      this.$parent.leftItme("订单详情", "/ordersDetails/" + row.my_order_id);
      //向编辑修改页面发送数据
      this.$store.commit("id", row.my_order_id);
    },
    //弹出发货框
    showDelivery(index, row) {
      this.dialogFormVisible1 = true;
      this.diveryNum = row.my_order_id;
    },
    //确认发货
    toDelivery() {
      const _this = this;
      var data = new FormData();
      console.log(
        this.diveryNum + "...." + this.deliveryNum + "...." + this.deliveryVal
      );
      data.append("myOrderId", this.diveryNum);
      data.append("expressDeliveryNo", this.deliveryNum);
      data.append("expressDeliveryName", this.deliveryVal);
      data.append("token", this.$store.state.userInfo.token);
      data.append("userId", this.$store.state.userInfo.userId);
      async("/myorderController/updateDeliveryMyorder.do", data, "FORM", {
        contentType: ""
      })
        .then(data => {
          if (data.code == 200) {
            _this.$notify({
              title: "成功",
              message: "发货成功",
              type: "success"
            });
            this.diveryNum = false;
            this.dialogFormVisible1 = false;
            this.pageData(this.pageNo, this.pageSize);
          }
        })
        .catch(function(err) {
          console.log(err);
          _this.$notify.error({
            title: "错误",
            message: "发货失败"
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
        "/myorderController/queryMyorder.do",
        {
          rows: pageSize,
          page: pageNo,
          queryEstablishTime: queryEstablishTime,
          userName: this.userName,
          commodityName: this.commodityName,
          businessName: this.businessName,
          orderType: this.orderTypeval,
          orderNumber: this.orderNumber
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
    this.allDeliveries();
    this.pageData(this.pageNo, this.pageSize);
  }
};
</script>
<style lang="less" scoped>
.logisticsInfos {
  .logisticsInfosTop {
    margin-bottom: 25px;
    p {
      font-size: 18px;
      font-weight: 550;
      margin-bottom: 10px;
      span {
        font-weight: normal;
        font-size: 18px;
        color: #666;
      }
    }
  }
  ul {
    li {
      margin-bottom: 15px;
      border-bottom: 1px solid #e6e6e6;
      padding-bottom: 8px;
      &:first-child {
        .littleInfo {
          color: #66cd00;
        }
        .infoDate {
          color: #66cd00;
        }
      }
      .littleInfo {
        font-size: 16px;
        margin-bottom: 5px;
      }
      .infoDate {
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
}
.refundInfo {
  .refundInfoTop {
    border-bottom: 1px solid #e6e6e6;
    p {
      font-size: 16px;
      margin-bottom: 10px;
    }
    margin-bottom: 10px;
  }
  .rufundBottom {
    p {
      font-size: 16px;
      margin-bottom: 10px;
      input {
        border: 1px solid #ccc;
        width: 100px;
        height: 25px;
      }
    }
  }
}
</style>

