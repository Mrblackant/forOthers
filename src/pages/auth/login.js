/**
 * 登录
 */

import React, { Component } from 'react';
import '../../assets/css/common.css';
import '../../assets/css/main.css';
import ImageConfig from '../../assets/imageConfig';
import {Button} from 'antd-mobile';
import Fetch from '../../components/fetch';
import { Toast } from 'antd-mobile';

const width = window.screen.width > 640 ? 640 : window.screen.width;
class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            mobile : '',
            code: '',
            codeToast:'发送验证码',
            inviteCode: '',
            codeIsFocus: false,
            phoneIsFocus: false,
            inviteCodeIsFocus: false,
            isDisabled: false,
            isLogin: false,
        };
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this._getCode = this._getCode.bind(this);

        this.openId = null;
    }

    componentWillMount(){
        let href = window.location.href.split('?')[1];
        let openId = "";
        if(href){
            openId =  href.split('=')[1];
            this.openId = openId; // 临时存储openId
        }

        document.title = '登录';
    }

    handlePhoneChange(event) {
        // 手机号最大长度11位
        if(event.target.value.length>=11){
            event.target.value =  event.target.value.slice(0,11)
        }
        this.setState({
            mobile: event.target.value,
        });
    }

    handleCodeChange(event){
        // 验证码最大长度6位
        if(event.target.value.length>=6){
            event.target.value =  event.target.value.slice(0,6)
        }
        let val = this._isComplete(this.state.mobile,event.target.value);
        this.setState({
            code: event.target.value,
            isDisabled: val
        });
    }

    handleInviteCodeChange(event){
        // 最大长度6位
        if(event.target.value.length>=6){
            event.target.value =  event.target.value.slice(0,6)
        }
        this.setState({
            inviteCode: event.target.value
        });
    }

    //获取验证码
    _getCode(){
        let mobile = this.state.mobile;
        let errorMsg = '';
        let reg = /^1[345678]\d{9}$/;

        if(!mobile){
            errorMsg = '请填写您的手机号码'
        }else if(!reg.test(mobile)){
            errorMsg = '手机号码格式不正确，请重新输入'
        }

        if(errorMsg){
            Toast.info(errorMsg);
            return;
        }

        let value = 60;
        this.setState({codeToast: value + 's'});
        this.timer = setInterval(()=> {
            value --;
            this.setState({codeToast: value + 's'});

            if (value < 0) {
                clearInterval(this.timer);
                this.setState({
                    codeToast: '发送验证码'
                })
            }
        }, 1000);

        Fetch.post("d-app/API/login/getAuthCode",
            {
                mobile: mobile,
                verCodeType: 1
            }
        ).then((result) =>{
        }).catch((error) =>{
        });
    }

    //判断按钮是否可点击
    _isComplete(mobile,code) {
        if (mobile && code) {
            return true;
        }
        return false;
    }

    // 登录
    _login(){
        let {mobile, code, inviteCode}  = this.state;
        let errorMsg = '';
        let reg = /^\d{6}$/;
        if(!code){
            errorMsg = '请填写验证码'
        }else if(!reg.test(code)){
            errorMsg = '验证码格式不正确，请重新输入'
        }

        if(errorMsg){
            Toast.info(errorMsg);
            return;
        }

        Toast.loading('正在登录...', 0);
        Fetch.post('/d-app/API/login/registAndLogin',
            {
                appType: 'WX',
                mobile: mobile,
                openId: this.openId,
                verifyCode: code,
                recommendCode: inviteCode
            }
        ).then(result => {
            Toast.hide();

            localStorage.setItem('openId', this.openId);
            this.props.history.replace('/') //跳转到首页
        }).catch((err)=>{
        });
    }

    render(){
        return(
            <div
                className="flex flex-center"
                style={{flexDirection:'column',backgroundColor:'#ffffff', overflow:'hidden', paddingTop: 50}}
            >
                {/*logo*/}
                <div
                    style={{height: width/3}}
                >
                    <img
                        src={ImageConfig.owner_01}
                        alt=" "
                        style={{height: width/3}}
                    />
                </div>

                {/*输入文本框*/}
                <div
                    style={{flexDirection:'column',width:width,marginTop:50}}
                    className="flex flex-center"
                >
                    <input
                        value = {this.state.mobile}
                        onChange={this.handlePhoneChange}
                        type="number"
                        style={{
                            width:width*0.93,height:40,
                            fontSize: 14,
                            paddingTop: 12,paddingBottom:12
                        }}
                        placeholder="请输入手机号"
                        onFocus={()=>this.setState({phoneIsFocus: true})}
                        onBlur={()=>this.setState({phoneIsFocus: false})}

                    />
                    {/*线*/}
                    <div style={{
                        width:width*0.93,height:1,
                        backgroundColor:this.state.phoneIsFocus ? '#FE7E4E' : '#ddd'
                    }}/>

                    {/*验证码*/}
                    <div
                        className="flex flex-dir flex-center flex-space-between"
                        style={{marginTop:20}}
                    >
                        {/*验证码输入框*/}
                        <div
                            style={{width:width*0.6,height:40,flexDirection:'column',marginRight:width*0.1}}
                        >
                            <input
                                maxLength={6}
                                type="number"
                                style={{
                                    width: width*0.6,
                                    fontSize: 14,
                                    paddingTop: 12,paddingBottom:12
                                }}
                                placeholder="短信验证码"
                                value = {this.state.code}
                                onChange={this.handleCodeChange}
                                onFocus={()=>this.setState({codeIsFocus: true})}
                                onBlur={()=>this.setState({codeIsFocus: false})}
                            />
                            {/*线*/}
                            <div style={{
                                width:width*0.6,height:1,
                                backgroundColor:this.state.codeIsFocus ? '#FE7E4E' : '#ddd'
                            }}/>
                        </div>

                        {/*发送验证码*/}
                        <div  onClick={this.state.codeToast === '发送验证码' ? this._getCode:null}>
                            <p
                                style={{padding:0,width:width*0.25,color:'#FE7E4E',fontSize:14}}
                                className="flex flex-dir flex-center"
                            >
                                {this.state.codeToast}
                            </p>

                            {/*线*/}
                            <div style={{
                                width:width*0.25,height:1,
                                backgroundColor:this.state.codeToast!=='发送验证码' ? '#FE7E4E' : '#ddd'
                            }}/>
                        </div>
                    </div>

                    {/*推荐码*/}
                    <div
                        className="flex flex-dir flex-center flex-space-between"
                        style={{marginTop:20}}
                    >
                        <div
                            style={{width:width*0.6,height:40,flexDirection:'column',marginRight:width*0.1}}
                        >
                            <input
                                maxLength={6}
                                type="telephone"
                                style={{
                                    width: width*0.6,
                                    height: 42,
                                    fontSize: 14,
                                    paddingTop: 11,
                                    paddingBottom: 11
                                }}
                                placeholder="请输入推荐码"
                                value = {this.state.inviteCode}
                                onChange={this.handleInviteCodeChange.bind(this)}
                                onFocus={()=>this.setState({inviteCodeIsFocus: true})}
                                onBlur={()=>this.setState({inviteCodeIsFocus: false})}
                            />
                            {/*线*/}
                            <div style={{
                                width:width*0.6,height:1,
                                backgroundColor:this.state.inviteCodeIsFocus ? '#FE7E4E' : '#ddd'
                            }}/>
                        </div>

                        <div
                            className="text-center"
                            style={{ width: width*0.25, color: '#666',fontSize: 14 }}
                        >
                            (过河固桥)
                        </div>
                    </div>
                </div>

                {/*按钮*/}
                <div style={{width:width,paddingLeft:12,paddingRight:12,marginTop:50}}>
                    <Button
                        disabled={!this.state.isDisabled}
                        onClick={ () =>this._login()}
                        className="linear-gradient"
                        style={{height:40,color:'#ffffff',fontSize:14,alignItems:'center',lineHeight:3}}
                        activeStyle={{background:'#FE7C4C'}}
                        loading={this.state.isLogin}
                    >
                        登录
                    </Button>

                </div>

            </div>
        )
    }
}

export default Login