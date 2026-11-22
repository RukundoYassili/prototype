(() => {
  const host = document.createElement("div");
  host.id = "vuga-assistant-host";
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML =
    "<style>:host{font-family:Arial,sans-serif;color:#223b32}*{box-sizing:border-box}.launcher{position:fixed;right:22px;bottom:22px;z-index:2147483000;background:#245846;color:white;border:0;border-radius:50px;padding:15px 20px;font-size:15px;font-weight:700;box-shadow:0 8px 28px #142d2540;cursor:pointer}.panel{position:fixed;right:22px;bottom:82px;z-index:2147483000;width:min(380px,calc(100vw - 28px));max-height:min(650px,calc(100dvh - 100px));display:flex;flex-direction:column;background:#fff;border:1px solid #d5e2da;border-radius:18px;box-shadow:0 12px 40px #142d2540;overflow:hidden}.panel[hidden]{display:none}.head{background:#245846;color:white;padding:18px;display:flex;justify-content:space-between;align-items:center}.head strong{font-size:17px}.close{background:none;color:white;border:0;font-size:25px;cursor:pointer}.notice{font-size:12px;line-height:1.45;padding:12px 16px;background:#f5f8f5}.notice a{color:#245846;font-weight:bold}.messages{padding:16px;overflow:auto;min-height:110px;max-height:280px;line-height:1.5;font-size:14px}.msg{padding:10px 12px;margin:0 0 10px;border-radius:12px;white-space:pre-wrap;overflow-wrap:anywhere;background:#edf4ef}.user{background:#e1ece7}.form{display:flex;gap:8px;padding:12px;border-top:1px solid #e1e8e2}.form textarea{resize:none;flex:1;min-width:0;border:1px solid #b5c8ba;border-radius:9px;padding:10px;font:inherit}.form button{background:#245846;color:white;border:0;border-radius:9px;padding:10px 14px;cursor:pointer}.form button:disabled{opacity:.6}.status{font-size:12px;padding:0 12px 8px;color:#52665a}@media(max-width:480px){.panel{right:14px;bottom:78px}.launcher{right:14px;bottom:14px}}@media(max-width:480px){.panel{top:120px;bottom:78px;max-height:none}.notice{overflow-y:auto;flex-shrink:1}.messages{flex:1;min-height:40px}}</style>" +
    '<button class="launcher" aria-expanded="false" aria-controls="vuga-panel">AI assistant</button><section id="vuga-panel" class="panel" hidden aria-label="Vuga Ndakumva AI assistant"><div class="head"><strong>Vuga Ndakumva AI assistant</strong><button class="close" aria-label="Close chat">×</button></div><div class="notice">AI-generated information can be inaccurate. Messages are answered individually and are not monitored by a person. Please avoid sharing private details. For immediate danger, <a href="/urgent-help">find urgent help</a>.</div><div class="messages" aria-live="polite"><p class="msg">Hello. I can help you explore information and support on this website. What would you like to know?</p></div><form class="form"><textarea aria-label="Your message" maxlength="1200" rows="2" placeholder="Type your question" required></textarea><button type="submit">Send</button></form><div class="status" role="status"></div></section>';
  const panel = root.querySelector(".panel"),
    launch = root.querySelector(".launcher"),
    close = root.querySelector(".close"),
    form = root.querySelector("form"),
    input = root.querySelector("textarea"),
    send = form.querySelector("button"),
    messages = root.querySelector(".messages"),
    status = root.querySelector(".status");
  function toggle(open) {
    panel.hidden = !open;
    launch.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
    else launch.focus();
  }
  launch.addEventListener("click", () => toggle(panel.hidden));
  close.addEventListener("click", () => toggle(false));
  function appendReplyText(element, text) {
    // Create links only for the official HTTPS website; preserve all other text
    // as text nodes so model output cannot inject markup or unsafe links.
    const pattern = /https?:\/\/[^\s<>"']+/gi;
    let last = 0;
    for (const match of text.matchAll(pattern)) {
      element.appendChild(document.createTextNode(text.slice(last, match.index)));
      const raw = match[0];
      const clean = raw.replace(/[.,!?;:\)\]\}]+$/, "");
      try {
        const url = new URL(clean);
        if (url.protocol === "https:" && url.hostname === "vugandakumva.digital" && !url.port && !url.username && !url.password) {
          const link = document.createElement("a");
          link.href = url.href;
          link.textContent = clean;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          element.appendChild(link);
        } else {
          element.appendChild(document.createTextNode(clean));
        }
      } catch (_) {
        element.appendChild(document.createTextNode(clean));
      }
      element.appendChild(document.createTextNode(raw.slice(clean.length)));
      last = match.index + raw.length;
    }
    element.appendChild(document.createTextNode(text.slice(last)));
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    const row = document.createElement("p");
    row.className = "msg user";
    row.textContent = message;
    messages.appendChild(row);
    input.value = "";
    send.disabled = true;
    status.textContent = "Thinking. This may take a minute.";
    messages.scrollTop = messages.scrollHeight;
    try {
      const res = await fetch("/api/vuga-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Please try again.");
      const reply = document.createElement("p");
      reply.className = "msg";
      appendReplyText(reply, data.reply);
      messages.appendChild(reply);
      status.textContent = "";
    } catch (err) {
      status.textContent = err.message || "The assistant is unavailable.";
    } finally {
      send.disabled = false;
      messages.scrollTop = messages.scrollHeight;
    }
  });
})();
