import React from 'react'

import '../../assets/css/common.css';
import '../../assets/css/personal.css';

const faqList = [
    {
        q: '油通宝折扣来源是什么？',
        a: '大型安全供应商的长期团购合作通过汇集众多消费者的需求，和大型实力强大很安全的供应商及其合作方对接，签订长期团购折扣合同，去中间化，节约成本，为用户获得大力度的消费折扣优惠。'
    },
    {
        q: '一个油通宝账号可以绑定多少张油卡？',
        a: '一个油通宝帐号能绑定多张油卡，一张加油卡可以被多个账号绑定。'
    },
    {
        q: '我充错油卡了怎么办？',
        a: '卡号不存在：如输错油卡号未充值成功的，可以更换油卡充值。已经充值成功：显示充值成功，是不支持退款的，建议您可以去线下加油站让工作人员帮您查看错误卡主手机号码，您可以和错误卡主沟通解决，我司是无法帮您追回的，可给您提供中石油 / 中石化网上充值成功的截图，建议您后续输入卡号的时候一定仔细核对清楚避免造成不必要的损失。'
    },
    {
        q: '加油卡余额怎么查询？',
        a: '油通宝里无法查询油卡余额，建议到加油站或者油卡官网查询。'
    },
    {
        q: '系统提示充值成功，为什么油卡余额没有显示？',
        a: '建议您携带油卡到加油站，告诉工作人员您是在网上充值的需要圈存，圈存之后就可以去加油机刷卡加油了。若您是中石化的油卡，省内加油站圈存没有钱，您的卡有可能是个人多用户卡需要进行预分配在圈存。若您是在省外加油站，是无法圈存的。'
    },
    {
        q: '加油卡充值失败，如何处理？',
        a: '中石化的油卡备付金余额超过5000元：需在加油站先圈存减少备付金余额。若卡号错误：有可能充值到他人的油卡，资金将无法追回。也有可能因为卡号问题无法充值，建议您换卡充值。'
    }
]

export default class Faq extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            curIndex: 0
        }
    }
    componentWillMount() {
        document.title = "常见问答";
        document.body.scrollIntoView();
    }

    onChoseIndex(i){
        console.log(i)
        this.setState({
            curIndex: i
        })
    }

    render() {
        return (
            <div
                className="flex flex-align-items"
                style={{ background: '#fff', width: '100%', flexDirection: 'column', minHeight: '100%' }}
            >
                <div className="container-faq">
                    <ul className="qa-list">
                        {
                            faqList.map( (item, index) =>(
                                <li 
                                    className={`qa-item ${this.state.curIndex === index ?  'open' : ''}`}
                                    key={index}
                                    onClick={ () => this.onChoseIndex(index)}
                                >
                                    <div className="item-top">
                                        <span>{item.q}</span>
                                        <i className="icon icon-right"></i>
                                    </div>
                                    <div className="item-bot">
                                        {item.a}
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        )
    }
}