! function(e) {
    var t = {};

    function i(s) {
        if (t[s]) return t[s].exports;
        var r = t[s] = {
            i: s,
            l: !1,
            exports: {}
        };
        return e[s].call(r.exports, r, r.exports, i), r.l = !0, r.exports
    }
    i.m = e, i.c = t, i.d = function(e, t, s) {
        i.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: s
        })
    }, i.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, i.t = function(e, t) {
        if (1 & t && (e = i(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var s = Object.create(null);
        if (i.r(s), Object.defineProperty(s, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var r in e) i.d(s, r, function(t) {
                return e[t]
            }.bind(null, r));
        return s
    }, i.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return i.d(t, "a", t), t
    }, i.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, i.p = "", i(i.s = 0)
}([function(e, t, i) {
    "use strict";
    i.r(t), i.d(t, "CrazyAdType", function() {
        return s
    }), i.d(t, "CrazyEventType", function() {
        return r
    });
    const s = {
            midgame: "midgame",
            rewarded: "rewarded"
        },
        r = {
            adStarted: "adStarted",
            adFinished: "adFinished",
            adError: "adError",
            adblockDetectionExecuted: "adblockDetectionExecuted"
        },
        n = "1.4.0";
    class a {
        static getInstance() {
            return this.instance || (this.instance = new a), this.instance
        }
        constructor() {
            this.initialized = !1, this.initializeReplied = !1, this.requestInProgress = !1, this.eventListeners = {}, this.queuedRequest = null, this.adblockDetectionExecuted = !1, this.hasAdblock = !1, this.receiveMessage = this.receiveMessage.bind(this), this.registerDefaultListeners()
        }
        init() {
            this.initialized || (this.initialized = !0, this.registerMessageListener(), this.postMessage("init", {
                version: n,
                sdkType: "js"
            }))
        }
        addEventListener(e, t) {
            if (!this.isValidAdEvent(e)) return void console.error("[CrazySDK] Invalid Event", e);
            const i = this.eventListeners[e] || [];
            i.push(t), this.eventListeners[e] = i
        }
        removeEventListener(e, t) {
            if (!this.isValidAdEvent(e)) return void console.error("[CrazySDK] Invalid Event", e);
            const i = this.eventListeners[e] || [];
            this.eventListeners[e] = i.filter(e => e !== t)
        }
        requestAd(e = s.midgame) {
            this.initialized || this.init(), this.requestInProgress || (this.initializeReplied ? (this.requestInProgress = !0, this.postMessage("requestAd", {
                adType: e
            })) : this.queuedRequest = e)
        }
        registerDefaultListeners() {
            this.addEventListener(r.adFinished, () => {
                this.requestInProgress = !1
            }), this.addEventListener(r.adError, () => {
                this.requestInProgress = !1
            }), this.addEventListener(r.adblockDetectionExecuted, e => {
                this.adblockDetectionExecuted = !0;
                const {
                    hasAdblock: t
                } = e;
                this.hasAdblock = !!t
            })
        }
        registerMessageListener() {
            window.addEventListener("message", this.receiveMessage, !1)
        }
        receiveMessage(e) {
            const {
                type: t
            } = e.data;
            t && ("initialized" !== t ? this.isValidAdEvent(t) && this.callListeners(t, e.data) : this.initializeReply())
        }
        initializeReply() {
            this.initializeReplied || (this.initializeReplied = !0, this.queuedRequest && (this.requestAd(this.queuedRequest), this.queuedRequest = null))
        }
        callListeners(e, t) {
            (this.eventListeners[e] || []).forEach(e => e(t))
        }
        postMessage(e, t) {
            this.getCrazySDKWindow().postMessage({
                type: e,
                data: t
            }, "*")
        }
        getCrazySDKWindow() {
            return window.parent
        }
        isValidAdEvent(e) {
            switch (e) {
                case r.adStarted:
                case r.adFinished:
                case r.adError:
                case r.adblockDetectionExecuted:
                    return !0;
                default:
                    return !1
            }
        }
    }
    window.CrazyGames = {
        CrazySDK: a,
        CrazyAdType: s,
        CrazyEventType: r
    }, t.default = a
}]);