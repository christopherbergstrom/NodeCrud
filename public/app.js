window.onload = function()
{
  console.log("in onload");
  document.getElementById("button").addEventListener("click", function()
  {
    // getData("/getAll", createList);
    checkAndRemove();
    getData("/getAll");
  });
  loginForm.submit.addEventListener("click", function(e)
  {
    e.preventDefault();
    var username = loginForm.username.value;
    var password = loginForm.password.value;
    var obj = {username:username, password:password};
    verbData("PUT", "/login", undefined, obj);
  });
  signupForm.submit.addEventListener("click", function(e)
  {
    e.preventDefault();
    var username = signupForm.username.value;
    var password = signupForm.password.value;
    var obj = {username:username, password:password};
    verbData("POST", "/signup", undefined, obj);
  });
  logout.addEventListener("click", function()
  {
    // logout = document.getElementById("logout");
    // if(logout)
    // {
    //   logout.parentNode.removeChild(logout);
    // }
    getData("/logout");
  });
  // var item = document.addForm.addItem.value;
  // var obj = {"buyer":buyer, "item":item, "tracking":tracking};
  // updateData("POST", "rest/data", obj);

  document.myForm.submit.addEventListener("click", function(e)
  {
    checkAndRemove();
    e.preventDefault();
    var pass = validate();
    if (pass)
    {
      console.log("in if pass");
      var item = document.myForm.send.value;
      var obj = {"item":item};
      document.myForm.reset();
      verbData("POST", "/add", undefined, obj);
    }
    // {
    //   document.getElementById("content").innerHTML = data;
    // }, {data : document.myForm.send.value});
  });
};

var body = document.querySelector("body");
var selectDiv = document.getElementById("selectDiv");
var buttonsDiv = document.getElementById("buttonsDiv");
var id;
var logout = document.getElementById("logout");
var loginForm = document.loginForm;
var signupForm = document.signupForm;

function checkAndRemove()
{
  resultsTable = document.getElementById("resultsTable");
  if(resultsTable)
  {
    resultsTable.parentNode.removeChild(resultsTable);
  }
  updateButton = document.getElementById("updateButton");
  if(updateButton)
  {
    updateButton.parentNode.removeChild(updateButton);
  }
  updateForm = document.getElementById("updateForm");
  if(updateForm)
  {
    updateForm.parentNode.removeChild(updateForm);
  }
  updateButton = document.getElementById("updateButton");
  if(updateButton)
  {
    updateButton.parentNode.removeChild(updateButton);
  }
  deleteButton = document.getElementById("deleteButton");
  if(deleteButton)
  {
    deleteButton.parentNode.removeChild(deleteButton);
  }
  updateTable = document.getElementById("updateTable");
  if(updateTable)
  {
    updateTable.parentNode.removeChild(updateTable);
  }
}

function validate()
{
  console.log("in validate");
  var item = document.myForm.send.value;
  console.log(item);
  if (item === "")
  {
    return false;
  }
  else
  {
    return true;
  }
  console.log(item);
}

function getData(url, callback)
{
  var xhr = new XMLHttpRequest();
	xhr.open('GET', url);

	xhr.onreadystatechange = function() {
		if (xhr.status < 400 && xhr.readyState == 4) {
			console.log(xhr.responseText);
			var array = JSON.parse(xhr.responseText);
      createList(array);
		}
	};

	xhr.send(null);
}

function createList(array)
{
  var content = document.getElementById("content").innerHTML;
  var resultsTable = document.createElement("table");
  resultsTable.setAttribute("id", "resultsTable");
  var tr = document.createElement("tr");
  var th = document.createElement("th");
  th.innerHTML = "Item";
  tr.appendChild(th);
  resultsTable.appendChild(tr);
  var radioButtonsArray = [];
  for (var i = 0; i < array.length; i++)
  {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var item = array[i].item;
    td.innerHTML = array[i].item;
    tr.appendChild(td);
    var td = document.createElement("td");
    var radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "radioButton");
    radio.setAttribute("value", array[i].id);
    radioButtonsArray.push(radio);
    td.appendChild(radio);
    tr.appendChild(td);
    resultsTable.appendChild(tr);
  }
  body.appendChild(resultsTable);
  var updateButton = document.createElement("button");
  updateButton.setAttribute("id", "updateButton");
  updateButton.innerHTML = "update";
  updateButton.setAttribute("class", "buttons");
  body.appendChild(updateButton);
  var deleteButton = document.createElement("button");
  deleteButton.setAttribute("id", "deleteButton");
  deleteButton.innerHTML = "delete";
  deleteButton.setAttribute("class", "buttons");
  body.appendChild(deleteButton);
  deleteButton.addEventListener("click", function()
  {
    checkAndRemove();
    for (var j = 0; j < radioButtonsArray.length; j++)
    {
      if (radioButtonsArray[j].checked === true)
      {
        id = radioButtonsArray[j].value;
        console.log(id);
        verbData("DELETE", "/del/"+id);
      }
    }
  });
  updateButton.addEventListener("click", function()
  {
    checkAndRemove();
    for (var j = 0; j < radioButtonsArray.length; j++)
    {
      if (radioButtonsArray[j].checked === true)
      {
        id = radioButtonsArray[j].value;
        console.log(id);
        for (var k = 0; k < array.length; k++)
        {
          var updateForm = document.createElement("form");
          updateForm.setAttribute("name", "updateForm");
          updateForm.setAttribute("id", "updateForm");
          var updateItem = document.createElement("input");
          updateItem.setAttribute("name", "updateItem");
          updateItem.setAttribute("type", "text");
          updateItem.setAttribute("value", array[j].item);
          updateForm.appendChild(updateItem);
          var updateSubmit = document.createElement("input");
          updateSubmit.setAttribute("type", "submit");
          updateSubmit.setAttribute("name", "updateSubmit");
          updateSubmit.setAttribute("value", "update");
          updateSubmit.setAttribute("class", "buttons");
          updateForm.appendChild(updateSubmit);
          checkAndRemove();
          var updateTable = document.createElement("table");
          updateTable.setAttribute("id", "updateTable");
          var tr = document.createElement("tr");
          var th = document.createElement("th");
          th.innerHTML = "Updating Item";
          tr.appendChild(th);
          updateTable.appendChild(tr);
          body.appendChild(updateTable);
          body.appendChild(updateForm);

          updateForm.updateSubmit.addEventListener("click", function(e)
          {
            e.preventDefault();
            var item = document.updateForm.updateItem.value;
            var newObj = {"item":item};
            checkAndRemove();
            // id++;
            console.log(id);
            verbData("PUT", "/send/"+id, undefined, newObj);
          });
        }
      }
    }
  });
}

function verbData(method, url, callback, obj) {
  console.log(method);
  console.log(url);
  console.log(obj);
  // console.log(id);
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	if (obj) {
		xhr.setRequestHeader('Content-Type', 'application/json');
	}

  xhr.onreadystatechange = function() {
		if (xhr.status < 400 && xhr.readyState == 4) {
			console.log(xhr.responseText);
			if (callback)
      {
				callback(JSON.parse(xhr.responseText).data);
			}
      var id = xhr.responseText;
		}
	};

	if (obj) {
    console.log("object");
		xhr.send(JSON.stringify(obj));
		// xhr.send(obj);
	} else {
    console.log("NO object");
		xhr.send(null);
	}
}
