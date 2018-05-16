<template>
  <div class="container">
      <div class="info">
          <p class="infoTitle">订单信息</p>
          <div class="infos" v-if="myorderInfo!=null">
              <div class="left">
                <ul>
                    <li>订单号：{{myorderInfo.orderNumber}}</li>
                    <li>下单时间：{{myorderInfo.establishTime | format('yyyy-MM-dd hh:mm')}}
                    </li>
                    <li>发货时间：{{myorderInfo.deliverGoodsTime | format('yyyy-MM-dd hh:mm')}}</li>
                    <li>申请退款：{{myorderInfo.applyReturnGoodsTime| format('yyyy-MM-dd hh:mm')}}</li>
                </ul>
             </div>
             <div class="right">
                <ul>
                    <li>订单状态：{{myorderInfo.orderTypeName}}</li>
                    <li>付款时间：{{myorderInfo.purchaseTime| format('yyyy-MM-dd hh:mm')}}</li>
                    <li>收货时间：{{myorderInfo.collectGoodsTime| format('yyyy-MM-dd hh:mm')}}</li>
                    <li>退款时间：{{myorderInfo.collectReturnGoodsTime| format('yyyy-MM-dd hh:mm')}}</li>
                </ul>
             </div>
          </div>
      </div>
      <div class="info">
          <p class="infoTitle">商家信息</p>
          <div class="infos" v-if="buInfo!=null">
              <div class="left">
                    <div class="infoImg">
                        <img :src="buInfo.url" alt="">
                    </div>
                    <div class="business">{{buInfo.businessName}}</div>
             </div>
             <div class="right">
                <div class="phone">
                    联系电话：{{buInfo.contactNumber}}
                </div>
             </div>
          </div>
      </div>
       <div class="info">
          <p class="infoTitle">商品信息</p>
          <div v-for="item2 in odList">
              <div class="Businessinfo">
                <div class="top" v-if="item2.cdInfo!=null">
                    <div class="divImg">
                        <img :src="item2.cdInfo.commodityCoverUrl" alt="">
                    </div>
                    <div class="divText">{{item2.cdInfo.commodityName}}</div>
                </div>
                <div class="center" v-if="item2.cdtInfo!=null">
                    <div class="cenItem">种类：{{item2.cdtInfo.commodityTypeName}}</div>
                    <div class="cenItem">价格：￥{{item2.cdtInfo.commodityTypePrice}}</div>
                    <div class="cenItem">数量：{{item2.orderCount}}</div>
                    <div class="cenItem">运费：￥{{item2.cdtInfo.freight}}</div>
                </div>
              </div>
          </div>
          <div class="bottom">合计：￥{{countMoney}}</div>
      </div>
      <div class="info">
          <p class="infoTitle">用户信息</p>
          <div class="infos" v-if="userInfo!=null">
              <div class="left">
                    <div class="infoImg">
                        <img :src="userInfo.userHeadPortrait">
                    </div>
                    <div class="business">{{userInfo.userName}}</div>
             </div>
             <div class="right">
                <div class="phone">
                    联系电话：{{userInfo.userPhone}}
                </div>
             </div>
          </div>
      </div>
      <div class="info">
          <p class="infoTitle">收货信息</p>
          <div class="getInfo" v-if="addressInfo!=null">
                <p>收货人：{{addressInfo.name}}</p>
                <p>联系电话：{{addressInfo.phone}}</p>
                <p>收货地址：{{addressInfo.region}}{{addressInfo.detailedAddress}}</p>
                <p v-if="myorderInfo.goodsReceiptType==1">收货类型：线下自提</p>
          </div>
      </div>
       <div class="info">
          <p class="infoTitle">用户留言</p>
          <div class="getInfo">
                <p v-if="remarks">{{remarks}}</p>
          </div>
      </div>
  </div>
</template>
<script>
import { async } from "@/config/fetch";
export default {
  data() {
    return {
      myorderInfo: "", //订单信息
      addressInfo: "", //收货信息
      userInfo: "", //用户信息
      buInfo: "", //商家信息
      odList: "",
      remarks: "", //用户留言
      countMoney: "" //订单合计
    };
  },
  methods: {
    pageData() {
      const _this = this;
      async(
        "/myorderController/queryMyorderDetails.do",
        {
          myOrderId: this.$route.params.id
        },
        "POST"
      )
        .then(data => {
          console.log(data);
          if (data.code == 200) {
            this.myorderInfo = data.myorderInfo;
            this.addressInfo = data.addressInfo;
            this.userInfo = data.userInfo;
            this.buInfo = data.buInfo;
            this.odList = data.odList;
            this.remarks = data.remarks;
            this.countMoney = data.countMoney;
          }
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
    this.pageData();
  }
};
</script>
<style lang="less" scoped>
.container {
  padding: 0px 25px 25px 25px;
  background-color: #fff;
  .info {
    .infoTitle {
      border-bottom: 1px solid #ccc;
      height: 50px;
      font-size: 18px;
      font-weight: 550;
      line-height: 30px;
      margin-bottom: 15px;
      padding-top: 15px;
    }
    .infos {
      margin-top: 10px;
      padding-left: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      ul {
        li {
          height: 30px;
          line-height: 30px;
        }
      }
      .left {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        .infoImg {
          flex: 1;
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
          }
        }
        .business {
          flex: 8;
        }
      }
      .right {
        flex: 1;
      }
    }
    .Businessinfo {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      padding-left: 15px;
      .top {
        flex: 3;
        display: flex;
        flex-direction: row;
        align-items: center;
        .divImg {
          flex: 1;
          img {
            width: 60px;
            height: 60px;
          }
        }
        .divText {
          flex: 16;
        }
      }
      .center {
        flex: 2;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        .cenItem {
          flex: 1;
        }
      }
    }
    .bottom {
      padding-left: 15px;
      margin-top: 10px;
    }
    .getInfo {
      padding-left: 15px;
      p {
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
</style>


