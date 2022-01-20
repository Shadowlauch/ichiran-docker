FROM daewok/sbcl:latest

ENV QUICKLISP_ADD_TO_INIT_FILE=true

RUN cd /usr/local/bin/ && ./install-quicklisp

RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get update && apt-get install -y \
    nodejs \
    postgresql-client \
    wget
