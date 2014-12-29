(function() {
	'use strict';
	var $asm = {};
	global.CTFMMO = global.CTFMMO || {};
	global.CTFMMO.Server = global.CTFMMO.Server || {};
	global.CTFMMO.Server.Libraries = global.CTFMMO.Server.Libraries || {};
	global.CTFMMO.Server.Libraries.Redis = global.CTFMMO.Server.Libraries.Redis || {};
	ss.initAssembly($asm, 'CTFMMO.Server');
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Server.Program
	var $CTFMMO_Server_$Program = function() {
	};
	$CTFMMO_Server_$Program.__typeName = 'CTFMMO.Server.$Program';
	$CTFMMO_Server_$Program.$main = function() {
	};
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Server.Libraries.Redis.RedisClient
	var $CTFMMO_Server_Libraries_Redis_RedisClient = function() {
		EventEmitter.call(this);
	};
	$CTFMMO_Server_Libraries_Redis_RedisClient.__typeName = 'CTFMMO.Server.Libraries.Redis.RedisClient';
	global.CTFMMO.Server.Libraries.Redis.RedisClient = $CTFMMO_Server_Libraries_Redis_RedisClient;
	ss.initClass($CTFMMO_Server_$Program, $asm, {});
	ss.initClass($CTFMMO_Server_Libraries_Redis_RedisClient, $asm, {
		publish: function(channel, content) {
		},
		subscribe: function(channel) {
		},
		rpush: function(channel, value) {
		},
		blpop: function(objectsAndTimeout, action) {
		}
	}, EventEmitter);
	$CTFMMO_Server_$Program.$main();
})();
