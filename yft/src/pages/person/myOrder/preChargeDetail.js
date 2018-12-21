/**
 *  预存充值订单详情
 */

import React, { Component } from 'react';
import { Toast,Modal } from 'antd-mobile';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import Fetch from '../../../components/fetch';

const ScreenWidth = window.screen.width > 640 ? 640 : window.screen.width;

export default class PreChargeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preOrderAmount: ''//预存金额
        };
        this.orderCode = this.props.history.location.state ?this.props.history.location.state.orderCode : '';//订单编码
        this.origPrice = this.props.history.location.state ?this.props.history.location.state.origPrice : '';//需返还总金额
        this.payStatus = this.props.history.location.state ?this.props.history.location.state.payStatus : '';	//支付状态；1，未付款；2，付款中；3，已付款 4，已退款',
        this.showPayTime = this.props.history.location.state ? this.props.history.location.state.showPayTime : true;

    }
    componentWillMount(){
        document.title = '订单详情';
        document.body.scrollIntoView();
    }

    componentDidMount() {
        this._getData();
    }

    _getData(){
        Toast.loading('加载中...', 0);
        console.log(this.orderCode)

        Fetch.post("d-app/API/preOrder/preOrderDetail",{
            orderCode: this.orderCode
        }).then((result)=>{
            console.log(result)
            Toast.hide();
            if(result){
                this.returnRecord._getData(result.preOrderAmount,result.prodName,result.records);
                {/*订单信息*/}
                let OrderInfo = {
                    payTime: result.payTime,    //	付款时间
                    orderCode: result.orderCode,  //	订单编码
                    createTime: result.createTime, //	下单时间
                };
                let BtnInfo = {
                    prodName: result.prodName,
                    preOrderAmount: result.preOrderAmount,
                    orderCode: result.orderCode,
                };
                this.orderInfo._getData(OrderInfo);
                this.payStatus === 1 ? this.purchaseBtn._getData(BtnInfo) : null;
            }

        }).catch((err)=>{
            console.log(err)
        })
    }

    render(){
        const totalHeight = document.documentElement.clientHeight;
        return(
            <div style={{width: ScreenWidth,height:totalHeight,paddingTop:10}}>
                {/*返还记录*/}
                <ReturnRecord
                    history={this.props.history}
                    ref={ref => this.returnRecord = ref}
                    origPrice = { this.origPrice }
                />

                {/*订单信息*/}
                <OrderInfo
                    ref={ref => this.orderInfo = ref}
                    payStatus = {this.payStatus }
                    payTime={this.showPayTime}
                />

            </div>
        )
    }
}

// 返还记录
class ReturnRecord extends Component{
    constructor(props){
        super(props);
        this.state={
            dynamicData:{
                preOrderAmount: '',
                recordList: []
            }
        };
    }

    _getData(preOrderAmount,prodName,records){
        let Data = {
            preOrderAmount: preOrderAmount,
            prodName: prodName,
            recordList: records
        };
        this.setState({
            dynamicData: Data
        })
    }

    /**
     * giveStatus --- 1.已返还，2.未返还
     * **/
    render(){
        let { preOrderAmount, prodName, recordList } = this.state.dynamicData;
        return(
            <div
                className="bg"
                style={{width: ScreenWidth,marginBottom:10}}
            >
                <div
                    className="flex flex-center"
                    style={{flexDirection:'column',fontSize: 20,color:"#444444",paddingTop: '1.6rem',paddingBottom:'1.6rem'}}
                >
                    { preOrderAmount?preOrderAmount:'0.00' }

                    <div style={{fontSize: 12,color:"#999",marginTop:'0.5rem'}}>
                        { prodName }
                    </div>
                </div>


                {
                    (!recordList || recordList.length<=0) ?
                        null
                        :
                        <div style={{padding: 12}}>
                            <div style={{fontSize: 12,color:"#333",paddingBottom:10}}>
                                <i
                                    className='iconfont icon-wangfanjilu'
                                    style={{fontSize: 10}}
                                />
                                <span style={{marginLeft:6}}>返还记录</span>
                            </div>

                            <ul>
                                {
                                    recordList.map((item, index) => (
                                        <li
                                            key={index}
                                            className="details-item flex flex-space-between"
                                            style={{fontSize:12, color: Number(item.giveStatus) === 1 ? '#909090': '#F86936'}}
                                        >
                                            <span
                                                style={{color: Number(item.giveStatus)  === 1 ? '#909090': '#F86936'}}
                                            >
                                                { item.num }
                                            </span>
                                            <span style={{color: Number(item.giveStatus)  === 1 ? '#909090': '#F86936'}}>
                                                { item.giveAmount }
                                            </span>
                                            <span style={{color: Number(item.giveStatus)  === 1 ? '#909090': '#F86936'}}>
                                                { item.giveTime }
                                            </span>
                                            <span style={{color: Number(item.giveStatus)  === 1 ? '#909090': '#F86936'}}>
                                                { Number(item.giveStatus)  === 1 ? '已返还':'未返还'}
                                            </span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                }
            </div>
        )
    }
}

// 订单信息
class OrderInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            payTime: '',    //	付款时间
            orderCode: '',  //	订单编码
            createTime: '', //	下单时间
        };
        if (this.props.payTime) {
            this.infoData = [
                { name: '订单编码' },
                { name: '下单时间' },
                { name: '付款时间' },
            ];
        } else {
            this.infoData = [
                { name: '订单编码' },
                { name: '下单时间' },
            ];
        }

    }

