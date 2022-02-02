
function create_row(label, input, caption){

    var row = create_element('div', {'class': 'row', 'style': 'padding: 5px 5px 5px 5px; width: 800px; margin: auto; text-align: center;'});
    $('body').append(row);
    var outer_div = null;
    if( input == 'label' ){ outer_div = create_element('div', {'class': 'alert alert-primary', 'role': 'alert', 'id': input, 'style': 'width: 100%;'}, caption); }
    else{ outer_div = create_element('div', {'class': 'input-group'}, ''); }
    $(row).append(outer_div);
    if( label ){
        var inner_div = create_element('div', {'class': 'input-group-append'}, '');
        $(outer_div).append(inner_div);
        $(inner_div).append( create_element('span', {'class': 'input-group-text', 'style': 'width: 150px;'}, label) );
    }

    if( input == 'text' ){
        $(outer_div).append( create_element('input', {'class': 'form-control', 'type': input, 'id': label, 'value': caption}) );

    }else if( input == 'button' ) {
         if (caption == 'Reserve'){
            $(outer_div).append( create_element('button', {'class': 'btn btn-success', 'type': input, 'onclick': 'reserve()'}, caption) );
        }else if (caption == 'Delete') {
            $(outer_div).append( create_element('button', {'class': 'btn btn-success', 'type': input, 'onclick': 'delete()'}, caption) );
        }
   }else if( input == 'link' ){
       $(outer_div).append( create_element('a', {'class': 'btn btn-primary stretched-link', 'href': '#', 'onclick': 'return create_loan_inquiry()'}, caption));
    }

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


$( document ).ready( function() {

    var url = "http://trs:8888/book-your-table/";

    if (window.location.href == url ){
      create_row('Name', 'text', '');
      create_row('Date', 'text', '');
      create_row('Telephone', 'text', '');
      create_row('email', 'text', '');

      create_row('', 'button', 'Reserve');

  }
});
