// Add a button to Opera's toolbar when the extension loads.
window.addEventListener("load", function() {
	// Buttons are members of the UIItem family.
	// Firstly we set some properties to apply to the button.
	var UIItemProperties = {
		disabled: false, // The button is enabled.
		title: "vPass", // The tooltip title.
		icon: "icon_18.png", // The icon (18x18) to use for the button.

		popup: {
			href: "vpass.html?",
			width: "320px",
			height: "240px"
		},

		onclick: function()
		{
			var focusedTab = opera.extension.tabs.getFocused();
			if(focusedTab) 
			{
				url = focusedTab.url;
				button.popup.href='vpass.html?'+url;
			}
		}

	};

	// Next, we create the button and apply the above properties.
    var button = opera.contexts.toolbar.createItem(UIItemProperties);
    // Finally, we add the button to the toolbar.
    opera.contexts.toolbar.addItem(button);
}, false);

