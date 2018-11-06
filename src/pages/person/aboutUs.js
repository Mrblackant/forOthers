import React from 'react'
import ImageConfig from '../../assets/imageConfig';
import '../../assets/css/common.css';
import '../../assets/css/personal.css';

export default class AboutUs extends React.Component{

    componentWillMount(){
        document.title = "关于油通宝";
        document.body.scrollIntoView();
    }

    render(){
        return (
            <div
                className="flex flex-align-items"
                style={{ background: '#F4F4F4', width: '100%', height: 'auto', flexDirection: 'column', minHeight: '100%', paddingBottom: '2rem'}}
            >
                <img src={ImageConfig.owner_01} alt="" style={{height: '3rem', marginTop: '3rem'}}/>
                <div style={{fontSize: '0.7rem', color: '#444', marginTop: '0.4rem'}}>油通宝</div>
                <div 
                    style={{ marginTop: '1rem'}}
                    className="about-text"
                >
                亲，小油等候小主多时了！小主以后可要多多来看小油哦！每天都有不同的惊喜呢！</div>
				<div className="about-text">
				小油带小主解锁正确的生活姿势！
				</div>
				<div className="about-text">
				"9折加油"活动，只要您充值10800元，在包含当月的接下来12个月内，小主将每月获得1000元加油卡充值码。小秘密：如果小主不想充值油卡，每月也可等额兑换成现金哦！
				</div>
				<div className="about-text">
				小主又胖了？是不是身上成吨的会员卡拖了您的体重呢？都放床底吧！加入油通宝VIP，哪哪都是吃喝玩乐会员价！油通宝1080会员了解一下？让您在体重秤前倍感自信！
				</div>
				<div className="about-text">
				"这片商业区，我承包了！"当小主能说出这样的话时，简直碉堡了有木有！油通宝今儿就给小主这么豪的机会！成为油通宝VIP，小主可以承（na）包（xia）力所能及的商铺，坐收token，实现当年吹过的“升职加薪、当上总经理、出任CEO、迎娶白富美、走上人生巅峰”的牛Between A and C！现在想想，小主是不是有点小激动呢？
				</div>
                <div className="about-text">
				据说小主还在愁自家的小店没人气？悄悄告诉您哦，小主您现在要准备两件事儿：第一，赶紧准备申请成为油通宝合作商户。第二，小主赶紧为自家的小店多招几个店小二吧！不然到时候忙不过来您呐！
				</div>

                <div style={{ marginTop: '1rem', lineHeight: '1rem', fontSize: '0.65rem', color: '#444', width: '15rem' }}>
                    波斯湾石油化工有限公司
                </div>
                <div style={{ marginTop: '0.3rem', lineHeight: '1rem', fontSize: '0.65rem', color: '#444', width: '15rem' }}>
                    客服电话：4001016968
                </div>
                <div style={{width: '100%', textAlign: 'center', marginTop: '2rem'}}>Copyright @2018油通宝All Right Reserved</div>
            </div>
        )
    }
}
