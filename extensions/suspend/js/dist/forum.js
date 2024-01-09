(()=>{var t={860:function(t){t.exports=function(){"use strict";var t=6e4,e=36e5,s="millisecond",n="second",r="minute",a="hour",i="day",o="week",u="month",l="quarter",d="year",c="date",m="Invalid Date",f=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,h=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,p={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],s=t%100;return"["+t+(e[(s-20)%10]||e[s]||e[0])+"]"}},g=function(t,e,s){var n=String(t);return!n||n.length>=e?t:""+Array(e+1-n.length).join(s)+t},v={s:g,z:function(t){var e=-t.utcOffset(),s=Math.abs(e),n=Math.floor(s/60),r=s%60;return(e<=0?"+":"-")+g(n,2,"0")+":"+g(r,2,"0")},m:function t(e,s){if(e.date()<s.date())return-t(s,e);var n=12*(s.year()-e.year())+(s.month()-e.month()),r=e.clone().add(n,u),a=s-r<0,i=e.clone().add(n+(a?-1:1),u);return+(-(n+(s-r)/(a?r-i:i-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:u,y:d,w:o,d:i,D:c,h:a,m:r,s:n,ms:s,Q:l}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$="en",y={};y[$]=p;var b=function(t){return t instanceof _},S=function t(e,s,n){var r;if(!e)return $;if("string"==typeof e){var a=e.toLowerCase();y[a]&&(r=a),s&&(y[a]=s,r=a);var i=e.split("-");if(!r&&i.length>1)return t(i[0])}else{var o=e.name;y[o]=e,r=o}return!n&&r&&($=r),r||!n&&$},M=function(t,e){if(b(t))return t.clone();var s="object"==typeof e?e:{};return s.date=t,s.args=arguments,new _(s)},w=v;w.l=S,w.i=b,w.w=function(t,e){return M(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function p(t){this.$L=S(t.locale,null,!0),this.parse(t)}var g=p.prototype;return g.parse=function(t){this.$d=function(t){var e=t.date,s=t.utc;if(null===e)return new Date(NaN);if(w.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var n=e.match(f);if(n){var r=n[2]-1||0,a=(n[7]||"0").substring(0,3);return s?new Date(Date.UTC(n[1],r,n[3]||1,n[4]||0,n[5]||0,n[6]||0,a)):new Date(n[1],r,n[3]||1,n[4]||0,n[5]||0,n[6]||0,a)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},g.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},g.$utils=function(){return w},g.isValid=function(){return!(this.$d.toString()===m)},g.isSame=function(t,e){var s=M(t);return this.startOf(e)<=s&&s<=this.endOf(e)},g.isAfter=function(t,e){return M(t)<this.startOf(e)},g.isBefore=function(t,e){return this.endOf(e)<M(t)},g.$g=function(t,e,s){return w.u(t)?this[e]:this.set(s,t)},g.unix=function(){return Math.floor(this.valueOf()/1e3)},g.valueOf=function(){return this.$d.getTime()},g.startOf=function(t,e){var s=this,l=!!w.u(e)||e,m=w.p(t),f=function(t,e){var n=w.w(s.$u?Date.UTC(s.$y,e,t):new Date(s.$y,e,t),s);return l?n:n.endOf(i)},h=function(t,e){return w.w(s.toDate()[t].apply(s.toDate("s"),(l?[0,0,0,0]:[23,59,59,999]).slice(e)),s)},p=this.$W,g=this.$M,v=this.$D,$="set"+(this.$u?"UTC":"");switch(m){case d:return l?f(1,0):f(31,11);case u:return l?f(1,g):f(0,g+1);case o:var y=this.$locale().weekStart||0,b=(p<y?p+7:p)-y;return f(l?v-b:v+(6-b),g);case i:case c:return h($+"Hours",0);case a:return h($+"Minutes",1);case r:return h($+"Seconds",2);case n:return h($+"Milliseconds",3);default:return this.clone()}},g.endOf=function(t){return this.startOf(t,!1)},g.$set=function(t,e){var o,l=w.p(t),m="set"+(this.$u?"UTC":""),f=(o={},o[i]=m+"Date",o[c]=m+"Date",o[u]=m+"Month",o[d]=m+"FullYear",o[a]=m+"Hours",o[r]=m+"Minutes",o[n]=m+"Seconds",o[s]=m+"Milliseconds",o)[l],h=l===i?this.$D+(e-this.$W):e;if(l===u||l===d){var p=this.clone().set(c,1);p.$d[f](h),p.init(),this.$d=p.set(c,Math.min(this.$D,p.daysInMonth())).$d}else f&&this.$d[f](h);return this.init(),this},g.set=function(t,e){return this.clone().$set(t,e)},g.get=function(t){return this[w.p(t)]()},g.add=function(s,l){var c,m=this;s=Number(s);var f=w.p(l),h=function(t){var e=M(m);return w.w(e.date(e.date()+Math.round(t*s)),m)};if(f===u)return this.set(u,this.$M+s);if(f===d)return this.set(d,this.$y+s);if(f===i)return h(1);if(f===o)return h(7);var p=(c={},c[r]=t,c[a]=e,c[n]=1e3,c)[f]||1,g=this.$d.getTime()+s*p;return w.w(g,this)},g.subtract=function(t,e){return this.add(-1*t,e)},g.format=function(t){var e=this,s=this.$locale();if(!this.isValid())return s.invalidDate||m;var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=w.z(this),a=this.$H,i=this.$m,o=this.$M,u=s.weekdays,l=s.months,d=function(t,s,r,a){return t&&(t[s]||t(e,n))||r[s].slice(0,a)},c=function(t){return w.s(a%12||12,t,"0")},f=s.meridiem||function(t,e,s){var n=t<12?"AM":"PM";return s?n.toLowerCase():n},p={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:w.s(o+1,2,"0"),MMM:d(s.monthsShort,o,l,3),MMMM:d(l,o),D:this.$D,DD:w.s(this.$D,2,"0"),d:String(this.$W),dd:d(s.weekdaysMin,this.$W,u,2),ddd:d(s.weekdaysShort,this.$W,u,3),dddd:u[this.$W],H:String(a),HH:w.s(a,2,"0"),h:c(1),hh:c(2),a:f(a,i,!0),A:f(a,i,!1),m:String(i),mm:w.s(i,2,"0"),s:String(this.$s),ss:w.s(this.$s,2,"0"),SSS:w.s(this.$ms,3,"0"),Z:r};return n.replace(h,(function(t,e){return e||p[t]||r.replace(":","")}))},g.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},g.diff=function(s,c,m){var f,h=w.p(c),p=M(s),g=(p.utcOffset()-this.utcOffset())*t,v=this-p,$=w.m(this,p);return $=(f={},f[d]=$/12,f[u]=$,f[l]=$/3,f[o]=(v-g)/6048e5,f[i]=(v-g)/864e5,f[a]=v/e,f[r]=v/t,f[n]=v/1e3,f)[h]||v,m?$:w.a($)},g.daysInMonth=function(){return this.endOf(u).$D},g.$locale=function(){return y[this.$L]},g.locale=function(t,e){if(!t)return this.$L;var s=this.clone(),n=S(t,e,!0);return n&&(s.$L=n),s},g.clone=function(){return w.w(this.$d,this)},g.toDate=function(){return new Date(this.valueOf())},g.toJSON=function(){return this.isValid()?this.toISOString():null},g.toISOString=function(){return this.$d.toISOString()},g.toString=function(){return this.$d.toUTCString()},p}(),D=_.prototype;return M.prototype=D,[["$ms",s],["$s",n],["$m",r],["$H",a],["$W",i],["$M",u],["$y",d],["$D",c]].forEach((function(t){D[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),M.extend=function(t,e){return t.$i||(t(e,_,M),t.$i=!0),M},M.locale=S,M.isDayjs=b,M.unix=function(t){return M(1e3*t)},M.en=y[$],M.Ls=y,M.p={},M}()},329:function(t){t.exports=function(){"use strict";var t="minute",e=/[+-]\d\d(?::?\d\d)?/g,s=/([+-]|\d\d)/g;return function(n,r,a){var i=r.prototype;a.utc=function(t){return new r({date:t,utc:!0,args:arguments})},i.utc=function(e){var s=a(this.toDate(),{locale:this.$L,utc:!0});return e?s.add(this.utcOffset(),t):s},i.local=function(){return a(this.toDate(),{locale:this.$L,utc:!1})};var o=i.parse;i.parse=function(t){t.utc&&(this.$u=!0),this.$utils().u(t.$offset)||(this.$offset=t.$offset),o.call(this,t)};var u=i.init;i.init=function(){if(this.$u){var t=this.$d;this.$y=t.getUTCFullYear(),this.$M=t.getUTCMonth(),this.$D=t.getUTCDate(),this.$W=t.getUTCDay(),this.$H=t.getUTCHours(),this.$m=t.getUTCMinutes(),this.$s=t.getUTCSeconds(),this.$ms=t.getUTCMilliseconds()}else u.call(this)};var l=i.utcOffset;i.utcOffset=function(n,r){var a=this.$utils().u;if(a(n))return this.$u?0:a(this.$offset)?l.call(this):this.$offset;if("string"==typeof n&&(n=function(t){void 0===t&&(t="");var n=t.match(e);if(!n)return null;var r=(""+n[0]).match(s)||["-",0,0],a=r[0],i=60*+r[1]+ +r[2];return 0===i?0:"+"===a?i:-i}(n),null===n))return this;var i=Math.abs(n)<=16?60*n:n,o=this;if(r)return o.$offset=i,o.$u=0===n,o;if(0!==n){var u=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();(o=this.local().add(i+u,t)).$offset=i,o.$x.$localOffset=u}else o=this.utc();return o};var d=i.format;i.format=function(t){var e=t||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return d.call(this,e)},i.valueOf=function(){var t=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||this.$d.getTimezoneOffset());return this.$d.valueOf()-6e4*t},i.isUTC=function(){return!!this.$u},i.toISOString=function(){return this.toDate().toISOString()},i.toString=function(){return this.toDate().toUTCString()};var c=i.toDate;i.toDate=function(t){return"s"===t&&this.$offset?a(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():c.call(this)};var m=i.diff;i.diff=function(t,e,s){if(t&&this.$u===t.$u)return m.call(this,t,e,s);var n=this.local(),r=a(t).local();return m.call(n,r,e,s)}}}()}},e={};function s(n){var r=e[n];if(void 0!==r)return r.exports;var a=e[n]={exports:{}};return t[n].call(a.exports,a,a.exports,s),a.exports}s.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return s.d(e,{a:e}),e},s.d=(t,e)=>{for(var n in e)s.o(e,n)&&!s.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),s.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var n={};(()=>{"use strict";s.r(n),s.d(n,{extend:()=>et});const t=flarum.reg.get("core","common/extend"),e=flarum.reg.get("core","forum/app");var r=s.n(e);const a=flarum.reg.get("core","forum/utils/UserControls");var i=s.n(a);const o=flarum.reg.get("core","common/components/Button");var u=s.n(o);const l=flarum.reg.get("core","common/components/Badge");var d=s.n(l);const c=flarum.reg.get("core","common/models/User");var f=s.n(c);const h=flarum.reg.get("core","common/components/FormModal");var p=s.n(h);const g=flarum.reg.get("core","common/utils/Stream");var v=s.n(g);const y=flarum.reg.get("core","common/utils/withAttr");var b=s.n(y);const S=flarum.reg.get("core","common/utils/ItemList");var M=s.n(S),w=s(860),_=s.n(w),D=s(329),x=s.n(D);function O(){return new Date("2038-01-01")}function N(t){return _().utc(t).isSame(_().utc("2038-01-01"))}function T(t){return T="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},T(t)}function U(t,e,s){return(e=function(t){var e=function(t,e){if("object"!==T(t)||null===t)return t;var s=t[Symbol.toPrimitive];if(void 0!==s){var n=s.call(t,e);if("object"!==T(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t,"string");return"symbol"===T(e)?e:String(e)}(e))in t?Object.defineProperty(t,e,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[e]=s,t}_().extend(x()),flarum.reg.add("flarum-suspend","forum/helpers/suspensionHelper",{getPermanentSuspensionDate:O,isPermanentSuspensionDate:N,localStorageKey:function(){return"flarum-suspend.acknowledge-suspension"}});class k{constructor(){U(this,"element",void 0),U(this,"attrs",void 0),U(this,"state",void 0)}oninit(t){this.setAttrs(t.attrs)}oncreate(t){this.element=t.dom}onbeforeupdate(t){this.setAttrs(t.attrs)}onupdate(t){}onbeforeremove(t){}onremove(t){}$(t){const e=$(this.element);return t?e.find(t):e}static component(t,e){void 0===t&&(t={}),void 0===e&&(e=null);const s={...t};return m(this,s,e)}setAttrs(t){if(void 0===t&&(t={}),this.constructor.initAttrs(t),t){if("children"in t)throw new Error("[".concat(this.constructor.name,'] The "children" attribute of attrs should never be used. Either pass children in as the vnode children or rename the attribute'));if("tag"in t)throw new Error("[".concat(this.constructor.name,'] You cannot use the "tag" attribute name with Mithril 2.'))}this.attrs=t}static initAttrs(t){}}function C(t){var e,s,n="";if("string"==typeof t||"number"==typeof t)n+=t;else if("object"==typeof t)if(Array.isArray(t))for(e=0;e<t.length;e++)t[e]&&(s=C(t[e]))&&(n&&(n+=" "),n+=s);else for(e in t)t[e]&&(n&&(n+=" "),n+=e);return n}flarum.reg.add("flarum-suspend","../../../../framework/core/js/src/common/Component",k);const F=function(){for(var t,e,s=0,n="";s<arguments.length;)(t=arguments[s++])&&(e=C(t))&&(n&&(n+=" "),n+=e);return n},Y=F;flarum.reg.add("flarum-suspend","../../../../framework/core/js/src/common/utils/classList",F);class j extends k{view(t){const{label:e,description:s,className:n,...r}=t.attrs;return m("div",Object.assign({className:Y("Form",n)},r),m("div",{className:"Form-header"},e&&m("label",null,e),s&&m("p",{className:"helpText"},s)),m("div",{className:"Form-body"},t.children))}}flarum.reg.add("flarum-suspend","../../../../framework/core/js/src/common/components/Form",j);class I extends k{view(t){return m("div",{className:Y("FieldSet",this.attrs.className),role:"group","aria-label":this.attrs.label,"aria-disabled":!1},m("label",{className:"FieldSet-label","aria-hidden":"true"},this.attrs.label),this.attrs.description?m("div",{className:"FieldSet-description helpText"},this.attrs.description):null,m("div",{className:"FieldSet-items"},t.children))}}flarum.reg.add("flarum-suspend","../../../../framework/core/js/src/common/components/FieldSet",I);class H extends(p()){oninit(t){super.oninit(t);let e=this.attrs.user.suspendedUntil();const s=this.attrs.user.suspendReason(),n=this.attrs.user.suspendMessage();let r=null;new Date>e&&(e=null),e&&(r=9999===e.getFullYear()?"indefinitely":"limited"),this.status=v()(r),this.reason=v()(s),this.message=v()(n),this.daysRemaining=v()("limited"===r&&1-dayjs().diff(e,"days"))}className(){return"SuspendUserModal Modal--medium"}title(){return r().translator.trans("flarum-suspend.forum.suspend_user.title",{user:this.attrs.user})}content(){return m("div",{className:"Modal-body"},m(j,null,this.formItems().toArray(),m("div",{className:"Form-group Form-controls"},m(u(),{className:"Button Button--primary",loading:this.loading,type:"submit"},r().translator.trans("flarum-suspend.forum.suspend_user.submit_button")))))}radioItems(){const t=new(M());return t.add("not-suspended",m("label",{className:"checkbox"},m("input",{type:"radio",name:"status",checked:!this.status(),value:"",onclick:b()("value",this.status)}),r().translator.trans("flarum-suspend.forum.suspend_user.not_suspended_label")),100),t.add("indefinitely",m("label",{className:"checkbox"},m("input",{type:"radio",name:"status",checked:"indefinitely"===this.status(),value:"indefinitely",onclick:b()("value",this.status)}),r().translator.trans("flarum-suspend.forum.suspend_user.indefinitely_label")),90),t.add("time-suspension",m("label",{className:"checkbox SuspendUserModal-days"},m("input",{type:"radio",name:"status",checked:"limited"===this.status(),value:"limited",onclick:t=>{this.status(t.target.value),m.redraw.sync(),this.$(".SuspendUserModal-days-input input").select(),t.redraw=!1}}),r().translator.trans("flarum-suspend.forum.suspend_user.limited_time_label"),"limited"===this.status()&&m("div",{className:"SuspendUserModal-days-input"},m("input",{type:"number",min:"0",value:this.daysRemaining(),oninput:b()("value",this.daysRemaining),className:"FormControl"}),r().translator.trans("flarum-suspend.forum.suspend_user.limited_time_days_text"))),80),t}formItems(){const t=new(M());return t.add("radioItems",m(I,{label:r().translator.trans("flarum-suspend.forum.suspend_user.status_heading")},this.radioItems().toArray()),100),t.add("reason",m("div",{className:"Form-group"},m("label",null,r().translator.trans("flarum-suspend.forum.suspend_user.reason")),m("textarea",{className:"FormControl",bidi:this.reason,placeholder:r().translator.trans("flarum-suspend.forum.suspend_user.placeholder_optional"),rows:"4"})),90),t.add("message",m("div",{className:"Form-group"},m("label",null,r().translator.trans("flarum-suspend.forum.suspend_user.display_message")),m("textarea",{className:"FormControl",bidi:this.message,placeholder:r().translator.trans("flarum-suspend.forum.suspend_user.placeholder_optional"),rows:"4"})),80),t}onsubmit(t){t.preventDefault(),this.loading=!0;let e=null;switch(this.status()){case"indefinitely":e=O();break;case"limited":e=dayjs().add(this.daysRemaining(),"days").toDate()}this.attrs.user.save({suspendedUntil:e,suspendReason:this.reason(),suspendMessage:this.message()}).then((()=>this.hide()),this.loaded.bind(this))}}flarum.reg.add("flarum-suspend","forum/components/SuspendUserModal",H);const A=flarum.reg.get("core","forum/components/Notification");var L=s.n(A);class P extends(L()){icon(){return"fas fa-ban"}href(){return r().route.user(this.attrs.notification.subject())}content(){const t=this.attrs.notification,e=t.content(),s=dayjs(e).from(t.createdAt(),!0);return N(e)?r().translator.trans("flarum-suspend.forum.notifications.user_suspended_indefinite_text"):r().translator.trans("flarum-suspend.forum.notifications.user_suspended_text",{timeReadable:s})}excerpt(){return null}}flarum.reg.add("flarum-suspend","forum/components/UserSuspendedNotification",P);class W extends(L()){icon(){return"fas fa-ban"}href(){return r().route.user(this.attrs.notification.subject())}content(){return this.attrs.notification,r().translator.trans("flarum-suspend.forum.notifications.user_unsuspended_text")}excerpt(){return null}}flarum.reg.add("flarum-suspend","forum/components/UserUnsuspendedNotification",W);const B=flarum.reg.get("core","common/components/Modal");var R=s.n(B);const z=flarum.reg.get("core","common/helpers/fullTime");var E=s.n(z);class Z extends(R()){oninit(t){super.oninit(t),this.message=this.attrs.message,this.until=this.attrs.until}className(){return"SuspensionInfoModal Modal"}title(){return r().translator.trans("flarum-suspend.forum.suspension_info.title")}content(){const t=N(new Date(this.until))?r().translator.trans("flarum-suspend.forum.suspension_info.indefinite"):r().translator.trans("flarum-suspend.forum.suspension_info.limited",{date:E()(this.until)});return m("div",{className:"Modal-body"},m(j,{className:"Form--centered"},m("p",{className:"helpText"},this.message),m("p",{className:"helpText"},t),m("div",{className:"Form-group Form-controls"},m(u(),{className:"Button Button--primary Button--block",onclick:this.hide.bind(this)},r().translator.trans("flarum-suspend.forum.suspension_info.dismiss_button")))))}hide(){localStorage.setItem("flarum-suspend.acknowledge-suspension",this.attrs.until.getTime()),this.attrs.state.close()}}flarum.reg.add("flarum-suspend","forum/components/SuspensionInfoModal",Z);const J=flarum.reg.get("core","common/extenders");var q=s.n(J);const G=flarum.reg.get("core","common/Model");var V=s.n(G);const K=flarum.reg.get("core","common/app");var Q=s.n(K);const X=flarum.reg.get("core","common/query/IGambit");class tt extends X.BooleanGambit{key(){return Q().translator.trans("flarum-suspend.lib.gambits.users.suspended.key",{},!0)}filterKey(){return"suspended"}enabled(){return!!Q().session.user&&Q().forum.attribute("canSuspendUsers")}}flarum.reg.add("flarum-suspend","common/query/users/SuspendedGambit",tt);const et=[(new(q().Search)).gambit("users",tt),new(q().Model)(f()).attribute("canSuspend"),new(q().Model)(f()).attribute("suspendedUntil",V().transformDate).attribute("suspendReason").attribute("suspendMessage")];r().initializers.add("flarum-suspend",(()=>{r().notificationComponents.userSuspended=P,r().notificationComponents.userUnsuspended=W,(0,t.extend)(i(),"moderationControls",((t,e)=>{e.canSuspend()&&t.add("suspend",m(u(),{icon:"fas fa-ban",onclick:()=>r().modal.show(H,{user:e})},r().translator.trans("flarum-suspend.forum.user_controls.suspend_button")))})),(0,t.extend)(f().prototype,"badges",(function(t){const e=this.suspendedUntil();new Date<e&&t.add("suspended",m(d(),{icon:"fas fa-ban",type:"suspended",label:r().translator.trans("flarum-suspend.forum.user_badge.suspended_tooltip")}),100)})),setTimeout((()=>{if(r().session.user){const t=r().session.user.suspendMessage(),e=r().session.user.suspendedUntil(),s=t&&e&&new Date<e,n=localStorage.getItem("flarum-suspend.acknowledge-suspension")===(null==e?void 0:e.getTime().toString());s&&!n?r().modal.show(Z,{message:t,until:e}):localStorage.getItem("flarum-suspend.acknowledge-suspension")&&localStorage.removeItem("flarum-suspend.acknowledge-suspension")}}),0)}))})(),module.exports=n})();
//# sourceMappingURL=forum.js.map