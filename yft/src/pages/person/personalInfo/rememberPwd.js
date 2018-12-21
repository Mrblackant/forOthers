/**
 *  修改支付密码
 */

import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';

const ScreenWidth = window.screen.width > 640 ? 640 : window.screen.width;
export default class RememberPwd extends Component {
    componentWillMount(){
        document.title = '修改支付密码';
        document.body.scrollIntoView();
    }

    // 账号脱敏处理
    _manageAccount(){
        let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));
        if(PersonalInfo){
            let mobile = PersonalInfo.mobile.replace(/\s+/g, "");
            let rMobile = mobile.substring(3,7);
            return mobile.replace(rMobile,'*****');
        }
    }

    render(){
        return(
            <div style={{ paddingTop: 8 }}>
                <div className="bg modify-pwd-title" style={{ height: 102, marginBottom: 12 }}>
                    <div style={{ fontSize: 16, color: '#909090', textAlign: 'center', marginBottom: 8 }}>
                        你是否记得账号{ this._manageAccount() }
                    </div>

                    <div style={{ fontSize: 16, color: '#151A00', textAlign: 'center' }}>
                        当前使用的支付密码
                    </div>
                </div>

                <div style={{ padding: 12 }} className="flex flex-dir flex-center flex-space-between">
                    <Button
                        onClick={()=> {
                            this.props.history.push('/sendCode');
                        }}
                        className="info-edit-btn"
                        style={{ fontSize: 14, color: '#333845', width: ScreenWidth * 2 / 5 }}
                    >
                        不记得
                    </Button>

                    <Button
                        onClick={()=> this.props.history.push('/enterOldPwd')}
                        className="linear-gradient info-edit-btn"
                        style={{ fontSize: 14, color: '#fff', width: ScreenWidth * 2 / 5 }}
                        activeStyle={{ background: '#FE7F4F' }}
                    >
                        记得
                    </Button>
                </div>
            </div>
        )
    }
}