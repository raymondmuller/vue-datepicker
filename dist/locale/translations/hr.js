!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t=t||self).hr=n()}(this,(function(){"use strict";var t=function(t,n,e,r){this.language=t,this.months=n,this.monthsAbbr=e,this.days=r,this.rtl=!1,this.ymd=!1,this.yearSuffix=""},n={language:{configurable:!0},months:{configurable:!0},monthsAbbr:{configurable:!0},days:{configurable:!0}};return n.language.get=function(){return this._language},n.language.set=function(t){if("string"!=typeof t)throw new TypeError("Language must be a string");this._language=t},n.months.get=function(){return this._months},n.months.set=function(t){if(12!==t.length)throw new RangeError("There must be 12 months for "+this.language+" language");this._months=t},n.monthsAbbr.get=function(){return this._monthsAbbr},n.monthsAbbr.set=function(t){if(12!==t.length)throw new RangeError("There must be 12 abbreviated months for "+this.language+" language");this._monthsAbbr=t},n.days.get=function(){return this._days},n.days.set=function(t){if(7!==t.length)throw new RangeError("There must be 7 days for "+this.language+" language");this._days=t},t.prototype.getMonthByAbbrName=function(t){var n=-1;this._monthsAbbr.some((function(e,r){return e===t&&(n=r,!0)}));var e=n+1;return e<10?"0"+e:""+e},t.prototype.getMonthByName=function(t){var n=-1;this._months.some((function(e,r){return e===t&&(n=r,!0)}));var e=n+1;return e<10?"0"+e:""+e},Object.defineProperties(t.prototype,n),new t("Croatian",["Siječanj","Veljača","Ožujak","Travanj","Svibanj","Lipanj","Srpanj","Kolovoz","Rujan","Listopad","Studeni","Prosinac"],["Sij","Velj","Ožu","Tra","Svi","Lip","Srp","Kol","Ruj","Lis","Stu","Pro"],["Ned","Pon","Uto","Sri","Čet","Pet","Sub"])}));