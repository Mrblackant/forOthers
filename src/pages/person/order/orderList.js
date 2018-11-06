/**
 *  我的订单
 */

import React, { Component } from 'react';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import { ListView } from 'antd-mobile';
import ImageConfig from "../../../assets/imageConfig";
import Fetch from "../../../components/fetch";
import LoadMore from '../../../components/loadMore';
import {Toast} from "antd-mobile/lib/index";

const ScreenWidth = document.documentElement.clientWidth;
class OrderList extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            loadState: 1
        };

        this.static={
            rows: 6,
            page: 1
        };
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentWillMount(){
        document.title = '我的订单';
        document.body.scrollIntoView();
    }

    componentDidMount(){
        Toast.loading('加载中...', 0);
        this._getOrderList(1, true);
    }

    // 获取订单信息
    _getOrderList(type, val){
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if(type === 1 || type === 3){
            this.static.page = 1
        }else{
            this.static.page ++
        }
        this.setState({loadState: 2});

        Fetch.post("/d-app/API/order/orderList",{
            page: this.static.page,
            rows: this.static.rows
        }).then((result)=>{
           console.log(result)
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


    // 列表项
    _renderRow(rowData, rowId) {
        let prodIconUrl = 'http://www.qxcu.com/images/2014sc/71b9c945-be3a-43ec-add7-286f6ebb44d2.jpg';
        let width = ScreenWidth;
        let detailWidth = 160;
        if (width > 320 && width <= 375) {
            detailWidth = 200
        }

        if (width > 375) {
            detailWidth = 250
        }

        return (
            <div 
                style={{ height: 196, marginBottom: 8 }} 
                className="bg padding-horizontal box-sizing" 
                key={rowId}
                onClick={ () => this.props.history.push('/orderDetails', {orderCode: rowData.orderCode})}
            >
                <div style={{ height: 38 }} className="flex flex-space-between flex-dir flex-center">
                    <div style={{ fontSize: 13, color: '#909090' }}>
                        <span style={{marginRight: 10}}>下单时间</span>

                        <span>{rowData.createTime}</span>
                    </div>

                    <span style={{ fontSize: 13, color: '#FE7C4C' }}>{rowData.orderStatusStr}</span>
                </div>

                <div style={{ height: 116 }} className="flex flex-align-items flex-dir">
                    <div style={{width: 120, height: 92, borderRadius: 5, marginRight: 16}} className="flex flex-center border">
                        <img src={prodIconUrl} style={{width: 100, height: 60, borderRadius: 5}} alt=" "/>
                    </div>

                    <div>
                        <p
                            style={{fontSize: 14, color: '#444444', width: detailWidth, lineHeight: 1.5}}
                            className="nowrap-two"
                        >
                            {rowData.prodName}
                        </p>
                        <p>
                            <span style={{fontSize: 14, color: '#909090'}}>单价：</span>
                            <span style={{fontSize: 14, color: '#FE7C4C'}}>{rowData.prodPrice}</span>
                        </p>
                    </div>
                </div>

                <div style={{ height: 41, fontSize: 13, color: '#444' }} className="flex flex-align-items">
                    <span style={{marginRight: 10}}>订单金额</span>

                    <span>{'￥' + rowData.totalPrice}</span>
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
                            style={{height: totalHeight, paddingTop: 8}}
                            dataSource={this.dataSource.cloneWithRows(this.state.data)}
                            renderRow={(rowData, sectionId, rowId)=>this._renderRow(rowData, rowId)}
                            pageSize={6}
                            renderFooter={() => this.state.data.length > 3 ? <LoadMore loadState={this.state.loadState}/> : null}
                            renderBodyComponent={()=>(<div/>)}
                            onScroll={() => console.log('scroll')}
                            scrollRenderAheadDistance={500}
                            onEndReachedThreshold={10}
                            onEndReached = { ()=> this._getOrderList(2) }
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

export default OrderList;