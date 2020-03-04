// Team formatter.
function formatTeam(key) {
    if (key == undefined || key == null || key == '') key = 'frcN/A';
    key = key.replace('frc', '');
    if (key == teamNumber) return `<strong>${key}</strong>`;
    else return key;
}

// Day mapper.
function mapDay(day, shorten) {
    if (day == 0) return (shorten) ? 'Sun' : 'Sunday';
    if (day == 1) return (shorten) ? 'Mon' : 'Monday';
    if (day == 2) return (shorten) ? 'Tue' : 'Tuesday';
    if (day == 3) return (shorten) ? 'Wed' : 'Wednesday';
    if (day == 4) return (shorten) ? 'Thu' : 'Thursday';
    if (day == 5) return (shorten) ? 'Fri' : 'Friday';
    if (day == 6) return (shorten) ? 'Sat' : 'Saturday';
    else return (shorten) ? '[E]' : '[Error]';
}

// Event date formatter.
function formatEventDate(tbaDate) {
    let date = new Date(tbaDate);
    let ww = mapDay(date.getDay(), false);
    let mm = date.getMonth();
    let dd = date.getDate();
    return `${ww}, ${mm}/${dd}`;
}

// Match date formatter.
function formatMatchDate(tbaDate) {
    let date = new Date(tbaDate*1000);
    let ww = mapDay(date.getDay(), true);
    let hh = date.getHours()
    let mm = (date.getMinutes() > 9) ? date.getMinutes() : '0'+date.getMinutes();
    return `${ww}, ${hh}:${mm}`;
}

// Match item generator.
function generateMatchItems(input) {
    let out = "";
    for (let i=0; i<input.length; i++) {
        if (input[i] != undefined) {
            out += `<tr>`+
                `<th scope="col" class="border-right">${input[i].comp_level.toUpperCase()} ${input[i].match_number}</th>`+
                `<td class="border-right">${formatMatchDate(input[i].time)}</td>`+
                `<td>${formatTeam(input[i].alliances.red.team_keys[0])}</td>`+
                `<td>${formatTeam(input[i].alliances.red.team_keys[1])}</td>`+
                `<td class="border-right">${formatTeam(input[i].alliances.red.team_keys[2])}</td>`+
                `<td>${formatTeam(input[i].alliances.blue.team_keys[0])}</td>`+
                `<td>${formatTeam(input[i].alliances.blue.team_keys[1])}</td>`+
                `<td>${formatTeam(input[i].alliances.blue.team_keys[2])}</td>`+
            `</tr>`;
        }
    }
    return out;
}

// Match sorter.
function sortMatches(input) {
    let out = new Array(input.length);
    for (let i=0; i<input.length; i++) {
        out[input[i].match_number-1] = input[i];
    }
    return out;
}

// Address formatter.
function formatAddress(address, city, stateProv) {
    let output = '';
    if (address) {
        output += address;
    } else {
        if (city) output += city;
        if ((city && stateProv) || (address && stateProv)) output += ', ' + stateProv;
        else if (stateProv) output += stateProv;
    }
    return output;
}

// Load checker & vars.
var loadItems = 24; var loadCurrent = 0;
function loadChecker() {
    if (loadCurrent == loadItems) {
        $('.container#loader').fadeOut('0.5s', function() {
            clearInterval(loadUpdater);
            $('.container:not(#loader)').fadeIn('0.5s');
        })
    } else {
        setTimeout(loadChecker, 500);
    }
}

// Load updater.
var loadUpdateCount = 0;
function loadUpdater() {
    loadUpdateCount++
    $('#loader-precent').text(Math.round((loadCurrent/loadItems)*100));
    if (loadUpdateCount % 30 == 0) {
        $('#loader-message').fadeOut('0.5s', function() {
            $('#loader-message').text('Something may have broke.');
            $('#loader-message').fadeIn('0.5s');
        });
    }
    if (loadUpdateCount % 60 == 0) {
        $('#loader-message').fadeOut('0.5s', function() {
            $('#loader-message').text('Try reloading the page.');
            $('#loader-message').fadeIn('0.5s');
        });
    }
}

// Show loader & kick off checker.
$('.container#loader').hide();
$('.container:not(#loader)').fadeOut('0.5s', function() {
    $('.container#loader').fadeIn('0.5s', function() {
        setTimeout(loadChecker, 500);
        setInterval(loadUpdater, 100);
    });
});

// Storage.
if (!localStorage.getItem('lastTeam')) { localStorage.setItem('lastTeam', String(5980)) }
if (!localStorage.getItem('lastEvent')) { localStorage.setItem('lastEvent', '2020misjo') }
var lastTeam = Number(localStorage.getItem('lastTeam'));
var lastEvent = localStorage.getItem('lastEvent');
loadCurrent++;

// URL parameters.
var urlParams = new URL(window.location.href).searchParams;
var teamNumber = (urlParams.get('team') == null) ? lastTeam : Number(urlParams.get('team'));
var eventKey = (urlParams.get('event') == null) ? lastEvent : urlParams.get('event');
loadCurrent++;

// Autofilling & Restorage.
$('#team-input').val(teamNumber);
$('#event-input').val(eventKey);
$('#team-header').text(teamNumber);
localStorage.setItem('lastTeam', String(teamNumber));
localStorage.setItem('lastEvent', eventKey);
loadCurrent++;

