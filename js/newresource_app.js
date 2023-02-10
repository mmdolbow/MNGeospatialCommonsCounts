/**
 * @author Mike Dolbow
 * 
 */

function writeNewResources(){
    var dev=false; //set to true to use the CKAN demo site, false to use the MN Geospatial Commons
 
    if (dev) {
    	var urlRecentChg = 'http://demo.ckan.org/api/3/action/recently_changed_packages_activity_list';
    } else {
		var urlRecentChg = 'https://gisdata.mn.gov/api/3/action/recently_changed_packages_activity_list';
    }

	//Establish baseline counter, limit, and offset variables
    var ajaxLimit = 80; //Don't want too high because the request will return too many results. But too low is chatty and actually can feel longer
    var ajaxOffset = 0; //original offset start
    var newResCount = 0; //counter for number of new resources
    var newResLimit = 5; //limit of number of new resources we want listed
	
    recentAPILook();

	/*Request get the recent changes.
	*/ 
	function recentAPILook(){
        $('#newResourceDiv').append("<ul id='newResourceList'></ul>");
        $.ajax({
            url: urlRecentChg+"?limit="+ajaxLimit+"&offset="+ajaxOffset,
            dataType: "jsonp",
            cache: "false"
            })
          .done(function( data ) {
              $.each(data.result, function (i) { //resources returned
                 if (data.result[i].activity_type === "new package") {
                    var pckgTimeStamp = data.result[i].timestamp;
                    var createDateStamp = new Date(pckgTimeStamp).toLocaleDateString();
                    var recentHTML = '<a target=\"_blank" href=\"http:\/\/gisdata.mn.gov\/dataset\/'+data.result[i].data.package.name+'\">'+data.result[i].data.package.title+'<\/a>';
                    recentHTML += ' (Created '+createDateStamp+")"; //data.result[i].timestamp;
                    //$("#newResourcesEm").append(recentHTML+'<br\/>');
                    $("#newResourceList").append("<li>"+recentHTML+"</li>");
                    newResCount ++;
                 }
              });
            if (newResCount >= newResLimit) {
                console.log("Reached our limit, stopping");
                //$("#newResourcesEm").empty();
            } else {
                console.log("none found yet, trying again.")
                ajaxOffset = ajaxOffset + ajaxLimit;
                recentAPILook();
            }
          });
    } 
	  
} //end page load function