    // 获取数据
    _getData(orderInfo){
        this.setState({
            payTime: orderInfo.payTime,    //	付款时间
            orderCode: orderInfo.orderCode,  //	订单编码
            createTime: orderInfo.createTime, //	下单时间
        })
    }

    // 时间处理
    _manageTime(Time){
        if(Time.length>=15){
            Time = Time.substr(0,Time.length-3)
        }
        let cloneTime = Time.split(' ')[0].split('-');
        let befTime = cloneTime[0] + '.' + cloneTime[1] + '.' + cloneTime[2];
        if(Time.split(' ')[1]){
            return befTime + ' ' + Time.split(' ')[1]
        }else{
            return befTime
        }
    }

    _showValue(index){
        let { payTime, orderCode, createTime} =this.state;
        if(index == 0){
            return orderCode
        }
        if(index == 1 && createTime){
            return this._manageTime(createTime)
        }
        if(index == 2 && payTime){
            return this._manageTime(payTime)
        }
    }

    render(){

        return(
            <div
                className='bg'
                style={{padding: 12}}
            >
                <div style={{fontSize: 12,color:"#333",paddingTop:10,paddingBottom:10}}>
                    <i
                        className='iconfont icon-dingdanxinxi'
                        style={{fontSize: 14}}
                    />
                    <span style={{marginLeft:6}}>订单信息</span>
                </div>

                <ul style={{paddingLeft:'1.25rem'}}>
                    {
                        this.infoData.map((item, index) => (
                            <li
                                key={index}
                                className="flex flex-space-between"
                                style={{paddingTop:10,paddingBottom:10}}
                            >

                                {/*未支付&付款中状态没有付款时间*/}
                                <span style={{fontSize:12, color:  '#909090'}}>
                                    { (this.props.payStatus === 1 || this.props.payStatus === 2 && index === 2 )? null : item.name }
                                </span>

                                <span style={{fontSize:12, color:  '#909090'}}>
                                    { (this.props.payStatus === 1 || this.props.payStatus === 2 && index === 2 )? null : this._showValue(index) }
                                </span>

                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    }
}

// 付款按钮
class PurchaseBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preOrderAmount: '',
            shopsName: '',
        }
    }

    //获取数据
    _getData(BtnInfo){
        this.sestState({
            preOrderAmount: BtnInfo.preOrderAmount,
            shopsName: BtnInfo.shopsName,
        })
    }



    //提交支付
    onSubmit() {
        Toast.loading('加载中...', 0);
        Fetch.post('/d-app/API/pwd/pwdIsSettings').then(res => {
            Toast.hide();
            if (res.pwdIsSettings === 2) {
                this.props.ChangeModal(true,this.state.preOrderAmount);
            } else {
                this.props.history.push('/modifyPwd', { pageType: 5 })
            }
        }).catch(err => {
        })
    }

    render(){
        return(
            <div
                className='flex flex-center purchaseBtn-shadow'
                style={{
                    position: 'fixed', bottom:15, right: 0,padding:12,justifyContent:'flex-end',
                    height:'2.5rem',backgroundColor: '#fff',alignItems:'center',width: '100%'
                }}
            >
                <div
                    className="flex flex-center liveOrder-border"
                    style={{height:'1.6rem',marginRight:12,width:'5rem',alignItems:'center'}}
                    // onClick={() =>this._cancelOrder()}
                    onClick={() =>this.props.CancelModal()}
                >
                    <span
                        style={{
                            color:'#FB9873',fontSize:15,textAlign:'center',
                        }}
                    >
                        取消订单
                    </span>
                </div>

                <div
                    className="flex flex-center liveOrder-border"
                    style={{
                        height:'1.6rem',alignItems:'center',width:'5rem'
                    }}
                    onClick={() =>this.onSubmit()}
                >
                    <span
                        style={{
                            color:'#FB9873',fontSize:15,textAlign:'center',
                        }}
                    >
                        立即付款
                    </span>
                </div>
            </div>
        )
    }
}