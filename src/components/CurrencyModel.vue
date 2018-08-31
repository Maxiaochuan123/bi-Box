<template>
  <div class="currencyModel" v-if="currencyModel">
    <div class="close" @click="close"><i class="iconfont icon-cuowu"></i></div>
    <div class="title">新增通用图表</div>

    <!-- 图表 -->
    <div class="chartContent">
      <div class="scrollChartBox" v-for="(item,index) in currencyAddData" :key="index" @click="scrollChartBoxClick($event, item.Type)">
        <div class="scrollChart" :id="item.Id"></div>
          <p>{{item.Type}}</p>
        </div>
      </div>

    <!-- 表单 -->
    <div class="scrollChartFromBox">
      <el-form :model="scrollChartFormData" :rules="rules" ref="scrollChartFormData" label-width="100px" class="scrollChartFrom">
        <el-form-item label="图表名称：" prop="chartName">
          <el-input v-model="scrollChartFormData.chartName" clearable></el-input>
        </el-form-item>
        <el-form-item label="填充数据：" prop="currencyOptionsVal" class="currencyOptions">
          <el-select v-model="scrollChartFormData.currencyOptionsVal" clearable placeholder="请选择" @change="currencyOptionsChange">
            <el-option v-for="(item, index) in currencyOptions" :key="index" :label="item.functionInterfaceName" :value="item.functionInterfaceName"> </el-option>
          </el-select>
        </el-form-item>

        <div class="chartLabelBox">
          <div class="chartLabelTitle">图表标签：</div>
            <div class="chartLabelContent">
              <el-tag :key="tag" v-for="tag in scrollChartFormData.chartLabel" closable :disable-transitions="false" @close="handleClose(tag)"> {{tag}} </el-tag>
              <el-input  class="input-new-tag" v-if="scrollInputVisible" v-model="scrollInputValue" ref="scrollSaveTagInput"  size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" > </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
            </div>
          </div>
        </el-form>
      </div>

    <div class="scrollChartSubmitBtn" @click="scrollChartSubmit('scrollChartFormData')">新增</div>
  </div>
</template>

<script>
  import {requestCurrencyAddData, selectEchart, addEchart} from '../api/api.js'  //本地图表类型 ， 可添加数据 ，新增图表
  import {getEchartsMap} from '../api/init/barGraph' //柱状图初始化
  import echarts from '../../static/script/echarts.js'
  import util from '../api/util'

  export default {
   name: "currencyModel",
   props:{
     currencyModel: Boolean
   },
   data(){
      return {
        currencyAddData:[], //可选择的图表类型
        currencyOptions:{}, //可填充数据 下拉框
        scrollChartFormData:{ //表单数据
          userid: util.getParam('userId'),
          chartId:'',
          chartType:'',
          chartName:'', 
          projectType:'c',
          currencyOptionsVal: '', //所选择的参数
          chartLabel:[]
        },
        rules:{
          chartName:[{ required: true, message: '请将信息填写完整', trigger: ['blur','change']}],
          currencyOptionsVal:[{ required: true, message: '请将信息填写完整', trigger: ['blur','change']}]
        },
        scrollInputVisible: false,
        scrollInputValue: '',
     }
   },
  created(){
    // 加载本地  新增图表的类型
    requestCurrencyAddData().then(res=>{
      this.currencyAddData = res
      this.$nextTick(()=>{
      //   for(let item of this.currencyAddData){
      //     let myChart = echarts.init(document.querySelector('#' + item.Id))
      //     myChart.setOption(item)
      //   }
      setTimeout(()=>{
          for(let item of this.currencyAddData){
            let myChart = echarts.init(document.querySelector('#' + item.Id))
            myChart.setOption(item)
          }
        },2000)
      })

    })

    // 查看可以添加的图表数据
    selectEchart({userId: this.scrollChartFormData.userid}).then(res=>{
      this.currencyOptions = res.data
    })
  },

  methods:{
    // 新增提交
    scrollChartSubmit(scrollChartFormData){

      if(this.scrollChartFormData.chartType){

        this.$refs[scrollChartFormData].validate((valid) => {

          if(valid){

            this.$confirm('确定要提交吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'

            }).then(res =>{

              delete this.scrollChartFormData.currencyOptionsVal
              delete this.scrollChartFormData.chartLabel

              addEchart( this.scrollChartFormData).then(res =>{

                if(res.code == 'SYS.200'){

                  this.$message.success('新增成功!' )
                  getEchartsMap()
                  // this.showLoading = true
                  this.$emit('showLoading',true)

                  // 加载左侧图表
                  setTimeout(()=>{
                    for(let item of this.currencyData){
                      let myChart = echarts.init(document.querySelector('#echart' + item.leftechartSource.Id))
                      myChart.setOption(item.leftechartSource)
                    }
                    // this.showLoading = false
                  this.$emit('showLoading',false)

                  },500)

                  this.clearScrollChartSubmit()
                  this.$refs[scrollChartFormData].resetFields()

                }else{
                  this.$message.error('新增失败!' )
                }

              }).catch(res=>{
                this.$message.error('新增失败!' )
              })
              
            })

          } else {
            this.$message.error('请将信息填写正确')
            return false;
          }
        })
      }else{
        this.$message({ type: 'warning', message: '请选择图表类型!' })
      }
    },

    // 选择图表
    scrollChartBoxClick(ev, type){
      $(ev.currentTarget).addClass('shadow').siblings().removeClass('shadow')
      this.scrollChartFormData.chartType = type
      this.clearScrollChartSubmit()
    },

    // 新增通用 下拉框
    currencyOptionsChange(){
      for(let item of  this.currencyOptions){
        if(item.functionInterfaceName == this.scrollChartFormData.currencyOptionsVal){
          this.scrollChartFormData.chartId = item.id
        }
      }
    },

    // 标签输入框
    handleInputConfirm() {
      if(this.showEchart){
        let inputValue = this.scrollInputValue;
        if (inputValue) {
          this.scrollChartFormData.chartLabel.push(inputValue);
        }
          this.scrollInputVisible = false;
          this.scrollInputValue = '';
      }else{
        let inputValue = this.specialInputValue;
        if (inputValue) {
          this.specialFormData.chartLabel.push(inputValue);
        }
          this.specialInputVisible = false;
          this.specialInputValue = '';
      }
    },

    // 添加标签
    showInput() {
      if(this.showEchart){
        this.scrollInputVisible = true;
        this.$nextTick(_ => {
          this.$refs.scrollSaveTagInput.$refs.input.focus();
        });
      }else{
        this.specialInputVisible = true;
        this.$nextTick(_ => {
          this.$refs.specialSaveTagInput.$refs.input.focus();
        });
      }
    },

    // 关闭标签
    handleClose(tag) {
      if(this.showEchart){
        this.scrollChartFormData.chartLabel.splice(this.scrollChartFormData.chartLabel.indexOf(tag), 1);
      }else{
        this.specialFormData.chartLabel.splice(this.specialFormData.chartLabel.indexOf(tag), 1);
      }
    },

    //关闭模态框
    close(){
      if(this.showEchart){
          $('.currencyModel').animate({margin:'0% auto',opacity:'.5',opacity:'.2'},200,"linear",()=>{
            this.currencyModel = false
          })
        }else{
          $('.specialModel').animate({margin:'0% auto',opacity:'.5',opacity:'.2'},200,"linear",()=>{
            this.specialModel = false
          })
        }
    },

    // 清空 通用
    clearScrollChartSubmit(){
      this.scrollChartFormData.chartName = ''
      this.scrollChartFormData.chartId = ''
      this.scrollChartFormData.currencyOptionsVal = ''
      this.scrollChartFormData.chartLabel = []
    }
  },
 }
