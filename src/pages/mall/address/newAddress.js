import React, { Component } from 'react';
import { Button, List, Toast, Modal } from 'antd-mobile';

import AreaSelect from '../../../components/areaSelect';
import Fetch from '../../../components/fetch';

import '../../../assets/css/common.css';
import '../../../assets/css/mall.css';

const Item = List.Item;

class NewAddress extends Component {

	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			nameVal: '',
			phoneVal: '',
			addressVal: '',
			areaSelect: false,
			province: {
				title: '',
				id: -1
			},
			city: {
				title: '',
				id: -1
			},
			county: {
				title: '',
				id: -1
			}
		}
		this.textarea = null;
	}

	componentWillMount(){
		document.body.scrollIntoView();
	}

	componentDidMount() {
		const param = this.props.history.location.state;
		const sourceId = param ? param.sourceId : 0;
		
		if (sourceId !== 0) {
			document.title = '编辑地址';
			Toast.loading('加载中...', 0);
			Fetch.post('/d-app/API/address/addressItem', {
				adrId: sourceId
			}).then(res => {
				if (res) {
					this.setState({
						nameVal: res.person,
						phoneVal: res.mobile,
						areaSelect: true,
						addressVal: res.addressInfo,
						province: {
							title: res.provinceName,
							id: res.province
						},
						city: {
							title: res.cityName,
							id: res.city
						},
						county: {
							title: res.countyName,
							id: res.county
						}
					})
				}
				Toast.hide();
			}).catch(err => {
				console.log(err)
			})
		} else if (sourceId === 0) {
			document.title = '新增地址';
		}
	}

	//提交
	onSubmit = () => {

		const RegExp_Phone = /^1[345678]\d{9}$/;
		const { nameVal, phoneVal, addressVal, province, city, county } = this.state;
		const param = this.props.history.location.state;
		const sourceId = param ? param.sourceId : 0;

		if (!RegExp_Phone.test(phoneVal)) {
			Toast.info('手机号码格式不正确', 1);
			return;
		}
		Toast.loading('正在提交', 0);
		/* 	addressInfo	详细地址（必须） string
			adrId		收货地址id		number	为0表示新增，大于0表示编辑
			city		城市ID（必须）	number
			cityName	城市名称（必须）string
			county		区县ID（必须）	number
			countyName	区县名称（必须）string
			mobile		手机号（必须）	string
			person		真实姓名（必须）string
			province	省份ID（必须）	number
			provinceName省份名称（必须）string */

		Fetch.post('/d-app/API/address/addressEdit', {
			addressInfo: addressVal,
			adrId: sourceId,
			city: city.id,
			cityName: city.title,
			county: county.id,
			countyName: county.title,
			mobile: phoneVal,
			person: nameVal,
			province: province.id,
			provinceName: province.title
		}).then(res => {
			Toast.success('保存成功', 1);
			this.props.history.goBack();
		}).catch(err => {
		})
	}

	onChangeVal(val, key, textType, target) {
		if( target ){
			if(target.scrollHeight > 133){
				return;
			}
		}

		let value = val;

		if (textType === 'number') {
			value = val.replace(/[^0-9]/g, '');
		}

		if (value !== '') {
			if (textType === 'address') {
				if (!/^[\u4E00-\u9FA5A-Za-z0-9\s*\(\)#_]+$/.test(value)) {
					return;
				}
				if(/^\n/.test(value)){
					return;
				}
				if (value.length > 64) {
					return;
				}
			}
			if (textType === 'name') {
				if (!/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(value)) {
					return;
				}
				if (value.length > 10) {
					return;
				}
			}
		}

		this.setState({
			[key]: value
		})
		
	}

	//选择地区的回调
	_acArea(province, city, county) {
		this.setState({
			modal: false,
			areaSelect: true,
			province,
			city,
			county
		})
	}
	//判断是否可以提交
	_isComplete() {
		if (!this.state.nameVal || !this.state.addressVal || !this.state.phoneVal || !this.state.areaSelect) {
			return false;
		}
		return true;
	}

	//改变modal
	_changeModal(value) {
		this.setState({
			modal: value
		})
	}

	//切换多行
	_multiLine() {

		let str = this.state.addressVal;
		let strNum = 0;
		for (let i = 0; i < str.length; i++) {

			if (/^[\u4e00-\u9fa5]+$/.test(str[i])) {
				strNum += 2;
			} else {
				strNum++;
			}
		}

		if (strNum < 32) {
			return {
				height: '2.2rem',
				lineHeight: '2.2rem',
				padding: '0'
			}
		} else if (strNum >= 32 && strNum < 64) {
			return {
				height: '4.4rem',
				lineHeight: '1rem',
				padding: '0.6rem 0'
			}
		} else if (strNum >= 64) {
			return {
				height: '5.4rem',
				lineHeight: '1rem',
				padding: '0.6rem 0'
			}
		}
		return (this.state.addressVal.length > 32)
	}

	render() {
		const { province, city, county, areaSelect } = this.state;
		return (
			<div className="container-address">
				<div style={{ marginTop: '0.6rem' }}>
					<div className="add-input-wrap" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
						<div>收货人</div>
						<input
							type="text"
							placeholder="请输入收货人"
							maxLength={10}
							onChange={(e) => this.onChangeVal(e.target.value, 'nameVal', 'name')}
							value={this.state.nameVal}
							style={{ width: '16rem', height: '99%' }}
						/>
					</div>
					<div className="add-input-wrap">
						<div>联系方式</div>
						<input
							type="text"
							placeholder="请输入联系方式"
							maxLength={11}
							onChange={(e) => this.onChangeVal(e.target.value, 'phoneVal', 'number')}
							value={this.state.phoneVal}
							style={{ width: '16rem', height: '99%' }}
						/>
					</div>
					<List>
						<Item arrow="horizontal" onClick={() => this._changeModal(true)} >
							<div className="flex flex-align-items" style={{ height: '2.2rem' }}>
								<div style={{ fontSize: '0.65rem', color: '#444', width: '4rem' }}>所在地区</div>
								<div
									className="nowrap"
									style={{ fontSize: '0.65rem', color: '#444', width: '12rem' }}
								><span style={{ display: areaSelect ? 'none' : 'block', color: 'rgb(117, 117, 117)', fontSize: '0.65rem' }}>请选择</span>
									{' ' + province.title}
									{' ' + city.title}
									{' ' + county.title}
								</div>
							</div>
						</Item>
					</List>
					<div className="add-input-wrap" style={{ height: 'auto', alignItems: 'flex-start' }}>
						<div
							style={{lineHeight: '1rem',padding: '0.6rem 0'}}
						>详细地址</div>
						<textarea
							type="text"
							ref= { ref => this.textarea = ref }
							placeholder="请输入详细地址"
							cols={32}
							rows={4}
							maxLength={64}
							onChange={(e) => this.onChangeVal(e.target.value, 'addressVal', 'address', e.target)}
							value={this.state.addressVal}
							className="box-sizing"
							style={{ width: '16rem', height: '5.2rem', resize: 'none', flex: '1', padding: '0.6rem 0', lineHeight: '1rem', overflowX: 'hidden'}}
					/>
					</div>
				</div>
				<Button
					className="linear-gradient address-save-btn"
					style={{ fontSize: '0.7rem', color: '#fff' }}
					activeStyle={{ background: '#FE7F4F' }}
					onClick={this.onSubmit}
					disabled={!this._isComplete()}
				>
					保存
				</Button>
				<Modal
					popup
					visible={this.state.modal}
					onClose={() => this._changeModal(false)}
					animationType="slide-up"
				>
					<AreaSelect
						callBack={(province, city, county) => this._acArea(province, city, county)}
					/>
				</Modal>
			</div>
		);
	}
}

export default NewAddress;