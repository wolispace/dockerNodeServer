

:: This command generates a new 2048-bit RSA private key and saves it to a file named key.pem.
"C:\Program Files\Git\usr\bin\openssl.exe" genrsa -out _keys/key.pem 2048

:: Generate a Certificate Signing Request (CSR): The CSR includes information like your organization's name, location, domain name, and your public key. You can create a CSR with openssl
"C:\Program Files\Git\usr\bin\openssl.exe" req -new -key _keys/key.pem -out _keys/csr.pem
:: You'll be prompted to enter your organization's information and a challenge password.

:: Remember the password is in .env

:: Generate a self-signed certificate (cert.pem): If you're creating a certificate for testing purposes or internal use, you can self-sign the CSR
"C:\Program Files\Git\usr\bin\openssl.exe" x509 -req -days 365 -in _keys/csr.pem -signkey _keys/key.pem -out _keys/cert.pem
:: This command creates a certificate that's valid for 365 days by self-signing the CSR with your private key.

:: Get your certificate signed by a CA: If you're creating a certificate for a public website, you should get your certificate signed by a trusted Certificate Authority (CA). You would send them your CSR, and they would return a cert.pem file. The process for this varies depending on the CA3.
:: Certificate Authority's certificate (ca.pem): This is typically provided by the CA when they issue your certificate. If you're self-signing, you can actually use your own cert.pem as the ca.pem file3.

:: a cert.pem can be used instead of a ca.pem for dev sites

:: run `mmc`
:: File / Add remove snap-in / Certificates / Local Computer
:: Trusted Root Certtifiate Authorities / Certificates / All Tasks / Import
:: locate cert.pem


:: trying with PowerShell cmd:
::  New-SelfSignedCertificate -DnsName "127.0.0.1", "localhost" -CertStoreLocation "cert:\LocalMachine\My"
::   PSParentPath: Microsoft.PowerShell.Security\Certificate::LocalMachine\My
::Thumbprint                                Subject
::----------                                -------
::F8C9CD3E50BD4835A03B024908DF4D576F6967F8  CN=127.0.0.1

pause
