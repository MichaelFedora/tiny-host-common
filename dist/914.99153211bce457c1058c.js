(self.webpackChunktiny_host_common=self.webpackChunktiny_host_common||[]).push([[914],{715:(s,e,t)=>{"use strict";t.r(e),t.d(e,{default:()=>l});var a=function(){var s=this,e=s.$createElement,t=s._self._c||e;return t("div",{attrs:{id:"tiny-sessions"}},[t("h1",[t("router-link",{staticClass:"button icon info",attrs:{to:"/"}},[t("svg-icon",{attrs:{type:"mdi",path:s.mdiArrowLeft}})],1),s._v(" "),t("span",[s._v("sessions - "+s._s(s.username))])],1),s._v(" "),s.masterkeys?[t("h2",{staticClass:"sub"},[t("span",[s._v("master keys")]),s._v(" "),t("button",{staticClass:"icon success",on:{click:s.addKey}},[t("svg-icon",{attrs:{type:"mdi",path:s.mdiPlus}})],1)]),s._v(" "),t("div",{staticClass:"masterkeys"},[t("span",{staticClass:"h4 sub"},[s._v("id")]),s._v(" "),t("span",{staticClass:"h4 sub"},[s._v("name")]),s._v(" "),t("span",{staticClass:"h4 sub"},[s._v("options")]),s._v(" "),s._l(s.masterkeys,(function(e,a){return[t("span",{key:"mk-id-"+a},[s._v(s._s(e.id))]),s._v(" "),t("div",{key:"mk-name-"+a,staticClass:"name"},[e.editing?t("input",{directives:[{name:"model",rawName:"v-model",value:e.editName,expression:"mk.editName"}],attrs:{type:"text",placeholder:"name",required:""},domProps:{value:e.editName},on:{input:function(t){t.target.composing||s.$set(e,"editName",t.target.value)}}}):t("span",[s._v(s._s(e.name))])]),s._v(" "),t("div",{key:"mk-opts-"+a},[e.editing?[t("button",{staticClass:"success",on:{click:function(t){return s.save("mk",e)}}},[s._v("save")]),s._v(" "),t("button",{on:{click:function(t){return s.cancel("mk",e)}}},[s._v("cancel")])]:[t("button",{staticClass:"warning",on:{click:function(t){return s.edit("mk",e)}}},[s._v("edit")]),s._v(" "),t("button",{staticClass:"danger",on:{click:function(t){return s.revoke("mk",e.id)}}},[s._v("revoke")])]],2)]})),s._v(" "),s.masterkeys.length?s._e():t("span",{staticStyle:{"grid-column":"1 / 4"}},[s._v("Nothing here...")])],2)]:s._e(),s._v(" "),t("h2",{staticClass:"sub"},[s._v("sessions")]),s._v(" "),t("div",{staticClass:"sessions"},[t("span",{staticClass:"h4 sub"},[s._v("id")]),s._v(" "),t("span",{staticClass:"h4 sub"},[s._v("scopes")]),s._v(" "),t("span",{staticClass:"h4 sub"},[s._v("created")]),s._v(" "),t("span",{staticClass:"h4 sub"},[s._v("options")]),s._v(" "),s._l(s.sessions,(function(e,a){return[t("span",{key:"sess-id-"+a},[s._v(s._s(e.id))]),s._v(" "),t("div",{key:"sess-scopes-"+a,staticClass:"scopes"},s._l(e.scopes,(function(e,i){return t("span",{key:"sess-scope-"+a+"-"+i},[s._v(s._s(e))])})),0),s._v(" "),t("span",{key:"sess-created-"+a},[s._v(s._s(new Date(e.created).toLocaleString()))]),s._v(" "),t("div",{key:"sess-opts-"+a},[t("button",{staticClass:"danger",on:{click:function(t){return s.revoke("s",e.id)}}},[s._v("revoke")])])]})),s._v(" "),s.sessions.length?s._e():t("span",{staticStyle:{"grid-column":"1 / 4"}},[s._v("Nothing here...")])],2)],2)};a._withStripped=!0;var i=t(800),n=t(568),r=t(271),c=t(79),o=t(517);const u={name:"tiny-sessions",components:{SvgIcon:i.Z},data(){var s;return{working:!1,username:(null===(s=r.Z.user)||void 0===s?void 0:s.username)||"???",mdiArrowLeft:n.J3k,mdiPlus:n.qX5,sessions:[],masterkeys:[]}},mounted(){this.refresh()},methods:{async refresh(){this.working||(this.working=!0,c.Z.auth.getSessions().then((s=>this.sessions=s),(()=>{})),c.Z.auth.getMasterKeys().then((s=>this.masterkeys=s),(()=>this.masterkeys=null)),this.working=!1)},async addKey(){const s=await(0,o.h7)({title:"Add Master Key",message:"A Master Key can be used by a Tiny Home to use this node when authorizing with apps. Be careful -- this key can be used to access all of your data!",type:"warning",prompt:{required:!0,placeholder:"name"}});if(!s)return;const e=await c.Z.auth.addMasterKey(s).catch((()=>null));e&&((0,o.h7)({title:"Master Key Added",message:"Add this to your tiny home. It can always be revoked from this page.",prompt:{readonly:!0,value:e},alert:!0}),this.refresh())},async edit(s,e){switch(s){case"mk":this.$set(e,"editName",e.name)}this.$set(e,"editing",!0)},cancel(s,e){switch(this.$set(e,"editing",!1),s){case"mk":this.$set(e,"editName",e.name)}},async save(s,e){switch(s){case"mk":if(!e.editName)return;await c.Z.auth.updateMasterKey(e.id,e.editName).catch((()=>{})),await this.refresh()}this.cancel(s,e)},async revoke(s,e){switch(s){case"s":await c.Z.auth.delSession(e).catch((()=>{}));case"mk":await c.Z.auth.delMasterKey(e).catch((()=>{}))}return this.refresh()}}};var d=(0,t(900).Z)(u,a,[],!1,null,null,null);d.options.__file="src/web/pages/sessions.vue";const l=d.exports}}]);