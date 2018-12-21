// 生活消费
import React, { Component } from 'react';
import { ListView, Toast} from 'antd-mobile';
import ImageConfig from '../../../assets/imageConfig';
import Fetch from '../../../components/fetch';
import '../../../assets/css/common.css';
import '../../../assets/css/main.css';
import LoadMore from '../../../components/loadMore';

const width = window.screen.width > 640 ? 640 : window.screen.width;

export default class Living extends Component {
    constructor(props) {
        super(props);
        this.state = {
            liveData:[],
            loadState: 1,
            modal: false,
            searchType: 3,
            isShow: false
        };
        this.page = 1;
        this.pageSize = 6;
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    }

    componentDidMount() {
        Toast.loading('加载中...', 0);
        this._getData(1);
    }


    /**
     * 我的订单---生活消费列表
     * @param loadState    1-上拉加载更多，2-加载中，3-没有更多数据
     * @private
     */
    _getData(type){
        let { liveData ,searchType}=this.state;
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
            console.log(result);
            Toast.hide();
            if(result){
                if(type===1){
                    this.setState({liveData: result});
                }else{
                    liveData.push.apply(liveData,result);
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

    //获取生活消费不同充值类型图片
    _getLivePic(rowData){
        let Image = '';
        if(rowData.rechargeType === 2){  //2-商家买单
            Image = rowData.pictureUrl ? rowData.pictureUrl : ImageConfig.empty
        }else if(rowData.rechargeType === 3){ //3-商品买单
            Image = rowData.picUrl ? rowData.picUrl : ImageConfig.empty
        }
        return Image;
    }

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
                    this.props.history.push('/liveDetail',{
                        orderCode: rowData.orderCode,
                        payStatus: rowData.payStatus,
                        prodPrice: rowData.prodPrice,
                        rechargeType : rowData.rechargeType,
                        shopsId: rowData.shopsId,
                        showPayTime: rowData.payStatus !== 1 && rowData.payStatus !== 2
                    })
                }}
            >
                <div
                    className='bg flex  flex-space-between'
                    style={{flexDirection:'column',height: width < 375 ? '5.6rem' : '5.2rem',width:'100%',padding:12}}
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
                        {/*左*/}
                        <div
                            className='flex flex-dir flex-center'
                            style={{paddingTop:10}}
                        >
                            <div
                                style={{
                                    width: '2.2rem', height: '2.2rem',
                                    marginRight: 10 ,
                                }}
                            >
                                <img
                                    src={this._getLivePic(rowData)}
                                    alt=""
                                    style={{
                                        width: '100%', height: '100%'
                                    }}
                                />

                            </div>

                            <div
                                className= ' flex flex-space-between'
                                style={{
                                    flexDirection:'column',height: '2.2rem',
                                    color:'#333',fontSize:14
                                }}
                            >
                                <div> {rowData.prodName }</div>
                                <div style={{color:'#999',fontSize:12}}> {rowData.shopsName }</div>
                            </div>
                        </div>

                        {/*右*/}
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
        let { liveData } = this.state;
        const totalHeight = document.documentElement.clientHeight;
        if( liveData.length > 0 ){
            return(
                <div
                    style = {{width: width,height: totalHeight,paddingTop: '2.5rem'}}
                >
                    <div
                        className='flex flex-center'
                        style={{width: '100%', height: '100%'}}
                    >
                        <ListView
                            style={{width: '100%', height: '100%'}}
                            dataSource={this.dataSource.cloneWithRows(liveData)}
                            renderFooter={() => (liveData.length >= 6 ?
                                <LoadMore loadState={this.state.loadState}/> : null)}
                            renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                            pageSize={6}
                            renderBodyComponent={() => <div/>}
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