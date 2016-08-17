(function () {
    "use strict";

    var module = angular.module("homeIndex", ["ngRoute"]);
    module.config(function ($routeProvider) {
        $routeProvider.when("/", {
            controller: "topicsController as vm",
            templateUrl: "/templates/topicsView.html"
        });

        $routeProvider.when("/newmessage", {
            controller: "newTopicController as vm",
            templateUrl: "/templates/newTopicView.html"
        });

        $routeProvider.when("/message/:id", {
            controller: "singleTopicController as vm",
            templateUrl: "/templates/singleTopicView.html"
        });

        $routeProvider.otherwise({ redirectTo: "/" });
    });

    module.factory("dataService", function ($http, $q) {
        var _topics = [];
        var _isInit = false;

        var _isReady = function () {
            return _isInit;
        }

        var _getTopics = function () {  
            
            var deferred = $q.defer();

            $http.get("/api/v1/topics?includeReplies=true")
                .then(function (response) {
                    angular.copy(response.data, _topics);
                    _isInit = true;
                    deferred.resolve();
                },
                function () {
                    // to do: logging
                    deferred.reject();
                });

            return deferred.promise;
        }

        var _addTopic = function(newTopic) {
            var deferred = $q.defer();

            $http.post("/api/v1/topics", newTopic)
                .then(function (response) {
                    var newlyCreatedTopic = response.data;
                    _topics.splice(0, 0, newlyCreatedTopic);
                    deferred.resolve(newlyCreatedTopic);
                },
                function () {
                    deferred.reject();
                });

            return deferred.promise;
        }

        function _findTopic(id) {
            var found = null;

            $.each(_topics, function (i, item) {
                if (item.id == id) {
                    found = item;
                    return false;
                }
            });

            return found;
        }

        var _getTopicById = function (id) {
            var deferred = $q.defer();
            
            if (_isReady()) {
                var topic = _findTopic(id);
                if (topic) {
                    deferred.resolve(topic);
                } else {
                    deferred.reject();
                }
            } else {
                _getTopics().
                then(function () {
                    var topic = _findTopic(id);
                    if (topic) {
                        deferred.resolve(topic);
                    } else {
                        deferred.reject();
                    }
                },
                function () {
                    deferred.reject();
                });
            }

            return deferred.promise;
        }

        var _saveReply = function (topic, newReply) {
            var deferred = $q.defer();

            var apiUrl = "/api/v1/topics/" + topic.id + "/replies";
            $http.post(apiUrl)
                .then(function (response) {
                    if (topic.replies == null) topic.replies = [];
                    topic.replies.push(response.data)
                    deferred.resolve(response.data);
                }, function () {
                    deferred.reject();
                });

            return deferred.promise;
        }

        return {
            topics: _topics,
            getTopics: _getTopics,
            addTopic: _addTopic,
            isReady: _isReady,
            getTopicById: _getTopicById,
            saveReply: _saveReply
        };
    });

    var topicsController = function ($http, dataService) {
        var vm = this;
        vm.data = dataService;
        vm.isBusy = false;

        if (!dataService.isReady()) {
            vm.isBusy = true;
            dataService.getTopics()
            .then(function () {

            },
            function () {
                console.error("Could not load topics");
            })
            .then(function () {
                vm.isBusy = false;
            });
        }
        
    }
    module.controller('topicsController', topicsController);

    var singleTopicController = function ($window, dataService, $routeParams) {
        var vm = this;
        vm.topic = null;
        vm.newReply = {};

        dataService.getTopicById($routeParams.id)
            .then(function (topic) {
                vm.topic = topic;
            }, function () {
                $window.location = "#/";
            });

        vm.addReply = function () {
            dataService.saveReply(vm.topic, vm.newReply)
                .then(function () {
                    vm.newReply.body = "";
                }, function () {
                    console.error("Could not save new reply");
                })

        };
    }
    module.controller('singleTopicController', singleTopicController);

    var newTopicController = function($http, $window, dataService) {
        var vm = this;
        vm.newTopic = {};

        vm.save = function () {

            dataService.addTopic(vm.newTopic)
                .then(function () {
                    $window.location = "#/;"
                },
                function () {
                    console.error("Could not create topic");
                })

        }
    }
    
    module.controller('newTopicController', newTopicController);

}());