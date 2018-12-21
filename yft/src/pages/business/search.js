import React from 'react';
import { Modal } from 'antd-mobile';

const Alert = Modal.alert;


export default class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputVal: '',
            inputFocus: false,
            dataList: []
        }
    }

    componentWillMount() {
        document.title = '搜索';
    }

    componentDidMount() {

        if (localStorage.getItem('business')) {
            let businessStorage = JSON.parse(localStorage.getItem('business'));
            if (businessStorage.record) {
                this.setState({
                    dataList: businessStorage.record
                })
            }
        } else {
            localStorage.setItem('business', '{}')
        }

    }

    onChangeVal(value) {
        if (value.length < 20) {
            this.setState({
                inputVal: value
            })
        }

    }

    onFocusInput(key, focus) {
        if (focus) {
            this.input.focus();
        }

        if (key) {
            this.setState({
                inputFocus: true
            })
        } else if (!key && this.state.inputVal === '') {
            this.setState({
                inputFocus: false
            })
        }
    }

    onSearch(item) {

        let businessStorage = JSON.parse(localStorage.business);
        if (item) {
            businessStorage.search = item;
            localStorage.setItem('business', JSON.stringify(businessStorage));
        } else if (this.state.inputVal) {
            if (businessStorage.record) {
                businessStorage.record.push(this.state.inputVal);
                if (businessStorage.record.length > 10) {
                    businessStorage.record.shift();
                }
            } else {
                businessStorage.record = [];
                businessStorage.record.push(this.state.inputVal);
            }
            businessStorage.search = this.state.inputVal;
            localStorage.setItem('business', JSON.stringify(businessStorage));
        }


        this.props.history.goBack();
    }

    detHistory() {
        let businessStorage = JSON.parse(localStorage.business);

        Alert('清空', '确认清空记录？', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定', onPress: () => {
                    businessStorage.record = [];
                    localStorage.setItem('business', JSON.stringify(businessStorage));
                    this.setState({
                        dataList: []
                    })
                }
            },
        ])
    }

    render() {
        const { inputFocus, inputVal } = this.state;
        return (
            <div
                className="container-search"
            >
                <div className="header box-sizing">
                    <div className="search-input-wrap">

                        <div
                            className={inputFocus ? "input-tit focus" : 'input-tit'}
                            onClick={() => this.onFocusInput(true, 'focus')}
                        >
                            <i className="iconfont icon-sousuo"></i>
                            <span
                                style={{ marginLeft: '0' }}
                            >{inputFocus ? '' : '输入商家名'}</span>
                        </div>
                        <input
                            onChange={(e) => this.onChangeVal(e.target.value)}
                            onFocus={() => this.onFocusInput(true)}
                            onBlur={() => this.onFocusInput(false)}
                            value={inputVal}
                        />
                    </div>
                    <div
                        style={{ color: '#FE7C4C', fontSize: '0.65rem' }}
                        onClick={() => this.onSearch()}
                    >
                        搜索
                    </div>
                </div>
                <div
                    className="flex flex-space-between flex-align-items box-sizing"
                    style={{ width: '100%', height: '2rem', padding: '0 1rem' }}
                >
                    <div
                        style={{ color: '#999', fontSize: '0.6rem' }}
                    >历史记录</div>
                    <i
                        className="iconfont icon-lajitong"
                        style={{ color: '#999', fontSize: '0.8rem' }}
                        onClick={() => this.detHistory()}
                    />
                </div>
                <div
                    className="flex flex-multi-line"
                    style={{ width: '100%', padding: '0 1rem', justifyContent: 'flex-start' }}
                >
                    {
                        this.state.dataList.map((item, index) => (
                            <div
                                className="flex flex-justify-content flex-align-items"
                                style={{ width: 'auto', height: '1.4rem', color: '#333', background: '#ebebeb', float: 'left', padding: '0 0.4rem', borderRadius: '0.4rem', marginBottom: '0.6rem', marginRight: '0.6rem' }}
                                key={index}
                                onClick={() => this.onSearch(item)}
                            >
                                {item}
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}