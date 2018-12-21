/**
 *  输入原支付密码
 */

import React, { Component } from 'react';
import PwdControl from '../../../components/pwdControl';
import Fetch from '../../../components/fetch';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import { Toast } from "antd-mobile";

export default class EnterOldPwd extends Component {
    componentWillMount() {
        document.title = '输入原支付密码';
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

    render() {

        if (localStorage.getItem('PayPwdOldPwd')) localStorage.removeItem('PayPwdOldPwd');

        return (
            <div style={{ paddingTop: 8 }}>
                <div className="bg modify-pwd-title" style={{ height: 102, marginBottom: 30 }}>
                    <div style={{ fontSize: 16, color: '#909090', textAlign: 'center', marginBottom: 8 }}>
                        请输入账号{ this._manageAccount() }
                    </div>
                    <div style={{ fontSize: 16, color: '#151A00', textAlign: 'center' }}>
                        原支付密码
                    </div>
                </div>

                <PwdControl
                    ref={ref => this.pwdControl = ref}
                    focus={true}
                    callBack={(val) => {
                        Toast.loading('正在验证...', 0);
                        Fetch.post('/d-app/API/pwd/checkPayPwd', {
                            payPwd: Fetch.CryptoJS.MD5(val).toString()
                        }).then(res => {
                            Toast.hide();
                            localStorage.setItem('PayPwdOldPwd', val);

                            this.props.history.push('/enterPwd');
                        }).catch(err => {
                        })
                    }} />
            </div>
        )
    }
}