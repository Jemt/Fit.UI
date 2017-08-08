Fit.UI internally uses the DatePicker from jQuery UI.
There is a lot of really brilliant developers out there,
so it makes perfect sense to leverage some of the hard
work they have done. No need to reinvent the wheel.

However, we do not want jQuery and jQuery UI to pollute
the global scope, we do not want to load the entire UI
framework, and it is not accaptable to have it conflict
with other versions of jQuery and jQuery UI already loaded.
Therefore some changes are required to truly isolate
jQuery and jQuery UI.

Obviously $.noConflict(true) must be called. But customizations
to the jQuery UI build is also necessary.

1) Download jQuery UI 1.11.4 from http://jqueryui.com/download
   Make sure only "Datepicker" (and "Core") is selected,
   and that the Theme selected is "Base".

2) Open jquery-ui.js for editing,
    - replace all instances of "ui-" with "fitui-"
    - replace
        if ( typeof define === "function" && define.amd ) {
      with
        if (false) { //if ( typeof define === "function" && define.amd ) {

3) Open external/jquery/jquery.js for editing,
    - Disable module support - comment out define( "jquery", [], function () { return jQuery; } );
    - Disable module support - replace
        if ( typeof module === "object" && module && typeof module.exports === "object" ) {
      with
        if (false) { // if ( typeof module === "object" && module && typeof module.exports === "object" ) {

4) Open jquery-ui.css for editing,
    - replace all instances of ".ui-" with ".fitui-"
    - replace all instances of "images/" with "Resources/JqueryUI-1.11.4.custom/images/"

5) Remove all files from jQuery UI folder EXCEPT
   jquery-ui.js, jquery-ui.css, and all folders.

6) Download all localization files from
   https://github.com/jquery/jquery-ui/tree/master/ui/i18n
   to Resources/JqueryUI-1.11.4.custom/i18n/

7) Disable module support in localization files to make sure
   the globally accessible jQuery instance is used when files
   are loaded. Use Bash and sed to achieve this:
   # cd Resources/JqueryUI-1.11.4.custom/i18n
   for file in `ls datepicker-*js` ; do sed -i -e 's/typeof define === "function"/false \&\& typeof define === "function"/g' $file ; done

8) Within Controls/DatePicker/DataPicker.js is a function
   called getJqueryDateFormatFromLocale(locale) which contains
   a complete list of all locales which maps to their corresponding
   DateFormat strings - this list should be updated if localization
   files are updated.
