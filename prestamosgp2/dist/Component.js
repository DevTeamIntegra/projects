sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","prestamosgp2/model/models","prestamosgp2/controller/ListSelector","prestamosgp2/model/errorHandling","prestamosgp2/utils/utils"],function(e,t,s,o,i,n){"use strict";var a={};return e.extend("prestamosgp2.Component",{metadata:{manifest:"json"},init:function(){var t=this;this.oListSelector=new o;this.setModel(s.createDeviceModel(),"device");s.getToken(function(e){if(e){t.oToken=e.access_token}else{n.showErrorMsg("Error al obtener el token")}});this.setModel(new sap.ui.model.json.JSONModel({}),"dataSource");var a=new sap.ui.model.json.JSONModel({});this.setModel(a,"applicationModel");e.prototype.init.apply(this,arguments);i.register(this);this.getRouter().initialize()},destroy:function(){this.oListSelector.destroy();e.prototype.destroy.apply(this,arguments)},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(jQuery(document.body).hasClass("sapUiSizeCozy")||jQuery(document.body).hasClass("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!t.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass},getNavigationPropertyForNavigationWithContext:function(e,t){var s=a[e];return s==null?null:s[t]},setModelVivienda:function(e){this.setModel(e,"SimuViviendaModel")}})});
//# sourceMappingURL=Component.js.map