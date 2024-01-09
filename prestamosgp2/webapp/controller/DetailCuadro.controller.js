sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
    "prestamosgp2/model/models",
    "sap/ui/model/json/JSONModel",
	"prestamosgp2/utils/utils"

], function(BaseController, MessageBox, Utilities, History, models, JSONModel, Utils) {
	"use strict";

	return BaseController.extend("prestamosgp2.controller.DetailCuadro", {
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

				this.doNavigate("DetailCuadro2", oBindingContext, fnResolve, "");
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
		_onSegmentedButtonItemPress1: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("DetailHome", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("DetailCuadro").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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

			var oModel = new JSONModel({
                mensaje: "No existen préstamos para el tipo seleccionado",
                tipo: sap.ui.core.MessageType.Warning,
                visible: false
            });

            // Establecer el modelo en la vista
            this.getView().setModel(oModel, "Warnings");
		},
		_onChangeTipoPrestamo : function(oEvent){
			var oThis = this; var count = 0;
			var oTipo = oEvent.getSource().getSelectedKey();
			var oComponent = this.getOwnerComponent();
			var oPrestamosModel = oComponent.getModel('PrestamosUser');
			var oWarnings = oThis.getView().getModel('Warnings');

			var oComboBox = oThis.getView().byId("idComboBoxNPrestamo");
			oThis.unSelectComboBox(oComboBox);
			
			oPrestamosModel.oData.forEach((oPrestamo) => {
				if(oPrestamo.producto == oTipo){
					count++;
					var oItem1 = new sap.ui.core.Item({ key: oPrestamo.producto, text: oPrestamo.nproducto });
					oComboBox.addItem(oItem1);
				}
			});
			var oMessageStrip = this.byId("idMessageStrip"); 
			if(count == 0){
				oThis.unSelectComboBox(oComboBox);	
				oComboBox.removeAllItems();
				oWarnings.setProperty("/visible", true);
				oMessageStrip.setVisible(true);
			}else{
				oThis.unSelectComboBox(oComboBox);	
				oWarnings.setProperty("/visible", false);
				oMessageStrip.setVisible(false);
			}
			oWarnings.refresh();
		},
		unSelectComboBox : function (oComboBox){
			var sSelectedKey = oComboBox.getSelectedKey();
			if (sSelectedKey) {
				var oSelectedItem = oComboBox.getItemByKey(sSelectedKey);
				if (oSelectedItem) {
					oComboBox.removeItem(oSelectedItem);
					oComboBox.setValue('');
				}
			}
		},

		_onSegmentedButtonEjecutarPress : function (oEvent){
			var oThis = this;
			var oPrestamosModel = this.getOwnerComponent().getModel('PrestamosUser');
			var oComboBox = oThis.getView().byId("idComboBoxNPrestamo");
			var oTipo = oComboBox.getSelectedKey();
			var oSelectedPrestamo;
			if(oPrestamosModel){
				oPrestamosModel.oData.forEach((oPrestamo) => {
					if(oPrestamo.producto == oTipo){
						oSelectedPrestamo = oPrestamo;
					}
				});
				if(oSelectedPrestamo){
					oThis.getOwnerComponent().dialog.open();
					oThis.getOwnerComponent().setModelCuadro(models.getCuadroByPrestamo(oSelectedPrestamo.idPrestamo, oThis.getOwnerComponent()));
				}
			}

			var oEntries = oThis.getEntries(oThis,oTipo,oSelectedPrestamo);
			if(oEntries != false){
				var oBindingContext = oEvent.getSource().getBindingContext();
				oThis.getOwnerComponent().setModel(new JSONModel(oThis.getEntries(oThis,oTipo,oSelectedPrestamo)), 'PreviousCuadroPageModel');

				return new Promise(function(fnResolve) {
					oThis.getOwnerComponent().dialog.close();
					this.doNavigate("DetailCuadro2", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function(err) {
					if (err !== undefined) {
						oThis.getOwnerComponent().dialog.close();
						MessageBox.error(err.message);
					}
				});
			}	
			oThis.getOwnerComponent().dialog.close();
			
		},
		getEntries:function(oThis,oTipo,oSelectedPrestamo){
			var oItemSelected = this.byId("idComboBoxCuadro").getSelectedKey();
			var oItemNPrestamo = this.byId("idComboBoxNPrestamo").getSelectedKey();
			if(oItemSelected == '' ||oItemSelected == undefined || oItemSelected == null || oItemNPrestamo == '' ||oItemNPrestamo == undefined || oItemNPrestamo == null){
				Utils.showErrorMsg("Debes seleccionar un tipo de prestamo y/o número");
				return false;
			}
			var oPrestamoModel = oThis.getOwnerComponent().getModel('CuadroPrestamoModel');
			oPrestamoModel = oPrestamoModel.oData;
			var oPrimerPlazo = Utils.convertirFecha(oPrestamoModel[0].fecha);
			var oUltimoPlazo = Utils.convertirFecha(oPrestamoModel[oPrestamoModel.length-1].fecha);
			var diferenciaMilisegundos = oUltimoPlazo - oPrimerPlazo;
			var diferenciaAnios = diferenciaMilisegundos / (1000 * 60 * 60 * 24 * 365.25);
			var diferenciaAniosRedondeada = Math.floor(diferenciaAnios);
			var oMes = oPrimerPlazo.getMonth() + 1;
			var oAnyo = oPrimerPlazo.getFullYear();
			return {
				tipoPrestamo : oTipo,
				carencia : oSelectedPrestamo.carencia,
				crecimiento : oSelectedPrestamo.crecimiento,
				mesInicio : oMes,
				anioInicio : oAnyo,
				importe : oSelectedPrestamo.importe,
				dias: oSelectedPrestamo.dias,
				vencimiento: oSelectedPrestamo.vencimiento,
				plazo : oSelectedPrestamo.plazo,//diferenciaAniosRedondeada,
				tae : oSelectedPrestamo.tae,
			}
		},

	});
}, /* bExport= */ true);
