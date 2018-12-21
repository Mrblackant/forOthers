import React, { Component } from 'react';
import { Button, Toast, Modal } from 'antd-mobile';

import ImageConfig from '../../../assets/imageConfig';
import Fetch from '../../../components/fetch';
import PromptModal from '../../../components/promptModal';
import '../../../assets/css/common.css';
import '../../../assets/css/mall.css';

const Alert = Modal.alert;
const ScreenWidth = window.screen.width > 640 ? 640 : window.screen.width;
const totalHeight = document.documentElement.clientHeight;

class Address extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showDefault: true, 		//显示默认地址
			addressList: [],
			isDefault: -1
		};
		this.cancelInfo = null;  //保存要删除地址的id和下标
	}

	componentWillMount() {
		document.title = '收货地址';
		document.body.scrollIntoView();
	}

	componentDidMount() {
		this._getAddressList();

		if (this.props.history.location.state) {
			const type = this.props.history.location.state.sourceType;		//判断来源路由，1为积分商城订单
			if (type === 1) {
				this.setState({
					showDefault: false
				})
			}
		}
	}

	//跳页面
	onJumpPage(str) {
		if (this.state.showDefault) {
			return;
		}
		let MallInfo = JSON.parse(localStorage.getItem('MallInfo'));
		MallInfo.address = str;
		localStorage.setItem('MallInfo', JSON.stringify(MallInfo));
		this.props.history.goBack();
	}

	//设置默认地址
	onSetDefault(id, index) {
		if (id) {
			Toast.loading('加载中...', 0);
			Fetch.post('/d-app/API/address/setUpDefault', {
				adrId: id
			}).then(res => {
				this.setState({
					isDefault: index
				});
				Toast.hide();
			}).catch(err => {
				console.log(err);
			})
		}
	}

	//编辑地址
	onEditAdr(id) {
		if (id) {
			this.props.history.push('/newAddress', { sourceId: id })
		}
	}

	//删除收货地址
	_deleteAdr() {
		console.log('det')
		if (this.cancelInfo) {
			Toast.loading('加载中...', 0);
			Fetch.post('/d-app/API/address/deleteAdr', {
				adrId: this.cancelInfo.id
			}).then(res => {
				this._getAddressList();
				this.setState({
					isDefault: -1
				})
			}).catch(err => {
				console.log(err);
			})
		}
	}

	//获取数据
	_getAddressList() {
		Toast.loading('加载中...', 0);
		Fetch.post('/d-app/API/address/addressList')
			.then(res => {
				if (res) {
					this.setState({
						addressList: res
					})
				}
				Toast.hide();
			}).catch(err => {
				console.log(err);
			})
	}

	//rem转换px
	_remToPx(rem) {
		const cw = document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth;
		return rem * (cw / 375 * 20)
	}

	render() {
		const { showDefault, addressList } = this.state;
		console.log(this.state.isDefault);
		return (
			<div
				className="container-address box-sizing"
				style={{ height: 'auto' }}
			>
				{
					<div
						style={{ width: '100%', height: totalHeight - this._remToPx(5), overflowY: 'scroll'}}
					>
						{
							addressList.length !== 0 ?
								addressList.map((item, index) => (
									<div
										className="address-item"
										key={index}
									>
										<div
											className="item-top box-sizing"
											onClick={() => this.onJumpPage(item.address)}
										>
											<div
												className="flex flex-align-items"
												style={{ minHeight: '2.2rem', }}
											>
												<span>{item.person}</span>
												<span>{item.mobile}</span>
											</div>
											<div
												className=''
												style={{ color: '#909090', fontSize: '0.6rem', lineHeight: '0.85rem', wordBreak: 'break-all', paddingBottom: '0.6rem' }}>
												{item.provinceName + ' '}{item.cityName + ' '}{item.countyName + ' '}{item.addressInfo}
											</div>
										</div>
										<div className="item-bot box-sizing flex flex-space-between">
											{
												showDefault ?
													<div
														className="flex flex-space-between flex-align-items"

														onClick={() => this.onSetDefault(item.adrId, index)}
													>
														{

															this.state.isDefault === -1 ?
																<i className="iconfont icon-qia1" style={{ color: item.isDefault === 1 ? '#FE7F4F' : null, marginRight: '0.2rem' }}></i>
																:
																<i className="iconfont icon-qia1" style={{ color: this.state.isDefault === index ? '#FE7F4F' : null, marginRight: '0.2rem' }}></i>
														}
														<span >设为默认地址</span>
													</div> :
													<div></div>
											}
											<div
												className="flex flex-align-items flex-space-between"
												style={{ width: '6rem' }}
											>
												<div
													className="flex flex-space-between  flex-align-items"
													onClick={() => {
                                                        this.cancelInfo = {id:item.adrId,index:index };//保存要删除地址的id和下标
                                                        let content = '确认删除？';
														this.promptModal._showModal(true,content)
                                                    }}
												>
													<i
														className="iconfont icon-shanchu"
														style={{ marginRight: '0.2rem' }}>
													</i>
													<span>删除</span>
												</div>
												<div
													className="flex flex-space-between  flex-align-items"
													onClick={() => this.onEditAdr(item.adrId)}
												>
													<i
														className="iconfont icon-bianji"
														style={{ marginRight: '0.2rem' }}
													/>
													<span>编辑</span>
												</div>
											</div>
										</div>
									</div>
								))
								:
								<div style={{ width: '100%', height: '100%', marginTop: '9rem' }} className="flex-center flex">
									<img style={{ width: ScreenWidth / 2, height: ScreenWidth / 2 }} src={ImageConfig.noData} alt=" " />
								</div>}
					</div>
				}
				<Button
					className="linear-gradient address-btn"
					style={{ fontSize: '0.7rem', color: '#fff' }}
					icon={<i className="iconfont icon-zengjia1" style={{ fontSize: '0.8rem' }} />}
					activeStyle={{ background: '#FE7F4F' }}
					onClick={() => this.props.history.push('/newAddress')}
				>
					新增地址
                </Button>

                {/*是否确认删除模态框*/}
				<PromptModal
					ref={ref => this.promptModal = ref}
					title={'删除'}
					ConfirmCancel = {() => this._deleteAdr()}
				/>
			</div>

		);
	}
}

export default Address;
