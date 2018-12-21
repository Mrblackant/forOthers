/**
 * 预购
 */
import React, { Component } from 'react';
import { Modal, Button, Toast } from 'antd-mobile';
import Fetch from '../../components/fetch';
import WxApi from '../../components/wxApi';

import '../../assets/css/common.css';
import '../../assets/css/personal.css';
import '../../assets/css/oil.css';

class Discount extends Component {
    constructor(props){
        super(props);
        this.state = {
            upperAmount: 0,
            upperCycleCount: 0,
            allAmount: 0,
            saveAmount: 0,
            selectIndex: 0,
            storeNum: 0
        };

        this.discountData = [];
    }

    componentWillMount() {
        document.title = '优惠';
        document.body.scrollIntoView();
    }

    componentDidMount(){
        WxApi.config(encodeURIComponent(window.location.href.split('#')[0]));
        WxApi.getLocation().then(res => { })
        if (localStorage.getItem('openId')) {
            Toast.loading('加载中...', 0);
            this.initData();
        } else Fetch.reLoginFunc();
    }

    // 初始化数据
    initData = ()=> {
        Fetch.post('/d-app/API/product/preProd', {
        }).then(async result=> {
            Toast.hide();
            this.getUserInfo();
            console.log(result);
            if (result.length > 0) {
                // 数据排序
                result = this.sort(result);

                this.discountData = result;

                let currentData = result[result.length - 1];
                let upperAmount = parseInt(currentData.upperAmount) !== 0 ? parseInt(currentData.upperAmount) : parseInt(currentData.lowerAmount);

                let storeNum = 0;
                // 获取库存数据
                await Fetch.post('d-app/API/order/preProdCount', {
                }).then(result=> {
                    if(result){
                        storeNum = result.count
                    }
                }).catch((error)=> {
                });

                this.setState({
                    upperAmount: upperAmount,
                    upperCycleCount: currentData.cycleCount,
                    allAmount: Math.ceil(upperAmount*(1 + currentData.gavingPerMil / 10000)),
                    saveAmount: Math.ceil(upperAmount*(currentData.gavingPerMil / 10000)),
                    selectIndex: result.length - 1,
                    storeNum: storeNum
                })
            }
        }).catch(error=> {
        })
    };

    // 对数据进行排序
    sort = (data)=> {
        for (let i=0; i<data.length; i++) {
            for (let j=0; j<data.length - 1 - i; j++) {
                let cycleCount = data[j].cycleCount;
                let afCycleCount = data[j + 1].cycleCount;
                if(cycleCount > afCycleCount){
                    let t = data[j];
                    data[j]  =  data[j + 1];
                    data[j + 1] = t;
                }
            }
        }

        return data;
    };

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

    // 修改账单金额
    changeAmount = (value)=> {
        if (this.discountData.length <= 0){
            return;
        }
        if (value.length > 5) return;

        for (let i=0; i<value.length; i++) {
            if (!/^[0-9]*$/.test(value[i])) {
                value = value.split(value[i])[0];
                break
            }
        }

        let currentData = this.discountData[this.state.selectIndex];
        let allAmount = value ? Math.ceil(parseInt(value)*(1 + currentData.gavingPerMil / 10000)) : 0;
        let saveAmount = value ? Math.ceil(parseInt(value)*(currentData.gavingPerMil / 10000)) : 0;

        this.setState({
            upperAmount: value ? parseInt(value) : value,
            allAmount: allAmount,
            saveAmount: saveAmount
        })
    };

    /**
     * 余额计算
     * @param type      1-增加，2-减少
     * @private
     */
    _amountCount = (type)=> {
        if (!this._canClickUp(type)) return;

        let upperAmount = this.state.upperAmount;
        if (type === 1) {
            upperAmount += 100;
        } else {
            upperAmount -= 100;
        }

        let currentData = this.discountData[this.state.selectIndex];
        let allAmount = Math.ceil(upperAmount*(1 + currentData.gavingPerMil / 10000));
        let saveAmount = Math.ceil(upperAmount*(currentData.gavingPerMil / 10000));

        this.setState({
            upperAmount: upperAmount,
            allAmount: allAmount,
            saveAmount: saveAmount
        })
    };

