var Trend = {
    is_moderator: false,
    id: function() {
        return $.deparam.fragment().trend || _default_trend_id;
    },

    name: function() {
        return $('.topic-active .trend-name').text();
    },

    splitTweets: function(results) {
      if(results.length) {
        $('.tweets').twitterSlider().each(function() {
          $(this).twitterSlider('append', results.splice(0, 3));
        }).blockSlider('updateChildren');
      }
    },

    loadTweets: function() {
        var query = Trend.name() || Trend.id();
        $.ajax({
            url: "http://search.twitter.com/search.json?&q=" + encodeURIComponent(query) + '&rpp=6',
            dataType: 'jsonp',
            success: function (data) {
                Trend.splitTweets(data.results);
            }
        });
    },

    setCurrentTrend: function() {
        var currentTrend = $('.topics li[data-value=' + Trend.id() + ']').addClass('topic-active active');
        $('.topics').blockSlider({
            animation: 'carrousel',
            nextArrow: '.arrow.next',
            backArrow: '.arrow.back',
            speed: 300
        });
        if(currentTrend.index() > 0) { $('.topics').blockSlider('scrollTo', currentTrend.index()); }
        setCurrentTrendName();
        Trend.loadTweets();
    },

    toggleModerator: function(makeMod) {
        var closeTag = '<div class="ctrl close-video"><a href="#">Close</a><span class="box-shadow"></span></div>';
        $('.video .ctrls-wrapper .ctrls:not(.mod)').append(closeTag).addClass('mod');
        if(!makeMod) {
            $('.video:not(:has(.publisher)) .close-video').remove();
            $('.video:not(:has(.publisher)) .ctrls-wrapper .ctrls.mod').removeClass('mod');
            $('.flash.moderator').hide();
        } else {
            if(!Trend.is_moderator) { $('.flash.moderator').show(); }
        }
        Trend.is_moderator = makeMod;
    },

    get_session_id_for: function(trendId) {
        var response = false;
        $.ajax({
            url: '/trends/' + trendId + '/tokbox_session.json',
            type: 'post',
            dataType: 'json',
            async: false,
            success: function(xhr) {
                response = xhr.session_id;
            }
        });
        return response;
    }
};   

