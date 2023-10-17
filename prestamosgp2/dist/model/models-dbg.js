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
                var query;
                var token;
                var formData = new FormData();
                formData.append("username", "ext2215");
                formData.append("password", "ext2215");
                formData.append("grant_type", "password");
                formData.append("client_id", "PRT");
                formData.append("application", "PRT");

                query = "https://integra4.ico.red/nassa/oauth/token";
                //query =  "/nassa/oauth/token";
                
                const body = formData;
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: query,
                    data: body,
                    processData: false, // tell jQuery not to process the data
                    contentType: false, // tell jQuery not to set contentType
                    headers: {
                        "Authorization": "Basic UFJUOiQ0YSQxMSRja1k0UyRQVkVoL0NaWkp2b0E1WlUuSlhqU05maFlUSmpsbFN1UTRITG41L1diWjE5NEJuVw=="
                    },
                    success: function (oData) {
                        if (oData) {
                            var token = oData;
                            // Llama al callback con el token como argumento
                            callback(token);
                        } else {
                            callback(null); // Opcionalmente, puedes manejar un caso de error aquí
                        }
                    },
                    error: function (oError) {
                        callback(null);
                    }
                });
                return token;
                /* var settings = {
                    "url": "https://integra4.ico.red/nassa/oauth/token",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "Basic UFJUOiQ0YSQxMSRja1k0UyRQVkVoL0NaWkp2b0E1WlUuSlhqU05maFlUSmpsbFN1UTRITG41L1diWjE5NEJuVw=="
                    },
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": formData
                };   
                
                jQuery.ajax(settings).done(function (response) {
                    console.log(response);
                }); */
            },
            getSimulacionVivienda : function (oEntries, oToken, oView){
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