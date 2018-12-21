//提示框
import React, { Component } from 'react';
import '../assets/css/common.css';
import '../assets/css/personal.css';

const width = window.screen.width > 640 ? 640 : window.screen.width;

export default class PromptModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            content: ''
        };
        this.fetch = null;
        this.obj1 = {

        };
        this.obj2={}
    }

    _choseModal(obj){
        this.setState({
            modalShow: false
        });
        this.props.ConfirmCancel ? this.props.ConfirmCancel(obj.city, obj.longitude, obj.latitude, obj.province, obj.key) : null
    }

    // 打开模态框
    _showModal(val,content, obj1, obj2){
        this.setState({
            modalShow: val,
            content: content
        });
        if(obj1){
            this.obj1 = obj1;
        }
        if(obj2){
            this.obj2 = obj2;

        }
    }

    render() {
        let {modalShow} = this.state;
        return (
              <div
                    className="flex flex-center"
                    style={{
                        position: 'fixed', top: 0, left: 0, width: width, height: '100%',
                        zIndex: 1000, display: modalShow ? 'flex' : 'none'
                    }}
                    onClick ={() => {
                        this.setState({modalShow: false})
                    }}
                >
                    <div
                        style={{width: width, height: '100%', position: 'absolute', background: 'rgba(0,0,0,0.5)', zIndex: -1}}
                    />
                    <div
                        className="flex flex-col  flex-center flex-space-between"
                        style={{width: 270, height: 140, borderRadius: '5px', background: '#fff', position: 'relative'}}
                    >
                        <div
                            className='flex flex-dir flex-center'
                            style={{width:'100%',height:40}}
                        >
                             <span
                                 style={{fontSize:18,color:'#000'}}
                             >
                                {this.props.title}
                            </span>
                        </div>

                        <div
                            className='flex flex-dir flex-center'
                            style={{width:'100%',height:70}}
                        >
                            <span
                                style={{color: '#888',  fontSize: 16}}
                            >
                                {this.state.content}
                            </span>

                        </div>

                        <div
                            className="flex flex-dir flex-center flex-space-between"
                            style={{borderTop: '1px solid #eee',width:'100%',height:40}}
                        >
                            <div
                                className='flex flex-center'
                                style={{flexDirection:'column',width:'50%',height:'100%',fontSize:18,color:'#000'}}
                                onClick={() => this._choseModal(this.obj2)}
                            >
                                取消
                            </div>

                            <div style={{height:'100%',width:1,backgroundColor:'#eee'}}/>

                            <div
                                className='flex flex-center'
                                style={{flexDirection:'column',width:'50%',height:'100%',fontSize:18,color:'#108ee9'}}
                                onClick={() => this.props.ConfirmCancel(this.obj1.city, this.obj1.longitude, this.obj1.latitude, this.obj1.province, this.obj1.key)}
                            >
                                确定
                            </div>
                        </div>

                    </div>
                </div>
        )
    }
}