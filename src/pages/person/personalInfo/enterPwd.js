/**
 *  输入新支付密码
 */

import React, { Component } from 'react';
import PwdControl from '../../../components/pwdControl';
import Fetch from '../../../components/fetch';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import {Toast} from "antd-mobile";

export default class EnterPwd extends Component {
    componentWillMount(){
        document.title = '输入新支付密码';
        document.body.scrollIntoView();
    }

    editPayPwd(val){
        let PayPwdOldPwd = '';
        let PayPwdCode = '';
        // 记得原密码
        if (localStorage.getItem('PayPwdOldPwd')) {
            PayPwdOldPwd = localStorage.getItem('PayPwdOldPwd');

            if (val === PayPwdOldPwd) {
                Toast.info('新密码不能与原密码相同', 1);
                this.pwdControl.reset();
                return
            }
        }

        // 邮箱验证
        if (localStorage.getItem('PayPwdCode')) {
            PayPwdCode = localStorage.getItem('PayPwdCode');
        }

        let params = {
            newPayPwd: Fetch.CryptoJS.MD5(val).toString()
        };

        if (PayPwdOldPwd) {
            params.oldPayPwd = Fetch.CryptoJS.MD5(PayPwdOldPwd).toString();
        }

        if (PayPwdCode) {
            params.verifyCode = PayPwdCode
        }

        console.log(params);
        Fetch.post('/d-app/API/pwd/editPayPwd', params).then(res => {
            Toast.success('修改成功', 1);
            setTimeout(()=> this.props.history.go(-3), 1000);
        }).catch(err => {
        })
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
                <div className="bg modify-pwd-title" style={{ height: 102, marginBottom: 30 }}>
                    <div style={{ fontSize: 16, color: '#909090', textAlign: 'center', marginBottom: 8 }}>
                        请为你的账号{ this._manageAccount() }
                    </div>

                    <div style={{ fontSize: 16, color: '#151A00', textAlign: 'center' }}>
                        输入新的支付密码
                    </div>
                </div>

                <PwdControl ref={ref => this.pwdControl = ref} callBack={(val) => this.editPayPwd(val)} focus={true}/>
            </div>
        )
    }
}