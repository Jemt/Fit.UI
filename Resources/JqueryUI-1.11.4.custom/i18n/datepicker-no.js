/* Norwegian initialisation for the jQuery UI date picker plugin. */
/* Written by Naimdjon Takhirov (naimdjon@gmail.com). */

( function( factory ) {
	if ( false && typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		//define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.no = {
	closeText: "Lukk",
	prevText: "&#xAB;Forrige",
	nextText: "Neste&#xBB;",
	currentText: "I dag",
	monthNames: [
		"Januar",
		"Februar",
		"Mars",
		"April",
		"Mai",
		"Juni",
		"Juli",
		"August",
		"September",
		"Oktober",
		"November",
		"Desember"
	],
	monthNamesShort: [ "Jan","Feb","Mar","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Des" ],
	dayNamesShort: [ "Søn","Man","Tir","Ons","Tor","Fre","Lør" ],
	dayNames: [ "Søndag","Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag" ],
	dayNamesMin: [ "Sø","Ma","Ti","On","To","Fr","Lø" ],
	weekHeader: "Uke",
	dateFormat: "dd.mm.yy",
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ""
};
datepicker.setDefaults( datepicker.regional.no );

return datepicker.regional.no;

} ) );
