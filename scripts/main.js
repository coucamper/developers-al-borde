const revealElements = document.querySelectorAll(".reveal");
const floatingTargets = document.querySelectorAll(".hero-panel, .module-visual, .closing-panel, .mission-panel");
const moduleSections = document.querySelectorAll(".learning-module");
const stageTabs = document.querySelectorAll("[data-stage-tab]");
const progressPercent = document.getElementById("progress-percent");
const progressCompleted = document.getElementById("progress-completed");
const progressTotal = document.getElementById("progress-total");
const progressRing = document.querySelector(".progress-ring");
const resetButton = document.getElementById("reset-progress");
const stageName = document.getElementById("stage-name");
const stageDescription = document.getElementById("stage-description");
const themeToggle = document.getElementById("theme-toggle");
const themeToggleLabel = themeToggle?.querySelector(".theme-toggle-label");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const STORAGE_KEY = "developers-al-borde-stage-progress";
const THEME_STORAGE_KEY = "developers-al-borde-theme";

const STAGE_META = {
  landing: {
    name: "Primeros 90 dias",
    description: "Tu mision no es impresionar. Es entender el terreno, aprender el flujo y dejar de romper cosas por precipitarte.",
  },
  traction: {
    name: "Entrega fiable",
    description: "Ya no basta con tener buena actitud: toca investigar mejor, entregar con orden, explicar decisiones y avisar riesgos a tiempo.",
  },
  stewardship: {
    name: "Criterio profesional",
    description: "La madurez alta no es saber mas cosas sueltas. Es reducir incertidumbre, proteger mejor el sistema y ayudar a otros a trabajar con mas claridad.",
  },
};

let currentStage = document.body.dataset.stage || "landing";

const readTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeTheme = (theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

const applyTheme = (theme) => {
  const isLight = theme === "light";
  document.body.dataset.theme = isLight ? "light" : "dark";

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro");
  }

  if (themeToggleLabel) {
    themeToggleLabel.textContent = isLight ? "Tema: claro" : "Tema: oscuro";
  }
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${Math.min(index * 35, 220)}ms`);
  revealObserver.observe(element);
});

const readProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeProgress = (progress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

const getStageInputs = (stage) => [...document.querySelectorAll(`[data-task^="${stage}-"]`)];

const syncTaskVisualState = () => {
  document.querySelectorAll(".task-item").forEach((item) => {
    const input = item.querySelector("input[type='checkbox']");
    item.classList.toggle("is-checked", Boolean(input?.checked));
  });
};

const updateModuleCompletionState = () => {
  moduleSections.forEach((section) => {
    const visibleTaskList = section.querySelector(`.task-list[data-stage-tasks="${currentStage}"]`);
    const inputs = [...(visibleTaskList?.querySelectorAll("input[type='checkbox']") || [])];
    const completed = inputs.filter((input) => input.checked).length;
    const isComplete = inputs.length > 0 && completed === inputs.length;

    section.classList.toggle("is-complete", isComplete);

    const navItem = document.querySelector(`[data-module-ref="${section.dataset.module}"]`);
    if (navItem) {
      navItem.classList.toggle("is-complete", isComplete);
    }
  });
};

const updateProgress = () => {
  const inputs = getStageInputs(currentStage);
  const completed = inputs.filter((input) => input.checked).length;
  const total = inputs.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressPercent.textContent = `${percent}%`;
  progressCompleted.textContent = String(completed);
  progressTotal.textContent = String(total);
  progressRing?.style.setProperty("--progress", `${percent}%`);

  syncTaskVisualState();
  updateModuleCompletionState();
};

const hydrateProgress = () => {
  const saved = readProgress();
  document.querySelectorAll("[data-task]").forEach((input) => {
    input.checked = Boolean(saved[input.dataset.task]);
  });
  updateProgress();
};

const applyStage = (stage) => {
  currentStage = stage;
  document.body.dataset.stage = stage;

  stageTabs.forEach((button) => {
    const isActive = button.dataset.stageTab === stage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll(".stage-pane").forEach((pane) => {
    pane.classList.toggle("is-active", pane.dataset.stagePane === stage);
  });

  document.querySelectorAll(".task-list").forEach((list) => {
    list.classList.toggle("is-active", list.dataset.stageTasks === stage);
  });

  stageName.textContent = STAGE_META[stage].name;
  stageDescription.textContent = STAGE_META[stage].description;
  updateProgress();
};

document.querySelectorAll("[data-task]").forEach((input) => {
  input.addEventListener("change", () => {
    const saved = readProgress();
    saved[input.dataset.task] = input.checked;
    writeProgress(saved);
    updateProgress();
  });
});

stageTabs.forEach((button) => {
  button.addEventListener("click", () => {
    applyStage(button.dataset.stageTab);
  });
});

resetButton?.addEventListener("click", () => {
  const saved = readProgress();
  getStageInputs(currentStage).forEach((input) => {
    input.checked = false;
    delete saved[input.dataset.task];
  });
  writeProgress(saved);
  updateProgress();
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);
  writeTheme(nextTheme);
});

const moduleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const navItem = document.querySelector(`[data-module-ref="${entry.target.dataset.module}"]`);
      if (!navItem) {
        return;
      }

      navItem.classList.toggle("is-active", entry.isIntersecting);
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-10% 0px -45% 0px",
  }
);

moduleSections.forEach((section) => {
  moduleObserver.observe(section);
});

const updateParallax = () => {
  if (prefersReducedMotion.matches) {
    floatingTargets.forEach((element) => {
      element.style.setProperty("--float-offset", "0px");
    });
    return;
  }

  const scrollY = window.scrollY || window.pageYOffset;

  floatingTargets.forEach((element, index) => {
    const speed = (index + 1) * 0.01;
    const offset = Math.sin(scrollY * 0.003 + index) * 4 + scrollY * speed;
    element.style.setProperty("--float-offset", `${offset * 0.1}px`);
  });
};

hydrateProgress();
applyTheme(readTheme() || "dark");
applyStage(currentStage);
updateParallax();
window.addEventListener("scroll", updateParallax, { passive: true });
