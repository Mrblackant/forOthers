/**
 *  预购订单
 */
import React, { Component } from 'react';
import { Modal, Toast } from 'antd-mobile';

import ImageConfig from '../../assets/imageConfig';
import PwdControl from '../../components/pwdControl';
import Fetch from '../../components/fetch';

import '../../assets/css/common.css';
import '../../assets/css/mall.css';
import '../../assets/css/oil.css';

class DiscountOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curOrder: {},
            modal: false
        };
        this.pwdControl = null;
    }

    componentWillMount() {
        document.title = '提交订单';
        document.body.scrollIntoView();
    }

    componentDidMount() {
        const params = JSON.parse(localStorage.getItem('DiscountData'));
        const curOrder = {
            title: `预购${params.upperAmount}得${params.allAmount}(${params.upperCycleCount}期返还)`,
            payment: params.upperAmount,
            prodCode: params.prodCode
        };

        this.setState({ curOrder })
    }

    onSubmit() {
        Toast.loading('加载中...', 0);
        Fetch.post('/d-app/API/pwd/pwdIsSettings').then(res => {
            Toast.hide();
            if (res.pwdIsSettings === 2) {
                this._changeModal(true);
            } else {
                this.props.history.push('/modifyPwd', { pageType: 5 })
            }
        }).catch(err => {
        })
    }

    //验证密码
    _verifyPwd(val) {
        this.setState({
            modal: false
        });
        const { curOrder } = this.state;
        Toast.loading('加载中...', 0);
        /* 		accPayAmount: 账户可扣余额
                cardId: 油卡id
                discountAmount: 折扣
                payAmount: 实际支付
                payPwd: 支付密码
                payType: 支付类型
                prodCode: 产品编码
                prodNum: 产品数量
                rechargeAmount: 充值金额 */
        Fetch.post('/d-app/API/order/payment', {
            accPayAmount: 0,
            cardId: 0,
            discountAmount: 0,
            payAmount: curOrder.payment,
            payPwd: Fetch.CryptoJS.MD5(val).toString(),
            payType: 'wxJsPay',
            prodCode: curOrder.prodCode,
            prodNum: 0,
            rechargeAmount: curOrder.payment,
            appType: 'WX'
        }).then(res => {
            Toast.hide();
            const wxData = JSON.parse(res.wxData);
            const orderCode = res.orderCode;
            const totalPrice = res.totalPrice;

            this._onBridgeReady(wxData, orderCode, totalPrice);
        }).catch(err => {
        })
    }

    //modal的显示关闭
    _changeModal(val) {
        this.setState({
            modal: val
        })
    }

    _cancel(orderCode) {
        Fetch.post('/d-app/API/order/cancelPay', {
            orderCode
        }).then(res => {
        }).catch(err => {
        })
    }

    //调起微信支付接口
    _onBridgeReady(data, orderCode, totalPrice) {
        console.log('调起微信支付')
        window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": data.appid,     //公众号名称，由商户传入
                "timeStamp": data.timestamp,         //时间戳，自1970年以来的秒数
                "nonceStr": data.noncestr, //随机串
                "package": "prepay_id=" + data.prepayid,
                "signType": 'MD5',         //微信签名方式：
                "paySign": data.sign //微信签名
            }, res => {
                console.log(res)
                if (res.err_msg === "get_brand_wcpay_request:ok") {
                    setTimeout(() => {
                        this.props.history.push('/paySuccess', { payment: totalPrice, sourceType: 3, orderCode: orderCode });
                    }, 1500);
                }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                    this._cancel(orderCode);
                } else if (res.err_msg === 'get_brand_wcpay_request:fail') {

                }
            }
        );
    }

    render() {
        let { curOrder } = this.state;
        return (
            <div className='container-order'>
                <div className='detail'>
                    <div className='detail-title'>
                        预购充值
                    </div>
                    <div style={{ color: '#444', fontSize: '1rem', fontWeight: 'bold', marginTop: '-0.5rem' }}>
                        {curOrder.payment}
                    </div>
                    <div style={{ color: '#FE7C4C', fontSize: '0.6rem', marginTop: '-0.5rem' }}>
                        等待付款
                    </div>
                    <div className='detail-intr'>
                        <span className='sp1'>商品说明</span>
                        <span className='sp2'>{curOrder.title}</span>
                    </div>

                    <div className='detail-intr'>
                        <span className='sp1'>充值金额</span>
                        <span className='sp2'>{curOrder.payment}</span>
                    </div>
                </div>

                <div style={{ fontSize: '0.6rem', color: '#444', marginLeft: '0.6rem', marginTop: '1.6rem' }}>
                    支付方式
                </div>
                <div className="theWay flex flex-align-items">
                    <img src={ImageConfig.WXLogo} alt="" />
                    <span>微信支付</span>
                </div>
                <div className="payment">
                    <div style={{ marginLeft: '0.6rem' }}>
						<span style={{ fontSize: '0.6rem', color: '#606060' }}>
							实付金额：
						</span>
                        <span style={{ fontSize: '0.8rem', color: '#FE7C4C' }}>
							{curOrder.payment}
						</span>
                    </div>
                    <div
                        className='linear-gradient'
                        style={{ width: '5rem', height: '100%', lineHeight: '2.25rem', color: '#fff', textAlign: 'center' }}
                        onClick={() => this.onSubmit()}
                    >
                        立即充值
                    </div>
                </div>

                <Modal
                    popup
                    visible={this.state.modal}
                    onClose={() => this._changeModal(false)}
                    animationType="slide-up"
                >
                    <div className="paymentPwd">
                        <div className="paymentPwd-top modal-top">
                            <span>请输入支付密码</span>
                            <i
                                className="iconfont icon-guanbi"
                                onClick={() => this._changeModal(false)}
                            />
                        </div>
                        <div className="input-wrap box-sizing">
                            {
                                this.state.modal ?
                                    <PwdControl
                                        ref={ref => this.pwdControl = ref}
                                        focus={false}
                                        callBack={(val) => this._verifyPwd(val)}
                                    /> : null
                            }
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}


export default DiscountOrder;
