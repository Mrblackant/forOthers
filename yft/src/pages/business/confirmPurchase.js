/***确认买单***/
import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile';
import Fetch from '../../components/fetch';


import '../../assets/css/common.css';
import '../../assets/css/personal.css';
import PayModal from '../../components/payModal';

class ConfirmPurchase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            consumeMoney: '', //总金额
            voucher: '',//抵用券面额
            couponId: 0,//抵用券Id
            isShow: false
        };
        this.sourceType = this.props.history.location.state ? this.props.history.location.state.type : 1;//1---商家买单，2----商品买单
        this.goodsName = this.props.history.location.state ? this.props.history.location.state.goodsName : '';//商品名称
        this.goodsPrice = this.props.history.location.state ? this.props.history.location.state.goodsPrice : '';//商品价格
        this.prodCode =  this.props.history.location.state ? this.props.history.location.state.prodCode : '';//商品id
        this.shopsId = this.props.history.location.state ? this.props.history.location.state.shopsId : 0;// 商户id
        this.shopsName = this.props.history.location.state ? this.props.history.location.state.shopsName : '';// 商户名称
        this.payType =  1;	//付款方式: 1.余额支付 2.店铺会员卡支付
        this.realMoney = '';//实际支付金额
    }

    componentWillMount() {
        document.body.scrollIntoView();
        document.title = '确认买单';
    }

    componentDidMount() {
        let voucherObj = JSON.parse(localStorage.getItem('checkedVoucher'));//选中卡券的面额和id
        let consumeMoney = localStorage.getItem('ConsumeMoney');//商家买单时---总金额
        if (voucherObj) {
            this.setState({
                voucher: voucherObj.voucher,
                couponId: voucherObj.couponId,
                consumeMoney: consumeMoney
            });
            localStorage.removeItem('checkedVoucher');
            localStorage.removeItem('ConsumeMoney');
        }
    }

    //确认付款
    onSubmit() {
        this.setState({isShow: !this.state.isShow});//为了让支付模态框初始化
        let payAmount = this.sourceType === 1 ? this.state.consumeMoney : this.goodsPrice;//应付金额

        // 1、先验证有无支付密码
        Fetch.post('d-app/API/pwd/pwdIsSettings').then(res => {
            Toast.hide();
            if (res.pwdIsSettings === 2) {
                // 2、打开支付方式模态框
                this.payModal._showModal(true,this.shopsName,payAmount);
            } else {
                this.props.history.push('/modifyPwd', { pageType: 5 })      //设置支付密码
            }
        }).catch(err => {
            console.log(err)
        })
    }


    // 去支付---调买单接口
    /**
     * @params :payInfo = {
     *                 payType: this.payType,
     *                 cardCode: this.checkedCardCode,
     *                 payPassword: payPwd,
     *          };
     **/
    _toPay(payInfo){
        let {consumeMoney ,voucher ,couponId} = this.state;
        //请求参数
        let requestObj = {
            cardCode: payInfo ? payInfo.cardCode : '',          //会员卡号
            couponId: couponId,                                 //	抵用卷id
            discountAmount: Number(voucher),                            //	抵用卷优惠金额
            payPassword: Fetch.CryptoJS.MD5(payInfo.payPassword).toString(),   //	支付密码
            payType: payInfo ? payInfo.payType : 1,             //	付款方式
            realMoney: Number(this.realMoney),                          //	实付金额
            shopsId: this.shopsId,                              //商户id
        };
        //请求url
        let requestUrl = '';
        if(this.sourceType === 1){  //1---商家买单
            requestObj.consumeMoney = Number(consumeMoney);        //消费总额
            requestUrl = '/d-app/API/order/shopsPay';

        }else{                      //2----商品买单
            requestObj.payMoney =  Number(this.goodsPrice);         //总价
            requestObj.prodCode = this.prodCode;           //	产品编码
            requestUrl = '/d-app/API/order/shopsProdPay';
        }
        console.log(requestObj);
        Fetch.post(requestUrl, requestObj).then(res => {
            console.log()
            const orderCode = res.orderCode;
            Toast.hide();
            this.props.history.push('/paySuccess', {
                payment: this.realMoney,
                sourceType: 4, //生活消费类订单
                orderCode: orderCode ,
                shopsId: this.shopsId,
                rechargeType: this.sourceType === 1 ? 2 : 3	//rechargeType:充值类型（1-油卡充值；2-商家买单，3-商品买单）
            });
            // Toast.success('提交成功');
            // setTimeout(() => {this.props.history.goBack()},1000);
        }).catch(err => {
            console.log(err);
            Toast.info(err.errDesc);
        })
    }

    // 消费总额
    onChangeVal(val) {
        let value = val.replace(/[^0-9.]/g, '');
        // 最大长度5位
        if (value.length >= 5) {
            value = value.slice(0, 5)
        }
        this.realMoney = value - this.state.voucher; //输入总额时，实付金额实时变化
        this.setState({
            consumeMoney: value
        })
    }

    // 实付金额处理---当 商品价格-抵用券面额 <=1 时，均支付1元
    _manageRealMoney() {
        let { consumeMoney, voucher } = this.state;
        if (this.sourceType === 1) {//商家确认买单
            if (consumeMoney) {//有总额输入时
                if(!voucher  || Number(voucher)===0){//未选择抵用券
                    this.realMoney = consumeMoney;
                }else{//有使用抵用券
                    if (Number(consumeMoney) - Number(voucher) <= 1) {
                        this.realMoney = '1'
                    } else {
                        this.realMoney = (Number(consumeMoney) - Number(voucher)).toFixed(2)
                    }
                }

            } else {
                this.realMoney = ''
            }

        } else {//商品确认买单
            if(this.goodsPrice){
                if(!voucher || Number(voucher)===0){//未选择抵用券
                    this.realMoney = this.goodsPrice;
                }else {//有使用抵用券
                    if (Number(this.goodsPrice) - Number(voucher) <= 1) {
                        this.realMoney = '1'
                    } else {
                        this.realMoney = (Number(this.goodsPrice) - Number(voucher)).toFixed(2)
                    }
                }
            }else{
                this.realMoney = ''
            }
        }
        return this.realMoney;
    }

    // 按钮是否可点击
    _isComplete() {
        const { consumeMoney } = this.state;
        if (this.sourceType === 1) {
            if (!consumeMoney) {
                return false;
            }
        } else {
            if (!this.goodsPrice) {
                return false;
            }
        }
        return true;
    }

    render() {
        let { consumeMoney, voucher ,couponId} = this.state;
        let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));
        return (
            <div
                className="container-addCard flex "
                style={{width:'100%',height:'100%',overflow:'hidden'}}
            >
                <div className="flex flex-center"
                    style={{ width: '100%', flexDirection: 'column', }}
                >
                    {
                        this.sourceType === 1 ?
                            <div
                                className="flex box-sizing item-wrap flex-center"
                                style={{
                                    width: '95%', height: '2.2rem',
                                    padding: '0 0.6rem', background: '#fff',
                                    marginTop: '0.6rem',
                                    marginBottom: '0.6rem', borderRadius: 5
                                }}
                            >
                                <div style={{ fontSize: 16, color: '#666666' }}>消费总额</div>
                                <input
                                    type="number"
                                    maxLength={10}
                                    autoFocus={true}
                                    placeholder='询问服务员后输入'
                                    onChange={(e) => this.onChangeVal(e.target.value)}
                                    value={consumeMoney}
                                    style={{ width: '14rem', height: '99%', fontSize: 14, paddingLeft: 15, color: '#FF9168' }}
                                />
                            </div>
                            :
                            <div
                                className="flex box-sizing item-wrap flex-align-items flex-space-between"
                                style={{
                                    width: '100%', height: '2.2rem', padding: '0 0.6rem',
                                    background: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)',
                                    marginBottom: 10,
                                }}
                            >
                                <div
                                    className="nowrap"
                                    style={{ fontSize: 16, fontWeight: 'bold', color: '#333', width: '70%' }}
                                >
                                    {this.goodsName}
                                </div>
                                <span style={{ color: '#FF9168', fontSize: 16 }}>{this.goodsPrice}</span>
                            </div>
                    }

                    {/*抵用劵*/}
                    <div
                        className="flex box-sizing item-wrap flex-align-items flex-space-between"
                        style={{ width: '100%', height: '2.2rem', padding: '0 0.6rem', background: '#fff' }}
                        onClick={
                            () => {
                                this.props.history.push('/useVoucher', { couponId: couponId, consumeMoney: consumeMoney ,type: this.sourceType})
                            }
                        }
                    >
                        <div style={{ fontSize: 16, color: '#666666' }}>抵用劵</div>
                        {

                            Number(voucher) > 0 ? <span style={{ fontSize: 16, color: '#FF9168' }}>-{this.state.voucher}</span>
                                :
                                <span className="iconfont icon-youjiantou" style={{ fontSize: 10, color: '#B5B5B5' }} />
                        }
                    </div>

                    {/*实付金额*/}
                    <div
                        className="flex box-sizing item-wrap flex-align-items flex-space-between"
                        style={{ width: '100%', height: '2.2rem', padding: '0 0.6rem', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)' }}
                    >
                        <div style={{ fontSize: 16, color: '#666666' }}>实付金额</div>
                        <span style={{ color: '#FF9168', fontSize: 16 }}>
                            {
                                this._manageRealMoney()
                            }
                        </span>
                    </div>

                    {/*商家联系方式*/}
                    {
                        this.sourceType === 1 ?
                            null
                            :
                            <div
                                className="flex box-sizing item-wrap flex-align-items flex-space-between"
                                style={{
                                    width: '100%', height: '2.2rem', padding: '0 0.6rem',
                                    background: '#fff', marginTop: 10
                                }}
                            >

                                <span style={{ color: '#666', fontSize: 16 }}>
                                    {PersonalInfo ? PersonalInfo.mobile : ''}
                                </span>
                            </div>
                    }


                </div>

                <Button
                    className="linear-gradient"
                    activeStyle={{ fontSize: 16, background: '#FE7C4C', color: '#fff' }}
                    style={{
                        height:'2.1rem',width:'17.55rem',marginTop:'2.5rem',
                        color: '#ffffff', fontSize: 16, lineHeight:'2.1rem',alignItems: 'center'
                    }}
                    onClick={() => this.onSubmit()}
                    disabled={!this._isComplete()}
                >
                    确认买单
                </Button>

                <div className="addCard-intr box-sizing" style={{ marginTop: 15 }}>
                    <span style={{ color: '#999999', fontSize: 12 }}>买单仅限于到店支付，请确认金额后提交</span>
                </div>


                {/*支付模态框*/}
                <PayModal
                    ref = {ref => this.payModal = ref}
                    history = {this.props.history}
                    toPay = {(data) => {this._toPay(data)}}
                    isShow={this.state.isShow}
                />

            </div>
        );
    }
}

export default ConfirmPurchase;
