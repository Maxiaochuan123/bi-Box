<template>
  <el-col class="container">
	  <el-col :span="24" :class="titleBoxClass" v-show="takeUp">
       <div :class="titleClass">
				 <div>众汇金控商业智能系统</div>
			 </div>
			 <!-- <div class="userInfo">
				 <el-dropdown trigger="click">
					 <div class="userName">
						  <span>张三</span>
						  <i class="el-icon-setting"></i>
					 </div>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item  @click.native="logout" class="loginout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			 </div> -->

       
       <!-- 全屏 -->
      <div  :class="fullScreenClass" @click="launchFullScreen()"><i :class="fullScreen ? 'iconfont icon-tuichuquanping' : 'iconfont icon-quanping'"></i></div>	 
      
      <!-- 换肤 -->
       <div class="translate">
        <nav id="gooey-v">
          <input type="checkbox" class="menu-open" name="menu-open4" id="menu-open4"/>
          <label class="open-button" for="menu-open4">
             <i class="iconfont icon-huanfu"></i>
          </label>
          <a href="#"  v-for="(item, index) of 2" :key="index" :class="'gooey-menu-item item' + (index+1)" @click="switchStyle(index)"></a>
        </nav>
       </div>
    </el-col> 

    <!-- BI图表 -->
    <el-col class="statementBox">
      <Supersystem @parent_takeUp="getTakeUp"></Supersystem>
    </el-col>
  </el-col>
</template>

<script>
import Supersystem from './Supersystem'
import axios from 'axios'
import util from '../src/api/util.js'
export default {
  components:{
    Supersystem
  },
	data(){
    return{
      fullScreen: false,
      takeUp: true,
      isSwitchStyle: this.$store.state.count,
      titleBoxClass: 'headerStatement headerStatementBlue',
      titleClass:'home-title home-titleBlue',
      fullScreenClass:'fullScreen fullScreenBlue'
    }
  },
  	methods:{
    //全屏
    launchFullScreen(element){
      // util.launchFullScreen(element,this)
      window.location.href = "http://192.168.50.111:8088"
    },

    // 换肤
    switchStyle(index){
      this.$store.commit('change', index)

      if(index == '0'){
        this.titleBoxClass = 'headerStatement headerStatementWhite'
        this.titleClass = 'home-title home-titleWhite'
        this.fullScreenClass = 'fullScreen fullScreenWhite'
      }else{
        this.titleBoxClass = 'headerStatement headerStatementBlue'
        this.titleClass = 'home-title home-titleBlue'
        this.fullScreenClass = 'fullScreen fullScreenBlue'
      }
    },

    // BI 控制 是否显示头部
		getTakeUp(data){
			this.takeUp = data
		},

		logout(){//退出登录
			var _this = this;
			this.showNav = false;
			this.$confirm('确认退出吗?', '提示', {
				// type: 'warning'
			}).then(() => {
				sessionStorage.removeItem('token');
				sessionStorage.removeItem('userInfoData');
				this.muenData = [];
				_this.$router.push('/login');
			})
    }
		
	}
}
</script>

<style lang="scss">
  @import  url("http://www.jq22.com/jquery/font-awesome.4.6.0.css");
  @import  url("../static/style/gooey.css");


  .translate{
    width: 30px;
	  height: 30px;
    float: right;
    position: relative;
    margin: 17px 20px 0 0;
  }
  .open-button{
    background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%) !important;
  }
  #gooey-v{
    position: absolute;
    top: -20px;
    left: -2px;
    z-index: 9999;
    svg{
      width: 30px;
      height: 114px;
    }
  }
  .item1{
    background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  }
  .item2{
    background-image: linear-gradient(to top, #09203f 0%, #537895 100%);
  }


.statementBox{
  height: 100%;
}
.loginout{
  background: #fff;
  color:#66b1ff;
}
.container{
  position: absolute;
  top:0;
  bottom: 0;
  widows: 100%;
  overflow: hidden;
}
.headerStatement{
  height:60px;
  width:100%;
  z-index: 9;
}
.headerStatementWhite{
    background:#fff;
}
.headerStatementBlue{
    background:#3a3e53;
}
.userInfo{
  position: absolute;
  top: 9px;
  right: -20px;
  text-align:right;
  margin-right:35px;
  float: right;
  cursor: pointer;
}	
.userName{
  color:#fff;
  font-size:16px;
  border:1px solid #80dcf5;
  -moz-box-shadow:0 0 13px #22bfd2 inset;             
  -webkit-box-shadow:0 0 13px #22bfd2 inset;  
  box-shadow:0 0 13px #22bfd2 inset; 
  padding:10px 20px;
}
.el-dropdown-menu{
  background: rgba(13, 50, 92, 0.6);
  padding: 11px 0 0;
}
.el-dropdown-menu li{
  -moz-box-shadow:0 0 13px #22bfd2 inset;             
  -webkit-box-shadow:0 0 13px #22bfd2 inset;  
  box-shadow:0 0 13px #22bfd2 inset; 
  height:50px;
  line-height: 50px;
}
.el-dropdown-menu li:first-child{
  margin-top:-11px;
  // border:1px solid #80dcf5;
}
.home-title{
  float: left;
  width: 322px;
  height: 60px;
  float: left;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 24px;
}
.home-titleWhite{
  background-color:#46a5e7;
}
.home-titleBlue{
  background-color:#28282e;
}
// 全屏
.fullScreen{
  width: 30px;
	height: 30px;
  float: right;
  margin: 16px 16px 0 0;
  cursor: pointer;
}
.fullScreenWhite{
  color: #333;
}
.fullScreenBlue{
  color: #fff;  
}
.icon-quanping, .icon-tuichuquanping{
  font-size: 30px !important;
}

.shadow{
  box-shadow: inset 1px 0px 15px #888890;
}

</style>