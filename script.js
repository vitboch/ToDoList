// select everything
// #1 select the new-task
const newTask = document.getElementById('new-task');

// #2 select the input-task
const inputTask = document.getElementById('input-task');

// #3 select the task-list
const taskList = document.getElementById('task-list');

// create an array that contains all tasks
let todos = [];

// add an event listener to the form
newTask.addEventListener('submit', function(event) {
  // prevent the page from reloading when submitting the form
  event.preventDefault();
  // call function with input box current value
  addTask(inputTask.value); 
});

// function to add task
function addTask(item) {
  // if item is not empty
  if (item !== '') {
    // make a task object
    // which has id, name, and completed properties
    const task = {
      id: Date.now(),
      name: item,
      completed: false
    };

    // then add it to todos array
    todos.push(task);
    
    // then store it in local storage
    addToLocalStorage(todos);

    // finally clear the input box value
    inputTask.value = '';
  }
}

// function to render given tasks to screen
function renderTasks(todos) {
  // clear everything inside <ul> with id="task-list"
  taskList.innerHTML = '';

  // run through each item inside todos
  todos.forEach(function(item) {
    // check if the item is completed
    const checked = item.completed ? 'checked': null;

    // make a <li> element and fill it
    // <li> </li>
    const li = document.createElement('li');
    // <li class="task"> </li>
    li.setAttribute('class', 'task');
    // <li class="task" data-key="20200708"> </li>
    li.setAttribute('data-key', item.id);

    // if item is completed, then add a class to <li> called 'checked'
    if (item.completed === true) {
      li.classList.add('checked');
    }

    /* <li class="task" data-key="20211223"> 
          <input type="checkbox" class="check">
          <span class="task">Email David</span>
          <button class="delete-btn"></button>
        </li> */
    li.innerHTML = `
      <input type="checkbox" class="check" ${checked}>
      <span class="task">${item.name}</span>
      <button class="delete-btn"></button>
    `;

    // finally add the <li> to the <ul>
    taskList.append(li);
  });

}

// function to add todos to local storage
function addToLocalStorage(todos) {
  // convert the array to string then store it
  localStorage.setItem('todos', JSON.stringify(todos));
  // render them to screen
  renderTasks(todos);
}

// function helps to get everything from local storage
function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  // if reference exists
  if (reference) {
    // converts back to array and store it in todos array
    todos = JSON.parse(reference);
    // render them to screen
    renderTasks(todos);
  }
}

// toggle the value to completed and not completed
function toggle(id) {
  todos.forEach(function(item) {
    // use == not ===
    // because here types are different
    // one is number and other is string
    if (item.id == id) {
      // toggle the value
      item.completed = !item.completed;
    }
  });

  addToLocalStorage(todos);
}

// deletes a task from todos array
// then updates localstorage and renders updated list to screen
function deleteTask(id) {
  // filters out the <li> with the id and updates the todos array
  todos = todos.filter(function(item) {
    // use != not !==
    // because here types are different
    // one is number and other is string
    return item.id != id;
  });

  // update the local storage
  addToLocalStorage(todos);
}

// initially get everything from local storage
getFromLocalStorage();

// after that add event listener <ul>
// because we need to listen for click event in all delete-btn and checkbox
taskList.addEventListener('click', function(event) {
  // check if the event is on checkbox
  if (event.target.type === 'checkbox') {
    // toggle the state
    toggle(event.target.parentElement.getAttribute('data-key'));
  }

  // check if that is a delete button
  if (event.target.classList.contains('delete-btn')) {
    // get id from data-key attribute's value of parent <li> where the delete-btn is present
    deleteTask(event.target.parentElement.getAttribute('data-key'));
  }
});
