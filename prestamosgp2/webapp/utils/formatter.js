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
        }
    };
});