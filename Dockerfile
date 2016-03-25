FROM debian:jessie
MAINTAINER Andrew E. Bruno <aebruno2@buffalo.edu>
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q python-setuptools python-dev python-openssl python-pip libffi-dev libssl-dev curl build-essential
ADD . /srv/harrier
WORKDIR /srv/harrier

RUN pip install -qr /srv/harrier/requirements.txt
RUN python setup.py install

EXPOSE 5000

ENTRYPOINT ["/usr/local/bin/harrier"]

CMD ["--help"]
