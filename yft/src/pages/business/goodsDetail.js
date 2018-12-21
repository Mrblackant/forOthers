/**
 *  商品详情
 */

import React, { Component } from 'react';
import { Toast ,Carousel } from 'antd-mobile';
import ImageConfig from '../../assets/imageConfig';
import Fetch from '../../components/fetch';
import '../../assets/css/common.css';
import '../../assets/css/main.css';
import WxApi from '../../components/wxApi';

const width = window.screen.width > 640 ? 640 : window.screen.width;
const height =  window.screen.height;

class GoodsDetail extends Component {
    constructor(props) {
        super(props);
        this.dimension = '39.91667';// 用户纬度,默认北京经纬度
        this.longitude = '116.41667'; // 用户经度
        this.prodCode = this.props.match.params.name;//产品id
        this.dimension = 0;
        this.location = 0;
    }

    componentWillMount() {
        document.title = '商品详情';
        document.body.scrollIntoView();
    }

    componentDidMount() {
        Toast.loading('加载中...', 0);
        let locationObj = sessionStorage.cityInfo ;//读取位置信息
        WxApi.config(encodeURIComponent(window.location.href.split('#')[0]));
        if(locationObj){
            this.dimension = JSON.parse(locationObj).dimension;   // 用户纬度
            this.longitude = JSON.parse(locationObj).longitude;   // 用户经度
            this._getData();
        }else{
            setTimeout(() => {
                this._getPosition();//获取位置信息
            }, 1500);
        }
        //获取商品数据
    }

    //获取当前位置
    _getPosition() {
        WxApi.getLocation().then( res =>{
            this.dimension = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            this._getData();
        }).catch((err) =>{
            this.dimension = '39.91667';
            this.longitude = '116.41667';
            this._getData();
        });
    }

    // 获取商品详情
    _getData(){
        Fetch.post("d-app/API/prodLib/getProdLibDetail",{
            dimension: this.dimension ,
            longitude: this.longitude ,
            prodCode: this.prodCode
        }).then((result)=>{
            console.log(result);
            Toast.hide();
            if(result){
                console.log('goods1111');
                WxApi.onShare(result.prodName, window.location.href, ImageConfig.owner_01, '油通宝，一站式服务平台');
                // 商品信息
                let prodData={
                    bannerData: result.images,
                    prodName: result.prodName,
                    prodDesc: result.prodDesc,
                    selledNum: result.selledNum
                };

                // 商家信息
                let busiInfo = {
                    shopsId: result.shopsId,
                    distance: result.distance,
                    shopsAddress: result.shopsAddress,
                    shopsName: result.shopsName,
                    shopsTelephone: result.shopsTelephone
                };
                this.describe._renderData(prodData);  //通知商品描述模块获取数据
                this.busiInfo._renderData(busiInfo); //通知商家信息模块获取数据
                this.purchaseBtn._getPrice(result.prodPrice, result.shopsName,result.shopsId,result.prodName,); //通知付款按钮模块获取数据
                this.instructions._renderData(result.prodInstructions);//使用说明
                this.goodsIntro._renderData(result.prodDtl);//产品介绍
            }
        }).catch((err)=>{
            Toast.info(err.errDesc)
        })
    }

    render() {
        return (
            <div style={{width:'100%',height:height+54}}>
                {/*商品描述*/}
                <Describe
                    history={this.props.history}
                    ref={ref => this.describe = ref}
                />

                {/*使用说明*/}
                <Instructions
                    ref={ref => this.instructions = ref}
                />

                {/*商家信息*/}
                <BusiInfo
                    ref={ref => this.busiInfo = ref}
                    history={this.props.history}
                />

                {/*产品介绍*/}
                <GoodsIntro
                    ref={ref => this.goodsIntro = ref}
                />

                {/*付款按钮*/}
                <PurchaseBtn
                    history={this.props.history}
                    ref={ref => this.purchaseBtn = ref}
                    prodCode = {this.prodCode}
                />

            </div>

        )
    }
}

