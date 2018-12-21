/**
 *  生活消费订单详情
 */

import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import ImageConfig from '../../../assets/imageConfig';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import Fetch from '../../../components/fetch';

const width = window.screen.width > 640 ? 640 : window.screen.width;

export default class LiveDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        };
        this.rechargeType = this.props.history.location.state ?this.props.history.location.state.rechargeType : 2;//充值类型（2-商家买单，3-商品买单）
        this.orderCode = this.props.history.location.state ?this.props.history.location.state.orderCode : '';//订单编码
        this.prodPrice = this.props.history.location.state ?this.props.history.location.state.prodPrice : '';//应付金额
        this.shopsId = this.props.history.location.state ?this.props.history.location.state.shopsId : 0;//商户Id
        this.showPayTime = this.props.history.location.state && this.props.history.location.state.showPayTime ? this.props.history.location.state.showPayTime : true;
        console.log(this.showPayTime)
    }
    componentWillMount(){
        document.title = '订单详情';
        document.body.scrollIntoView();
    }

    componentDidMount() {
        Toast.loading('加载中...', 0);
        this._getData();
    }

    //获取详情数据
    _getData(){
        Fetch.post("d-app/API/order/consumerOrderDetail",{
            orderCode: this.orderCode
        }).then((result)=>{
            Toast.hide();
            if(result){
                console.log(result)
                let prodInfo = {
                        prodName: result.prodName,
                        picUrl: result.picUrl,
                        prodPrice: result.prodPrice,
                        shopsId: result.shopsId
                };
                let businessInfo = {
                        shopsName: result.shopsName,
                        shopsAddress: result.shopsAddress,
                        shopsTelephone: result.shopsTelephone,
                };
                {/*订单信息*/}
                let OrderInfo = {
                    payTime: result.payTime,    //	付款时间
                    orderCode: result.orderCode,  //	订单编码
                    createTime: result.createTime, //	下单时间
                };

                this.businessProd._getData(prodInfo);
                this.consumeCode._getData(result.consumerCode);
                this.business._getData(businessInfo);
                this.orderInfo._getData(OrderInfo);
            }

        }).catch((err)=>{
        })
    }

    render(){
        const totalHeight = document.documentElement.clientHeight;
        return(
            <div style={{width: width,height:totalHeight,paddingTop:10}}>
                {/*商家产品信息*/}
                <BusinessProd
                    history={this.props.history}
                    ref={ref => this.businessProd = ref}
                    rechargeType = {this.rechargeType}
                />

                {/*消费码*/}
                {
                    this.rechargeType === 3 ?
                        <ConsumeCode
                            ref={ref => this.consumeCode = ref}
                        />
                        :null

                }


                {/*商家信息*/}
                <BusinessInfo
                    history={this.props.history}
                    ref={ref => this.business = ref}
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

// 商家产品信息---跳转到商家详情页
class BusinessProd extends Component{
    constructor(props){
        super(props);
        this.state={
            prodInfo:{
                prodName:'',
                picUrl:'',
                prodPrice:'',
                shopsId: 0
            },
        };
    }

    _getData(prodInfo){
        this.setState({
            prodInfo: prodInfo
        })
    }

    //显示支付状态
    _showPayStatus(payStatus){
        // 支付状态；1，未付款；2，付款中；3，已付款 4，已退款',
        let Text = '';
        if(payStatus === 1){
            Text = '未付款'
        }else if(payStatus === 2){
            Text = '付款中'
        }else if(payStatus === 3){
            Text = '已付款'
        }else if(payStatus === 4){
            Text = '已退款'
        }
        return Text;
    }

    render(){
        let { prodInfo } = this.state;
        return(
            <div
                className="bg"
                style={{height: '4.5rem',width: width,marginBottom:this.props.rechargeType === 3 ?10 : 0}}
                onClick={() => {this.props.history.push('/businessDetail/'+ prodInfo.shopsId)}}
            >
                {
                    this.props.rechargeType === 3 ?
                        <div
                            className='flex flex-dir flex-center flex-space-between'
                            style={{height: '100%',width:'100%',padding:12,color: '#333', fontSize:14}}
                        >

                            {/*左*/}
                            <div
                                className='flex flex-dir flex-center'
                                style={{width:'70%',height:'100%',justifyContent:'flex-start'}}
                            >
                                <div
                                    style={{
                                        width: '4.1rem', height: '3rem',
                                        marginRight: 10 ,
                                    }}
                                >

                                    <img
                                        src={ prodInfo.picUrl ?prodInfo.picUrl : ImageConfig.empty}
                                        alt=""
                                        style={{
                                            width: '100%', height: '100%'
                                        }}
                                    />

                                </div>

                                {prodInfo.prodName }
                            </div>


                            {/*右*/}
                            <div
                                style={{height:'100%'}}
                                className='flex flex-dir flex-center'
                            >
                                <div style={{fontSize: 20, color: '#FD9A75',marginRight:10}}>
                                    { prodInfo.prodPrice }
                                </div>
                                <span className="iconfont icon-youjiantou" style={{ fontSize: 10, color: '##979797' }}/>
                            </div>
                        </div>
                        :
                        <div
                            className="flex flex-center"
                            style={{flexDirection:'column',fontSize: 20,color:"#444444",paddingTop: '1.6rem',paddingBottom:'1.6rem'}}
                        >
                            <div style={{fontSize: 14,color:"#444"}}>
                                到店买单
                            </div>

                            <div style={{fontSize: 20,color:"#444",marginTop:'0.5rem'}}>
                                { prodInfo.prodPrice }
                            </div>

                            <div style={{fontSize: 14,color: this.props.payStatus === 1 ? "#FE7C4C" :'#999',marginTop:'0.5rem'}}>
                                {
                                    this._showPayStatus()
                                }
                            </div>

                        </div>
                }

            </div>
        )
    }
}

// 消费码
class ConsumeCode extends Component{
    constructor(props){
        super(props);
        this.state={
            consumerCode: ''
        };
    }

    _getData(consumerCode){
        this.setState({
            consumerCode: consumerCode
        })
    }

    render(){
        let { consumerCode } = this.state;
        return(
            <div
                className='bg'
                style={{padding: 12,marginBottom:10}}
            >

                <div style={{fontSize: 12,color:"#333",paddingTop:10,paddingBottom:'0.7rem'}}>
                    <i
                        className='iconfont icon-xiaofeima'
                        style={{fontSize: 10}}
                    />
                    <span style={{marginLeft:6}}>消费码</span>
                </div>

                <div style={{paddingLeft:'1rem',paddingBottom:'0.7rem',fontSize:'1rem',color:'#FF8558'}}>
                    { consumerCode }
                </div>
            </div>
        )
    }
}

// 商家信息
class BusinessInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            businessInfo:{
                shopsName:'',
                shopsAddress:'',
                shopsTelephone:''
            },
        };
    }

    _getData(businessInfo){
        this.setState({
            businessInfo: businessInfo
        })
    }

    render(){
        let { businessInfo } = this.state;
        return(
            <div
                className='bg'
                style={{padding: 12,marginBottom:10}}
            >
                <div style={{fontSize: 12,color:"#333",paddingTop:10,paddingBottom:'0.7rem'}}>
                    <i
                        className='iconfont icon-shangjia'
                        style={{fontSize: 16}}
                    />
                    <span style={{marginLeft:6}}>商家信息</span>
                </div>

                <div
                    className="flex flex-center flex-dir flex-space-between"
                    style={{width: '100%',paddingLeft:30,paddingBottom:10}}
                >
                    <div>
                        {/*店铺名*/}
                        <span style={{fontSize:14,fontWeight:'bold',color:'#333333'}}>
                            { businessInfo.shopsName }
                        </span>

                        {/*地址*/}
                        <div style={{marginTop:15}}>
                            <span className='iconfont icon-weizhi' style={{color:'#CACACA',fontSize:10}}/>

                            <span style={{fontSize:12,color:'#999', marginLeft: 6}}>
                                { businessInfo.shopsAddress }
                            </span>

                        </div>

                    </div>


                    {/*电话*/}
                    <a
                        // className="flex flex-center flex-dir"
                        style={{height: 40,borderLeftColor:'E6E6E6',borderLeftWidth:1}}
                        href={`tel: ${ businessInfo.shopsTelephone }`}
                    >
                        <div
                            className='iconfont icon-dianhua'
                            style={{fontSize:20,marginLeft: 15 ,marginRight:15,color:'#FD9A75'}}
                        />
                    </a>

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
        if (this.props.payTime){
            this.infoData = [
                {name: '订单编码'},
                {name: '下单时间'},
                {name: '付款时间'},
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
        console.log(orderInfo)
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

