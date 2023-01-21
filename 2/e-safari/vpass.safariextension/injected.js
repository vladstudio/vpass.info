safari.self.addEventListener("message", vPassMessageHandler, false);
function vPassMessageHandler(event)
{
    
    // fill focused input with generated password
    if (event.name === "vpassFill")
    {
    	if (typeof document.activeElement.value != 'undefined') {document.activeElement.value = event.message;}
    }
    
}