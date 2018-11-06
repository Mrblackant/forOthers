/**
 *  加油
 */

import React, { Component } from 'react';
import { List, Button, Toast } from 'antd-mobile';
import Fetch from '../../components/fetch';
import '../../assets/css/common.css';
import '../../assets/css/oil.css';

const Item = List.Item;
class Oil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curBusiness: localStorage.OilInfo ? JSON.parse(localStorage.OilInfo).pageType : 1
        }
    }

    componentWillMount() {
        document.title = '加油';
        document.body.scrollIntoView();
    }

    onChangeTab(index) {
        if (!(this.state.curBusiness === index)) {
            this.setState({
                curBusiness: index
            })
        }
    }

    render() {
        const { curBusiness } = this.state;
        return (
            <div
                className="container-oil"
            >
                <div
                    className="oil-titTab flex box-sizing"
                >
                    <div
                        className={curBusiness === 1 ? 'ac' : null}
                        onClick={() => this.onChangeTab(1)}
                    >中石化</div>
                    <div
                        className={curBusiness === 2 ? 'ac' : null}
                        onClick={() => this.onChangeTab(2)}
                    >中石油</div>
                </div>
                {
                    curBusiness === 1 ?
                        <PetroChina
                            history={this.props.history}
                        /> : <Sinopec history={this.props.history}/>
                }
            </div>
        )
    }
}

//中石化
class PetroChina extends Component {
    constructor(props) {
        super(props);
        this.state = {
            acAmountId: -1,		//当前选中的金额id
            amount: 0,			//充值金额
            cardNum: 0,			//卡号
            prodCode: '',		//产品编码
            cardId: -1,			//油卡id
            amountList: [],
            checked: true
        };
        this.balance = 0;
    }

    componentDidMount() {
        if (localStorage.getItem('openId')) {
            Toast.loading('加载中...', 0);
            if (localStorage.OilInfo) {
                let OilInfo = JSON.parse(localStorage.OilInfo);
                const { acAmountId, cardNum, amount, prodCode, cardId } = OilInfo;
                this.setState({
                    acAmountId, cardNum, amount, prodCode, cardId
                });
                localStorage.removeItem('OilInfo');
            }

            /* res.discount为折扣
               res.stageNumber为分期数 */
            Fetch.post('/d-app/API/product/oil', {
                oilType: 2
            }).then(res => {
                this.getUserInfo();
                Toast.hide();
                if (res ) {
                    this.setState({
                        amountList: res
                    });
                }

            }).catch(err => {
            })

        } else Fetch.reLoginFunc();
    }

    // 获取个人信息
    getUserInfo() {
        Fetch.post('/d-app/API/user/userInfo', {
            openId: localStorage.getItem('openId')
        }).then((result) => {
            if (result) {
                this.balance = result.balance;
                localStorage.setItem('PersonalInfo', JSON.stringify(result));
            }
        }).catch((err) => {
        });
    }

    //选择金额
    onSelectAmount(index, amount, prodCode) {
        if (!(this.state.acAmountId === index)) {
            this.setState({
                acAmountId: index,
                amount,
                prodCode
            })
        }
    }

    //跳转页面， 0到加油卡列表， 1到订单详情
    onJumpPage(type) {
        const { acAmountId, cardNum, amount, prodCode, cardId, checked } = this.state;

        //跳转前保存信息
        let OilInfo = { acAmountId, cardNum, amount, prodCode, cardId, pageType: 1, oilCardType: 1, checked };
        localStorage.setItem('OilInfo', JSON.stringify(OilInfo));

        if (type === 0) {
            this.props.history.push('/fuelCard', { type: 1 });
        } else if (type === 1) {
            if (parseFloat(this.balance) < parseFloat(amount)){
                Toast.info('余额不足', 1);
                setTimeout(()=>{this.props.history.push('/main/discount')},1200);
                return false;
            }
            this.props.history.push('/oilOrder', {
                amount,
                cardNum,
                prodCode,
                cardId,
                checked
            })
        }
    }

    //判断信息是否完整，可以跳转到订单详情
    _isComplete() {
        const { amount, cardNum } = this.state;
        if (amount !== 0 && cardNum !== 0) {
            return true;
        }
        return false;
    }

    //判断是否第三个
    _isSpecial(index){
        if( (index + 1) % 3 === 0 ){
            return false;
        }
        return true;
    }

