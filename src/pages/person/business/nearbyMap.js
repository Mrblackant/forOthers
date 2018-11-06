import React from 'react'
import { Map, NavigationControl } from 'react-bmap';
import { Toast } from 'antd-mobile';

import WxApi from '../../../components/wxApi';
import Fetch from '../../../components/fetch';
import ImageConfig from '../../../assets/imageConfig';

const BMap = window.BMap;
function ComplexCustomOverlay(point, text) {
    this._point = point;
    this._text = text;

}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function (map) {
    this._map = map;
    var div = this._div = document.createElement("div");
    let width = this._text.length * 14 + 8 + 14;
    div.style.position = 'absolute';
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);

    div.style.height = '16px';
    div.style.background = '#fff';
    div.style.padding = '0 6px';
    div.style.borderRadius = '10px';
    div.style.boxShadow = '3px 3px 3px rgba(0,0,0,0.4)';
    div.style.overflow = 'hidden';

    div.style.fontSize = '14px';
    div.style.color = '#333';
    div.style.lineHeight = '16px';
    div.style.textAlign = 'center';

    div.style.width = width + 'px';
    div.appendChild(document.createTextNode(this._text));



    map.getPanes().labelPane.appendChild(div);

    return div;
}
ComplexCustomOverlay.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    console.log(parseInt(this._div.style.width) / 2);
    console.log('=================')
    this._div.style.left = pixel.x - parseInt(this._div.style.width) / 2 + "px";
    this._div.style.top = pixel.y + 5 + "px";
}

export default class NearbyMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showInput: false,
            curBusinessList: [],    //当前搜索商家
            allBusinessList: [],    //所有商家
            searchVal: '输入商家名'
        }
        this.centerPos = {
            lat: 39.928216,
            lng: 116.402544
        };
        this.myCompOverlay = [];
    }

    componentWillMount() {
        document.title = "我的商家"
    }

    componentDidMount() {
        Toast.hide();
        //获取当前位置
        if (this.props.history.location.state.cityInfo){
            this.centerPos = this.props.history.location.state.cityInfo;
            this._initPoint();
        } else {
            WxApi.config(encodeURIComponent(window.location.href.split('#')[0]));
            setTimeout(() => {
                WxApi.getLocation().then(res => {
                    const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    this.centerPos = {
                        lat: latitude,
                        lng: longitude
                    }
                    this._initPoint();
                }).catch(() =>{
                    this._initPoint();
                })
            }, 1000);

        }
        


    }



    //定位中心
    onClickToCenter() {
        console.log(this.centerPos)
        if (this.centerPos) {
            const point = new window.BMap.Point(this.centerPos.longitude, this.centerPos.dimension);
            this.map.map.centerAndZoom(point, 15);
        }
    }

    //显示input框
    showInput(key) {
        this.setState({
            showInput: key
        })
    }

    onSearch(val) {
        const businessList = this.state.allBusinessList.filter((item, index) => {
            return item.shopsName.indexOf(val) !== -1
        })
        this.map.map.clearOverlays();
        this._addMarker(this.centerPos.longitude, this.centerPos.dimension, true);
        this.setState({
            curBusinessList: businessList,
            searchVal: val
        }, () => {
            this.state.curBusinessList.forEach((item, index) => {
                this._addOverlay(item.longitude, item.dimension, item.shopsName, index);
                this._addMarker(item.longitude, item.dimension);
            })
        })
    }

    //初始化点
    _initPoint(){
        const point = new window.BMap.Point(this.centerPos.longitude, this.centerPos.dimension);
        this.map.map.centerAndZoom(point, 15);
        if (this.centerPos && this.centerPos.dimension && this.centerPos.longitude) {
            this._addMarker(this.centerPos.longitude, this.centerPos.dimension, true);
            Fetch.post('/d-app/API/bs/myShops/getMyShops', {
                dimension: this.centerPos.dimension,
                longitude: this.centerPos.longitude,
                page: 1,
                pageSize: 10000,
                searchContent: ''
            }).then(res => {
                console.log(res)
                if (res) {
                    this.setState({
                        allBusinessList: res.myShopsList,
                        curBusinessList: res.myShopsList
                    }, () => {
                        if (this.state.curBusinessList.length > 0) {
                            this.state.curBusinessList.forEach((item, index) => {
                                this._addOverlay(item.longitude, item.dimension, item.shopsName, index);
                                this._addMarker(item.longitude, item.dimension);
                            })
                        }
                    })
                }

            }).catch(err => {
                console.log(err)
            })
        }
    }

    //插入自定义覆盖物
    _addOverlay(lng, lat, text, index) {
        console.log(lng, lat, text, index);
        this.myCompOverlay[index] = new ComplexCustomOverlay(new BMap.Point(lng, lat), text);
        this.map.map.addOverlay(this.myCompOverlay[index]);
        
    }

    //插入标记点
    _addMarker(lng, lat, isSelf) {
        let markerIcon = isSelf ? ImageConfig.marker2 : ImageConfig.marker;
        const point = new window.BMap.Point(lng, lat);
        const myIcon = new window.BMap.Icon(markerIcon, new window.BMap.Size(32, 32), {
            imageSize: new BMap.Size(30, 33),
            anchor: new window.BMap.Size(15, 28),
        });
        const marker = new window.BMap.Marker(point, { icon: myIcon });
        this.map.map.addOverlay(marker);
    }

    render() {
       
        return (
            <div
                className="container-nearby"
            >
                {/* 定位中心 */}
                <div
                    className="flex flex-center"
                    style={{ width: '2rem', height: '2rem', position: 'absolute', bottom: '4.5rem', left: '1rem', background: '#fff', zIndex: 980, boxShadow: '0px 0px 3px rgba(0,0,0,0.3)', borderRadius: '8px' }}
                    onClick={() => { this.onClickToCenter() }}
                >
                   <img src={ImageConfig.position} alt="" style={{ width: '1.3rem', height: '1.3rem' }} /> 
                </div>
                {
                    this.state.showInput ?
                        <SearchInput
                            showInput={(key) => this.showInput(key)}
                            onSearch={(val) => this.onSearch(val)}
                        /> :
                        <div
                            className="flex flex-center"
                            style={{
                                width: '80%', height: '1.9rem', position: 'absolute', top: '1rem',
                                left: '10%', background: '#fff', zIndex: '999', borderRadius: '1rem',
                                boxShadow: '2px 2px 4px rgba(0,0,0,0.4)'
                            }}
                            onClick={() => this.showInput(true)}
                        >
                            <i className="iconfont icon-sousuo"></i>
                            <span
                                style={{ marginLeft: 5 }}
                            >
                                {this.state.searchVal}
                            </span>
                        </div>
                }



                <BusinessList
                    businessList={this.state.curBusinessList}
                    history={this.props.history}
                />
                <Map
                    center={{
                        lng: 116.402544, lat: 39.928216
                    }}
                    zoom="11"
                    style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0' }}
                    ref={ref => this.map = ref}
                >
                    <NavigationControl />
                </Map>
            </div>
        )
    }
}

