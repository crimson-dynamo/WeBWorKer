console.log("[WeBWorKer] content-webwork.js");

var webworkSetup = async function () {
    var MATH_FONT = {
        "size": "1.21em",
        "family": "KaTeX_Main, Times New Roman, serif"
    };

    var retrieveTextInputs = function () {
        return document.getElementsByClassName("codeshard");
    };

    var retrieveSelectInputs = function () {
        return document.getElementsByClassName("pg-select");
    };

    var applyToInputs = function () {
        console.log("[WeBWorKer] Inserting MathView elements");
        var inputs = retrieveTextInputs();
        for (var i = 0; i < inputs.length; i++) {
            var theInput = inputs[i];
    
            // If MathView is not yet applied, create MathView
            if (!MathView.hasMathView(theInput)) {
                var aMath = theInput.value;
    
                var mathView = MathView.createMathView(i, theInput);
    
                theInput.nextSibling.insertAdjacentElement('afterend', mathView);
                MathView.updateMath(i, aMath);
    
                // Set input attributes
                theInput.setAttribute("autocomplete", "off");
                theInput.setAttribute("autocorrect", "off");
                theInput.setAttribute("autocapitalize", "off");
                theInput.setAttribute("spellcheck", "false");
    
                // Create a resizable container around the input box
                var wrapperDiv = document.createElement("div");
                wrapperDiv.className = "resizable-input-container";
                wrapperDiv.style.position = "relative";
                wrapperDiv.style.display = "inline-block";
                wrapperDiv.style.resize = "horizontal";
                wrapperDiv.style.overflow = "auto";
                wrapperDiv.style.padding = "2px";
                wrapperDiv.style.minWidth = "100px";  // Set minimum width
                wrapperDiv.style.minHeight = "30px"; // Set minimum height
    
                // Insert the input into the wrapper
                theInput.parentNode.insertBefore(wrapperDiv, theInput);
                wrapperDiv.appendChild(theInput);
    
                // Style the input so it fits within the resizable container
                theInput.style.width = "100%";
                theInput.style.height = "30px"; // Fixed height to prevent vertical resizing
                theInput.style.boxSizing = "border-box"; // Ensures padding and borders are included in the width and height
                theInput.style.lineHeight = "30px"; // Ensure text stays vertically centered
                theInput.style.whiteSpace = "nowrap"; // Ensure no text wrapping (single-line input behavior)
            }
        }
        console.log("[WeBWorKer] Rendered");
    };

    var createClearAnswers = async function () {
        console.log("[WeBWorKer] Creating Clear Answers button");

        // Check if the button already exists
        if (document.getElementById("clearAnswersButton")) {
            console.log("[WeBWorKer] Clear Answers button already attached");
            return;
        }

        // Check if the feature is enabled
        var { clearAnswersEnabled } = await chrome.storage.sync.get({ clearAnswersEnabled: true });
        if (!clearAnswersEnabled) return;

        var previewAnswers = document.getElementById("previewAnswers_id");
        if (previewAnswers != null) {
            // Create "Clear Answers" button
            var clearAnswers = document.createElement("input");
            clearAnswers.id = "clearAnswersButton";
            clearAnswers.className = "btn btn-primary mb-1";
            clearAnswers.type = "submit";
            clearAnswers.value = "Clear Answers";
            clearAnswers.style.backgroundColor = "#dd5555";
            clearAnswers.style.backgroundImage = "none";

            clearAnswers.addEventListener("click", function (e) {
                e.preventDefault();
                if (!confirm("Are you sure you want to clear all answer boxes on this page? This cannot be undone.")) {
                    return;
                }

                var textInputs = retrieveTextInputs();
                for (var i = 0; i < textInputs.length; i++) {
                    var theInput = textInputs[i];
                    theInput.value = "";

                    if (MathView.hasMathView(theInput)) {
                        MathView.updateMath(theInput.getAttribute(MathView.MV_ATTR_ATTACHED), "");
                    }
                }

                var selectInputs = retrieveSelectInputs();
                for (var i = 0; i < selectInputs.length; i++) {
                    selectInputs[i].value = 0;
                }
            });

            // Insert the button
            previewAnswers.parentNode.insertBefore(clearAnswers, null);
        }
    };

    var createPiazzaButton = async function () {
        console.log("[WeBWorKer] Creating Piazza button");

        // Check if the feature is enabled
        var { piazzaEnabled } = await chrome.storage.sync.get({ piazzaEnabled: true });
        if (!piazzaEnabled) return;

        var previewAnswers = document.getElementById("previewAnswers_id");
        if (previewAnswers != null) {
            // Create "Piazza Button" button
            var piazzaButton = document.createElement("input");
            piazzaButton.id = "piazzaButton";
            piazzaButton.className = "btn btn-secondary mb-1"; // Adjust the class as needed
            piazzaButton.type = "button";
            piazzaButton.value = "Open Piazza";
            piazzaButton.style.backgroundColor = "#4e739d";
            piazzaButton.style.backgroundImage = "none";

            // Add event listener to copy text from the div with id "problem_body" when clicked
            piazzaButton.addEventListener("click", function () {
                // Get the element with id "problem_body"
                var breadcrumbElement = document.querySelector(".breadcrumb-item.active");

                // Check if the element exists
                if (breadcrumbElement) {
                    // Copy the content to clipboard
                    var textarea = document.createElement("textarea");
                    textarea.value = "q" + breadcrumbElement.textContent;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textarea);

                    // Open Piazza with the copied text
                    window.open("https://piazza.com/", "_blank");
                }
            });

            // Insert the button
            previewAnswers.parentNode.insertBefore(piazzaButton, null);
        }
    };

    var createResourcesButton = async function () {
        console.log("[WeBWorKer] Creating Online Resources button");

        // Check if the feature is enabled
        var { resourcesEnabled } = await chrome.storage.sync.get({ resourcesEnabled: true });
        if (!resourcesEnabled) return;

        var previewAnswers = document.getElementById("previewAnswers_id");
        if (previewAnswers != null) {
            // Create "Google Search Button" button
            var googleSearchButton = document.createElement("input");
            googleSearchButton.id = "googleSearchButton";
            googleSearchButton.className = "btn btn-secondary mb-1"; // Adjust the class as needed
            googleSearchButton.type = "button";
            googleSearchButton.value = "Online Resources";
            googleSearchButton.style.backgroundColor = "#731DD8";
            googleSearchButton.style.backgroundImage = "none";

            // Add event listener to copy text from the div with id "problem_body" when clicked
            googleSearchButton.addEventListener("click", function () {
                // Get the element with id "problem_body"
                var problemBody = document.getElementById("problem_body");

                // Check if the element exists
                if (problemBody) {
                    // Copy the content to clipboard
                    var textarea = document.createElement("textarea");
                    textarea.value = problemBody.textContent;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textarea);

                    // Open Google search with the copied text
                    window.open("https://www.google.com/search?q=" + encodeURIComponent(problemBody.textContent), "_blank");
                }
            });

            // Insert the button
            previewAnswers.parentNode.insertBefore(googleSearchButton, null);
        }
    };

    // Add this function to create the Screenshot button
    
    var createScreenshotButton = async function () {
        console.log("[WeBWorKer] Creating Screenshot button");
    
        // Check if the feature is enabled
        var { screenshotButtonEnabled } = await chrome.storage.sync.get({ screenshotButtonEnabled: true });
        console.log("Screenshot Button Enabled:", screenshotButtonEnabled);
        if (!screenshotButtonEnabled) return;
    
        var previewAnswers = document.getElementById("previewAnswers_id");
        if (!previewAnswers) {
            console.log("[WeBWorKer] 'previewAnswers_id' not found.");
            return;
        }
    
        // Create the "Screenshot" button
        var screenshotButton = document.createElement("input");
        screenshotButton.id = "screenshotButton";
        screenshotButton.className = "btn btn-secondary mb-1";
        screenshotButton.type = "button";
        screenshotButton.value = "Screenshot Question";
        screenshotButton.style.backgroundColor = "#5a9";
        screenshotButton.style.backgroundImage = "none";
    
        // Add event listener to take a screenshot of the question
        screenshotButton.addEventListener("click", function () {
            var questionElement = document.querySelector(".problem-content");
            var breadcrumbElement = document.getElementById("breadcrumb-row");
    
            // Check if the breadcrumb content exists and retrieve the text
            var fileName = "question-screenshot.png"; // Default filename
            if (breadcrumbElement && breadcrumbElement.textContent.trim() !== "") {
                fileName = breadcrumbElement.textContent.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".png";
            }
    
            if (questionElement) {
                html2canvas(questionElement).then(canvas => {
                    var link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = fileName;
                    link.click();
                }).catch(error => {
                    console.error("Screenshot failed:", error);
                });
            } else {
                alert("Question content not found!");
            }
        });
    
        // Insert the button
        console.log("[WeBWorKer] Inserting Screenshot button.");
        previewAnswers.parentNode.insertBefore(screenshotButton, null);
    };
       

    var main = async function () {
        applyToInputs();
        await createClearAnswers();
        await createPiazzaButton();
        await createResourcesButton();
        await createScreenshotButton();
    };

    // Check if the "problem-content" div is available instead of codeshard or pg-select classes
    var problemContent = document.querySelector(".problem-content");

    if (!problemContent) {
        console.log("[WeBWorKer] 'problem-content' not available. Waiting to insert MathView elements...");
        document.addEventListener("DOMContentLoaded", function () {
            console.log("[WeBWorKer] DOM available");
            main();
        });
    } else {
        main();
    }
};

