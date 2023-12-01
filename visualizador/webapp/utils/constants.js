sap.ui.define([
], function () {
	
	return {
		HANA_DEV: "hanatrial",
		SAP_DOMAIN: "my550714.payroll.sapsf.eu",
		APP_DEV_DOMAIN: "port8080-workspaces-ws-wk24t.eu10.applicationstudio.cloud.sap",
		sRequest: "?sap-client=100&processId=446F73735F436F6D70656E736163696F6E",
		SAP_DEV_DOMAIN: "my550714.payroll.sapsf.eu",
		SAP_PREVIEW_DOMAIN: "my550714.payroll.sapsf.eu",
		//SAP_PROD_DOMAIN: "my0100291.payroll.ondemand.com",
		SFSF_DEV: "performancemanager.successfactors.eu",
		SFSF_DEV_PHOTO_URI: "/eduPhoto/view?companyId=BRICOMARTDES&photo_type=liveProfile&user_id=",
		SFSF_DEV_ATTACHMENT_API: "https://api2.successfactors.eu/odata/v2/Attachment",

		//---- Rutas Llamadas -----
		PATH_PORTAL: "/Portal",
		PATH_EMPLEADOS: "/EmpleadosSet",
		PATH_USUARIO: "/UsuarioSet",
		PATH_PRIMAPROG: "/PrimaProgresoSet",
		PATH_PRIMA_BENEFICIOS: "/PrimaBeneficiosSet",
		PATH_SOLICITUDES: "/SolicitudesDesbloqueoSet",
		PATH_SOLICITUDES_VENTA: "/SolicitudesVentaSet",
		PATH_ADJUNTOS: "/DocumentoAdjuntoSet",
		PATH_CALCULO_DESBLOQUEO: "/AccionesDesbloqueo",
		PATH_CALCULO_VENTA: "/AccionesVenta",
		PATH_CARTERA: "/CarteraAccionesSet",
		PATH_MOTIVOS: "/MotivosDesbloqueoSet",
		PATH_GET_ATTACHMENT: "/GetAttachment",
		PATH_ENTREGA_VOLUNTARIA: "/EntregaVoluntariaSet",
		PATH_ENTREGA_VOLUNTARIA_CALCULO: "/ImporteEVA",
		PATH_COMPRA_VOLUNTARIA: "/CompraVoluntariaSet",
		PATH_IMPORTE_DISPONIBLE_COMPRA: "/ImporteDisponibleCompra",
		PATH_IMPORTE_COMPRA: "/ImporteCompra",
		PATH_ACCIONES_BIENVENIDA: "/AccionesBienvenidaSet",
		PATH_GET_SMARTFORM: "/GetSmartForm",

		USER_TYPE_TEMP: "Temporal",
		USER_TYPE_INDF: "Indefinido",

		ACCSOL_TYPE_SOLICITADO: "1",
		ACCSOL_TYPE_RECHAZADO: "2",
		ACCSOL_TYPE_APROBADO: "3",
		ACCSOL_TYPE_INFO: "4",

	};
});