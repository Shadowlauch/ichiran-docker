# Ichiran Docker 

This is a docker-compose project to setup and run https://github.com/tshatrov/ichiran/

##Setup

1. Create a .env file with POSTGRES_PASSWORD=VALUE (can be anything this will be passed to postgres and the ichiran container)
2. RUN `docker-compose up -d postgres` 
3. RUN `docker-compose up ichiran`

The setup will take a while and the console output might be scuffed, but it should work in the end.

After the setup is done you can CTRL C out of it and start it in the background~~ ~~with

`docker-compose up -d ichiran`

## Access

To get the segmentation you have to do a post request to http://localhost:2050/segmentation with the body

```
{
  "text": "おはようございます！"
}
```

and a Content-Type header with application/json
