import util from '../util.js'
import {getEcharts} from '../api'
export const getEchartsMap = () => {

    let data = {userId: util.getParam('userId') ,type:'c'}
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
                        "tooltip" : {
                            "trigger" : 'axis',
                            "showDelay" : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                            "axisPointer" : { // 坐标轴指示器，坐标轴触发有效
                                "type" : 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
      // if(err.response.data.status === 500){
        this.showLoading = true
      // }
    })
  }
