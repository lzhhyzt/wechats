
const domain = "https://lzhhyzt123.cn:8443"  // http://127.0.0.1:3000

// 后台服务器链接
const links = {
  users: {
    signup: domain + "/users/signup"        // 微信用户信息登记
  },
  music: {
    isLove: domain + "/music/islove",       // 判断收藏状态
    love: domain + "/music/love",           // 收藏歌曲
    noLove: domain + "/music/nolove",       // 从收藏中移除歌曲
    loveList: domain + "/music/lovelist",   // 收藏列表
    getLycris: domain + "/music/lyrics"     // 获取歌词         
  },
  video: {
    allList: domain + "/video/list",          // 所有短视频列表
    videoById: domain + "/video/getVideoById",// 根据ID获取短视频       
  }
} 

// QQ音乐API
const QQMusic = {
  newestMusic: "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8%C2%ACice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=27&_=1519963122923",   // 最新音乐列表
  recommendMusic: "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=36&_=1520777874472",  // 推荐音乐列表

}


module.exports = {
  links: links,
  QQMusic: QQMusic
}