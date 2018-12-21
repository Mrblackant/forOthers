/**
 *  使用抵用券
 */

import React, { Component } from 'react';
import { ListView, Toast } from 'antd-mobile';

import ImageConfig from '../../assets/imageConfig'
import Fetch from "../../components/fetch";
import LoadMore from '../../components/loadMore';

import '../../assets/css/common.css';
import '../../assets/css/main.css';

const ScreenWidth = document.documentElement.clientWidth;

class UseVoucher extends Component {

    constructor(props) {
        super(props);
        this.state = {
            voucherList: [],
            loadState: 1
        };
        this.sourceType = this.props.history.location.state ? this.props.history.location.state.type : 1;//1---商家买单，2----商品买单

        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.fetch = null;
        this.checkedId = this.props.history.location.state ? this.props.history.location.state.couponId: 0;//选中的抵用券id
        this.checkedVoucher = '0';//选中的抵用券面额
        this.static={
            pageSize: 6,
            page: 1
        };
    }

    componentWillMount() {
        document.title = '使用抵用券';
        document.body.scrollIntoView();
    }

    componentDidMount(){
        let VoucherInfo = {
            voucher: this.checkedVoucher,
            couponId: this.checkedId
        };
        //本地保存选中卡券的面额和id
        localStorage.setItem('checkedVoucher',JSON.stringify(VoucherInfo) );
        let consumeMoney = this.props.history.location.state ? this.props.history.location.state.consumeMoney: '';
        localStorage.setItem('ConsumeMoney', consumeMoney);
        Toast.loading('加载中...', 0);
        this._getCouponListList(1, true);
    }

    // 获取卡券信息
    _getCouponListList(type, val){
         let busiCode = this.sourceType === 1 ? 'SHOPS_ARRIVAL_PAY' : 'SHOPS_PROD_PAY';  //	优惠卷业务编码
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if(type === 1 || type === 3){
            this.static.page = 1
        }else{
            this.static.page ++
        }
        this.setState({loadState: 2});

        Fetch.post("d-app/API/user/coupons",{
            busiCode: busiCode,
        }).then((result)=>{
            console.log(result)
            val && Toast.hide();
            if(result.length !== 0){
                if(type === 1){
                    if(localStorage.getItem('checkedVoucher', this.checkedVoucher)){
                        result.map((item,index) => {
                            item.checked = false;
                            if(this.checkedId === item.couponId){
                                item.checked = true;
                            }
                        })
                    }
                    this.setState({voucherList: result});

                }else{
                    this.state.voucherList.push.apply(this.state.voucherList, result);
                }
            }

            // 当返回数据长度不等于pageSize时不做上拉加载处理
            if(result.length < this.static.pageSize){
                this.setState({loadState: 3});
            } else{
                this.setState({loadState: 1});
            }
        }).catch((err)=>{
            Toast.hide()
            this.setState({loadState: 1});
        })
    }

    //点击卡券时样式更改
    _changeStyle(rowId){
        this.state.voucherList.map((item,index) => {
            item.checked = false;
            if(Number(rowId) === Number(index)){
                item.checked = true;
                this.checkedVoucher = item.discountAount;
                this.checkedId = item.couponId;
            }
        });
        this.setState({voucherList: this.state.voucherList});
        let VoucherInfo = {
            voucher: this.checkedVoucher,
            couponId: this.checkedId
        };
        //更新本地保存选中卡券的面额和id
        localStorage.setItem('checkedVoucher',JSON.stringify(VoucherInfo) );
        setTimeout(()=> this.props.history.goBack(), 200);
    }

    // 时间处理
    _manageTime(expireTime){
        let cloneExpireTime = expireTime.split(' ')[0].split('-');
        let aftTime = cloneExpireTime[0] + '.' + cloneExpireTime[1] + '.' + cloneExpireTime[2];
        return aftTime
    }

