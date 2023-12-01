sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"prestamosgp2/model/models",
	"prestamosgp2/controller/ListSelector",
	"prestamosgp2/model/errorHandling",
    "prestamosgp2/utils/utils",
	"sap/ui/model/json/JSONModel"

], function(UIComponent, Device, models, ListSelector, errorHandling, Utils, JSONModel) {
	"use strict";

	var navigationWithContext = {

	};

	return UIComponent.extend("prestamosgp2.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this method, the FLP and device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: async function() {
			var oThis = this;
			oThis.dialog = new sap.m.BusyDialog({
				text:'Loading Data...'
				});
			oThis.dialog.open();

			this.oEntries = {};
			var oThis = this;
			this.oListSelector = new ListSelector();
			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			models.getToken(function(token) {
				if (token) {
					// Aquí puedes usar el token obtenido de manera asíncrona
					oThis.oToken = token.access_token;
				} else {
					// Manejar el caso de error si es necesario
					Utils.showErrorMsg("Error al obtener el token");
				}
			});

			await models.getUserInfoAndRole(this);
			if(this.user){			
				var oUserInfo = models.getMoreUserInfo(this);
				this.setModel(oUserInfo, "UserInfo");
			}

			if(this.hasModel('UserInfo')){
				var oModelUser = this.getModel('UserInfo');
				this.dni = oModelUser.oData.dni;
			}

			if(this.dni != '' && this.dni != null && this.dni != undefined){
				this.setModel(new JSONModel(models.getPrestamosUser(this)), 'PrestamosUser');
			}
			// set the FLP model
			//this.setModel(models.createFLPModel(), "FLP");

			// set the dataSource model
			this.setModel(new sap.ui.model.json.JSONModel({}), "dataSource");

			// set application model
			var oApplicationModel = new sap.ui.model.json.JSONModel({});
			this.setModel(oApplicationModel, "applicationModel");

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

			// delegate error handling
			errorHandling.register(this);

			// create the views based on the url/hash
			this.getRouter().initialize();
			oThis.dialog.close();
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ListSelector and ErrorHandler are destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			this.oListSelector.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		getNavigationPropertyForNavigationWithContext: function(sEntityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[sEntityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];
		},

		setModelVivienda : function (oData){
			/* var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(oData); // Carga los datos en el modelo (ajusta la URL según tu caso) */
			this.setModel(oData, "SimuViviendaModel");
		},
		setModelConsumo : function (oData){
			/* var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(oData); // Carga los datos en el modelo (ajusta la URL según tu caso) */
			this.setModel(oData, "SimuConsumoModel");
		},
		setModelCondiciones : function (oData){
			/* var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(oData); // Carga los datos en el modelo (ajusta la URL según tu caso) */
			this.setModel(oData, "SimuCondicionesModel");
		},
		setModelCuadro: function (oData){
			/* var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(oData); // Carga los datos en el modelo (ajusta la URL según tu caso) */
			this.setModel(oData, "CuadroPrestamoModel");
		}

	});

});
