import Fetch from './fetch';
import ImageConfig from '../assets/imageConfig';
import GPS from './gpsTransform';
const wx = window.wx;
class WxApi {

    
    static config(url) {
        Fetch.post('/d-app/wx/config', {
            url
        }).then(res => {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appId, // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.noncestr, // 必填，生成签名的随机串
                signature: res.signature,// 必填，签名
                jsApiList: ['getLocation', 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
            })
        }).catch(err => {
            console.log(err)
        })
    }
    //获取经纬度
    static getLocation() {

        return new Promise((resolve, reject) => {
            wx.ready(() => {
                wx.getLocation({
                    type: 'wgs84',
                    success: (res) => {
                        
                    
                        let gcj02 = {
                            lat: GPS.gcj_encrypt(parseFloat(res.latitude), parseFloat(res.longitude)).lat,
                            lon: GPS.gcj_encrypt(parseFloat(res.latitude), parseFloat(res.longitude)).lon
                        }
                      
                        let bd09 = {
                            latitude: GPS.bd_encrypt(gcj02.lat, gcj02.lon).lat.toFixed(6),
                            longitude: GPS.bd_encrypt(gcj02.lat, gcj02.lon).lon.toFixed(6)
                        }
                       
                        resolve(bd09)
                    }
                });
            });
            wx.error(() => {
                reject()
            })
        })
    }
    //分享好友朋友圈
    static onShare(title, link, imgUrl1, desc) {
        let img = window.location.href.split('.com')[0] + '.com' + ImageConfig.shareImg;
        let imgUrl = img.replace('https', 'http');
        console.log(imgUrl);
        wx.ready(() => {
            wx.onMenuShareTimeline({
                title, // 分享标题
                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl,
                success: function () {
                    // 用户点击了分享后执行的回调函数
                },
            })
            wx.onMenuShareAppMessage({
                title, // 分享标题
                desc, // 分享描述
                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户点击了分享后执行的回调函数
                }
            });
        });
    }
}

export default WxApi