webworkSetup();

let confirmationEnabled = true;

function confirmSubmit() {
  const scoreSummary = document.getElementById('score_summary');
  const hasUnlimited = scoreSummary && scoreSummary.innerText.toLowerCase().includes('unlimited');

  return confirmationEnabled && !hasUnlimited ? confirm("LIMITED ATTEMPTS!! Are you sure you want to submit?") : true;
}

function addConfirmationListener() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (event) => {
      const submitButton = form.querySelector('[name="submitAnswers"]');
      if (submitButton && !confirmSubmit()) {
        event.preventDefault();
      }
    });
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.toggleConfirmation) {
      confirmationEnabled = !confirmationEnabled;
      sendResponse({ confirmationEnabled });
    }
  }
);

addConfirmationListener();

(function() {
    'use strict';

    // Select all elements with the specified class
    var targetElements1 = document.querySelectorAll('.codeshard');

    // Iterate through each element and change its class
    targetElements1.forEach(function(element) {
        element.className = 'codeshard-btn';
    });
})();


(function() {
    'use strict';

    // Select all elements with the specified class
    var targetElements = document.querySelectorAll('.btn.btn-sm.btn-secondary.codeshard-btn');

    // Iterate through each element and change its class
    targetElements.forEach(function(element) {
        element.className = 'input-group d-inline-flex flex-nowrap w-auto mv-container';
        element.style.borderWidth = '0px'; // Set border width to 0px
        element.style.backgroundColor = 'transparent'; // Set background color to transparent
        element.style.transform = 'translateX(2px)'; // Move element to the right by 2 pixels
    });
})();


