import React from 'react'
import { Toast, ListView } from 'antd-mobile';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import LoadMore from '../../../components/loadMore';
import Fetch from '../../../components/fetch';
import WxApi from '../../../components/wxApi';

export default class MyBusiness extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadState: 1,
            shops: []
        }
        this.cityInfo = {
            dimension: 39.928216,
            longitude: 116.402544
        }
        this.page = 1;
        this.pageSize = 5;
        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    componentWillMount() {
        document.title = "我的商家";
        document.body.scrollIntoView();



    }

    componentDidMount() {
        Toast.hide();
        this._getMyShops(1);

    }

    //获取我的商家列表
    _getMyShops(type) {
        if (type === 1) {
            this.page = 1;
        } else {
            this.page++;
        }

        Toast.loading('加载中');
        this.setState({
            loadState: 2
        })

        Fetch.post('/d-app/API/bs/myShops/getMyShops', {
            dimension: this.cityInfo.dimension,
            longitude: this.cityInfo.longitude,
            page: this.page,
            pageSize: this.pageSize,
            searchContent: ''
        }).then(res => {
            Toast.hide();
            console.log(res)
            if(res){
                this.header._getData(res.recommendCode, res.commission);
                if (type === 1) {
                    this.setState({
                        shops: res.myShopsList
                    })
                } else {
                    let shops = this.state.shops;
                    shops.push(...res.myShopsList);
                    console.log(shops);
                    this.setState({
                        shops
                    })
                }
            }

            
            if (res.myShopsList.length < this.pageSize){
                this.setState({
                    loadState: 3
                })
            }

        }).catch(err => {
            console.log(err)
        })
    }

    _renderRow(rowData, rowId) {
        return (
            <div
                className="box-sizing flex flex-align-items flex-space-between"
                key={rowId}
                onClick={() => this.props.history.push('/businessDetail/' + rowData.shopsId)}
                style={{
                    width: '100%', height: '4.7rem', marginBottom: '0.3rem',
                    padding: '0 0.6rem', background: '#fff', position: 'relative',
                    opacity: rowData.status === 3 ? '0.5' : '1'
                }}
            >
                <div
                    className="flex"
                    style={{ height: '3.2rem' }}
                >
                    <img
                        style={{ width: '4.4rem', height: '3.2rem' }}
                        src={rowData.pictureUrl}
                        alt=""
                    />
                    <div
                        className="flex flex-col flex-space-between"
                        style={{ marginLeft: '0.6rem' }}
                    >
                        <span
                            style={{ colro: '#333', fontSize: '0.75rem' }}
                        >{rowData.shopsName}</span>
                        <div>
                            <i
                                style={{ color: '#CACACA', fontSize: '0.5rem' }}
                                className="iconfont icon-weizhi"
                            />
                            <span
                                style={{ color: '#999', fontSize: '0.6rem', marginLeft: '0.2rem' }}
                            >{rowData.shopsAddress}</span>
                        </div>
                    </div>
                </div>
                <div
                    style={{ color: '#FF8859', fontSize: '1rem' }}
                >
                    {rowData.commission}
                </div>
                {
                    rowData.status !== 1 ?
                        <div
                            className="flex flex-center"
                            style={{
                                width: '2.1rem', height: '1rem', position: 'absolute',
                                top: 0, left: '0.6rem', color: '#fff', fontSize: '0.6rem',
                                background: rowData.status === 2 ? '#FF5B5B' : '#4A4A4A'
                            }}
                        >
                            {rowData.status === 2 ? '危险' : '已解除'}
                        </div> : null
                }
            </div>
        )
    }

    //rem转换px
    _remToPx(rem) {
        const cw = document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth;
        return rem * (cw / 375 * 20)
    }

    render() {
        const { shops } = this.state;
        const totalHeight = document.documentElement.clientHeight;
        console.log(this.state)
        return (
            <div
                style={{ width: '100%', height: '100%', background: 'rgba(247, 247, 247, 1)' }}
            >
                <Header
                    ref = {ref => this.header = ref}
                    history={this.props.history}
                />
                {
                    shops.length > 0 ?
                        <ListView
                            style={{ position: 'fixed', top: '12.3rem', bottom: 0, zIndex: 980, width: '100%', height: totalHeight - this._remToPx(12.3) + 'px' }}
                            dataSource={this.dataSource.cloneWithRows(shops)}
                            renderFooter={() => (shops.length > 4 ? <LoadMore loadState={this.state.loadState} /> : null)}
                            renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                            pageSize={10}
                            renderBodyComponent={() => <div />}
                            onScroll={() => console.log('scroll')}
                            scrollRenderAheadDistance={500}
                            onEndReachedThreshold={300}
                            onEndReached={() => this._getMyShops(2)}
                        />
                        :
                        <div
                            className="flex flex-center"
                            style={{ position: 'fixed', left: '0', top: '12.3rem', width: '100%', bottom: '0' }}
                        >
                            <span
                                style={{ color: '#999', fontSize: '0.9rem', marginTop: '-4rem' }}
                            >暂无商家~</span>
                        </div>
                }
                <ToMap
                    history={this.props.history}
                    cityInfo={this.cityInfo}
                />
            </div>
        )
    }
}