    // 单个卡券
    _renderRow(rowData, rowId) {
        return (
            <div
                key={rowId}
                className="flex box-sizing flex-space-between flex-align-items"
                style={{height: '5.6rem', width: '100%', marginTop: '1rem'}}
                onClick={() => {this._changeStyle(rowId)}}
            >
                <i
                    className="iconfont icon-qia1"
                    style={{fontSize: '1rem',marginRight:15,color:rowData.checked? '#FE7C4C':'#999'}}
                />


                <div
                    className="flex flex-align-items box-sizing"
                    style={{height: '100%',overflow:'hidden'}}
                >
                    {/*左边金额*/}
                    <div
                        className="flex flex-align-items flex-justify-content"
                        style={{ width: '5.6rem', height: '100%', background: '#fff', borderRadius: '0.5rem'}}
                    >
                        <div
                            className="flex flex-space-between box-sizing"
                            style={{height: '3.6rem', width: '100%', flexDirection: 'column', alignItems: 'center'}}
                        >
                            <div>
                                <span
                                    style={{ color: '#FE7C4C', fontSize: 15}}
                                >
                                    ￥
                                </span>
                                <span
                                    style={{ color: '#FE7C4C', fontSize: 40}}
                                >
                                    {parseInt(rowData.discountAount)}
                                </span>
                            </div>

                            <span
                                style={{ color: '#606060', fontSize: 12}}
                            >
                                {'满' + rowData.useStartAmount + '元可用'}
                            </span>
                        </div>
                    </div>

                    {/*分割线*/}
                    <div
                        style={{ height: '5rem', width: 0, borderRight: '1px dotted #FE7C4C'}}
                    />

                    {/*右边商品*/}
                    <div
                        className="flex flex-align-items flex-justify-content "
                        style={{ width: '9rem', height: '100%', background: '#fff', borderRadius: '0.5rem',overflow:'hidden' }}
                    >
                        <div
                            className="flex flex-space-between box-sizing nowrap"
                            style={{ height: '2.5rem', width: '100%', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '0.8rem',paddingRight: '0.8rem',marginTop:'1.1rem'}}
                        >
                            <span
                                className="nowrap"
                                style={{ display:'block',width: '100%',color: '#303030', fontSize: 14, fontWeight: 'bold' }}
                            >
                                {rowData.couponName}
                            </span>
                            <span
                                style={{ color: '#909090', fontSize: 12 }}
                            >
                                {'有效期至' + this._manageTime(rowData.expireTime)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const totalHeight = document.documentElement.clientHeight;
        let {voucherList} = this.state;
        return (
            <div
                style={{width:'100%',height: totalHeight,paddingTop:'1rem'}}
            >
                {/*温馨提示*/}
                <div
                    className="voucher-box"
                    style={{width:'90%',backgroundColor:'#EBEBEB',padding:12}}
                >
                    <span style={{color:'#999999',fontSize:14}}>温馨提示：</span>
                    <p style={{color:'#999999',fontSize:12,lineHeight:1.5}}>
                        抵用券会被优先使用，不足支付时才会使用账户余额。
                    </p>
                    <p style={{color:'#999999',fontSize:12}}>
                        抵用券不找零，不兑换，请慎重使用。
                    </p>
                </div>

                {/*抵用券列表*/}
                <div
                    className="voucher-box"
                    style={{width:'90%',height: ScreenWidth<375 ? '70%' : '80%' ,}}
                >
                    {
                        voucherList.length > 0 ?
                            <ListView
                                style={{ height: '100%' , width:'100%',}}
                                dataSource={this.dataSource.cloneWithRows(voucherList)}
                                renderFooter={() => (voucherList.length > 4 ? <LoadMore loadState={this.state.loadState}/> : null)}
                                renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                                renderBodyComponent={() => (<div />)}
                                onScroll={() => console.log('scroll')}
                                scrollRenderAheadDistance={1500}
                                onEndReachedThreshold={1500}
                                onEndReached = { ()=> this._getCouponListList(2) }
                            />
                            :
                            <div style={{ width: '100%', height:'100%'}} className="flex-center flex">
                                <img style={{width: ScreenWidth / 2, height: ScreenWidth / 2}} src={ImageConfig.noData} alt=" "/>
                            </div>
                    }
                </div>
            </div>

        )
    }
}

export default UseVoucher