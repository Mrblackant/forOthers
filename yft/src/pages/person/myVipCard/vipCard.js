/**
 *  我的会员卡
 */

import React, { Component } from 'react';
import { ListView, Toast } from 'antd-mobile';
import ImageConfig from '../../../assets/imageConfig';
import Fetch from '../../../components/fetch';

import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import LoadMore from '../../../components/loadMore';

const width = window.screen.width > 640 ? 640 : window.screen.width;

export default class VipCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardData: [],
            loadState: 1,
         };
        this.page = 1;
        this.pageSize = 6;
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentWillMount() {
        document.title = '我的会员卡';
        document.body.scrollIntoView();
    }

    componentDidMount() {
        Toast.loading('加载中...', 0);
        this._getCardList(3);
    }

    /**
     * 我的会员卡列表
     * @param loadState    1-上拉加载更多，2-加载中，3-没有更多数据
     * @private
     */
    _getCardList(type){
        let { cardData }=this.state;
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if(type ===1||type===3){
            this.page = 1
        }else{
            this.page++
        }
        this.setState({loadState: 2});
        Fetch.post("d-app/API/memcard/cardList",{
            page: this.page ,
            pageSize: this.pageSize
        }).then((result)=>{
            Toast.hide();
            if(result){
                if(type===1){
                    this.setState({cardData: result});
                }else{
                    cardData.push.apply(cardData,result);
                }
            }
            // 当返回数据长度不等于pageSize时不做上拉加载处理
            if(result.length < this.pageSize){
                this.setState({loadState: 3});
            } else{
                this.setState({loadState: 1});
            }
        }).catch((err)=>{
            this.setState({loadState:3});
            Toast.info(err.errDesc);
        })
    }

    // 时间处理
    _manageTime(createTime){
        let Time = createTime.split(' ')[0].split('-');
        let befTime = Time[0] + '.' + Time[1] + '.' + Time[2];
        return befTime
    }

    // 列表项
    _renderRow(rowData, rowId) {
        return(
            <div
                key={rowId}
                className='box-sizing'
                style={{position:'relative',width:'17.5rem',height:'7.5rem',margin:0,marginTop:10,overflow:'hidden'}}
                onClick={() => {this.props.history.push('/vipCardDetail',{cardCode: rowData.cardCode})}}

            >
                {/*背景图*/}
                <img src={ImageConfig.vipCardBg}
                     alt=""
                     style={{width:'17.5rem',height:'8rem'}}
                />

                <div
                    className='flex flex-dir  flex-center vip-card'
                    style={{
                        width:'100%',height:'100%',color:'#fff',
                        borderRadius:5,position:'absolute',top:0,left:0,zIndex:1000
                    }}
                >
                    {/*左*/}
                    <div
                        style={{width:'60%',height:'100%',flexDirection:'column'}}
                        className='flex flex-space-between'
                    >
                        <div>
                            <div style={{fontSize:'0.6rem',marginBottom:'0.6rem'}}>
                                { rowData.shopsName }
                            </div>

                            <div style={{fontSize:'0.8rem'}}>
                                { rowData.cardCode}
                            </div>
                        </div>


                        <div
                            className='nowrap'
                        >
                            <i className='iconfont icon-weizhi' style={{fontSize:'0.5rem',marginRight:'0.4rem', opacity:0.8}}/>
                            <span style={{fontSize:'0.6rem', opacity:0.8,lineHeight:1.5}}>
                                { rowData.shopsAddress }
                            </span>
                        </div>
                    </div>

                    {/*右*/}
                    <div
                        className='flex flex-center'
                        style={{
                            marginLeft: '0.5rem',width:'40%',
                            height:'100%',fontSize:'0.6rem',alignItems:'flex-end',
                            flexDirection:'column',justifyContent:'flex-end'
                        }}
                    >
                        <div style={{height:'55%',textAlign:'right'}}>

                            <span style={{opacity:0.8}}>余额</span>

                            <div style={{fontSize: 22,marginTop:'0.3rem',color:'#FCE62B'}}>
                                {parseFloat(rowData.bookBalance).toFixed(2)}
                            </div>
                        </div>

                        <div style={{opacity:0.8,lineHeight:1.5}}>
                            { this._manageTime(rowData.createTime) }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        let {cardData} = this.state;
        const totalHeight = document.documentElement.clientHeight;
        return (
            <div>
                {
                    cardData.length > 0 ?
                        <ListView
                            style={{
                                width:'100%',height: totalHeight,
                                paddingTop:10,marginLeft:'0.6rem'
                            }}
                            dataSource={this.dataSource.cloneWithRows(cardData)}
                            renderFooter={() => (cardData.length > 8 ? <LoadMore loadState={this.state.loadState}/> : null)}
                            renderRow={(rowData, sectionId, rowId)=>this._renderRow(rowData, rowId)}
                            pageSize={6}
                            renderBodyComponent={() => <div />}
                            onScroll={() => console.log('scroll')}
                            scrollRenderAheadDistance={500}
                            onEndReachedThreshold={10}
                            onEndReached={() => this._getCardList(2)}
                        />
                        :
                        <div style={{ width: '100%', height: totalHeight-10 }} className="flex flex-dir flex-center ">
                            <img style={{width: width / 2, height: width / 2}} src={ImageConfig.noData} alt=" "/>
                        </div>
                }
            </div>

        )
    }
}

