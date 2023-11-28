sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "prestamosgp2/utils/utils",
    "sap/ui/thirdparty/jquery",
    "prestamosgp2/utils/formatter"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, Utils, jQuery, formatter) {
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
				var currentUrl = window.location.href;
				var myArray = currentUrl.split("user=");
				const url = Utils.getUrl() + "/user-api/attributes";
				var oModel = new JSONModel();
				var mock = {
					firstname: "Dummy",
					lastname: "User",
					email: "dummy.user@com",
					name: "EXT3512",//myArray[1],
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
                    oComponent.user = mock;
				});
			},

            getMoreUserInfo : function (oComponent){
                var oUserName = oComponent.user.name;
                var url = Utils.getUrl();
                var query,data;
                var oThis = this;
                var oUserInfo;
                
                query = url + "/odata/v2/User?$filter=username eq '"+oUserName+"'&$format=json&$expand=empInfo,empInfo/personNav,empInfo/personNav/homeAddressNavDEFLT,empInfo/personNav/nationalIdNav,empInfo/compInfoNav&$select=userId,firstName,lastName,defaultFullName,empInfo/personNav/homeAddressNavDEFLT,empInfo/personNav/nationalIdNav,empInfo,empInfo/compInfoNav";
                
                jQuery.ajax({
                    type: "GET",
                    async: false,
                    url: query,
                    success: function (oData) {
                        if (oData.d.results.length > 0) {
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
                                    nproducto : "0" + count.toString()
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
                
                query = url + "/prestamos-rest/prestamos/nomina/cuadro-amortizacion?codigoHost=" + idPrestamo;
                
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

                query = url + "/sap/opu/odata/sap/ZHR_ODATA_TEST_SRV_01/empprestSet";
                
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
                
                query = url + "/sap/opu/odata/sap/ZHR_ODATA_TEST_SRV_01/empprestSet";
                
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

            formatModelToPrint : function(oModel){
                var oAuxListaCuotas = new Array();
                var oAddress = formatter.formatAddressToPrint(oModel.calle, oModel.numero, oModel.planta, oModel.puerta);
                var oFechaInicio = oModel.listaCuotas[0].fecha;
                oFechaInicio = Utils.getDate(oFechaInicio);
			    var oFechaFin = oModel.listaCuotas[oModel.listaCuotas.length-1].fecha;
                oFechaFin = Utils.getDate(oFechaFin);

                var oPlazo = Utils.getPlazo(oFechaInicio, oFechaFin);

                oModel.listaCuotas.forEach((e, index) => {
                    //if (index < 40) { // Verifica si el índice es menor a 2 (los dos primeros elementos)
                        e.capPendiente = e.capPendiente.toString().split('.');
                        e.capPendiente = e.capPendiente[0];
                        e.capPendiente.toString().length >= 4 ? e.capPendiente = e.capPendiente.slice(0, 4) : e.capPendiente = e.capPendiente;
                        oAuxListaCuotas.push({
                            'Codigo': oModel.codigo,
                            'Fecha': Utils.toFormatDatePrint(e.fecha),
                            'Dispo': e.disposicion.toString(),
                            'CaAmor': e.capAmortizado.toString(),
                            'TiInt': '1.6', // e.tipoInteres.toString()
                            'Cuota': e.cuotas.toString(),
                            'Amort': e.amortizaciones.toString(),
                            'Inter': e.intereses.toString(),
                            'CaPte': e.capPendiente
                        });
                    //}
                });

                var toReturn =  {
                    'Codigo': oModel.codigo,
                    'Base64': '',
                    'Prestatario': oModel.name,
                    'Dni': oModel.dni,
                    'Tae': "1.6", //oModel.tae.toString()
                    'Domicilio': oAddress,
                    'Poblacion': oModel.ciudad,
                    'Importe': oModel.importe,
                    'Carencia': "0",
                    'Cp': oModel.cp,
                    'Plazo': oPlazo.toString(),
                    'HeaderToItem': oAuxListaCuotas
                };
                return JSON.stringify(toReturn);
            },
            /* createFormData : function (oModel) {
                // Crear un nuevo objeto FormData
                var formData = new FormData();
                //var oAuxListaCuotas = new Array();
                var oAddress = formatter.formatAddress(oModel.calle, oModel.numero, oModel.planta, oModel.puerta, oModel.ciudad);
                var oFechaInicio = oModel.listaCuotas[0].fecha;
                oFechaInicio = Utils.getDate(oFechaInicio);
			    var oFechaFin = oModel.listaCuotas[oModel.listaCuotas.length-1].fecha;
                oFechaFin = Utils.getDate(oFechaFin);

                var oPlazo = Utils.getPlazo(oFechaInicio, oFechaFin);
              
                // Agregar campos simples al FormData
                formData.append('Codigo', oModel.codigo.toString());
                formData.append('Base64', 'fwsfsfsfsdfsfeferfgf');
                formData.append('Prestatario', oModel.name.toString());
                formData.append('Dni', oModel.dni.toString());
                formData.append('Tae', parseFloat("1.6"));
                formData.append('Domicilio', oAddress); // Asegúrate de tener una propiedad "address" en tu modelo
                formData.append('Poblacion', oModel.ciudad.toString());
                formData.append('Importe', parseFloat(oModel.importe));
                formData.append('Carencia', parseInt("0"));
                formData.append('Cp', oModel.cp.toString());
                formData.append('Plazo', parseInt(oPlazo));
              
                // Agregar la lista de cuotas al FormData
                oModel.listaCuotas.forEach((e, index) => {
                  formData.append(`Headertoitem[${index}][Codigo]`, oModel.codigo.toString());
                  formData.append(`Headertoitem[${index}][Fecha]`, Utils.toFormatDateSap(e.fecha));
                  formData.append(`Headertoitem[${index}][Dispo]`, parseFloat(e.disposicion));
                  formData.append(`Headertoitem[${index}][CaAmor]`, parseFloat(e.capAmortizado));
                  formData.append(`Headertoitem[${index}][TiInt]`, "IN");
                  formData.append(`Headertoitem[${index}][Cuota]`, parseFloat(e.cuotas));
                  formData.append(`Headertoitem[${index}][Amort]`, parseFloat(e.amortizaciones));
                  formData.append(`Headertoitem[${index}][Inter]`, parseFloat(e.intereses));
                  formData.append(`Headertoitem[${index}][CaPte]`, e.capPendiente.toString());
                });
              
                return formData;
            },
            sendToPrintFormData: function (oFormData, oCsrfToken) {
                var url = Utils.getUrl();
                var query;
              
                query = url + "/sap/opu/odata/sap/ZHR_ODATA_PRESTAMOS_SRV/empprestSet";
              
                
                jQuery.ajax({
                    type: "POST",
                    async: false,
                    url: query,
                    data: oFormData,
                    processData: false, // No procesar el FormData
                    contentType: false, // No establecer automáticamente el encabezado Content-Type
                    headers: {
                      "x-csrf-token": oCsrfToken,
                      "Accept": "multipart/form-data", // Ajusta según el tipo de respuesta esperada
                      "Content-Type": "multipart/form-data"
                    },
                    success: function (oData) {
                      if (oData) {
                        console.log("Existe");
                        //resolve(oData);
                      } else {
                        //reject("No se pudo realizar la simulación");
                      }
                    },
                    error: function (oError) {
                      //reject("No se pudo acceder a la simulación. UNRECHEABLE.");
                    }
                });
              } */
    };
});