// TBA API config (key is public and will be removed if abused).
var tbaApiKey = encodeURI('dNxAgQWO2qmiRwgMNa8EjbDzbjvRIgv2cJ9yMTpZhIFkNJh7tCBsrOEHNWkZ1TZx');
var tbaBaseUrl = 'https://www.thebluealliance.com/api/v3';
var teamKey = 'frc' + String(teamNumber);
loadCurrent++;

// MapQuest API config (key is public and will be removed if abused).
var mapApiKey = encodeURI('IlppK5fQWTtimnCjT6ww8PwG3c7f3GrQ');
var mapBaseUrl = 'https://www.mapquestapi.com/directions/v2';
loadCurrent++;

// After a small delay, gather information.
setTimeout(function() {

    loadCurrent++;

    // Team number.
    $('#event-team').text(teamNumber);
    loadCurrent++;

    // QR Code: Team Page.
    new QRCode(document.getElementById('qr-team'), {
        text: `https://thebluealliance.com/team/${teamNumber}/${eventKey.substr(0,4)}#${eventKey}`,
        colorDark: "#212529", colorLight: "#ffffff"
    });
    loadCurrent++;

    // QR Code: Event Page.
    new QRCode(document.getElementById('qr-event'), {
        text: `https://thebluealliance.com/event/${eventKey}`,
        colorDark: "#212529", colorLight: "#ffffff"
    });
    loadCurrent++;

    // Event Information & Directions.
    $.getJSON(`${tbaBaseUrl}/event/${eventKey}?X-TBA-Auth-Key=${tbaApiKey}`, function(data) {

        loadCurrent++;

        // Title.
        $('#event-name').text(data.name);
        $('#event-city').text(data.city);
        $('#event-state').text(data.state_prov);
        $('#event-start').text(formatEventDate(data.start_date));
        $('#event-end').text(formatEventDate(data.end_date));
        loadCurrent++;

        // Directions (from team's home base).
        $.getJSON(`${tbaBaseUrl}/team/${teamKey}?X-TBA-Auth-Key=${tbaApiKey}`, function(teamData) {

            loadCurrent++;

            // Format Addresses.
            let startAddress = formatAddress(teamData.address, teamData.city, teamData.state_prov);
            let endAddress = formatAddress(data.address, data.city, data.state_prov);
            loadCurrent++;

            // QR Code: Directions.
            let directionQR = new QRCode(document.getElementById('qr-directions'), {
                text: `https://www.mapquest.com/directions?saddr=${encodeURI(startAddress)}&daddr=${encodeURI(endAddress)}`,
                colorDark: "#212529", colorLight: "#ffffff"
            });
            loadCurrent++;

            // Show.
            $('#start-address').text(startAddress);
            $('#end-address').text(endAddress);
            loadCurrent++;

            // Get list.
            $.getJSON(`${mapBaseUrl}/route?key=${mapApiKey}&from=${encodeURI(startAddress)}&to=${encodeURI(endAddress)}`, function(mapData) {

                loadCurrent++;

                // Generate.
                let legs = mapData.route.legs;
                let output = '', maneuvers = [];
                for (var i=0; i<legs.length; i++) {
                    maneuvers = legs[i].maneuvers;
                    for (var j=0; j<maneuvers.length; j++) {
                        if (maneuvers[i])
                        output += `<div class="my-2">`+
                            `<div class="direction-icon-wrapper mr-1">`+
                                `<img src="icons/turn-${maneuvers[j].turnType}.png" class="direction-icon">`+
                            `</div>`+
                            `<span class="${(j == maneuvers.length-1 || j == 0) ? 'font-weight-bold' : 'font-weight-normal'}">`+
                                `${maneuvers[j].narrative}`+
                            `</span>`+
                        `</div>`;
                    }
                }
                loadCurrent++;

                // Append.
                $('#directions-list').append(output);
                loadCurrent++;

            });

        });

    });

    // Match List.
    $.getJSON(`${tbaBaseUrl}/event/${eventKey}/matches/simple?X-TBA-Auth-Key=${tbaApiKey}`, function(data) {

        loadCurrent++;

        // Empty check.
        if (data.length > 0) {

            // Data structure.
            let matches = { qm: [], qf: [], sf: [], ff: [] };
            loadCurrent++;

            // Catagorize.
            for (let i=0; i<data.length; i++) {
                let type = data[i].comp_level;
                if (type == 'qm') matches.qm.push(data[i]);
                if (type == 'qf') matches.qf.push(data[i]);
                if (type == 'sf') matches.sf.push(data[i]);
                if (type ==  'f') matches.ff.push(data[i]);
            }
            loadCurrent++;

            // Sort.
            matches.qm = sortMatches(matches.qm);
            matches.qf = sortMatches(matches.qf);
            matches.sf = sortMatches(matches.sf);
            matches.ff = sortMatches(matches.ff);
            loadCurrent++;

            // Generate.
            let output;
            output += generateMatchItems(matches.qm);
            output += generateMatchItems(matches.qf);
            output += generateMatchItems(matches.sf);
            output += generateMatchItems(matches.ff);
            loadCurrent++;

            // Append.
            $('#match-list').append(output);
            loadCurrent++;

        } else {

            // Append error.
            $('#match-list').append('<tr><td colspan="8">No Data Found</td></tr>');
            loadCurrent+=5;

        }

    });

}, 250);