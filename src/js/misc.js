/**
 * @file Misc
 * @description Various file links and patch I was to lazy to do in mkdocs
 */

//patch a href attributes
const header_links = document.querySelectorAll('a[href*="#"]');
if (header_links) {
  for (var i = 0; i < header_links.length; i++) {
    const header = header_links[i].getAttribute("href").replace("^.*#", "");
    //replace " " with "-"
    let header_fix = header.replace(/\s/g, "-");
    //replace any accent with the corresponding letter
    header_fix = header.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    header_links[i].setAttribute(
      "href",
      header_links[i].getAttribute("href").replace(header, header_fix)
    );
  }
}
/**
 *
 * @param {string} alt
 * @param {number} originalWidth
 * @param {number} originalHeight
 * @returns {width: number, height: number}
 */
function getHeightWidth(alt, originalWidth, originalHeight) {
  const widthReg = new RegExp("\\d+");
  if (alt.match(/\d+x\d+/i)) {
    let width = parseInt(alt.split("x")[0]);
    width = width > 0 ? width : originalWidth
    let height = parseInt(alt.split("x")[1]);
    height = height > 0 ? height : originalHeight
    return {width, height};
  } else if (alt.match(/\d+/i)) {
    const width = parseInt(alt.match(widthReg)[0]);
    return {width, height: originalHeight];
  } 
  return {width: originalWidth, height: originalHeight};
}

for (const i of document.querySelectorAll("img")) {
  const alt = i.alt;
  const resize = /^\d+(x\d+)?|\|\d+(x\d+)/gi
  if (alt.match(resize) && alt != i.title) {
    const {width, height} = getHeightWidth(part, i.width, i.height);
    i.width = width;
    i.height = height;
    i.alt = alt.replace(resize, "");
  }
}

//remove ^id from contents ;
// Only work in the form of "content ^id" (and ^id must end the lines)
const article = document.querySelectorAll(
  "article.md-content__inner.md-typeset > *:not(.highlight)"
);
const embed_id_regex = /\^\w+\s*$/gi;
for (const element of article) {
  const embed_id = element.innerText.match(embed_id_regex);
  if (embed_id) {
    element.innerHTML = element.innerText.replace(embed_id, "");
  }
}
document.innerText = article;

const cite = document.querySelectorAll(".citation");
if (cite) {
  for (var i = 0; i < cite.length; i++) {
    const img_cite = cite[i].innerHTML.match(/!?(\[{2}|\[).*(\]{2}|\))/gi);
    if (img_cite) {
      for (const element of img_cite) {
        cite[i].innerHTML = cite[i].innerHTML.replace(element, "");
      }
      if (cite[i].innerText.trim().length < 2) {
        cite[i].style.display = "none";
      }
    }
  }
}

window.onload = function () {
  const frameElement = document.querySelector("iframe");
  if (!frameElement) {
    return;
  }
  /** get all file in assets/stylesheets */
  const fileInStylesheets = [];
  const files = document.querySelectorAll("link");
  files.forEach((file) => {
    if (file.href.endsWith(".css")) {
      fileInStylesheets.push(file.href);
    }
  });
  const doc = frameElement.contentDocument || frameElement.contentWindow.document;
  fileInStylesheets.forEach((file) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = file;
    link.type = "text/css";
    doc.head.appendChild(link);
  });
  const theme = document.querySelector("[data-md-color-scheme]");
  /** get slate bg */

  if (theme.getAttribute("data-md-color-scheme") === "default") {
    doc.body.setAttribute("class", "light");
  } else {
    doc.body.setAttribute("class", "dark");
    const bgColor = getComputedStyle(theme).getPropertyValue("--md-default-bg-color");
    doc.body.style.setProperty("--md-default-bg-color", bgColor);
  }
  doc.body.classList.add("graph-view");
};

const paletteSwitcher1 = document.getElementById("__palette_1");
const paletteSwitcher2 = document.getElementById("__palette_2");

const isMermaidPage = document.querySelector(".mermaid");
if (isMermaidPage) {
  paletteSwitcher1.addEventListener("change", () => {
    location.reload();
  });

  paletteSwitcher2.addEventListener("change", () => {
    location.reload();
  });
}
