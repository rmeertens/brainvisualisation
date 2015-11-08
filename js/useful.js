function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
  alert('Query Variable ' + variable + ' not found');
}


function startLoadingDataUsingFirebase(){
    document.getElementById("info").innerHTML="";
    var username = getQueryVariable("username");//github%3A5749627
    var brainid = getQueryVariable("brainid");//-K2TobPHJzU_8AqK9r3U
    console.log("username:"+username);
    console.log("brainid:"+brainid);
    var urlthing="https://connectivityme.firebaseio.com/users/"+username+"/brains/"+brainid;
    console.log("loading: " + urlthing);
    var myFirebaseRef = new Firebase(urlthing);
    var urlName=myFirebaseRef.child("dataurl").on("value", function(snapshot) {
    console.log("loading: " + snapshot.val());
    startLoadingData(snapshot.val());
}