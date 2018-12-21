/**
 *  商家详情
 */

import React, { Component } from 'react';
import { Toast ,Carousel, Icon  } from 'antd-mobile';
import ImageConfig from '../../assets/imageConfig';
import Fetch from '../../components/fetch';
import '../../assets/css/common.css';
import '../../assets/css/main.css';
import Swiper from '../../components/swiper'
import WxApi from '../../components/wxApi';

const width = window.screen.width > 640 ? 640 : window.screen.width;


class BusinessDetail extends Component {
    constructor(props) {
        super(props);
        this.dimension = '39.91667';// 用户纬度,默认北京经纬度
        this.longitude = '116.41667'; // 用户经度
        this.shopsId = this.props.match.params.name;// 商户id
    }

    componentWillMount() {
        document.body.scrollIntoView();
        document.title = '商家详情';
    }

    componentDidMount() {
        let img = 'https://yft.ccc';
        let imgUrl = img.replace('https', 'http');
        console.log(imgUrl);
        WxApi.config(encodeURIComponent(window.location.href.split('#')[0]));
        Toast.loading('加载中...', 0);
        let locationObj = sessionStorage.cityInfo ;//读取位置信息
        if(locationObj){
            this.dimension = JSON.parse(locationObj).dimension;   // 用户纬度
            this.longitude = JSON.parse(locationObj).longitude;   // 用户经度
            this._getData();
        }else{
            setTimeout(() => {
                this._getPosition();//获取位置信息
            }, 1500);
        }
        // 获取商家数据
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
        })
    }

    // 获取商家详情
    _getData(){
        Fetch.post("d-app/API/bs/shopsInfo/getShopsDetail",{
            dimension:this.dimension ,
            longitude: this.longitude ,
            shopsId:  this.shopsId
        }).then((result)=>{
            Toast.hide();
            if(result){
                //分享朋友圈和好友
 
                WxApi.onShare(result.shopsName, window.location.href, ImageConfig.shareImg, '油通宝，一站式服务平台');

                let BusinessObj = {
                    shopsName: result.shopsName,
                    shopsTelephone: result.shopsTelephone,
                    shopsAddress: result.shopsAddress,
                    distance: result.distance,
                    bannerData: result.images,
                };
                this.describe._getData(BusinessObj);//获取商家信息

                // this.purchase._getData(result.shopsName, result.shopsId);到店买单这期不做

                this.detail._getData(result.shopsDetails);

                if(result.notices){//获取公告信息
                    this.bulletin._getData(result.notices);
                }
                if(result.prods){//获取商品信息
                    console.log(result.prods)
                    this.goods._getData(result.prods);
                }
                if(result.cards){//获取商家会员卡信息
                    this.card._getData(result.cards, result.shopsName);
                }

            }

        }).catch((err)=>{
            Toast.info(err.errDesc)
        })
    }

    render() {
        return (
            <div style={{width: width}}>
                <img src={ImageConfig.shareImg} alt="" style={{ visibility: 'hidden', height: 0, width: 0}}/>
                {/*商家描述*/}
                <Describe
                    history={this.props.history}
                    ref={ref => this.describe = ref}
                    shopsId = { this.shopsId }
                />
                
                {/*公告*/}
                <Bulletin
                    history={this.props.history}
                    ref={ref => this.bulletin = ref}
                />

                {/*/!*买单按钮*!/---这一期不做*/}
                {/*<Purchase*/}
                    {/*history={this.props.history}*/}
                    {/*ref={ref => this.purchase = ref}*/}
                {/*/>*/}

                {/*商品*/}
                <Goods
                    history={this.props.history}
                    ref={ref => this.goods = ref}
                    shopsId = {this.shopsId}
                />

                {/*会员卡*/}
                <Card
                    ref={ref => this.card = ref}
                />

                {/*商家说明*/}
                <Detail
                    ref={ref => this.detail = ref}
                />

            </div>

        )
    }
}

