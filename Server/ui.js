
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
      }
    }
    else{
      outer_div = create_element('div', {'class': 'input-group'}, '');
    }

    $(row).append(outer_div);

    if( label && (label != "ERROR" || label != "INFO") ){
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
            $(outer_div).append( create_element('button', {'class': 'btn btn-danger', 'type': input, 'onclick': 'cancel_reservation()'}, caption) );
        }
        else if (caption == 'Login') {
              $(outer_div).append( create_element('button', {'class': 'btn btn-primary', 'type': input, 'onclick': 'login()'}, caption) );
        }
        else if (caption == 'Portal') {
              $(outer_div).append( create_element('button', {'class': 'btn btn-primary', 'type': input, 'onclick': 'portal()'}, caption) );
        }
        else if (caption == 'Reserve'){
          $(outer_div).append( create_element('button', {'class': 'btn btn-success', 'type': input, 'onclick': 'reserve()'}, caption) );
        }
    }else if( input == 'link' ){
      // Links
      $(outer_div).append( create_element('a', {'class': 'btn btn-primary stretched-link', 'href': '#', 'onclick': 'return create_loan_inquiry()'}, caption));
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

function cancel_reservation() {
  clear_content();


  get_reservations();
}

function get_reservations() {
  clear_content();

}

function login() {

  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(request.responseText)
        if( data.result ){
          get_reservations();
        }else{
          create_row('Error', 'label', 'Invalid credentials provided.')
        }
      }
  };

  request.open("POST", HOST + 'account', true);
  request.send(JSON.stringify({
      user: $('#User').val(), password: $('#Password').val()
    }));
}

function portal() {
  clear_content();

  // Layout
  create_row('User', 'text', '');
  create_row('Password', 'password', '');
  create_row('', 'button', 'Login')
}

function reserve() {
  clear_content();
/*



  request.send(JSON.stringify({
      name: $('#Name').val(),
      date: $('#Date').val(),
      time: $('#Time').val(),
      telephone: $('#Telephone').val(),
      email: $('#Email').val()
    }));
    */
}

function set_hours() {


}


$( document ).ready( function() {

    var url = "http://trs:8888/book-your-table/";

    if (window.location.href == url ){
      // Create base trs_container
      create_container();

      // Login section
      create_row('', 'button', 'Portal');

      // Default input
      create_row('Name', 'text', '');
      create_row('Date', 'text', '');
      create_row('Time', 'text', '')
      create_row('Telephone', 'text', '');
      create_row('Email', 'text', '');

      create_row('', 'button', 'Reserve');

  }
});
