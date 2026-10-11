(function () {
  var root = document.documentElement;
  var key = "ei-theme";

  function apply(theme) {
    root.setAttribute("data-theme", theme);
  }

  var stored = null;
  try {
    stored = localStorage.getItem(key);
  } catch (e) {
    stored = null;
  }
  if (stored === "dark" || stored === "light") apply(stored);

  document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try {
        localStorage.setItem(key, next);
      } catch (e) {
        /* ignore */
      }
      button.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  });

  var offer = document.getElementById("offer-form");
  if (offer) {
    var intentInputs = offer.querySelectorAll('input[name="intent"]');
    var amountWrap = document.getElementById("offer-amount-wrap");
    function syncIntent() {
      var selected = offer.querySelector('input[name="intent"]:checked');
      var intent = selected ? selected.value : "buy";
      if (amountWrap) amountWrap.hidden = intent !== "offer";
      intentInputs.forEach(function (input) {
        var label = input.closest("label");
        if (!label) return;
        label.classList.toggle("border-copper", input.checked);
        label.classList.toggle("bg-copper", input.checked);
        label.classList.toggle("text-copper-ink", input.checked);
        label.classList.toggle("border-rule", !input.checked);
      });
    }
    intentInputs.forEach(function (input) {
      input.addEventListener("change", syncIntent);
    });
    syncIntent();

    offer.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(offer);
      var intent = String(data.get("intent") || "buy");
      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var amount = String(data.get("amount") || "").trim();
      var note = String(data.get("note") || "").trim();
      var error = document.getElementById("offer-error");
      var status = document.getElementById("offer-status");
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var message = "";
      if (name.length < 2) message = "Add your name so we know who is writing.";
      else if (!emailOk) message = "Add a real email in case the mail app does not open.";
      else if (intent === "offer" && !amount) message = "Add the amount you want considered.";
      if (message) {
        if (error) {
          error.hidden = false;
          error.textContent = message;
        }
        if (status) status.hidden = true;
        return;
      }
      var subject =
        intent === "buy"
          ? "Buy exoskeletoninjuries.com — $100,000"
          : intent === "offer"
            ? "Offer for exoskeletoninjuries.com — " + amount
            : "Question about exoskeletoninjuries.com";
      var body = [
        "Hello,",
        "",
        intent === "buy"
          ? "I would like to buy exoskeletoninjuries.com for $100,000."
          : intent === "offer"
            ? "I would like to offer " + amount + " for exoskeletoninjuries.com."
            : "I have a question about exoskeletoninjuries.com.",
        "",
        "Name: " + name,
        "Email: " + email,
        "Phone: " + (phone || "—"),
        "Note: " + (note || "—"),
        "",
        "Please confirm next steps.",
      ].join("\n");
      if (error) error.hidden = true;
      if (status) {
        status.hidden = false;
        status.textContent =
          "Your email app should open with this note. If it does not, write sales@desertrich.com directly.";
      }
      window.location.href =
        "mailto:sales@desertrich.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  var exitDialog = document.getElementById("exit-dialog");
  var exitForm = document.getElementById("exit-form");
  if (exitDialog && typeof exitDialog.showModal === "function") {
    var seen = false;
    try {
      seen = sessionStorage.getItem("ei-exit") === "1";
    } catch (e) {
      seen = true;
    }
    function arm() {
      try {
        sessionStorage.setItem("ei-exit", "1");
      } catch (e) {
        /* ignore */
      }
      if (!exitDialog.open) exitDialog.showModal();
    }
    if (!seen && window.matchMedia("(pointer: fine)").matches) {
      function onOut(event) {
        if (event.clientY > 16) return;
        document.removeEventListener("mouseout", onOut);
        arm();
      }
      document.addEventListener("mouseout", onOut);
    }
    document.querySelectorAll("[data-exit-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        exitDialog.close();
      });
    });
  }
  if (exitForm) {
    exitForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(exitForm);
      var email = String(data.get("email") || "").trim();
      var amount = String(data.get("amount") || "").trim();
      var status = document.getElementById("exit-status");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (status) {
          status.hidden = false;
          status.textContent = "Enter an email address.";
        }
        return;
      }
      var body =
        "Hello,\n\nI am still looking at exoskeletoninjuries.com.\n\nEmail: " +
        email +
        "\nNumber in mind: " +
        (amount || "$100,000") +
        "\n\nPlease reply with next steps.";
      if (status) {
        status.hidden = false;
        status.textContent = "Opening your email app.";
      }
      window.location.href =
        "mailto:sales@desertrich.com?subject=" +
        encodeURIComponent("Still considering exoskeletoninjuries.com") +
        "&body=" +
        encodeURIComponent(body);
    });
  }
})();
