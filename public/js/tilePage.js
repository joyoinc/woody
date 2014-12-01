
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
    var nxtid = $(this).attr('gotostat');
    $.ajax({
      url: String.format("/_api/updateTileStatus/{0}/{1}", itemid, nxtid),
      type: 'put'
    }).done(function(data, textStatus, jqXHR){
        if(textStatus==='success') {
          console.log(String.format("ajax call: updateTileStatus {0}!" , data.result));
          window.location.href = String.format("/tile/{0}", itemid);
        }
    });
  });
});
