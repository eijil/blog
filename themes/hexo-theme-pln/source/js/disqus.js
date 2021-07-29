/*! DisqusJS v1.3.0 | Sukka (https://skk.moe) | https://disqusjs.skk.moe | MIT License */"use strict"; function DisqusJS(C) { !function (s, p, t, n, a) { function o() { for (var e = arguments.length, s = new Array(e), t = 0; t < e; t++)s[t] = arguments[t]; return (o = Object.assign || function (e) { for (var s = 0, t = arguments.length; s < t; s++) { var n = arguments[s]; for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]) } return e }).apply(this, s) } var f = function (e) { return p.getElementById(e) }, h = function (e) { var s = f("dsqjs-msg"); s && (s.innerHTML = e) }, q = "click", l = "disqus_thread", g = "dsqjs_sort", i = 'target="_blank" rel="external nofollow noopener noreferrer"', m = '<footer><p class="dsqjs-footer">Powered by <a class="dsqjs-disqus-logo" href="https://disqus.com" ' + i + '></a>&nbsp;&amp;&nbsp;<a href="https://disqusjs.skk.moe" target="_blank">DisqusJS</a></p></footer>', j = function (e, s) { return '<header class="dsqjs-header" id="dsqjs-header"><nav class="dsqjs-nav dsqjs-clearfix"><ul><li class="dsqjs-nav-tab dsqjs-tab-active"><span>' + e + ' Comments</span></li><li class="dsqjs-nav-tab">' + s + '</li></ul><div class="dsqjs-order"><input class="dsqjs-order-radio" id="dsqjs-order-desc" type="radio" name="comment-order" value="desc" checked="true"><label class="dsqjs-order-label" for="dsqjs-order-desc" title="按从新到旧">最新</label><input class="dsqjs-order-radio" id="dsqjs-order-asc" type="radio" name="comment-order" value="asc"><label class="dsqjs-order-label" for="dsqjs-order-asc" title="按从旧到新">最早</label><input class="dsqjs-order-radio" id="dsqjs-order-popular" type="radio" name="comment-order" value="popular"><label class="dsqjs-order-label" for="dsqjs-order-popular" title="按评分从高到低">最佳</label></div></nav></header>' }, d = function (e, s, t) { var n = e.avatarEl, o = e.createdAt; return '<div class="dsqjs-post-item dsqjs-clearfix"><div class="dsqjs-post-avatar">' + n + '</div><div class="dsqjs-post-body"><div class="dsqjs-post-header">' + s + '<span class="dsqjs-meta"><time>' + r(o) + '</time></span></div><div class="dsqjs-post-content">' + t + "</div></div></div>" }, v = '欲参与讨论，请对 disq.us | disquscdn.com | disqus.com 启用代理并 <a id="dsqjs-reload-disqus" class="dsqjs-msg-btn"></a><a id="dsqjs-force-disqus" class="dsqjs-msg-btn">加载 Disqus</a>', y = function (e) { return n(e, { method: "GET" }).then(function (e) { return a.all([e.ok, e.status, e.json(), e.headers]) }).then(function (e) { var s = e[0], t = e[1], n = e[2], o = e[3]; if (s) return { ok: s, status: t, data: n, headers: o }; throw new Error }).catch(function (e) { throw e }) }, b = function (e, s) { try { t.setItem(e, s) } catch (e) { } }, r = function (e) { function s(e) { return e < 10 ? "0" + e : e } return e = Date.parse(new Date(e)), (e = new Date(e + 288e5)).getFullYear() + "-" + s(e.getMonth() + 1) + "-" + s(e.getDate()) + " " + s(e.getHours()) + ":" + s(e.getMinutes()) }; function e() { if (s.DISQUS) s.DISQUS.reset({ reload: !0, config: function () { this.page.identifier = I.config.identifier, this.page.url = I.config.url, this.page.title = I.config.title } }); else { var e = p.createElement("script"); f(l).innerHTML = '<div id="dsqjs"><section><div id="dsqjs-msg">评论加载中... 如果长时间无法加载，请针对 disq.us | disquscdn.com | disqus.com 启用代理并 <a id="dsqjs-force-dsqjs" class="dsqjs-msg-btn">加载评论基础模式</a></div></section>' + m + "</div>", f("dsqjs-force-dsqjs").addEventListener(q, u), e.src = "https://" + I.config.shortname + ".disqus.com/embed.js", e.setAttribute("data-timestamp", +new Date), (p.head || p.body).appendChild(e) } } function E() { f(l).innerHTML = '<div id="dsqjs"><section><div id="dsqjs-msg">正在检查 Disqus 能否访问...</div></section>' + m + "</div>"; function e(o) { return new a(function (e, s) { var t = new Image, n = setTimeout(function () { t.onerror = t.onload = null, s() }, 3e3); t.onerror = function () { clearTimeout(n), s() }, t.onload = function () { clearTimeout(n), e() }, t.src = "https://" + o + "/favicon.ico?" + +new Date + "=" + +new Date }) } return a.all([e("disqus.com"), e(I.config.shortname + ".disqus.com")]).then(w, u) } function L() { f("dsqjs-reload-disqus").addEventListener(q, E), f("dsqjs-force-disqus").addEventListener(q, w) } function c() { h("评论基础模式加载中..."); var e = I.config.api + "3.0/threads/list.json?forum=" + encodeURIComponent(I.config.shortname) + "&thread=" + encodeURIComponent("link:http://gaoryrt.com" + p.location.pathname) + "&api_key=" + encodeURIComponent(k()); y(e).then(function (e) { var s = e.data; return new a(function (n, e) { var o = s, a = s.response[0].posts; console.log(s), 0 !== s.code || 1 !== s.response.length || 0 === a ? y(I.config.api + "3.0/threads/list.json?forum=" + encodeURIComponent(I.config.shortname) + "&thread=" + encodeURIComponent("link:http://gaoryrt.com" + p.location.pathname + "index.html") + "&api_key=" + encodeURIComponent(k())).then(function (e) { var s = e.data, t = s; 0 === s.code && 1 === s.response.length && s.response[0].posts > a ? n({ data: t }) : n({ data: o }) }) : n({ data: s }) }) }).then(function (e) { var s = e.data; if (0 === s.code && 1 === s.response.length) { var t = s.response[0], n = t.id, o = t.title, a = t.isClosed, r = t.posts, i = t.identifiers, d = t.slug; I.page = { id: n, title: o, isClosed: a, length: r, comment: [], slug: d }, I.config.identifier = i[0], f(l).innerHTML = '<div id="dsqjs">' + j(r, I.config.siteName) + '<section class="dsqjs-post-container"><ul class="dsqjs-post-list" id="dsqjs-post-container"><p class="dsqjs-no-comment">评论列表加载中...</p></ul><a id="dsqjs-load-more" class="dsqjs-load-more dsqjs-hide">加载更多评论</a></section><div id="dsqjs-msg">评论加载中... ' + v + "</div>" + m + "</div>", L(), f("dsqjs-order-" + I.sortType).setAttribute("checked", "true"), c() } else { if (0 !== s.code || 1 === s.response.length) throw new Error; w() } }).catch(T); function s(e) { function n(e) { return { comment: e, author: e.author.name, isPrimary: !!I.config.admin && e.author.username === I.config.admin, children: t(+e.id), hasMore: e.hasMore } } var s = [], o = [], t = function (s) { if (0 === o.length) return null; var t = []; return o.forEach(function (e) { e.parent === s && t.unshift(n(e)) }), t.length ? t : null }; return e.forEach(function (e) { (e.parent ? o : s).push(e) }), s.map(n) } var c = function t(e) { void 0 === e && (e = ""); function n() { Array.prototype.slice.call(a).forEach(function (e) { return e.removeEventListener("change", d) }), o.removeEventListener(q, i), Array.prototype.slice.call(r).forEach(function (e) { return e.removeEventListener(q, E) }) } var o = f("dsqjs-load-more"), a = p.getElementsByClassName("dsqjs-order-radio"), r = p.getElementsByClassName("dsqjs-has-more-btn"), i = function () { n(), t(I.page.next) }, d = function (e) { var s = e.target; I.sortType = s.getAttribute("value"), b(g, I.sortType), n(), I.page.comment = [], I.page.next = "", f("dsqjs-post-container").innerHTML = '<p class="dsqjs-no-comment">正在切换排序方式...</p>', o.classList.add("dsqjs-hide"), t() }, s = "" === e ? "" : "&cursor=" + e; o.classList.add("dsqjs-disabled"); function c(e) { var s = e.createdAt; return Date.parse(new Date(s)) } function l(e, s) { return e.parent && s.parent ? c(e) - c(s) : 0 } var m = I.config.api + "3.0/threads/listPostsThreaded?forum=" + encodeURIComponent(I.config.shortname) + "&thread=" + encodeURIComponent(I.page.id) + encodeURIComponent(s) + "&api_key=" + encodeURIComponent(k()) + "&order=" + encodeURIComponent(I.sortType); y(m).then(function (e) { var s = e.data; if (0 === s.code && 0 < s.response.length) { var t; o.classList.remove("dsqjs-disabled"), (t = I.page.comment).push.apply(t, s.response), I.page.comment.sort(l), u(I.page.comment), Array.prototype.slice.call(a).forEach(function (e) { return e.addEventListener("change", d) }), Array.prototype.slice.call(r).forEach(function (e) { return e.addEventListener(q, E) }), s.cursor.hasNext ? (I.page.next = s.cursor.next, o.innerHTML = "加载更多评论", o.classList.remove("dsqjs-hide"), o.addEventListener(q, i)) : o.classList.add("dsqjs-hide") } else { if (0 !== s.code || 0 !== s.response.length) throw new Error; h(v), f("dsqjs-post-container").innerHTML = '<p class="dsqjs-no-comment" >' + I.config.nocomment + "</p>", L(), f("dsqjs-force-disqus").addEventListener(q, w) } }).catch(function () { "" === e ? T() : (o.classList.remove("dsqjs-disabled"), o.innerHTML = "加载更多评论失败，点击重试", o.addEventListener(q, i)) }) }, u = function (e) { function a(e) { return e.comment.author.profileUrl ? (e.comment.avatarEl = '<a href="' + e.comment.author.profileUrl + '" ' + i + '><img src="' + n(e.comment.author.avatar.cache) + '"></a>', e.comment.authorEl = '<span class="dsqjs-post-author"><a href="' + e.comment.author.profileUrl + '" ' + i + ">" + e.comment.author.name + "</a></span>") : (e.comment.avatarEl = '<img src="' + n(e.comment.author.avatar.cache) + '">', e.comment.authorEl = '<span class="dsqjs-post-author">' + e.comment.author.name + "</span>"), I.config.adminLabel && e.isPrimary && (e.comment.authorEl += '<span class="dsqjs-admin-badge">' + I.config.adminLabel + "</span>"), e } function r(e) { var s = "", t = ""; return t = e.isDeleted ? "<small>此评论已被删除</small>" : (s = e.authorEl + '<span class="dsqjs-bullet"></span>', function (e) { var s = p.createElement("div"); s.innerHTML = e; var t = s.getElementsByTagName("a"); return Array.prototype.slice.call(t).forEach(function (e) { var s = decodeURIComponent(e.href.replace(/https:\/\/disq\.us\/url\?url=/g, "")).replace(/(.*):.+cuid=.*/, "$1"); e.href = s, e.innerHTML = s, e.rel = "external noopener nofollow noreferrer", e.target = "_blank" }), s.innerHTML }(n(e.message))), d(e, s, t) } var n = function (e) { return e.replace(/a\.disquscdn\.com/g, "c.disquscdn.com") }, t = ""; s(e).map(function (e) { e.children && (e.nesting = 1); var s = ""; (e = a(e)).hasMore && (s = '<p class="dsqjs-has-more">切换至 <a id="load-more-' + e.comment.id + '"> Disqus 模式</a> 显示更多回复</p>'), t += '<li data-id="comment-' + e.comment.id + '" id="comment-' + e.comment.id + '">' + r(e.comment) + function t(e) { var n = e.nesting, s = e.children || []; if (s) { var o = ""; return o = n < I.config.nesting ? '<ul class="dsqjs-post-list dsqjs-children">' : '<ul class="dsqjs-post-list">', s.map(function (e) { (e = a(e)).nesting = n + 1; var s = e.hasMore ? '<p class="dsqjs-has-more">切换至 <a class="dsqjs-has-more-btn" id="load-more-' + e.comment.id + '" data-more-id="comment-' + e.comment.id + '"> Disqus 模式</a> 显示更多回复</p>' : ""; o += '<li data-id="comment-' + e.comment.id + '" id="comment-' + e.comment.id + '">' + r(e.comment) + t(e) + s + "</li>" }), 0 !== (o += "</ul>").length ? o : void 0 } }(e) + s + "</li>" }), h(v), f("dsqjs-post-container").innerHTML = t, L() } } function T(e) { console.log(e), h('评论加载失败，是否 <a id="dsqjs-reload-dsqjs" class="dsqjs-msg-btn">重试</a> 或 <a id="dsqjs-reload-disqus" class="dsqjs-msg-btn">尝试加载 Disqus</a> ？'), f("dsqjs-reload-dsqjs").addEventListener(q, c), f("dsqjs-reload-disqus").addEventListener(q, E) } function u() { b("dsqjs_mode", "dsqjs"), c() } function w() { b("dsqjs_mode", "disqus"), e() } var I = {}, M = p.location.origin + p.location.pathname + p.location.search; I.config = o({ api: "https://disqus.skk.moe/disqus/", identifier: M, url: M, title: p.title, siteName: "", nesting: parseInt(C.nesting) || 4, nocomment: "这里冷冷清清的，一条评论都没有" }, C), I.page = {}; var D = I.config.apikey, k = function () { return Array.isArray(D) ? D[Math.floor(Math.random() * D.length)] : D }; s.disqus_config = function () { this.page.identifier = I.page.id, this.page.slug = I.page.slug, this.page.url = I.config.url, this.page.identifier = I.config.identifier, this.page.title = I.config.title }, f(l).innerHTML = '<div id="dsqjs"><div id="dsqjs-msg"></div>' + m + "</div>", n && t && a ? (I.mode = t.getItem("dsqjs_mode"), I.sortType = t.getItem(g) || t.getItem("disqus.sort"), I.sortType || (b(g, "desc"), I.sortType = "desc"), "disqus" === I.mode ? e() : "dsqjs" === I.mode ? c() : E()) : (h("你的浏览器版本过低，不兼容评论基础模式。" + v), L()) }(window, document, localStorage, fetch, Promise) } try { module.exports = DisqusJS } catch (e) { }