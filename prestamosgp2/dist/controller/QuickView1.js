sap.ui.define(["sap/ui/base/ManagedObject","sap/m/MessageBox","./utilities","sap/ui/core/routing/History"],function(t,e,o,i){return t.extend("prestamosgp2.controller.QuickView1",{constructor:function(t){this._oView=t;this._oControl=sap.ui.xmlfragment(t.getId(),"prestamosgp2.view.QuickView1",this);this._bInit=false},exit:function(){delete this._oView},getView:function(){return this._oView},getControl:function(){return this._oControl},getOwnerComponent:function(){return this._oView.getController().getOwnerComponent()},open:function(){var t=this._oView;var e=this._oControl;if(!this._bInit){this.onInit();this._bInit=true;t.addDependent(e)}var o=Array.prototype.slice.call(arguments);if(e.open){e.open.apply(e,o)}else if(e.openBy){e.openBy.apply(e,o)}},close:function(){this._oControl.close()},setRouter:function(t){this.oRouter=t},getBindingParameters:function(){return{}},onInit:function(){this._oDialog=this.getControl()},onExit:function(){this._oDialog.destroy()}})},true);
//# sourceMappingURL=QuickView1.js.map