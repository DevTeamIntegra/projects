sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("visualizador.controller.controller.App", {
        onInit() {
            var desktop = jQuery.device.is.desktop;
            var phone = jQuery.device.is.phone;
            if (phone){
              this.getOwnerComponent().getRouter().navTo("RouteMobile");
            } else{
              this.getOwnerComponent().getRouter().navTo("Home");
            }
        }
      });
    }
  );
  