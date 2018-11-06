import React from 'react'
import { Map, Marker, NavigationControl } from 'react-bmap';

import WxApi from '../../components/wxApi';
import Fetch from '../../components/fetch';
import ImageConfig from '../../assets/imageConfig';

import '../../assets/css/business.css';

const BMap = window.BMap;
function ComplexCustomOverlay(point, text, text2) {
    
    this._point = point;
    this._text = text;
    this._text2 = text2;
}

ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function (map) {
    this._map = map;
    var div = this._div = document.createElement("div");
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.backgroundColor = "#fff";
    div.style.boxShadow = "0px 0px 3px rgba(0,0,0,0.4)";
    div.style.color = "#000";
    div.style.height = "78px";
    div.style.width = "200px";
    div.style.padding = "2px";
    div.style.lineHeight = "18px";
    div.style.whiteSpace = "nowrap";
    div.style.MozUserSelect = "none";
    div.style.fontSize = "14px"
    div.style.marginTop = '-98px';
    div.style.marginLeft = '-20px';
    div.style.boxSizing = 'border-box';
    div.style.padding = '15px';
    var span = this._span = document.createElement("div");
    var span2 = this._span2 = document.createElement("div");

    div.appendChild(span);
    div.appendChild(span2);
    span.style.fontSize = '14px';
    span.style.color = '#333';
    span2.style.fontSize = '12px';
    span2.style.color = '#999';
    span.style.marginTop = '5px';
    span.style.textOverflow = 'ellipsis';
    span.style.display = 'block';
    span.style.width = '150px';
    span.style.overflow = 'hidden';
    span.style.whiteSpace = 'nowrap';
    span.appendChild(document.createTextNode(this._text));
    span2.appendChild(document.createTextNode(this._text2));
    var that = this;

    var arrow = this._arrow = document.createElement("div");
    arrow.style.background = "transparent";
    arrow.style.position = "absolute";
    arrow.style.width = "0px";
    arrow.style.height = "0px";
    arrow.style.bottom = "-10px";
    arrow.style.left = "80px";
    arrow.style.overflow = "hidden";
    arrow.style.marginTop = '-10px';
    arrow.style.borderLeft = '20px solid transparent';
    arrow.style.borderRight = '20px solid transparent';
    arrow.style.borderTop = '20px solid #fff';

    div.appendChild(arrow);

    map.getPanes().labelPane.appendChild(div);

    return div;
}
ComplexCustomOverlay.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
    this._div.style.top = pixel.y - 30 + "px";
}

export default class BusinessMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            personPos: {
                lng: 120.2,
                lat: 30.3
            },
            
            centerPos:{
                lng: 120.2,
                lat: 30.3
            }
        }
        this.map = null;
        this.shopsId = '';
    }

    componentDidMount() {
        this.shopsId = this.props.match.params.name;
        this._getData()
    }

    componentWillMount(){
        document.body.scrollIntoView();
        document.title = "商家地址"
    }

    onClickCenter() {
        const point = new window.BMap.Point(this.state.centerPos.lng, this.state.centerPos.lat);
        this.map.map.centerAndZoom(point, 15);
    }

    _getData(){
        Fetch.post('/d-app/API/bs/shopsInfo/getShopsDetail', {
            shopsId: this.shopsId,
            dimension: this.state.personPos.lat,
            longitude: this.state.personPos.lng
        }).then(res => {
            this.setState({
                centerPos: {
                    lng: res.longitude,
                    lat: res.dimension
                }
            })
            var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(res.longitude, res.dimension), res.shopsName, res.shopsAddress);
            this.map.map.addOverlay(myCompOverlay);
        }).catch(err => {
        })
    }

    render() {
        return (
            <div
                className="container-map"
            >
                <div
                    className="flex flex-center"
                    style={{ width: '2rem', height: '2rem', position: 'absolute', top: '1.5rem', left: '1.5rem', background: '#fff', zIndex: '999', boxShadow: '0px 0px 3px rgba(0,0,0,0.3)' }}
                    onClick={() => { this.onClickCenter()}}
                >
                    <img src={ImageConfig.position} alt="" style={{ width: '1.3rem', height: '1.3rem' }} />
                </div>
                <Map
                    center={this.state.centerPos}
                    zoom="15"
                    style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0' }}
                    ref={ref => this.map = ref}
                    click={() => this.onClick()}
                >
                    <Marker position={this.state.centerPos} />
                    <NavigationControl
                    />
                </Map>
            </div>
        )
    }
}
