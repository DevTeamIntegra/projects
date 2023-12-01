sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
], function(BaseController, MessageBox, Utilities, History,JSONModel) {
	"use strict";

	return BaseController.extend("prestamosgp2.controller.DetailHome", {
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
		onInit: function() {
			const sPath = sap.ui.require.toUrl("prestamosgp2/img/logoICO.jpg");
			const oModel = new JSONModel({imagePath:sPath});
			this.getView().setModel(oModel,"oImg");
			this.getOwnerComponent().setModel(oModel,"oImgModel");
			
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("DetailHome").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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

		}
	});
}, /* bExport= */ true);
