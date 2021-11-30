FROM nikolaik/python-nodejs:python3.9-nodejs16 as build
WORKDIR /usr/local/app/

RUN apt-get -y update && \
    apt-get install -y apt-utils  && \
    apt-get -y clean

RUN npm install -g @angular/cli > /dev/null && \
    npm install --save xml2js && \
    npm i -g pm2

COPY ./ /usr/local/app/

RUN npm install --force
RUN ng build

RUN pip install -r pythonbackend/requirements.txt

# RUN python pythonbackend/WebScraping.py &

EXPOSE 4201
RUN ["chmod", "+x", "entrypoint.sh"]
#ENTRYPOINT npm start
#ENTRYPOINT ["/bin/sh", "-c" , "python pythonbackend/WebScraping.py && npm start"]
ENTRYPOINT ["bash", "entrypoint.sh"]
