/* 提现 */
import React from 'react'
import { Button, Modal, Toast } from 'antd-mobile';

import PwdControl from '../../../components/pwdControl';
import Fetch from '../../../components/fetch';

export default class Withdraw extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            commission: 0,
            modal: false
        }
        this.isPayPwd = 1;
    }

    componentDidMount(){
        let commission = this.props.history.location.state.commission;
        if(localStorage.PersonalInfo){
            const personalInfo = JSON.parse(localStorage.PersonalInfo);
            this.isPayPwd = personalInfo.isPayPwd;
        }
        this.setState({
            commission
        })
    }

    //提现
    onSubmit(){
        if(this.isPayPwd === 2) {
            this._changeModal(true);
        } else {
            this.props.history.push('/modifyPwd', { pageType: 5 })
        }
    }

    //验证密码
    _verifyPwd(val) {
        
        this.setState({
            modal: false
        })

        Toast.loading('加载中');
        console.log(this.state.commission);
        console.log(typeof this.state.commission);
        Fetch.post('d-app/API/order/withdrawal', {
            commission: this.state.commission,
            payPassword: Fetch.CryptoJS.MD5(val).toString()
        }).then( res =>{
            Toast.hide();
            this.props.history.push('/withdrawSuccess');
        }).catch( err =>{
            console.log(err)
        })
    }

    //modal的显示关闭
    _changeModal(val) {
        this.setState({
            modal: val
        })
    }

    _isComplete(){
        console.log(this.state.commission)
        if (this.state.commission === 0){
            return false
        } 
        
        return true
    }

    render(){
        return (
            <div
                style={{width: '100%', height: '100%', background: 'rgba(247, 247, 247, 1)'}}
            >
                <div
                    className="flex flex-col flex-align-items"
                    style={{width: '100%', height: '8rem', background: '#fff'}}
                >
                    <div
                        style={{ color: '#FF8859', fontSize: '1.3rem', marginTop: '3.1rem'}}
                    >
                        {this.state.commission}
                    </div>
                    <div
                        style={{ color: '#999999', fontSize: '0.7rem', marginTop: '0.9rem'}}
                    >当前佣金</div>
                </div>
                <Button
                    style={{width: '17.55rem', margin: '2.4rem auto 0', color: '#fff'}}
                    className="linear-gradient"
                    activeStyle={{ background: '#FE7F4F', color: '#fff' }}
                    disabled={!this._isComplete()}
                    onClick={() => this.onSubmit()}
                >
                    提现
                </Button>
                <Modal
                    popup
                    visible={this.state.modal}
                    onClose={() => this._changeModal(false)}
                    animationType="slide-up"
                >
                    <div className="paymentPwd">
                        <div className="paymentPwd-top modal-top">
                            <span>请输入支付密码</span>
                            <i
                                className="iconfont icon-guanbi"
                                onClick={() => this._changeModal(false)}
                            />
                        </div>
                        <div className="input-wrap box-sizing">
                            {
                                this.state.modal ?
                                    <PwdControl
                                        ref={ref => this.pwdControl = ref}
                                        focus={false}
                                        callBack={(val) => this._verifyPwd(val)}
                                    /> : null
                            }
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}