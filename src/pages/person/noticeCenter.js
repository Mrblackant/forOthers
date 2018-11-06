/**
 *  消息中心
 */

import React, { Component } from 'react';
import '../../assets/css/common.css';
import '../../assets/css/personal.css';
import { ListView ,Toast} from 'antd-mobile';
import Fetch from '../../components/fetch';
import ImageConfig from '../../assets/imageConfig';
import LoadMore from '../../components/loadMore';

const width = window.screen.width > 640 ? 640 : window.screen.width;
const height = window.screen.height;
class NoticeCenter extends Component {
    constructor(props){
        super(props);
        this.state={
            noticeList:[],
            loadState: 1, //1---无数据，2---无网络
        };
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.lastMsgId = 0;//上次请求最后一个消息id，默认0
        this.page = 1;
        this.pageSize = 10;//后台默认一次返回10条
    }

    componentDidMount(){
        this._getNoticeList(1);
    }

    componentWillMount(){
        document.title = '消息中心';
        document.body.scrollIntoView();
    }

    //获取消息列表 type:1---初次加载，2---上拉加载更多
    _getNoticeList(type){
        let { noticeList } = this.state;
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if(type ===1||type===3){
            this.page = 1
        }else{
            this.page++
        }
        this.setState({loadState: 2});

        Fetch.post("/d-app/API/message/messageList",{
            lastMsgId: this.lastMsgId ,
        }).then((result)=>{
            if(result && result.length>0){
                console.log(result)
                //时间格式处理
                for(let i=0;i<result.length;i++){
                    let sendTime = result[i].sendTime;
                    sendTime = sendTime.substring(5,sendTime.length-3);
                    result[i].sendTime = sendTime;
                }
                if(type===1){
                    this.setState({noticeList: result});
                }else{
                    noticeList.push.apply(noticeList,result);
                }

                this.lastMsgId = result[result.length-1].msgId;
            }
            // 当返回数据长度不等于pageSize时不做上拉加载处理
            if(result.length < this.pageSize){
                this.setState({loadState: 3});
            } else{
                this.setState({loadState: 1});
            }

        }).catch(err =>  {
                console.log(err)
                this.setState({loadState:3});
                Toast.info(err.errDesc)
            }
        )
    }

    // 列表项
    _renderRow(rowData, rowId) {
        return (
            <div
                key={ rowId }
                className="bg box-sizing "
                style={{marginBottom:10,padding:15,minHeight:130, width: width}}
            >
                <div className='flex flex-dir flex-space-between'>
                    <span style={{fontSize:14,color: '#333845',fontWeight:'bold', width: '80%'}}>
                        {rowData.msgTitle}
                    </span>
                    <span style={{fontSize:12,color: '#909090'}}>
                        {rowData.sendTime}
                    </span>
                </div>

                <p style={{fontSize:12,color:'#252932', lineHeight:1.5, width: '100%', marginBottom: 0, wordBreak: 'break-all'}}
                >
                    {rowData.msgContent}
                </p>
            </div>
        )
    }

    render(){
        const totalHeight = document.documentElement.clientHeight;
        if(this.state.noticeList && this.state.noticeList.length>0){
            return(
                <div className="com-bg"
                     style={{marginTop:10}}
                >
                    <ListView
                        style={{height: totalHeight}}
                        dataSource={this.dataSource.cloneWithRows(this.state.noticeList)}
                        renderRow={(rowData, sectionId, rowId)=>this._renderRow(rowData, rowId)}
                        renderFooter={() => (this.state.noticeList.length > 10 ? <LoadMore loadState={this.state.loadState}/> : null)}
                        pageSize={7}
                        renderBodyComponent={()=>(<div/>)}
                        onScroll={() => console.log('scroll')}
                        scrollRenderAheadDistance={500}
                        onEndReachedThreshold={10}
                        onEndReached={()=> this._getNoticeList(2)}
                    />
                </div>
            )
        }else{
            return(
                <div className="bg flex flex-center"
                     style={{width: width,height: height}}
                >
                    <img
                        src={ImageConfig.noData}
                        style={{width: width/2,height: width/2}}
                        alt=""
                    />
                </div>
            )
        }

    }
}

export default NoticeCenter