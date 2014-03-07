function parse_chord(chord) {
    var i;
    var note = "";
    for (i = 0; i < all_notes.length; i++) {
        if (chord.indexOf(all_notes[i]) != -1) {
            note = all_notes[i];
        }
    }
    
    var scale = major_scale;
    if (chord.indexOf("m") != -1) {
        scale = minor_scale;
    }
    
    return {scale: scale, note: note};
}

function get_notes(idx, scale_increments) {
    var i, j;
    var notes = [];
    for (i = 0; i < scale_increments.length; i++) {
        notes.push(all_notes[(idx + scale_increments[i]) % all_notes.length]);
    }
    return notes;
}

function show_finger_indicators(idx, scale_increments) {
    var ids = ["C1", "CS1", "D1", "DS1", "E1", "F1", "FS1", "G1", "GS1", "A1", "AS1", "B1",
               "C2", "CS2", "D2", "DS2", "E2", "F2", "FS2"];
    var i;
    
    for (i = 0; i < ids.length; i++) {
        $("#"+ids[i]).hide();
    }
    
    for (i = 0; i < scale_increments.length; i++) {
        $("#"+ids[idx + scale_increments[i]]).show();
    }
}

function showChord(_chord) {
    chord = parse_chord(_chord);
    document.title = "Chord " + _chord;
    $("#chord_label").text("Chord " + _chord);
    var idx = all_notes.indexOf(chord.note);
    var notes = get_notes(idx, chord.scale);
    $("#chord_notes").text(notes);
    show_finger_indicators(idx, chord.scale);
}

function update_chord(evt) {
    var chord_root = document.getElementById("chord_root");
    var chord_sharp = document.getElementById("chord_sharp");
    var chord_flat = document.getElementById("chord_flat");
    var chord_scale = document.getElementById("chord_scale");
    chord_scale = chord_scale.options[chord_scale.selectedIndex].text;
    
    var chord_ext = document.getElementById("chord_ext");
    chord_ext = chord_ext.options[chord_ext.selectedIndex].text;
    
    var chord_name = document.getElementById("chord_name");
    
    var chord_name_str = chord_root.options[chord_root.selectedIndex].text;
        
    if (chord_sharp.checked && evt.target == chord_sharp) {
        chord_flat.checked = false;
        chord_name_str += "#";
    }
    if (chord_flat.checked && evt.target == chord_flat) {
        chord_sharp.checked = false;
        chord_name_str += "b";
    }
    
    if (chord_scale != "M") {
        chord_name_str += chord_scale;
    }
    
    chord_name_str += chord_ext;
    chord_name.innerHTML = chord_name_str;
    chord_name.href = "#" + chord_name_str;
}

function changeView(view_id) {
    var views = document.querySelectorAll("[data-role=page]");
    var unknown_view = true;
    var i;
    
    for (i = 0; i < views.length; i++) {
        views[i].style.display = "none";
        //console.log(views[i].id);
        if (views[i].id == view_id) {
            unknown_view = false;
        }
    }
    if (unknown_view) {
        document.getElementById("chord").style.display = "block";
        showChord(view_id);
    } else {
        document.getElementById(view_id).style.display = "block";
        document.title = document.getElementById(view_id).getAttribute("data-title");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var hash = window.location.hash;
    if (hash[0] == "#") {
        hash = window.location.hash.substring(1);
    }
    if (hash != "") {
        changeView(hash);
    } else {
        changeView("main");
    }
    
    var ids = ["chord_root", "chord_sharp", "chord_flat", "chord_scale", "chord_ext"];
    var i;
    for (i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        el.addEventListener("change", update_chord);
    }
        
    document.getElementById("btnShowChord").addEventListener("click", function () {
        alert(chordIdx(document.getElementById("chord_name").innerHTML))
        window.location.hash = document.getElementById("chord_name").innerHTML;
    });
    
    update_chord();
});

window.addEventListener("hashchange", function(evt) {
    var hash = window.location.hash;
    if (hash[0] == "#") {
        hash = window.location.hash.substring(1);
    }
    if (hash != "") {
        changeView(hash);
    } else {
        changeView("main");
    }
});