/**
 *  个人中心
 */

import React, { Component } from 'react';
import '../../assets/css/common.css';
import '../../assets/css/personal.css';
import { Toast } from 'antd-mobile';
import Fetch from "../../components/fetch";
import WxApi from '../../components/wxApi';
import ImageConfig from '../../assets/imageConfig';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const width = window.screen.width > 640 ? 640 : window.screen.width;

// 我的
export default class Personal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: localStorage.getItem('PersonalInfo') ? true : false,
            result: {
                portraitImgUrl: '',
                nickName: '',
                integral: '',
                balance: '',
                modalShow: false
            }
        };
        this.fetch = null;
    }

    componentWillMount() {
        document.title = '我的';
        document.body.scrollIntoView();
    }


    componentDidMount() {

        WxApi.config(encodeURIComponent(window.location.href.split('#')[0]));
        WxApi.getLocation().then(res => {})
        
        localStorage.removeItem('SelectedInfo');//清空订单页的下标缓存
        if (localStorage.getItem('openId')) {
            Toast.loading('加载中...', 0);
            this.getUserInfo();
        } else Fetch.reLoginFunc();
    }

    // 获取个人信息
    getUserInfo() {
        Fetch.post('/d-app/API/user/userInfo', {
            openId: localStorage.getItem('openId')
        }).then((result) => {
            Toast.hide();
            if (result) {
                this.setState({ result: result, isLogin: true });
                localStorage.setItem('PersonalInfo', JSON.stringify(result));
            } else {
                let PersonalInfo =  JSON.parse(localStorage.getItem('PersonalInfo'));
                console.log(PersonalInfo);
                if (PersonalInfo) {
                    this.setState({ result: PersonalInfo, isLogin: true });
                } else {
                    Toast.info('请求过于频繁！', 1)
                }
            }
        }).catch((err) => {
            console.log(err)
        });

    }

    onShowAlert = () => {
        console.log(1)
        this.setState({
            modalShow: true
        })
    };

    onCopy(){
        this.setState({
            modalShow: false
        })
        Toast.info('复制成功', 1);
    }

    // 账号脱敏处理
    _manageAccount(mobile){
        let account = mobile.replace(/\s+/g, "");
        let rMobile = account.substring(3,7);
        return account.replace(rMobile,'*****');
    }

    render() {
        let { isLogin, result } = this.state;

        return (
            <div
                style={{ width:width,paddingBottom: '3rem',color:'#fff', position: 'relative' }}
            >
                {/*我的邀请码弹框*/}
                <div
                    className="flex flex-center"
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        zIndex: 1000, display: this.state.modalShow ? 'flex' : 'none'
                    }}
                    onClick ={() => {
                        this.setState({
                            modalShow: false
                        })
                    }}
                >
                    <div
                        style={{width: '100%', height: '100%', position: 'absolute', background: 'rgba(0,0,0,0.5)', zIndex: -1}}
                    />
                    <div
                        className="flex flex-col flex-align-items"
                        style={{width: 270, height: 140, borderRadius: '5px', background: '#fff', position: 'relative'}}
                    >
                        <span
                            style={{color: '#444', fontSize: 16, marginTop: 25}}
                        >
                            我的邀请码
                        </span>
                        <span
                            style={{color: '#444', fontWeight: 'bold', fontSize: 16, marginTop: 15}}
                        >
                            { result.recommendCode}
                        </span>
                        <CopyToClipboard text={result.recommendCode}
                            onCopy={() => this.onCopy()}>
                            <span
                                className="flex flex-center"
                                style={{
                                    width: '100%', position: 'absolute', bottom: 0, left: 0, height: 45, borderTop: '1px solid #eee', color: 'rgb(254, 127, 79)', fontSize: 16
                                }}
                            >复制</span>
                        </CopyToClipboard>
                    </div>
                </div>

                {/*头部*/}
                {
                    isLogin ?
                        <div
                            className="bg"
                            style={{width: '100%', overflow: 'hidden'}}
                        >
                            <img style={{width:'100%',height:'13.5rem'}} src={ImageConfig.personalBg} alt=""/>

                            <div
                                style={{width:'100%',position:'absolute',top:0,left:0,zIndex:900,overflow:'hidden'}}
                            >
                                <div className="flex flex-dir flex-align-items flex-space-between"
                                     style={{ paddingLeft: 12, paddingRight: 12 }}>
                                    {/* 头像&昵称&账号*/}
                                    <div
                                        className="flex flex-align-items flex-dir"
                                        style={{ height: '5rem' }}
                                    >
                                        {
                                            result.portraitImgUrl ?
                                                // 头像
                                                <div
                                                    style={{ width: '2.8rem', height: '2.8rem', borderRadius: '1.4rem', marginRight: 16, backgroundColor: '#eee' }}
                                                    onClick={() => {
                                                        if (!this.state.isLogin) return;
                                                        this.props.history.push('/personalInfo');
                                                    }}
                                                >
                                                    <img
                                                        style={{ width: '2.8rem', height: '2.8rem', borderRadius: '1.4rem', marginRight: 16 }}
                                                        src={result.portraitImgUrl}
                                                        alt="  "
                                                    />
                                                </div>
                                                :
                                                <div
                                                    onClick={() => {
                                                        if (!this.state.isLogin) return;
                                                        this.props.history.push('/personalInfo');
                                                    }}
                                                    style={{ width: '2.8rem', height: '2.8rem', borderRadius: 56 / 2, marginRight: 16, backgroundColor: '#eee' }} />
                                        }

                                        {/*昵称&账号*/}
                                        <div>
                                            <div className="flex flex-align-items flex-dir" style={{ marginBottom: '0.5rem' }}>
                                                <div style={{ fontSize: 14, marginRight: 5 }}>
                                                    {result.nickName}
                                                </div>
                                                <div style={{ marginRight: 15 }}>
                                                    <span className="iconfont icon-huiyuan1" style={{ fontSize: 12,color:'#FFDC3D'}} />
                                                    <span style={{ fontSize: 12 ,fontWeight: 'bold',color:'#FFDC3D'}}> 1 </span>
                                                </div>
                                            </div>
                                            <div
                                                className="flex flex-align-items flex-dir"
                                            >
                                                <div className="flex flex-align-items flex-dir"
                                                     onClick={() => {
                                                         if (!this.state.isLogin) return;
                                                     }}>
                                                    <div style={{ fontSize: 14 }}>
                                                        {result.mobile ? this._manageAccount(result.mobile) : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*消息*/}
                                    <div
                                        className="flex flex-center"
                                        style={{ width: '2rem', height: '2rem',justifyContent:'flex-end' }}
                                    >
                                        <div
                                            className="iconfont icon-xiaoxi1"
                                            style={{ fontSize: 20 }}
                                            onClick={() => {
                                                if (!this.state.isLogin) return;
                                                this.props.history.push('/noticeCenter');
                                            }}
                                        />
                                    </div>
                                </div>

                                {/*我的邀请码*/}
                                <div
                                    className='flex flex-dir flex-center'
                                    style={{
                                        position:'absolute',right:'-0.4rem',top:'3.5rem',width:'4.6rem',
                                        height:'1.3rem',backgroundColor:'#FFDC3D',marginTop:'0.5rem',
                                        fontSize:'0.6rem',borderRadius:13,overflow:'hidden'
                                    }}
                                    onClick = { () => result.recommendCode ? this.onShowAlert() : Toast.info('暂无邀请码')}
                                >
                                    我的邀请码
                                </div>

                                {/*可用余额*/}
                                <div  className="flex  flex-center"
                                      style={{flexDirection:'column'}}
                                      onClick = {() => {this.props.history.push('/detailList', {sourceType: 2})}}
                                >
                                    <div style={{fontSize: 14,marginBottom:'0.5rem'}}>可用余额</div>
                                    <div>
                                    <span style={{fontSize: 24}}>
                                        { result.balance ? parseFloat(result.balance).toFixed(2):'0.00' }&nbsp;
                                    </span>
                                        <span style={{fontSize: 12}}>通宝</span>
                                    </div>
                                </div>

                                {/*积分&未返还*/}
                                <div className="flex  flex-dir flex-center "
                                     style={{width:'100%',paddingTop:'1rem',paddingBottom:'1rem'}}
                                >
                                    <div
                                        style={{width:'50%',textAlign:'center'}}
                                        onClick={() => {
                                            if (!this.state.isLogin) return;
                                            this.props.history.push('/myPoints');
                                        }}
                                    >
                                        <div style={{fontSize: 14,marginBottom:10}}>积分</div>
                                        <div style={{fontSize: 14}}>
                                            { result.integral ?  result.integral :'0' }
                                        </div>
                                    </div>

                                    <div
                                        style={{width:'50%',textAlign:'center'}}
                                        onClick = {() => {this.props.history.push('/returnRecord')}}
                                    >
                                        <div style={{fontSize: 14,marginBottom:'0.5rem'}}>未返还</div>
                                        <div>
                                        <span style={{fontSize: 14}}>
                                           
                                            { result.surplusAmount  ? parseFloat(result.surplusAmount).toFixed(2) : '0.00' }&nbsp;
                                        </span>
                                            <span style={{fontSize: 12}}>通宝</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        :
                        // <div
                        //     className="bg personal-header flex flex-align-items"
                        //     style={{ height: 116, marginBottom: 8 }}
                        // >
                        //     <div>
                        //         <div style={{ fontSize: 24, color: '#444', marginBottom: 10 }}>登录、注册</div>
                        //         <div style={{ fontSize: 14, color: '#444' }}>登录领取你的油通宝积分福利</div>
                        //     </div>
                        // </div>
                        <div 
                        style={{width:width,height:width/1.7,paddingTop:width/27,paddingLeft:width/15.9,paddingRight:width/15.9}}
                        className="an_my_main flex flex-space-between ">
                        {/*邀请码*/}
                            <div className="an_my_invite an_my_header"
                            >
                            <i style={{fontSize:width/17.8,marginRight:5}}
                            className="iconfont icon-wodejiayouqia"
                            ></i>
                            <span
                            style={{fontSize:12}}
                            >邀请码</span>
                            </div>
                        {/*昵称头像*/}
                            <div className="an_my_info an_my_header flex flex-col flex-center">
                                <div 
                                style={{width:width/4.4,height:width/4.4,borderRadius:'50%',backgroundColor:'#fff',marginBottom:width/50}}
                                className="an_my_header_img"></div>
                                <span 
                                style={{fontSize: 12 ,fontWeight: 'bold'}}
                                >你的名字</span>
                            </div>
                        {/*消息*/}
                            <div className="an_my_message an_my_header">
                             <i style={{fontSize:width/17.8}}
                            className="iconfont icon-wodejiayouqia"
                            ></i>
                            </div>
                        </div>
                }

                {/*横向分类*/}
                <Classify
                    history={this.props.history}
                    isLogin={isLogin}
                />

                {/*竖向列表*/}
                <VerticalList
                    history={this.props.history}
                    isLogin={isLogin}
                />

            </div>
        )
    }
}