//搜索框
class SearchInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputVal: '',
            inputFocus: false,
        }
    }

    componentDidMount() {
        this.input.focus();
    }

    onChangeVal(value) {
        if (value.length < 20) {
            this.setState({
                inputVal: value
            })
        }

    }

    onFocusInput(key, focus) {
        if (key) {
            this.setState({
                inputFocus: true
            })
        } else if (!key && this.state.inputVal === '') {
            this.setState({
                inputFocus: false
            })
        }
        return false
    }

    onSearch() {
        this.props.showInput(false);
        this.props.onSearch(this.state.inputVal);
    }

    render() {
        const { inputFocus, inputVal } = this.state;
        return (
            <div
                style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 999 }}

            >
                <div
                    style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 990 }}
                    onClick={() => this.props.showInput(false)}
                ></div>
                <div
                    className="search-input-wrap"
                    style={{
                        width: '80%', height: '1.9rem', position: 'absolute', top: '1rem',
                        left: '10%', background: '#fff', zIndex: '999', borderRadius: '1rem',
                        boxShadow: '2px 2px 4px rgba(0,0,0,0.4)', zIndex: 999, overflow: 'hidden'
                    }}
                    onClick={() => this.onFocusInput(true, 'focus')}
                >
                    <div
                        className={inputFocus ? "input-tit focus" : 'input-tit'}
                    >
                        <i className="iconfont icon-sousuo"></i>
                    </div>
                    <input
                        onChange={(e) => this.onChangeVal(e.target.value)}
                        onFocus={() => this.onFocusInput(true)}
                        onBlur={() => this.onFocusInput(false)}
                        ref={ref => this.input = ref}
                        value={inputVal}
                        className="box-sizing"
                        style={{ width: '100%', height: '100%', padding: '0 2rem' }}
                    />
                    <div
                        style={{ color: '#444', position: 'absolute', right: '0.5rem', fontSize: '0.7rem', top: '0', height: '100%', lineHeight: '1.9rem' }}
                        onClick={() => this.onSearch()}
                    >
                        搜索
                    </div>
                </div>
            </div>
        )
    }
}

