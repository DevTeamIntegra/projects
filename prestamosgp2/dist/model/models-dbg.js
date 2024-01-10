sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "prestamosgp2/utils/utils",
    "sap/ui/thirdparty/jquery",
    "prestamosgp2/utils/formatter",
    "prestamosgp2/utils/constants"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, Utils, jQuery, formatter, constants) {
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

            getUserInfoAndRole: async function (oComponent) {
                var oThis = this;
				var currentUrl = window.location.href;
				var myArray = currentUrl.split("user=");
				const url = Utils.getUrl() + "/user-api/attributes";
				var oModel = new JSONModel();
				var mock = {
					firstname: "Dummy",
					lastname: "User",
					email: "dummy.user@com",
					name: "EXT3512",
					displayName: "Dummy User (dummy.user@com)"
				}; 
		
				oModel.loadData(url);
				await oModel.dataLoaded()
				.then(()=>{
					//check if data has been loaded
					//for local testing, set mock data
					if (!oModel.getData().email) {
						oModel.setData(mock);
					}
                    oComponent.setModel(oModel, "userInfo");
					try {
                        oComponent.getModel("userInfo").oData.sfsf_userId[0];
                        //loggedUser = myArray[1]//this.getView().getModel("userInfo").oData.uid[0]; //this.getView().getModel("userInfo").oData.name;
					} catch (error) {
                        oComponent.getModel("userInfo").oData.name;
					    //loggedUser = myArray[1]//this.getView().getModel("userInfo").oData.name;
					}
					oComponent.user = mock;
				})
				.catch(()=>{               
					//oModel.setData(mock);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                    oComponent.user = mock;
				});
			},
            getMoreUserInfo : function (oComponent){
                var oUserName;
                oComponent.getModel("userInfo").getProperty("/sfsf_userId") ? oUserName = oComponent.getModel("userInfo").oData.sfsf_userId[0] : oComponent.getModel("userInfo").getProperty("/name") ? oUserName = oComponent.getModel("userInfo").oData.name : oUserName = oComponent.user.name;
                var url = Utils.getUrl();
                var query,data;
                var oThis = this;
                var oUserInfo;
                query = url + "/odata/v2/User?$filter=username eq '"+oUserName+"'&$format=json&$expand=empInfo,empInfo/personNav,empInfo/personNav/homeAddressNavDEFLT,empInfo/personNav/nationalIdNav,empInfo/compInfoNav,proxy&$select=userId,firstName,lastName,defaultFullName,empInfo/personNav/homeAddressNavDEFLT,empInfo/personNav/nationalIdNav,empInfo,empInfo/compInfoNav,proxy";
                jQuery.ajax({
                    type: "GET",
                    async: false,
                    url: query,
                    success: function (oData) {
                        if (oData.d.results.length > 0 || oData.d.results.empInfo == null || oData.d.results.empInfo == undefined) {
                            var aData = oData.d.results[0];
                            var oName = aData.lastName + ', ' +  aData.firstName;
                            var oUserId = aData.userId;
                            var oAddres = aData.empInfo.personNav.homeAddressNavDEFLT.results;
                            var oDNI = aData.empInfo.personNav.nationalIdNav.results.find(e => e.cardType == 'DNI' && e.country == 'ESP');
                            var oSalario = aData.empInfo.compInfoNav.results[0].customDouble1;
                            oUserInfo = new JSONModel({
                                userId : oUserId,
                                name : oName,
                                dni : oDNI.nationalId,
                                salario : oSalario,
                                calle : oAddres[0].address1,
                                numero : oAddres[0].address2,
                                escalera : oAddres[0].address3,
                                planta : oAddres[0].customString1,
                                puerta : oAddres[0].customString2,
                                cp : oAddres[0].zipCode,
                                ciudad : oAddres[0].city,
                                provincia : oAddres[0].county,
                                pais : oAddres[0].country
                            });
                        } else {
                            Utils.showErrorMsg("No se pudo obtener los datos del usuario")// Opcionalmente, puedes manejar un caso de error aquí
                        }
                    },
                    error: function (oError) {
                        Utils.showErrorMsg("No se pudo acceder a la simulación. UNRECHEABLE.")// Opcionalmente, puedes manejar un caso de error aquí
                    }
                });
                return oUserInfo;
            },

            getEmpInfo : function(oThis, oUserId){
                var url = Utils.getUrl();
                var query,data;
                
                query = url + "/odata/v2/EmpEmployment?$filter=userId eq '"+oUserId+"'&$format=json";
                
                jQuery.ajax({
                    type: "GET",
                    async: false,
                    url: query,
                    success: function (oData) {
                        if (oData) {
                            var aData = oData.d.results;
                        } else {
                            Utils.showErrorMsg("No se pudo realizar la simulación")// Opcionalmente, puedes manejar un caso de error aquí
                        }
                    },
                    error: function (oError) {
                        Utils.showErrorMsg("No se pudo acceder a la simulación. UNRECHEABLE.")// Opcionalmente, puedes manejar un caso de error aquí
                    }
                });
            },
            getPrestamosUser : function (oThis){
                var url = Utils.getUrl();
                var query, aData, oReturn = [];
                var count = 0;
                
                query = url + "/prestamos-rest/prestamos/sap/consulta-operaciones?NIF="+oThis.dni;
                
                jQuery.ajax({
                    type: "GET",
                    async: false,
                    url: query,
                    headers: {
                        "Authorization": "Bearer " + oThis.oToken
                    },
                    success: function (oData) {
                        if (oData && oData.listaOperaciones.length > 0) {
                            aData = oData.listaOperaciones;
                            aData.forEach(prestamo => {
                                count ++;
                                prestamo.producto.includes('VIVIENDA') ? prestamo.producto = '2' : prestamo.producto = '1'; 
                                oReturn.push({
                                    dni : oThis.dni,
                                    idPrestamo : prestamo.codigoHost,
                                    importe : prestamo.importe,
                                    estado : prestamo.estado,
                                    producto : prestamo.producto,
                                    nproducto : "0" + count.toString(),
                                    carencia: prestamo.carencia,
                                    plazo: prestamo.plazo,
                                    vencimiento: prestamo.vencimiento,
                                    crecimiento: prestamo.crecimiento,
                                    dias: prestamo.dias,
                                    tae : prestamo.tae
                                })
                            });
                        } else {
                            Utils.showErrorMsg("No se han encontrado prestamos para este usuario")// Opcionalmente, puedes manejar un caso de error aquí
                        }
                    },
                    error: function (oError) {
                        Utils.showErrorMsg("No se pudo acceder a la simulación. UNRECHEABLE.")// Opcionalmente, puedes manejar un caso de error aquí
                    }
                });
                return oReturn;
            },

            getSimulacionVivienda : function (oEntries, oToken, oView){
                var url = Utils.getUrl();
                var query,data;
                
                query = url + "/prestamos-rest/prestamos/sap/simulacion-empleados";
                
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
                            oEntries["tae"] = oData.tipo
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
                
                query = url + "/prestamos-rest/prestamos/sap/simulacion-empleados";
                
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
                            oEntries["tae"] = oData.tipo;
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

            getSimulacionCondiciones : function (oEntries, oToken, oView){
                var url = Utils.getUrl();
                var query,data;
                
                query = url + "/prestamos-rest/prestamos/sap/simulacion-empleados";
                
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
                            oEntries["tae"] = oData.tipo;
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

            getCuadroByPrestamo : function(idPrestamo,oComponent){
                var url = Utils.getUrl();
                var query,data;
                
                query = url + "/prestamos-rest/prestamos/sap/cuadro-amortizacion?codigoHost=" + idPrestamo;
                
                jQuery.ajax({
                    type: "GET",
                    async: false,
                    url: query,
                    headers: {
                        "Authorization": "Bearer " + oComponent.oToken
                    },
                    success: function (oData) {
                        if (oData) {
                            data= oData.cuadroAmortizacion;
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

            sendToPrint : function(oData, oCsfrToken){
                var url = Utils.getUrl();
                var query,data;
                var oBase64;

                query = url + "/sap/opu/odata/sap/ZHR_ODATA_CUADRO_PRESTAMO_SRV/empprestSet";
                
                jQuery.ajax({
                    type: "POST",
                    async: false,
                    url: query,
                    data: oData,
                    dataType: "json",
                    headers: {
                        "x-csrf-token": oCsfrToken,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    success: function (oData) {
                        if (oData) {
                            console.log("Existe");
                            oBase64 = oData.d.Base64;
                        } else {
                            Utils.showErrorMsg("No se pudo realizar la simulación");
                        }
                    },
                    error: function (oError) {
                        Utils.showErrorMsg("No se pudo acceder a la simulación. UNRECHEABLE.");
                    }
                });

                return oBase64;
            },

            getCsrfToken : function(){
                var url = Utils.getUrl();
                var query;
                var header_xcsrf_token;
                
                query = url + "/sap/opu/odata/sap/ZHR_ODATA_CUADRO_PRESTAMO_SRV/empprestSet";
                
                jQuery.ajax({
                    type: "GET",
                    async: false,
                    url: query,
                    headers: {
                        "x-csrf-token": "fetch"
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (jqXHR) {
                            header_xcsrf_token = jqXHR.getResponseHeader('x-csrf-token');
                        } else {
                            Utils.showErrorMsg("No se pudo realizar la simulación")// Opcionalmente, puedes manejar un caso de error aquí
                        }
                    },
                    error: function (oError) {
                        Utils.showErrorMsg("No se pudo acceder a la simulación. UNRECHEABLE.")// Opcionalmente, puedes manejar un caso de error aquí
                    }
                });

                return header_xcsrf_token;
            },

            formatModelToPrint : function(oModel, oSimu){
                var oAuxListaCuotas = new Array();
                var oAddress = formatter.formatAddressToPrint(oModel.calle, oModel.numero, oModel.planta, oModel.puerta);
                var oFechaInicio = oModel.listaCuotas[0].fecha;
                oFechaInicio = Utils.getDate(oFechaInicio);
			    var oFechaFin = oModel.listaCuotas[oModel.listaCuotas.length-1].fecha;
                oFechaFin = Utils.getDate(oFechaFin);

                var oPlazo = Utils.getPlazo(oFechaInicio, oFechaFin);

                oModel.listaCuotas.forEach((e, index) => {
                    //if (index < 40) { // Verifica si el índice es menor a 2 (los dos primeros elementos)
                        /* e.capPendiente = e.capPendiente.toString().split('.');
                        e.capPendiente = e.capPendiente[0];
                        e.capPendiente.toString().length >= 4 ? e.capPendiente = e.capPendiente.slice(0, 4) : e.capPendiente = e.capPendiente; */
                        oAuxListaCuotas.push({
                            'Codigo': oModel.codigo,
                            'Fecha': Utils.toFormatDatePrint(e.fecha),
                            'Dispo': e.disposicion != null ? e.disposicion.toString() : e.disposiciones.toString(),
                            'CaAmor': e.capAmortizado.toString(),
                            'TiInt': e.tipoInteres ? e.tipoInteres.toString() : e.tae ? e.tae.toString() : "0.00",
                            'Cuota': e.cuotas.toString(),
                            'Amort': e.amortizaciones.toString(),
                            'Inter': e.intereses.toString(),
                            'CaPte': e.capPendiente.toString()
                        });
                    //}
                });

                var toReturn =  {
                    'Codigo': oModel.codigo,
                    'Base64': '',
                    'Prestatario': oModel.name,
                    'Dni': oModel.dni,
                    'Tae': oModel.listaCuotas[1].tipoInteres ? oModel.listaCuotas[1].tipoInteres.toString() : oModel.listaCuotas[1].tae ? oModel.listaCuotas[1].tae.toString() : "0.00",
                    'Domicilio': oAddress,
                    'Poblacion': oModel.ciudad,
                    'Importe': oModel.importe,
                    'Carencia': "0",
                    'Cp': oModel.cp,
                    'Plazo': oPlazo.toString(),
                    'Simul': oSimu,
                    'HeaderToItem': oAuxListaCuotas
                };
                return JSON.stringify(toReturn);
            }
    };
});