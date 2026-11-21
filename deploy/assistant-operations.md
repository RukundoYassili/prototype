# Website AI assistant

The website loads `public/vuga-assistant.js` through `index.html`. The Vite build copies the script and adds its tag to each generated page. `deploy/Caddyfile` routes `/api/vuga-chat` to the assistant service on the Docker bridge. Keep these files together when deploying a new website build.

The current VPS runs `deploy/assistant.py` as `/opt/vuga-ai-chat/server.py`, using `deploy/vuga-ai-chat.service` and the local Ollama model `qwen3:4b-instruct`. To update the service, copy the Python source to that path, reload systemd if the service definition changes, and restart `vuga-ai-chat`. Validate the Caddy configuration before reloading it.

The backend binds only to `172.17.0.1:3017`. The VPS firewall currently permits the Caddy container at `172.17.0.3` to reach that port. Container addresses may change when a container is recreated, so verify the Caddy container address and the firewall rule during a deployment. Keep Ollama bound to loopback.

The assistant handles one request at a time and answers each message independently. It is not a monitored crisis service. The site displays an urgent-help link and asks visitors to avoid submitting private information. Model responses require ongoing review for accuracy and safety. Requests can take tens of seconds on the current CPU-only VPS.
