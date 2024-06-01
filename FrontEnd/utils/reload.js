const reloadButtons = document.getElementsByClassName("reloadButton");
for (const button of reloadButtons) {
    button.addEventListener("click", function() {
        location.reload();
    });
}

