# backend-framework

This is a framework upon which business logic and servers will be built

User data:

1. Install apache
   ```
   #!/bin/bash
   yum update -y
   yum install -y httpd
   systemctl start httpd
   systemctl enable httpd
   ```
2. Install Docker
   ```
   sudo yum install docker -y
   sudo service docker start
   sudo chkconfig docker on
   ```
