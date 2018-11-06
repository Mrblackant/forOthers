/**
 * 输入框控件
 * type:      1-支付密码输入，2-发送验证码
 */
import React, { Component } from 'react';
import '../assets/css/common.css';
import '../assets/css/personal.css';
import {Toast} from "antd-mobile/lib/index";
import Fetch from "./fetch";

const ScreenWidth = window.screen.width > 640 ? 640 : window.screen.width;
class PwdControl extends Component {
    // 重置状态
    reset(){
        this.payPwd.reset();
    }

    render(){
        console.log('render1')
        let { callBack, type } = this.props;

        if (type === 2) {
            return <VerifyCode callBack={(val)=> callBack(val)}/>
        }
        
        return <PayPwd ref={ref => this.payPwd = ref} callBack={(val) => callBack(val)} focus={this.props.focus}/>
    }
}

// 支付密码
class PayPwd extends Component{
    constructor(props){
        super(props);
        this.state = {
            pwdArr: [{}, {}, {}, {}, {}, {}],
            value: ''
        }
    }

    componentDidMount(){
        if(this.props.focus){
            this._focus();
        }
    }

    // 数据重置
    reset(){
        this.setState({
            pwdArr: [{}, {}, {}, {}, {}, {}],
            value: ''
        });
    }

    // 使输入框获取焦点
    _focus(){
        this.refs.input.focus();
/*         this.refs.input.onclick =  () => {
            this.refs.input.focus();
        }
        this._trigger(this.refs.input, 'click'); */
    }

/*     _trigger(elem, event) {
        console.log(22)
        let myEvent = document.createEvent('Event');        
        myEvent.initEvent(event, true, true);      
        elem.dispatchEvent(myEvent);
    } */

    // 输入支付密码
    enterPwd(text){
        let { pwdArr } = this.state;
        let textValue = text.replace(/[^0-9]/g, '');
        for (let i=0; i<pwdArr.length; i++) {
            if (textValue[i]) {
                pwdArr[i].value = textValue[i];
            } else {
                pwdArr[i].value = '';
            }
        }
        this.setState({pwdArr: pwdArr, value: textValue});
        if (textValue.length === 6) {
            textValue = textValue.slice(0, 6);
            if (!this.continuousNumbers(textValue)) {
                Toast.info('不可输入连续的数字', 1);
                this.reset();
                return
            }
            if (/([0-9])\1{5}/.test(textValue)) {
                Toast.info('不可输入重复的数字', 1);
                this.reset();
                return
            }
            this.reset();
            this.props.callBack(textValue);
        }
    }

    //连续数字判断
    continuousNumbers(s) {
        let str = s.replace(/\d/g, function($0, pos) {
            return parseInt($0)-pos;
        });

        // 顺增
        if (/^(\d)\1+$/.test(str)) {
            return false
        }

        str = s.replace(/\d/g, function($0, pos) {
            return parseInt($0)+pos;
        });

        // 顺减
        if (/^(\d)\1+$/.test(str)) {
            return false;

        }

        return true;
    }

