import React from 'react';
import { DatePicker, Toast } from 'antd-mobile';

import ImageConfig from '../../../assets/imageConfig';
import Fetch from '../../../components/fetch';
import LoadMore from '../../../components/loadMore';


const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const totalHeight = document.documentElement.clientHeight;

export default class DetailList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataList: [

            ],
            loadState: 1,
            dateArr: [],
            itemData: []
        }
        this.page = 1;
        this.pageSize = 10;
        this.sourceType = -1;   //来源页, 1是佣金, 2是余额
        this.month = '';    //请求月份
        this.url1 = '';
        this.url2 = '';
    }

    componentWillMount() {
        document.body.scrollIntoView();
        //获取来源页判断发送哪个请求
        this.sourceType = this.props.history.location.state.sourceType;
        if (this.sourceType === 1) {
            this.url1 = '/d-app/API/userCommission/commissionList';
            document.title = '佣金明细';
        } else {
            this.url1 = 'd-app/API/bm/userBookRecord/userBookRecordList';
            document.title = '余额流水';
        }
    }

    componentDidMount() {

        this._getDataList(1);
        window.scrollTo(0, 0);
        window.onscroll = () => {

            if (this._getScrollTop() + this._getClientHeight() >= this._getScrollHeight()) {
                console.log(this.state.loadState + 'scroll')
                if (this.state.loadState === 1) {
                    this._getDataList(2);
                }
            }
        }
    }

    componentWillUnmount() {
        window.onscroll = null;
    }


    //选择日期
    selectDate(date) {
        console.log(date);
        const curDate = new Date(date);
        this.month = curDate.getFullYear() + '-' + (curDate.getMonth() + 1);
        console.log(this.month)
        this._getDataList(1);
    }

    //获取滚动条当前的位置 
    _getScrollTop() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        }
        else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    //获取当前可视范围的高度 
    _getClientHeight() {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
        }
        else {
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
    }

    //获取文档完整的高度 
    _getScrollHeight() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }



    _getDataList(type) {
        Toast.loading('加载中');
        if (type === 1) {
            this.page = 1;
        } else {
            this.page++;
        }

        this.setState({
            loadState: 2
        })

        Fetch.post(this.url1, {
            dateTime: this.month,
            page: this.page,
            pageSize: this.pageSize
        }).then(res => {
            Toast.hide();
            if (res) {
                console.log(res)
                this._manageResult(res, type);
                if (res.length < this.pageSize) {
                    this.setState({
                        loadState: 3
                    })
                } else {
                    this.setState({
                        loadState: 1
                    })

                }
            }

        }).catch(err => {
            console.log(err)
        })
    }

    //数据处理
    async _manageResult(data, type) {
        let dateArr = [];   //定义时间月份的数组
        let dataList = [];
        let itemData = [];
        //是否是上拉加载
        if (type !== 1) {
            dateArr = this.state.dateArr;
            dataList = this.state.dataList;
            itemData = this.state.itemData;
        }

        itemData.push(...data);
        itemData.forEach((item) => {
            let time = this._manageDate(item.dateTime, item.changeTime);
            let curDate = time.substring(0, 7);
            dateArr.push(curDate);
        })
        dateArr = [...new Set(dateArr)];    //去重

        for (let i = 0; i < dateArr.length; i++) {
            dataList[i] = {
                date: `${dateArr[i].substring(0, 4)}年${dateArr[i].substring(5, 7)}月`,
                incomeMoney: '',
                spendMoney: '',
                list: []
            }
            itemData.forEach((j) => {
                if (this._manageDate(j.dateTime, j.changeTime).substring(0, 7) === dateArr[i]) {
                    dataList[i].list.push({
                        money: j.commission || j.changeValue,
                        time: `${this._manageDate(j.dateTime, j.changeTime).substring(5, 7)}月${this._manageDate(j.dateTime, j.changeTime).substring(8, 10)}号 ${this._manageDate(j.dateTime, j.changeTime).substring(11, 16)}`,
                        title: j.shopsName || this._getChangeAction(j.changeAction),
                        key: j.changeAction || ''
                    })
                }
            })

            //获取统计信息
            if (this.sourceType === 1) {
                await Fetch.post('/d-app/API/userCommission//commissionCollect',
                    {
                        dateTime: dateArr[i],
                    }
                ).then(res => {
                    dataList[i].incomeMoney = res.totalMoney
                }).catch(err => { });
            } else {
                await Fetch.post('d-app/API/bm/userBookRecord/userBalanceCollect',
                    {
                        dateTime: dateArr[i],
                    }
                ).then(res => {
                    dataList[i].incomeMoney = res.incomeMoney
                    dataList[i].spendMoney = res.spendMoney
                }).catch(err => { });
            }
        }
        this.setState({
            dataList,
            dateArr,
            itemData
        })
        console.log(dataList)
    }

    //时间处理
    _manageDate(dateTime, changeTime){
        if(dateTime){
            return dateTime
        } else if(changeTime){
            return changeTime
        } else {
            return 'XXXX-XX-XX 00:00:00'
        }
    }

    //根据编号返回名称
    _getChangeAction(key) {
        switch (key) {
            case '1':
                return '订单支付';
                break;
            case '2':
                return '订单退款';
                break;
            case '3':
                return '油卡预充值失败退款';
                break;
            case '4':
                return '金额充值';
                break;
            case '5':
                return '油卡充值奖励积分';
                break;
            case '6':
                return '积分兑换';
                break;
            case '7':
                return '兑换余额';
                break;
            case '8':
                return '预存返还';
                break;
            case '9':
                return '佣金提现';
                break;
            case '10':
                return '佣金奖励';
                break;
            default:
                return '';
        }
    }

    _getNumber(item) {
        if (item.key === '1') {
            return '-' + item.money
        }
        else {
            return '+' + item.money
            
        }
    }


    render() {
        return (
            <div
                style={{ width: '100%', minHeight: this.state.loadState === 3 ? totalHeight : totalHeight + 10, background: 'rgba(247, 247, 247, 1)', position: 'relative' }}
            >
                <SelectDate
                    callBack={(date) => this.selectDate(date)}
                />

                {

                    this.state.dataList.length > 0 ?
                        [
                            this.state.dataList.map((item, index) => (
                                <div
                                    style={{ width: '100%', height: 'auto' }}
                                    key={index}
                                >
                                    <div
                                        className="flex flex-col flex-space-between"
                                        style={{ width: '100%', height: '2.8rem', padding: '0.5rem 0.75rem' }}
                                    >
                                        <span
                                            style={{ color: '#000', fontSize: 12 }}
                                        >{item.date}</span>
                                        <span
                                            style={{ color: '#909090', fontSize: 12 }}
                                        >收入 {item.incomeMoney} {item.spendMoney ? '支出' + item.spendMoney : ''}</span>
                                    </div>
                                    {
                                        item.list.map((i2, j) => (
                                            <div
                                                className="flex flex-space-between flex-align-items box-sizing"
                                                style={{ background: '#fff', height: '3.4rem', width: '100%', padding: '0 0.75rem', borderBottom: '1px solid #eee' }}
                                                key={j}
                                            >
                                                <div
                                                    className="flex flex-col flex-space-between"
                                                    style={{ height: '2.4rem' }}
                                                >
                                                    <span
                                                        style={{ color: '#252932', fontSize: 14 }}
                                                    >{i2.title}</span>
                                                    <span
                                                        style={{ color: '#909090', fontSize: 12 }}
                                                    >{i2.time}</span>
                                                </div>
                                                <div
                                                    style={{ color: this._getNumber(i2)[0] === '+' ? '#FF8859' : '#666', fontSize: 18 }}
                                                >{this._getNumber(i2)}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            )),
                            <LoadMore
                                key={-1}
                                loadState={this.state.loadState}
                            />
                        ]
                        :
                        <div
                            className="flex flex-center"
                            style={{ width: '100%', height: totalHeight }}
                        >
                            <img src={ImageConfig.noData} alt="" style={{ width: '15rem' }} />
                        </div>
                }

            </div>
        )
    }
}

class SelectDate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: now
        }
        this.minDate = new Date('1999', '12', '30');
        this.date = now;
    }
    componentDidMount(){
        if(this.date !== this.state.date){
            this.setState({
                date: this.date
            })
        }
    }

    onOk(){
        this.setState({
            date: this.date
        })
        this.props.callBack(this.date)
    }

    render() {
        return (
            <DatePicker
                mode={'month'}
                maxDate={now}
                minDate={this.minDate}
                value={this.state.date}
                onChange={date => this.date = date}
                onOk={() => this.onOk()}
            >
                <div
                    style={{ color: '#000', fontSize: '1.2rem', position: 'absolute', top: '0.8rem', right: '1rem', zIndex: 980 }}
                    className="iconfont icon-rili"
                ></div>
            </DatePicker>
        )
    }
}
