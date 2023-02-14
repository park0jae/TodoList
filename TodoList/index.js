const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-list');
const completeAllBtn = document.querySelector('.complete-all-btn');
const leftItems = document.querySelector('.left-items');
const showAllBtn = document.querySelector('.show-all-btn');
const showCompletedBtn = document.querySelector('.show-completed-btn');
const showActiveBtn = document.querySelector('.show-active-btn');
const clearCompletedBtn =document.querySelector('.clear-completed-btn');

let currentShowType = 'all';
let isAllCompleted = false;


const setIsAllCompleted = (bool) => {
  isAllCompleted = bool;
}

let todos = [];
let id = 0;


function saveTodos() {
  localStorage.setItem("Todos",JSON.stringify(todos));
}

function loadTodos() {
  const loadedTodos = localStorage.getItem("Todos");

  if(loadTodos !== null){
    const parsedTodos = JSON.parse(loadedTodos);
    todos = [...parsedTodos];
    parsedTodos.forEach(todo => { paintTodo(todo);});
  }
}
const setTodos = (newTodos) => {
  todos = newTodos;
}

const getTodos = () => {
  return todos;
}

const getActiveTodos = () => {
  return todos.filter(todo => todo.isCompleted === false);
}

const getCompletedTodos = () => {
  return todos.filter(todo => todo.isCompleted === true);
}

const deleteTodo = (todoId) => {
  const newTodos = getTodos().filter(todo => todo.id !== todoId);
  setTodos(newTodos);
  saveTodos();
  paintTodos();
  setLeftItems();
}

const completeTodo = (todoId) => {
  const newTodos = getTodos().map(todo => todo.id === todoId?
    {...todo, isCompleted: !todo.isCompleted}  : todo
  )
  setTodos(newTodos);
  paintTodos();
  setLeftItems();
}

const updateTodo = (text, todoId) =>{
  const newTodos = getTodos().map(todo => todo.id === todoId ? ({...todo, content:text}) : todo);
  setTodos(newTodos);
  paintTodos();
}

const onDbclickTodo = (e, todoId) => {
  const todoElem = e.target;
  console.log(todoElem);
  const inputText = e.target.innerText;
  const todoItemElem = todoElem.parentNode;
  const inputElem = document.createElement('input');
  inputElem.value = inputText;
  inputElem.classList.add('edit-input');
  inputElem.addEventListener('keypress', (e)=>{
      if(e.key === 'Enter') {
          updateTodo(e.target.value, todoId);
          document.body.removeEventListener('click',onClickOther);
      }
  })

  const onClickOther = (e) => {
    if(e.target !== inputElem)
    {
      todoItemElem.removeChild(inputElem);
      document.body.removeEventListener('click',onClickOther);
    }
  }

  document.body.addEventListener('click',onClickOther);
  todoItemElem.appendChild(inputElem);
}

const paintTodo = (todos) => {
  const todoItem = document.createElement('li');
  todoItem.classList.add('todo-item');

  const checkBox = document.createElement('div');
  checkBox.classList.add('checkbox');
  checkBox.addEventListener('click', () => completeTodo(todos.id));

  const todoElem = document.createElement('div');
  todoElem.classList.add('todo');
  todoElem.addEventListener('dblclick', (event) => onDbclickTodo(event, todos.id))
  todoElem.innerText = todos.content;

  const delBtn = document.createElement('button');
  delBtn.classList.add('delBtn');
  delBtn.addEventListener('click', () => deleteTodo(todos.id));
  delBtn.innerText = 'X';

  if(todos.isCompleted)
  {
    todoItem.classList.add('checked');
    checkBox.innerText = '✔';
  }

  todoItem.appendChild(checkBox);
  todoItem.appendChild(todoElem);
  todoItem.appendChild(delBtn);

  todoList.appendChild(todoItem);

}

const paintTodos = () => {
  todoList.innerHTML = '';

  switch(currentShowType) {
    case 'all' :
      const allTodos = getTodos();
      allTodos.forEach(todo => {paintTodo(todo);});
      break;
    case 'active' :
      const activeTodos = getActiveTodos();
      activeTodos.forEach(todo => {paintTodo(todo);});
      break;
    case 'completed':
      const completedTodos = getCompletedTodos();
      completedTodos.forEach(todo => {paintTodo(todo);});
      break;
    default:
      break;
  }
}

const appendTodos = (todoValue) => {
  const newId = id++;
  const newTodos = [...getTodos(), {id:newId , isCompleted: false, content: todoValue}]
 
  setTodos(newTodos);
  paintTodos();
  setLeftItems();
}

const completeAll= () => {
  completeAllBtn.classList.add('checked');
  const newTodos = getTodos().map(todo => ({...todo , isCompleted:true}));
  setTodos(newTodos);
}

const incompleteAll = () => {
  completeAllBtn.classList.remove('checked');
  const newTodos = getTodos().map(todo => ({...todo , isCompleted:false}));
  setTodos(newTodos);
}

const setLeftItems = () => {
  const leftTodos = getActiveTodos();
  console.log(leftTodos);
  leftItems.innerHTML = `${leftTodos.length} todos left`;
}


const onClickCompleteAll = () => {
  if(!getTodos().length) return ;

  if(isAllCompleted) incompleteAll();
  else completeAll();
  setIsAllCompleted(!isAllCompleted);
  paintTodos();
  setLeftItems();
}  

const onClickShowTodosType = (e) => {
  const currentBtn = e.target;
  const newShowType = currentBtn.dataset.type;

  console.log(newShowType);

  if(currentShowType === newShowType) return ;

  const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
  preBtnElem.classList.remove('selected');

  currentBtn.classList.add('selected');
  
  currentShowType = newShowType;

  paintTodos();
}

function clearCompetedTodos () {
  const newTodos = getActiveTodos();
  setTodos(newTodos);
  paintTodos();
}


const init = () => {
  loadTodos();
  todoInput.addEventListener('keypress',(e)=>{
    if(e.key === 'Enter')
    {
      appendTodos(e.target.value)
      todoInput.value = '';
      saveTodos();
    }
  })

  completeAllBtn.addEventListener('click', onClickCompleteAll);
  
  showAllBtn.addEventListener('click',onClickShowTodosType);
  showActiveBtn.addEventListener('click',onClickShowTodosType);
  showCompletedBtn.addEventListener('click',onClickShowTodosType);
  clearCompletedBtn.addEventListener('click',clearCompetedTodos);


  setLeftItems();

}

init()