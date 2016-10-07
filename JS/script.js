var myPlayer,
	playlistIds = ["4868197176001","4868197203001","4868197200001","4890340678001","4868197201001"],
	playlistIdsLength = playlistIds.length,
	tabs = document.getElementsByClassName("brightcove-vidhub-button"),
	currentTab,
	currentTabName,
	currentvideo,
	playlistNames = [];

//Once the player is ready, it will load the first (latest) playlist	
videojs("brightcove-videohub-player").ready(function(){
	myPlayer = this;
	processTab(0);
	loadplaylistentries();
	//View the current video object
	myPlayer.on('loadstart',function(){				
		//console.log('mediainfo', myPlayer.mediainfo);
	});		
});
//This loads the selected playlist on the page
function processTab (index) {
	//Checks if player is paused; will only load new playlist 
	if(myPlayer.paused()) {
		resetTabs();			
		document.getElementById("tab" + index).setAttribute("style","background:#00AFDB;color: #fff;border-radius: 10px;padding: .5em 1em;border: none;font-family: Arial,Helvetica,sans-serif;font-size: 18px;font-weight: normal;letter-spaing: -1px;line-height: 23.4px; text-align: left; zoom: 1;");
		loadPlaylist(playlistIds[index]);
		//console.log('loading playlist while player paused');
	} else {
		resetTabs();
		document.getElementById("tab" + index).setAttribute("style","background:#00AFDB;color: #fff;border-radius: 10px;padding: .5em 1em;border: none;font-family: Arial,Helvetica,sans-serif;font-size: 18px;font-weight: normal;letter-spaing: -1px;line-height: 23.4px; text-align: left; zoom: 1;");
		loadPlaylistply(playlistIds[index]);
		//console.log('loading playlist while player plays');	
	};
			
};
//This loads the playlist on the page; while the player is !playing
function loadPlaylist (currentId) {
	myPlayer.catalog.getPlaylist(currentId, function(error, playlist){
		myPlayer.catalog.load(playlist);				
	});
	//video metadata populates
	loadmetadata();	
};
//This will load playlist while video plays
function loadPlaylistply (currentId) {
	myPlayer.catalog.getPlaylist(currentId, function(error, playlist){
		myPlayer.catalog.load(playlist);
	});
};
//This reloads the tabs
function resetTabs () {
	var i,
		iMax = tabs.length;
	for (i = 0; i < iMax; i++) {
		tabs[i].setAttribute("style", "background: #fff;color: #000;border-radius: 10px;padding: .5em 1em;border: none;font-family: Arial,Helvetica,sans-serif;font-size: 18px;font-weight: normal;letter-spaing: -1px;line-height: 23.4px; text-align: left; zoom: 1;")
	}
	$('#loadMore').show();
};
//This loads all metadata
function loadmetadata() {
	var playerdata = videojs('brightcove-videohub-player').ready(function(){
		myPlayer = this;
		myPlayer.on('loadstart',function(){
			//video category populates
			$('#brightcove-vidhub-vidcat').html(myPlayer.mediainfo.custom_fields.category);
			//video title populates
			$('#brightcove-vidhub-meta-title').html(myPlayer.mediainfo.name);
			//video duration populates
			$('#brightcove-vidhub-meta-time').html(fmtMSS(Math.round(myPlayer.mediainfo.duration)));
			//video description populates
			$('#brightcove-vidhub-meta-desc').html(myPlayer.mediainfo.long_description);
			//converting date to MMM DD, YYYY
			var month = new Array();
			month[0] = "January";
			month[01] = "February";
			month[02] = "March";
			month[03] = "April";
			month[04] = "May";
			month[05] = "June";
			month[06] = "July";
			month[07] = "August";
			month[08] = "September";
			month[09] = "October";
			month[10] = "November";
			month[11] = "December";
			var d = myPlayer.mediainfo.created_at.slice(6,7),
				m = month[d-1],
				d = myPlayer.mediainfo.created_at.slice(8,10),
				y = myPlayer.mediainfo.created_at.slice(0,4);
			//video date populates
			$('#brightcove-vidhub-meta-date').html('&nbsp;&nbsp;|' + '&nbsp;&nbsp;'+m +' '+ d+', ' + y);
			//video sharing link; checks if value is null and will place blank value or value from catalogue
			if(myPlayer.mediainfo.link == null){
				$('#brightcove-vidhub-sharing').html("");
			}else{$('#brightcove-vidhub-sharing').html("<br><a target='_blank' //href="+myPlayer.mediainfo.link.url+">"+myPlayer.mediainfo.link.text+"</a>");};			
		});
		//convert the duration seconds into mins/secs
		function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
		//convert numerical date to MMM DD, YYYY
	});
	//scroll to top after thumbnail is clicked
	$('#vjs-playlist').click(function() {
		$('html, body').animate({
			scrollTop: $('#brightcove-vidhub-top').offset().top
		 }, 600);
	});
};
//Loads more playlist entries onto screen; default 3
function loadplaylistentries() {
	var limit_vids = 6,
	load_more_vids = 3;
	//reset the limit_vids
	$('.brightcove-vidhub-button').click(function() {
		limit_vids = 6;	
	});
	//controls the speed of how new entries load and hides load button when no more entries available 
	$('#loadMore').bind('click', function(){
		limit_vids += load_more_vids;
		$('#vjs-playlist li:lt('+(limit_vids)+')').show(600);
		if ($('#vjs-playlist li').length <= limit_vids) {
			$(this).hide();
		}
	});
};
//Video description show/hide
$(".brightcove-vidhub-arrow-down").hide();
$(".brightcove-vidhub-opthead").click(function(){
	$(".brightcove-vidhub-meta-desc").slideToggle(500);
	$(this).find(".brightcove-vidhub-arrow-down, .brightcove-vidhub-arrow-up").toggle();
});
