var m=Object.defineProperty,g=Object.defineProperties;var y=Object.getOwnPropertyDescriptors;var h=Object.getOwnPropertySymbols;var b=Object.prototype.hasOwnProperty,w=Object.prototype.propertyIsEnumerable;var _=(e,s,a)=>s in e?m(e,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[s]=a,k=(e,s)=>{for(var a in s||(s={}))b.call(s,a)&&_(e,a,s[a]);if(h)for(var a of h(s))w.call(s,a)&&_(e,a,s[a]);return e},v=(e,s)=>g(e,y(s));import{d as B,z as $,c as C,J as H,o as j,M as A,h as u,i as t,t as c,F as D,E,D as i,g as d}from"./vendor.92434493.js";import{a as F,d as M,l as p}from"./index.2406ed0f.js";const N=B({setup(e,s){var l;const a=$(),o=C(()=>a.query.handshake),r=H({working:!1,username:((l=M.user)==null?void 0:l.username)||"{current user}",app:"",scopes:[]});return j(async()=>{if(!o.value)return;r.working=!0;const n=await p.auth.getHandshakeInfo(o.value).catch(()=>null);r.app=(n==null?void 0:n.app)||"{broken}",r.scopes=(n==null?void 0:n.scopes)||[],r.working=!1}),v(k({handshake:o},A(r)),{cancel(){p.auth.cancelHandshake(o.value)},approve(){o.value&&r.app&&p.auth.approveHandshake(o.value)}})}}),R={id:"tiny-handshake"},V=t("h1",null,"handshake",-1),q={class:"sub"},z=i(" scopes:"),J=t("br",null,null,-1),L=i("Authenticate as "),S=i(" with these scopes?"),T=t("hr",null,null,-1),x={id:"buttons"};function G(e,s,a,o,r,l){return d(),u("div",R,[V,t("h2",q,c(e.app),1),t("p",null,[z,J,t("ul",null,[(d(!0),u(D,null,E(e.scopes,(n,f)=>(d(),u("li",{key:"filescope-"+f},c(n),1))),128))])]),t("p",null,[L,t("b",null,c(e.username),1),S]),T,t("div",x,[t("button",{onClick:s[0]||(s[0]=(...n)=>e.cancel&&e.cancel(...n))},"cancel"),t("button",{class:"primary",onClick:s[1]||(s[1]=(...n)=>e.approve&&e.approve(...n))},"approve")])])}var Q=F(N,[["render",G]]);export{Q as default};
