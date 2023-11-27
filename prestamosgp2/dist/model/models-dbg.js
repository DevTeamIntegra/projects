sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "prestamosgp2/utils/utils",
    "sap/ui/thirdparty/jquery"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, Utils, jQuery) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            getToken : function (callback) {
                var url = Utils.getUrl();
                var oThis = this;
                var query;
                var token;
                var formData = new FormData();
                formData.append("username", "ext2215");
                formData.append("password", "ext2215");
                formData.append("grant_type", "password");
                formData.append("client_id", "PRT");
                formData.append("application", "PRT");

                query = url +  "/nassa/oauth/token";
                
                const body = formData;
                jQuery.ajax({
                    type: "POST",
                    async: false,
                    url: query,
                    data: body,
                    processData: false,
                    contentType: false,
                    headers: {
                        "Authorization": "Basic UFJUOiQ0YSQxMSRja1k0UyRQVkVoL0NaWkp2b0E1WlUuSlhqU05maFlUSmpsbFN1UTRITG41L1diWjE5NEJuVw=="
                    },
                    success: function (oData) {
                        if (oData) {
                            var token = oData;
                            
                            callback(token);
                            
                            setTimeout(function() {
                                oThis.getToken(callback); 
                            }, parseInt(token.expires_in));
                        } else {
                            callback(null);
                        }
                    },
                    error: function (oError) {
                        callback(null);
                    }
                });
                return token;
            },

            getUserInfoAndRole: function (oComponent) {
				var currentUrl = window.location.href;
				var myArray = currentUrl.split("user=");
				const url = Utils.getUrl() + "/user-api/attributes";
				var oModel = new JSONModel();
				var mock = {
					firstname: "Dummy",
					lastname: "User",
					email: "dummy.user@com",
					name: myArray[1],
					displayName: "Dummy User (dummy.user@com)"
				}; 
		
				oModel.loadData(url);
				oModel.dataLoaded()
				.then(()=>{
					//check if data has been loaded
					//for local testing, set mock data
					if (!oModel.getData().email) {
						oModel.setData(mock);
					}
                    oComponent.setModel(oModel, "userInfo");
					try {
					  loggedUser = myArray[1]//this.getView().getModel("userInfo").oData.uid[0]; //this.getView().getModel("userInfo").oData.name;
					} catch (error) {
					  loggedUser = myArray[1]//this.getView().getModel("userInfo").oData.name;
					}
					
					if(loggedUser === "esteri01"){
					  loggedUser = myArray[1]//"GALALB01";
					}
					oComponent.user = mock;
				})
				.catch(()=>{               
					//oModel.setData(mock);
					//oComponent.setModel(oModel, "userInfo");
                    oComponent.user = mock;
				});
			},

            getSimulacionVivienda : function (oEntries, oToken, oView){
                var url = Utils.getUrl();
                var query,data;
                
                query = url + "/prestamos-rest/prestamos/simulacion-empleados";
                
                jQuery.ajax({
                    type: "GET",
                    async: false,
                    url: query,
                    data: oEntries,
                    headers: {
                        "Authorization": "Bearer " + oToken
                    },
                    success: function (oData) {
                        if (oData) {
                            data = oData.listaCuotas;
                            //oView.setModel(new JSONModel(data), "SimuViviendaModel");
                        } else {
                            Utils.showErrorMsg("No se pudo realizar la simulación")// Opcionalmente, puedes manejar un caso de error aquí
                        }
                    },
                    error: function (oError) {
                        Utils.showErrorMsg("No se pudo acceder a la simulación. UNRECHEABLE.")// Opcionalmente, puedes manejar un caso de error aquí
                    }
                });

                return new JSONModel(data);
            },
            getSimulacionConsumo : function (oEntries, oToken, oView){
                var url = Utils.getUrl();
                var query,data;
                
                query = "/prestamos-rest/prestamos/simulacion-empleados";
                
                jQuery.ajax({
                    type: "GET",
                    async: false,
                    url: query,
                    data: oEntries,
                    headers: {
                        "Authorization": "Bearer " + oToken
                    },
                    success: function (oData) {
                        if (oData) {
                            data = oData.listaCuotas;
                            //oView.setModel(new JSONModel(data), "SimuViviendaModel");
                        } else {
                            Utils.showErrorMsg("No se pudo realizar la simulación")// Opcionalmente, puedes manejar un caso de error aquí
                        }
                    },
                    error: function (oError) {
                        Utils.showErrorMsg("No se pudo acceder a la simulación. UNRECHEABLE.")// Opcionalmente, puedes manejar un caso de error aquí
                    }
                });

                return new JSONModel(data);
            }
    };
});