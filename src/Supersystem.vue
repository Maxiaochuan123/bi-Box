<template>
  <div :class="boxClass">
    <div id="left" v-show="take_Up">

      <!-- 收入箭头 -->
      <div class="takeUp" @click="takeUp"><i :class="take_Up ? 'iconfont icon-zuo' : 'iconfont icon-you'"></i></div>

      <!-- loading -->
      <Loading :showLoading="showLoading"></Loading>

      <!-- 新增 通用 Model -->
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
          <el-form :model="scrollChartFormData" :rules="scrollChartFromRules" ref="scrollChartFormData" label-width="100px" class="scrollChartFrom">
            
            <el-form-item label="填充数据：" prop="currencyOptionsVal" class="currencyOptions">
              <el-select v-model="scrollChartFormData.currencyOptionsVal" clearable placeholder="请选择" @change="currencyOptionsChange">
              <el-option
                v-for="(item, index) in currencyOptions"
                :key="index"
                :label="item.functionInterfaceName"
                :value="item.functionInterfaceName">
              </el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="图表名称：" prop="chartName" >
              <el-input v-model="scrollChartFormData.chartName" clearable placeholder="可编辑图表名称"></el-input>
            </el-form-item>

            <div class="chartLabelBox">
              <div class="chartLabelTitle">图表标签：</div>
                <div class="chartLabelContent">
                <el-tag
                  :key="tag"
                  v-for="tag in scrollChartFormData.chartLabel"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scrollInputVisible"
                  v-model="scrollInputValue"
                  ref="scrollSaveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                  >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
              </div>
            </div>
          </el-form>
        </div>
        <div class="scrollChartSubmitBtn" @click="scrollChartSubmit('scrollChartFormData')">新增</div>
      </div>

      <!-- 新增 专题 Model -->
      <div class="specialModel" v-if="specialModel">
        <div class="close" @click="close"><i class="iconfont icon-cuowu"></i></div>
        <div class="title">{{specialTitle}}</div>
        <el-form :model="specialFormData" :rules="specialFormRules" ref="specialFormData" label-width="100px" class="specialForm">
          <el-form-item label="专题名称：" prop="chartName">
            <el-input v-model="specialFormData.chartName" clearable></el-input>
          </el-form-item>
          <el-form-item label="专题链接：" prop="urlAddress">
            <el-input v-model="specialFormData.urlAddress" clearable></el-input>
          </el-form-item>
           <div class="chartLabelBox">
              <div class="chartLabelTitle">图表标签：</div>
                <div class="chartLabelContent">
                <el-tag
                  :key="tag"
                  v-for="tag in specialFormData.chartLabel"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="specialInputVisible"
                  v-model="specialInputValue"
                  ref="specialSaveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                  >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
              </div>
            </div>
          <div class="specialAddBtn" @click="specialSubmit('specialFormData')">{{specialBtnText}}</div>
        </el-form>
      </div>

    <!-- 切换 通用  / 专题 -->
    <div class="searchBox">
      <div class="search2">
        <div class="switch">
          <span @click="clickSwitchBox1($event)">{{switchText1}}<i :class=" switchBox == true ? 'iconfont icon-xiajiantou' :  'iconfont icon-shangjiantou'"></i></span>
          <span @click="clickSwitchBox2($event)" v-show="switchBox">{{switchText2}}</span>
        </div>
 
      <!-- 新增专题按钮 -->
      <div class="specialAdd" @click="specialAdd"><i class="iconfont icon-xinzeng"></i></div>

      <input type="text" v-model="searchInput" placeholder="搜索" @focus="searchFocus" @blur="searchBlur" @keyup="deletKeyDown($event)">
      <span class="clearVal" v-show="clearVal" @click="clickClearVal">x</span>
      <span class="searchGo" @click="searchGo"><i class="fa fa-search"></i></span>
        <ul class="autoCompletion" v-show="fuzzyQueryList_show">
          <li v-for="(item, index) in searchFuzzyQueryList" :key="index" @click="searchFuzzyQueryInputAdd($event)">{{item}}</li>
        </ul>  
    </div>
  </div>

    <!-- 通用 -->
    <div class="left_currencyBox" v-if="showEchart">
      <div class="currencyBox" v-for="(item,index) in currencyData" :key="index">
        <div class="currencyEchartBox" :id="'echart'+item.leftechartSource.Id" :data-echart="'echart'+item.leftechartSource.Id + index" :data-name="item.leftechartSource.Name" draggable="true" @dragstart="drag($event,item.completeData)"></div>
         <el-tooltip  effect="dark" :content="item.leftechartSource.Name" placement="top-start">
          <p>{{item.leftechartSource.Name}}</p>
          </el-tooltip>
      </div>
  </div>

    <!-- 专题 -->
    <div class="left_specialBox" v-if="!showEchart">
      <el-tooltip effect="dark" :data-name="item.chartName" :content="item.chartName" placement="top-start" v-for="(item, index) of specialData" :key="index">
        <div  class='specialBox' @click="specialclick($event, item.urlAddress)">
          <span class="title" >{{item.chartName}}</span><span class="time">{{item.createtime | formatDate}}</span>
          <div class="operation">
            <span class="edit" @click="specialEdit(item.id)">修改</span>
            <span class="delet" @click="specialDelet(item.id)">删除</span>
          </div>
        </div> 
      </el-tooltip>
    </div>
  </div>
    
  <div id="right">
    <!-- 收入箭头 -->
    <div class="takeUp2" @click="takeUp"><i :class="take_Up ? 'iconfont icon-zuo' : 'iconfont icon-you'"></i></div>
      
    <!-- 通用 -->
    <div class="zoomBox" v-for="(item,index) in currencyData.length" :key="index" v-if="showEchartBox"  @dragover="allowDrop($event)" @drop="drop($event)" @dragenter="dragenter($event)" @dragleave="dragleave($event)"  @dblclick="zoom($event)">
    <div class="toolbarBtn"><i class="fa fa-cog"></i>
      <div class="toolbarBox">
        <div class="toolbar">
          <div><i class="fa fa-pie-chart" data-toolbarId="pie" @click="cli($event)"></i></div>
          <div><i class="fa fa-bar-chart" data-toolbarId="bar" @click="cli($event)"></i></div>
          <div><i class="fa fa-line-chart" data-toolbarId="line" @click="cli($event)"></i></div>
          <div><i class="fa fa-trash-o" data-toolbarId="delete" @click="cli($event)"></i></div>
        </div>
      </div>
    </div>
    <span class="corner" v-show="corner">
      <span v-for="(item,index) in 4" :key="index"></span>
    </span>
    <div class="echartBox"></div>
  </div>

      <!-- 专题 -->
      <div class="special" v-if="!showEchartBox" draggable="true">
        <iframe class="iframeBox"  src="" scrolling="yes" frameborder="0"> </iframe>
      </div>

    </div>
  </div>
