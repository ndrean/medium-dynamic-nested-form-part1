function removeField() {
  document.body.addEventListener("click", (e) => {
    if (
      e.target.nodeName === "A" &&
      e.target.parentNode.parentNode.parentNode.previousElementSibling
      // to prevent from removing every fieldset, we keep the first
    ) {
      console.log("target", e.target);
      console.log("current", e.currentTarget);
      e.target.parentNode.parentNode.parentNode.remove();
      // since we wrapped into several bootstrap divs
    }
  });
}

export { removeField };
