(function() {
  'use strict';
  var tooltip = window.tooltip = (function() {


    var id = 'tt';
    var top = 3;
    var left = 3;
    var maxw = 300;
    var speed = 10;
    var timer = 20;
    var endalpha = 95;
    var alpha = 0;
    var tt, t, c, b, h;
    var is_hidden = true;
    var is_static = false;
    var _options = {};
    var ie = document.all ? true : false;
    return{
      /* note: if you don't want to define a width, pass w as false.
       *  Pass true for isStatic, to lock the tooltip at the place of appearance. (can be used for tooltips containing links)
       */
      show: function(v, w, isStatic, options) {
        //re-init options
        _options = {};
        for (var i in options) {
          if (options.hasOwnProperty(i)) {
            _options[i] = options[i];
          }

        }

        if (tt === undefined) {
          tt = document.createElement('div');
          tt.setAttribute('id', id);
          t = document.createElement('div');
          t.setAttribute('id', id + 'top');
          c = document.createElement('div');
          c.setAttribute('id', id + 'cont');
          b = document.createElement('div');
          b.setAttribute('id', id + 'bot');
          tt.appendChild(t);
          tt.appendChild(c);
          tt.appendChild(b);
          document.body.appendChild(tt);
          tt.style.opacity = 0;
          tt.style.filter = 'alpha(opacity=0)';
        }
        if (document.addEventListener) {
          document.addEventListener('mousemove', this.pos, false);
        }
        if (isStatic) {
          //remove positioning in .5 seconds ( allows positioning to line up with target)
          tt.nuller = setInterval(function() {
            tooltip.nullPos();
          }, 0.15);
          is_static = true;
          tt.onmouseover = function() {
            clearInterval(tt.timer);
            tt.timer = setInterval(function() {
              tooltip.fade(1);
            }, timer);
          };

          tt.onmouseout = function() {
            tooltip.hide();
            tt.click = function() {
              tooltip.hide();
            };

          };

        } else {
          tt.onmouseover = null;
          tt.onmouseout = null;
          tt.click = null;

          //document.onmousemove = this.pos;
          is_static = false;
        }
        tt.style.display = 'block';
        c.innerHTML = v;//akui.fn.subCharsOnWordsLongerThan(v,40,"_"); // this prevents long names separated by underscore from popping outside of tooltip.
        tt.style.width = w ? w + 'px' : 'auto';
        is_hidden = false;
        if (!w && ie) {
          t.style.display = 'none';
          b.style.display = 'none';
          tt.style.width = tt.offsetWidth;
          t.style.display = 'block';
          b.style.display = 'block';
        }

        if (tt.offsetWidth > maxw) {
          tt.style.width = maxw + 'px';
        }
        h = parseInt(tt.offsetHeight) + top;
        clearInterval(tt.timer);
        tt.timer = setInterval(function() {
          tooltip.fade(1);
        }, timer);

      },
      nullPos: function() {
        if (document.removeEventListener) {
          document.removeEventListener('mousemove', this.pos, false);
        }
        clearInterval(tt.nuller);
      },
      pos: function(el) {

        var u = ie ? event.clientY + document.documentElement.scrollTop : el.pageY;
        var l = ie ? event.clientX + document.documentElement.scrollLeft : el.pageX;
        var w = window, d = document,
          e = d.documentElement, g = d.getElementsByTagName('body')[0],
          doc_w = w.innerWidth || e.clientWidth || g.clientWidth,
          doc_h = w.innerHeight || e.clientHeight || g.clientHeight;

        var active_align_w = 0;
        var active_align_h = 0;

        if (!is_hidden) {
          //adjust for page positioning:
          var max_width = (tt.offsetWidth > maxw ? maxw : tt.offsetWidth);
          active_align_h = ((u < (200)) || (_options.bottom)) ? (tt.offsetHeight) : 0; //doc_h/2
          active_align_w = ((l > (doc_w - max_width)) || _options.left ) ? max_width : 0;
          tt.style.top = ((u - h) + active_align_h) + 'px';
          tt.style.left = ((l + left) - active_align_w) + 'px';
        }
      },
      fade: function(d) {
        var a = alpha;
        if ((a !== endalpha && d === 1) || (a !== 0 && d === -1)) {
          var i = speed;
          if (endalpha - a < speed && d === 1) {
            i = endalpha - a;
          } else if (alpha < speed && d === -1) {
            i = a;
          }
          alpha = a + (i * d);
          tt.style.opacity = alpha * 0.01;
          tt.style.filter = 'alpha(opacity=' + alpha + ')';
        } else {
          clearInterval(tt.timer);
          if (d === -1) {
            tt.style.display = 'none';
            is_hidden = true;
          }
        }
      },
      hide: function() {
        if (tt /*may not have been created yet...*/) {
          clearInterval(tt.timer);
          tt.timer = setInterval(function() {
            tooltip.fade(-1);
          }, timer);
        }
      }
    };
  })();
})();