//商家描述
class Describe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dynamicData: {
                shopsName: '',
                shopsTelephone: '',
                shopsAddress: '',
                distance: '',
                bannerData:[]
            }
        };
    }

    //获取数据
    _getData(data){
        this.setState({
            dynamicData: data
        })
    }

    //显示商家图片
    _showPic(bannerData){
        let Content = '';
        if(!bannerData ||  bannerData.length < 1){        //无图片时
            Content = <div style={{height: '5rem', width: width}}>
                <img
                    style={{height: '100%', width: '100%'}}
                    src={ImageConfig.empty}
                    alt=" "
                />
            </div>
        }else{
            if( bannerData.length > 2){     //三张图片时才轮播
                Content = <Swiper
                    style={{width: '100%', height: '5rem'}}
                    itemWidth={7.5}
                >
                    {
                        bannerData.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="box-sizing"
                                    style={{
                                        width: '7rem', height: '5rem',
                                        marginLeft: '0.5rem'
                                    }}
                                    onClick={() => this.props.history.push('/goodsPic', {
                                        bannerData: bannerData,
                                        curIndex: index,
                                        tabType: 1
                                    })}

                                >
                                    <img
                                        style={{width: '100%', height: '100%',}}
                                        src={item}
                                        alt=" "
                                    />
                                </div>

                            )
                        })

                    }
                </Swiper>
            }else if( bannerData.length === 1){     //1张图片时
                Content =
                    <div
                        className='flex flex-dir'
                        style={{width: '100%', height: '5rem'}}
                    >
                        <div
                            className="box-sizing"
                            style={{
                                width: '7rem', height: '5rem',
                                marginLeft: '0.5rem'
                            }}
                            onClick={() => this.props.history.push('/goodsPic', {
                                bannerData: bannerData,
                                curIndex: 0,
                                tabType: 1
                            })}

                        >
                            <img
                                style={{width: '100%', height: '100%',}}
                                src={bannerData[0]}
                                alt=" "
                            />
                        </div>

                        <div style={{height: '5rem', width: '7rem',marginLeft:'0.5rem'}}>
                            <img
                                style={{height: '100%', width: '100%'}}
                                src={ImageConfig.noMorePic}
                                alt=" "
                            />
                        </div>
                    </div>
            }else{  //2张图片时
                Content =
                    <div
                        className='flex flex-dir'
                        style={{width: '100%', height: '5rem'}}
                    >
                        {
                            bannerData.map((item,index)=>{
                                return(
                                    <div
                                        key ={index}
                                        className="box-sizing"
                                        style={{
                                            width: '7rem', height: '5rem',
                                            marginLeft: '0.5rem'
                                        }}
                                        onClick={() => this.props.history.push('/goodsPic', {
                                            bannerData: bannerData,
                                            curIndex: index,
                                            tabType: 1
                                        })}

                                    >
                                        <img
                                            style={{width: '100%', height: '100%',}}
                                            src={item}
                                            alt=" "
                                        />
                                    </div>
                                )
                            })
                        }

                    </div>
            }
        }

        return Content;
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
        let { shopsName, shopsTelephone, bannerData, shopsAddress, distance} = this.state.dynamicData;
        return (
            <div
                className="bg"
            >
                {/*商家名称*/}
                <div
                    className="flex  flex-dir flex-start"
                    style={{ width: '100%',padding: 12}}
                >
                    <span style={{fontSize:16, color:'#333333',fontWeight:'bold'}}>
                        { shopsName }
                    </span>
                </div>

                {/*商家图片*/}
                <div
                    style={{ height:'5rem',width:'100%'}}
                >
                    {
                        this._showPic(bannerData)
                    }

                </div>

                {/*分割线*/}
                <div style={{width:'100%',height:1,backgroundColor:'#EAEAEA',marginTop:10,marginBottom:10}}/>

                <div
                    className="flex flex-center flex-dir flex-space-between"
                    style={{width: '100%',paddingLeft:30,paddingBottom:10}}
                >
                    {/*商家地址*/}
                    <div
                        className="flex flex-center flex-dir flex-space-between"
                        style={{width: '90%'}}
                        onClick={() => this.props.history.push('/businessMap/' + this.props.shopsId, { lat: this.dimension, lng: this.location, shopsName, shopsAddress })}
                    >
                        <div className='iconfont icon-weizhi' style={{color:'#CACACA',fontSize:20}}/>

                        <div
                            className='nowrap'
                            style={{flexDirection:'column',marginLeft:12,width:'90%'}}
                        >
                            <div style={{fontSize:14,fontWeight:'bold',color:'#333333', marginBottom: 6}}>
                                { shopsAddress }
                            </div>
                            <div style={{fontSize:12,color:'#999999'}}>
                                {this._manageDistance(distance)}
                            </div>
                        </div>

                    </div>


                    {/*电话*/}
                    <a
                        className="flex flex-center flex-dir"
                        style={{height: 40,borderLeftColor:'E6E6E6',borderLeftWidth:1}}
                        href={`tel: ${ shopsTelephone }`}
                    >
                        <div
                            style={{ height: 40, width: 1, backgroundColor: '#E6E6E6', }}
                        />

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

// 公告
class Bulletin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noticeData: [],
        }
    }

    //获取公告信息
    _getData(notices){
        this.setState({noticeData: notices})
    }

    /**
     * 时间处理
     * 刚刚       （X<=5min）
     * 30分钟前   （5min<X<=30min）
     * 1小时前    （30min<X<=1H）
     * ...
     * 24小时前   （M<X<=N）
     * 05.15
     */
    _timeManage(publishTime,val) {
        let nowDate = new Date();
        let createDate = new Date(publishTime.replace(/-/g,"/"));
        let msNum = nowDate.getTime() - createDate.getTime();

        // 是否为当天
        if (createDate.getFullYear() === nowDate.getFullYear()
            && (createDate.getMonth() === nowDate.getMonth())
            && (createDate.getDate() === nowDate.getDate())) {

            if (msNum <= 5*60*1000) {
                return '刚刚' ;
            }

            if (msNum <= 30*60*1000) {
                return 30 + '分钟前';
            }

            return Math.ceil(msNum / (3600*1000)) + '小时前';
        }

        let date = publishTime.split(' ')[0].split('-');
        let aftDate = publishTime.split(' ')[1].split(':');

        if (val) {
            return date[1] + '.' + date[2] + ' ' + aftDate[0] + ':' + aftDate[1]
        }

        return date[1] + '.' + date[2]
    }

    render() {
        let {noticeData} =  this.state;
        if(!noticeData || noticeData.length <= 0 ){
            return null
        }
        return (
            <div
                style={{ height: 40, backgroundColor: '#fff', paddingLeft: 30, paddingRight: 12 ,marginTop:10}}
                className='flex flex-dir flex-align-items'
                onClick={() => {
                    this.props.history.push('/bulletList',{noticeData: noticeData})
                }}
            >

                <div
                    className='iconfont icon-gonggao'
                    style={{fontSize:16,color:'#FD9A75'}}
                />

                <Carousel
                    className="my-carousel"
                    vertical
                    dots={false}
                    dragging={false}
                    swiping={false}
                    autoplay
                    infinite
                >
                    {
                        noticeData.map((item,index)=>{
                            return(
                                <div
                                    key={index}
                                    style={{ width: '13.3rem',marginLeft:'0.8rem',marginRight:'0.75rem'}}
                                    className='flex flex-dir flex-center nowrap'
                                    onClick={() => {this.props.history.push('/bulletList',{noticeData: noticeData})}}
                                >
                                    <div
                                        style={{  height: 40,width: '10.8rem' ,justifyContent:'flex-start',marginRight:'0.75rem'}}
                                        className='flex flex-dir flex-align-items nowrap'
                                    >
                                        <span
                                            className="nowrap"
                                            style={{ display:'block',width: '100%',color: '#333845', fontSize: 14 }}
                                        >
                                            {item.noticeContent}
                                        </span>
                                    </div>

                                    <span style={{ color: '#909090', fontSize: 10 }}>
                                        {this._timeManage(item.publishTime,false)}
                                    </span>
                                </div>
                            )
                        })
                    }

                </Carousel>

                <span className="iconfont icon-youjiantou" style={{ fontSize: 10, color: '##979797' }}/>

            </div>
        )
    }
}

