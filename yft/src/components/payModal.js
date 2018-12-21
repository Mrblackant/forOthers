import React, { Component } from 'react';
import Animated from 'animated/lib/targets/react-dom';
import { Toast,Button,ListView,Icon } from 'antd-mobile';
import '../assets/css/common.css';
import '../assets/css/personal.css';
import ImageConfig from '../assets/imageConfig';
import LoadMore from './loadMore';
import Fetch from './fetch';
import PwdControl from './pwdControl';

const width = window.screen.width > 640 ? 640 : window.screen.width;

export default class PayModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            CardHeight: new Animated.Value(0),
            listPositionH: new Animated.Value(0),
            PwdHeight: new Animated.Value(0),
            opacity: new Animated.Value(0),
            cardData: [],
            payTypeName: [
                { noMoreMoney: false,value: '余额',checked: true },
                { noMoreMoney: false,value: '会员卡'},
            ],
            loadState: 1,
            payAmount: '',  //支付金额
            shopsName: '',  //商户名称
            isNoBalance: false, //是否余额不足
        };
        this.payType =  1;	//付款方式: 1.余额支付 2.店铺会员卡支付
        this.checkedCardName = ''; //选中的会员卡名称
        this.checkedCardCode = '';//选中的会员卡卡号
        this.page = 1;
        this.pageSize = 6;
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentWillReceiveProps(nextProps){
        let { payTypeName } = this.state;
        let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));
        let myBalance =  PersonalInfo ? PersonalInfo.balance :'0';//我的余额
        if(Number(nextProps.payAmount) > Number(myBalance)){ //余额不足时
            payTypeName[0].noMoreMoney = true;
            payTypeName[1].noMoreMoney = false;
            this.payType = 0;//当余额不足时，支付方式置为无效状态
        }else{
            payTypeName[0].noMoreMoney = false;
            payTypeName[1].noMoreMoney = false;
        }
        this.setState({
            payTypeName: payTypeName
        })
    }

    componentDidMount(){
        let { payTypeName } = this.state;
        let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));
        let myBalance =  PersonalInfo ? PersonalInfo.balance :'0';//我的余额
        if(Number(this.props.payAmount) > Number(myBalance)){ //余额不足时
            payTypeName[0].noMoreMoney = true;
            payTypeName[1].noMoreMoney = false;
            this.payType = 0;//当余额不足时，支付方式置为无效状态
        }else{
            payTypeName[0].noMoreMoney = false;
            payTypeName[1].noMoreMoney = false;
        }
        this.setState({
            payTypeName: payTypeName
        })
    }

    //模态框显示或关闭
    _showModal(val,shopsName,payAmount){
            let { payTypeName } = this.state;
            let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));
            let myBalance =  PersonalInfo ? PersonalInfo.balance :'0';//我的余额
            if(Number(payAmount) > Number(myBalance)){ //余额不足时
                payTypeName[0].noMoreMoney = true;
                payTypeName[1].noMoreMoney = false;
                this.payType = 0;//当余额不足时，支付方式置为无效状态
            }else{
                payTypeName[0].noMoreMoney = false;
                payTypeName[1].noMoreMoney = false;
            }
            this.setState({
                payAmount:  payAmount,
                payTypeName: payTypeName
            });
        val? this.setState({
                visible: true,
                shopsName:shopsName,
                payAmount: payAmount,
            },()=>{
                Animated.timing(                         // 随时间变化而执行的动画类型
                    this.state.opacity,                    // 动画中的变量值
                    {
                        toValue: 1,
                        duration: 300
                    }
                ).start();
                Animated.timing(                         // 随时间变化而执行的动画类型
                    this.state.CardHeight,                    // 动画中的变量值
                    {
                        toValue: this._remToPx(20),
                        duration: 300
                    }
                ).start();
                Animated.timing(                         // 随时间变化而执行的动画类型
                    this.state.PwdHeight,                    // 动画中的变量值
                    {
                        toValue: 0,
                        duration: 300
                    }
                ).start();
            }) :
            this.setState({visible: false},()=>{
                Toast.hide();
                Animated.timing(                         // 随时间变化而执行的动画类型
                    this.state.CardHeight,                    // 动画中的变量值
                    {
                        toValue: 0,
                        duration: 300
                    }
                ).start();
                Animated.timing(                         // 随时间变化而执行的动画类型
                    this.state.PwdHeight,                    // 动画中的变量值
                    {
                        toValue: 0,
                        duration: 300
                    }
                ).start();
                Animated.timing(                         // 随时间变化而执行的动画类型
                    this.state.listPositionH,                      // 动画中的变量值
                    {
                        toValue: 0,
                        duration: 250
                    }
                ).start(()=>{

                });
                Animated.timing(                         // 随时间变化而执行的动画类型
                    this.state.opacity,                      // 动画中的变量值
                    {
                        toValue: 0,
                        duration: 100
                    }
                ).start(() => {
                });
            })
    }

    /**
     * 我的会员卡列表
     * @param loadState    1-上拉加载更多，2-加载中，3-没有更多数据
     * @private
     */
    _getCardList(type){
        console.log('会员卡列表');
        Toast.loading('加载中...', 0);
        let { cardData }=this.state;
        if (this.state.loadState === 2 || this.state.loadState === 3) {
            return;
        }
        if(type ===1||type===3){
            this.page = 1
        }else{
            this.page++
        }
        this.setState({loadState: 2});
        Fetch.post("d-app/API/memcard/cardList",{
            page: this.page ,
            pageSize: this.pageSize
        }).then((result)=>{
            Toast.hide();
            if(result){
                if(type===1){
                    this.setState({cardData: result});
                }else{
                    cardData.push.apply(cardData,result);
                }
            }
            // 当返回数据长度不等于pageSize时不做上拉加载处理
            if(result.length < this.pageSize){
                this.setState({loadState: 3});
            } else{
                this.setState({loadState: 1});
            }
        }).catch((err)=>{
            this.setState({loadState:3});
            Toast.info(err.errDesc);
        })
    }

    // 会员卡列表----时间处理
    _manageTime(createTime){
        let Time = createTime.split(' ')[0].split('-');
        let befTime = Time[0] + '.' + Time[1] + '.' + Time[2];
        return befTime
    }

    //rem转换px
    _remToPx(rem) {
        const cw = document.documentElement.clientWidth > 640 ? 640 : document.documentElement.clientWidth;
        return rem * (cw / 375 * 20)
    }

    // 页面滑动切换：支付确认页面<--->选择会员卡页面
    /*
    * @params:  type:           1 === 滑到选择会员卡；  -1 === 返回支付确认页面
    * @params:  bookBalance:    会员卡余额
    * @params:  isHas:          有无可用会员卡
    * **/
    togglePage( type,bookBalance,isHas ){
        let { payTypeName } = this.state;
        // let PersonalInfo = JSON.parse(localStorage.getItem('PersonalInfo'));
        // let myBalance = PersonalInfo ? PersonalInfo.balance : '0';//我的余额
        Animated.timing(                         // 随时间变化而执行的动画类型
            this.state.listPositionH,                      // 动画中的变量值
            {
                toValue: type > 0 ? -width : 0,
                duration: 250
            }
        ).start(() => {
            if(type<0){
                if(!isHas){//当是会员卡页面无可用会员卡直接返回时
                    payTypeName[1].noMoreMoney = true;//无可用会员卡
                    if(!payTypeName[0].noMoreMoney){//余额够时，还是选择余额支付
                        payTypeName[0].checked = true;
                        this.payType = 1 ;
                    }else{//余额不够时，支付方式置为无效状态
                        this.payType = 0 ;
                    }
                    this.setState({payTypeName: payTypeName})
                }else{//当是会员卡页面有可用会员卡时
                    if(Number(bookBalance) <= 0 && this.checkedCardName === ''){//有可用会员卡但没选而直接返回
                        if(!payTypeName[0].noMoreMoney){//余额够时，还是选择余额支付
                            payTypeName[0].checked = true;
                            this.payType = 1 ;
                        }else{//余额不够时，支付方式置为无效状态
                            this.payType = 0 ;
                        }
                    }else{
                        this.payType = 2 ;
                    }
                    this.setState({payTypeName: payTypeName})

                }
            }
        });

    }

    //切换支付确认&密码输入框页面
    _toggleKeyBoard(isPwd){
        Animated.timing(                         // 随时间变化而执行的动画类型
            this.state.CardHeight,                      // 动画中的变量值
            {
                toValue: isPwd > 0 ? 0 : this._remToPx(20),
                duration: 200
            }
        ).start(() => {
            Animated.timing(                         // 随时间变化而执行的动画类型
                this.state.PwdHeight,                      // 动画中的变量值
                {
                    toValue: isPwd > 0 ? this._remToPx(6) : 0,
                    duration: 200
                }
            ).start(() =>{
            });
        });
    }

    //会员卡选中样式变化
    toggleCardStyle(rowId){
        let { cardData } = this.state;
        cardData.map((item,index) => {
            item.checked = false;
            if(Number(rowId) === Number(index)){
                item.checked = true;
                this.checkedCardName = item.shopsName;
                this.checkedCardCode = item.cardCode;
                this.bookBalance = item.bookBalance;//会员卡余额
            }
        });
        this.setState({cardData: cardData});

        setTimeout(()=> this.togglePage( -1 ,this.bookBalance, true), 200);
    }

    //改变支付方式 : payType:  //1.余额支付 2.店铺会员卡支付
    _changePayType(index){
        let { payTypeName } = this.state;
        payTypeName.map((item,i) =>{
            item.checked = false;
            if(index === i){
                item.checked = true;
            }
        });
        if(index === 1){        //会员卡支付
            this.togglePage(1);  //进入会员卡选择页面
            this._getCardList(3);//获取会员卡列表
            this.payType = 2 ;
        }else if(index === 0){
            this.payType = 1 ;
        }
        this.setState({
            payTypeName: payTypeName
        })
    }

    //验证支付密码---去支付
    _verifyPwd(payPwd) {
        this._showModal(false);//关闭模态框
        let payInfo = {
            payType: this.payType,
            cardCode: this.checkedCardCode,
            payPassword: payPwd,
        };
        this.props.toPay(payInfo);//通知去支付
    }

    // 会员卡----列表项
    _renderRow(rowData, rowId) {
        let {shopsName, payAmount} = this.state;
        return(
            <div
                key={rowId}
                className='box-sizing'
                style={{position:'relative',width:'17.5rem',height:'7.5rem',margin:0,marginTop:10,overflow:'hidden'}}
                onClick={()=>{
                    if(Number(rowData.bookBalance) < Number(payAmount)){
                        return;
                    }
                    this.toggleCardStyle(rowId)
                }}
            >
                {/*背景图*/}
                <img src={(Number(rowData.bookBalance) < Number(payAmount)) ? ImageConfig.vipCardBg_2 :ImageConfig.vipCardBg}
                     alt=""
                     style={{width:'17.5rem',height:'8rem',color:'#999'}}
                />

                <div
                    className='flex flex-dir  flex-center vip-card'
                    style={{
                        width:'100%',height:'105%',color:'#fff',overflow:'hidden',
                        borderRadius:5,position:'absolute',top:0,left:0,zIndex:1000
                    }}
                >
                    {/*左*/}
                    <div
                        style={{width:'60%',height:'100%',flexDirection:'column'}}
                        className='flex flex-space-between'
                    >
                        <div>
                            <div style={{fontSize:'0.6rem',marginBottom:'0.6rem'}}>
                                { rowData.shopsName }
                            </div>

                            <div style={{fontSize:'0.8rem'}}>
                                { rowData.cardCode}
                            </div>
                        </div>


                        <div
                            className='nowrap'
                        >
                            <i className='iconfont icon-weizhi' style={{fontSize:'0.5rem',marginRight:'0.4rem', opacity:0.8}}/>
                            <span style={{fontSize:'0.6rem', opacity:0.8,lineHeight:1.5}}>
                                { rowData.shopsAddress }
                            </span>
                        </div>
                    </div>

                    {/*右*/}
                    <div
                        className='flex flex-center'
                        style={{
                            marginLeft: '0.5rem',width:'40%',
                            height:'100%',fontSize:'0.6rem',alignItems:'flex-end',
                            flexDirection:'column',justifyContent:'flex-end'
                        }}
                    >
                        <div style={{height:'55%',textAlign:'right'}}>

                            <span style={{opacity:0.8}}>余额</span>

                            <div style={{fontSize: 22,marginTop:'0.3rem',color:'#FCE62B'}}>
                                {parseFloat(rowData.bookBalance).toFixed(2)}
                            </div>
                        </div>

                        <div style={{opacity:0.8,lineHeight:1.5}}>
                            { this._manageTime(rowData.createTime) }
                        </div>
                    </div>

                    {/*本店标志*/}
                    {
                        rowData.shopsName === shopsName?
                            <div style={{position:'absolute',top:'0.32rem',left:'0.5rem'}}>
                                <img src={Number(rowData.bookBalance) < Number(payAmount) ? ImageConfig.vipCard_left_2 : ImageConfig.vipCard_left_1 }
                                     alt=""
                                     style={{width:'2rem',height:'0.8rem'}}
                                />
                            </div>
                            :null

                    }

                    {/*选中样式*/}
                    {
                        rowData.checked ?
                            <div style={{position:'absolute',top:'0.32rem',right:'0.5rem'}}>
                                <img src={ImageConfig.vipCard_right}
                                     alt=""
                                     style={{width:'1.5rem',height:'1.5rem'}}
                                />
                            </div>
                            :null

                    }

                </div>
            </div>
        )
    }

    render(){
        const totalHeight = document.documentElement.clientHeight;

        let { payAmount,cardData, payTypeName } = this.state;
        if (!this.state.visible) return null;
        return(
            <Animated.div
                style={{
                    width: width, height: totalHeight, position:'absolute',top: 0,
                    left: 0, zIndex: 10001, opacity: this.state.opacity,overflow:'hidden'
                }}
            >
                {/*蒙层*/}
                <div
                    style={{
                        width: width, height: totalHeight,
                        backgroundColor: ' rgba(0,0,0,0.6)',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={()=> {this._showModal(false)}}
                />

                {/*支付确认&会员卡选择*/}
                <Animated.div
                    className='bg flex flex-dir'
                    style={{
                        width:'200%',height: this.state.CardHeight,
                        overflow:'hidden',position:'absolute',
                        bottom: 0,left: this.state.listPositionH
                    }}
                >
                    {/*确认支付页面*/}
                    <div
                        className="recharge-details"
                        style={{width:'100%',height: '20rem'}}
                    >
                        {/*头*/}
                        <div className="modal-top"
                             style={{
                                 paddingLeft:12,borderBottomColor: '#dedede',
                                 backgroundColor: '#D8D8D8'
                             }}
                             onClick={() => this._showModal(false)}
                        >

                            <i
                                className="iconfont icon-guanbi"
                                style={{ color: '#979797', fontSize: 14 }}
                            />
                            <span style={{fontSize:16,color:'#333'}}>确认支付</span>

                        </div>

                        {/*支付方式*/}
                        <div
                            style={{padding:0}}
                        >
                            {/*支付金额*/}
                            <div style={{fontSize:30,color:'#333',paddingTop:'1rem',paddingBottom:'1rem',textAlign:'center'}}>
                                { payAmount }
                            </div>

                            <div>
                                <div className='flex flex-center'
                                     style={{width:'100%',flexDirection:'column',justifyContent:'flex-start'}}
                                >
                                    <div style={{fontSize:14,color:'#999',textAlign:'left',width:'100%',paddingLeft:12,paddingBottom:8}}>
                                        付款方式
                                    </div>

                                    {/*分割线*/}
                                    <div style={{height:1,width:'100%',backgroundColor:'rgba(0,0,0,0.1)'}}/>
                                </div>

                                {
                                    payTypeName.map((item,index) =>{
                                        return(
                                            <div
                                                key={index}
                                                style={{opacity: item.noMoreMoney ? 0.5 : 1,width:width,overflow:'hidden'}}
                                                onClick ={() => item.noMoreMoney ? null :this._changePayType(index)}
                                            >
                                                <div
                                                    className="flex flex-dir flex-center flex-space-between"
                                                    style={{padding:12}}
                                                >

                                                    <div className="flex flex-align-items flex-dir">
                                                        <div
                                                            className= {index === 0 ? 'iconfont icon-yue': 'iconfont icon-huiyuanqia1'}
                                                            style={{
                                                                width: 30, fontSize: 22,
                                                                color: index === 0 ? '#FF5745' : '#39A7FF',
                                                            }}
                                                        />

                                                        <div style={{marginLeft:10}}>
                                                            <div style={{ fontSize: 16, color: '#333' }}>
                                                                {item.value}
                                                            </div>
                                                            {
                                                                item.noMoreMoney ?
                                                                    <div style={{ fontSize:12,color:'#999',marginTop:'0.25rem'}}>
                                                                        金额不足
                                                                    </div>
                                                                    : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div
                                                        className='flex flex-dir flex-center'
                                                        style={{width:'70%',justifyContent:'flex-end',overflow:'hidden'}}
                                                    >
                                                        {/*显示商家名称*/}
                                                        {
                                                            index === 1 ?
                                                                <div
                                                                    className='nowrap'
                                                                    style={{width:'80%',fontSize:14,color:'#999',textAlign:'right'}}
                                                                >
                                                                    {this.checkedCardName}
                                                                </div>
                                                                :null
                                                        }

                                                        {/*右图标*/}
                                                        <div
                                                            className={ index === 1 ? "iconfont icon-youjiantou" :"iconfont icon-qia1" }
                                                            style={{
                                                                textAlign:'right',
                                                                fontSize: index === 1 ? 16 :20,
                                                                color: index === 1 ? '#B5B5B5':(item.checked && !item.noMoreMoney)  ? '#FF5745' :'#CBCBCB'
                                                            }}
                                                        />
                                                    </div>


                                                </div>

                                                {/*分割线*/}
                                                <div style={{height:1,width:'100%',backgroundColor:'rgba(0,0,0,0.1)'}}/>
                                            </div>
                                        )
                                    })
                                }

                                {
                                    payTypeName[0].noMoreMoney && payTypeName[1].noMoreMoney ?
                                    <div style={{fontSize:14,color:'red',padding:12,}}>
                                        您的金额不足，请充值！
                                    </div>
                                        :null
                                }


                            </div>
                        </div>

                        {/*确认支付按钮*/}
                        <Button
                            className="linear-gradient"
                            style={{
                                height:'2.1rem',width:'17.55rem',marginLeft:12 ,position:'absolute',bottom:'1rem',
                                color: '#ffffff', fontSize: 16, lineHeight:'2.1rem',alignItems: 'center'
                            }}

                            disabled = {this.payType > 0 ? false : true}
                            onClick={() => {
                                    if(payTypeName[0].noMoreMoney && payTypeName[1].noMoreMoney){//金额不足去充值
                                        this.props.history.push('/main/discount')
                                    }else{
                                        this._toggleKeyBoard(1)
                                    }
                                }
                            }
                        >
                            立即付款
                        </Button>
                    </div>

                    {/*会员卡选择页面*/}
                    <div
                        className="bg recharge-details"
                        style={{width:'100%',height:'20rem'}}
                    >
                        {/*头*/}
                        <div className="modal-top"
                             style={{
                                 paddingLeft:12,borderBottomColor: '#dedede',
                                 backgroundColor: '#D8D8D8'
                             }}
                             onClick={() => {
                                 // 直接返回分两种情况(令会员卡余额为0)：
                                 // 1、没有可用会员卡时直接返回；
                                 // 2、有可用会员卡，但没选而直接返回(可用会员卡要满足条件：会员卡余额大于等于应付金额)
                                 if(!cardData || cardData.length<=0){
                                     this.togglePage(-1,0,false)
                                 }else{
                                     for(let i=0 ; i<cardData.length; i++){
                                         if((Number(cardData[i].bookBalance) >=  Number(payAmount))){//有可用会员卡
                                             this.togglePage(-1,cardData[i].bookBalance,true);
                                             break;

                                         }else{//无可用会员卡
                                             this.togglePage(-1,0,false)
                                         }
                                     }
                                 }}
                             }
                        >
                            <Icon
                                type="left"
                                style={{fontSize: 24, fontWeight: 'bold', color: '#979797',position: 'absolute',top: 0,height: '100%',left:12}}
                            />

                            <span style={{fontSize:16,color:'#333'}}>选择会员卡</span>

                        </div>

                        {
                            cardData.length >0 ?
                                <ListView
                                    style={{width:'100%',height:'18rem',marginLeft:'0.6rem',backgroundColor:'#fff',zIndex:10000}}
                                    dataSource={this.dataSource.cloneWithRows(cardData)}
                                    renderFooter={() => (cardData.length > 2 ? <LoadMore loadState={this.state.loadState}/> : null)}
                                    renderRow={(rowData, sectionId, rowId)=>this._renderRow(rowData, rowId)}
                                    pageSize={6}
                                    renderBodyComponent={() => <div />}
                                    onScroll={() => console.log('scroll')}
                                    scrollRenderAheadDistance={500}
                                    onEndReachedThreshold={10}
                                    onEndReached={() => this._getCardList(2)}
                                />
                                :
                                <div
                                    className='flex flex-center'
                                    style={{width:'100%',height:'18rem',backgroundColor:'#fff',zIndex:10000}}
                                >
                                    <img style={{width: width / 2, height: width / 2}} src={ImageConfig.noData} alt=" "/>

                                </div>
                        }

                    </div>
                </Animated.div>


                {/*支付密码框*/}
                <Animated.div
                    className='bg flex flex-dir'
                    style={{
                        width:'100%',height: this.state.PwdHeight,
                        overflow:'hidden',position:'absolute',
                        bottom: 0,left:0
                    }}
                >
                    <div
                        className="recharge-details"
                        style={{width:'100%',height: '6rem'}}
                    >
                        {/*头*/}
                        <div className="modal-top"
                             style={{
                                 paddingLeft:12,borderBottomColor: '#dedede',
                                 backgroundColor: '#D8D8D8'
                             }}
                        >
                            <i
                                className="iconfont icon-guanbi"
                                style={{ color: '#979797', fontSize: 14 }}
                                onClick={() => this._showModal(false)}
                            />
                            <span style={{fontSize:16,color:'#333'}}>请输入支付密码</span>

                        </div>

                        {/*密码输入框*/}
                        <div style={{textAlign:'center',marginTop:'1rem'}}>
                            <PwdControl
                                ref={ref => this.pwdControl = ref}
                                focus={false}
                                callBack={(val) => this._verifyPwd(val)}
                            />
                        </div>

                    </div>
                </Animated.div>

            </Animated.div>
        )
    }
}

