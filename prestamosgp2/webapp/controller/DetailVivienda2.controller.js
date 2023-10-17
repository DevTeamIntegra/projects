sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"prestamosgp2/utils/utils",
    "prestamosgp2/model/models"
], function(BaseController, MessageBox, Utilities, History, Utils, models) {
	"use strict";

	return BaseController.extend("prestamosgp2.controller.DetailVivienda2", {
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

				this.doNavigate("DetailVivienda", oBindingContext, fnResolve, "");
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
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("DetailVivienda2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("DetailVivienda", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});
		},

		_onPrintTable: function() {
			// Agrega la marca de agua como un elemento HTML al cuerpo de la página
			document.documentElement.classList.add('imprimir');
			var watermark = document.createElement('div');
			watermark.classList.add('watermark'); // Agrega la clase de CSS para la marca de agua
			watermark.textContent = 'Marca de Agua'; // Texto de la marca de agua
			document.body.appendChild(watermark);
			
			// Abre la ventana de impresión del navegador
			window.print();
			
			// Elimina la marca de agua después de la impresión (opcional)
			watermark.remove();
			document.documentElement.classList.remove('imprimir');
		},
		recorrerElementos: function(elemento) {
			/* var rootElement = document.documentElement;
			recorrerElementos(rootElement); */
			// Realiza alguna acción en el elemento actual (por ejemplo, imprimir su nombre de etiqueta)
			console.log(elemento.tagName);
		  
			// Recorre los elementos secundarios (hijos) del elemento actual
			var hijos = elemento.children;
			for (var i = 0; i < hijos.length; i++) {
			  recorrerElementos(hijos[i]); // Llama recursivamente a la función para los elementos secundarios
			}
		  }
	});
}, /* bExport= */ true);
