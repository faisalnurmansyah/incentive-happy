
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG4vLyBSZXBsYWNlIGFsbCBTVkcgaW1hZ2VzIHdpdGggaW5saW5lIFNWR1xyXG5qUXVlcnkoJ2ltZy5zdmcnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gIHZhciAkaW1nID0galF1ZXJ5KHRoaXMpO1xyXG4gIHZhciBpbWdJRCA9ICRpbWcuYXR0cignaWQnKTtcclxuICB2YXIgaW1nQ2xhc3MgPSAkaW1nLmF0dHIoJ2NsYXNzJyk7XHJcbiAgdmFyIGltZ1VSTCA9ICRpbWcuYXR0cignc3JjJyk7XHJcblxyXG4gIGpRdWVyeS5nZXQoaW1nVVJMLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAvLyBHZXQgdGhlIFNWRyB0YWcsIGlnbm9yZSB0aGUgcmVzdFxyXG4gICAgdmFyICRzdmcgPSBqUXVlcnkoZGF0YSkuZmluZCgnc3ZnJyk7XHJcbiAgICAvLyBBZGQgcmVwbGFjZWQgaW1hZ2UncyBJRCB0byB0aGUgbmV3IFNWR1xyXG4gICAgaWYgKHR5cGVvZiBpbWdJRCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgJHN2ZyA9ICRzdmcuYXR0cignaWQnLCBpbWdJRCk7XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgcmVwbGFjZWQgaW1hZ2UncyBjbGFzc2VzIHRvIHRoZSBuZXcgU1ZHXHJcbiAgICBpZiAodHlwZW9mIGltZ0NsYXNzICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAkc3ZnID0gJHN2Zy5hdHRyKCdjbGFzcycsIGltZ0NsYXNzICsgJyByZXBsYWNlZC1zdmcnKTtcclxuICAgIH1cclxuICAgIC8vIFJlbW92ZSBhbnkgaW52YWxpZCBYTUwgdGFncyBhcyBwZXIgaHR0cDovL3ZhbGlkYXRvci53My5vcmdcclxuICAgICRzdmcgPSAkc3ZnLnJlbW92ZUF0dHIoJ3htbG5zOmEnKTtcclxuICAgIC8vIFJlcGxhY2UgaW1hZ2Ugd2l0aCBuZXcgU1ZHXHJcbiAgICAkaW1nLnJlcGxhY2VXaXRoKCRzdmcpO1xyXG4gIH0sICd4bWwnKTtcclxufSk7XHJcblxyXG4kKCdmb3JtLnZhbHRoaXMnKS52YWxpZGF0ZSh7XHJcbiAgaWdub3JlOiBcIjpkaXNhYmxlZCwgOmhpZGRlblwiLFxyXG4gIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbihlcnJvciwgZWxlbWVudCkge1xyXG4gICAgdmFyIGZnID0gJChlbGVtZW50KS5jbG9zZXN0KCcuZm9ybS1ncm91cCcpLmZpbmQoJy5lcnItbXNnJyk7XHJcbiAgICBlcnJvci5hcHBlbmRUbyhmZyk7XHJcbiAgICAkKCdzZWxlY3Quc2VsZWN0Jykuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgfVxyXG59KTtcclxuXHJcbiQoJ2Zvcm0udmFsdGhpcycpLmVhY2goZnVuY3Rpb24oKXtcclxuICB2YXIgc2VsZWN0ID0gJCh0aGlzKS5maW5kKCdzZWxlY3Quc2VsZWN0Jyk7XHJcbiAgc2VsZWN0Lm9uKCdjaGFuZ2VkLmJzLnNlbGVjdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICQodGhpcykudmFsaWQoKTtcclxuICAgICQodGhpcykuY2xvc2VzdCgnLmJvb3RzdHJhcC1zZWxlY3QnKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuICB9KTtcclxufSk7XHJcblxyXG4kKCdzZWxlY3Quc2VsZWN0JykuZWFjaChmdW5jdGlvbigpIHtcclxuICB2YXIgcyA9ICQodGhpcykuZGF0YSgnc2l6ZScpLFxyXG4gICAgICB3ID0gJCh0aGlzKS5kYXRhKCd3aWR0aCcpO1xyXG4gIGlmKCBzID09IHVuZGVmaW5lZCApe1xyXG4gICAgcyA9IDU7XHJcbiAgfVxyXG4gIGlmKCB3ID09IHVuZGVmaW5lZCApe1xyXG4gICAgdyA9IDEwMCsnJSc7XHJcbiAgfVxyXG4gICQodGhpcykuc2VsZWN0cGlja2VyKHtcclxuICAgIHN0eWxlOiAnc2VsZWN0LWNvbnRyb2wnLFxyXG4gICAgd2lkdGg6IHcsXHJcbiAgICBzaXplOiBzXHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuLy9UT0dHTEUgTUVOVVxyXG4kKCcubWVudS10b2dnbGUnKS5jbGljayhmdW5jdGlvbigpIHtcclxuICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ21lbnUtaGlkZGVuJyk7XHJcbn0pO1xyXG4kKCcuaGFzLXN1YicpLmVhY2goZnVuY3Rpb24oKXtcclxuICB2YXIgdCA9ICQodGhpcyksXHJcbiAgICAgIGZhID0gdC5maW5kKCcuZmEnKSxcclxuICAgICAgc20gPSB0LmZpbmQoJy5zdWItbWVudScpLFxyXG4gICAgICBsaW5rID0gc20uZmluZCgnYScpO1xyXG5cclxuICBmYS5jbGljayhmdW5jdGlvbihlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBzbS5zbGlkZVRvZ2dsZSgyNTApO1xyXG4gICAgLy8gZmEudG9nZ2xlQ2xhc3MoJ3VwJyk7XHJcbiAgICAkKCcuaGFzLXN1YicpLnJlbW92ZUNsYXNzKCdtbycpO1xyXG4gICAgZmEuY2xvc2VzdCgnLmhhcy1zdWInKS50b2dnbGVDbGFzcygnbW8nKTtcclxuICAgICQoJy5zdWItbWVudScpLm5vdChzbSkuc2xpZGVVcCgyNTApO1xyXG4gIH0pXHJcbiAgbGluay5jbGljayhmdW5jdGlvbihlKXtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfSk7XHJcbiAgLy8gJCh3aW5kb3cpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gIC8vICAgc20uc2xpZGVVcCgyNTApO1xyXG4gIC8vICAgdC5yZW1vdmVDbGFzcygnbW8nKTtcclxuICAvLyB9KTtcclxufSk7XHJcblxyXG4vL01BVENIIEhFSUdIVFxyXG5mdW5jdGlvbiBzZXRNSCgpIHtcclxuICAkKCcuaXRlbScpLmZpbmQoJy5zZXQtaCcpLm1hdGNoSGVpZ2h0KCk7XHJcbiAgJCgnLnNhbWUtaCcpLmZpbmQoJy5zZXQtaCcpLm1hdGNoSGVpZ2h0KHtcclxuICAgIGJ5Um93OiBmYWxzZVxyXG4gIH0pO1xyXG59XHJcbnNldE1IKCk7XHJcbi8vIHNldGhlaWdodCBhcyB3aW5kb3cgaGVpZ2h0XHJcbmZ1bmN0aW9uIHNldGhlaWdodCgpIHtcclxuICAgIHZhciB3aW5kb3dIID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgJCgnLnNldGhlaWdodCcpLmNzcyh7XHJcbiAgICAgICAgJ21pbi1oZWlnaHQnOiB3aW5kb3dIXHJcbiAgICB9KVxyXG59XHJcbnNldGhlaWdodCgpO1xyXG5cclxuLy9DaGVjayBhbGwgZm9yIHRhYmVsXHJcbiQoJy5jaGVja0FsbCcpLmNoYW5nZShmdW5jdGlvbigpIHtcclxuICB2YXIgcGFyID0gJCh0aGlzKS5jbG9zZXN0KCd0YWJsZScpO1xyXG4gICAgICBpbnAgPSBwYXIuZmluZCgnaW5wdXQ6Y2hlY2tib3gnKTtcclxuICBpbnAucHJvcCgnY2hlY2tlZCcsICQodGhpcykucHJvcCgnY2hlY2tlZCcpKTtcclxufSk7XHJcblxyXG4vLyBNQVNLXHJcblxyXG5mdW5jdGlvbiBtYXNrRnVuYygpe1xyXG4gICQoJy5mYWt0dXItcGFqYWsnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAkKHRoaXMpLm1hc2soJzAwMC4wMDAtMDAuMDAwMDAwMDAnKTtcclxuICB9KVxyXG4gICQoJy5jdXJyZW5jeScpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgIHZhciAgIHQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgZm9ybSA9IHQuY2xvc2VzdCgnZm9ybScpO1xyXG4gICAgdC5tYXNrKCcwMDAuMDAwLjAwMC4wMDAuMDAwJywge3JldmVyc2U6IHRydWV9KTtcclxuICAgIGZvcm0uc3VibWl0KGZ1bmN0aW9uKCl7XHJcbiAgICAgIHQudW5tYXNrKCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuICAkKCcuZGlzY291bnQnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAkKHRoaXMpLm1hc2soJzAwMCcpO1xyXG4gIH0pXHJcbiAgLy8gJCgnLnBob25lJykuZWFjaChmdW5jdGlvbigpe1xyXG4gIC8vICAgJCh0aGlzKS5tYXNrKCcrMDAtMDAwLTAwMDAtMDAwMCcsIHtyZXZlcnNlOiB0cnVlfSk7XHJcbiAgLy8gfSlcclxufW1hc2tGdW5jKCk7XHJcbiQoXCJib2R5XCIpLmZpbmQoJy5waG9uZScpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmIChlLndoaWNoICE9IDggJiYgZS53aGljaCAhPSAwICYmIGUud2hpY2ggIT0gNDMgJiYgZS53aGljaCAhPSA0NSAmJiAoZS53aGljaCA8IDQ4IHx8IGUud2hpY2ggPiA1NykpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbi8vRGF0ZXBpY2tlclxyXG4kKCcuZGF0ZScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGlucHV0ID0gJCh0aGlzKS5maW5kKCdpbnB1dCcpO1xyXG4gIGlucHV0LmRhdGVwaWNrZXIoe1xyXG4gICAgYXV0b2Nsb3NlOiB0cnVlLFxyXG4gICAgZm9ybWF0IDogXCJkZC9tbS95eXl5XCJcclxuICB9KTtcclxuICBpbnB1dC5jaGFuZ2UoZnVuY3Rpb24oKSB7XHJcbiAgICAkKHRoaXMpLnZhbGlkKCk7XHJcbiAgfSlcclxufSk7XHJcblxyXG4vLyBNdWx0aXBsaWVyIEFkZFxyXG4kKCcubXVsdGlwbGllcicpLmVhY2goZnVuY3Rpb24oKXtcclxuICB2YXIgdCA9ICQodGhpcyksXHJcbiAgICAgIGl0ZW0gPSB0LmZpbmQoJy5pdGVtJyksXHJcbiAgICAgIGFkZCAgPSB0LmZpbmQoJy5idG4tYWRkJyksXHJcbiAgICAgIGZvcm1hdCA9IGl0ZW0uZXEoMCkuY2xvbmUoKSxcclxuICAgICAgbWF4ID0gdC5kYXRhKCdtYXgnKSxcclxuICAgICAgbiA9IDE7XHJcblxyXG4gIGZ1bmN0aW9uIHJlT3JkZXIoKXtcclxuICAgIHZhciByb1RlbXAgPSAwO1xyXG4gICAgJCgnYm9keScpLmZpbmQoJy5pdGVtJykuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAkKHRoaXMpLmZpbmQoJ2lucHV0Om5vdCgubnMpJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xyXG4gICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZygwLCBuYW1lLmluZGV4T2YoJ1snKSk7XHJcbiAgICAgICAgJCh0aGlzKS5hdHRyKCduYW1lJywgbmFtZSArICdbJyArIHJvVGVtcCArICddJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByb1RlbXArKztcclxuICAgIH0pXHJcbiAgICBpZihyb1RlbXAgPiAxKXtcclxuICAgICAgdC5hZGRDbGFzcygnbXVsdGlwbGllZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdC5yZW1vdmVDbGFzcygnbXVsdGlwbGllZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gYWRkLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgLy8gICB0LmZpbmQoJ3NlbGVjdC5zZWxlY3QnKS5zZWxlY3RwaWNrZXIoJ2Rlc3Ryb3knKTtcclxuICAvLyAgIHZhciBmb3JtYXQgPSBpdGVtLmVxKDApLmNsb25lKCksXHJcbiAgLy8gICAgICAgaHRtbCA9IGZvcm1hdC5jbG9uZSgpO1xyXG4gICAgXHJcbiAgLy8gICBpZihuIDwgbWF4KSB7XHJcbiAgLy8gICAgIG4rKztcclxuICAvLyAgICAgaXRlbXMuYXBwZW5kKGh0bWwuZmFkZUluKDUwMCkpO1xyXG4gIC8vICAgICBiaW5kKGh0bWwpO1xyXG4gIC8vICAgICByZU9yZGVyKCk7XHJcbiAgLy8gICB9XHJcbiAgLy8gICBpZihtYXg9PXVuZGVmaW5lZCkge1xyXG4gIC8vICAgICBpdGVtcy5hcHBlbmQoaHRtbC5mYWRlSW4oNTAwKSk7XHJcbiAgLy8gICAgIGJpbmQoaHRtbCk7XHJcbiAgLy8gICAgIHJlT3JkZXIoKTtcclxuICAvLyAgIH1cclxuXHJcbiAgLy8gICBodG1sLmZpbmQoJ2lucHV0JykuZWFjaChmdW5jdGlvbigpIHtcclxuICAvLyAgICAgJCh0aGlzKS52YWwoJycpO1xyXG4gIC8vICAgICAkKHRoaXMpLmF0dHIoJ3ZhbHVlJywgJycpO1xyXG4gIC8vICAgfSk7XHJcbiAgLy8gfSlcclxuXHJcblxyXG4gIC8vIGZ1bmN0aW9uIGJpbmQob2JqKXtcclxuICAvLyAgIG1hc2tGdW5jKCk7XHJcbiAgLy8gICAkKCcuc2VsZWN0cGlja2VyJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAvLyAgICAgdmFyIGlucHV0ID0gJCh0aGlzKS5maW5kKCdpbnB1dCcpO1xyXG4gIC8vICAgICBpbnB1dC5kYXRlcGlja2VyKHtcclxuICAvLyAgICAgICBhdXRvY2xvc2U6IHRydWVcclxuICAvLyAgICAgfSk7XHJcbiAgLy8gICAgIGlucHV0LmNoYW5nZShmdW5jdGlvbigpIHtcclxuICAvLyAgICAgICAkKHRoaXMpLnZhbGlkKCk7XHJcbiAgLy8gICAgIH0pXHJcbiAgLy8gICB9KTtcclxuICAvLyB9XHJcblxyXG4gIGFkZC5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgdmFyIGh0bWwgPSBmb3JtYXQuY2xvbmUoKTtcclxuICAgIGlmKG4gPCBtYXgpIHtcclxuICAgICAgbisrO1xyXG4gICAgICB0LmFwcGVuZChodG1sLmZhZGVJbig1MDApKTtcclxuICAgICAgYmluZChodG1sKTtcclxuICAgICAgcmVPcmRlcigpO1xyXG4gICAgfVxyXG4gICAgaWYobWF4PT11bmRlZmluZWQpIHtcclxuICAgICAgdC5hcHBlbmQoaHRtbC5mYWRlSW4oNTAwKSk7XHJcbiAgICAgIHJlT3JkZXIoKTtcclxuICAgICAgYmluZChodG1sKTtcclxuICAgIH1cclxuICB9KVxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5idG4tZGVsJywgZnVuY3Rpb24oKSB7XHJcbiAgICBuLS07XHJcbiAgICAkKHRoaXMpLmNsb3Nlc3QoJy5pdGVtJykucmVtb3ZlKCk7XHJcbiAgICByZU9yZGVyKCk7XHJcbiAgfSk7XHJcbn0pXHJcblxyXG4kKCcuYm9vdHN0cmFwLXNlbGVjdCcpLmVhY2goZnVuY3Rpb24oKXtcclxuICB2YXIgdCA9ICQodGhpcyksXHJcbiAgICAgIGRtID0gdC5maW5kKCd1bC5kcm9wZG93bi1tZW51JyksXHJcbiAgICAgIG9wdCA9IGRtLmZpbmQoJ2xpJyk7XHJcblxyXG4gIGlmKG9wdC5sZW5ndGggPCAyKSB7XHJcbiAgICBvcHQuaHRtbCgnPGxpIGNsYXNzPVwibm8tcmVzdWx0c1wiIHN0eWxlPVwiZGlzcGxheTogbGlzdC1pdGVtO1wiPk5vIGRhdGEgZm91bmQ8L2xpPicpO1xyXG4gIH1cclxufSk7Il0sImZpbGUiOiJtYWluLmpzIn0=

//# sourceMappingURL=main.js.map
