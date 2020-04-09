//Users
var User = Backbone.Model.extend({
    initialize: function(){
    }
});

var Users = Backbone.Collection.extend({
    model: User,  
    url: "https://restcountries.eu/rest/v2/all",

    initialize: function () {
        // Default sort field and direction
        this.sortField = "name";
        this.sortDirection = "ASC";
    },
 
    setSortField: function (field, direction) {
        this.sortField = field;
        this.sortDirection = direction;
    },
 
    comparator: function (m) {
        return m.get(this.sortField);
    },
 
    sortBy: function (iterator, context) {
        var obj = this.models,
            direction = this.sortDirection;
 
        return _.pluck(_.map(obj, function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iterator.call(context, value, index, list)
            };
        }).sort(function (left, right) {
            // swap a and b for reverse sort
            var a = direction === "ASC" ? left.criteria : right.criteria,
                b = direction === "ASC" ? right.criteria : left.criteria;
 
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index < right.index ? -1 : 1;
        }), 'value');
    }
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
    collection: users,
    el: "#main-container", 
    template1: _.template($('#user-row-template').html()),
    template2:_.template($('#user-brick-template').html()),
    initialize: function(){        
    },
    events: {
        'click .list-view': 'myFunction',
        'click .row-view': 'myFunction2',
        // "click .open": "onCardClick",
        'click #hide2':'delete',
    },
    delete: function(){
        var items = $('input:checked');
        items.closest('ul').remove();
    },
    // onCardClick: function(event){
    //     var detailsView = new DetailsView({
    //     });
    //     $('#new-container').empty();
    // },
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
            this.$el.html(this.template2({users: this.collection.toJSON()}));
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
        let data = this.template1({users: this.collection.toJSON()});
        this.$el.html(data);
        return this;
    }
});

var userView1 = new UserView1({collection: users});

$("#hide").click(function(){
    $(".new").hide();
    $("#hide").hide();
    $("#hide2").hide();
    $("#hide3").hide();
  });
  
  $("#show").click(function(){
    $(".new").show();
    $("#hide").show();
    $("#hide2").show();
    $("#hide3").show();
  });


$(".userview").on('click' , function(){
    console.log("inside users now");    
});

users.fetch().then(function(){
    userView.render();});

$(".byPopulation").on('click',function(){
    users.fetch().then(function(){
    users.setSortField("population", "DESC");
    users.sort();
    userView.render();});
    console.log('sort by population');
});

$(".byName").on('click',function(){
    users.fetch().then(function(){
        users.setSortField("name", "DESC");
        users.sort();
        userView.render();});
        console.log('sort by name');
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

// var DetailsView = Backbone.View.extend({
//     el: "#main-container",
//     events: {
//         "click #back": "onClickBack"
//     },
//     onClickBack: function(){
//         $('#main-container').empty();
//         $('#new-container').empty();
//         var view_list = new UserView();
//     },
//     template: _.template($("#country-template").html()),
//     initialize: function(){
//         this.render()
//     },
//     render: function(){
//         this.$el.html(
//            this.template()
//         );
//     }
// });

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

function sort_by(field, reverse, primer){
    var key = primer ?
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

// function sortList(){
//     if (event.target.id === 'yes') {
//         users.sort(sort_by('population', true, parseInt));
//         console.log("sort by population");
//     }
      
//     if (event.target.id === 'no') {
//         users.sort(sort_by('name', true))
//         console.log("sort by name");
//     }
// }

function checkAll(ele) {
     var checkboxes = document.getElementsByTagName('input');
     if (ele.checked) {
         for (var i = 0; i < checkboxes.length; i++) {
             if (checkboxes[i].type == 'checkbox') {
                 checkboxes[i].checked = true;
             }
         }
     } else {
         for (var i = 0; i < checkboxes.length; i++) {
             if (checkboxes[i].type == 'checkbox') {
                 checkboxes[i].checked = false;
             }
         }
     }
 }

$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) 
    var recipient = button.data('')
	var modal = $(this)
	modal.find('.modal-title').text('Add Country')
	modal.find('.modal-body input').val(recipient)
  });


   

