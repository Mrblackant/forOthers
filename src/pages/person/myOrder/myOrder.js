/**
 *  我的订单
 */

import React, { Component } from 'react';
import '../../../assets/css/common.css';
import '../../../assets/css/main.css';
import AllOrder from './allOrder';
import PreRecharge from './preRecharge';
import OilRecharge from './oilRecharge';
import Living from './living';

const width = window.screen.width > 640 ? 640 : window.screen.width;

export default class MyOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        };
    }

    componentWillMount() {
        document.title = '我的订单';
        document.body.scrollIntoView();
    }

    componentDidMount() {
        let SelIndex = localStorage.getItem('SelectedInfo');
        if(SelIndex) {
            this.setState({selectedIndex: SelIndex});
            this.tabHeader._setIndex(SelIndex);
        }else{
            this.setState({selectedIndex: 0});
        }
    }

    // 显示不同tab页
    _showPage(){
        let  {selectedIndex} = this.state;
        if(Number(selectedIndex) === 0){
            return <AllOrder history={this.props.history} />
        }
        if(Number(selectedIndex) === 1){
            return  <PreRecharge history={this.props.history} />
        }
        if(Number(selectedIndex) === 2){
            return  <OilRecharge history={this.props.history} />
        }
        if(Number(selectedIndex) === 3){
            return <Living history={this.props.history} />
        }
    }

    render() {
        return (
            <div>
                {/*tab头部*/}
                <TabHeader
                    history={this.props.history}
                    ShowPage = {(index) =>{
                        this.setState({selectedIndex: index});

                    }}
                    ref = {ref => this.tabHeader = ref}
                />

                {/*显示内容*/}
                {
                    this._showPage()

                }

            </div>

        )
    }
}

// tab头部
class TabHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [
                { title: '全部订单',checked:'true' },
                { title: '预存充值' },
                { title: '油卡充值' },
                { title: '生活消费' },
            ]
        };
    }

    _setIndex(index){
        this.state.tabs.map((obj,i) => {
            obj.checked = false;
            if(Number(index) === Number(i)){
                obj.checked = true;
            }
        });
        this.setState({
            tabs: this.state.tabs
        });
    }

    _changeStyle(index){
        this.state.tabs.map((obj,i) => {
            obj.checked = false;
            if(index === i){
                obj.checked = true;
                this.props.ShowPage(index)
            }
        });
        this.setState({
            tabs: this.state.tabs
        });
    }

    render(){
        let {tabs} = this.state;
        return(
            <div
                className='flex flex-dir flex-center'
                style={{width: width,height:'2rem',position:'fixed',left:0,top:0}}
            >
                {
                    tabs.map((item,index) =>{
                        return(
                            <div
                                key = {index}
                                className= {item.checked ? 'flex flex-center tabActive bg tabCenter':' flex flex-center  bg tabCenter'}
                                style={{
                                    width:width/4,height:'100%',flexDirection:'column',
                                    color: item.checked ? '#FE8658':'#666',fontSize:14,
                                }}
                                onClick = {() => {
                                    localStorage.setItem('SelectedInfo',index);
                                    this._changeStyle(index);
                                }}
                            >
                                {item.title}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}


