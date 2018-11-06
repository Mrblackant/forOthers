import React from 'react';
import { Toast, Modal } from 'antd-mobile';

import ImageConfig from '../../assets/imageConfig';
import LoadMore from '../../components/loadMore';
import Swiper from '../../components/swiper';
import Fetch from '../../components/fetch';
import WxApi from '../../components/wxApi';
import PromptModal from '../../components/promptModal';

import '../../assets/css/business.css';

const totalHeight = document.documentElement.clientHeight;

//排序选择项
const selectBtnList = [
    {
        title: '全部',
        border: true,
        id: 0
    },
    {
        title: '全城',
        border: true,
        id: 1
    },
    {
        title: '离我最近',
        border: false,
        id: 2
    },
]

//离我最近
const sortList = [
    {
        title: '离我最近',
        id: 1
    },
    {
        title: '最新发布',
        id: 2
    },
    {
        title: '价格最高',
        id: 3
    },
    {
        title: '价格最低',
        id: 4
    }
]

export default class Business extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',     //搜索框内容
            bannerList: [],
            curCity: '北京市',    //当前选择城市
            lat: 39.91667,
            lng: 116.41667,
            businessList: [],
            selectTab: {},
            catgCode: '',
            shopsRegion: '',
            sort: 1,
            loadState: 1,
            province: ''
        }
        this.page = 1;
        this.pageSize = 5;

    }

    componentWillMount() {

        document.title = '商城';
    }

    componentDidMount() {

        const businessStorage = JSON.parse(localStorage.getItem('business'));
        const cityInfoSession = sessionStorage.cityInfo;
        const cityInfoLoacl = JSON.parse(localStorage.getItem('cityInfo'));
      

        //判断是否有输入框搜索

        if (businessStorage && businessStorage.search !== '' && this._hasSession() ) {
            sessionStorage.removeItem('business');
            const cityInfo = JSON.parse(cityInfoSession);
            this.setState({
                search: businessStorage.search,
                curCity: cityInfo.curCity,
                lat: cityInfo.dimension,
                lng: cityInfo.longitude
            }, () => {
                this._getCatsShopsRegions();
                this._getBusinessList(1);
                businessStorage.search = '';
                localStorage.setItem('business', JSON.stringify(businessStorage));
            })
        }
        //手动选择城市
        else if (businessStorage && businessStorage.curCity !== '' && this._hasSession()) {
            sessionStorage.removeItem('business');
            const cityInfo = JSON.parse(cityInfoSession);
            this.setState({
                curCity: businessStorage.curCity,
                lat: cityInfo.dimension,
                lng: cityInfo.longitude,
                province: cityInfo.province
            }, () => {
                this._changeStorage(this.state.curCity, this.state.lng, this.state.lat, cityInfo.province, true);
                businessStorage.curCity = '';
                localStorage.business = JSON.stringify(businessStorage);
            })
        }

        //判断是否有sessionStorage
        else if (this._hasSession()) {
            let cityInfo = JSON.parse(cityInfoSession);
            this.setState({
                lat: cityInfo.dimension,
                lng: cityInfo.longitude,
                curCity: cityInfo.curCity
            }, () => {
                this._getBusinessList(1, true);
                this._getCatsShopsRegions();
                this._getRecommendShops();
            })
        } else {
            //若没有sessionStorage，获取是否有loaclStorage
         
            if (this._hasLocal()) {
                this.setState({
                    lat: cityInfoLoacl.dimension,
                    lng: cityInfoLoacl.longitude,
                    curCity: cityInfoLoacl.curCity
                }, () => {
                    this._getBusinessList(1);
                    this._getCatsShopsRegions();
                    this._getRecommendShops();
                    this._getPosition(true);
                })

            } else {
                //若没有loaclStorage则使用默认地址信息
                this._getBusinessList(1);
                this._getRecommendShops();
                this._getCatsShopsRegions();
                this._getPosition(false);
            }
        }

        window.onscroll = () => {
            if (this._getScrollTop() + this._getClientHeight() >= this._getScrollHeight() && this._getScrollTop() !== 0) {
                if (this.state.loadState !== 3) {
                    this._getBusinessList(2);
                }
            }
        }
    }

    componentWillUnmount() {
        window.onscroll = null;
    }

    //判断是否有localStorage
    _hasLocal(){
        const cityInfoLocal = localStorage.cityInfo;
        if (cityInfoLocal) {
            const cityInfo = JSON.parse(cityInfoLocal)
            if (cityInfo.curCity !== '' && cityInfo.dimension !== '' && cityInfo.longitude !== '') {
                return true
            }
        }
        return false
    }

    //判断是否有sessionStorage
    _hasSession(){
        const cityInfoSession = sessionStorage.cityInfo;
        if(cityInfoSession){
            const cityInfo = JSON.parse( cityInfoSession)
            if(cityInfo.curCity !== '' && cityInfo.dimension !== '' && cityInfo.longitude !== ''){
                return true
            }
        } 
        return false
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

    //获取当前位置
    _getPosition(key) {
      
        const geoc = new window.BMap.Geocoder();
        WxApi.config(encodeURIComponent(window.location.href.split('#')[0]));
        setTimeout(() => {
            WxApi.getLocation().then(res => {
               
                const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。

                //获取经纬度对应的城市名
                const point = new window.BMap.Point(longitude, latitude);
                geoc.getLocation(point, (rs) => {

                    const addComp = rs.addressComponents;

                    if (addComp.city !== this.state.curCity) {
                        let content = `检测到您在${addComp.city}，是否切换？`;
                        let cityInfo1 = {
                            city: addComp.city,
                            longitude,
                            latitude,
                            province: addComp.province,
                            key: true
                        };
                        let cityInfo2 = {
                            city: this.state.curCity,
                            longitude,
                            latitude,
                            province: addComp.province,
                            key: false
                        };
                        this.modal._showModal(true, content, cityInfo1, cityInfo2);//打开城市定位弹框
                    } else {
                        this._changeStorage(this.state.curCity, longitude, latitude, addComp.province, false);
                    }
                });
            }).catch(err => {
                console.log('微信config失败');
               
                this._changeStorage(this.state.curCity, this.state.lng, this.state.lat, '北京市', false);
            })
        }, 1000);

    }


    //选择是否切换城市
    _changeCity(city, longitude, latitude, province, key) {
        this._changeStorage(city, longitude, latitude, province, key)
    }

    //更改Storage
    _changeStorage(city, lng, lat, province, key) {
        console.log(arguments)
        let cityInfo = {
            curCity: city,
            dimension: lat,
            longitude: lng,
            province
        }
        localStorage.cityInfo = JSON.stringify(cityInfo);
        sessionStorage.cityInfo = JSON.stringify(cityInfo);
        if (city) {
            this.setState({
                lat,
                lng,
                curCity: city
            }, () => {
                if (key) {
                    console.log('cs')
                    this._getCatsShopsRegions();
                    this._getBusinessList(1);
                    this._getRecommendShops();
                }
            })
        }
    }

    //在sessionStorage中存数据
    _toSessionStorage(key, value) {
        let businessSession = sessionStorage.business;
        if (businessSession) {
            businessSession[key] = value;
        } else {
            businessSession = {};
            businessSession[key] = value;
        }
        sessionStorage.setItem('business', JSON.stringify(businessSession));
    }

    //获取类别
    _getCatsShopsRegions() {
        Fetch.post('/d-app/API/bs/catsShopsRegion/getCatsShopsRegions', {
            shopsCity: this.state.curCity
        }).then(res => {
            if (res) {

                this.setState({
                    selectTab: res
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }


    //获取商家列表
    _getBusinessList(type, storage) {
        const businessSession = sessionStorage.business;
        const businessLocal = localStorage.business;
        const { lat, lng, curCity, catgCode, search, shopsRegion, sort } = this.state;
        let isStorage = true;
        let hasBusiness = true;
        if (type === 1) {
            this.page = 1;
        } else {
            this.page++;
            
        }
        if (businessLocal) {
            if (JSON.parse(businessLocal).curCity || JSON.parse(businessLocal).search) {
                hasBusiness = false;
            }
        } else {
            hasBusiness = true;
        }
        if (hasBusiness && storage){
            console.log(1)
            if (businessSession && type === 1 ){
                this.setState({
                    businessList: JSON.parse(businessSession)
                })
                return ;
            } else if (!businessSession && type === 1 ){
                isStorage = true;
            }
        } 

        this.setState({
            loadState: 2
        })

        Toast.loading('加载中...', 1.5);
        console.log('getlist')
        Fetch.post('d-app/API/bs/shopsInfo/findShopInfoPage', {
            catgCode: catgCode === '全部' || !catgCode ? '' : catgCode,
            dimension: lat,
            longitude: lng,
            page: this.page,
            pageSize: this.pageSize,
            searchContent: search,
            shopsCity: curCity,
            shopsRegion: shopsRegion === '全城' ? '' : shopsRegion,
            sort
        }).then(res => {
            Toast.hide();
            console.log(res)
            if (res) {

                if (storage) {
                    sessionStorage.setItem('business', JSON.stringify(res));
                }
                //判断是否请求的是第一个，替换内容或增加
                if (this.page === 1) {
                    this.setState({
                        businessList: res
                    })

                } else {
                    this.state.businessList.push(...res);
                    this.setState({
                        businessList: this.state.businessList
                    })
                }
                if (res.length < this.pageSize) {
                    this.setState({ loadState: 3 });
                } else {
                    this.setState({ loadState: 1 });
                }
            } else {
                this.setState({ loadState: 3 });
            }
        }).catch(err => {
            console.log(err)
        })
    }

    //获取推荐商家
    _getRecommendShops() {

        const { catgCode, lng, lat, curCity } = this.state;
        console.log(catgCode, curCity);
        Fetch.post('d-app/API/bs/shopsInfo/recommendShops', {
            catgCode,
            dimension: lat.toString(10),
            longitude: lng.toString(10),
            shopsCity: curCity
        }).then(res => {
            console.log(res)
            if (res) {
                this.setState({
                    bannerList: res
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    //更改tab重新获取数据
    _changeTab(id, str, key) {
        if (id === 0) {
            this.setState({
                catgCode: key
            }, () => {
                this._getRecommendShops();
                this._getBusinessList(1);
            })
        }
        if (id === 1) {
            this.setState({
                shopsRegion: key
            }, () => {
                this._getBusinessList(1);
            })

        }
        if (id === 2) {
            this.setState({
                sort: key
            }, () => {
                this._getBusinessList(1);
            })
        }
    }

    //更改modal状态
    _changeModal(id, source) {
        if (source === 'modal') {
            this.selectTab.onSelect(id)
        } else {
            this.selectModal.onChangeModal(id)
        }
    }

    render() {
        const { bannerList, businessList, search } = this.state;
        return (
            <div
                className="container-business"
            >
                <PromptModal
                    ref={ref => this.modal = ref}
                    title="切换"
                    ConfirmCancel={(city, longitude, latitude, province, key) => this._changeCity(city, longitude, latitude, province, key)}
                />
                <div
                    style={{ position: 'fixed', left: '50%', top: 0, width: '100%', height: 'auto', zIndex: '999', maxWidth: 640, transform: 'translateX(-50%)' }}
                >

                    <Header
                        history={this.props.history}
                        curCity={this.state.curCity}
                        search={this.state.search}
                    />
                    <SelectTab
                        changeModal={(type) => this._changeModal(type)}
                        changeTab={(id, str, key) => this._changeTab(id, str, key)}
                        dataList={this.state.selectTab}
                        ref={ref => this.selectTab = ref}
                    />
                </div>
                <div
                    style={{ height: search ? '4.6rem' : '4rem' }}
                />

                {
                    search || bannerList.length === 0 ? null :
                        <Banner
                            bannerList={bannerList}
                            history={this.props.history}
                        />
                }
                <BusinessList
                    history={this.props.history}
                    businessList={businessList}
                    hasBanner={search}
                    loadState={this.state.loadState}
                />

                {/*/!*是否获取当前定位模态框*!/*/}
                {/*<PromptModal*/}
                {/*ref={ref => this.promptModal = ref}*/}
                {/*title={'切换城市'}*/}
                {/*ConfirmCancel = {() => this._confirmCancel()}*/}
                {/*/>*/}
            </div>
        )
    }
}

//头部
class Header extends React.Component {

    render() {

        return (
            <header
                className="flex flex-justify-content flex-align-items"
                style={{ width: '100%', height: '2.2rem', background: '#fff' }}
            >
                <div
                    className="flex flex-align-items"
                    style={{ marginRight: '0.5rem' }}
                    onClick={() => { this.props.history.push('/selectCity') }}
                >
                    <span
                        style={{ overflow: 'hidden', width: '2rem', height: '1rem', lineHeight: '1rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center', }}
                    >{this.props.curCity}</span>
                    <i
                        className="iconfont icon-jiantouxia1"
                        style={{ color: '#FE7C4C' }}
                    />
                </div>
                <div
                    className="flex flex-justify-content flex-align-items"
                    style={{ width: '15rem', height: '1.5rem', borderRadius: '0.75rem', background: 'rgba(242,242,242,1)' }}
                    onClick={() => this.props.history.push('/search')}
                >
                    <i
                        className="iconfont icon-sousuo"
                        style={{ color: 'rgba(144,144,144,1)', fontSize: '0.7rem' }}
                    ></i>
                    <span
                        style={{ color: 'rgba(144,144,144,1)', fontSize: '0.6rem', marginLeft: '0.2rem' }}
                    >{this.props.search ? this.props.search : '请输入商家名'}</span>
                </div>
            </header>
        )
    }
}

//选择标签
class SelectTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            acBtn: -1,     //选择的按钮
            allTitle: '全部',
            cityTitle: '全城',
            sortTitle: '离我最近'
        }

    }

    onSelect(id) {
        if (id !== this.state.acBtn) {
            this.setState({
                acBtn: id
            })
        } else {
            this.setState({
                acBtn: -1
            })
        }
    }

    _curTitle(str) {
        if (str === '全部') {
            return this.state.allTitle
        }
        if (str === '全城') {
            return this.state.cityTitle
        }
        if (str === '离我最近') {
            return this.state.sortTitle
        }
    }

    _changeTitle(id, str, key) {
        if (id === 0) {
            this.setState({
                allTitle: str
            })
        }
        if (id === 1) {
            this.setState({
                cityTitle: str
            })
        }
        if (id === 2) {
            this.setState({
                sortTitle: str
            })
        }

        this.props.changeTab(id, str, key);
    }

    render() {
        const { acBtn } = this.state;
        const { dataList } = this.props;
        return (
            <div
                className="select-tab flex box-sizing"
            >
                {
                    selectBtnList.map((item, index) => (
                        <div
                            key={index}
                            className={acBtn === item.id ? "select-btn ac" : 'select-btn'}
                            style={item.border ? { borderRight: '1px solid #E5E5E5' } : null}
                            onClick={() => this.onSelect(item.id)}
                        >
                            <span>{this._curTitle(item.title)}</span>
                            <i
                                className="iconfont icon-xiangxiajiantou"
                                style={{ fontSize: 10 }}
                            />
                        </div>
                    ))
                }
                <SelectModal
                    acBtn={acBtn}
                    dataList={dataList}
                    onSelect={(id) => this.onSelect(id)}
                    changeTitle={(id, str, key) => this._changeTitle(id, str, key)}
                />
            </div>
        )
    }
}

//选择跳出模态框
class SelectModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            curAllItem: 0,
            curCityItem: 0,
            curSortItem: 0
        }
        this.tabFirst = true;
    }

    onChangeModal(id) {
        this.props.onSelect(id)
    }

    onSelectItem(id, type, str, key) {
        this.props.changeTitle(type, str, key);
        if (type === 0) {
            this.setState({
                curAllItem: id
            })
        } else if (type === 1) {
            this.setState({
                curCityItem: id
            })
        } else if (type === 2) {
            this.setState({
                curSortItem: id
            })
        }
    }

    //判断当前item是否选中
    _isActive(acBtn, id) {
        const { curAllItem, curCityItem, curSortItem } = this.state;
        if (acBtn === 0 && id === curAllItem) {
            return true
        }
        if (acBtn === 1 && id === curCityItem) {
            return true
        }
        if (acBtn === 2 && id === curSortItem) {
            return true;
        }
        return false;
    }

    //当前显示的列表值
    _curData(key) {
        let catgs = this.props.dataList.catgs || [];
        let shopsRegions = this.props.dataList.shopsRegions || [];
        let catgsNum = 0;
        let shopsRegionsNum = 0;

        if (key && this.tabFirst) {
            catgs.forEach((i) => {
                catgsNum += i.num;
            })
            shopsRegions.forEach((i) => {
                shopsRegionsNum += i.num;
            })
            catgs.unshift({ catgCode: '', catgName: '全部', num: catgsNum });
            shopsRegions.unshift({ shopsRegion: '全城', num: shopsRegionsNum });
            this.tabFirst = false;
        }

        switch (this.props.acBtn) {
            case 0:
                return catgs;
            case 1:
                return shopsRegions;
            case 2:
                return sortList;
            default:
                break;
        }
    }

    //rem转换px
    _remToPx(rem) {
        const cw = document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth;
        return rem * (cw / 375 * 20)
    }

    render() {

        const { acBtn } = this.props;

        return (
            <div
                className={acBtn !== -1 ? "select-modal show" : 'select-modal'}
                style={{ height: acBtn !== -1 ? totalHeight - this._remToPx(4) : 0 }}
                onClick={() => this.onChangeModal(-1)}
            >
                <div
                    className="modal-con"
                >
                    {
                        this._curData() && this._curData(1).length > 0 ?

                            this._curData(1).map((item, index) => (
                                <div
                                    className="select-item flex flex-align-items"
                                    onClick={() => this.onSelectItem(index, acBtn, item.catgName || item.shopsRegion || item.title, item.catgCode || item.shopsRegion || item.id)}
                                    key={index}
                                >
                                    <i
                                        className={this._isActive(acBtn, index) ? 'iconfont icon-check' : ''}
                                        style={{ width: '0.6rem', color: '#FE7C4C', marginLeft: '2rem' }}
                                    ></i>
                                    <span
                                        style={{ fontSize: '0.75rem', marginLeft: '0.6rem', color: this._isActive(acBtn, index) ? '#FE7C4C' : '#444', width: '4rem' }}
                                    >
                                        {item.catgName || item.shopsRegion || item.title}
                                    </span>
                                    {
                                        item.num ?
                                            <span
                                                style={{ fontSize: '0.75rem', marginLeft: '8rem', color: this._isActive(acBtn, index) ? '#FE7C4C' : '#444' }}
                                            >
                                                {item.num}
                                            </span> : null
                                    }
                                </div>
                            ))
                            : null
                    }
                </div>
            </div>
        )
    }
}

//轮播图
class Banner extends React.Component {

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
        return (
            <Swiper
                style={{ width: '100%', height: '7rem' }}
                itemWidth={12.85}
                infinite={true}
                auto={false}
            >
                {
                    this.props.bannerList.length === 0 ?
                        <div
                            style={{ width: '100%', height: '100%' }}
                        >
                            <img src={ImageConfig.empty} alt="" style={{ width: '100%', height: '100%' }} />
                        </div> :
                        this.props.bannerList.map((item, index) => (
                            <div
                                key={index}
                                style={{ width: '12.25rem', height: '5.8rem', marginLeft: '0.6rem', boxShadow: '0px 2px 2px 0px rgba(0,0,0,0.11)', borderRadius: 3, overflow: 'hidden' }}
                                onClick={() => this.props.history.push('/businessDetail/' + item.shopsId)}
                            >
                                <div
                                    className="flex flex-align-items"
                                    style={{ width: '12.25rem', height: '100%', background: '#fff' }}
                                >
                                    <div
                                        style={{ position: 'relative', width: '5.4rem', height: '4.6rem', marginLeft: '0.5rem' }}
                                    >
                                        <img src={item.pictureUrl ? item.pictureUrl : ImageConfig.empty} alt="" style={{ width: '100%', height: '100%' }} />
                                        <span
                                            className="flex flex-center"
                                            style={{ position: 'absolute', bottom: '0', left: '0', minWidth: '2.2rem', height: '0.85rem', background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: '0.6rem' }}
                                        >
                                            {this._manageDistance(item.distance)}
                                        </span>
                                    </div>
                                    <div
                                        className="flex flex-space-between"
                                        style={{ flexDirection: 'column', padding: '0.75rem 0', height: '4.6rem', marginLeft: '0.5rem' }}
                                    >
                                        <span
                                            style={{ color: '#333', fontSize: '0.9rem', fontWeight: 'bold' }}
                                        >{item.shopsName}</span>
                                        <div
                                            className='flex flex-align-items'
                                            style={{ color: '#FF8D63', fontSize: '0.9rem', width: '100%', height: '2rem', marginTop: '0.8rem' }}
                                        >
                                            <img src={ImageConfig.tb} alt="" style={{ width: 14, marginRight: 5, height: 14 }} />
                                            {
                                                item.lowPurchase !== 0 ? [
                                                    <span key='1'>{item.lowPurchase}</span>,
                                                    <span
                                                        style={{ fontSize: '0.7rem', marginTop: '0.3rem' }}
                                                        key='2'
                                                    >起</span>
                                                ] :
                                                    <span
                                                        style={{ lineHeight: '1rem', marginTop: '0.3rem' }}
                                                    >***</span>
                                            }</div>
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </Swiper>
        )
    }
}

//商家列表
class BusinessList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expand: []
        }
    }



    componentWillReceiveProps() {
        const itemLength = this.props.businessList.length;
        let arr = new Array(itemLength), 
            i = arr.length;
        while (i--) { arr[i] = false; }
        this.setState({
            expand: arr
        })
    }

    //是否展开
    onExpand(id) {
        const expand = this.state.expand;
        expand[id] = !expand[id];
        this.setState({
            expand
        })
    }

    //rem转换px
    _remToPx(rem) {
        const cw = document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth;
        return rem * (cw / 375 * 20)
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


    // 列表项
    _renderRow(rowData, rowId) {
        return (
            <div
                key={rowId}
                className="business-item"
            >
                {/* 商家头部 */}
                <div
                    className="business-item-top box-sizing flex flex-space-between"
                    onClick={() => this.props.history.push('/businessDetail/' + rowData.shopsId)}
                >
                    <img
                        src={rowData.pictureUrl ? rowData.pictureUrl : ImageConfig.empty}
                        style={{ width: '4.4rem', height: '3.5rem' }}
                        alt=""
                    />
                    <div
                        className="flex flex-space-between"
                        style={{ width: '12.45rem', height: '3.5rem', flexDirection: 'column' }}
                    >
                        <span
                            style={{ color: '#333', fontSize: 16, textOverflow: 'ellipsis', width: '9rem', display: 'block', overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                            {rowData.shopsName}
                        </span>
                        <div
                            className="flex flex-space-between"
                            style={{ width: '100%' }}
                        >
                            <span
                                style={{ color: '#666', fontSize: 13 }}
                            >{rowData.catgName}</span>
                            <span
                                style={{ color: '#666', fontSize: 13 }}
                            >
                                {this._manageDistance(rowData.distance)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 商家服务列表 */}
                {
                    [rowData.prods.map((item, index) => {
                        if (index < 2 || this.state.expand[rowId]) {
                            return (
                                <div
                                    className="business-service-item flex flex-space-between"
                                    key={index}
                                    onClick={() => this.props.history.push('/goodsDetail/' + item.prodCode)}
                                >
                                    <div
                                        className="flex flex-align-items"
                                        style={{ width: '100%' }}
                                    >
                                        <div
                                            className='flex flex-space-between flex-align-items'
                                            style={{
                                                color: '#FD9A75', fontSize: '0.9rem',width:'35%',
                                                justifyContent: 'flex-end', height: '1rem', lineHeight: '0.9rem',
                                            }}
                                        >
                                            <img src={ImageConfig.tb} alt="" style={{ width: '0.7rem', marginRight: 5, height: '0.7rem' }} />
                                            <div>
                                                {item.prodPrice}
                                            </div>
                                        </div>
                                        <div
                                            className='nowrap'
                                            style={{
                                                width:'60%',color: '#6e6e6e', fontSize: '0.65rem',
                                                marginLeft: '1.5rem', height: '1rem',
                                                lineHeight: '0.9rem'
                                            }}
                                        >
                                            {item.prodName}
                                        </div>
                                    </div>
                                    <div
                                        style={{ width: '100%', textAlign: 'right', color: '#6e6e6e', fontSize: 12 }}
                                    >
                                        {'已售' + item.selledNum}
                                    </div>
                                </div>
                            )
                        }
                    }),
                    rowData.prods.length > 2 ?
                        <div
                            key={-1}
                        >
                            <div
                                className="flex flex-center"
                                style={{ width: '100%', height: '1.9rem', color: '#FE7C4C', fontSize: '0.7rem' }}
                                onClick={() => this.onExpand(rowId)}
                            >

                                <span>{
                                    this.state.expand[rowId] ? '收起' : `查看其他${rowData.prods.length - 2}项服务`
                                }</span>

                                {
                                    this.state.expand[rowId] ?
                                        <i
                                            className='iconfont icon-jiantoushang1'
                                            style={{ fontSize: 14, fontWeight: 'bold', color: '#FE7C4C' }}
                                        />
                                        :
                                        <i
                                            className='iconfont icon-jiantouxia1'
                                            style={{ fontSize: 14, fontWeight: 'bold', color: '#FE7C4C' }}
                                        />
                                }
                            </div>
                        </div>
                        : null
                    ]
                }
            </div>
        )
    }

    render() {
        if (this.props.businessList.length === 0) {
            return (
                <div
                    className="flex flex-center"
                    style={{ width: '100%', textAlign: 'center', height: totalHeight - this._remToPx(11) }}
                >
                    <span
                        style={{ marginTop: -60 }}
                    >暂无商家信息~</span>
                </div>
            )
        }
        return (
            <div
                style={{ width: '100%', minHeight: this.props.loadState === 3 ? totalHeight - this._remToPx(15) : totalHeight - this._remToPx(13) }}
            >
                {
                    [
                        this.props.businessList.map((item, index) => (
                            this._renderRow(item, index)
                        )),
                        <LoadMore
                            key={-1}
                            loadState={this.props.loadState}
                        />
                    ]
                }
            </div>
        )
    }
}
