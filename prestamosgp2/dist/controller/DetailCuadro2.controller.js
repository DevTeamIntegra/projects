sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox","./utilities","sap/ui/core/routing/History"],function(t,e,n,o){"use strict";return t.extend("prestamosgp2.controller.DetailCuadro2",{handleRouteMatched:function(t){var e="App64ca9cab5325fba361b2af22";var n={};if(t.mParameters.data.context){this.sContext=t.mParameters.data.context}else{if(this.getOwnerComponent().getComponentData()){var o=function(t){if(Object.keys(t).length!==0){for(var e in t){if(e!=="sourcePrototype"&&e.includes("Set")){return e+"("+t[e][0]+")"}}}};this.sContext=o(this.getOwnerComponent().getComponentData().startupParameters)}}var i;if(this.sContext){i={path:"/"+this.sContext,parameters:n};this.getView().bindObject(i)}},_onSegmentedButtonItemPress:function(t){var n=t.getSource().getBindingContext();return new Promise(function(t){this.doNavigate("DetailCuadro",n,t,"")}.bind(this)).catch(function(t){if(t!==undefined){e.error(t.message)}})},doNavigate:function(t,e,n,o){var i=e?e.getPath():null;var a=e?e.getModel():null;var s;if(i!==null&&i!==""){if(i.substring(0,1)==="/"){i=i.substring(1)}s=i.split("(")[0]}var r;var u=this.sMasterContext?this.sMasterContext:i;if(s!==null){r=o||this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(s,t)}if(r!==null&&r!==undefined){if(r===""){this.oRouter.navTo(t,{context:i,masterContext:u},false)}else{a.createBindingContext(r,e,null,function(e){if(e){i=e.getPath();if(i.substring(0,1)==="/"){i=i.substring(1)}}else{i="undefined"}if(i==="undefined"){this.oRouter.navTo(t)}else{this.oRouter.navTo(t,{context:i,masterContext:u},false)}}.bind(this))}}else{this.oRouter.navTo(t)}if(typeof n==="function"){n()}},onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.getTarget("DetailCuadro2").attachDisplay(jQuery.proxy(this.handleRouteMatched,this));var t=this.getView();t.addEventDelegate({onBeforeShow:function(){if(sap.ui.Device.system.phone){var e=t.getContent()[0];if(e.getShowNavButton&&!e.getShowNavButton()){e.setShowNavButton(true);e.attachNavButtonPress(function(){this.oRouter.navTo("DetailCuadro",{},true)}.bind(this))}}}.bind(this)})}})},true);
//# sourceMappingURL=DetailCuadro2.controller.js.map