sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/m/MessageBox",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageBox) {
      "use strict";
      let count = "0";
  
      return Controller.extend("visualizador.controller.Mobile", {
        onInit: function () {
          //this._getPayrollModel('2021')
          var phone = jQuery.device.is.phone;
          if (phone){
          //oBusyDialogNoText.open();
          }
          
        },

        onAfterRendering: function(){
            this._getEjerciciosModel();
          },
  
        _changeSelectedFormat: function (aEjercicios) {
          aEjercicios.forEach((element) => {
            if (element.Selected == "true") {
              element.Selected = true;
            } else {
              element.Selected = false;
            }
          });
          return aEjercicios;
        },
        onSearch: function (oEvent) {
          // add filter for search
          var aFilters = [];
          var sQuery = oEvent.getSource().getValue();
          if (sQuery && sQuery.length > 0) {
            var filter2 = new Filter("Year", FilterOperator.Contains, sQuery);
            aFilters.push(filter2);
          }
          // update list binding
          var oList = this.byId("list");
          var oBinding = oList.getBinding("items");
          oBinding.filter(aFilters);
        },
  
        _getEjerciciosModel: function (sYear, sSelected) {
          //var oBusyDialog = new sap.m.BusyDialog("", {title : "Cargando el documento..."});
          //oBusyDialog.open();
          let oGlobalBusyDialog = new sap.m.BusyDialog();
          oGlobalBusyDialog.open();
          var that = this;
          let oModel = that.getView().getModel(),
            oHttpParameters = {
              headers: {
                year: sYear,
                device: "mobile"
              },
              success: function (oData) {
              
                let aEjercicios = new Array();
                aEjercicios = oData.results;
                if (aEjercicios.length === 0) {
                  oGlobalBusyDialog.close();
                  MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("view_controller_msg1"));
                }
                aEjercicios = that._changeSelectedFormat(aEjercicios);
                that.getView().setModel(new JSONModel(aEjercicios), "EjerciciosModel");

                if (sSelected === undefined){
                    sSelected = "0";                    
                }
                var url = that._getPdfUrl(aEjercicios, sSelected);
                if (count === "0"){
                    var ios =  sap.ui.Device.os.ios;
                    if (ios){ 
                    count = "1";
                    oGlobalBusyDialog.close();
                    MessageBox.information(this.getView().getModel("i18n").getResourceBundle().getText("mobile_controller_msg_0"));
                    } else {
                        count = "1";
                        oBusyDialog.close();
                        oBusyDialogNoText.close();
                        MessageBox.information(this.getView().getModel("i18n").getResourceBundle().getText("mobile_controller_msg_1"));                        
                    }
                } else {
                    oGlobalBusyDialog.close();
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = this.getView().getModel("i18n").getResourceBundle().getText("mobile_controller_pdf_name");
                    link.click();
                    //sap.ui.require([ "sap/m/library" ], ({URLHelper}) => URLHelper.redirect(url, true));
                }
                //that.getView().setVisible(true);
              }.bind(this),
              error: function (oError) {
                //that.getView().setVisible(true);
                oGlobalBusyDialog.close();
                MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("view_controller_msg2"));
              },
            };
  
          oModel.read("/EjerciciosSet", oHttpParameters);
        },
  
        onSelectionChange: async function (oEvent) {
          //let oGlobalBusyDialog = new sap.m.BusyDialog();
          //oGlobalBusyDialog.open();
          
          var sYear = oEvent.oSource.mProperties.title;
          var selected = oEvent.oSource.mBindingInfos.selected.binding.oContext.sPath;
          var aSelected = selected.split("/");

          //var selected = selItems[0].oParent._aSelectedPaths;
          //var aSelected = selected[0].split("/")
          selected = aSelected[1];          
          this._getEjerciciosModel(sYear,selected);
          //oGlobalBusyDialog.close();
        },
  
        _getPdfUrl: function (aEjercicios, sSelected) {
          let docContent = aEjercicios[sSelected].Pdf;
          docContent = docContent.replace(/\n/g, "");
          docContent = docContent.replace(/\r/g, "");
          let fileContent = docContent;
          let mimeType = "application/pdf";
          //Create doc url.
          var decodedPdfContent = atob(docContent);
          var byteArray = new Uint8Array(decodedPdfContent.length);
          for (var i = 0; i < decodedPdfContent.length; i++) {
            byteArray[i] = decodedPdfContent.charCodeAt(i);
          }
          var blob = new Blob([byteArray.buffer], { type: mimeType });
          var _pdfurl = URL.createObjectURL(blob);
          if (!this._PDFViewer) {
            this._PDFViewer = new sap.m.PDFViewer({
              width: "auto",
              source: _pdfurl,
            });
            jQuery.sap.addUrlWhitelist("blob");
          }
          return _pdfurl;
        },
  
        onSemanticButtonPress: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteSummary");
        },
  
        _getPayrollModel: function (sYear) {
  
          var that = this;
          let oModel = this.getView().getModel(),
            oHttpParameters = {
              headers: {
                year: sYear,
              },
              urlParameters: {
                "$expand": "PeriodoNav/PayrollNav"
              },
              success: function (oData) {
                let aEjercicios = new Array();
                aEjercicios = oData.results;
                this.getView().setModel(new JSONModel(aEjercicios), "PayrollModel");
  
              }.bind(this),
              error: function (oError) {
                console.log("Error")
              },
            };
  
          oModel.read("/EmpleadoSet", oHttpParameters);
        },
        onNavBack: function(){
            window.location = ('https://workzone-prd-vvaa2vfz.workzonehr.cfapps.eu20.hana.ondemand.com/site?sap-language=default&#workzone-home&/home') 
          }
      });
    }
  );
  