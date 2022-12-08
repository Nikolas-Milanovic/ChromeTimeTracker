const API_KEY = "AIzaSyBEY1tNP1AHXLp9TOKL7-lMi9ga7RWLUkk"

let interested = []//interested_domains
let cal_screen_time_id = "";
let prev_domain = "";
let start_time_domain = "";


chrome.storage.local.get(["key","prevkey","timekey","calkey"], function(result) {
    console.log("Value currently is " + result.key);
    console.log("Value currently is " + result.prevkey);
    console.log("Value currently is " + result.timekey);
    console.log("Value currently is " + result.calkey);
    interested = result.key;
    prev_domain = result.prevkey;
    start_time_domain = result.timekey;
    cal_screen_time_id = result.calkey;
    if (interested == undefined){
        console.log("Storage/key/interesteed is undefined");
        interested= ["youtube"];
        console.log(interested);
        chrome.storage.local.set({ 'key': interested }, function() {
            console.log(interested);
            console.log("youtube Init Value is set to " + interested);
        });
    }
    if (prev_domain == undefined){
        console.log("prev_domain is undefined");
        prev_domain = "storage-init-prev-domain"
        chrome.storage.local.set({ 'prevkey': prev_domain }, function() {
            console.log("Init Value is set to " + prev_domain);
        });
    }
    if (start_time_domain == undefined){
        console.log("start_time_domain is undefined");
        start_time_domain = "storage-init-start_time_domain-init";
        chrome.storage.local.set({ 'timekey': start_time_domain }, function() {
            console.log("Init Value is set to " + start_time_domain);
        });
    }
    if (start_time_domain == undefined){
        console.log("start_time_domain is unedifned");
        start_time_domain = "storage-init-start_time_domain";
        chrome.storage.local.set({ 'calkey': start_time_domain }, function() {
            console.log("Init Value is set to " + start_time_domain);
        });
    }
});

// chrome.storage.local.remove(["key"],function(){
//     console.log("DELETED?");
//     var error = chrome.runtime.lastError;
//        if (error) {
//            console.error(error);
//        }
// })

//set cal_screen_time_id 
function setCalScreenTimeId(ID_str){
    chrome.storage.local.set({ 'calkey': ID_str }, function() {
        console.log("setCalScreenTimeId Value is set to " + ID_str);
    });
}


chrome.identity.getAuthToken({interactive: true }, function(token) {
    console.log(token)
    let calendars = [];

    const headers = new Headers({
        'Authorization' : 'Bearer ' + token,
        'Content-Type': 'application/json'
    })

    const queryParams = { headers };
    
    fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', queryParams)
    .then((response) => response.json()) // Transform the data into json
    .then(function(data) {
        
        console.log(data);
        calendars = data;
        console.log(calendars.items.length);

        //check if Screen Time calendar exists, if not will add it

        for(let i=0;i<calendars.items.length;i++){
            console.log(calendars.items[i].summary);
            if("Screen Time"==calendars.items[i].summary){
                cal_screen_time_id = calendars.items[i].id;
                setCalScreenTimeId(cal_screen_time_id);
                console.log("Screen Time calendar exists");    
                return;
            }
        }
        console.log("Screen Time calendar does NOT exists");
        //add Screen Time Calendar
        const eventObj = {
            "summary": "Screen Time"
        };

        const options = {
            method: "POST",
            async: true,
            headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            },
            body: JSON.stringify(eventObj)
        };

        fetch('https://www.googleapis.com/calendar/v3/calendars', options)
        .then((response) => response.json()) // Transform the data into json
        .then(function(data) {
            console.log(data);
            cal_screen_time_id = data.id;
            setCalScreenTimeId(cal_screen_time_id);
        })

    })
});



function create_google_cal_event(eventObj){

    chrome.identity.getAuthToken({ 'interactive': false }, function(token) {

        //GET last 3 events
        const headers = new Headers({
            'Authorization' : 'Bearer ' + token,
            'Content-Type': 'application/json'
        })
    
        const queryParams = { headers };

        fetch('https://www.googleapis.com/calendar/v3/calendars/'+cal_screen_time_id+'/events',queryParams)
        .then((response) => response.json()) // Transform the data into json
        .then(function(data) {
            
            console.log("data.itmes:");
            console.log(data.items);
            if(data.items != undefined && data.items.length > 0 ){
                for(let i=(data.items.length-1);(i>=(data.items.length-3) && i>=0);i--){
                    console.log(data.items[i].summary);
                    if(data.items[i].summary===eventObj.summary 
                        && (Math.abs(Date.parse(eventObj.start.dateTime) - 
                                    Date.parse(data.items[i].end.dateTime))) < (1000 * 60 * 5)){
                            console.log("Update prior event - as event summary matches");
                            //update event instead of creating new
                            
                            eventObj.start = data.items[i].start;

                            console.log(eventObj);

                            //POST event 
                            const options = {
                                method: "PUT",
                                async: true,
                                headers: {
                                Authorization: "Bearer " + token,
                                "Content-Type": "application/json",
                                },
                                body: JSON.stringify(eventObj)
                            };

                            fetch("https://www.googleapis.com/calendar/v3/calendars/"+cal_screen_time_id+"/events/"+data.items[i].id, options)
                            .then((response) => response.json()) // Transform the data into json
                            .then((data) => console.log(data))
                            .catch((err) => console.log(err));

                            return;
                    }
                }
            }
            console.log("No prior event - create NEW event");
            //POST event 
            // console.log(cal_screen_time_id);
            // console.log(token);
            const options = {
                method: "POST",
                async: true,
                headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                },
                body: JSON.stringify(eventObj)
            };

            console.log("cal_screen_time_id "+cal_screen_time_id);
            fetch("https://www.googleapis.com/calendar/v3/calendars/"+cal_screen_time_id+"/events",options)
            .then((response) => response.json()) // Transform the data into json
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
        })
    })
}


