var myDirectives = angular.module('myDirectives',[]);


myDirectives.directive('i3chat',function(){
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/i3chat.html',
		controller: function($scope,chatService){
			$scope.chatting = false;
			$scope.activeChat = null;
			$scope.events = [];

			$scope.$watch(
				function(){
					return chatService.activeChatEvents; 
				}
			,
				function(){
					$scope.events = chatService.activeChatEvents;
				}
			);
			/*get the active chat information*/
			$scope.$watch(
				function(){
					return chatService.activeChat; 
				}
			,
				function(){
					$scope.activeChat = chatService.activeChat;
				}
			);
			
			
			
		
			
		
		},
		
	
	};



});

myDirectives.directive('i3chatHeader',function(){
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/i3chat-header.html'


	}

});


myDirectives.directive('i3chatMessage',function(){
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/i3chat-message.html',
		scope:{
			'event':'='
		}
		
	
	};



});

myDirectives.directive('i3chatTypingIndicator',function(){
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/i3chat-typing-indicator.html',
		scope:{
			'showindicator':'='
		}
		
	
	};



});

myDirectives.directive('i3chatSignonForm',function(){
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/i3chat-signon-form.html',
		controller: function($scope,chatService){
		$scope.mytext = '';
		$scope.endChat = function(){

				chatService.endChat();
			
		}
		$scope.sendChat = function(){
				chatService.sendMessage($scope.mytext);
				$scope.mytext = '';
			}
		
		
		chatService.getAgentsAvailable();
		}
		
	
	};



});

myDirectives.directive('i3chatUserInput',function(){
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/i3chat-user-input.html',
		controller: function($scope,chatService){
		
		$scope.startChat = function(){
				participant = {
					"name": $scope.name,
					"credentials":null
				}
				chatService.startChat(participant,'Accounting').success(function(data){
					//$scope.status =data.chat.status.type;
				});
		
			}
		}
		
	
	};



});

myDirectives.directive('i3chatBody',function(){
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/i3chat-body.html'		
	
	};



});
myDirectives.directive('i3chatMessageHolder',function(){
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/i3chat-message-holder.html'
	
	};



});


myDirectives.directive('onEnter',function() {

  var linkFn = function(scope,element,attrs) {
    element.bind("keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function() {
      scope.$eval(attrs.onEnter);
        });
        event.preventDefault();
      }
    });
  };

  return {
    link:linkFn
  };
});