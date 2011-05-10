/**
 * Match Center jQuery plugin.
 * 
 * Copyright 2011 by Roger Dudler <roger.dudler@gmail.com>
 * 
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 2 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

(function($) {

    /**
     * Holds all supported playing systems.
     */
    var systems = new Array();

    // Playing system: 4-4-2
    systems['4-4-2'] = new Array();
    systems['4-4-2']['x'] = [149, 15, 93, 205, 283, 15, 93, 205, 283, 93, 205];
    systems['4-4-2']['y'] = [40, 145, 110, 110, 145, 235, 200, 200, 235, 290, 290];
    
    // Playing system: 4-4-1-1
    systems['4-4-1-1'] = new Array();
    systems['4-4-1-1']['x'] = [149, 15, 93, 205, 283, 15, 93, 205, 283, 93, 205];
    systems['4-4-1-1']['y'] = [40, 145, 110, 110, 145, 235, 200, 200, 235, 290, 320];
    
    // Playing system: 4-3-3
    systems['4-3-3'] = new Array();
    systems['4-3-3']['x'] = [149, 15, 93, 205, 283, 37, 149, 260, 37, 149, 260];
    systems['4-3-3']['y'] = [40, 145, 110, 110, 145, 210, 210, 210, 290, 290, 290];
    
    // Playing system: 4-1-2-1-2
    systems['4-1-2-1-2'] = new Array();
    systems['4-1-2-1-2']['x'] = [149, 15, 93, 205, 283, 37, 149, 149, 260, 93, 205];
    systems['4-1-2-1-2']['y'] = [40, 145, 110, 110, 145, 205, 180, 240, 205, 290, 290];

    var methods = {
        
        /**
         * Initializes a plugin instance.
         * 
         * Supported settings are:
         * 
         * - system (the playing system)
         * - width (the width of the field)
         * - yspacing (the vertical spacing between player rows)
         * - xspacing (the horizontal spacing between players)
         * 
         * @param array options Settings
         */
        init : function (options) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('matchcenter');

                // define default settings
                var settings = {
                    target : $this,
                    players : [],
                    system : '4-4-2',
                    width : 400,
                    yspacing : 100,
                    xspacing : 10,
                }
                
                // if the plugin hasn't been initialized yet
                if (!data) {
                    $(this).addClass('matchcenter-field');
                    if (options) {
                        data = $.extend({}, settings, options);
                        $(this).data('matchcenter', data);
                    } else {
                        $(this).data('matchcenter', settings);
                    }
                }
            });
        },
        
        /**
         * Set playing system. Transforms the current playing system
         * to the given one.
         * 
         * @param string system Playing system (e.g. "4-4-2")
         */
        setPlayingSystem : function(system) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('matchcenter');
                data.system = system;
                var xpos = 0;
                var ypos = 0;
                $.each(data.players, function(key, value) {
                    xpos = systems[data.system]['x'][key];
                    ypos = systems[data.system]['y'][key];
                    $('#player-' + value).animate({'left': xpos + 'px', 'top': ypos + 'px'}, "slow");
                });
            });
        },
        
        /**
         * Add a new player to the field.
         * 
         * @param int pos Number of the position on the field (1-11)
         * @param int id ID of the player (application specific)
         * @param int nr Shirt number of the player
         * @param string Display name of the player
         */
        addPlayer : function(pos, id, nr, name) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('matchcenter');
                var xpos = systems[data.system]['x'][pos-1];
                var ypos = systems[data.system]['y'][pos-1];
                var player = '<div id="player-' + id + '" class="player cf" style="left: ' + xpos + 'px; top: ' + ypos + 'px;">';
                player += '<div class="player-nr">' + nr + '</div><div class="player-name">' + name + '</div>';
                player += '</div>';
                $this.append(player);
                $('#player-' + id).delay(pos * 100).fadeIn();
                data.players.push(id);
            });
        },
        
        /**
         * Add a yellow card to a player.
         * 
         * @param int id ID of the player (application specific)
         */
        addYellowCard : function(id) {
            return this.each(function(){
                var yellowcard = '<div id="player-yellowcard-' + id + '" class="player-yellowcard"></div>';
                $('#player-' + id).append(yellowcard);
                $('#player-yellowcard-' + id).fadeIn();
            });
        },
        
        /**
         * Add a red card to a player.
         * 
         * @param int id ID of the player (application specific)
         */
        addRedCard : function(id) {
            return this.each(function(){
                var redcard = '<div id="player-redcard-' + id + '" class="player-redcard"></div>';
                $('#player-' + id).append(redcard);
                $('#player-redcard-' + id).fadeIn();
            });
        },
        
        /**
         * Highlight a player.
         * 
         * @param int id ID of the player (application specific)
         */
        highlightPlayer : function(id) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('matchcenter');
                $.each(data.players, function(key, value) {
                    if (value != id) {
                        $('#player-' + value).fadeTo('slow', 0.3);
                    }
                });
                $.each(data.players, function(key, value) {
                    if (value != id) {
                        $('#player-' + value).delay(4000).fadeTo('slow', 1);
                    }
                });
            });
        },
        
        /**
         * Substitute a player.
         * 
         * @param int outid ID of the player (out)
         * @param int inid ID of the player (in)
         * @param int nr Shirt number of the player (in)
         * @param string name Display name of the player (in)
         */
        substitutePlayer : function(outid, inid, nr, name) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('matchcenter');
                if (outid == inid || !$('#player-' + outid)) {
                    return;
                }
                for (var i = 0; i <= data.players.length; i++) {
                    if (i != outid) {
                        $('#player-' + i).fadeTo('slow', 0.3);
                    }
                }
                var xpos = $('#player-' + outid).css('left');
                var ypos = $('#player-' + outid).css('top');
                $('#player-' + outid).delay(1000).animate({'left': '0px', 'opacity': 0}, "slow", function() {
                    $('#player-' + outid).remove();
                });
                var players = jQuery.grep(data.players, function(value) {
                    return value != outid;
                });
                
                var player = '<div id="player-' + inid + '" class="player cf" style="left: 0px; top: ' + ypos + ';">';
                player += '<div class="player-nr">' + nr + '</div><div class="player-name">' + name + '</div>';
                player += '</div>';
                $this.append(player);
                $('#player-' + inid).css('opacity', 0);
                $('#player-' + inid).css('display', 'block');
                $('#player-' + inid).delay(1000).animate({'left': xpos, 'opacity': 1}, "slow");
                data.players.push(inid);
                $.each(players, function(key, value) {
                    if (value != outid) {
                        $('#player-' + value).delay(4000).fadeTo('slow', 1);
                    }
                });
            });
        },
        
        /**
         * Destroys the plugin instance.
         */
        destroy : function() {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('matchcenter');
                $(window).unbind('.matchcenter');
                data.matchcenter.remove();
                $this.removeData('matchcenter');
            })
        },
        
    };

	$.fn.matchcenter = function(method) {
	    if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call( arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.matchcenter');
        }
    };

})(jQuery);