    render() {
        const { acAmountId, cardNum, amountList, checked } = this.state;
        let className = 'oil-check-contain';
        if (checked) className = 'oil-check-contain active';

        return (
            <div
                className="container-petroChina"
                style={{ marginTop: '0.6rem' }}
            >
                <List
                    style={{ height: '2.2rem' }}
                    onClick={() => this.onJumpPage(0)}
                >
                    <Item arrow="horizontal" onClick={() => { }} >
                        <div
                            className="flex flex-align-items flex-space-between"
                            style={{ height: '2.2rem' }}
                        >
                            <div style={{ fontSize: '0.7rem', color: '#444' }}>加油卡号</div>
                            {
                                cardNum ?
                                    <div
                                        style={{ fontSize: '0.7rem', color: '#444' }}
                                    >{cardNum}</div> :
                                    <div
                                        style={{ fontSize: '0.7rem', color: '#d1d1d1' }}
                                    >请选择加油卡号</div>
                            }
                        </div>
                    </Item>
                </List>
                <div
                    style={{ overflow: 'hidden', padding: '0.6rem', background: '#fff', marginTop: '0.6rem' }}
                >
					<span
                        className="recharge-tit"
                    >请选择充值面额</span>
                    <div className="recharge-list">
                        {
                            amountList.map((item, index) => (
                                <div
                                    key={index}
                                    className={`recharge-item flex box-sizing ${acAmountId === index ? 'ac' : ''}`}
                                    onClick={() => this.onSelectAmount(index, item.price, item.prodCode)}
                                    style={ this._isSpecial(index) ? {marginRight: '0.675rem'} : null}
                                >
                                    充{item.price}元
                                </div>
                            ))
                        }
                    </div>
                </div>

{/*                 <List
                    style={{ height: '2.2rem', marginBottom: 12 }}
                >
                    <Item
                        extra={<div style={{ color: '#C3C3C3', fontSize: 12 }}>
                            每月为您自动充值
                            <span className={className}>
                                <i className="iconfont icon-check" style={{ fontSize: 12, color: '#fff' }}/>
                            </span>
                        </div>}
                        onClick={() => this.setState({checked: !this.state.checked})}
                    >
                        <div
                            className="flex flex-align-items flex-space-between"
                            style={{ height: '2.2rem' }}
                        >
                            <div style={{ fontSize: '0.7rem', color: '#444' }}>代扣</div>
                        </div>
                    </Item>
                </List>

                <List
                    style={{ height: '2.2rem' }}
                >
                    <Item arrow="horizontal" onClick={() => this.props.history.push('/withhold')} >
                        <div
                            className="flex flex-align-items flex-space-between"
                            style={{ height: '2.2rem' }}
                        >
                            <div style={{ fontSize: '0.7rem', color: '#444' }}>我的代扣</div>
                        </div>
                    </Item>
                </List> */}

                <Button
                    className="recharge-btn linear-gradient"
                    activeStyle={{ background: '#FE7F4F' }}
                    onClick={() => this.onJumpPage(1)}
                    disabled={this._isComplete() ? false : true}
                >
                    立即充值
                </Button>


            </div>
        )
    }
}

