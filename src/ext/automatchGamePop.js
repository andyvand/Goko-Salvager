/*jslint browser: true, devel: true, indent: 4, maxlen: 90, es5: true */
/*global jQuery, $ */

var loadAMGamePop = function () {
    "use strict";
    var AM;

    // Automatch namespace
    if (!window.hasOwnProperty('AM')) {
        window.AM = {};
    }
    AM = window.AM;

    AM.appendGamePopup = function (viewport) {
        viewport.append($(AM.getGamePopHTML()));
        AM.configureGamePop();
    };

    // Create UI elements
    AM.getGamePopHTML = function () {
        return ['<div id="gamepop" style="visibility:hidden">',
               '  <h3 style="text-align:center">Creating Automatch Game</h3>',
               '  ',
               '  Host: <div id="gamehost"></div><br>',
               '  Guest: <ul id="gameguests"></ul><br>',
               '  ',
               '  <p>',
               '    Automatch will seat you automatically.',
               '    Please do not use the Goko UI while ',
               '    this message is on the screen.',
               '  </p>',
               '  ',
               '  <input type="button" id="abortgame" value="Abort" />',
               '</div>'].join('\n');
    };

    // Define UI behavior
    AM.configureGamePop = function () {
        // Override Goko's "hide select" elements by default" nonsense
        $('#gamepop .wtfgoko').css('visibility', 'inherit');
        $('#gamepop .wtfgoko').css('top', 'auto');

        // Make this into a lightbox-style dialog
        $('#gamepop').css("position", "absolute");
        $('#gamepop').css("top", "50%");
        $('#gamepop').css("left", "50%");
        $('#gamepop').css("height", "350px");
        $('#gamepop').css("margin-top", "-175px");
        $('#gamepop').css("width", "40%");
        $('#gamepop').css("margin-left", "-20%");
        $('#gamepop').css("background", "white");

        $('#abortgame').click(function (evt) {
            $('#abortgame').prop('disabled', true);
            AM.sendMessage('CANCEL_GAME', {matchid: AM.state.game.matchid});
            $('#gamepop').css('visibility', 'hidden');
        });
    };

    // Update and show/hide the dialog
    AM.showGamePop = function (visible) {
        if (typeof visible === "undefined") {
            visible = true;
        }

        $('#gamehost').html();
        $('#gameguests').empty();

        if (AM.state.game !== null) {
            var hostname = AM.state.game.hostname;
            $('#gamehost').html(hostname);

            // List guests
            AM.getOppnames(AM.state.game, hostname).map(function (p) {
                $('#gameguests').append('<li>' + p + '</li>');
            });

            $('#abortgame').prop('disabled', false);
        }
        $('#gamepop').css('visibility', visible ? 'visible' : 'hidden');
    };
};

// Execute our code in Goko's JS context by appending it to the document
var script = document.createElement('script');
script.textContent = '(' + loadAMGamePop + ')();';
document.body.appendChild(script);
