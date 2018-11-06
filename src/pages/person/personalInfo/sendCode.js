/**
 *  输入验证码
 */

import React, { Component } from 'react';
import PwdControl from '../../../components/pwdControl';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import Fetch from "../../../components/fetch";
import {Toast} from "antd-mobile/lib/index";

export default class SendCode extends Component {
    componentWillMount(){
        document.title = '输入验证码';
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
        let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));

        if (localStorage.getItem('PayPwdCode')) localStorage.removeItem('PayPwdCode');

        return(
            <div style={{ paddingTop: 8 }}>
                <div className="bg modify-pwd-title" style={{ height: 102 }}>
                    <div style={{ fontSize: 16, color: '#909090', textAlign: 'center', marginBottom: 8 }}>
                        请发送验证码到您的手机
                    </div>

                    <div style={{ fontSize: 16, color: '#151A00', textAlign: 'center' }}>
                        { this._manageAccount() }
                    </div>
                </div>

                <PwdControl
                    type={2}
                    callBack={(val)=> {
                        Toast.loading('正在验证...', 0);
                        Fetch.post('/d-app/API/login/checkAuthCode', {
                            mobile: PersonalInfo.mobile,
                            verifyCode: val,
                            verifyType: 2
                        }).then(res => {
                            Toast.hide();
                            localStorage.setItem('PayPwdCode', val);

                            this.props.history.push('/enterPwd');
                        }).catch(err => {
                        })
                    }}
                />
            </div>
        )
    }
}