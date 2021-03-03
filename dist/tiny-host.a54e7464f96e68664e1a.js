(()=>{"use strict";var e,t,n,s,o={418:(e,t,n)=>{var s=n(670),o=n(517),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("h3",[e._v("tiny "+e._s(e.type?e.type+"s ":"")+"host"),e.loggedIn?[e._v(" - "+e._s(e.username))]:e._e()],2),e._v(" "),n("router-view")],1)};a._withStripped=!0;var r=n(271);const i={name:"app",data(){var e;return{loggedIn:Boolean(r.Z.session),type:r.Z.type||"",username:(null===(e=r.Z.user)||void 0===e?void 0:e.username)||"",page:this.$route.name||""}},watch:{$route(e,t){var n,s;e.path!==t.path&&(/^\/login/.test(e.path)?(this.loggedIn&&(this.loggedIn=Boolean(r.Z.session)),this.username&&(this.username=null===(s=r.Z.user)||void 0===s?void 0:s.username)):(this.loggedIn||(this.loggedIn=Boolean(r.Z.session)),this.username||(this.username=null===(n=r.Z.user)||void 0===n?void 0:n.username)),this.page=e.name)}}};var l=n(900),d=(0,l.Z)(i,a,[],!1,null,null,null);d.options.__file="src/web/app.vue";const c=d.exports;var u=function(){var e=this.$createElement;return(this._self._c||e)("div",{attrs:{id:"tiny-loading"}})};u._withStripped=!0;const p={name:"tiny-loading"};var h=(0,l.Z)(p,u,[],!1,null,null,null);h.options.__file="src/web/components/loading.vue";const m=h.exports;var v=n(691),f=n(79);s.Z.use(o.m5),console.log("Environment: ","production");const g=new s.Z({router:v.Z,el:"#app",components:{AppComponent:c},data:{loaded:!1},render(e){return this.loaded?e(c,{key:"app"}):(0,o.gI)(e,m)}});(async()=>{await f.Z.getType(),r.Z.session&&await f.Z.getSelf().catch((()=>{}))})().then((()=>{console.log("Initialized Main!"),g.loaded=!0}),(e=>{console.error("Error initializing main: ",e.stack||e.message||e),(0,o.h7)({title:"Error",message:"Error initializing main: "+String(e.message||e),type:"danger",alert:!0})}))},691:(e,t,n)=>{n.d(t,{Z:()=>u});var s=n(670),o=n(990),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"tiny-not-found"}},[n("h1",[e._v("404 Not Found")]),e._v(" "),n("p",[e._v("Couldn't find the page you were looking for. Try going "),n("router-link",{attrs:{to:"/"}},[e._v("Home")]),e._v("?")],1)])};a._withStripped=!0;const r={name:"tiny-not-found"};var i=(0,n(900).Z)(r,a,[],!1,null,null,null);i.options.__file="src/web/pages/not-found.vue";const l=i.exports;var d=n(271);s.Z.use(o.Z);const c=new o.Z({mode:"history",routes:[{path:"/",component:()=>n.e(89).then(n.bind(n,89)),name:"home"},{path:"/sessions",component:()=>Promise.all([n.e(700),n.e(914)]).then(n.bind(n,715)),name:"sessions"},{path:"/login",component:()=>n.e(329).then(n.bind(n,329)),name:"login"},{path:"/handshake",component:()=>n.e(888).then(n.bind(n,888)),name:"handshake"},{path:"**",component:l,name:"not-found"}]});c.beforeEach(((e,t,n)=>{const s="tiny "+(d.Z.type?d.Z.type+"s ":"")+"host";if(e.path!==t.path)if(e.name)document.title=s+" - "+e.name;else if(e.path.length>1){const t=[];let n="";e.path.slice(1).split("/").forEach((e=>{e?n?t.push(n+e):t.push(e):n+="/"})),document.title=s+" - "+t.join(" - ")}else document.title=s;d.Z.session||/^\/login/.test(e.path)||n(`/login?goto=${e.fullPath}`),n()}));const u=c},271:(e,t,n)=>{n.d(t,{Z:()=>s});const s=new class{constructor(){this.user=null,this.type=void 0}get session(){return localStorage.getItem("sid")}set session(e){localStorage.setItem("sid",e)}clear(){localStorage.clear(),this.user=null,this.type=void 0}}},79:(e,t,n)=>{n.d(t,{Z:()=>c});var s=n(222),o=n.n(s),a=n(517),r=n(271),i=n(691);const l=location.origin;function d(e){var t,n,s;e&&(403===(null===(t=e.response)||void 0===t?void 0:t.status)&&"No session found!"===(null===(s=null===(n=e.response)||void 0===n?void 0:n.data)||void 0===s?void 0:s.message)&&r.Z.clear(),r.Z.session||/^\/login/.test(i.Z.currentRoute.path)||i.Z.push(`/login?goto=${i.Z.currentRoute.fullPath}`),(0,a.S3)(e))}const c=new class{constructor(){this._auth=Object.freeze({async login(e,t){await o().post(`${l}/auth/login`,{username:e,password:t}).then((e=>r.Z.session=String(e.data)),(e=>{throw d(e),e}))},register:async(e,t)=>o().post(`${l}/auth/register`,{username:e,password:t}).then((()=>null),(e=>{throw d(e),e})),async refresh(){await o().get(`${l}/auth/refresh?sid=${r.Z.session}`).then((e=>r.Z.session=String(e.data)),d)},getSessions:async()=>o().get(`${l}/auth/sessions?sid=${r.Z.session}`).then((e=>e.data)).catch((e=>{throw d(e),e})),async delSession(e){await o().delete(`${l}/auth/sessions/${e}?sid=${r.Z.session}`).catch(d)},async clearSessions(){await o().delete(`${l}/auth/sessions?sid=${r.Z.session}`).catch(d)},async logout(){await o().post(`${l}/auth/logout?sid=${r.Z.session}`).catch(d),r.Z.clear()},async changePass(e,t){await o().post(`${l}/auth/change-pass?sid=${r.Z.session}`,{password:e,newpass:t}).catch((e=>{throw d(e),e}))},getHandshakeInfo:async e=>o().get(`${l}/auth/handshake/${e}?sid=${r.Z.session}`).then((e=>e.data),d),approveHandshake(e){location.href=`${l}/auth/handshake/${e}/approve?sid=${r.Z.session}`},cancelHandshake(e){location.href=`${l}/auth/handshake/${e}/cancel?sid=${r.Z.session}`},getMasterKeys:async()=>o().get(`${l}/auth/master-key?sid=${r.Z.session}`).then((e=>e.data),(e=>{throw d(e),e})),addMasterKey:async e=>o().post(`${l}/auth/master-key?name=${e}&sid=${r.Z.session}`).then((e=>e.data),(e=>{throw d(e),e})),async updateMasterKey(e,t){await o().put(`${l}/auth/master-key/${e}?sid=${r.Z.session}`,{name:t})},async delMasterKey(e){await o().delete(`${l}/auth/master-key/${e}?sid=${r.Z.session}`)}})}get auth(){return this._auth}async getType(){const e=await o().get(`${l}/type`).then((e=>e.data)).catch((e=>{}));return r.Z.type=e,e}async getSelf(){const e=await o().get(`${l}/self?sid=${r.Z.session}`).then((e=>e.data)).catch((e=>{throw d(e),e}));return r.Z.user=e,e}async deleteSelf(e){await o().delete(`${l}/self?sid=${r.Z.session}&pass=${e}`).catch((e=>{throw d(e),e})),r.Z.clear()}}},517:(e,t,n)=>{n.d(t,{m5:()=>h,S3:()=>p,gI:()=>i,MO:()=>u,h7:()=>c});var s=function(){var e,t,n,s,o=this,a=o.$createElement,r=o._self._c||a;return r("transition",{attrs:{name:"fade"}},[o.active?r("div",{staticClass:"modal is-active",class:o.classes,attrs:{role:"dialog","aria-modal":"modal"}},[r("div",{staticClass:"modal-background",on:{click:function(e){return o.cancel()}}}),o._v(" "),r("div",{staticClass:"modal-card"},[r("header",{directives:[{name:"show",rawName:"v-show",value:o.title,expression:"title"}]},[r("span",[o._v(o._s(o.title))])]),o._v(" "),r("section",[r("p",[o._v(o._s(o.message))]),o._v(" "),o.input?r("div",{staticClass:"field"},["checkbox"===o.input.type?r("input",{directives:[{name:"model",rawName:"v-model",value:o.text,expression:"text"}],ref:"input",class:(e={},e[o.type]=!0,e),attrs:{placeholder:o.input.placeholder,required:o.input.required,readonly:o.input.readonly,type:"checkbox"},domProps:{checked:Array.isArray(o.text)?o._i(o.text,null)>-1:o.text},on:{change:function(e){var t=o.text,n=e.target,s=!!n.checked;if(Array.isArray(t)){var a=o._i(t,null);n.checked?a<0&&(o.text=t.concat([null])):a>-1&&(o.text=t.slice(0,a).concat(t.slice(a+1)))}else o.text=s}}}):"radio"===o.input.type?r("input",{directives:[{name:"model",rawName:"v-model",value:o.text,expression:"text"}],ref:"input",class:(t={},t[o.type]=!0,t),attrs:{placeholder:o.input.placeholder,required:o.input.required,readonly:o.input.readonly,type:"radio"},domProps:{checked:o._q(o.text,null)},on:{change:function(e){o.text=null}}}):r("input",{directives:[{name:"model",rawName:"v-model",value:o.text,expression:"text"}],ref:"input",class:(n={},n[o.type]=!0,n),attrs:{placeholder:o.input.placeholder,required:o.input.required,readonly:o.input.readonly,type:o.input.type},domProps:{value:o.text},on:{input:function(e){e.target.composing||(o.text=e.target.value)}}}),o._v(" "),r("span",{staticClass:"error"},[o._v(o._s(o.input.required&&""===o.text?"required":""))])]):o._e()]),o._v(" "),r("footer",[o.alert?o._e():r("button",{on:{click:o.cancel}},[o._v("cancel")]),o._v(" "),r("button",{ref:"submit",class:(s={},s[o.type]=!0,s),attrs:{disabled:o.input&&o.input.required&&!o.text},on:{click:o.confirm,keydown:function(e){return!e.type.indexOf("key")&&o._k(e.keyCode,"esc",27,e.key,["Esc","Escape"])?null:o.cancel(e)}}},[o._v(o._s(o.alert?"ok":"confirm"))])])])]):o._e()])};s._withStripped=!0;const o={name:"tiny-modal",props:{title:String,message:String,type:{type:String,default:"primary"},alert:Boolean,prompt:{type:Object,default:()=>null}},data:()=>({active:!1,text:void 0}),computed:{classes(){return{[this.type]:!0}},input(){return this.prompt?Object.assign({type:"text",placeholder:"",required:!1,readonly:Boolean(this.alert)},this.prompt):null}},mounted(){var e;this.active=!0,this.$nextTick((()=>{var e,t;return this.input?null===(e=this.$refs.input)||void 0===e?void 0:e.focus():null===(t=this.$refs.submit)||void 0===t?void 0:t.focus()})),window.addEventListener("keyup",this.onKey),(null===(e=this.prompt)||void 0===e?void 0:e.value)&&(this.text=this.prompt.value)},destroyed(){window.removeEventListener("keyup",this.onKey)},methods:{confirm(){this.active&&(this.$emit("confirm",!this.input||this.text),this.close())},cancel(){this.active&&(this.$emit("cancel"),this.close())},close(){this.active&&(this.active=!1,setTimeout((()=>{var e;this.$destroy(),void 0!==(e=this.$el).remove?e.remove():void 0!==e.parentNode&&null!==e.parentNode&&e.parentNode.removeChild(e)}),150))},onKey(e){this.active&&("Enter"===e.key?this.confirm():"Escape"===e.key&&this.cancel())}}};var a=(0,n(900).Z)(o,s,[],!1,null,null,null);a.options.__file="src/web/components/modal.vue";const r=a.exports;function i(e,t){return e("div",{staticStyle:{display:"flex",flexFlow:"column",flexWrap:"nowrap",alignItems:"center",justifyContent:"center",position:"fixed",top:"0",left:"0",height:"100%",width:"100%",backgroundColor:"transparent"}},[e(t)])}let l;let d;async function c(e){const t=("undefined"!=typeof window&&window.Vue?window.Vue:d||l).extend(r),n=document.createElement("div");document.body.append(n);const s=new t({el:n,propsData:e});return new Promise((e=>{s.$on("confirm",(t=>{e(t)})),s.$on("cancel",(()=>e(void 0)))}))}async function u(e,t){const n=("undefined"!=typeof window&&window.Vue?window.Vue:d||l).extend(e),s=document.createElement("div");document.body.append(s);const o=new n({el:s,propsData:t});return new Promise((e=>{o.$on("confirm",(t=>{e(t)})),o.$on("cancel",(()=>e(void 0)))}))}async function p(e,t){var n,s;return c({title:t?"Error "+t:"Error",message:(null===(s=null===(n=e.response)||void 0===n?void 0:n.data)||void 0===s?void 0:s.message)||e.message||String(e),type:"danger",alert:!0})}const h={install(e){d=e}}}},a={};function r(e){if(a[e])return a[e].exports;var t=a[e]={exports:{}};return o[e](t,t.exports,r),t.exports}r.m=o,r.x=e=>{},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.f={},r.e=e=>Promise.all(Object.keys(r.f).reduce(((t,n)=>(r.f[n](e,t),t)),[])),r.u=e=>e+"."+{89:"d4d5c13e77dfa15369d2",329:"a8d410dd74d395fb8d24",700:"fe160bc5ea3d2665bbad",888:"4cc737c23500e7b9aeeb",914:"4375184719e445cb9866"}[e]+".js",r.miniCssF=e=>e+".css",r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="tiny-host-common:",r.l=(n,s,o,a)=>{if(e[n])e[n].push(s);else{var i,l;if(void 0!==o)for(var d=document.getElementsByTagName("script"),c=0;c<d.length;c++){var u=d[c];if(u.getAttribute("src")==n||u.getAttribute("data-webpack")==t+o){i=u;break}}i||(l=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,r.nc&&i.setAttribute("nonce",r.nc),i.setAttribute("data-webpack",t+o),i.src=n),e[n]=[s];var p=(t,s)=>{i.onerror=i.onload=null,clearTimeout(h);var o=e[n];if(delete e[n],i.parentNode&&i.parentNode.removeChild(i),o&&o.forEach((e=>e(s))),t)return t(s)},h=setTimeout(p.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=p.bind(null,i.onerror),i.onload=p.bind(null,i.onload),l&&document.head.appendChild(i)}},r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.p="",n=e=>new Promise(((t,n)=>{var s=r.miniCssF(e),o=r.p+s;if(((e,t)=>{for(var n=document.getElementsByTagName("link"),s=0;s<n.length;s++){var o=(r=n[s]).getAttribute("data-href")||r.getAttribute("href");if("stylesheet"===r.rel&&(o===e||o===t))return r}var a=document.getElementsByTagName("style");for(s=0;s<a.length;s++){var r;if((o=(r=a[s]).getAttribute("data-href"))===e||o===t)return r}})(s,o))return t();((e,t,n,s)=>{var o=document.createElement("link");o.rel="stylesheet",o.type="text/css",o.onerror=o.onload=a=>{if(o.onerror=o.onload=null,"load"===a.type)n();else{var r=a&&("load"===a.type?"missing":a.type),i=a&&a.target&&a.target.href||t,l=new Error("Loading CSS chunk "+e+" failed.\n("+i+")");l.code="CSS_CHUNK_LOAD_FAILED",l.type=r,l.request=i,o.parentNode.removeChild(o),s(l)}},o.href=t,document.head.appendChild(o)})(e,o,t,n)})),s={945:0},r.f.miniCss=(e,t)=>{s[e]?t.push(s[e]):0!==s[e]&&{89:1,329:1,888:1,914:1}[e]&&t.push(s[e]=n(e).then((()=>{s[e]=0}),(t=>{throw delete s[e],t})))},(()=>{var e={945:0},t=[[418,658]];r.f.j=(t,n)=>{var s=r.o(e,t)?e[t]:void 0;if(0!==s)if(s)n.push(s[2]);else{var o=new Promise(((n,o)=>{s=e[t]=[n,o]}));n.push(s[2]=o);var a=r.p+r.u(t),i=new Error;r.l(a,(n=>{if(r.o(e,t)&&(0!==(s=e[t])&&(e[t]=void 0),s)){var o=n&&("load"===n.type?"missing":n.type),a=n&&n.target&&n.target.src;i.message="Loading chunk "+t+" failed.\n("+o+": "+a+")",i.name="ChunkLoadError",i.type=o,i.request=a,s[1](i)}}),"chunk-"+t,t)}};var n=e=>{},s=(s,o)=>{for(var a,i,[l,d,c,u]=o,p=0,h=[];p<l.length;p++)i=l[p],r.o(e,i)&&e[i]&&h.push(e[i][0]),e[i]=0;for(a in d)r.o(d,a)&&(r.m[a]=d[a]);for(c&&c(r),s&&s(o);h.length;)h.shift()();return u&&t.push.apply(t,u),n()},o=self.webpackChunktiny_host_common=self.webpackChunktiny_host_common||[];function a(){for(var n,s=0;s<t.length;s++){for(var o=t[s],a=!0,i=1;i<o.length;i++){var l=o[i];0!==e[l]&&(a=!1)}a&&(t.splice(s--,1),n=r(r.s=o[0]))}return 0===t.length&&(r.x(),r.x=e=>{}),n}o.forEach(s.bind(null,0)),o.push=s.bind(null,o.push.bind(o));var i=r.x;r.x=()=>(r.x=i||(e=>{}),(n=a)())})();r.x()})();