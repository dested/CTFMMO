(function() {
	'use strict';
	var $asm = {};
	global.CTFMMO = global.CTFMMO || {};
	global.CTFMMO.Common = global.CTFMMO.Common || {};
	ss.initAssembly($asm, 'CTFMMO.Common');
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Common.EnumerableExtensions
	var $CTFMMO_Common_EnumerableExtensions = function() {
	};
	$CTFMMO_Common_EnumerableExtensions.__typeName = 'CTFMMO.Common.EnumerableExtensions';
	$CTFMMO_Common_EnumerableExtensions.last = function(T) {
		return function(items) {
			var last = ss.getDefaultValue(T);
			var $t1 = ss.getEnumerator(items);
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					last = item;
				}
			}
			finally {
				$t1.dispose();
			}
			return last;
		};
	};
	$CTFMMO_Common_EnumerableExtensions.first = function(T) {
		return function(items) {
			var $t1 = ss.getEnumerator(items);
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					return item;
				}
			}
			finally {
				$t1.dispose();
			}
			return ss.getDefaultValue(T);
		};
	};
	$CTFMMO_Common_EnumerableExtensions.groupBy = function(T, T2) {
		return function(items, predicate) {
			var ts = new (ss.makeGenericType(ss.Dictionary$2, [T2, Array]))();
			var $t1 = ss.getEnumerator(items);
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					var j = predicate(item);
					if (!ts.containsKey(j)) {
						ts.add(j, []);
					}
					ss.add(ts.get_item(j), item);
				}
			}
			finally {
				$t1.dispose();
			}
			var ritems = [];
			var $t2 = ts.getEnumerator();
			try {
				while ($t2.moveNext()) {
					var t = $t2.current();
					ss.add(ritems, new (ss.makeGenericType($CTFMMO_Common_EnumerableExtensions$GroupByItem$2, [T, T2]))(t.key, t.value));
				}
			}
			finally {
				$t2.dispose();
			}
			return ritems;
		};
	};
	$CTFMMO_Common_EnumerableExtensions.first$1 = function(T) {
		return function(items, predicate) {
			var $t1 = ss.getEnumerator(items);
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					if (predicate(item)) {
						return item;
					}
				}
			}
			finally {
				$t1.dispose();
			}
			return ss.getDefaultValue(T);
		};
	};
	$CTFMMO_Common_EnumerableExtensions.toArray = function(T) {
		return function(items) {
			var ts = [];
			var $t1 = ss.getEnumerator(items);
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					ss.add(ts, item);
				}
			}
			finally {
				$t1.dispose();
			}
			return Array.prototype.slice.call(ts);
		};
	};
	$CTFMMO_Common_EnumerableExtensions.select$1 = function(T, T2) {
		return function(items, clause) {
			var items2 = [];
			for (var $t1 = 0; $t1 < items.length; $t1++) {
				var item = items[$t1];
				ss.add(items2, clause(item));
			}
			return Array.prototype.slice.call(items2);
		};
	};
	$CTFMMO_Common_EnumerableExtensions.selectMany = function(T, T2) {
		return function(items, clause) {
			var items2 = [];
			for (var $t1 = 0; $t1 < items.length; $t1++) {
				var item = items[$t1];
				ss.arrayAddRange(items2, clause(item));
			}
			return items2;
		};
	};
	$CTFMMO_Common_EnumerableExtensions.count$1 = function(T) {
		return function(items, clause) {
			var j = 0;
			for (var $t1 = 0; $t1 < items.length; $t1++) {
				var item = items[$t1];
				if (clause(item)) {
					j++;
				}
			}
			return j;
		};
	};
	$CTFMMO_Common_EnumerableExtensions.elementAt = function(T) {
		return function(items, index) {
			var i = 0;
			var $t1 = ss.getEnumerator(items);
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					if (i === index) {
						return item;
					}
					i++;
				}
			}
			finally {
				$t1.dispose();
			}
			return ss.getDefaultValue(T);
		};
	};
	$CTFMMO_Common_EnumerableExtensions.indexOfFast = function(items, ind) {
		for (var index = 0; index < items.length; index++) {
			var item = items[index];
			if (item === ind) {
				return index;
			}
		}
		return -1;
	};
	$CTFMMO_Common_EnumerableExtensions.indexOfFast$1 = function(items, ind) {
		for (var index = 0; index < items.length; index++) {
			var item = items[index];
			if (item === ind) {
				return index;
			}
		}
		return -1;
	};
	$CTFMMO_Common_EnumerableExtensions.where$1 = function(T) {
		return function(items, clause) {
			var items2 = [];
			for (var $t1 = 0; $t1 < items.length; $t1++) {
				var item = items[$t1];
				if (clause(item)) {
					ss.add(items2, item);
				}
			}
			return Array.prototype.slice.call(items2);
		};
	};
	$CTFMMO_Common_EnumerableExtensions.orderBy$1 = function(T, T2) {
		return function(items, clause) {
			var j = ss.arrayClone(items);
			j.sort(function(a, b) {
				return ss.compare(clause(a), clause(b));
			});
			return j;
		};
	};
	$CTFMMO_Common_EnumerableExtensions.orderBy = function(T, T2) {
		return function(items, clause) {
			var j = ss.arrayClone(items);
			j.sort(function(a, b) {
				return ss.compare(clause(a), clause(b));
			});
			return Array.prototype.slice.call(j);
		};
	};
	$CTFMMO_Common_EnumerableExtensions.first$2 = function(T) {
		return function(items, clause) {
			for (var $t1 = 0; $t1 < items.length; $t1++) {
				var item = items[$t1];
				if (clause(item)) {
					return item;
				}
			}
			return ss.getDefaultValue(T);
		};
	};
	$CTFMMO_Common_EnumerableExtensions.all$1 = function(T) {
		return function(items, clause) {
			for (var $t1 = 0; $t1 < items.length; $t1++) {
				var item = items[$t1];
				if (!clause(item)) {
					return false;
				}
			}
			return true;
		};
	};
	$CTFMMO_Common_EnumerableExtensions.all = function(T) {
		return function(items, clause) {
			for (var $t1 = 0; $t1 < items.length; $t1++) {
				var item = items[$t1];
				if (!clause(item)) {
					return false;
				}
			}
			return true;
		};
	};
	$CTFMMO_Common_EnumerableExtensions.any = function(T) {
		return function(items, clause) {
			var $t1 = ss.getEnumerator(items);
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					if (clause(item)) {
						return true;
					}
				}
			}
			finally {
				$t1.dispose();
			}
			return false;
		};
	};
	$CTFMMO_Common_EnumerableExtensions.any$1 = function(T) {
		return function(items, clause) {
			for (var $t1 = 0; $t1 < items.length; $t1++) {
				var item = items[$t1];
				if (clause(item)) {
					return true;
				}
			}
			return false;
		};
	};
	$CTFMMO_Common_EnumerableExtensions.where = function(T) {
		return function(items, clause) {
			var items2 = [];
			var $t1 = ss.getEnumerator(items);
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					if (clause(item)) {
						ss.add(items2, item);
					}
				}
			}
			finally {
				$t1.dispose();
			}
			return Array.prototype.slice.call(items2);
		};
	};
	$CTFMMO_Common_EnumerableExtensions.count = function(T) {
		return function(items, clause) {
			var items2 = [];
			var $t1 = ss.getEnumerator(items);
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					if (clause(item)) {
						ss.add(items2, item);
					}
				}
			}
			finally {
				$t1.dispose();
			}
			return items2.length;
		};
	};
	$CTFMMO_Common_EnumerableExtensions.select = function(T, T2) {
		return function(items, clause) {
			var items2 = [];
			for (var $t1 = 0; $t1 < items.length; $t1++) {
				var item = items[$t1];
				ss.add(items2, clause(item));
			}
			return Array.prototype.slice.call(items2);
		};
	};
	$CTFMMO_Common_EnumerableExtensions.toDictionary = function(T, T2) {
		return function(items, clause) {
			var items2 = {};
			for (var $t1 = 0; $t1 < items.length; $t1++) {
				var item = items[$t1];
				items2[clause(item)] = item;
			}
			return items2;
		};
	};
	global.CTFMMO.Common.EnumerableExtensions = $CTFMMO_Common_EnumerableExtensions;
	////////////////////////////////////////////////////////////////////////////////
	// CTFMMO.Common.EnumerableExtensions.GroupByItem
	var $CTFMMO_Common_EnumerableExtensions$GroupByItem$2 = function(T, T2) {
		var $type = function(key, values) {
			this.$1$KeyField = ss.getDefaultValue(T2);
			this.$1$ValuesField = null;
			this.set_key(key);
			this.set_values(values);
		};
		ss.registerGenericClassInstance($type, $CTFMMO_Common_EnumerableExtensions$GroupByItem$2, [T, T2], {
			get_key: function() {
				return this.$1$KeyField;
			},
			set_key: function(value) {
				this.$1$KeyField = value;
			},
			get_values: function() {
				return this.$1$ValuesField;
			},
			set_values: function(value) {
				this.$1$ValuesField = value;
			},
			getEnumerator: function() {
				return ss.getEnumerator(this.get_values());
			}
		}, function() {
			return null;
		}, function() {
			return [ss.IEnumerable, ss.IEnumerable];
		});
		return $type;
	};
	$CTFMMO_Common_EnumerableExtensions$GroupByItem$2.__typeName = 'CTFMMO.Common.EnumerableExtensions$GroupByItem$2';
	ss.initGenericClass($CTFMMO_Common_EnumerableExtensions$GroupByItem$2, $asm, 2);
	global.CTFMMO.Common.EnumerableExtensions$GroupByItem$2 = $CTFMMO_Common_EnumerableExtensions$GroupByItem$2;
	ss.initClass($CTFMMO_Common_EnumerableExtensions, $asm, {});
})();