</template>
<script>
  import Sortable from '../static/script/Sortable.js'
  import echarts from '../static/script/echarts.js'
  import  '../static/script/gooey.min.js'
  import '../static/style/public.scss'

  import util from '../src/api/util.js'
  import Loading from '@/components/Loading'
  
  import {getEcharts ,addEchart, editEchart, deleteEchart,selectEchart, requestCurrencyAddData, requestPowerBi} from '../src/api/api'

  // search 重置
  let restore = () => {
    $('#left .currencyEchartBox').each(function (index,item) {
      $(item).parent().css('display','block')
    })
    $('#left .left_specialBox div').each(function (index,item) {
      $(item).css('display','block')
    })
  }

  export default {
    name: "Echarts",
    components: {Loading},
    data() {
      return {
        srcdiv: '', //左侧当前拖拽元素
        myChart: '', //当前echart实例
        clearVal: false, //清除按钮
        searchInput: '', //搜索栏 数据
        searchNameList: [], //模糊查询所用数据 来自子组件的 自定义属性 data-name
        fuzzyQueryList_show: false,//模糊查询列表是否显示
        leftEchartName: '', // 用于搜索时条件判断的 name 名称
        completeData: {}, //当前拖拽图表完整数据
        rightIdList:[], //用于自适应重新渲染大小
        showLoading:true,
        liIndex: 0,
        switchBox: false, //切换通用 / 专题
        switchText1: '通用',
        switchText2: '专题',
        showEchart: true, //显示通用
        showEchartBox: true,
        take_Up: true, //箭头收起
        isZoom:false, //是否缩放
        siblingsDiv: '', //当前点击缩放元素的 兄弟元素
        echartItem: '', //当前点击缩放的 echart 实例
        currencyModel: false, //显示通用模态框
        specialModel: false, //显示新增专题模态框
        echartColor: ['#4382D8','#84CEE3','#208BC2','#765AB1','#37B4A7','#395498','#2674AA','#177F92','#049370','#3597D8','#51B4D9','#913C8B','#D55302','#3A539C'], //图表配色
        currencyData:[], //通用数据        
        specialData:[], //专题数据
        currencyAddData:[], //新增 通用数据

        currencyOptions:{}, //通用可填充数据 下拉框
        
        scrollChartFormData:{ //通用新增模态框数据
          userid: util.getParam('userId'),
          chartId:'',
          chartType:'',
          chartName:'',
          projectType:'c',
          currencyOptionsVal: '', //所选择的参数
          chartLabel:[]
        },
        scrollChartFromRules:{
          chartName:[{ required: true, message: '请将信息填写完整', trigger: ['blur','change']}],
          currencyOptionsVal:[{ required: true, message: '请将信息填写完整', trigger: ['blur','change']}]
        },
        scrollInputVisible: false,
        scrollInputValue: '',
        
        specialChange: true, // true: 新增   false: 修改
        specialTitle:"新增专题",
        specialBtnText:"修改专题",
        specialFormData:{ //专题新增模态框数据
          id:'',
          chartName:'',
          urlAddress:'',
          createtime: Date.now(),
          projectType:'p',
          userid: util.getParam('userId'),
          chartLabel:[]
        },
        specialFormRules:{
          chartName:[{ required: true, message: '请将信息填写完整', trigger: ['blur','change']}],
          urlAddress:[{ required: true, message: '请将信息填写完整', trigger: ['blur','change']},{pattern:/^(https?|http|ftp|rtsp|mms):\/\/.+$/, message: '请输入正确的网址', trigger: ['blur','change'] }]
        },

        boxClass:'public blue',
        lineColor:'#fff',
        corner:true,
        
        specialInputVisible: false,
        specialInputValue: ''
      };
    },

    watch:{
      getCount(curVal){
        if(curVal == '0'){
          this.boxClass = 'public white'
          this.lineColor = '#333'
          this.corner = false
        }else{
          this.boxClass = 'public blue'
          this.lineColor = '#fff'
          this.corner = true
        }


        // 设置图表 style
        this.rightIdList.map((item)=>{
          item.val.title.textStyle.color = this.lineColor
          item.val.dataZoom.textStyle.color = this.lineColor
          item.val.legend.textStyle.color = this.lineColor
          item.val.xAxis.axisLine.lineStyle.color = this.lineColor
          item.val.yAxis.axisLine.lineStyle.color = this.lineColor
          item.key.setOption(item.val)
          item.key.resize()
        })

      },
    },

    created(){
      // let userid = {userid: this.scrollChartFormData.userid}

      // 获取并 初始化 图表 结构
      this.getEchartsMap()

      // 获取专题
      this.getSpecialMap()
      

      // 获取专题 powerBI 数据
      // requestPowerBi().then(res=>{
      //   this.specialData = res
      // })

      // 加载本地  新增图表的类型
      requestCurrencyAddData().then(res=>{
        this.currencyAddData = res
      })

      // 查看可以添加的图表数据
      selectEchart({userId: this.scrollChartFormData.userid}).then(res=>{
        this.currencyOptions = res.data
      })
    },
  
    mounted() {
      // 拖拽插件
      let sortable = Sortable.create(right, {
        animation: 500,
        sort: true,
        // handle: '' //拖拽句柄
      })

    // 专题操作菜单
      
    // 换肤菜单
      $("#gooey-v").gooeymenu({
        bgColor: "#68d099",
        contentColor: "white",
        style: "vertical",
        vertical:{
          menuItemPosition: "spaced",
          direction: "down",
        },
        circle: {
          radius: 90
        },
        margin: "small",
        size: 30,
        hover: "black"
    })

       // 图表自适应
        // window.onresize = () => {
        //   myChart.resize()
        // }

      // 图表菜单栏滚动时，添加阴影
      $('#left').on('scroll',()=>{
          if($('#left').scrollTop() > 60){
            $('.searchBox').css({'background-color':'#17283f' , 'box-shadow':'inset #4e6298 0px 0px 8px 0px'})
          }else{
            $('.searchBox').css({'background-color':'transparent' , 'box-shadow':'none'})
          }
      })

      $('.takeUp').css('display','none')
      $('.takeUp2').css('display','none')
      // 收起箭头
      $(() => {
        $(document).on('mousemove',(event)=>{
          if(this.take_Up == true){
            $('.takeUp2').css('display','none')
            if (event.clientX < 400){
              $('.takeUp').css('display','block')
            }
            if (event.clientX > 420){
              $('.takeUp').css('display','none')
            }
          }else{
            if (event.clientX < 20){
              $('.takeUp2').css('display','block')
            }else{
              $('.takeUp2').css('display','none')
            }

          }
        })
      })

      // 加载左侧图表
      setTimeout(()=>{
        for(let item of this.currencyData){
          let myChart = echarts.init(document.querySelector('#echart' + item.leftechartSource.Id))
          myChart.setOption(item.leftechartSource)
        }
      },500)

  },

  filters:{
    formatDate(date){
      return util.formatDate(date)
    }
  },
    
    methods: {
      // 获取 图表
      getEchartsMap(){
        let data = {userId: this.scrollChartFormData.userid ,type:'c'}
        getEcharts(data).then(res=>{
            let list = res.data

            let itemList = list.map((parent) => { 
              let temp = {
                          "leftechartSource":{
                            "Id": parent.id,
                            "Name": parent.name,
                            "grid": [{"x": "5%", "y": "7%", "width": "92%", "height": "56%"}],
                            "xAxis": {
                              "axisLine":{
                                "lineStyle":{
                                  "color": "#fff"
                                }
                              },
                              "data": parent.businessdate
                            },
                            "yAxis": {
                              "axisLine":{
                                "lineStyle":{
                                  "color": "#fff"
                                }
                              },
                              "type" : 'value'
                            },
                            "color": this.echartColor,
                            "series": parent.value.map(temp=>{
                              return  {
                                  "type": 'bar',
                                  "data": temp.data,
                                }
                            })
                          },
                          "completeData":{
                            "title" : {
                              "text": parent.name + "(万元)",
                              "x":"center",
                              "y": '4%',
                              "textStyle":{
                                "color": this.lineColor
                              },
                              "left":'4%'
                            },
                            "dataZoom":{
                              "show":false,
                              "textStyle":{
                                "color": this.lineColor
                              }
                            },
                            tooltip : {
                                trigger : 'axis',
                                showDelay : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                                axisPointer : { // 坐标轴指示器，坐标轴触发有效
                                    type : 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            "legend": {
                              "show":false,
                                "top":"12%",
                                "data": parent.corpname,
                                "textStyle":{
                                  "color": this.lineColor
                                }
                            },
                            "grid": [{"x": "12%", "y": "32%", "width": "84%", "height": "60%"}],
                            "xAxis": {
                              "show":false,
                              "axisLine":{
                                "lineStyle":{
                                  "color": this.lineColor
                                }
                              },
                              "data": parent.businessdate
                            },
                            "yAxis": {
                              "axisLine":{
                                "lineStyle":{
                                  "color": this.lineColor
                                }
                              },
                              "type" : 'value'
                            },
                            "color":['#4382D8','#84CEE3','#208BC2','#765AB1','#37B4A7','#395498','#2674AA','#177F92','#049370','#3597D8','#51B4D9','#913C8B','#D55302','#3A539C'],
                            "series": parent.value.map(temp=>{
                              return  {
                                  "name": temp.corpname,
                                  "type": 'bar',
                                  "data": temp.data,
                                  "markPoint" : {
                                    "data" : [
                                        {"type" : 'max', "name": '最大值'},
                                        {"type" : 'min', "name": '最小值'},
                                        {"type" : 'average', "name": '平均值'}
                                    ]
                                  }
                                }
                            })
                          }
                        }
              return temp
            })

            if(list.length == 0){
              this.$message.warning('您还没有添加图表！')
            }
            setTimeout(()=>this.showLoading = false,500)
            this.currencyData = itemList

        }).catch((err)=>{
            this.showLoading = true
        })
      },

      // 获取专题
      getSpecialMap(){
        let data = {userId: util.getParam('userId') ,type:'p'}
        getEcharts(data).then((res)=>{
          this.specialData = res.data
        })
      },
      allowDrop(ev) {
        ev.preventDefault()
      },

      drag(ev, completeData) {
        this.srcdiv = ev.currentTarget //获取拖拽事件元素
        ev.dataTransfer.setData("html", ev.currentTarget.innerHTML)//获取拖拽事件元素的 Html
        this.completeData = completeData //获取子组件传递的 完整数据
      },

      drop(ev) {
        ev.preventDefault()
        let echartID = []
        let data_echartData = []
        let data_echart = $(this.srcdiv).attr('data-echart') //左侧盒子自定义属性
        let leftBoxId = $(this.srcdiv).parent().attr("id") //左侧 导航栏父级 Id
        let rightBoxId = $(ev.target).parent()[0].parentNode.id // 右侧容器父级 Id

        $(ev.target).empty()
        $(ev.target).removeAttr('data-echartData')
        $(ev.target).removeAttr('id')
         
        if (this.srcdiv != ev.currentTarget && leftBoxId != rightBoxId) {

          /**
           * 遍历右侧容器  id  装入 echartID数组
           */
          $('#right .echartBox').each(function (index, item) {
            echartID.push($(item).attr('id') || '')
          })

          /**
           * 判断 echartID 中是否有重复 id  如果没有则将左侧 自定义属性添加为 Id
           */
            if (echartID.indexOf(data_echart) == -1) {
              $(ev.target).attr('id', data_echart)
              
              $(ev.target).addClass('rightDivHoverDrog')
              $(ev.target).parent().find('.corner').css('visibility','visible')
              $(ev.target).parent().find('.toolbarBtn').css('visibility','visible')

              let rightId = $(ev.target).attr('id'); //获取当前放入 盒子的 id
              this.myChart = echarts.init(document.querySelector("#" + rightId)); //echart 查找符合条件的 id

                
              // 获取完整数据
              let attrData = JSON.stringify(this.completeData)
                    data_echartData = JSON.parse(attrData)

                  this.rightIdList.push({
                    'id':rightId,
                    'key':this.myChart,             
                    'val':data_echartData,
                    'zoom': false
                  })
                  this.rightIdList = [...new Set(this.rightIdList)]

                  // 图表自适应
                  window.onresize = () => {
                    this.rightIdList.map((item)=>{
                      item.key.resize()
                    })
                  }

                //如果子组件传递了 完整数据，则显示完整数据
                  this.myChart.clear() //清除绘制内容，实例可用
                  this.myChart.setOption(data_echartData) // 使用刚指定的配置项和数据显示图表。
            }else{
                $(ev.target).removeClass('rightDivHover')
                $(ev.target).removeClass('rightDivHoverDrog')
                // this.$message({ type: 'warning', message: '不要重复拖拽!' ,duration:'700'})
            }
        }
      },

      // 移入拖拽区域
      dragenter(ev){
        let data_echart = $(this.srcdiv).attr('data-echart') //左侧盒子自定义属性
          $(ev.target).addClass('rightDivHover')
      },
    // 离开拖拽区域
      dragleave(ev){
          $(ev.target).removeClass('rightDivHover')
      },


    // 搜索框获取焦点
    searchFocus(){
      restore()
      
      if(this.searchInput.length > 0){
        this.fuzzyQueryList_show = true
        this.clearVal = true
      }else{
        this.clearVal = false
      }

      let currencyNameList = []
      let specialNameList = []
      // 获取所有通用 名称
      $('#left .currencyEchartBox').each(function (index,item) {
        currencyNameList.push($(item).attr('data-name'))
      })
      

      // 获取专题 名称 
      $('#left .left_specialBox div').each(function (index,item) {
        specialNameList.push($(item).attr('data-name'))
      })

      this.showEchart ? this.searchNameList = currencyNameList : this.searchNameList = specialNameList

      // searchGo
    },

    // 搜索框失去焦点
    searchBlur(){
      // restore()
      setTimeout( () => {
        this.fuzzyQueryList_show = false
      },100)
    },

    // 搜索框清除按钮
    clickClearVal() {
      let that = this
      this.searchInput = ''
      this.clearVal = false
      restore()
    },

    //模糊查询列表 撤销按钮
    revocation(){
      restore()
      this.searchInput = ''
      setTimeout( () => {
      this.clearVal = false
      this.fuzzyQueryList_show = false
      },100)
    },

    // 监听 搜索框 keyDown
    deletKeyDown(ev){
      let that = this
      if(ev.keyCode == 8){
        if(that.searchInput.length < 1){
            restore()
            this.clearVal = false
            this.fuzzyQueryList_show = false
        }
      }else if(ev.keyCode == 13){
        let liText = $('.autoCompletion').find("li:not(:first-child):eq(" + that.liIndex + ")").text()
        this.searchInput = liText
      }
      if(that.searchInput.length > 0){
          this.clearVal = true
          this.fuzzyQueryList_show = true
      }

      //上下键选择 li
      if(ev.keyCode == 38){ //向上
        that.liIndex--
        if(that.liIndex < 0) that.liIndex = that.searchNameList.length -1
      }else if(ev.keyCode == 40){//向下
        that.liIndex++
        if(that.liIndex >= that.searchNameList.length ) that.liIndex = 0
      }
      let li = $('.autoCompletion').find("li:not(:first-child):eq(" + that.liIndex + ")")
      li.css("background", "#0283daa6").siblings().css("background", "")

      if(ev.keyCode == 13){
        that.searchGo()
        that.fuzzyQueryList_show = false
      }
    },

    //searchGo 开始搜索
    searchGo(){
      let that = this
      if(that.showEchart){
        $('#left .currencyEchartBox').each(function (index,item) { 
          if(that.searchInput != ''){
            if($(item).attr('data-name') != that.searchInput){
              $(item).parent().css('display','none')
            }
          }
        })
      }else{
        $('#left .left_specialBox div').each(function (index,item) { 
          if(that.searchInput != ''){
            if($(item).attr('data-name') != that.searchInput){
              $(item).css('display','none')
            }
          }
        })
      }
    },

    // 点击 模糊查询列表 设置值
    searchFuzzyQueryInputAdd(ev){
      this.searchInput = $(ev.target).text()
      this.fuzzyQueryList_show = false
    },

    // 切换详情
    clickSwitchBox1(ev){
      this.switchBox = !this.switchBox
      
      this.currencyModel = false
      this.specialModel = false
      this.searchInput = ''
    },
    clickSwitchBox2(ev){
      this.searchInput = ''

      this.switchBox = !this.switchBox    
      this.switchText2 = this.switchText1
      this.switchText1 = ev.target.innerText

      this.currencyModel = false
      this.specialModel = false

      // 切换 showEchartBox
      this.showEchart = !this.showEchart
      this.showEchartBox = !this.showEchartBox

      if(this.showEchart){
         // 加载左侧图表
          setTimeout(()=>{
            for(let item of this.currencyData){
              let myChart = echarts.init(document.querySelector('#echart' + item.leftechartSource.Id))
              myChart.setOption(item.leftechartSource)
            }
          })
      }
    },

    //专题点击展示
    specialclick(ev,url){
      $('.iframeBox').attr('src',url)
    },

    // 时间转换 
    // getTimeStamp(time){
    //   return new Date(time).getTime()
    // },

    // 清空 通用
    clearScrollChartSubmit(){
      this.scrollChartFormData.chartName = ''
      this.scrollChartFormData.chartId = ''
      this.scrollChartFormData.currencyOptionsVal = ''
      this.scrollChartFormData.chartLabel = []
    },

    // 选择图表
    scrollChartBoxClick(ev, type){
      $(ev.currentTarget).addClass('shadow').siblings().removeClass('shadow')
      this.scrollChartFormData.chartType = type
      this.clearScrollChartSubmit()
    },

    // 新增通用 提交
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
              let data = this.scrollChartFormData

              addEchart(data).then(res =>{

                if(res.code == 'SYS.200'){
                  this.$message.success('新增成功!' )
                  this.getEchartsMap()
                  this.showLoading = true

                  // 加载左侧图表
                  setTimeout(()=>{
                    for(let item of this.currencyData){
                      let myChart = echarts.init(document.querySelector('#echart' + item.leftechartSource.Id))
                      myChart.setOption(item.leftechartSource)
                    }
                    this.showLoading = false
                  },500)

                  this.clearScrollChartSubmit()
                  this.$refs[scrollChartFormData].resetFields()
                }else{
                  this.$message.error('新增失败!' )
                }

              }).catch(res=>{
                this.$message.error('新增失败!' )
              })
              
            }).catch(res=>{
              this.$message.error('提交失败!' )
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

    // 专题修改
    specialEdit(id){
        this.specialChange = false
        if(!this.showEchart){
          this.specialTitle = '修改专题'
          this.specialBtnText = '修改'
          this.specialModel = true
          setTimeout(()=>{
            $('.specialModel').animate({margin:'16% auto'},200,"linear")
          })
        }

        for(let item of this.specialData){
          if(id == item.id){
            this.specialFormData.chartName   = item.chartName
            this.specialFormData.urlAddress = item.urlAddress
            this.specialFormData.id = id
          }
        }
    },

    //专题删除
    specialDelet(id){
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        let data = {id: id}
        deleteEchart(data).then(res => {
          if(res.code == 'SYS.200'){
            this.$message.success('删除成功') 
            this.getSpecialMap()
            
          }else{
            this.$message.error('删除失败')
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    },

    // 新增按钮
    specialAdd(){
        if(this.showEchart){
          this.currencyModel = true
          setTimeout(()=>{
            $('.currencyModel').animate({margin:'10% auto'},200,"linear")
            for(let item of this.currencyAddData){
              let myChart = echarts.init(document.querySelector('#' + item.Id))
              myChart.setOption(item)
            }
          })
        }else{
          this.specialTitle = '新增专题'
          this.specialBtnText = '新增'
          this.specialChange = true
          this.specialModel = true
          setTimeout(()=>{
            $('.specialModel').animate({margin:'16% auto'},200,"linear")
          })
        }
    },

    // 新增通用 下拉框
    currencyOptionsChange(){
      this.scrollChartFormData.chartName = this.scrollChartFormData.currencyOptionsVal
      for(let item of  this.currencyOptions){
        if(item.functionInterfaceName == this.scrollChartFormData.currencyOptionsVal){
          this.scrollChartFormData.chartId = item.id
        }
      }
    },

    //新增专题 提交
    specialSubmit(specialFormData){
      this.$refs[specialFormData].validate((valid) => {

        if(valid){
          this.$confirm('确定要提交吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then((res)=>{
            let data = this.specialFormData
            delete this.specialFormData.chartLabel

            if(this.specialChange){
              delete this.specialFormData.id

              addEchart(data).then((res)=>{
                if(res.code == 'SYS.200'){
                    this.$message.success('新增成功!' )
                    this.getSpecialMap()
                    $('.specialModel').animate({margin:'0% auto',opacity:'.5',opacity:'.2'},200,"linear",()=>{
                      this.specialModel = false
                    })
                }else{
                    this.$message.error('新增失败!' )
                }
              })
            }else{
              editEchart(data).then((res)=>{
                if(res.code == 'SYS.200'){
                    this.$message.success('修改成功!' )
                    this.getSpecialMap()
                    $('.specialModel').animate({margin:'0% auto',opacity:'.5',opacity:'.2'},200,"linear",()=>{
                      this.specialModel = false
                    })
                }else{
                    this.$message.error('修改失败!' )
                }
              })
            }

          }).catch(res=>{
            this.$message.error('提交失败!' )
          })
        } else {
          this.$message.error('请将信息填写正确')
          return false;
        }
      })
    },

    // 关闭新增
    close(){
      if(this.showEchart){
          $('.currencyModel').animate({margin:'0% auto',opacity:'.5',opacity:'.2'},200,"linear",()=>{
            this.currencyModel = false
            this.clearScrollChartSubmit()
          })
        }else{
          $('.specialModel').animate({margin:'0% auto',opacity:'.5',opacity:'.2'},200,"linear",()=>{
            this.specialModel = false
          })
        }
    },

    handleClose(tag) {
      if(this.showEchart){
        this.scrollChartFormData.chartLabel.splice(this.scrollChartFormData.chartLabel.indexOf(tag), 1);
      }else{
        this.specialFormData.chartLabel.splice(this.specialFormData.chartLabel.indexOf(tag), 1);
      }
    },

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

    // 收起箭头
    takeUp(){

      this.take_Up = !this.take_Up

      for(let item of this.rightIdList){
          item.key.clear()
          this.$nextTick(()=>{
            item.key.setOption(item.val)
            item.key.resize()
          })
      }


      if(this.take_Up){
        $('#left div').css('display', 'block')
        $('#left').width(322)
        $('.takeUp').css('left','322px')
        $('.white').css('padding','0')
        $('#right').css({'width':'82%', 'padding':'10px'})
        // $('.zoomBox').css({'width':'32%','height':'29.6%'})
        this.$emit('parent_takeUp',true)
        this.siblingsDiv ? this.echartItem.val.dataZoom.show = false : '' //显示缩放条
        
      }else{
        // $('.zoomBox').css({'width':'32%','height':'31%'})
        $('#left div').css('display', 'none')
        $('#right').css({'width':'100%','padding':0})
        $('.white').css('padding','4px')
        this.$emit('parent_takeUp',false)
        
        if(this.siblingsDiv){
          this.isZoom ? this.echartItem.val.dataZoom.show = true : this.echartItem.val.dataZoom.show = false //显示缩放条
        }
      }
    },

    // 切换图表类型
    cli(ev){
      var echatsDropBox = $(ev.target).parents('.echartBox') //获取 drop 盒子
      var toolbarParentBoxId = echatsDropBox.attr('id') //获取盒子上的 id
      var clickItemData = $(ev.target).attr('data-toolbarId')
      // 获取盒子上的 自定义数据
        // let data_echartData = []
        // let attrData =echatsDropBox.attr('data-echartData')
        // data_echartData = JSON.parse(attrData)

        // let resetEcharts = echarts.init(document.querySelector("#" + toolbarParentBoxId))
        // resetEcharts.clear() //清除绘制内容，实例可用

        // if(clickItemData == 'pie'){
        //   delete data_echartData["xAxis"]
        //   delete data_echartData["yAxis"]

        //   data_echartData.series[0].type = 'pie'

        //   data_echartData.color = ['#4A7391','#51D6C2','#7A9FC3','#2DC8AC','#244776','#00bade']

        // }else if(clickItemData == 'bar'){
        //   lineOrBar('bar', data_echartData)

        // }else if(clickItemData == 'line'){
        //   lineOrBar('line', data_echartData)
        // }

        if(clickItemData == 'delete'){
          let parentBox = $(ev.target).parents('.toolbarBtn')
          parentBox.removeAttr('style')
          parentBox.siblings('.corner').removeAttr('style')
          parentBox.siblings('.echartBox').removeAttr('id')
          parentBox.siblings('.echartBox').removeAttr('data-echartdata')
          parentBox.siblings('.echartBox').removeAttr('_echarts_instance_')
          parentBox.siblings('.echartBox').removeClass('rightDivHover') 
          parentBox.siblings('.echartBox').removeClass('rightDivHoverDrog') 
          parentBox.siblings('.echartBox').empty()

          this.isZoom ? this.siblingsDiv.css('display','block') : ''
          $('.zoomBox').css({'width':'31%','height':'29.6%'})
          for(let item of this.rightIdList){
            this.$nextTick(()=>{
              item.key.resize()
            })
          }
          this.isZoom = false
        }
      },

      // 双击缩放
      zoom(ev){
        let echartsBoxId = $(ev.target).parents('.echartBox').attr('id') //当前 echart 的 id
        let zoomBox = $(ev.target).parents('.zoomBox') //缩放的 div
        this.siblingsDiv = zoomBox.siblings().not('.takeUp2') //当前点击元素的兄弟元素
        
         //获取当前 echart 实例
        for(let item of this.rightIdList){
           if(echartsBoxId === item.id){
             this.echartItem = item
           }
          this.$nextTick(()=>{
            item.key.resize()
          })
        }

        this.echartItem.zoom = !this.echartItem.zoom

        if(this.echartItem.zoom === true){
          zoomBox.css({'width':'99.8%','height':'99%'})
          
          this.echartItem.val.grid[0] = {"x": "4%", "y": "20%", "width": "94%", "height": "70%"}
          this.echartItem.val.legend.show = true
          this.echartItem.val.xAxis.show = true
          !this.take_Up ? this.echartItem.val.dataZoom.show = true :  this.echartItem.val.dataZoom.show = false //显示缩放条
          
          // 当  X 轴线的数据 大于 指定数值时， X 轴旋转 40° 以保证多数据情况下  将 X 轴展示完整
          if(this.echartItem.val.xAxis.data .length > 10){
            this.echartItem.val.xAxis.axisLabel = {"interval":0,"rotate":40}
          }
          
        }else{
          zoomBox.css({'width':'31%','height':'30%'})
          this.echartItem.val.grid[0] = {"x": "10%", "y": "32%", "width": "86%", "height": "60%"}
          this.echartItem.val.legend.show = false
          this.echartItem.val.xAxis.show = false
          this.echartItem.val.dataZoom.show = false //显示缩放条
        }
        this.echartItem.key.setOption(this.echartItem.val)
        // this.echartItem.key.resize()

        this.isZoom = !this.isZoom
        
        this.isZoom ? this.siblingsDiv.css('display','none') : this.siblingsDiv.css('display','block')


      }

    },
    computed: {
      // 搜索框模糊查询
      searchFuzzyQueryList() {
        var search = this.searchInput;
        if (search) {
          return this.searchNameList.filter((item)=>item.indexOf(search) > -1)
        }
      },
      getCount() {
        return this.$store.state.count
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">

.white {
  .search,.search2{
    border: 2px solid #fff;
    background-color: #363636;
    border-radius: 0 10px 10px 0;
  }
  .search2{
    width: 210px;
  }
  .search input ,.search2 input{
    padding: 1px 0 0 16px;
  }
  .search input::placeholder ,.search2 input::placeholder{
    color: #fff;
    font-size: 16px;
  }

  #left {
    background-color: #363636;

    // 专题
    .left_specialBox{
      div{
        height: 22px;
      }
    }
  }


  #left div.echat:hover {
    box-shadow: inset 1px 0px 20px 3px #888890;
  }


  #left, #right {
    font-size: 20px;
    text-align: center;
  }

  #right{
    border-top: 1px dotted #bcbec2;
    background-color: #ebeef3;
  }

  .zoomBox {
    border-radius: 10px;
    div{
      border-radius: 10px;
    }
    .echartBox{
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      :hover{
        box-shadow: 5px 12px 20px rgba(36,37,38,0.13);
        transition: box-shadow 0.25s ease, transform 0.25s ease;
      }
    }
  }

  .rightDivHover{
    background-color: #f7f8fa;
  }

  .rightDivHoverDrog{
    background-color: #f7f8fa;
  }

  .toolbarBtn>i{
    color: #666;
  }
  .toolbar{
    border-radius: 7px;
    background-color: #fff; 
  }
  .toolbar div i{
    font-size: 18px;
    color: #666;
  }
  .toolbar div:hover{
    background-color: #99999954;
  }

  .toolbar div:nth-child(1):before{
    border-right: 7px solid #fff;
  }

  .switch{
      background-color: #9b9b9b;
      top: -2px;
      border: 2px solid #fff;
      border-radius: 10px 0 0 10px;
    span{
          font-size: 14px;
          width: 55px;
          left: 7px;
          color: #333;

          i{
            color: #333;
            font-size: 14px;
            padding: 0 2px;
          }
    }
    span:last-child{
      top: 35px;
      left: 0px;
      width: 59px;
      height: 24px;
      line-height: 24px;
      background-color: #9b9b9b;
      border: 1px solid #fff;
      border-radius: 8px;
    }
  }

  // 收起箭头
  .takeUp,.takeUp2{
    background-color: #36363669;
  }

  // 通用模态框
  .currencyModel, .specialModel{
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  
  .title{
    color: #666;
  }

  .close{
    color: #666;
    top: 10px;
    right: 12px;
  }

  .specialForm,.scrollChartFrom{
    .el-form-item__label{
        color: #333;
    }
  }
}

.currencyModel{
  .chartContent{
    .scrollChartBox{
      border-radius: 4px;
      p{
        color: #585858;
      }
      
    }
  }
  .chartContent::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    background: #4e4e4e;
  }

  .chartContent::-webkit-scrollbar-track {/*滚动条里面轨道*/
    background: #999;
  }

  .scrollChartSubmitBtn{
    background-color: #3faceb;
    border-radius: 10px;
  }
  
  }
  .specialAddBtn{
    background-color: #3faceb;
    border-radius: 10px;
  }
}

.blue {
  .search,.search2{
    border: 1px solid #446da8;
    background-color: #17283f;
  }
  .search2{
    width: 210px;
  }
  .search input ,.search2 input{
    padding: 2px 0 0 16px;
  }
  .search input::placeholder ,.search2 input::placeholder{
    color: #fff;
    font-size: 16px;
  }
  #left {
    background-color: #17283f;
    border-right: 1px solid #446da8;

    // 专题
    .left_specialBox{
      div{
        height: 20px;
      }
    }
  }


  #left div.echat:hover {
    box-shadow: inset 1px 0px 20px 3px #888890;
  }


  #left, #right {
    font-size: 20px;
    text-align: center;
  }

  #right{
    width: 83%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 6px;
    overflow: auto;
    padding-bottom: 2%;
  }

  .rightDivHover{
    background-color: #17283f;
    border: 1px solid #446da8;
  }

  .rightDivHoverDrog{
    background-color: #17283f;
    border: 1px solid #446da8;
  }

  .toolbarBtn>i{
    color: #fafafa;
  }
  .toolbar{
    border: 1px solid #3a537c;
    background-color: #17283f; 
  }
  .toolbar div i{
    font-size: 18px;
    color: #fafafa;
  }

  .toolbar div:hover{
    background-color: rgb(0,157,205);
  }

  .toolbar div:nth-child(1):before{
    border-right: 7px solid #3a537c;
  }

  .switch{
    background-color: #132E50;
    top: -1px;
    border: 1px solid #446DA8;
    border-right: 0;
    span{
      font-size: 16px;
      width: 60px;
      left: 4px;
      color: #fff;

      i{
        color: #ABB5C0;
        font-size: 16px;
        padding: 0 4px;
      }
    }
    span:last-child{
      top: 33px;
      left: -1px;
      width: 52px;
      padding-left: 6px;
      text-align: left;
      background-color: #132E50;
      border: 1px solid #446DA8;
      border-top: 0;
    }

  }

  // 收起箭头
  .takeUp,.takeUp2{
    background-color: #0b4cc54a;
  }

  // 通用模态框
.currencyModel, .specialModel{
  background-image: url('assets/specialBack.png');

  .specialAddBtn{
    background-image: url('../src/assets/specialBtn.png');
  }

  .title{
    color: #fff;
  }

  .close{
    color: #fff;
    top: 5px;
    right: 6px;
  }

  .specialForm,.scrollChartFrom{
    .el-form-item__label{
        color: #fff;
    }
  }
  
  .scrollChartFrom{
    margin-top: 0;
    .el-form-item__content{
      width: 612px;
    }
  }

  .chartContent{
    .scrollChartBox{
      p{
        color: #fff;
      }
    }
  }

  .chartContent::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    background: #00BADE;
  }

  .chartContent::-webkit-scrollbar-track {/*滚动条里面轨道*/
    background: #244776;
  }

  .scrollChartSubmitBtn{
      background-image: url('assets/specialBtn.png');
    }
  }
}
</style>
