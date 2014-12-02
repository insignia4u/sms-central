var NotificationURL = '/notification/';

/**
* Notification class
* represent a single notification message
*
*/
				
function Notification(notification_id, user_id, content, listener){
	this.notification_id = notification_id;
	this.user_id = user_id;
	this.content = content;
	this.listener = listener;
	this.dom = $('<div></div>').addClass('alert notification-info').html(this.content);
	var self = this;
	if(this.dom.find('.accept').length > 0){
		this.dom.find('.accept').each(function(){
			$(this).on('click',function(){
				listener.modal.modal();
			});
		});
	}
	else{
		var button = $('<button></button>').addClass('close').attr('data-dismiss','alert').text('x');
		button.on('click',function(){
			self.close();
		});
		this.dom.append(button);
	}
	
}

Notification.prototype.show = function(){
	// update notification action
	this.updateAction(0);
	this.showed = true;
	this.showing = true;
	this.dom.hide().prependTo('header').fadeIn('normal');
}

Notification.prototype.close = function(){
	// update notification action
	this.updateAction(1);
	this.hide();
	
}

Notification.prototype.hide = function(){
	this.showing = false;
	this.dom.fadeOut('normal');
	this.listener.updateDOM();
}

Notification.prototype.updateAction = function(action_id){
	var self = this;
	$.ajax({
		type: "POST",
		url: NotificationURL + 'setNotificationAction',
		data: { notification_id: self.notification_id, action: action_id, user_id: self.user_id},
		loading: false
	}).done(function(msg){
	});
}


/**
* NotificationListener
* listens for notification message and update DOM
*
*
*/

function NotificationListener(){

	var self = this;
	this.notification = Array();
	/*

	*/
	this.modal = $('<div></div>').addClass('modal m-small hide').attr('id','agreemodal');
	var modalback = $('<div></div>').addClass('modalback');
	var header = $('<div></div>').addClass('modal-header');
	var body = $('<div></div>').addClass('modal-body');
	var footer = $('<div></div>').addClass('modal-footer');
	var cancel = $('<a><span>CANCEL</span></a>').addClass('btn btn-small').attr('data-dismiss','modal');
	var accept = $('<a><span>I ACCEPT</span></a>').addClass('btn btn-small btn-info').attr('data-dismiss','modal');
	
	cancel.bind('click',function(){
		//self.hideNotification();
	});
	
	accept.bind('click', function(){
		self.closeNotification();
	});
	
	body.append("<p>I've read SMS Central's terms and conditions.</p>");
	footer.append(cancel).append(accept);
	modalback.append(header).append(body).append(footer);
	this.modal.append(modalback);
	
	$('body').append(this.modal);
}

NotificationListener.prototype.fetchNotification = function(){
	var self = this;
	$.ajax({
		cache: false,
		url: NotificationURL + 'getNotification',
		loading: false
	}).done(function(msg){
		self.process($.parseJSON(msg));
	});
}

NotificationListener.prototype.process = function(msg){
	var self = this;
	$.each(msg, function(index, value){
		var notification = new Notification(value.id, value.user_id, value.content, self);
		self.notification.push(notification);
	});
	self.updateDOM();
}

NotificationListener.prototype.hideNotification = function(fn){
	$.each(this.notification, function(index, value){
		if(value.showing){
			value.hide();
			return;
		}
	});
}

NotificationListener.prototype.closeNotification = function(fn){
	$.each(this.notification, function(index, value){
		if(value.showing){
			value.close();
			return;
		}
	});
}

NotificationListener.prototype.updateDOM = function(){
	$.each(this.notification, function(index, value){
		if(!value.showed){
			value.show();
			return;
		}
	});
}

// create the listener
$(document).ready(function(){
	var n = new NotificationListener();
	n.fetchNotification();
});
