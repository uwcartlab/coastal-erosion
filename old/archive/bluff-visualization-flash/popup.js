var newwin;

function launchwin(winurl)
{
	var width = "530";
	var height = "380";
	var winargs = "height=350,width=350, left=10, top=180";
	if (arguments.length > 2) {
		width = String( arguments[1] );
		height = String( arguments[2] );
	}
	//This launches a new window and then
	//focuses it if window.focus() is supported.
	newwin = window.open(winurl,"_blank", "height=" + height + ",width=" + width + ",left=300, top=300");
	if(javascript_version > 1.0)
	{
		//delay a bit here because IE4 encounters errors
		//when trying to focus a recently opened window
 		setTimeout('newwin.focus();',250);
	}
}