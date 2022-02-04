
var HOST = 'http://localhost:9595/api/v1.0/';
var KEY = '1234567890';

function create_row(label, input, caption){

    var row = create_element('div', {'class': 'row', 'style': 'padding: 5px 5px 5px 5px; width: 1000px; margin: auto; text-align: center;'});
    $('#trs_container').append(row);

    var outer_div = null;
    if( input == 'label' ){
      if( label == 'ERROR' ){
        outer_div = create_element('div', {'class': 'alert alert-danger', 'role': 'alert', 'style': 'width: 100%;'}, caption);
      }else if( label == 'INFO'){
        outer_div = create_element('div', {'class': 'alert alert-primary', 'role': 'alert', 'style': 'width: 100%;'}, caption);
      }else if (label == 'SUCCESS' ){
        outer_div = create_element('div', {'class': 'alert alert-success', 'role': 'alert', 'style': 'width: 100%;'}, caption);
      }
    }
    else{
      outer_div = create_element('div', {'class': 'input-group'}, '');
    }

    $(row).append(outer_div);

    if( input == 'button' && caption == 'Delete' ){
      var inner_div = create_element('div', {'class': 'input-group-append'}, '');
      $(outer_div).append(inner_div);
      $(inner_div).append( create_element('span', {'class': 'input-group-text', 'style': 'width: 800px;'}, label) );
    }
    else if( label != "ERROR" && label != "INFO" && label != "SUCCESS" && label.length > 0){
        var inner_div = create_element('div', {'class': 'input-group-append'}, '');
        $(outer_div).append(inner_div);
        $(inner_div).append( create_element('span', {'class': 'input-group-text', 'style': 'width: 150px;'}, label) );
    }

    if( input == 'text' || input == 'password'){
        // Text fields
        $(outer_div).append( create_element('input', {'class': 'form-control', 'type': input, 'id': label, 'value': caption}) );

    }else if( input == 'button' ) {
        // Buttons
        if (caption == 'Delete') {
            $(outer_div).append( create_element('button', {'class': 'btn btn-danger', 'type': input, 'onclick': 'reservation_delete_action("' + label + '")'}, caption) );
        }
        else if( caption == 'Hours' ){
          $(outer_div).append( create_element('button', {'class': 'btn btn-info', 'type': input, 'onclick': 'hours_make_admin_ui()'}, caption) );
        }
        else if (caption == 'Login') {
              $(outer_div).append( create_element('button', {'class': 'btn btn-success', 'type': input, 'onclick': 'portal_login_action()'}, caption) );
        }
        else if (caption == 'Portal') {
              $(outer_div).append( create_element('button', {'class': 'btn btn-primary', 'type': input, 'onclick': 'portal_login_make_ui()'}, caption) );
        }
        else if ( caption == 'Reservations' ){
          $(outer_div).append( create_element('button', {'class': 'btn btn-secondary', 'type': input, 'onclick': 'reservations_make_admin_ui()'}, caption) );
        }
        else if (caption == 'Reserve'){
          $(outer_div).append( create_element('button', {'class': 'btn btn-success', 'type': input, 'onclick': 'reservation_make_action()'}, caption) );
        }
        else if (caption == 'Set'){
          $(outer_div).append( create_element('button', {'class': 'btn btn-success', 'type': input, 'onclick': 'hours_make_action()'}, caption) );
        }
    }else if( input == 'link' ){
      // Links
      $(outer_div).append( create_element('a', {'class': 'btn btn-light stretched-link', 'href': '#'}, caption));
   }
}

function clear_content(){
    $('#trs_container').empty();
}

function create_container() {
    var row = create_element('div', {'class': 'row', 'id': 'trs_container', 'style': 'padding: 5px 5px 5px 5px; width: 1000px; margin: auto; text-align: center;'});
    $('body').append(row);
}

function create_element(object_type, attributes, innerText){
    var element = document.createElement(object_type);
    for( var index in attributes ){
        element.setAttribute( index, attributes[index] );
    }
    if( innerText ){
        element.innerHTML = innerText;
    }

    return element;
}

