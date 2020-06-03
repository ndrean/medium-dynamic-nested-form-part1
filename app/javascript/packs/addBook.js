const addBook = () => {
  const createCommentButton = document.getElementById("addBook");
  createCommentButton.addEventListener("click", () => {
    // e.preventDefault();
    const lastId = document.querySelector("#select").lastElementChild.dataset
      .fields;
    const newId = parseInt(lastId, 10) + 1;
    const changeFieldsetId = document
      .querySelector('[data-fields="0"]')
      .outerHTML.replace(/0/g, newId);
    document
      .querySelector("#select")
      .insertAdjacentHTML("beforeend", changeFieldsetId);
  });
};
export { addBook };
