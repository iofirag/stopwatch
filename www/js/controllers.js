angular.module('stopwatch.controllers', [])

/* Base Controller (parent) */
.controller('baseCtrl', ['$scope','$rootScope','$window', function($scope, $rootScope,$window){
	$rootScope.vars = {
		differenceLapsMode : true
	}
	$scope.$on('createNewLap', function(event,lapObj){
		$scope.$broadcast('postNewLap', lapObj);
  	})
  	$scope.$on('resetAllCtrls', function(event){
  		console.log('baseCtrl - reset')
  		$scope.$broadcast('reset');
  	})
  	$rootScope.baseInit = function(){
  	}
	// listener for saving data before refreshing the page
	$window.onbeforeunload = function () {
   		// handle the exit event
   		$scope.$broadcast('onbeforeunload');
	};
}])

/* Board + stopwatch-controllers Controller (child) */
.controller('panelCtrl', ['$scope','$interval', function($scope, $interval){
  $scope.vars;

  $scope.$on('onbeforeunload',function(){
  	//read from local storage all the vars
	saveJsonToLocalStorage('currentVars',$scope.vars);
  })
  $scope.$on('reset', function(){
  	console.log('panelCtrl - reset')
  	$scope.init();
  });
  $scope.init = function(){
  	if (localStorage.getItem('currentVars') != null) {
  		$scope.vars = angular.fromJson( localStorage.getItem('currentVars'));
  		$scope.vars.startAt = new Date($scope.vars.startAt);
  		console.log('restore last vars')
  		console.dir( $scope.vars )
  		if ($scope.vars.runningMode == 1) {
  			// was in running mode
  			console.log('user was in running mode')
  			$scope.playAndPause(true);
  		}
  	}else{
  		$scope.vars = {
			timeToShow : '00:00.00',
			time : 0,
			startAt	: 0,
			interval : null,
			runningMode : -1,
			incrementMillis : 0,
			staticData : {
				TIME_TO_RENDER : 61,
				TEMP_TITLE : 'Double click to edit..',
				START : 'Start',
				STOP : 'Stop'
			}
		}
  	}
  }
  $scope.playAndPause = function(isRecoverd){
  	if (isRecoverd){
  		$scope.start();
  		console.log('stop-watch restored...');
  	}else{
  		if ($scope.vars.runningMode == 1){
	  		// user has stop the stopwatch
	  		// change the 'stop' to -> 'run'
	  		// And stop counting
	  		$scope.stop();
	  		console.log('stop-watch stopped!');
	  	}else{
	  		// user has run the stopwatch
	  		// change the 'play' to -> 'stop'
	  		// And start counting
	  		$scope.start();
	  		console.log('stop-watch started...');
	  	}
	  	//Toggle runningMode variable
	  	$scope.vars.runningMode *= -1;
  	}
  }
  $scope.start = function(){
  	$('#playStop').val($scope.vars.staticData.STOP);
  	if ($scope.vars.time == 0){
  		$scope.vars.startAt = new Date();
  	}
  	$scope.vars.interval = $interval(function(){
  		$scope.vars.time = new Date().getTime() - $scope.vars.startAt.getTime();
  		$scope.vars.timeToShow = formatTime($scope.vars.time);
  		$scope.vars.incrementMillis += $scope.vars.staticData.TIME_TO_RENDER;

		// Blink the text
  		if ($scope.vars.incrementMillis >= 500){
  			$('.blink_me').animate({'opacity': 0.5}, 250).animate({'opacity': 1}, 250);
  	 		$scope.vars.incrementMillis = 0;
  		}
  	}, $scope.vars.staticData.TIME_TO_RENDER)
  }
  $scope.stop = function(){
  	if ( !! $scope.vars.interval){
  		$('#playStop').val($scope.vars.staticData.START);
  		$interval.cancel($scope.vars.interval);
  	}
  }
  $scope.newLap = function(){
  	if ( !! $scope.vars.interval){
  		var lapTime = $scope.vars.time;
  		var title = $scope.vars.staticData.TEMP_TITLE;
  		var lapObj = {
  			timeToShow : '',
  			time : lapTime,
  			title : title,
  			isEdit : false
  		}
  		//save in local storage just in case..
  		$scope.$emit('createNewLap', lapObj);
  	}
  }
  $scope.reset = function(){
  	// zero the stopwatch and clear laps
  	// clear from local storage too
  	$scope.stop();
  	localStorage.removeItem('currentVars');
  	localStorage.removeItem('currentLaps');
  	$scope.$emit('resetAllCtrls');
  }
}])


/* Laps Controller (child) */
.controller('listCtrl', ['$scope','$window','$rootScope', function($scope, $window, $rootScope){
  $scope.vars = {
  	laps : []
  }
  $scope.$on('onbeforeunload',function(){
	//read from local storage all the laps
	saveJsonToLocalStorage('currentLaps', $scope.vars.laps);
  })
  $scope.$on('reset', function(){
  	console.log('listCtrl - reset')
  	$scope.init();
  });
  $scope.$on('postNewLap', function(event,lapObj){
  	if ($rootScope.vars.differenceLapsMode){
  		// Calc difference time from the older time
	  	if ($scope.vars.laps.length >0){
	  		var differenceTime = lapObj.time - $scope.vars.laps[0].time;
	  		lapObj.timeToShow = formatTime(differenceTime);
	  	}else{
	  		lapObj.timeToShow = formatTime(lapObj.time);
	  	}
  	}else{
  		lapObj.timeToShow = formatTime(lapObj.time);
  	}
  	$scope.vars.laps.unshift(lapObj);
  })
  $scope.init = function(){
  	$scope.vars = {
  		laps : []
  	}
  	//read from local storage all the laps
  	if (localStorage.getItem('currentLaps') != null) {
  		console.log('restore last laps')
  		$scope.vars.laps = angular.fromJson( localStorage.getItem('currentLaps'));
  		console.dir( $scope.vars.laps )
  	}
  }
  $scope.editLapTitle = function(lapItem, indexInView){
  	var editIndexInArray = $scope.vars.laps.indexOf(lapItem);
  	$scope.vars.laps[editIndexInArray].isEdit = true;
  	
  	// Set the text-cursor on the clicked input element
  	var input = $('#list .title-edit')[indexInView];
	input.selectionStart = input.selectionEnd = $(input).val().length;
  }
  $scope.removeLap = function(lapItem){
  	var removeIndex = $scope.vars.laps.indexOf(lapItem);
  	$scope.vars.laps.splice(removeIndex,1);
  }
}])

/* Directive that detect 'Enter' event */
.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});





/* public functions */
function saveJsonToLocalStorage(key,json){
	localStorage.setItem(key, angular.toJson(json));
}
function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}
// Millis to readable time
function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	if (h) 	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + '.' + pad(ms, 2);
	else 	newTime = 					pad(m, 2) + ':' + pad(s, 2) + '.' + pad(ms, 2);
	return newTime;
}