// 付款按钮
class PurchaseBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prodPrice: '',
            shopsName: '',
            prodName: '',
            shopsId: 0
        };
    }

    // 获取价格
    _getPrice(prodPrice,shopsName,shopsId,prodName){
        this.setState({
            prodPrice: prodPrice,
            shopsName: shopsName,
            shopsId: shopsId,
            prodName: prodName
        })
    }

    // 买单
    _confirmPurchase(){
        let { shopsName, prodPrice,shopsId,prodName } = this.state;
        if (localStorage.getItem('openId')) {
            if( !JSON.parse(localStorage.getItem('PersonalInfo'))){
                Toast.loading('加载中...', 0);
                this.getUserInfo();
            }else{
                this.props.history.push('/confirmPurchase',{
                        type: 2,//商品买单
                        goodsName: prodName,
                        goodsPrice: prodPrice,
                        prodCode: this.props.prodCode,
                        shopsId: shopsId,// 商户id
                        shopsName: shopsName
                    }
                )
            }
        } else Fetch.reLoginFunc();

    }

    // 获取个人信息
    getUserInfo() {
        let { shopsName,shopsId, prodPrice } = this.state;

        Fetch.post('/d-app/API/user/userInfo', {
            openId: localStorage.getItem('openId')
        }).then((result) => {
            Toast.hide();
            if (result) {
                localStorage.setItem('PersonalInfo', JSON.stringify(result));
                this.props.history.push('/confirmPurchase',{
                        type: 2,//商品买单
                        goodsName: this.props.prodName,
                        goodsPrice: prodPrice,
                        prodCode: this.props.prodCode,
                        shopsId: shopsId,// 商户id
                        shopsName: shopsName
                    }
                )
            }
        }).catch((err) => {
            console.log(err)
        });

    }

    render(){
        return(
            <div
                className='flex flex-center flex-space-between'
                style={{
                    position: 'fixed', bottom: 0, right: 0,padding:12,
                    height:54,backgroundColor: 'rgba(255,255,255,0.8)',alignItems:'center',width: '100%'
                }}
                onClick={() => this._confirmPurchase()}
            >
                <div
                    className="flex flex-center"
                    style={{height:40,paddingLeft:12}}
                >
                        <span
                            style={{
                                color:'#666',paddingRight:12,
                                fontSize:15,textAlign:'center',
                            }}
                        >
                            金额
                        </span>

                    <span style={{color:'#FF9168',fontSize:20,textAlign:'center',}}>
                            { this.state.prodPrice }
                        </span>
                </div>

                <div
                    className="flex flex-center"
                    style={{
                        height:40,backgroundColor: '#FE7C4C',alignItems:'center',width:'5rem', borderRadius:3
                    }}
                >
                        <span
                            style={{
                                color:'#ffffff',
                                fontSize:15,textAlign:'center',
                            }}
                        >
                            付款
                        </span>
                </div>
            </div>
        )
    }
}

