
## 干啥的

* 什么是订阅

  大家代理一般用的 ss/r 或者 V2ray，一个节点。当你自己使用多个节点的时候问题就来了，如何方便管理、获取自己的节点。这个时候SSR的作者就提出了订阅的这种方式。第一 url 地址里面存储所有节点信息。每次客户端填写下这个 url 地址就行了。目前 Clash（Win 和 Mac），iOS的 Shadowrocket小火箭、Quantumult 圈， 安卓的 SSR v2rayN、 Win 的 ssr、以及梅林等路由器固件都支持了。非常方便，然后也方便分享。当然如果你是买的机场服务，你肯定已经使用过了。

* 关于我写的这个

  注册后可以添加 ss/ssr 的节点， 在订阅管理可以看到各种订阅的地址，以及二维码。节点 添加、删除、修改、都是可以的。

## 网站和开源

* 节点的内容是放在我的数据库的，我不开机场，自己的节点也完全够用，我肯定不会窃取你的数据。不放心完全可以自己来全是开源的。
* 后端开源地址 [Github](https://github.com/pengchujin/oneSubscribe)
* 前端开源地址 [Github](https://github.com/pengchujin/subscribeVue)
* 网站地址 [sebs.club](https://sebs.club)

## 附加

推荐大家使用 v2ray tls+ws 这种方式。 可以看下我写的这个docker，使用很方便。[V2rayDocker](https://github.com/pengchujin/v2rayDocker)