const PAGE = {
  data: {
    todo: [],
    filter: 1,
    filters: {
      1: '全部',
      2: '进行中',
      3: '已完成'
    },
    toggle: [0, 1]
  },
  init() {
    this.bind();
    this.getTodo();
  },
  bind() {
    $('#todo-input').on('keyup', this.addTodo);
    $('#remove').on('click', this.allRemove);
    this.onEventListener($('#todo-input-icon'), 'click', 'input-icon', this.iconToggle)
    this.onEventListener($('#todo-list'), 'click', 'todo-item-hd', this.toggleTodo);
    this.onEventListener($('#todo-list'), 'click', 'todo-ft-icon', this.removeTodo);
    this.onEventListener($('#todo-filter'), 'click', 'filter-item', this.filterTodo);
    $(window).on('unload', this.saveTodo);
  },
  getTodo() {
    let todo = localStorage.getItem('todo');
    let todoPar = JSON.parse(todo) || [];
    this.data.todo = todoPar;
    this.render();
  },
  saveTodo() {
    let todo = PAGE.data.todo;
    let todoStr = JSON.stringify(todo);
    localStorage.setItem('todo', todoStr);
  },
  onEventListener: function (parentNode, action, childClassName, callback) {
    $(parentNode).on(action, function (e) {
      e.target.className.indexOf(childClassName) >= 0 && callback(e);
    })
  },
  render() {
    let todo = this.data.todo;
    let filter = this.data.filter;
    let filters = this.data.filters;
    let toggle = this.data.toggle;
    todo.forEach((todo, index) => todo.index = index);
    let todoShow;
    switch (filter) {
      case 2:
        todoShow = todo.filter(todo => !todo.completed);
        break;
      case 3:
        todoShow = todo.filter(todo => todo.completed);
        break;
      default:
        todoShow = todo;
        break;
    }
    let todoElement = todoShow.map(todo => {
      return `
        <li class="todo-item ${todo.completed ? 'active' : ''}" data-index="${todo.index}">
          <div class="todo-item-hd"></div>
          <div class="todo-item-bd">${todo.title}</div>
          <div class="todo-item-ft">
            <img class="todo-ft-icon" src="./极客todo.images/delete.png">
          </div>
        </li>
      `
    }).join('');
    let filterElement = Object.keys(filters).map(key => {
      return `
        <span class="filter-item ${filter == key ? 'active' : ''}" data-id="${key}">${filters[key]}</span>
      `
    }).join('')
    $('#todo-input-icon').html(`<img class="input-icon ${toggle[0] ? 'active' : ''}" data-index="${toggle[0]}" src="./极客todo.images/arrow-down.png">`);
    $('#todo-all').html('<span id="all-number">' + todoShow.length + '</span>' + '<span class="all-project"> 项目</span>');
    $('#todo-list').html(todoElement);
    $('#todo-filter').html(filterElement);
  },
  addTodo(e) {
    let todo = PAGE.data.todo;
    let value = this.value.trim();
    if (e.which !== 13 || !value) {
      return;
    }
    todo.unshift({
      title: value,
      completed: false
    })
    this.value = '';
    PAGE.render();
  },
  toggleTodo(e) {
    let todo = PAGE.data.todo;
    let todoItem = e.target.parentNode;
    let index = todoItem.dataset.index;
    todo[index].completed = !todo[index].completed;
    PAGE.render();
  },
  removeTodo(e) {
    let todo = PAGE.data.todo;
    let todoItem = e.target.parentNode;
    let index = todoItem.parentNode.dataset.index;
    todo.splice(index, 1);
    PAGE.render();
  },
  filterTodo(e) {
    let filter = e.target;
    let index = filter.dataset.id;
    PAGE.data.filter = Number(index)
    PAGE.render();
  },
  allRemove() {
    let todo = PAGE.data.todo;
    let j = 0;
    for (; j <= todo.length - 1; j++) {
      if (todo[j].completed == true) {
        todo.splice(j, 1);
        j = j - 1;
      } else {
        todo.splice(j, 0)
      }
    }
    PAGE.render();
  },
  iconToggle(e) {
    let toggle = PAGE.data.toggle;
    let x = e.target;
    let index = x.dataset.index;
    if (index == 0) {
      $('#todo-list').css({
        height:'0px',
        transition:'height 1s ease'
      })
    } else {
      $('#todo-list').css({
        height:'213px',
        transition:'height 1s ease'
      })
    }
    let a = toggle[0];
    toggle[0] = toggle[1];
    toggle[1] = a;
    PAGE.render();
  }
}
PAGE.init();


















