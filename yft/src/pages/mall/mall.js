/**
 *  商城
 */

import React, { Component } from 'react';
import { ListView, Toast } from 'antd-mobile';

import ImageConfig from '../../assets/imageConfig'
import Fetch from "../../components/fetch";

import '../../assets/css/common.css';
import '../../assets/css/mall.css';

const ScreenWidth = document.documentElement.clientWidth;
class Mall extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mallList: []
		};
		this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.fetch = null;
	}

	componentWillMount() {
		document.title = '积分商城';
		document.body.scrollIntoView();
	}

	componentDidMount() {
        if (localStorage.getItem('openId')) {
            Toast.loading('加载中...', 0);
            const MallInfo = {
                address: ''
            };
            localStorage.setItem('MallInfo', JSON.stringify(MallInfo));

            Fetch.post('/d-app/API/product/integralExchange')
                .then(res => {
                    this.getUserInfo();
                    this.setState({
                        mallList: res
                    });
                    Toast.hide();
                }).catch(err => {
                console.log(err)
			})

		} else Fetch.reLoginFunc();
	}
	

    // 获取个人信息
    getUserInfo() {
        Fetch.post('/d-app/API/user/userInfo', {
            openId: localStorage.getItem('openId')
        }).then((result) => {
            if (result) {
                localStorage.setItem('PersonalInfo', JSON.stringify(result));
            }
        }).catch((err) => {
		});

    }

	_renderRow(rowData, rowId) {
		return (
			<div
				className='mall-item'
				key={rowId}
				onClick={() => this.props.history.push('/order', { title: rowData.prodName, price: rowData.integral, prodCode: rowData.prodCode, isEntity: false })}
			>

				<div className='item-pic'>
					<img src={ImageConfig.MallBg} alt="" />
					<div className="flex flex-center">
						<span style={{fontSize: '1rem'}}>￥{ parseInt(rowData.exchangeAmount, 10)}</span>
						<span style={{fontSize: '0.65rem', marginTop: '0.4rem'}}>积分兑换</span>
					</div>
				</div>
				<div className='item-title nowrap'>{rowData.prodName}</div>
				<div className='item-price'>
					<span className='sp1'>{rowData.integral}</span>
					<span className='sp2'>积分</span>
				</div>
			</div>
		)
	}

	render() {
		const totalHeight = document.documentElement.clientHeight;
		return (
			<div className='container-mall'>

				{
					this.state.mallList.length > 0 ?
					<ListView
						style={{ height: totalHeight - 70 + 'px', }}
						dataSource={this.dataSource.cloneWithRows(this.state.mallList)}
						renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
						pageSize={4}
						renderBodyComponent={() => (<div />)}
						onScroll={() => console.log('scroll')}
						scrollRenderAheadDistance={1500}
						onEndReachedThreshold={1500}
						onEndReached={() => console.log(111)}
					/> :
					<div style={{ width: '100%', height: totalHeight - 70 + 'px'}} className="flex-center flex">
                	    <img style={{width: ScreenWidth / 2, height: ScreenWidth / 2}} src={ImageConfig.noData} alt=" "/>
                	</div>
				}
			</div>
		)
	}
}

export default Mall