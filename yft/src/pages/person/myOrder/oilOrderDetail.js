/**
 *  油卡充值订单详情
 */

import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import ImageConfig from '../../../assets/imageConfig';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import Fetch from '../../../components/fetch';

const width = window.screen.width > 640 ? 640 : window.screen.width;

export default class OilOrderDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
        this.orderCode = this.props.history.location.state ?this.props.history.location.state.orderCode : '';//订单编码
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

    //获取详情数据
    _getData(){
        Toast.loading('加载中...', 0);
        Fetch.post("d-app/API/order/oilProdDetail",{
            orderCode: this.orderCode
        }).then((result)=>{
            Toast.hide();
            console.log(result);
            {/*油卡信息*/}
            let cardInfo = {
                totalPrice: result.totalPrice,
                cardList:  {
                    prodName: result.prodName,
                    cardNo: result.cardNo,
                    prodPrice: result.prodPrice,
                },
            };
            this.oilCardInfo._getData(cardInfo);

            {/*订单信息*/}
            let OrderInfo = {
                payTime: result.payTime,    //	付款时间
                orderCode: result.orderCode,  //	订单编码
                createTime: result.createTime, //	下单时间
            };
            this.orderInfo._getData(OrderInfo);
        }).catch((err)=>{

        })
    }

    render(){
        const totalHeight = document.documentElement.clientHeight;
        return(
            <div style={{width: width,height:totalHeight,paddingTop:10}}>
                {/*油卡信息*/}
                <OilCardInfo
                    history={this.props.history}
                    ref={ref => this.oilCardInfo = ref}
                    payStatus = { this.payStatus }
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

// 油卡信息
class OilCardInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            dynamicData:{
                totalPrice: '',
                cardList:  {
                    name:'',
                    cardNo: '',
                    prodPrice: ''
                },
            }
        };
    }

    // 获取数据
    _getData(cardInfo){
        this.setState({dynamicData: cardInfo})
    }

    //判断中石油还是中石化
    _judgment(num){
        if( num[0] === '1'){
            return ImageConfig.Card_icon_1
        } else {
            return ImageConfig.Card_icon_2
        }
    }

    //显示不同支付状态
    _showPayStatus(){
        let payStatus = this.props.payStatus;
        let text = '';
        if(payStatus === 1){
            text = '未付款';
        }else  if(payStatus === 2){
            text = '付款中';
        }else  if(payStatus === 3){
            text = '已付款';
        }else  if(payStatus === 4){
            text = '已退款';
        }
        return text;
    }

    render(){
        let { totalPrice, cardList } = this.state.dynamicData;
        return(
            <div
                className="bg"
                style={{width: width,marginBottom:10}}
            >
                <div
                    className="flex flex-center"
                    style={{flexDirection:'column',fontSize: 20,color:"#444444",paddingTop: '1.6rem',paddingBottom:'1.6rem'}}
                >
                    <div style={{fontSize: 14,color:"#444"}}>
                       加油卡充值
                    </div>

                    <div style={{fontSize: 20,color:"#444",marginTop:'0.5rem'}}>
                        { totalPrice }
                    </div>

                    <div style={{fontSize: 14,color: this.props.payStatus === 1 ? "#FE7C4C" :'#999',marginTop:'0.5rem'}}>
                        {
                            this._showPayStatus()
                        }
                    </div>

                </div>

                <div style={{padding: 12,paddingTop:0}}>
                    <div style={{fontSize: 12,color:"#333",paddingBottom:10}}>
                        <i
                            className='iconfont icon-youqiaxinxi'
                            style={{fontSize: 15}}
                        />
                        <span style={{marginLeft:6}}>油卡信息</span>
                    </div>

                    {/*油卡信息*/}
                    <div
                        className="flex flex-center"
                        style={{ width: '100%', color: '#fff'}}
                    >
                        <div
                            className="flex flex-space-between vipDetail-padding linear-gradient"
                            style={{ flexDirection:'column', width: '15.65rem', height:'6.5rem',borderRadius:5}}
                        >
                            <div className="flex flex-dir flex-align-items" style={{ marginBottom: 12 }}>
                                <img
                                    style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
                                    src={this._judgment(cardList.cardNo)}
                                    alt=" "
                                />
                                <div className="nowrap" style={{ fontSize: 14, color: '#fff', marginRight: 20, width:'80%' }}>
                                    {cardList.prodName}
                                </div>
                            </div>

                            <div style={{ color: '#fff', fontSize: 18 }}>{cardList.cardNo}</div>

                            <div style={{ color: '#fff', fontSize: 12 ,textAlign:'right'}}>{'面额：'+cardList.prodPrice+'元'}</div>
                        </div>
                    </div>

                </div>

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
                <div style={{fontSize: 12,color:"#333",paddingBottom:10}}>
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
                                <span style={{fontSize:12, color:  '#909090'}}>
                                    { item.name }
                                </span>

                                <span style={{fontSize:12, color:  '#909090'}}>
                                    { this._showValue(index) }
                                </span>
                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    }
}