    /**
     * 存/月计算
     * @param type     1-增加，2-减少
     * @private
     */
    _cycleCount = (type)=> {
        if (!this._canClickDown(type)) return;

        let upperAmount, upperCycleCount, allAmount, saveAmount;

        if (type === 1) {
            this.state.selectIndex ++;
        } else {
            this.state.selectIndex --;
        }

        let currentData = this.discountData[this.state.selectIndex];
        upperAmount = parseInt(currentData.upperAmount) !== 0 ? parseInt(currentData.upperAmount) : parseInt(currentData.lowerAmount);
        upperCycleCount = currentData.cycleCount;
        allAmount = Math.ceil(upperAmount*(1 + currentData.gavingPerMil / 10000));
        saveAmount = Math.ceil(upperAmount*(currentData.gavingPerMil / 10000));

        this.setState({
            upperAmount: parseInt(upperAmount),
            upperCycleCount: upperCycleCount,
            allAmount: allAmount,
            saveAmount: saveAmount,
            selectIndex: this.state.selectIndex
        })
    };

    // 是否可增加/删除（金额）
    _canClickUp(type){
        let { upperAmount, selectIndex } = this.state;
        let canClick = true;
        if (this.discountData.length > 0) {
            let min = this.discountData[selectIndex].lowerAmount;
            let max = this.discountData[selectIndex].upperAmount;

            if (type === 1) {
                if (parseInt(max) === 0) {          // 最大值无上限
                    canClick = true;
                }else if (upperAmount > (parseInt(max) - 100)) {
                    canClick = false;
                }
            } else {
                if (upperAmount < (parseInt(min) + 100)) {
                    canClick = false;
                }
            }
        } else {
            canClick = false
        }

        return canClick
    }

    // 是否可增加/删除（存/月）
    _canClickDown(type){
        let canClick = true;
        if (this.discountData.length > 0) {
            let selectIndex = 0;

            if (type === 1) {
                selectIndex = this.discountData.length - 1;
            }

            if (this.state.selectIndex === selectIndex) {
                canClick = false;
            }
        } else {
            canClick = false
        }

        return canClick
    }