// 买单
class Purchase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopsName: '',
            shopsId: '',
        }
    }

    // 获取数据
    _getData(shopsName, shopsId){
        this.setState({
            shopsName: shopsName,
            shopsId: shopsId
        })
    }

    // 买单
    _confirmPurchase(){
        let { shopsName, shopsId } = this.state;

        if (localStorage.getItem('openId')) {
            if( !JSON.parse(localStorage.getItem('PersonalInfo'))){
                Toast.loading('加载中...', 0);
                this.getUserInfo();
            }else{
                this.props.history.push('/confirmPurchase',{
                    type: 1, //商家买单
                    shopsId:  shopsId,// 商户id
                    shopsName:  shopsName// 商户名称
                })
            }
        } else Fetch.reLoginFunc();

    }

    // 获取个人信息
    getUserInfo() {
        let { shopsName, shopsId } = this.state;
        Fetch.post('/d-app/API/user/userInfo', {
            openId: localStorage.getItem('openId')
        }).then((result) => {
            Toast.hide();
            if (result) {
                localStorage.setItem('PersonalInfo', JSON.stringify(result));
                this.props.history.push('/confirmPurchase',{
                    type: 1, //商家买单
                    shopsId:  shopsId,// 商户id
                    shopsName:  shopsName// 商户名称
                })
            }
            // else {
            //     let PersonalInfo =  JSON.parse(localStorage.getItem('PersonalInfo'));
            //     console.log(PersonalInfo);
            //     if (PersonalInfo) {
            //         this.setState({ result: PersonalInfo, isLogin: true });
            //     } else {
            //         Toast.info('请求过于频繁！', 1)
            //     }
            // }
        }).catch((err) => {
            console.log(err)
        });

    }

    render() {

        return (
            <div
                style={{ height: 40, backgroundColor: '#fff', paddingLeft: 12, paddingRight: 12 ,marginTop:10}}
                className='flex flex-dir flex-center flex-space-between'
            >

                <div>
                    <i
                        className='iconfont icon-maidanicon'
                        style={{fontSize:16,color:'#FFB918'}}
                    />
                    <span
                        style={{ paddingLeft: 12, fontSize: 14, fontWeight: 'bold' }}
                    >
                        买单
                    </span>
                </div>


                <div
                    className="flex flex-center"
                    style={{
                        borderRadius:3,width:'2.5rem',
                        height: 28,background: '#FE7C4C',alignItems:'center',
                    }}
                    onClick={() => this._confirmPurchase()}
                >
                    <span
                        style={{
                            color:'#ffffff',
                            fontSize:15,textAlign:'center',
                        }}
                    >
                        买单
                    </span>
                </div>

            </div>
        )
    }
}

