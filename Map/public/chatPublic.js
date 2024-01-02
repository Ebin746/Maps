let ResultData;
let screen = document.querySelector(".text");

let button=document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("click", () => {
    let messageArray = ChatArray // Assuming ChatArray is defined somewhere

    let id;

    if (!Array.isArray(messageArray)) {
      messageArray = [messageArray];
    }

    if (button.id === "1") {
      id = "1";
    } else if (button.id === "2") {
      id = "2";
    } else if (button.id === "3") {
      id = "3";
    } else if (button.id === "4") {
      id = "4";
    }

    // Assuming 'message' is defined somewhere
    fetch("/sendArray", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: messageArray, id: id }), // Include 'id' in the request body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.error) {
          throw new Error(`Server error: ${data.error}`);
        }
        ResultData = data.modifiedData;
        if (ResultData) {
          let info = ResultData.trim();
          screen.innerHTML = `<pre style="overflow: auto; white-space: pre-wrap;">${info}</pre>`;
        }
        console.log(
          "Data sent successfully. Server response:",
          data.modifiedData
        );
      })
      .catch((error) => {
        console.error("Error:", error.message || "Unknown error");
      });
  });
});