    render(){
        if (localStorage.getItem('DiscountData')) localStorage.removeItem('DiscountData');

        let { upperAmount, upperCycleCount, allAmount, saveAmount, storeNum } = this.state;

        return(
            <div>
                <div
                    className="bg discount-contain"
                    style={{ marginBottom: 50 }}
                >
                    <div
                        style={{ minHeight: 210 }}
                    >
                        <div
                            className="text-center"
                            style={{ height: 150, paddingTop: 50 }}
                        >
                            <div style={{ fontSize: 14, color: '#949494', marginBottom: 8 }}>
                                我要购买(通宝)
                            </div>

                            <span
                                className="border-bottom text-center relative"
                                style={{ borderBottomColor: '#EDEDED', paddingTop: 10, paddingBottom: 10 }}
                            >
                                <span
                                    onClick={()=> this._amountCount(2)}
                                    className="iconfont icon-subtract"
                                    style={{ fontSize: 20, padding: 8, color: !this._canClickUp(2) ? '#ddd' : '#FE7C4C' }}
                                />

                                <input
                                    ref={'input'}
                                    type="number"
                                    maxLength={5}
                                    style={{ fontSize: 20, color: '#444444', width: 80, textAlign: 'center' }}
                                    value={upperAmount}
                                    onChange={(e)=> this.changeAmount(e.target.value)}
                                    onBlur={()=> {
                                        if (this.discountData.length <= 0) {
                                            return;
                                        }
                                        let { selectIndex, upperAmount } = this.state;
                                        let min = this.discountData[selectIndex].lowerAmount;
                                        let max = this.discountData[selectIndex].upperAmount;

                                        if (upperAmount > parseInt(max) && parseInt(max) !== 0){
                                            upperAmount = parseInt(max);
                                        }

                                        if (upperAmount < parseInt(min)) upperAmount = parseInt(min);

                                        let currentData = this.discountData[this.state.selectIndex];
                                        let allAmount = Math.ceil(upperAmount*(1 + currentData.gavingPerMil / 10000));
                                        let saveAmount = Math.ceil(upperAmount*(currentData.gavingPerMil / 10000));

                                        this.setState({
                                            upperAmount: upperAmount,
                                            allAmount: allAmount,
                                            saveAmount: saveAmount
                                        });
                                    }}
                                />

                                <span
                                    onClick={()=> this._amountCount(1)}
                                    className="iconfont icon-tianjia"
                                    style={{ fontSize: 20, padding: 8, color: !this._canClickUp(1) ? '#ddd' : '#FE7C4C' }}
                                />
                            </span>
                        </div>

                        <div
                            className="flex flex-dir flex-center flex-space-between"
                        >
                            <div
                                className="text-center discount-item"
                                style={{ width: '33.33%' }}
                            >
                                <div style={{ fontSize: 13, color: '#505050' }}>
                                    存/月
                                </div>

                                <span
                                    className="text-center"
                                    style={{ borderBottomColor: '#EDEDED', paddingTop: 10, paddingBottom: 10 }}
                                >
                                    <span
                                        onClick={()=> this._cycleCount(2)}
                                        className="iconfont icon-jianquO"
                                        style={{ fontSize: 16, color: this._canClickDown(2) ? '#FE7C4C' : '#ddd' }}
                                    />

                                    <span style={{ fontSize: 14, color: '#FE8252', paddingLeft: 10, paddingRight: 10 }}>
                                        {upperCycleCount}
                                    </span>

                                    <span
                                        onClick={()=> this._cycleCount(1)}
                                        className="iconfont icon-tianjiaO"
                                        style={{ fontSize: 16, color: this._canClickDown(1) ? '#FE7C4C' : '#ddd' }}
                                    />
                                </span>
                            </div>

                            <div
                                className="text-center discount-item"
                                style={{ width: '33.33%' }}
                            >
                                <div style={{ fontSize: 13, color: '#505050' }}>
                                    原价
                                </div>

                                <div style={{ fontSize: 14, color: '#FE7E4E' }}>
                                    {allAmount}
                                </div>
                            </div>

                            <div
                                className="text-center discount-item"
                                style={{ width: '33.33%' }}
                            >
                                <div style={{ fontSize: 13, color: '#505050' }}>
                                    优惠
                                </div>

                                <div style={{ fontSize: 14, color: '#FE7E4E' }}>
                                    {saveAmount}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div
                            onClick={()=> upperAmount && this.discountData.length > 0 && this.detailModal.styleManage(true, this.state)}
                            className="flex flex-center flex-dir flex-space-between border-bottom"
                            style={{ height: 40 }}
                        >
                            <span style={{ fontSize: 13, color: '#505050' }}>优惠明细</span>

                            <div
                                className="flex flex-center"
                            >
                                <span style={{ fontSize: 14, color: '#505050', marginRight: 5 }}>
                                    {allAmount + '元'}
                                </span>

                                <span className="iconfont icon-youjiantou" style={{ fontSize: 10, color: '#BEBEBE' }}/>
                            </div>
                        </div>

                        <div
                            className="flex flex-center flex-dir flex-space-between"
                            style={{ height: 40 }}
                        >
                            <span style={{ fontSize: 13, color: '#505050' }}>预计支付(元)：</span>

                            <span style={{ fontSize: 14, color: '#FE7E4E' }}>
                                {this.state.upperAmount}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ paddingLeft: 15, paddingRight: 15 }}>
                    <Button
                        disabled={ !this.state.upperAmount ? true : false }
                        onClick={()=> {
                            let params = {
                                upperAmount: this.state.upperAmount,
                                allAmount: this.state.allAmount,
                                upperCycleCount: this.state.upperCycleCount,
                                prodCode: this.discountData[this.state.selectIndex].prodCode
                            };
                            localStorage.setItem('DiscountData', JSON.stringify(params));

                            this.props.history.push('/discountOrder');
                        }}
                        className="linear-gradient discount-btn"
                        style={{ fontSize: 14, color: '#fff' }}
                        activeStyle={{ background: '#FE7F4F' }}
                    >
                        立即支付
                    </Button>
                </div>

