/**
 *  首页
 */

import React, { Component } from 'react';
import '../assets/css/common.css';
import '../assets/css/main.css';
import ImageConfig from '../assets/imageConfig';
import { Carousel, Toast } from 'antd-mobile';
import Fetch from '../components/fetch';
import WxApi from '../components/wxApi';

const width = window.screen.width > 640 ? 640 : window.screen.width;
class Main extends Component {

    constructor(props) {
        super(props);
        this.cityInfo = {};
        this.province = '';
    }

    componentWillMount() {
        // 后台重定向处理
        let href = window.location.href.split('?')[1];
        if (href) {
            let openId = href.split('=')[1];
            localStorage.setItem('openId', openId);
        }
        document.title = '首页';
        document.body.scrollIntoView();


    }

    componentDidMount() {
        Toast.loading('加载中', 1.5);
        Fetch.post('/d-app/API/header/infos', {}).then((result) => {
            Toast.hide();
            if (result) {
                this.banner._getData(result.noticeResps);
                console.log(result.oilInfoResps)
            }
        }).catch((err) => {});

        //获取坐标点
        const cityInfoLocal = localStorage.getItem('main');

        if (cityInfoLocal) {
            const cityInfo = JSON.parse(cityInfoLocal);
            this.cityInfo = {
                longitude: cityInfo.longitude,
                dimension: cityInfo.dimension,
                curCity: cityInfo.curCity,
                province: cityInfo.province
            }
            this._getIndexInfo();
        }

        const geoc = new window.BMap.Geocoder();

        WxApi.config(encodeURIComponent(window.location.href.split('#')[0]));

        WxApi.getLocation().then(res => {
            const point = new window.BMap.Point(res.longitude, res.latitude);
            geoc.getLocation(point, (rs) => {
                const addComp = rs.addressComponents;

                if (this.cityInfo.province !== addComp.province) {
                    this.cityInfo = {
                        longitude: res.longitude,
                        dimension: res.latitude,
                        curCity: addComp.city,
                        province: addComp.province
                    }
                    localStorage.setItem('main', JSON.stringify(this.cityInfo));
                    this._getIndexInfo();
                }
            })
        })


    }

