function Logger(info,output){
	this.info = info;
	this.output = output;
	this.version = 2;

	if(this.info.userid != '' && this.info.username != ''){
		this.output.identify(this.info.userid+' - '+this.info.username);
	}

	this.push = function(action,info){
		this.output.push(action,info);
	}

	this.parseDOM = function(DOM){
		var self = this;
		DOM.find('a,input,button').each(function(){
			var id = $(this).attr('id');
			var action = $(this).data('wf-action');
			if(typeof(id) != 'undefined' && typeof(action) != 'undefined'){
				$(this).on('click',function(){
					self.info.id = id;
					self.push(action,self.info);
				});
			}
			
		});
	}
}

var KissmetricsOutput = {
	name: 'kissmetrics',
	push: function(action, property){
		_kmq.push(['record',action,property]);
	},
	identify: function(user_id){
		_kmq.push(['identify', user_id]);
	}
}

var DummyTestOutput = {
	name: 'dummy',
	push: function(action, property){
		this.action = action;
		this.property = property;
	},
	identify: function(user_id){
		this.user = user_id;
	}
}

$(document).ready(function(){
	if(typeof(general_info) != 'undefined'){
		var logging = new Logger(general_info,DummyTestOutput); // stop kissmetrics for now
		logging.parseDOM($('body'));
	}
});
