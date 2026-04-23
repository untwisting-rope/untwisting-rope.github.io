function initImageCarousels() {
  $('.image-carousel').each(function() {
    var $carousel = $(this);
    var $track = $carousel.find('.carousel-track');
    var $slides = $carousel.find('.carousel-slide');
    var totalSlides = $slides.length;
    var currentIndex = 0;

    function goTo(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      $track.css('transform', 'translateX(-' + (currentIndex * 100) + '%)');
      $carousel.find('.carousel-dot').removeClass('is-active').eq(currentIndex).addClass('is-active');
      var $slide = $slides.eq(currentIndex);
      var caption = $slide.attr('data-caption');
      if (!caption) {
        caption = $slide.find('img').attr('alt');
      }
      $carousel.find('.carousel-caption').text('"' + caption + '"');
    }

    var $dotsContainer = $carousel.find('.carousel-dots');
    for (var i = 0; i < totalSlides; i++) {
      $dotsContainer.append('<button type="button" class="carousel-dot" data-index="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>');
    }

    $carousel.find('.carousel-nav.carousel-prev').on('click', function() {
      goTo(currentIndex - 1);
    });
    $carousel.find('.carousel-nav.carousel-next').on('click', function() {
      goTo(currentIndex + 1);
    });
    $carousel.find('.carousel-dots').on('click', '.carousel-dot', function() {
      goTo(parseInt($(this).attr('data-index'), 10));
    });

    goTo(0);
  });
}

function initStyleKnobs() {
  $('.knob-widget').each(function() {
    var $widget = $(this);
    var $slider = $widget.find('.knob-slider');
    var $output = $widget.find('.knob-output');
    var $reference = $widget.find('.knob-reference');
    var $value = $widget.find('.knob-value');
    var $thumbs = $widget.find('.knob-ref-thumb');

    // Build per-reference state, preloading output frames so dragging is smooth.
    var refs = [];
    $thumbs.each(function() {
      var $btn = $(this);
      var basePath = $btn.data('base');
      var count = parseInt($btn.data('count'), 10);
      var values = String($btn.data('values')).split(',').map(parseFloat);
      var imgs = [];
      for (var i = 1; i <= count; i++) {
        var n = (i < 10 ? '0' + i : '' + i);
        var img = new Image();
        img.src = basePath + '/output_' + n + '.jpg';
        imgs.push(img);
      }
      refs.push({
        basePath: basePath,
        count: count,
        values: values,
        imgs: imgs
      });
    });

    if (refs.length === 0) return;

    var activeIdx = 0;
    var initialActive = $thumbs.filter('.is-active').first();
    if (initialActive.length) {
      activeIdx = $thumbs.index(initialActive);
    } else {
      $thumbs.eq(0).addClass('is-active');
    }

    function update() {
      var ref = refs[activeIdx];
      var idx = parseInt($slider.val(), 10);
      if (isNaN(idx) || idx < 0) idx = 0;
      if (idx >= ref.imgs.length) idx = ref.imgs.length - 1;
      $output.attr('src', ref.imgs[idx].src);
      var v = ref.values[idx];
      $value.text(v.toFixed(2));
      var pct = (ref.count > 1) ? (idx / (ref.count - 1)) * 100 : 0;
      $slider[0].style.setProperty('--knob-pct', pct + '%');
    }

    function applyRef() {
      var ref = refs[activeIdx];
      $reference.attr('src', ref.basePath + '/reference.jpg');
      $slider.attr('max', Math.max(0, ref.count - 1));
      var idx = parseInt($slider.val(), 10);
      if (isNaN(idx) || idx >= ref.count) {
        idx = 0;
        $slider.val(idx);
      }
      update();
    }

    $thumbs.on('click', function() {
      var newIdx = $thumbs.index(this);
      if (newIdx === activeIdx) return;
      activeIdx = newIdx;
      $thumbs.removeClass('is-active');
      $(this).addClass('is-active');
      applyRef();
    });

    $slider.on('input change', update);
    applyRef();
  });
}

$(document).ready(function() {
  initImageCarousels();
  initStyleKnobs();

  $('.navbar-burger').click(function() {
    $('.navbar-burger').toggleClass('is-active');
    $('.navbar-menu').toggleClass('is-active');
  });
});
