//import { Template } from 'meteor/templating';
//import { ReactiveVar } from 'meteor/reactive-var';

//import './main.html';

Router.configure({
  
  template: 'noRoutesTemplate'

  // .
  // .
  // .
});

Router.route('/', {
    template: 'home'
});

PlayerList = new Mongo.Collection('players');
//UserAccounts = new Mongo.Collection('users');
var waiterId_00 = 'M5DBDy4vYCgToxtPd';

if(Meteor.isClient){
//code runs in the client only
    //console.log("hello world");
	//new Audio('sncf.mp3').play();

	//var sound = new Howl({
    //  urls: ['sncf.mp3']
    //});

    //sound.play();
	
	Meteor.subscribe('thePlayers');
	
	Template.leaderboard.helpers({
	    
		'player' : function(){ 
		    var currentUserId = Meteor.userId();
		    //return PlayerList.find({createdBy: currentUserId },
            //                       {sort: {score: -1, name: 1} });
			return PlayerList.find({},{sort: {score: -1, name: 1} });
		},
		
		'otherHelperFunction' : function(){
		    return "Some other function";
		},
		
		'singleItem' : function(){
		    return PlayerList.find().count();
		},
		
		'selectedClass': function(){
		    var PlayerId = this._id;
			var selectedPlayer = Session.get('selectedPlayer');
		    if(PlayerId == selectedPlayer){
			    return "selected";
			}	
			//return this._id;
		},
		
		'selectedPlayer' : function(){
		    var selectedPlayer = Session.get('selectedPlayer');
		    return PlayerList.findOne({_id: selectedPlayer});
		}
		
	});
	
	Template.leaderboard.events({
	
	    'click .player' : function(){
		    
			var playerId = this._id;
			
			//console.log("clicked something li");
			Session.set('selectedPlayer', playerId);
			//var selectedPlayer = Session.get('selectedPlayer');
			//console.log(selectedPlayer);
		},
        'dblclick .player':function(){
            console.log("doble clicked");	
		},
		
		'click .increment' : function(){
		    var selectedPlayer = Session.get('selectedPlayer');
		    //console.log(selectedPlayer);
			PlayerList.update({_id: selectedPlayer}, {$inc: {score: 5} });
		},
		
		'click .decrement' : function(){
		    var selectedPlayer = Session.get('selectedPlayer');
			PlayerList.update({_id: selectedPlayer}, {$inc: {score: -5} });
		},
		
		'click .remove' : function(){
		    var selectedPlayer = Session.get('selectedPlayer');
			PlayerList.remove({_id: selectedPlayer});
		},
		
		'click .clearCall' : function(){
		    PlayerList.update({_id: waiterId_00}, {$set: {status: 'no called'} });
		},
		
		'click .setCall' : function(){
		    PlayerList.update({_id: waiterId_00}, {$set: {status: 'called'} });
		},
		
		
	
	});
	
	Template.addPlayerForm.events({
	
	   
	
	   'submit form' : function(event){  
	        event.preventDefault();	   
		    var playerNameVar = event.target.playerName.value;
			var currentUserId = Meteor.userId();
			
			PlayerList.insert({
			    name: playerNameVar,
			    score: 0,
				createdBy: currentUserId,
				status: 'no called'
				
			});
			
			event.target.PlayerName.value = "";
			//console.log(playerNameVar);
			//console.log("Form submitted");
			//console.log(event.type);
		} 
	
	});
	
	//to observe changes i data base and trigger an event
	
	var now = new Date();
	
    PlayerList.find().observe({
        added: function(document){
            console.log('groups observe added value function');
            console.log(document);
        },
        changed:function(new_document, old_document){
            console.log('groups observe changed value function');
			//new Audio('sncf.mp3').play();
			//var setFlag = PlayerList.findOne({_id:'mEpKKj2z9ts6gaJc3'}, {fields: {'status': 1}});
			var setFlag = PlayerList.findOne(waiterId_00).status;
			console.log(setFlag);
			if(setFlag == "called"){
			    var sound = new Howl({
                  urls: ['carlosTableThree.mp3']
                });
			    sound.play();
			}
        },
        removed:function(document){
            console.log('groups observe removed value function');
        }
    });
	
	
	
	
	
}

if(Meteor.isServer){
    //console.log("Hello server");
	console.log(PlayerList.find().fetch());
	Meteor.publish('thePlayers', function(){
	    var currentUserId = this.userId;
	    //return PlayerList.find({createdBy:currentUserId})
		return PlayerList.find();
	});
	
	//iron route for get request handling
	Router.route( '/users', function() {
        
		
        var query = this.request.query;
        var name_t  = query.name;
        var score_t = query.score;
        
        

        //PlayerList.insert({
		//  	    name: name_t,
		//  	    score: score_t
        //
		//  	});
		
		PlayerList.update({_id: name_t}, {$set: {status: 'called'} });
			
        
        this.response.statusCode = 200;
        this.response.end( );

    }, { where: "server" });
	
	
}