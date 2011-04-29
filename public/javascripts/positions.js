var Positions = {
    arrangement: 'random',
    resolution: 'big',
    setArrangement: function(arrangement){
        Positions.arrangement = arrangement;
    },
    setResolution: function(videoAreaHeight){
       Positions.resolution = (videoAreaHeight > 800) ?  'big' : (videoAreaHeight > 600 ? 'medium' : 'small');
    },
    random: {
        'big':
        [
            [
                {posX : 303, posY : 0},
                {posX : 5, posY : 50},
                {posX : 680, posY : 0},
                {posX : 360, posY : 278},
                {posX : 35, posY : 320},
                {posX : 677, posY : 240},
                {posX : 198, posY : 560},
                {posX : 585, posY : 500}
            ],
            [
                {posX : 84, posY : 0},
                {posX : 607, posY : 0},
                {posX : 384, posY : 226},
                {posX : 6, posY : 287},
                {posX : 680, posY : 322},
                {posX : 347, posY : 453},
                {posX : 61, posY : 521},
                {posX : 643, posY : 543}
            ],
            [
                {posX : 0, posY : 0},
                {posX : 341, posY : 81},
                {posX : 682, posY : 0},
                {posX : 0, posY : 261},
                {posX : 345, posY : 387},
                {posX : 684, posY : 269},
                {posX : 0, posY : 560},
                {posX : 684, posY : 560}
            ],
            [   
                {posX : 392, posY : 47},
                {posX : 0, posY : 0},
                {posX : 681, posY : 0},
                {posX : 329, posY : 292},
                {posX : 38, posY : 259},
                {posX : 662, posY : 257},
                {posX : 0, posY : 500},
                {posX : 525, posY : 525}
            ]        
        ],
        'medium':
        [
            [
                {posX : 212, posY : 32},            
                {posX : 462, posY : 0},
                {posX : 0, posY : 0},
                {posX : 693, posY : 41},
                {posX : 453, posY : 293},
                {posX : 689, posY : 315},
                {posX : 51, posY : 285},
                {posX : 181, posY : 345}                
            ],
            [
                {posX : 214, posY : 0},            
                {posX : 0, posY : 35},
                {posX : 694, posY : 0},
                {posX : 465, posY : 33},
                {posX : 445, posY : 342},
                {posX : 184, posY : 296},
                {posX : 0, posY : 336},
                {posX : 694, posY : 287}
            ],
            [
                {posX : 203, posY : 0},
                {posX : 0, posY : 0},
                {posX : 456, posY : 36},                
                {posX : 694, posY : 0},
                {posX : 696, posY : 289},
                {posX : 443, posY : 327},
                {posX : 183, posY : 299},
                {posX : 27, posY : 273}                
            ],
            [
                {posX : 214, posY : 33},            
                {posX : 464, posY : 0},
                {posX : 0, posY : 65},
                {posX : 696, posY : 0},
                {posX : 190, posY : 346},
                {posX : 455, posY : 294},
                {posX : 55, posY : 317},
                {posX : 695, posY : 259}
            ],
            [
                {posX : 214, posY : 34},            
                {posX : 0, posY : 0},
                {posX : 444, posY : 65},
                {posX : 698, posY : 0},
                {posX : 698, posY : 258},
                {posX : 427, posY : 323},
                {posX : 165, posY : 312},
                {posX : 91, posY : 287}
            ]        
        ],
        'small':
        [   
            [
                {posX : 233, posY : 0},
                {posX : 457, posY : 75},
                {posX : 0, posY : 48},
                {posX : 705, posY : 0},
                {posX : 170, posY : 248},
                {posX : 677, posY : 253},
                {posX : 402, posY : 320},
                {posX : 0, posY : 360}
            ],
            [
                {posX : 470, posY : 0},
                {posX : 246, posY : 92},
                {posX : 695, posY : 34},
                {posX : 0, posY : 0},
                {posX : 0, posY : 273},
                {posX : 693, posY : 297},
                {posX : 233, posY : 337},
                {posX : 439, posY : 356}
            ],
            [                         
                {posX : 201, posY : 59},
                {posX : 0, posY : 0},
                {posX : 461, posY : 31},
                {posX : 701, posY : 0},
                {posX : 234, posY : 320},
                {posX : 466, posY : 278},
                {posX : 0, posY : 352},
                {posX : 530, posY : 346}
            ],
            [
                {posX : 0, posY : 28},
                {posX : 235, posY : 28},
                {posX : 460, posY : 105},
                {posX : 713, posY : 105},
                {posX : 0, posY : 321},
                {posX : 214, posY : 383},
                {posX : 466, posY : 383},
                {posX : 693, posY : 358}
            ],
            [
                {posX : 240, posY : 56},
                {posX : 457, posY : 0},
                {posX : 0, posY : 23},
                {posX : 700, posY : 0},
                {posX : 214, posY : 356},                
                {posX : 0, posY : 293},
                {posX : 469, posY : 283},
                {posX : 700, posY : 328}
            ]
        ]                    
    },
    grid: [],
    getVideoWidth: function(){
        var video = $('.video:eq(0)'),
            rezisableDiv = video.children('div:eq(0)'),
            width = rezisableDiv.length ? rezisableDiv.css('width', '').width() : $('<div>').addClass(Positions.resolution).css({visibility: 'hidden', height: '0'}).appendTo('body').width();
        themes && (width+=themes.getThemeDelta())
        return width;
    }, 
    wrapperWidth: 960,
    videoWidth: 0,
    videoHeight: 0,
    colSize: 0,
    colWidth: 0,
    padding: 0,
    deltaX : 0,
    deltaY : 0,
    row: 0,
    col: 0,
    maxTop: 0,
    resetPositionsGrid: function(){
        Positions.grid = [];
        Positions.videoWidth = Positions.getVideoWidth();
        Positions.videoHeight = Math.floor(Positions.videoWidth * 3 / 4)
        Positions.colSize = Math.floor(960 / Positions.videoWidth);
        Positions.colWidth = Positions.wrapperWidth/Positions.colSize;
        Positions.padding = Math.floor((Positions.colWidth - Positions.videoWidth)/2);
        Positions.deltaX = 0;
        Positions.deltaY = 0;
        Positions.row = 0;           
        Positions.col = 0;
    },
    getPositionGrid: function(unsorted){
        if(!Positions.grid.length){     
            if(Positions.deltaX >= Positions.wrapperWidth){
              Positions.deltaX = 0;
              Positions.deltaY += Positions.videoHeight;
              Positions.row++;
            }  
            Positions.col = Positions.col % Positions.colSize;
            var posY = Positions.row>0 ? Positions.deltaY + (Positions.row*40) : Positions.deltaY;
            Positions.grid.push({posX: Positions.deltaX + Positions.padding, posY: posY, row:Positions.row, col:Positions.col});
            Positions.deltaX += Positions.colWidth;
            Positions.col++; 
        }
        return Positions.grid.splice(0, 1)[0];
    },
    getPositionDelta: function(){
        var posGrid = Positions.getPositionGrid();
        var signs = [1, -1];
        posGrid.posX = (Math.random() * 31 * signs[Math.round(Math.random() * 1)]) + posGrid.posX;
        posGrid.posY = (Math.random() * 31 * signs[Math.round(Math.random() * 1)]) + posGrid.posY;
        return posGrid;
    },
    duplicatePositionsRandom: function(deltaY){
        $('.video').each(function(){                                      
            var pos = $(this).data('position'),
                posClone = {};
            for(data in pos){
                posClone[data] = pos[data];
            }
            posClone.posY += deltaY;
            Positions.random[Positions.resolution][Positions.bundle].push(posClone);
        });
    },
    getPositionRandom: function(minHeight){
         var positionsBundle = Positions.random[Positions.resolution][Positions.bundle];
         if(!positionsBundle.length){                                                              
             if(!minHeight){                                                          
                 var video = $('.video:eq(0)');
                 video.length && (minHeight = video.parent().height())
             }
             Positions.duplicatePositionsRandom(minHeight);
         }   
         /*
         var pos = positionsBundle.splice(0, 1)[0];
         var posClone = {};
          for(data in pos){
                 posClone[data] = pos[data];
             }
         console.log(posClone);
         */
         return positionsBundle.splice(0, 1)[0];
    },
    getPosition: function(minHeight){
        return /random/.test(Positions.arrangement) ? Positions.getPositionRandom(minHeight) : Positions.getPositionGrid();
    },
    addPosition: function(pos){
        /random/.test(Positions.arrangement) ? Positions.random[Positions.resolution][Positions.bundle].unshift(pos) : Positions.grid.unshift(pos);
    },
    bundle: null,
    setPositionBundle: function(){
        var currentBundle = Positions.bundle;
        while(currentBundle == Positions.bundle){
            Positions.bundle = Math.round(Math.random() * (Positions.random[Positions.resolution].length-1));
        }
    }
};
