<template>
  <div class="home">
  	<!--搜索栏-->
  	<z-modular ModClass="homeMod">
			<!--添加-->
  		<div class="search">
  			<el-button type="primary" icon="plus" @click="handleAdd">添加版本</el-button>
  		</div>
  		<div class="search input">
  			<el-input type="text" placeholder="请输入版本号"></el-input>
  		</div>
			<!--搜索-->
		<div class="search">
  			<el-button type="primary"  @click="handleCurrentChange(1)">搜索</el-button>
  		</div>
  	</z-modular>
  	
  	<!--表格栏-->
  	<z-modular>
  		<el-table :data="tableData" border style="width: 100%" max-height="700">
            <el-table-column prop="version" label="版本号" min-width="80"></el-table-column>
            <el-table-column  label="版本类型" min-width="80">
                <template slot-scope="scope">
                    {{scope.row.versionType==1?"一般更新":scope.row.versionType==2?"重要更新":"强制更新"}}
                </template>
            </el-table-column>
            <el-table-column  label="手机类型" min-width="80">
                <template slot-scope="scope">
                    {{scope.row.machineType==1?"IOS":"Android"}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" min-width="120">
                <template slot-scope="scope">
                    {{scope.row.establishTime | format('yyyy-MM-dd hh:mm')}}
		        </template>
            </el-table-column>
            <el-table-column prop="versionIntroduce" label="版本介绍" min-width="180"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="200">
		        <template slot-scope="scope">
                    <el-button  type="primary" size="small" @click="detailsPage(scope.$index, scope.row)">详情</el-button>
                    <el-button type="info" size="small"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
      version: "", //版本号
      tableData: []
    };
  },
  methods: {
    handleAdd() {
      //跳转到商品添加页面，并且刷新会储存
      this.$parent.leftItme("添加版本", "/versionAdd");
    },
    handleEdit(index, row) {
      console.log(row.versionControlId);
      //跳转到商品修改页面，并且刷新不储存
      this.$parent.leftItme("编辑版本", "/versionEdit/" + row.versionControlId);
      //向商品修改页面发送数据
      this.$store.commit("id", row.versionControlId);
    },
    detailsPage(index, row) {
      console.log(row.redEnvelopesId);
      //跳转到商品修改页面，并且刷新不储存
      this.$parent.leftItme(
        "红包详情",
        "/versionDetail/" + row.versionControlId
      );
      //向商品修改页面发送数据
      this.$store.commit("id", row.versionControlId);
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
      async(
        "/versionControlController/queryAllInfo.do",
        {
          rows: pageSize,
          page: pageNo,
          version: this.version
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