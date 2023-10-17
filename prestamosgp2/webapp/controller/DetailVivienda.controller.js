sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
    "prestamosgp2/utils/utils",
    "prestamosgp2/model/models"
], function(BaseController, MessageBox, Utilities, History, Utils, models) {
	"use strict";

	return BaseController.extend("prestamosgp2.controller.DetailVivienda", {
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
		_onButtonPress: function(oEvent) {
			this.getOwnerComponent().setModelVivienda(models.getSimulacionVivienda(this.getEntries(), this.getOwnerComponent().oToken, this.getView()));

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("DetailVivienda2", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
			/* this.oRouter.navTo("DetailVivienda", {
				oModel: oModel.oData
			});
			*/
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
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("DetailVivienda").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("MasterPage1", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

		},
		onAfterRendering : function(){
			var oDate = Utils.getActualDate();
			this.setDate(oDate);
			this.getView().byId("idInputViviendaAnyosText").addStyleClass("bolder-text");
		},
		setDate : function (date){
			var oInput = this.byId("idLabelViviendaAnyo");
			oInput.setValue(date.anyo);
			var oComboBox = this.byId("idCBoxViviendaMes");
			oComboBox.setSelectedKey(date.mes);
		},
		getEntries:function(){
			var oTipo = Utils.getTipoNum(this.byId("idInputViviendaTipo").getValue());
			var oCarencia = parseInt(this.byId("idCBoxViviendaCarencia").getSelectedKey());
			var oCondicion = parseInt(this.byId("idCBoxViviendaCondicion").getSelectedKey());
			var oMes = this.byId("idCBoxViviendaMes").getSelectedKey();
			var oAnyo = this.byId("idLabelViviendaAnyo").getValue();
			var oImporte = this.byId("idSliderVivviendaImporte").getValue();
			var oTotalAnyos = parseInt(this.byId("idSliderViviendaAnyos").getValue());
			return {
				tipoPrestamo : oTipo,
				carencia : oCarencia,
				crecimiento : oCondicion,
				mesInicio : oMes,
				anioInicio : oAnyo,
				importe : oImporte,
				plazo : oTotalAnyos
			}
		},
		_onChangeImporte : function (oEvent){
			var oView = this.getView();
			var oValue = oEvent.getSource().getValue();
			oView.byId("idInputViviendaTipoText").setValue(oValue);
		},
		_onChangeAnyos : function (oEvent){
			var oView = this.getView();
			var oValue = oEvent.getSource().getValue();
			oView.byId("idInputViviendaAnyosText").setValue(oValue);

		}
	});
}, /* bExport= */ true);