// 商品
class Goods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prodsData: [],

            isAll: false //是否全部展示
        }
    }

    //获取数据
    _getData(prods){
        this.setState({prodsData: prods})
    }

    _changeData(){
        this.setState({
            isAll: !this.state.isAll
        })
    }

    render() {
        let { prodsData ,isAll } = this.state;
        let perHeight = width<375 ? 5 : 4.8;
        let newHeight = perHeight * prodsData.length;
        if(!prodsData || prodsData.length<=0){
            return null
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
                    <div style={{ fontSize:16 ,borderRadius:2, color: '#FFB918' }}
                         className="iconfont icon-shangpin"
                    />
                    <span style={{ paddingLeft: 12, fontSize: 14, fontWeight: 'bold' }}>
                        {prodsData && prodsData.length>0 ? `商品(${prodsData.length})` :'商品' }
                    </span>
                </div>

                {/*分割线*/}
                <div style={{width: '100%',height:1,backgroundColor:'#EAEAEA'}}/>

                {/*内容*/}
                <div
                    style={{ height: isAll ? newHeight+'rem' : perHeight+'rem' ,overflow: 'hidden'}}
                >
                    {
                        prodsData.map((item,index)=>{
                                return(
                                    <div
                                        key={index}
                                        style={{paddingTop: 12,flexDirection:"column"}}
                                        onClick={() => this.props.history.push('/goodsDetail/'+item.prodCode)}
                                    >
                                        <div
                                            style={{width: '100%'}}
                                            className="flex flex-center flex-dir flex-space-between"
                                        >

                                            {/*图片*/}
                                            <div
                                                className="box-sizing"
                                                style={{ width: width *11 / 50, height: width *9.3 / 50 ,overflow:'hidden'}}
                                            >
                                                <img
                                                style={{ borderRadius: 3, width: '100%', height: '100%' }}
                                                src={item.picUrl ? item.picUrl: ImageConfig.empty}
                                                alt=""
                                                />
                                            </div>

                                            {/*商品描述---右边*/}
                                            <div
                                                style={{ flex:0.95, height: width *9.3 / 50 }}
                                                className="flex flex-center flex-dir flex-space-between"
                                            >

                                                <div
                                                    className="flex   flex-space-between "
                                                    style={{height: width *9.3 / 50 ,flex:1,textAlign:'left',flexDirection:'column'}}
                                                >
                                                    <div  className="flex   flex-dir flex-space-between">
                                                        <span
                                                            className="nowrap"
                                                            style={{
                                                                display:'block',width: width/2.5,
                                                                textAlign:'left',fontSize: 15,
                                                                fontWeight: 'bold', color: '#333333',
                                                                marginBottom: 4,wordBreak: 'break-all'
                                                            }}
                                                        >
                                                            {item.prodName}
                                                        </span>

                                                        <span style={{display:'block',textAlign:'right', fontSize: 12,  color: '#6E6E6E' }}>
                                                            {'已售'+item.selledNum}
                                                        </span>
                                                    </div>

                                                    <div style={{ fontSize: 18, fontWeight: 'bold', color: ' #FD9A75' }}>
                                                        {item.prodPrice}
                                                    </div>
                                                </div>


                                                <span className="iconfont icon-youjiantou" style={{ fontSize: 10, color: '#979797' }}/>
                                            </div>
                                        </div>

                                        {/*分割线*/}
                                        <div style={{marginTop:12,width: '100%',height:1,backgroundColor:'#EAEAEA'}}/>
                                    </div>
                                )
                            })
                    }
                </div>

                {/*查看更多/收起*/}
                {
                    prodsData && prodsData.length>1 ?
                    <div
                        className="flex flex-dir flex-center"
                        style={{paddingTop:12}}
                        onClick={()=>{this._changeData()}}
                    >
                     <span style={{fontSize: 14, fontWeight: 'bold', color: '#FE7C4C',marginRight:6}}>
                         {isAll ? '收起' : '查看其他'+ Math.ceil(prodsData.length-1)+'个商品'}
                    </span>
                        {
                            isAll ?
                                <Icon type="up" style={{fontSize: 14, fontWeight: 'bold', color: '#FE7C4C'}}/>
                                :
                                <Icon type="down" style={{fontSize: 14, fontWeight: 'bold', color: '#FE7C4C'}} />
                        }

                    </div>

                        :null
                }

            </div>
        )
    }
}

