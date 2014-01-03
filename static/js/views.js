/*global app*/
/**
 * Talkilla Backbone views.
 */
(function(app, Backbone, _) {
  "use strict";

  /**
   * Base Talkilla view.
   */
  app.views.BaseView = Backbone.View.extend({
    // default dependencies (none)
    dependencies: {},

    /**
     * Constructs this view, checking and attaching required dependencies.
     *
     * @param {Object} options Options object
     */
    constructor: function(options) {
      options = options || {};

      if (Object.keys(this.dependencies).length > 0) {
        this._checkRequiredProperties(options);
        this._checkRequiredTypes(options);
      }

      Backbone.View.apply(this, arguments);
    },

    /**
     * Checks if any of an Object values matches any of current dependency type
     * requirements.
     * @param  {Object} object
     * @throws {TypeError}
     */
    _checkRequiredTypes: function(object) {
      Object.keys(this.dependencies || {}).forEach(function(name) {
        var types = this.dependencies[name];
        types = Array.isArray(types) ? types : [types];
        if (!this._dependencyMatchTypes(object[name], types)) {
          throw new TypeError(
            "invalid dependency: " + name + "; expected " +
            types.map(function(type) { return type && type.name; }).join(", "));
        }
        this[name] = object[name];
      }, this);
    },

    /**
     * Checks if an Object owns the required keys defined in dependencies.
     * @param  {Object} object
     * @throws {TypeError}
     */
    _checkRequiredProperties: function(object) {
      /*jshint eqnull:true*/
      var diff = _.difference(Object.keys(this.dependencies || {}),
                              Object.keys(object)
                  .filter(function(name) {
                    return object[name] != null;
                  }));
      if (diff.length > 0)
        throw new TypeError("missing required " + diff.join(", "));
    },

    /**
     * Checks if a given value matches any of the provided type requirements.
     * @param  {Object} value  The value to check
     * @param  {Array}  types  The list of types to check the value against
     * @return {Boolean}
     * @throws {TypeError} If the value doesn't match any types.
     */
    _dependencyMatchTypes: function(value, types) {
      return types.some(function(Type) {
        /*jshint eqeqeq:false*/
        return typeof Type === "undefined" ||       // skip checking
               value.constructor == Type   ||       // native types
               Type.prototype.isPrototypeOf(value); // custom types
      });
    }
  });

  /**
   * Base notification view.
   */
  app.views.NotificationView = app.views.BaseView.extend({
    template: _.template([
      '<div class="alert alert-<%= type %>">',
      '  <a class="close" data-dismiss="alert">&times;</a>',
      '  <%= message %>',
      '</div>'
    ].join('')),

    clear: function() {
      this.undelegateEvents();
      this.remove();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
})(app, Backbone, _);
