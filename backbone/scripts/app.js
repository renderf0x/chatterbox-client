//message model

var Message = Backbone.model.extend({
    url: 'https://api.parse.com/1/classes/chatterbox'
});

// collection of messages
var Messages = Backbone.collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox',

  loadShit: function(){
    this.fetch({data: {order: '-createdAt'}});
  },

  //parse

});

//form view; renders form template
var FormView = Backbone.view.extend({
  // var Bookmark = Backbone.View.extend({
  // template: _.template(...),
  // render: function() {
  //   this.$el.html(this.template(this.model.attributes));
  //   return this;
//   }
// });

  renderThisPage: function(el){

  }

})

//views for both message and collection