//中石油
class Sinopec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            acAmountId: -1,		//当前选中的金额id
            amount: 0,			//充值金额
            cardNum: 0,			//卡号
            prodCode: '',		//产品编码
            cardId: -1,			//油卡id
            amountList: [],
            checked: true
        };
        this.balance = 0;
    }

    componentDidMount() {
        Toast.loading('加载中...', 0);
        if (localStorage.OilInfo) {
            let OilInfo = JSON.parse(localStorage.OilInfo);
            const { acAmountId, cardNum, amount, prodCode, cardId, checked } = OilInfo;
            this.setState({
                acAmountId, cardNum, amount, prodCode, cardId, checked
            });
            localStorage.removeItem('OilInfo');
        }

        /* res.discount为折扣
              res.stageNumber为分期数 */
        Fetch.post('/d-app/API/product/oil', {
            oilType: 1
        }).then(res => {
            Toast.hide();
            if (res ) {
                this.setState({
                    amountList: res
                });
            }

        }).catch(err => {
        })
    }

    //跳转页面， 0到加油卡列表， 1到订单详情
    onJumpPage(type) {
        const { acAmountId, cardNum, amount, prodCode, cardId, checked } = this.state;

        //跳转前保存信息
        let OilInfo = { acAmountId, cardNum, amount, prodCode, cardId, pageType: 2, oilCardType: 2, checked };
        localStorage.setItem('OilInfo', JSON.stringify(OilInfo));

        if (type === 0) {
            this.props.history.push('/fuelCard', { type: 1 });
        } else if (type === 1) {

            if (this.balance < amount){
                Toast.info('余额不足', 1);
                return false;
            }
            this.props.history.push('/oilOrder', {
                amount,
                cardNum,
                prodCode,
                cardId,
                checked
            })
        }
    }

    //选择金额
    onSelectAmount(index, amount, prodCode) {
        if (!(this.state.acAmountId === index)) {
            this.setState({
                acAmountId: index,
                amount,
                prodCode
            })
        }
    }

    //判断信息是否完整，可以跳转到订单详情
    _isComplete() {
        const { amount, cardNum } = this.state;
        if (amount !== 0 && cardNum !== 0) {
            return true;
        }
        return false;
    }

    //判断是否第三个
    _isSpecial(index){
        if( (index + 1) % 3 === 0 ){
            return false;
        }
        return true;
    }

    render() {
        const { acAmountId, cardNum, amountList, checked } = this.state;
        let className = 'oil-check-contain';
        if (checked) className = 'oil-check-contain active';

        return (
            <div
                className="container-petroChina"
                style={{ marginTop: '0.6rem' }}
            >
                <List
                    style={{ height: '2.2rem' }}
                    onClick={() => this.onJumpPage(0)}
                >
                    <Item arrow="horizontal" onClick={() => { }} >
                        <div
                            className="flex flex-align-items flex-space-between"
                            style={{ height: '2.2rem' }}
                        >
                            <div style={{ fontSize: '0.7rem', color: '#444' }}>加油卡号</div>
                            {
                                cardNum ?
                                    <div
                                        style={{ fontSize: '0.7rem', color: '#444' }}
                                    >{cardNum}</div> :
                                    <div
                                        style={{ fontSize: '0.7rem', color: '#d1d1d1' }}
                                    >请选择加油卡号</div>
                            }
                        </div>
                    </Item>
                </List>
                <div
                    style={{ overflow: 'hidden', padding: '0.6rem', background: '#fff', marginTop: '0.6rem' }}
                >
					<span
                        className="recharge-tit"
                    >请选择充值面额</span>
                    <div className="recharge-list">
                        {
                            amountList.map((item, index) => (
                                <div
                                    key={index}
                                    className={`recharge-item flex box-sizing ${acAmountId === index ? 'ac' : ''}`}
                                    onClick={() => this.onSelectAmount(index, item.price, item.prodCode)}
                                    style={ this._isSpecial(index) ? {marginRight: '0.675rem'} : null}
                                >
                                    充{item.price}元
                                </div>
                            ))
                        }
                    </div>
                </div>

{/*                 <List
                    style={{ height: '2.2rem', marginBottom: 12 }}
                >
                    <Item
                        extra={<div style={{ color: '#C3C3C3', fontSize: 12 }}>
                            每月为您自动充值
                            <span className={className}>
                                <i className="iconfont icon-check" style={{ fontSize: 12, color: '#fff' }}/>
                            </span>
                        </div>}
                        onClick={() => this.setState({checked: !this.state.checked})}
                    >
                        <div
                            className="flex flex-align-items flex-space-between"
                            style={{ height: '2.2rem' }}
                        >
                            <div style={{ fontSize: '0.7rem', color: '#444' }}>代扣</div>
                        </div>
                    </Item>
                </List>

                <List
                    style={{ height: '2.2rem' }}
                >
                    <Item arrow="horizontal" onClick={() => this.props.history.push('/withhold')} >
                        <div
                            className="flex flex-align-items flex-space-between"
                            style={{ height: '2.2rem' }}
                        >
                            <div style={{ fontSize: '0.7rem', color: '#444' }}>我的代扣</div>
                        </div>
                    </Item>
                </List> */}

                <Button
                    className="recharge-btn linear-gradient"
                    activeStyle={{ background: '#FE7F4F' }}
                    onClick={() => this.onJumpPage(1)}
                    disabled={this._isComplete() ? false : true}
                >
                    立即充值
                </Button>


            </div>
        )
    }
}

export default Oil