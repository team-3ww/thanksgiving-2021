$(() => {
  const checkSolved = () => {
    const solution = Cookies.get("intro_solution");
    if (solution) {
      $(".solution").text(solution);
      $(".solved").fadeIn();
    }
  };

  checkSolved();

  const checkAnswer = () => {
    $("#alert").removeClass("correct incorrect").html("");
    const submission = $("#guess-box").val().trim();
    $("#guess-box").val(submission);
    if (!submission) {
      return;
    }
    $("#guess-box").val("");
    const answerified = submission.toUpperCase().replace(/[^A-Z]/g, "");
    if (
      CryptoJS.SHA256(answerified + answerified).toString() ===
      "1012314876e0c2b648b2d46bdb7d45ac4aff94629930a9e874d93afc6fe5675d"
    ) {
      return handleCorrect(submission.toUpperCase());
    }
    handleIncorrect(submission);
  };

  const handleCorrect = (solution) => {
    const answerified = solution.toUpperCase().replace(/[^A-Z]/g, "");
    let message = CryptoJS.AES.decrypt(
      "U2FsdGVkX1+oNILNRuWE0Enf0euLMnVNPpjQ7Ytlx1t7YctjG8GUBtPk9oqTVIsK0+0xY0kL5fwR3htOzNJgqYcVyrOxiv0Tbu6sSWkTwfPIpVeLP4fujCqInUgGidhZnEHkf/KHCloGrRXoco49+rmnnKymQ9BCymEgR2FCjggo+PxXGXRlwloHuDfWwVwOdXyrtatCYwSrX0HncgrVJ/RRd26rsx4VKUEV/H3W03A=",
      answerified
    ).toString(CryptoJS.enc.Utf8);
    message += `<section class='note'><p>
      (any message that appears here, or music that plays is not a puzzle)
    </p></section>`;
    Cookies.set("intro", "SOLVED");
    Cookies.set("intro_solution", solution);
    $("#alert").addClass("correct").html(message).modal();
    checkSolved();
    gtag("event", "intro", {
      result: "CORRECT",
      submission: solution,
    });
    new Audio(
      `../assets/sounds/${CryptoJS.SHA256(
        "intro_" + answerified
      ).toString()}.mp3`
    ).play();
  };

  const handleIncorrect = (submission) => {
    $("#alert").html(`<p>Sorry, not correct</p>`).modal();
    gtag("event", "intro", {
      result: "INCORRECT",
      submission: submission,
    });
  };

  $("#submit").click(checkAnswer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.activeElement.id === "guess-box") {
      checkAnswer();
    }
  });

  for (let i = 0; i < document.getElementsByTagName("input").length - 1; i++) {
    let elem = document.getElementsByTagName("input")[i];
    if (elem.maxLength !== 1) {
      continue;
    }
    elem.oninput = function () {
      if (
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(this.value.toLocaleUpperCase()) ===
        -1
      ) {
        this.value = "";
        return;
      }
      if (this.value.length === 1) {
        try {
          document.getElementsByTagName("input")[i + 1].focus();
        } catch (e) {}
      }
    };
  }
  document.getElementsByTagName("input")[1].focus();
  document.addEventListener("keydown", (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      let activeIndex = -1;
      for (let i = 0; i < document.getElementsByTagName("input").length; i++) {
        if (
          document.getElementsByTagName("input")[i] == document.activeElement
        ) {
          activeIndex = i;
        }
      }
      if (activeIndex > -1 && document.activeElement.maxLength === 1) {
        document.activeElement.value = "";
        try {
          let prevElement =
            document.getElementsByTagName("input")[activeIndex - 1];
          if (prevElement.maxLength === 1) {
            prevElement.focus();
          }
        } catch (e) {}
      }
    }
  });

  $(".toggle-1").click(() => {
    $("td.s input").css("background-color", "#ddd");
    $(".clues span").css("background-color", "#ddd");
  });
  $(".toggle-2").click(() => {
    $("td.s input").css("background-color", "#ddd");
    $("table tr:nth-child(2n) td").fadeIn();
  });
});
