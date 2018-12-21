import React from 'react'

import '../assets/css/business.css';

/*  
    this.props.infinite 是否无限轮播
    this.props.auto 是否自动轮播 
    this.props.itemWidth 单次移动的宽度，rem单位
    this.props.curIndex 当前显示第几张图片
    this.props.picNum 当前一屏显示几张图
    this.props.getIndex 滑动获取index
*/
export default class Swiper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            conWidth: '',
            conLeft: 0,     //container容器的left值(根据手势时时变动)
            isAni: true,    //控制滚动过渡动画
            curLeft: 0      //container容器当前固定的left值
        }
        this.picNum = this.props.picNum ? this.props.picNum : 2;
        this.itemWidth = 0;     //容器中单个item的宽，用来一次移动的距离
        this.curIndex = 0;      //当前轮播计数
        this.startPos = {};     //touchstart的点
        this.endPos = {};       //touchend的点
        this.itemLength = (this.props.children.length > 1 && this.props.infinite) ? this.props.children.length + this.picNum : this.props.children.length;
        this.timer = null;  //计时器
        this.isFirstProps = true;    //判断是否第一次更改props
    }

    componentDidMount() {
        this.itemWidth = this._remToPx(this.props.itemWidth);
        if (this.props.auto) {
            this.timer = setInterval(() => {
                this._autoScroll()
            }, 3000);
        }
        if(this.props.curIndex){
            this.curIndex = this.props.curIndex;
            this._scroll(true);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.itemLength = (nextProps.children.length > 1 && nextProps.infinite) ? nextProps.children.length + this.picNum : nextProps.children.length;
        if (nextProps.curIndex && this.isFirstProps) {
            this.curIndex = nextProps.curIndex;
            this._scroll(true);
            this.isFirstProps = false;
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }

    //touch事件移动
    onMoveContainer(e, type) {
        if (type === 'start') {
            console.log('start');
            this.startPos = {
                x: e.targetTouches[0].clientX,
                y: e.targetTouches[0].clientY
            }
        } else if (type === 'move') {
            console.log('move')
            this.setState({
                isAni: false,
                conLeft: e.changedTouches[0].clientX - this.startPos.x + this.state.curLeft
            })
            //判断是否需要无限轮播
            if (this.props.infinite) {
                //在末尾图片向左移动时
                if (this.curIndex === this.itemLength - this.picNum && e.changedTouches[0].clientX - this.startPos.x < 0) {
                    this.curIndex = 0;
                    this._scroll(false);
                }
                //在首张图片向右移动时
                if (this.curIndex === 0 && e.changedTouches[0].clientX - this.startPos.x > 0) {
                    this.curIndex = this.itemLength - this.picNum;
                    this._scroll(false);
                    
                }
            }
        } else if (type === 'end') {
            console.log('end')
            this.endPos = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            }
            if (this.endPos.x - this.startPos.x > 30) {
                if (this.curIndex > 0) {
                    this.curIndex--;
                }
            } else if (this.startPos.x - this.endPos.x > 30) {
                if (this.curIndex < this.itemLength - this.picNum) {
                    this.curIndex++;
                }
            }
            this._scroll(true);
            if(this.props.getIndex){
                this.props.getIndex(this.curIndex)
            }
        }
    }

    //自动滚动
    _autoScroll() {
        console.log(this.curIndex);
        console.log(this.itemLength)
        if (this.curIndex === this.itemLength - this.picNum) {
            this.curIndex = 0;
            this._scroll(false);
            return;
        }
        this.curIndex++;
        this._scroll(true);
    }

    //容器滚动
    _scroll(isAni){
        this.setState({
            isAni,
            conLeft: -this.curIndex * this.itemWidth,
            curLeft: -this.curIndex * this.itemWidth
        })
    }

    //rem转换px
    _remToPx(rem) {
        const cw = document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth;
        return rem * (cw / 375 * 20)
    }

    render() {
        const { conLeft, isAni } = this.state;
        
        return (
            <div
                className="swiper-wrap"
                style={this.props.style}
                onTouchStart={this.itemLength > 1 ? (e) => this.onMoveContainer(e, 'start') : null}
                onTouchEnd={this.itemLength > 1 ? (e) => this.onMoveContainer(e, 'end') : null}
                onTouchMove={this.itemLength > 1 ? (e) => this.onMoveContainer(e, 'move') : null}
            >
                <div
                    className={isAni ? "swiper-container ani" : "swiper-container"}
                    style={{ left: conLeft + 'px' }}
                >
                    {/* 子节点大于1时添加两个节点 */}
                    {
                        this.props.children.length > 1 && this.props.infinite ?
                            [
                                this.props.children, this.props.children[0],
                                 this.props.children[1]
                            ] :
                            this.props.children
                    }
                </div>
            </div>
        )
    }
}