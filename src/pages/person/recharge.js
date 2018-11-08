/**
 *  在线充值
 */
import React, { Component } from 'react';
// import "antd/dist/antd.css";
import '../../assets/css/common.css';
import '../../assets/css/recharge.css';
import { Button, Radio } from 'antd-mobile';
const width = window.screen.width > 640 ? 640 : window.screen.width;
export default class Recharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPrice: null
        };
        this.pricelist = [{
            num: '50元'
        }, {
            num: '100元'
        }, {
            num: '200元'
        }, {
            num: '1000元'
        }];
    }
    chosePrice(index) {
        console.log(index)
        this.setState({
            selectedPrice: index
        })
    }
    componentWillMount() {
        document.title = '油通宝';
        document.body.scrollIntoView();
    }

    render() {
        return (
            <div>
            <div style={{height:width/5.7,paddingLeft:width/24,paddingRight:width/24}}
                className="an_recharge_wapper flex flex-space-between  flex-align-items"
            >
              {/*头像区*/}
              <div
              className="flex flex-space-between"
              >
                  <span style={{width:width/8,height:width/8,marginRight:width/57.6}}
                  className="an_recharge_img"
                  ></span>

                  <span>
                  <p 
                  className="an_recharge_name"
                  style={{fontSize:17}}
                  >
                      用户名
                  </p>
                  <span className="an_recharge_ye">
                      余额：0.00
                  </span>
                  </span>
              </div>
                {/*箭头*/}
                <i 
                className="iconfont icon-youjiantou"></i>
            </div>
        {/*充值金额*/}
        <div
        >
        <p
        style={{paddingLeft:width/24,paddingRight:width/24}}
         className="an_recharge_czje">
            充值金额
        </p>
        <div
        className="an_recharge_chose flex flex-align-items"
        style={{height:width/6.2,paddingLeft:width/24,paddingRight:width/24}}
        >
        {this.pricelist.map((item,index)=>{
            return (
                    <span 
                    onClick = {() => {
                        this.chosePrice(index)
                                }}
                    style={{ backgroundColor:index===this.state.selectedPrice ? '#0099E5' : '#DBDBDB',marginLeft:index>0 ? width/25 : 0,width:width/5,height:width/12.5}}
                    className="an_for_price flex flex-center">
                    <span>{item.num}</span>
                    </span>
                )
        })}
        </div>
        <Button type="primary" block="true"
style={{borderRadius:44,marginTop:width/25.8}}
         >确认购买</Button>
        </div>
    {/*链接*/}
    <p className="an_recharge_href">
        <a href="充值记录查询>">充值记录查询></a>
        <a href="充值记录查询>">通宝不足？点击充值></a>
    </p>
        </div>
        )
    }
}

// export default Recharge