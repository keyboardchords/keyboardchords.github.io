Chord = function(root) {
	this.root = root;
	this.quality = "M";
	this.added = [];
}

Chord.prototype.add = function(ext, mod) {
	// Make sure ext is between 1 and 7
	if(ext >= 8) {
		ext = (ext+1) % 8;
	}
	if(ext == 2) {
		this.added.push(2);
	}
	if(ext == 4) {
		this.added.push(5);
	}
	if(ext == 6) {
		this.added.push(9)
	}
	if(ext == 7) {
		if(mod == "+") {
			this.added.push(11);
		}
		else {
			this.added.push(10);
		}
	}
};

Chord.prototype.generate = function() {
	idx = []
	// Base chord
	idx.push(this.root);
	if(this.quality == "M") {
		idx.push(this.root + 4);
		idx.push(this.root + 7);
	}
	else if(this.quality == "m") {
		idx.push(this.root + 3);
		idx.push(this.root + 7);
	}
	else if(this.quality == "+") {
		idx.push(this.root + 4);
		idx.push(this.root + 8);
	}
	else if(this.quality == "o") {
		idx.push(this.root + 3);
		idx.push(this.root + 6);
	}
	// Handle extended chords
	for(var i = 0; i < this.added.length; i++) {
		idx.push(this.root + this.added[i]);
	}
	// Return idx sorted by increasing value
	return idx.sort(function(a, b) {return a-b});
};

Chord.prototype.setSharpFlat = function(sharpFlat) {
	if(sharpFlat == "#") {
		this.root += 1;
	}
	else if(sharpFlat == "b") {
		this.root -= 1;
	}
};

Chord.roots     = ["C", "D", "E", "F", "G", "A", "B"];
Chord.rootsN    = [0, 2, 4, 5, 7, 9, 11];
Chord.qualities = ["M", "m", "+", "o"];
Chord.sharpFlat = ["#", "b"]

seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function randomChord() {
	/* seed based on the current day */
	var today = new Date();
	var today_0_hour = new Date(1970, today.getMonth(), today.getDate());
	seed = today_0_hour.getTime()/1000; /* trick to work in IE9 mobile */
	
	var chord = "";
	var idx = Math.floor(random() * Chord.roots.length);
	
	chord += Chord.roots[idx];
	
	var r = Math.floor(random() * 4);
	if (r < 2) chord += "";
	else if (r < 3) chord += "#";
	else chord += "b";
	
	r = Math.floor(random() * 6);
	if (r < 2) chord += "";
	else if (r < 4) chord += "m";
	else if (r < 5) chord += '+';
	else chord += 'o';
		
	return chord;
}

chordIdx = function(chordString) {
	// Clean string
	chordString = chordString.trim();
	chordString[0] = chordString[0].toUpperCase();
	
	root = Chord.roots.indexOf(chordString[0]);
	// String is well formed
	// TODO other validations
	if(root > -1) {
		chord = new Chord(Chord.rootsN[root]);
		i = 1;
		sharpFlat = Chord.sharpFlat.indexOf(chordString[i]);
		// Sharp or flat is defined
		if(sharpFlat > -1) {
			chord.setSharpFlat(Chord.sharpFlat[sharpFlat]);
			i += 1;
		}
		quality = Chord.qualities.indexOf(chordString[i]);
		// A quality is given
		if(quality > -1) {
			chord.quality = Chord.qualities[quality];
			i += 1;
		}
		// Add extensions
		curNum = "";
		while(i < chordString.length) {
			if(isNaN(parseInt(chordString[i]))) {
				if(curNum.length > 0) {
					chord.add(parseInt(curNum), chordString[i]);
				}
				curNum = "";
			}
			else {
				curNum = curNum.concat(chordString[i]);
			}
			i += 1;
		}
		// Special case when string ends in number
		if(curNum.length > 0) {
			chord.add(parseInt(curNum));
		}
		return [true, chord.generate()];
	}
	return [false, []];
}