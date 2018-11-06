/**
 *  会员卡详情
 */

import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import Fetch from '../../../components/fetch';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';

export default class VipCardDetail extends Component {
    constructor(props) {
        super(props);
        this.cardCode = this.props.history.location.state ?this.props.history.location.state.cardCode : '';//会员卡号
    }

    componentWillMount() {
        document.title = '会员卡详情';
        document.body.scrollIntoView();
    }

    componentDidMount() {
        Toast.loading('加载中...', 0);
        this._getCardDetail();
    }

    _getCardDetail(){
        Fetch.post("d-app/API/memcard/cardDetail",{
            cardCode: this.cardCode ,
        }).then((result)=>{
            Toast.hide();
            this.CardDescribe._getData({cardDesc:result.cardDesc,cardName:result.cardName});
            this.detailList._getData(result.records)
        }).catch((err)=>{
            Toast.info(err.errDesc)
        })
    }

    render() {
        return (
            <div
                style={{width:'100%',overflow:'hidden'}}
            >

                {/*会员卡描述*/}
                <CardDescribe
                    history={ this.props.history }
                    ref = {ref => this.CardDescribe = ref}
                />

                {/*使用明细*/}
                <DetailList
                    history={ this.props.history }
                    ref = {ref => this.detailList = ref}
                />
            </div>
        )
    }
}

// 会员卡描述
class CardDescribe extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cardDesc: '',	//会员卡描述
            cardName: ''    //会员卡名称
        }
    }

    //获取数据
    _getData(obj){
        this.setState({
            cardDesc: obj.cardDesc,
            cardName: obj.cardName
        })
    }

    render(){
        let { cardDesc,cardName } = this.state;
        return(
            <div
                className='bg vipDetail-padding'
                style={{fontSize:12,color:'#999999',marginTop:10,marginBottom:10}}
            >
                <p style={{fontSize:14,color:'#333'}}>
                    {cardName}
                </p>
                <p style={{lineHeight:1.5}}> {cardDesc}</p>

            </div>

        )
    }
}

// 使用明细
class DetailList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
        };
    }

    componentWillMount() {
        document.title = '会员卡详情';
    }

    // 获取数据
    _getData(data){

        for (let i = 0; i < data.length; i++) {
            data[i].changeValue = this._manageValue(data[i].changeAction,data[i].changeValue);
        }
        this.setState({listData: data})
    }

    //获取变动名目
    /**
     *   1-订单支付；2-订单退款；3-油卡预充值失败退款；
     *   4-金额充值;5-油卡充值奖励积分;6-积分兑换;7-兑换余额',
     **/
    _getChangeType(rowData){
        let type = rowData.changeAction;
        let text = '';
        switch(type){
            case 1:
                text = '订单支付';
                break;
            case 2:
                text = '订单退款';
                break;
            case 3:
                text = '油卡预充值失败退款';
                break;
            case 4:
                text = '金额充值';
                break;
            case 5:
                text = '油卡充值奖励积分';
                break;
            case 6:
                text = '积分兑换';
                break;
            case 7:
                text = '兑换余额';
                break;
            default:
                break;
        }
        return text;
    }

    // 金额处理
    _manageValue(type,changeValue){
            let resultValue = '';
            switch (type){
                case 1:
                    resultValue =   '-'+changeValue;
                    break;
                case 2:
                    resultValue =   '+'+changeValue;
                    break;
                case 3:
                    resultValue =   '+'+changeValue;
                    break;
                case 4:
                    resultValue =   '-'+changeValue;
                    break;
                case 5:
                    resultValue =   '+'+changeValue;
                    break;
                case 6:
                    resultValue =   '+'+changeValue;
                    break;
                case 7:
                    resultValue =   '-'+changeValue;
                    break;
                case 8:
                    resultValue =   '+'+changeValue;
                    break;
                case 9:
                    resultValue =   '+'+changeValue;
                    break;
                case 10:
                    resultValue =   '+'+changeValue;
                    break;
            }
            return resultValue;
        }

    render() {

        let {listData} = this.state;
        return (
            <div className='bg'>
                {
                    listData.map((rowData, rowId) => {
                        return(
                            <div key={rowId} className="itemStyle border-bottom itemPadding" style={{height: 65}}>
                                {/*左边*/}
                                <div>
                                    <p style={{fontSize: 14,color: '#444444'}}>
                                        {
                                            this._getChangeType(rowData)
                                        }
                                    </p>
                                    <p style={{fontSize: 12,color: '#909090'}}>
                                        {rowData.changeTime}
                                    </p>
                                </div>

                                {/*右边*/}
                                <div style={{fontSize:18 ,color: Number(rowData.changeValue)>0 ? '#FE7D4D ' : '#444444'}}>
                                    {rowData.changeValue}
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        )
    }
}



