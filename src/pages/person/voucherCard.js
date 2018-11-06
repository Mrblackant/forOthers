/**
 *  我的卡券
 */

import React, { Component } from 'react';
import '../../assets/css/common.css';
import '../../assets/css/personal.css';
import { ListView } from 'antd-mobile';
import Fetch from "../../components/fetch";
import LoadMore from '../../components/loadMore';
import {Toast} from "antd-mobile/lib/index";
import ImageConfig from "../../assets/imageConfig";

const ScreenWidth = document.documentElement.clientWidth;
class VoucherCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            loadState: 1
        };

        this.static={
            pageSize: 6,
            page: 1
        };

        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentWillMount(){
        document.title = '我的卡券';
        document.body.scrollIntoView();
    }

    componentDidMount(){
        Toast.loading('加载中...', 0);
        this._getCouponListList(1, true);
    }

    // 获取卡券信息
    _getCouponListList(type, val){
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if(type === 1 || type === 3){
            this.static.page = 1
        }else{
            this.static.page ++
        }
        this.setState({loadState: 2});

        Fetch.post("/d-app/API/user/couponList",{
            page: this.static.page,
            pageSize: this.static.pageSize
        }).then((result)=>{
            val && Toast.hide();

            if(result.length !== 0){
                if(type === 1){
                    this.setState({data: result});
                }else{
                    this.state.data.push.apply(this.state.data, result);
                }
            }

            // 当返回数据长度不等于pageSize时不做上拉加载处理
            if(result.length < this.static.rows){
                this.setState({loadState: 3});
            } else{
                this.setState({loadState: 1});
            }
        }).catch((err)=>{
            this.setState({loadState: 1});
        })
    }

    // 时间处理
    _manageTime(beginTime, expireTime){
        let cloneTime = beginTime.split(' ')[0].split('-');
        let cloneExpireTime = expireTime.split(' ')[0].split('-');
        let befTime = cloneTime[0] + '.' + cloneTime[1] + '.' + cloneTime[2];
        let aftTime = cloneExpireTime[0] + '.' + cloneExpireTime[1] + '.' + cloneExpireTime[2];
        return befTime + '-' + aftTime
    }

    // 列表项
    _renderRow(rowData, rowId) {
        let width = ScreenWidth - 32;
        let className = 'relative voucher-card-bg';
        let isPassed = rowData.isPassed === 1;
        let isUsed = rowData.isUsed === 1;

        if (isPassed) {
            className = 'relative voucher-card-bg-1';
        }

        if (isUsed) {
            className = 'relative voucher-card-bg-2';
        }

        return(
            <div
                style={{paddingLeft: 16, paddingRight: 16, marginBottom: 4}}
                className="flex flex-center"
                key={rowId}
            >
                <div
                    className={className}
                    style={{ width: width, height: width / 2.7 }}
                >
                    <div
                        className="absolute flex flex-dir flex-align-items"
                        style={{ top: 0, left: 0, width: width, height: width / 2.7 }}
                    >
                        <div
                            className="voucher-card-cover-lf"
                            style={{width: width * 2.1 / 7, height: width / 2.7}}
                        >
                            <div style={{ color: isPassed || isUsed ? '#EEEEEE' : '#FE7C4C' }}>
                                <span style={{ fontSize: 15 }}>￥</span>
                                <span style={{ fontSize: 40, fontFamily: 'DIN-Medium' }}>{rowData.discountAmount.split('.')[0]}</span>
                            </div>

                            <div style={{ color: isPassed || isUsed ? '#CCCCCC' : '#606060', fontSize: 12 }}>
                                {'满' + rowData.useStartAmount.split('.')[0] + '元可用'}
                            </div>
                        </div>

                        <div
                            className="voucher-card-cover-rt flex flex-space-between flex-dir flex-align-items"
                            style={{width: width * 4.9 / 7, height: width / 2.7}}
                        >
                            <div>
                                <div
                                    style={{ fontSize: 14, color: isPassed || isUsed ? '#CCCCCC' : '#303030', marginBottom: 10 }}
                                    className="nowrap voucher-card-cover-nowrap">
                                    {rowData.couponName}
                                </div>

                                <div
                                    style={{ fontSize: 12, color: isPassed || isUsed ? '#CCCCCC' : '#909090' }}
                                    className="nowrap voucher-card-cover-nowrap">
                                    {'有效期' + this._manageTime(rowData.beginTime, rowData.expireTime)}
                                </div>
                            </div>

                            {
                                isPassed || isUsed ? null :
                                    <div className="voucher-card-cover-use">
                                        去使用
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        const totalHeight = document.documentElement.clientHeight;

        return(
            <div style={{height: '100%'}}>
                {
                    this.state.data.length > 0 ?
                        <ListView
                            style={{height: totalHeight, paddingTop: 12}}
                            dataSource={this.dataSource.cloneWithRows(this.state.data)}
                            renderRow={(rowData, sectionId, rowId)=>this._renderRow(rowData, rowId)}
                            pageSize={6}
                            renderFooter={() => this.state.data.length > 3 ? <LoadMore loadState={this.state.loadState}/> : null}
                            renderBodyComponent={()=>(<div/>)}
                            onScroll={() => console.log('scroll')}
                            scrollRenderAheadDistance={500}
                            onEndReachedThreshold={10}
                            onEndReached = { ()=> this._getCouponListList(2) }
                        />
                        :
                        <div style={{ width: '100%', height: '100%' }} className="flex-center flex">
                            <img style={{width: ScreenWidth / 2, height: ScreenWidth / 2}} src={ImageConfig.noData} alt=" "/>
                        </div>
                }
            </div>
        )
    }
}

export default VoucherCard;