var Tokbox = function(sessionId, partnerKey, is_logged_in, token) {
    var Connection = {
        addStream: function(stream) {
            if(stream.connection.connectionId == Session.current().connection.connectionId) { return; }

            var divId = stream.streamId;

            // Create a div which we will use to replace with a subscribe UI
            Connection.videoWrapper(divId, stream.connection.connectionId);

            // Subscribe to the stream object
            Session.current().subscribe(stream, divId, {wmode: 'transparent'});
            // var props = (/win/i).test(navigator.platform) && !$.browser.msie ? {} : {wmode: 'transparent'};
            // Session.current().subscribe(stream, divId, props);
        },
        videoWrapper: function(id, connectionId) {
            /random/.test(Positions.arrangement) && Positions.bundle == null && Positions.setPositionBundle();
            var pos = Positions.getPosition();
            var template = Connection.appendToArea(themes.getTemplate().replace(/\{\{id\}\}/g, id), pos, connectionId);
            if(id == 'publisher') {
                template.after('<div class="device-manager"><div id="device-panel"></div></div>');
            }
            Trend.toggleModerator(Trend.is_moderator);
            //Connection.dummyConnections();
        },
        appendToArea: function(video, pos, connectionId){
            var videoArea = $('.video-area'),
                minHeight = videoArea.height();
            videoArea.append(video);   
            video = videoArea.find('.video:last').attr('aria-connection', connectionId);
            var newHeight = pos.posY + video.outerHeight();
            (minHeight < newHeight) && videoArea.css('min-height', newHeight);
            video.css({left: pos.posX, top: pos.posY}).draggable({scroll: true, scrollSensitivity:100, containment: [21, 130, screen.width - video.width() - themes.getCalcThemeDelta(video) - 21, 1310 - video.height()], handle: '.dragg-video', stack: '.video'}).data('position', pos).children('div:first').resizable({
                aspectRatio: 4/3, 
                maxWidth: 600, 
                maxHeight: 450, 
                minWidth: 160, 
                minHeight: 120, 
                handles : 'se', 
                stop: function(){
                    setVideoAreaBounds(video);
                }
            });
            
            if(!(/grid/.test(Positions.arrangement))){
                
                var resizableVid = video.children(':eq(0)'),
                    width = parseInt(resizableVid.css('width')) + Math.round(Math.random() * 15),
                    height = Math.floor(width * 3/4);                         
                resizableVid.css({width: width, height: height});
            };
            return video;
        },
        create: function() {
            $.ajax({
                url: '/trends/' + Trend.id() + '/connections.json',
                data: {
                    tokbox_connection_id: Session.current().connection.connectionId
                },
                type: 'post',
                dataType: 'json',
                success: function () {
                    window.currentPingTimeout = setTimeout(Connection.pingServer, _ttl);
                }
            });
        },
        pingServer: function() {
            var connectionId = Session.current().connection && Session.current().connection.connectionId;
            if(!connectionId) {
                connectionId = 'offline';
                Trend.disconnecting  || Trend.self_disconnect || $('.flash.kicked').show();
                Trend.self_disconnect = true;
                Session.disconnect();
            }
            $.ajax({
                url: '/trends/' + Trend.id() + '/connections/' + connectionId + '/ping.js',
                type: 'post',
                dataType: 'script'
            });
        },
       dummyConnections: function(){
            for(i=0; i<7; i++){                                 
                /random/.test(Positions.arrangement) && Positions.bundle == null && (Positions.bundle = Math.round(Math.random() * 1));
                var pos = /grid/.test(Positions.arrangement) ? Positions.getPositionGrid() : Positions.getPositionRandom();
                Connection.appendToArea(themes.getTemplate(), pos, '');
                Trend.toggleModerator(Trend.is_moderator);
            }
        }
    };

    var Session = {
        publisher: null,
        session: null,
        partner_key: null,

        _set: function(session) {
            Session.session = session;
        },

        current: function() {
            return Session.session;
         },

        disconnect: function() {
            Trend.disconnecting = true;
            Session.unpublish();
            Session.current().disconnect();
        },

        publish: function() {
            if(!Session.publisher && is_logged_in) {
                if(!Session.current() || !Session.current().connection) {
                    setTimeout(tokbox.publish, 1000);
                    return false;
                }
                Connection.videoWrapper('publisher', Session.current().connection.connectionId);
                Session.publisher = Session.current().publish('publisher', {wmode: 'transparent'});
                // var props = (/win/i).test(navigator.platform) && !$.browser.msie ? {} : {wmode: 'transparent'};
                // Session.publisher = Session.current().publish('publisher', props);
                Session.publisher.addEventListener("settingsButtonClick", Handlers.settingsButtonClick);
                Connection.create();
            }
        },

        kick: function (connectionId) {
            if(Session.current().connection.connectionId == connectionId) {
                Session.disconnect();
                Trend.self_disconnect = true;
                Trend.toggleModerator(false);
                $('.publish-wrapper').show();
            } else if(Trend.is_moderator) {
                Session.current().forceDisconnect(connectionId);
                Trend.toggleModerator(false);
            } else {
                alert("You're not a moderator. You cannot kick others");
            }
        },

        unpublish: function() {
            if(Session.publisher) {
                Session.current().unpublish(Session.publisher);
            }
            $('.obj-wrapper.publisher').closest('.video').remove();
            Session.publisher = null;
        },

        on: function(callback, handler) {
            Session.current().addEventListener(callback, handler);
        }
    };

    var Handlers = {
        sessionConnected: function(ev) {
            // is_logged_in === true && Session.publish();
            Handlers.streamCreated(ev);
        },

        streamCreated: function(ev) {
            for(var i = 0; i < ev.streams.length; i++) {
                Connection.addStream(ev.streams[i]);
            }
        },

        streamDestroyed: function(ev) {
            for(var i = 0; i < ev.streams.length; i++) {
                var subscribers = Session.current()
                    .getSubscribersForStream(ev.streams[i]);
                for(var j = 0; j < subscribers.length; j++) {
                    var div = $('#' + subscribers[j].id).parents('.video');
                    Session.current().unsubscribe(subscribers[j]);
                    Positions.addPosition(div.data('position'));
                    div.remove();
                }
            }
            Session._set(null);
        },

        connectionDestroyed: function(ev) {
            for(var i = 0; i < ev.connections.length; i++) {
                if(ev.connections[i].connectionId != Session.current().connection.connectionId) {
                    // cleanup
                }
            }
        },

        connectionCreated: function(ev) {
            // This signals new connection have been created
        },

        exception: function (ev) {
            alert("Exception! msg: " + ev.message + " title: " + ev.title + " code: " + ev.code);
        },

        settingsButtonClick: function (ev) {
            if(Session.devicePanel) {
                Session.deviceManager.removePanel(Session.devicePanel);
                $('.device-manager').append('<div id="device-panel"></div>');
                Session.devicePanel = null;
            } else {
                Session.deviceManager = TB.initDeviceManager(Session.partner_key);
                Session.deviceManager.detectDevices();
                Session.devicePanel = Session.deviceManager.displayPanel('device-panel', Session.publisher);
                var template = $('.video:has(.publisher)');
                $('.device-manager').css({
                    top: template.position().top + template.height() - 53,
                    left: template.position().left,
                    zIndex: template.css('z-index') - 1
                }).find('object').width(template.width());
            }
        }
    };

    // TB.setLogLevel(TB.DEBUG);
    Session.partner_key = partnerKey;
    Session.token = token;
    Session._set(TB.initSession(sessionId));

    Session.on(TB.CONNECTION_CREATED, Handlers.connectionCreated);
    Session.on(TB.CONNECTION_DESTROYED, Handlers.connectionDestroyed);
    Session.on(TB.SESSION_CONNECTED, Handlers.sessionConnected);
    Session.on(TB.STREAM_CREATED, Handlers.streamCreated);
    Session.on(TB.STREAM_DESTROYED, Handlers.streamDestroyed);
    TB.addEventListener('exception', Handlers.exception);

    // Session.current().connect(Session.partner_key, Session.token, {wmode: 'transparent'});
    // var props = (/win/i).test(navigator.platform) && !$.browser.msie ? {} : {wmode: 'transparent'};
    // Session.current().connect(Session.partner_key, Session.token, props);
    Session.current().connect(Session.partner_key, Session.token);
    is_logged_in && $('.join-conv-wrapper').hide();

    return {
        publish: Session.publish,
        unpublish: Session.unpublish,
        disconnect: Session.disconnect,
        pingServer: Connection.pingServer,
        kick: Session.kick
    };
};

var getTokboxSessionId = function() {
    var sessionId = null;
    sessionId = Trend.get_session_id_for(Trend.id());
    return sessionId;
};

var setCurrentTrendName = function() {
    var trendName = Trend.name() || Trend.id();
    $('.current-topic > span').text(trendName);
//    document.title = "TrendTok | " + trendName;
};
