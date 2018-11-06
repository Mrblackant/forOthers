/**
 *  我的车辆
 */

import React, { Component } from 'react';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import ImageConfig from '../../../assets/imageConfig';
import { ListView, List, Button, Modal, Toast } from 'antd-mobile';
import Fetch from "../../../components/fetch";

const ScreenWidth = window.screen.width > 640 ? 640 : window.screen.width;
const Item = List.Item;
class CarList extends Component {
    constructor(props){
        super(props);
        this.state = {
            isDelete: false,
            data: []
        };

        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentWillMount(){
        document.title = '我的车辆';
        document.body.scrollIntoView();
    }

    componentDidMount(){
        this._getCarInfo();
    }

    // 获取车辆信息
    _getCarInfo(){
        Toast.loading('加载中...', 0);
        Fetch.post('/d-app/API/car/carList', {
        }).then(result=> {
            if (result) {
                this.setState({data: result}, ()=> Toast.hide())
            }
        }).catch((error=> {
        }))
    }

    // 删除车辆
    _delete(){
        let { isDelete, data } = this.state;
        isDelete = !isDelete;
        for (let i=0; i<data.length; i++) {
            data[i].isDelete = isDelete;
        }

        this.setState({isDelete: isDelete, data: data});
    }

    // 是否删除
    showModal(vehicleId, index){
        let { data } = this.state;
        Modal.alert(
            <span style={{ color: '#030303', fontSize: 17 }}>删除</span>,
            <span style={{ color: '#030303', fontSize: 13 }}>确定删除？</span>,
            [
                { text: '取消', onPress: () => console.log('cancel'), style: {color: '#909090', fontSize: 17} },
                { text: '确定', onPress: () => {
                        Toast.loading('加载中...', 0);
                        Fetch.post('/d-app/API/car/deleteVehicle', {
                            vehicleId: vehicleId
                        }).then(result=> {
                            data.splice(index, 1);
                            this.setState({data: data, isDelete: data.length > 0 ? this.state.isDelete : false});
                            Toast.info('删除成功', 1);
                        }).catch(error=> {
                            Toast.info('删除失败', 1);
                        })
                    }, style: {color: '#FE7D4D', fontSize: 17}}
            ]
        );
    }

    // 列表项
    _renderRow(rowData, rowId) {
        return(
            <div key={rowId} className="relative">
                <List className="my-list" style={{ marginBottom: 8 }}>
                    <Item
                        arrow="horizontal"
                        multipleLine
                        extra={<div style={{ color: '#444444', fontSize: 18 }}>{rowData.oilModel}</div>}
                        onClick={() => {
                            localStorage.setItem('vehicleInfo', JSON.stringify(rowData));

                            this.props.history.push('/carEdit');
                        }}
                    >
                        <div
                            className="flex flex-align-items flex-dir"
                            style={{ height: 75 }}
                        >
                            <div
                                style={{ width: 60, height: 60, borderRadius: 5, marginRight: 16 }}
                                className="flex flex-center border"
                            >
                                <img
                                    src={rowData.vehicleImg}
                                    style={{width: 50, height: 50, borderRadius: 5}}
                                    alt=" "
                                />
                            </div>

                            <div>
                                <div style={{ fontSize: 14, color: '#444444' }}>
                                    {rowData.licensePlate}
                                </div>

                                <div style={{ fontSize: 14, color: '#909090' }}>
                                    {rowData.vehicleBrand}
                                </div>
                            </div>
                        </div>
                    </Item>
                </List>

                {
                    !rowData.isDelete ? null :
                        <div className="absolute" style={{ height: 92.95, width: '100%', top: 0 }}>
                            <div
                                onClick={()=> this.showModal(rowData.vehicleId, rowId)}
                                style={{ height: 92.95, right: 0, top: 0, width: '20%' }}
                                className="absolute car-list-show-delete flex flex-center"
                            >
                                <div className="iconfont icon-shanchu" style={{fontSize: 20, color: '#FE7D4D'}}/>
                            </div>
                        </div>
                }
            </div>
        )
    }

    render(){
        // 数据清除
        if (localStorage.getItem('vehicleInfo')) localStorage.removeItem('vehicleInfo');

        let {isDelete, data} = this.state;
        const totalHeight = document.documentElement.clientHeight - (data.length > 0 ? 148 : 88);

        return(
            <div className="relative" style={{ height: '100%' }}>
                {
                    data.length > 0 ?
                        <ListView
                            style={{height: totalHeight, paddingTop: 8}}
                            dataSource={this.dataSource.cloneWithRows(this.state.data)}
                            renderRow={(rowData, sectionId, rowId)=>this._renderRow(rowData, rowId)}
                            pageSize={7}
                            renderBodyComponent={()=>(<div/>)}
                            onScroll={() => console.log('scroll')}
                            scrollRenderAheadDistance={500}
                            onEndReachedThreshold={10}
                            onEndReached={()=> console.log(111)}
                        />
                        :
                        <div style={{ width: '100%', height: '100%' }} className="flex-center flex">
                            <img style={{width: ScreenWidth / 2, height: ScreenWidth / 2}} src={ImageConfig.noData} alt=" "/>
                        </div>
                }

                {
                    isDelete ? null :
                        <div
                            className="padding-horizontal fixed"
                            style={{ bottom: data.length > 0 ? 84 : 20, left: 0, width: '100%' }}
                        >
                            <Button
                                onClick={() => this.props.history.push('/carEdit')}
                                className="linear-gradient car-list-delete"
                                style={{ fontSize: 14 }}
                                icon={<div className="iconfont icon-zengjia1" style={{ fontSize: 18 }} />}
                                activeStyle={{ background: '#FE7F4F' }}
                            >
                                新增车辆
                            </Button>
                        </div>
                }

                {
                    data.length > 0 ?
                        <div
                            className="padding-horizontal fixed"
                            style={{ bottom: 20, left: 0, width: '100%' }}
                            onClick={()=> this._delete()}
                        >
                            <Button
                                className="fuel-card-btn"
                                style={{ fontSize: 14 }}
                                icon={isDelete ? null : <div className="iconfont icon-shanchu" style={{ fontSize: 18 }} />}
                                activeStyle={{ backgroundColor: '#F7F7F7' }}
                            >
                                { isDelete ? '取消' : '删除车辆' }
                            </Button>
                        </div>
                        : null
                }
            </div>
        )
    }
}

export default CarList;