    // 获取主页信息
    _getIndexInfo() {

        Fetch.post('/d-app/API/product/oilPrice', {
            provinceName: this.cityInfo.province
        }).then((result) => {
            console.log('aaa')
            Toast.hide()
            if (result) {
                this.todayOil._getData(result.oilInfoResps);
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    render() {
        return (
            <div style={{paddingBottom:'3rem'}}>
                {/*banner*/}
                <Banner
                    ref={ref => this.banner = ref}

                />

                {/*今日油价*/}
                <TodayOil ref={ref => this.todayOil = ref} />
                {/*爱车生活*/}
                <CarsLife history={this.props.history} />
                 {/*车主生活*/}
                <OwnerLife />
                {/*享实惠*/}
                <Benefits
                    history={this.props.history}
                />

               
            </div>

        )
    }
}

// banner
class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerData: []
        }
    }

    //获取数据
    _getData(data) {
        this.setState({
            bannerData: data
        })
    }

    render() {
        return (
            <div
                style={{ height: width /1.8, width: width, overflow: 'hidden' }}
            >
                {
                    this.state.bannerData.length > 0 ?
                        <Carousel
                            className="Carousel"
                            autoplay={true}
                            dots={false}
                            infinite
                            selectedIndex={0}
                            swipeSpeed={35}>
                            {
                                this.state.bannerData.map((item, index) => {
                                    return (
                                        <div style={{ width: '100%', height: '100%' }}>
                                            <img
                                                key={index}
                                                src={item.noticeContent}
                                                alt=" "
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </div>

                                    )
                                })
                            }

                        </Carousel>
                        :
                        <div style={{ width: '100%', height: '100%' }}>
                            <img
                                style={{ height: '100%', width: '100%' }}
                                src={ImageConfig.empty}
                                alt=" "
                            />
                        </div>

                }
            </div>
        )
    }
}

// 今日油价
class TodayOil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oilData: [],
        }
    }

    //获取数据
    _getData(data) {
        console.log(data)
        this.setState({
            oilData: data
        })
    }
    render() {
        return (
            <div
                style={{ height:width/14.4,paddingLeft:width/16.6,paddingRight:width/16.6}}
                className='flex flex-dir flex-align-items  an_today_price'
            >
                <img
                    src={ImageConfig.oil}
                    style={{ height: width/32.6, width: width/7.8 }}
                    alt=""
                />
                        
                
                {
                    this.state.oilData && this.state.oilData.length > 0 ?
                       <p style={{  fontSize: 14 ,marginLeft:15}}
                            className='flex flex-dir flex-center'
                        >
                            {this.state.oilData[0].province}
                        </p>

                        : 
                       null
                }

                <div
                    className='flex flex-space-between flex-dir -webkit-scrollbar'
                    style={{ overflowX: 'scroll', height: 40, }}
                >
                    {
                        this.state.oilData && this.state.oilData.length > 0 ?
                            this.state.oilData.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-dir flex-space-between box-sizing"
                                        style={{ width: 138, height: 40, alignItems: 'center', marginRight: 10 }}
                                    >

                                        {/*油号*/}
                                        <span
                                            style={{ fontSize: 12, color: '#606060' }}
                                        >
                                            {item.oilModel}
                                        </span>

                                        {/*油价*/}
                                        <span
                                            style={{
                                                fontSize: 12, paddingLeft: 5, paddingRight: 5,
                                                color: item.isUp === 1 ? '#91E357' : (item.isUp === 2 ? '#606060' : '#E92626')
                                            }}
                                        >
                                            {item.oilPrice}
                                        </span>

                                        {/*/!*油价升降---（1---下降，2---持平，3---上升）*!/*/}
                                        {/*{*/}
                                        {/*item.isUp === 1 ?*/}
                                        {/*<span className="iconfont icon-xia1" style={{ color: '#91E357', fontSize: 12, marginRight: 10 }} />*/}
                                        {/*:*/}
                                        {/*item.isUp === 2 ?*/}
                                        {/*<span style={{ color: '#606060', fontSize: 12, paddingRight: 3 }}>*/}
                                        {/*-*/}
                                        {/*</span>*/}
                                        {/*:*/}
                                        {/*<span className="iconfont icon-shang1" style={{ color: '#E92626', fontSize: 12, marginRight: 10 }} />*/}
                                        {/*}*/}

                                        {
                                            index !== this.state.oilData.length - 1 ?

                                                <div style={{ height: 12, width: 2, backgroundColor: 'rgba(0,0,0,0.1)', marginLeft: 10 }}
                                                    className="linear-gradient.flex-align-items "
                                                />
                                                : null
                                        }
                                    </div>
                                )
                            })
                            : null
                    }
                </div>


            </div>
        )
    }
}
// 爱车生活
class CarsLife extends Component {
    constructor(props) {
        super(props);
        this.lists = [
            { iconName: 'icon-baoyang1', describe: '汽车保养', route: 'http://c.hzhus.com/index/index/index.html' },
            { iconName: 'icon-luntai', describe: '预约换胎', route: 'http://h5.sino-ap.com/TWebUIzj/selectcity.aspx?za=20180612071106&zb=5&zc=index&zd=&ze=40953f5&zf=0571&sign=ae9f1eca68dba204f373949cb4abfffa' },
            { iconName: 'icon-xiche', describe: '8折洗车', route: 'https://open.chediandian.com' },
            { iconName: 'icon-jiuyuan1', describe: '极速救援', route: 'https://open.chediandian.com' },

            { iconName: 'icon-zhekou', describe: '洗车兑换', route: 'https://open.chediandian.com/service/petrochemical?shcode=100203&ApiKey=14a29bdea11f4972a6d517706496c935&ApiST=1504678289&ApiSign=050ad4f9dd869273febc01ecec5de70c&openid=otACft7aeZjtVZCxr9euHOdltq6Y&_=20180612152015' },
            { iconName: 'icon-fuwu1', describe: '自助洗车', route: 'http://wapnew.njyzz.com/index.php/index/index.html' },
            { iconName: 'icon-weizhang1', describe: '违章查询', route: 'https://open.chediandian.com/TrafficViolation/Index?ApiKey=0793dfb074874203ac5afecd93f476c6&ApiST=1495425763&ApiSign=36e732a5eb62b65183aea1e217edd7c7' },
            { iconName: 'icon-maiche1', describe: '新车买卖', route: 'http://a2.rabbitpre.com/m2/aUe1ZicgvI' },
        ]
    }


