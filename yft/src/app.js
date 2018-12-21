/**
 *  路口配置
 */
import React, { Component } from 'react';
import {
    BrowserRouter,
    Route, Switch
} from 'react-router-dom';

//登录
import Login from './pages/auth/login';

// 首页
import MainTab from './pages/mainTab';

// 个人中心
import PersonalInfo from './pages/person/personalInfo/personalInfo';
import FuelCard from './pages/person/cards/fuelCard';
import OrderList from './pages/person/order/orderList';
import VoucherCard from './pages/person/voucherCard';
import MyPoints from './pages/person/myPoints';
import NoticeCenter from './pages/person/noticeCenter';
import CarList from './pages/person/cars/carList';
import CarEdit from './pages/person/cars/carEdit';
import InfoEdit from './pages/person/personalInfo/infoEdit';
import AddCard from './pages/person/cards/addCard';
import OrderDetails from './pages/person/order/orderDetails';
import ModifyPwd from './pages/person/personalInfo/modifyPwd';
import AmountDetails from './pages/person/amountDetails';
import Feedback from './pages/person/feedback';
import RememberPwd from './pages/person/personalInfo/rememberPwd';
import EnterOldPwd from './pages/person/personalInfo/enterOldPwd';
import SendCode from './pages/person/personalInfo/sendCode';
import EnterPwd from './pages/person/personalInfo/enterPwd';
import AboutUs from './pages/person/aboutUs';
import Faq from './pages/person/faq';
import ReturnRecord from './pages/person/returnRecord';

import Withdraw from './pages/person/business/withdraw';
import WithdrawSuccess from './pages/person/business/withdrawSuccess';
import NearbyMap from './pages/person/business/nearbyMap';
import MyBusiness from './pages/person/business/myBusiness';
import DetailList from './pages/person/business/detailList';

import Reward from './pages/person/reward';

//积分订单
import Mall from "./pages/mall/mall";
import Order from './pages/mall/order';
import PaySuccess from './pages/mall/paySuccess';
import Address from './pages/mall/address/address';
import NewAddress from './pages/mall/address/newAddress';

//加油
import Oil from './pages/oil/oil.js';
import OilOrder from './pages/oil/oilOrder.js';
import DiscountOrder from './pages/oil/discountOrder';
import Withhold from './pages/oil/withhold';

//商城
import Business from './pages/business/business';
import Search from './pages/business/search';
import BusinessDetail from './pages/business/businessDetail';
import ConfirmPurchase from './pages/business/confirmPurchase';
import UseVoucher from './pages/business/useVoucher';
import GoodsDetail from './pages/business/goodsDetail';
import GoodsPic from './pages/business/goodsPic';
import BusinessMap from './pages/business/businessMap';
import SelectCity from './pages/business/selectCity';
import BulletList from './pages/business/bulletList';

// 我的订单
import MyOrder from './pages/person/myOrder/myOrder';
import OilOrderDetail from './pages/person/myOrder/oilOrderDetail';
import PreChargeDetail from './pages/person/myOrder/preChargeDetail';
import LiveDetail from './pages/person/myOrder/liveDetail';

//我的会员卡
import VipCard from './pages/person/myVipCard/vipCard';
import VipCardDetail from './pages/person/myVipCard/vipCardDetail';

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div style={{ width: '100%', height: '100%' }}>
                    <Switch>
                        {/*首页*/}
                        <Route exact path="/" component={MainTab} />
                        <Route path="/main" component={MainTab} />

                        {/*登录*/}
                        <Route path="/login" component={Login} />

                        {/*个人中心*/}
                        <Route path="/personalInfo" component={PersonalInfo} />
                        <Route path="/fuelCard" component={FuelCard} />
                        <Route path="/orderList" component={OrderList} />
                        <Route path="/voucherCard" component={VoucherCard} />
                        <Route path="/myPoints" component={MyPoints} />
                        <Route path="/noticeCenter" component={NoticeCenter} />
                        <Route path="/carList" component={CarList} />
                        <Route path="/carEdit" component={CarEdit} />
                        <Route path="/infoEdit" component={InfoEdit} />
                        <Route path="/orderDetails" component={OrderDetails} />
                        <Route path="/modifyPwd" component={ModifyPwd} />
                        <Route path="/addCard" component={AddCard} />
                        <Route path="/amountDetails" component={AmountDetails} />
                        <Route path="/feedback" component={Feedback} />
                        <Route path="/rememberPwd" component={RememberPwd} />
                        <Route path="/enterOldPwd" component={EnterOldPwd} />
                        <Route path="/sendCode" component={SendCode} />
                        <Route path="/enterPwd" component={EnterPwd} />
                        <Route path="/aboutUs" component={AboutUs} />
                        <Route path="/faq" component={Faq} />
                        <Route path='/returnRecord' component={ReturnRecord} />
                        <Route path='/withdraw' component={Withdraw} />
                        <Route path='/withdrawSuccess' component={WithdrawSuccess} />
                        <Route path='/myBusiness' component={MyBusiness} />
                        <Route path='/detailList' component={DetailList} />
                        <Route path='/withhold' component={Withhold} />
                        <Route path='/reward' component={Reward} />
                        
                        {/*积分商城*/}
                        <Route path="/order" component={Order} />
                        <Route path="/paySuccess" component={PaySuccess} />
                        <Route path="/address" component={Address} />
                        <Route path="/newAddress" component={NewAddress} />
                        <Route path="/mall" component={Mall} />

                        {/*加油*/}
                        <Route path="/oil" component={Oil} />
                        <Route path="/oilOrder" component={OilOrder} />
                        <Route path="/discountOrder" component={DiscountOrder} />

                        {/*商城*/}
                        <Route path="/business" component={Business} />
                        <Route path="/search" component={Search} />
                        <Route path="/nearbyMap" component={NearbyMap} />                        
                        <Route path="/businessDetail/:name" component={BusinessDetail} />
                        <Route path="/confirmPurchase" component={ConfirmPurchase} />
                        <Route path="/useVoucher" component={UseVoucher} />
                        <Route path="/goodsDetail/:name" component={GoodsDetail} />
                        <Route path="/goodsPic" component={GoodsPic} />
                        <Route path="/businessMap/:name" component={BusinessMap} />
                        <Route path="/selectCity" component={SelectCity} />
                        <Route path="/bulletList" component={BulletList} />

                        {/*我的订单*/}
                        <Route path="/myOrder" component={MyOrder} />
                        <Route path="/oilOrderDetail" component={OilOrderDetail} />
                        <Route path="/preChargeDetail" component={PreChargeDetail} />
                        <Route path="/liveDetail" component={LiveDetail} />

                        {/*我的会员卡*/}
                        <Route path="/vipCard" component={VipCard} />
                        <Route path="/vipCardDetail" component={VipCardDetail} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}