    render(){
        
        return(
            <div style={{padding: '0 0.8rem' }}>
                <div style={{ height: 0 }}>
                    <input
                        ref={'input'}
                        style={{opacity: 0, width: '200%', height: '100%', marginLeft: '-100%', textIndent: '-999rem' }}
                        type="tel"
                        maxLength={6}
                        value={this.state.value}
                        onChange={(e)=> this.enterPwd(e.target.value)}
                    />
                </div>

                <div className="flex flex-center flex-dir border" style={{ borderRadius: 2 }} onClick={()=> this._focus()}>
                    {
                        this.state.pwdArr.map((item, index)=> {
                            let className = "flex flex-center border-right";
                            if (index === (this.state.pwdArr.length - 1)) {
                                className = "flex flex-center"
                            }

                            return (
                                <div className={className} style={{ width: (ScreenWidth - 37) / 6, height: '2rem' }} key={index}>
                                    {
                                        item.value || (item.value === 0) ?
                                            <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#333845' }}/>
                                            : null
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

// 验证码
class VerifyCode extends Component {
    constructor(props){
        super(props);
        this.state = {
            codeArr: [{}, {}, {}, {}, {}, {}],
            value: ''
        }
    }

    componentDidMount(){
        this._focus();
    }

    // 使输入框获取焦点
    _focus(){
        this.refs.input.focus();
    }

    // 输入验证码
    enterCode(text){
        for (let i=0; i<text.length; i++) {
            if (!/^[.0-9]+$/.test(text[i])) {
                text = text.split(text[i])[0];
                break
            }
        }

        let { codeArr } = this.state;
        let textValue = text.replace(/[^0-9]/g, '');

        for (let i=0; i<codeArr.length; i++) {
            if (textValue[i]) {
                codeArr[i].value = textValue[i];
            } else {
                codeArr[i].value = '';
            }
        }

        this.setState({pwdArr: codeArr, value: textValue});

        if (textValue.length === 6) {
            textValue = textValue.slice(0, 6);

            this.setState({
                codeArr: [{}, {}, {}, {}, {}, {}],
                value: ''
            });

            this.props.callBack(textValue);
        }
    }

    // 重新发送
    reset(){
        this.refs.input.blur();
        this.setState({ codeArr: [{}, {}, {}, {}, {}, {}] });
        Toast.loading('加载中...', 1);

        setTimeout(()=> {
            this._focus();
        }, 1000);
    }

    render(){
        return(
            <div style={{ padding: 15 }}>
                <div style={{ height: 0 }}>
                    <input
                        ref={'input'}
                        style={{opacity: 0, height: '100%', textIndent: '-999rem', marginLeft: '-100%', width: '200%'}}
                        type="number"
                        maxLength={6}
                        value={this.state.value}
                        onChange={(e)=> this.enterCode(e.target.value)}
                    />
                </div>

                <div className="flex flex-center flex-dir" style={{ borderRadius: 2 }} onClick={()=> this._focus()}>
                    {
                        this.state.codeArr.map((item, index)=> {
                            return(
                                <div
                                    className = "flex flex-center"
                                    key={index}
                                    style={{ width: (ScreenWidth - 37) / 6, height: 40 }}
                                >
                                    <div
                                        className="border-bottom flex flex-center"
                                        style={{ width: '76%', height: 40, borderBottomColor: '#979797', fontSize: 30 }}
                                    >
                                        {item.value}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <ReCode reset={()=> this.reset()}/>
            </div>
        )
    }
}

// 重新发送验证码
class ReCode extends Component{
    constructor(props){
        super(props);
        this.state = {
            sendCode: false,
            value: '发送验证码'
        };

        this.timer = null;      //初始化定时器
    }

    // componentDidMount(){
    //     this._sendCode(true);
    // }

    componentWillUnmount(){
        this.timer && clearInterval(this.timer);
    }

    /**
     * 发送短信
     */
    _sendCode(val){
        this._sendMsg();
        !val && this.props.reset();

        let value = 60;
        this.setState({sendCode: true, value: value + ' (s)'});

        this.timer = setInterval(()=> {
            value --;
            this.setState({value: value + ' (s)'});

            if (value < 0) {
                clearInterval(this.timer);
                this.setState({
                    sendCode: false,
                    value: '发送验证码'
                })
            }
        }, 1000)
    }

    // 发送验证码
    _sendMsg(){
        let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));
        Fetch.post("d-app/API/login/getAuthCode",
            {
                mobile: PersonalInfo.mobile,
                verCodeType: 2
            }
        ).then((result) =>{
        }).catch((error) =>{
        });
    }

    render(){
        return(
            <div
                onClick={()=> {
                    if (this.state.sendCode) return;
                    this._sendCode();
                }}
                className="flex flex-center"
                style={{ width: ScreenWidth - 30, height: 50, fontSize: 14, color: '#057DFF' }}
            >
                {this.state.value}
            </div>
        )
    }
}

export default PwdControl;