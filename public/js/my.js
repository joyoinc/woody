
$(document).ready(function(){

  $('#apply-to-wall-btn').click(function(){ 
    var btn = $(this);
    var tile = $('#show-tile');
    var wall = $('#show-wall');
    if(btn.hasClass('btn-primary')) {
      btn.removeClass('btn-primary');
      btn.addClass('btn-info');
      btn.text('Undo');

      wall.css('background', 'url("'+tile.attr('src')+'")');
    } else {
      btn.removeClass('btn-info');
      btn.addClass('btn-primary');
      btn.text('Apply');

      wall.css('background', '');
    }
  });

  $('.next-stat-btn').click(function(){ 
    var btn = $(this);
    var baseurl = '/tile/' + itemid;
    var nxtid = $(this).attr('gotostat');
    $.ajax({
      url: baseurl + '/' + nxtid,
      type: 'put'
    }).done(function(data, textStatus, jqXHR){
        if(textStatus==='success') {
          alert('状态改变成功');
          window.location.href = baseurl;
        }
    });
  });
});
