# Website AI assistant

The website loads `public/vuga-assistant.js` through `index.html`. The Vite build copies the script and adds its tag to each generated page. `deploy/Caddyfile` routes `/api/vuga-chat` to the assistant service on the Docker bridge. Keep these files together when deploying a new website build.

The current VPS runs `deploy/assistant.py` as `/opt/vuga-ai-chat/server.py`, using `deploy/vuga-ai-chat.service` and the local Ollama model `qwen3:4b-instruct`. To update the service, copy the Python source to that path, reload systemd if the service definition changes, and restart `vuga-ai-chat`. Validate the Caddy configuration before reloading it.

The backend binds only to `172.17.0.1:3017`. The VPS firewall allows TCP access to that port from the `172.17.0.0/16` Docker bridge subnet on `docker0`, so the rule does not depend on a container IP. Other containers on that bridge can also reach this endpoint. If the bridge subnet or interface changes, update the backend binding, proxy target and firewall rule together. Keep Ollama bound to loopback.

The assistant handles one request at a time and answers each message independently. It is not a monitored crisis service. The site displays an urgent-help link and asks visitors to avoid submitting private information. Model responses require ongoing review for accuracy and safety. Requests can take tens of seconds on the current CPU-only VPS.