    render() {
        return (
            <div
                style={{ marginBottom: 12,marginTop: width/50  }}
                className="bg flex-space-between box-sizing"
            >
                {/*头*/}
               {/* <div
                    className="flex .flex-align-items"
                    style={{ padding: 12 }}
                >
                    <div style={{ height: 12, width: 2, backgroundColor: '#FE7C4C' }}
                        className="linear-gradient flex-align-items "
                    />
                    <span style={{ paddingLeft: 12, fontSize: 14, fontWeight: 'bold' }}>爱车生活</span>
                </div>*/}

                {/*内容*/}
                <div className="flex flex-multi-line box-sizing" style={{ width: width}}>
                    {
                        this.lists.map((item, i) => {
                            let className = 'iconfont ' + item.iconName;

                            return (
                                <div
                                    onClick={() => window.location.href = item.route}
                                    key={i}
                                    className="flex flex-center"
                                    style={{ width: width / 4, height: width / 6, flexDirection: 'column',marginBottom:width/37.5}}
                                >
                                    <div
                                        style={{
                                            // backgroundColor: 'rgba(254,127,79,0.10)',
                                            // borderRadius: 2,
                                            width: width / 9.3,
                                            height: width / 9.3,
                                        }}
                                        className="flex flex-center an_meuns"
                                    >
                                        <div className={className} style={{ fontSize: i === 4 || i === 6 || i === 7 ? 20 : 25, color: '#fff' }} />
                                    </div>
                                    <span style={{ fontSize: 12, color: '#444444', paddingTop: 10 }}>
                                        {item.describe}
                                    </span>
                                </div>
                            )
                        })

                    }
                </div>
            </div>
        )
    }
}


// 享实惠
class Benefits extends Component {

    // 路由跳转
    _jumpToPage(route, val) {
        if (localStorage.getItem('openId')) {
            if (val) {
                this.props.history.push(route)
            } else this.props.history.replace(route)
        } else {
            Fetch.reLoginFunc();
        }
    }
    render() {
        return (
            <div

                style={{ marginTop: width/13.8 }}
                className="bg flex-space-between box-sizing"
            >
                {/*头*/}
                <div
                    className="flex flex-align-items"
                    // style={{ padding: 12, paddingBottom: 0 }}
                >
                    <div style={{ height: 12, width: 2, backgroundColor: '#333' }}
                        className="linear-gradient.flex-align-items "
                    />
                    <span style={{ paddingLeft: 12, fontSize: 14, fontWeight: 'bold',color:'#333' }}>享实惠</span>
                   
                </div>
                 <div>
                       <img
                            style={{ height:width/50,marginLeft:width/31,marginTop:width/27,marginBottom:width/25}}
                            src={ImageConfig.Main_title}
                            alt=""
                        />
                    </div>
                {/*内容*/}
                <div
                    className="flex flex-center flex-dir flex-space-between relative"
                    style={{ padding: 12,paddingTop:0 }}
                >
                 <img
                            style={{ width: '100%', height: '100%' }}
                            src={ImageConfig.Xsh_bottom}
                            alt=""
                        />
                  {/*  <div
                        onClick={() => this._jumpToPage('/oil', true)}
                        style={{ width: (width - 34) / 2, height: (width - 34) * 6 / 17 }}
                    >
                        <img
                            style={{ borderRadius: 3, width: '100%', height: '100%' }}
                            src={ImageConfig.shihui_1}
                            alt=""
                        />

                        <div
                            className="absolute"
                            style={{
                                width: (width - 34) / 2,
                                height: (width - 34) * 6 / 17,
                                top: 12, zIndex: 1,
                                paddingLeft: (width - 34) * 3 / 20,
                                paddingTop: (width - 34) * 12 / 170
                            }}
                        >
                            <div style={{ fontSize: 17, color: '#ffffff', marginBottom: 8 }}>我要加油</div>

                            <div style={{ paddingLeft: 10 }}>
                                <img
                                    style={{ width: '45%', height: '55%' }}
                                    src={ImageConfig.shihui_4}
                                    alt=" "
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        style={{ width: (width - 34) / 2, height: (width - 34) * 6 / 17 }}
                    >
                        <div
                            className="flex flex-center flex-dir flex-space-between"
                            style={{
                                borderRadius: 3,
                                width: '100%', height: '45%',
                                backgroundColor: 'rgba(62,42,240,0.05)',
                                marginBottom: (width - 34) * 6 / 170,
                                paddingLeft: 15, paddingRight: 15
                            }}
                            onClick={() => this._jumpToPage('/main/discount')}
                        >
                            <div

                                className="text-center"
                            >
                                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#3E2AF0', marginBottom: 4 }}>
                                    预购
                                </div>

                                <div style={{ fontSize: 11, color: '#B0A7FA' }}>
                                    预购享优惠
                                </div>
                            </div>

                            <img
                                style={{ width: 55, height: 30 }}
                                src={ImageConfig.shihui_2}
                                alt=""
                            />
                        </div>

                        <div
                            onClick={() => this._jumpToPage('/mall', true)}
                            className="flex flex-center flex-dir flex-space-between"
                            style={{ borderRadius: 3, width: '100%', height: '45%', backgroundColor: 'rgba(62,42,240,0.05)', paddingLeft: 15, paddingRight: 15 }}
                        >
                            <div
                                className="text-center"
                            >
                                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#3E2AF0', marginBottom: 4 }}>
                                    积分商城
                                </div>

                                <div style={{ fontSize: 11, color: '#B0A7FA' }}>
                                    积分兑换好礼
                                </div>
                            </div>

                            <img
                                style={{ width: 55, height: 30 }}
                                src={ImageConfig.shihui_3}
                                alt=""
                            />
                        </div>
                    </div>*/}
                </div>
            </div>
        )
    }
}