//商品描述
class Describe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prodData: {
                bannerData: [],
                prodName: '',
                selledNum: '',
                prodDesc: ''

            },
            selectedIndex: 0
        };
    }

    // 获取数据
    _renderData(prodData){
        this.setState({prodData: prodData})
    }

    //显示商品图片
    _showPic(bannerData){
        let Content = '';
        if(!bannerData || bannerData.length < 1){
            Content = <div
                className="box-sizing"
                style={{
                    width: width-24,height: '9rem',backgroundColor:'#F4D9EA',
                }}
            >
                <img
                    style={{ width:'100%',height: '9rem',}}
                    src={ImageConfig.empty}
                    alt=" "
                />
            </div>
        }else{
            if( bannerData.length > 1){//两张图片时才轮播
                Content =  <Carousel
                    autoplay={true}
                    infinite
                    dots = {false}
                    beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                    afterChange={index => this.setState({selectedIndex: index})}
                >
                    {
                        bannerData.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="box-sizing"
                                    style={{
                                        width: width-12, height: '9rem',
                                        marginRight:12, overflow:'hidden'
                                    }}
                                    onClick={() => this.props.history.push('/goodsPic',{
                                        bannerData: bannerData,
                                        curIndex: index,
                                        tabType: 2
                                    })}
                                >
                                    <img
                                        style={{ width: width-12,height: '9rem',}}
                                        src={item}
                                        alt=" "
                                    />
                                </div>
                            )
                        })
                    }
                </Carousel>
            }else{  //1张图片时不轮播
                Content =
                    <div
                        className="box-sizing"
                        style={{
                            width: width-24, height: '9rem',
                            overflow:'hidden'
                        }}
                        onClick={() => this.props.history.push('/goodsPic',{
                            bannerData: bannerData,
                            curIndex: 0,
                            tabType: 2
                        })}
                    >
                        <img
                            style={{ width: '100%',height: '9rem',}}
                            src={bannerData[0]}
                            alt=" "
                        />
                    </div>
            }
        }

        return Content;
    }

    render() {
        let { prodData } = this.state;
        return (
            <div>

                {/*商家图片*/}
                <div
                    style={{ height:'9rem',paddingLeft:12,paddingRight:12,position:'relative'}}
                >
                    {
                        this._showPic( prodData.bannerData)
                    }

                    {/*分页器*/}
                    {
                        prodData.bannerData && prodData.bannerData.length>0?
                        <div style={{position:'absolute',bottom:10,right:24,zIndex:10000}}>
                            <span style={{fontSize:14,color:'rgba(0,0,0,0.4)'}}>
                                {Math.ceil(this.state.selectedIndex+1)} / {prodData.bannerData.length}
                            </span>
                        </div>
                            :null
                    }

                </div>


                {/*商家名称*/}
                <div
                    className='bg'
                    style={{ width: '100%',padding: 12}}
                >
                    <div
                        style={{width: '100%',fontSize:16, color:'#333333',fontWeight:'bold',lineHeight:1.5}}
                    >
                        { prodData.prodName }
                    </div>

                    <div className='flex flex-dir flex-space-between'
                         style={{ width: '100%',marginTop:10}}
                    >
                        <div
                            className='nowrap'
                            style={{width:'70%',fontSize:14, color:'#666666'}}
                        >
                            { prodData.prodDesc }
                        </div>
                        <span style={{fontSize:14, color:'#666666',paddingLeft:5}}>
                            {'已售'+(prodData.selledNum ? prodData.selledNum : 0) }
                        </span>
                    </div>
                </div>

            </div>

        )
    }
}

// 使用说明
class  Instructions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info:''
        }
    }

    // 获取数据
    _renderData(data){
        this.setState({info: data})
    }

    render() {
        let { info } = this.state;
        if(!info){
            return null;
        }
        return (
            <div
                style={{ marginTop: 12 , padding: 12}}
                className="bg flex-space-between box-sizing"
            >
                {/*头*/}
                <div
                    className="flex flex-align-items"
                    style={{ paddingBottom: 12}}
                >
                    <div style={{ fontSize:16,color: '#FCB56A' }}
                         className="iconfont icon-fenzu"
                    />
                    <span style={{ paddingLeft: 12, fontSize: 14, fontWeight: 'bold' }}>使用说明</span>
                </div>

                {/*分割线*/}
                <div style={{width: '100%',height:1,backgroundColor:'#EAEAEA'}}/>

                {/*内容*/}
                <div
                    style={{width: '100%',paddingTop:12}}
                    dangerouslySetInnerHTML={{__html:info}}
                />

            </div>
        )
    }
}

