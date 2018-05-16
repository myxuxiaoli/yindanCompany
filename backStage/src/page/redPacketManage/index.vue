<template>
  <div class="home">
  	<!--搜索栏-->
  	<z-modular ModClass="homeMod">
			<!--添加-->
  		<div class="search">
  			<el-button type="primary" icon="plus" @click="handleAdd">创建红包</el-button>
  		</div>
  		<div class="search input">
  			<el-input type="text" placeholder="请输入创建人"></el-input>
  		</div>
			<div class="search input">
				<el-date-picker
					v-model="conDate"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					 placeholder="请选择创建时间"
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
        <el-table-column prop="redEnvelopesName" label="红包名称" min-width="120"></el-table-column>
        <el-table-column prop="userName" label="发布人" min-width="120"></el-table-column>
		    <el-table-column prop="redEnvelopesPrice" label="金额（元）" width="180" sortable></el-table-column>
		    <el-table-column prop="redEnvelopesNumber" label="数量" min-width="130" sortable></el-table-column>
		    <el-table-column label="开抢时间" min-width="160" sortable>
          <template slot-scope="scope">
            {{scope.row.startTime | format('yyyy-MM-dd hh:mm')}}
		      </template>
        </el-table-column>
		    <el-table-column prop="number" label="剩余数量" min-width="100" sortable></el-table-column>
		    <el-table-column label="发布时间" min-width="160" sortable>
           <template slot-scope="scope">
            {{scope.row.establishTime | format('yyyy-MM-dd hh:mm')}}
		      </template>
        </el-table-column>
		    <el-table-column fixed="right" label="操作" min-width="200">
		      <template slot-scope="scope">
		        <el-button v-if="scope.row.isDetail==1" type="primary" size="small" @click="detailsPage(scope.$index, scope.row)">详情</el-button>
            <el-button v-else type="info" size="small"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="scope.row.hideType==1" @click="closePedPacket(scope.$index,scope.row.redEnvelopesId,2)" type="danger" size="small" >关闭</el-button>
            <el-button v-else type="success" @click="closePedPacket(scope.$index,scope.row.redEnvelopesId,1)" size="small" >开启</el-button>
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
      userName: "", //创建人
      //创建时间
      conDate: [],
      tableData: [],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      value2: "",
      value3: ""
    };
  },
  methods: {
    handleAdd() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("创建红包", "/redPacketAdd");
    },
    handleEdit(index, row) {
      console.log(row.redEnvelopesId);
      //跳转到商品修改页面，并且刷新不储存
      this.$parent.leftItme("编辑红包", "/redPacketEdit/" + row.redEnvelopesId);
      //向商品修改页面发送数据
      this.$store.commit("id", row.redEnvelopesId);
    },
    closePedPacket(index, redEnvelopesId, hideType) {
      console.log(this.tableData[index].hideType);
      this.tableData[index].hideType = hideType;
      async(
        "/redEnvelopesController/hidetypeRedEnvelopes.do",
        {
          redEnvelopesId: redEnvelopesId,
          hideType: hideType
        },
        "POST"
      ).then(data => {
        console.log(data);
      });
    },
    detailsPage(index, row) {
      console.log(row.redEnvelopesId);
      //跳转到商品修改页面，并且刷新不储存
      this.$parent.leftItme(
        "红包详情",
        "/redPacketDetails/" + row.redEnvelopesId
      );
      //向商品修改页面发送数据
      this.$store.commit("id", row.redEnvelopesId);
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
        "/redEnvelopesController/queryRedEnvelopes.do",
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
