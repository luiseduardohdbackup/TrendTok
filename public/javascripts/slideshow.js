$.widget('ui.twitterSlider', {
    options: {
        split: 3,
        max: 6
    },
    _create: function() {
        this.element.data('tweets', []);
        this.tweetTemplate = '<a href="http://www.twitter.com/{{from_user}}" class="author" target="_blank">{{from_user}}</a>, {{text}}';
    },
    clear: function(until) {
        if(until === true) {
            this.element.data('tweets', []).children().remove();
        } else if(this.element.children().length > this.options.max) {
            if(typeof until !== 'undefined') {
                this.element.data('tweets').splice(0, until);
                this.element.children(':eq(' + until + ')').prevAll().remove();
            } else {
                this.element.data('tweets', []).children().remove();
            }
        }
    },
    append: function(tweets){
        var currentTweets = this.element.data('tweets'),
             that = this,
             sliderHeight = this.element.height(),
             length = currentTweets.length;
         $.each(tweets, function (i, tweet) {
            if ($.inArray(tweet.id, currentTweets) < 0) {
                var css_class = '',
                    z_index = 0;
                if(!length){
                    z_index = that.options.split - i - 1;
                    css_class =  (i == 0) ? "active" : "";
                }
                else{
                    z_index = 0;
                }
                var autolink = tweet.text.replace(/(https?:\/\/[\w\-:;?&=+.%#\/]+)/gi, '<a href="$1" target="_blank">$1</a>');
                tweet.text = that.tweetTemplate.replace(/\{\{from_user\}\}/g, tweet.from_user).replace(/\{\{text\}\}/g, autolink);
                //tweet.text = "RT @IvanGtez: Beagles bicolor, macho y hembra extraviados ayer en Residencial Victoria. Solo llevan collar de castigo y collar antipulga RT @IvanGtez: Beagles bicolor, macho y hembra extraviados ayer en Residencial Victoria. Solo llevan collar de castigo y collar antipulga";
                var li = $('<li/>').addClass('tweet ' + (css_class ? css_class : '')).attr('id', tweet.id)
                    .css('z-index', z_index).append('<p>' + tweet.text + '</p><span></span>')
                    .appendTo(that.element);
                var liHeight = li.height();             
                li.css('display','block');
                li.width(li.find('p').outerWidth() + 1);
                css_class == 'active' ? that.element.css('width', li.outerWidth()) : li.css('display', 'none');
                (sliderHeight <  liHeight) && (sliderHeight = liHeight);
                currentTweets.push(tweet.id);
            }
        });
        this.element.css({'height': sliderHeight});
    }
});

