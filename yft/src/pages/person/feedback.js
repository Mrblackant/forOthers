/**
 *  我的加油卡
 */


import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile';

import Fetch from '../../components/fetch';

import '../../assets/css/common.css';
import '../../assets/css/personal.css';


class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    componentWillMount() {
        document.title = '反馈建议';
    }

    onChangeVal(e) {
        this.setState({
            value: e.target.value
        })
    }

    onSubmitVal = () => {
        Toast.loading('正在提交', 0);
        Fetch.post('/d-app/API/user/feedback', {
            content: this.state.value
        }).then( res =>{
            Toast.success('提交成功', 1);
            setTimeout(() => this.props.history.goBack(), 500)
            
        }).catch( err =>{
            console.log( err );
        })
    }

    _isComplete(){
        if( !this.state.value ){
            console.log(222)
            return false;
        }
        return true;
    }

    render() {


        return (
            <div className="container-feedback flex">
                <div className="feedback-wrap">
                    <textarea
                        className="feedback-con border"
                        placeholder="请填写您的反馈或者建议"
                        value={this.state.value}
                        onChange={(e) => this.onChangeVal(e)}
                        maxLength={200}
                    />
                    <div className="word-count">
                        <span>{this.state.value.length}</span>
                        <span>/</span>
                        <span>200</span>
                    </div>
                </div>
                <Button
                    className="feedback-btn linear-gradient"
                    activeStyle={{ background: '#FE7F4F', color: '#fff' }}
                    onClick={ this._isComplete() ? this.onSubmitVal : null}
                    disabled={ !this._isComplete() }
                >
                    提交
                </Button>
            </div>
        )
    }
}

export default Feedback;