// 横向分类
class Classify extends Component {
    constructor(props) {
        super(props);

        this.classifyList = [
            {
                iconName: 'icon-dingdan',
                describe: '我的订单',
                color: '#99CDFF',
                router: '/myOrder',
                size: 24
            },
            {
                iconName: 'icon-huiyuanqia1',
                describe: '我的会员卡',
                color: '#F0DE44',
                router: '/vipCard',
                size: 28
            },
            {
                iconName: 'icon-jiangli',
                describe: '我的奖励',
                color: '#FF8692',
                router: '/reward',
                size: 22
            },
            {
                iconName: 'icon-Group',
                describe: '我的商家',
                color: '#a3b6f0',
                router: '/myBusiness',
                size: 26
            },
        ];
        this.antopMeuns=[
        {
            meunTitle:'可用余额',
            meunContent:'0.0'
        },
        {
            meunTitle:'积分',
            meunContent:'0.0'
        },
        {
            meunTitle:'未返还',
            meunContent:'0.0'
        }
        ];
    }

    // 页面跳转
    jumpPage(router) {
        if (router && this.props.isLogin) {
            this.props.history.push(router)
        }
    }

    render(){
        return(
            {/*<div
                className="bg flex flex-multi-line box-sizing"
                style={{ width: width,height: '4.5rem',paddingBottom: '1rem'}}
            >
                {
                    this.classifyList.map((item, i) => {
                        let className = 'iconfont ' + item.iconName;

                        return (
                            <div
                                onClick={() => this.jumpPage(item.router)}
                                key={i}
                                className="flex flex-center flex-space-between"
                                style={{ width: width/4, height: '100%', flexDirection: 'column' }}
                            >

                                <div
                                    className="flex flex-center "
                                    style={{width:'100%',height:'80%'}}
                                >
                                    <i
                                        className={className}
                                        style={{ fontSize: item.size, color: item.color }}
                                    />
                                </div>

                                <span style={{ fontSize: 12, color: '#444444',}}>
                                    {item.describe}
                                </span>
                            </div>
                        )
                    })
                }
            </div>*/},
            <div 
            style={{boxSizing:'border-box',paddingRight:width/16.3,paddingLeft:width/16.3}}
            >
            <div className="an_top_meun flex flex-space-between"
            style={{width:'100%',height:width/3.9,boxSizing:'border-box',paddingRight:width/11,paddingLeft:width/11,paddingTop:width/18}}
            >
            {
                this.antopMeuns.map((item,index)=>{
                    return (
                    <div className="flex flex-col flex-center " key={index}>
                        <span 
                        className="an_title_first"
                        style={{fontSize:width/21.4}}
                        >{item.meunTitle}</span>
                        <p
                        style={{fontSize:16,marginTop:width/27.7,fontWeight:'500'}}
                        >{item.meunContent}
                        <span style={{fontSize:12}}>通宝</span>
                        </p>
                    </div>
                    )
                })
            }
            </div>
            <div className="an_only_line"></div>

            </div>
        )
    }
}

