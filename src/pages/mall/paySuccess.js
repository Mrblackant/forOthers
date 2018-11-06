/**
 *  积分订单
 */
import React, { Component } from 'react';
import '../../assets/css/common.css';
import '../../assets/css/mall.css';

//模拟获取到的订单
const curPay = 10000;

class PaySuccess extends Component {

	constructor(props){
		super(props);
		this.state = {
			curPay,
			sourceType: 0		//来源页面， 1为加油， 2为积分， 3为预购， 4为生活消费
		}
	}

	componentWillMount() {
		document.titlt = '支付成功'
	}

	componentDidMount(){
		const param = this.props.history.location.state;
		if( param ){
			console.log(param.payment);
			this.setState({
				curPay: param.payment,
				sourceType: param.sourceType,
				orderCode: param.orderCode ? param.orderCode : '',
                shopsId: param.shopsId ? param.shopsId : '',
                rechargeType: param.rechargeType ? param.rechargeType : '',
			})
		}
	}
	
	onJumpPage = () =>{
		let {sourceType, orderCode, curPay,shopsId,rechargeType} = this.state;
		if( sourceType === 1){
			this.props.history.push('/oilOrderDetail', { orderCode: this.state.orderCode, payStatus: 3 })
		} else if (sourceType === 2) {
			this.props.history.push('/myPoints')
		} else if(sourceType === 3){
			this.props.history.push('/returnRecord')
		} else if(sourceType === 4){
            this.props.history.push('/liveDetail', {
            	rechargeType: rechargeType,//rechargeType:充值类型（1-油卡充值；2-商家买单，3-商品买单）
                prodPrice: curPay,
                shopsId: shopsId,
				orderCode: orderCode,
				payStatus: 3             //支付状态；1，未付款；2，付款中；3，已付款 4，已退款',
            })
        }
	};

    render() {
    	let { curPay } = this.state;
        return (
			<div className='container-pay'>
				<div className='payment-box'>
					<i className="iconfont icon-chenggong" style={{display: 'block', color: '#FF8456', fontSize: '56px', marginTop: '1.8rem'}}></i>
					<span style={{color: '#444', fontSize: '0.7rem', marginTop: '0.75rem'}}>
						支付成功
					</span>
					<span style={{fontSize: '1rem', color: '#444', marginTop: '0.45rem'}}>
						{curPay}
					</span>
					<div 
						className="toOrder"
						onClick={ this.onJumpPage }
					>
						查看订单
					</div>
				</div>
			</div>
        );
    }
}

export default PaySuccess;
