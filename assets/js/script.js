var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// handles action when SUBMIT is completed for the FORM
var taskFormHandler = function () {
	// prevents the page from reloading after clicking a button
	event.preventDefault();
	
	// get information from the forms and check to make sure there's values
	var taskNameInput = document.querySelector("input[name='task-name']").value;
	var taskTypeInput = document.querySelector("select[name='task-type']").value;
	if (!taskNameInput || !taskTypeInput) {
		alert("You need to fill out the task form!");
		return false;
	}
	
	// if the form has already been edited, change that form instead of making a new one
	var isEdit = formEl.hasAttribute("data-task-id");
	if (isEdit) {
		var taskId = formEl.getAttribute("data-task-id");
		completeEditTask(taskNameInput, taskTypeInput, taskId);
		
	// assign values from user input to an object and pass to createTaskEl() to construct and display list, since form has not been made yet
	} else {
		var taskDataObj = {
			name: taskNameInput,
			type: taskTypeInput
		};
		createTaskEl(taskDataObj);
	}
	
	// reset the form using reset which only works for form elements
	formEl.reset();
};

// handles when a BUTTON is clicked in the main PAGE CONTENT (add, delete, move)
var taskButtonHandler = function(event) {
	var targetEl = event.target;
	
	// edit button clicked
	if (targetEl.matches(".edit-btn")) {
		var taskId = targetEl.getAttribute("data-task-id");
		editTask(taskId);
	}
	
	// delete button clicked
	if (event.target.matches(".delete-btn")) {
		var taskId = targetEl.getAttribute("data-task-id");
		deleteTask(taskId);
	}
};

// handles when a change in DROP DOWN for a task is changed
var taskStatusChangeHandler = function (event) {
	console.log(event.target);
};

var createTaskEl = function (taskDataObj) {
	// create list item
	var listItemEl = document.createElement("li");
	listItemEl.className = "task-item";

	// add task id as a custom attribute
	listItemEl.setAttribute("data-task-id", taskIdCounter);

	// create div to hold task info and add to list item
	var taskInfoEl = document.createElement("div");
	taskInfoEl.className = "task-info";
	// add HTML content to div
	taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
	listItemEl.appendChild(taskInfoEl);

	// get buttons and drop down for list and append to list item
	var taskActionsEl = createTaskActions(taskIdCounter);
	listItemEl.appendChild(taskActionsEl);

	// add entire list item to list
	tasksToDoEl.appendChild(listItemEl);

	taskIdCounter++;
};

var createTaskActions = function (taskId) {
	var actionContainerEl = document.createElement("div");
	actionContainerEl.className = "task-actions";

	// create edit button
	var editButtonEl = document.createElement("button");
	editButtonEl.textContent = "Edit";
	editButtonEl.className = "btn edit-btn";
	editButtonEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(editButtonEl);

	// create detele button
	var deleteButtonEl = document.createElement("button");
	deleteButtonEl.textContent = "Delete";
	deleteButtonEl.className = "btn delete-btn";
	deleteButtonEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(deleteButtonEl);

	var statusSelectEl = document.createElement("select");
	var statusChoices = ["To Do", "In Progress", "Completed"];
	for(var i = 0; i < statusChoices.length; i++) {
		var statusOptionEl = document.createElement("option");
		statusOptionEl.textContent = statusChoices[i];
		statusOptionEl.setAttribute("value", statusChoices[i]);

		statusSelectEl.appendChild(statusOptionEl);
	}
	statusSelectEl.className = "select-status";
	statusSelectEl.setAttribute("name", "status-change");
	statusSelectEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(statusSelectEl);

	return actionContainerEl;
};

var deleteTask = function (taskId) {
	// having .task-item right next to [data-task-id] means the property must be on the same element
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	taskSelected.remove();
};

var editTask = function (taskId) {
	formEl.setAttribute("data-task-id", taskId);
	// get task list item element
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	
	// get content from task name and type
	var taskName = taskSelected.querySelector("h3.task-name").textContent;
	var taskType = taskSelected.querySelector("span.task-type").textContent;
	
	document.querySelector("input[name='task-name']").value = taskName;
	document.querySelector("select[name='task-type']").value = taskType;
	document.querySelector("#save-task").textContent = "Save Task";
};

var completeEditTask = function (taskName, taskType, taskId) {
	// find the matching task list item
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId +"']");
	
	// set new values
	taskSelected.querySelector("h3.task-name").textContent = taskName;
	taskSelected.querySelector("span.task-type").textContent = taskType;
	
	alert("Task Updated!");
	formEl.removeAttribute("data-task-id");
	document.querySelector("#save-task").textContent = "Add Task";
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);