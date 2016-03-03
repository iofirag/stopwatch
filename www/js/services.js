angular.module('stopwatch.services', [])

// .factory('focus', function($timeout, $window) {
// 	return function(id) {
// 	  // timeout makes sure that it is invoked after any other event has been triggered.
// 	  // e.g. click events that need to run before the focus or
// 	  // inputs elements that are in a disabled state but are enabled when those events
// 	  // are triggered.
// 	  $timeout(function() {
// 	    var element = $window.document.getElementById(id);
// 	    if(element)
// 	      element.focus();
// 	  });
// 	};
// })

// .factory('alert', ['$window','$q',
//     function( $window, $q ) {
//         // Define promise-based alert() method.
//         function alert( message ) {
//             var defer = $q.defer();
//             $window.alert( message );
//             defer.resolve();
//             return( defer.promise );
//         }
//         return( alert );
//     }
// ])

// .factory('prompt', ['$window','$q',
//     function( $window, $q ) {
//         // Define promise-based prompt() method.
//         function prompt( message, defaultValue ) {
//             var defer = $q.defer();
//             // The native prompt will return null or a string.
//             var response = $window.prompt( message, defaultValue );
//             if ( response === null ) {
//                 defer.reject();
//             } else {
//                 defer.resolve( response );
//             }
//             return( defer.promise );
//         }
//         return( prompt );
//     }
// ])

// .factory('confirm', ['$window','$q',
//     function( $window, $q ) {
//         // Define promise-based confirm() method.
//         function confirm( message ) {
//             var defer = $q.defer();
//             // The native confirm will return a boolean.
//             if ( $window.confirm( message ) ) {
//                 defer.resolve( true );
//             } else {
//                 defer.reject( false );
//             }
//             return( defer.promise );
//         }
//         return( confirm );
//     }
// ]);