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

function get_notes(scale_increments) {
    var i, j;
    var notes = [];
    for (i = 0; i < scale_increments.length; i++) {
        notes.push(all_notes[(scale_increments[i]) % all_notes.length]);
    }
    return notes;
}

function hide(id) {
    document.getElementById(id).style.display = "none";
}

function show(id) {
    document.getElementById(id).style.display = "inline-block";
}

function show_finger_indicators(scale_increments) {
    var ids = ["C1", "CS1", "D1", "DS1", "E1", "F1", "FS1", "G1", "GS1", "A1", "AS1", "B1",
               "C2", "CS2", "D2", "DS2", "E2", "F2", "FS2", "G2", "GS2", "A2", "AS2", "B2"];
    var i;
    
    for (i = 0; i < ids.length; i++) {
        hide(ids[i]);
    }
    
    for (i = 0; i < scale_increments.length; i++) {
        show(ids[scale_increments[i]]);
    }
}

function showChord(_chord) {
    chord = chordIdx(_chord)[1];
    document.title = "Chord " + _chord;
    
    document.getElementById("chord_label").innerHTML = "Chord " + _chord;
    var notes = get_notes(chord);
    document.getElementById("chord_notes").innerHTML = notes.toString();
    show_finger_indicators(chord);
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
        
    if (chord_sharp.checked && evt.target == chord_sharp
        && chord_name_str != "B" && chord_name_str != "E") {
        chord_flat.checked = false;
        chord_name_str += "#";
    } else {
        chord_sharp.checked = false;
    }
    if (chord_flat.checked && evt.target == chord_flat
        && chord_name_str != "C" && chord_name_str != "F") {
        chord_sharp.checked = false;
        chord_name_str += "b";
    } else {
        chord_flat.checked = false;
    }
    
    if (chord_scale != "M") {
        chord_name_str += chord_scale;
    }
    
    chord_name_str += chord_ext;
    chord_name.innerHTML = chord_name_str;
    chord_name.href = "#" + chord_name_str;
}

function changeView(view_id) {
    if (view_id == "chord-of-the-day") return;
    
    var views = document.querySelectorAll("[data-role=page]");
    var unknown_view = true;
    var i;
    
    for (i = 0; i < views.length; i++) {
        views[i].style.display = "none";
        if (views[i].id == view_id) {
            unknown_view = false;
        }
    }
    if (unknown_view) {
        document.getElementById("chord").style.display = "inline-block";
        showChord(view_id);
        var like_str = "//www.facebook.com/plugins/like.php?";
        like_str += "href=" + encodeURIComponent("http://keyboardchords.github.io/#" + view_id);
        like_str += "&amp;width&amp;layout=standard&amp;action=like&amp;show_faces=true&amp;share=true&amp;height=80";
        document.getElementById("fb_share1").src = like_str;
    } else {
        document.getElementById(view_id).style.display = "inline-block";
        document.title = document.getElementById(view_id).getAttribute("data-title");
    }
    ga('send', 'event', view_id, 'visited');
}


document.addEventListener("DOMContentLoaded", function () {
    var hash = window.location.hash;
    if (hash[0] == "#") {
        hash = window.location.hash.substring(1);
    }
    
    var show_cotd = false;
    if (localStorage["show_cotd"] === "true" ||
            localStorage["show_cotd"] === undefined) {
            show_cotd = true;
    }
    
    if (hash != "") {
        changeView(hash);
    } else {
        changeView("main");
        if (show_cotd) {
            window.location.hash = "#chord-of-the-day";
        }
    }
    
    var ids = ["chord_root", "chord_sharp", "chord_flat", "chord_scale", "chord_ext"];
    var i;
    for (i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        el.addEventListener("change", update_chord);
    }
        
    document.getElementById("btnShowChord").addEventListener("click", function () {
        window.location.hash = document.getElementById("chord_name").innerHTML;
    });
    
    var rnd_chord = randomChord();
    var chord_link = document.getElementById("today_chord");
    chord_link.href = "#" + rnd_chord;
    chord_link.innerHTML = rnd_chord;
    
    if (show_cotd) {
        document.getElementById("cotd_startup").checked = true;
    }
    
    document.getElementById("cotd_startup").addEventListener("click", function () {
        localStorage["show_cotd"] = this.checked;
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