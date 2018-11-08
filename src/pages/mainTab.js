/**
 *  首页底部
 */

import React, { Component } from 'react';
import ImageConfig from '../assets/imageConfig';
import {
    Route, NavLink
} from 'react-router-dom';
import '../assets/css/common.css';

import Main from './main';
import Discount from './oil/discount';
import Business from './business/business';
import Personal from './person/personal';
import Recharge from './person/recharge';//在线充值
const width = window.screen.width > 640 ? 640 : window.screen.width;
 
class MainTab extends Component {
    render() {
        let activeStyle= {color: '#000000'};

        return (
            <div>
                {/*底部样式*/}
                <div
                    style={{height:width/7.7}}
                    className="foot-bar flex flex-center flex-dir"
                >
                    <NavLink
                        className="foot-bar-item flex flex-center flex-col"
                        exact
                        replace
                        activeStyle={activeStyle}
                        to="/"
                    >
                    <img src={ImageConfig.sy}
                    className="an_footer_img"
                    style={{width:'1rem'}}/>
                       {/* <div
                            className="iconfont icon-shouye1 foot-bar-icon"
                        />*/}

                        <span>首页</span>
                    </NavLink>

                    <NavLink
                        className="foot-bar-item flex flex-center flex-col"
                        replace
                        activeStyle={activeStyle}
                        to="/main/discount"
                    >
                    <img src={ImageConfig.gmtb}
                    className="an_footer_img"
                    style={{width:'1rem'}}/>
                       {/* <div
                            className="iconfont icon-youhui foot-bar-icon"
                        />*/}

                        {/*<span>优惠</span>*/}
                        <span>购买通宝</span>
                    </NavLink>
                     <NavLink
                        className="foot-bar-item flex flex-center flex-col"
                        replace
                        activeStyle={activeStyle}
                        to="/main/recharge"
                    >
                  
                        <div
                            className=" flex flex-center foot-bar-icon an_center_icon"
                            style={{fontSize:28,width:width/7.5,height:width/7.5,margin:' 0 auto',marginTop:-width/18}}
                        >  <img src={ImageConfig.qcjy}
                        className="an_footer_img"
                    style={{width:'100%'}}/>
                    </div>

                        {/*<span>加油卡</span>*/}
                        <span>汽车加油</span>
                    </NavLink>
                    <NavLink
                        className="foot-bar-item flex flex-center flex-col"
                        replace
                        activeStyle={activeStyle}
                        to="/main/business"
                    >
                    <img src={ImageConfig.sc}
                    className="an_footer_img"
                    style={{width:'1rem'}}/>
                       {/* <div
                            className="iconfont icon-jifenshangcheng1 foot-bar-icon"
                        />*/}

                        <span>商城</span>
                    </NavLink>

                    <NavLink
                        className="foot-bar-item flex flex-center flex-col"
                        replace
                        activeStyle={activeStyle}
                        to="/main/personal"
                    >
                    <img src={ImageConfig.wd}
                    className="an_footer_img"
                    style={{width:'1rem'}}/>
                      {/*  <div
                            className="iconfont icon-gerenzhongxin foot-bar-icon"
                        />*/}

                        {/*<span>个人中心</span>*/}
                        <span>我的</span>
                    </NavLink>
                </div>

                {/*定义路由信息*/}
                <div>
                    <Route exact path="/" component={Main}/>
                    <Route path="/main/discount" component={Discount}/>
                    <Route path="/main/recharge" component={Recharge}/>
                    <Route path="/main/business" component={Business}/>
                    <Route path="/main/personal" component={Personal}/>
                </div>
            </div>
        );
    }
}

export default MainTab;