# newslabs-cdn
General cdn website for generic files, images, common js libraries etc

# Getting content from this repo
The repo has been configured, via a CNAME file, to be served using https://cdn.newslabs.co/ as the entry point (rather than https://bbc.github.io/newslabs-cdn/).

In addition to the CNAME file, an AWS Route53 A record was created, pointing at a pair of IP addresses, as described at https://help.github.com/articles/setting-up-an-apex-domain/ - specifically, refer to the "Configuring A records with your DNS provider" section, as AWS do not support the alternative ALIAS or ANAME record options.
