/**
 *  个人信息
 */

import React, { Component } from 'react';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import { List } from 'antd-mobile';

const Item = List.Item;
class PersonalInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            result: {
                nickName: '',
                identNum: '',
                mobile: '',
                email: ''
            }
        };

        this.UserList = [
            {value: '昵称'},
            {value: '身份证号'},
            {value: '手机号码', noArrow: true},
            {value: '邮箱地址'}
        ];
    }

    componentWillMount(){
        document.title = '个人信息';
        document.body.scrollIntoView();
    }

    componentDidMount(){
        let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));
        this.setState({result: PersonalInfo});
    }

    // 账号脱敏处理
    _manageAccount(account){
        let mobile = account.replace(/\s+/g, "");
        let rMobile = mobile.substring(3,7);
        return mobile.replace(rMobile,'*****');
    }

    // 获取对应数据
    _setUserInfo(index){
        let { result } = this.state;

        if (index === 0) {
            return <div className="nowrap" style={{ fontSize: 14, color: '#909090' }}>{ result.nickName }</div>
        }

        if (index === 1) {
            return <div className="nowrap" style={{ fontSize: 14, color: '#909090' }}>{ result.identNum }</div>
        }

        if (index === 2) {
            return <div className="nowrap" style={{ fontSize: 14, color: '#909090' }}>
                    { this._manageAccount(result.mobile) }
                </div>
        }

        if (index === 3) {
            return <div className="nowrap" style={{ fontSize: 14, color: '#909090' }}>{ result.email }</div>
        }
    }

    // 页面跳转
    _jumpPage(index){
        let { result } = this.state;

        if (index === 0) {
            this.props.history.push('/infoEdit', {value: result.nickName, type: 1});
        }

        if (index === 1) {
            this.props.history.push('/infoEdit', {value: result.identNum, type: 2});
        }

        if (index === 3) {
            this.props.history.push('/infoEdit', {value: result.email, type: 3});
        }
    }

    render(){
        let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));

        if (localStorage.getItem('PayPwdOldPwd')) localStorage.removeItem('PayPwdOldPwd');
        if (localStorage.getItem('PayPwdCode')) localStorage.removeItem('PayPwdCode');

        return(
            <div style={{paddingTop: 8}}>
                <List style={{ marginBottom: 8 }}>
                    {
                        this.UserList.map((item, index)=> {
                            return (
                                <Item arrow={item.noArrow ? '' : 'horizontal'}
                                      multipleLine
                                      extra={this._setUserInfo(index)}
                                      onClick={() => this._jumpPage(index)}
                                      key={index}
                                >
                                    <div style={{ fontSize: 14, color: '#444' }}>{ item.value }</div>
                                </Item>
                            )
                        })
                    }
                </List>

                <List style={{ marginBottom: 8 }}>
                    <Item
                        arrow="horizontal"
                        multipleLine
                        onClick={() => {
                            if (PersonalInfo.isPayPwd === 1) {   // 无支付密码
                                this.props.history.push('/modifyPwd');
                            } else {
                                this.props.history.push('/rememberPwd');
                            }
                        }}
                    >
                        <div style={{ fontSize: 14, color: '#444' }}>
                            {PersonalInfo.isPayPwd === 1 ? '设置支付密码' : '修改支付密码'}
                        </div>
                    </Item>
                </List>

                {/*<List style={{ marginBottom: 30 }}>*/}
                    {/*<Item arrow="horizontal" multipleLine onClick={() => { this.props.history.push('/address')}} >*/}
                        {/*<div style={{ fontSize: 14, color: '#444' }}>收货地址</div>*/}
                    {/*</Item>*/}
                {/*</List>*/}
            </div>
        )
    }
}

export default PersonalInfo