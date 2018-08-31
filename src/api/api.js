import axios from 'axios';
import Qs from 'qs';

// 登录
// export const requestLogin = params => { return axios.post(`${base}/zhac/account/login`, Qs.stringify(params)).then(res => res.data)}

// 通用图表数据（本地）
// export const getEchartsTest = params => { return axios.get(`../../static/json/echarts.json`,{}).then(res => res.data)}

// 新增通用图表 Model （表配置数据）
export const requestCurrencyAddData = () => { return axios.get(`../../static/json/currencyAddData.json`).then(res => res.data)};


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  通用 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // 

// （获取）图表
export const getEcharts = params => { return axios.get(`/biview/index`, { params: params }).then(res => res.data)};

// （查询）可添加数据
export const selectEchart = params => { return axios.get(`/biview/optionalview`, { params: params }).then(res => res.data)};

// （新增）图表
export const addEchart = params => { return axios.post(`/biview/addview`, params).then(res => res.data)};


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  专题 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // 

// 专题图表数据
export const requestPowerBi = params => { return axios.get(`../../static/json/powerBi.json`,{}).then(res => res.data)};

// （修改）专题
export const editEchart = params => { return axios.post(`/biview/update`, params).then(res => res.data)};

// （删除）专题
export const deleteEchart = params => { return axios.get(`/biview/delete`, { params: params }).then(res => res.data)}