// 会员卡
class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopName: '',
            cardData: [],
        }
    }

    _getData(cards, shopsName){
           this.setState({
               cardData: cards,
               shopsName: shopsName
           })
    }

    render() {
        let { cardData,shopsName } = this.state;
        if(!cardData || cardData.length <= 0){
            return null
        }
        return (
            <div
                style={{ padding: 12, marginTop: 12 }}
                className="bg flex-space-between box-sizing"
            >
                {/*头*/}
                <div
                    className="flex flex-align-items"
                >
                    <div style={{ fontSize:16 ,borderRadius:2,color: '#FFB918' }}
                         className="iconfont icon-huiyuanqia"
                    />
                    <span style={{ paddingLeft: 12, fontSize: 14, fontWeight: 'bold' }}>会员卡</span>
                </div>

                {/*分割线*/}
                <div style={{width:'100%',height:1,backgroundColor:'#EAEAEA',marginTop:10}}/>

                {/*内容*/}
                <div
                    style={{width:'100%',paddingTop:12,flexDirection:'column'}}
                   className="flex flex-center"
                >
                    {
                        cardData && cardData.length > 0 ?
                        cardData.map((item,index) => {
                            return (
                                <div
                                    key={index}
                                    className='box-sizing'
                                    style={{position:'relative',width: width<375 ? '15rem' : '16rem',
                                        height:  width<375 ?'6.5rem':'7.5rem',marginTop:10}}
                                >
                                    {/*背景图*/}
                                    <img
                                         src={ImageConfig.vipCardBg}
                                         alt=""
                                         style={{width:'100%',height:'105%'}}
                                    />

                                    <div
                                        className='flex flex-space-between business-card'
                                        style={{
                                            flexDirection:'column',width:'100%',height:'100%',
                                            borderRadius:8,position:'absolute',top:0,left:0,zIndex:1000,
                                        }}
                                    >
                                        {/*上*/}
                                        <div
                                            style={{width:'100%',fontSize:'0.6rem', color:'#fff'}}
                                            className="flex flex-dir flex-center flex-space-between"
                                        >
                                            <div
                                                className='nowrap'
                                                style={{width:'70%',opacity:0.9,fontFamily:'PingFangSC'}}
                                            >
                                                { shopsName }
                                            </div>
                                            <div
                                                className='nowrap'
                                                style={{width:'30%',opacity:0.9,textAlign:'right',fontFamily:'STSongti-SC'}}
                                            >
                                                { item.cardName }
                                            </div>
                                        </div>


                                        <div>
                                            {/*中*/}
                                            <div style={{marginBottom:'0.25rem'}}>
                                                <div  style={{fontSize:'1.2rem', color:'#fff',fontFamily:'serif'}}>
                                                    VIP
                                                </div>
                                                <div  style={{fontSize:'0.5rem', color:'#fff',lineHeight:1.5,opacity:0.6,fontFamily:'STSongti-SC'}}>尊贵特权</div>
                                            </div>

                                            {/*下*/}
                                            <div
                                                className='nowrap'
                                                style={{width:'100%',fontSize:'0.7rem', color:'#fff',textAlign:'right',fontFamily:'PingFangSC'}}
                                            >
                                                { item.cardDesc }
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            )
                        })
                            :
                            <div
                                className= 'flex flex-dir flex-center'
                                style={{height:100,width:width,}}
                            >
                                暂无会员卡，敬请期待！
                            </div>
                    }
                </div>
            </div>
        )
    }
}

// 商家说明
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopsDetails: '',
        }
    }

    _getData(shopsDetails){
        this.setState({
            shopsDetails: shopsDetails,
        })
    }


    render() {
        let { shopsDetails } = this.state;
        return (
            <div
                style={{ padding: 12, marginTop: 12,marginBottom:40 }}
                className="bg flex-space-between box-sizing"
            >
                {/*头*/}
                <div
                    className="flex flex-align-items"
                >
                    <div style={{ fontSize:16 ,borderRadius:2, color: '#FFB918' }}
                         className="iconfont icon-shangjiashuoming"
                    />
                    <span style={{ paddingLeft: 12, fontSize: 14, fontWeight: 'bold' }}>商家说明</span>
                </div>

                {/*分割线*/}
                <div style={{width:'100%',height:1,backgroundColor:'#EAEAEA',marginTop:10}}/>

                {/*内容*/}
                <div
                    style={{width:'100%',paddingTop:12}}
                    dangerouslySetInnerHTML={{__html:shopsDetails}}
                />

            </div>
        )
    }
}

export default BusinessDetail