// 列表
class VerticalList extends Component {
    constructor(props) {
        super(props);
        this.state = {index: 100};
        this.PowerList = [
        
            { value: '通宝充值', router: '/fuelCard', iconName: 'iconfont icon-wodejiayouqia',iconDertion:'iconfont icon-jiantouxia1', size: 18,moreTip:0 },
            { value: '我的订单', router: '/myOrder', iconName: 'iconfont icon-dingdan', iconDertion:'iconfont icon-youjiantou', size: 18 ,moreTip:0},
            { value: '我的会员卡', router: '/vipCard', iconName: 'iconfont icon-huiyuanqia1', iconDertion:'iconfont icon-youjiantou', size: 18 ,moreTip:0},
            { value: '我的奖励', router: '/reward', iconName: 'iconfont icon-jiangli', iconDertion:'iconfont icon-youjiantou', size: 18 ,moreTip:0},
            { value: '我的商家', router: '/myBusiness', iconName: 'iconfont icon-Group', iconDertion:'iconfont icon-youjiantou', size: 18 ,moreTip:0},
            { value: '我的加油卡', router: '/fuelCard', iconName: 'iconfont icon-wodejiayouqia', iconDertion:'iconfont icon-youjiantou', size: 18 ,moreTip:0},
            { value: '我的车辆', router: '/carList', iconName: 'iconfont icon-wodecheliang', iconDertion:'iconfont icon-youjiantou', size: 12 ,moreTip:0},
            { value: '我的地址', router: '/address', iconName: 'iconfont icon-wodedizhi', iconDertion:'iconfont icon-youjiantou', size: 20 ,moreTip:0},
            { value: '反馈建议', router: '/feedback', iconName: 'iconfont icon-fankuijianyi' ,iconDertion:'iconfont icon-youjiantou', size: 16,moreTip:2},
            { value: '常见问答', router: '/faq', iconName: 'iconfont icon-changjianwenti1',iconDertion:'iconfont icon-youjiantou', size: 16 ,moreTip:0},
            { value: '关于油通宝', router: '/aboutUs', iconName: 'iconfont icon-guanyuyoufutong',iconDertion:'iconfont icon-youjiantou', size: 18 ,moreTip:0},
        ];
    }

