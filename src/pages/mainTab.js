/**
 *  首页底部
 */

import React, { Component } from 'react';
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
                        className="foot-bar-item"
                        exact
                        replace
                        activeStyle={activeStyle}
                        to="/"
                    >
                        <div
                            className="iconfont icon-shouye1 foot-bar-icon"
                        />

                        <span>首页</span>
                    </NavLink>

                    <NavLink
                        className="foot-bar-item"
                        replace
                        activeStyle={activeStyle}
                        to="/main/discount"
                    >
                        <div
                            className="iconfont icon-youhui foot-bar-icon"
                        />

                        <span>优惠</span>
                    </NavLink>
                     <NavLink
                        className="foot-bar-item"
                        replace
                        activeStyle={activeStyle}
                        to="/main/recharge"
                    >
                        <div
                            className=" flex flex-center iconfont icon-jifenshangcheng1 foot-bar-icon an_center_icon"
                            style={{fontSize:28,width:width/7.5,height:width/7.5,margin:' 0 auto',marginTop:-width/18}}
                        />

                        <span>加油卡</span>
                    </NavLink>
                    <NavLink
                        className="foot-bar-item"
                        replace
                        activeStyle={activeStyle}
                        to="/main/business"
                    >
                        <div
                            className="iconfont icon-jifenshangcheng1 foot-bar-icon"
                        />

                        <span>商城</span>
                    </NavLink>

                    <NavLink
                        className="foot-bar-item"
                        replace
                        activeStyle={activeStyle}
                        to="/main/personal"
                    >
                        <div
                            className="iconfont icon-gerenzhongxin foot-bar-icon"
                        />

                        <span>个人中心</span>
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