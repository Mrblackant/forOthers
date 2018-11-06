/**
 *  个人中心
 */

import React, { Component } from 'react';
import '../../assets/css/common.css';
import '../../assets/css/personal.css';
import Fetch from '../../components/fetch';
import { Toast,ListView } from 'antd-mobile';
import LoadMore from '../../components/loadMore';
import ImageConfig from '../../assets/imageConfig';
const ScreenWidth = window.screen.width > 640 ? 640 : window.screen.width;
class MyPoints extends Component {
    componentWillMount(){
        document.title = '我的积分';
        document.body.scrollIntoView();
    }

    render(){
        return(
            <div style={{height: '100%'}}>
                {/*当前积分*/}
                <CurrentPoints history={this.props.history} ref={ref => this.currentPoints = ref}/>

                {/*积分记录*/}
                <PointsRecord getCurrentPoint = {(integral)=>{this.currentPoints._getPoints(integral)}}/>
            </div>
        )
    }
}

// 当前积分
class CurrentPoints extends Component{
    constructor(props){
        super(props);
        this.state={
            currentPoints: ''
        };
    }

    // 获取当前积分
    _getPoints(integral){
        this.setState({
            currentPoints: integral
        })
    }

    render(){
        return(
            <div
                className="bg"
                style={{width: ScreenWidth}}
            >
                <div style={{height: 121}}>
                    <div
                        className="flex flex-center"
                        style={{fontSize: 30,color:"#444444",paddingTop: ScreenWidth/12}}
                    >
                        {this.state.currentPoints}
                    </div>

                    <div className="itemStyle flex-dir itemPadding">
                        <p className="pointsTxt" style={{color:'transparent'}}>当前积分</p>  {/*占位用*/}
                        <p style={{fontSize: 12,color: '#909090'}}>当前积分</p>
                        <p
                            style={{fontSize: 12,color:"#057DFF"}}
                            onClick={() => this.props.history.replace('/mall')}
                        >
                            积分商城
                        </p>
                    </div>
                </div>

                <div
                    className="flex  itemPadding"
                    style={{color:'#909090',fontSize:12,flexDirection:'column',justifyContent:'center',height:45,backgroundColor:'#f3f3f3'}}
                >
                    积分记录
                </div>

            </div>
        )
    }
}

// 积分记录
class PointsRecord extends Component{
    constructor(props){
        super(props);
        this.state = {
            pointsData: [],
            loadState: 1,
        };
        this.page = 1;
        this.pageSize = 10;
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentDidMount(){
        this._getPointsList(3);
    }

    /**
     * 我的积分列表
     * @param loadState    1-上拉加载更多，2-加载中，3-没有更多数据
     * @private
     */
    _getPointsList(type){
        let {pointsData}=this.state;
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if(type ===1||type===3){
            this.page = 1
        }else{
            this.page++
        }
        this.setState({loadState: 2});
        Fetch.post("/d-app/API/user/myIntegral",{
            page: this.page ,
            pageSize: this.pageSize
        }).then((result)=>{
            if(result){
                this.props.getCurrentPoint(result.integral);//获取当前积分
                if(type===1){
                    this.setState({pointsData: result.integralRecords});
                }else{
                    pointsData.push.apply(pointsData,result.integralRecords);
                }
            }
            // 当返回数据长度不等于pageSize时不做上拉加载处理
            if(result.integralRecords.length < this.pageSize){
                this.setState({loadState: 3});
            } else{
                this.setState({loadState: 1});
            }
        }).catch((err)=>{
            this.setState({loadState:3});
            Toast.info(err.errDesc);
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

    render(){
        const totalHeight = document.documentElement.clientHeight;
        let {pointsData } = this.state;
        return(
            <div className='bg'>
                {
                    pointsData && pointsData.length > 0 ?
                        <ListView
                            style={{height: totalHeight - 169}}
                            dataSource={this.dataSource.cloneWithRows(this.state.pointsData)}
                            renderFooter={() => (this.state.pointsData.length > 8 ? <LoadMore loadState={this.state.loadState}/> : null)}
                            renderRow={(rowData, sectionId, rowId)=>this._renderRow(rowData, rowId)}
                            pageSize={10}
                            renderBodyComponent={() => <div />}
                            onScroll={() => console.log('scroll')}
                            scrollRenderAheadDistance={500}
                            onEndReachedThreshold={10}
                            onEndReached={() => this._getPointsList(2)}
                        />
                        :
                        <div
                            style={{ width: '100%', height: totalHeight - 169 }}
                            className="flex flex-justify-content flex-align-items"
                        >
                            <img style={{ width: '50%' }} src={ImageConfig.noData} alt=" " />
                        </div>
                }

            </div>
        )
    }
}

export default MyPoints