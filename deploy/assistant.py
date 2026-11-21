import json
import re
import threading
import time
import urllib.request
from collections import defaultdict, deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SYSTEM = """You are the Vuga Ndakumva website information assistant. Respond warmly and concisely in the user's language where possible.

Verified information from the website: The official website is https://vugandakumva.digital. Vuga Ndakumva means 'Speak, I can hear.' It is an independent educational initiative founded in 2025 by David Niyomugabo. It aims to raise awareness, educate communities and make support pathways easier to find, with a focus on gender-based violence, mental health, and alcohol and drugs. The website provides information, not care or emergency response. Booking and professional profiles are in development. Relevant pages on https://vugandakumva.digital are /about, /mental-health, /understand-gbv, /alcohol-and-drugs, /resources, /support, /urgent-help and /contact.

Use these verified facts for questions about Vuga Ndakumva. When giving its website address, use only https://vugandakumva.digital. Do not invent facts, links, fees, contacts, services or opening hours. If you do not know, say so and suggest a relevant page. You are an AI, not a counselor, medical professional, emergency service or confidential human responder. Do not diagnose, prescribe, or tell people to stop treatment. If someone describes immediate danger, abuse, self-harm or suicide, respond compassionately, encourage contacting local emergency services or a trusted person, and direct them to /urgent-help. Do not promise confidentiality or that a person is monitoring this chat. Never provide instructions for harm. Answer in at most 45 words and no more than three sentences."""

# Correct model-generated versions of the organization's domain. This does not
# validate other claims or links in a model response.
def correct_organization_domain(text):
    return re.sub(r'(?i)\b(?:https?://)?(?:www\.)?vuga\s*ndakum(?:va)?\.(?:org|com|net|rw)\b',
                  'https://vugandakumva.digital', text)

lock = threading.Lock()
busy = threading.BoundedSemaphore(1)
requests_by_ip = defaultdict(deque)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def send_json(self, status, obj):
        data = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path != "/api/vuga-chat":
            self.send_json(404, {"error": "Not found"})
            return
        if self.headers.get("Origin") != "https://vugandakumva.digital":
            self.send_json(403, {"error": "Request not allowed"})
            return
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if size < 1 or size > 8192:
                raise ValueError()
            data = json.loads(self.rfile.read(size))
            if not isinstance(data, dict):
                raise ValueError()
            message = data.get("message")
            if not isinstance(message, str) or not message.strip() or len(message) > 1200:
                raise ValueError()
        except (ValueError, json.JSONDecodeError, UnicodeDecodeError):
            self.send_json(400, {"error": "Please enter a message of up to 1,200 characters."})
            return

        ip = self.headers.get("X-Forwarded-For", self.client_address[0]).split(",")[-1].strip()
        now = time.monotonic()
        with lock:
            if len(requests_by_ip) > 10000:
                requests_by_ip.clear()
            requests = requests_by_ip[ip]
            while requests and requests[0] < now - 60:
                requests.popleft()
            if len(requests) >= 5:
                self.send_json(429, {"error": "Please wait a minute before trying again."})
                return
            requests.append(now)

        if not busy.acquire(blocking=False):
            self.send_json(503, {"error": "The assistant is busy. Please try again shortly."})
            return
        try:
            payload = json.dumps({
                "model": "qwen3:4b-instruct",
                "stream": False,
                "keep_alive": "5m",
                "messages": [
                    {"role": "system", "content": SYSTEM},
                    {"role": "user", "content": message.strip()},
                ],
                "options": {"num_ctx": 2048, "num_predict": 160, "temperature": 0.3},
            }).encode()
            request = urllib.request.Request(
                "http://127.0.0.1:11434/api/chat",
                data=payload,
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(request, timeout=180) as response:
                result = json.load(response)
            reply = result.get("message", {}).get("content", "").strip()
            if not reply or result.get("done_reason") == "length":
                raise ValueError("incomplete answer")
            self.send_json(200, {"reply": correct_organization_domain(reply)})
        except Exception as exc:
            print(type(exc).__name__, str(exc), flush=True)
            self.send_json(503, {"error": "The assistant is unavailable. Please try again later."})
        finally:
            busy.release()


if __name__ == "__main__":
    ThreadingHTTPServer(("172.17.0.1", 3017), Handler).serve_forever()