function portal_login_action() {

  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(request.responseText)
        if( data.result ){
          reservations_make_admin_ui();
        }else{
          create_row('ERROR', 'label', 'Invalid credentials provided.');
        }
      }
  };

  request.open("GET", encodeURI( HOST + 'account?user=' + $('#User').val() + '&password=' + $('#Password').val() ), true);
  request.send();
}

function portal_login_make_ui() {
  clear_content();

  // Layout
  create_row('User', 'text', '');
  create_row('Password', 'password', '');
  create_row('', 'button', 'Login')
}

function portal_admin_make_header(){
  create_row('', 'button', 'Reservations');
  create_row('', 'button', 'Hours');
}

function reservation_delete_action(data) {
  entries = data.split(',')

  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(request.responseText)
        if( data.result ){
          reservations_make_admin_ui();
        }else{
          create_row('ERROR', 'label', 'Please try again later.')
        }
      }
  };

  request.open("DELETE", encodeURI(HOST + 'reservation/' + entries[3]), true);
  request.setRequestHeader("Accept", "*/*");
  //request.setRequestHeader("Authorization", "Bearer mt0dgHmLJMVQhvjpNXDyA83vA_PxH23Y");
  request.send();
/*
  request.send(JSON.stringify({
      name: entries[0],
      date: entries[1],
      time: entries[2],
      telephone: entries[3],
      email: entries[4]
    }));
*/
}

function reservations_make_admin_ui(){
  clear_content();

  portal_admin_make_header();

  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(request.responseText);
        data.result.forEach(function (item, index) {
          create_row(item.name + ',' + item.date + ',' + item.time + ',' + item.telephone + ',' + item.email, 'button', 'Delete');
        });
      }
  };

  request.open("GET", encodeURI( HOST + 'reservation'), true);
  request.send();

}

function reservations_make_ui(){

  create_row('Name', 'text', '');
  create_row('Date', 'text', '');
  create_row('Time', 'text', '')
  create_row('Telephone', 'text', '');
  create_row('Email', 'text', '');

  create_row('', 'button', 'Reserve');

}

function reservation_make_action() {

  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(request.responseText)
        if( data.result ){
          clear_content();
          create_row('SUCCESS', 'label', 'Reservation made successfully.')
        }else{
          create_row('ERROR', 'label', 'Please try again later.')
        }
      }
  };

  request.open("POST", HOST + 'reservation', true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({
      name: $('#Name').val(),
      date: $('#Date').val(),
      time: $('#Time').val(),
      telephone: $('#Telephone').val(),
      email: $('#Email').val()
    }));

}

function hours_make_admin_ui(){
  clear_content();

  portal_admin_make_header();

  create_row('Sunday', 'text', '');
  create_row('Monday', 'text', '');
  create_row('Tuesday', 'text', '');
  create_row('Wednesday', 'text', '');
  create_row('Thursday', 'text', '');
  create_row('Friday', 'text', '');
  create_row('Saturday', 'text', '');

  create_row('', 'button', 'Set')

  // Load data
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(request.responseText);

        $('#Sunday').val(data.result.Sunday);
        $('#Monday').val(data.result.Monday);
        $('#Tuesday').val(data.result.Tuesday);
        $('#Wednesday').val(data.result.Wednesday);
        $('#Thursday').val(data.result.Thursday);
        $('#Friday').val(data.result.Friday);
        $('#Saturday').val(data.result.Saturday);
      }
  };

  request.open("GET", encodeURI( HOST + 'hour'), true);
  request.send();
}

function hours_make_action() {

  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(request.responseText)
        if( data.result ){
          create_row('SUCCESS', 'label', 'Hours updated successfully')
        }else{
          create_row('ERROR', 'label', 'Please try again later to update restaurant hours.')
        }
      }
  };

  request.open("POST", HOST + 'hour', true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({
      monday: $('#Monday').val(),
      tuesday: $('#Tuesday').val(),
      wednesday: $('#Wednesday').val(),
      thursday: $('#Thursday').val(),
      friday: $('#Friday').val(),
      saturday: $('#Saturday').val(),
      sunday: $('#Sunday').val()
    }));

}


$( document ).ready( function() {

  var url = "http://trs:8888/book-your-table/";

  if (window.location.href == url ){
    // Create base trs_container
    create_container();

    // Login section
    create_row('', 'button', 'Portal');

    reservations_make_ui();
  }
});
