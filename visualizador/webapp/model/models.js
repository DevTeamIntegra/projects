sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "visualizador/utils/utils"
], function (JSONModel, Device, Utils) {
        "use strict";

        return {

            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
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
                    oComponent.getModel("userInfo").oData.name;
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
            oComponent.getModel("userInfo").getProperty("/sub") ? oUserName = oComponent.getModel("userInfo").getProperty("/sub")[0] : oUserName = oComponent.user.name;
            var url = Utils.getUrl();
            var query,data;
            var oThis = this;
            var oUserInfo;

            //var oUserProxy = oThis.getUserProxy(oUserName);
            
            query = url + "/odata/v2/User?$filter=username eq 'ICO"+oUserName+"'&$format=json&$expand=empInfo,empInfo/personNav,empInfo/personNav/homeAddressNavDEFLT,empInfo/personNav/nationalIdNav,empInfo/compInfoNav,proxy&$select=userId,firstName,lastName,defaultFullName,empInfo/personNav/homeAddressNavDEFLT,empInfo/personNav/nationalIdNav,empInfo,empInfo/compInfoNav,proxy";
            
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
        }
    };
});