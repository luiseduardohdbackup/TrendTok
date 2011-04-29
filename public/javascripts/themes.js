var themes = {    
    current: 'fandango',
    themes: {
            'default':  {
                            deltaTheme: 0,
                            template: '<div class="video draggable" style="z-index: 9">\
                                            <div class="border-all box-shadow {{videoSize}}">\
                                                <div class="ctrls-wrapper">\
                                                    <div class="ctrls box-shadow border-top">\
                                                        <div class="ctrl dragg-video">\
                                                            <a href="#">Drag</a>\
                                                            <span class="box-shadow"></span>\
                                                        </div>\
                                                        <div class="ctrl close-video">\
                                                            <a href="#">Close</a>\
                                                            <span class="box-shadow"></span>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                                <div class="vid-wrapper">\
                                                    <div class="obj-wrapper {{id}}">\
                                                        <div id="{{id}}"></div>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                       </div>'
                        },
           'fandango' : {
                            deltaTheme: 29,
                            template : '<div class="video draggable" style="z-index: 9">\
                                            <div class="border-all box-shadow {{videoSize}}">\
                                                <div class="ctrls-wrapper">\
                                                    <div class="ctrls box-shadow border-top">\
                                                        <div class="ctrl dragg-video">\
                                                            <a href="#">Drag</a>\
                                                            <span class="box-shadow"></span>\
                                                        </div>\
                                                        <div class="ctrl close-video">\
                                                            <a href="#">Close</a>\
                                                            <span class="box-shadow"></span>\
                                                        </div>\
                                                    </div>\
                                                </div>\
                                                <div class="vid-wrapper">\
                                                    <div class="obj-wrapper {{id}}">\
                                                    <div id="{{id}}"></div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div class="theme cloud-left"></div>\
                                        <div class="theme cloud-right"></div>\
                                        <div class="theme cloud-right-video"></div>\
                                        <div class="theme cloud-left-video"></div>\
                                    </div>'
                          }
        },
    changeTheme: function(name){
        this.current = name; 
    }, 
    getTemplate: function(){
        return this.themes[this.current].template.replace(/\{\{videoSize\}\}/g, Positions.resolution);
    },
    getThemeDelta: function(){
        return this.themes[this.current].deltaTheme;
    },
    getCalcThemeDelta: function(video){
        var delta = 0,
            theme = null,
            deltas = video.find('.theme').map(function(){
                theme = $(this);
                delta = theme.css('left');
                if(delta == 'auto' || parseInt(delta) >= 0){    
                    delta = theme.css('right');
                    if(delta == 'auto' || parseInt(delta) >= 0){
                        return 0;
                    }
                }      
                return Math.abs(parseInt(delta));
            }).toArray();
        delta = deltas.length ? deltas.sort(function(a,b){return a < b;})[0] : 0;
        video.data('delta', delta);
        return delta;
    },
    loadTheme: function(themeBtn){
        !themeBtn && (themeBtn = $('.activate-theme'));
        if(/default/.test(themes.current)){
            $('.theme').remove();
            $('link:last').remove();
           $('.obj-wrapper').die('mouseenter mouseleave').closest('.border-all').animate({paddingBottom: '6px'}, 'fast');
           themeBtn.removeClass('active').text(themeBtn.data('text'));
        }
        else{
            themeBtn.text('Deactivate Theme');
            themeBtn.addClass('active');
            var url = "/stylesheets/themes/" + themes.current + ".css";
            document.createStyleSheet  ? document.createStyleSheet(url) : $("<link>").attr({rel:  "stylesheet", type: "text/css", href: url}).appendTo('head');
            if(/fandango/.test(themes.current)){
                var obj_wrapper = $('.obj-wrapper');
                obj_wrapper.closest('.border-all').css({paddingBottom: '28px'});
                obj_wrapper.live('mouseenter', function(){
                    $(this).closest('.border-all').animate({paddingBottom: '+=25px'}, 'fast');
                }).live('mouseleave', function(){
                     $(this).closest('.border-all').animate({paddingBottom: '28px'}, 'fast');
                });
            }
        }
    }
};