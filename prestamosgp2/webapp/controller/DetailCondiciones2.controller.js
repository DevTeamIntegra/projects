sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"prestamosgp2/model/models",
    "sap/ui/model/json/JSONModel",
	"prestamosgp2/utils/utils",

], function(BaseController, MessageBox, Utilities, History, models,JSONModel,Utils) {
	"use strict";

	return BaseController.extend("prestamosgp2.controller.DetailCondiciones2", {
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

				this.doNavigate("DetailCondiciones", oBindingContext, fnResolve, "");
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
		_onSegmentedButtonSimulacionPress1: function(oEvent) {
			var oThis = this;
			var oEntries = this.getEntries();
			if(oEntries != false){
				oThis.getOwnerComponent().dialog.open();
				this.getOwnerComponent().setModelCondiciones(models.getSimulacionCondiciones(this.getEntries(), this.getOwnerComponent().oToken, this.getView()));

				var oBindingContext = oEvent.getSource().getBindingContext();
				this.getOwnerComponent().setModel(new JSONModel(this.getEntries()), 'PreviousCondicionesPageModel');

				return new Promise(function(fnResolve) {
					oThis.getOwnerComponent().dialog.close();
					this.doNavigate("DetailCondiciones3", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function(err) {
					if (err !== undefined) {
						oThis.getOwnerComponent().dialog.close();
						MessageBox.error(err.message);
					}
				});
			}
			
		},
		onInit: function() {
			this.getView().setModel(this.getOwnerComponent().getModel('PrestamosUser'),'PrestamosUser');
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("DetailCondiciones2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("DetailCondiciones", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

		},
		_onChangeDatePicker : function (oEvent){
			var oSplit;

			var oDatePicker = oEvent.getSource();
			var isInicio = oEvent.getSource().getParent().getId().includes('idLblTramo');
            var oDateValue = oDatePicker.getDateValue();
			var oSplit = oEvent.getSource().getValue();
			if(isInicio){
				var parteInicial = oSplit.slice(0, -2);
				// Convertir la cadena a un objeto Date (asumiendo que el formato es yyyymm)
				var year = parteInicial.slice(0, 4);
				var month = parteInicial.slice(4, 6);
				var nuevaFecha = new Date(year, parseInt(month, 10) - 1, 1);  // Restar 1 al mes ya que en JavaScript los meses van de 0 a 11
				oDatePicker.setDateValue(nuevaFecha);
				oDateValue = oDatePicker.getDateValue();
			}else{
				var parteInicial = oSplit.slice(0, -2);
				// Convertir la cadena a un objeto Date (asumiendo que el formato es yyyymm)
				var year = parteInicial.slice(0, 4);
				var month = parteInicial.slice(4, 6);
				var nuevaFecha = new Date(year, parseInt(month, 10) - 1, new Date(year, parseInt(month, 10), 0).getDate());  // Restar 1 al mes ya que en JavaScript los meses van de 0 a 11
				oDatePicker.setDateValue(nuevaFecha);
				oDateValue = oDatePicker.getDateValue();
			}

            if (oDateValue) {
                var oDateFormat = sap.ui.core.format.DateFormat.getInstance({ pattern: "dd/MM/yyyy" });
                var sFormattedDate = oDateFormat.format(oDateValue);

                // Actualizar el valor del DatePicker con la fecha formateada
                oDatePicker.setValue(sFormattedDate);
            }
		},
		getEntries : function(){
			var oThis = this;
			var oTipo = oThis.getView().byId("idTipoPrestamo").getValue();
			
			var oInicioPrestamo = oThis.getView().byId("idInicioPrestamo").getValue();
			oInicioPrestamo = Utils.getDate(oInicioPrestamo);
			var oFinPrestamo = oThis.getView().byId("idFinPrestamo").getValue();
			oFinPrestamo = Utils.getDate(oFinPrestamo);
			var oInicioTramo = oThis.getView().byId("idInicioTramo").getValue();
			if(oInicioTramo == '' || oInicioTramo == undefined || oInicioTramo == null){
				Utils.showErrorMsg("La nueva fecha de inicio nunca puede ir vacía")// Opcionalmente, puedes manejar un caso de error aquí
				return false;
			}
			oInicioTramo =  Utils.getDate(oInicioTramo);
			if(oFinTramo == '' || oFinTramo == undefined || oFinTramo == null){
				Utils.showErrorMsg("La nueva fecha de fin nunca puede ir vacía")// Opcionalmente, puedes manejar un caso de error aquí
				return false;
			}
			var oFinTramo = oThis.getView().byId("idFinTramo").getValue();
			oFinTramo = Utils.getDate(oFinTramo);

			if(oInicioPrestamo > oInicioTramo || oFinTramo < oInicioPrestamo){
				Utils.showErrorMsg("La nueva fecha de inicio nunca puede ser inferior a la de incio actual")// Opcionalmente, puedes manejar un caso de error aquí
				return false;
			}
			if(oInicioTramo){
				var oMes = oInicioTramo.getMonth() + 1;
				var oAnyo = oInicioTramo.getYear();
			}
			if (oInicioTramo && oFinTramo) {
				var oTotalAnyos = Utils.getPlazo(oInicioTramo, oFinTramo);
			}


			var oPrestamoModel = oThis.getOwnerComponent().getModel('PrestamosUser');
			var oPrestamo = oPrestamoModel.oData.find(e => e.selected == true);
			var oImporte = oPrestamo.importe;

			var oInputImporte = oThis.getView().byId("idImporte").getValue();
			if(oInputImporte != null && oInputImporte != '' && oInputImporte != undefined){
				if(parseFloat(oImporte)>=parseFloat(oInputImporte)){
					oImporte = parseFloat(oImporte)-parseFloat(oInputImporte);
				}else{
					Utils.showErrorMsg("El importe a amortizar nunca puede ser mayor al pendiente");
					return false;
				}
			}
			
			var oNuevaCondicion = oThis.getView().byId("idNuevaCondicion").getSelectedKey();
			if(oNuevaCondicion == ""){
				Utils.showErrorMsg("La condición no puede ir vacía");
				return false;
			}
			return {
				tipoPrestamo : parseInt(oTipo),
				carencia : 0,
				crecimiento : parseInt(oNuevaCondicion),
				mesInicio : oMes,
				anioInicio : oAnyo,
				importe : oImporte,
				plazo : parseInt(oTotalAnyos)
			}
		}
	});
}, /* bExport= */ true);
