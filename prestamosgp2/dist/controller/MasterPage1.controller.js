sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox","./utilities","sap/ui/core/routing/History"],function(t,e,n,i){"use strict";return t.extend("prestamosgp2.controller.MasterPage1",{handleRouteMatched:function(t){var e="App64ca9cab5325fba361b2af22";var n={};var i=this.getView();var s=true;if(t.mParameters.data.context||t.mParameters.data.masterContext){this.sContext=t.mParameters.data.context;this.sMasterContext=t.mParameters.data.masterContext}else{if(this.getOwnerComponent().getComponentData()){var a=function(t){if(Object.keys(t).length!==0){for(var e in t){if(e!=="sourcePrototype"&&e.includes("Set")){return e+"("+t[e][0]+")"}}}};this.sMasterContext=a(this.getOwnerComponent().getComponentData().startupParameters)}}var o;if(this.sMasterContext&&t.getParameters().config.bypassed.target[0]!==this.sMasterContext){o={path:"/"+this.sMasterContext,parameters:n};this.getView().bindObject(o)}else if(this.sContext){var r="/"+this.sContext;s=false}if(s){i.addEventDelegate({onBeforeShow:function(){var t=this.getView().getContent();if(t){if(!sap.ui.Device.system.phone){var e=t[0].getContent()?t[0].getContent()[0]:undefined;if(e){var n=e.getMetadata().getName();if(n.indexOf("List")>-1){e.attachEventOnce("updateFinished",function(){var t=this.getItems()[0];if(t){e.setSelectedItem(t);e.fireItemPress({listItem:t})}}.bind(e))}}}}}.bind(this)})}},_attachSelectListItemWithContextPath:function(t){var e=this.getView();var n=this.getView().getContent();if(n){if(!sap.ui.Device.system.phone){var i=n[0].getContent()?n[0].getContent()[0]:undefined;if(i&&t){var s=i.getMetadata().getName();var a,o,r,u,f;if(s.indexOf("List")>-1){if(i.getItems().length){a=null;u=i.getItems();for(f=0;f<u.length;f++){o=u[f];r=o.getBindingContext();if(r&&r.getPath()===t){a=o}}if(a){i.setSelectedItem(a)}}else{e.addEventDelegate({onBeforeShow:function(){i.attachEventOnce("updateFinished",function(){a=null;u=i.getItems();for(f=0;f<u.length;f++){o=u[f];r=o.getBindingContext();if(r&&r.getPath()===t){a=o}}if(a){i.setSelectedItem(a)}})}})}}}}}},_onObjectListItemPress:function(t){var n=t.getSource().getBindingContext();return new Promise(function(t){this.doNavigate("DetailCuadro",n,t,"")}.bind(this)).catch(function(t){if(t!==undefined){e.error(t.message)}})},doNavigate:function(t,e,n,i){var s=e?e.getPath():null;var a=e?e.getModel():null;var o;if(s!==null&&s!==""){if(s.substring(0,1)==="/"){s=s.substring(1)}o=s.split("(")[0]}var r;var u=this.sMasterContext?this.sMasterContext:s;if(o!==null){r=i||this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(o,t)}if(r!==null&&r!==undefined){if(r===""){this.oRouter.navTo(t,{context:s,masterContext:u},false)}else{a.createBindingContext(r,e,null,function(e){if(e){s=e.getPath();if(s.substring(0,1)==="/"){s=s.substring(1)}}else{s="undefined"}if(s==="undefined"){this.oRouter.navTo(t)}else{this.oRouter.navTo(t,{context:s,masterContext:u},false)}}.bind(this))}}else{this.oRouter.navTo(t)}if(typeof n==="function"){n()}},_onObjectListItemPress1:function(t){var n=t.getSource().getBindingContext();return new Promise(function(t){this.doNavigate("DetailVivienda",n,t,"")}.bind(this)).catch(function(t){if(t!==undefined){e.error(t.message)}})},_onObjectListItemPress2:function(t){var n=t.getSource().getBindingContext();return new Promise(function(t){this.doNavigate("DetailConsumo",n,t,"")}.bind(this)).catch(function(t){if(t!==undefined){e.error(t.message)}})},_onObjectListItemPress3:function(t){var n=t.getSource().getBindingContext();return new Promise(function(t){this.doNavigate("DetailCondiciones",n,t,"")}.bind(this)).catch(function(t){if(t!==undefined){e.error(t.message)}})},_onObjectListItemPress4:function(t){var n=t.getSource().getBindingContext();return new Promise(function(t){this.doNavigate("DetailCotitular",n,t,"")}.bind(this)).catch(function(t){if(t!==undefined){e.error(t.message)}})},onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.getTarget("MasterPage1").attachDisplay(jQuery.proxy(this.handleRouteMatched,this))}})},true);
//# sourceMappingURL=MasterPage1.controller.js.map