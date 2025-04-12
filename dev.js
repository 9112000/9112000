(function() {
    let isDragging = false, offsetX, offsetY, sourcePopup;
    if (!document.querySelector("#prismjs")) {
        let prismScript = document.createElement("script");
        prismScript.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
        prismScript.id = "prismjs";
        document.head.appendChild(prismScript);

        let prismCSS = document.createElement("link");
        prismCSS.rel = "stylesheet";
        prismCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
        document.head.appendChild(prismCSS);
    }
    let btn = document.createElement("img");
    btn.src = "https://github.com/starexxx.png";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.width = "40px";
    btn.style.height = "40px";
    btn.style.cursor = "grab";
    btn.style.borderRadius = "30%";
    btn.style.zIndex = "10000";
    btn.draggable = false;
    function startDrag(e) {
        isDragging = true;
        let event = e.type.includes("touch") ? e.touches[0] : e;
        offsetX = event.clientX - btn.getBoundingClientRect().left;
        offsetY = event.clientY - btn.getBoundingClientRect().top;
        btn.style.transition = "none";
    }

    function dragMove(e) {
        if (!isDragging) return;
        if (e.type === "touchmove") {
            e.preventDefault();
        }

        let event = e.type.includes("touch") ? e.touches[0] : e;
        btn.style.left = `${event.clientX - offsetX}px`;
        btn.style.top = `${event.clientY - offsetY}px`;
    }

    function stopDrag() {
        isDragging = false;
        btn.style.transition = "transform 0.1s linear";
    }

    btn.addEventListener("mousedown", startDrag);
    btn.addEventListener("touchstart", startDrag);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("touchmove", dragMove, { passive: false }); // Make touchmove non-passive
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);
    function toggleSourceCode() {
        if (isDragging) return;
        if (sourcePopup) {
            document.body.removeChild(sourcePopup);
            sourcePopup = null;
            return;
        }

        fetch(document.location.href)
            .then(res => res.text())
            .then(html => {
                sourcePopup = document.createElement("div");
                sourcePopup.style.position = "fixed";
                sourcePopup.style.top = "1px";
                sourcePopup.style.left = "1px";
                sourcePopup.style.width = "calc(100% - 2px)";
                sourcePopup.style.height = "calc(100% - 2px)";
                sourcePopup.style.background = "#000";
                sourcePopup.style.color = "white";
                sourcePopup.style.padding = "1px";
                sourcePopup.style.overflowY = "auto";
                sourcePopup.style.zIndex = "9999";
                sourcePopup.style.display = "flex";
                sourcePopup.style.justifyContent = "center";
                sourcePopup.style.alignItems = "center";
                sourcePopup.style.flexDirection = "column";

                let copyBtn = document.createElement("button");
                copyBtn.innerText = "Copy";
                copyBtn.style.position = "absolute";
                copyBtn.style.top = "5px";
                copyBtn.style.right = "5px";
                copyBtn.style.padding = "5px 10px";
                copyBtn.style.background = "transparent";
                copyBtn.style.color = "white";
                copyBtn.style.border = "none";
                copyBtn.style.cursor = "pointer";
                copyBtn.style.zIndex = "10000";

                copyBtn.addEventListener("click", () => {
                    navigator.clipboard.writeText(html);
                    copyBtn.innerText = "Copied!";
                    setTimeout(() => copyBtn.innerText = "Copy", 2000);
                });

                let pre = document.createElement("pre");
                pre.style.width = "calc(100% - 2px)";
                pre.style.height = "calc(100% - 2px)";
                pre.style.overflow = "auto";
                pre.style.background = "#000";
                pre.style.color = "#00ff00";
                pre.style.padding = "1px";
                pre.style.borderRadius = "1px";
                pre.style.whiteSpace = "pre-wrap";
                pre.style.wordWrap = "break-word";
                pre.style.fontSize = "8px";
                pre.style.lineHeight = "10px";

                let code = document.createElement("code");
                code.className = "language-html";
                code.textContent = html;
                pre.appendChild(code);
                sourcePopup.appendChild(copyBtn);
                sourcePopup.appendChild(pre);
                document.body.appendChild(sourcePopup);

                Prism.highlightAll();
            });
    }

    btn.addEventListener("click", toggleSourceCode);
    btn.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });

    document.body.appendChild(btn);
})();
