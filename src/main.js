const periodBtns = document.querySelectorAll(".period");
const activities = ["work", "play", "study", "exercise", "social", "selfcare"];
let dataActivity;

const fetchDataActivity = async () => {
  try {
    const response = await fetch("src/data.json");
    dataActivity = await response.json();

    if (dataActivity) refreshDashboard();
  } catch (err) {
    console.log(`there was an error to load data ${err}`);
  }
};

function refreshDashboard() {
  const activePeriod = document.querySelector("[aria-pressed='true']");
  const time = activePeriod.id;

  activities.forEach((activity) => {
    const activityTitle = dataActivity.find(
      (i) => i.title.replace(" ", "").toLowerCase() === activity
    );

    if (!activityTitle) {
      console.log(`No data found for ${activity}`);
      return;
    }

    const timeframes = activityTitle.timeframes[time]; // obj of current and previous values

    const textCurrent =
      timeframes.current === 0 || timeframes.current === 1
        ? `${timeframes.current}hr`
        : `${timeframes.current}hrs`;

    const hoursPrevious =
      timeframes.previous === 0 || timeframes.previous === 1 ? "hr" : "hrs";
    let textPrevious = "";
    switch (time) {
      case "daily":
        textPrevious = `Yesterday - ${timeframes.previous}${hoursPrevious}`;
        break;
      case "weekly":
        textPrevious = `Last Week - ${timeframes.previous}${hoursPrevious}`;
        break;
      case "monthly":
        textPrevious = `Last Month - ${timeframes.previous}${hoursPrevious}`;
        break;
      default:
        textPrevious = "---hr";
    }

    UpdateElement(activity + "-current", textCurrent);
    UpdateElement(activity + "-previous", textPrevious);
  });
}

function UpdateElement(elementId, text) {
  const element = document.getElementById(elementId);
  element.textContent = "";
  element.append(text);
}

periodBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    for (const period of periodBtns) {
      period.setAttribute("aria-pressed", "false");
    }
    e.currentTarget.setAttribute("aria-pressed", "true");
    refreshDashboard();
  });
});

fetchDataActivity();
