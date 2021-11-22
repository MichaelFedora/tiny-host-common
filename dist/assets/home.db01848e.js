var M=Object.defineProperty,B=Object.defineProperties;var S=Object.getOwnPropertyDescriptors;var v=Object.getOwnPropertySymbols;var q=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;var g=(s,e,n)=>e in s?M(s,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[e]=n,w=(s,e)=>{for(var n in e||(e={}))q.call(e,n)&&g(s,n,e[n]);if(v)for(var n of v(e))D.call(e,n)&&g(s,n,e[n]);return s},m=(s,e)=>B(s,S(e));import{d as h,r as p,c as V,o as j,n as A,g as c,b as _,w as y,i as t,j as C,K as k,t as $,p as E,u as K,L as N,J as T,M as x,C as P,h as L,l as R,e as U}from"./vendor.92434493.js";import{_ as J,a as z,d as F,l as f,m as G}from"./index.2406ed0f.js";const H={class:"field"},I={class:"error"},O={class:"field"},Q={class:"error"},W=h({emits:["confirm"],setup(s,{emit:e}){const n=p(null),r=p(void 0),l=p(void 0),d=V(()=>!Boolean(!r.value||!l.value||l.value.length<4));j(()=>{A(()=>{var i;return(i=n.value)==null?void 0:i.focus()})});function u(){!d.value||e("confirm",{password:r.value,newpass:l.value})}return(i,o)=>(c(),_(J,{valid:K(d),title:"Change Password",type:"warning",onConfirm:o[3]||(o[3]=a=>u())},{default:y(()=>[t("div",H,[C(t("input",{class:"warning",type:"password",ref:(a,b)=>{b.passEl=a,n.value=a},required:"",placeholder:"old password","onUpdate:modelValue":o[0]||(o[0]=a=>r.value=a)},null,512),[[k,r.value]]),t("span",I,$(r.value===""?"required":""),1)]),t("div",O,[C(t("input",{class:"warning",type:"password",required:"",placeholder:"new password","onUpdate:modelValue":o[1]||(o[1]=a=>l.value=a),onKeydown:o[2]||(o[2]=E(a=>u(),["enter"]))},null,544),[[k,l.value]]),t("span",Q,$(l.value!=null?l.value===""?"required":l.value.length<4?"at least 4 characters":"":""),1)])]),_:1},8,["valid"]))}});const X=h({components:{ChangePassModal:W},setup(s,e){var o;const n=N(),r=T({working:!1,username:((o=F.user)==null?void 0:o.username)||"???",showChangePass:!1});async function l(){r.working||(r.working=!0,r.working=!1)}async function d(a){a&&typeof a=="object"&&await f.auth.changePass(a.password,a.newpass).catch(()=>{})}async function u(){await f.auth.logout(),n.push("/login")}async function i(){const a=await G.open({title:"Delete Account",type:"danger",message:"Are you sure you want to delete your account? This cannot be undone.",prompt:{type:"password",placeholder:"password",required:!0}});a&&await f.deleteSelf(a).then(()=>n.push("/login"),()=>{})}return l(),m(w({},x(r)),{refresh:l,changePass:d,logout:u,deleteSelf:i})}}),Y={id:"tiny-home"},Z=t("span",null,"Manage Sessions",-1),ee=t("span",null,"Change Password",-1),se=[ee],ne=t("span",null,"Delete Account",-1),oe=[ne],ae=t("span",null,"Logout",-1),te=[ae];function le(s,e,n,r,l,d){const u=P("ChangePassModal"),i=P("router-link");return c(),L("div",Y,[s.showChangePass?(c(),_(u,{key:0,onDestroy:e[0]||(e[0]=o=>s.showChangePass=!1),onConfirm:s.changePass},null,8,["onConfirm"])):R("",!0),t("div",null,[U(i,{class:"button info",to:"/sessions"},{default:y(()=>[Z]),_:1}),t("button",{class:"warning",onClick:e[1]||(e[1]=o=>s.showChangePass=!0)},se),t("button",{class:"danger",onClick:e[2]||(e[2]=(...o)=>s.deleteSelf&&s.deleteSelf(...o))},oe),t("button",{class:"primary",onClick:e[3]||(e[3]=(...o)=>s.logout&&s.logout(...o))},te)])])}var de=z(X,[["render",le]]);export{de as default};