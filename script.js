"use strict";

// reset contact form after submitting
var form = document.getElementById("my-form");

window.onbeforeunload = () => {
  for (const form of document.getElementsByTagName("form")) {
    form.reset();
  }
};

// function for toggling hamburger dropdown
// function toggleMenu(menu) {
//   menu.classList.toggle("open");
// }

$("#hamburger-icon").click(function () {
  $("#hamburger-icon").toggleClass("open");

  $(".mobile-menu").click(function (e) {
    e.stopPropagation();
  });
});

$(document).click(function (e) {
  const menu = $("#hamburger-icon");
  // if the event target is not the menu and its open
  if (
    !menu.is(e.target) &&
    menu.has(e.target).length === 0 &&
    menu.hasClass("open")
  ) {
    $("#hamburger-icon").toggleClass("open");
    console.log("close");

    // the event target id is the header, the menu stays open
    if (e.target.id === "header") {
      $("#hamburger-icon").toggleClass("open");
    }
  }
});

$(".link").click(function () {
  $("#hamburger-icon").toggleClass("open");
});

// sticky header functionality
window.onscroll = function () {
  toggleSticky();
};

let header = document.getElementById("header");
let sticky = header.offsetTop;

function toggleSticky() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

// console.log(navbar);
// async function handleSubmit(event) {
//   event.preventDefault();
//   var status = document.getElementById("my-form-status");
//   var data = new FormData(event.target);
//   fetch(event.target.action, {
//     method: form.method,
//     body: data,
//     headers: {
//       Accept: "application/json",
//     },
//   })
//     .then((response) => {
//       if (response.ok) {
//         status.innerHTML = "Thanks for your submission!";
//         form.reset();
//       } else {
//         response.json().then((data) => {
//           if (Object.hasOwn(data, "errors")) {
//             status.innerHTML = data["errors"]
//               .map((error) => error["message"])
//               .join(", ");
//           } else {
//             status.innerHTML = "Oops! There was a problem submitting your form";
//           }
//         });
//       }
//     })
//     .catch((error) => {
//       status.innerHTML = "Oops! There was a problem submitting your form";
//     });
// }
// form.addEventListener("submit", handleSubmit);
