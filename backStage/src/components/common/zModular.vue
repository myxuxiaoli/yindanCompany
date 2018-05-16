<template>
  <div class="zModular" :style={width:width}>
  	<div class="title" v-if="title">{{title}}</div>
  	<div :class="[ModClass ? ModClass : 'content']">
  		<slot></slot>
  	</div>
  </div>
</template>
<script>
export default {
  props: {
    ModClass: {
      default: function() {
        return "";
      }
    },
    title: {
      default: function() {
        return "";
      }
    },
    width: {
      default: function() {
        return "initial";
      }
    }
  }
};
</script>
<style scoped>
.zModular {
  background: #fff;
  box-shadow: 1px 1px 2px 0 #cccccc;
  border-radius: 3px;
  box-sizing: border-box;
  margin: 15px 15px 20px 15px;
  overflow: hidden;
}
.zModular .content {
  padding: 20px 20px;
}
.zModular div:after {
  content: "";
  display: block;
  clear: both;
}
.zModular .title {
  padding: 10px 20px;
  border-bottom: 2px solid #e8ebf2;
  color: #666;
  font-size: 16px;
}
</style>
