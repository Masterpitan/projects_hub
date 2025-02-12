Configuring a Web Server Using Nginx

1.  In order to accomplish this task, a DevOps task, I first installed Ubuntu from my Windows Power Shell. After Ubuntu was installed, I ran the command: 

    sudo apt update

    sudo apt upgrade 

2.  Afterwards, I also installed nginx and ran it.

3.  The next step involved using an editor (vim) to write my html code in the var/html folder. My html code was named “index.html”. I consulted YouTube for the tutorials on how to write basic html code.

4.  The next step now involved restarting my nginx and testing the code with the address http//:localhost which loaded the page with my html code.

Challenges Encountered

As simple as it sounds, I spent days on this task mainly because my Ubuntu refused to update and install nginx. I had to do more research which made me realise that I was using an outdated version of Ubuntu

5.  I installed a new version through the PowerShell and all necessary upgrades were made. However, nginx still refused to start even after installing. I consulted YouTube again but all to no avail. I consulted GPT which made me realise that my laptop does not support the “systemctl” command used in running nginx. So I used “service” command.

6.  After my NGINX was configured and running successfully, it was time to host it on AWS Cloud. Thus, I navigated to my AWS management console, created an ec-2 instance using the t2.micro instance size in order to save costs,. Ubuntu was selected as the OS type while I created a key pair so I could connect using ssh. I also configured the security group to take ssh connection on ssh port 22 from my computer and also http port 80 from anywhere IPV4. This enables only me to access ssh and internet users to access the website respectively.

7.  I then navigated back to my Ubuntu terminal, because I was using it from the WSL, I could not access my files directly, so I had to input the code below:

    cd /mnt/c/Users/Your-Windows-Username/

8.  After accessing the files, I had to change the mode in order to restrict access to the key pair. I also  used the name of the key-pair downloaded and the instance public IP copied to connect using the codes below:

    chmod 400 ~/your-key.pem

    ssh -i ~/your-key.pem ubuntu@your-public-ip

The address of the website was imputed using:

    http://(ec-2 IP Address)

The website was open and functional.


