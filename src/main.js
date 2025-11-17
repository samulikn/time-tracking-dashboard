const periodBtns = document.querySelectorAll(".period");
const activities = ["work", "play", "study", "exercise", "social", "selfcare"];
let dataActivity;

const fetchDataActivity = async () => {
  try {
    const response = await fetch("src/data.json");
    dataActivity = await response.json();

    if (dataActivity) refreshDashboard();
  } catch (err) {
    activities.forEach((activity) => {
      updateElement(activity + "-current", "---");
      updateElement(activity + "-previous", "No data");
    });
    console.log(`there was an error to load data ${err}`);
  }
};

function refreshDashboard() {
  const activePeriod = document.querySelector("[aria-pressed='true']");
  const time = activePeriod.id;

  activities.forEach((activity) => {
    const activityTitle = dataActivity.find(
      (i) => i.title.replace(/\s/g, "").toLowerCase() === activity
    );

    if (!activityTitle) {
      updateElement(activity + "-current", "---");
      updateElement(activity + "-previous", "---");
      console.log(`No data found for ${activity}`);
      return;
    }

    const timeframes = activityTitle.timeframes[time]; // obj of current and previous values

    const text = generateText(time, timeframes);

    updateElement(activity + "-current", text.current);
    updateElement(activity + "-previous", text.previous);
  });
}

function generateText(time, timeframes = {}) {
  if (Object.keys(timeframes) === 0)
    return { current: "---", previous: "No data" };

  const currentHrsMeasure = getHoursMeasuring(timeframes.current);
  const textCurrent = `${timeframes.current}${currentHrsMeasure}`;

  const previousHrsMeasure = getHoursMeasuring(timeframes.previous);
  let textPrevious = "";
  switch (time) {
    case "daily":
      textPrevious = `Yesterday - ${timeframes.previous}${previousHrsMeasure}`;
      break;
    case "weekly":
      textPrevious = `Last Week - ${timeframes.previous}${previousHrsMeasure}`;
      break;
    case "monthly":
      textPrevious = `Last Month - ${timeframes.previous}${previousHrsMeasure}`;
      break;
    default:
      textPrevious = "---hr";
  }

  return { current: textCurrent, previous: textPrevious };
}

function getHoursMeasuring(value) {
  const hrs = value === 0 || value === 1 ? "hr" : "hrs";
  return hrs;
}

function updateElement(elementId, text) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.log(`Element with id ${elementId} not found.`);
    return;
  }
  element.textContent = "";
  element.append(text);
}

function handleClickBtn(e) {
  for (const period of periodBtns) {
    period.setAttribute("aria-pressed", "false");
  }

  e.currentTarget.setAttribute("aria-pressed", "true");
  refreshDashboard();
}

periodBtns.forEach((btn) => {
  btn.addEventListener("click", handleClickBtn);
});

fetchDataActivity();