class BusinessList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expand: true
        }
    }

    onClickExpand() {

        this.setState({
            expand: !this.state.expand
        })
    }

    // 距离处理
    _manageDistance(distance) {
        let Distance = '';
        if (distance < 100) {
            Distance = '<' + 100 + 'm';
        } else if (distance < 1000) {
            Distance = Math.round(distance) + 'm';
        } else if (distance >= 1000) {
            if (distance > 20000) {
                Distance = '>' + 20 + 'km';
            } else {
                Distance = parseFloat(distance / 1000).toFixed(1) + 'km';
            }
        }
        return Distance;
    }

    render() {
        const { expand } = this.state;
        const { businessList } = this.props;

        if (businessList.length === 0) {
            return (
                <div
                    className="flex flex-center"
                    style={{ position: 'absolute', height: '2rem', width: '7.5rem', bottom: '1rem', left: '50%', marginLeft: '-3.75rem', zIndex: 990 }}
                >
                    <div
                        style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 880, borderRadius: 3 }}
                    ></div>
                    <span
                        style={{ color: '#fff', position: 'relative', zIndex: 999 }}
                    >暂无商家</span>
                </div>
            )
        }
        return (

            <div
                style={{
                    position: 'absolute', bottom: '0', maxHeight: '50%', overflow: 'hidden',
                    background: '#fff', left: '50%', width: '17.5rem', transform: 'translateX(-50%)',
                    zIndex: 990, height: 'auto'
                }}
            >
                <div
                    className="flex flex-center"
                    style={{ width: '100%', height: '2.2rem', borderBottom: '1px solid rgba(247, 247, 247, 1)' }}
                    onClick={() => this.onClickExpand()}
                >
                    {
                        expand ?
                            <span>收起</span> :
                            <div>查看<span style={{ color: '#FF6633' }}>{businessList.length}</span>家商家</div>
                    }
                    <i className="iconfont icon-jiantoushang1" style={{ transition: 'all .3s', fontSize: 18, transform: expand ? 'rotate(-180deg)' : '' }} />
                </div>

                <div
                    style={{ width: '100%', overflowY: 'scroll', maxHeight: expand ? '15rem' : '0rem', transition: 'all .3s', paddingBottom: expand ? '2.4rem' : '0' }}
                >
                    {
                        businessList.map((item, index) => (
                            <div
                                className="flex box-sizing flex-align-items flex-space-between"
                                style={{ height: '4rem', borderTop: '1px solid rgba(247, 247, 247, 1)', padding: '0.55rem 0.5rem', width: '100%' }}
                                key={index}
                                onClick={() => this.props.history.push('/businessDetail/' + item.shopsId)}
                            >

                                <img src={item.pictureUrl || ImageConfig.empty} alt="" style={{ width: '3.8rem', height: '2.95rem' }} />
                                <div
                                    className="flex flex-col flex-space-between"
                                    style={{ width: '12rem', height: '2.95rem' }}
                                >
                                    <div
                                        style={{ color: '#333', fontSize: '0.75rem' }}
                                    >
                                        {item.shopsName}
                                    </div>
                                    <div
                                        style={{ width: '100%' }}
                                    >
                                        <div
                                            style={{ float: 'left' }}
                                        >
                                            {item.catgName}
                                        </div>


                                        <div
                                            style={{ float: 'right', marginRight: '0.5rem' }}
                                        >
                                            {this._manageDistance(item.distance)}
                                        </div>
                                        <div
                                            style={{ float: 'right', marginRight: '0.5rem', width: '4rem' }}
                                            className="nowrap"
                                        >
                                            {item.shopsAddress}
                                        </div>
                                        <i
                                            style={{ float: 'right', fontSize: 10, color: '#CACACA', marginRight: 3, marginTop: '0.05rem' }}
                                            className="iconfont icon-weizhi"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}