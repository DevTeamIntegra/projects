sap.ui.define(["prestamosgp2/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/core/routing/History"],function(e,t,o){"use strict";return e.extend("prestamosgp2.controller.App",{onInit:function(){var e,o=this.getOwnerComponent().oListSelector,s=this.getView().getBusyIndicatorDelay();e=new t({busy:true,delay:0});this.setModel(e,"appView");o.attachListSelectionChange(function(){this.byId("idAppControl").hideMaster()},this);this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());return new Promise(function(t){e.setProperty("/busy",false);e.setProperty("/delay",s);t()}.bind(this))},setMode:function(e){this.byId("idAppControl").setMode(e)}})});
//# sourceMappingURL=App.controller.js.map