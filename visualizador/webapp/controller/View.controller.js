sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/m/MessageBox",
      "visualizador/model/formatter"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageBox, formatter) {
      "use strict";
  
      return Controller.extend("visualizador.controller.View", {
        onInit: function () {
          //this._getPayrollModel('2021')
          var desktop = jQuery.device.is.desktop;
          if (desktop){
              //oBusyDialogNoText.open();
          }
          this.getView().byId("_IDGenPDFViewer").setVisible(false);
        },
        onAfterRendering: function(){
          this._getColoresModel();
          this._getTextosModel();
          this._getItemsModel();
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
          sYear ? sYear = sYear.replace(/[^0-9]/g, '') : false;

          let oModel = that.getView().getModel("MainModel"),
            oHttpParameters = {
              headers: {
                "year": sYear,
                "processid" : that.getOwnerComponent().processId,
                "sap-language" : sap.ui.getCore().getConfiguration().getLanguageTag()
              },
              success: function (oData) {
                that.getView().byId("_IDGenPDFViewer").setVisible(true);
                that.myColors ? that._setColors(that.myColors) : false;

                let aEjercicios = new Array();
                aEjercicios = oData.results;
                if (aEjercicios.length === 0) {
                  oGlobalBusyDialog.close();
                  MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("view_controller_msg1"));
                }
                if(aEjercicios[0].Pdf == ''){
                  oGlobalBusyDialog.close();
                  MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("no_pdf_msg1"));
                }
                aEjercicios = that._changeSelectedFormat(aEjercicios);
                that.getView().setModel(new JSONModel(aEjercicios), "EjerciciosModel");
                that.getView().byId("_IDGenPDFViewer").setTitle(aEjercicios[0].Name + " " + "(" + aEjercicios[0].Pernr + ")");
                if (sSelected === undefined){
                    sSelected = "0";                    
                }
                var aFilename = that.getView().getModel("ItemSet").oData[sSelected].Texto;
                var url = that._getPdfUrl(aEjercicios, sSelected, aFilename);
                that.getView().byId("_IDGenPDFViewer").setSource(url);
                that.getView().byId("_IDGenPDFViewer").setTitle(aFilename);
                that.getView().setBusy(false);
                window.document.title = aFilename;
                oGlobalBusyDialog.close();
                //that.getView().setVisible(true);
              }.bind(this),
              error: function (oError) {
                oGlobalBusyDialog.close();
                //console.log(this.getView().getModel("MainModel"))
                MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("view_controller_msg2"));
              },
            };
          oModel.read("/EjerciciosSet", oHttpParameters);
        },

        _getColoresModel: function (sYear, sSelected) {
          var that = this;
          sYear ? sYear = sYear : sYear  = new Date().getFullYear() - 1;

          let oModel = that.getView().getModel("MainModel"),
            oHttpParameters = {
              headers: {
                "year": sYear,
                "processid" : that.getOwnerComponent().processId,
                "sap-language" : sap.ui.getCore().getConfiguration().getLanguageTag()
              },
              success: function (oData) {
                that.myColors = oData.results;
              }.bind(this),
              error: function (oError) {
                MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("view_controller_msg2"));
              },
            };
  
          oModel.read("/ColoresSet", oHttpParameters);
           /* var that = this;
            sYear = sYear ? sYear : new Date().getFullYear() - 1;

            jQuery.ajax({
              type: "GET",
              contentType: "application/json",
              url: "sap/opu/odata/sap/ZHR_XXX_0050_ODATA_SRV/ColoresSet",
              dataType: "json",
              async: false,
              success: function (data, textStatus, jqXHR) {
                alert("OK!");
              },
              error: function (oError) {
                alert("Error to post");
              }
            }); */
        },

        _getTextosModel: function (sYear, sSelected) {
          var that = this;
          sYear ? sYear = sYear : sYear  = new Date().getFullYear() - 1;

          let oModel = that.getView().getModel("MainModel"),
            oHttpParameters = {
              headers: {
                "year": sYear,
                "processid" : that.getOwnerComponent().processId,
                "sap-language" : sap.ui.getCore().getConfiguration().getLanguageTag()
              },
              success: function (oData) {
                this.myTexts = oData.results;
                that.getView().setModel(new JSONModel(this.myTexts),'TextsSet'); 
                this._setTexts(this.myTexts);
              }.bind(this),
              error: function (oError) {
                MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("view_controller_msg2"));
              },
            };
  
          oModel.read("/TextosSet", oHttpParameters);
        },

        _getItemsModel: function (sYear, sSelected) {
          var that = this;
          sYear ? sYear = sYear : sYear  = new Date().getFullYear() - 1;

          let oModel = that.getView().getModel("MainModel"),
            oHttpParameters = {
              headers: {
                "year": sYear,
                "processid" : that.getOwnerComponent().processId,
                "sap-language" : sap.ui.getCore().getConfiguration().getLanguageTag()
              },
              success: function (oData) {
                this.myItems = oData.results;
                that.getView().setModel(new JSONModel(this.myItems),'ItemSet');
              }.bind(this),
              error: function (oError) {
                MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("view_controller_msg2"));
              },
            };
  
          oModel.read("/ItemSet", oHttpParameters);
        },

        _getUrlsModel: function (sYear, sSelected) {
          var that = this;
          sYear ? sYear = sYear : sYear  = new Date().getFullYear() - 1;

          let oModel = that.getView().getModel("MainModel"),
            oHttpParameters = {
              headers: {
                "year": sYear,
                "processid" : that.getOwnerComponent().processId,
                "sap-language" : sap.ui.getCore().getConfiguration().getLanguageTag()
              },
              success: function (oData) {
                this.myUrls = oData.results;
                that.getView().setModel(new JSONModel(this.myUrls),'UrlsSet');
              }.bind(this),
              error: function (oError) {
                MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("view_controller_msg2"));
              },
            };
  
          oModel.read("/UrlsSet", oHttpParameters);
        },
  
        onSelectionChange: async function () {
          var sURL = window.location.href;
          var selItems = this.getView().byId("list").getSelectedItems();
          var sYear = selItems[0].mProperties.title;
          var sYear_only = sYear.replace(/[^0-9]/g, '');
          this.myItems.forEach(e => {
            if(e.Texto.includes(sYear_only)){
              sYear = e.Id;
            }
          });
          await new Promise(function (resolve) {
            setTimeout(resolve, 500);
          });
          var selected = selItems[0].oParent._aSelectedPaths;
          var aSelected = selected[0].split("/")
          selected = aSelected[1];          
          //sURL.includes("flpSandbox") ? this._getEjerciciosModelTEST(sYear,selected) : this._getEjerciciosModel(sYear,selected);
          this._getEjerciciosModel(sYear,selected)
        },
  
        _getPdfUrl: function (aEjercicios, sSelected,aFilename) {
          console.log(this.getView().getModel("ItemSet"))
          //("Ejercicios --> ", aEjercicios[sSelected]);
          if(aEjercicios[0]){
            let docContent = aEjercicios[0].Pdf;
            /* docContent = docContent.replace(/\n/g, "");
            docContent = docContent.replace(/\r/g, "");
            let fileContent = docContent;
            let mimeType = "application/pdf"; */
            //Create doc url.
            var decodedPdfContent = atob(docContent);
            var byteArray = new Uint8Array(decodedPdfContent.length);
            for (var i = 0; i < decodedPdfContent.length; i++) {
              byteArray[i] = decodedPdfContent.charCodeAt(i);
            }
            var blob = new Blob([byteArray.buffer], { 
              type: "application/pdf"
            });
            var _pdfurl = URL.createObjectURL(blob);
            jQuery.sap.addUrlWhitelist("blob");

            /* if (this._PDFViewer) {
              this._PDFViewer.destroy();
            } */
            
            this._PDFViewer = new sap.m.PDFViewer({
              width: "auto"
            });
            /*this._PDFViewer.setTitle(aFilename);
            this._PDFViewer.downloadPDF = function() {
              var link = document.createElement('a');
              link.href = _pdfurl;
              link.download= aFilename;
              link.click();
            } */
            this._PDFViewer.setSource(_pdfurl);
            this._PDFViewer.setVisible(true);
           
              //jQuery.sap.addUrlWhitelist("blob");
			      this.getView().setBusy(false);
            return _pdfurl;
          }
          MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("view_controller_msg1"));
        },
  
        onSemanticButtonPress: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteSummary");
        },
  
        _getPayrollModel: function (sYear) {  
          var that = this;
          sYear ? sYear = sYear : sYear  = new Date().getFullYear() - 1;

          let oModel = this.getView().getModel(),
            oHttpParameters = {
              headers: {
                "year": sYear,
                "processid" : that.getOwnerComponent().processId,
                "sap-language" : sap.ui.getCore().getConfiguration().getLanguageTag()
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

        _setTexts:function(texts){
          texts.forEach(e => {
            var sId, oDom = this.getView().byId(e.Id); 
            oDom != undefined ? sId = oDom.sId : false;
            if(sId !== undefined){
              if(e.Id.includes('_title'))
                oDom.setTitle(e.Descripcion) 
              else if (e.Id.includes('_text')) 
                oDom.setText(e.Descripcion)
            }
          });
        },

        _setColors:function(colors){
          var sURL = window.location.href;
          var sId, oPanel;
          colors.forEach(e => {
            sURL.includes('flpSandbox') ? sId = 'application-visualizador-display-component---View--' + e.Id : sId = 'container-visualizador---View--' + e.Id;
            var doc = document.getElementById(sId); 
            if(doc != undefined && doc != null)
              !sId.includes('search') ? doc.style.backgroundColor = e.Color : doc.style.color = e.Color;
          });
        },

        onNavBack: function(){
          var aUrl = this.getView().getModel("UrlsSet").oData;
          var myUrl = aUrl[0].Url;
          //window.location = ('https://workzone-prd-vvaa2vfz.workzonehr.cfapps.eu20.hana.ondemand.com/site?sap-language=default&#workzone-home&/home') 
          window.location = (myUrl) 

        },
        /********************************************************** TEST ************************************************/
        _getItemsModelTEST: function(){
          var oModel = this.getView().getModel("ItemSet");
          this.myItems = oModel.oData.results;
          this.getView().setModel(new JSONModel(this.myItems),'ItemSet');
        },
        _getTextosModelTEST: function(){
          var oModel = this.getView().getModel("TextosSet");
          this.myTexts = oModel.oData.results;
          //this.getView().setModel(new JSONModel(this.myTexts),'TextosSet'); 
          this._setTexts(this.myTexts);
        },
        _getColoresModelTEST:function(){
          var oModel = this.getView().getModel("ColoresSet");
          this.myColors = oModel.oData.results;
          //this.getView().setModel(new JSONModel(this.myTexts),'ColoresSet'); 
          this._setColors(this.myColors);
        },

        _getEjerciciosModelTEST: function (sYear, sSelected) {
          var oModel = this.getView().getModel("EjerciciosSet");
          let oGlobalBusyDialog = new sap.m.BusyDialog();
          oGlobalBusyDialog.open();

          this.getView().byId("_IDGenPDFViewer").setVisible(true);
          let aEjercicios = new Array();
          aEjercicios = oModel.oData.results;
          if (aEjercicios.length === 0) {
            oGlobalBusyDialog.close();
            MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("view_controller_msg1"));
          }
          aEjercicios = this._changeSelectedFormat(aEjercicios);
          //this.getView().setModel(new JSONModel(aEjercicios), "EjerciciosModel");
          this.getView().byId("_IDGenPDFViewer").setTitle(aEjercicios[0].Name + " " + "(" + aEjercicios[0].Pernr + ")");
          if (sSelected === undefined){
              sSelected = "0";                    
          }
          var aFilename;
          this.getView().getModel("ItemSet").oData.results ? aFilename = this.getView().getModel("ItemSet").oData.results[sSelected].Texto : aFilename = this.getView().getModel("ItemSet").oData[sSelected].Texto;
          var url = this._getPdfUrl(aEjercicios, sSelected, aFilename);
          this.getView().byId("_IDGenPDFViewer").setSource(url);
          this.getView().byId("_IDGenPDFViewer").setTitle(aFilename);
          this.getView().setBusy(false);
          window.document.title = aFilename;
          oGlobalBusyDialog.close();
          //this._setColors(this.myColors);
          //that.getView().setVisible(true);
        }
      });
    }
  );
  