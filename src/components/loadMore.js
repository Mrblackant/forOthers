import React, { Component } from 'react';
import '../assets/css/common.css';
import loadImg from '../assets/images/common/loading.gif';

class LoadMore extends Component {
    _loadBar(){
        if(this.props.loadState === 1){
            return <div style={{ color: 'rgba(158, 156, 156, 1)'}}>上拉加载更多</div>
        }else if (this.props.loadState === 2){
            return <div className="footer-box-item clear">
                <img
                    className="lf"
                    style={{width: 16, height:16, marginRight: 3}}
                    src={loadImg} alt={'111'}/>
                <div className="lf" style={{ color: 'rgba(158, 156, 156, 1)' }}>正在加载...</div>
            </div>
        }else{
            return <div style={{ color: 'rgba(158, 156, 156, 1)' }}>没有更多数据</div>
        }
    }

    render(){
        return (
            <div className="footer-box">{this._loadBar()}</div>
        )
    }
}

export default LoadMore;

