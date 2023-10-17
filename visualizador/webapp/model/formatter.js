/* global dateFormat:true */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, JSONModel, MessageToast) {
	
	return {
		formatDateFromSAP: function(sDate){
			if (sDate) {
				var year = sDate.substr(0, 4);
				var month = sDate.substr(4, 2);
				var days = sDate.substr(6, 2);

				return days + "/" + month + "/" + year;
			}

			return undefined;
		},

		formatDateToSAP: function(oDate){
			return oDate.format("Ymd");
		},

		formatDateTimeToString: function(oDate){
			return oDate.format("d.m.Y");
		},

		formatNumber: function(sNumber){
			if (sNumber){
				var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();
				var nNumber = parseFloat(sNumber);
				return nNumber.toLocaleString(sCurrentLocale, {minimumFractionDigits: 2});
			}

			return undefined;
		},

		formatCurrency: function(sNumber){
			if (sNumber){
				var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();
				var nNumber = parseFloat(sNumber);
				return nNumber.toLocaleString(sCurrentLocale, {style:"currency", currency:"EUR"});
			}

			return undefined;
		},

		formatPercentage: function(sNumber)
		{
			if(sNumber && sNumber.includes(".") === true)
			{
				sNumber = sNumber.replace(".",",");

				return sNumber;
			}
			else
			{
				return undefined;
			}
		}
	};
});