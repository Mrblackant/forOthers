import React, { Component } from 'react';
import {  Button, Toast } from 'antd-mobile';
import Fetch from '../../../components/fetch';

import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';



class AddCard extends Component {

	constructor(props){
		super(props);
		this.state = {
			nameVal: '',
			cardVal: '',
			phoneVal: ''
		}
	}

	componentWillMount(){
		document.body.scrollIntoView();
	}
	
	onSubmit = () =>{
		const RegExp_Phone = /^1[345678]\d{9}$/;
		const cardNumber = this.state.cardVal;
		const fullName = this.state.nameVal;
		const mobile = this.state.phoneVal;
		if (cardNumber.length !== 19 && cardNumber.length !== 16){
			Toast.info('请输入正确的油卡卡号', 1);
			return ;
		}
		if (cardNumber.length === 19 && cardNumber.slice(0, 6) !== '100011'){
			Toast.info('请输入正确的油卡卡号', 1);
			return;
		}
		if ( cardNumber.length === 16 && cardNumber.slice(0, 1) !== '9' ){
			Toast.info('请输入正确的油卡卡号', 1);
			return;
		}

		if ( !RegExp_Phone.test( mobile ) ){
			Toast.info('请输入正确的手机号码', 1);
			return;
		}
		

		Toast.loading('加载中...', 0);
		Fetch.post('/d-app/API/user/oilCardBind', {
			cardNumber,
			fullName,
			mobile
		}).then( res =>{
			Toast.loading('绑定成功', 1);
			this.props.history.goBack();
			console.log( res );
		}).catch( err =>{
			console.log( err );
		})

	}

	onChangeVal(val, key, number) {
		let value = val;
		if (value !== '' && !/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(value)){
			return;
		}

		console.log(value);
		if (number) {
			value = val.replace(/[^0-9]/g, '');
			console.log(value)
		}
		this.setState({
			[key]: value
		})
	}

	_isComplete(){
		const { nameVal, cardVal, phoneVal } = this.state;
		if ( !nameVal || !cardVal || !phoneVal ){
			return false;
		}
		return true;
	}

    render() {
        return (
            <div className="container-addCard flex">
				<div className="addCard-list">
                	<div 
						className="flex box-sizing item-wrap flex-align-items"
						style={{width: '100%', height: '2.2rem', padding: '0 0.6rem', background: '#fff' }}
                	>
                	    <div style={{ fontSize: '0.7rem', color: '#444' }}>姓名</div>
						<input
							type="text"
							placeholder='请输入姓名'
							onChange={(e) => this.onChangeVal(e.target.value, 'nameVal', false)}
							value={this.state.nameVal}
							maxLength={10}
							style={{ width: '16rem', height: '99%' }}
						/>
                	</div>
					<div
						className="flex box-sizing item-wrap flex-align-items"
						style={{ width: '100%', height: '2.2rem', padding: '0 0.6rem', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)' }}
					>
						<div style={{ fontSize: '0.7rem', color: '#444' }}>加油卡号</div>
						<input
							type="text"
							placeholder='请输入加油卡号'
							onChange={(e) => this.onChangeVal(e.target.value, 'cardVal', true)}
							value={this.state.cardVal}
							maxLength={19}
							style={{ width: '16rem', height: '99%' }}
						/>
					</div>
					<div
						className="flex box-sizing item-wrap flex-align-items"
						style={{ width: '100%', height: '2.2rem', padding: '0 0.6rem', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)' }}
					>
						<div style={{ fontSize: '0.7rem', color: '#444' }}>手机号码</div>
						<input
							type="text"
							placeholder='请输入手机号码'
							onChange={(e) => this.onChangeVal(e.target.value, 'phoneVal', true)}
							value={this.state.phoneVal}
							maxLength={11}
							style={{ width: '16rem', height: '99%' }}
						/>
					</div>
				</div>
				{console.log(!this._isComplete())}
				<Button 
					className="addCard-btn linear-gradient"
					activeStyle={{background: '#FE7F4F', color: '#fff'}}
					onClick={ this.onSubmit }
					disabled={ !this._isComplete() }
				>
					添加
				</Button>
				<div className="addCard-intr box-sizing">
					<span>温馨提示：</span>
					<span>1. 加油卡绑定功能仅支持多用户卡主卡、单用户卡绑定。</span>
					<span>2. 短信验证码将发送至加油卡系统登记的手机号码。</span>	
					<span>3. 如用户接收手机验证短信失败，请核对办理加油卡时登记的手机号码是否正确， 如手机号码登记错误，可持 相关证件到售卡充值网点办理资料变更；如核实登记手机号码无误，请致电中国石化客服热线。</span>
					<span>4. 如用户加油卡已失效，请解绑旧卡，绑定新卡。</span>
				</div>
            </div>
        );
    }
}

export default AddCard;
