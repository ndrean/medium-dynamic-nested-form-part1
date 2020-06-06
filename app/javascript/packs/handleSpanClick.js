function removeField() {
  document.body.addEventListener("click", (e) => {
    if (
      e.target.nodeName === "A" &&
      e.target.parentNode.parentNode.parentNode.previousElementSibling
      // to prevent from removing every fieldset, we keep the first
    ) {
      document
        .getElementById(e.target.id)
        .parentNode.parentNode.parentNode.remove();
      // since we wrapped into several bootstrap divs
    }
  });
}

export { removeField };
