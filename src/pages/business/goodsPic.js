/**
 *  商品图片详情展示
 */

import React, { Component } from 'react';
import { Carousel } from 'antd-mobile';
import '../../assets/css/common.css';
import '../../assets/css/main.css';
import Swiper from '../../components/swiper'

const width = window.screen.width > 640 ? 640 : window.screen.width;

class GoodsPic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curIndex: 0,
            curPic: 0,
        };
        this.bannerData = this.props.history.location.state ? this.props.history.location.state.bannerData : [];
        this.tabType = this.props.history.location.state ? this.props.history.location.state.tabType : 1;//1--商家详情；2---商品详情
    }

    componentWillMount() {
        document.title = '';
    }
    componentDidMount(){
        let curIndex = 0;

        if(this.props.history.location.state){
            curIndex = this.props.history.location.state.curIndex;
            console.log(curIndex)
        }
        this.setState({
            curIndex: curIndex,
            curPic: curIndex
        })
    }
    render() {
        if(!this.bannerData ){
            return null;
        }
        return (
            <div
                style={{width:'100%',height:'100%',backgroundColor:'#000'}}
                className= "flex flex-center"
            >
                {/*关闭按钮*/}
                <div
                    style={{position:'absolute',top:50,left:15,width:'30%',height:80}}
                    onClick={()=>{this.props.history.goBack()}}
                >
                    <i className='iconfont icon-guanbi'
                        style={{color:'#D8D8D8', fontSize:18,borderRadius:1}}
                    />
                </div>
                {/*图片*/}
                <div
                    style={{ height:'15rem',width:width}}
                >
                    <Swiper
                        style={{ width: '100%', height: '15rem' }}
                        itemWidth={18.75}
                        curIndex = {this.state.curIndex}
                        getIndex = {(index) =>{this.setState({curIndex: index})}}
                        picNum={1}
                    >
                        {
                            this.bannerData.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="box-sizing"
                                        style={{
                                            width: '18.75rem', height: '15rem',backgroundColor:item.color,
                                        }}
                                    >
                                        <img
                                            style={{ width: '100%',height: '15rem',}}
                                            src={item}
                                            alt=" "
                                        />
                                    </div>

                                )
                            })
                        }
                    </Swiper>
                </div>

                {/*分页器*/}
                <div style={{position: 'fixed',right:12,bottom:50}}>
                    <span style={{color:'#fff',fontSize:14}}>
                        {Math.ceil(this.state.curIndex) + 1} / {this.bannerData.length}
                    </span>
                </div>
            </div>

        )
    }
}

export default GoodsPic