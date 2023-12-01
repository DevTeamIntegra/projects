sap.ui.define(["sap/ui/core/mvc/Controller",
	"prestamosgp2/utils/formatter",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
    "prestamosgp2/model/models",
    "prestamosgp2/utils/utils"

], function(BaseController, formatter, MessageBox, Utilities, History,models,Utils) {
	"use strict";

	return BaseController.extend("prestamosgp2.controller.DetailCuadro2", {
		formatter:formatter,

		handleRouteMatched: function(oEvent) {
			var sAppId = "App64ca9cab5325fba361b2af22";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onSegmentedButtonItemPress: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("DetailCuadro", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		onInit: function() {
			this.getView().setModel(this.getOwnerComponent().getModel('UserInfo'),'UserInfoComplete');
			this.getView().setModel(this.getOwnerComponent().getModel('PreviousCuadroPageModel'),'PreviousCuadroPageModel');

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("DetailCuadro2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("DetailCuadro", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

		},
		_onSegmentedButtonImprimirPress: function(oEvent) {
			var oThis = this;
			oThis.getOwnerComponent().dialog.open();
			var CuadroPrestamoModel = oThis.getView().getModel('CuadroPrestamoModel');
			var oUserModel = oThis.getView().getModel('UserInfoComplete');
			var oPrestamosUserModel = oThis.getView().getModel('PrestamosUser');
			var oPrestamo = oPrestamosUserModel.oData.find(p => p.dni == oUserModel.oData.dni);

			oUserModel.oData.listaCuotas = CuadroPrestamoModel.oData;
			oUserModel.oData.codigo = oPrestamo.idPrestamo;
			oUserModel.oData.importe = oPrestamo.importe;
			oUserModel.refresh();

			Utils.abrirVisorPDF(models.sendToPrint(models.formatModelToPrint(oUserModel.oData, ''), models.getCsrfToken()));
			oThis.getOwnerComponent().dialog.close();
		}
	});
}, /* bExport= */ true);
