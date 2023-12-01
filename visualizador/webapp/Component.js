sap.ui.define([
    "sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"visualizador/model/models",
	"visualizador/utils/constants",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
	"visualizador/utils/utils",

    ],
    function (UIComponent, Device, ODataModel, JSONModel, models, constants, Filter, FilterOperator,MessageToast, Utils) {
        "use strict";

        return UIComponent.extend("visualizador.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: async function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                this.processId = Utils.getProcessFromURL();

                await models.getUserInfoAndRole(this);
                if(this.user){			
                    var oUserInfo = models.getMoreUserInfo(this);
                    this.setModel(oUserInfo, "UserInfo");
                }

                //this.loadODataModel();

                // Se realiza la llamada para traer el usuario logado //
                // this.setLogUserModel();

                // this.setPortal();

                /*// Se realiza la llamada para traer la foto del usuario //
                this.setEmployeePhotoModel();*/

                //Comprueba si el navegador soporta Object.entries y si no existe lo crea
                if (!Object.entries) {
                    Object.entries = function (obj) {
                        var ownProps = Object.keys(obj),
                            i = ownProps.length,
                            resArray = new Array(i); // preallocate the Array
                        while (i--)
                            resArray[i] = [ownProps[i], obj[ownProps[i]]];

                        return resArray;
                    };
                }
            },

            loadODataModel: function () {
                var sDomain = window.location.hostname;
                var oModel = this.getModel("MainModel");
                var sProtocol = window.location.protocol + "//";
                //var sRequest = window.location.search;
                var sRequest = constants.sRequest;
                //var sProcessId = this.getProcessId(sRequest); 
                //if (sDomain.includes(constants.HANA_DEV)) {
                if (sDomain.includes(constants.APP_DEV_DOMAIN) || window.location.href.includes('test')) {
                    var sServiceUrl = oModel.sServiceUrl;
                    var sURI = sProtocol + constants.SAP_DEV_DOMAIN + sServiceUrl + sRequest;
                    oModel = new ODataModel(sURI, {
                        useBatch: false
                    });
                    this.setModel(oModel, "MainModel");
                }else if(sDomain.includes(constants.SAP_PROD_DOMAIN)){
                    var sServiceUrl = oModel.sServiceUrl;
                    var sURI = sProtocol + constants.SAP_PROD_DOMAIN + sServiceUrl + sRequest;
                    oModel = new ODataModel(sURI, {
                        useBatch: false
                    });
                    this.setModel(oModel, "MainModel");
                }else{
                    this.setModel(new JSONModel(), "MainModel");

                }
            },
            /*
            getProcessId: function(pRequest){
                var sClear = pRequest.replace(/[^a-zA-Z.]+/g,'');
                var sResult = sClear.split('processId');
                return sResult[1];
            },
            */
            setPortal: function()
            {
                var oModel = this.getModel("MainModel"),
                    oParameters = {
                        success: function (oData)
                        {
                            var oPortalModel = new JSONModel(oData);
                            this.setModel(oPortalModel, "Portal");

                        }.bind(this),
                        error: function (oError) 
                        {
                            
                        }
                    };

                oModel.read(constants.PATH_PORTAL, oParameters);
            },

            setLogUserModel: function () 
            {
                var oUserModel = this.getModel("MainModel");

                oUserModel.read(constants.PATH_USUARIO, {
                    success: function (oData) 
                    {
                        var oUsuario = new JSONModel(oData.results[0]);
                        this.setModel(oUsuario, "logUser");
                        if(oUsuario.oData.vdsk1 === "Temporal")
                        {
                            oUsuario.setProperty("/noActions", false);//MOD 08/10/2021 Petición Bricomart Temporales pueden elegir destino PT
                        }
                        else
                        {
                            if(oUsuario.oData.Accionista === false)
                            {
                                oUsuario.setProperty("/noActions", true);
                            }
                            else
                            {
                                oUsuario.setProperty("/noActions", false);
                            }
                        }

                        if(oUsuario.oData.RRHH === true)
                        {
                            this.getSolicitudesPendientesModel();
                        }

                    }.bind(this),

                    error: function () 
                    {
                        MessageToast.show("Se ha producido un error en la lectura");

                    }
                });
            },

            getSolicitudesPendientesModel: function()
            {
                var oModel = this.getModel("MainModel"),
                    aFilters = [new Filter("Estado", FilterOperator.EQ, "1")],
                    oParameters = {
                    filters: aFilters,
                    success: function (oData)
                    {
                        var oSolicitudesModel = new JSONModel(oData.results);
                        if(oSolicitudesModel.oData.length === 0)
                        {
                            oSolicitudesModel.setProperty("/Count", 0);
                        }
                        else
                        {
                            oSolicitudesModel.setProperty("/Count", oSolicitudesModel.oData.length);
                        }
                        this.setModel(oSolicitudesModel, "SolicitudesPendientes");

                    }.bind(this),
                    error: function (oError) 
                    {
                        

                    }.bind(this)
                };

                oModel.read(constants.PATH_SOLICITUDES, oParameters);
            }
        });
    }
);