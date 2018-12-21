/**
 *  我的加油卡
 */

import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile';
import ImageConfig from '../../../assets/imageConfig';
import Fetch from '../../../components/fetch';

import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import {Modal} from "antd-mobile/lib/index";

const ScreenWidth = window.screen.width > 640 ? 640 : window.screen.width;
const totalHeight = document.documentElement.clientHeight;

class FuelCard extends Component {
	constructor(props) {
		super(props);

		const sourceType = this.props.history.location.state ? this.props.history.location.state.type : 0;
		this.state = {
			data: [],
			sourceType  		//来源路由，1为加油页面
		}
	}

	componentWillMount() {
		document.title = '我的加油卡';
		document.body.scrollIntoView();
	}

	componentDidMount() {
		Toast.loading('加载中...', 0);
		Fetch.post('/d-app/API/user/oilCardList', {
			oilCardType: ''
		}).then(res => {
			console.log(res);
			this.setState({
				data: res
			});
			Toast.hide();
		}).catch(err => {
		})

	}

	onJumpPage(num, id) {
		if (this.state.sourceType === 1) {		//判断来源是否是加油页面
			let OilInfo = JSON.parse(localStorage.OilInfo);
			OilInfo.cardNum = num;
			OilInfo.cardId = id;
			localStorage.setItem('OilInfo', JSON.stringify(OilInfo));
			this.props.history.goBack();
		}
	}

	// 删除油卡
    _delete(cardId, index){
        let { data } = this.state;
        Modal.alert(
            <span style={{ color: '#030303', fontSize: 17 }}>删除</span>,
            <span style={{ color: '#030303', fontSize: 13 }}>确定删除？</span>,
            [
                { text: '取消', onPress: () => console.log('cancel'), style: {color: '#909090', fontSize: 17} },
                { text: '确定', onPress: () => {
                        Toast.loading('加载中...', 0);
                        Fetch.post('/d-app/API/user/delOilCard', {
                            cardId: cardId
                        }).then(result=> {
                            data.splice(index, 1);
                            this.setState({data: data});
                            Toast.info('删除成功', 1);
                        }).catch(error=> {
                            Toast.info('删除失败', 1);
                        })
                    }, style: {color: '#FE7D4D', fontSize: 17} }
            ]
        );
	}

	//判断中石油还是中石化
	_judgment(num){
		if( num[0] === '1'){
			return ImageConfig.Card_icon_1
		} else {
			return ImageConfig.Card_icon_2
		}
	}
	//rem转换px
	_remToPx(rem) {
		const cw = document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth;
		return rem * (cw / 375 * 20)
	}

	render() {
		let { data } = this.state;
		let width = ScreenWidth - 24;

		return (
			<div style={{ height: totalHeight - this._remToPx(4), overflowY: 'scroll', background: '#fff' }} className="relative">
				{
                    data.length > 0 ?
                        <div style={{ paddingTop: 20, marginBottom: 20, height: '100%' }} className="bg padding-horizontal">
                            {
                                data.map((item, index) => {
                                    return (
                                        <div
                                            className="fuel-card-bg relative"
                                            style={{ width: width, height: width / 2.5 }}
                                            key={index}
                                            onClick={() => this.onJumpPage(item.cardNumber, item.cardId)}
                                        >
                                            <div
                                                className="absolute fuel-card-cover"
                                                style={{ top: 0, left: 0, width: width, height: width / 2.5 }}
                                            >
                                                <div className="flex flex-dir flex-align-items" style={{ marginBottom: 12 }}>
                                                    <img
                                                        style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
														src={this._judgment(item.cardNumber)}
                                                        alt=" "
                                                    />
													<div className="nowrap" style={{ fontSize: 16, color: '#fff', marginRight: 20, width: 80 }}>
														{item.fullName}
													</div>
													<div style={{ fontSize: 16, color: '#fff' }}>
														{item.mobile}
													</div>
												</div>
												<div style={{ color: '#fff', fontSize: 20 }}>{item.cardNumber}</div>

												{/*删除*/}
												{
                                                    this.state.sourceType === 1 ? null :
                                                        <div
															onClick={()=> this._delete(item.cardId, index)}
                                                            className="absolute flex flex-center"
                                                            style={{zIndex: 10, right: 20, top: 20, color: '#fff', fontSize: 12}}
                                                        >
                                                            <div className="iconfont icon-shanchu" style={{fontSize: 12}}/>
                                                            <div style={{ marginLeft: 3 }}>删除</div>
                                                        </div>
												}
											</div>
										</div>
                                    )
                                })
                            }
                        </div>
                    	:
                        <div style={{ width: '100%', height: '100%', marginTop: '7rem' }} className="flex-center flex">
                            <img style={{width: ScreenWidth / 2, height: ScreenWidth / 2}} src={ImageConfig.noData} alt=" "/>
                        </div>
                }

				<div
					className="padding-horizontal fixed"
					style={{ bottom: 20, left: 0, width: '100%' }}
				>
					<Button
						className="fuel-card-btn"
						style={{ fontSize: 14 }}
						icon={<div className="iconfont icon-zengjia1" style={{ fontSize: 18 }} />}
						activeStyle={{ backgroundColor: '#F7F7F7' }}
						onClick={() => this.props.history.push('/addCard')}
					>
						新增油卡
                    </Button>
				</div>
			</div>
		)
	}
}

export default FuelCard;