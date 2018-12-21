/**
 *  设置支付密码
 */

import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import PwdControl from '../../../components/pwdControl';
import Fetch from '../../../components/fetch';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';

class ModifyPwd extends Component {
    componentWillMount(){
        document.title = '设置支付密码';
        document.body.scrollIntoView();
    }

    // 输入支付密码
    onSubmit(val){
        Toast.loading('正在提交...', 0);
        Fetch.post('/d-app/API/pwd/editPayPwd', {
            newPayPwd: Fetch.CryptoJS.MD5(val).toString()
        }).then(res => {
            Toast.success('设置成功', 1);
            let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));
            PersonalInfo.isPayPwd = 2;
            localStorage.setItem('PersonalInfo', JSON.stringify(PersonalInfo));
            setTimeout(()=> this.props.history.goBack(), 1000);
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
                        请为账号{ this._manageAccount() }
                    </div>

                    <div style={{ fontSize: 16, color: '#151A00', textAlign: 'center' }}>
                        设置支付密码
                    </div>
                </div>

                <PwdControl callBack={ (val)=> this.onSubmit(val) }/>
            </div>
        )
    }
}

export default ModifyPwd;