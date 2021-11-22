var H=Object.defineProperty,A=Object.defineProperties;var B=Object.getOwnPropertyDescriptors;var N=Object.getOwnPropertySymbols;var x=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var V=(e,i,t)=>i in e?H(e,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[i]=t,$=(e,i)=>{for(var t in i||(i={}))x.call(i,t)&&V(e,t,i[t]);if(N)for(var t of N(i))I.call(i,t)&&V(e,t,i[t]);return e},K=(e,i)=>A(e,B(i));import{g as r,h as l,i as s,N as j,d as q,J as D,M as J,C as M,e as f,w as E,F as d,E as k,l as w,t as m,j as F,K as O}from"./vendor.92434493.js";import{a as z,d as b,l as u,m as C}from"./index.2406ed0f.js";const S={mdi:{size:24,viewbox:"0 0 24 24"},"simple-icons":{size:24,viewbox:"0 0 24 24"},default:{size:0,viewbox:"0 0 0 0"}},P={name:"icon",props:{type:String,path:{type:String,required:!0},size:{type:[String,Number],default:24},viewbox:String,flip:{type:String,validator:e=>["horizontal","vertical","both","none"].includes(e)},rotate:{type:Number,default:0}},computed:{styles(){return{"--sx":["both","horizontal"].includes(this.flip)?"-1":"1","--sy":["both","vertical"].includes(this.flip)?"-1":"1","--r":isNaN(this.rotate)?this.rotate:this.rotate+"deg"}},defaults(){return S[this.type]||S.default},sizeValue(){return this.size||this.defaults.size},viewboxValue(){return this.viewbox||this.defaults.viewbox}}},T=["width","height","viewBox"],U=["d"];function Z(e,i,t,h,g,p){return r(),l("svg",{width:p.sizeValue,height:p.sizeValue,viewBox:p.viewboxValue,style:j(p.styles)},[s("path",{d:t.path},null,8,U)],12,T)}var R=z(P,[["render",Z],["__scopeId","data-v-19dc2d73"]]),G="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",Q="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";const W=q({name:"tiny-sessions",components:{SvgIcon:R},setup(e,i){var c;const t=D({working:!1,username:((c=b.user)==null?void 0:c.username)||"???",mdiArrowLeft:G,mdiPlus:Q,sessions:[],masterkeys:[]});async function h(){t.working||(t.working=!0,u.auth.getSessions().then(n=>t.sessions=n,()=>{}),u.auth.getMasterKeys().then(n=>t.masterkeys=n,()=>t.masterkeys=null),t.working=!1)}h();async function g(){const n=await C.open({title:"Add Master Key",message:"A Master Key can be used by a Tiny Home to use this node when authorizing with apps. Be careful -- this key can be used to access all of your data!",type:"warning",prompt:{required:!0,placeholder:"name"}});if(console.log("name",n),!n)return;const o=await u.auth.addMasterKey(n).catch(()=>null);if(!o)return;const L=btoa(JSON.stringify({key:o,url:u.url,type:b.type})).replace(/=+$/,"");C.open({title:"Master Key Added",message:"Add this to your tiny home. It can always be revoked from this page.",prompt:{readonly:!0,value:L},alert:!0}),h()}function p(n){const o=btoa(JSON.stringify({key:n,url:u.url,type:b.type})).replace(/=+$/,"");C.open({title:'Master Key "'+n.name+'"',message:"Add this to your tiny home. It can always be revoked from this page.",prompt:{readonly:!0,value:o},alert:!0})}async function y(n,o){switch(n){case"mk":o.editName=o.name}o.editing=!0}function v(n,o){switch(o.editing=!1,n){case"mk":o.editName=o.name}}async function a(n,o){switch(n){case"mk":if(!o.editName)return;await u.auth.updateMasterKey(o.id,o.editName).catch(()=>{}),await h();break}v(n,o)}async function _(n,o){switch(n){case"s":await u.auth.delSession(o).catch(()=>{});case"mk":await u.auth.delMasterKey(o).catch(()=>{})}return h()}return K($({},J(t)),{refresh:h,addKey:g,useMasterKey:p,edit:y,cancel:v,save:a,revoke:_})}}),X={id:"tiny-sessions"},Y=s("span",null,"sessions",-1),ee={class:"sub"},se=s("span",null,"master keys",-1),te={class:"masterkeys"},ne=s("span",{class:"h4 sub"},"id",-1),ae=s("span",{class:"h4 sub"},"name",-1),oe=s("span",{class:"h4 sub"},"options",-1),ie={class:"name"},re=["onUpdate:modelValue"],le={key:1},ce=["onClick"],de=["onClick"],ue=["onClick"],he=["onClick"],pe=["onClick"],_e={key:0,style:{"grid-column":"1 / 4"}},me=s("h2",{class:"sub"},"sessions",-1),ye={class:"sessions"},ve=s("span",{class:"h4 sub"},"id",-1),ge=s("span",{class:"h4 sub"},"scopes",-1),fe=s("span",{class:"h4 sub"},"created",-1),ke=s("span",{class:"h4 sub"},"options",-1),we={class:"scopes"},be=["onClick"],Ce={key:0,style:{"grid-column":"1 / 4"}};function Ne(e,i,t,h,g,p){const y=M("svg-icon"),v=M("router-link");return r(),l("div",X,[s("h1",null,[f(v,{class:"button icon info",to:"/"},{default:E(()=>[f(y,{type:"mdi",path:e.mdiArrowLeft},null,8,["path"])]),_:1}),Y]),e.masterkeys?(r(),l(d,{key:0},[s("h2",ee,[se,s("button",{class:"icon success",onClick:i[0]||(i[0]=(...a)=>e.addKey&&e.addKey(...a))},[f(y,{type:"mdi",path:e.mdiPlus},null,8,["path"])])]),s("div",te,[ne,ae,oe,(r(!0),l(d,null,k(e.masterkeys,(a,_)=>(r(),l(d,{key:"mk-"+_},[s("span",null,m(a.id),1),s("div",ie,[a.editing?F((r(),l("input",{key:0,type:"text",placeholder:"name",required:"","onUpdate:modelValue":c=>a.editName=c},null,8,re)),[[O,a.editName]]):(r(),l("span",le,m(a.name),1))]),s("div",null,[a.editing?(r(),l(d,{key:1},[s("button",{class:"success",onClick:c=>e.save("mk",a)},"save",8,he),s("button",{onClick:c=>e.cancel("mk",a)},"cancel",8,pe)],64)):(r(),l(d,{key:0},[s("button",{class:"primary",onClick:c=>e.useMasterKey(a.id)},"use",8,ce),s("button",{class:"warning",onClick:c=>e.edit("mk",a)},"edit",8,de),s("button",{class:"danger",onClick:c=>e.revoke("mk",a.id)},"revoke",8,ue)],64))])],64))),128)),e.masterkeys.length?w("",!0):(r(),l("span",_e,"Nothing here..."))])],64)):w("",!0),me,s("div",ye,[ve,ge,fe,ke,(r(!0),l(d,null,k(e.sessions,(a,_)=>(r(),l(d,{key:"sess-"+_},[s("span",null,m(a.id),1),s("div",we,[(r(!0),l(d,null,k(a.scopes,(c,n)=>(r(),l("span",{key:"sess-scope-"+_+"-"+n,class:"tag"},m(c),1))),128))]),s("span",null,m(new Date(a.created).toLocaleString()),1),s("div",null,[s("button",{class:"danger",onClick:c=>e.revoke("s",a.id)},"revoke",8,be)])],64))),128)),e.sessions.length?w("",!0):(r(),l("span",Ce,"Nothing here..."))])])}var Me=z(W,[["render",Ne]]);export{Me as default};
