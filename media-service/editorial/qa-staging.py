"""Exercise only the disposable loopback-only staging service."""
import json, os, urllib.error, urllib.request

base = 'http://127.0.0.1:13119/api/media'
origin = 'http://127.0.0.1:13119'
password = os.environ['QA_ADMIN_PASSWORD']

def request(path, method='GET', data=None, cookie=None, csrf=None):
    headers = {'Origin': origin}
    if data is not None:
        data = json.dumps(data).encode()
        headers['Content-Type'] = 'application/json'
    if cookie: headers['Cookie'] = cookie
    if csrf: headers['X-CSRF-Token'] = csrf
    req = urllib.request.Request(base + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            raw=response.read(); return response.status, (json.loads(raw) if raw else {}), response.headers
    except urllib.error.HTTPError as error:
        raw=error.read()
        try: body=json.loads(raw) if raw else {}
        except (ValueError, UnicodeDecodeError): body={}
        return error.code, body, error.headers

assert request('/health')[0] == 200
assert request('/editorial/items')[0] == 401
status, session, headers = request('/login','POST',{'username':'qa-admin','password':password})
assert status == 200 and session['user']['role'] == 'admin'
cookie = headers['Set-Cookie'].split(';',1)[0]
csrf = session['csrf']
status, result, _ = request('/editorial/items',cookie=cookie)
assert status == 200 and len(result['items']) == 54 and all(item['imported'] and item['status']=='draft' for item in result['items'])
draft={'type':'article','title':'Private staging item','summary':'Isolated QA','language':'English','topic':'QA'}
assert request('/editorial/items','POST',draft,cookie)[0] == 403
status, result, _ = request('/editorial/items','POST',draft,cookie,csrf)
assert status == 201
item=result['id']
review=f'/editorial/items/{item}/review'
assert request(review,'POST',{'action':'submit','revision':1},cookie,csrf)[0] == 400
update={'title':'Private staging item','summary':'Isolated QA','language':'English','topic':'QA','body':'Private test content','revision':1}
assert request(f'/editorial/items/{item}','PUT',update,cookie,csrf)[0] == 200
assert request(review,'POST',{'action':'submit','revision':2},cookie,csrf)[0] == 200
assert request(review,'POST',{'action':'approve','revision':2},cookie,csrf)[0] == 200
assert request(f'/editorial/items/{item}','PUT',update,cookie,csrf)[0] == 409
assert request('/editorial/public/article/private-staging-item')[0] == 404
assert request('/logout','POST',{},cookie,csrf)[0] == 200
print('Isolated PostgreSQL, account, 54 private imports, CSRF and revision workflow passed.')
