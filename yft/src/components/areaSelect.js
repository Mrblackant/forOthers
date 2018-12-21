/**
 * 地区选择
 */
import React, { Component } from 'react';
import { PickerView, Toast } from 'antd-mobile';

import Fetch from './fetch';

import '../assets/css/common.css';
import '../assets/css/mall.css';

export default class AreaSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grade: 1,       //1 - 省级，2 - 市级，3 - 区级
            provinceList: [],   //省列表
            cityList: [],       //市列表
            countyList: [],       //区列表
            acProvinceId: -1,       //选中的省id
            acCityId: -1,       //选中的市id
            acCountyId: -1,        //选中的区id
            acProvince: '',
            acCity: '',
            acCounty: ''
        }

        this.acProvince = '';
        this.acCity = '';
        this.acCounty = '';
        this.acProvinceId = -1;
        this.acCityId = -1;
        this.acCountyId = -1;
    }

    componentDidMount() {
        const { grade } = this.state;

        if (grade === 1) {
            this._getAreaData( 0, 2 );
        }
    }

    //点击确定选择地区
    onSelectArea() {
        const key = this.state.grade;
        switch (key) {
            case 1:
                if (!this.acProvince) {
                    this.acProvince = this.state.provinceList[0][0].label;
                    let id = this.state.provinceList[0][0].value.split(',')[0]
                    this.acProvinceId = id;
                }
                this.setState({
                    acProvinceId: this.acProvinceId,
                    acProvince: this.acProvince,
                    grade: 2
                }, () => this._getAreaData(this.state.acProvinceId, 3))
                break;
            case 2:
                if (!this.acCity) {
                    this.acCity = this.state.cityList[0][0].label;
                    let id = this.state.cityList[0][0].value.split(',')[0]
                    this.acCityId = id;
                }

                this.setState({
                    acCityId: this.acCityId,
                    acCity: this.acCity,
                    grade: 3
                }, () => this._getAreaData(this.state.acCityId, 4))
                break;
            case 3:
                if (!this.acCounty) {
                    this.acCounty = this.state.countyList[0][0].label;
                    let id = this.state.countyList[0][0].value.split(',')[0]
                    this.acCountyId = id;
                }
                console.log('============================')
                console.log(this.acCounty)
                this.setState({
                    acCountyId: this.acCountyId,
                    acCounty: this.acCounty,
                }, () =>this._completeSelect())
                break;
            default:
                break;
        }
    }
    //改变选择的级别
    onChangeGrade(grade){
        if(grade === 1){
            this.acProvince = '';
            this.acCity = '';
            this.acCounty = '';
            this.setState({
                grade,     
                cityList: [],     
                countyList: [],   
                acProvinceId: -1, 
                acCityId: -1,     
                acCountyId: -1,   
                acProvince: '',
                acCity: '',
                acCounty: ''
            })
        } else if(grade === 2){
            this.acCity = '';
            this.acCounty = '';
            this.setState({
                grade,
                countyList: [],
                acCityId: -1,
                acCountyId: -1,
                acCity: '',
                acCounty: ''
            })
        } else {
            this.acCounty = '';
            this.setState({
                grade,
                acCountyId: -1,
                acCounty: ''
            }) 
        }
    }

    //滚动改变值
    onChangeArea(val, key) {
        switch (key) {
            case 'province':
                this.acProvinceId = parseInt(val[0].split(',')[0], 10);
                this.acProvince = val[0].split(',')[1]

                break;
            case 'city':
                this.acCityId = parseInt(val[0].split(',')[0], 10);
                this.acCity = val[0].split(',')[1];

                break;
            case 'county':
            
                this.acCountyId = parseInt(val[0].split(',')[0], 10);
                this.acCounty = val[0].split(',')[1]
                console.log(this.acCounty)
                break;
            default:
                break;
        }
    }
    //选择完成
    _completeSelect(){
        const province = {
            title: this.state.acProvince,
            id: this.state.acProvinceId
        };
        const city = {
            title: this.state.acCity,
            id: this.state.acCityId
        };
        const county = {
            title: this.state.acCounty,
            id: this.state.acCountyId
        }; 
        console.log(this.state.acCounty);
        this.props.callBack(province, city, county);
    }

    _getAreaData(id, type) {
        Toast.loading('加载中...', 0);
    /*  parentId	上级Id	   number	默认0
        regionType	地区类型	number	2 - 省级，3 - 市级，4 - 区级 */
        console.log('调接口');
        console.log(id);
        console.log(type);
        Fetch.post('d-app/API/region/findRegionList', {
            parentId: id,
            regionType: type
        }).then(res => {
            console.log(res)
            if (res) {
                if (type === 2) {
                    let province = [];
                    province[0] = [];
                    res.forEach((item) => {
                        province[0].push({
                            label: item.regionName,
                            value: item.regionId + ',' + item.regionName
                        })
                    })
                    this.setState({
                        provinceList: province
                    })
                } else if (type === 3) {
                    let city = [];
                    city[0] = [];
                    res.forEach((item) => {
                        city[0].push({
                            label: item.regionName,
                            value: item.regionId + ',' + item.regionName
                        })
                    })
                    this.setState({
                        cityList: city
                    })
                } else if (type === 4) {
                    let county = [];
                    county[0] = [];
                    res.forEach((item) => {
                        county[0].push({
                            label: item.regionName,
                            value: item.regionId + ',' + item.regionName
                        })
                    })
                    this.setState({
                        countyList: county
                    })
                }
            }
            Toast.hide();
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        const { grade, provinceList, cityList, countyList, acCity, acProvince, acCounty } = this.state;
        const conList = [
            {
                data: provinceList,
                grade: 1,
                key: 'province'
            },{
                data: cityList,
                grade: 2,
                key: 'city'
            },{
                data: countyList,
                grade: 3,
                key: 'county'
            }
        ]
        return (
            <div className="container-areaSelect">
                {/* 选择头部 */}
                <div className="areaSelect-top box-sizing flex flex-space-between flex-align-items">
                    <div style={{ height: '100%' }} className="flex">
                        <div
                            className={'acArea nowrap block' + (grade === 1 ? ' ac' : '')}
                            onClick={() =>this.onChangeGrade(1)}
                        >
                            {
                                acProvince === '' ? '请选择' : acProvince
                            }
                        </div>
                        <div
                            className={'acArea nowrap' + (grade === 2 ? ' ac' : '') + ( grade >= 2 ? ' block' : '')}
                            onClick={() => this.onChangeGrade(2)}
                        >
                            {
                                acCity === '' ? '请选择' : acCity
                            }
                        </div>
                        <div
                            className={'acArea nowrap' + (grade === 3 ? ' ac block' : '') }
                            onClick={() => this.onChangeGrade(3)}
                        >
                            {
                                acCounty === '' ? '请选择' : acCounty
                            }
                        </div>
                    </div>
                    <div
                        style={{ fontSize: '0.8rem', color: '#fe7c4c' }}
                        onClick={() => this.onSelectArea()}
                    >确定</div>
                </div>
                {
                    conList.map( (item, index) =>(
                        <div
                            className="areaSelect-con box-sizing"
                            style={{ display: grade === item.grade ? 'block' : 'none' }}
                            key={index}
                        >
                            <PickerView
                                data={item.data}
                                cascade={false}
                                style={{ width: '100%', height: '12rem' }}
                                onChange={(val) => this.onChangeArea(val, item.key)}
                            />
                        </div>
                    ))
                }




            </div>
        )
    }
}