/**
 *  我的奖励
 */
import React, { Component } from 'react';
import '../../assets/css/common.css';
import '../../assets/css/personal.css';
import Fetch from '../../components/fetch';
import { ListView } from 'antd-mobile';
import LoadMore from '../../components/loadMore';
import ImageConfig from "../../assets/imageConfig";

const ScreenWidth = window.screen.width > 640 ? 640 : window.screen.width;
class Reward extends Component {
    componentWillMount(){
        document.title = '我的奖励';
        document.body.scrollIntoView();
    }

    render(){
        return(
            <div style={{height: '100%'}}>
                {/*当前奖励*/}
                <CurrentPoints history={this.props.history} ref={ref => this.currentPoints = ref}/>

                {/*奖励记录*/}
                <PointsRecord getCurrentPoint = {(integral)=>{this.currentPoints._getPoints(integral)}}/>
            </div>
        )
    }
}

// 当前奖励
class CurrentPoints extends Component{
    constructor(props){
        super(props);
        this.state={
            currentPoints: 0
        };
    }

    // 获取当前奖励
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
                <div
                    className="flex flex-center"
                    style={{height: 121}}
                >
                    <div className="text-center">
                        <div
                            style={{fontSize: 20, color:"#444444", marginBottom: 10}}
                        >
                            {this.state.currentPoints}
                        </div>

                        <div style={{fontSize: 12,color: '#909090'}}>
                            我的奖励
                        </div>
                    </div>
                </div>

                <div
                    className="flex  itemPadding"
                    style={{color:'#909090',fontSize:12,flexDirection:'column',justifyContent:'center',height:45,backgroundColor:'#f3f3f3'}}
                >
                    奖励记录
                </div>

            </div>
        )
    }
}

// 奖励记录
class PointsRecord extends Component{
    constructor(props){
        super(props);
        this.state = {
            pointsData: [],
            loadState: 1
        };
        this.page = 1;
        this.pageSize = 10;
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentDidMount(){
        this._getPointsList(3);
    }

    /**
     * 我的奖励列表
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
        Fetch.post("d-app/API/user/rewardList",{
            page: this.page ,
            pageSize: this.pageSize
        }).then((result)=>{
            console.log(result)
            if(result){
                this.props.getCurrentPoint(result.totalCommission);
                pointsData.push.apply(pointsData, result.rewardList);
            }
            // 当返回数据长度不等于pageSize时不做上拉加载处理
            if(result.rewardList.length < this.pageSize){
                this.setState({loadState: 3});
            } else{
                this.setState({loadState: 1});
            }
        }).catch((err)=>{
            console.log(err)
            this.setState({loadState:3});
        })
    }

    // 列表项
    _renderRow(rowData, rowId) {
        return(
            <div key={rowId} className="itemStyle border-bottom itemPadding" style={{height: 65}}>
                {/*左边*/}
                <div
                    className="flex flex-align-items"
                >
                    <div style={{ width: 40, height: 40, borderRadius: 20, marginRight: 6 }}>
                        <img
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                            src={rowData.portraitImgUrl ? rowData.portraitImgUrl : ImageConfig.Default_img}
                            alt=" "
                        />
                    </div>

                    <div>
                        <div style={{fontSize: 12,color: '#444444', marginBottom: 6}}>
                            {rowData.bindMobile}
                        </div>
                        <div style={{fontSize: 12,color: '#909090'}}>
                            {'预购' + rowData.preOrderAmount + '分' + rowData.giveCount + '期'}
                        </div>
                    </div>
                </div>

                {/*右边*/}
                <div>
                    <div
                        style={{fontSize: 16, color: '#FE7D4D', marginBottom: 6, textAlign: 'right'}}
                    >
                        {'+' + rowData.commission}
                    </div>
                    <div style={{fontSize: 12, color: '#909090'}}>
                        {rowData.createTime}
                    </div>
                </div>
            </div>
        )
    }

    render(){
        const totalHeight = document.documentElement.clientHeight;

        return(
            <div className='bg' style={{ height: totalHeight - 166 }}>
                {
                    this.state.pointsData.length > 0 ?
                        <ListView
                            style={{height: totalHeight - 166}}
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
                        <div style={{ width: '100%', height: '100%' }} className="flex-center flex">
                            <img style={{width: ScreenWidth / 2, height: ScreenWidth / 2}} src={ImageConfig.noData} alt=" "/>
                        </div>
                }
            </div>
        )
    }
}

export default Reward