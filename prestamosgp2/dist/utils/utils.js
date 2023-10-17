sap.ui.define(["sap/m/Dialog","sap/m/library","sap/ui/core/library","sap/m/Button","sap/m/Text","sap/ui/core/Fragment"],function(e,t,n,r,s,a){"use strict";var i=t.DialogType;var o=n.ValueState;var u=t.ButtonType;return{showErrorMsg:function(t){var n=new e({type:i.Message,title:"Error",state:o.Error,content:new s({text:t}),beginButton:new r({type:u.Emphasized,text:"OK",press:function(){n.close()}.bind(this)})});n.open()},showSuccessMsg:function(t){var n=new e({type:i.Message,title:"Success",state:o.Success,content:new s({text:t}),beginButton:new r({type:u.Emphasized,text:"OK",press:function(){n.close()}.bind(this)})});n.open()},getUrl:function(){const e=window.location.href.split("/");var t=e[3];var n=e[2];if(n.includes("port")||t==="test"){t=""}else{t="/"+t}return t},onlyUnique:function(e,t,n){return n.indexOf(e)===t},getActualDate(){var e=new Date;var t=e.getFullYear();var n=e.getMonth()+2;return{anyo:t,mes:n}},getTipoNum:function(e){if(e=="VIVIENDA")return 2;else return 1}}});
//# sourceMappingURL=utils.js.map