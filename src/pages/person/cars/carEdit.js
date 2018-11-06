/**
 *  车辆信息编辑
 */

import React, { Component } from 'react';
import '../../../assets/css/common.css';
import '../../../assets/css/personal.css';
import { List, Button, Toast, Modal } from 'antd-mobile';
import Fetch from "../../../components/fetch";

const Item = List.Item;
// 汽车品牌
const VehicleBrandArr = [
    "奥迪",
    "阿斯顿·马丁",
    "阿尔法·罗密欧",
    "ARCFOX",
    "爱驰汽车",
    "本田",
    "别克",
    "宝马",
    "宝骏",
    "奔驰",
    "比亚迪",
    "标致",
    "奔腾",
    "保时捷",
    "北汽新能源",
    "北汽昌河",
    "北汽幻速",
    "北京",
    "北汽威旺",
    "北汽绅宝",
    "宾利",
    "北汽制造",
    "宝沃",
    "比速汽车",
    "巴博斯",
    "布加迪",
    "北汽瑞丽",
    "BYTON",
    "长安轿车",
    "长安欧尚",
    "长城",
    "长安轻型车",
    "长安跨越",
    "成功",
    "大众",
    "东风风光",
    "东风小康",
    "东风风行",
    "东风风神",
    "东南",
    "DS",
    "道奇",
    "东风·郑州日产",
    "东风风度",
    "东风御风",
    "东风瑞泰特",
    "丰田",
    "福特",
    "福田",
    "法拉利",
    "福迪",
    "菲亚特",
    "福汽启腾",
    "广汽传祺",
    "观致汽车",
    "广汽新能源",
    "广汽吉奥",
    "GMC",
    "广汽中兴",
    "国金汽车",
    "哈弗",
    "红旗",
    "海马",
    "汉腾",
    "黄海",
    "华泰",
    "华泰新能源",
    "哈飞",
    "海马商用车",
    "华颂",
    "海格",
    "华骐",
    "吉利汽车",
    "Jeep",
    "捷豹",
    "江淮",
    "金杯",
    "江铃",
    "金龙",
    "君马",
    "九龙",
    "金旅客车",
    "江铃集团新能源",
    "江铃集团轻汽",
    "捷途",
    "江南",
    "江淮大众",
    "凯迪拉克",
    "克莱斯勒",
    "凯翼",
    "开瑞",
    "卡威",
    "科尼赛克",
    "康迪全球鹰电动汽车",
    "KTM",
    "卡尔森",
    "雷克萨斯",
    "林肯",
    "路虎",
    "兰博基尼",
    "猎豹汽车",
    "铃木",
    "雷诺",
    "陆风",
    "力帆",
    "领克",
    "劳斯莱斯",
    "雷丁电动",
    "路特斯",
    "莲花",
    "理念",
    "陆地方舟",
    "联宝订单",
    "零跑",
    "马自达",
    "名爵",
    "MINI",
    "玛莎拉蒂",
    "迈凯伦",
    "纳智捷",
    "讴歌",
    "欧宝",
    "Polestar",
    "奇瑞",
    "起亚",
    "启辰",
    "庆铃",
    "前途汽车",
    "奇点汽车",
    "日产",
    "荣威",
    "斯柯达",
    "三菱",
    "斯巴鲁",
    "上汽大通MAXUS",
    "SWM斯威汽车",
    "smart",
    "双龙",
    "思铭",
    "陕汽通家",
    "特斯拉",
    "腾势",
    "五菱",
    "WEY",
    "沃尔沃",
    "五十铃",
    "潍柴英致",
    "蔚来汽车",
    "威马汽车",
    "威麟",
    "现代",
    "雪佛兰",
    "雪铁龙",
    "小鹏汽车",
    "西雅特",
    "野马汽车",
    "英菲尼迪",
    "一汽",
    "驭胜",
    "依维柯",
    "云度新能源",
    "永源",
    "雅宾纳",
    "御捷",
    "裕路",
    "众泰",
    "中华",
    "知豆",
    "中欧奔驰房车",
    "中兴",
    "浙江卡尔森",
    "中通客车",
    "之诺",
];

// 汽油型号
const OilModelArr = [
    '0#', '89#', '92#', '95#'
];

