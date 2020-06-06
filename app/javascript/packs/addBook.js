const addBook = () => {
  const createCommentButton = document.getElementById("addBook");
  createCommentButton.addEventListener("click", () => {
    // e.preventDefault();
    const lastId = document.querySelector("#select").lastElementChild.id;
    const newId = parseInt(lastId, 10) + 1;
    const changeFieldsetId = document
      .querySelector('[id="0"]')
      .outerHTML.replace(/0/g, newId);
    document
      .querySelector("#select")
      .insertAdjacentHTML("beforeend", changeFieldsetId);
  });
};
export { addBook };
