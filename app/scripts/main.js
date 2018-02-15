
// Replace all SVG images with inline SVG
jQuery('img.svg').each(function() {
  var $img = jQuery(this);
  var imgID = $img.attr('id');
  var imgClass = $img.attr('class');
  var imgURL = $img.attr('src');

  jQuery.get(imgURL, function(data) {
    // Get the SVG tag, ignore the rest
    var $svg = jQuery(data).find('svg');
    // Add replaced image's ID to the new SVG
    if (typeof imgID !== 'undefined') {
      $svg = $svg.attr('id', imgID);
    }
    // Add replaced image's classes to the new SVG
    if (typeof imgClass !== 'undefined') {
      $svg = $svg.attr('class', imgClass + ' replaced-svg');
    }
    // Remove any invalid XML tags as per http://validator.w3.org
    $svg = $svg.removeAttr('xmlns:a');
    // Replace image with new SVG
    $img.replaceWith($svg);
  }, 'xml');
});

$('form.valthis').validate({
  ignore: ":disabled, :hidden",
  errorPlacement: function(error, element) {
    var fg = $(element).closest('.form-group').find('.err-msg');
    error.appendTo(fg);
    $('select.select').selectpicker('refresh');
  }
});

$('form.valthis').each(function(){
  var select = $(this).find('select.select');
  select.on('changed.bs.select', function(e) {
    $(this).valid();
    $(this).closest('.bootstrap-select').removeClass('error');
  });
});

$('select.select').each(function() {
  var s = $(this).data('size'),
      w = $(this).data('width');
  if( s == undefined ){
    s = 5;
  }
  if( w == undefined ){
    w = 100+'%';
  }
  $(this).selectpicker({
    style: 'select-control',
    width: w,
    size: s
  });
});

//TOGGLE MENU
$('.menu-toggle').click(function() {
  $('body').toggleClass('menu-hidden');
});
$('.has-sub').each(function(){
  var t = $(this),
      fa = t.find('.fa'),
      sm = t.find('.sub-menu'),
      link = sm.find('a');

  fa.click(function(e){
    e.preventDefault();
    e.stopPropagation();
    sm.slideToggle(250);
    // fa.toggleClass('up');
    $('.has-sub').removeClass('mo');
    fa.closest('.has-sub').toggleClass('mo');
    $('.sub-menu').not(sm).slideUp(250);
  })
  link.click(function(e){
    e.stopPropagation();
  });
  // $(window).click(function() {
  //   sm.slideUp(250);
  //   t.removeClass('mo');
  // });
});

//MATCH HEIGHT
function setMH() {
  $('.item').find('.set-h').matchHeight();
  $('.same-h').find('.set-h').matchHeight({
    byRow: false
  });
}
setMH();
// setheight as window height
function setheight() {
    var windowH = $(window).height();
    $('.setheight').css({
        'min-height': windowH
    })
}
setheight();

//Check all for tabel
$('.checkAll').change(function() {
  var par = $(this).closest('table');
      inp = par.find('input:checkbox');
  inp.prop('checked', $(this).prop('checked'));
});

// MASK

function maskFunc(){
  $('.faktur-pajak').each(function(){
    $(this).mask('000.000-00.00000000');
  })
  $('.currency').each(function(){
    var   t = $(this),
          form = t.closest('form');
    t.mask('000.000.000.000.000', {reverse: true});
    form.submit(function(){
      t.unmask();
    });
  });
  $('.discount').each(function(){
    $(this).mask('000');
  })
  // $('.phone').each(function(){
  //   $(this).mask('+00-000-0000-0000', {reverse: true});
  // })
}maskFunc();
$("body").find('.phone').keypress(function(e) {
    if (e.which != 8 && e.which != 0 && e.which != 43 && e.which != 45 && (e.which < 48 || e.which > 57)) {
      return false;
    }
});

//Datepicker
$('.date').each(function() {
  var input = $(this).find('input');
  input.datepicker({
    autoclose: true,
    format : "dd/mm/yyyy"
  });
  input.change(function() {
    $(this).valid();
  })
});

// Multiplier Add
$('.multiplier').each(function(){
  var t = $(this),
      item = t.find('.item'),
      add  = t.find('.btn-add'),
      format = item.eq(0).clone(),
      max = t.data('max'),
      n = 1;

  function reOrder(){
    var roTemp = 0;
    $('body').find('.item').each(function(){
      $(this).find('input:not(.ns)').each(function() {
        var name = $(this).attr('name');
        name = name.substring(0, name.indexOf('['));
        $(this).attr('name', name + '[' + roTemp + ']');
      });
      roTemp++;
    })
    if(roTemp > 1){
      t.addClass('multiplied');
    } else {
      t.removeClass('multiplied');
    }
  }

  // add.click(function(){
  //   t.find('select.select').selectpicker('destroy');
  //   var format = item.eq(0).clone(),
  //       html = format.clone();
    
  //   if(n < max) {
  //     n++;
  //     items.append(html.fadeIn(500));
  //     bind(html);
  //     reOrder();
  //   }
  //   if(max==undefined) {
  //     items.append(html.fadeIn(500));
  //     bind(html);
  //     reOrder();
  //   }

  //   html.find('input').each(function() {
  //     $(this).val('');
  //     $(this).attr('value', '');
  //   });
  // })


  // function bind(obj){
  //   maskFunc();
  //   $('.selectpicker').each(function() {
  //     var input = $(this).find('input');
  //     input.datepicker({
  //       autoclose: true
  //     });
  //     input.change(function() {
  //       $(this).valid();
  //     })
  //   });
  // }

  add.click(function(){
    var html = format.clone();
    if(n < max) {
      n++;
      t.append(html.fadeIn(500));
      bind(html);
      reOrder();
    }
    if(max==undefined) {
      t.append(html.fadeIn(500));
      reOrder();
      bind(html);
    }
  })

  $('body').on('click', '.btn-del', function() {
    n--;
    $(this).closest('.item').remove();
    reOrder();
  });
})

$('.bootstrap-select').each(function(){
  var t = $(this),
      dm = t.find('ul.dropdown-menu'),
      opt = dm.find('li');

  if(opt.length < 2) {
    opt.html('<li class="no-results" style="display: list-item;">No data found</li>');
  }
});