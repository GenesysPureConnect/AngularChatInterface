var debugMode = false;
myControllers = angular.module('myControllers',[]);

myControllers.controller('MainController', function($scope, chatService) {
    $scope.chatcapabilities = [];
    $scope.status = '';
    $scope.person = {};
});
