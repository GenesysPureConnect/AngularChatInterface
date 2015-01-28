var debugMode = false;
myControllers = angular.module('myControllers',[]);

myControllers.controller('MainController',function($scope,chatService){
$scope.test = 123;
$scope.chatcapabilities = [];
$scope.status = '';
$scope.person = {};

chatService.load().success(function(){

console.log(chatService.serverConfiguration);
	$scope.chatcapabilities = chatService.serverConfiguration.capabilities.chat;

});
	


});
