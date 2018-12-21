// 油卡充值
import React, { Component } from 'react'
import { ListView,Toast} from 'antd-mobile';
import ImageConfig from '../../../assets/imageConfig';
import Fetch from '../../../components/fetch';
import '../../../assets/css/common.css';
import '../../../assets/css/main.css';
import LoadMore from '../../../components/loadMore';

const width = window.screen.width > 640 ? 640 : window.screen.width;

export default  class OilRecharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oilOrderList: [],
            loadState: 1,
            modal: false,
            searchType: 2
        };
        this.page = 1;
        this.pageSize = 6;
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentDidMount() {
        // let SelIndex = localStorage.getItem('SelectedInfo');
        // if(!SelIndex){
            Toast.loading('加载中...', 0);
        // }
        this._getData(1);
    }

    //判断中石油还是中石化
    _judgment(num){
        if( num[0] === '1'){
            return ImageConfig.Card_icon_1
        } else {
            return ImageConfig.Card_icon_2
        }
    }

    /**
     * 我的订单---油卡充值列表
     * @param loadState    1-上拉加载更多，2-加载中，3-没有更多数据
     * @private
     */
    _getData(type){
        let { oilOrderList,searchType }=this.state;
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
                    this.setState({oilOrderList: result});
                }else{
                    oilOrderList.push.apply(oilOrderList,result);
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
                    this.props.history.push('/oilOrderDetail',{
                        orderCode: rowData.orderCode,
                        payStatus: rowData.payStatus,
                        showPayTime: rowData.payStatus !== 1 && rowData.payStatus !== 2
                    })
                }}
            >
                <div
                    className='bg flex  flex-space-between'
                    style={{flexDirection:'column',height: width < 375 ? '5.2rem' : '4.5rem',width:'100%',padding:12}}
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
                            style={{alignrowDatas:'flex-start',paddingTop:10}}
                        >
                            <img
                                style={{ width: rowData.cardNo[0] === '1' ? '1.2rem' : '1.5rem', height: rowData.cardNo[0] === '1' ? '1.2rem' : '1.5rem', marginRight: 10 }}
                                src={this._judgment(rowData.cardNo)}
                                alt=" "
                            />
                            <span>{ rowData.cardNo }</span>
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
        let { oilOrderList } = this.state;
        const totalHeight = document.documentElement.clientHeight;
        if(oilOrderList.length > 0) {
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
                            dataSource={this.dataSource.cloneWithRows(oilOrderList)}
                            renderFooter={() => (oilOrderList.length >= 6 ? <LoadMore loadState={this.state.loadState}/> : null)}
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