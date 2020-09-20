!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).it=e()}(this,(function(){"use strict";var t=function(t,e,n,o){this.language=t,this.months=e,this.monthsAbbr=n,this.days=o,this.rtl=!1,this.ymd=!1,this.yearSuffix=""},e={language:{configurable:!0},months:{configurable:!0},monthsAbbr:{configurable:!0},days:{configurable:!0}};return e.language.get=function(){return this._language},e.language.set=function(t){if("string"!=typeof t)throw new TypeError("Language must be a string");this._language=t},e.months.get=function(){return this._months},e.months.set=function(t){if(12!==t.length)throw new RangeError("There must be 12 months for "+this.language+" language");this._months=t},e.monthsAbbr.get=function(){return this._monthsAbbr},e.monthsAbbr.set=function(t){if(12!==t.length)throw new RangeError("There must be 12 abbreviated months for "+this.language+" language");this._monthsAbbr=t},e.days.get=function(){return this._days},e.days.set=function(t){if(7!==t.length)throw new RangeError("There must be 7 days for "+this.language+" language");this._days=t},t.prototype.getMonthByAbbrName=function(t){var e=-1;this._monthsAbbr.some((function(n,o){return n===t&&(e=o,!0)}));var n=e+1;return n<10?"0"+n:""+n},t.prototype.getMonthByName=function(t){var e=-1;this._months.some((function(n,o){return n===t&&(e=o,!0)}));var n=e+1;return n<10?"0"+n:""+n},Object.defineProperties(t.prototype,e),new t("Italian",["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"],["Dom","Lun","Mar","Mer","Gio","Ven","Sab"])}));
