import React, { Component } from 'react';
import { ListView } from 'antd-mobile';

import ImageConfig from '../../assets/imageConfig';
import Fetch from '../../components/fetch';
import LoadMore from '../../components/loadMore';

import '../../assets/css/personal.css';
import '../../assets/css/common.css';

const ScreenWidth = window.screen.width > 640 ? 640 : window.screen.width;
class AmountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pointsData: [],
            loadState: 1,
        };
        this.page = 1;
        this.pageSize = 10;
        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    componentWillMount(){
        document.title = '账户余额';
        document.body.scrollIntoView();
    }

    componentDidMount() {
        this._getPointsList(3);
    }

    /**
    * 我的积分列表
    * @param loadState    1-上拉加载更多，2-加载中，3-没有更多数据
    * @private
    */
    _getPointsList(type) {
        let { pointsData } = this.state;
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if (type === 1 || type === 3) {
            this.page = 1
        } else {
            this.page++
        }
        this.setState({ loadState: 2 });
        console.log('调接口')
        Fetch.post("/d-app/API/user/balanceRecord", {
            page: this.page,
            pageSize: this.pageSize
        }).then((result) => {
            if (result) {
              
                if (type === 1) {
                    this.setState({ pointsData: result });
                } else {
                    pointsData.push.apply(pointsData, result);
                }
            }
            // 当返回数据长度不等于pageSize时不做上拉加载处理
            if (result.length < this.pageSize) {
                this.setState({ loadState: 3 });
            } else {
                this.setState({ loadState: 1 });
            }
            console.log(result)
        }).catch((err) => {
            this.setState({ loadState: 3 });
            
            console.log(err)
        })
    }


    // 列表项
    _renderRow(rowData, rowId) {
        return(
            <div key={rowId} className="itemStyle border-bottom itemPadding" style={{height: 65}}>
                {/*左边*/}
                <div>
                    <p style={{fontSize: 14,color: '#444444'}}>
                        {rowData.changeAction}
                    </p>
                    <p style={{fontSize: 12,color: '#909090'}}>
                        {rowData.changeTime}
                    </p>
                </div>
                {/*右边*/}
                <div style={{fontSize:18 ,color: rowData.changeValue>0 ? '#FE7D4D ' : '#444444'}}>
                    {rowData.changeValue}
                </div>
            </div>
        )
    }
    

    render() {
        const totalHeight = document.documentElement.clientHeight;
        return (
            <div className="bg " style={{ width: '100%', height: '100%' }}>
                
                <div className="bg" style={{marginTop: '0.6rem'}}>
                    {
                        this.state.pointsData.length > 0 ?
                        <ListView
                            style={{height: totalHeight }}
                            dataSource={this.dataSource.cloneWithRows(this.state.pointsData)}
                            renderFooter={() => (this.state.pointsData.length > 8 ? <LoadMore loadState={this.state.loadState}/> : null)}
                            renderRow={(rowData, sectionId, rowId)=>this._renderRow(rowData, rowId)}
                            pageSize={10}
                            renderBodyComponent={() => <div />}
                            onScroll={() => console.log('scroll')}
                            scrollRenderAheadDistance={500}
                            onEndReachedThreshold={10}
                            onEndReached={() => this._getPointsList(2)}
                        /> : 
                        <div style={{ width: '100%', height: totalHeight }} className="flex-center flex">
							<img style={{ width: ScreenWidth / 2, height: ScreenWidth / 2 }} src={ImageConfig.noData} alt=" " />
						</div>
                    }
                </div>
            </div>

        )
    }
}

export default AmountDetails;