    // 页面跳转
    jumpPage(router) {
        if (router && this.props.isLogin) {
            this.props.history.push(router)
        }
    }
    // 箭头的icon
    changeIcon(index) {
        this.setState({ index: index});
    }
    render(){
        return(
            <div
                style={{ width: width, marginTop:10 }}
                className='bg'
            >
                {
                    this.PowerList.map((item, index) => {
                        let MoreTip
                        if (parseInt(item.moreTip)>0) {
                        MoreTip=(
                            <span 
                            style={{marginLeft:width/22.7}}
                            className="an_tip_wapper">{item.moreTip}</span>
                            )
                        }
                        return (
                            <div
                                key={index}
                                onClick={() => this.jumpPage(item.router)}
                            >
                                <div
                                    className="flex flex-dir flex-center flex-space-between"
                                    style={{padding:10}}
                                    onClick={() => this.changeIcon(index)}

                                >
                                    <div className="flex flex-align-items flex-dir">

                                        <div
                                            className={item.iconName}
                                            style={{ width: '1.5rem', fontSize: item.size, color: '#282828' }}
                                        />

                                        <div style={{ fontSize: 13, color: '#282828',fontWeight:'bold' }}>{item.value}
                                            {MoreTip}
                                        </div>
                                    </div>

                                    <div  className={index===this.state.index ? 'iconfont icon-jiantouxia1' : 'iconfont icon-youjiantou'}
                                    style={{ fontSize:index===this.state.index ? 20 : 14, color: '#979797' }}/>

                                </div>

                                {/*分割线*/}
                                {/*<div style={{height:1,width:'100%',backgroundColor:'rgba(0,0,0,0.1)'}}/>*/}

                            </div>

                        )
                    })
                }
            </div>
        )
    }
}


