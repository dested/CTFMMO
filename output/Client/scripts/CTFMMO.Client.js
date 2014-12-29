(function() {
	'use strict';
	var $asm = {};
	global.CTFMMO = global.CTFMMO || {};
	global.CTFMMO.Client = global.CTFMMO.Client || {};
	global.CTFMMO.Client.Utils = global.CTFMMO.Client.Utils || {};
	ss.initAssembly($asm, 'CTFMMO.Client');
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Client.PlayerClusterInfo
	var $CTFMMO_Client_$PlayerClusterInfo = function(player) {
		this.$1$PlayerField = null;
		this.$1$NeighborsField = null;
		this.set_$player(player);
		this.set_$neighbors([]);
	};
	$CTFMMO_Client_$PlayerClusterInfo.__typeName = 'CTFMMO.Client.$PlayerClusterInfo';
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Client.BoundingBox
	var $CTFMMO_Client_BoundingBox = function(min, max) {
		this.min = null;
		this.max = null;
		this.min = min;
		this.max = max;
	};
	$CTFMMO_Client_BoundingBox.__typeName = 'CTFMMO.Client.BoundingBox';
	$CTFMMO_Client_BoundingBox.createFromPoints = function(points) {
		if (ss.isNullOrUndefined(points)) {
			throw new ss.ArgumentNullException();
		}
		var flag = true;
		var min = new $CTFMMO_Client_Vector2(3.40282346638529E+38);
		var max = new $CTFMMO_Client_Vector2(-3.40282346638529E+38);
		var $t1 = ss.getEnumerator(points);
		try {
			while ($t1.moveNext()) {
				var vector2 = $t1.current();
				min.x = ((min.x < vector2.x) ? min.x : vector2.x);
				min.y = ((min.y < vector2.y) ? min.y : vector2.y);
				max.x = ((max.x > vector2.x) ? max.x : vector2.x);
				max.y = ((max.y > vector2.y) ? max.y : vector2.y);
				flag = false;
			}
		}
		finally {
			$t1.dispose();
		}
		if (flag) {
			throw new ss.ArgumentException();
		}
		else {
			return new $CTFMMO_Client_BoundingBox(min, max);
		}
	};
	global.CTFMMO.Client.BoundingBox = $CTFMMO_Client_BoundingBox;
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Client.Player
	var $CTFMMO_Client_Player = function(id) {
		this.$1$IdField = 0;
		this.$1$XField = 0;
		this.$1$YField = 0;
		this.set_id(id);
	};
	$CTFMMO_Client_Player.__typeName = 'CTFMMO.Client.Player';
	global.CTFMMO.Client.Player = $CTFMMO_Client_Player;
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Client.PlayerCluster
	var $CTFMMO_Client_PlayerCluster = function() {
		this.$1$ColorField = null;
		this.$1$PlayersField = null;
		this.set_players([]);
		this.set_color(this.$randomColor());
	};
	$CTFMMO_Client_PlayerCluster.__typeName = 'CTFMMO.Client.PlayerCluster';
	global.CTFMMO.Client.PlayerCluster = $CTFMMO_Client_PlayerCluster;
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Client.PlayerClusterGroup
	var $CTFMMO_Client_PlayerClusterGroup = function() {
		this.$1$NumberOfPlayersField = 0;
		this.$1$PlayerClustersField = null;
		this.set_playerClusters([]);
		this.set_numberOfPlayers(0);
	};
	$CTFMMO_Client_PlayerClusterGroup.__typeName = 'CTFMMO.Client.PlayerClusterGroup';
	global.CTFMMO.Client.PlayerClusterGroup = $CTFMMO_Client_PlayerClusterGroup;
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Client.Program
	var $CTFMMO_Client_Program = function() {
	};
	$CTFMMO_Client_Program.__typeName = 'CTFMMO.Client.Program';
	$CTFMMO_Client_Program.$nextId = function() {
		return $CTFMMO_Client_Program.$ids++;
	};
	$CTFMMO_Client_Program.$main = function() {
		$CTFMMO_Client_Program.$start();
	};
	$CTFMMO_Client_Program.$start = function() {
		var $t1 = document.getElementById('canvas');
		$CTFMMO_Client_Program.$canvas = ss.cast($t1, ss.isValue($t1) && (ss.isInstanceOfType($t1, Element) && $t1.tagName === 'CANVAS'));
		$CTFMMO_Client_Program.$context = ss.cast($CTFMMO_Client_Program.$canvas.getContext('2d'), CanvasRenderingContext2D);
		$CTFMMO_Client_Program.offset = new $CTFMMO_Client_Vector2.$ctor1(0, 0);
		var draggingPos = null;
		$CTFMMO_Client_Program.$canvas.onmousedown = function(event) {
			var mouseX = ss.unbox(ss.cast(event.pageX, ss.Int32));
			var mouseY = ss.unbox(ss.cast(event.pageY, ss.Int32));
			draggingPos = new $CTFMMO_Client_Vector2.$ctor1(mouseX, mouseY);
		};
		$CTFMMO_Client_Program.$canvas.onmouseup = function(event1) {
			//
			//                                if (draggingPos == null) return;
			//
			//                                
			//
			//                                int mouseX = ((dynamic)@event).pageX;
			//
			//                                int mouseY = ((dynamic)@event).pageY;
			//
			//                                
			//
			//                                draggingPos = new Vector2(draggingPos.X - mouseX, draggingPos.Y - mouseY);
			//
			//                                
			//
			//                                Offset = new Vector2(Offset.X + draggingPos.X, Offset.Y + draggingPos.Y);
			//
			//                                draw();
			draggingPos = null;
		};
		document.onmousemove = function(event2) {
			if (ss.isNullOrUndefined(draggingPos)) {
				return;
			}
			var mouseX1 = ss.unbox(ss.cast(event2.pageX, ss.Int32));
			var mouseY1 = ss.unbox(ss.cast(event2.pageY, ss.Int32));
			$CTFMMO_Client_Program.offset = new $CTFMMO_Client_Vector2.$ctor1($CTFMMO_Client_Program.offset.x + (draggingPos.x - mouseX1) * 6, $CTFMMO_Client_Program.offset.y + (draggingPos.y - mouseY1) * 6);
			draggingPos = new $CTFMMO_Client_Vector2.$ctor1(mouseX1, mouseY1);
			$CTFMMO_Client_Program.draw();
		};
		$CTFMMO_Client_Program.$canvas.width = document.body.clientWidth - 100;
		$CTFMMO_Client_Program.$canvas.height = document.body.clientHeight - 100;
		$CTFMMO_Client_Program.$context.save();
		$CTFMMO_Client_Program.$context.font = '50px Arial';
		$CTFMMO_Client_Program.$context.fillText('Loading...', ss.Int32.div($CTFMMO_Client_Program.$canvas.width, 2), ss.Int32.div($CTFMMO_Client_Program.$canvas.height, 2));
		$CTFMMO_Client_Program.$context.restore();
		window.onkeydown = function(event3) {
			if (!!ss.referenceEquals(event3.keyCode, 17)) {
				$CTFMMO_Client_Program.drawLines = !$CTFMMO_Client_Program.drawLines;
			}
			$CTFMMO_Client_Program.draw();
		};
		window.setTimeout(function() {
			console.log('Started');
			console.profile();
			var sw = new ss.Stopwatch();
			sw.start();
			$CTFMMO_Client_Program.$tree = new (ss.makeGenericType(RTree.RTree$1, [$CTFMMO_Client_Player]))();
			$CTFMMO_Client_Program.$players = [];
			for (var j = 0; j < $CTFMMO_Client_Program.numberOfPlayers; j++) {
				var player = new $CTFMMO_Client_Player($CTFMMO_Client_Program.$nextId());
				player.set_x($CTFMMO_Client_Program.rand.nextMinMax(0, $CTFMMO_Client_Program.gameSize));
				player.set_y($CTFMMO_Client_Program.rand.nextMinMax(0, $CTFMMO_Client_Program.gameSize));
				ss.add($CTFMMO_Client_Program.$players, player);
				$CTFMMO_Client_Program.$tree.add(new RTree.Rectangle(player.get_x(), player.get_y()), player);
			}
			$CTFMMO_Client_Program.buildClusters($CTFMMO_Client_Program.viewRadius);
			sw.stop();
			console.profileEnd();
			console.log(ss.formatString('Time {0}', sw.milliseconds()));
			console.log('Done');
			$CTFMMO_Client_Program.draw();
		});
	};
	$CTFMMO_Client_Program.draw = function() {
		$CTFMMO_Client_Program.$canvas.width = $CTFMMO_Client_Program.$canvas.width;
		$CTFMMO_Client_Program.$context.save();
		$CTFMMO_Client_Program.$context.translate(-$CTFMMO_Client_Program.offset.x, -$CTFMMO_Client_Program.offset.y);
		$CTFMMO_Client_Program.$context.save();
		$CTFMMO_Client_Program.$context.strokeStyle = 'black';
		var bigBox = 60;
		var rect = new RTree.Rectangle.$ctor2($CTFMMO_Client_Program.offset.x, $CTFMMO_Client_Program.offset.y, $CTFMMO_Client_Program.offset.x + $CTFMMO_Client_Program.$canvas.width, $CTFMMO_Client_Program.offset.y + $CTFMMO_Client_Program.$canvas.height, 1, 1);
		for (var x = 0; x < $CTFMMO_Client_Program.gameSize; x += bigBox) {
			for (var y = 0; y < $CTFMMO_Client_Program.gameSize; y += bigBox) {
				$CTFMMO_Client_Program.$context.strokeRect(x * $CTFMMO_Client_Program.squareSize, y * $CTFMMO_Client_Program.squareSize, $CTFMMO_Client_Program.squareSize * bigBox, $CTFMMO_Client_Program.squareSize * bigBox);
			}
		}
		$CTFMMO_Client_Program.$context.restore();
		for (var $t1 = 0; $t1 < $CTFMMO_Client_Program.$clusters.length; $t1++) {
			var playerCluster = $CTFMMO_Client_Program.$clusters[$t1];
			var vector2s = CTFMMO.Common.EnumerableExtensions.select($CTFMMO_Client_Player, $CTFMMO_Client_Vector2).call(null, playerCluster.get_players(), function(a) {
				return new $CTFMMO_Client_Vector2.$ctor1(a.get_x(), a.get_y());
			});
			var box = $CTFMMO_Client_BoundingBox.createFromPoints(vector2s);
			var center = { $: new $CTFMMO_Client_Vector2.$ctor1(box.min.x + (box.max.x - box.min.x) / 2, box.min.y + (box.max.y - box.min.y) / 2) };
			var polyRect = new RTree.Rectangle.$ctor2(box.min.x * $CTFMMO_Client_Program.squareSize, box.min.y * $CTFMMO_Client_Program.squareSize, box.max.x * $CTFMMO_Client_Program.squareSize, box.max.y * $CTFMMO_Client_Program.squareSize, 1, 1);
			if (!rect.intersects(polyRect)) {
				continue;
			}
			var vecs = CTFMMO.Common.EnumerableExtensions.orderBy$1($CTFMMO_Client_Vector2, Number).call(null, vector2s, ss.mkdel({ center: center }, function(a1) {
				return Math.atan2(a1.y - this.center.$.y, a1.x - this.center.$.x);
			}));
			$CTFMMO_Client_Program.$context.save();
			$CTFMMO_Client_Program.$context.strokeStyle = $CTFMMO_Client_Program.$context.fillStyle = playerCluster.get_color();
			$CTFMMO_Client_Program.$context.lineWidth = 6;
			var lastPlayer = vecs[0];
			$CTFMMO_Client_Program.$context.beginPath();
			$CTFMMO_Client_Program.$context.moveTo(lastPlayer.x * $CTFMMO_Client_Program.squareSize + ss.Int32.div($CTFMMO_Client_Program.squareSize, 2), lastPlayer.y * $CTFMMO_Client_Program.squareSize + ss.Int32.div($CTFMMO_Client_Program.squareSize, 2));
			for (var index = 0; index < vecs.length; index++) {
				var player = vecs[index];
				$CTFMMO_Client_Program.$context.fillRect(player.x * $CTFMMO_Client_Program.squareSize - ss.Int32.div($CTFMMO_Client_Program.squareSize, 2), player.y * $CTFMMO_Client_Program.squareSize - ss.Int32.div($CTFMMO_Client_Program.squareSize, 2), $CTFMMO_Client_Program.squareSize * 2, $CTFMMO_Client_Program.squareSize * 2);
				$CTFMMO_Client_Program.$context.lineTo(player.x * $CTFMMO_Client_Program.squareSize + ss.Int32.div($CTFMMO_Client_Program.squareSize, 2), player.y * $CTFMMO_Client_Program.squareSize + ss.Int32.div($CTFMMO_Client_Program.squareSize, 2));
			}
			$CTFMMO_Client_Program.$context.closePath();
			if ($CTFMMO_Client_Program.drawLines) {
				$CTFMMO_Client_Program.$context.stroke();
			}
			$CTFMMO_Client_Program.$context.restore();
			$CTFMMO_Client_Program.$context.save();
			$CTFMMO_Client_Program.$context.font = '30px Arial';
			if (vecs.length > 2) {
				$CTFMMO_Client_Program.$context.fillText(vecs.length.toString(), center.$.x * $CTFMMO_Client_Program.squareSize + ss.Int32.div($CTFMMO_Client_Program.squareSize, 2), center.$.y * $CTFMMO_Client_Program.squareSize + ss.Int32.div($CTFMMO_Client_Program.squareSize, 2));
			}
			$CTFMMO_Client_Program.$context.restore();
		}
		$CTFMMO_Client_Program.$context.restore();
	};
	$CTFMMO_Client_Program.buildClusters = function(viewRadius) {
		$CTFMMO_Client_Program.$clusters = $CTFMMO_Client_Program.$clusterTree($CTFMMO_Client_Program.$tree, $CTFMMO_Client_Program.$players, viewRadius);
		//
		//
		//            Console.WriteLine(string.Format("Clusters {0}", clusters.Count));
		//
		//
		//            for (int i = 1; i <= MaxClusterSize; i++)
		//
		//
		//            {
		//
		//
		//            Console.WriteLine(string.Format("Clusters with {1} {0}", clusters.Count(a => a.Players.Count == i), i));
		//
		//
		//            }
		//
		//
		//            
		//
		//
		//            clusters.Sort((a, b) =>
		//
		//
		//            {
		//
		//
		//            return b.Players.Count - a.Players.Count;
		//
		//
		//            });
		//
		//
		//            
		//
		//
		//            for (int i = 0; i < clusters.Count; i++)
		//
		//
		//            {
		//
		//
		//            if (clusters[i].Players.Count <= MaxClusterSize) continue;
		//
		//
		//            Console.WriteLine(string.Format("Cluster[{0}] Size {1}", i + 1, clusters[i].Players.Count));
		//
		//
		//            }
		var playerClusterGroups = [];
		var clonePlayerClusters = ss.arrayClone(CTFMMO.Common.EnumerableExtensions.orderBy($CTFMMO_Client_PlayerCluster, ss.Int32).call(null, $CTFMMO_Client_Program.$clusters, function(a) {
			return -a.get_players().length;
		}));
		while (clonePlayerClusters.length > 0) {
			var currentPlayerCluster = new $CTFMMO_Client_PlayerClusterGroup();
			for (var index = clonePlayerClusters.length - 1; index >= 0; index--) {
				var clonePlayerCluster = clonePlayerClusters[index];
				if (currentPlayerCluster.get_numberOfPlayers() + clonePlayerCluster.get_players().length <= $CTFMMO_Client_Program.maxClusterSize) {
					ss.add(currentPlayerCluster.get_playerClusters(), clonePlayerCluster);
					currentPlayerCluster.set_numberOfPlayers(currentPlayerCluster.get_numberOfPlayers() + clonePlayerCluster.get_players().length);
					ss.removeAt(clonePlayerClusters, index);
					if (currentPlayerCluster.get_numberOfPlayers() === $CTFMMO_Client_Program.maxClusterSize) {
						break;
					}
				}
			}
			ss.add(playerClusterGroups, currentPlayerCluster);
		}
		//       foreach (var playerClusterGroup in playerClusterGroups)
		//       {
		//       
		//       var color = playerClusterGroup.PlayerClusters[0].Color;
		//       
		//       foreach (var playerCluster in playerClusterGroup.PlayerClusters)
		//       playerCluster.Color = color;
		//       
		//       Console.WriteLine(string.Format("Number Of Clusters: {0}, Number Of Players: {1}", playerClusterGroup.PlayerClusters.Count, playerClusterGroup.NumberOfPlayers));
		//       }
		//       
		//       Console.WriteLine(string.Format("Number Of Cluster Groups: {0}", playerClusterGroups.Count));
	};
	$CTFMMO_Client_Program.$clusterTree = function(tree, players, viewRadius) {
		var playerClusterInformations = $CTFMMO_Client_Program.$buildPlayerClusterInformations(tree, players, viewRadius);
		var playerClusters = $CTFMMO_Client_Program.$buildPlayerClusters(players, playerClusterInformations);
		return playerClusters;
	};
	$CTFMMO_Client_Program.$buildPlayerClusters = function(players, playerClusterInformations) {
		var hitPlayers = CTFMMO.Common.EnumerableExtensions.toDictionary($CTFMMO_Client_Player, ss.Int32).call(null, players, function(a) {
			return a.get_id();
		});
		var playerClusters = [];
		var hitPlayerCount = players.length;
		var playerClusterInfoHits = {};
		var playerClusterInfoHitsArray = [];
		while (hitPlayerCount > 0) {
			ss.clearKeys(playerClusterInfoHits);
			ss.clear(playerClusterInfoHitsArray);
			$CTFMMO_Client_Program.$getPlayerCluster(playerClusterInfoHits, playerClusterInfoHitsArray, playerClusterInformations, playerClusterInformations.get_item(hitPlayers[CTFMMO.Common.EnumerableExtensions.first(ss.Int32).call(null, Object.keys(hitPlayers))]), hitPlayers);
			var cluster = new $CTFMMO_Client_PlayerCluster();
			for (var index = 0; index < playerClusterInfoHitsArray.length; index++) {
				var playerClusterInfoHit = playerClusterInfoHitsArray[index];
				ss.add(cluster.get_players(), playerClusterInfoHit.get_$player());
				delete hitPlayers[playerClusterInfoHit.get_$player().get_id()];
				hitPlayerCount--;
			}
			ss.add(playerClusters, cluster);
			//                Console.WriteLine(string.Format("Players Left: {0}, Clusters Total: {1} ", hitPlayerCount, playerClusters.Count));
		}
		return playerClusters;
	};
	$CTFMMO_Client_Program.$buildPlayerClusterInformations = function(tree, players, viewRadius) {
		var playerClusterInformations = new (ss.makeGenericType(ss.Dictionary$2, [$CTFMMO_Client_Player, $CTFMMO_Client_$PlayerClusterInfo]))();
		for (var index = 0; index < players.length; index++) {
			var currentPlayer = players[index];
			var nearest = tree.nearest(new RTree.Point(currentPlayer.get_x(), currentPlayer.get_y(), 1), viewRadius);
			var playerClusterInfo = new $CTFMMO_Client_$PlayerClusterInfo(currentPlayer);
			for (var i = 0; i < nearest.length; i++) {
				var nearPlayer = nearest[i];
				if (ss.referenceEquals(nearPlayer, currentPlayer)) {
					continue;
				}
				ss.add(playerClusterInfo.get_$neighbors(), { item1: $CTFMMO_Client_Program.$pointDistance(nearPlayer, currentPlayer), item2: nearPlayer });
			}
			playerClusterInformations.add(currentPlayer, playerClusterInfo);
		}
		return playerClusterInformations;
	};
	$CTFMMO_Client_Program.$getPlayerCluster = function(playerClusterInfoHits, playerClusterInfoHitsArray, allPlayerClusterInformations, currentPlayerClusterInfo, hitPlayers) {
		var neighbors = [];
		ss.add(neighbors, { item1: 0, item2: currentPlayerClusterInfo });
		var totalPlayers = 0;
		while (neighbors.length > 0) {
			var activePlayerClusterInfo = neighbors[0];
			if (!ss.keyExists(hitPlayers, activePlayerClusterInfo.item2.get_$player().get_id()) || ss.keyExists(playerClusterInfoHits, activePlayerClusterInfo.item2.get_$player().get_id())) {
				ss.remove(neighbors, activePlayerClusterInfo);
				continue;
			}
			playerClusterInfoHits[activePlayerClusterInfo.item2.get_$player().get_id()] = activePlayerClusterInfo.item2;
			ss.add(playerClusterInfoHitsArray, activePlayerClusterInfo.item2);
			totalPlayers++;
			if (totalPlayers === $CTFMMO_Client_Program.maxClusterSize) {
				return;
			}
			var $t1 = activePlayerClusterInfo.item2.get_$neighbors();
			for (var $t2 = 0; $t2 < $t1.length; $t2++) {
				var playerNeighbor = $t1[$t2];
				ss.add(neighbors, { item1: playerNeighbor.item1, item2: allPlayerClusterInformations.get_item(playerNeighbor.item2) });
			}
			ss.remove(neighbors, activePlayerClusterInfo);
			neighbors.sort(function(a, b) {
				return ss.Int32.trunc(a.item1 - b.item1);
			});
			if (neighbors.length > 100) {
				ss.arrayRemoveRange(neighbors, 100, neighbors.length - 100);
			}
		}
	};
	$CTFMMO_Client_Program.$pointDistance = function(nearPlayer, currentPlayer) {
		return Math.pow(currentPlayer.get_x() - nearPlayer.get_x(), 2) + Math.pow(currentPlayer.get_y() - nearPlayer.get_y(), 2);
	};
	global.CTFMMO.Client.Program = $CTFMMO_Client_Program;
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Client.Vector2
	var $CTFMMO_Client_Vector2 = function(value) {
		this.x = 0;
		this.y = 0;
		this.x = value;
		this.y = value;
	};
	$CTFMMO_Client_Vector2.__typeName = 'CTFMMO.Client.Vector2';
	$CTFMMO_Client_Vector2.$ctor1 = function(x, y) {
		this.x = 0;
		this.y = 0;
		this.x = x;
		this.y = y;
	};
	global.CTFMMO.Client.Vector2 = $CTFMMO_Client_Vector2;
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Client.Utils.CanvasInformation
	var $CTFMMO_Client_Utils_CanvasInformation = function(context, domCanvas) {
		this.context = null;
		this.domCanvas = null;
		this.canvas = null;
		this.image = null;
		this.imageReady = false;
		this.context = context;
		this.domCanvas = domCanvas;
		var $t1 = domCanvas[0];
		this.canvas = ss.cast($t1, ss.isValue($t1) && (ss.isInstanceOfType($t1, Element) && $t1.tagName === 'CANVAS'));
	};
	$CTFMMO_Client_Utils_CanvasInformation.__typeName = 'CTFMMO.Client.Utils.CanvasInformation';
	$CTFMMO_Client_Utils_CanvasInformation.get_blackPixel = function() {
		if (ss.isNullOrUndefined($CTFMMO_Client_Utils_CanvasInformation.$blackPixel)) {
			var m = $CTFMMO_Client_Utils_CanvasInformation.create$2(0, 0);
			m.context.fillStyle = 'black';
			m.context.fillRect(0, 0, 1, 1);
			$CTFMMO_Client_Utils_CanvasInformation.$blackPixel = m.canvas;
		}
		return $CTFMMO_Client_Utils_CanvasInformation.$blackPixel;
	};
	$CTFMMO_Client_Utils_CanvasInformation.create$2 = function(w, h) {
		var $t1 = document.createElement('canvas');
		var canvas = ss.cast($t1, ss.isValue($t1) && (ss.isInstanceOfType($t1, Element) && $t1.tagName === 'CANVAS'));
		return $CTFMMO_Client_Utils_CanvasInformation.create$3(canvas, w, h);
	};
	$CTFMMO_Client_Utils_CanvasInformation.create$3 = function(canvas, w, h) {
		if (w === 0) {
			w = 1;
		}
		if (h === 0) {
			h = 1;
		}
		canvas.width = w;
		canvas.height = h;
		var ctx = ss.cast(canvas.getContext('2d'), CanvasRenderingContext2D);
		return new $CTFMMO_Client_Utils_CanvasInformation(ctx, $(canvas));
	};
	$CTFMMO_Client_Utils_CanvasInformation.create = function(tileImage) {
		var item = $CTFMMO_Client_Utils_CanvasInformation.create$2(tileImage.width, tileImage.height);
		item.context.drawImage(tileImage, 0, 0);
		return item;
	};
	$CTFMMO_Client_Utils_CanvasInformation.create$1 = function(imageData) {
		var item = $CTFMMO_Client_Utils_CanvasInformation.create$2(imageData.width, imageData.height);
		item.context.putImageData(imageData, 0, 0);
		return item;
	};
	global.CTFMMO.Client.Utils.CanvasInformation = $CTFMMO_Client_Utils_CanvasInformation;
	ss.initClass($CTFMMO_Client_$PlayerClusterInfo, $asm, {
		get_$player: function() {
			return this.$1$PlayerField;
		},
		set_$player: function(value) {
			this.$1$PlayerField = value;
		},
		get_$neighbors: function() {
			return this.$1$NeighborsField;
		},
		set_$neighbors: function(value) {
			this.$1$NeighborsField = value;
		}
	});
	ss.initClass($CTFMMO_Client_BoundingBox, $asm, {});
	ss.initClass($CTFMMO_Client_Player, $asm, {
		getHashCode: function() {
			return this.get_id();
		},
		get_id: function() {
			return this.$1$IdField;
		},
		set_id: function(value) {
			this.$1$IdField = value;
		},
		get_x: function() {
			return this.$1$XField;
		},
		set_x: function(value) {
			this.$1$XField = value;
		},
		get_y: function() {
			return this.$1$YField;
		},
		set_y: function(value) {
			this.$1$YField = value;
		}
	});
	ss.initClass($CTFMMO_Client_PlayerCluster, $asm, {
		get_color: function() {
			return this.$1$ColorField;
		},
		set_color: function(value) {
			this.$1$ColorField = value;
		},
		get_players: function() {
			return this.$1$PlayersField;
		},
		set_players: function(value) {
			this.$1$PlayersField = value;
		},
		$randomColor: function() {
			return ss.formatString('#{0:X6}', $CTFMMO_Client_Program.rand.nextMax(16777216));
		}
	});
	ss.initClass($CTFMMO_Client_PlayerClusterGroup, $asm, {
		get_numberOfPlayers: function() {
			return this.$1$NumberOfPlayersField;
		},
		set_numberOfPlayers: function(value) {
			this.$1$NumberOfPlayersField = value;
		},
		get_playerClusters: function() {
			return this.$1$PlayerClustersField;
		},
		set_playerClusters: function(value) {
			this.$1$PlayerClustersField = value;
		}
	});
	ss.initClass($CTFMMO_Client_Program, $asm, {});
	ss.initClass($CTFMMO_Client_Vector2, $asm, {});
	$CTFMMO_Client_Vector2.$ctor1.prototype = $CTFMMO_Client_Vector2.prototype;
	ss.initClass($CTFMMO_Client_Utils_CanvasInformation, $asm, {});
	$CTFMMO_Client_Program.$ids = 0;
	$CTFMMO_Client_Program.rand = new ss.Random();
	$CTFMMO_Client_Program.offset = null;
	$CTFMMO_Client_Program.viewRadius = 60;
	$CTFMMO_Client_Program.maxClusterSize = 500;
	$CTFMMO_Client_Program.numberOfPlayers = 50000;
	$CTFMMO_Client_Program.gameSize = 2500;
	$CTFMMO_Client_Program.squareSize = 4;
	$CTFMMO_Client_Program.drawLines = false;
	$CTFMMO_Client_Program.$tree = null;
	$CTFMMO_Client_Program.$players = null;
	$CTFMMO_Client_Program.$clusters = null;
	$CTFMMO_Client_Program.$context = null;
	$CTFMMO_Client_Program.$canvas = null;
	$CTFMMO_Client_Utils_CanvasInformation.$blackPixel = null;
	$CTFMMO_Client_Program.$main();
})();
