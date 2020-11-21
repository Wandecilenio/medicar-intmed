FROM python:3.6.9

RUN pip install --upgrade pip

ENV PYTHONUNBUFFERED 1
RUN mkdir /medicar
WORKDIR /medicar
ADD requirements.txt /medicar/
RUN pip install -r requirements.txt
ADD . /medicar/