const dailyBtn = document.getElementById("daily");
const weeklyBtn = document.getElementById("weekly");
const monthlyBtn = document.getElementById("monthly");
const activities = ["work", "play", "study", "exercise", "social", "selfcare"];
let dataActivity;

const fetchDataActivity = async () => {
  try {
    const response = await fetch("data.json");
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

    const timeframes = activityTitle.timeframes[time]; // obj of current and previous value

    let textCurrent =
      timeframes.current in [0, 1]
        ? `${timeframes.current}hr`
        : `${timeframes.current}hrs`;
    let hoursPrevious = timeframes.previous in [0, 1] ? "hr" : "hrs";

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

dailyBtn.addEventListener("click", (e) => {
  weeklyBtn.removeAttribute("aria-pressed");
  monthlyBtn.removeAttribute("aria-pressed");
  dailyBtn.setAttribute("aria-pressed", "true");
  refreshDashboard();
});

weeklyBtn.addEventListener("click", (e) => {
  dailyBtn.removeAttribute("aria-pressed");
  monthlyBtn.removeAttribute("aria-pressed");
  weeklyBtn.setAttribute("aria-pressed", "true");
  refreshDashboard();
});

monthlyBtn.addEventListener("click", (e) => {
  dailyBtn.removeAttribute("aria-pressed");
  weeklyBtn.removeAttribute("aria-pressed");
  monthlyBtn.setAttribute("aria-pressed", "true");
  refreshDashboard();
});

fetchDataActivity();
