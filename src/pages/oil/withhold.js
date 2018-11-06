/**
 *  我的代扣
 */
import React, { Component } from 'react';
import {Modal, ListView, Toast} from "antd-mobile/lib/index";

import Fetch from '../../components/fetch';
import ImageConfig from "../../assets/imageConfig";

import '../../assets/css/common.css';
import '../../assets/css/personal.css';
const ScreenWidth = window.screen.width > 640 ? 640 : window.screen.width;
class Withhold extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
            ],
            loadState: 1
        };
        this.page = 1;
        this.pageSize = 10;
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentWillMount() {
        document.title = '我的代扣';
        document.body.scrollIntoView();
    }

    componentDidMount(){
        this._getData(1);
    }

    _getData(type){
        if(type === 1){
            this.page = 1;
        } else {
            this.page++;
        }
        this.setState({
            loadState: 2
        })
        Fetch.post('/d-app/API/bm/OilReplaceRecharge/findList', {

        }).then( res =>{
            console.log(res);
            if(res && type === 1){
                this.setState({
                    data: res
                })
            } else if(res){
                let data = this.state.data;
                data.push(...res);
                this.setState({
                    data
                })
            }
            if(res.length < this.pageSize){
                this.setState({
                    loadState: 3
                })
            }
        }).catch( err =>{
            console.log(err)
        })
    }

    //取消代扣
    _cancelRecharge(index, key){
        console.log(key)
        Toast.loading('加载中...');
        Fetch.post('/d-app/API/bm/OilReplaceRecharge/cancelRecharge',{
            cardNo: key
        }).then( res =>{
            console.log(res)
            console.log(12)
            Toast.hide();
            let data = this.state.data;
            data.splice(index, 1);
            this.setState({ data })
        }).catch( err =>{
            console.log(123)
        })
    }


    // 取消代扣
    cancel = (index, key)=> {
        Modal.alert(
            <span style={{ color: '#030303', fontSize: 17 }}>提示</span>,
            <span style={{ color: '#030303', fontSize: 13 }}>您确定要取消代扣吗？</span>,
            [
                { text: '取消', onPress: () => console.log('cancel'), style: {color: '#909090', fontSize: 17} },
                { text: '确定', onPress: () => this._cancelRecharge(index, key), style: {color: '#FE7D4D', fontSize: 17} }
            ]
        );
    };

    // 列表项
    _renderRow(rowData, rowId) {
        return(
            <div
                className="border-bottom bg flex flex-center flex-space-between padding-horizontal"
                style={{ height: 80 }}
                key={rowId}
            >
                <div
                    className="flex flex-dir"
                >
                    <div
                        className="border"
                        style={{ width: 28, height: 28, marginRight: 15 }}
                    >
                        <img src={rowData.cardNo[0] === '1' ? ImageConfig.Card_icon_1 : ImageConfig.Card_icon_2} alt="" style={{width: '100%', height: '100%'}}/>
                    </div>

                    <div>
                        <div style={{ fontSize: 14, color: '#333333', marginBottom: 14 }}>
                            { rowData.cardNo }
                        </div>

                        <div style={{ fontSize: 12, color: '#999999' }}>
                            <span>每月</span>
                            <span style={{ color: 'rgba(242, 136, 70, 1)' }}>{ rowData.giveCycleDay }</span>
                            <span>号自动充值</span>
                            <span style={{ color: 'rgba(242, 136, 70, 1)' }}>{ rowData.rechargeAmount }</span>
                            <span>元</span>
                        </div>
                    </div>
                </div>

                <div
                    className="flex flex-center"
                    style={{ height: '100%' }}
                    onClick={() => this.cancel(rowId, rowData.cardNo)}
                >
                    <span
                        className="withhold-cancel"
                    >
                        取消代扣
                    </span>
                </div>
            </div>
        )
    }

    render(){
        let { data } = this.state;
        const totalHeight = document.documentElement.clientHeight - 8;

        return(
            <div
                style={{ paddingTop: 8, height: '100%' }}
            >
                {
                    data.length > 0 ?
                        <ListView
                            style={{height: totalHeight, paddingTop: 8}}
                            dataSource={this.dataSource.cloneWithRows(data)}
                            renderRow={(rowData, sectionId, rowId)=> this._renderRow(rowData, rowId)}
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
            </div>
        )
    }
}

export default Withhold;