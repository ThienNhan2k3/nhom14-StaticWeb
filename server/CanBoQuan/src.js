var form = document.querySelector("#addForm");
var list = document.querySelector("#items");

var deleteBtn = document.querySelectorAll(".delete");
// Add
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let value = document.querySelector("#item").value;

  let li = document.createElement("li");
  li.className = "list-group-item";
  li.appendChild(document.createTextNode(value + " "));
  let deleteBtn = document.createElement("button");
  deleteBtn.appendChild(document.createTextNode("X"));
  deleteBtn.className = "btn btn-danger btn-sm float-right delete";
  li.appendChild(deleteBtn);
  list.appendChild(li);
});

deleteBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    console.log(e.target)
    var item=e.target.parentNode
    list.removeChild(item)
  });
});
