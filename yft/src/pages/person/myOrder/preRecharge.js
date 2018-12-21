// 预存充值
import React, { Component } from 'react'
import { ListView,Modal,Toast} from 'antd-mobile';
import Fetch from '../../../components/fetch';
import '../../../assets/css/common.css';
import '../../../assets/css/main.css';
import ImageConfig from '../../../assets/imageConfig';
import LoadMore from '../../../components/loadMore';
import PwdControl from '../../../components/pwdControl';
import PromptModal from '../../../components/promptModal';

const width = window.screen.width > 640 ? 640 : window.screen.width;

export default class PreRecharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preData: [ ],
            loadState: 1,
            modal: false,
            searchType: 1,
        };
        this.page = 1;
        this.pageSize = 6;
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.checkedOrderCode = '';//要支付的那条消息的订单编码
    }

    componentDidMount() {
        Toast.loading('加载中...', 0);
        this._getData(1);
    }


    /**
     * 我的订单---预存充值列表
     * @param loadState    1-上拉加载更多，2-加载中，3-没有更多数据
     * @private
     */
    _getData(type){
        let { preData ,searchType}=this.state;
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if(type ===1||type===3){
            this.page = 1
        }else{
            this.page++
        }
        this.setState({loadState: 2});
        Fetch.post("d-app/API/order/orderList",{
            page: this.page ,
            pageSize: this.pageSize,
            searchType: searchType
        }).then((result)=>{
            Toast.hide();
            if(result){
                if(type===1){
                    this.setState({preData: result});
                }else{
                    preData.push.apply(preData,result);
                }
            }
            // 当返回数据长度不等于pageSize时不做上拉加载处理
            if(result.length < this.pageSize){
                this.setState({loadState: 3});
            } else{
                this.setState({loadState: 1});
            }
        }).catch((err)=>{
            this.setState({loadState:3});
            Toast.info(err.errDesc);
        })
    }

    // //确认取消订单
    // _confirmCancel(){
    //     Toast.loading('加载中...', 0);
    //     Fetch.post("d-app/API/order/cancelOrder",{
    //         orderCode:  this.checkedOrderCode ,
    //     }).then((result)=>{
    //         Toast.hide();
    //         Toast.info('订单取消成功')
    //     }).catch((err)=>{
    //         Toast.hide();
    //         Toast.info(err.errDesc);
    //     })
    // }

    //显示支付状态
    _showPayStatus(payStatus){
        // 支付状态；1，未付款；2，付款中；3，已付款 4，已退款',
        let Text = '';
        if(payStatus === 1){
            Text = '未付款'
        }else if(payStatus === 2){
            Text = '付款中'
        }else if(payStatus === 3){
            Text = '已付款'
        }else if(payStatus === 4){
            Text = '已退款'
        }
        return Text;
    }

    // 列表项
    _renderRow(rowData, rowId) {
        let createTime = rowData.createTime;
        if(createTime.length>=15){
            createTime = createTime.substr(0,createTime.length-3)
        }
        return(
            <div
                key={ rowId }
                onClick={() => {
                    this.props.history.push('/preChargeDetail',{
                        orderCode: rowData.orderCode,
                        origPrice: rowData.origPrice,
                        payStatus: rowData.payStatus,
                        showPayTime: rowData.payStatus !== 1 && rowData.payStatus !== 2
                    })
                }}
            >

                <div
                    className='bg flex  flex-space-between'
                    style={{
                        flexDirection:'column',height: width < 375 ? '5.2rem' : '4.5rem',width:'100%',padding:12
                    }}
                >

                    {/*上*/}
                    <div
                        className='flex flex-dir flex-space-between'
                        style={{fontSize:12, color:'#999'}}
                    >
                        <div>{createTime}</div>
                        <div>
                            {
                                this._showPayStatus(rowData.payStatus)
                            }
                        </div>
                    </div>

                    {/*中*/}
                    <div
                        className='flex flex-dir flex-center flex-space-between'
                        style={{color: '#333', fontSize:14}}
                    >
                        <div
                            className='flex flex-dir flex-center'
                            style={{ paddingTop:10 }}
                        >
                            <div
                                style={{
                                    width: '1.6rem', height: '1.6rem', borderRadius:'1rem',
                                    marginRight: 10 ,color:'#fff',fontSize:16
                                }}
                                className= 'flex flex-center linear-gradientV'
                            >
                                { rowData.giveCount}
                            </div>

                            <span> 总额: &nbsp; {rowData.origPrice }</span>
                        </div>

                        <div style={{fontSize:18}}>
                            { rowData.prodPrice }
                        </div>
                    </div>

                </div>

                <div style={{height: 1,width:'100%', backgroundColor:'#F3F2F2'}}/>
            </div>
        )
    }

    render(){
        let { preData } = this.state;
        const totalHeight = document.documentElement.clientHeight;
        if(preData.length > 0) {
            return(
                <div
                    style = {{width: width,height: totalHeight,paddingTop: '2.5rem'}}
                >
                    <div
                        className='flex flex-center'
                        style={{width: '100%', height: '100%'}}
                    >
                        <ListView
                            style={{width:'100%',height: '100%'}}
                            dataSource={this.dataSource.cloneWithRows(preData)}
                            renderFooter={() => (preData.length >= 6 ? <LoadMore loadState={this.state.loadState}/> : null)}
                            renderRow={(rowData, sectionId, rowId)=>this._renderRow(rowData, rowId)}
                            pageSize={6}
                            renderBodyComponent={() => <div />}
                            onScroll={() => console.log('scroll')}
                            scrollRenderAheadDistance={500}
                            onEndReachedThreshold={10}
                            onEndReached={() => this._getData(2)}
                        />
                    </div>
                </div>
            )
        }else{
            return(
                <div
                    style={{width: '100%', height: totalHeight,paddingTop: '2.5rem'}}
                >
                    <div
                        className='bg flex flex-center'
                        style={{width: '100%', height: '100%'}}
                    >
                        <img style={{width: width / 2, height: width / 2}} src={ImageConfig.noData} alt=" "/>

                    </div>

                </div>
            )
        }

    }
}