class CarEdit extends Component {
    constructor(props){
        super(props);
        let vehicleInfo = JSON.parse(localStorage.getItem('vehicleInfo'));

        this.state = {
            disabled: true,
            licensePlate: vehicleInfo && vehicleInfo.licensePlate ? vehicleInfo.licensePlate : '',
            oilModel: vehicleInfo && vehicleInfo.oilModel ? vehicleInfo.oilModel : '',
            vehicleBrand: vehicleInfo && vehicleInfo.vehicleBrand ? vehicleInfo.vehicleBrand : '',
            vehicleImg: vehicleInfo && vehicleInfo.vehicleImg ? vehicleInfo.vehicleImg : ''
        };

        this.imgObj = '';
        this.vehicleId = vehicleInfo && vehicleInfo.vehicleId ? vehicleInfo.vehicleId : 0;
    }

    componentWillMount(){
        document.title = localStorage.getItem('vehicleInfo') ? '车辆信息编辑' : '新增车辆';
        document.body.scrollIntoView();
    }

    componentDidMount(){
        this.canCommit();
    }

    // 是否可提交
    canCommit(){
        let { licensePlate, oilModel, vehicleBrand, vehicleImg } = this.state;
        let disabled = true;

        if (licensePlate && oilModel && vehicleBrand && vehicleImg) {
            disabled = false;
        }

        this.setState({disabled: disabled});
    }

    // 获取图片地址
    _getObjectURL(file) {
        let url = null;
        if (window.createObjcectURL !== undefined) {
            url = window.createOjcectURL(file);
        } else if (window.URL !== undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL !== undefined) {
            url = window.webkitURL.createObjectURL(file);
        }

        return url;
    }

    /**
     * 提交
     * @params, licensePlate    车牌号
     * @params, oilModel        用油型号
     * @params, vehicleBrand    品牌
     * @params, vehicleId       车辆id
     * @params, vehicleImgFile  上传图片对象
     */
    _commit(){
        let { licensePlate, oilModel, vehicleBrand } = this.state;
        let regCarCode = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/;
        if (!regCarCode.test(licensePlate)) {
            Toast.info('请输入正确的车牌号', 1);
            return
        }

        Toast.loading('加载中...', 0);
        Fetch.post('/d-app/API/car/carEdit', {
            licensePlate: licensePlate,
            oilModel: oilModel,
            vehicleBrand: vehicleBrand,
            vehicleId: this.vehicleId,
            vehicleImgFile: this.imgObj
        }).then(result=> {
            Toast.success('提交成功', 1);
            setTimeout(()=> this.props.history.goBack(), 1000);
        }).catch(error=> {
        })
    }

