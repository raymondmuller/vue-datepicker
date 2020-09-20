/*
* @sum.cumo/vue-datepicker v2.1.1
* (c) 2018-2020 sum.cumo GmbH
* Released under the Apache-2.0 License.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('core-js/es/object/assign'), require('core-js/es/number/is-nan'), require('vue')) :
  typeof define === 'function' && define.amd ? define(['core-js/es/object/assign', 'core-js/es/number/is-nan', 'vue'], factory) :
  (global = global || self, global.vuejsDatepicker = factory(null, null, global.vue));
}(this, (function (assign, isNan, vue) { 'use strict';

  var Language = function Language(language, months, monthsAbbr, days) {
    this.language = language;
    this.months = months;
    this.monthsAbbr = monthsAbbr;
    this.days = days;
    this.rtl = false;
    this.ymd = false;
    this.yearSuffix = '';
  };

  var prototypeAccessors = { language: { configurable: true },months: { configurable: true },monthsAbbr: { configurable: true },days: { configurable: true } };

  /* eslint-disable no-underscore-dangle */
  prototypeAccessors.language.get = function () {
    return this._language
  };

  prototypeAccessors.language.set = function (language) {
    if (typeof language !== 'string') {
      throw new TypeError('Language must be a string')
    }
    this._language = language;
  };

  prototypeAccessors.months.get = function () {
    return this._months
  };

  prototypeAccessors.months.set = function (months) {
    if (months.length !== 12) {
      throw new RangeError(("There must be 12 months for " + (this.language) + " language"))
    }
    this._months = months;
  };

  prototypeAccessors.monthsAbbr.get = function () {
    return this._monthsAbbr
  };

  prototypeAccessors.monthsAbbr.set = function (monthsAbbr) {
    if (monthsAbbr.length !== 12) {
      throw new RangeError(("There must be 12 abbreviated months for " + (this.language) + " language"))
    }
    this._monthsAbbr = monthsAbbr;
  };

  prototypeAccessors.days.get = function () {
    return this._days
  };

  prototypeAccessors.days.set = function (days) {
    if (days.length !== 7) {
      throw new RangeError(("There must be 7 days for " + (this.language) + " language"))
    }
    this._days = days;
  };

  Language.prototype.getMonthByAbbrName = function getMonthByAbbrName (name) {
    var index = -1;
    this._monthsAbbr.some(function (month, i) {
      if (month === name) {
        index = i;
        return true
      }
      return false
    });
    var monthValue = index + 1;
    return monthValue < 10 ? ("0" + monthValue) : ("" + monthValue)
  };

  Language.prototype.getMonthByName = function getMonthByName (name) {
    var index = -1;
    this._months.some(function (month, i) {
      if (month === name) {
        index = i;
        return true
      }
      return false
    });
    var monthValue = index + 1;
    return monthValue < 10 ? ("0" + monthValue) : ("" + monthValue)
  };

  Object.defineProperties( Language.prototype, prototypeAccessors );

  var en = new Language(
    'English',
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  );

  var utils = {
    /**
     * @type {Boolean}
     */
    useUtc: false,
    /**
     * Returns the full year, using UTC or not
     * @param {Date} date
     */
    getFullYear: function getFullYear(date) {
      return this.useUtc ? date.getUTCFullYear() : date.getFullYear()
    },

    /**
     * Returns the month, using UTC or not
     * @param {Date} date
     */
    getMonth: function getMonth(date) {
      return this.useUtc ? date.getUTCMonth() : date.getMonth()
    },

    /**
     * Returns the date, using UTC or not
     * @param {Date} date
     */
    getDate: function getDate(date) {
      return this.useUtc ? date.getUTCDate() : date.getDate()
    },

    /**
     * Returns the day, using UTC or not
     * @param {Date} date
     */
    getDay: function getDay(date) {
      return this.useUtc ? date.getUTCDay() : date.getDay()
    },

    /**
     * Returns the hours, using UTC or not
     * @param {Date} date
     */
    getHours: function getHours(date) {
      return this.useUtc ? date.getUTCHours() : date.getHours()
    },

    /**
     * Returns the minutes, using UTC or not
     * @param {Date} date
     */
    getMinutes: function getMinutes(date) {
      return this.useUtc ? date.getUTCMinutes() : date.getMinutes()
    },

    /**
     * Sets the full year, using UTC or not
     * @param {Date} date
     * @param {String, Number} value
     */
    setFullYear: function setFullYear(date, value) {
      return this.useUtc ? date.setUTCFullYear(value) : date.setFullYear(value)
    },

    /**
     * Sets the month, using UTC or not
     * @param {Date} date
     * @param {String, Number} value
     */
    setMonth: function setMonth(date, value) {
      return this.useUtc ? date.setUTCMonth(value) : date.setMonth(value)
    },

    /**
     * Sets the date, using UTC or not
     * @param {Date} date
     * @param {String, Number} value
     */
    setDate: function setDate(date, value) {
      return this.useUtc ? date.setUTCDate(value) : date.setDate(value)
    },

    /**
     * Check if date1 is equivalent to date2, without comparing the time
     * @see https://stackoverflow.com/a/6202196/4455925
     * @param {Date} date1
     * @param {Date} date2
     */
    compareDates: function compareDates(date1, date2) {
      var d1 = new Date(date1.getTime());
      var d2 = new Date(date2.getTime());

      this.resetDateTime(d1);
      this.resetDateTime(d2);
      return d1.getTime() === d2.getTime()
    },

    /**
     * Validates a date object
     * @param {Date} date - an object instantiated with the new Date constructor
     * @return {Boolean}
     */
    isValidDate: function isValidDate(date) {
      if (Object.prototype.toString.call(date) !== '[object Date]') {
        return false
      }
      return !Number.isNaN(date.getTime())
    },

    /**
     * Return abbreviated week day name
     * @param {Date} date
     * @param {Array} days
     * @return {String}
     */
    getDayNameAbbr: function getDayNameAbbr(date, days) {
      if (typeof date !== 'object') {
        throw TypeError('Invalid Type')
      }
      return days[this.getDay(date)]
    },

    /**
     * Return name of the month
     * @param {Number|Date} month
     * @param {Array} months
     * @return {String}
     */
    getMonthName: function getMonthName(month, months) {
      if (!months) {
        throw Error('missing 2nd parameter Months array')
      }
      if (typeof month === 'object') {
        return months[this.getMonth(month)]
      }
      if (typeof month === 'number') {
        return months[month]
      }
      throw TypeError('Invalid type')
    },

    /**
     * Return an abbreviated version of the month
     * @param {Number|Date} month
     * @param {Array} monthsAbbr
     * @return {String}
     */
    getMonthNameAbbr: function getMonthNameAbbr(month, monthsAbbr) {
      if (!monthsAbbr) {
        throw Error('missing 2nd paramter Months array')
      }
      if (typeof month === 'object') {
        return monthsAbbr[this.getMonth(month)]
      }
      if (typeof month === 'number') {
        return monthsAbbr[month]
      }
      throw TypeError('Invalid type')
    },

    /**
     * Alternative get total number of days in month
     * @param {Number} year
     * @param {Number} month
     * @return {Number}
     */
    daysInMonth: function daysInMonth(year, month) {
      /* eslint-disable-next-line no-nested-ternary */
      return /8|3|5|10/.test(month) ? 30 : month === 1 ? (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28 : 31
    },

    /**
     * Get nth suffix for date
     * @param {Number} day
     * @return {String}
     */
    getNthSuffix: function getNthSuffix(day) {
      switch (day) {
        case 1:
        case 21:
        case 31:
          return 'st'
        case 2:
        case 22:
          return 'nd'
        case 3:
        case 23:
          return 'rd'
        default:
          return 'th'
      }
    },

    /**
     * Formats date object
     * @param {Date} date
     * @param {String} formatStr
     * @param {Object} translation
     * @return {String}
     */
    formatDate: function formatDate(date, formatStr, translation) {
      var translationTemp = (!translation) ? en : translation;
      var year = this.getFullYear(date);
      var month = this.getMonth(date) + 1;
      var day = this.getDate(date);
      return formatStr
        .replace(/dd/, (("0" + day)).slice(-2))
        .replace(/d/, day)
        .replace(/yyyy/, year)
        .replace(/yy/, String(year).slice(2))
        .replace(/MMMM/, this.getMonthName(this.getMonth(date), translationTemp.months))
        .replace(/MMM/, this.getMonthNameAbbr(this.getMonth(date), translationTemp.monthsAbbr))
        .replace(/MM/, (("0" + month)).slice(-2))
        .replace(/M(?![aäe])/, month)
        .replace(/o/, this.getNthSuffix(this.getDate(date)))
        .replace(/E(?![eéi])/, this.getDayNameAbbr(date, translationTemp.days))
    },

    /**
     * makes date parseable
     * to use with international dates
     * @param {String} dateStr
     * @param {String|Function} formatStr
     * @param {Object} translation
     * @param {Function} parser
     * @return {Date | String}
     */
    parseDate: function parseDate(dateStr, formatStr, translation, parser) {
      var translationTemp = (!translation) ? en : translation;
      if (!(dateStr && formatStr)) {
        return dateStr
      }
      if (typeof formatStr === 'function') {
        if (!parser || typeof parser !== 'function') {
          throw new Error('Parser need to be a function if you are using a custom formatter')
        }
        return parser(dateStr)
      }
      var splitter = formatStr.match(/-|\/|\s|\./) || ['-'];
      var df = formatStr.split(splitter[0]);
      var ds = dateStr.split(splitter[0]);
      var ymd = [
        0,
        0,
        0 ];
      for (var i = 0; i < df.length; i += 1) {
        if (/yyyy/i.test(df[i])) {
          ymd[0] = ds[i];
        } else if (/mmmm/i.test(df[i])) {
          ymd[1] = translationTemp.getMonthByName(ds[i]);
        } else if (/mmm/i.test(df[i])) {
          ymd[1] = translationTemp.getMonthByAbbrName(ds[i]);
        } else if (/mm/i.test(df[i])) {
          ymd[1] = ds[i];
        } else if (/m/i.test(df[i])) {
          ymd[1] = ds[i];
        } else if (/dd/i.test(df[i])) {
          ymd[2] = ds[i];
        } else if (/d/i.test(df[i])) {
          var tmp = ds[i].replace(/st|rd|nd|th/g, '');
          ymd[2] = tmp < 10 ? ("0" + tmp) : ("" + tmp);
        }
      }
      var dat = (ymd.join('-')) + "T00:00:00Z";
      if (Number.isNaN(Date.parse(dat))) {
        return dateStr
      }
      return dat
    },

    /**
     * Creates an array of dates for each day in between two dates.
     * @param {Date} start
     * @param {Date} end
     * @return {Array}
     */
    createDateArray: function createDateArray(start, end) {
      var dates = [];
      var startTemp = start;
      while (startTemp <= end) {
        dates.push(new Date(startTemp));
        startTemp = this.setDate(new Date(startTemp), this.getDate(new Date(startTemp)) + 1);
      }
      return dates
    },

    /**
     * Remove hours/minutes/seconds/milliseconds from a date object
     * @param {Date} date
     * @return {Date}
     */
    resetDateTime: function resetDateTime(date) {
      return new Date(this.useUtc ? date.setUTCHours(0, 0, 0, 0) : date.setHours(0, 0, 0, 0))
    },

    /**
     * Return a new date object with hours/minutes/seconds/milliseconds removed
     * @return {Date}
     */
    getNewDateObject: function getNewDateObject(date) {
      return date ? this.resetDateTime(new Date(date)) : this.resetDateTime(new Date())
    },
  };

  var makeDateUtils = function (useUtc) { return (Object.assign({}, utils,
    {useUtc: useUtc})); };

  Object.assign({}, utils);

  var script = ({
    props: {
      format: {
        type: [
          String,
          Function ],
        default: 'dd MMM yyyy',
      },
      parser: {
        type: Function,
        default: null,
      },
      id: {
        type: String,
        default: null,
      },
      name: {
        type: String,
        default: null,
      },
      refName: {
        type: String,
        default: '',
      },
      openDate: {
        type: [
          String,
          Date,
          Number ],
        default: null,
        validator:
          function (val) { return val === null
            || val instanceof Date
            || typeof val === 'string'
            || typeof val === 'number'; },
      },
      placeholder: {
        type: String,
        default: null,
      },
      tabindex: {
        type: [
          Number,
          String ],
        default: null,
      },
      inline: {
        type: Boolean,
        default: false,
      },
      inputClass: {
        type: [
          String,
          Object,
          Array ],
        default: null,
      },
      clearButton: {
        type: Boolean,
        default: false,
      },
      clearButtonIcon: {
        type: String,
        default: '',
      },
      calendarButton: {
        type: Boolean,
        default: false,
      },
      calendarButtonIcon: {
        type: String,
        default: '',
      },
      calendarButtonIconContent: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      required: {
        type: Boolean,
        default: false,
      },
      typeable: {
        type: Boolean,
        default: false,
      },
      bootstrapStyling: {
        type: Boolean,
        default: false,
      },
      useUtc: {
        type: Boolean,
        default: false,
      },
      showCalendarOnFocus: {
        type: Boolean,
        default: false,
      },
      showCalendarOnButtonClick: {
        type: Boolean,
        default: false,
      },
      autofocus: {
        type: Boolean,
        default: false,
      },
      maxlength: {
        type: [
          Number,
          String ],
        default: null,
      },
      pattern: {
        type: String,
        default: null,
      },
    },
  });

  var render = function () {};


  script.render = render;
  script.__file = "src/mixins/inputProps.vue";

  var script$1 = {
    name: 'DatepickerInput',
    mixins: [
      script ],
    props: {
      selectedDate: {
        type: Date,
        default: null,
      },
      resetTypedDate: {
        type: [Date],
        default: null,
      },
      translation: {
        type: Object,
        default: function default$1() {
          return {}
        },
      },
    },
    emits: ['show-calendar', 'focus', 'typed-date', 'blur', 'close-calendar', 'clear-date'],
    data: function data() {
      var constructedDateUtils = makeDateUtils(this.useUtc);
      return {
        input: null,
        typedDate: false,
        utils: constructedDateUtils,
      }
    },
    computed: {
      formattedValue: function formattedValue() {
        if (!this.selectedDate) {
          return null
        }
        if (this.typedDate) {
          return this.typedDate
        }
        return typeof this.format === 'function'
          ? this.format(new Date(this.selectedDate))
          : this.utils.formatDate(new Date(this.selectedDate), this.format, this.translation)
      },

      computedInputClass: function computedInputClass() {
        if (this.bootstrapStyling) {
          if (typeof this.inputClass === 'string') {
            return [
              this.inputClass,
              'form-control' ].join(' ')
          }
          return Object.assign({}, {'form-control': true}, this.inputClass)
        }
        return this.inputClass
      },
    },
    watch: {
      resetTypedDate: function resetTypedDate() {
        this.typedDate = false;
      },
    },
    mounted: function mounted() {
      this.input = this.$el.querySelector('input');
    },
    methods: {
      showCalendar: function showCalendar(isButton) {
        // prevent to emit the event twice if we are listening focus
        if (!this.showCalendarOnFocus) {
          if (
            !this.showCalendarOnButtonClick
            || (
              this.showCalendarOnButtonClick
              && this.calendarButton
              && isButton
            )
          ) {
            this.$emit('show-calendar');
          }
        }
      },
      showFocusCalendar: function showFocusCalendar() {
        if (this.showCalendarOnFocus) {
          this.$emit('show-calendar', true);
        }

        this.$emit('focus');
      },
      /**
       * Attempt to parse a typed date
       * @param {Event} event
       */
      parseTypedDate: function parseTypedDate(event) {
        var code = (event.keyCode ? event.keyCode : event.which);
        // close calendar if escape or enter are pressed
        if ([
          27, // escape
          13 ].indexOf(code) !== -1) {
          this.input.blur();
        }

        if (this.typeable) {
          var parsableDate = this.parseDate(this.input.value);
          var parsedDate = Date.parse(parsableDate);
          if (!Number.isNaN(parsedDate)) {
            this.typedDate = this.input.value;
            this.$emit('typed-date', new Date(parsedDate));
          }
        }
      },
      /**
       * nullify the typed date to defer to regular formatting
       * called once the input is blurred
       */
      inputBlurred: function inputBlurred() {
        var parsableDate = this.parseDate(this.input.value);
        if (this.typeable && Number.isNaN(Date.parse(parsableDate))) {
          this.clearDate();
          this.input.value = null;
          this.typedDate = null;
        }
        this.$emit('blur');
        this.$emit('close-calendar');
      },
      /**
       * emit a clearDate event
       */
      clearDate: function clearDate() {
        this.$emit('clear-date');
      },
      parseDate: function parseDate(value) {
        return this.utils.parseDate(
          value,
          this.format,
          this.translation,
          this.parser
        )
      },
    },
  };

  var _hoisted_1 = { key: 0 };
  var _hoisted_2 = { key: 0 };

  function render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createBlock("div", {
      class: {'input-group' : _ctx.bootstrapStyling}
    }, [
      vue.renderSlot(_ctx.$slots, "beforeDateInput"),
      vue.createCommentVNode(" Calendar Button "),
      (_ctx.calendarButton)
        ? (vue.openBlock(), vue.createBlock("span", {
            key: 0,
            class: [{'input-group-prepend' : _ctx.bootstrapStyling, 'calendar-btn-disabled': _ctx.disabled}, "vdp-datepicker__calendar-button"],
            onClick: _cache[1] || (_cache[1] = function ($event) { return ($options.showCalendar(true)); })
          }, [
            vue.createVNode("span", {
              class: {'input-group-text' : _ctx.bootstrapStyling}
            }, [
              vue.createVNode("i", { class: _ctx.calendarButtonIcon }, [
                vue.createTextVNode(vue.toDisplayString(_ctx.calendarButtonIconContent) + " ", 1 /* TEXT */),
                (!_ctx.calendarButtonIcon)
                  ? (vue.openBlock(), vue.createBlock("span", _hoisted_1, " … "))
                  : vue.createCommentVNode("v-if", true)
              ], 2 /* CLASS */)
            ], 2 /* CLASS */)
          ], 2 /* CLASS */))
        : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" Input "),
      vue.createVNode("input", {
        id: _ctx.id,
        ref: _ctx.refName,
        type: _ctx.inline ? 'hidden' : 'text',
        class: $options.computedInputClass,
        name: _ctx.name,
        value: $options.formattedValue,
        "open-date": _ctx.openDate,
        placeholder: _ctx.placeholder,
        "clear-button": _ctx.clearButton,
        disabled: _ctx.disabled,
        required: _ctx.required,
        readonly: !_ctx.typeable,
        autofocus: _ctx.autofocus,
        maxlength: _ctx.maxlength,
        pattern: _ctx.pattern,
        tabindex: _ctx.tabindex,
        autocomplete: "off",
        onClick: _cache[2] || (_cache[2] = function ($event) { return ($options.showCalendar(false)); }),
        onFocus: _cache[3] || (_cache[3] = function () {
          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];

          return ($options.showFocusCalendar.apply($options, args));
    }),
        onKeyup: _cache[4] || (_cache[4] = function () {
          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];

          return ($options.parseTypedDate.apply($options, args));
    }),
        onBlur: _cache[5] || (_cache[5] = function () {
          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];

          return ($options.inputBlurred.apply($options, args));
    })
      }, null, 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["id", "type", "name", "value", "open-date", "placeholder", "clear-button", "disabled", "required", "readonly", "autofocus", "maxlength", "pattern", "tabindex"]),
      vue.createCommentVNode(" Clear Button "),
      (_ctx.clearButton && $props.selectedDate)
        ? (vue.openBlock(), vue.createBlock("span", {
            key: 1,
            class: [{'input-group-append' : _ctx.bootstrapStyling}, "vdp-datepicker__clear-button"],
            onClick: _cache[6] || (_cache[6] = function ($event) { return ($options.clearDate()); })
          }, [
            vue.createVNode("span", {
              class: {'input-group-text' : _ctx.bootstrapStyling}
            }, [
              vue.createVNode("i", { class: _ctx.clearButtonIcon }, [
                (!_ctx.clearButtonIcon)
                  ? (vue.openBlock(), vue.createBlock("span", _hoisted_2, " × "))
                  : vue.createCommentVNode("v-if", true)
              ], 2 /* CLASS */)
            ], 2 /* CLASS */)
          ], 2 /* CLASS */))
        : vue.createCommentVNode("v-if", true),
      vue.renderSlot(_ctx.$slots, "afterDateInput")
    ], 2 /* CLASS */))
  }

  script$1.render = render$1;
  script$1.__file = "src/components/DateInput.vue";

  var script$2 = {
    name: 'DatepickerHeader',
    props: {
      config: {
        type: Object,
        default: function default$1() {
          return {
            showHeader: true,
            isRtl: false,
            isNextDisabled: function isNextDisabled() {
              return false
            },
            isPreviousDisabled: function isPreviousDisabled() {
              return false
            },
          }
        },
      },
      next: {
        type: Function,
        default: function default$2() {
          return false
        },
      },
      previous: {
        type: Function,
        default: function default$3() {
          return false
        },
      },
    },
    computed: {
      /**
       * Is the left hand navigation button disabled?
       * @return {Boolean}
       */
      isLeftNavDisabled: function isLeftNavDisabled() {
        return this.config.isRtl
          ? this.config.isNextDisabled()
          : this.config.isPreviousDisabled()
      },
      /**
       * Is the right hand navigation button disabled?
       * @return {Boolean}
       */
      isRightNavDisabled: function isRightNavDisabled() {
        return this.config.isRtl
          ? this.config.isPreviousDisabled()
          : this.config.isNextDisabled()
      },
    },
  };

  var _hoisted_1$1 = /*#__PURE__*/vue.createVNode("span", { class: "default" }, "<", -1 /* HOISTED */);
  var _hoisted_2$1 = /*#__PURE__*/vue.createVNode("span", { class: "default" }, ">", -1 /* HOISTED */);

  function render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createBlock("header", null, [
      vue.createVNode("span", {
        class: [{'disabled': $options.isLeftNavDisabled}, "prev"],
        onClick: _cache[1] || (_cache[1] = function ($event) { return ($props.config.isRtl ? $props.next() : $props.previous()); })
      }, [
        vue.renderSlot(_ctx.$slots, "prevIntervalBtn", {}, function () { return [
          _hoisted_1$1
        ]; })
      ], 2 /* CLASS */),
      vue.renderSlot(_ctx.$slots, "headerContent"),
      vue.createVNode("span", {
        class: [{'disabled': $options.isRightNavDisabled}, "next"],
        onClick: _cache[2] || (_cache[2] = function ($event) { return ($props.config.isRtl ? $props.previous() : $props.next()); })
      }, [
        vue.renderSlot(_ctx.$slots, "nextIntervalBtn", {}, function () { return [
          _hoisted_2$1
        ]; })
      ], 2 /* CLASS */)
    ], 512 /* NEED_PATCH */)), [
      [vue.vShow, $props.config.showHeader]
    ])
  }

  script$2.render = render$2;
  script$2.__file = "src/components/PickerHeader.vue";

  var script$3 = ({
    components: { PickerHeader: script$2 },
    inheritAttrs: false,
    props: {
      showHeader: {
        type: Boolean,
        default: true,
      },
      allowedToShowView: {
        type: Function,
        default: function default$1() {
        },
      },
      disabledDates: {
        type: Object,
        default: function default$2() {
          return {}
        },
      },
      isRtl: {
        type: Boolean,
        default: false,
      },
      pageDate: {
        type: Date,
        default: null,
      },
      pageTimestamp: {
        type: Number,
        default: 0,
      },
      selectedDate: {
        type: Date,
        default: null,
      },
      translation: {
        type: Object,
        default: function default$3() {
          return {}
        },
      },
      useUtc: {
        type: Boolean,
        default: false,
      },
    },
    data: function data() {
      return {
        utils: makeDateUtils(this.useUtc),
        headerConfig: {
          showHeader: this.showHeader,
          isRtl: this.isRtl,
          isNextDisabled: this.isNextDisabled,
          isPreviousDisabled: this.isPreviousDisabled,
        },
      }
    },
    methods: {
      /**
       * Emit an event to show the month picker
       */
      showPickerCalendar: function showPickerCalendar(type) {
        this.$emit(("show-" + type + "-calendar"));
      },
      /**
       * Need to be set inside the different pickers for month, year, decade
       */
      isNextDisabled: function isNextDisabled() {
        return false
      },
      isPreviousDisabled: function isPreviousDisabled() {
        return false
      },
    },
  });

  var render$3 = function () {};


  script$3.render = render$3;
  script$3.__file = "src/mixins/pickerMixin.vue";

  var checkDateSpecific = function (date, disabledDates, utils) {
    if (typeof disabledDates.dates !== 'undefined' && disabledDates.dates.length) {
      var dates = disabledDates.dates;
      for (var i = 0; i < dates.length; i += 1) {
        if (utils.compareDates(date, dates[i])) {
          return true
        }
      }
    }
    return false
  };

  var checkDateDisabledFromTo = function (date, disabledDates) {
    if (typeof disabledDates.to !== 'undefined' && disabledDates.to && date < disabledDates.to) {
      return true
    }
    if (
      typeof disabledDates.from !== 'undefined'
      && disabledDates.from
      && date > disabledDates.from
    ) {
      return true
    }
    return false
  };

  var checkDateRange = function (date, disabledDates) {
    if (typeof disabledDates.ranges !== 'undefined' && disabledDates.ranges.length) {
      var ranges = disabledDates.ranges;
      for (var i = 0; i < ranges.length; i += 1) {
        var range = ranges[i];
        if (
          typeof range.from !== 'undefined'
          && range.from
          && typeof range.to !== 'undefined'
          && range.to
        ) {
          if (date < range.to && date > range.from) {
            return true
          }
        }
      }
    }
    return false
  };

  /**
   * Checks if the given date should be disabled according to the specified config
   * @param {Date} date
   * @param {Object} disabledDates
   * @param {DateUtils} utils
   * @return {Boolean}
   */
  var isDateDisabled = function (date, disabledDates, utils) {
    // skip if no config
    if (typeof disabledDates === 'undefined') {
      return false
    }

    // check specific dates
    if (checkDateSpecific(date, disabledDates, utils)) {
      return true
    }

    if (checkDateDisabledFromTo(date, disabledDates)) {
      return true
    }

    // check date ranges
    if (checkDateRange(date, disabledDates)) {
      return true
    }

    if (
      typeof disabledDates.days !== 'undefined'
      && disabledDates.days.indexOf(utils.getDay(date)) !== -1
    ) {
      return true
    }
    if (
      typeof disabledDates.daysOfMonth !== 'undefined'
      && disabledDates.daysOfMonth.indexOf(utils.getDate(date)) !== -1
    ) {
      return true
    }
    if (
      typeof disabledDates.customPredictor === 'function'
      && disabledDates.customPredictor(date)
    ) {
      return true
    }

    return false
  };

  /**
   * Checks if the given month should be disabled according to the specified config
   * @param {Date} date
   * @param {Object} disabledDates
   * @param {DateUtils} utils
   * @return {Boolean}
   */
  var isMonthDisabled = function (date, disabledDates, utils) {
    // skip if no config
    if (typeof disabledDates === 'undefined') {
      return false
    }

    // check if the whole month is disabled before checking every individual days
    if (typeof disabledDates.to !== 'undefined' && disabledDates.to) {
      if (
        (
          utils.getMonth(date) < utils.getMonth(disabledDates.to)
          && utils.getFullYear(date) <= utils.getFullYear(disabledDates.to)
        )
        || utils.getFullYear(date) < utils.getFullYear(disabledDates.to)
      ) {
        return true
      }
    }
    if (typeof disabledDates.from !== 'undefined' && disabledDates.from) {
      if (
        (
          utils.getMonth(date) > utils.getMonth(disabledDates.from)
          && utils.getFullYear(date) >= utils.getFullYear(disabledDates.from)
        )
        || utils.getFullYear(date) > utils.getFullYear(disabledDates.from)
      ) {
        return true
      }
    }

    // now we have to check every days of the month
    var daysInMonth = utils.daysInMonth(utils.getFullYear(date), utils.getMonth(date));
    for (var j = 1; j <= daysInMonth; j += 1) {
      var dayDate = new Date(date);
      dayDate.setDate(j);
      // if at least one day of this month is NOT disabled,
      // we can conclude that this month SHOULD be selectable
      if (!isDateDisabled(dayDate, disabledDates, utils)) {
        return false
      }
    }
    return true
  };

  /**
   * Checks if the given year should be disabled according to the specified config
   * @param {Date} date
   * @param {Object} disabledDates
   * @param {DateUtils} utils
   * @return {Boolean}
   */
  var isYearDisabled = function (date, disabledDates, utils) {
    // skip if no config
    if (typeof disabledDates === 'undefined' || !disabledDates) {
      return false
    }

    // check if the whole year is disabled before checking every individual months
    if (typeof disabledDates.to !== 'undefined' && disabledDates.to) {
      if (utils.getFullYear(date) < utils.getFullYear(disabledDates.to)) {
        return true
      }
    }
    if (typeof disabledDates.from !== 'undefined' && disabledDates.from) {
      if (utils.getFullYear(date) > utils.getFullYear(disabledDates.from)) {
        return true
      }
    }

    // now we have to check every months of the year
    for (var j = 0; j < 12; j += 1) {
      var monthDate = new Date(date);
      monthDate.setMonth(j);
      // if at least one month of this year is NOT disabled,
      // we can conclude that this year SHOULD be selectable
      if (!isMonthDisabled(monthDate, disabledDates, utils)) {
        return false
      }
    }
    return true
  };

  var script$4 = {
    name: 'DatepickerDayView',
    mixins: [
      script$3 ],
    props: {
      fullMonthName: {
        type: Boolean,
        default: false,
      },
      dayCellContent: {
        type: Function,
        default: function (day) { return day.date; },
      },
      highlighted: {
        type: Object,
        default: function default$1 () {
          return {}
        },
      },
      mondayFirst: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['selected-disabled', 'select-date', 'changed-month'],
    computed: {
      /**
       * Returns an array of day names
       * @return {String[]}
       */
      daysOfWeek: function daysOfWeek () {
        if (this.mondayFirst) {
          var tempDays = this.translation.days.slice();
          tempDays.push(tempDays.shift());
          return tempDays
        }
        return this.translation.days
      },
      /**
       * Returns the day number of the week less one for the first of the current month
       * Used to show amount of empty cells before the first in the day calendar layout
       * @return {Number}
       */
      blankDays: function blankDays () {
        var d = this.pageDate;
        var dObj = this.useUtc
          ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
          : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
        if (this.mondayFirst) {
          return this.utils.getDay(dObj) > 0 ? this.utils.getDay(dObj) - 1 : 6
        }
        return this.utils.getDay(dObj)
      },
      /**
       * Set an object with all days inside the month
       * @return {Object[]}
       */
      days: function days () {
        var d = this.pageDate;
        var days = [];
        // set up a new date object to the beginning of the current 'page'
        var dObj = this.useUtc
          ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
          : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
        var daysInMonth = this.utils.daysInMonth(
          this.utils.getFullYear(dObj), this.utils.getMonth(dObj)
        );
        for (var i = 0; i < daysInMonth; i += 1) {
          days.push({
            date: this.utils.getDate(dObj),
            timestamp: dObj.getTime(),
            isSelected: this.isSelectedDate(dObj),
            isDisabled: this.isDisabledDate(dObj),
            isHighlighted: this.isHighlightedDate(dObj),
            isHighlightStart: this.isHighlightStart(dObj),
            isHighlightEnd: this.isHighlightEnd(dObj),
            isToday: this.utils.compareDates(dObj, new Date()),
            isWeekend: this.utils.getDay(dObj) === 0 || this.utils.getDay(dObj) === 6,
            isSaturday: this.utils.getDay(dObj) === 6,
            isSunday: this.utils.getDay(dObj) === 0,
          });
          this.utils.setDate(dObj, this.utils.getDate(dObj) + 1);
        }
        return days
      },
      /**
       * Gets the name of the month the current page is on
       * @return {String}
       */
      currMonthName: function currMonthName () {
        var monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr;
        return this.utils.getMonthNameAbbr(this.utils.getMonth(this.pageDate), monthName)
      },
      /**
       * Gets the name of the year that current page is on
       * @return {Number}
       */
      currYearName: function currYearName () {
        var ref = this.translation;
        var yearSuffix = ref.yearSuffix;
        return ("" + (this.utils.getFullYear(this.pageDate)) + yearSuffix)
      },
      /**
       * Is this translation using year/month/day format?
       * @return {Boolean}
       */
      isYmd: function isYmd () {
        return this.translation.ymd && this.translation.ymd === true
      },
    },
    methods: {
      /**
       * Emits a selectDate event
       * @param {Object} date
       */
      selectDate: function selectDate (date) {
        if (date.isDisabled) {
          this.$emit('selected-disabled', date);
          return false
        }
        this.$emit('select-date', date);
        return true
      },
      /**
       * @return {Number}
       */
      getPageMonth: function getPageMonth () {
        return this.utils.getMonth(this.pageDate)
      },
      /**
       * Change the page month
       * @param {Number} incrementBy
       */
      changeMonth: function changeMonth (incrementBy) {
        var date = this.pageDate;
        this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy);
        this.$emit('changed-month', date);
      },
      /**
       * Decrement the page month
       */
      previousMonth: function previousMonth () {
        if (!this.isPreviousDisabled()) {
          this.changeMonth(-1);
        }
      },
      /**
       * Is the previous month disabled?
       * @return {Boolean}
       */
      isPreviousDisabled: function isPreviousDisabled () {
        if (!this.disabledDates || !this.disabledDates.to) {
          return false
        }
        var d = this.pageDate;
        return this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d)
          && this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(d)
      },
      /**
       * Increment the current page month
       */
      nextMonth: function nextMonth () {
        if (!this.isNextDisabled()) {
          this.changeMonth(+1);
        }
      },
      /**
       * Is the next month disabled?
       * @return {Boolean}
       */
      isNextDisabled: function isNextDisabled () {
        if (!this.disabledDates || !this.disabledDates.from) {
          return false
        }
        var d = this.pageDate;
        return this.utils.getMonth(this.disabledDates.from) <= this.utils.getMonth(d)
          && this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(d)
      },
      /**
       * Whether a day is selected
       * @param {Date} dObj to check if selected
       * @return {Boolean}
       */
      isSelectedDate: function isSelectedDate (dObj) {
        return this.selectedDate && this.utils.compareDates(this.selectedDate, dObj)
      },
      /**
       * Whether a day is disabled
       * @param {Date} date to check if disabled
       * @return {Boolean}
       */
      isDisabledDate: function isDisabledDate (date) {
        return isDateDisabled(date, this.disabledDates, this.utils)
      },
      /**
       * Whether a day is highlighted
       * (only if it is not disabled already except when highlighted.includeDisabled is true)
       * @param {Date} date to check if highlighted
       * @return {Boolean}
       */
      isHighlightedDate: function isHighlightedDate (date) {
        var this$1 = this;

        var dateWithoutTime = this.utils.resetDateTime(date);
        if (
          !(this.highlighted && this.highlighted.includeDisabled)
          && this.isDisabledDate(dateWithoutTime)
        ) {
          return false
        }

        var highlighted = false;

        if (typeof this.highlighted === 'undefined') {
          return false
        }

        if (typeof this.highlighted.dates !== 'undefined') {
          this.highlighted.dates.forEach(function (d) {
            if (this$1.utils.compareDates(dateWithoutTime, d)) {
              highlighted = true;
            }
          });
        }

        if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
          highlighted = dateWithoutTime >= this.highlighted.from
            && dateWithoutTime <= this.highlighted.to;
        }

        if (
          typeof this.highlighted.days !== 'undefined'
          && this.highlighted.days.indexOf(this.utils.getDay(dateWithoutTime)) !== -1
        ) {
          highlighted = true;
        }

        if (
          typeof this.highlighted.daysOfMonth !== 'undefined'
          && this.highlighted.daysOfMonth.indexOf(this.utils.getDate(dateWithoutTime)) !== -1
        ) {
          highlighted = true;
        }

        if (
          typeof this.highlighted.customPredictor === 'function'
          && this.highlighted.customPredictor(dateWithoutTime)
        ) {
          highlighted = true;
        }

        return highlighted
      },
      /**
       * set the class for a specific day
       * @param {Object} day
       * @return {Object}
       */
      dayClasses: function dayClasses (day) {
        return {
          selected: day.isSelected,
          disabled: day.isDisabled,
          highlighted: day.isHighlighted,
          today: day.isToday,
          weekend: day.isWeekend,
          sat: day.isSaturday,
          sun: day.isSunday,
          'highlight-start': day.isHighlightStart,
          'highlight-end': day.isHighlightEnd,
        }
      },
      /**
       * Whether a day is highlighted and it is the first date
       * in the highlighted range of dates
       * @param {Date} date start highlight
       * @return {Boolean}
       */
      isHighlightStart: function isHighlightStart (date) {
        return this.isHighlightedDate(date)
          && (this.highlighted.from instanceof Date)
          && (this.utils.getFullYear(this.highlighted.from) === this.utils.getFullYear(date))
          && (this.utils.getMonth(this.highlighted.from) === this.utils.getMonth(date))
          && (this.utils.getDate(this.highlighted.from) === this.utils.getDate(date))
      },
      /**
       * Whether a day is highlighted and it is the first date
       * in the highlighted range of dates
       * @param {Date} date end highlight
       * @return {Boolean}
       */
      isHighlightEnd: function isHighlightEnd (date) {
        return this.isHighlightedDate(date)
          && (this.highlighted.to instanceof Date)
          && (this.utils.getFullYear(this.highlighted.to) === this.utils.getFullYear(date))
          && (this.utils.getMonth(this.highlighted.to) === this.utils.getMonth(date))
          && (this.utils.getDate(this.highlighted.to) === this.utils.getDate(date))
      },
      /**
       * Helper
       * @param  {all}  prop
       * @return {Boolean}
       */
      isDefined: function isDefined (prop) {
        return typeof prop !== 'undefined' && prop
      },
    },
  };

  var _hoisted_1$2 = { class: "picker-view" };

  function render$4(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_PickerHeader = vue.resolveComponent("PickerHeader");

    return (vue.openBlock(), vue.createBlock("div", _hoisted_1$2, [
      vue.renderSlot(_ctx.$slots, "beforeCalendarHeaderDay"),
      vue.createVNode(_component_PickerHeader, {
        config: _ctx.headerConfig,
        next: $options.nextMonth,
        previous: $options.previousMonth
      }, {
        headerContent: vue.withCtx(function () { return [
          vue.createVNode("span", {
            class: [_ctx.allowedToShowView('month') ? 'up' : '', "day__month_btn"],
            onClick: _cache[1] || (_cache[1] = function ($event) { return (_ctx.showPickerCalendar('month')); })
          }, vue.toDisplayString($options.isYmd ? $options.currYearName : $options.currMonthName) + " " + vue.toDisplayString($options.isYmd ? $options.currMonthName : $options.currYearName), 3 /* TEXT, CLASS */)
        ]; }),
        nextIntervalBtn: vue.withCtx(function () { return [
          vue.renderSlot(_ctx.$slots, "nextIntervalBtn")
        ]; }),
        prevIntervalBtn: vue.withCtx(function () { return [
          vue.renderSlot(_ctx.$slots, "prevIntervalBtn")
        ]; }),
        _: 1
      }, 8 /* PROPS */, ["config", "next", "previous"]),
      vue.createVNode("div", {
        class: _ctx.isRtl ? 'flex-rtl' : ''
      }, [
        (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.daysOfWeek, function (d) {
          return (vue.openBlock(), vue.createBlock("span", {
            key: d.timestamp,
            class: "cell day-header"
          }, vue.toDisplayString(d), 1 /* TEXT */))
        }), 128 /* KEYED_FRAGMENT */)),
        ($options.blankDays > 0)
          ? (vue.openBlock(true), vue.createBlock(vue.Fragment, { key: 0 }, vue.renderList($options.blankDays, function (d) {
              return (vue.openBlock(), vue.createBlock("span", {
                key: d.timestamp,
                class: "cell day blank"
              }))
            }), 128 /* KEYED_FRAGMENT */))
          : vue.createCommentVNode("v-if", true),
        (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.days, function (day) {
          return (vue.openBlock(), vue.createBlock("span", {
            key: day.timestamp,
            class: [$options.dayClasses(day), "cell day"],
            onClick: function ($event) { return ($options.selectDate(day)); },
            innerHTML: $props.dayCellContent(day)
          }, null, 10 /* CLASS, PROPS */, ["onClick", "innerHTML"]))
        }), 128 /* KEYED_FRAGMENT */))
      ], 2 /* CLASS */),
      vue.renderSlot(_ctx.$slots, "calendarFooterDay")
    ]))
  }

  script$4.render = render$4;
  script$4.__file = "src/components/PickerDay.vue";

  var script$5 = {
    name: 'DatepickerMonthView',
    mixins: [
      script$3 ],
    emits: ['select-month', 'changed-year'],
    computed: {
      /**
       * set an object with all months
       * @return {Object[]}
       */
      months: function months () {
        var d = this.pageDate;
        var months = [];
        // set up a new date object to the beginning of the current 'page'
        var dObj = this.useUtc
          ? new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate()))
          : new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes());
        for (var i = 0; i < 12; i += 1) {
          months.push({
            month: this.utils.getMonthName(i, this.translation.months),
            timestamp: dObj.getTime(),
            isSelected: this.isSelectedMonth(dObj),
            isDisabled: this.isDisabledMonth(dObj),
          });
          this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1);
        }
        return months
      },
      /**
       * Get year name on current page.
       * @return {String}
       */
      pageYearName: function pageYearName () {
        var ref = this.translation;
        var yearSuffix = ref.yearSuffix;
        return ("" + (this.utils.getFullYear(this.pageDate)) + yearSuffix)
      },
    },
    methods: {
      /**
       * Emits a selectMonth event
       * @param {Object} month
       */
      selectMonth: function selectMonth (month) {
        if (!month.isDisabled) {
          this.$emit('select-month', month);
          return true
        }
        return false
      },
      /**
       * Changes the year up or down
       * @param {Number} incrementBy
       */
      changeYear: function changeYear (incrementBy) {
        var date = this.pageDate;
        this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy);
        this.$emit('changed-year', date);
      },
      /**
       * Decrements the year
       */
      previousYear: function previousYear () {
        if (!this.isPreviousDisabled()) {
          this.changeYear(-1);
        }
      },
      /**
       * Checks if the previous year is disabled or not
       * @return {Boolean}
       */
      isPreviousDisabled: function isPreviousDisabled () {
        if (!this.disabledDates || !this.disabledDates.to) {
          return false
        }
        return this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(this.pageDate)
      },
      /**
       * Increments the year
       */
      nextYear: function nextYear () {
        if (!this.isNextDisabled()) {
          this.changeYear(1);
        }
      },
      /**
       * Checks if the next year is disabled or not
       * @return {Boolean}
       */
      isNextDisabled: function isNextDisabled () {
        if (!this.disabledDates || !this.disabledDates.from) {
          return false
        }
        return this.utils.getFullYear(
          this.disabledDates.from
        ) <= this.utils.getFullYear(this.pageDate)
      },
      /**
       * Whether the selected date is in this month
       * @param {Date}
       * @return {Boolean}
       */
      isSelectedMonth: function isSelectedMonth (date) {
        return (this.selectedDate
          && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date)
          && this.utils.getMonth(this.selectedDate) === this.utils.getMonth(date))
      },
      /**
       * Whether a month is disabled
       * @param {Date}
       * @return {Boolean}
       */
      isDisabledMonth: function isDisabledMonth (date) {
        return isMonthDisabled(date, this.disabledDates, this.utils)
      },
    },
  };

  var _hoisted_1$3 = { class: "picker-view" };

  function render$5(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_PickerHeader = vue.resolveComponent("PickerHeader");

    return (vue.openBlock(), vue.createBlock("div", _hoisted_1$3, [
      vue.renderSlot(_ctx.$slots, "beforeCalendarHeaderMonth"),
      vue.createVNode(_component_PickerHeader, {
        config: _ctx.headerConfig,
        next: $options.nextYear,
        previous: $options.previousYear
      }, {
        headerContent: vue.withCtx(function () { return [
          vue.createVNode("span", {
            class: [_ctx.allowedToShowView('year') ? 'up' : '', "month__year_btn"],
            onClick: _cache[1] || (_cache[1] = function ($event) { return (_ctx.showPickerCalendar('year')); })
          }, vue.toDisplayString($options.pageYearName), 3 /* TEXT, CLASS */)
        ]; }),
        nextIntervalBtn: vue.withCtx(function () { return [
          vue.renderSlot(_ctx.$slots, "nextIntervalBtn")
        ]; }),
        prevIntervalBtn: vue.withCtx(function () { return [
          vue.renderSlot(_ctx.$slots, "prevIntervalBtn")
        ]; }),
        _: 1
      }, 8 /* PROPS */, ["config", "next", "previous"]),
      (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.months, function (month) {
        return (vue.openBlock(), vue.createBlock("span", {
          key: month.timestamp,
          class: [{'selected': month.isSelected, 'disabled': month.isDisabled}, "cell month"],
          onClick: vue.withModifiers(function ($event) { return ($options.selectMonth(month)); }, ["stop"])
        }, vue.toDisplayString(month.month), 11 /* TEXT, CLASS, PROPS */, ["onClick"]))
      }), 128 /* KEYED_FRAGMENT */)),
      vue.renderSlot(_ctx.$slots, "calendarFooterMonth")
    ]))
  }

  script$5.render = render$5;
  script$5.__file = "src/components/PickerMonth.vue";

  var script$6 = {
    name: 'DatepickerYearView',
    mixins: [
      script$3 ],
    emits: ['select-year', 'changed-decade'],
    computed: {
      /**
       * set an object with years for a decade
       * @return {Object[]}
       */
      years: function years () {
        var d = this.pageDate;
        var years = [];
        // set up a new date object to the beginning of the current 'page'7
        var dObj = this.useUtc
          ? new Date(
            Date.UTC(Math.floor(d.getUTCFullYear() / 10) * 10, d.getUTCMonth(), d.getUTCDate())
          )
          : new Date(
            Math.floor(
              d.getFullYear() / 10
            ) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()
          );
        for (var i = 0; i < 10; i += 1) {
          years.push({
            year: this.utils.getFullYear(dObj),
            timestamp: dObj.getTime(),
            isSelected: this.isSelectedYear(dObj),
            isDisabled: this.isDisabledYear(dObj),
          });
          this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1);
        }
        return years
      },
      /**
       * Get decade name on current page.
       * @return {String}
       */
      getPageDecade: function getPageDecade () {
        var decadeStart = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10;
        var decadeEnd = decadeStart + 9;
        var ref = this.translation;
        var yearSuffix = ref.yearSuffix;
        return (decadeStart + " - " + decadeEnd + yearSuffix)
      },
    },
    methods: {
      /**
       * Emits a selectYear event
       * @param {Object} year
       */
      selectYear: function selectYear (year) {
        if (!year.isDisabled) {
          this.$emit('select-year', year);
          return true
        }
        return false
      },
      /**
       * Changes the year up or down
       * @param {Number} incrementBy
       */
      changeYear: function changeYear (incrementBy) {
        var date = this.pageDate;
        this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy);
        this.$emit('changed-decade', date);
      },
      /**
       * Decrements the decade
       */
      previousDecade: function previousDecade () {
        if (!this.isPreviousDisabled()) {
          this.changeYear(-10);
          return true
        }
        return false
      },
      /**
       * Checks if the next year is disabled or not
       * @return {Boolean}
       */
      isPreviousDisabled: function isPreviousDisabled () {
        if (!this.disabledDates || !this.disabledDates.to) {
          return false
        }
        return Math.floor(this.utils.getFullYear(this.disabledDates.to) / 10) * 10
          >= Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10
      },
      /**
       * Increments the decade
       */
      nextDecade: function nextDecade () {
        if (!this.isNextDisabled()) {
          this.changeYear(10);
          return true
        }
        return false
      },
      /**
       * Checks if the next decade is disabled or not
       * @return {Boolean}
       */
      isNextDisabled: function isNextDisabled () {
        if (!this.disabledDates || !this.disabledDates.from) {
          return false
        }
        return Math.ceil(this.utils.getFullYear(this.disabledDates.from) / 10) * 10
          <= Math.ceil(this.utils.getFullYear(this.pageDate) / 10) * 10
      },

      /**
       * Whether the selected date is in this year
       * @param {Date} date
       * @return {Boolean}
       */
      isSelectedYear: function isSelectedYear (date) {
        return this.selectedDate
          && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date)
      },
      /**
       * Whether a year is disabled
       * @param {Date} date
       * @return {Boolean}
       */
      isDisabledYear: function isDisabledYear (date) {
        return isYearDisabled(date, this.disabledDates, this.utils)
      },
    },
  };

  var _hoisted_1$4 = { class: "picker-view" };

  function render$6(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_PickerHeader = vue.resolveComponent("PickerHeader");

    return (vue.openBlock(), vue.createBlock("div", _hoisted_1$4, [
      vue.renderSlot(_ctx.$slots, "beforeCalendarHeaderYear"),
      vue.createVNode(_component_PickerHeader, {
        config: _ctx.headerConfig,
        next: $options.nextDecade,
        previous: $options.previousDecade
      }, {
        headerContent: vue.withCtx(function () { return [
          vue.createVNode("span", null, vue.toDisplayString($options.getPageDecade), 1 /* TEXT */)
        ]; }),
        nextIntervalBtn: vue.withCtx(function () { return [
          vue.renderSlot(_ctx.$slots, "nextIntervalBtn")
        ]; }),
        prevIntervalBtn: vue.withCtx(function () { return [
          vue.renderSlot(_ctx.$slots, "prevIntervalBtn")
        ]; }),
        _: 1
      }, 8 /* PROPS */, ["config", "next", "previous"]),
      (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.years, function (year) {
        return (vue.openBlock(), vue.createBlock("span", {
          key: year.timestamp,
          class: [{ 'selected': year.isSelected, 'disabled': year.isDisabled }, "cell year"],
          onClick: vue.withModifiers(function ($event) { return ($options.selectYear(year)); }, ["stop"])
        }, vue.toDisplayString(year.year), 11 /* TEXT, CLASS, PROPS */, ["onClick"]))
      }), 128 /* KEYED_FRAGMENT */)),
      vue.renderSlot(_ctx.$slots, "calendarFooterYear")
    ]))
  }

  script$6.render = render$6;
  script$6.__file = "src/components/PickerYear.vue";

  var script$7 = {
    name: 'Datepicker',
    components: {
      DateInput: script$1,
      PickerDay: script$4,
      PickerMonth: script$5,
      PickerYear: script$6,
    },
    mixins: [
      script ],
    props: {
      calendarClass: {
        type: [
          String,
          Object,
          Array ],
        default: '',
      },
      dayCellContent: {
        type: Function,
        default: function (day) { return day.date; },
      },
      disabledDates: {
        type: Object,
        default: function default$1 () {
          return {}
        },
      },
      fixedPosition: {
        type: String,
        default: '',
        validator: function (val) { return val === ''
          || val === 'bottom'
          || val === 'bottom-left'
          || val === 'bottom-right'
          || val === 'top'
          || val === 'top-left'
          || val === 'top-right'; },
      },
      fullMonthName: {
        type: Boolean,
        default: false,
      },
      highlighted: {
        type: Object,
        default: function default$2 () {
          return {}
        },
      },
      initialView: {
        type: String,
        default: '',
      },
      language: {
        type: Object,
        default: function () { return en; },
      },
      maximumView: {
        type: String,
        default: 'year',
      },
      minimumView: {
        type: String,
        default: 'day',
      },
      mondayFirst: {
        type: Boolean,
        default: false,
      },
      showHeader: {
        type: Boolean,
        default: true,
      },
      value: {
        type: [
          String,
          Date,
          Number ],
        default: '',
        validator:
          function (val) { return val === null
            || val instanceof Date
            || typeof val === 'string'
            || typeof val === 'number'; },
      },
      wrapperClass: {
        type: [
          String,
          Object,
          Array ],
        default: '',
      },
    },
    emits: ['opened', 'selected', 'update:modelValue', 'selected', 'input', 'cleared', 'selected-disabled', 'changed-month', 'changed-year', 'closed', 'blur', 'focus'],
    data: function data () {
      // const startDate = this.openDate ? new Date(this.openDate) : new Date()
      var constructedDateUtils = makeDateUtils(this.useUtc);
      var startDate;
      if (this.openDate) {
        startDate = constructedDateUtils.getNewDateObject(this.openDate);
      } else {
        startDate = constructedDateUtils.getNewDateObject();
      }
      var pageTimestamp = constructedDateUtils.setDate(startDate, 1);
      return {
        /*
         * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
         * This represents the first day of the current viewing month
         * {Number}
         */
        pageTimestamp: pageTimestamp,
        currentPicker: '',
        /*
         * Selected Date
         * {Date}
         */
        selectedDate: null,
        /*
         * Positioning
         */
        calendarHeight: 0,
        resetTypedDate: constructedDateUtils.getNewDateObject(),
        utils: constructedDateUtils,
      }
    },
    computed: {
      computedInitialView: function computedInitialView () {
        if (!this.initialView) {
          return this.minimumView
        }

        return this.initialView
      },
      pageDate: function pageDate () {
        return new Date(this.pageTimestamp)
      },

      translation: function translation () {
        return this.language
      },

      isOpen: function isOpen () {
        return this.currentPicker !== ''
      },
      isInline: function isInline () {
        return !!this.inline
      },
      isRtl: function isRtl () {
        return this.translation.rtl === true
      },
    },
    watch: {
      value: function value (value$1) {
        this.setValue(value$1);
      },
      openDate: function openDate () {
        this.setPageDate();
      },
      initialView: function initialView () {
        this.setInitialView();
      },
    },
    mounted: function mounted () {
      this.init();
    },
    methods: {
      setPickerPosition: function setPickerPosition () {
        var this$1 = this;

        this.$nextTick(function () {
          var calendar = this$1.$refs.datepicker;
          if (calendar) {
            if (this$1.currentPicker) {
              var parent = calendar.parentElement;
              var calendarBounding = calendar.getBoundingClientRect();
              var outOfBoundsRight = calendarBounding.right > window.innerWidth;
              var outOfBoundsBottom = calendarBounding.bottom > window.innerHeight;
              var parentHeight = (parent.getBoundingClientRect().height) + "px";

              if (this$1.fixedPosition === '') {
                if (outOfBoundsRight) {
                  calendar.style.right = 0;
                } else {
                  calendar.style.right = 'unset';
                }

                if (outOfBoundsBottom) {
                  calendar.style.bottom = parentHeight;
                } else {
                  calendar.style.bottom = 'unset';
                }
              } else {
                if (this$1.fixedPosition.indexOf('right') !== -1) {
                  calendar.style.right = 0;
                } else {
                  calendar.style.right = 'unset';
                }
                if (this$1.fixedPosition.indexOf('top') !== -1) {
                  calendar.style.bottom = parentHeight;
                } else {
                  calendar.style.bottom = 'unset';
                }
              }
            } else {
              calendar.style.right = 'unset';
              calendar.style.bottom = 'unset';
            }
          }
        });
      },
      /**
       * Called in the event that the user navigates to date pages and
       * closes the picker without selecting a date.
       */
      resetDefaultPageDate: function resetDefaultPageDate () {
        if (this.selectedDate === null) {
          this.setPageDate();
          return
        }
        this.setPageDate(this.selectedDate);
      },
      /**
       * Effectively a toggle to show/hide the calendar
       * @return {mixed}
       */
      showCalendar: function showCalendar () {
        if (this.disabled || this.isInline) {
          return false
        }
        if (this.isOpen) {
          return this.close(true)
        }
        this.setInitialView();
        if (!this.isInline) {
          this.setPickerPosition();
          this.$emit('opened');
        }
        return true
      },
      /**
       * Sets the initial picker page view: day, month or year
       */
      setInitialView: function setInitialView () {
        var initialView = this.computedInitialView;
        if (!this.allowedToShowView(initialView)) {
          throw new Error(("initialView '" + (this.initialView) + "' cannot be rendered based on minimum '" + (this.minimumView) + "' and maximum '" + (this.maximumView) + "'"))
        }
        switch (initialView) {
          case 'year':
            this.showSpecificCalendar('Year');
            break
          case 'month':
            this.showSpecificCalendar('Month');
            break
          default:
            this.showSpecificCalendar('Day');
            break
        }
      },
      /**
       * Are we allowed to show a specific picker view?
       * @param {String} view
       * @return {Boolean}
       */
      allowedToShowView: function allowedToShowView (view) {
        var views = [
          'day',
          'month',
          'year' ];
        var minimumViewIndex = views.indexOf(this.minimumView);
        var maximumViewIndex = views.indexOf(this.maximumView);
        var viewIndex = views.indexOf(view);

        return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex
      },
      /**
       * Show a specific picker
       * @return {Boolean}
       */
      showSpecificCalendar: function showSpecificCalendar (type) {
        if (type) {
          if (!this.allowedToShowView(type.toLowerCase())) {
            return false
          }
          this.close();
          this.currentPicker = "Picker" + type;
          return true
        }
        this.currentPicker = '';
        return false
      },
      /**
       * Set the selected date
       * @param {Number} timestamp
       */
      setDate: function setDate (timestamp) {
        var date = new Date(timestamp);
        this.selectedDate = date;
        this.setPageDate(date);
        this.$emit('selected', date);
        this.$emit('update:modelValue', date);
      },
      /**
       * Clear the selected date
       */
      clearDate: function clearDate () {
        this.selectedDate = null;
        this.setPageDate();
        this.$emit('selected', null);
        this.$emit('update:modelValue', null);
        this.$emit('cleared');
      },
      /**
       * @param {Object} date
       */
      selectDate: function selectDate (date) {
        this.setDate(date.timestamp);
        if (!this.isInline) {
          this.close(true);
        }
        this.resetTypedDate = this.utils.getNewDateObject();
      },
      /**
       * @param {Object} date
       */
      selectDisabledDate: function selectDisabledDate (date) {
        this.$emit('selected-disabled', date);
      },
      /**
       * @param {Object} month
       */
      selectMonth: function selectMonth (month) {
        var date = new Date(month.timestamp);
        if (this.allowedToShowView('day')) {
          this.setPageDate(date);
          this.$emit('changed-month', month);
          this.showSpecificCalendar('Day');
        } else {
          this.selectDate(month);
        }
      },
      /**
       * @param {Object} year
       */
      selectYear: function selectYear (year) {
        var date = new Date(year.timestamp);
        if (this.allowedToShowView('month')) {
          this.setPageDate(date);
          this.$emit('changed-year', year);
          this.showSpecificCalendar('Month');
        } else {
          this.selectDate(year);
        }
      },
      /**
       * Set the datepicker value
       * @param {Date|String|Number|null} date
       */
      setValue: function setValue (date) {
        var dateTemp = date;
        if (typeof dateTemp === 'string' || typeof dateTemp === 'number') {
          var parsed = new Date(dateTemp);
          dateTemp = Number.isNaN(parsed.valueOf()) ? null : parsed;
        }
        if (!dateTemp) {
          this.setPageDate();
          this.selectedDate = null;
          return
        }
        this.selectedDate = dateTemp;
        this.setPageDate(dateTemp);
      },
      /**
       * Sets the date that the calendar should open on
       */
      setPageDate: function setPageDate (date) {
        var dateTemp = date;
        if (!dateTemp) {
          if (this.openDate) {
            dateTemp = new Date(this.openDate);
          } else {
            dateTemp = new Date();
          }
          dateTemp = this.utils.resetDateTime(dateTemp);
        }
        this.pageTimestamp = this.utils.setDate(new Date(dateTemp), 1);
      },
      /**
       * Handles a month change from the day picker
       */
      handleChangedMonthFromDayPicker: function handleChangedMonthFromDayPicker (date) {
        this.setPageDate(date);
        this.$emit('changed-month', date);
      },
      /**
       * Set the date from a typedDate event
       */
      setTypedDate: function setTypedDate (date) {
        this.setDate(date.getTime());
      },
      /**
       * Close all calendar layers
       * @param {Boolean} full - emit close event
       */
      close: function close (full) {
        if ( full === void 0 ) full = false;

        this.showSpecificCalendar();
        if (!this.isInline) {
          if (full) {
            this.$emit('closed');
          }
        }
      },
      /**
       * Initiate the component
       */
      init: function init () {
        if (this.value) {
          this.setValue(this.value);
        }
        if (this.isInline) {
          this.setInitialView();
        }
      },
      onBlur: function onBlur () {
        this.$emit('blur');
      },
      onFocus: function onFocus () {
        this.$emit('focus');
      },
    },
  };

  function render$7(_ctx, _cache, $props, $setup, $data, $options) {
    var _component_DateInput = vue.resolveComponent("DateInput");

    return (vue.openBlock(), vue.createBlock("div", {
      class: [[$props.wrapperClass, $options.isRtl ? 'rtl' : ''], "vdp-datepicker"]
    }, [
      vue.createVNode(_component_DateInput, {
        id: _ctx.id,
        "selected-date": $data.selectedDate,
        "reset-typed-date": $data.resetTypedDate,
        format: _ctx.format,
        parser: _ctx.parser,
        translation: $options.translation,
        inline: _ctx.inline,
        name: _ctx.name,
        "ref-name": _ctx.refName,
        "open-date": _ctx.openDate,
        placeholder: _ctx.placeholder,
        "input-class": _ctx.inputClass,
        typeable: _ctx.typeable,
        "clear-button": _ctx.clearButton,
        "clear-button-icon": _ctx.clearButtonIcon,
        "calendar-button": _ctx.calendarButton,
        "calendar-button-icon": _ctx.calendarButtonIcon,
        "calendar-button-icon-content": _ctx.calendarButtonIconContent,
        disabled: _ctx.disabled,
        required: _ctx.required,
        autofocus: _ctx.autofocus,
        maxlength: _ctx.maxlength,
        pattern: _ctx.pattern,
        "bootstrap-styling": _ctx.bootstrapStyling,
        "use-utc": _ctx.useUtc,
        "show-calendar-on-focus": _ctx.showCalendarOnFocus,
        tabindex: _ctx.tabindex,
        "show-calendar-on-button-click": _ctx.showCalendarOnButtonClick,
        "onShow-calendar": $options.showCalendar,
        "onClose-calendar": _cache[1] || (_cache[1] = function ($event) { return ($options.close(true)); }),
        "onTyped-date": $options.setTypedDate,
        "onClear-date": $options.clearDate,
        onBlur: $options.onBlur,
        onFocus: $options.onFocus
      }, {
        beforeDateInput: vue.withCtx(function () { return [
          vue.renderSlot(_ctx.$slots, "beforeDateInput")
        ]; }),
        afterDateInput: vue.withCtx(function () { return [
          vue.renderSlot(_ctx.$slots, "afterDateInput")
        ]; }),
        _: 1
      }, 8 /* PROPS */, ["id", "selected-date", "reset-typed-date", "format", "parser", "translation", "inline", "name", "ref-name", "open-date", "placeholder", "input-class", "typeable", "clear-button", "clear-button-icon", "calendar-button", "calendar-button-icon", "calendar-button-icon-content", "disabled", "required", "autofocus", "maxlength", "pattern", "bootstrap-styling", "use-utc", "show-calendar-on-focus", "tabindex", "show-calendar-on-button-click", "onShow-calendar", "onTyped-date", "onClear-date", "onBlur", "onFocus"]),
      ($options.isOpen)
        ? (vue.openBlock(), vue.createBlock("div", {
            key: 0,
            ref: "datepicker",
            class: [$props.calendarClass, 'vdp-datepicker__calendar', $options.isInline && 'inline'],
            onMousedown: _cache[4] || (_cache[4] = vue.withModifiers(function () {}, ["prevent"]))
          }, [
            vue.renderSlot(_ctx.$slots, "beforeCalendarHeader"),
            (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($data.currentPicker), {
              "page-date": $options.pageDate,
              "selected-date": $data.selectedDate,
              "allowed-to-show-view": $options.allowedToShowView,
              "disabled-dates": $props.disabledDates,
              highlighted: $props.highlighted,
              translation: $options.translation,
              "page-timestamp": $data.pageTimestamp,
              "is-rtl": $options.isRtl,
              "use-utc": _ctx.useUtc,
              "show-header": $props.showHeader,
              "full-month-name": $props.fullMonthName,
              "monday-first": $props.mondayFirst,
              "day-cell-content": $props.dayCellContent,
              "onSelect-date": $options.selectDate,
              "onChanged-month": $options.handleChangedMonthFromDayPicker,
              "onSelected-disabled": $options.selectDisabledDate,
              "onSelect-month": $options.selectMonth,
              "onChanged-year": $options.setPageDate,
              "onShow-month-calendar": _cache[2] || (_cache[2] = function ($event) { return ($options.showSpecificCalendar('Month')); }),
              "onSelect-year": $options.selectYear,
              "onChanged-decade": $options.setPageDate,
              "onShow-year-calendar": _cache[3] || (_cache[3] = function ($event) { return ($options.showSpecificCalendar('Year')); })
            }, {
              beforeCalendarHeaderDay: vue.withCtx(function () { return [
                vue.renderSlot(_ctx.$slots, "beforeCalendarHeaderDay")
              ]; }),
              calendarFooterDay: vue.withCtx(function () { return [
                vue.renderSlot(_ctx.$slots, "calendarFooterDay")
              ]; }),
              beforeCalendarHeaderMonth: vue.withCtx(function () { return [
                vue.renderSlot(_ctx.$slots, "beforeCalendarHeaderMonth")
              ]; }),
              calendarFooterMonth: vue.withCtx(function () { return [
                vue.renderSlot(_ctx.$slots, "calendarFooterMonth")
              ]; }),
              beforeCalendarHeaderYear: vue.withCtx(function () { return [
                vue.renderSlot(_ctx.$slots, "beforeCalendarHeaderYear")
              ]; }),
              calendarFooterYear: vue.withCtx(function () { return [
                vue.renderSlot(_ctx.$slots, "calendarFooterYear")
              ]; }),
              nextIntervalBtn: vue.withCtx(function () { return [
                vue.renderSlot(_ctx.$slots, "nextIntervalBtn")
              ]; }),
              prevIntervalBtn: vue.withCtx(function () { return [
                vue.renderSlot(_ctx.$slots, "prevIntervalBtn")
              ]; }),
              _: 1
            }, 8 /* PROPS */, ["page-date", "selected-date", "allowed-to-show-view", "disabled-dates", "highlighted", "translation", "page-timestamp", "is-rtl", "use-utc", "show-header", "full-month-name", "monday-first", "day-cell-content", "onSelect-date", "onChanged-month", "onSelected-disabled", "onSelect-month", "onChanged-year", "onSelect-year", "onChanged-decade"])),
            vue.renderSlot(_ctx.$slots, "calendarFooter")
          ], 34 /* CLASS, HYDRATE_EVENTS */))
        : vue.createCommentVNode("v-if", true)
    ], 2 /* CLASS */))
  }

  script$7.render = render$7;
  script$7.__file = "src/components/Datepicker.vue";

  return script$7;

})));
