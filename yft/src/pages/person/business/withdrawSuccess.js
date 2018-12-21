/* 提现成功 */
import React from 'react'


export default class WithdrawSuccess extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            countdown: 3
        }
        this.timer = null;
    }

    componentDidMount(){
        this.timer = setInterval( () =>{
            console.log(11)
            this.setState({
                countdown: this.state.countdown-1
            }, () =>{
                if(this.state.countdown === 0){
                    this.props.history.goBack()
                }
            })
        }, 1000)
    }

    componentWillUnmount(){
        clearInterval(this.timer);
        this.timer = null;
    }

    render(){
        return (
            <div
                style={{ width: '100%', height: '100%', background: 'rgba(247, 247, 247, 1)' }}
            >
                <div
                    className="flex flex-col flex-align-items"
                    style={{ width: '100%', height: '12rem', background: '#fff' }}
                >
                    <i
                        className="iconfont icon-chenggong"
                        style={{ color: '#FF8456', fontSize: '2.8rem', marginTop: '3.25rem'}}
                    />
                    <span
                        style={{color: '#ff8456', fontSize: '0.7rem', marginTop: '1.1rem'}}
                    >提现成功</span>
                    <span
                        style={{color: '#999', fontSize: '0.6rem', marginTop: '1.75rem'}}
                    >倒计时{this.state.countdown}S，自动跳转</span>
                </div>
            </div>
        )
    }
}