//let tab_url = "init";

function getCurrentTab(str_url) {
    if(str_url==="window_change"){
        new_viewing(str_url);
        return;
    }

    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tabs) {
        
        try{
            tab_url = tabs[0].url;
            console.log(tab_url);
            new_viewing(tab_url);
        }catch{
            console.log("No URL - Are we not in chrome browser?");
            new_viewing("window_change");
        }
    });
  }


/* How to find the chrome tab the user is currently viewing:
 * There are three ways this is possible
 * 1) The user is on the same chrome window, and switches to an existing tab
 * 2) The user is on the same chrome window, and opens a new tab
 * 3) The user switches to another existing chrome window that contains an open tab
 */

// 1) 
chrome.tabs.onActivated.addListener(function(tab) {
    console.log("tab changed");
    getCurrentTab("");

});

// 2) 
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // read changeInfo data and do something with it (like read the url)
    if (changeInfo.url) {
        console.log("url changed");
        getCurrentTab("");
    }
});

// 3) 
chrome.windows.onFocusChanged.addListener(windowId => {
    console.log("window_change");
    getCurrentTab("");
});





//Stores prev_domain in local (persistent) storage
function setPrevDomain(domain_str){
    console.log("setPrevDomain domain_str = "+domain_str);
    chrome.storage.local.set({ 'prevkey': domain_str }, function() {
        console.log("setPrevDomain Value is set to " + domain_str);
    });
}

function setStartTimeDomain(time_str){
    chrome.storage.local.set({ 'timekey': time_str }, function() {
        console.log("setStartTimeDomain Value is set to " + time_str);
    });
}


/* Algorithm to display event on google calendar:
 *
 * Once the user leaves an 'interested' tab we will upload the event to 
 * the google calendar, with the respective Start and End times:
 *
 * Start: user enters an 'interested' tab (website)
 * We log the start time.
 * 
 * Exit: User leaves the 'interested' tab
 * We log the end time. 
 * 
 * 
 */

//called when user is viewing new webpage
//This happens if the user tab swithches, or searches a new url

function new_viewing(url){
    console.log("new_viewing called");
    console.log("prev_domain= "+prev_domain);

    const date = new Date();
    const end_time_domain = date.toISOString(); //RFC 3339 format

    //console.log("interested domains: "+interested);

    //collect current new url
    new_domain = "uninterested";
    console.log("interested.length= ", interested?.length);
    console.log(interested);
    interested= ["youtube"];
    for(let i=0; i < (interested?.length || 0 );i++){
        if(url.includes(interested[i])){
            new_domain = interested[i];
            if(prev_domain===new_domain){
                console.log("still on the same domain");
                return; //we are still on the same domain
            }
            break;
        }
    }

    //Record prev_domain event(webpage viewing)
    if(prev_domain==="uninterested"){
        prev_domain = new_domain;
        console.log("new_domain = "+new_domain);
        setPrevDomain(new_domain);
        start_time_domain = end_time_domain;
        setStartTimeDomain(end_time_domain);
        
        console.log("uninterested in prev_domain")
        return; //we are not interested in the screen time for this event
    }

    var diff = Math.abs(Date.parse(end_time_domain) - Date.parse(start_time_domain));
    console.log(diff);
    if(diff < 1000*60){ //On this domain for less than a minute (60 seconds) // ignore
        prev_domain = new_domain;
        console.log("new_domain = "+new_domain);
        setPrevDomain(new_domain);
        start_time_domain = end_time_domain;
        setStartTimeDomain(end_time_domain);
        console.log("Visited interested domain for insignificant time period (< 1 minute)");
        return;
    }


    //We are interested in the prev_domain
    const eventObj = {
        "end": {
        "dateTime": end_time_domain,
        },
        "start": {
        "dateTime": start_time_domain,
        },
        "summary": prev_domain,
        "description": "Screen Time"
    };

    console.log(eventObj);

    create_google_cal_event(eventObj);

    prev_domain = new_domain;
    console.log("new_domain = "+new_domain);
    setPrevDomain(new_domain);
    start_time_domain = end_time_domain;
    setStartTimeDomain(end_time_domain);
    

}



//peristent storage 


// let interested = [
//     "instagram",
//     "youtube",
//     "reddit",
//     "linkedin",
//     "facebook",
//     "twitter",
//     "tiktok"
// ]

// chrome.storage.local.set({ key: interested }, function() {
//     console.log("Value is set to " + interested);
// });

chrome.storage.local.get(["key"], function(result) {
    console.log("Value currently is " + result.key);
    interested = result.key;
});

// chrome.extension.onConnect.addListener(function(port) {
//     console.log("Connected .....");
//     port.onMessage.addListener(function(msg) {
//          console.log("message recieved" + msg);
//          //port.postMessage("Hi Popup.js");
//     });
// })


chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      if(key==='key'){
            console.log("interested list updated");
            interested = newValue;
      }
    }
});




