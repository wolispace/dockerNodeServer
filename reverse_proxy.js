const http = require('http');

const server = http.createServer((req, res) => {
    const proxy = http.request({
        host: req.headers.host,
        port: req.url === '/funSite' ? 8080 : 80,
        path: req.url,
        method: req.method,
        headers: req.headers
    }, (targetRes) => {
        res.writeHead(targetRes.statusCode, targetRes.headers);
        targetRes.pipe(res);
    });

    req.pipe(proxy);
});

server.listen(80);

/*

version: '3'
services:
  app:
    image: node
    networks:
      - cowsvr_network
    expose:
      - 80
  funsite:
    image: node
    networks:
      - cowsvr_network
    expose:
      - 8080
  nginx:
    image: nginx
    ports:
      - 80:80
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - cowsvr_network
networks:
  cowsvr_network:
    driver: bridge

*/


/*
In this example, the server listens on port 80. When a request comes in, it creates a new HTTP request to the target server. The target server is determined by the URL path: if the path is /funSite, it proxies to port 8080; otherwise, it proxies to port 80. The headers and method from the original request are preserved.

The response from the target server is then piped back to the original client. This includes both the status code and headers from the target server’s response.

Please note that this is a basic example and might need to be adjusted based on your specific use case and environment1. For a production setup, you might want to consider using a more robust solution or a Node.js framework that provides more features and better error handling. Also, this example does not handle HTTPS, you would need to use the https module and provide the necessary SSL certificates for that.

Remember to replace http with https and provide the necessary SSL certificates if you want to handle HTTPS requests. Also, this example does not handle error scenarios, so you might want to add error handling code for a robust solution.


*/

/*

key.pem: This is your private key file. It’s used to decrypt data that was encrypted with your public key
12.
cert.pem: This is your SSL certificate. It contains your public key and other information about your website and organization. It’s used by clients to encrypt data that only your private key can decrypt
12.
ca.pem: This is the certificate of the Certificate Authority (CA) that issued your SSL certificate. It’s used by clients to verify that your certificate was issued by a trusted CA12.
Now, let’s go over how you can create these files:

Generate a private key (key.pem): You can use the openssl command-line tool to generate a new private key
3:
openssl genrsa -out key.pem 2048
This command generates a new 2048-bit RSA private key and saves it to a file named key.pem.
Generate a Certificate Signing Request (CSR): The CSR includes information like your organization’s name, location, domain name, and your public key. You can create a CSR with openssl
3:
openssl req -new -key key.pem -out csr.pem
You’ll be prompted to enter your organization’s information and a challenge password.
Generate a self-signed certificate (cert.pem): If you’re creating a certificate for testing purposes or internal use, you can self-sign the CSR
3:
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
This command creates a certificate that’s valid for 365 days by self-signing the CSR with your private key.
Get your certificate signed by a CA: If you’re creating a certificate for a public website, you should get your certificate signed by a trusted Certificate Authority (CA). You would send them your CSR, and they would return a cert.pem file. The process for this varies depending on the CA3.
Certificate Authority’s certificate (ca.pem): This is typically provided by the CA when they issue your certificate. If you’re self-signing, you can actually use your own cert.pem as the ca.pem file3.
Remember to replace the paths in files.readFileSync('keys/key.pem'), files.readFileSync('keys/cert.pem'), and files.readFileSync('keys/ca.pem') with the paths to your actual key, certificate, and CA certificate files32.

Please note that this is a basic example and might need to be adjusted based on your specific use case and environment3. For a production setup, you should handle errors and edge cases appropriately3. Also, consider using a library like Express for more complex use cases1. 
*/