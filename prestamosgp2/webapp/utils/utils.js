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
            if(tipoText.includes("VIVIENDA"))
                return 2;
            else
                return 1;
        },
        getDate : function(oDate){
			var partesFecha = oDate.split("/");
			var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
			return fecha;
		},
        getPlazo : function(oInicioTramo, oFinTramo){
			var diferenciaEnMilisegundos = oFinTramo - oInicioTramo;
			var oTotalAnyos = new Date(diferenciaEnMilisegundos).getUTCFullYear() - 1970;
			return oTotalAnyos;
		},
        toFormatDatePrint : function(oDate){
            var partesFecha = oDate.split("/");
            //2023-01-01
            return partesFecha[2] + "-" + partesFecha[1] + "-" + partesFecha[0];
        },
        abrirVisorPDF: function(base64PDF) {
            // Crear un objeto Blob a partir del contenido en Base64
            var byteCharacters = atob(base64PDF);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: 'application/pdf' });
        
            // Crear una URL para el Blob
            var blobUrl = URL.createObjectURL(blob);
        
            // Abrir una nueva pestaña con el visor de PDF
            window.open(blobUrl, '_blank');
        },
        normalizarObjeto : function (objeto) {
            return {
                Codigo: objeto.Codigo,
                Prestatario: objeto.Prestatario,
                Dni: objeto.Dni,
                Tae: objeto.Tae,
                Domicilio: objeto.Domicilio,
                Poblacion: objeto.Poblacion,
                Importe: objeto.Importe,
                Carencia: objeto.Carencia,
                Cp: objeto.Cp,
                Plazo: objeto.Plazo,
                Base64: objeto.Base64,
                HeaderToItem: objeto.HeaderToItem.map(subItem => ({
                    Codigo: subItem.Codigo,
                    Fecha: subItem.Fecha,
                    Dispo: subItem.Dispo,
                    CaAmor: subItem.CaAmor,
                    TiInt: subItem.TiInt,
                    Cuota: subItem.Cuota,
                    Amort: subItem.Amort,
                    Inter: subItem.Inter,
                    CaPte: subItem.CaPte
                }))
            };
        }
        
    };
});