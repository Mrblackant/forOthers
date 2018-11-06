/**
 *  积分订单
 */
import React, { Component } from 'react';
import { List, Toast, Modal } from 'antd-mobile';

import ImageConfig from '../../assets/imageConfig';
import Fetch from '../../components/fetch'

import '../../assets/css/common.css';
import '../../assets/css/mall.css';

const Item = List.Item;
const Alert = Modal.alert;

class Order extends Component {

	constructor(props) {
		super(props);
		this.state = {
			curOrder: {
				title: '',
				price: 0,
				prodCode: '',
				isEntity: false
			},
			address: ''
		}
	}

	componentWillMount() {
		document.title = '提交订单';
		document.body.scrollIntoView();
	}

	componentDidMount() {
		const curOrder = this.props.history.location.state;
		console.log(curOrder)
		if (curOrder) {
			this.setState({
				curOrder
			})
		}
		if (localStorage.MallInfo) {
			let MallInfo = JSON.parse(localStorage.getItem('MallInfo'));
			this.setState({
				address: MallInfo.address
			})
			MallInfo.address = '';
			localStorage.setItem('MallInfo', JSON.stringify(MallInfo));
		}
	}

	onShowAlert = () => {
		Alert( '兑换', '确认兑换？', [
          { text: '取消', onPress: () => console.log('cancel') },
          { text: '确定', onPress: () => this._submitOrder() },
        ])
	}

	_submitOrder(){
		if( this._isComplete() ){
			Toast.loading('加载中...', 0);
			Fetch.post('/d-app/API/order/integralExchange', {
				prodCode: this.state.curOrder.prodCode
			}).then( res =>{
				Toast.hide();
				this.props.history.push('/paySuccess', {payment: this.state.curOrder.price, sourceType: 2});
			}).catch( err =>{
				console.log(err)
			})
		} else {
			Toast.info('请选择收货地址', 1);
		}
	}

	_isComplete(){
		if( this.state.curOrder.isEntity && this.state.address === ''){
			return false;
		}
		return true;
	}

	render() {
		let { curOrder, address } = this.state;
		return (
			<div className='container-order'>
				<div className='detail'>
					<div className='detail-title'>
						积分兑换
					</div>
					<div style={{ color: '#444', fontSize: '1rem', fontWeight: 'bold' }}>
						{curOrder.price}
					</div>
					<div style={{ color: '#FE7C4C', fontSize: '0.6rem' }}>
						等待兑换
					</div>
					<div className='detail-intr'>
						<span className='sp1'>商品说明</span>
						<span className='sp2'>{curOrder.title}</span>
					</div>
					<div className='detail-intr'>
						<span className='sp1'>兑换金额</span>
						<span className='sp2'>{curOrder.price}</span>
					</div>
				</div>
				{
					curOrder.isEntity ?
						<List style={{ marginTop: '0.6rem' }}>
							<Item
								arrow="horizontal"
								onClick={() => this.props.history.push('/address', { sourceType: 1 })}
							>
								<div className="flex flex-align-items flex-space-between" style={{ height: '2rem' }}>
									<div style={{ fontSize: '0.7rem', color: '#444' }}>收货地址</div>
									{
										address ?
											<div
												style={{ fontSize: '0.7rem', color: '#444' }}
												className='order-address'
											>{address}</div> :
											<div
												style={{ fontSize: '0.7rem', color: '#d1d1d1' }}
											>请选择收货地址</div>
									}
								</div>
							</Item>
						</List>
						: null

				}
				<div style={{ fontSize: '0.6rem', color: '#444', marginLeft: '0.6rem', marginTop: '1.6rem' }}>
					兑换方式
				</div>

				<List style={{ marginTop: '0.6rem' }}>
					<Item onClick={() => { }}>
						<div className="flex flex-align-items" style={{ height: '2rem' }}>
							<img src={ImageConfig.WXLogo} alt="" style={{width: '1.3rem', height: '1.3rem'}}/>
							<div style={{ fontSize: '0.7rem', color: '#444', marginLeft: '0.6rem' }}>积分兑换</div>
						</div>
					</Item>
				</List>
				<div className="payment">
					<div style={{ marginLeft: '0.6rem' }}>
						<span style={{ fontSize: '0.6rem', color: '#606060' }}>
							实付积分：
						</span>
						<span style={{ fontSize: '0.8rem', color: '#FE7C4C' }}>
							{curOrder.price}
						</span>
					</div>
					<div
						className='linear-gradient '
						style={{ width: '5rem', height: '100%', lineHeight: '2.25rem', color: '#fff', textAlign: 'center', borderRadius: '0', fontSize: '0.7rem', background: this._isComplete() ? null : '#9c9c9c'}}
						onClick={ this.onShowAlert }
					>
						立即兑换
					</div>
				</div>
			</div>
		);
	}
}

export default Order;
