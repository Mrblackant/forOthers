/**
 *  个人信息编辑
 */

import React, { Component } from 'react';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import { List, InputItem, Button, Toast } from 'antd-mobile';
import Fetch from "../../../components/fetch";

class CarEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            content: this.props.location.state.value
        }
    }

    componentWillMount(){
        document.title = '个人信息';
        document.body.scrollIntoView();
    }

    // 提交
    commit(type){
        let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));

        let email = '';
        let identNum = '';
        let nickName = '';
        if (type === 1) {
            PersonalInfo.nickName = this.state.content;
            nickName = this.state.content;
        }

        if (type === 2) {
            PersonalInfo.identNum = this.state.content;
            identNum = this.state.content;
        }

        if (type === 3) {
            let emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (!emailReg.test(this.state.content)) {
                Toast.info('请输入正确的邮箱。', 1);
                return
            }


            PersonalInfo.email = this.state.content;
            email = this.state.content;
        }

        Toast.loading('正在提交...', 0);
        Fetch.post('/d-app/API/user/userEdit', {
            email: email ? email : '',
            identNum: identNum ? identNum : '',
            nickName: nickName ? nickName : ''
        }).then(result=> {
            localStorage.setItem('PersonalInfo', JSON.stringify(PersonalInfo));
            Toast.success('提交成功', 1);
            setTimeout(()=> this.props.history.goBack(), 1000);
        }).catch(error=> {
        })
    }

    render(){
        let params = this.props.location.state;
        let title = '姓名';
        let placeholder = '请输入姓名';
        let maxLength = 10;
        let type = 'text';
        if (params.type === 2) {
            title = '身份证号';
            placeholder = '请输入身份证号';
            maxLength = 18;
            type = 'number';
        }

        if (params.type === 3) {
            title = '邮箱地址';
            placeholder = '请输入邮箱地址';
            maxLength = 20;
        }

        return(
            <div style={{ paddingTop: 8 }}>
                <List
                    style={{ height: 45, marginBottom: 40 }}
                >
                    <InputItem
                        clear
                        type={type}
                        maxLength={maxLength}
                        className="info-edit-input"
                        labelNumber={params.type > 1 ? 4 : 2}
                        placeholder={placeholder}
                        value={this.state.content}
                        onChange={(value) => this.setState({content: value})}
                        onBlur={(value) => this.setState({content: value})}
                    >
                        {title}
                    </InputItem>
                </List>

                <div
                    className="padding-horizontal"
                >
                    <Button
                        disabled={this.state.content ? false : true}
                        onClick={()=> this.commit(params.type)}
                        className="linear-gradient info-edit-btn"
                        style={{ fontSize: 14, color: '#fff' }}
                        activeStyle={{ background: '#FE7F4F' }}
                    >
                        提交
                    </Button>
                </div>
            </div>
        )
    }
}

export default CarEdit;