// 头部
class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            copied: false,
            recommendCode:'',
            commission:0
        }
    }

    _getData(recommendCode,commission){
        this.setState({
            recommendCode:recommendCode,
            commission:commission
        })
    }

    onCopy() {
        this.setState({
            copied: true
        }, () => {
            Toast.info('复制成功', 1);
        })
    }

    render() {
        const { commission, recommendCode } = this.state;
        return (
            <div
                className="flex flex-col flex-align-items"
                style={{ width: '100%', height: 'auto', background: '#fff', position: 'fixed', top: 0, left: 0, zIndex: 999 }}

            >
                <div
                    className="flex flex-col flex-align-items"
                    style={{ width: '100%', height: '6.9rem' }}
                    onClick={() => this.props.history.push('/detailList', { sourceType: 1 })}
                >
                    <span
                        style={{ color: '#FF8859', fontSize: '1.5rem', marginTop: '2.25rem' }}
                    >{commission}</span>
                    <span
                        style={{ color: '#999', fontSize: '0.6rem', marginTop: '0.85rem' }}
                    >当前佣金</span>
                </div>
                <div
                    className="flex flex-space-between box-sizing flex-align-items"
                    style={{ width: '100%', height: '2.2rem', borderTop: '1px solid #eee', padding: '0 0.6rem' }}
                >
                    <span
                        style={{ color: '#333', fontSize: '0.7rem' }}
                        onClick={() => recommendCode ? this.onCopy():null}
                    >
                        我的邀请码: {recommendCode}
                    </span>
                    <CopyToClipboard text={recommendCode}
                        onCopy={() => recommendCode ? this.onCopy() : null}>
                        <span
                            
                            style={{
                                background: recommendCode ? '#FF8859' : '#909090', width: '2.2rem', height: '1.1rem',
                                fontSize: '0.6rem', color: '#fff', lineHeight: '1.1rem',
                                textAlign: 'center', borderRadius: '1rem'
                            }}
                        >复制</span>
                    </CopyToClipboard>
                </div>
                <div
                    className="flex flex-space-between box-sizing flex-align-items"
                    style={{ width: '17.25rem', height: '2.2rem', borderTop: '1px solid #eee' }}
                    onClick={() => this.props.history.push('/withdraw', { commission: commission })}
                >
                    <span
                        style={{ color: '#333', fontSize: '0.7rem' }}
                    >提现</span>
                    <i
                        className="iconfont icon-youjiantou"
                        style={{ color: '#909090', fontSize: '0.7rem' }}
                    />
                </div>
            </div>
        )
    }
}

class ToMap extends React.Component {

    constructor(props){
        super(props);
        if(localStorage.cityInfo){
            this.cityInfo = JSON.parse(localStorage.cityInfo);
        }
    }

    render() {

        return (
            <div
                className="flex flex-center"
                style={{
                    position: 'fixed', width: '17.25rem', bottom: '2rem',
                    left: '0.75rem', height: '2.2rem', boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.13)',
                    background: '#fff', zIndex: 999
                }}
                onClick={() => this.props.history.push('/nearbyMap', { cityInfo:  this.cityInfo })}
            >
                <span
                    style={{ color: '#FF8859', fontSize: '0.7rem' }}
                >商家地图</span>
                <i
                    style={{ color: '#FF8859', fontSize: '0.5rem', marginLeft: '0.4rem' }}
                    className="iconfont icon-weizhi"
                />
            </div>
        )
    }
}