                <DetailModal ref={ref => this.detailModal = ref}/>
            </div>
        )
    }
}

class DetailModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            detailsList: []
        }
    }

    // 样式处理
    styleManage = (val, data)=> {
        if (data) {
            let detailsList = this.initData(data);

            this.setState({
                detailsList: detailsList,
                visible: val
            })
        } else this.setState({visible: val});
    };

    // 数据处理
    initData = (data)=> {
        let detailsList = [];
        let curDate = new Date();
        let curDay = curDate.getDate();
        for (let i = 0; i < data.upperCycleCount; i++ ){
            detailsList.push({
                date: this._getMonthBeforeFormatAndDay(i, '.', curDay),
                state: `第${i + 1}期`,
                amount: this.dateAmount(i, data)
            })
        }
        [detailsList[0].amount, detailsList[detailsList.length - 1].amount] = [detailsList[detailsList.length - 1].amount, detailsList[0].amount];
        return detailsList
    };

    // 每期返还金额处理
    dateAmount(index, data){
        let amount = (data.allAmount / data.upperCycleCount).toString();

        if (amount.indexOf('.') > -1){
            let copyAmount = amount.split('.')[0] + '.' + amount.split('.')[1].substr(0, 2);
            if (index === (data.upperCycleCount - 1)) {
                amount = (data.allAmount - copyAmount * (data.upperCycleCount - 1)).toFixed(2);
            } else {
                amount = copyAmount;
            }
        } else {
            amount = amount + '.00';
        }
        console.log(amount);
        return amount
    }

    /**
     * 获取下个自然月
     * @param num
     * @param format
     * @param day
     * @returns {string}
     * @private
     */
    _getMonthBeforeFormatAndDay = (num, format, day)=> {
        let date = new Date();
        date.setMonth(date.getMonth() + (num * 1), 1);
        //读取日期自动会减一，所以要加一
        let mo = date.getMonth() + 1;
        //小月
        if (mo === 4 || mo === 6 || mo === 9 || mo === 11) {
            if (day > 30) {
                day = 30
            }
        }
        //2月
        else if (mo === 2) {
            if (this._isLeapYear(date.getFullYear())) {
                if (day > 29) {
                    day = 29
                }
            } else if (day > 28) {
                day = 28
            }
        }
        //大月
        else {
            if (day > 31) {
                day = 31
            }
        }

        return `${date.getFullYear()}.${date.getMonth() + 1}.${day}`;
    };

    //JS判断闰年代码
    _isLeapYear = (Year)=> {
        if ( ( ( (Year % 4) === 0) && ( (Year % 100) !== 0) ) || ( (Year % 400) === 0) ) {
            return (true);
        } else {
            return (false);
        }
    };

    render(){
        return(
            <Modal
                popup
                visible={this.state.visible}
                onClose={()=> this.styleManage(false)}
                animationType="slide-up"
            >
                <div className="recharge-details">
                    <div className="details-top modal-top" style={{ borderBottomColor: '#dedede' }}>
                        <span>优惠明细</span>
                        <i
                            className="iconfont icon-guanbi"
                            style={{ color: '#909090', fontSize: 14 }}
                            onClick={() => this.styleManage(false)}
                        />
                    </div>

                    <div className="details-list">
                        <div className="list-top flex flex-space-between">
                            <span>返还期数</span>
                            <span>返还时间</span>
                            <span>返还金额</span>
                        </div>

                        <ul style={{paddingBottom: 40}}>
                            {
                                this.state.detailsList.map((item, index) => (
                                    <li
                                        key={index}
                                        className="details-item flex flex-space-between"
                                    >
                                        <span>{item.state}</span>
                                        <span>{item.date}</span>
                                        <span>{item.amount}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default Discount;