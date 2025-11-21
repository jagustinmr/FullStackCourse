```mermaid
sequenceDiagram
    participant user
    participant browser
    participant server

    Note right of user: The user writes a new note like "hello test"<br>and clicks the "Save" button

    user->>browser: Click on Save

    Note right of browser: The browser prevents the default reload<br>and sends the new note to the server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note<br>Body: { content: "hello test", date: "..." }
    activate server
    server-->>browser: 302 Redirect (Location: /notes)
    deactivate server

    Note right of browser: The browser follows the redirect

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: Updated HTML
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server
