# Ichiran Docker 

This is a docker project to setup and run https://github.com/tshatrov/ichiran/

A lot of the docker work was done by https://github.com/getrasa/ichiran-docker

## Setup

1. Build the container via `docker build -t ichiran-docker .`
2. Run container via `docker run -p 3005:80 ichiran-docker` (the number in front of the : is the port on the host machine)


## Access

To get the segmentation you have to do a post request to http://localhost:3005/segmentation with the body

```
{
  "text": "おはようございます！"
}
```

and a Content-Type header with application/json

## 
