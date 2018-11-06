/**
 *  积分订单
 */
import React, { Component } from 'react';
import { Toast } from 'antd-mobile';

import Fetch from '../../../components/fetch';

import '../../../assets/css/common.css';
import '../../../assets/css/mall.css';
import '../../../assets/css/personal.css';



class orderDetails extends Component {

	constructor(props) {
		super(props);
		this.state = {
			curOrder:{
				rechargeDetailList: []
			}
		}
	}

	componentWillMount() {
		document.title = '订单详情';
		document.body.scrollIntoView();
	}

	componentDidMount() {

		const param = this.props.history.location.state;

		const orderCode = param ? param.orderCode : 0;
		console.log(orderCode)
		Toast.loading('加载中...', 0);
		Fetch.post('/d-app/API/order/orderDetailRecharge', {
			orderCode: orderCode
		}).then(res => {
			if (res) {
				this.setState({
					curOrder: res
				})
			}
			console.log(res);
			Toast.hide();
		}).catch(err => {
			console.log(err);
		})
	}

	//后台返回时间转换
	_fmtDate(obj) {
		console.log(typeof obj);
		let arr = obj.split(/[- : \/]/);
		let date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
		console.log(date)
		let y = 1900 + date.getYear();
		let m = "0" + (date.getMonth() + 1);
		let d = "0" + date.getDate();
		return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
	}

	render() {
		let { curOrder } = this.state;
		let detailsList = curOrder.rechargeDetailList;
		console.log(detailsList);
		return (
			<div className='container-order' style={{ paddingBottom: '3rem' }}>
				<div className='detail' style={{ height: '17.7rem' }}>
					<div className='detail-title'>
						加油卡充值
					</div>
					<div style={{ color: '#444', fontSize: '1rem', fontWeight: 'bold', marginTop: '-0.5rem' }}>
						-{curOrder.totalPrice}
					</div>
					<div style={{ color: '#FE7C4C', fontSize: '0.6rem', marginTop: '-0.5rem' }}>
						{curOrder.orderStatusStr}
					</div>
					<div className='detail-intr'>
						<span className='sp1'>商品说明</span>
						<span className='sp2'>{curOrder.prodName}</span>
					</div>
					<div className='detail-intr'>
						<span className='sp1'>用户姓名</span>
						<span className='sp2'>{curOrder.realName}</span>
					</div>
					<div className='detail-intr'>
						<span className='sp1'>油卡卡号</span>
						<span className='sp2'>{curOrder.cardNo}</span>
					</div>
					<div className='detail-intr'>
						<span className='sp1'>充值金额</span>
						<span className='sp2'>{curOrder.origPrice}</span>
					</div>
					<div className='detail-intr'>
						<span className='sp1'>实付金额</span>
						<span className='sp2'>{curOrder.totalPrice}</span>
					</div>
				</div>

				<div className="detail" style={{ height: '7.45rem', marginTop: '0.6rem' }}>
					<div className='detail-intr'>
						<span className='sp1'>订单编号</span>
						<span className='sp2'>{curOrder.orderCode}</span>
					</div>
					<div className='detail-intr'>
						<span className='sp1'>创建时间</span>
						<span className='sp2'>{curOrder.createTime}</span>
					</div>
					<div className='detail-intr'>
						<span className='sp1'>支付时间</span>
						<span className='sp2'>{curOrder.payTime}</span>
					</div>
				</div>
				{
					detailsList.length > 0 ?
					<div>
						<div style={{ lineHeight: '2.25rem', color: '#909090', fontSize: '0.6rem', marginLeft: '0.6rem' }}>
							充值明细
						</div>
						<div className="details-list box-sizing">
							<div className="list-top flex-space-between flex">
								<span>充值时间</span>
								<span>充值状态</span>
								<span>充值金额</span>
							</div>
							<ul>
								{
									detailsList.map((item, index) => (
										<li
											key={index}
											className="details-item flex flex-space-between"
										>
												<div>{this._fmtDate(item.rechargeTime) }</div>
											<div>
												<span style={{ marginRight: '0.1rem' }}>{`第${item.num}次`}</span>
												{
													item.rechargeStatusStr === '充值中' ?
														<span style={{ color: '#444', marginLeft: '0.1rem' }}>充值中</span> :
														(
															item.rechargeStatusStr === '充值成功' ? <span style={{ color: '#A7E7A1', marginLeft: '0.1rem' }}>充值成功</span> :
															(
																item.rechargeStatusStr === '到账余额' ? <span style={{ color: '#A7E7A1', marginLeft: '0.1rem' }}>到账余额</span> :
																<span style={{ color: '#444', marginLeft: '0.1rem' }}>未到账</span>
															)
														)
												}
											</div>
											<div>{item.rechargeMoney}</div>
										</li>
									))
								}
							</ul>
						</div> 
						
						</div>: null
				}
			</div>
		);
	}
}



export default orderDetails;