</script>

<style lang="scss" scoped>
 .currencyModel{
  width: 888px;
  height: 466px;
  background-image: url('../assets/specialBack.png');
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 1000;
  position: fixed;
  left:0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: 0 auto;

  .close{
    width: 20px;
    height: 24px;
    font-size: 24px;
    line-height: 18px;
    color: #fff;
    position: absolute;
    top: 5px;
    right: 6px;
    cursor: pointer;
  }

  .title{
    width: 100%;
    font-size: 22px;
    padding-top: 20px;
    color: #fff;
  }

  .specialForm,.scrollChartFrom{
    margin-top: 40px;
    .el-form-item__label{
        color: #fff;
    }
    .el-form-item__content{
      width: 474px;
    }
    .el-form-item{
      margin: 20px 0 20px 54px;
    }
    .el-input{
      width: 140%;
    }
  }

  .scrollChartFrom, .specialForm{
    .chartLabelBox{
      width: 87%;
      margin-left: 61px;
      display: flex;
      justify-content: flex-start;

      .chartLabelTitle{
        width: 72px;
        font-size: 14px;
        color: #fff;
        margin-left: 10px;
      }

      .chartLabelContent{
        width: calc(91% - -1px);
      }
      .el-tag:first-child{
        margin-left: 10px;
      }
      .el-tag, .button-new-tag, .input-new-tag{
        float: left;
      }
      .el-tag + .el-tag {
        margin-left: 10px;
        margin-bottom: 6px;
      }
      .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }
    }
  }
  .scrollChartFrom{
    margin-top: 0;
    .el-form-item__content{
      width: 612px;
    }
  }
  .specialAddBtn{
    width: 110px;
    height: 28px;
    line-height: 28px;
    color: #fff;
    margin: 10px  auto 0;
    font-size: 16px;
    cursor: pointer;
    background-image: url('../assets/specialBtn.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
}

.currencyModel{
  width: 1114px;
  height: 560px;
  background-size: 100% 560px;
  overflow: hidden;

  .title{
    padding-top: 40px;
  }

  .chartContent{
    width: 98%;
    height: 152px;
    margin: 18px 10px 0;
    overflow-y: auto;

    .scrollChartBox{
      width: 178px;
      height:140px;
      margin: 12px 4px 24px 32px;
      float: left;
      position: relative;

      .scrollChart{
        width: 100%;
        height: 100%;
      }

      p{
        position: absolute;
        margin: 0;
        bottom: 4px;
        width: 100%;
        font-size: 16px;
        line-height: 20px;
        color: #fff;
      }
      
    }
    .scrollChartBox:hover{
      box-shadow: inset 1px 0px 15px #888890;
    }
    
  }
  .chartContent::-webkit-scrollbar{
    width:4px;
    // height: 6px;
  }

  .chartContent::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    background: #00BADE;
  }

  .chartContent::-webkit-scrollbar-track {/*滚动条里面轨道*/
    border-radius: 10px;
    background: #244776;
  }

  .scrollChartFromBox{
    width: 98%;
    margin: 12px auto;
    padding: 10px;
    .currencyOptions{
        .el-select{
          left: -198px;
        }
        input{
          width: 282%;
        }
        .el-input__suffix-inner{
          position: absolute;
          right: -550px;
        }
    }
  }

  .scrollChartSubmitBtn{
      width: 160px;
      height: 40px;
      line-height: 40px;
      color: #fff;
      margin: 0  auto;
      cursor: pointer;
      font-size: 16px;
      background-image: url('../assets/specialBtn.png');
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
</style>