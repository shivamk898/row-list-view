// var flag = 0;
// function toggle(){
// if(flag==0){
//     $("#toggleDiv").text("row-view");
//     flag=1;
// }
// else if(flag==1){
//     $("#toggleDiv").text("list-view");
//     flag=0;
// }
// }


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

var UserView = Backbone.View.extend({
    mode: true,
    el: "#main-container", 
    template1: _.template($('#user-row-template').html()),
    template2:_.template($('#user-brick-template').html()),
    initialize: function(){        
    },
    events: {
        'click .list-view': 'myFunction',
        'click .row-view': 'myFunction2'
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

// $(".list-view").on("click", myFunction);
// function myFunction() {
//     users.fetch().then(function(){
//     userView.render().$el;});
//     $('.list-view').hide();
//     $('.row-view').show();
//     $(".row-view").on("click", myFunctions);
//     function myFunctions(){
//         $('.list-view').show();
//         $('.row-view').hide();  
//     }
// }