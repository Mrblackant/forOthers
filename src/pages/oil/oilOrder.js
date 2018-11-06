/**
 *  积分订单
 */
import React, { Component } from 'react';
import { Modal, Toast } from 'antd-mobile';

import PwdControl from '../../components/pwdControl';
import Fetch from '../../components/fetch';

import '../../assets/css/common.css';
import '../../assets/css/mall.css';
import '../../assets/css/oil.css';

class OilOrder extends Component {

	constructor(props) {
		super(props);
		this.state = {
			curOrder: {},
			modal: false
		}
		this.pwdControl = null;
	}

	componentWillMount() {
		document.title = '提交订单';
		document.body.scrollIntoView();
	}

	componentDidMount() {
		const param = this.props.history.location.state;
		console.log(JSON.parse(localStorage.getItem('PersonalInfo')))
		let name = ''
		if (JSON.parse(localStorage.getItem('PersonalInfo')).nickName) {
			name = JSON.parse(localStorage.getItem('PersonalInfo')).nickName;
		}

		const curOrder = {
			title: `${param.amount}元充值`,
			cardNum: param.cardNum,
			amount: param.amount,
			prodCode: param.prodCode,
			cardId: param.cardId,
			name,
			checked: param.checked ? 1 : 0
		}
		console.log()
		this.setState({
			curOrder
		})
	}

	onSubmit() {
		Toast.loading('加载中...', 0);
		Fetch.post('/d-app/API/pwd/pwdIsSettings').then(res => {
			Toast.hide();
			if (res.pwdIsSettings === 2) {
				this._changeModal(true);
				// this.pwdControl._focus();
			} else {
				this.props.history.push('/modifyPwd', { pageType: 5 })
			}
		}).catch(err => {
			console.log(err)
		})
	}

	//验证密码
	_verifyPwd(val) {

		this.setState({
			modal: false
		})
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
			accPayAmount: curOrder.amount,
			cardId: curOrder.cardId,
			discountAmount: 0,
			payAmount: 0,
			payPwd: Fetch.CryptoJS.MD5(val).toString(),
			payType: 'wxJsPay',
			prodCode: curOrder.prodCode,
			prodNum: 0,
			rechargeAmount: curOrder.amount,
			appType: 'WX',
			isReplace: curOrder.checked
		}).then(res => {
			Toast.hide()
			const orderCode = res.orderCode;
			const totalPrice = res.totalPrice;
			console.log(orderCode);
			this.props.history.push('/paySuccess', { payment: totalPrice, sourceType: 1, orderCode: orderCode });
		}).catch(err => {
			console.log(err)

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
			console.log(res);
		}).catch(err => {
			console.log(err);
		})
	}

	render() {
		let { curOrder } = this.state;
		console.log(this.props.location.state)
		return (
			<div className='container-order'>
				<div className='detail' style={{ height: '15.65rem' }}>
					<div className='detail-title'>
						加油卡充值
					</div>
					<div style={{ color: '#444', fontSize: '1rem', fontWeight: 'bold', marginTop: '-0.5rem' }}>
						{curOrder.amount}
					</div>
					<div style={{ color: '#FE7C4C', fontSize: '0.6rem', marginTop: '-0.5rem' }}>
						等待付款
					</div>
					<div className='detail-intr'>
						<span className='sp1'>商品说明</span>
						<span className='sp2'>{curOrder.title}</span>
					</div>
					<div className='detail-intr'>
						<span className='sp1'>用户姓名</span>
						<span className='sp2'>{curOrder.name}</span>
					</div>
					<div className='detail-intr'>
						<span className='sp1'>油卡卡号</span>
						<span className='sp2'>{curOrder.cardNum}</span>
					</div>
					<div className='detail-intr'>
						<span className='sp1'>充值金额</span>
						<span className='sp2'>{curOrder.amount}</span>
					</div>
				</div>

				<div style={{ fontSize: '0.6rem', color: '#444', marginLeft: '0.6rem', marginTop: '1.6rem' }}>
					支付方式
				</div>
				<div className="theWay flex flex-align-items">
					<i className="iconfont icon-qia1" style={{ fontSize: '1.2rem', color: '#FE7C4C'}}></i>
					<span>余额支付</span>
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

export default OilOrder;