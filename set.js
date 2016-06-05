class Set {
	static _getLeftLeaf (index) {
		return index * 2 + 1;
	}

	static _getRightLeaf (index) {
		return index * 2 + 2;
	}

	constructor (arrayLike) {
		this.clear();
		arrayLike && Array.from(arrayLike).forEach((value) => this.add(value));
	}

	clear () {
		this.array = [];
		this.size = 0;
		return this;
	}

	add (value) {
		this.size += this._insert(0, value);
		return this;
	}

	delete (value) {
		this._find(0, value, true);
		return this;
	}

	has (value) {
		return this._find(0, value, false);
	}

	_insert (index, value) {
		let origin = this.array[index];
		if (origin === undefined) {
			this.array[index] = value;
			return 1;
		} else if (value < origin) {
			return this._insert(Set._getLeftLeaf(index), value);
		} else if (value > origin) {
			return this._insert(Set._getRightLeaf(index), value);
		} else { // value === origin
			return 0;
		}
	}

	_find (index, value, remove) {
		let valueInSet = this.array[index];
		if (valueInSet === undefined) {
			return false;
		} else if (value < valueInSet) {
			return this._find(Set._getLeftLeaf(index), value, remove);
		} else if (value > valueInSet) {
			return this._find(Set._getRightLeaf(index), value, remove);
		} else { // value === valueInSet
			if (remove) {
				this.size --;
				this._replaceMe(index);
			}
			return true;
		}
	}

	_replaceMe (index) {
		if (this.array[index] === undefined) {
			delete this.array[index];
			return ;
		}

		let pickLeft = Math.random() % 2 === 0;
		let pickIndex = pickLeft ? Set._getLeftLeaf(index) : Set._getRightLeaf(index);

		this.array[index] = this.array[pickIndex];
		this._replaceMe(pickIndex);
	}

	[Symbol.iterator] () {
		let currentStack = [0];
		let traversed = [];
		let next = function next() {
			while (currentStack.length > 0) {
				let currentIdx = currentStack.shift();
				let current = this.array[currentIdx];

				if (current === undefined) {
					continue;
				} else if (traversed[currentIdx]) {
					return {
						done: false,
						value: current
					};
				} else if (this.array[Set._getLeftLeaf(currentIdx)] === undefined) {
					currentStack.unshift(Set._getRightLeaf(currentIdx));
					return {
						done: false,
						value: current
					};
				} else {
					currentStack.unshift(Set._getRightLeaf(currentIdx));
					currentStack.unshift(currentIdx);
					currentStack.unshift(Set._getLeftLeaf(currentIdx));
					traversed[currentIdx] = true;
				}
			}
			return {
				done: true
			};
		}

		let iterator = {
			next: next.bind(this)
		};
		return iterator;
	}
}