    render(){
        let { licensePlate, oilModel, vehicleBrand, vehicleImg } = this.state;

        return(
            <div style={{ paddingTop: 8, height: '100%' }} className="relative">
                <SelectModel
                    ref={ref => this.selectModel = ref}
                    callBack={(val, type)=> {
                        if (type === 1) {
                            this.setState({vehicleBrand: val}, ()=> this.canCommit())
                        } else if (type === 2){
                            this.setState({oilModel: val}, ()=> this.canCommit())
                        }
                    }}
                />

                <List style={{ marginBottom: 8 }}>
                    <Item
                        arrow="horizontal"
                        extra={<div className="nowrap" style={{ fontSize: 14, color: '#909090' }}>{vehicleBrand}</div>}
                        multipleLine
                        onClick={() => this.selectModel.modalManage(true, VehicleBrandArr, 1)}
                    >
                        <div className="flex flex-align-items flex-dir">
                            <div style={{ fontSize: 14, color: '#444' }}>汽车品牌</div>
                        </div>
                    </Item>

                    <Item
                        arrow="horizontal"
                        extra={<div className="nowrap" style={{ fontSize: 14, color: '#909090' }}>{oilModel}</div>}
                        multipleLine
                        onClick={() => this.selectModel.modalManage(true, OilModelArr, 2)}
                    >
                        <div className="flex flex-align-items flex-dir">
                            <div style={{ fontSize: 14, color: '#444' }}>汽油型号</div>
                        </div>
                    </Item>

                    <div className="car-edit-input flex flex-center flex-space-between flex-dir"
                         style={{ paddingLeft: 15, paddingRight: 15 }}>
                        <span style={{ fontSize: 14, color: '#444444' }}>车牌号码</span>

                        <input
                            type="text"
                            maxLength={10}
                            style={{ textAlign: 'right', fontSize: 14, color: '#909090', width: '75%' }}
                            placeholder="请输入车牌号"
                            value = {licensePlate}
                            onChange={(e) => {
                                this.setState({licensePlate: e.target.value}, ()=> this.canCommit());
                            }}
                        />
                    </div>
                </List>

                <div style={{ padding: 15 }}>
                    <div style={{ fontSize: 14, color: '#333845', paddingBottom: 18 }}>
                        汽车图片
                    </div>

                    {
                        vehicleImg ?
                            <div className="car-edit-add relative">
                                <img style={{width: 80, height: 80}} src={vehicleImg} alt=" "/>

                                <div
                                    onClick={()=> {
                                        this.setState({vehicleImg: ''}, ()=> this.canCommit());
                                        this.imgObj = '';
                                    }}
                                    style={{width: 30, height: 30, top: -15, left: -15, backgroundColor: 'rgba(0, 0, 0, 0.05)', borderRadius: 15}}
                                    className="absolute flex flex-center"
                                >
                                    <div className="iconfont icon-quxiao" style={{color: '#999'}}/>
                                </div>
                            </div>
                            :
                            <div
                                className="car-edit-add relative"
                                style={{ paddingTop: 13 }}
                            >
                                <input
                                    className="car-edit-img-input absolute"
                                    style={{top: 0, left: 0, opacity: 0}}
                                    type="file" name="image" accept="image/*"
                                    onChange={(event)=> {
                                        
                                        this.imgObj = event.target.files[0];
                                        let vehicleImg = this._getObjectURL(event.target.files[0]);
                                        let picName = this.imgObj.name;
                                        console.log(this.imgObj);
                                        if (/.downloading$/.test(picName) || !this.imgObj || this.imgObj.type.indexOf("image/") === -1) {   // 非图片格式
                                            Toast.info('请选择正确的图片', 1);
                                        } else {
                                            this.setState({vehicleImg: vehicleImg}, ()=> this.canCommit());
                                        }
                                    }}
                                />

                                <div
                                    className="flex flex-center car-edit-iconFont margin-auto"
                                >
                                    +
                                </div>
                                <div className="text-center" style={{fontSize: 12, color: '#909090', marginTop: 8}}>添加图片</div>
                            </div>
                    }
                </div>

                <div style={{bottom: 20, left: 0, width: '100%', paddingLeft: 15, paddingRight: 15}} className="absolute">
                    <Button
                        onClick={()=> this._commit()}
                        disabled={this.state.disabled}
                        className="linear-gradient info-edit-btn"
                        style={{ fontSize: 14, color: '#fff' }}
                        activeStyle={{ background: '#FE7F4F' }}
                    >
                        提交
                    </Button>
                </div>
            </div>
        )
    }
}

// 下拉选择框
class SelectModel extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            data: [],
            type: 0
        };
    }

    // 模态框展示
    modalManage(val, data, type){
        this.setState({visible: val, data: data ? data : [], type: type ? type : 0});
    }

    render(){
        let { visible, data, type } = this.state;

        return(
            <Modal
                popup
                visible={visible}
                onClose={()=> this.modalManage(false)}
                animationType="slide-up"
            >
                <div>
                    <div
                        style={{ textAlign: 'left', paddingLeft: 15, paddingTop: 10, paddingBottom: 10, fontSize: 14 }}
                    >
                        {type === 1 ? '请选择汽车品牌' : '请选择汽油型号'}
                    </div>

                    <div style={{ height: type === 1 ? 300 : null, overflowY: 'scroll' }}>
                        <List>
                            {
                                data.map((item, index)=> {
                                    return(
                                        <Item
                                            key={index}
                                            onClick={()=> {
                                                this.props.callBack(item, type);

                                                this.modalManage(false);
                                            }}
                                        >
                                            <div style={{fontSize: 14, color: '#444'}}>
                                                {item}
                                            </div>
                                        </Item>
                                    )
                                })
                            }
                        </List>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default CarEdit;