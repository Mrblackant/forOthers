import React from 'react'
import {
    Toast,
    ListView
} from 'antd-mobile';


import ImageConfig from '../../assets/imageConfig';
import LoadMore from '../../components/loadMore';
import Fetch from '../../components/fetch';



export default class ReturnRecord extends React.Component {

    componentWillMount() {
        document.title = "返还记录";
        document.body.scrollIntoView();
    }

    render() {
        return (
            <div className="container-record">
                {/* 头部 */}
                <Header />
                {/* 返回列表 */}
                <RecordList />
            </div>
        )
    }
}

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orderNum: '0',
            refundAmount: '2000'
        }
    }

    componentDidMount() {
        Fetch.post('/d-app/API/preOrder/preOrderStat')
            .then(res => {
                const { orderNum, refundAmount } = res;
                this.setState({
                    orderNum,
                    refundAmount
                })
            }).catch(err => {
                console.log(err)
            })
    }

    render() {
        const { orderNum, refundAmount } = this.state;
        return (
            <div className="record-header-wrap">
                <div className="record-header">

                    <div
                        className="header-box"
                        style={{color:'#444',fontSize:15}}
                    >
                        <div>预购笔数</div>
                        <div>
                            <span
                                className="sp1"
                            >{orderNum}</span>
                            <span
                                className="sp2"
                                style={{color:'#909090',fontSize:10}}
                            > 笔</span>
                        </div>
                    </div>
                    <div
                        className="header-box"
                        style={{color:'#444',fontSize:15}}
                    >
                        <div>下月返还</div>
                        <div>
                            <span
                                className="sp1"
                            >{refundAmount}</span>
                            <span
                                className="sp2"
                                style={{color:'#909090',fontSize:10}}
                            > 通宝</span>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

class RecordList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            recordData: [],
            loadState: 1,
            height: 0,
            curIndex: -1,
            listLength: 0
        };
        this.page = 1;
        this.pageSize = 10;
        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    componentDidMount() {

        this._getDataList(3);
    }

    onChangeIndex(id, length) {
        // const totalHeight = document.documentElement.clientHeight;
        // let offsetTop = this.list.offsetTop;
        if (id !== this.state.curIndex) {
            // const height = this.state.listLength * this['item' + id].offsetHeight + (2.25 / 4.6) * this['item' + id].offsetHeight * length;
            this.setState({
                curIndex: id,
                //height
            })
        } else {
            console.log(this.state.listLength * this['item' + id].offsetHeight)
            this.setState({
                curIndex: -1,
                //height: totalHeight - offsetTop
            })
        }
    }

    _getDataList(type) {
        let { recordData } = this.state;
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if (type === 1 || type === 3) {
            this.page = 1
        } else {
            this.page++
        }
        this.setState({ loadState: 2 });
        Fetch.post("/d-app/API/preOrder/preOrderList", {
            page: this.page,
            pageSize: this.pageSize
        }).then((result) => {
            console.log(result);
            if (result) {
                if (type === 1) {
                    this.setState({ recordData: result });
                } else {
                    recordData.push.apply(recordData, result);
                }
            }
            // 当返回数据长度不等于pageSize时不做上拉加载处理
            const listLength = this.state.listLength + result.length;
            if (result.length < this.pageSize) {
                this.setState({ loadState: 3, listLength });
            } else {
                this.setState({ loadState: 1, listLength });
            }
        }).then(() => {
            const totalHeight = document.documentElement.clientHeight;
            if (document.querySelector('.am-list-view-scrollview')) {
                let offsetTop = document.querySelector('.am-list-view-scrollview').offsetTop;
                this.setState({
                    height: totalHeight - offsetTop
                })
            }
        })
            .catch((err) => {
                this.setState({ loadState: 3 });
                Toast.info(err.errDesc);
            })
    }

    _renderRow(rowData, rowId) {
        return (
            <div
                key={rowId}
                className={this.state.curIndex === rowId ? "record-item open" : 'record-item'}
                style={{ height: this.state.curIndex === rowId ? rowData.preOrderInfoList.length * 2.25 + 4.6 + 'rem' : '4.6rem' }}
                ref={ref => this['item' + rowId] = ref}
            >
                <div
                    className="item-top"
                    style={this.state.curIndex === rowId ? { borderBottom: '1px solid rgba(0,0,0,0.1)' } : null}
                    onClick={() => this.onChangeIndex(rowId, rowData.preOrderInfoList.length)}
                >
                    <div
                        style={{ width: 'auto', height: '100%', alignItems: 'flex-start', flexDirection: 'column' }}
                        className="flex flex-space-between"
                    >
                        <span
                            className="sp1"
                            style={{ fontSize:16,color:'#444' }}
                        >
                            {rowData.prodName}
                        </span>
                        <span
                            className="sp2"
                            style={{ fontSize:12,color:'#4A4A4A'}}
                        >
                            {rowData.giveCount}期
                        </span>
                    </div>

                    <div
                        style={{ width: 'auto', height: '100%', alignItems: 'flex-end' }}
                        className="flex"
                    >
                        <div
                            style={{ width: 'auto', height: '100%', alignItems: 'flex-end', flexDirection: 'column', marginRight: '0.4rem' }}
                            className="flex flex-space-between"
                        >
                            <span
                                className="sp1"
                                style={{ textAlign: 'right',fontSize:16,color:'#444' }}
                            >
                                未到账{rowData.surplusAmount}
                            </span>
                            <span
                                className="sp2"
                                style={{ textAlign: 'right' ,fontSize:12,color:'#4A4A4A'}}
                            >
                                还剩{rowData.surplusCount}期
                            </span>
                        </div>
                        {
                            rowData.preOrderInfoList.length > 0 ?
                                <i
                                    className="iconfont icon-jiantouxia1"
                                    style={{ height: '100%', lineHeight: '2rem', color: 'rgba(68, 68, 68, 1)', fontSize: '0.5rem', width: '1.2rem', textAlign: 'center' }}
                                /> : 
                                <div
                                    style={{ height: '100%', width: '1.2rem' }}
                                ></div>
                        }

                    </div>
                </div>
                {rowData.preOrderInfoList.length > 0 ?

                    rowData.preOrderInfoList.map((item, index) => (
                        <div
                            key={index}
                            className="item-bot"
                        >
                            <span
                                style={{ width: '3.8rem' }}
                            >
                                {item.giveTitle}
                            </span>
                            <span
                                style={{ width: '7.3rem' }}
                            >
                                {item.giveAmount}
                            </span>
                            <span>
                                {item.giveTime}
                            </span>
                        </div>
                    ))
                    : null
                }
            </div>
        )
    }

    render() {
        if (this.state.recordData.length === 0) {
            return (
                <div
                    style={{ position: 'fixed', left: '0', top: '7.1rem', width: '100%', bottom: '0' }}
                    className="flex flex-justify-content flex-align-items"
                >
                    <img style={{ width: '50%' }} src={ImageConfig.noData} alt=" " />
                </div>
            )
        }

        return (
            <ListView
                style={{ height: this.state.height, position: 'fixed', left: '0', top: '7.1rem', width: '100%' }}
                ref={ref => this.list = ref}
                dataSource={this.dataSource.cloneWithRows(this.state.recordData)}
                renderFooter={() => (this.state.recordData.length > 8 ? <LoadMore loadState={this.state.loadState} /> : null)}
                renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                pageSize={10}
                renderBodyComponent={() => <div />}
                onScroll={() => console.log('scroll')}
                scrollRenderAheadDistance={500}
                onEndReachedThreshold={10}
                onEndReached={() => this._getDataList(2)}
            />
        )
    }
}