// Function to add the copyright footer
(function addCopyrightFooter() {
    var footer = document.getElementById("last-modified");
    if (footer) {
        var copyrightDiv = document.createElement("div");
        copyrightDiv.id = "WeBWorKer-copyright";
        copyrightDiv.textContent = "WeBWorKer Made By Daniel Benjamin © 2024";
        
        // Insert the new div before the last-modified element
        footer.parentNode.insertBefore(copyrightDiv, footer);
    };
})();


(function() {
    'use strict';

    // Select the container element where you want to add the duplicate submit button
    var submitButtonsContainer = document.querySelector('.d-flex.submit-buttons-container');

    // Find the existing submit button
    var existingSubmitButton = document.querySelector('[name="submitAnswers"]');

    // Check if both the container and the existing submit button are found
    if (submitButtonsContainer && existingSubmitButton) {
        // Create a new submit button element
        var duplicateSubmitButton = document.createElement("input");
        duplicateSubmitButton.className = "btn btn-primary";
        duplicateSubmitButton.type = "submit";
        duplicateSubmitButton.value = "Submit Answers"; // You can change the button text as needed

        // Add event listener to simulate click on the existing submit button
        duplicateSubmitButton.addEventListener("click", function() {
            existingSubmitButton.click(); // Simulate click on existing submit button
        });

        // Append the button to the container element
        submitButtonsContainer.appendChild(duplicateSubmitButton);
        console.log("[WeBWorKer] Duplicate submit button added.");
    } else {
        console.error("Existing submit button not found or submit buttons container not found!");
    }
})();

// Function to check if any PDFs are already rendered
function arePDFsAlreadyRendered() {
    const renderedPDFs = document.querySelectorAll("iframe[src$='.pdf']");
    return renderedPDFs.length > 0;
}

