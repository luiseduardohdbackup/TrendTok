function centerAligned() {
    $('.aligned').css('margin', '0 ' + Math.floor(($(window).width() - $('.aligned').width()) / 2) + 'px');
}

function setVideoAreaBounds(video){
    var containment = video.draggable('option', 'containment');
    containment[2] = screen.width - video.width() - themes.getThemeDelta(video) - 21;
    video.draggable('option', 'containment', containment);
}

function setTweetsAreaBounds(tweets){
    var containment = tweets.draggable('option', 'containment');
    containment[2] = screen.width - tweets.outerWidth() - 21;
    tweets.draggable('option', 'containment', containment);
}

function setBackToLogout() {
    $('.logout').attr('href', '/logout?return_to=' + encodeURIComponent(location.href));
}

$(document).ready(function(){                       
    $('.topics').find('a').live('click', function(){
        $('.topic-active').removeClass('topic-active');
        $(this).parent().addClass('topic-active');
    });

    $('.close').add('.close-join').click(function(){
        var closeLk = $(this);
        closeLk.closest('.alignedRel').fadeOut(function(){
           $(this).remove();                              
           closeLk.hasClass('close-join') && $('.flash.listener').fadeIn();           
        });
        return false;
    });
    
    $('.ctrl.close-video > a').live('click', function() {
        tokbox.kick($(this).parents('.video').attr('aria-connection'));
    });                                                 
    
    $('.ctrl > a').live('click', function(e){
        e.preventDefault();
        return false;        
    });
       
    var videoArea = $('.video-area');
    !($.browser.msie && parseInt($.browser.version) < 8) && videoArea.css('min-height', videoArea.height());
    
    $('.tweets').draggable({scroll: true, containment: [21, 130, screen.width, 1300]});
    
    $(window).bind("load", function(){
        var delta = $('body > header').outerHeight() + 1;
        var minHeight = $(window).height() -  delta;
        $('section').css('min-height', minHeight).data('delta', delta);
        Positions.setResolution(minHeight);
    });

    $(window).resize(function(){
        if ($(window).height() > $('section').height()){         
           var section = $('section');
           section.css('min-height', $(window).height() - section.data('delta'));
        }
    });
    
    $('.grid, .random').click(function(e){
        var that = $(this);
            videos = $('.video');
        that.addClass('active').siblings().removeClass('active');    
        videos.each(function(i){
           Positions.addPosition($(this).data('position')); 
        });
        if(that.hasClass('random')){
            Positions.setArrangement('random');
            Positions.setPositionBundle();
            
        }else{
            Positions.setArrangement('grid');
            Positions.resetPositionsGrid();             
        }       
        var minHeight = 0,
            newHeight = 0; 
        videos = videos.toArray();
        while(videos.length) {             
            var ran = that.hasClass('random') ? 0 : Math.floor(Math.random() * (videos.length - 1)),
                vid = $(videos.splice(ran,1)),
                resizableDiv = vid.children(':eq(0)');
            resizableDiv.css({width:'', height: ''});
            var pos = Positions.getPosition(minHeight),                
                width = parseInt(resizableDiv.css('width'));
                size = that.hasClass('random') ? {} : {width: width, height: Math.floor(width * 3 / 4)};
                newHeight = pos.posY + vid.outerHeight();
                (minHeight < newHeight) && (minHeight = newHeight);
            
            vid.animate({left: pos.posX, top: pos.posY}).data('position', pos);
            resizableDiv.css(size);
        }                 
        videoArea.css('min-height', minHeight);
        $('.video').data('moved', null);
        e.preventDefault();
        return false;
    });
    
    var themeBtn = $('.activate-theme');
    themeBtn.data('text', themeBtn.text()).click(function(e){
       if(themeBtn.hasClass('active')){
           themes.current = 'default';   
           themes.loadTheme(themeBtn);
       }
       else{
           themes.current = 'fandango'; 
           $('.video').append('<div class="theme cloud-left"></div><div class="theme cloud-right"></div><div class="theme cloud-right-video"></div><div class="theme cloud-left-video"></div>');
           themes.loadTheme(themeBtn);
           setVideoAreaBounds($('.video:first'));
       }                      
       e.preventDefault();
       return false;
    });

    $('.join-conv-btn, .publish-btn').bind({
       mouseover : function(){
           $(this).addClass('hover');
       },
       mouseout: function(){
           $(this).removeClass('hover pressed');
       },
       mousedown: function(){
           $(this).removeClass('hover').addClass('pressed');               
       },
       mouseup: function(){
           $(this).removeClass('pressed');               
       }
    });
    
    // Fixing bug that doesn't allow to click flash if margin is 0 auto in firefox 3.x
    if($.browser.mozilla && parseInt($.browser.version) < 2) {
        centerAligned();
        $(window).resize(centerAligned);
    }
                 
    var tweets = $('.tweets');
    tweets.eq(0).blockSlider({
            animation: 'fade', 
            callback: function(){
                setTweetsAreaBounds(tweets.eq(0))
            }
        }).bind('blockSlider.faded', function(ev, index) {
            if(!(index % 3)) {
                $('.tweets').twitterSlider('clear', index).blockSlider('updateChildren');
                Trend.loadTweets();
           }
        });  
        
    setTimeout(function(){
        tweets.eq(1).blockSlider({
            animation: 'fade', 
            callback: function(){
                setTweetsAreaBounds(tweets.eq(1));
            }
        });
    }, 4000);

    $('.fb a').click(function() {
        var title = encodeURIComponent(document.title),
            url = encodeURIComponent(location.href);
        window.open('http://www.facebook.com/sharer.php?u=' + url + '&t=' + title,
            'Facebook share', 'width=600,height=400,scrollbars=no');
        return false;
    });

    $('.tw a').click(function() {
        var title = encodeURIComponent(document.title),
            url = encodeURIComponent(location.href);
        window.open('http://twitter.com/share?text=' + title + '&url=' + url,
            'Twitter share', 'width=650,height=400,scrollbars=no');
        return false;
    });

    $('.join-conv-header, .join-conv-lk').click(function() {
        if($(this).hasClass('join-conv-lk') && _logged_in) {
            location.reload();
        } else {
            window.open('/login', null, 'width=800,height=600');
        }
        return false;
    });

    $('.publish-lk').click(function () {
        tokbox.publish();
        $(this).parents('.publish-wrapper').fadeOut('fast');
        return false;
    });

    $('.close-publish').click(function () {
        $(this).parents('.publish-wrapper').fadeOut('fast');
        return false;
    });

    if(_logged_in) { $('.publish-wrapper').show(); }

    setBackToLogout();
});

$(window).bind('hashchange', function(e) {
    location.reload();
    // var sessionId = getTokboxSessionId();
    // if(sessionId !== null) {
    //     _tokbox_session_id = sessionId;
    //     tokbox.disconnect();
    //     clearTimeout(window.currentPingTimeout);
    //     $('.video').remove();
    //     tokbox = new Tokbox(_tokbox_session_id, _partner_key, _logged_in, _token);
    //     setCurrentTrendName();
    //     $('.tweets').twitterSlider('clear', true);
    //     Trend.loadTweets();
    //     $('.publish-wrapper').show();
    //     setBackToLogout();
    // }
});
