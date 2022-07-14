var username = document.getElementById('username');
var username_label = document.getElementById('username-label');
var password = document.getElementById('password');
var password_label = document.getElementById('password-label');
var submit = document.getElementById('submit');

username.onfocus = function focus_username() {
	username_label.style.visibility = "visible";
	username.style.marginTop = "5px";
	username.placeholder = "";
};
function focus_out_username() {
	if (username.value == '') {
		username_label.style.visibility = "collapse";
		username.placeholder = "Username or Email";
	}
};
password.onfocus = function focus_password() {
	password_label.style.visibility = "visible";
	password.style.marginTop = "5px";
	username.style.marginBottom = "10px";
	password.placeholder = "";
};
function focus_out_password() {
	if (password.value == '') {
		password_label.style.visibility = "collapse";
		username.style.marginBottom = "0px";
		password.placeholder = "Password";
	}
};


