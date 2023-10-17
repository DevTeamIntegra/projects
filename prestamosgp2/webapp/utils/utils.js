sap.ui.define([
    "sap/m/Dialog",
    "sap/m/library",
    "sap/ui/core/library",
    "sap/m/Button",
    "sap/m/Text",
	"sap/ui/core/Fragment",

], function(Dialog, library, coreLibrary, Button, Text, Fragment) {
"use strict";
    var DialogType = library.DialogType;
    var ValueState = coreLibrary.ValueState;
    var ButtonType = library.ButtonType;
    return {

        showErrorMsg:function(oError){
            var oErrorMessageDialog = new Dialog({
                type: DialogType.Message,
                title: "Error",
                state: ValueState.Error,
                content: new Text({text:oError}),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "OK",
                    press: function () {
                        oErrorMessageDialog.close();
                    }.bind(this)
                })
            });
            oErrorMessageDialog.open();
        },
        showSuccessMsg : function(oMsg){
            var oSuccessMessageDialog = new Dialog({
                type: DialogType.Message,
                title: "Success",
                state: ValueState.Success,
                content: new Text({text:oMsg}),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "OK",
                    press: function () {
                        oSuccessMessageDialog.close();
                    }.bind(this)
                })
            });
            oSuccessMessageDialog.open();
        },
        getUrl : function(){
            const aUrlpath = window.location.href.split("/");
            var appUrl = aUrlpath[3];
            var checkUrl = aUrlpath[2];
            if (checkUrl.includes("port") || appUrl === "test") {
                appUrl = ""
            } else {
                appUrl = "/" + appUrl
            }
            return appUrl;
        },
        onlyUnique : function(value, index, array) {
            return array.indexOf(value) === index;
        },
        getActualDate(){
            var fechaActual = new Date();
			var anyoActual = fechaActual.getFullYear();
			var mesActual = fechaActual.getMonth() + 2;
            return {
                "anyo" : anyoActual,
                "mes" : mesActual
            }
        },
        getTipoNum : function (tipoText){
            if(tipoText == "VIVIENDA")
                return 2;
            else
                return 1;
        }
    };
});