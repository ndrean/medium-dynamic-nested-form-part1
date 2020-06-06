function removeField() {
  document.body.addEventListener("click", (e) => {
    if (e.target.nodeName === "A") {
      document
        .getElementById(e.target.id)
        .parentNode.parentNode.parentNode.remove();
      // since we wrapped into several bootstrap divs
    }
  });
}

export { removeField };
