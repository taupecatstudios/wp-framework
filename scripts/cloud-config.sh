#cloud-config
package_upgrade: true
package_reboot_if_required: true
runcmd: 
  - aws ec2 associate-address --instance-id `curl -s http://169.254.169.254/latest/meta-data/instance-id` --allocation-id eipalloc-b4cf06d3 --allow-reassociation && service php7.0-fpm restart && service nginx restart
