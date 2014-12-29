(function() {
	'use strict';
	var $asm = {};
	global.RTree = global.RTree || {};
	ss.initAssembly($asm, 'RTree');
	////////////////////////////////////////////////////////////////////////////////
	// RTree.ILog
	var $RTree_$ILog = function() {
	};
	$RTree_$ILog.__typeName = 'RTree.$ILog';
	////////////////////////////////////////////////////////////////////////////////
	// RTree.Log
	var $RTree_$Log = function() {
		this.$1$IsDebugEnabledField = false;
	};
	$RTree_$Log.__typeName = 'RTree.$Log';
	////////////////////////////////////////////////////////////////////////////////
	// RTree.LogManager
	var $RTree_$LogManager = function() {
	};
	$RTree_$LogManager.__typeName = 'RTree.$LogManager';
	$RTree_$LogManager.$getLogger = function(fullName) {
		return new $RTree_$Log();
	};
	////////////////////////////////////////////////////////////////////////////////
	// RTree.Node
	var $RTree_Node$1 = function(T) {
		var $type = function(nodeId, level, maxNodeEntries) {
			this.$nodeId = 0;
			this.$mbr = null;
			this.$entries = null;
			this.$ids = null;
			this.$level = 0;
			this.$entryCount = 0;
			this.$nodeId = nodeId;
			this.$level = level;
			this.$entries = new Array(maxNodeEntries);
			this.$ids = new Array(maxNodeEntries);
		};
		ss.registerGenericClassInstance($type, $RTree_Node$1, [T], {
			$addEntry: function(r, id) {
				this.$ids[this.$entryCount] = id;
				this.$entries[this.$entryCount] = r.$copy();
				this.$entryCount++;
				if (ss.isNullOrUndefined(this.$mbr)) {
					this.$mbr = r.$copy();
				}
				else {
					this.$mbr.$add(r);
				}
			},
			$addEntryNoCopy: function(r, id) {
				this.$ids[this.$entryCount] = id;
				this.$entries[this.$entryCount] = r;
				this.$entryCount++;
				if (ss.isNullOrUndefined(this.$mbr)) {
					this.$mbr = r.$copy();
				}
				else {
					this.$mbr.$add(r);
				}
			},
			$findEntry: function(r, id) {
				for (var i = 0; i < this.$entryCount; i++) {
					if (id === this.$ids[i] && r.equals(this.$entries[i])) {
						return i;
					}
				}
				return -1;
			},
			$deleteEntry: function(i, minNodeEntries) {
				var lastIndex = this.$entryCount - 1;
				var deletedRectangle = this.$entries[i];
				this.$entries[i] = null;
				if (i !== lastIndex) {
					this.$entries[i] = this.$entries[lastIndex];
					this.$ids[i] = this.$ids[lastIndex];
					this.$entries[lastIndex] = null;
				}
				this.$entryCount--;
				// if there are at least minNodeEntries, adjust the MBR.
				// otherwise, don't bother, as the Node<T> will be 
				// eliminated anyway.
				if (this.$entryCount >= minNodeEntries) {
					this.$recalculateMBR(deletedRectangle);
				}
			},
			$recalculateMBR: function(deletedRectangle) {
				if (this.$mbr.$edgeOverlaps(deletedRectangle)) {
					this.$mbr.$set(this.$entries[0].$min, this.$entries[0].$max);
					for (var i = 1; i < this.$entryCount; i++) {
						this.$mbr.$add(this.$entries[i]);
					}
				}
			},
			getEntryCount: function() {
				return this.$entryCount;
			},
			getEntry: function(index) {
				if (index < this.$entryCount) {
					return this.$entries[index];
				}
				return null;
			},
			getId: function(index) {
				if (index < this.$entryCount) {
					return this.$ids[index];
				}
				return -1;
			},
			$reorganize: function(rtree) {
				var countdownIndex = rtree.$maxNodeEntries - 1;
				for (var index = 0; index < this.$entryCount; index++) {
					if (ss.isNullOrUndefined(this.$entries[index])) {
						while (ss.isNullOrUndefined(this.$entries[countdownIndex]) && countdownIndex > index) {
							countdownIndex--;
						}
						this.$entries[index] = this.$entries[countdownIndex];
						this.$ids[index] = this.$ids[countdownIndex];
						this.$entries[countdownIndex] = null;
					}
				}
			},
			$isLeaf: function() {
				return this.$level === 1;
			},
			getLevel: function() {
				return this.$level;
			},
			getMBR: function() {
				return this.$mbr;
			}
		}, function() {
			return null;
		}, function() {
			return [];
		});
		return $type;
	};
	$RTree_Node$1.__typeName = 'RTree.Node$1';
	ss.initGenericClass($RTree_Node$1, $asm, 1);
	global.RTree.Node$1 = $RTree_Node$1;
	////////////////////////////////////////////////////////////////////////////////
	// RTree.Point
	var $RTree_Point = function(x, y, z) {
		this.$coordinates = null;
		this.$coordinates = new Array($RTree_Point.$DIMENSIONS);
		this.$coordinates[0] = x;
		this.$coordinates[1] = y;
		this.$coordinates[2] = z;
	};
	$RTree_Point.__typeName = 'RTree.Point';
	global.RTree.Point = $RTree_Point;
	////////////////////////////////////////////////////////////////////////////////
	// RTree.Rectangle
	var $RTree_Rectangle = function(x1, y1) {
		this.$max = null;
		this.$min = null;
		this.$min = new Array($RTree_Rectangle.$DIMENSIONS);
		this.$max = new Array($RTree_Rectangle.$DIMENSIONS);
		this.$set$1(x1, y1, x1, y1, 1, 1);
	};
	$RTree_Rectangle.__typeName = 'RTree.Rectangle';
	$RTree_Rectangle.$ctor2 = function(x1, y1, x2, y2, z1, z2) {
		this.$max = null;
		this.$min = null;
		this.$min = new Array($RTree_Rectangle.$DIMENSIONS);
		this.$max = new Array($RTree_Rectangle.$DIMENSIONS);
		this.$set$1(x1, y1, x2, y2, z1, z2);
	};
	$RTree_Rectangle.$ctor1 = function(min, max) {
		this.$max = null;
		this.$min = null;
		if (min.length !== $RTree_Rectangle.$DIMENSIONS || max.length !== $RTree_Rectangle.$DIMENSIONS) {
			throw new ss.Exception('Error in Rectangle constructor: min and max arrays must be of length ' + $RTree_Rectangle.$DIMENSIONS);
		}
		this.$min = new Array($RTree_Rectangle.$DIMENSIONS);
		this.$max = new Array($RTree_Rectangle.$DIMENSIONS);
		this.$set(min, max);
	};
	global.RTree.Rectangle = $RTree_Rectangle;
	////////////////////////////////////////////////////////////////////////////////
	// RTree.RTree
	var $RTree_RTree$1 = function(T) {
		var $type = function() {
			this.$log = null;
			this.$deleteLog = null;
			this.$maxNodeEntries = 0;
			this.$minNodeEntries = 0;
			this.nodeMap = {};
			this.$entryStatus = null;
			this.$initialEntryStatus = null;
			this.$parents = new Array();
			this.$parentsEntry = new Array();
			this.$treeHeight = 1;
			this.$rootNodeId = 0;
			this.$msize = 0;
			this.$highestUsedNodeId = 0;
			this.$deletedNodeIds = new Array();
			this.$nearestIds = [];
			this.idsToItems = {};
			this.$itemsToIds = {};
			this.$idcounter = -2147483648;
			this.$oldRectangle = new $RTree_Rectangle.$ctor2(0, 0, 0, 0, 0, 0);
			this.$init();
		};
		$type.$ctor1 = function(MaxNodeEntries, MinNodeEntries) {
			this.$log = null;
			this.$deleteLog = null;
			this.$maxNodeEntries = 0;
			this.$minNodeEntries = 0;
			this.nodeMap = {};
			this.$entryStatus = null;
			this.$initialEntryStatus = null;
			this.$parents = new Array();
			this.$parentsEntry = new Array();
			this.$treeHeight = 1;
			this.$rootNodeId = 0;
			this.$msize = 0;
			this.$highestUsedNodeId = 0;
			this.$deletedNodeIds = new Array();
			this.$nearestIds = [];
			this.idsToItems = {};
			this.$itemsToIds = {};
			this.$idcounter = -2147483648;
			this.$oldRectangle = new $RTree_Rectangle.$ctor2(0, 0, 0, 0, 0, 0);
			this.$minNodeEntries = MinNodeEntries;
			this.$maxNodeEntries = MaxNodeEntries;
			this.$init();
		};
		ss.registerGenericClassInstance($type, $RTree_RTree$1, [T], {
			$init: function() {
				//initialize logs
				this.$log = $RTree_$LogManager.$getLogger(ss.getTypeFullName($type));
				this.$deleteLog = $RTree_$LogManager.$getLogger(ss.getTypeFullName($type) + '-delete');
				// Obviously a Node&lt;T&gt; with less than 2 entries cannot be split.
				// The Node&lt;T&gt; splitting algorithm will work with only 2 entries
				// per node, but will be inefficient.
				if (this.$maxNodeEntries < 2) {
					this.$log.$warn('Invalid MaxNodeEntries = ' + this.$maxNodeEntries + ' Resetting to default value of ' + $type.$defaulT_MAX_NODE_ENTRIES);
					this.$maxNodeEntries = $type.$defaulT_MAX_NODE_ENTRIES;
				}
				// The MinNodeEntries must be less than or equal to (int) (MaxNodeEntries / 2)
				if (this.$minNodeEntries < 1 || this.$minNodeEntries > ss.Int32.div(this.$maxNodeEntries, 2)) {
					this.$log.$warn('MinNodeEntries must be between 1 and MaxNodeEntries / 2');
					this.$minNodeEntries = ss.Int32.div(this.$maxNodeEntries, 2);
				}
				this.$entryStatus = new Array(this.$maxNodeEntries);
				this.$initialEntryStatus = new Array(this.$maxNodeEntries);
				for (var i = 0; i < this.$maxNodeEntries; i++) {
					this.$initialEntryStatus[i] = 1;
				}
				var root = new (ss.makeGenericType($RTree_Node$1, [T]))(this.$rootNodeId, 1, this.$maxNodeEntries);
				this.nodeMap[this.$rootNodeId] = root;
				this.$log.$info('init()  MaxNodeEntries = ' + this.$maxNodeEntries + ', MinNodeEntries = ' + this.$minNodeEntries);
			},
			add: function(r, item) {
				this.$idcounter++;
				var id = this.$idcounter;
				this.idsToItems[id] = item;
				this.$itemsToIds[item] = id;
				this.$add(r, id);
			},
			$add: function(r, id) {
				if (this.$log.get_$isDebugEnabled()) {
					this.$log.$debug('Adding rectangle ' + r + ', id ' + id);
				}
				this.$add$1(r.$copy(), id, 1);
				this.$msize++;
			},
			$add$1: function(r, id, level) {
				// I1 [Find position for new record] Invoke ChooseLeaf to select a 
				// leaf Node&lt;T&gt; L in which to place r
				var n = this.$chooseNode(r, level);
				var newLeaf = null;
				// I2 [Add record to leaf node] If L has room for another entry, 
				// install E. Otherwise invoke SplitNode to obtain L and LL containing
				// E and all the old entries of L
				if (n.$entryCount < this.$maxNodeEntries) {
					n.$addEntryNoCopy(r, id);
				}
				else {
					newLeaf = this.$splitNode(n, r, id);
				}
				// I3 [Propagate changes upwards] Invoke AdjustTree on L, also passing LL
				// if a split was performed
				var newNode = this.$adjustTree(n, newLeaf);
				// I4 [Grow tree taller] If Node&lt;T&gt; split propagation caused the root to 
				// split, create a new root whose children are the two resulting nodes.
				if (ss.isValue(newNode)) {
					var oldRootNodeId = this.$rootNodeId;
					var oldRoot = this.getNode(oldRootNodeId);
					this.$rootNodeId = this.$getNextNodeId();
					this.$treeHeight++;
					var root = new (ss.makeGenericType($RTree_Node$1, [T]))(this.$rootNodeId, this.$treeHeight, this.$maxNodeEntries);
					root.$addEntry(newNode.$mbr, newNode.$nodeId);
					root.$addEntry(oldRoot.$mbr, oldRoot.$nodeId);
					this.nodeMap[this.$rootNodeId] = root;
				}
				if ($type.$internaL_CONSISTENCY_CHECKING) {
					this.$checkConsistency(this.$rootNodeId, this.$treeHeight, null);
				}
			},
			delete$1: function(r, item) {
				var id = this.$itemsToIds[item];
				var success = this.$delete(r, id);
				if (success === true) {
					delete this.idsToItems[id];
					delete this.$itemsToIds[item];
				}
				return success;
			},
			$delete: function(r, id) {
				// FindLeaf algorithm inlined here. Note the "official" algorithm 
				// searches all overlapping entries. This seems inefficient to me, 
				// as an entry is only worth searching if it contains (NOT overlaps)
				// the rectangle we are searching for.
				//
				// Also the algorithm has been changed so that it is not recursive.
				// FL1 [Search subtrees] If root is not a leaf, check each entry 
				// to determine if it contains r. For each entry found, invoke
				// findLeaf on the Node&lt;T&gt; pointed to by the entry, until r is found or
				// all entries have been checked.
				ss.clear(this.$parents);
				this.$parents.push(this.$rootNodeId);
				ss.clear(this.$parentsEntry);
				this.$parentsEntry.push(-1);
				var n = null;
				var foundIndex = -1;
				// index of entry to be deleted in leaf
				while (foundIndex === -1 && this.$parents.length > 0) {
					n = this.getNode(ss.arrayPeekBack(this.$parents));
					var startIndex = ss.arrayPeekBack(this.$parentsEntry) + 1;
					if (!n.$isLeaf()) {
						this.$deleteLog.$debug('searching Node<T> ' + n.$nodeId + ', from index ' + startIndex);
						var contains = false;
						for (var i = startIndex; i < n.$entryCount; i++) {
							if (n.$entries[i].$contains(r)) {
								this.$parents.push(n.$ids[i]);
								this.$parentsEntry.pop();
								this.$parentsEntry.push(i);
								// this becomes the start index when the child has been searched
								this.$parentsEntry.push(-1);
								contains = true;
								break;
								// ie go to next iteration of while()
							}
						}
						if (contains) {
							continue;
						}
					}
					else {
						foundIndex = n.$findEntry(r, id);
					}
					this.$parents.pop();
					this.$parentsEntry.pop();
				}
				// while not found
				if (foundIndex !== -1) {
					n.$deleteEntry(foundIndex, this.$minNodeEntries);
					this.$condenseTree(n);
					this.$msize--;
				}
				// shrink the tree if possible (i.e. if root Node&lt;T%gt; has exactly one entry,and that 
				// entry is not a leaf node, delete the root (it's entry becomes the new root)
				var root = this.getNode(this.$rootNodeId);
				while (root.$entryCount === 1 && this.$treeHeight > 1) {
					root.$entryCount = 0;
					this.$rootNodeId = root.$ids[0];
					this.$treeHeight--;
					root = this.getNode(this.$rootNodeId);
				}
				return foundIndex !== -1;
			},
			nearest: function(p, furthestDistance) {
				var retval = [];
				this.$nearest$1(p, ss.mkdel(this, function(id) {
					ss.add(retval, this.idsToItems[id]);
				}), furthestDistance);
				return retval;
			},
			$nearest$1: function(p, v, furthestDistance) {
				var rootNode = this.getNode(this.$rootNodeId);
				this.$nearest(p, rootNode, furthestDistance);
				for (var $t1 = 0; $t1 < this.$nearestIds.length; $t1++) {
					var id = this.$nearestIds[$t1];
					v(id);
				}
				ss.clear(this.$nearestIds);
			},
			intersects: function(r) {
				var retval = [];
				this.$intersects(r, ss.mkdel(this, function(id) {
					ss.add(retval, this.idsToItems[id]);
				}));
				return retval;
			},
			$intersects: function(r, v) {
				var rootNode = this.getNode(this.$rootNodeId);
				this.$intersects$1(r, v, rootNode);
			},
			contains: function(r) {
				var retval = [];
				this.$contains(r, ss.mkdel(this, function(id) {
					ss.add(retval, this.idsToItems[id]);
				}));
				return retval;
			},
			$contains: function(r, v) {
				// find all rectangles in the tree that are contained by the passed rectangle
				// written to be non-recursive (should model other searches on this?)
				ss.clear(this.$parents);
				this.$parents.push(this.$rootNodeId);
				ss.clear(this.$parentsEntry);
				this.$parentsEntry.push(-1);
				// TODO: possible shortcut here - could test for intersection with the 
				// MBR of the root node. If no intersection, return immediately.
				while (this.$parents.length > 0) {
					var n = this.getNode(ss.arrayPeekBack(this.$parents));
					var startIndex = ss.arrayPeekBack(this.$parentsEntry) + 1;
					if (!n.$isLeaf()) {
						// go through every entry in the index Node<T> to check
						// if it intersects the passed rectangle. If so, it 
						// could contain entries that are contained.
						var intersects = false;
						for (var i = startIndex; i < n.$entryCount; i++) {
							if (r.intersects(n.$entries[i])) {
								this.$parents.push(n.$ids[i]);
								this.$parentsEntry.pop();
								this.$parentsEntry.push(i);
								// this becomes the start index when the child has been searched
								this.$parentsEntry.push(-1);
								intersects = true;
								break;
								// ie go to next iteration of while()
							}
						}
						if (intersects) {
							continue;
						}
					}
					else {
						// go through every entry in the leaf to check if 
						// it is contained by the passed rectangle
						for (var i1 = 0; i1 < n.$entryCount; i1++) {
							if (r.$contains(n.$entries[i1])) {
								v(n.$ids[i1]);
							}
						}
					}
					this.$parents.pop();
					this.$parentsEntry.pop();
				}
			},
			getBounds: function() {
				var bounds = null;
				var n = this.getNode(this.getRootNodeId());
				if (ss.isValue(n) && ss.isValue(n.getMBR())) {
					bounds = n.getMBR().$copy();
				}
				return bounds;
			},
			getVersion: function() {
				return 'RTree-1.0b2p1';
			},
			$getNextNodeId: function() {
				var nextNodeId = 0;
				if (this.$deletedNodeIds.length > 0) {
					nextNodeId = this.$deletedNodeIds.pop();
				}
				else {
					nextNodeId = 1 + this.$highestUsedNodeId++;
				}
				return nextNodeId;
			},
			getNode: function(index) {
				return this.nodeMap[index];
			},
			$getHighestUsedNodeId: function() {
				return this.$highestUsedNodeId;
			},
			getRootNodeId: function() {
				return this.$rootNodeId;
			},
			$splitNode: function(n, newRect, newId) {
				// [Pick first entry for each group] Apply algorithm pickSeeds to 
				// choose two entries to be the first elements of the groups. Assign
				// each to a group.
				// debug code
				var initialArea = 0;
				if (this.$log.get_$isDebugEnabled()) {
					var union = n.$mbr.$union(newRect);
					initialArea = union.$area();
				}
				for (var i = 0; i < this.$maxNodeEntries; i++) {
					this.$entryStatus[i] = this.$initialEntryStatus[i];
				}
				var newNode = null;
				newNode = new (ss.makeGenericType($RTree_Node$1, [T]))(this.$getNextNodeId(), n.$level, this.$maxNodeEntries);
				this.nodeMap[newNode.$nodeId] = newNode;
				this.$pickSeeds(n, newRect, newId, newNode);
				// this also sets the entryCount to 1
				// [Check if done] If all entries have been assigned, stop. If one
				// group has so few entries that all the rest must be assigned to it in 
				// order for it to have the minimum number m, assign them and stop. 
				while (n.$entryCount + newNode.$entryCount < this.$maxNodeEntries + 1) {
					if (this.$maxNodeEntries + 1 - newNode.$entryCount === this.$minNodeEntries) {
						// assign all remaining entries to original node
						for (var i1 = 0; i1 < this.$maxNodeEntries; i1++) {
							if (this.$entryStatus[i1] === $type.$entrY_STATUS_UNASSIGNED) {
								this.$entryStatus[i1] = 0;
								n.$mbr.$add(n.$entries[i1]);
								n.$entryCount++;
							}
						}
						break;
					}
					if (this.$maxNodeEntries + 1 - n.$entryCount === this.$minNodeEntries) {
						// assign all remaining entries to new node
						for (var i2 = 0; i2 < this.$maxNodeEntries; i2++) {
							if (this.$entryStatus[i2] === $type.$entrY_STATUS_UNASSIGNED) {
								this.$entryStatus[i2] = 0;
								newNode.$addEntryNoCopy(n.$entries[i2], n.$ids[i2]);
								n.$entries[i2] = null;
							}
						}
						break;
					}
					// [Select entry to assign] Invoke algorithm pickNext to choose the
					// next entry to assign. Add it to the group whose covering rectangle 
					// will have to be enlarged least to accommodate it. Resolve ties
					// by adding the entry to the group with smaller area, then to the 
					// the one with fewer entries, then to either. Repeat from S2
					this.$pickNext(n, newNode);
				}
				n.$reorganize(this);
				// check that the MBR stored for each Node&lt;T&gt; is correct.
				if ($type.$internaL_CONSISTENCY_CHECKING) {
					if (!n.$mbr.equals(this.$calculateMBR(n))) {
						this.$log.$error('Error: splitNode old Node<T> MBR wrong');
					}
					if (!newNode.$mbr.equals(this.$calculateMBR(newNode))) {
						this.$log.$error('Error: splitNode new Node<T> MBR wrong');
					}
				}
				// debug code
				if (this.$log.get_$isDebugEnabled()) {
					var newArea = n.$mbr.$area() + newNode.$mbr.$area();
					var percentageIncrease = 100 * (newArea - initialArea) / initialArea;
					this.$log.$debug('Node ' + n.$nodeId + ' split. New area increased by ' + percentageIncrease + '%');
				}
				return newNode;
			},
			$pickSeeds: function(n, newRect, newId, newNode) {
				// Find extreme rectangles along all dimension. Along each dimension,
				// find the entry whose rectangle has the highest low side, and the one 
				// with the lowest high side. Record the separation.
				var maxNormalizedSeparation = 0;
				var highestLowIndex = 0;
				var lowestHighIndex = 0;
				// for the purposes of picking seeds, take the MBR of the Node&lt;T&gt; to include
				// the new rectangle aswell.
				n.$mbr.$add(newRect);
				if (this.$log.get_$isDebugEnabled()) {
					this.$log.$debug('pickSeeds(): NodeId = ' + n.$nodeId + ', newRect = ' + newRect);
				}
				for (var d = 0; d < $RTree_Rectangle.$DIMENSIONS; d++) {
					var tempHighestLow = newRect.$min[d];
					var tempHighestLowIndex = -1;
					// -1 indicates the new rectangle is the seed
					var tempLowestHigh = newRect.$max[d];
					var tempLowestHighIndex = -1;
					for (var i = 0; i < n.$entryCount; i++) {
						var tempLow = n.$entries[i].$min[d];
						if (tempLow >= tempHighestLow) {
							tempHighestLow = tempLow;
							tempHighestLowIndex = i;
						}
						else {
							// ensure that the same index cannot be both lowestHigh and highestLow
							var tempHigh = n.$entries[i].$max[d];
							if (tempHigh <= tempLowestHigh) {
								tempLowestHigh = tempHigh;
								tempLowestHighIndex = i;
							}
						}
						// PS2 [Adjust for shape of the rectangle cluster] Normalize the separations
						// by dividing by the widths of the entire set along the corresponding
						// dimension
						var normalizedSeparation = (tempHighestLow - tempLowestHigh) / (n.$mbr.$max[d] - n.$mbr.$min[d]);
						if (normalizedSeparation > 1 || normalizedSeparation < -1) {
							this.$log.$error('Invalid normalized separation');
						}
						if (this.$log.get_$isDebugEnabled()) {
							this.$log.$debug('Entry ' + i + ', dimension ' + d + ': HighestLow = ' + tempHighestLow + ' (index ' + tempHighestLowIndex + ')' + ', LowestHigh = ' + tempLowestHigh + ' (index ' + tempLowestHighIndex + ', NormalizedSeparation = ' + normalizedSeparation);
						}
						// PS3 [Select the most extreme pair] Choose the pair with the greatest
						// normalized separation along any dimension.
						if (normalizedSeparation > maxNormalizedSeparation) {
							maxNormalizedSeparation = normalizedSeparation;
							highestLowIndex = tempHighestLowIndex;
							lowestHighIndex = tempLowestHighIndex;
						}
					}
				}
				// highestLowIndex is the seed for the new node.
				if (highestLowIndex === -1) {
					newNode.$addEntry(newRect, newId);
				}
				else {
					newNode.$addEntryNoCopy(n.$entries[highestLowIndex], n.$ids[highestLowIndex]);
					n.$entries[highestLowIndex] = null;
					// move the new rectangle into the space vacated by the seed for the new node
					n.$entries[highestLowIndex] = newRect;
					n.$ids[highestLowIndex] = newId;
				}
				// lowestHighIndex is the seed for the original node. 
				if (lowestHighIndex === -1) {
					lowestHighIndex = highestLowIndex;
				}
				this.$entryStatus[lowestHighIndex] = 0;
				n.$entryCount = 1;
				n.$mbr.$set(n.$entries[lowestHighIndex].$min, n.$entries[lowestHighIndex].$max);
			},
			$pickNext: function(n, newNode) {
				var maxDifference = Number.NEGATIVE_INFINITY;
				var next = 0;
				var nextGroup = 0;
				maxDifference = Number.NEGATIVE_INFINITY;
				if (this.$log.get_$isDebugEnabled()) {
					this.$log.$debug('pickNext()');
				}
				for (var i = 0; i < this.$maxNodeEntries; i++) {
					if (this.$entryStatus[i] === $type.$entrY_STATUS_UNASSIGNED) {
						if (ss.isNullOrUndefined(n.$entries[i])) {
							this.$log.$error('Error: Node<T> ' + n.$nodeId + ', entry ' + i + ' is null');
						}
						var nIncrease = n.$mbr.$enlargement(n.$entries[i]);
						var newNodeIncrease = newNode.$mbr.$enlargement(n.$entries[i]);
						var difference = Math.abs(nIncrease - newNodeIncrease);
						if (difference > maxDifference) {
							next = i;
							if (nIncrease < newNodeIncrease) {
								nextGroup = 0;
							}
							else if (newNodeIncrease < nIncrease) {
								nextGroup = 1;
							}
							else if (n.$mbr.$area() < newNode.$mbr.$area()) {
								nextGroup = 0;
							}
							else if (newNode.$mbr.$area() < n.$mbr.$area()) {
								nextGroup = 1;
							}
							else if (newNode.$entryCount < ss.Int32.div(this.$maxNodeEntries, 2)) {
								nextGroup = 0;
							}
							else {
								nextGroup = 1;
							}
							maxDifference = difference;
						}
						if (this.$log.get_$isDebugEnabled()) {
							this.$log.$debug('Entry ' + i + ' group0 increase = ' + nIncrease + ', group1 increase = ' + newNodeIncrease + ', diff = ' + difference + ', MaxDiff = ' + maxDifference + ' (entry ' + next + ')');
						}
					}
				}
				this.$entryStatus[next] = 0;
				if (nextGroup === 0) {
					n.$mbr.$add(n.$entries[next]);
					n.$entryCount++;
				}
				else {
					// move to new node.
					newNode.$addEntryNoCopy(n.$entries[next], n.$ids[next]);
					n.$entries[next] = null;
				}
				return next;
			},
			$nearest: function(p, n, nearestDistance) {
				for (var i = 0; i < n.$entryCount; i++) {
					var tempDistance = n.$entries[i].$distance(p);
					if (n.$isLeaf()) {
						// for leaves, the distance is an actual nearest distance 
						if (tempDistance < nearestDistance) {
							//                        nearestDistance = tempDistance;
							//                        nearestIds.Clear();
						}
						if (tempDistance <= nearestDistance) {
							ss.add(this.$nearestIds, n.$ids[i]);
						}
					}
					else {
						// for index nodes, only go into them if they potentially could have
						// a rectangle nearer than actualNearest
						if (tempDistance <= nearestDistance) {
							// search the child node
							nearestDistance = this.$nearest(p, this.getNode(n.$ids[i]), nearestDistance);
						}
					}
				}
				return nearestDistance;
			},
			$intersects$1: function(r, v, n) {
				for (var i = 0; i < n.$entryCount; i++) {
					if (r.intersects(n.$entries[i])) {
						if (n.$isLeaf()) {
							v(n.$ids[i]);
						}
						else {
							var childNode = this.getNode(n.$ids[i]);
							this.$intersects$1(r, v, childNode);
						}
					}
				}
			},
			$condenseTree: function(l) {
				// CT1 [Initialize] Set n=l. Set the list of eliminated
				// nodes to be empty.
				var n = l;
				var parent = null;
				var parentEntry = 0;
				//TIntStack eliminatedNodeIds = new TIntStack();
				var eliminatedNodeIds = new Array();
				// CT2 [Find parent entry] If N is the root, go to CT6. Otherwise 
				// let P be the parent of N, and let En be N's entry in P  
				while (n.$level !== this.$treeHeight) {
					parent = this.getNode(this.$parents.pop());
					parentEntry = this.$parentsEntry.pop();
					// CT3 [Eliminiate under-full node] If N has too few entries,
					// delete En from P and add N to the list of eliminated nodes
					if (n.$entryCount < this.$minNodeEntries) {
						parent.$deleteEntry(parentEntry, this.$minNodeEntries);
						eliminatedNodeIds.push(n.$nodeId);
					}
					else {
						// CT4 [Adjust covering rectangle] If N has not been eliminated,
						// adjust EnI to tightly contain all entries in N
						if (!n.$mbr.equals(parent.$entries[parentEntry])) {
							this.$oldRectangle.$set(parent.$entries[parentEntry].$min, parent.$entries[parentEntry].$max);
							parent.$entries[parentEntry].$set(n.$mbr.$min, n.$mbr.$max);
							parent.$recalculateMBR(this.$oldRectangle);
						}
					}
					// CT5 [Move up one level in tree] Set N=P and repeat from CT2
					n = parent;
				}
				// CT6 [Reinsert orphaned entries] Reinsert all entries of nodes in set Q.
				// Entries from eliminated leaf nodes are reinserted in tree leaves as in 
				// Insert(), but entries from higher level nodes must be placed higher in 
				// the tree, so that leaves of their dependent subtrees will be on the same
				// level as leaves of the main tree
				while (eliminatedNodeIds.length > 0) {
					var e = this.getNode(eliminatedNodeIds.pop());
					for (var j = 0; j < e.$entryCount; j++) {
						this.$add$1(e.$entries[j], e.$ids[j], e.$level);
						e.$entries[j] = null;
					}
					e.$entryCount = 0;
					delete this.nodeMap[e.$nodeId];
					this.$deletedNodeIds.push(e.$nodeId);
				}
			},
			$chooseNode: function(r, level) {
				// CL1 [Initialize] Set N to be the root node
				var n = this.getNode(this.$rootNodeId);
				ss.clear(this.$parents);
				ss.clear(this.$parentsEntry);
				// CL2 [Leaf check] If N is a leaf, return N
				while (true) {
					if (ss.isNullOrUndefined(n)) {
						this.$log.$error('Could not get root Node<T> (' + this.$rootNodeId + ')');
					}
					if (n.$level === level) {
						return n;
					}
					// CL3 [Choose subtree] If N is not at the desired level, let F be the entry in N 
					// whose rectangle FI needs least enlargement to include EI. Resolve
					// ties by choosing the entry with the rectangle of smaller area.
					var leastEnlargement = n.getEntry(0).$enlargement(r);
					var index = 0;
					// index of rectangle in subtree
					for (var i = 1; i < n.$entryCount; i++) {
						var tempRectangle = n.getEntry(i);
						var tempEnlargement = tempRectangle.$enlargement(r);
						if (tempEnlargement < leastEnlargement || tempEnlargement === leastEnlargement && tempRectangle.$area() < n.getEntry(index).$area()) {
							index = i;
							leastEnlargement = tempEnlargement;
						}
					}
					this.$parents.push(n.$nodeId);
					this.$parentsEntry.push(index);
					// CL4 [Descend until a leaf is reached] Set N to be the child Node&lt;T&gt; 
					// pointed to by Fp and repeat from CL2
					n = this.getNode(n.$ids[index]);
				}
			},
			$adjustTree: function(n, nn) {
				// AT1 [Initialize] Set N=L. If L was split previously, set NN to be 
				// the resulting second node.
				// AT2 [Check if done] If N is the root, stop
				while (n.$level !== this.$treeHeight) {
					// AT3 [Adjust covering rectangle in parent entry] Let P be the parent 
					// Node<T> of N, and let En be N's entry in P. Adjust EnI so that it tightly
					// encloses all entry rectangles in N.
					var parent = this.getNode(this.$parents.pop());
					var entry = this.$parentsEntry.pop();
					if (parent.$ids[entry] !== n.$nodeId) {
						this.$log.$error('Error: entry ' + entry + ' in Node<T> ' + parent.$nodeId + ' should point to Node<T> ' + n.$nodeId + '; actually points to Node<T> ' + parent.$ids[entry]);
					}
					if (!parent.$entries[entry].equals(n.$mbr)) {
						parent.$entries[entry].$set(n.$mbr.$min, n.$mbr.$max);
						parent.$mbr.$set(parent.$entries[0].$min, parent.$entries[0].$max);
						for (var i = 1; i < parent.$entryCount; i++) {
							parent.$mbr.$add(parent.$entries[i]);
						}
					}
					// AT4 [Propagate Node<T> split upward] If N has a partner NN resulting from 
					// an earlier split, create a new entry Enn with Ennp pointing to NN and 
					// Enni enclosing all rectangles in NN. Add Enn to P if there is room. 
					// Otherwise, invoke splitNode to produce P and PP containing Enn and
					// all P's old entries.
					var newNode = null;
					if (ss.isValue(nn)) {
						if (parent.$entryCount < this.$maxNodeEntries) {
							parent.$addEntry(nn.$mbr, nn.$nodeId);
						}
						else {
							newNode = this.$splitNode(parent, nn.$mbr.$copy(), nn.$nodeId);
						}
					}
					// AT5 [Move up to next level] Set N = P and set NN = PP if a split 
					// occurred. Repeat from AT2
					n = parent;
					nn = newNode;
					parent = null;
					newNode = null;
				}
				return nn;
			},
			$checkConsistency: function(nodeId, expectedLevel, expectedMBR) {
				// go through the tree, and check that the internal data structures of 
				// the tree are not corrupted.    
				var n = this.getNode(nodeId);
				if (ss.isNullOrUndefined(n)) {
					this.$log.$error('Error: Could not read Node<T> ' + nodeId);
				}
				if (n.$level !== expectedLevel) {
					this.$log.$error('Error: Node<T> ' + nodeId + ', expected level ' + expectedLevel + ', actual level ' + n.$level);
				}
				var calculatedMBR = this.$calculateMBR(n);
				if (!n.$mbr.equals(calculatedMBR)) {
					this.$log.$error('Error: Node<T> ' + nodeId + ', calculated MBR does not equal stored MBR');
				}
				if (ss.isValue(expectedMBR) && !n.$mbr.equals(expectedMBR)) {
					this.$log.$error('Error: Node<T> ' + nodeId + ', expected MBR (from parent) does not equal stored MBR');
				}
				// Check for corruption where a parent entry is the same object as the child MBR
				if (ss.isValue(expectedMBR) && n.$mbr.$sameObject(expectedMBR)) {
					this.$log.$error('Error: Node<T> ' + nodeId + " MBR using same rectangle object as parent's entry");
				}
				for (var i = 0; i < n.$entryCount; i++) {
					if (ss.isNullOrUndefined(n.$entries[i])) {
						this.$log.$error('Error: Node<T> ' + nodeId + ', Entry ' + i + ' is null');
					}
					if (n.$level > 1) {
						// if not a leaf
						this.$checkConsistency(n.$ids[i], n.$level - 1, n.$entries[i]);
					}
				}
			},
			$calculateMBR: function(n) {
				var mbr = new $RTree_Rectangle.$ctor1(n.$entries[0].$min, n.$entries[0].$max);
				for (var i = 1; i < n.$entryCount; i++) {
					mbr.$add(n.$entries[i]);
				}
				return mbr;
			},
			get_count: function() {
				return this.$msize;
			}
		}, function() {
			return null;
		}, function() {
			return [];
		});
		$type.$ctor1.prototype = $type.prototype;
		$type.$version = '1.0b2p1';
		$type.$defaulT_MAX_NODE_ENTRIES = 10;
		$type.$internaL_CONSISTENCY_CHECKING = false;
		$type.$entrY_STATUS_ASSIGNED = 0;
		$type.$entrY_STATUS_UNASSIGNED = 1;
		return $type;
	};
	$RTree_RTree$1.__typeName = 'RTree.RTree$1';
	ss.initGenericClass($RTree_RTree$1, $asm, 1);
	global.RTree.RTree$1 = $RTree_RTree$1;
	ss.initInterface($RTree_$ILog, $asm, { $error: null, $info: null, $warn: null, $debug: null, get_$isDebugEnabled: null, set_$isDebugEnabled: null });
	ss.initClass($RTree_$Log, $asm, {
		$error: function(p0) {
		},
		$info: function(s) {
		},
		$warn: function(p0) {
		},
		$debug: function(s) {
		},
		get_$isDebugEnabled: function() {
			return this.$1$IsDebugEnabledField;
		},
		set_$isDebugEnabled: function(value) {
			this.$1$IsDebugEnabledField = value;
		}
	}, null, [$RTree_$ILog]);
	ss.initClass($RTree_$LogManager, $asm, {});
	ss.initClass($RTree_Point, $asm, {});
	ss.initClass($RTree_Rectangle, $asm, {
		get_x: function() {
			return this.$min[0];
		},
		get_y: function() {
			return this.$min[1];
		},
		get_width: function() {
			return this.$max[0] - this.$min[0];
		},
		get_height: function() {
			return this.$max[1] - this.$min[1];
		},
		$set$1: function(x1, y1, x2, y2, z1, z2) {
			this.$min[0] = Math.min(x1, x2);
			this.$min[1] = Math.min(y1, y2);
			this.$min[2] = Math.min(z1, z2);
			this.$max[0] = Math.max(x1, x2);
			this.$max[1] = Math.max(y1, y2);
			this.$max[2] = Math.max(z1, z2);
		},
		$set: function(min, max) {
			this.$min[0] = min[0];
			this.$min[1] = min[1];
			this.$min[2] = min[2];
			this.$max[0] = max[0];
			this.$max[1] = max[1];
			this.$max[2] = max[2];
		},
		$copy: function() {
			return new $RTree_Rectangle.$ctor1(this.$min, this.$max);
		},
		$edgeOverlaps: function(r) {
			for (var i = 0; i < $RTree_Rectangle.$DIMENSIONS; i++) {
				if (this.$min[i] === r.$min[i] || this.$max[i] === r.$max[i]) {
					return true;
				}
			}
			return false;
		},
		intersects: function(r) {
			// Every dimension must intersect. If any dimension
			// does not intersect, return false immediately.
			for (var i = 0; i < $RTree_Rectangle.$DIMENSIONS; i++) {
				if (this.$max[i] < r.$min[i] || this.$min[i] > r.$max[i]) {
					return false;
				}
			}
			return true;
		},
		$contains: function(r) {
			for (var i = 0; i < $RTree_Rectangle.$DIMENSIONS; i++) {
				if (this.$max[i] < r.$max[i] || this.$min[i] > r.$min[i]) {
					return false;
				}
			}
			return true;
		},
		$containedBy: function(r) {
			for (var i = 0; i < $RTree_Rectangle.$DIMENSIONS; i++) {
				if (this.$max[i] > r.$max[i] || this.$min[i] < r.$min[i]) {
					return false;
				}
			}
			return true;
		},
		$distance: function(p) {
			var distanceSquared = 0;
			for (var i = 0; i < $RTree_Rectangle.$DIMENSIONS; i++) {
				var greatestMin = Math.max(this.$min[i], p.$coordinates[i]);
				var leastMax = Math.min(this.$max[i], p.$coordinates[i]);
				if (greatestMin > leastMax) {
					distanceSquared += (greatestMin - leastMax) * (greatestMin - leastMax);
				}
			}
			return Math.sqrt(distanceSquared);
		},
		$distance$1: function(r) {
			var distanceSquared = 0;
			for (var i = 0; i < $RTree_Rectangle.$DIMENSIONS; i++) {
				var greatestMin = Math.max(this.$min[i], r.$min[i]);
				var leastMax = Math.min(this.$max[i], r.$max[i]);
				if (greatestMin > leastMax) {
					distanceSquared += (greatestMin - leastMax) * (greatestMin - leastMax);
				}
			}
			return Math.sqrt(distanceSquared);
		},
		$distanceSquared: function(dimension, point) {
			var distanceSquared = 0;
			var tempDistance = point - this.$max[dimension];
			for (var i = 0; i < 2; i++) {
				if (tempDistance > 0) {
					distanceSquared = tempDistance * tempDistance;
					break;
				}
				tempDistance = this.$min[dimension] - point;
			}
			return distanceSquared;
		},
		$furthestDistance: function(r) {
			var distanceSquared = 0;
			for (var i = 0; i < $RTree_Rectangle.$DIMENSIONS; i++) {
				distanceSquared += Math.max(r.$min[i], r.$max[i]);
				//distanceSquared += Math.Max(distanceSquared(i, r.min[i]), distanceSquared(i, r.max[i]));
			}
			return Math.sqrt(distanceSquared);
		},
		$enlargement: function(r) {
			var enlargedArea = (Math.max(this.$max[0], r.$max[0]) - Math.min(this.$min[0], r.$min[0])) * (Math.max(this.$max[1], r.$max[1]) - Math.min(this.$min[1], r.$min[1]));
			return enlargedArea - this.$area();
		},
		$area: function() {
			return (this.$max[0] - this.$min[0]) * (this.$max[1] - this.$min[1]);
		},
		$add: function(r) {
			for (var i = 0; i < $RTree_Rectangle.$DIMENSIONS; i++) {
				if (r.$min[i] < this.$min[i]) {
					this.$min[i] = r.$min[i];
				}
				if (r.$max[i] > this.$max[i]) {
					this.$max[i] = r.$max[i];
				}
			}
		},
		$union: function(r) {
			var union = this.$copy();
			union.$add(r);
			return union;
		},
		$compareArrays: function(a1, a2) {
			if (ss.isNullOrUndefined(a1) || ss.isNullOrUndefined(a2)) {
				return false;
			}
			if (a1.length !== a2.length) {
				return false;
			}
			for (var i = 0; i < a1.length; i++) {
				if (a1[i] !== a2[i]) {
					return false;
				}
			}
			return true;
		},
		equals: function(obj) {
			var equals = false;
			if (ss.referenceEquals(ss.getInstanceType(obj), $RTree_Rectangle)) {
				var r = ss.cast(obj, $RTree_Rectangle);
				if (this.$compareArrays(r.$min, this.$min) && this.$compareArrays(r.$max, this.$max)) {
					equals = true;
				}
			}
			return equals;
		},
		$sameObject: function(o) {
			return this === o;
		},
		toString: function() {
			var sb = new ss.StringBuilder();
			// min coordinates
			sb.appendChar(40);
			for (var i = 0; i < $RTree_Rectangle.$DIMENSIONS; i++) {
				if (i > 0) {
					sb.append(', ');
				}
				sb.append(this.$min[i]);
			}
			sb.append('), (');
			// max coordinates
			for (var i1 = 0; i1 < $RTree_Rectangle.$DIMENSIONS; i1++) {
				if (i1 > 0) {
					sb.append(', ');
				}
				sb.append(this.$max[i1]);
			}
			sb.appendChar(41);
			return sb.toString();
		}
	});
	$RTree_Rectangle.$ctor2.prototype = $RTree_Rectangle.$ctor1.prototype = $RTree_Rectangle.prototype;
	$RTree_Point.$DIMENSIONS = 3;
	$RTree_Rectangle.$DIMENSIONS = 3;
})();