// 车主生活
class OwnerLife extends Component {

    render() {
        return (
            <div
                style={{ marginTop: 12}}
                className="bg flex-space-between box-sizing"
            >
                {/*头*/}
               {/* <div
                    className="flex .flex-align-items"
                    style={{ padding: 12, paddingBottom: 0 }}
                >
                    <div style={{ height: 12, width: 2, backgroundColor: '#FE7C4C' }}
                        className="linear-gradient.flex-align-items "
                    />
                    <span style={{ paddingLeft: 11, fontSize: 14, fontWeight: 'bold' }}>车主生活</span>
                </div>*/}

                {/*内容*/}
                <div
                    className="flex  flex-center  flex-space-between"
                    style={{ width: width, paddingLeft: 12 ,paddingRight:12}}
                >
                    {/*左*/}
                    <div
                        className="flex flex-center car_right flex-space-between"
                        style={{ width: width * 9 / 20, height: width * 6 / 25 }}
                        onClick={() => window.location.href = 'http://bx.huibaotianxia.cn/home/index/homepage/channel_id/2/channel_userid/zgsh40953f5/from_tag/product.ad.zgsh_bxpd/from_id/0/type/10.html'}
                    >
                       {/* <div>
                            <p style={{ fontWeight: 'bold', fontSize: 14, color: '#5D4CF2' }}>惠车险</p>

                            <p style={{ fontSize: 12, color: '#B0A7FA' }}>车险最高8折起</p>
                        </div>*/}


                        <img
                            style={{width:'100%',height: '100%'}}
                            src={ImageConfig.Owner_04}
                            alt=""
                        />
                    </div>

                    {/*右*/}
                    <div
                        className="flex flex-center car_right flex-space-between"
                        style={{ width: width * 9 / 20, height: width * 6 / 25 }}
                        onClick={() => window.location.href = 'https://m.zuzuche.com/w/tidl/?pnid=A17849088&from_topic=a3b8db51b0b5012091c11484bd02822e'}
                    >
                        {/*<div>
                            <p style={{ fontWeight: 'bold', fontSize: 14, color: '#5D4CF2' }}>驾照升级</p>

                            <p style={{ fontSize: 12, color: '#B0A7FA' }}>C1直接升级B2</p>
                        </div>*/}

                        <img
                            style={{height:'100%',width:'100%'}}
                            src={ImageConfig.owner_02}
                            alt=""
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Main