// Function to embed a PDF viewer when a placeholder image with a PDF source is found
function embedPDFViewerFromImage(imageElement) {
    const pdfUrl = imageElement.src;
    console.log("[WeBWorKer] Found PDF link in image src:", pdfUrl);

    // Create a container for the iframe and the open link
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.marginBottom = "10px"; // Add space below the container if needed

    // Create an iframe to display the PDF
    const iframe = document.createElement("iframe");
    iframe.src = pdfUrl;
    iframe.style.width = "100%";
    iframe.style.height = "600px"; // Adjust height as needed
    iframe.style.border = "none";

    // Create an "Open in New Tab" button below the iframe
    const openButton = document.createElement("a");
    openButton.href = pdfUrl;
    openButton.target = "_blank"; // Opens in a new tab
    openButton.textContent = "Open PDF in New Tab";
    openButton.style.display = "inline-block";
    openButton.style.marginTop = "8px";
    openButton.style.padding = "6px 12px";
    openButton.style.backgroundColor = "#007bff";
    openButton.style.color = "#fff";
    openButton.style.textDecoration = "none";
    openButton.style.borderRadius = "4px";
    openButton.style.fontSize = "14px";
    openButton.style.textAlign = "center";

    // Append the iframe and the button to the container
    container.appendChild(iframe);
    container.appendChild(openButton);

    // Replace the placeholder image with the container (iframe + button)
    imageElement.parentNode.replaceChild(container, imageElement);
    console.log("[WeBWorKer] PDF iframe with 'Open in New Tab' button embedded for:", pdfUrl);
}

// Function to detect and replace PDF placeholders
function detectAndRenderPDFPlaceholders() {
    console.log("[WeBWorKer] Detecting placeholder images with PDF links in src...");
    const placeholderImages = document.querySelectorAll("img.image-view-elt");

    placeholderImages.forEach(imageElement => {
        console.log("[WeBWorKer] Checking image src:", imageElement.src);

        if (imageElement.src.endsWith(".pdf") && imageElement.src.includes("/webwork2_files/tmp/")) {
            console.log("[WeBWorKer] Placeholder with PDF link detected in src:", imageElement.src);
            embedPDFViewerFromImage(imageElement);
        } else {
            console.log("[WeBWorKer] No matching PDF link for this image src.");
        }
    });
}

// Check if any PDFs are already rendered before proceeding
if (!arePDFsAlreadyRendered()) {
    console.log("[WeBWorKer] No rendered PDFs found. Proceeding with placeholder replacement.");

    // Initialize a MutationObserver to watch for new image placeholders
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === "IMG" && node.classList.contains("image-view-elt")) {
                    console.log("[WeBWorKer] New placeholder image detected:", node);

                    if (node.src.endsWith(".pdf") && node.src.includes("/webwork2_files/tmp/")) {
                        console.log("[WeBWorKer] New placeholder with PDF link detected in src:", node.src);
                        embedPDFViewerFromImage(node);
                    } else {
                        console.log("[WeBWorKer] New placeholder image does not match PDF link pattern.");
                    }
                }
            });
        });
    });

    // Observe the document body for changes (new image placeholders)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    console.log("[WeBWorKer] MutationObserver initialized to watch for PDF placeholders.");

    // Initial call to render any PDFs that are already in the DOM
    detectAndRenderPDFPlaceholders();
} else {
    console.log("[WeBWorKer] Rendered PDFs already found on the page. Skipping placeholder replacement.");
}

/*
var createSettingsButton = function () {
    console.log("[WeBWorKer] Creating Settings button");

    // Check if the button already exists
    if (document.getElementById("settingsButton")) {
        console.log("[WeBWorKer] Settings button already attached");
        return;
    }

    var targetElement = document.querySelector(".btn.btn-light.btn-sm.ms-2");
    if (targetElement != null) {
        // Create "Settings" button
        var settingsButton = document.createElement("input");
        settingsButton.id = "settingsButton";
        settingsButton.className = "btn btn-light btn-sm ms-2"; // Adjust the class as needed
        settingsButton.type = "button";
        settingsButton.value = "WeBWorKer Settings";
        settingsButton.style.backgroundColor = "#007bff";
        settingsButton.style.backgroundImage = "none";

        // Add event listener to open extension options page
        settingsButton.addEventListener("click", function () {
            // Manually construct the options page URL and open it
            var optionsUrl = chrome.runtime.getURL('popup.html');
            window.open(optionsUrl);
        });

        // Insert the button before the target element
        targetElement.parentNode.insertBefore(settingsButton, targetElement);
    }
};

createSettingsButton();

*/