// 商家信息
class BusiInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            busiInfo:{
                shopsId: 0,
                distance: '',
                shopsAddress: '',
                shopsName: '',
                shopsTelephone: ''
            }
        };
    }

    // 获取数据
    _renderData(data){
        this.setState({busiInfo: data})
    }

    // 距离处理
    _manageDistance(distance){
        let Distance = '';
        if(distance <100){
            Distance = '<'+ 100 +'m';
        }else  if(distance<1000){
            Distance = Math.round(distance) +'m';
        }else if( distance>=1000) {
            if (distance > 20000) {
                Distance = '>' + 20 + 'km';
            } else {
                Distance = parseFloat(distance / 1000).toFixed(1) + 'km';
            }
        }
        return Distance;
    }

    render() {
        let { shopsId,distance, shopsAddress, shopsName, shopsTelephone} = this.state.busiInfo;
        return (
            <div
                style={{ marginTop: 12 , padding: 12}}
                className="bg flex-space-between box-sizing"
                
            >
                {/*头*/}
                <div
                    className="flex flex-align-items"
                    style={{ paddingBottom: 12}}
                >
                    <div style={{ fontSize:20,color: '#FCB56A' }}
                         className="iconfont icon-shangjiaxinxi"
                    />

                    <span style={{ paddingLeft: 12, fontSize: 14, fontWeight: 'bold' }}>商家信息</span>
                </div>

                {/*分割线*/}
                <div style={{width: '100%',height:1,backgroundColor:'#EAEAEA'}}/>

                {/*商家信息*/}
                <div
                    className="flex flex-center flex-dir flex-space-between"
                    style={{width: '100%',padding:12,paddingBottom: 0}}
                >

                    <div
                        className='nowrap'
                        style={{height:'100%',width:'90%'}}
                        onClick={() => this.props.history.push('/businessDetail/' + shopsId)}//返回商家详情
                    >
                        <div
                            style={{fontSize:14,fontWeight:'bold',color:'#333333', marginBottom: 6}}
                        >
                            { shopsName }
                        </div>
                        <div
                            style={{fontSize:12,color:'#999', marginBottom: 6}}
                        >
                            { shopsAddress }
                        </div>
                        <div >
                            <i
                                className='iconfont icon-weizhi'
                                style={{color:'#CACACA',fontSize:10,marginRight: 10 }}
                            />

                            <span style={{fontSize:12,color:'#999999'}}>
                                {
                                    this._manageDistance(distance)
                                }

                            </span>

                        </div>
                    </div>


                    {/*电话*/}
                    <a
                        className="flex flex-center flex-dir"
                        style={{height: '3rem'}}
                        href={ shopsTelephone ? `tel: ${ shopsTelephone }` : 'javascript:;'}
                    >

                        <div
                            style={{height: '2.8rem', width: 1, backgroundColor: '#E6E6E6', }}
                        />
                        <div
                            className='iconfont icon-dianhua'
                            style={{fontSize:20,marginLeft: 15 ,color:'#FD9A75'}}
                        />
                    </a>

                </div>
            </div>
        )
    }
}

// 产品介绍
class GoodsIntro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prodDtl: ''
        };
    }

    // 获取数据
    _renderData(prodDtl){
        this.setState({prodDtl: prodDtl})
    }

    render() {
        let { prodDtl } = this.state;
        return (
            <div
                style={{ width:width,padding: 12, marginTop: 12, marginBottom: '3.2rem' }}
                className="bg flex-space-between box-sizing"
            >
                {/*头*/}
                <div
                    className="flex flex-align-items"
                >
                    <div style={{ fontSize:16,color: '#FCB56A' }}
                         className="iconfont icon-chanpinshuoming"
                    />
                    <span style={{ paddingLeft: 12, fontSize: 14, fontWeight: 'bold' }}>产品介绍</span>
                </div>

                {/*分割线*/}
                <div style={{width:'100%',height:1,backgroundColor:'#EAEAEA',marginTop:10}}/>

                {/*内容*/}
                {
                    prodDtl ?
                        <div
                            style={{paddingTop:12,width:'100%',overflow:'hidden'}}
                            dangerouslySetInnerHTML={{__html:prodDtl}}
                        />
                        :
                        <div
                            className="flex flex-center"
                            style={{paddingTop:12,width:'100%',height:'5rem',textAlign: 'center',}}
                        >
                            暂无产品介绍~
                        </div>
                }
            </div>
        )
    }
}


export default GoodsDetail