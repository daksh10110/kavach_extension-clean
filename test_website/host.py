import http.server
import socketserver

# Specify the port number to listen on
port = 3003

# Create a custom handler to serve the entire directory
handler = http.server.SimpleHTTPRequestHandler

# Start the server
with socketserver.TCPServer(("", port), handler) as httpd:
    print(f"Serving website on http://localhost:{port}")
    httpd.serve_forever()
