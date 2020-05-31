const addComment = () => {
  const createCommentButton = document.getElementById("addComment");
  createCommentButton.addEventListener("click", (e) => {
    e.preventDefault();
    const lastId = document.querySelector("#select").lastElementChild.dataset
      .fieldsetId;
    const newId = parseInt(lastId, 10) + 1;
    const changeFieldsetId = document
      .querySelector('[data-fieldset-id="0"]')
      .outerHTML.replace(/0/g, newId);
    document
      .querySelector("#select")
      .insertAdjacentHTML("beforeend", changeFieldsetId);
  });
};
export { addComment };
