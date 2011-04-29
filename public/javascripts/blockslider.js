$.widget('ui.blockSlider', {
    options: {
        speed: 2000,
        delay: 8000,
        childSize: true,
        callback: false
    },
    _init: function() {
        this._children = this.element.children();
        this._parent = this.element.parent();
        this._parentWidth = this._parent.width();
        /carrousel/.test(this.options.animation) ? this._carrousel() : this.startFade();
    },
    updateChildren: function() {
        this._children = this.element.children();
    },
    _crossfade: function() {   
        var that = this,
            currentItem = that._getCurrentItemIndex();
        this._children.eq(currentItem).fadeOut(this.options.speed, function () {
            $(this).show()                 
            that._assignZIndex(currentItem);                                            
            that._children.eq(++currentItem % that._children.length).addClass('active');
            that.startFade();
            that.element.trigger('blockSlider.faded', [currentItem]);
        });
    },  
    _assignZIndex: function(currentItem){
        var that = this;
        that._children.each(function (i, obj) {
            $(this).css('z-index', ((that._children.length - i) + currentItem) % that._children.length);
        }).removeClass('active');
    },
    _getCurrentItemIndex: function() {
        var currentItem = this._children.filter('.active:first').index();
        if (currentItem < 0) { currentItem = 0; }
        return currentItem;        
    },
    _fade: function() {
        var that = this,
            currentItem = that._getCurrentItemIndex(),   
            next = (currentItem+1) % that._children.length,
            nextWidth = this._children.eq(next).outerWidth();
        (nextWidth > this.element.width()) && that.element.width(nextWidth); 
        this._children.eq(currentItem).fadeOut(function(){
          (nextWidth != that.element.width()) && that.element.width(nextWidth);
        });
        this._children.eq(next).fadeIn(this.options.speed, function(){
            that._assignZIndex(currentItem);                                                           
            $(this).addClass('active');
            that.startFade();
            that.element.trigger('blockSlider.faded', [currentItem]);
            that.options.callback && that.options.callback(); 
        });
    },
    startFade: function() {
        var that = this;
        this._fadeTimeoutId = setTimeout(function() { /fade/.test(that.options.animation) ? that._fade() : that._crossfade(); }, this.options.delay);
    },
    stopFade: function() {
        clearTimeout(this._fadeTimeoutId);
    },
    _carrousel: function() {
        this._setInitialWidth();
        if(this.options.nextArrow) {
            this.nextArrow = $(this.options.nextArrow, this._parent.parent());
            this._bindRightArrow();
        }
        if(this.options.backArrow) {
            this.backArrow = $(this.options.backArrow, this._parent.parent());
            this._bindLeftArrow();
        }
        this._setRightArrowState();
    },
    _setInitialWidth: function() {
        var width = 0;
        this._children.each(function () {
            width += $(this).outerWidth(true);
        });
        this.element.width(width);
    },
    _bindRightArrow: function() {
        if(this.nextArrow) {
            var that = this;
            this.nextArrow.click(function() {
                that.scrollRight();
                // moverlo a la der y si es auto detenerlo
            });
        }
    },
    scrollRight: function() {
        var left = parseInt(this.element.css('left')),
            w = this.element.outerWidth();
        if(this._parentWidth >= (w + left)) {
            // TODO: circle
            return false;
        } else {
            var slide;
            this._children.each(function() {
               slide = $(this);
               if((slide.position().left + slide.outerWidth()) > Math.abs(left)){
                   return false;
               }
            });
            slideWidth = slide.outerWidth(true);
            left = (slideWidth > w + left - this._parentWidth) ?
                (w - this._parentWidth) * -1 : slide.next().position().left * -1;
            this.element.trigger('blockSlider.scrollRight', [left]);
            this._move(left);
        }
    },
    _move: function(left) {
        var that = this;
        this.element.stop(true, false).animate({left: left}, this.options.speed, function() {
            that._setRightArrowState();
            that._setLeftArrowState();
            that.element.trigger('blockSlider.move', [left]);
        });
    },
    _bindLeftArrow: function() {
        if(this.backArrow) {
            var that = this;
            this.backArrow.click(function() {
                that.scrollLeft();
                // moverlo a la der y si es auto detenerlo
            });
        }
    },
    scrollLeft: function() {
        var left = parseInt(this.element.css('left'));
        for(var i = this._children.length - 1; i >= 0; i--) {
           slide = this._children.eq(i);
           if((slide.position().left + left) < this._parentWidth){
               break;
           }
        }
        left = -1 * slide.position().left + this._parentWidth;
        left > 0 && (left = 0);
        this.element.trigger('blockSlider.scrollLeft', [left]);
        this._move(left);
    },
    _setRightArrowState: function() {
        this.nextArrow &&
            (this._parent.width() >= (this.element.outerWidth() + parseInt(this.element.css('left'))) ?
                this._deactivateRightArrow() : this._activateRightArrow());
    },
    _setLeftArrowState: function() {
        this.backArrow &&
            (parseInt(this.element.css('left')) == 0 ?
                this._deactivateLeftArrow() : this._activateLeftArrow());
    },
    _activateRightArrow: function() {
        this.nextArrow.addClass('active');
    },
    _deactivateRightArrow: function() {
        this.nextArrow.removeClass('active');
    },
    _activateLeftArrow: function() {
        this.backArrow.addClass('active');
    },
    _deactivateLeftArrow: function() {
        this.backArrow.removeClass('active');
    },
    scrollTo: function(index) {
        var scroll = this._children.eq(index),
            left = scroll.position().left * -1;
        if(Math.abs(left) + scroll.outerWidth() > this._parentWidth) {
            left = this._parentWidth + left - scroll.outerWidth();
        }
        this._move(left);
    }
});
