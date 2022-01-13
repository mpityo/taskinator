var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

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
			type: taskTypeInput,
			status: "to-do"
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
	
	// create new array to hold updated list of tasks
	var updatedTaskArr = [];	
};

// handles when a change in DROP DOWN for a task is changed
var taskStatusChangeHandler = function (event) {
	// get the task item's id
	var taskId = event.target.getAttribute("data-task-id");
	// get currently selected option and convert to lower case
	var statusValue = event.target.value.toLowerCase();
	// find the parent task item element based on id
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	
	if (statusValue === "to do") {
		tasksToDoEl.appendChild(taskSelected);
	} else if (statusValue === "in progress") {
		tasksInProgressEl.appendChild(taskSelected);
	} else if (statusValue === "completed") {
		tasksCompletedEl.appendChild(taskSelected);
	}
	
	// update task in the local storage array: tasks[]
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id === parseInt(taskId)) {
			tasks[i].status = statusValue;
		}
	}
	
	saveTasks();
};

var createTaskEl = function (taskDataObj) {
	// create list item and add class name/custom attribute as task id
	var listItemEl = document.createElement("li");
	listItemEl.className = "task-item";
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
	
	// assign the id for the current task to the tasks array, which is used for local storage
	// then increment taskId by one for the next task
	taskDataObj.id = taskIdCounter;
	tasks.push(taskDataObj);
	saveTasks();
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

	// create drop down to select current task status
	var statusSelectEl = document.createElement("select");
	var statusChoices = ["To Do", "In Progress", "Completed"];
	// create options to go into status drop down
	for(var i = 0; i < statusChoices.length; i++) {
		var statusOptionEl = document.createElement("option");
		statusOptionEl.textContent = statusChoices[i];
		statusOptionEl.setAttribute("value", statusChoices[i]);
		statusSelectEl.appendChild(statusOptionEl);
	}
	// append whole drop down (that includes options) to action container element
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
		
	// create new array and loop through current local storage array (tasks[])
	// if the id in the tasks[] does not equal the current taskId, add it to new array
	// then make tasks[] = the new array since that doesn't have the taskId obj anymore
	var updatedTaskArr = [];
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id !== parseInt(taskId)) {
			updatedTaskArr.push(tasks[i]);
		}
	}
	tasks = updatedTaskArr;
	saveTasks();
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
	
	// loop through the local storage array and update name and task type for the change
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id === parseInt(taskId)) {
			tasks[i].name = taskName;
			tasks[i].type = taskType;
		}
	}
	
	saveTasks();
	alert("Task Updated!");
	formEl.removeAttribute("data-task-id");
	document.querySelector("#save-task").textContent = "Add Task";
}

var saveTasks = function () {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);