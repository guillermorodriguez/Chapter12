
function create_row(label, input, caption){

    var row = create_element('div', {'class': 'row', 'style': 'padding: 5px 50px 5px 50px;'});
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
         if (caption == 'Calculate'){
            $(outer_div).append( create_element('button', {'class': 'btn btn-success', 'type': input, 'onclick': 'calculate_payment()'}, caption) );
        }else if (caption == 'Send') {
            $(outer_div).append( create_element('button', {'class': 'btn btn-success', 'type': input, 'onclick': 'submit_loan_inquiry()'}, caption) );
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

function calculate_payment(){
    // Constants
    var  REJECT = 'Thank you for your inquiry, but at this moment we are unable to provide you with a loan';
    var ACCEPT = 'Congratulations, we can provide you with a loan';
    // Variables
    var loan = $('#Principal').val();
    var down_payment = $('#Payment').val();
    var interest = $('#Interest').val();
    var period = 30
    var credit_score = $('#Credit').val();
    var annual_salary = $('#Salary').val();

    if (credit_score <= 650) {
        $('#label').text('Invalid credit score provided.');
        return;
    }else{
        credit_score = parseInt(credit_score);
    }

    if (isNaN(loan) || loan < 1 ) {
        $('#label').text('Invalid loan amount provided.');
        return;
    }else{
        loan = parseFloat(loan);
    }

    if (isNaN(period) || period < 1 ){
        $('#label').text('Invalid period value provided.');
        return;
    }else{
        period = parseInt(period);
    }

    if (isNaN(annual_salary) || annual_salary < 1){
        $('#label').text('Invalid annual salary provided.');
        return;
    }else{
        annual_salary = parseFloat(annual_salary);
    }

    interest /= 1200;
    period *= 12;
    payment = 0;
    if( interest == 0 ){
         payment = (loan-down_payment)/(period);
    }else{
         payment= (loan-down_payment)*Math.pow(1 + interest, period)*(interest)/[Math.pow(1+interest, period)-1]
    }

    if (payment > annual_salary*0.3) {
        $('#label').text('Salary does not meet the minimum requirement for funding.');
        return;
    }


    $('#label').text('Monthly Payment: $ ' + String(payment.toFixed(2)));
    create_row('', 'link', 'Apply');
}

function create_loan_inquiry() {
    // Clear document
    $('body').empty();

    //  Create input elements
    create_row('Name', 'text', '');
    create_row('Email', 'text', '');
    create_row('Phone', 'text', '');
    create_row('', 'button', 'Send');
}

function submit_loan_inquiry() {

    // Variables
    var name = $('#Name').val();
    var email = $('#Email').val();
    var phone = $('#Phone').val();

    if (name == '' || email == '' || phone == ''){
        alert('Invalid form input')
        return;
    }

    // Clear document
    $('body').empty();
    //  Create input elements
    create_row('', 'label', 'Thank you for your inquiry. We will begin to process your loan!');
}


$( document ).ready( function() {
    create_row('Principal', 'text', '');
    create_row('Payment', 'text', '');
    create_row('Interest', 'text', '2.5');
    create_row('Credit', 'text', '');
    create_row('Salary', 'text', '');
    create_row('', 'button', 'Calculate');
    create_row('', 'label', 'Monthly Payment: $ 0.00');
});
