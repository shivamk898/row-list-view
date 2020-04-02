//Users
var User = Backbone.Model.extend({
    initialize: function(){
    }
});

var Users = Backbone.Collection.extend({
    model: User, 
    url: "https://restcountries.eu/rest/v2/all"
});

var users = new Users();

var Country = Backbone.Model.extend({
	defaults: {
		name: '',
		capital: '',
		dialing: '',
		population:''
	}
});
var Countries = Backbone.Collection.extend({});
var countries = new Countries();

var UserView = Backbone.View.extend({
    mode: true,
    el: "#main-container", 
    template1: _.template($('#user-row-template').html()),
    template2:_.template($('#user-brick-template').html()),
    initialize: function(){        
    },
    events: {
        'click .list-view': 'myFunction',
        'click .row-view': 'myFunction2',
    },
	myFunction: function() {
        users.fetch().then(function(){
        userView.render().$el;});
		$('.list-view').hide();
        $('.row-view').show();
    },
    myFunction2: function(){
        users.fetch().then(function(){
            userView1.render().$el;});
            $('.list-view').show();
            $('.row-view').hide();  
    },
    render: function(){
        if(this.mode == true){
            this.$el.html(this.template2({users: this.collection.toJSON().filter((n,i)=>i<12)}));
        }
        else{
            this.$el.html(this.template1({users: this.collection.toJSON().filter((n,i)=>i<12)}));
        }
        var subView1 = new UserView({el: 'body'});
        var self = this;
		self.$el.append(this.subView1);
        return this;
        }
    });

var userView = new UserView({collection: users});

var UserView1 = Backbone.View.extend({
    el: "#main-container", 
    template1: _.template($('#user-row-template').html()),
    initialize: function(){        
    },
    render: function(){
        let data = this.template1({users: this.collection.toJSON().filter((n,i)=>i<10)});
        this.$el.html(data);
        return this;
    }
});

var userView1 = new UserView1({collection: users});
users.fetch().then(function(){
    userView.render().$el;});

$(".userview").on('click' , function(){
    console.log("inside users now");    
});

//
var CountryView = Backbone.View.extend({
	model: new Country(),
	initialize: function() {
		this.template = _.template($('.country-list-template').html());
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var CountriesView = Backbone.View.extend({
	collection: countries,
	el: "#new-container",
	initialize: function() {
		var self = this;
		this.collection.on('add', this.render, this);
	},
	render: function() {
		var self = this;
		this.$el.html('');
		_.each(this.collection.toArray(), function(country) {
			self.$el.append((new CountryView({model: country})).render().$el);
		});
		return this;
	}
});

var countriesView = new CountriesView();
countriesView.render();

$('.add-modal').on('click', function() {
    var validate = function() {
        if (
          $(".name-text").val().length > 0 &&
          $(".capital-text").val().length > 0 &&
          $(".dialing-text").val().length > 0 &&
          $(".population-text").val().length > 0
        ) {
          return true;
        }
        else{alert('Please fill all feilds')}
      };
    if (validate()) {
    var country = new Country({
        name : $('.name-text').val(),
        capital : $('.capital-text').val(),
        dialing : $('.dialing-text').val(),
        population : $('.population-text').val()
      });
      console.log(country.toJSON());
      countries.add(country);
      $("#exampleModal").modal("hide");
}
});

$('.modal').on('hide.bs.modal', function(){
    $('.name-text').val('');
    $('.capital-text').val('');
    $('.dialing-text').val('');
    $('.population-text').val('');
});

//
function search() { 
    let input = document.getElementById('searchbar').value 
    input=input.toLowerCase(); 
    let x = document.getElementsByClassName('list-group'); 
    for (i = 0; i < x.length; i++) {  
        if (!x[i].innerHTML.toLowerCase().includes(input)) { 
            x[i].style.display="none"; 
        } 
        else { 
            x[i].style.display="";                  
        } 
    } 
}

const sort_by = (field, reverse, primer) => {

    const key = primer ?
      function(x) {
        return primer(x[field])
      } :
      function(x) {
        return x[field]
      };
  
    reverse = !reverse ? 1 : -1;
  
    return function(a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

function sortList(){
    if (event.target.id === 'yes') {
        users.sort(sort_by('population', true, parseInt));
        console.log("sort by population");
    }
      
    if (event.target.id === 'no') {
        users.sort(sort_by('name', true))
        console.log("sort by name");
    }

}

$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) 
    var recipient = button.data('')
	var modal = $(this)
	modal.find('.modal-title').text('Stage Information')
	modal.find('.modal-body input').val(recipient)
  });


   

