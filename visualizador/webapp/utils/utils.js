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

        getProcessFromURL : function(){
            var splitURL = window.location.href.split('?processId=');
            return splitURL[1];
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
        }
    };
});