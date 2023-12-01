sap.ui.define([
    "sap/m/Dialog",
    "sap/m/library",
    "sap/ui/core/library",
    "sap/m/Button",
    "sap/m/Text",
	"sap/ui/core/Fragment",

], function(Dialog, library, coreLibrary, Button, Text, Fragment) {
"use strict";

    return {

        formatAddress : function(oCalle, oNumero, oPlanta, oPuerta, oCiudad){
            oNumero == null ? oNumero = 'S/N' : oNumero = oNumero;
            oCalle == null ? oCalle = '' : oCalle = oCalle;
            oPlanta == null ? oPlanta = '' : oPlanta = oPlanta;
            oPuerta == null ? oPuerta = '' : oPuerta = oPuerta;
            oCiudad == null ? oCiudad = '' : oCiudad = oCiudad;
            
            var oFullAddress = oCalle + ' ' + oNumero + ', ';
            if(oNumero == 'S/N'){
                return oFullAddress.replace(/[,\s]+$/, '');
            }else{
                return oFullAddress += oPlanta + 'º' + oPuerta.toUpperCase() + ', ' + oCiudad; 
            }
        },
        formatAddressToPrint : function(oCalle, oNumero, oPlanta, oPuerta){
            oNumero == null ? oNumero = 'S/N' : oNumero = oNumero;
            oCalle == null ? oCalle = '' : oCalle = oCalle;
            oPlanta == null ? oPlanta = '' : oPlanta = oPlanta;
            oPuerta == null ? oPuerta = '' : oPuerta = oPuerta;
            
            var oFullAddress = oCalle + ' ' + oNumero + ', ';
            if(oNumero == 'S/N'){
                return oFullAddress.replace(/[,\s]+$/, '');
            }else{
                return oFullAddress += oPlanta + 'º' + oPuerta.toUpperCase(); 
            }
        },
        formatToFixed2:function(value) {
            if (typeof value === 'number' && !isNaN(value) && Number.isFinite(value)) {
                return value.toFixed(2);
            } else {
                const parsedFloat = parseFloat(value);
                if (!isNaN(parsedFloat) && Number.isFinite(parsedFloat)) {
                    return parsedFloat.toFixed(2);
                } else {
                    return "N/A";
                }
            }
        },
        formatDateTitle:function(oThis){
            var oDate = new Date();
            var oDay = oDate.getDate();
            var oMonth = oDate.getMonth() + 1;
            var oYear = oDate.getFullYear();
            return "FECHA: " + oDay.toString() + "." + oMonth.toString() + "." +  oYear.toString();
        }
    };
});