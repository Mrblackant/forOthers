// 全部订单
import React, { Component } from 'react'
import { ListView,Modal,Toast} from 'antd-mobile';
import ImageConfig from '../../../assets/imageConfig';
import Fetch from '../../../components/fetch';
import '../../../assets/css/common.css';
import '../../../assets/css/main.css';
import LoadMore from '../../../components/loadMore';
const width = window.screen.width > 640 ? 640 : window.screen.width;

export default class AllOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allData: [],
            loadState: 1,
            searchType: 0,
            modal: false,
        };
        this.page = 1;
        this.pageSize = 6;
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.prodPrice = ''; //预存充值类型的需支付金额
        this.checkedOrderCode = '';//要支付的那条消息的订单编码

    }

    componentDidMount() {
        let SelIndex = localStorage.getItem('SelectedInfo');
        if(!SelIndex || (Number(SelIndex) === 0)){
            Toast.loading('加载中...', 0);
            this._getData(1);
        }
    }


    /**
     * 我的订单---全部列表
     * @param loadState    1-上拉加载更多，2-加载中，3-没有更多数据
     * @private
     */
    _getData(type){
        let { allData,searchType }=this.state;
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if(type ===1||type===3){
            this.page = 1
        }else{
            this.page++
        }
        this.setState({loadState: 2});
        // 请求参数
        let requestObj ={
            page: this.page ,
            pageSize: this.pageSize,
            searchType: searchType
        };
        Fetch.post("d-app/API/order/orderList",requestObj).then((result)=>{
            Toast.hide();
            if(result){
                if(type===1){
                    this.setState({allData: result});
                }else{
                    allData.push.apply(allData,result);
                }
            }
            // 当返回数据长度不等于pageSize时不做上拉加载处理
            if(result.length < this.pageSize){
                this.setState({loadState: 3});
            } else{
                this.setState({loadState: 1});
            }
        }).catch((err)=>{
            console.log(err)
            this.setState({loadState:3});
            Toast.info(err.errDesc);
        })
    }


    //跳转到详情页: orderType --- 1.预存充值，2.油卡充值，3.生活消费
    _jumpToPage(rowData){
        let orderType = rowData.orderType;
        let router = '';
        let obj = {
            orderCode: rowData.orderCode ,
            payStatus: rowData.payStatus,
            showPayTime: rowData.payStatus !== 1 && rowData.payStatus !== 2
        };
        if(orderType === 1){
            router = '/preChargeDetail';
            obj.origPrice = rowData.origPrice;
        }else if(orderType === 2){
            router = '/oilOrderDetail';
        }else  if(orderType === 3){
            router = '/liveDetail';
            obj.prodPrice = rowData.prodPrice;
            obj.rechargeType = rowData.rechargeType;
            obj.shopsId =  rowData.shopsId;

        }
        this.props.history.push(router,obj)
    }

    //设置单个列表高度
    _setHeight(rowData){
        let Height = '';
        let orderType = rowData.orderType;
        if(orderType === 1){
            Height = width < 375 ? '5.2rem' : '4.5rem';
        }else if(orderType === 2){
            Height =  width < 375 ? '5.2rem' : '4.5rem';
        }else  if(orderType === 3){
            Height = width < 375 ? '5.6rem' : '5.2rem';
        }
        return Height
    }

    //判断中石油还是中石化
    _judgment(num){
        if( num[0] === '1'){
            return ImageConfig.Card_icon_1
        } else {
            return ImageConfig.Card_icon_2
        }
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

    //获取单个列表中间内容
    _getContent(rowData){
        let orderType = rowData.orderType;
        let Content = '';
        if(orderType === 1){//预存充值
            Content =  <div
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
            </div>;
        }else if(orderType === 2){//油卡充值
            Content =  <div
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
            </div>;
        }else  if(orderType === 3){//生活消费
            Content = <div
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
            </div>;
        }
        return Content
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
                    this._jumpToPage(rowData);
                }}
            >
                <div
                    className='bg flex  flex-space-between'
                    style={{
                        flexDirection:'column',
                        height: `${this._setHeight(rowData)}`,
                        width:'100%',padding:12
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
                    {
                        this._getContent(rowData)
                    }
                </div>

                <div style={{height: 1,width:'100%', backgroundColor:'#F3F2F2'}}/>
            </div>
        )
    }


    /**
     * orderType : 1.预存充值，2.油卡充值，3.生活消费
     * **/
    render(){
        let { allData } = this.state;
        const totalHeight = document.documentElement.clientHeight;
        if(allData.length > 0){
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
                            dataSource={this.dataSource.cloneWithRows(allData)}
                            renderFooter={() => (allData.length >= 6 ? <LoadMore loadState={this.state.loadState}/> : null)}
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