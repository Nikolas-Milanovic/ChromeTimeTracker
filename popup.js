
// function button_clicked(){
//     console.log("button clicked");
// }


let interested = []
chrome.storage.local.get(["key"], function(result) {
    console.log("Value currently is " + result.key);
    interested = result.key;
    persistent_interested();
});

function remove_interested_domain(remove_domain_str){
    let indexForRemoval = -1;

    for(let i=0;i<interested.length;i++){
        if(remove_domain_str===interested[i]){
            indexForRemoval = i;
        }
    }
    if(indexForRemoval === -1){
        console.log("error: removed domain is not in interested array");
        return -1;
    }
    
    interested.splice(indexForRemoval,1);
    console.log("Array Elements After Removing Element At Index: " + indexForRemoval + " is " + interested);

    //update storage 
    chrome.storage.local.set({ key: interested }, function() {
        console.log("Value is set to " + interested);
    });
}

function persistent_interested(){
    console.log("called");

    for(let i=0;i<interested.length;i++){
        console.log(i);
        document.querySelector('#tasks').innerHTML += `
                    <div class="task">
                        <span id="taskname" class="domainname">
                            ${interested[i]}
                        </span>
                        <button class="delete">X
                            <i class="far fa-trash-alt"></i>
                        </button>
                    </div>
                `;
    }
    var current_tasks = document.querySelectorAll(".delete");
            for(var i=0; i<current_tasks.length; i++){
                current_tasks[i].onclick = function(){
                    console.log(this.parentNode);
                    this.parentNode.remove();
                    
                    let deleted_domain = this.parentNode.querySelector('.domainname').innerHTML;
                    deleted_domain = deleted_domain.replace(/\s+/g, '');
                    console.log(deleted_domain);

                    remove_interested_domain(deleted_domain);
                }
    }
}

//document.addEventListener("DOMContentLoaded", function(){ persistent_interested(); }, false);


// //add onclick event 
document.addEventListener('DOMContentLoaded', function() {
    

    var link = document.getElementById('push');
    // onClick's logic below:
    link.addEventListener('click', function() {
        console.log("button clicked");
        if(document.querySelector('#newtask input').value.length == 0){
            alert("Enter domain name!")
        }
    
        else{
            document.querySelector('#tasks').innerHTML += `
                <div class="task">
                    <span id="taskname" class="domainname">
                        ${document.querySelector('#newtask input').value}
                    </span>
                    <button class="delete">X
                        <i class="far fa-trash-alt"></i>
                    </button>
                </div>
            `;

            let domain_str = document.querySelector('#newtask input').value;
            console.log(domain_str);
            interested.push(domain_str);
            //add to persistent storage
            chrome.storage.local.set({ key: interested }, function() {
                console.log("Value is set to " + interested);
            });
    
            var current_tasks = document.querySelectorAll(".delete");
            for(var i=0; i<current_tasks.length; i++){
                current_tasks[i].onclick = function(){
                    console.log(this.parentNode);
                    this.parentNode.remove();

                }
            }
        }
        
    });
});


// var port = chrome.extension.connect({
//     name: "Sample Communication"
// });

// port.postMessage("Hi BackGround");
// port.onMessage.addListener(function(msg) {
//     console.log("message recieved" + msg);
// });