/**
 * @author Mike Dolbow
 * 
 */

function writeResources(){
    var dev=false; //set to true to use the CKAN demo site, false to use the MN Geospatial Commons
 
    if (dev) {
    	var url1 = 'http://demo.ckan.org/api/3/action/package_list';
    	var url2 = 'http://demo.ckan.org/api/3/action/organization_list?';
    	var url3 = 'http://demo.ckan.org/api/3/action/recently_changed_packages_activity_list';
    } else {
    	var url1 = 'https://gisdata.mn.gov/api/3/action/package_list';
    	var url2 = 'https://gisdata.mn.gov/api/3/action/organization_list?';
    	var url3 = 'https://gisdata.mn.gov/api/3/action/recently_changed_packages_activity_list';
    }

	//PUT the AJAX requests in these functions
	//Request 1: get the total package (resource) count
	    $.ajax({
        url: url1,
        dataType: "jsonp",
        cache: "false"
    })
	  .done(function( data ) {
		$("#allresultsEm").append(data.result.length);
	
	  });
	
	//Request 2: get the package count per org
	//Here's the main request: https://gisdata.mn.gov/api/3/action/organization_list?all_fields=true&sort=package_count
    $.ajax({
        url: url2,
        dataType: "jsonp",
        cache: "false",
        //jsonp:"myfunc",
        data: {
        	all_fields:"true",
        	sort:"package_count desc"
        }
      })
	  .done(function( data ) {
		//console.table(data.result); //use only when debugging...it kills the page in IE
		$("#requestEm").append("<p>There are now <strong>"+data.result.length+"<\/strong> publishers on the MN Geospatial Commons.<\/p>");
	    /* First version, simple text display of numbers
	    if ( console && console.log ) {
          $.each(data.result, function (i) { //resources returned
              //show some results
              //console.log("Display Name: "+data.result[i].display_name);
              $("#resultsEm").append(data.result[i].display_name+"<strong>: "+data.result[i].package_count+"<\/strong><br>");
           });
	    } */
	    
		$('#table').bootstrapTable({
			data: data.result
		});
		$('#table').bootstrapTable('hideLoading');
	  });
	  
	//Request 3: get the recent changes
	$.ajax({
        url: url3,
        dataType: "jsonp",
        cache: "false"
        })
	  .done(function( data ) {
		//$("#newResourcesEm").append(data.result.length);
          $.each(data.result, function (i) { //resources returned
             if (data.result[i].activity_type === "new package") {
             	var recentHTML = '<a target=\"_blank" href=\"http:\/\/gisdata.mn.gov\/dataset\/'+data.result[i].data.package.name+'\">'+data.result[i].data.package.title+'<\/a>';
                $("#newResourcesEm").append(recentHTML+'<br\/>');
             }
          });
	
	  });
} //end page load function
